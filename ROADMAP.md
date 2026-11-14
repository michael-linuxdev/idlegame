# Gartenerbe — Roadmap & Produktvermerke

Stand: 2026-11-10 (Runde 4: Sichern, Bündeln, Belohnen, Unterscheiden).

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

Weitere Begriffe: Gärtnerstufe (Spieler-Level), Gießen (Burst), Kleingartenverein (Clan), Markt (Shop), Omas Truhe (Meta-Shop), Gartenstile (Skins), Sonnenfenster (Blitz-Event), Erntefest (Wochenend-Event), Tägliche Gartenrunde (Daily), Wintervorrat (Sprösslinge aus Saisonenden in der Ruhezeit nach dem Tiefen Winter).

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
- **Runde 4 „Sichern, Bündeln, Belohnen, Unterscheiden“ (2026-11-10) — Basis vor der ersten Änderung** (Commit bb5054f, Befehle aus `docs/prompts/runde-4.md` Regel 8; Casual 2 Jahre: `GEN=1 CHAPTERS=1 CHAPTER_MANUAL=0 SUMMARY=1 npm run balance -- casual 17520`):

  | Messung | Ergebnis |
  |---|---|
  | Dauerspieler 14 Tage | 120 Saisons, erstes Saisonende 14 min, Tiefe Winter Tag 3/7/12 |
  | Regular 14 Tage | 67 Saisons, erstes 120 min, Tiefe Winter Tag 10/13 |
  | Casual 14 Tage | 29 Saisons, erstes 180 min, Tiefer Winter Tag 8 |
  | Regular 5 Jahre (Kapitel, nur Ilse) | K12 Tag 263, **K13 Tag 309** (Monat 10), K20 498, K30 837, K40 1268, **K50 Tag 1781** (4,9 J.); Abstand ab K13 24–55 Tage, **Ø 39,8** (5,7 Wochen); Tag 730: K27 |
  | Dauerspieler 1 Jahr (grob ab Tag 30) | K13 Tag 296, K14 318, K15 340, K16 364 — Abstand 22–24 Tage |
  | Casual 2 Jahre (zusätzlich, für „Casual ≥ K20“) | K12 Tag 317, K13 369, K20 585, **Tag 730: K24** |

  Nach Paket 2 (Heute-Karte, HUD-Grenze, Hitzewelle +20 % → +16 %): 14 Tage aller drei Profile **identisch** mit der Basis (der Simulator entscheidet Wetter nur mit `WEATHER=…`; die Wahl-Messung steht in `docs/systeme-inventur.md`).

  Paket 3 (Ruhezeit verkürzen: je erledigtem Tag −4 h, höchstens −12 h je Ruhezeit). Vorher = Profile holen Tagesziele ab, aber ohne Verkürzung (`TASKS=1 REST_DAY_H=0`); nachher `TASKS=1` (Spielwert 4 h):

  | Messung | vorher | nachher |
  |---|---|---|
  | Regular 5 Jahre | K13 Tag 313, K50 Tag 1784 (4,9 J.), Abstand 24–56 (Ø 39,8 Tage) | **K13 Tag 295** (Monat 9,7), **K50 Tag 1702** (4,7 J.), Abstand 24–53 (**Ø 38,0 Tage** = 5,4 Wochen) |
  | Dauerspieler 1 Jahr | K13 Tag 291, Abstand 21–25 | **K13 Tag 266**, Abstand **21–24 Tage** (höchstens 1 Kapitel in 2 Wochen ✓) |
  | Casual 2 Jahre | K13 Tag 374, Tag 730: K23 | K13 Tag 372, **Tag 730: K23** (≥ K20 ✓) |
  | Dauerspieler 14 Tage | 112 Saisons, Tiefe Winter Tag 3/8/11 | 132 Saisons, Tiefe Winter Tag 3/6/9/13 |
  | Regular / Casual 14 Tage | 66 / 28 Saisons | unverändert (der erste Tiefe Winter kommt vor dem Ende einer Ruhezeit nicht in Frage) |

  Ohne `TASKS` (Standard, `tempo.test.ts`) rechnet der Simulator wie vorher.

  Paket 4 (Bogen-Regeln, `ARC=best` gegen `ARC=none`, beide mit `TASKS=1`):

  | Messung | keine Wahl | beste Wahl | Abweichung |
  |---|---|---|---|
  | Regular 5 Jahre | K13 295, K20 480, K30 810, K40 1218, K50 1702, Abstand Ø 38,0 | K13 295, K20 483, K30 813, K40 1223, K50 1707, Abstand Ø 38,2 | ≤ 0,6 % |
  | Dauerspieler 1 Jahr | K13 266, K17 353, Abstand 21–24 | K13 266, K17 354, Abstand 21–24 | ≤ 0,3 % |
  | Casual 2 Jahre | K13 372, Tag 730: K23 | K13 372, Tag 730: K23 | 0 |
  | Garten-Bonus der Kapitel (Regular, 5 J.) | ×301,9 | ×302,7 | +0,3 % (nur über mehr Stufen) |

  „Keine Wahl“ ist Tag für Tag identisch mit dem Lauf nach Paket 3 (neutraler Start). Korridor hält.

  Paket 5 (Sturm: Hecke als Windschutz, Spätfrost: Glas schützt; Nutzerentscheid 2026-11-10). Der Standard-Simulator entscheidet kein Wetter, darum mit `WEATHER=best TASKS=1`, alte gegen neue Wetter-Regeln:

  | Messung | alt | neu |
  |---|---|---|
  | Regular 5 Jahre | K13 291, K50 1702, Abstand Ø 38,1 | K13 294, K50 1709 (4,7 J.), Abstand 24–54, Ø 38,2 |
  | Dauerspieler 1 Jahr | — | K13 268, Abstand 21–24 |
  | Casual 2 Jahre | — | Tag 730: K24 |
  | 14 Tage ab Juni (Saisons D/R/C) | 121 / 57 / 27 | 127 / 63 / 28 (das alte „Sichern“ nahm 10 min aus dem Korb) |

  Wahl „riskieren“ zusammen über alle Profile: Sturm 36 %, Spätfrost 54 %, Hitzewelle 34 % (vorher 0 / 0 / 100 %). Saison-Karten „Faktor nach Anteil“ gemessen und weggelassen (`docs/systeme-inventur.md`).

  Saison-Karten „Ausbau statt Ertrag“ (Nutzerentscheid): Bereichs-Themen −40 % Ausbaukosten im eigenen, +25 % im Gegenspieler-Bereich; Fleißiges Jahr offline −40 % → −10 %. „Beste Wahl“ (mit Abwesenheit): alle häufig angebotenen Karten 21–52 % (vorher Hofladenjahr 93–99 %, Ruhiges Jahr 0 %).

  | Messung | vorher | nachher |
  |---|---|---|
  | 14 Tage Saisons (D/R/C) | 120 / 67 / 29 | 114 / 63 / 28 (−5 / −6 / −3 %: Bereichs-Themen tragen etwas weniger als die alten ×1,8/×2) |
  | Regular 5 Jahre (`TASKS=1`) | K13 295, K50 1702, Ø 38,0 Tage | K13 293, K50 1699, Ø 38,0 Tage |
  | Dauerspieler 1 Jahr | K13 266, 21–24 Tage | K13 269, 21–24 Tage |
  | Casual 2 Jahre | Tag 730: K23 | Tag 730: K23 |

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
15h. ✅ **Runde 4 „Sichern, Bündeln, Belohnen, Unterscheiden“ (2026-11-10, Prompt `docs/prompts/runde-4.md`):**
    - **Automatische Sicherung:** IndexedDB je Tag und vor Tiefem Winter, Generation, Einspielen und Wiederherstellen (7 + 3, Budget 6 Mio Zeichen), Angebot beim Start vor einem neuen Garten, Liste im Menü, Omas Hinweis zur Sicherung außerhalb des Geräts; Schnittstelle für weitere Ziele (`docs/sicherung.md`).
    - **Heute-Karte und HUD-Grenze:** Gartenrunde, Tagesrezept, Tagesziele und Wochenplan an einer Stelle; höchstens drei Ereignis-Pillen, was abläuft zuerst; Entscheidungen mit Zahlen für diesen Garten; Hitzewelle +20 % → +16 %; Inventur `docs/systeme-inventur.md`.
    - **Ruhezeit:** erledigte Tage verkürzen die Ruhezeit nach dem Tiefen Winter (−4 h je Tag, höchstens −12 h).
    - **Bogen-Regeln:** Patenbeet, Tauschpost, Wasser verteilen, Plan für morgen (`docs/kapitel/bogen-regeln.md`).
    - **Paket 5 (Nutzerentscheid):** Sturm — „Sichern“ kostet −8 % für 2 h, die Beerenhecke senkt die Schadens-Chance (50 % → 20 %); Spätfrost — Glas (Gewächshaus, Orangerie) hält 69 % des Schadens ab. Beide sind jetzt echte Entscheidungen. Saison-Karten „Faktor nach Anteil“ umgesetzt, gemessen, **weggelassen** (Hofladenjahr blieb bei ~90 %, kleine Bereiche bei ~0 %).
    - **Saison-Karten „Ausbau statt Ertrag“** (Nutzerentscheid): Bereichs-Themen verbilligen den Ausbau ihres Bereichs und verteuern den Gegenspieler; laufende alte Karten wirken weiter wie vorher (Feld `seasonCardAusbau`).
    - **Offen:** Cloud-Sicherung (iCloud/Play Games/Backend) braucht Store-Hülle bzw. Konto; Werte der Bogen-Regeln mit echten Ständen nachprüfen.
16. Multiplayer-Architektur (Kleingartenverein mit echtem Backend; Kürbis-Runde umstellen).
17. Store-IAP, Impressum-Daten, Namensprüfung „Gartenerbe“ und „Heirloom Garden“, Store-Assets, Soft-Launch. Vor Launch: `STORE_ENABLED` prüfen (Platzhalter) **und `DISTRIBUTION = 'store'`** in `src/game/distribution.ts` (schaltet den Installations-Hinweis der Web-Fassung ab; ein Test erzwingt das, sobald eine Store-Hülle im Repo liegt).

## 5-Jahres-Plan (Inhalt)

- Ein Kapitel trägt ~6–10 Wochen neue Ziele; Feste erneuern sich jährlich.
- Ziel: **10–12 große Kapitel** in 5 Jahren (≈ alle 4–6 Monate), dazwischen je ein System-/Fest-Update. Ohne Zwischen-Updates wären ~20 Kapitel nötig.
- **Kapitel 2–50 sind gebaut** (Welle 1 von Kapitel 13–50: Gemeinschaftsgarten, Klostergarten, Schlossgarten, Baumschule, Moor- und Heidegarten; Welle 2: Deichgarten, Spreewald, Cottage-Garten, Tulpenfelder, Artischockeninsel, Beerenwald, dazu das Großprojekt „Omas Gartenroute“ für Bogen I; Welle 3: Andalusischer Patio, Korkeichenhain, Paprikafelder, Steinfelder von Aran, Rosental, Pistazienhain auf Ägina, dazu das Großprojekt „Omas Tauschpost“ für Bogen II; Welle 4, Beginn Bogen III „Wo die Samen herkommen“: Kartoffeln der Anden, Milpa in Mexiko, Kaffeewald in Äthiopien, Reisterrassen auf Bali, Gewürzgarten in Kerala; Welle 5, Abschluss Bogen III: Dattel-Oase in Marokko, Kakaogarten in Ghana, Buschgarten in Australien, Farnwald in Neuseeland, Kimchi-Garten in Korea, dazu das Großprojekt „Omas Herkunftsbeet“ für Bogen III; Welle 6, Beginn Bogen IV „Saatgut für morgen“ mit Notizen von Mila: Dachgarten, Schulgarten, Waldgarten, Samenbank, Klimagarten; Welle 7, Abschluss Bogen IV: Wildblumenband, Fassadengarten, Solawi-Hof, Großer Saatguttausch, Weltgartenschau, dazu das Großprojekt „Der Garten für morgen“ für Bogen IV; Welle 8, Finale: Omas Schrebergarten mit Omas letztem Brief und der einmaligen Abschluss-Szene auf Omas Bank). Plan und Geschichte: `docs/kapitel/plan.md`, Überblick: `docs/kapitel/abschluss-bericht.md`.
- Freischaltung staffeln über Prestige-Ebenen (Tiefer Winter / Generation N), damit jedes Kapitel ein neues Ziel nach einem Reset ist.

## Nächste Schritte nach Kapitel 50 (Stand 2026-11-09)

1. **Playtest-Auswertung:** Logs der zwei Tester (Menü → Export JSONL) auswerten: Wo hängen sie, welche Fenster werden übersprungen, wie lange dauern Saisons und Kapitel wirklich? Ergebnisse gegen die Simulator-Taktung (`docs/kapitel/plan.md` „Taktung“) legen.
2. **Balance mit echten Kapiteln:** Der Simulator rechnet Kapitel 13–50 mit Ilse als einzigem Baumeister. Mit echten Ständen prüfen, ob Kapitel 13 im Monat 9–12 kommt und ob der Abstand 4–6 Wochen hält; Garten-Bonus der Kapitel (×300 nach 5 Jahren) im Auge behalten.
3. **Prüfbedürftige Stellen ersetzen:** Fremdsprachige Grüße, nachzuprüfende Zahlen und Bräuche in Kapitel 13–49 werden in einem eigenen Durchgang durch Aussagen ersetzt, die kein Gegenlesen brauchen.
4. **Grafik-Feinschliff:** Bereichsgrafiken sind auf der Karte klein; einzelne Motive (Kapitel 40–50) brauchen kräftigere Silhouetten, der Horizont liegt teils hinter der Kopfleiste. Grafikbögen in `scripts/e2e/art-baseline/` durchsehen.
5. **Leistung:** 50 Kapitel-Bündel werden nachgeladen; Ladezeit auf älteren Handys messen (Kapitel-Grafik, Tierleben-CSS), Leistungsgrenze Hauptgarten (1500 SVG-Elemente) gilt auch als Richtwert für Kapitel-Karten.
6. **Store-Vorbereitung:** Texte in `docs/store/texte.md` (de + en) mit `listing.md`/`listing.en.md` abgleichen, Screenshots mit späten Kapiteln ergänzen, Markenrecherche, `DISTRIBUTION = 'store'` und `TEST_PHASE = false`, echte Käufe (`STORE_ENABLED`) erst mit Store-Anbindung.

## Nach Kapitel 50 (Stand 2026-11-09)

Konzept und Ideen-Bewertung: `docs/nach-kapitel-50.md`.

- ✅ **Kapitel-Meisterschaft** (Schritt 1): drei Sterne je Kapitel, es zählt der schwächste Bereich — ★ alle zehn Bereiche Stufe 100, ★★ beide Pflege-Arten mindestens Rang 5, ★★★ voll gepflegt (Rang 10). Je Stern +5 % Ertrag in der Währung dieses Kapitels, gedeckelt bei +15 %; 49 Kapitel × 3 = 147 Sterne. Stufen-Schwellen allein (erste Fassung 25/50/100) verworfen: im Simulator erreichen alle Kapitel dasselbe Stufen-Niveau (≈ 180 nach 5 Jahren), ab Kapitel 13 kamen alle Sterne in 1–5 Tagen. Anzeige in der Kapitel-Kopfleiste (sobald vollständig angelegt, mit kurzem Hinweis beim neuen Stern) und in „Sammlung & Ziele“ (Summe, Regel, je Kapitel der Weg zum nächsten Stern). Kein neues Spielstand-Feld — die Sterne folgen aus Kapitel-Stufen und -Pflege, alte Stände bekommen sie sofort. Balance: Regular K50 Tag 1785 statt 1778 (Rauschen), Garten-Bonus +0,5 %. Code `src/game/mastery.ts`, Tests `mastery.test.ts`, E2E Abschnitt 5c, Simulator `MASTERY=1` / `MASTERY_PER_STAR`.
- **Nächste Schritte:**
  1. *Omas Dose füllen:* der dritte Meister-Stern schickt ein eigenes Tütchen an den Briefpartner des Kapitels zurück, kurze Antwortkarte im Notizbuch (de + en, Leitlinie „nichts, was Gegenlesen braucht“), neues Feld mit Startwert `[]`.
  2. Meister-Sterne auch an den Grundstücks-Knöpfen und im Tiefen Winter zeigen.
  3. Familien-Chronik nur für neue Ereignisse (Kapitel offen, Stern, Generation).
  4. Pflege mehrfach kaufen, falls das Tippen für ★★★ stört.
  5. Playtest-Log: Ereignis „Meister-Stern“; Bonus je Stern mit echten Ständen nachprüfen.

## Ideen-Backlog (nächste Updates)

- Echter Online-Wettbewerb für den Kürbis (mit Multiplayer-Backend).
- Ilse-/Jonas-Geschichten als kurze Briefe im Notizbuch.
- Gartenstile für Kapitel-Karten.
- Saisonaler Pass bleibt bewusst aus — Gartenwoche + Feste reichen.
