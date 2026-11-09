# Bericht: Kapitel-Bonus und Taktung (Paket 1, Zwischenstand)

Stand 2026-11-09. Entscheidung des Nutzers steht aus — im Spiel ist nichts geändert.

## Befund

Der Simulator hat Kapitel bisher **nie ausgebaut**. Die ROADMAP-Zahlen
(„Kapitel 12 / Generation 10: Regular Tag 241“) gelten nur für Spieler, die
Kapitel öffnen, aber nicht ausbauen. Mit Kapitel-Ausbau (`CHAPTERS=1`):

- Jedes Kapitel gibt `gardenBonusPerLevel × Stufen` (0,4–0,85 % je Stufe,
  ungedeckelt), und die Boni aller Kapitel werden **multipliziert**.
- Nach einem Jahr hat ein Regular-Spieler ~25.000 Kapitel-Stufen →
  Garten **×6,7·10¹²**. Generationen kommen dann fast täglich.
- Das passiert schon, wenn **nur Ilse** ausbaut (der Spieler stellt sie nur an).
  Echte Spieler mit Ilse sind also heute schon betroffen.

## Messungen

Regular, 1 Jahr (`GEN=1 CHAPTERS=1 CHAPTER_MANUAL=0 SUMMARY=1 … regular 8760`),
nur Ilse baut Kapitel aus. Formel über `CHAPTER_BONUS_MODE`:

| Variante | Formel je Kapitel / gesamt | Kapitel 12 | Generation 10 | Garten-Bonus (Tag 365) |
|---|---|---|---|---|
| Referenz: Kapitel nicht ausgebaut | — | ~Tag 238 (laut Generation) | Tag 238 | — |
| **heute** (`product`) | ungedeckelt, multipliziert | **Tag 84** | Tag 84 | ×6,7·10¹² |
| `sum` | Boni addiert statt multipliziert | nicht erreicht (K9 Tag 344) | — | ×82 |
| `log` (L0 = 100) | logarithmisch je Kapitel | nicht erreicht (K9 Tag 314) | — | ×2.155 |
| `soft`, Deckel +50 % | 0,5·(1−e^(−b/0,5)) | nicht erreicht (K9 Tag 313) | — | ×26 |
| `soft`, Deckel +100 % | Deckel 1 | nicht erreicht (K9 Tag 340) | — | ×256 |
| `soft`, Deckel +200 % | Deckel 2 | nicht erreicht (K11 Tag 362) | — | ×56.476 |
| **`soft`, Deckel +400 %** | Deckel 4 (×5 je Kapitel) | **Tag 206** | **Tag 206** | ×2,9·10⁷ |

Kontrolle: Die Referenz mit grobem Takt ab Tag 120 (`COARSE_AFTER_D=120`)
liefert fast dieselben Generationen (G10 Tag 244 statt 238) — der grobe Takt
verfälscht nichts.

## Vorsicht: Spielweise des Simulators

Der Sim-Spieler macht einen **Tiefen Winter erst, wenn eine Saison länger
als 12 h dauert**. Ein stärkerer Garten verkürzt die Saisons, also gibt es
**seltener** Tiefe Winter (dafür mit 150–263 statt 4–40 Sprösslingen). Die
Generationen-Hürde zählt Tiefe Winter (`3 + N`), deshalb wirken gedeckelte
Varianten im Sim *langsamer* als ganz ohne Kapitel-Ausbau. Echte Spieler
entscheiden anders. Vor dem Festlegen sollte die Sim-Regel für den Tiefen
Winter auf „sobald sich die Sprösslinge lohnen“ umgestellt werden.

## Optionen

1. **Weicher Deckel je Kapitel, für alle Kapitel 2–50** (Empfehlung: Deckel
   +300…+400 %, also höchstens ×4…×5 je Kapitel). Trifft die alte Taktung
   (Kapitel 12 um Tag 200–240) am besten, gilt einheitlich für alle 50 Kapitel.
   *Folge für echte Spielstände:* nichts geht verloren, aber wer schon viele
   Kapitel-Stufen hat, sieht danach einen kleineren Garten-Multiplikator.
2. **Kapitel 2–12 bleiben wie heute, ab 13 kein Garten-Bonus.** Ändert nichts
   für bestehende Spieler; die Explosion bleibt, die Generationen rasen, und
   eine Taktung über Generationen ist für 13+ wirkungslos. Dann müsste die
   Freischaltung ab 13 allein am Kapitel-Fortschritt hängen — der wächst aber
   mit der Explosion ebenfalls.
3. **Erst die Sim-Spielweise verbessern, dann neu messen** (Tiefer Winter nach
   Sprösslings-Rendite, Kapitel-Ausbau je Profil), danach Option 1 feinjustieren.

**Empfehlung:** 3 + 1 — erst die Sim-Spielweise für den Tiefen Winter
verbessern (klein), dann den weichen Deckel je Kapitel per Simulator auf
„Kapitel 12 um Tag ~240 (Regular)“ einstellen und daraus die Regel für 13+
ableiten. Im Spiel ein kurzer Hinweis im Änderungsprotokoll („Kapitel-Boni
werden nach oben begrenzt“).

## Nachstellen

```bash
npx rolldown scripts/balance/sim.ts --format esm --platform node -o /tmp/sim.mjs
GEN=1 CHAPTERS=1 CHAPTER_MANUAL=0 CHAPTER_BONUS_MODE=soft CHAPTER_BONUS_CAP=4 SUMMARY=1 node /tmp/sim.mjs regular 8760
```
Laufzeit je Jahreslauf ~2–4 min (Kapitel-Ausbau wird alle 60 s Spielzeit gerechnet).

## Runde 2 — Sim-Spielweise verbessert (Option 3)

`DEEP_POLICY=rate` (Standard mit Kapiteln): Tiefer Winter, sobald die
Sprösslinge je Tag seit dem letzten Tiefen Winter nicht mehr steigen
(Rückfall: Saison > 36 h). Regular, 1 Jahr, nur Ilse baut Kapitel aus:

| Variante | Kapitel 12 | Generationen | Garten-Bonus (Tag 365) |
|---|---|---|---|
| Referenz: Kapitel nicht ausgebaut | — | G8 Tag 347 | — |
| heute (`product`) | (Lauf: >160.000 Saisons, Sim-Auswertung brach ab — behoben) | — | — |
| `sum` | Tag 48 | G10 Tag 48, G30 Tag 273 | ×152 |
| `soft` +50 % | Tag 67 | G10 Tag 67, G30 Tag 296 | ×87 |
| `log` L0 = 100 | Tag 54 | G10 Tag 54, G30 Tag 245 | ×123.394 |
| `soft` +200 % | Tag 50 | G30 Tag 214 | ×173.812 |
| `soft` +400 % | Tag 40 | G30 Tag 98 | ×3,5·10⁷ |

**Ergebnis:** Spielt der Sim-Spieler auf Rendite, rasen *alle* Varianten —
auch bei nur ×87–152 Garten-Bonus erreicht Regular Kapitel 12 nach 7–10
Wochen statt nach ~8 Monaten. Der Kapitel-Bonus ist also nicht die einzige
Ursache. Der eigentliche Kreislauf:

1. Kapitel werden bei Generationen **nicht** zurückgesetzt und werden mit
   jeder Generation stärker (`chapterRateMult`: +10 % je Generation, +5 % je
   Tiefem Winter, Obstbau-Tradition).
2. Eine Generation braucht nur **3 + N Tiefe Winter**. Ein Tiefer Winter ist
   ab Gartenjahr 15 möglich; mit starkem Garten ist Gartenjahr 15 in Stunden
   wieder erreicht → Tiefe Winter alle paar Stunden.
3. Damit kostet eine Generation nur noch Tage, und die Kapitel 4–12 (Regel
   „Generation N−2“) gehen im Wochentakt auf.

Die Sim-Auswertung ist repariert (`Math.max(...)` über zu viele Saisons).
Spiel-Code und Spielstand sind unverändert; keine Migration nötig.

## Optionen nach Runde 2

A. **Tiefer Winter teurer machen, wenn er schnell wiederholt wird**:
   Sprösslinge eines Tiefen Winters hängen davon ab, wie viel **Zeit** (oder
   Garten-Fortschritt) seit dem letzten vergangen ist, z. B. volle Ausbeute erst
   nach 3 Tagen. Bremst den Kreislauf an Punkt 2, ohne Kapitel-Werte zu ändern.
B. **Generationen-Hürde verschärfen**: statt `3 + N` Tiefe Winter eine Hürde
   aus Tiefen Wintern **und** Gartenjahren/Sprösslingen insgesamt — bremst
   Punkt 3.
C. **Kapitel-Bonus begrenzen** (Runde 1, z. B. `sum`) — allein reicht es laut
   Runde 2 nicht.
D. **Freischaltung ab Kapitel 13 entkoppeln** von Generationen: allein über
   den Fortschritt im vorigen Kapitel (alle 10 Bereiche auf Stufe X) plus
   Kapitel-Währung gesamt — unabhängig davon, wie schnell Generationen kommen.
   Lässt Kapitel 2–12 wie sie sind.

Empfehlung: **A + C** für die bestehende Kurve (sanft, bestehende Spielstände
verlieren nichts) und **D** für Kapitel 13+, dann alles mit dem Simulator über
5 Jahre auf die Ziele einstellen.

## Entscheidung (umgesetzt in Paket 1)

- **Ruhezeit 3 Tage nach jedem Tiefen Winter** — bremst den Kreislauf an
  Punkt 2, ohne normale Spieler (alle 3–7 Tage) zu treffen. Neues Feld
  `tieferWinterAt`, Startwert 0 (keine Migration).
- **Kapitel-Boni addiert** (`CHAPTER_BONUS.mode = 'sum'`).
- **Kapitel 13+** über Generations-Fortschritt (½ Generation je Kapitel) und
  das vollständig angelegte vorige Kapitel.
- Messwerte über 5 Jahre: `docs/kapitel/plan.md` „Taktung“.
