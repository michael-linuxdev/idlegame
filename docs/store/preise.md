# Preisvorschlag Markt (Echtgeld)

Stand 2026-11-09. Die Testkäufe sind abgeschaltet (`STORE_ENABLED = false` in
`src/game/monetization.ts`), bis echte Käufe über App Store / Google Play
laufen. Dann diese Preise als Store-Preisstufen anlegen.

## Maßstab: Was ein Spieler ohne Geld bekommt

Aktiv spielend, grob je Woche (aus den Werten im Code):

| Quelle | Samen / Woche |
|---|---|
| Omas Wochenplan (7 Aufgaben + Wochenkorb) | ~130 |
| Hofladen-Bestellungen (4–10 je Bestellung) | ~100–150 |
| Omas Tagesrezept (12 je Tag) | ~85 |
| Tägliche Gartenrunde (Tag 3 und Tag 7) | ~60 |
| Tagesgeschenk, Besucher, Sonnenfenster, Album, Kürbis | ~50–100 |
| **Zusammen** | **~450–550** (≈ 70 am Tag) |

Ausgaben zum Vergleich: Gartenstil 80–200 Samen, Fest-Gartenstil 150,
Deko 10–60, Gießkanne auffüllen, Dünger.

**Faustregel:** 500 Samen ≈ eine Woche aktives Spielen. Ein Kauf soll
Zeit sparen oder schmücken, nie nötig sein.

## Vorschlag

| Angebot | Inhalt | Preis | Begründung |
|---|---|---|---|
| Startpaket (einmalig) | 200 Samen + Gartenstil Bauerngarten | **1,99 €** | bestes Angebot, niedrige Schwelle für den ersten Kauf |
| Samentüte S | 50 Samen | **0,99 €** | Einstieg |
| Samentüte M | 150 Samen | **2,49 €** | ~17 % günstiger je Samen |
| Samentüte L | 500 Samen | **6,99 €** | ~29 % günstiger, ≈ eine Woche Spielen |
| Blüten-Paket | Blütenmeer + Goldener Herbst | **2,99 €** | zwei Stile (Gegenwert ~350 Samen) |
| Werbefrei | Bonus-Werbung weg, Belohnung bleibt | **3,99 €** | einmalig, üblich im Genre |
| Gartenwoche Premium | Premium-Reihe der Gartenwoche | **1,99 € je Woche** | klein halten; alternativ 4,99 € je Monat |

Grenzen, die das Spiel fair halten (schon im Code): Zeitsprünge max. 6 h am
Tag, Dünger und Vereinsfahne laufen ab, keine Erbstücke/Sprösslinge/Vermächtnis
zu kaufen. Vor dem Start mit den Store-Preisstufen je Land abgleichen.
