# Plan „Nacht 2026-11-09“ — Sicherheit, Langzeit-Log, Bindung

Stand: 2026-11-08 nach UX-Runden #91–#93. Start der Umsetzung: 03:15 (Berlin), ohne Rückfragen.

## Rahmen (Entscheidungen des Nutzers)

- Reihenfolge: **P0 Sicherheit → Bindung** (`docs/prompts/bindung-umsetzen.md`). Sprite-Plan (`docs/sprite-plan.md`, Branch `claude/serene-meitner-eudtdr`) ist **nicht** Teil dieser Runde.
- **`STORE_ENABLED` bleibt `true`** (Markt-Attrappe sichtbar).
- **Gießkanne auffüllen: höchstens 3× pro Tag.**
- **Playtest-Log muss über Monate laufen.**
- Pro Paket ein PR von `claude/lucid-cori-gylbfc`; selbst mergen, sobald `npm test`, `npm run lint`, `npm run build`, `npm run e2e` lokal und CI grün sind. Vor jedem Paket Branch auf aktuellen `main` bringen.
- `CLAUDE.md` gilt: kein Feld im `GameState` umbenennen/entfernen, neue Felder mit Startwert, bei inkompatibler Änderung `SAVE_VERSION` + Migration + Fixture.
- Jeder Merge geht sofort an echte Spieler → Balance-Pakete nur mit Sim-Nachweis; im Zweifel weglassen und begründen.

## Was #91–#93 schon erledigt haben (nicht doppelt bauen)

| Bindungs-Punkt | Stand |
|---|---|
| 1.1 Install-Fenster erst nach 1. Saisonende | ✅ #91 (nur noch prüfen: nie über offenen Fenstern) |
| 1.3 Multiplikator-Aufschlüsselung | ✅ #92 (`MultSheet`, `multBreakdown`) |
| 2 Erste Minuten: wenige Pillen | ◐ #92 (max. 3 sichtbar, Ereignisse blenden später ein) — zentrale Freischalt-Liste, Sitzungszähler, „Neu“-Abzeichen fehlen |
| 4.1 Bezahlbar-Pfeil / 4.3 Rodungs-Fortschritt / Vibration | ✅ #92/#93 |
| 5.1 Rückkehr-Karte | ◐ #92 `WelcomeBack` (≥ 5 min, nur Ernte) — Inhalt (Besuch, bezahlbare Beete, Timer) fehlt |
| Fenster-Stapel, Escape/Zurück, Einstellungen | ✅ #92/#93 (`overlays.ts`, `prefs.ts`) |

## Neue Befunde (Playtest-Log 2026-11-08 + Screenshots 23:03)

Siehe `docs/playtest/2026-11-08-befunde.md`. Kurz: Einzelkauf-Grind (1820 Käufe/64 min, Median 150 ms), Überraschungs-Spam (jeder ~4. Kauf), Gießkannen-Endlosschleife, Saisonende-CTA 15× ohne Abschluss, Reloads zählen als Sitzungen, Log hält nur ~1 h, Export in der iOS-App bricht ab („WebKitBlobResource-Fehler 1“).

---

## Paket A — Export reparieren + Langzeit-Log (PR 1)

A1 **Datei speichern auf iOS:** gemeinsamer Helfer `src/game/saveFile.ts`:
`navigator.share({ files })` wenn `canShare` (iOS: „In Dateien sichern“), sonst `<a download>`; Blob-URL erst nach ≥ 60 s / `pagehide` freigeben. Nutzen in `playtestLog.ts`, `backup.ts`, Foto-Ersatzweg (`GardenExtras.tsx`). Zusätzlich „In Zwischenablage kopieren“ für Log und Spielstand-Code. Unit-Test für den Helfer (Share vorhanden / nicht vorhanden).

A2 **Langzeit-Log in zwei Ebenen** (`playtestLog.ts`):
- Roh-Ereignisse nur der letzten ~48 h (Obergrenze); hochfrequente Ereignisse (`upgrade`, `surprise`, `schub`) nie roh, nur gezählt (je Minute im Roh-Puffer, je Tag in der Zusammenfassung).
- **Tages-Zusammenfassung dauerhaft:** Zähler je Typ und ID, echte Sitzungen (neue Sitzung erst nach ≥ 30 min Pause), Spielzeit, Saisonenden (mit Erbstücken), Gartenjahr, Generation, offene Kapitel, Gärtnerstufe, Ernte/s-Schnappschuss, App-Version. Budget < 2 KB/Tag.
- Speicher: IndexedDB (eigene DB, Spielstand bleibt in localStorage); kleiner localStorage-Fallback.
- Altes Log (localStorage) einmalig übernehmen, nichts verwerfen.
- Export: JSONL mit Kopfzeile (`schema`, App-Version, Zeitraum), dann Tage, dann Roh-Rest.
- Fehlende Ereignisse ergänzen: Deko, Bewohner, Kreuzen, Projekte, Album, Wetter-Entscheidung, Briefe, Jonas/Ilse-Stufe, Kapitel-Ausbau/-Wechsel, Gießkanne auffüllen, Fehler (Error Boundary, `unhandledrejection`).
- Log-Namen auf deutsche Begriffe (`fortress` → `garten`, `ember` → `erbstueck` …), im Export gemappt; alte Einträge beim Einlesen übersetzt.
- Tests: 180 simulierte Tage → Größe unter Budget, Export vollständig, Sitzungszählung mit Reloads.

## Paket B — Spielstand-Schutz & Betrieb (PR 2)

B1 **Downgrade-Schutz:** `loadState` erkennt `saveVersion > SAVE_VERSION` → nur lesen, nie speichern, Hinweis „Bitte aktualisieren“ mit Knopf. Unbekannte Felder beim Speichern unverändert mitschreiben (Durchreichen), damit ältere Clients nichts löschen.
B2 **Ein Tab schreibt:** Web Locks (Fallback `BroadcastChannel`/`storage`-Event); zweiter Tab zeigt „Läuft schon in einem anderen Fenster“ und speichert nicht.
B3 **Fixture mit allen Feldern:** `src/test/fixtures/save-v2-full.json` (alle Felder inkl. Deko, Bewohner, Kreuzen, Projekte, Album, Wetter, Briefe, Pflege) + Test, der für **jeden** Schlüssel eines voll befüllten `GameState` prüft, dass er `parseSave` übersteht.
B4 **`navigator.storage.persist()`** beim Start (einmal), Ergebnis im Log; Erinnerung „Spielstand sichern“ nach großen Meilensteinen für nicht installierte iOS-Spieler.
B5 **Error Boundary:** Fehlerbildschirm mit „Spielstand-Code kopieren“ und „Neu laden“; Fehler ins Log.
B6 **Deploy-Gate:** `deploy-pages.yml` führt lint, test, build, e2e vor dem Deploy aus.
B7 **Gießkanne 3×/Tag:** neue Felder (`waterRefillDay`, `waterRefillsToday`) mit Startwerten; Markt zeigt „noch N heute“; Log-Ereignis; Tests.
B8 **Backup-Bundle:** App-Version + `saveVersion` mitschreiben; Import eines neueren Stands in ältere App ablehnen (verständliche Meldung).

## Bindung (Reihenfolge angepasst)

Tempo-Messung (9.1/9.2) kommt **vor** die Balance-Pakete 3 und 6, damit deren Wirkung messbar ist.

### Paket C — Bindung 1 + 2: Erste Minuten & Freischaltungen (PR 3)
- 1.2 `nextGoal.ts`: vor dem 1. Saisonende keine Meta-Ziele (Truhe, Tiefer Winter, Kapitel). Unit-Test.
- 1.1 Rest: Install-Fenster-Sperre für alle Overlays (über `overlays.ts`) + Test.
- 2.1 `src/game/featureUnlocks.ts` als zentrale Liste; die Einblend-Logik aus #92 dorthin überführen.
- 2.2 Oma-Hinweis + „Neu“-Abzeichen bis zur ersten Nutzung.
- 2.3 Bestehende Spielstände: alles Benutzte gilt als frei (aus Fortschritt abgeleitet). Migrations-Test.
- 2.4 Sitzungszähler persistieren — Sitzung = ≥ 30 min Pause (Reloads zählen nicht; Befund Playtest).

### Paket D — Bindung 9.1/9.2: Tempo messen (PR 4)
- Sim-Kennzahl Ereignisdichte (`SUMMARY=1`), Tempo-Korridor-Test in Vitest, Hänger Jahr 13/14 engaged beheben oder begründet tolerieren.
- Sim-Basiswerte vor allen Balance-Änderungen in `ROADMAP.md` festhalten.
- (9.3 ist durch Paket A erledigt.)

### Paket E — Bindung 4: Kernschleife (PR 5), angepasst an den Playtest
- **Überraschungs-Krümel drosseln:** nicht jeder 5. Einzelkauf, sondern zeitbasiert (z. B. höchstens 1 je 20 s) bzw. zusammengefasst; Sim-Nachweis, dass das Tempo regulärer Spieler gleich bleibt.
- **Gedrückt halten = Dauerkauf** und Max/×5 sichtbarer (gegen 150-ms-Einzeltippen).
- 4.2 Meilenstein-Ring „noch N bis ★“ am Beetschild.
- 4.1 Rest: „Bester Kauf“ als Leuchten auf der Karte.
- 4.4 Kauf-Kombo nur dezent (Ton/Pop), **nicht** als Anreiz zum Schnelltippen; Vibration über bestehende Einstellung.
- 4.5 Ruhemodus nicht verschlechtern (CPU-Messung).

### Paket F — Bindung 3: Probe-Winter (PR 6)
- Sonderschwelle nur Gartenjahr 1 (`BALANCE`-Knopf), engaged ~15–20 min; ab Jahr 2 unverändert. Kein Saisonende < 10 min außer Jahr 1. Zahlen in `ROADMAP.md`.
- Saisonende-CTA (Befund: 15× geöffnet ohne Abschluss): Vorschau „jetzt X Erbstücke · in ~N min Y“ und CTA erst ab sinnvollem Zeitpunkt.

### Paket G — Bindung 5: Rückkehr (PR 7)
- 5.1 `WelcomeBack` erweitern: Besucher, 3 bezahlbare Beete (antippbar), fertige Timer; Schwelle mit `MIN_OFFLINE_CLAIM_AWAY_MS` (15 s) abstimmen.
- 5.2 „Wenn du wiederkommst“-Karte (Kreuzung, Bestellungen, Wetter, Gießkanne, Offline-Korb voll).
- 5.3 Erste Kreuzung als FTUE-Schritt in Sitzung 1 (alte FTUE-Zustände bleiben gültig).
- 5.4 Gartenrunde: Tag-7-Belohnung sichtbar, Streak eingefroren statt zurückgesetzt.
- 5.5 Erinnerungen: Erlaubnis erst nach 1. Saisonende, max. 2/Tag, nie 22–8 Uhr, Abstraktion `notify.ts` für spätere native Version.

### Paket H — Bindung 6: Saison-Karten (PR 8)
- 1 von 3 Jahres-Themen ab einem späteren Gartenjahr, Glücksrad bleibt. 10–15 Karten als Daten, neues Feld Startwert `null`, Pille + `multBreakdown`-Eintrag. Sim zufällige vs. beste Wahl; netto leicht positiv.

### Paket I — Bindung 7: Lange Ziele & Sammlungen (PR 9)
- Kapitel-Vorschau als Silhouetten mit Bedingung; Sammel-Übersicht mit Gesamt-% und „noch N bis Set“ (Zielleiste ab Gartenjahr 2).

### Paket J — Bindung 8: Omas Herausforderungen (PR 10)
- Freiwillige Saisons mit Einschränkung, abbrechbar ohne Verlust, kleiner dauerhafter Bonus + Album-Eintrag. Felder mit Startwerten, Tests Start/Abbruch/Abschluss.

## Abschluss jedes Pakets
1. `git fetch origin main` → Branch auf `main` bringen.
2. Umsetzen, deutsche Commit-Nachricht(en).
3. `npm test`, `npm run lint`, `npm run build`, `npm run e2e` (+ `npm run balance` bei Balance).
4. PR öffnen, CI abwarten, selbst mergen; bei Rot: Ursache beheben, nie Tests abschalten.
5. Kurznotiz in diesem Dokument (✅ / übersprungen + Grund).

## Am Ende
- `ROADMAP.md`: Pipeline-Punkt „Update-Runde Bindung“ + Sim-Zahlen vorher/nachher.
- Bericht: gebaut / weggelassen (mit Grund), Sim-Zahlen erstes Saisonende und Ereignisdichte, Risiken für bestehende Spielstände.

## Fortschritt
- [x] A Export + Langzeit-Log — Abweichung: localStorage (zwei Schlüssel, Budget) statt IndexedDB; Spielstand hat Vorrang (`freePlaytestSpace` bei Platzmangel). Begründung: synchron, testbar, 180-Tage-Test < 2 KB/Tag.
- [x] B Spielstand-Schutz & Betrieb — B4 nur `storage.persist()` (+ Log); Sicherungs-Erinnerung für iOS-Browser verschoben (gehört zu Paket G „Rückkehr“). Fund: `helperCarryMs`/`ilseCarryMs` werden absichtlich nicht geladen (Sekunden Restzeit), im Test als Ausnahme geführt.
- [x] C Erste Minuten & Freischaltungen — Tutorial-Schritt „Verein besuchen“ wird übersprungen, solange der Verein noch zu ist; Wetter wirkt weiter auf die Ernte, nur Pille und Wetter-Frage kommen später.
- [ ] D Tempo messen
- [ ] E Kernschleife
- [ ] F Probe-Winter
- [ ] G Rückkehr
- [ ] H Saison-Karten
- [ ] I Lange Ziele & Sammlungen
- [ ] J Omas Herausforderungen
