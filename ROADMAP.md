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
14. ✅ **Update-Runde „Kapitel 3“:**
    - **Gartenjahr-13-Hänger behoben:** *Nachbarschaftshilfe* (nur im ersten Durchgang, Gartenjahr 11–14, bis ×2,6 Ernte), Orangerie ab Gartenjahr 13, Sprösslinge ab Jahr 22 linear. Sim Regular: keine Saison > ~4 h zwischen Jahr 11 und 14, 1. Tiefer Winter Tag 7–9, Sprösslings-Laden voll ~Tag 80–85. Eine generell flachere Kurve wurde verworfen: sie macht den Tiefen Winter zur Farm-Schleife (bis 7× pro Tag).
    - **Kapitel-Baukasten** (`src/game/chapters.ts`): neue Kapitel sind nur Daten (10 Bereiche, Texte, Grafik). Streuobstwiese umgezogen, **Kapitel 3 Weinberg** (ab 1. Generation) mit Terrassen, 10 Bereichen, Währung Trauben, Brief von Tante Hilde und **Weinlese**-Minispiel (Timing-Tippen, 1×/h).
    - **Oma Ilse** pflegt alle Kapitel (bezahlt in Obst), Jonas nur noch den Garten; beide mit Sprechblasen.
    - **Meilenstein-Truhen** (neuer Lebenszeit-Rekord je Bereich → Zufallsbelohnung), **Pflanzenbuch-Sets** (+2 % je komplettem Bereich), **Omas Tagesrezept**, **Regenbogen** (×5 für 60 s) / **Sternschnuppe** (Wunsch), **Messing-Gießkanne** (1 verpasster Tag/Woche zählt), **Größter Kürbis** (wöchentliche Offline-Vereinsrunde gegen 9 Nachbarn, Samen-Preise).
    - **Grafik:** Bäume nach echtem Kalender (Blüte, Laub, Schnee — Garten und Obstwiese), Zeitraffer-Wachsen beim Stufen-Sprung, pickende Hühner, Bienenflug, Glühwürmchen und Igel nachts, Morgennebel, Gartenstil-Vorschau live auf der Karte, **Foto-Modus** (Postkarte speichern/teilen).
15. Multiplayer-Architektur (Kleingartenverein mit echtem Backend; Kürbis-Runde umstellen).
16. Store-IAP, Impressum-Daten, Namensprüfung „Gartenerbe“, Store-Assets, Soft-Launch. Vor Launch: `STORE_ENABLED` prüfen (Platzhalter).

## 5-Jahres-Plan (Inhalt)

- Ein Kapitel trägt ~6–10 Wochen neue Ziele; Feste erneuern sich jährlich.
- Ziel: **10–12 große Kapitel** in 5 Jahren (≈ alle 4–6 Monate), dazwischen je ein System-/Fest-Update. Ohne Zwischen-Updates wären ~20 Kapitel nötig.
- Kapitel-Ideen in Reihenfolge: 4 Bauernhof (Tiere), 5 Imkerei am Waldrand, 6 Teich & Fischerhütte, 7 Kräuterapotheke, 8 Botanischer Garten (Gewächshäuser), 9 Alpen-Alm, 10 Lavendelfeld (Provence-Reise), 11 Japanischer Garten, 12 Gartenschau (Finale).
- Freischaltung staffeln über Prestige-Ebenen (Tiefer Winter / Generation N), damit jedes Kapitel ein neues Ziel nach einem Reset ist.

## Ideen-Backlog (nächste Updates)

- Kapitel 4 *Bauernhof* (Daten im Kapitel-Baukasten).
- Echter Online-Wettbewerb für den Kürbis (mit Multiplayer-Backend).
- Ilse-/Jonas-Geschichten als kurze Briefe im Notizbuch.
- Gartenstile für Kapitel-Karten.
- Saisonaler Pass bleibt bewusst aus — Gartenwoche + Feste reichen.
