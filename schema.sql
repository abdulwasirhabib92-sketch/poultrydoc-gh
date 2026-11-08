-- ============================================================
-- PoultryDoc GH — DATABASE SCHEMA (reconstructed)
-- Reconstructed 2026-11-08 from the live database (column names verified
-- by reading real rows through the public API) and from the client code.
--
-- This file documents what exists. It is written to be re-runnable, but
-- on the live project most of it is already present: run only the parts
-- you need. The moderation layer lives in
-- migrations/2026-11-08_moderation_fix.sql — apply that one on the live
-- project.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Outbreak reports (public read, anonymous append)
-- ------------------------------------------------------------
create table if not exists public.poultry_reports (
    id            uuid primary key default gen_random_uuid(),
    created_at    timestamptz not null default now(),
    region        text not null,
    district      text not null,
    disease_id    text not null,
    disease_name  text not null,
    species       text,
    birds_sick    integer not null default 0,
    birds_dead    integer not null default 0,
    notes         text,
    source        text default 'poultrydoc-app',
    client_ip     text,
    phone_hash    text,                     -- NOTE: client currently sends the RAW phone here
    hidden        boolean not null default false,
    hidden_reason text,
    hidden_at     timestamptz
);

create index if not exists poultry_reports_created_at_idx
    on public.poultry_reports (created_at desc);
create index if not exists poultry_reports_district_idx
    on public.poultry_reports (district);

alter table public.poultry_reports enable row level security;

-- Public may read visible rows only; moderation-hidden rows disappear.
drop policy if exists "public reads visible reports" on public.poultry_reports;
create policy "public reads visible reports"
    on public.poultry_reports for select
    to anon, authenticated
    using (hidden = false);

-- Anonymous append is allowed (the app has no login). Abuse is limited by
-- the phone_daily_limit trigger below, not by identity.
drop policy if exists "anyone can report an outbreak" on public.poultry_reports;
create policy "anyone can report an outbreak"
    on public.poultry_reports for insert
    to anon, authenticated
    with check (true);

-- ------------------------------------------------------------
-- Treatment feedback (the "what worked" engine)
-- ------------------------------------------------------------
create table if not exists public.treatment_feedback (
    id               uuid primary key default gen_random_uuid(),
    created_at       timestamptz not null default now(),
    disease_id       text not null,
    treatment_name   text not null,
    treatment_type   text check (treatment_type in ('chemical', 'natural')),
    outcome          text check (outcome in ('recovered', 'partial', 'no_effect')),
    days_to_improve  integer,
    source           text default 'poultrydoc-app',
    hidden           boolean not null default false
);

create index if not exists treatment_feedback_disease_idx
    on public.treatment_feedback (disease_id);

alter table public.treatment_feedback enable row level security;

drop policy if exists "public reads visible feedback" on public.treatment_feedback;
create policy "public reads visible feedback"
    on public.treatment_feedback for select
    to anon, authenticated
    using (hidden = false);

-- WARNING: currently anyone can insert feedback. That makes the "X% recovered"
-- ranking stuffable. A server-side RPC with a phone gate is the fix.
drop policy if exists "anyone can leave feedback" on public.treatment_feedback;
create policy "anyone can leave feedback"
    on public.treatment_feedback for insert
    to anon, authenticated
    with check (true);

-- ------------------------------------------------------------
-- Report validation trigger (referenced by live error messages)
-- ------------------------------------------------------------
create or replace function public.poultry_report_guard()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
    recent int;
begin
    if new.phone_hash is null or new.phone_hash = '' then
        raise exception 'phone_required';
    end if;

    -- 2 reports per number per day
    select count(*) into recent
      from poultry_reports
     where phone_hash = new.phone_hash
       and created_at > now() - interval '1 day';

    if recent >= 2 then
        raise exception 'phone_daily_limit';
    end if;

    new.birds_sick := greatest(0, least(100000, coalesce(new.birds_sick, 0)));
    new.birds_dead := greatest(0, least(new.birds_sick, coalesce(new.birds_dead, 0)));
    new.notes     := left(coalesce(new.notes, ''), 500);
    return new;
end $$;

drop trigger if exists trg_poultry_report_guard on public.poultry_reports;
create trigger trg_poultry_report_guard
    before insert on public.poultry_reports
    for each row execute function public.poultry_report_guard();

-- ------------------------------------------------------------
-- Moderation (see migrations/2026-11-08_moderation_fix.sql)
-- Tables: moderation_config, moderation_attempts
-- Functions: pdoc_mod_status, pdoc_mod_set_pin, pdoc_mod_check,
--            pdoc_mod_list, pdoc_mod_act, moderate_report
-- ------------------------------------------------------------

-- ------------------------------------------------------------
-- KNOWN GAPS (documented, not yet fixed)
--  1. phone_hash stores the raw number — should be crypt(phone, ...)
--  2. treatment_feedback has no abuse gate
--  3. No appeal/delete path for a farmer's own report
-- ------------------------------------------------------------
