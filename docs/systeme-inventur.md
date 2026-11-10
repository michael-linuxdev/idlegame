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
- **Sturm und Spätfrost nicht angeglichen (bewusst weggelassen):** Bei Sturm
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
