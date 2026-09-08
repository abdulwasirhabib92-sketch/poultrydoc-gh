# PoultryDoc GH 🐔

**Scan. Identify. Treat. — made for Ghana's farmers.**

A poultry health app built for smallholder farmers in Ghana. Works offline on cheap Android phones.

## Features

- **📷 Photo Scan** — AI photo analysis for signs of disease (needs a free Gemini API key)
- **🩺 Symptom Checker** — tick visible signs, get ranked likely matches (works offline)
- **📚 Disease Library** — 17 common Ghanaian poultry diseases with chemical + natural treatments (neem, moringa, bitter leaf, bitter kola…)
- **💩 Droppings Guide** — match dropping colour to disease
- **💉 Vaccination Schedule** — day-by-day schedule for chicks
- **🔒 Biosecurity Rules** — how to stop disease entering your farm
- **🌍 Community** — report outbreaks by district, live Outbreak Watch map, farmer feed
- **🌱 Treatment Ratings** — "what worked for other farmers" — the app learns from real outcomes

## Tech

- Static HTML/CSS/JS (no build step) + `api/scan.js` Vercel serverless function
- Supabase (PostgREST) for community reports & treatment feedback
- Deployed on Vercel — auto-deploys on push to `main`

## Setup

1. Get a free Gemini API key at https://aistudio.google.com/apikey
2. Add it as the `GEMI_API_KEY` environment variable in Vercel (server-side, key never ships to phones)
3. Or paste the key in-app (Scan tab) on a single device

**Note:** Symptom checker, disease library, and all guides work with zero setup.

## ⚠️ Disclaimer

Educational guidance based on documented poultry health research and Ghana farmer practice. Does not replace a veterinary officer. For severe outbreaks or sudden mass deaths, contact your District/Municipal Veterinary Office.
