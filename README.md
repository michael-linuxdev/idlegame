# Orbit Rack

Mobile-first idle PWA: run a **space data center** from a build map. Modules produce Compute offline; prestige for Credits.

Interim brand for the space-datacenter tone (loop: idle / Bau-Map / prestige / clans).

## Stack

- Vite + React + TypeScript
- `vite-plugin-pwa` (installable manifest + service worker)
- localStorage persistence (`lastSeen` + run state)

## Run locally

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## MVP features

- **Station Home** — Bau-Map with six module slots (Power Plant, Cooling Array, Rack Bay, Uplink, Beam Relay, Core Switch). Tap to upgrade.
- **Compute** soft currency with burst cycle, idle tick, offline catch-up (8h soft / 24h hard)
- Prestige → **Credits** meta + shop (Rack Yield, Long Uptime, BOM Discount, Hot Spare)
- Clan tab with fake local season leaderboard
- FTUE coach (dismissible) + PWA install nudge
- `base: './'` for GitHub Pages / custom domain

## Hosted URLs

- Custom domain (when CNAME attached): https://idlegame.micana.de
- Project Pages fallback: https://michael-linuxdev.github.io/idlegame/
