/* PoultryDoc GH — moderation console */
"use strict";

const SB = "https://oterjsjvxrmzbnwscmnh.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZXJqc2p2eHJtemJud3NjbW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NjIxMTYsImV4cCI6MjEwNDQzODExNn0.NKDEIa5XxcxwB8QQA26UffLBldZ-_riOwd196kCTox0";

const $ = (s) => document.querySelector(s);
let PIN = sessionStorage.getItem("pdoc_mod_pin") || "";

async function rpc(fn, body) {
  const res = await fetch(SB + "/rest/v1/rpc/" + fn, {
    method: "POST",
    headers: {
      apikey: ANON,
      Authorization: "Bearer " + ANON,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body || {})
  });
  const txt = await res.text();
  let data = null;
  try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = null; }
  if (!res.ok) {
    const msg = (data && data.message) || "request_failed";
    throw new Error(msg);
  }
  return data;
}

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function say(el, msg, kind) {
  const n = $(el);
  n.className = "status " + (kind || "");
  n.textContent = msg || "";
}

async function boot() {
  let isSet = false;
  try { isSet = await rpc("pdoc_mod_status"); } catch (e) { isSet = false; }

  if (!isSet) {
    $("#setup-card").hidden = false;
    $("#login-card").hidden = true;
  } else if (!PIN) {
    $("#setup-card").hidden = true;
    $("#login-card").hidden = false;
  } else {
    $("#setup-card").hidden = true;
    $("#login-card").hidden = true;
    loadList();
  }
}

$("#btn-set-pin").addEventListener("click", async () => {
  const a = $("#new-pin").value, b = $("#new-pin2").value;
  if (a.length < 6) return say("#setup-status", "PIN must be at least 6 characters.", "err");
  if (a !== b) return say("#setup-status", "The two PINs do not match.", "err");
  try {
    await rpc("pdoc_mod_set_pin", { p_pin: a });
    PIN = a;
    sessionStorage.setItem("pdoc_mod_pin", PIN);
    say("#setup-status", "PIN saved.", "ok");
    $("#setup-card").hidden = true;
    $("#login-card").hidden = true;
    loadList();
  } catch (e) {
    const m = String(e.message);
    const msg = m === "pin_already_set" ? "A PIN is already set. Use the login form."
              : m === "pin_too_short" ? "PIN must be at least 6 characters."
              : "Could not save PIN: " + m;
    say("#setup-status", msg, "err");
    if (m === "pin_already_set") { $("#setup-card").hidden = true; $("#login-card").hidden = false; }
  }
});

$("#btn-login").addEventListener("click", async () => {
  const p = $("#pin").value;
  if (!p) return say("#login-status", "Enter your PIN.", "err");
  try {
    await rpc("pdoc_mod_check", { p_pin: p });
    PIN = p;
    sessionStorage.setItem("pdoc_mod_pin", PIN);
    $("#login-card").hidden = true;
    say("#login-status", "", "");
    loadList();
  } catch (e) {
    const m = String(e.message);
    if (m === "bad_pin") say("#login-status", "Wrong PIN.", "err");
    else if (m === "too_many_attempts") say("#login-status", "Too many attempts. Try again in an hour.", "err");
    else if (m === "pin_not_set") { $("#login-card").hidden = true; $("#setup-card").hidden = false; }
    else say("#login-status", "Error: " + m, "err");
  }
});

$("#btn-refresh").addEventListener("click", loadList);

async function loadList() {
  if (!PIN) return;
  $("#panel").hidden = false;
  say("#panel-status", "Loading…", "waiting");
  try {
    const rows = await rpc("pdoc_mod_list", { p_pin: PIN });
    render(rows);
    say("#panel-status", rows.length + " report(s).", "ok");
  } catch (e) {
    const m = String(e.message);
    if (m === "bad_pin" || m === "too_many_attempts") {
      sessionStorage.removeItem("pdoc_mod_pin");
      $("#panel").hidden = true; $("#login-card").hidden = false;
      say("#login-status", m === "bad_pin" ? "Session expired. Log in again." : "Too many attempts.", "err");
    } else {
      say("#panel-status", "Error: " + m, "err");
    }
  }
}

function render(rows) {
  if (!rows.length) {
    $("#list").innerHTML = '<div class="card"><p class="small dim">No reports yet.</p></div>';
    return;
  }
  $("#list").innerHTML = rows.map(r => {
    const when = new Date(r.created_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
    return `
    <div class="mod-row ${r.hidden ? "hidden-row" : ""}">
      <b>${esc(r.district)}</b>, ${esc(r.region)}
      ${r.hidden ? '<span class="badge">HIDDEN</span>' : ""}
      <div class="mod-meta">${esc(r.disease_name)} • sick ${r.birds_sick} • dead ${r.birds_dead} • ${esc(when)}</div>
      ${r.notes ? `<div class="small dim">"${esc(r.notes)}"</div>` : ""}
      <div class="mod-actions">
        <button class="btn small" data-act="${r.hidden ? "unhide" : "hide"}" data-id="${esc(r.id)}">${r.hidden ? "↩ Unhide" : "🚫 Hide"}</button>
        <button class="btn small danger" data-act="delete" data-id="${esc(r.id)}">🗑 Delete</button>
      </div>
    </div>`;
  }).join("");

  document.querySelectorAll(".mod-actions button").forEach(b => {
    b.addEventListener("click", () => act(b.dataset.act, b.dataset.id, b));
  });
}

async function act(action, id, btn) {
  if (action === "delete" && !confirm("Delete this report permanently?")) return;
  const original = btn.textContent;
  btn.disabled = true; btn.textContent = "…";
  try {
    await rpc("pdoc_mod_act", { p_pin: PIN, p_id: id, p_action: action });
    await loadList();
  } catch (e) {
    say("#panel-status", "Action failed: " + e.message, "err");
    btn.disabled = false; btn.textContent = original;
  }
}

boot();
