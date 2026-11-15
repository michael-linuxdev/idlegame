# Preisvorschlag Markt (Echtgeld)

Stand 2026-11-15 (Gartenmonat, mehr Gartenstile, Tageslimit der Boni). Die Testkäufe sind abgeschaltet (`STORE_ENABLED = false` in
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

Ausgaben zum Vergleich: Gartenstile für Omas Garten 80–600 Samen (neun
Stile, zusammen 2 800), Lichtstimmungen für die Grundstücke 300–500 (vier,
zusammen 1 500), Fest-Gartenstil 150, Deko 10–60, Gießkanne auffüllen, Dünger.

**Samen-Senke (seit 2026-11-15):** Bis dahin gab es Stile für zusammen 400
Samen — nach einer Woche war alles gekauft, ein Samen-Kauf hatte kein Ziel.
Jetzt kosten alle Stile zusammen 4 300 Samen ≈ **acht bis neun Wochen**
Gratis-Einkommen (`COSMETICS` in `src/game/monetization.ts`, Preise steigen
von Stil zu Stil). Das Gratis-Einkommen ist unverändert.

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
| Werbefrei | Bonus-Werbung dauerhaft weg, Belohnung bleibt | **5,99 €** | einmalig; seit 2026-11-15 (vorher 3,99 €): mit dem Tageslimit der Boni das dauerhafte Ankerprodukt, teurer als ein Gartenmonat |
| Gartenmonat | 30 Tage Premium-Reihe der Gartenwoche + jeder Bonus ohne Werbung + ein Monatsstil für immer | **4,99 € je 30 Tage** | ersetzt seit 2026-11-15 „Gartenwoche Premium“ (1,99 € je Woche brachte 120 Samen — kaum mehr als Samentüte M). Im Monat ~515 Samen aus der Premium-Reihe, wenn man spielt; verlängern geht in der letzten Woche, die Restzeit bleibt |
| Festladen Plus | zehnfacher Vorrat im laufenden Fest (nur im Festladen) | **3,99 € je Fest** | für Dauerspieler mit vielen Festmarken; nur Mengen, nichts Exklusives |

Grenzen, die das Spiel fair halten (schon im Code): Zeitsprünge max. 6 h am
Tag, höchstens **8 Boni am Tag** (Markt-Bonus und verdoppelter Korb zusammen,
auch mit Werbefrei oder Gartenmonat — `AD_BONUS_PER_DAY`), Dünger und
Vereinsfahne laufen ab, keine Erbstücke/Sprösslinge/Vermächtnis zu kaufen.

**Monatsstile:** Zwölf Gartenstile für Omas Garten (Schneeglöckchen …
Christrosen) gibt es nur mit dem Gartenmonat — je Kauf der nächste der Reihe,
**ohne Frist und ohne Kalender** (kein Stil kann verpasst werden), er bleibt
nach Ablauf. Für Samen sind sie nicht zu haben. Sind alle zwölf da, gibt der
Gartenmonat stattdessen 150 Samen. Der Markt zeigt den nächsten Stil mit
Vorschau.

Offen vor dem Store-Start: Gartenmonat als Abo (verlängert sich selbst) oder
als einmaliger 30-Tage-Kauf anlegen — im Spiel ist es ein Kauf ohne
automatische Verlängerung.

## Werbung (seit 2026-11-15)

- **Zwei Plätze:** im Markt (Ernte oder Samen wählen, 3 min Abklingzeit) und
  im Willkommens-Zettel: **„Werbung ansehen: Korb ×2“** — die Offline-Ernte
  noch einmal. Angeboten nach mindestens 30 min Abwesenheit, nicht vor dem
  ersten Saisonende. Mit Werbefrei/Gartenmonat ohne Werbung („Korb ×2 (Bonus)“).
- **Tageslimit 8** für beide Plätze zusammen. Playtest 2026-11-10: mit
  Werbefrei 65 Boni in zwei Tagen, bis zu 10 je Stunde.
- Messung (Simulator, 14 Tage, Saisons): Regular ohne Bonus 65, Korb ×2 bei
  jeder Rückkehr 66, alle 8 Boni am Tag 73–79; Dauerspieler 137 / 142 / 134.
  Der verdoppelte Korb verschiebt das Tempo also kaum. Vor dem Start mit den Store-Preisstufen je Land abgleichen.

## Testphase: Testgeld und echte Werbelänge (seit 2026-11-09)

Solange `TEST_PHASE` gilt und es noch keine echten Käufe gibt
(`src/game/testWallet.ts`):

- Die Echtgeld-Angebote stehen mit den Preisen oben im Markt. Bezahlt wird
  mit Testgeld: **50 € zum Start und +30 € am 1. jedes Monats** (seit
  2026-11-10; Rest sammelt sich an; wer schon spielte, behält seinen Rest und
  bekommt die 50 € dazu). Es wird nichts abgebucht, das Guthaben liegt nicht
  im Spielstand.
- Vor jedem Kauf fragt das Spiel: „Würdest du dafür wirklich … zahlen?“
  (Ja / Eher nicht). Reicht das Testgeld nicht mehr: „Hätte ich gekauft“.
- Die **Bonus-Werbung** dauert 15 oder 30 Sekunden (zufällig; bis 2026-11-15
  30 oder 60 — bei Besuchen von 1–2 min kostete das die halbe Spielzeit) und **sperrt
  das Spiel**. Abbrechen geht, dann ohne Belohnung. Im Hintergrund pausiert sie.
- Playtest-Log: `test_purchase` (Angebot, Preis, Antwort, Rest-Guthaben,
  Samen, Saisons, Tiefe Winter, Generation, Kapitel) und `test_ad`
  (start / done / abort mit gesehenen Sekunden; `place: welcome` = Korb ×2),
  `shop_tap` mit `action: offline_double`.

Gekaufte Sachen kommen im Spiel an. Für die Balance-Auswertung lassen sie sich
über `test_purchase` herausrechnen.
