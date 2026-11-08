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
npm run dev            # Stimmung testen: ?ambient=night-winter
                       # Fest erzwingen: ?fest=advent (raunaechte, lichtmess, fruehlingsfest, bluetenfest,
                       #   sommerfest, sonnenblumen, erntedank, laternenfest, advent)
                       # Kapitel sofort öffnen: ?kapitel=all · ?kapitel=4,7 · ?kapitel2=1 · ?kapitel3=1
npm run build
npm run preview
npm run lint
npm run build && npm run e2e               # Playwright-Durchlauf (Start, Saisonende, Notizbuch, Spielstand, UX-Layout)
                                           #   Screenshots landen in e2e-screens/
npm test                                   # Vitest (Format, Balance-Formeln, Gartenjahre, Notizbuch)
SUMMARY=1 npm run balance -- regular 336   # Balance-Simulator (engaged | regular | casual, Stunden)
python3 scripts/generate-pwa-icons.py   # App-Icons neu erzeugen (Pillow)
```

## Code-Aufbau

| Pfad | Inhalt |
|---|---|
| `src/game/` | Spielkern: Wirtschaft, Module, Prestige, Tagesziele, Events, Speicherstand |
| `src/theme/` | Gartenerbe-Präsentation: Texte (`strings.ts`), Farben (`tokens.css`), Karte (`MapBackdrop`, `PlotArt`), Modulgrafik mit 5 Ausbaustufen (`ModuleArt`), Icons, Schriften, Stimmung (`ambient.ts`), Styles (`garden.css`, `hud.css`, `polish.css`) |
| `src/components/` | UI: `GardenMap` + `hud/` (Ziel, Event-Leiste, Gießen/Ernten, Boni, Willkommen), `AppNav` (untere Leiste + Menü), Sheets, Panels |
| `src/game/overlays.ts` | Fenster-Regeln: offenes Fenster erkennen, Escape/Zurück schließt das oberste |
| `src/theme/ux.css` | Gemeinsame Bausteine der UX-Runde (×-Knopf, Leiste, Menü, Breitbild, Einstellungen) |
| `src/i18n/` | Zugriff auf die deutschen Texte (`t`) |

## Rechtliches

Datenschutztext und Impressum stehen in `src/theme/legal.ts`. Das Impressum wird erst angezeigt, wenn alle Felder ausgefüllt sind — vor dem Store-Launch eintragen.

## Hosting

https://idlegame.micana.de — GitHub Pages, Deploy bei Push auf `main` (`.github/workflows/deploy-pages.yml`).
Fallback: https://michael-linuxdev.github.io/idlegame/
