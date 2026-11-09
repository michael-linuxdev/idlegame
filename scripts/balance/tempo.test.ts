/**
 * Tempo-Korridor: spielt den echten Spielkern headless (Balance-Simulator)
 * und schlägt fehl, wenn eine Saison aus dem Ruder läuft. Gemessen wird
 * aktive Spielzeit — Nachtpausen zählen nicht.
 *
 * Stand 2026-11-09 nach dem Probe-Winter (Dauerspieler, 72 h): erste
 * Saison 18 min, danach 23–248 min aktiv; Ereignisdichte Sitzung 1 Median
 * 45 s (vorher 2 min), später ~25 s.
 */
import { describe, expect, it } from 'vitest'
import { simulate } from './sim'

describe('Tempo (Balance-Simulator)', () => {
  it('Dauerspieler 72 h: keine Saison zu kurz oder zu lang', () => {
    const { runs, density } = simulate('engaged', 72)
    const active = runs.map((r) => r.active / 60)
    expect(runs.length).toBeGreaterThan(20)
    // erstes Saisonende
    expect(active[0]).toBeGreaterThanOrEqual(10)
    expect(active[0]).toBeLessThanOrEqual(30) // Probe-Winter: in der ersten Sitzung
    // danach: kein Saisonende-Spam, kein Hänger. Ausgenommen ist die Saison,
    // nach der ein Tiefer Winter folgt — die Wand davor ist gewollt.
    // 300 min: der Sim-Spieler beendet Saisons nach Ernte/Minute über die
    // Uhr, eine Nacht dazwischen verschiebt das um bis zu ~1 h (Probe-Winter:
    // Jahr 12 = 248 min, Jahre 12–14 zusammen 317 statt vorher 299 min).
    runs.slice(1).forEach((r, i) => {
      const m = active[i + 1]
      expect(m).toBeGreaterThanOrEqual(10)
      if (!r.deep) expect(m).toBeLessThanOrEqual(300)
    })
    // Ereignisdichte (aktive Sekunden zwischen Freischaltung/★/Saisonende)
    expect(density.s1Median).toBeLessThanOrEqual(90) // Ziel der Bindungs-Runde
    expect(density.laterMedian).toBeLessThanOrEqual(300)
  }, 60_000)
})
