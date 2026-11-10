# Prompt: Runde „Sichern, Bündeln, Belohnen, Unterscheiden“

> Auftrag an eine Claude-Code-Sitzung im Repo `idlegame` (2026-11-10).
> Grundlage: Durchsicht vom 2026-11-10 (ROADMAP, Balance-Berichte, Playtest-Befunde, Code).
> Umsetzung und Messwerte: `ROADMAP.md` (Pipeline 15h, „Balance“), `docs/sicherung.md`,
> `docs/systeme-inventur.md`, `docs/kapitel/balance-bericht.md` („Runde 4“).

Vier Pakete, genau in dieser Reihenfolge. Jedes Paket ist erst fertig, wenn
seine Abnahme-Liste erfüllt ist. Ein Paket, das nicht fertig wird, bleibt ganz
weg — keine halben Pakete im Hauptzweig.

## Harte Regeln (gelten für alle Pakete)

1. Zwei Tester spielen mit echten Ständen. Kein Spielstand darf verloren gehen,
   kein Neustart nötig werden. Felder im `GameState` nie umbenennen oder
   entfernen. Jedes neue Feld: Startwert in `parseGameState` bzw.
   `parseExpansion`, Name nach `docs/cleanup/namen.md`, Eintrag bei
   `ADDED_AFTER_V1` in `src/test/migration.test.ts`. Lösungen ohne neues Feld
   bevorzugen. Keine inkompatible Änderung; sonst anhalten und begründen.
2. Kein Tester steht nach dem Update schlechter da: für jede Fixture direkt
   nach dem Laden Ernte/s, Ertrag je Kapitel, alle Währungen, offene Kapitel
   und laufende Timer gleich oder besser. Je Paket ein Test.
3. Keine neuen Systeme, keine neuen Währungen, keine neue Quelle für
   „+x % Ernte im Garten“.
4. Nicht anfassen: `DISTRIBUTION`, `TEST_PHASE`, `STORE_ENABLED`, Preise,
   Kapitel-IDs, `LATER_RULE`, `laterScale`, `LATER_GARDEN_BONUS`,
   `CHAPTER_BONUS`, Projekt-Boni. „×5“ und „Max“ bleiben entfernt.
5. Kein Netzwerk (kein Backend, kein Drittdienst, kein Konto, keine neue
   Abhängigkeit mit Netzwerkzugriff). Neue npm-Pakete nur mit Begründung.
6. Keine Dark Patterns: nichts gegen Echtgeld oder Samen überspringbar, keine
   Strafen für verpasste Tage, keine zusätzlichen Benachrichtigungen.
7. Texte in `src/i18n/de/` und `src/i18n/en/`, Glossar, Ton von Omas
   Notizbuch, nie beim Import aus `t` kopiert; nur Spielregel-Sätze
   (`docs/kapitel/entschaerft.md`).
8. Balance nur mit Messung. Vor der ersten Änderung die Basis festhalten, nach
   jedem Balance-Paket neu messen, beides in `ROADMAP.md` („Balance“):
   ```bash
   SUMMARY=1 npm run balance -- engaged 336
   SUMMARY=1 npm run balance -- regular 336
   SUMMARY=1 npm run balance -- casual 336
   GEN=1 CHAPTERS=1 CHAPTER_MANUAL=0 SUMMARY=1 npm run balance -- regular 43800
   COARSE_AFTER_D=30 GEN=1 CHAPTERS=1 CHAPTER_MANUAL=0 SUMMARY=1 npm run balance -- engaged 8760
   ```
   Korridor: Regular Kapitel 13 im Monat 9–12, Kapitel 50 nach 4–5 Jahren,
   Abstand ab Kapitel 13 im Mittel 4–6 Wochen; Dauerspieler höchstens ein
   Kapitel in zwei Wochen; Casual nach zwei Jahren mindestens Kapitel 20.
   `scripts/balance/tempo.test.ts` bleibt grün.
9. Nach jedem Paket `npm test`, `npm run lint`, `npm run build`, `npm run e2e`
   grün (0 Lint-Warnungen, axe 0 in beiden Sprachen, keine abgeschnittenen
   Texte). Tests nie überspringen, abschwächen oder löschen.
10. Ein Commit je Paket, deutsche Nachricht. Kein Pull Request ungefragt.
11. Erweist sich ein Punkt als schlechte Idee: weglassen und begründen, keine
    Zielwerte verschieben.

## Paket 1 — Automatische Sicherung

1. Automatische Sicherungen in IndexedDB (eigener Speicher), Inhalt wie
   `exportCode`; Anlässe: einmal je Kalendertag beim ersten Speichern, vor
   jedem Tiefen Winter, jeder Generation, jedem Import. Aufbewahrung: letzte 7
   Tages- plus letzte 3 Anlass-Sicherungen; Größenbudget (180 simulierte
   Tage). Fehler stören nie und berühren den Spielstand nie.
2. Wiederherstellen: beim Start (leerer/kaputter Stand) fragen, bevor ein
   neuer Garten entsteht (Datum, Gartenjahr, Kapitelzahl); nie still, nie über
   einen neueren Stand, `saveGuard` beachten; Menü → Spielstand: Liste mit
   „Wiederherstellen“ (Bestätigung, vorher Sicherung des aktuellen Stands).
3. Sicherung außerhalb des Geräts: letzter Export auf dem Gerät (nicht im
   `GameState`); > 14 Tage und seitdem Tiefer Winter, Generation oder neues
   Kapitel → einmal Omas Hinweis mit Knopf zum Teilen/Speichern; höchstens
   einmal in 7 Tagen, nie in der ersten Sitzung, nie über einem offenen
   Fenster; ehrlicher Text zu Handywechsel/gelöschten Browserdaten.
4. Kleines Interface für Sicherungsziele (schreiben, auflisten, lesen), einzige
   Umsetzung: das Gerät. Im Bericht: was für iCloud / Play Games / Backend fehlt.
5. Datenschutztext nur anpassen, wenn er sonst falsch würde (de + en).

Abnahme: Unit-Tests (Rotation, Budget, Anlässe, neuerer Stand, defekte
IndexedDB); E2E Spielstand löschen → Angebot → Wiederherstellen (de + en).

## Paket 2 — Weniger Systeme im Blick, mehr echte Entscheidungen

1. Inventur `docs/systeme-inventur.md` (Ertrag, Aufmerksamkeit, HUD-Ort,
   Entscheidung; alle Quellen aus `multBreakdown`).
2. Eine „Heute“-Karte bündelt Tägliche Gartenrunde, Omas Tagesrezept,
   Tagesziele und Omas Wochenplan; Systeme bleiben im Spielstand getrennt;
   einzelne Pillen und rote Punkte entfallen zugunsten eines Zugangs.
3. HUD-Grenze: höchstens drei Ereignis-Pillen, Vorrang hat, was abläuft
   (Test in `ux.test.ts` und E2E).
4. Samen-Einkommen je Woche (aktiver Spieler) innerhalb ±10 % von
   `docs/store/preise.md` (450–550). Test.
5. Entscheidungen schärfen (Saison-Karten, Wetter): Folge in Zahlen für diesen
   Garten vor der Wahl, ein Satz danach; Simulator „beste Wahl“: keine Option
   > 60 % oder < 5 %, sonst vorhandene Werte angleichen und messen.
6. `featureUnlocks.ts`: neue Spieler sehen die Karte mit dem ersten ihrer
   Systeme, bestehende Stände sofort.

Abnahme: Inventur, Tests zu 3–5, HUD-Screenshots vorher/nachher in
`e2e-screens/`, 14-Tage-Simulation aller drei Profile innerhalb ±5 % der Basis.

## Paket 3 — Ruhezeit: Einsatz zahlt sich sichtbar aus

1. Erledigte Tagesaufgaben der „Heute“-Karte verkürzen die laufende Ruhezeit
   (`DEEP_REST_MS`), je Tag ein fester Betrag, zusammen höchstens 12 h je
   Ruhezeit. Betrag per Simulator; nicht kaufbar.
2. Höchstens ein neues Feld (Startwert 0, beim Tiefen Winter zurückgesetzt);
   eine laufende Ruhezeit wird beim Update nie länger.
3. Anzeige im Saison-Panel: Restzeit, verdiente Verkürzung, heute noch möglich.
4. Simulator-Schalter; voller Korridor; hält der Dauerspieler nicht, Obergrenze senken.

Abnahme: Unit-Tests (Deckel, Zurücksetzen, alte Stände, Uhr zurückgestellt),
Messwerte vorher/nachher in `ROADMAP.md` und `docs/kapitel/balance-bericht.md`.

## Paket 4 — Jeder Bogen spielt sich anders

Eine Regel je Bogen (I: 13–19, II: 20–29, III: 30–39, IV: 40–49) als Daten
und reine Funktionen, Wirkung über `chapterPerSecond`; Entscheidung mit
Preis, jederzeit änderbar, ohne Tipp-Takt oder Anwesenheits-Timer; neutraler
Start = heutiger Ertrag; höchstens +25 % in der Kapitel-Währung; kein
Garten-Bonus, keine Samen, kein Einfluss auf die Freischaltung; Ilse
entscheidet nicht, Hinweis bei offener Wahl; höchstens ein neues Feld für
alle vier Regeln; vorhandene Grafik-Bausteine, < 1 500 SVG-Elemente.
Vorschläge: Patenbeet, Tauschpost, Wasser verteilen, Plan für morgen. Bogen
für Bogen komplett; lieber zwei fertige als vier halbe.

Abnahme je Bogen: Unit-Tests (neutraler Start, Deckel, Wahl ändern, offline =
online), E2E über `?kapitel=` (de + en, Screenshot), Simulator „beste Wahl“
gegen „keine Wahl“: Taktung ±2 %, Korridor hält.

## Abschluss

`ROADMAP.md` (Pipeline, Balance, offene Punkte), `README.md`, ehrlicher
Abschlussbericht im Chat.
