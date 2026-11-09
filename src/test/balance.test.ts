import { describe, expect, it } from 'vitest'
import {
  BALANCE,
  emberPayout,
  isProbeYear,
  payoutAtGate,
  prestigeBlockReason,
  prestigeMinAsh,
} from '../game/economy'
import { GENERATORS, isGeneratorUnlocked } from '../game/generators'

describe('Saisonende gate + payout', () => {
  it('gate grows steeply until the knee, then gently', () => {
    const g = (p: number) => prestigeMinAsh(p)
    expect(g(0)).toBe(BALANCE.prestigeBase)
    expect(g(1) / g(0)).toBeCloseTo(BALANCE.prestigeGrowth, 5)
    // Probe-Winter: nur das allererste Gartenjahr hat eine eigene Schwelle
    expect(prestigeMinAsh(0, true)).toBe(BALANCE.firstSeasonGate)
    expect(payoutAtGate(0, true)).toBe(BALANCE.firstSeasonPayout)
    expect(emberPayout(BALANCE.firstSeasonGate, 0, true)).toBe(BALANCE.firstSeasonPayout)
    expect(isProbeYear({ saisonenden: 0, tiefeWinter: 0, generation: 0 })).toBe(true)
    expect(isProbeYear({ saisonenden: 0, tiefeWinter: 1, generation: 0 })).toBe(false)
    expect(isProbeYear({ saisonenden: 0, tiefeWinter: 0, generation: 1 })).toBe(false)
    const k = BALANCE.prestigeKnee
    expect(g(k + 1) / g(k)).toBeCloseTo(BALANCE.prestigeLateGrowth, 5)
  })

  it('pays the base at the gate, √ up to 2× at 4× gate, then flattens', () => {
    for (const p of [0, 3, 12]) {
      const gate = prestigeMinAsh(p)
      const base = payoutAtGate(p)
      expect(emberPayout(gate, p)).toBe(base)
      expect(emberPayout(gate * 4, p)).toBe(base * 2)
      const at16 = emberPayout(gate * 16, p)
      expect(at16).toBeGreaterThan(base * 2)
      expect(at16).toBeLessThanOrEqual(base * 3)
    }
  })

  it('cannot end the season below the gate', () => {
    const owned = Object.fromEntries(GENERATORS.map((g) => [g.id, 5]))
    expect(prestigeBlockReason({ saisonenden: 2, ernteSeason: prestigeMinAsh(2) - 1, owned })).toBe('ernte')
    expect(prestigeBlockReason({ saisonenden: 2, ernteSeason: prestigeMinAsh(2), owned })).toBeNull()
  })
})

describe('Gartenjahr gates', () => {
  const owned = Object.fromEntries(GENERATORS.map((g) => [g.id, 50])) as never
  it('keeps upper corners wild until their Gartenjahr, whatever the Ernte', () => {
    for (const def of GENERATORS) {
      const need = def.unlock?.seasons ?? 0
      if (need === 0) continue
      expect(isGeneratorUnlocked(def, 1e30, owned, true, 99, need - 1)).toBe(false)
      expect(isGeneratorUnlocked(def, 1e30, owned, true, 99, need)).toBe(true)
    }
  })
  it('opens the garden in order', () => {
    const seasons = GENERATORS.map((g) => g.unlock?.seasons ?? 0)
    expect([...seasons].sort((a, b) => a - b)).toEqual(seasons)
  })
})
