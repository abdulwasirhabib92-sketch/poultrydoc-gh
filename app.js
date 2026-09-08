/* PoultryDoc GH — app logic */
"use strict";
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = t => String(t ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));

/* ---------- Tabs ---------- */
$$(".tab").forEach(t => t.addEventListener("click", () => {
  $$(".tab").forEach(x => x.classList.remove("active"));
  $$(".tabpane").forEach(x => x.classList.remove("active"));
  t.classList.add("active");
  $("#tab-" + t.dataset.tab).classList.add("active");
  window.scrollTo(0, 0);
}));

/* ---------- Symptom groups for checker ---------- */
const SYMPTOM_GROUPS = [
  { key: "droppings", title: "💩 Droppings", opts: [
    "Bloody or red droppings","Whitish / chalky watery droppings","Greenish watery diarrhoea",
    "Yellow foamy droppings","Dark tarry droppings","Brownish watery droppings",
    "Worms visible in droppings" ] },
  { key: "head", title: "👀 Head, eyes & comb", opts: [
    "Swollen face or wattles","Swollen eyes","Watery eyes","Bubbles in the eyes",
    "Warty nodules / scabs on comb or face","Pale comb / wattles","Bluish or dark comb",
    "Nasal discharge","Scaly legs / swollen scales" ] },
  { key: "breathing", title: "🫁 Breathing", opts: [
    "Sneezing / coughing","Rattling sound / gurgling","Gasping / rattling sound",
    "Stretched neck / open beak breathing","Panting / open beak breathing" ] },
  { key: "nerves", title: "🦵 Legs, wings & nerves", opts: [
    "Twisted neck / stargazing","Paralysis of legs or wings","One leg forward, one back",
    "Trembling or circling","Walking on hocks (weak legs)","Lame without visible wound" ] },
  { key: "body", title: "🪶 Body & feathers", opts: [
    "Ruffled feathers","Feather loss","Wounds / sores on skin","Mites or lice visible",
    "Swollen belly (heavy infection)","Swollen crop","Wings held away from body" ] },
  { key: "behavior", title: "🎭 Behaviour & flock", opts: [
    "Sudden deaths","Dull, standing alone","Not eating","Drop in egg laying",
    "Slow growth","Thin shelled or soft eggs","Pecking at the vent" ] }
];

function renderChecker() {
  const wrap = $("#ck-groups");
  wrap.innerHTML = SYMPTOM_GROUPS.map(g => `
    <div class="ck-group">
      <h4>${g.title}</h4>
      <div class="ck-opts">${g.opts.map(o =>
        `<button class="ck-opt" data-s="${esc(o)}">${esc(o)}</button>`).join("")}
      </div>
    </div>`).join("");
  wrap.addEventListener("click", e => {
    const b = e.target.closest(".ck-opt");
    if (!b) return;
    b.classList.toggle("on");
  });
}

/* ---------- Diagnosis engine ---------- */
const AGE_BONUS = { chicks: ["gumboro", "ib", "coccidiosis", "mareks"], growers: ["mareks", "coccidiosis", "worms"], adults: ["cholera", "crd", "newcastle"], mixed: [] };

function runDiagnosis(selected, species, age) {
  const results = [];
  for (const d of DISEASES) {
    if (!d.species.includes(species)) continue;
    let score = 0, total = 0, matched = [];
    for (const [sym, w] of Object.entries(d.match)) {
      total += w;
      if (selected.includes(sym)) { score += w; matched.push(sym); }
    }
    if (!score) continue;
    let pct = Math.round((score / total) * 100);
    // species + key-sign boosts
    if (matched.includes("Twisted neck / stargazing") && d.id === "newcastle") pct = Math.max(pct, 85);
    if (matched.includes("Bloody or red droppings") && d.id === "coccidiosis") pct = Math.max(pct, 85);
    if (matched.includes("Warty nodules / scabs on comb or face") && d.id === "fowlpox") pct = Math.max(pct, 90);
    if (matched.includes("One leg forward, one back") && d.id === "mareks") pct = Math.max(pct, 88);
    if (matched.includes("Whitish / chalky watery droppings") && age === "chicks" && d.id === "gumboro") pct = Math.max(pct, 80);
    if (matched.includes("Mites or lice visible") && d.id === "mites") pct = Math.max(pct, 90);
    if (matched.includes("Panting / open beak breathing") && d.id === "heatstress") pct = Math.max(pct, 85);
    if (AGE_BONUS[age]?.includes(d.id)) pct = Math.min(100, pct + 6);
    // sanity clamp
    pct = Math.min(97, pct);
    results.push({ d, pct, matched });
  }
  return results.sort((a, b) => b.pct - a.pct).slice(0, 3);
}

$("#btn-ck-run").addEventListener("click", () => {
  const selected = $$(".ck-opt.on").map(b => b.dataset.s);
  const species = $("#ck-species").value, age = $("#ck-age").value;
  const out = $("#ck-results");
  if (!selected.length) {
    out.innerHTML = `<div class="card"><div class="alert warn"><b>Tick at least one sign</b> — even one clear sign like "bloody droppings" is enough to start.</div></div>`;
    return;
  }
  const res = runDiagnosis(selected, species, age);
  if (!res.length) {
    out.innerHTML = `<div class="card"><div class="alert warn"><b>No close match found.</b> Try adding more signs, or check the Droppings Guide. If birds are dying, contact your vet officer.</div></div>`;
    return;
  }
  out.innerHTML = `<div class="card"><h3 style="margin-top:0">Most likely matches</h3></div>` + res.map((r, i) => `
    <div class="result-card">
      <div class="result-head">
        <div>
          <div class="r-name">${i + 1}. ${esc(r.d.name)}</div>
          <div class="r-type">${esc(r.d.type)} · matched: ${r.matched.slice(0, 3).map(esc).join(", ")}${r.matched.length > 3 ? "…" : ""}</div>
        </div>
        <div style="text-align:right">
          <div class="small dim">match</div>
          <div style="font-weight:800;font-size:16px">${r.pct}%</div>
        </div>
      </div>
      <div class="confbar" style="margin:0 15px 12px"><i style="width:${r.pct}%"></i></div>
      <div class="result-actions">
        <button class="btn primary" onclick="openDisease('${r.d.id}')">View Treatment</button>
        ${r.d.urgent ? `<a class="btn danger" style="text-decoration:none;text-align:center" href="tel:0299202201">📞</a>` : ""}
        <button class="btn ghost" onclick="openReportTab('${r.d.id}')">🌍</button>
      </div>
    </div>`).join("") + `<p class="small dim" style="text-align:center;padding:0 10px">These are likelihoods, not certainty. If birds die fast, treat the top match and contact the vet office.</p>`;
  out.scrollIntoView({ behavior: "smooth" });
});

$("#btn-ck-clear").addEventListener("click", () => {
  $$(".ck-opt").forEach(b => b.classList.remove("on"));
  $("#ck-results").innerHTML = "";
});

/* ---------- Droppings guide ---------- */
$("#poop-grid").innerHTML = DROPPINGS_GUIDE.map(p => `
  <div class="poop-card" style="--pc:${p.border}">
    ${p.image ? `<img src="${p.image}" alt="${esc(p.title)}" loading="lazy">` : ""}
    <div class="poop-body" style="--pc:${p.border}">
      <h4>${esc(p.title)}</h4>
      <p class="p-mean">${esc(p.meaning)}</p>
      <p class="p-likely">➜ ${esc(p.likely)}</p>
    </div>
  </div>`).join("");

/* ---------- Library ---------- */
let libFilter = "all";
function renderLibrary() {
  const q = ($("#lib-search").value || "").toLowerCase();
  const list = DISEASES.filter(d => {
    if (libFilter !== "all") {
      const cat = d.type.startsWith("Management") ? "Management" : d.type.split(" ")[0];
      if (cat !== libFilter) return false;
    }
    if (!q) return true;
    return (d.name + " " + d.aka + " " + Object.values(d.symptoms).flat().join(" ")).toLowerCase().includes(q);
  });
  $("#lib-list").innerHTML = list.map(d => `
    <div class="lib-item" onclick="openDisease('${d.id}')">
      <div>
        <div class="l-name">${esc(d.name)}</div>
        <div class="l-sub">${esc(d.aka)}</div>
      </div>
      <div style="text-align:right">
        <span class="badge ${d.type.startsWith("Management") ? "mgmt" : d.type.toLowerCase()}">${d.type.split(" ")[0]}</span>
        ${d.reportable ? `<div style="margin-top:4px"><span class="badge rep">report</span></div>` : ""}
      </div>
    </div>`).join("") || `<p class="dim small" style="padding:10px">No match.</p>`;
}
$("#lib-search").addEventListener("input", renderLibrary);
$("#lib-filter").addEventListener("click", e => {
  const c = e.target.closest(".chip");
  if (!c) return;
  $$("#lib-filter .chip").forEach(x => x.classList.remove("active"));
  c.classList.add("active");
  libFilter = c.dataset.v;
  renderLibrary();
});

/* ---------- Prevention ---------- */
$("#sched-list").innerHTML = SCHEDULE.map(s => `
  <div class="sched-row">
    <div class="sched-day">${esc(s.day)}</div>
    <div><div class="sched-act">${esc(s.action)}</div>${s.note ? `<div class="sched-note">${esc(s.note)}</div>` : ""}</div>
  </div>`).join("");
$("#bio-list").innerHTML = BIOSECURITY.map((b, i) => `<div class="bio-row"><span class="n">${i + 1}</span><span>${esc(b)}</span></div>`).join("");

/* ---------- Disease detail sheet ---------- */
function openDisease(id) {
  const d = DISEASES.find(x => x.id === id);
  if (!d) return;
  const signs = Object.values(d.symptoms).flat();
  const chem = d.chemical.map(t => `
    <div class="treat">
      <div class="t-name">💊 ${esc(t.name)}</div>
      ${t.how ? `<div class="t-how">${esc(t.how)}</div>` : ""}
      ${t.note ? `<div class="t-note">${esc(t.note)}</div>` : ""}
    </div>`).join("");
  const nat = d.natural.map(t => `
    <div class="treat nat">
      <div class="t-name">🌿 ${esc(t.name)}</div>
      ${t.prep ? `<div class="t-how"><b>Prepare:</b> ${esc(t.prep)}</div>` : ""}
      <div class="t-how"><b>Give:</b> ${esc(t.how)}</div>
      ${t.evidence ? `<div class="t-evid">Evidence: ${esc(t.evidence)}</div>` : ""}
    </div>`).join("");
  $("#sheet-body").innerHTML = `
    <div class="sh-head">
      <h2>${esc(d.name)}</h2>
      <p class="aka">${esc(d.aka)}</p>
      <div class="sh-tags">
        <span class="badge ${d.type.startsWith("Management") ? "mgmt" : d.type.toLowerCase()}">${esc(d.type.split(" (")[0])}</span>
        <span class="badge sev">severity: ${esc(d.severity)}</span>
        ${d.reportable ? `<span class="badge rep">must report to vet</span>` : ""}
      </div>
      ${d.reportable ? `<div class="alert">🚨 <b>Reportable disease.</b> ${esc(d.vetNote)}</div>` : ""}
    </div>
    <div class="sh-sec"><h4>🩺 Key signs</h4>
      ${signs.map(s => `<span class="sign">${esc(s)}</span>`).join("")}
      <p class="small dim" style="margin-top:8px"><b>Age:</b> ${esc(d.age)} · <b>Birds affected:</b> ${esc(d.species.join(", "))}</p>
    </div>
    <div class="sh-sec"><h4>📷 What to photograph</h4><p>${esc(d.photoHints)}</p>
      <p><b>How it spreads:</b> ${esc(d.spread)}</p>
      <p><b>Field diagnosis:</b> ${esc(d.diagnosis)}</p>
    </div>
    <div class="sh-sec"><h4>💊 Chemical / pharmacy treatment</h4>${chem}</div>
    <div class="sh-sec"><h4>🌿 Natural &amp; traditional treatment</h4>${nat}
      <p class="small dim">Natural remedies are supportive care backed by farmer practice and studies — they work best alongside prevention, and for serious bacterial disease combine with veterinary medicine.</p>
    </div>
    <div class="sh-sec"><h4>🛡️ Prevention</h4>${d.prevention.map(p => `<p style="font-size:14px">• ${esc(p)}</p>`).join("")}</div>
    <div class="sh-sec"><h4>👥 What worked for other farmers</h4>
      <div id="fb-summary"><p class="small dim">Loading farmer outcomes…</p></div>
      <button class="btn ghost full" id="btn-fb-open">🌱 Rate a treatment you used</button>
      <div id="fb-form" data-disease="${d.id}" hidden></div>
    </div>
    ${!d.reportable ? `<div class="sh-sec"><h4>📞 Vet note</h4><p>${esc(d.vetNote)}</p></div>` : ""}
    <p class="small dim" style="margin-top:14px">${esc(DISCLAIMER)}</p>`;
  $("#sheet").hidden = false;
  $("#sheet-backdrop").hidden = false;
  document.body.style.overflow = "hidden";
  if (typeof loadFeedback === "function") loadFeedback(id);
}
function closeSheet() {
  $("#sheet").hidden = true;
  $("#sheet-backdrop").hidden = true;
  document.body.style.overflow = "";
}
$("#sheet-close").addEventListener("click", closeSheet);
$("#sheet-backdrop").addEventListener("click", closeSheet);

/* ---------- Photo scan ---------- */
let photoData = null;
$("#scan-subject").addEventListener("click", e => {
  const c = e.target.closest(".chip");
  if (!c) return;
  $$("#scan-subject .chip").forEach(x => x.classList.remove("active"));
  c.classList.add("active");
});
$("#btn-capture").addEventListener("click", () => $("#photo-input").click());
$("#btn-upload").addEventListener("click", () => $("#photo-input").click());
$("#photo-input").addEventListener("change", e => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = ev => { photoData = ev.target.result; $("#photo-preview").src = photoData; $("#photo-preview-wrap").hidden = false; };
  r.readAsDataURL(f);
});
$("#btn-remove-photo").addEventListener("click", () => {
  photoData = null; $("#photo-input").value = ""; $("#photo-preview-wrap").hidden = true;
});

/* ---------- API key management ---------- */
const KEY = "poultrydoc_gemini_key";
function keyStatus() {
  const has = !!localStorage.getItem(KEY);
  $("#ai-key-status").innerHTML = has
    ? `<span class="status ok">✓ Key saved on this phone — photo AI is enabled.</span>`
    : `<span class="dim">No key saved yet.</span>`;
}
$("#btn-save-key").addEventListener("click", () => {
  const v = $("#ai-key").value.trim();
  if (v) { localStorage.setItem(KEY, v); }
  keyStatus();
});
keyStatus();

/* ---------- Gemini photo analysis ---------- */
$("#btn-analyze").addEventListener("click", async () => {
  // (key handled below + server-side)
  const status = $("#scan-status");
  if (!photoData) {
    status.className = "status err";
    status.textContent = "Add a photo first (Take Photo or Upload Photo).";
    return;
  }
  const subject = ($("#scan-subject .chip.active") || {}).dataset?.v || "the sick bird";
  const species = $("#scan-species").value, age = $("#scan-age").value;
  const notes = $("#scan-notes").value.trim();
  const userKey = localStorage.getItem(KEY);

  const prompt = `You are a poultry health expert for smallholder farmers in Ghana (West Africa).
The farmer photographed: ${subject}.
Bird type: ${species}. Age group: ${age}. ${notes ? "Farmer notes: " + notes + "." : ""}

Analyze the image for signs of poultry disease. Consider diseases common in Ghana: Newcastle, Gumboro (IBD), coccidiosis, fowl pox, fowl typhoid, fowl cholera, CRD/mycoplasmosis, infectious coryza, Marek's disease, infectious bronchitis, worms, mites/lice, necrotic enteritis, gapeworm, heat stress, nutritional deficiency, avian influenza.

Reply with ONLY valid JSON, no markdown fences:
{
 "image_quality": "good|ok|poor" ,
 "visible_signs": ["list the signs you actually SEE in the image"],
 "top_conditions": [
   {"name": "disease name", "confidence": 0-100, "why": "short reason in simple farmer English"}
 ],
 "urgency": "none|low|medium|high|emergency",
 "immediate_advice": "1-2 sentences of what to do right now, simple farmer English",
 "photo_advice": "what better/different photo would help, or empty string"
}`;

  // Plantix-style "scanning" feedback while the AI works
  const btn = $("#btn-analyze");
  btn.disabled = true;
  const origBtn = btn.innerHTML;
  btn.innerHTML = "⏳ Scanning photo…";
  status.className = "status";
  status.textContent = "Analyzing your photo — a few seconds…";
  $("#photo-preview-wrap").classList.add("scanning");
  try {
    // 1) Try the secure server endpoint first (uses server-held key, never exposed)
    let res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: photoData, mime: photoData.startsWith("data:image/jpeg") ? "image/jpeg" : "image/png", prompt, key: userKey || null })
    });
    // 2) If endpoint missing (e.g. opened from file), fall back to direct Gemini call with the user's key
    if (!res.ok && res.status === 404 && userKey) {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(userKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: photoData.startsWith("data:image/jpeg") ? "image/jpeg" : "image/png", data: photoData.split(",")[1] } }] }], generationConfig: { temperature: 0.2 } })
      });
      if (res.ok) {
        const data = await res.json();
        let text = (data.candidates?.[0]?.content?.parts?.[0]?.text || "").replace(/```json|```/g, "").trim();
        renderScanResult(JSON.parse(text));
        return;
      }
    }
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      if (j.needs_key || res.status === 400) throw new Error(j.error || "No API key configured — add a free Gemini key below (aistudio.google.com/apikey), or use Symptom Check which works without a key.");
      throw new Error(j.error || "Scan failed (" + res.status + ")");
    }
    const j = await res.json();
    if (j.error) throw new Error(j.error);
    renderScanResult(j);
  } catch (err) {
    status.className = "status err";
    status.textContent = "⚠ " + (err.message || "Analysis failed. Try again or use Symptom Check.");
  } finally {
    btn.disabled = false;
    btn.innerHTML = origBtn;
    $("#photo-preview-wrap").classList.remove("scanning");
  }
});

function renderScanResult(j) {
  const status = $("#scan-status");
  status.className = "status ok";
  status.textContent = "Analysis complete.";
  const conds = (j.top_conditions || []).slice(0, 3);
  const urgencyColors = { none: "#2e7d32", low: "#2e7d32", medium: "#e0a800", high: "#e65100", emergency: "#c62828" };
  const u = j.urgency || "medium";
  const known = conds.map(c => {
    const d = DISEASES.find(x => x.name.toLowerCase().includes(c.name.toLowerCase().split(" ")[0]));
    return d ? `<button class="btn primary" style="margin:6px 0" onclick="openDisease('${d.id}')">Open treatment: ${esc(c.name)}</button>` : "";
  }).join("");
  $("#ck-results").innerHTML = ""; // keep checker results separate
  const box = document.createElement("div");
  box.className = "card";
  box.innerHTML = `
    <h3 style="margin-top:0">🔎 AI Analysis Result</h3>
    <div class="alert" style="border-color:${urgencyColors[u]};background:${urgencyColors[u]}18">
      <b>Urgency: ${esc(u.toUpperCase())}</b> — ${esc(j.immediate_advice || "")}
    </div>
    <p class="small dim"><b>Signs seen in your photo:</b> ${(j.visible_signs || []).map(esc).join(" · ") || "none obvious"}</p>
    ${conds.map(c => `
      <div class="result-card" style="margin-top:10px">
        <div class="result-head">
          <div>
            <div class="r-name">${esc(c.name)}</div>
            <div class="r-type">${esc(c.why || "")}</div>
          </div>
          <div style="font-weight:800;font-size:16px">${Math.round(c.confidence)}%</div>
        </div>
        <div class="confbar" style="margin:0 15px 12px"><i style="width:${Math.min(97, Math.round(c.confidence))}%"></i></div>
      </div>`).join("")}
    ${known || `<p class="small dim">Open the <b>Diseases</b> tab to read treatment details for any condition above.</p>`}
    <button class="btn ghost full" onclick="openReportTab()">🌍 Report this case — warn farmers near you</button>
    ${j.photo_quality === "poor" || j.photo_advice ? `<p class="small" style="color:var(--orange)">📷 ${esc(j.photo_advice || "Photo is unclear — retake closer, in good light.")}</p>` : ""}
    <p class="small dim">AI results are estimates. Compare with the <b>Droppings Guide</b> and <b>Symptom Check</b>. For mass deaths, contact the vet office.</p>`;
  $("#tab-scan").appendChild(box);
  box.scrollIntoView({ behavior: "smooth" });
}

/* ---------- init ---------- */
renderChecker();
renderLibrary();
$("#disclaimer-foot").textContent = DISCLAIMER;
