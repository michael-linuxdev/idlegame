# Gartenerbe

*Vom Schrebergarten zum Gartenpark.* Mobile-first Idle-Tycoon als PWA: Du erbst Omas verwilderten Schrebergarten und machst daraus Schritt für Schritt einen prächtigen Gartenpark — der Garten wächst auch, wenn du offline bist.

Produktnotizen & Plan: [`ROADMAP.md`](./ROADMAP.md).

## Sprachen

Deutsch (Ausgangssprache) und Englisch (*Heirloom Garden*). Die Sprache folgt dem Browser (`de*` = Deutsch, sonst Englisch); der Umschalter „Sprache / Language“ unter **Menü → Einstellungen → Anzeige** wechselt live und merkt sich die Wahl auf dem Gerät (nicht im Spielstand). Test-Parameter: `?lang=en` bzw. `?lang=de`. Technik: [`docs/i18n/technik.md`](./docs/i18n/technik.md), Begriffe: [`docs/i18n/glossar.md`](./docs/i18n/glossar.md).

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
                       # Sprache erzwingen: ?lang=en · ?lang=de
npm run build
npm run preview
npm run lint
npm run build && npm run e2e               # Playwright-Durchlauf auf Deutsch und Englisch (Start, Saisonende, Notizbuch,
                                           #   Spielstand, UX-Layout, Sprachumschalter) + Grafik-Vergleich (?artsheet gegen
                                           #   scripts/e2e/art-baseline/, höchstens 1.500 SVG-Elemente im Hauptgarten)
                                           #   + axe (WCAG A/AA, beide Sprachen) + HUD-Grenze (scripts/e2e/hud.mjs: höchstens
                                           #   3 Ereignis-Pillen, ein Zugang „Heute“) + englische Fenster-Durchsicht;
                                           #   Screenshots/Diffs in e2e-screens/
npm run build && npm run screens -- en     # Jedes Fenster im iPhone-13-Format → e2e-screens/en/ (oder de)
npm run build && npm run art:update        # Vergleichsbilder nach gewollter Grafik-Änderung erneuern
node scripts/art/shots.mjs <ordner>        # Spielfeld-Screenshots Tag/Abend/Nacht + 4 Jahreszeiten
npm test                                   # Vitest (Format, Balance-Formeln, Gartenjahre, Notizbuch)
SUMMARY=1 npm run balance -- regular 336   # Balance-Simulator (engaged | regular | casual, Stunden)
WEATHER=best DECISIONS=1 SUMMARY=1 npm run balance -- regular 8760   # … mit Wetter-Entscheidungen, zählt jede Wahl
TASKS=1 ARC=best GEN=1 CHAPTERS=1 CHAPTER_MANUAL=0 SUMMARY=1 npm run balance -- regular 43800   # … Tagesziele (Ruhezeit) und Bogen-Regeln
npm run build && python3 scripts/generate-pwa-icons.py   # App-Icons aus den echten Bausteinen (?artsheet=icon, Pillow)
npx vite preview --port 4175 & node scripts/store/screenshots.cjs docs/store/screenshots de   # Store-Screenshots
node scripts/store/screenshots.cjs docs/store/screenshots-en en                              #   … englisch
```

## Code-Aufbau

| Pfad | Inhalt |
|---|---|
| `src/game/state.ts` | Öffentliche Schnittstelle des Spielkerns (bündelt `src/game/state/*`) |
| `src/game/state/` | Spielkern nach Bereichen: `types` (GameState), `create` (Start / nach dem Saisonende), `core` (Stufe, Aufgaben, Multiplikatoren, Ernte/s), `buy`, `garden` (Planen, Mengenkauf, Jonas), `chapters`, `extras`, `generation`, `fest`, `life` (Wetter, Album, Projekte, Kreuzen, Bewohner, Deko), `events`, `tick`, `market`, `offline`, `prestige` (Truhe, Saisonende, Tiefer Winter), `rewards` |
| `src/game/useGame.ts` + `src/game/hooks/` | React-Anbindung: `useGameLoop` (Laden, Takt, Speichern), `useGardenActions`, `useChapterActions`, `useShopActions` |
| `src/game/storage.ts`, `saveFields.ts`, `backup.ts`, `saveGuard.ts` | Spielstand: Format/Version und Migration, Feld-Parser, Sicherungscode, Schutz vor Überschreiben |
| `src/game/autoBackup.ts`, `backupTarget.ts`, `deviceBackup.ts`, `restore.ts`, `backupReminder.ts` | Automatische Sicherungen in IndexedDB (Anlässe, Rotation, Budget), Wiederherstellen beim Start und im Menü, Erinnerung an die Sicherung außerhalb des Geräts (`docs/sicherung.md`) |
| `src/game/economy.ts`, `truhe.ts`, `generators.ts`, `longLoop.ts`, `generations.ts` | Formeln: Saisonende-Auszahlung und Offline, Omas Truhe, Bereiche, Tiefer Winter, Generationen |
| `src/game/` (übrige) | Tagesziele, Gartenrunde, Ereignisse, Feste, Kapitel, Playtest-Log, Hinweise, Einstellungen, Benachrichtigungen |
| `src/theme/` | Präsentation: Farben (`tokens.css`), Schriften (`fonts.css`), Karte (`MapBackdrop`, `PlotArt`), Modulgrafik (`ModuleArt`), Icons, Stimmung (`ambient.ts`) |
| `src/theme/app/`, `expansion/`, `ux/` | Styles nach Bereichen; `App.css`, `expansion.css`, `ux.css` importieren die Teile in fester Reihenfolge (Kaskade) |
| `src/theme/art/` | Spielgrafik-Fundament: Farbpalette (`palette.ts`), Bausteine mit Stilregel und Maßtabelle (`parts/`), Bereiche je Datei (`garden/`, `chapters/`), Kapitel-Grafikliste (`registry.tsx`). Übersicht aller Grafiken: `index.html?artsheet` |
| `src/components/` | UI: `GardenMap` + `map/` (Beet, Kopfzeile, Ziel-Zeile) + `hud/` (Ziel, Event-Leiste, Gießen/Ernten, Boni, Willkommen), `AppNav` (untere Leiste + Menü), Sheets, Panels (`prestige/`: Tiefer Winter, Generationen) |
| `src/components/lazy.tsx` | Selten genutzte Fenster/Panels als eigene Bündel (im Leerlauf vorgeladen, offline im Precache) |
| `src/game/overlays.ts` | Fenster-Regeln: offenes Fenster erkennen, Escape/Zurück schließt das oberste |
| `src/i18n/` | Texte je Sprache: `de/` (Ausgangssprache), `en/` (nur bei Bedarf geladen); `t`, Spracherkennung und Live-Umschalter (`docs/i18n/technik.md`) |
| `src/game/today.ts`, `hudPills.ts`, `arcRules.ts`, `state/rest.ts` | Heute-Karte, HUD-Grenze (höchstens 3 Pillen), Bogen-Regeln der Kapitel 13–49, Ruhezeit-Verkürzung (Runde 4) |
| `docs/cleanup/namen.md` | Namens-Wörterbuch (alte Prototyp-Namen → Spielbegriffe); `src/test/legacyNames.test.ts` verhindert ihre Rückkehr |

## Rechtliches

Datenschutztext je Sprache in `src/i18n/{de,en}/legal.ts` (inhaltsgleich halten), Impressum-Angaben in `src/theme/legal.ts`. Das Impressum wird erst angezeigt, wenn alle Felder ausgefüllt sind — vor dem Store-Launch eintragen. Auf Englisch heißt es „Legal notice (Impressum)“; ein englisches Pflicht-Gegenstück gibt es nicht, die Angaben bleiben dieselben.

## Hosting

https://idlegame.micana.de — GitHub Pages, Deploy bei Push auf `main` (`.github/workflows/deploy-pages.yml`).
Fallback: https://michael-linuxdev.github.io/idlegame/
