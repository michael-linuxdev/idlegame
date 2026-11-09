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
