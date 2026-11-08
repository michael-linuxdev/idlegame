import { describe, expect, it } from 'vitest'
import { GENERATORS, generatorRate } from '../game/generators'
import { createInitialState, multBreakdown, productionPerSecond, totalGardenMult } from '../game/state'

describe('HUD multiplier breakdown', () => {
  it('multiplies to exactly the production factor', () => {
    const now = Date.UTC(2026, 10, 8, 12)
    const s = {
      ...createInitialState(now),
      owned: { ...createInitialState(now).owned, gemuesebeet: 40, kompost: 12 },
      collection: ['tomate', 'moehre'],
      playerXp: 5000,
    }
    const base = GENERATORS.reduce((sum, def) => sum + generatorRate(def, s.owned[def.id] ?? 0), 0)
    expect(base * totalGardenMult(s, now)).toBeCloseTo(productionPerSecond(s, now), 6)
  })

  it('leaves out factors of exactly 1', () => {
    const now = Date.UTC(2026, 10, 8, 12)
    for (const row of multBreakdown(createInitialState(now), now)) expect(row.mult).not.toBe(1)
  })
})

describe('formatAway', () => {
  it('reads naturally', async () => {
    const { formatAway } = await import('../game/format')
    expect(formatAway(30_000)).toBe('1 Minute')
    expect(formatAway(12 * 60_000)).toBe('12 Minuten')
    expect(formatAway(3 * 3600_000)).toBe('3 Stunden')
    expect(formatAway(50 * 3600_000)).toBe('2 Tage')
  })
})

describe('formatEta', () => {
  it('estimates the time to a goal', async () => {
    const { formatEta } = await import('../game/format')
    expect(formatEta(600, 1)).toBe('10 min')
    expect(formatEta(3600 * 5 + 600, 1)).toBe('5 h 10 min')
    expect(formatEta(1e12, 1)).toBeNull()
    expect(formatEta(0, 1)).toBeNull()
    expect(formatEta(10, 0)).toBeNull()
  })
})
