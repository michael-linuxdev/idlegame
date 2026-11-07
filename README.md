# Ash Dominion

Mobile-first idle PWA: rule an ash legion from a **fortress build map**. Buildings produce offline; prestige for Dominion.

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

- **Fortress Home** — top-down / isometric-lite ash base map; 3 generator buildings on fixed slots (Ash Hearth, Bone Mill, Legion Altar). Tap a building to upgrade.
- **Ash** resource with tap (“Rake embers”), idle tick, and offline catch-up on load
- Prestige soft-reset → Dominion meta multiplier (+10% production each)
- Clan tab with fake local season leaderboard
- Dark-fantasy UI (ember / ash / iron tokens)

## Install as PWA

Build/preview (or a hosted deploy), then use the browser “Add to Home Screen” / install prompt. Manifest name: **Ash Dominion**.
