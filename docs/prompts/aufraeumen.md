# Prompt: Aufräum-Runde „Klarer Code, klare Namen“

> Diesen Text als Auftrag an eine Claude-Code-Sitzung im Repo `idlegame` geben.
> Reihenfolge der Folgeaufträge: **1. Aufräumen (dieser)** → 2. Englisch (`docs/prompts/englisch.md`) → 3. Kapitel 13–50 (`docs/prompts/kapitel-13-50.md`).
> Grundlage: Stand `main` nach der Bindungs-Runde (PRs #94–#102, 2026-11-09).

---

Du arbeitest an **Gartenerbe** (Vite + React 19 + TypeScript, PWA, deutsche UI, echte Spieler mit echten Spielständen). Lies zuerst `CLAUDE.md`, `ROADMAP.md`, `README.md` und `docs/plan-nacht.md`.

**Ziel:** Der Code soll für die nächsten Jahre wartbar sein. Das Speicherformat beginnt dabei **ohne Migration neu** (siehe „Harte Regeln“). Das heißt: keine Dateien mit 2.000+ Zeilen, keine Namen aus früheren Spielen (TurmFarm, Ash Dominion, Orbit Rack) mehr, ein kleineres Start-Bündel. Am Spiel selbst ändert sich nichts (Balance, Optik und Texte bleiben gleich). **Danach** folgt die englische Fassung. Sie profitiert davon, dass Texte und Namen dann sauber sind.

## Harte Regeln

- **Spielstand: Neustart ohne Migration** (Entscheidung des Nutzers, 2026-11-09). Niemand außer dem Entwickler spielt bisher, und der beginnt erst **nach** dieser Runde zu testen. Siehe die Ausnahme in `CLAUDE.md`. Dafür gilt:
  - Gespeicherte Felder werden **direkt** umbenannt, ohne `MIGRATIONS`-Schritt und ohne Kompatibilität zu alten Ständen.
  - **Neuer Speicherschlüssel** (z. B. `gartenerbe-spielstand-v1` statt `gartenerbe-save-v1`) und `SAVE_VERSION = 1`, `MIGRATIONS = {}`. `migrateFieldNames` und die Umbenennungs-Tabelle aus der Zeit vor November entfallen. Der alte Schlüssel wird **nicht gelöscht**; er bleibt unangetastet liegen (Rückweg, falls nötig). Gleiches gilt sinngemäß für die anderen gespeicherten Schlüssel (Notizbuch, Extras, FTUE …), wenn sich ihr Format ändert.
  - Alte Fixtures `save-v1.json`, `save-v2.json`, `save-v2-full.json` und ihre Migrations-Tests werden entfernt. Neu: **`src/test/fixtures/save-v1.json`** im neuen Format, ein **echter**, mit Spielfunktionen erzeugter Stand mit **allen** Feldern (Erzeugung wie bisher über ein temporäres Skript, das danach gelöscht wird). `migration.test.ts` lädt ihn verlustfrei und prüft den Round-Trip. Das ist der Startpunkt für alle künftigen Migrationen.
  - `saveCoverage.test.ts` muss weiter grün sein (jedes Zahl-/Ja-Nein-Feld übersteht Speichern + Laden).
  - Der **Downgrade-Schutz** (`isNewerSave`, `saveGuard.ts`) bleibt erhalten und mit Test belegt.
  - **Sicherungscodes** (`backup.ts`): Bündel-Version erhöhen. Codes im alten Format werden mit einer verständlichen Meldung abgelehnt („stammt aus einer Vorversion“), nicht still falsch eingespielt. Test dafür.
  - Am Ende der Runde den Ausnahme-Absatz in `CLAUDE.md` **löschen**. Ab dann gilt die Migrationsregel wieder uneingeschränkt.
- **Keine Spiel- oder Balance-Änderung.** `npm run balance` liefert vor und nach jedem Paket **identische** `SUMMARY=1`-Zeilen für engaged/regular/casual 336 h. Die Zeilen am Anfang speichern und am Ende vergleichen. Abweichung = Fehler.
- **Keine Texte für Spieler ändern** (außer, wo ein alter Name sichtbar durchrutscht; dann melden).
- **`STORE_ENABLED` nicht anfassen.**
- Nach **jedem** Paket: `npm test`, `npm run lint` (0 Warnungen), `npm run build`, `npm run e2e`, dazu der Balance-Vergleich. **Ein PR pro Paket**, selbst mergen, sobald die CI auf dem aktuellen Head grün ist. Vor jedem Paket den Branch auf den neuesten `main` bringen. Nie zwei Pakete auf einem offenen PR stapeln.
- Deutsche Commit-Nachrichten im Stil der Historie. Am Ende einen Pipeline-Punkt „Aufräum-Runde“ in `ROADMAP.md` ergänzen.
- Wenn ein Schritt deutlich größer wird als gedacht oder ein Risiko für Spielstände zeigt: anhalten, begründen, den Rest ohne ihn fertigmachen.

## Ausgangslage (gemessen am 2026-11-09)

| Datei | Zeilen |
|---|---|
| `src/game/state.ts` | 2831 |
| `src/theme/expansion.css` | 2989 |
| `src/App.css` | 2027 |
| `src/theme/ux.css` | 1361 |
| `src/theme/strings.ts` | 1216 |
| `src/game/useGame.ts` | 1163 |
| `src/theme/HandArtA.tsx` / `HandArtB.tsx` | 1143 / 890 |
| `src/components/GardenMap.tsx` | 1124 |
| `src/theme/ModuleArt.tsx` | 1032 |

- JS-Bündel ~870 KB (≈ 250 KB gzip) in **einem** Chunk, Precache ~1,27 MB (inkl. doppelter `.woff` + `.woff2`).
- Alte interne Namen (Anzahl Vorkommen in `src/`): `ember*` (> 200, u. a. `emberUpgrades`, `emberPayout`, `EmberUpgrades`, `emberShop`, `emberRankUnlockNeed`), `ash*` (`ashGained`, `ashEarnedThisRun`, `eventAshProgress`, `formatAsh`), `obsidian*` (`obsidianGained`, `OBSIDIAN_PACKS`, `obsidian50/150/500`), `compute*` (`computeSec`, `computeMult` in `dailyOps.ts`), `fortress` (Tab-Name), `dominionYield`, `foundryDiscount`, `canopyBoost`, `greenLattice`, `firstFlame`, `longWatch`, `nightSoil`, `tapMastery`, `seedPurse`, `saplingSurge` (Erbstück-Truhe, deutsche Namen in `strings.ts` → `emberShop`), `Phyto`, `Rack`. `src/game/legacyStorage.ts` und Kommentare (TurmFarm, Tokenhalle, Orbit Rack) gehören ebenfalls dazu.
- Gespeicherte Felder mit Altnamen (Auswahl, vollständig ermitteln!): `emberUpgrades` (+ alle Unterschlüssel), `eventAshProgress`, `bpWeekKey`/`bpXp`/`bpClaimedFree`/`bpPremium`/`bpClaimedPremium`/`bpDailyXpDay` (Battle-Pass heißt im Spiel „Gartenwoche“), `clanMult`/`clanBoostExpiresAt` (Verein), `ownedOfferIds` (enthält `obsidian50` …), `prestiges`/`prestigeSpikeFlags` (Saisonende), `deepPrestiges`/`deepUpgrades` (Tiefer Winter).
- `scripts/__pycache__/` ist eingecheckt. `docs/economy.md` wird in `monetization.ts` erwähnt, existiert aber nicht.

## Pakete (in dieser Reihenfolge)

### Paket 1 — Vorbereitung & Sicherheitsnetz
1. Balance-Basis sichern: `SUMMARY=1 npm run -s balance -- {engaged,regular,casual} 336` (+ `GEN=1 … 2160` für Dauerspieler) → `docs/cleanup/balance-before.txt`.
2. Bündel-Basis: Größen aus `npm run build` → `docs/cleanup/bundle-before.txt`.
3. Ein **Namens-Wörterbuch** `docs/cleanup/namen.md`: altes Feld/Identifier → neuer deutscher Name (Code-Englisch ist erlaubt, wo es Fachbegriff ist; Spielbegriffe auf Deutsch wie im Spiel: `erbstueckUpgrades`/`truhe`, `saisonenden` statt `prestiges`? → **Entscheide einheitlich**, begründe im Wörterbuch, und halte dich an die Begriffe aus `ROADMAP.md` „Begriffe“). Vorgabe: Gespeicherte Felder bekommen sprechende Namen in derselben Sprache wie die neueren Felder (`ernte`, `erbstuecke`, `samen`, `sproesslinge` …).
4. `scripts/__pycache__` entfernen + `.gitignore`. Verweis auf `docs/economy.md` korrigieren.
5. Ein Prüfskript (Vitest), das neue Vorkommen der Altnamen in `src/` meldet (Allowlist nur, wo nötig, z. B. Playtest-Log-Übersetzung alter Namen). Es wird zuerst als `skip` angelegt und am Ende der Runde scharf geschaltet.

### Paket 2 — Speicherformat neu beginnen (Umbenennung ohne Migration)
1. `GameState`-Felder gemäß Wörterbuch umbenennen. `createInitialState`, `createPostPrestigeState`, `pickExpansion`, Parser, alle Leser, Simulator.
2. Neuer Speicherschlüssel, `SAVE_VERSION = 1`, `MIGRATIONS = {}`, `migrateFieldNames` entfernen. Der alte Schlüssel bleibt unangetastet.
3. Alte Fixtures und Migrations-Tests entfernen. Neue Fixture `save-v1.json` (alle Felder, echte Funktionen) mit Round-Trip-Test.
4. `backup.ts`: Bündel-Version erhöhen, alte Codes mit Meldung ablehnen (Test).
5. Playtest-Log: `LOG_NAMES` in `playtestCore.ts` um die neuen Namen ergänzen; alte Logs bleiben lesbar (das Log liegt unter eigenem Schlüssel).
6. E2E: (a) frischer Start speichert unter dem neuen Schlüssel, `saveVersion: 1`; (b) ein alter Stand unter dem alten Schlüssel wird ignoriert und bleibt unverändert liegen; (c) Downgrade-Schutz (`saveVersion: 99`) wie bisher.
7. Balance identisch (Vergleich mit Paket 1).
8. `CLAUDE.md`-Ausnahme erst am Ende der **gesamten** Runde löschen (Abschluss), nicht schon hier.

### Paket 3 — Interne Namen im Code
1. Alle restlichen Altnamen (Funktionen, Typen, Konstanten, Tab-IDs, CSS-Klassen wie `.ember-shop`, Kommentare) gemäß Wörterbuch. Exporte, die von außen (Tests, Simulator) genutzt werden, mitziehen.
2. `legacyStorage.ts` prüfen: noch nötig? Wenn ja, umbenennen und dokumentieren.
3. Prüfskript aus 1.5 scharf schalten.

### Paket 4 — Spielkern aufteilen
1. `state.ts` in Module unter `src/game/state/` aufteilen, z. B. `types.ts`, `create.ts`, `production.ts`, `buy.ts`, `prestige.ts`, `deep.ts`, `generation.ts`, `chapters.ts`, `monetization.ts`, `life.ts` (Bewohner/Deko/Kreuzen/Album/Projekte/Wetter), `seasonCards.ts`-Anbindung, `offline.ts`. `src/game/state.ts` bleibt als dünne Re-Export-Datei, damit Importe stabil bleiben (oder alle Importe umstellen, dann ohne Re-Export).
2. `useGame.ts` in kleinere Hooks aufteilen (`useTick`, `useSaveLoop`, `useShopActions`, `useChapterActions` …). Die Rückgabe von `useGame()` bleibt gleich.
3. Ziel: keine Datei in `src/game/` über ~600 Zeilen. Zirkuläre Importe vermeiden (prüfen, z. B. mit `madge` als Dev-Abhängigkeit, wenn nötig).

### Paket 5 — Oberfläche & CSS aufteilen
1. `GardenMap.tsx` (Karte, HUD-Kopf, Hinweise, Toasts) und `PrestigePanel.tsx` in Teilkomponenten aufteilen.
2. CSS: `App.css`, `expansion.css`, `ux.css`, `story.css` nach Bereichen ordnen (`hud`, `map`, `sheets`, `chapters`, `panels` …). **Doppelte `@keyframes`-Namen** eindeutig machen. Toten CSS-Code entfernen; dazu Klassen gegen den Quelltext prüfen (kleines Skript).
3. Optik darf sich nicht ändern: Screenshot-Vergleich der e2e-Screens (`e2e-screens/`) vorher/nachher, pixelgenau oder mit sehr kleiner Toleranz. Abweichungen erklären.

### Paket 6 — Bündel & Laden
1. `React.lazy`/dynamischer `import()` für Kapitel-Grafik (`HandArtA/B`, `ChapterArt`, `OrchardArt`, `VineyardArt`, Hintergründe) und selten genutzte Fenster (Fest, Album, Projekte, Sammlung, Herausforderungen, Rechtliches, Spielstand).
2. Schriften: nur `woff2` in Precache und CSS (doppelte `.woff` raus), `font-display` prüfen.
3. Ziel: Start-Chunk < 450 KB (≈ < 140 KB gzip). Vorher/nachher in `docs/cleanup/bundle-after.txt` und im PR.
4. Offline-Fähigkeit bleibt: Alle Chunks im Precache, E2E im Offline-Modus (Playwright `context.setOffline(true)` nach dem ersten Laden).

### Paket 7 — Altlasten & Tests
1. Toten Code entfernen. Prüfen, was nirgends mehr genutzt wird (`OBSIDIAN_PACKS` „@deprecated“, `waterReminderDelay` nach `notify.ts`, `nextPrestigeEmbers`, `prestigeMinEmbersForRun` …).
2. Battle-Pass/„Gartenwoche“: Code nur **benennen**, nicht entfernen. Ob er bleibt, entscheidet der Nutzer.
3. Testlücken schließen: Komponenten-Tests sind nicht nötig. Für jede Datei in `src/game/` mit Logik ohne Test eine kurze Testdatei.
4. `README.md` (Code-Aufbau-Tabelle) aktualisieren.

## Abschluss
- Balance-Vergleich vorher/nachher **identisch** (Beleg im letzten PR).
- Bündel vorher/nachher, größte Datei vorher/nachher.
- Liste der umbenannten gespeicherten Felder (alt → neu) und der neue Speicherschlüssel.
- `CLAUDE.md`: Ausnahme-Absatz gelöscht, Migrationsregel wieder aktiv.
- Was übersprungen wurde und warum. Offene Risiken für Spielstände.
- Kurzer Bericht an den Nutzer. Danach kann `docs/prompts/englisch.md` starten.
