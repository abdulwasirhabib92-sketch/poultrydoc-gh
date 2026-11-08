-- ============================================================
-- PoultryDoc GH — MODERATION FIX
-- Date: 2026-11-08
-- Paste the whole file into Supabase → SQL Editor → Run.
--
-- WHY: the shipped moderation console calls moderation_pin_set(p_pin)
-- and moderation_list(p_pin). Neither function exists in the live
-- database (PostgREST answers PGRST202). Only a zero-argument
-- moderation_pin_set() exists, which answers "false" (no PIN set).
-- Result: no PIN can be created, so no report can ever be hidden or
-- deleted, while anyone can insert reports anonymously.
--
-- This file creates a complete, self-contained moderation layer.
-- Safe to run more than once.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- 1. Storage for the PIN (single row, unreachable directly) ----------
create table if not exists public.moderation_config (
    id          boolean primary key default true,
    pin_hash    text not null,
    created_at  timestamptz not null default now(),
    constraint moderation_config_single_row check (id)
);

alter table public.moderation_config enable row level security;
-- Intentionally NO policies: the table is unreachable from anon/authenticated.
-- All access goes through SECURITY DEFINER functions below.

-- ---------- 2. Failed-attempt throttle ----------
create table if not exists public.moderation_attempts (
    id         bigserial primary key,
    ip         text,
    attempted_at timestamptz not null default now()
);

alter table public.moderation_attempts enable row level security;

-- ---------- 3. Status / setup / check ----------
create or replace function public.pdoc_mod_status()
returns boolean
language sql security definer set search_path = public
as $$
    select exists (select 1 from moderation_config);
$$;

create or replace function public.pdoc_mod_set_pin(p_pin text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
    if p_pin is null or length(p_pin) < 6 then
        raise exception 'pin_too_short';
    end if;
    if exists (select 1 from moderation_config) then
        raise exception 'pin_already_set';
    end if;
    insert into moderation_config (id, pin_hash)
    values (true, crypt(p_pin, gen_salt('bf')));
end $$;

create or replace function public.pdoc_mod_check(p_pin text)
returns boolean
language plpgsql security definer set search_path = public
as $$
declare
    ok        boolean;
    client_ip text;
    fails     int;
begin
    client_ip := coalesce(
        (nullif(current_setting('request.headers', true), '')::json ->> 'x-forwarded-for'),
        'unknown'
    );
    -- strip any proxy chain, keep the first address
    client_ip := split_part(client_ip, ',', 1);

    select count(*) into fails
      from moderation_attempts
     where ip = client_ip
       and attempted_at > now() - interval '1 hour';

    if fails >= 10 then
        raise exception 'too_many_attempts';
    end if;

    select pin_hash = crypt(p_pin, pin_hash) into ok
      from moderation_config limit 1;

    if ok is null then
        raise exception 'pin_not_set';
    end if;

    if ok is not true then
        insert into moderation_attempts (ip) values (client_ip);
        raise exception 'bad_pin';
    end if;

    delete from moderation_attempts where ip = client_ip;
    return true;
end $$;

-- ---------- 4. List reports ----------
create or replace function public.pdoc_mod_list(p_pin text)
returns table (
    id            uuid,
    created_at    timestamptz,
    region        text,
    district      text,
    disease_name  text,
    species       text,
    birds_sick    integer,
    birds_dead    integer,
    notes         text,
    hidden        boolean
)
language plpgsql security definer set search_path = public
as $$
begin
    perform pdoc_mod_check(p_pin);   -- raises bad_pin / too_many_attempts
    return query
        select r.id, r.created_at, r.region, r.district, r.disease_name,
               r.species, r.birds_sick, r.birds_dead, r.notes, r.hidden
          from poultry_reports r
         order by r.created_at desc
         limit 500;
end $$;

-- ---------- 5. Hide / unhide / delete ----------
create or replace function public.pdoc_mod_act(p_pin text, p_id uuid, p_action text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
    perform pdoc_mod_check(p_pin);

    if p_action = 'hide' then
        update poultry_reports
           set hidden = true, hidden_at = now(), hidden_reason = 'moderator'
         where id = p_id;
    elsif p_action = 'unhide' then
        update poultry_reports
           set hidden = false, hidden_at = null, hidden_reason = null
         where id = p_id;
    elsif p_action = 'delete' then
        delete from poultry_reports where id = p_id;
    else
        raise exception 'bad_action';
    end if;
end $$;

-- Keep the previously shipped name working for older clients.
create or replace function public.moderate_report(p_pin text, p_id uuid, p_action text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
    perform pdoc_mod_act(p_pin, p_id, p_action);
end $$;

-- ---------- 6. Grants: anonymous callers may run these, nothing else ----------
revoke all on public.moderation_config   from anon, authenticated;
revoke all on public.moderation_attempts from anon, authenticated;

grant execute on function public.pdoc_mod_status()               to anon, authenticated;
grant execute on function public.pdoc_mod_set_pin(text)          to anon, authenticated;
grant execute on function public.pdoc_mod_check(text)            to anon, authenticated;
grant execute on function public.pdoc_mod_list(text)             to anon, authenticated;
grant execute on function public.pdoc_mod_act(text, uuid, text)  to anon, authenticated;
grant execute on function public.moderate_report(text, uuid, text) to anon, authenticated;

-- ---------- 7. Hidden reports must not be publicly readable ----------
-- Drop every existing SELECT policy on poultry_reports, then add one that
-- hides moderated rows. INSERT access is left untouched.
do $$
declare r record;
begin
    for r in
        select polname from pg_policy
         where polrelid = 'public.poultry_reports'::regclass
           and polcmd = 'r'
    loop
        execute format('drop policy if exists %I on public.poultry_reports', r.polname);
        raise notice 'dropped SELECT policy: %', r.polname;
    end loop;

    -- also drop any UPDATE/DELETE policies: reports are append-only for the public
    for r in
        select polname from pg_policy
         where polrelid = 'public.poultry_reports'::regclass
           and polcmd in ('w', 'd')
    loop
        execute format('drop policy if exists %I on public.poultry_reports', r.polname);
        raise notice 'dropped write policy: %', r.polname;
    end loop;
end $$;

create policy "public reads visible reports"
    on public.poultry_reports
    for select
    to anon, authenticated
    using (hidden = false);

-- ---------- 8. Verify ----------
-- Expected: pdoc_mod_status → false, then open moderate.html and set your PIN.
select
    pdoc_mod_status()                                        as pin_is_set,
    (select count(*) from pg_proc where proname like 'pdoc_mod%') as new_functions,
    (select count(*) from pg_policy
      where polrelid = 'public.poultry_reports'::regclass
        and polcmd = 'r')                                    as select_policies;
