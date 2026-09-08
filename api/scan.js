/* PoultryDoc GH — secure photo-analysis endpoint
   Uses GEMINI_API_KEY from server env (never exposed to phones).
   Falls back to a client-supplied key if the server env isn't set. */
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" };

export default async function handler(req, res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "bad json" }); } }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "bad request" });

  const { image, mime = "image/jpeg", prompt } = body;
  if (!image || typeof image !== "string") return res.status(400).json({ error: "no image" });
  const base64 = image.includes(",") ? image.split(",")[1] : image;
  if (!base64 || base64.length > 7_000_000) return res.status(400).json({ error: "image too large (max ~5MB)" });

  const serverKey = process.env.GEMI_API_KEY || process.env.GEMINI_API_KEY || null;
  const clientKey = typeof body.key === "string" ? body.key : null;
  const apiKey = serverKey || clientKey;
  if (!apiKey) return res.status(200).json({ needs_key: true, error: "No API key configured. Set GEMINI_API_KEY on the server or add a key in the app." });

  const text = prompt || "You are a poultry health expert for smallholder farmers in Ghana. Analyze this image for signs of poultry disease. Reply with ONLY valid JSON: {\"image_quality\":\"good|ok|poor\",\"visible_signs\":[],\"top_conditions\":[{\"name\":\"\",\"confidence\":0,\"why\":\"\"}],\"urgency\":\"none|low|medium|high|emergency\",\"immediate_advice\":\"\",\"photo_advice\":\"\"}";

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text }, { inline_data: { mime_type: mime, data: base64 } }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1200 }
      })
    });
    if (!r.ok) {
      const t = await r.text();
      const msg = (r.status === 400 || r.status === 403) ? "API key rejected — check the key at aistudio.google.com/apikey" : "Gemini error " + r.status;
      return res.status(r.status).json({ error: msg, detail: t.slice(0, 300) });
    }
    const data = await r.json();
    let out = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    out = out.replace(/```json|```/g, "").trim();
    let parsed;
    try { parsed = JSON.parse(out); }
    catch { return res.status(200).json({ error: "The AI returned an unreadable answer — try retaking the photo.", raw: out.slice(0, 400) }); }
    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(502).json({ error: "Could not reach the AI service. Try again." });
  }
}
