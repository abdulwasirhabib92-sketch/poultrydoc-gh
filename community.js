/* PoultryDoc GH — Community layer (Supabase-backed real-world learning) */
"use strict";
const SB_URL = "https://oterjsjvxrmzbnwscmnh.supabase.co";
const SB_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZXJqc2p2eHJtemJud3NjbW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NjIxMTYsImV4cCI6MjEwNDQzODExNn0.NKDEIa5XxcxwB8QQA26UffLBldZ-_riOwd196kCTox0";

async function sbReq(path, opts = {}) {
  const res = await fetch(SB_URL + "/rest/v1/" + path, {
    ...opts,
    headers: { "apikey": SB_ANON, "Authorization": "Bearer " + SB_ANON, "Content-Type": "application/json", ...(opts.headers || {}) }
  });
  if (!res.ok) throw new Error("Network error (" + res.status + ")");
  const txt = await res.text();
  return txt ? JSON.parse(txt) : null;
}

/* ---------- populate disease dropdown ---------- */
$("#rep-disease").innerHTML = DISEASES.map(d => `<option value="${d.id}">${esc(d.name)}</option>`).join("");

/* ---------- Outbreak Watch (aggregated, last 30 days) ---------- */
async function loadWatch() {
  const el = $("#watch-list");
  try {
    const rows = await sbReq("poultry_reports?select=region,district,disease_id,disease_name,birds_sick,birds_dead,created_at&order=created_at.desc&limit=200");
    const now = Date.now(), fresh = rows.filter(r => now - new Date(r.created_at) < 30 * 864e5);
    if (!fresh.length) { el.innerHTML = `<p class="small dim">No reports yet. Your report will be the first! 🌍</p>`; return; }
    const byDisease = {};
    fresh.forEach(r => {
      const k = r.disease_name;
      (byDisease[k] = byDisease[k] || { n: 0, sick: 0, dead: 0, districts: {}, id: r.disease_id, name: k });
      byDisease[k].n++; byDisease[k].sick += r.birds_sick || 0; byDisease[k].dead += r.birds_dead || 0;
      byDisease[k].districts[r.district] = (byDisease[k].districts[r.district] || 0) + 1;
    });
    const list = Object.values(byDisease).sort((a, b) => (b.dead + b.sick) - (a.dead + a.sick));
    el.innerHTML = list.map(d => {
      const topD = Object.entries(d.districts).sort((a, b) => b[1] - a[1]).slice(0, 2)
        .map(x => esc(x[0])).join(", ");
      return `
      <div class="watch-row">
        <div>
          <div class="w-name">${esc(d.n)} report${d.n > 1 ? "s" : ""} — ${esc(d.name || d.id)}</div>
          <div class="w-sub">📍 ${topD || "—"}${Object.keys(d.districts).length > 2 ? " +" + (Object.keys(d.districts).length - 2) + " more" : ""}</div>
        </div>
        <div class="w-nums">
          <span>🤒 ${d.sick}</span><span>💀 ${d.dead}</span>
        </div>
      </div>`;
    }).join("");
  } catch (e) {
    el.innerHTML = `<p class="small dim">Couldn't load outbreak data. Check your connection.</p>`;
  }
}

/* ---------- Recent reports feed ---------- */
async function loadFeed() {
  const el = $("#feed-list");
  try {
    const rows = await sbReq("poultry_reports?select=*&order=created_at.desc&limit=10");
    if (!rows.length) { el.innerHTML = `<p class="small dim">No reports yet.</p>`; return; }
    el.innerHTML = rows.map(r => `
      <div class="feed-row">
        <div class="f-line"><b>${esc(r.disease_name)}</b> — ${esc(r.species || "birds")}</div>
        <div class="f-sub">📍 ${esc(r.district)}, ${esc(r.region)} · ${new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</div>
        <div class="f-sub">${r.birds_dead ? "💀 " + r.birds_dead + " died · " : ""}🤒 ${r.birds_sick || 0} sick</div>
        ${r.notes ? `<div class="f-note">"${esc(r.notes)}"</div>` : ""}
      </div>`).join("");
  } catch (e) {
    el.innerHTML = `<p class="small dim">Couldn't load the feed.</p>`;
  }
}

/* ---------- Submit report ---------- */
$("#btn-report").addEventListener("click", async () => {
  const st = $("#rep-status");
  const district = $("#rep-district").value.trim();
  if (!district) { st.className = "status err"; st.textContent = "Enter your district or town."; return; }
  const did = $("#rep-disease").value;
  const d = DISEASES.find(x => x.id === did);
  const body = {
    region: $("#rep-region").value,
    district,
    disease_id: did,
    disease_name: d ? d.name : did,
    species: $("#rep-species").value,
    birds_sick: Math.max(0, parseInt($("#rep-sick").value) || 0),
    birds_dead: Math.max(0, parseInt($("#rep-dead").value) || 0),
    notes: $("#rep-notes").value.trim() || null
  };
  st.className = "status waiting"; st.textContent = "Sending…";
  try {
    await sbReq("poultry_reports", { method: "POST", body: JSON.stringify(body) });
    st.className = "status ok";
    st.textContent = "✓ Report sent — thank you! Farmers near you will see this on Outbreak Watch.";
    $("#rep-district").value = ""; $("#rep-notes").value = "";
    $("#rep-sick").value = 0; $("#rep-dead").value = 0;
    loadWatch(); loadFeed();
  } catch (e) {
    st.className = "status err"; st.textContent = "⚠ Couldn't send. Check your connection and try again.";
  }
});

/* Open community tab + preselect disease (used from diagnosis results) */
function openReportTab(diseaseId) {
  $$(".tab").forEach(x => x.classList.remove("active"));
  $$(".tabpane").forEach(x => x.classList.remove("active"));
  $('[data-tab="community"]').classList.add("active");
  $("#tab-community").classList.add("active");
  if (diseaseId) $("#rep-disease").value = diseaseId;
  $("#tab-community").scrollIntoView({ behavior: "smooth" });
  loadWatch(); loadFeed();
}

/* ---------- Treatment feedback (the "learning" engine) ---------- */
async function loadFeedback(diseaseId) {
  const el = $("#fb-summary");
  if (!el) return;
  el.innerHTML = `<p class="small dim">Loading farmer outcomes…</p>`;
  try {
    const rows = await sbReq("treatment_feedback?disease_id=eq." + encodeURIComponent(diseaseId) + "&select=treatment_name,treatment_type,outcome,days_to_improve&limit=300");
    const withData = rows.length;
    const chem = rows.filter(r => r.outcome === "recovered" && r.treatment_type === "chemical").length;
    const byTreat = {};
    rows.forEach(r => {
      (byTreat[r.treatment_name] = byTreat[r.treatment_name] || { rec: 0, part: 0, none: 0, days: [] });
      const b = byTreat[r.treatment_name];
      if (r.outcome === "recovered") b.rec++;
      else if (r.outcome === "partial") b.part++;
      else b.none++;
      if (r.days_to_improve) b.days.push(r.days_to_improve);
    });
    let html = "";
    if (!withData) {
      html = `<p class="small dim">No farmer feedback for this disease yet. If you treat your birds, come back and rate the treatment below — you'll help farmers across Ghana choose what works.</p>`;
    } else {
      const ranked = Object.entries(byTreat).map(([name, b]) => {
        const total = b.rec + b.part + b.none;
        return { name, total, rate: Math.round((b.rec / total) * 100), avgDays: b.days.length ? Math.round(b.days.reduce((a, c) => a + c, 0) / b.days.length) : null };
      }).sort((a, b) => b.rate - a.rate || b.total - a.total);
      html = ranked.slice(0, 5).map(t => `
        <div class="fb-row">
          <div class="fb-name">${esc(t.name)} <span class="dim small">(${t.total} farmer${t.total > 1 ? "s" : ""})</span></div>
          <div class="fb-bar"><i style="width:${t.rate}%"></i></div>
          <div class="small">${t.rate}% recovered${t.avgDays ? ` · ~${t.avgDays} days to improve` : ""}</div>
        </div>`).join("");
    }
    el.innerHTML = html;
  } catch (e) {
    el.innerHTML = `<p class="small dim">Farmer outcome data unavailable offline.</p>`;
  }
}

function buildFbForm(diseaseId) {
  const d = DISEASES.find(x => x.id === diseaseId);
  if (!d) return "";
  const opts = [
    ...d.chemical.map(t => `<option value="${esc(t.name)}">💊 ${esc(t.name)}</option>`),
    ...d.natural.map(t => `<option value="${esc(t.name)}">🌿 ${esc(t.name)}</option>`)
  ].join("");
  return `
    <div class="fb-form" id="fb-form-inner">
      <p class="small" style="margin-top:10px"><b>Which treatment did you use?</b></p>
      <select id="fb-treat" class="field">${opts}</select>
      <p class="small" style="margin-top:10px"><b>Result?</b></p>
      <div class="chiprow" id="fb-outcome">
        <button class="chip" data-v="recovered">✅ Birds recovered</button>
        <button class="chip" data-v="partial">🟡 Partially helped</button>
        <button class="chip" data-v="no_effect">❌ No effect</button>
      </div>
      <label class="field"><span>Days before improvement (optional)</span>
        <input id="fb-days" type="number" min="0" max="60" inputmode="numeric" placeholder="e.g. 3">
      </label>
      <button class="btn primary" id="btn-fb-send">Send my experience</button>
      <div class="status" id="fb-status"></div>
    </div>`;
}

let fbOutcome = null;
document.addEventListener("click", async e => {
  // outcome chips
  const oc = e.target.closest("#fb-outcome .chip");
  if (oc) {
    $$("#fb-outcome .chip").forEach(x => x.classList.remove("active"));
    oc.classList.add("active");
    fbOutcome = oc.dataset.v;
    return;
  }
  // open/close form
  if (e.target.id === "btn-fb-open") {
    const f = $("#fb-form");
    if (f.hidden) { f.innerHTML = buildFbForm($("#fb-form").dataset.disease || ""); f.hidden = false; }
    else f.hidden = true;
    return;
  }
  // send feedback
  if (e.target.id === "btn-fb-send") {
    const st = $("#fb-status");
    if (!fbOutcome) { st.className = "status err"; st.textContent = "Choose a result first."; return; }
    const treatName = ($("#fb-treat").value || "").replace(/^[💊🌿]\s*/, "");
    const type = ($("#fb-treat").selectedOptions[0]?.textContent || "").startsWith("🌿") ? "natural" : "chemical";
    try {
      await sbReq("treatment_feedback", { method: "POST", body: JSON.stringify({
        disease_id: $("#fb-form").dataset.disease,
        treatment_name: treatName,
        treatment_type: type,
        outcome: fbOutcome,
        days_to_improve: parseInt($("#fb-days").value) || null
      })});
      st.className = "status ok";
      st.textContent = "✓ Thank you! Your experience helps farmers across Ghana.";
      setTimeout(() => { $("#fb-form").hidden = true; }, 1500);
      loadFeedback($("#fb-form").dataset.disease);
    } catch (err) {
      st.className = "status err"; st.textContent = "⚠ Couldn't send. Check connection.";
    }
  }
});

/* ---------- Load community data when tab opens ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest(".tab");
  if (t && t.dataset.tab === "community") { loadWatch(); loadFeed(); }
});
