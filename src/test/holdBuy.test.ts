import { describe, expect, it } from 'vitest'
import { HOLD_ACCEL, holdLevels } from '../game/holdBuy'

describe('Gedrückthalten beschleunigt (2026-11-14)', () => {
  it('erst einzeln, nach 1,5 s zwei, nach 3 s fünf Stufen je Schritt', () => {
    expect(holdLevels(0)).toBe(1)
    expect(holdLevels(1499)).toBe(1)
    expect(holdLevels(1500)).toBe(2)
    expect(holdLevels(2999)).toBe(2)
    expect(holdLevels(3000)).toBe(5)
    expect(holdLevels(60_000)).toBe(5)
  })
  it('Stufen wachsen nur mit der Zeit', () => {
    for (let i = 1; i < HOLD_ACCEL.length; i++) {
      expect(HOLD_ACCEL[i]!.afterMs).toBeGreaterThan(HOLD_ACCEL[i - 1]!.afterMs)
      expect(HOLD_ACCEL[i]!.levels).toBeGreaterThan(HOLD_ACCEL[i - 1]!.levels)
    }
  })
})
