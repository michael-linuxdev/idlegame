# Prompt: Bindungs-Runde „Erste Sitzung, Rückkehr, Abwechslung“

> Diesen Text als Auftrag an eine Claude-Code-Sitzung im Repo `idlegame` geben.
> Grundlage: Analyse vom 2026-11-08 (Code, Balance-Sim 72 h, Browser-Durchlauf iPhone 13).

---

Du arbeitest an **Gartenerbe** (Vite + React + TypeScript, PWA, deutsche UI). Lies zuerst `CLAUDE.md`, `ROADMAP.md` und `README.md`. Ziel dieser Runde: Spieler sollen öfter und länger wiederkommen — durch bessere erste Minuten, klare Rückkehr-Gründe und mehr Abwechslung zwischen Saisons. **Keine** Dark Patterns: keine Echtgeld-Zufallsboxen, keine Streak-Strafen, keine zeitlich begrenzten Kauf-Inhalte, keine Energie-Sperren, keine Benachrichtigungs-Flut.

## Harte Regeln

- **Spielstand-Migration ist aktiv** (`CLAUDE.md`): Felder im `GameState` nie umbenennen oder entfernen. Jedes neue Feld bekommt in `parseGameState`/`parseExpansion` einen Startwert. Bei inkompatiblen Formatänderungen `SAVE_VERSION` erhöhen, Schritt in `MIGRATIONS` ergänzen, Fixture `src/test/fixtures/save-v<N>.json` anlegen; `src/test/migration.test.ts` muss alle alten Fixtures verlustfrei laden.
- Alle Spielertexte in `src/theme/strings.ts` (Zugriff über `t`), auf Deutsch, im Ton von Omas Notizbuch.
- Balance-Änderungen mit `npm run balance` (engaged | regular | casual) prüfen und die Ergebnisse im Abschnitt „Balance“ von `ROADMAP.md` nachtragen.
- Nach jedem Paket: `npm test`, `npm run lint`, `npm run build`, `npm run e2e` — alles grün. E2E (`scripts/e2e/smoke.mjs`) bei Bedarf anpassen, z. B. wenn Fenster später erscheinen.
- Ein Commit pro Paket, deutsche Commit-Nachricht im Stil der bisherigen Historie. Am Ende `ROADMAP.md` um einen Pipeline-Punkt „Update-Runde Bindung“ ergänzen.
- Wenn ein Punkt sich als schlechte Idee erweist (Sim zeigt Spam, Test bricht), lieber weglassen und im Abschluss begründen als erzwingen.

## Befunde, auf denen das aufbaut

- `InstallPrompt` erscheint 0,7 s nach dem ersten Start (`FIRST_LAUNCH_DELAY_MS`) und liegt **über** dem Notizbuch-Fenster „Das erste Beet“. `holdForFtue` deckt nur den FtueCoach ab, nicht das Notizbuch-/Oma-Fenster.
- Nach ~2,5 min zeigt die Zielleiste „Omas Truhe – 4 Schätze bereit“, obwohl noch kein Saisonende stattfand.
- In Minute 1 sind 5 Event-Pillen sichtbar (Rezept/Kochen, Wetter, ×1,44, Belohnen, Gartenrunde); der Multiplikator ×1,44 wird nicht erklärt. `EventPills.tsx` kennt 12 Pillen-Typen.
- Sim 72 h, erstes Saisonende: engaged 60 min, regular 132 min, casual 360 min. Engaged Saison 14 dauert 618 min (Hänger um Gartenjahr 13/14). Orangerie wird in 72 h von keinem Profil erreicht.
- Erinnerungen gibt es nur per Web-Notification, solange die App im Hintergrund läuft, und nur für die Gießkanne.
- Kein Telemetrie-System; nur opt-in lokales Playtest-Log.

## Pakete (in dieser Reihenfolge)

### Paket 1 — Erste Minuten aufräumen
1. **Install-Fenster:** frühestens nach dem ersten Saisonende **oder** ab der zweiten Sitzung zeigen, nie während ein anderes Fenster/Sheet offen ist. Überlappungsfehler beheben (Sperre für *alle* modalen Fenster, nicht nur FtueCoach). Test dafür.
2. **Zielleiste (`nextGoal.ts`):** vor dem ersten Saisonende (`prestiges === 0`) keine Meta-Ziele (Truhe, Tiefer Winter, Kapitel). Nur Ausbau / Anlegen / Saisonende. Unit-Test.
3. **Multiplikator erklären:** Tippen auf den Ertrags-Multiplikator im HUD öffnet eine Aufschlüsselung (welcher Bonus trägt wie viel bei).

### Paket 2 — Systeme nach und nach freischalten
1. Neues Modul `src/game/featureUnlocks.ts`: zentrale Liste, welches System (Pillen, Rezept, Wetter, Kreuzen, Bestellungen, Wetter-Entscheidungen, Kürbis, Feste, Deko, Alben …) ab welcher Bedingung sichtbar wird (Gärtnerstufe, Gartenjahr, Sitzungsnummer). Richtwert: in Sitzung 1 höchstens 2 Pillen; danach etwa ein neues System pro Sitzung bzw. Gartenjahr.
2. Jedes neu freigeschaltete System bekommt einen kurzen Auftritt (Oma-Hinweis über das bestehende `OmaHint`/`hints.ts`-System) und ein „Neu“-Abzeichen bis zur ersten Nutzung.
3. Bestehende Spielstände: alles, was der Spieler laut Spielstand schon benutzt hat, gilt als freigeschaltet (Startwert aus vorhandenem Fortschritt ableiten, nicht leer). Migrations-Test.
4. Sitzungszähler persistieren (neues Feld mit Startwert).

### Paket 3 — Probe-Winter (erstes Saisonende in Sitzung 1)
1. Nur für Gartenjahr 1 eine Sonderschwelle in `economy.ts` (z. B. eigener Knopf in `BALANCE`), so dass engaged das erste Saisonende nach **~15–20 min** erreicht, regular/casual innerhalb ihrer ersten Sitzung bzw. deutlich unter 132/360 min.
2. Auszahlung klein, aber genug für 1–2 Truhen-Käufe. Ab Gartenjahr 2 gilt die bisherige Kurve unverändert.
3. Sim prüfen: kein Saisonende-Spam (keine Saison < ~10 min außer Jahr 1), späteres Tempo unverändert. Zahlen in `ROADMAP.md`.
4. Spieler, die gerade in Jahr 1 stecken, stehen danach evtl. über der Schwelle — das ist gewollt; in der Zeremonie normal behandeln.

### Paket 4 — Kernschleife spürbarer
1. **Bezahlbar-Abzeichen** am Beet auf der Karte; **„Bester Kauf“** (`bestBuy.ts`) als Leuchten auf der Karte.
2. **Meilenstein-Ring** am Beetschild: „noch N bis ★“ (×2 bei 25/50/100 …).
3. **Rodungs-Fortschritt** auf Wildnis-Plätzen (Füllstand bis zur Freischaltung).
4. **Kauf-Kombo:** bei schnellen Käufen hintereinander steigt die Tonhöhe leicht (`sound.ts`), Zahlen-Pops werden größer, kurze Vibration wo verfügbar (`navigator.vibrate`, respektiert Stumm-Schalter und `prefers-reduced-motion`).
5. Leistung prüfen: Ruhemodus (`idle.ts`) darf nicht verschlechtert werden.

### Paket 5 — Rückkehr
1. **Rückkehr-Zettel:** Nach Offline-Zeit ≥ 30 min statt nur der Ernten-Leiste ein Zettel von Oma: was gewachsen ist, wer zu Besuch war, die 3 jetzt bezahlbaren Beete (antippbar), fertige Timer. Ein Tipp zum Einsammeln bleibt.
2. **„Wenn du wiederkommst“-Karte:** bündelt alle laufenden Timer (Kreuzung, Bestellungen, Wetter-Vorhersage, volle Gießkanne, volle Offline-Ernte bei 8 h). Sichtbar im Menü/HUD.
3. **Termin in Sitzung 1:** die erste Saatgut-Kreuzung (4 h) wird als geführter Schritt noch in Sitzung 1 gestartet (FTUE-Beat ergänzen, `ftue.ts`; vorhandene FTUE-Zustände in localStorage dürfen nicht kaputtgehen).
4. **Gartenrunde:** die Belohnung von Tag 7 ab Tag 1 sichtbar machen. Streak bleibt eingefroren statt zurückgesetzt.
5. **Erinnerungen:** Erlaubnis erst nach dem ersten Saisonende anfragen; zusätzlich zur Gießkanne konkrete Anlässe (Kreuzung fertig, Offline-Ernte voll); höchstens 2 pro Tag, nie nachts (22–8 Uhr). Eine Abstraktion schaffen, über die später native lokale Benachrichtigungen der Store-Version laufen können.

### Paket 6 — Saison-Karten
1. Beim Saisonende (nach der Zeremonie, vor/statt Glücksrad — Glücksrad nicht entfernen, nur ab einem bestimmten Gartenjahr durch die Wahl ergänzen) wählt der Spieler **1 von 3 Jahres-Themen**, die für genau ein Gartenjahr gelten, z. B. „Tomatenjahr: Gemüsebeet ×3, Obstwiese −30 %“, „Kompostjahr“, „Bienenjahr“, „Ruhiges Jahr: Offline +50 %, aktiv −20 %“.
2. 10–15 Karten als Daten (eigene Datei), Auswahl gewichtet nach freigeschalteten Beeten, nie zweimal dieselbe Karte direkt hintereinander.
3. Netto leicht positiv, nie eine Falle: Sim mit zufälliger und mit bester Wahl laufen lassen; Tempo-Unterschied dokumentieren.
4. Neues Feld für die aktive Karte mit Startwert `null`; aktive Karte als Pille + im Multiplikator-Aufschlüsselung sichtbar.

### Paket 7 — Lange Ziele & Sammlungen sichtbar
1. **Kapitel-Vorschau:** die Grundstücke-Auswahl (bzw. ein Eintrag im Notizbuch) zeigt schon früh alle Kapitel als Silhouetten mit Freischalt-Bedingung („frei nach dem 1. Tiefen Winter“).
2. **Sammel-Übersicht:** Pflanzenbuch, Gartenbewohner, Jahreszeiten-Album, Erfolge und Kreuzungen auf einer Seite mit Gesamt-Prozent und „noch N bis zum Set“-Hinweisen; das nächste fast vollständige Set darf die Zielleiste speisen (erst ab Gartenjahr 2).

### Paket 8 — Omas Herausforderungen
1. Freiwillige Saisons mit Einschränkung (z. B. „ohne Kompost“, „nur 5 Beete“, „kein Gießen“), freigeschaltet ab einem späteren Gartenjahr. Abschluss bringt einen kleinen **dauerhaften** Bonus und einen Album-Eintrag.
2. Herausforderung ist abbrechbar ohne Verlust des normalen Fortschritts. Klare Zustandsfelder mit Startwerten, Tests für Start/Abbruch/Abschluss.

### Paket 9 — Tempo absichern & messen
1. **Sim-Kennzahl Ereignisdichte** in `scripts/balance/sim.ts`: Zeit zwischen bedeutsamen Ereignissen (Freischaltung, Meilenstein ★, Saisonende, Wahl). Ziel: Sitzung 1 ≤ 90 s, danach ≤ 5 min (Median). In `SUMMARY=1` ausgeben.
2. **Tempo-Test:** Vitest-Test, der eine kurze Sim (engaged, 14 Tage oder so kurz wie zuverlässig möglich) ausführt und fehlschlägt, wenn eine aktive Saison außerhalb eines festgelegten Korridors liegt (Schlafpausen ausgenommen). Den Hänger um Gartenjahr 13/14 für engaged dabei beheben oder begründet tolerieren.
3. **Opt-in-Statistik vorbereiten:** im Playtest-Log (`playtestLog.ts`) die Ereignisse ergänzen, die für Wiederkehr/Abbruch nötig sind (Sitzungsstart/-ende, FTUE-Schritt, erstes Saisonende, Gartenjahr beim letzten Besuch). **Kein** Versand an einen Server in dieser Runde; nur Datenmodell + Export, damit später ein anonymer, einwilligungspflichtiger Upload andocken kann.

## Nicht in dieser Runde
- Gartenbesuch per Code / soziale Funktionen, Fest-eigene Mechaniken, echtes Backend, native Store-Benachrichtigungen (nur die Abstraktion aus Paket 5).

## Abschluss
- Alle vier Checks grün, `ROADMAP.md` aktualisiert (Pipeline-Punkt + Sim-Zahlen vorher/nachher).
- Kurzer Bericht: was gebaut, was bewusst weggelassen und warum, Sim-Zahlen erstes Saisonende und Ereignisdichte vorher/nachher, offene Risiken für bestehende Spielstände.
- Nur auf den zugewiesenen Branch pushen; keinen Pull Request ohne ausdrückliche Bitte.
