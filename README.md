# TurmFarm

Mobile-first idle PWA on a **shared game core** with theme skins. Live product: **TurmFarm** (Urban Vertical Farm). Modules produce Ertrag offline; prestige for Münzen. Planned sister app on the same core: **Tokenhalle** (Arcade) — see [`ROADMAP.md`](./ROADMAP.md).

Theme pack: `src/themes/farm` only (TurmFarm). Orbit Rack and Brauerei are removed — not shipped.

Product priorities and owner notes: see [`ROADMAP.md`](./ROADMAP.md).

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

- **Farm Home** — Bau-Map with ten module slots (Gewächshaus, Nährstoffpumpe, LED-Wand, …). Tap to upgrade.
- **Ertrag** soft currency with burst cycle, idle tick, offline catch-up (8h soft / 24h hard)
- Prestige → **Münzen** meta + shop
- Clan tab with fake local season leaderboard
- FTUE coach (dismissible) + PWA install nudge
- German UI (`lang=de`), `base: './'` for GitHub Pages / custom domain

## Hosted URLs

- Custom domain (when CNAME attached): https://idlegame.micana.de
- Project Pages fallback: https://michael-linuxdev.github.io/idlegame/
