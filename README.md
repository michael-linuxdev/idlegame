# Orbital Claim

Mobile-first idle PWA: command a **sci-fi outpost** from a build map. Modules produce Ore offline; prestige for Plasma.

Working title for the Sci-Fi Outpost tone pivot (loop unchanged from the idle/build/prestige/clan design).

## Stack

- Vite + React + TypeScript
- `vite-plugin-pwa` (installable manifest + service worker)
- localStorage persistence (`lastSeen` + run state)

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`). On a phone, use your LAN IP from the same output.

```bash
npm run build
npm run preview
```

`preview` serves the production build (needed to fully exercise the service worker).

## MVP features

- **Outpost Home** — Bau-Map with fixed module slots (Drill Rig, Hab Module, Fusion Array). Tap a module to upgrade.
- **Ore** soft currency with tap scoop, idle tick, and offline catch-up (8h soft / 24h hard)
- Prestige soft-reset → **Plasma** meta + shop (Outpost Yield, Long Orbit, Fabricator Discount, First Beacon)
- Clan tab with fake local season leaderboard
- FTUE coach (dismissible) + PWA install nudge
- `base: './'` for GitHub Pages / custom domain

## Install as PWA

Build/preview (or a hosted deploy), then use the browser “Add to Home Screen” / install prompt. Manifest name: **Orbital Claim**.

## Hosted URLs

- Custom domain (when CNAME attached): https://idlegame.micana.de
- Project Pages fallback: https://michael-linuxdev.github.io/idlegame/
