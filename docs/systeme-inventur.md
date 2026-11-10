# Systeme-Inventur (Runde 4, Paket 2)

Stand 2026-11-10. Grundlage für „Weniger Systeme im Blick, mehr echte
Entscheidungen“. *Aufmerksamkeit* = wie oft das System von sich aus etwas will;
*HUD* = wo es auf der Gartenkarte auftaucht (vorher → nachher);
*Entscheidung* = muss der Spieler zwischen Möglichkeiten mit Preis wählen?

## Systeme

| System | Gibt | Aufmerksamkeit | HUD vorher → nachher | Entscheidung? |
|---|---|---|---|---|
| Ernte, Ausbauen, Gießen | Ernte/s, Gärtnerstufe | ständig (Kern) | Korb, Ziel-Zeile, Gießen-Knopf | ja (welches Beet) |
| Saisonende / Omas Truhe | Erbstücke → +% Ernte (dauerhaft) | je Saison | Ziel-Zeile, Saison-Pille, roter Punkt „Saison“ | ja (wann, was kaufen) |
| Tiefer Winter / Sprösslings-Laden | Sprösslinge → +10 %/Rang | alle 3–7 Tage | Ziel-Zeile, Saison-Tab | ja (wann, was kaufen) |
| Generationen / Familienschatz | Vermächtnis → mehrere Boni | Wochen | Saison-Tab | ja |
| Kapitel 2–50, Ilse, Großprojekte | Kapitel-Währung, +% Garten (Kapitel-Bonus) | täglich bis wöchentlich | Grundstücke-Knöpfe | ja (was ausbauen); Bogen-Regeln: Paket 4 |
| **Tägliche Gartenrunde** | Ernte, Erbstücke, Samen (Tag 3: 25, Tag 7: 40) | 1×/Tag | eigener Knopf unten links → **„Heute“** | nein |
| **Omas Tagesrezept** | 12 Samen, 10 min Ernte, 6 Festmarken | 1×/Tag | Rezept-Pille oben → **„Heute“** | nein |
| **Tagesziele** (3 je Tag) | Ernte, Samen | 1×/Tag | roter Punkt an der Gärtnerstufe → **„Heute“** | nein |
| **Omas Wochenplan** (7 + Korb) | 128 Samen, 25 Erbstücke je Woche | über die Woche | roter Punkt an der Gärtnerstufe → **„Heute“** | nein |
| Hofladen-Bestellungen | 8–12 Samen je Bestellung | alle ~30 min | Bestell-Pille | nein (abliefern) |
| Erntefest (Wochenende) | ×-Ernte, Ziel mit Samen | Wochenende | Pille | nein |
| Sonnenfenster (Blitz) | ×-Ernte für Minuten, Ziel mit Samen | selten | Pille mit Restzeit | nein |
| Regenbogen / Sternschnuppe | ×5 für 60 s / Wunsch | selten | Knopf über der Karte, Pille | nein |
| Frühlingsschub | ×3 für 2 min nach jedem Neubeginn | je Saison | Pille mit Restzeit | nein |
| Glücksrad | Buff für ein Gartenjahr | je Saison | Zeremonie, Pille | nein (Zufall) |
| Saison-Karten (Jahres-Themen) | ±% je Bereich bzw. aktiv/offline | je Saison ab Jahr 4 | Fenster nach dem Saisonende, Pille | **ja** |
| Wetter-Entscheidungen | Buff/Malus für 2–4 h | an manchen Tagen | Karte auf der Karte | **ja** (sichern / riskieren) |
| Omas Herausforderungen | +3 % je geschaffter | freiwillig ab Jahr 8 | Pille | ja (Einschränkung) |
| Feste nach Kalender, Festladen | Festmarken → Sorten, Schub, Samen | Wochen | Fest-Pille | ja (was kaufen) |
| Pflanzenbuch, Bewohner, Kreuzen, Album, Deko | +% Ernte (dauerhaft), Kosmetik | gelegentlich | Menü, Karte | teils (Deko-Platz, Kreuzung) |
| Gartenwoche (Pass) | Samen, Kosmetik | täglich XP | Markt | nein |
| Kleingartenverein (Kürbis) | Samen-Preise | wöchentlich | Menü | nein |
| Markt (Dünger, Vereinsfahne, Zeit) | Samen → Ernte/Zeit | bei Bedarf | Markt, Pillen (Dünger, Verein) | ja (Samen ausgeben) |
| Jonas (Gartenhelfer) | baut im Garten aus | — | Helfer-Knopf | ja (Bereiche sperren) |

## Quellen der Ernte-Multiplikatoren (`multBreakdown`)

| Schlüssel | Quelle | Dauer |
|---|---|---|
| `erbe` | Omas Truhe (Gartenschere, Rosenbogen …) | dauerhaft im Durchgang |
| `level` | Gärtnerstufe | dauerhaft |
| `pflanzenbuch` | Sorten und Sets | dauerhaft |
| `kapitel` | Kapitel-Boni, Familienschatz (Garten), Bewohner, Kreuzungen, Großprojekte | dauerhaft |
| `winter` | Tiefe Wurzeln | dauerhaft |
| `nachbarn` | Nachbarschaftshilfe (Jahr 11–14, erster Durchgang) | befristet |
| `erntefest` | Erntefest | Wochenende |
| `sonnenfenster` | Sonnenfenster | Minuten |
| `wetter` | Wetter des Tages und Wetter-Entscheidung | Tag / 2–4 h |
| `gluecksrad` | Glücksrad | ein Gartenjahr |
| `verein` | Vereinsfahne | befristet |
| `duenger` | Dünger | 30 min |
| `regenbogen` | Regenbogen | 60 s |
| `fruehling` | Frühlingsschub | 2 min |
| `karte` | Jahres-Thema (Gartenweit) | ein Gartenjahr |
| `herausforderungen` | Omas Herausforderungen | dauerhaft |

Dazu je Bereich (nicht in `multBreakdown`): Meilenstein-Sprünge, Pflege
(Effizienz), Jahres-Thema (Bereich ×).

## Was Paket 2 geändert hat

- **„Heute“-Karte** (`TodaySheet.tsx`, Regeln `src/game/today.ts`): ein
  Zugang unten links statt Gartenrunde-Knopf, Rezept-Pille und rotem Punkt an
  der Gärtnerstufe; ein Punkt am Zugang, wenn etwas abzuholen ist. Spielstand
  und Regeln der vier Systeme unverändert (kein Feld weg, Serien laufen weiter).
  Neue Spieler: Gartenrunde und Tagesziele sofort, Rezept mit seinem System
  (`featureUnlocks`), Wochenplan ab dem ersten Saisonende; bestehende Stände
  haben beides schon.
- **HUD-Grenze** (`src/game/hudPills.ts`): höchstens drei Plätze — zwei Pillen
  plus „+N“, sobald es mehr sind. Vorrang: abholbar, dann kürzeste Restzeit,
  dann feste Reihenfolge. Vorher standen Pillen ohne Rang (Jahres-Thema,
  Herausforderung) vor ablaufenden, und „+N“ klappte alle Pillen auf; jetzt
  zeigt „+N“ die übrigen nur als Liste.
- **Entscheidungen:** vor der Wahl die Folge in Zahlen für diesen Garten
  (Wetter: Ernte aus Korb bzw. Samen, Erwartung bei Pech, Wert der geleerten
  Gießkanne; Jahres-Themen: aktiv und offline getrennt), danach ein Satz
  (Wetter: Toast mit Ernte; Jahres-Thema: in der Zeremonie „hat mit deinem
  Garten ≈ +x % gebracht“).

## Messung „beste Wahl“ (Simulator, je Profil ein Jahr ab Mai)

```bash
COARSE_AFTER_D=30 SIM_START=2027-05-03 WEATHER=best DECISIONS=1 SUMMARY=1 npm run balance -- regular 8760
```

Strategie: Saison-Karte mit der höchsten angezeigten Vorschau
(`CARD=best`, wie bisher); Wetter mit der höheren Erwartung in Ernte, Samen
zum Markt-Preis (40 Samen = 1 h Ernte, `bestWeatherChoice`). Gemessen wird,
wie oft eine angebotene Option gewählt wird.

**Wetter (Anteil „riskieren“), vorher → nachher**

| | Dauerspieler | Regular | Casual |
|---|---|---|---|
| Sturm | 0 % → 0 % | 0 % → 0 % | 0 % → 0 % |
| Spätfrost | 0 % → 0 % | 0 % → 0 % | 0 % → 0 % |
| Hitzewelle (früh gießen +20 % → **+16 %**) | 100 % → **45 %** | 100 % → **10 %** | 100 % → **41 %** |

- **Hitzewelle angeglichen:** +20 % → +16 % für 2 h. Jetzt hängt die Wahl am
  Garten: Ist die Gießkanne gerade voll und die Messing-Brause hoch, lohnt das
  Schattennetz; wer gerade gegossen hat, gießt früh. Getestet in
  `weatherEvents.test.ts`.
- **Sturm und Spätfrost (Paket 2) nicht angeglichen — in Paket 5 per Regeländerung gelöst, siehe unten:** Bei Sturm
  kostet „sichern“ 10 min Ernte *aus dem Korb* — höchstens, was drin ist. Wer
  aktiv spielt, gibt den Korb laufend aus; „sichern“ ist dann fast umsonst
  und gewinnt bei jedem Risiko-Wert (getestet bis −12,5 % statt −25 %: 3 %
  riskant). Spätfrost kostet feste 5 Samen gegen eine Erwartung in Ernte; das
  Verhältnis hängt nicht vom Garten ab, also gewinnt immer dieselbe Seite. Ein
  Wert allein macht daraus keine Entscheidung — es bräuchte eine neue Regel
  (z. B. „sichern“ kostet Ernte/s statt Korb). Die Anzeige zeigt die Zahlen
  jetzt ehrlich; die Regel bleibt eine Frage an den Nutzer.

**Saison-Karten (gewählt, wenn angeboten), unverändert**

| Karte | Dauerspieler | Regular | Casual |
|---|---|---|---|
| Hofladenjahr | 99 % | 93 % | 99 % |
| Fleißiges Jahr | 74 % | 73 % | 54 % |
| Glashausjahr | 50 % | 60 % | 73 % |
| Gutes Jahr | 53 % | 50 % | 39 % |
| Hühnerjahr / Bienenjahr / Obstjahr | 33 / 36 / 12 % | 35 / 50 / 16 % | 51 / 89 / 21 % |
| Beerenjahr / Kräuterjahr | 3 / 0 % | 3 / 0 % | 5 / 0 % |
| Ruhiges Jahr | 0 % | 0 % | 0 % |

- **Nicht angeglichen (bewusst weggelassen):** Am Saisonende trägt der
  oberste offene Bereich den größten Teil der Ernte. Darum ist die Karte für
  diesen Bereich fast immer vorn, die für kleine Bereiche fast nie — auch mit
  anderen Werten: ein Probelauf (Hofladen ×1,8 → ×1,5, Glashaus/Bienen → ×1,6,
  Beeren → ×2,4, Kräuter ×2 → ×2,6) ließ Hofladen bei 81–100 % und Kräuter bei 0 %. Feste Faktoren können das nicht ausgleichen; das ginge
  nur mit einer neuen Regel (Faktor nach Anteil des Bereichs).
- **Ruhiges/Fleißiges Jahr** hängen an der Spielweise, nicht am Garten: Mit
  `CARD=bestAway` (Wert nach Offline-Anteil des Profils) wählt Regular das
  Ruhige Jahr in 89 %, Casual in 75 %, der Dauerspieler in 50 %; das Fleißige
  Jahr niemand mehr. Darum zeigt die Karte jetzt beide Zahlen (beim Spielen /
  während du weg bist), damit jeder nach seiner Spielweise wählen kann.

## Paket 5 — Sturm und Spätfrost als echte Entscheidungen (2026-11-10, Nutzerentscheid)

Nutzerentscheid: Sturm „Hecke als Windschutz“, Spätfrost „Glas schützt“,
Saison-Karten „Faktor nach Anteil“. Werte in `src/game/weatherEvents.ts`
(`WEATHER_EFFECTS`, `WEATHER_GARDEN`, `weatherRisk`, `weatherCtx`).

- **Sturm:** „Beete sichern“ kostet jetzt **−8 % Ernte für 2 h** (Ernte/s,
  auch bei leerem Korb) statt 10 min Ernte aus dem Korb. Riskieren: Schaden
  −25 % für 2 h; die **Beerenhecke bricht den Wind** — Chance auf Schaden
  50 % ohne Hecke, sinkt bis 20 % ab Heckenstufe 150.
- **Spätfrost:** Vlies kostet weiter 5 Samen. Riskieren: 50 % Frost, −30 %
  auf die Ernte im Freien; **unter Glas** (Gewächshaus, Orangerie) hält das
  Glas 69 % des Schadens ab.
- Die Wetter-Karte zeigt die Hecken-Chance bzw. den Freiland-Anteil dieses
  Gartens; Vorschau und „beste Wahl“ rechnen damit.
- Laufende Wetter-Wirkungen alter Stände bleiben unverändert (gespeichert).

**Messung „beste Wahl“** (je Profil ein Jahr ab Mai, Anteil „riskieren“,
Dauerspieler / Regular / Casual, zusammen):

| | vorher | nachher |
|---|---|---|
| Sturm | 0 / 0 / 0 % (zusammen 0 %) | 59 / 46 / 4 % (**zusammen 36 %**) |
| Spätfrost | 0 / 0 / 0 % (zusammen 0 %) | 56 / 87 / 22 % (**zusammen 54 %**) |
| Hitzewelle (Paket 2) | 45 / 10 / 41 % | 55 / 17 / 31 % (**zusammen 34 %**) |

Gemessen wird über alle Spieler zusammen: Wer eine hohe Hecke bzw. viel
unter Glas hat (meist der Dauerspieler), riskiert eher; wer wenig hat
(Casual), sichert eher — genau das ist die Entscheidung. Je Profil allein
liegen einzelne Werte außerhalb von 5–60 %, weil die Gärten eines Profils
sich ähneln. Probe-Werte: Hecke 15 %/120 → zu riskant (72–93 %), 25 %/200 →
fast nur sichern; Glas 100 % → 77 % riskant, 60 % → 0 %, 66 % → 7 %, 68 % → 37 %.

**Saison-Karten „Faktor nach Anteil“: umgesetzt, gemessen, wieder
weggelassen.** Jede Bereichs-Karte brachte etwa +12 % der Garten-Ernte
(kleiner Bereich großer Faktor, Deckel ×4…×100 probiert, beim Wählen
festgehalten; laufende Karten behielten die alte Regel). Ergebnis
(zusammen, wenn angeboten): Hofladenjahr 92 % (vorher 93–99 %),
Glashausjahr 68 %, Fleißiges Jahr 80 %, Kräuter-/Kompostjahr 0–2 %,
Ruhiges Jahr 0 %. Grund: Gewinnen tut die Karte, deren **gedämpfter**
Bereich am kleinsten ist, und Karten winziger Bereiche können den Anteil
nicht tragen. Auch stärkere Gegengewichte (Glashaus dämpft Hofladen, Hühner
dämpft Gewächshaus) und „nur passende Karten anbieten“ verschoben das Problem
nur. Weil die Regel das Ziel nicht erreicht, aber starke Karten schwächt, ist
sie nicht im Spiel (Regel 11). Offene Frage an den Nutzer in `ROADMAP.md`.

**Ideen für die Saison-Karten (Entscheidung offen):** (a) Karten wirken auf
den *Ausbau* statt auf den Ertrag („Kräuterjahr: Kräuterspirale 40 %
billiger“) — dann lohnt die Karte genau für den Bereich, den man diese Saison
hochziehen will; (b) Karten geben statt Ernte ein Saison-Ziel mit Belohnung
in Erbstücken; (c) weniger Karten (nur Gartenweit, Aktiv/Offline), dafür klar
verschieden. Alle drei bräuchten eigene Messung.
