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
                                           #   + Grafik-Vergleich (?artsheet gegen scripts/e2e/art-baseline/,
                                           #   höchstens 1.500 SVG-Elemente im Hauptgarten); Screenshots/Diffs in e2e-screens/
npm run build && npm run art:update        # Vergleichsbilder nach gewollter Grafik-Änderung erneuern
node scripts/art/shots.mjs <ordner>        # Spielfeld-Screenshots Tag/Abend/Nacht + 4 Jahreszeiten
npm test                                   # Vitest (Format, Balance-Formeln, Gartenjahre, Notizbuch)
SUMMARY=1 npm run balance -- regular 336   # Balance-Simulator (engaged | regular | casual, Stunden)
npm run build && python3 scripts/generate-pwa-icons.py   # App-Icons aus den echten Bausteinen (?artsheet=icon, Pillow)
npx vite preview --port 4175 & node scripts/store/screenshots.cjs docs/store/screenshots   # Store-Screenshots
```

## Code-Aufbau

| Pfad | Inhalt |
|---|---|
| `src/game/state.ts` | Öffentliche Schnittstelle des Spielkerns (bündelt `src/game/state/*`) |
| `src/game/state/` | Spielkern nach Bereichen: `types` (GameState), `create` (Start / nach dem Saisonende), `core` (Stufe, Aufgaben, Multiplikatoren, Ernte/s), `buy`, `garden` (Planen, Mengenkauf, Jonas), `chapters`, `extras`, `generation`, `fest`, `life` (Wetter, Album, Projekte, Kreuzen, Bewohner, Deko), `events`, `tick`, `market`, `offline`, `prestige` (Truhe, Saisonende, Tiefer Winter), `rewards` |
| `src/game/useGame.ts` + `src/game/hooks/` | React-Anbindung: `useGameLoop` (Laden, Takt, Speichern), `useGardenActions`, `useChapterActions`, `useShopActions` |
| `src/game/storage.ts`, `saveFields.ts`, `backup.ts`, `saveGuard.ts` | Spielstand: Format/Version und Migration, Feld-Parser, Sicherungscode, Schutz vor Überschreiben |
| `src/game/economy.ts`, `truhe.ts`, `generators.ts`, `longLoop.ts`, `generations.ts` | Formeln: Saisonende-Auszahlung und Offline, Omas Truhe, Bereiche, Tiefer Winter, Generationen |
| `src/game/` (übrige) | Tagesziele, Gartenrunde, Ereignisse, Feste, Kapitel, Playtest-Log, Hinweise, Einstellungen, Benachrichtigungen |
| `src/theme/` | Präsentation: Farben (`tokens.css`), Schriften (`fonts.css`), Karte (`MapBackdrop`, `PlotArt`), Modulgrafik (`ModuleArt`), Icons, Stimmung (`ambient.ts`) |
| `src/theme/app/`, `expansion/`, `ux/` | Styles nach Bereichen; `App.css`, `expansion.css`, `ux.css` importieren die Teile in fester Reihenfolge (Kaskade) |
| `src/theme/art/` | Spielgrafik-Fundament: Farbpalette (`palette.ts`), Bausteine mit Stilregel und Maßtabelle (`parts/`), Bereiche je Datei (`garden/`, `chapters/`), Kapitel-Grafikliste (`registry.tsx`). Übersicht aller Grafiken: `index.html?artsheet` |
| `src/components/` | UI: `GardenMap` + `map/` (Beet, Kopfzeile, Ziel-Zeile) + `hud/` (Ziel, Event-Leiste, Gießen/Ernten, Boni, Willkommen), `AppNav` (untere Leiste + Menü), Sheets, Panels (`prestige/`: Tiefer Winter, Generationen) |
| `src/components/lazy.tsx` | Selten genutzte Fenster/Panels als eigene Bündel (im Leerlauf vorgeladen, offline im Precache) |
| `src/game/overlays.ts` | Fenster-Regeln: offenes Fenster erkennen, Escape/Zurück schließt das oberste |
| `src/i18n/` | Texte je Sprache: `de/` (Ausgangssprache), `en/` (nur bei Bedarf geladen); `t`, Spracherkennung und Live-Umschalter (`docs/i18n/technik.md`) |
| `docs/cleanup/namen.md` | Namens-Wörterbuch (alte Prototyp-Namen → Spielbegriffe); `src/test/legacyNames.test.ts` verhindert ihre Rückkehr |

## Rechtliches

Datenschutztext und Impressum stehen in `src/theme/legal.ts`. Das Impressum wird erst angezeigt, wenn alle Felder ausgefüllt sind — vor dem Store-Launch eintragen.

## Hosting

https://idlegame.micana.de — GitHub Pages, Deploy bei Push auf `main` (`.github/workflows/deploy-pages.yml`).
Fallback: https://michael-linuxdev.github.io/idlegame/
