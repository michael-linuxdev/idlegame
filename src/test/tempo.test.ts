/**
 * Tempo-Korridor: spielt den echten Spielkern headless (Balance-Simulator)
 * und schlägt fehl, wenn eine Saison aus dem Ruder läuft. Gemessen wird
 * aktive Spielzeit — Nachtpausen zählen nicht.
 *
 * Stand 2026-11-09 (Dauerspieler, 72 h): erste Saison 60 min, danach
 * 14–138 min aktiv; Ereignisdichte Sitzung 1 Median ~2 min, später ~25 s.
 * Ziel der Bindungs-Runde: Sitzung 1 ≤ 90 s Median (Pakete E/F).
 */
import { describe, expect, it } from 'vitest'
import { simulate } from '../../scripts/balance/sim'

describe('Tempo (Balance-Simulator)', () => {
  it('Dauerspieler 72 h: keine Saison zu kurz oder zu lang', () => {
    const { runs, density } = simulate('engaged', 72)
    const active = runs.map((r) => r.active / 60)
    expect(runs.length).toBeGreaterThan(20)
    // erstes Saisonende
    expect(active[0]).toBeGreaterThanOrEqual(10)
    expect(active[0]).toBeLessThanOrEqual(90)
    // danach: kein Saisonende-Spam, kein Hänger
    for (const m of active.slice(1)) {
      expect(m).toBeGreaterThanOrEqual(10)
      expect(m).toBeLessThanOrEqual(240)
    }
    // Ereignisdichte (aktive Sekunden zwischen Freischaltung/★/Saisonende)
    expect(density.s1Median).toBeLessThanOrEqual(180)
    expect(density.laterMedian).toBeLessThanOrEqual(300)
  }, 60_000)
})
