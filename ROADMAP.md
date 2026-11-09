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
- **Stand 2026-11-08 (Sim realistisch = Standard, nach Jonas-Neuordnung):** 14 Tage — Dauerspieler erstes Saisonende 60 min, 190 Saisons; Regular erstes 132 min, 62 Saisons, 1. Tiefer Winter Tag 9; Casual erstes 360 min, 28 Saisons, 1. Tiefer Winter Tag 8. 365 Tage (`GEN=1`): Generation 10 (Kapitel 12) Dauerspieler Tag 122, Regular Tag 241, Casual nach Tag 365 (G8 Tag 308). Generationen-Hürde: 3 + N Tiefe Winter (`generationGate`). Die Kapitel-Bedingung „8. Bereich des vorigen Kapitels“ ist nicht simuliert. Ältere Zahlen oben stammen aus dem Krümel-überschätzenden Sim (`SPAM=1`).
- **Jonas (Preise je Ebene):** 50 / 250 / 800 Erbstücke, Stufe 4 = 20 Sprösslinge, Stufe 5 (Profi) = 3 Vermächtnis; 1 Ausbau alle 30 / 12 / 5 / 2 / 0,8 s. Sim (Spieler spart auf Jonas): Regular Stufe 3 Tag 4, Stufe 4 Tag 9, Profi Tag 16; Dauerspieler Profi Tag 7; Casual Stufe 3 Tag 7, Stufe 4/5 Tag 80 (Sim-Casual macht sehr frühe Tiefe Winter mit wenigen Sprösslingen).
- **Jonas-Analyse (Sim, 14 Tage, Saisonenden):** Der Standard-Sim-Spieler kauft einzeln im 5-s-Takt und farmt dabei jeden 5. Kauf einen Überraschungs-Krümel → aktive Spieler ~1,7× überschätzt (Regular 109 statt 63 Saisons; heute Standard, alt: `SPAM=1`). Hands-off-Spieler nur mit Jonas (`LAZY=1 HELPER_FREE=1`): Stufe 1/2/3/4/5 → 37/41/46/49/53 Saisons (Regular), 19/21/23/23/25 (Casual). Mit den alten Preisen kam ein Hands-off-Spieler in 14 Tagen nicht über Stufe 2.
- **Basis vor der Bindungs-Runde (Sim 14 Tage, 2026-11-09, neue Kennzahlen):** aktive Spielzeit je Saison (Nachtpausen nicht gezählt) und Ereignisdichte (aktive Zeit zwischen Anlegen, Meilenstein ★, Saisonende). Dauerspieler: erste Saison 60 min, Saisons 2–14 aktiv 14–138 min, Dichte Sitzung 1 Median 2 min (max 25 min), danach 25 s (p90 4 min). Regular: erste 132 min (27 min aktiv), Dichte Sitzung 1 Median 70 s, danach 15 s. Casual: erste 360 min (8 min aktiv), Dichte 20 s / 15 s. Der „Hänger Jahr 13/14“ (618 min) ist zu 480 min die Nacht; aktiv 138 min → toleriert. Längste aktive Saison des Dauerspielers (491 min) ist die Wand direkt vor einem Tiefen Winter (gewollt). Tempo-Korridor als Test: `scripts/balance/tempo.test.ts`.
- **Probe-Winter (2026-11-09):** nur im allerersten Gartenjahr (kein Tiefer Winter, keine Generation) Schwelle 5 Mio statt 25 Mio, Auszahlung 70 an der Schwelle. Sim 14 Tage: Dauerspieler erstes Saisonende 14 min (vorher 60), 182 Saisons (176), Dichte Sitzung 1 Median 45 s (2 min); Regular 63 Saisons (63), erstes Saisonende nach 15 aktiven Minuten; Casual 28 (27). Verworfen: Auszahlung 45 (Jahr 12 = 388 min aktiv, Regular 56 Saisons) und Probe-Schwelle auch nach Tiefem Winter (Saisons < 6 min).
- **Saison-Karten (2026-11-09):** ab Gartenjahr 4 nach jedem Saisonende 1 von 3 Jahres-Themen (12 Karten, `src/game/seasonCards.ts`), nur angelegte Bereiche, Vorschau ≥ ±0, nie zweimal hintereinander. Sim 14 Tage Saisons (Dauerspieler/Regular/Casual): ohne Karte 169/64/28, Zufall 175/64/29, beste Wahl 182/66/29 (Simulator Standard: beste Wahl). Erste Fassung (×3/×2,5) war mit +19 % (Regular 76) zu stark.
- **Kapitel und Generationen (2026-11-09, Paket 1 Kapitel 13–50):** Der Simulator baut jetzt auch Kapitel aus (`CHAPTERS=1`, Ilse). Befund: Die multiplizierten, ungedeckelten Kapitel-Boni trieben den Garten auf ×10¹², Tiefe Winter und Generationen kamen im Tagestakt (Regular: Kapitel 12 an Tag 84). Umgesetzt: **3 Tage Ruhezeit nach jedem Tiefen Winter** und **Kapitel-Boni addiert**. Ergebnis (5 Jahre, Regular): Kapitel 12 Tag 268, Kapitel 13 Tag 313, danach alle 24–56 Tage, Kapitel 50 Tag 1784; Garten-Bonus der Kapitel ×300. Bericht: `docs/kapitel/balance-bericht.md`, Taktung: `docs/kapitel/plan.md`.
- Tiefer Winter ab Gartenjahr 15: Sprösslinge = 2 · (Jahr − 13)^1,3; Sim-Policy: Tiefer Winter, sobald eine Saison > 18 h dauert.

## Prinzipien

- DE-UI (Ausgangssprache), EN gleichwertig; Bau-Karte; echtes Idle; keine Energy-Walls; helle, lesbare UI.
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
15. ✅ **Migration aktiv + alle Kapitel:**
    - **Spielstand-Migration** (ab 2026-11-08): `SAVE_VERSION`, Migrationskette, Fixtures `src/test/fixtures/save-v*.json`, Sicherungskopie vor jeder Migration und bei kaputtem Stand, Regeln in `CLAUDE.md`.
    - **Kapitel 4–12** im Baukasten: Bauernhof, Imkerei am Waldrand, Teich & Fischerhütte, Kräuterapotheke, Botanischer Garten, Alpen-Alm, Lavendelfeld, Japanischer Garten, Gartenschau (Finale mit Omas Gedenkgarten). Je 10 Bereiche, eigene Währung, Brief, Hintergrund und Grafik (generisches Grafik-System mit 5 Stufen). Freischaltung: Generation N und der 8. Bereich des vorigen Kapitels gepflanzt → über Monate gestaffelt.
    - **Grundstücke-Auswahl** auf der Karte, sobald mehr als zwei Grundstücke offen sind. Test: `?kapitel=all` oder `?kapitel=4,7`.
15b. ✅ **Handgezeichnete Kapitel 7–9** (Kräuterapotheke, Botanischer Garten, Alpen-Alm): 30 eigene Motive mit Stufen + Jahreszeiten (`theme/HandArtA.tsx`, Teile in `HandParts.tsx`), eigene Wildnis, Landschaften (Kräutergarten-Mauer, Palmenhaus + Rondell, Hochalpen), Tierleben (Schmetterlinge, Amsel, Pfau, Murmeltier, Adler). Fix: animierte Tiere in Kapitel 4–9 standen auf der Karte an falscher Stelle. Danach: eigener Weg je Kapitel (`theme/ChapterPaths.tsx`) und **Kapitel 10–12** handgezeichnet (`theme/HandArtB.tsx`: Lavendelfeld, Japanischer Garten, Gartenschau) mit Provence-, Japan- und Festgelände-Landschaft, Tierleben (Bienen, Koi, Reiher, Kirschblüten, Besucher, Ballons). Alle Kapitel 2–12 sind jetzt handgezeichnet.
15c. ✅ **Sparsamer:** Ruhemodus nach 45 s ohne Eingabe (Deko-Animationen pausieren, 1 statt 4 Spieltakte/s, Ertrag unverändert, `game/idle.ts`), Jonas/Ilse laufen per Transform statt left/top. Messung Garten (Chromium, iPhone-13-Format): 13 % → 6 % CPU beim Spielen, 1,4 % im Ruhemodus.
15d. ✅ **Update-Runde „Mehr Leben“:** Deko frei platzieren (16 Stücke, 8 Dekoplätze), Gartenbewohner (12 Tiere, Album im Notizbuch, +1 % je Art), Saatgut kreuzen (12 Kreuzungen, 4 h, +2 % je Kreuzung), Großprojekte über Kapitel (4 Projekte × 3 Abschnitte), Jahreszeiten-Album (12 Ziele, Saison-Deko ab 10 Stempeln), Wetter-Entscheidungen (Sturm/Hitze/Frost), Briefe von Jonas und Ilse (6 Briefe). Alle neuen Felder mit Startwert, keine Migration.
15e. ✅ **UX-Runde** (3 PRs):
    - **Navigation:** untere Leiste Garten · Saison · Markt · Menü (rote Punkte für „bereit“), Menü als gruppiertes Bottom-Sheet mit eigener Einstellungen-Seite, Garten-Tab erneut tippen = Grundstücke wählen. Escape und die Zurück-Taste schließen das oberste Fenster bzw. Panel statt die App zu verlassen (`game/overlays.ts`).
    - **Fenster-System:** ein Ebenen-Satz (`--z-*` in `tokens.css`), Omas Hinweise warten auf offene Fenster und Toasts und stehen neben dem Erklärten, Tutorial-Karte weicht ihrem Ziel aus, Installations-Abfrage erst nach dem 1. Saisonende.
    - **HUD:** Ernte antippen = Aufschlüsselung aller Boni (`multBreakdown`), Pillen mit Namen und „+N“, erste Minuten ohne Ereignisse, „Willkommen zurück“, geschätzte Zeit bis Saisonende, Zahlen „3,11 Mio“.
    - **Karte & Ausbau:** Beet-Schilder mit Name/Stufe/Kauf-Pfeil, Wildnis-Fortschritt, Pflege einklappbar, Max-Vorschau.
    - **Panels:** Saison mit Sprungmarken und festem Winterruhe-Knopf, Markt mit „noch X Samen“, Verein mit eigenem Kürbis.
    - **Große Bildschirme (≥ 900 px):** Karte links, Panel rechts; Tablets dürfen quer; Tastatur G/M/1–9/Esc.
    - **Einstellungen:** Große Schrift, Animationen reduzieren, Vibration (Geräte-Einstellungen, kein Spielstand-Feld).
    - **Tests:** E2E prüft Layout-Regeln (Tutorial/Ziel, Notiz/Fenster, Escape/Zurück, Breitbild) und legt Screenshots in `e2e-screens/` ab (CI-Artefakt).
15e. ✅ **Update-Runde „Bindung“ (Nacht 2026-11-09, Plan `docs/plan-nacht.md`, PRs #94–#102):**
    - **Sicherheit:** Playtest-Log über Monate (Tages-Zusammenfassungen, Roh-Rest 48 h), Export über das Teilen-Menü (iOS), Schutz vor Downgrade und zweitem Fenster, Fehlerbildschirm, `storage.persist()`, Deploy erst nach allen Checks, Gießkanne 3×/Tag.
    - **Erste Minuten:** Systeme nach und nach (`featureUnlocks.ts`, Sitzungszähler), Truhe erst nach dem 1. Saisonende, Probe-Winter (erstes Saisonende Dauerspieler 14 statt 60 min).
    - **Kernschleife:** Krümel-Drossel ab „Max“, „noch N bis ★“, Omas Tipp leuchtet.
    - **Rückkehr:** Willkommen-Karte mit fertigen Dingen und bezahlbaren Beeten, „Bald fertig“, Erinnerungen max. 2/Tag und nie nachts.
    - **Abwechslung & Ziele:** Saison-Karten ab Jahr 4, „Sammlung & Ziele“ mit allen Kapiteln, Omas Herausforderungen ab Jahr 8 (+3 % je geschaffter).
    - **Messen:** Ereignisdichte + aktive Saisondauer im Simulator, Tempo-Korridor-Test.
15f. ✅ **Aufräum-Runde „Klarer Code, klare Namen“ (2026-11-09, Prompt `docs/prompts/aufraeumen.md`):**
    - **Spielstand neu:** Schlüssel `gartenerbe-spielstand-v1`, `SAVE_VERSION = 1`, gespeicherte Felder nach Spielbegriffen (`truhe`, `saisonenden`, `tiefeWinter`, `gartenwoche…` …, Wörterbuch `docs/cleanup/namen.md`), neue Fixture `save-v1.json`. Ab hier gilt die Migrationsregel wieder.
    - **Namen:** keine Bezeichner aus TurmFarm / Orbit Rack / Ash Dominion mehr (Prüftest `legacyNames.test.ts`); CSS-Variablen `--ge-*`.
    - **Aufteilung:** `state.ts` → `src/game/state/*`, `useGame` → `src/game/hooks/*`, Truhe und Feld-Parser eigene Module; keine Datei in `src/game/` über ~550 Zeilen, keine Zirkel-Importe. `GardenMap`/`PrestigePanel` in Teilkomponenten, große Stylesheets nach Bereichen (gebautes CSS byte-gleich), toter CSS-Code entfernt.
    - **Laden:** selten genutzte Fenster als eigene Bündel (Start 777 → 685 kB), nur woff2, Offline-E2E. Balance unverändert (Sim-Vergleich).
15g. ✅ **Englische Fassung „Heirloom Garden“ (2026-11-09, Prompt `docs/prompts/englisch.md`, PRs #112–#117):**
    - **Live-Sprachwechsel** ohne Neuladen (`t` als Proxy, `useLocale()`); Sprache aus Browser (`de*` = Deutsch, sonst Englisch), Umschalter „Sprache / Language“ (Einstellungen → Anzeige), Wahl auf dem Gerät, nicht im Spielstand; `?lang=en|de`. Englisch lädt nur bei Bedarf (32 kB gzip), Start-Chunk +1,9 kB gzip.
    - **Alles übersetzt:** Oberfläche, Systeme, alle Briefe (Oma, Jonas, Ilse, Kapitel 2–12), 120 Bereiche, Sorten, Bewohner, Feste mit Erklärung, Datenschutz; Begriffe und Titel im Glossar `docs/i18n/glossar.md`. Zahlen `K/M/B/T` vs. `Tsd/Mio/Mrd`, Mehrzahl über `Intl.PluralRules`.
    - **Prüfungen:** gleicher Typ `Strings` für beide Sprachen, gleiche Schlüsselbäume, keine Texte im Code, keine eingefrorenen Texte beim Import (statisch + Pseudo-Sprache), E2E komplett auch auf Englisch, axe 0 Verstöße (WCAG 2.0/2.1 A/AA, beide Sprachen), Fenster-Durchsicht ohne abgeschnittene Texte (`npm run screens -- en`).
    - **Store:** `docs/store/listing.en.md`, englische Screenshots und Feature-Grafik. Offen: Markenrecherche „Heirloom Garden“.
16. Multiplayer-Architektur (Kleingartenverein mit echtem Backend; Kürbis-Runde umstellen).
17. Store-IAP, Impressum-Daten, Namensprüfung „Gartenerbe“ und „Heirloom Garden“, Store-Assets, Soft-Launch. Vor Launch: `STORE_ENABLED` prüfen (Platzhalter) **und `DISTRIBUTION = 'store'`** in `src/game/distribution.ts` (schaltet den Installations-Hinweis der Web-Fassung ab; ein Test erzwingt das, sobald eine Store-Hülle im Repo liegt).

## 5-Jahres-Plan (Inhalt)

- Ein Kapitel trägt ~6–10 Wochen neue Ziele; Feste erneuern sich jährlich.
- Ziel: **10–12 große Kapitel** in 5 Jahren (≈ alle 4–6 Monate), dazwischen je ein System-/Fest-Update. Ohne Zwischen-Updates wären ~20 Kapitel nötig.
- Kapitel 2–44 sind gebaut (Welle 1 von Kapitel 13–50: Gemeinschaftsgarten, Klostergarten, Schlossgarten, Baumschule, Moor- und Heidegarten; Welle 2: Deichgarten, Spreewald, Cottage-Garten, Tulpenfelder, Artischockeninsel, Beerenwald, dazu das Großprojekt „Omas Gartenroute“ für Bogen I; Welle 3: Andalusischer Patio, Korkeichenhain, Paprikafelder, Steinfelder von Aran, Rosental, Pistazienhain auf Ägina, dazu das Großprojekt „Omas Tauschpost“ für Bogen II; Welle 4, Beginn Bogen III „Wo die Samen herkommen“: Kartoffeln der Anden, Milpa in Mexiko, Kaffeewald in Äthiopien, Reisterrassen auf Bali, Gewürzgarten in Kerala; Welle 5, Abschluss Bogen III: Dattel-Oase in Marokko, Kakaogarten in Ghana, Buschgarten in Australien, Farnwald in Neuseeland, Kimchi-Garten in Korea, dazu das Großprojekt „Omas Herkunftsbeet“ für Bogen III; Welle 6, Beginn Bogen IV „Saatgut für morgen“ mit Notizen von Mila: Dachgarten, Schulgarten, Waldgarten, Samenbank, Klimagarten). Plan, Geschichte und Wellen für 45–50: `docs/kapitel/plan.md`.
- Freischaltung staffeln über Prestige-Ebenen (Tiefer Winter / Generation N), damit jedes Kapitel ein neues Ziel nach einem Reset ist.

## Ideen-Backlog (nächste Updates)

- Kapitel 18–50 in Wellen nach `docs/kapitel/plan.md` (nächste: Welle 2, Kapitel 18–23).
- Echter Online-Wettbewerb für den Kürbis (mit Multiplayer-Backend).
- Ilse-/Jonas-Geschichten als kurze Briefe im Notizbuch.
- Gartenstile für Kapitel-Karten.
- Saisonaler Pass bleibt bewusst aus — Gartenwoche + Feste reichen.
