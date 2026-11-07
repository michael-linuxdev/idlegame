# TurmFarm / Tokenhalle

Mobile-first idle PWA on a **shared game core** with theme skins.

| App | Theme pack | Activate |
|---|---|---|
| **TurmFarm** (live) | `src/themes/farm` | default (`npm run dev` / `build`) |
| **Tokenhalle** | `src/themes/arcade` | `VITE_THEME=arcade` or `npm run dev:arcade` / `build:arcade` |

Orbit Rack and Brauerei are removed — not shipped. Product notes: [`ROADMAP.md`](./ROADMAP.md).

## Stack

- Vite + React + TypeScript
- `vite-plugin-pwa` (installable manifest + service worker)
- localStorage persistence (`lastSeen` + run state)

## Run locally

```bash
npm install
npm run dev          # TurmFarm
npm run dev:arcade   # Tokenhalle
```

```bash
npm run build
npm run build:arcade
npm run preview
```

## MVP features

- **Bau-Map Home** — ten module slots; tap to upgrade (farm modules or arcade cabinets by theme).
- Soft currency with burst cycle, idle tick, offline catch-up (8h soft / 24h hard)
- Prestige → meta shop
- Clan tab with fake local season leaderboard
- FTUE coach (dismissible) + PWA install nudge
- German UI (`lang=de`), `base: './'` for GitHub Pages / custom domain

## Hosted URLs

| App | URL |
|---|---|
| **TurmFarm** | https://idlegame.micana.de |
| **Tokenhalle** (same Pages site) | https://idlegame.micana.de/arcade/ |
| **Tokenhalle** (preferred custom domain) | https://tokenhalle.micana.de — needs thin second repo; see [`deploy/tokenhalle-repo/`](./deploy/tokenhalle-repo/) |

Project Pages fallback: https://michael-linuxdev.github.io/idlegame/ (redirects to the TurmFarm custom domain).

DNS for `tokenhalle.micana.de`: **CNAME** `tokenhalle` → `michael-linuxdev.github.io` (same target as TurmFarm). GitHub Pages is 1 custom domain per site, so the custom domain needs the thin `tokenhalle` mirror repo.
