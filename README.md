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

## Hosted URLs

- **Primary (custom domain):** https://idlegame.micana.de  
  Requires GitHub Pages → Custom domain = `idlegame.micana.de` (DNS already CNAMEs to `michael-linuxdev.github.io`).
- **Fallback (project Pages):** https://michael-linuxdev.github.io/idlegame/  
  Vite `base: './'` so JS/CSS resolve under `/idlegame/` until the custom domain is attached.

### Attach custom domain (repo admin)

If Pages API returns 403 for bots:

1. Open https://github.com/michael-linuxdev/idlegame/settings/pages  
2. Under **Custom domain**, enter `idlegame.micana.de` → **Save**  
3. Wait for DNS check → enable **Enforce HTTPS**  
4. Confirm Source is **GitHub Actions**
