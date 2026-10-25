/* PoultryDoc GH — secure photo-analysis endpoint
   Uses GEMINI_API_KEY from server env (never exposed to phones).
   Hardened (Lesson 4, Oct 25 2026):
     * CORS locked to the app's own origins (was "*")
     * Provider/internal errors are logged server-side, never returned to the client
     * Per-IP rate limit to cap abuse of the server-held key
*/
// Allowed callers: the production domain, this project's Vercel preview
// deployments, and local development. Add any future custom domain here.
const ALLOWED_ORIGINS = new Set([
  "https://poultry-doc.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);
const ALLOWED_PREVIEW = /^https:\/\/poultrydoc-gh[a-z0-9-]*\.vercel\.app$/;

function originAllowed(origin) {
  return ALLOWED_ORIGINS.has(origin) || ALLOWED_PREVIEW.test(origin);
}

const RATE = { windowMs: 60_000, max: 12, hits: new Map() };

function rateLimited(ip) {
  const now = Date.now();
  const rec = RATE.hits.get(ip);
  if (!rec || now - rec.start > RATE.windowMs) {
    RATE.hits.set(ip, { start: now, count: 1 });
    return false;
  }
  rec.count += 1;
  return rec.count > RATE.max;
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin) {
    if (!originAllowed(origin)) {
      // Not a caller we serve: refuse without revealing anything.
      return res.status(403).json({ error: "Forbidden" });
    }
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  }
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "Too Many Requests" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Bad Request" }); }
  }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "Bad Request" });

  const { image, mime = "image/jpeg", prompt } = body;
  if (!image || typeof image !== "string") return res.status(400).json({ error: "Bad Request" });
  const base64 = image.includes(",") ? image.split(",")[1] : image;
  if (!base64 || base64.length > 7_000_000) return res.status(413).json({ error: "Payload Too Large" });

  const serverKey = process.env.GEMI_API_KEY || process.env.GEMINI_API_KEY || null;
  const clientKey = typeof body.key === "string" ? body.key : null;
  const apiKey = serverKey || clientKey;
  if (!apiKey) return res.status(200).json({ needs_key: true, error: "No API key configured." });

  const text = prompt || "You are a poultry health expert for smallholder farmers in Ghana. Analyze this image for signs of poultry disease. Reply with ONLY valid JSON: {\"image_quality\":\"good|ok|poor\",\"visible_signs\":[],\"top_conditions\":[{\"name\":\"\",\"confidence\":0,\"why\":\"\"}],\"urgency\":\"none|low|medium|high|emergency\",\"immediate_advice\":\"\",\"photo_advice\":\"\"}";

  try {
    // Hard timeout: a slow/hung provider must fail fast, never hold the function open.
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20_000);
    let r;
    try {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text }, { inline_data: { mime_type: mime, data: base64 } }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1200 }
        })
      });
    } finally {
      clearTimeout(timer);
    }
    if (!r.ok) {
      // Log granular detail internally; return a generic status to the caller.
      const detail = await r.text();
      console.error("[scan] upstream failure", r.status, String(detail).slice(0, 300).replace(/[\r\n]+/g, " "));
      const code = r.status === 429 ? 429 : r.status >= 500 ? 503 : 502;
      if (code === 429) res.setHeader("Retry-After", "30");
      return res.status(code).json({ error: code === 429 ? "Too Many Requests" : "Service Unavailable" });
    }
    const data = await r.json();
    let out = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    out = out.replace(/```json|```/g, "").trim();
    let parsed;
    try { parsed = JSON.parse(out); }
    catch {
      console.error("[scan] unparseable model output", out.slice(0, 200).replace(/[\r\n]+/g, " "));
      return res.status(502).json({ error: "Bad Gateway" });
    }
    return res.status(200).json(parsed);
  } catch (e) {
    console.error("[scan] request failed", String(e).slice(0, 200));
    return res.status(502).json({ error: "Bad Gateway" });
  }
}
