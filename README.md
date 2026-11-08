# Gartenerbe

*Vom Schrebergarten zum Gartenpark.* Mobile-first Idle-Tycoon als PWA: Du erbst Omas verwilderten Schrebergarten und machst daraus Schritt für Schritt einen prächtigen Gartenpark — der Garten wächst auch, wenn du offline bist.

Produktnotizen & Plan: [`ROADMAP.md`](./ROADMAP.md).

## Stack

- Vite + React + TypeScript
- `vite-plugin-pwa` (installierbares Manifest + Service Worker)
- localStorage-Persistenz (`lastSeen` + Laufzustand)

## Lokal starten

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Code-Aufbau

| Pfad | Inhalt |
|---|---|
| `src/game/` | Spielkern: Wirtschaft, Module, Prestige, Tagesziele, Events, Speicherstand |
| `src/theme/` | Gartenerbe-Präsentation: Texte (`strings.ts`), Farben (`tokens.css`), Karte, Modulgrafik |
| `src/components/` | UI (Karte, HUD, Sheets, Panels) |
| `src/i18n/` | Zugriff auf die deutschen Texte (`t`) |

## Hosting

https://idlegame.micana.de — GitHub Pages, Deploy bei Push auf `main` (`.github/workflows/deploy-pages.yml`).
Fallback: https://michael-linuxdev.github.io/idlegame/
