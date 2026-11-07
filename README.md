# Ash Dominion

Mobile-first idle PWA: rule an ash legion, buy generators, catch up offline, prestige for Dominion.

## Stack

- Vite + React + TypeScript
- `vite-plugin-pwa` (installable manifest + service worker)
- localStorage persistence (`lastSeen` + run state)

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`). On a phone, use your LAN IP from the same output, or tunnel as you prefer.

```bash
npm run build
npm run preview
```

`preview` serves the production build (needed to fully exercise the service worker).

## MVP features

- **Ash** resource with tap (“Rake embers”) and three generators (Ember Pit, Ash Forge, Cinder Barracks)
- Idle tick + offline catch-up on load
- Prestige soft-reset → Dominion meta multiplier (+10% production each)
- Clan tab with fake local season leaderboard
- Dark-fantasy UI (ember / ash palette)

## Install as PWA

Build/preview (or a hosted deploy), then use the browser “Add to Home Screen” / install prompt. Manifest name: **Ash Dominion**.
