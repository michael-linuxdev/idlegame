# Gartenerbe — Roadmap & Produktvermerke

Stand: 2026-11-08 (Update-Runde „Mehr Garten“).

## Produkt

- **Ein Spiel, ein Thema: Gartenerbe.** Untertitel: *Vom Schrebergarten zum Gartenpark.*
- Garten-Tycoon im Idle-Format. Alle früheren Themen (TurmFarm, Tokenhalle, MeinHafen, Fantasy-Festung, Orbit Rack, Brauerei) sind eingestellt.
- Domain bleibt: https://idlegame.micana.de. Alte Spielstände werden nicht übernommen.

## Erzählung

- Du erbst Omas verwilderten Schrebergarten. **Omas Notizbuch** ist die Erzählstimme (Einführung, Meilensteine, Freischaltungen).
- Bogen: Parzelle → Gärtnerei → Hofladen → Schaugarten / Gartenpark.
- Gesperrte Plätze sind **Wildnis** (Brombeeren, Brennnesseln, Gerümpel): Freischalten = roden und anlegen.
- **Prestige = Saisonende** (Winterruhe → neues Gartenjahr). Saison / Jahr / Ära im Langzeit-Loop folgen daraus.

## Begriffe (Zielbild)

| Rolle | Begriff |
|---|---|
| Laufende Währung | Ernte |
| Meta-Währung (überlebt Prestige) | Erbstücke |
| Premium | Samen |
| Prestige | Saisonende |

Module (10 Plätze, G1 → G10): Gemüsebeet, Kompost, Kräuterspirale, Beerenhecke, Obstwiese, Bienenstock, Hühnerstall, Gewächshaus, Hofladen, Orangerie. Regentonne, Teich und Laube sind Deko auf der Karte.

Weitere Begriffe: Gärtnerstufe (Spieler-Level), Gießen (Burst), Kleingartenverein (Clan), Markt (Shop), Omas Truhe (Meta-Shop), Gartenstile (Skins), Sonnenfenster (Blitz-Event), Erntefest (Wochenend-Event), Tägliche Gartenrunde (Daily).

## Balance (Stand nach Sim-Pass)

Werkzeug: `npm run balance -- <engaged|regular|casual> <stunden>` — spielt die echte Spiellogik headless mit virtueller Uhr (`SUMMARY=1` für eine Zeile, Knöpfe aus `BALANCE` per Env überschreibbar).

- Saisonende-Schwelle: 25 Mio Ernte · 3,2^Saison bis Gartenjahr 13, danach ·1,12 je Saison (angehoben, weil Meilenstein-Sprünge ×2 bei Stufe 25/50/100/… die Produktion verdoppeln).
- Überraschungs-Krümel (alle 5 Ausbauten / Jackpot) nur bei Einzelkäufen und ohne Frühlingsschub-Anteil — sonst schaukeln Helfer, Max-Kauf und Turbo sie exponentiell auf.
- Auszahlung relativ zur Schwelle (100 · 1,12^Saison Erbstücke an der Schwelle, √-Bonus bis 4×, danach flach) → kein Saisonende-Spam.
- Gartenjahr-Tore: Obstwiese ab Jahr 2, Bienenstock 3, Hühnerstall 5, Gewächshaus 7, Hofladen 10, Orangerie 14.
- Ergebnis nach Update-Runde (Sim 14 Tage): Dauerspieler erstes Saisonende 50 min, Regular 45 Saisons / Tiefer Winter Tag 9, Casual 37 Saisons.
- Ergebnis vorher (Sim, 30 Tage): Dauerspieler erstes Saisonende ~50 min, keine Saison < 20 min; Regular (15 min alle 2 h) 5/4/2 Saisons an Tag 1–3, Gartenpark (alle 10 Bereiche) an Tag 5; Casual Tag 8; danach ≈ 1 Saisonende pro Tag.
- Tiefer Winter ab Gartenjahr 15: Sprösslinge = 2 · (Jahr − 13)^1,3; Sim-Policy: Tiefer Winter, sobald eine Saison > 18 h dauert.

## Prinzipien

- DE-UI; Bau-Karte; echtes Idle; keine Energy-Walls; helle, lesbare UI.
- Sichtbares Wachstum: jedes Modul hat mehrere Ausbaustufen in der Grafik.
- Werbung nur rewarded/optional; Werbefrei-Kauf. IAP nur über Stores. Analytics später.
- Opt-in **Playtest-Log** lokal (Menü → Export JSONL); Standard aus; kein Remote-Tracking.
- Engagement-Horizont ~5 Jahre (Lauf → Saisonende → Saison/Deep → Jahr-Ziele → Ära).

## Pipeline

1. ✅ **Aufräumen:** nur noch ein Thema; Tokenhalle/Arcade, Theme-Weiche und Alt-Speicherstände entfernt.
2. ✅ **Texte & Erzählung:** Begriffe, 10 Garten-Module (neue IDs), Omas Notizbuch als FTUE, Saisonende.
3. ✅ **Karte:** Garten-Grundstück (Draufsicht / leichtes Iso), Wildnis auf gesperrten Plätzen, Plätze frei vom HUD.
4. ✅ **Modulgrafik:** 4–5 sichtbare Ausbaustufen pro Modul.
5. ✅ **HUD:** drei Zonen, Event-Leiste, keine Überlappungen (verwaistes ×, abgeschnittene Texte, widersprüchliche Ziele).
6. ✅ **Politur:** Schriften lokal (offline), Garten-Icon, Tages- und Jahreszeiten-Stimmung.
7. ✅ **Balance-Pass** mit Simulator (siehe oben).
8. ✅ **Story & Look:** Omas Briefe (13 Seiten), Saisonende-Zeremonie, Papier-Panels, Garten-Sounds, Datenschutz.
9. ✅ **Tiefer Winter** (2. Prestige-Stufe ab Gartenjahr 15): Sprösslinge → Tiefe Wurzeln, Winterschutz, Saatgutvorrat, Gartenwissen. Sim 90 Tage: Regular alle 4–6 Tage ein Tiefer Winter, Dauerspieler hat den Laden nach ~80 Tagen voll. Jahres-/Ära-Ebene bleibt im Speicherformat, ohne UI.
10. ✅ **Politur-Runde 2:** Leistung (−61 % CPU im Leerlauf), Barrierefreiheit (axe: 0 WCAG-A/AA-Verstöße, Zoom erlaubt), Rodungs- und Ernte-Animationen, Store-Material in `docs/store/`.
11. ✅ **Bindung:** Besucher im Garten, Pflanzenbuch (24 Sorten, dauerhafte Boni bis ~+36 %), Hofladen-Bestellungen, Wetter mit Vorhersage, Omas Wochenplan, Erinnerungen (Web-Notification, solange die App im Hintergrund läuft), Glücksrad beim Saisonende, Ausbaustufen-Konfetti + Fortschrittsbalken, Comeback-Brief nach ≥ 2 Tagen.
12. ✅ **Launch-Vorbereitung:** Spielstand sichern (Code/Datei), Omas Hinweise für alle Systeme, Markt ohne Attrappen (Echtgeld/Werbung hinter `STORE_ENABLED`), Gartenstile mit eigener Deko, Naturgeräusche, E2E-Test in CI, interne Namen auf Deutsch, 0 Lint-Warnungen.
13. ✅ **Update-Runde „Mehr Garten“:**
    - **Gegen Langeweile nach dem Saisonende** (Playlog: jedes Beet wieder einzeln hochtippen): Gartenhelfer *Jonas* (Erbstücke, 5 Stufen, bleibt für immer, arbeitet auch offline, läuft sichtbar über den Weg), Mengenkauf ×1/×10/Max + „Alles ausbauen“, Meilenstein-Sprünge ×2 (Sterne am Schild, Toast), Frühlingsschub ×3 für 2 Minuten nach jedem Neubeginn.
    - **Kapitel 2 — Opas Streuobstwiese:** zweite Karte mit 10 Bereichen (Apfel … Obstmarkt), eigene Währung Obst, läuft parallel und offline, +0,4 % Garten-Ernte je Obstwiesen-Stufe, Brief von Oma. Frei nach dem 1. Tiefen Winter.
    - **Generationen** (3. Prestige-Ebene ab 3 Tiefen Wintern): Vermächtnis → Familienschatz ohne Obergrenze (Familiensinn, Obstbau-Tradition, Wurzelwerk, Hausrezept, Grüner Daumen), Stammbaum.
    - **Saisonale Feste nach echtem Kalender** + Zwischenfeste (immer eins aktiv): Raunächte, Schneeglöckchenfest, Frühlingsfest, Blütenfest, Sommerfest, Sonnenblumentage, Erntedank, Laternenfest, Advent. Festmarken aus normalem Spiel, Festladen mit 13 Festsorten (Pflanzenbuch), Festschub, Erbstück-Kiste, Samen; Fest-Gartenstile und Festkorb als kostenpflichtige Extras (Samen). Eigene Karten-Deko je Fest. Gartenwoche bleibt, kein zusätzlicher Pass.
    - **UI/UX:** Event-Pillen umbrechen statt abschneiden (Saisonende-Kachel), „78 % geschafft“ statt „fast · 22 %“, lange Fenster scrollen, Markt-Platzhalter wieder sichtbar und gekennzeichnet, „Nach Updates suchen“ + „Jetzt aktualisieren“ mit Versionsanzeige im Menü.
14. Multiplayer-Architektur (Kleingartenverein mit echtem Backend).
15. Store-IAP, Impressum-Daten, Namensprüfung „Gartenerbe“, Store-Assets, Soft-Launch. Vor Launch: `STORE_ENABLED` prüfen (Platzhalter).

## Ideen-Backlog (nächste Updates)

**Bindung / „noch eine Runde“**
- Kapitel 3 *Weinberg* (gleiches Muster wie die Streuobstwiese) mit Weinlese-Minispiel (Timing-Tippen).
- Meilenstein-Truhen: alle Sterne eines Bereichs → Kiste mit Zufallsbelohnung.
- Pflanzenbuch-Sets: komplette Reihe (z. B. alle Kräuter) → Set-Bonus.
- Omas Tagesrezept: drei Zutaten aus verschiedenen Bereichen liefern.
- Zweiter Helfer (Oma Ilse) nur für die Streuobstwiese, mit eigenen Sprüchen.
- Seltene Himmelsereignisse: Regenbogen (×5 für 60 s), Sternschnuppe nachts (Wunsch wählen).
- Streak-Schutz „Messing-Gießkanne“ (ein verpasster Tag pro Woche).
- Kleingartenverein-Wettbewerb „Größter Kürbis“ (asynchron, Bestenliste).

**Grafik**
- Bäume nach echtem Kalender: Blüte im Frühling, Laub im Herbst, Schnee im Winter.
- Zeitraffer-Animation beim Stufen-Sprung (Pflanze wächst sichtbar nach).
- Tiere mit Wegen: Hühner picken, Schafe ziehen über die Wiese, Bienen fliegen zum Stock.
- Glühwürmchen und Igel nachts, Nebel am Morgen.
- Gartenstil-Vorschau live auf der Karte vor dem Kauf.
- Foto-Modus: Garten als Postkarte exportieren und teilen.

## Fertig-Produkt?

Noch **nicht**. Soft-Launch-ready erst nach: Garten-Erzählung und -Grafik, stabile Upgrade/Shop-Loops, Balance, Multiplayer-MVP oder klarer Solo-Mode, Store-IAP, Privacy/Impressum.
