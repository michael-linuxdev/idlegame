import { describe, expect, it } from 'vitest'
import { MAX_PLAYER_LEVEL, levelProductionMult, levelProgress, xpForLevel, xpFromOfflineClaim } from '../game/progression'

describe('Gärtnerstufe', () => {
  it('Stufe aus Lebenszeit-EP', () => {
    expect(levelProgress(0)).toMatchObject({ level: 1, intoLevel: 0 })
    expect(levelProgress(xpForLevel(1)).level).toBe(2)
    expect(levelProgress(xpForLevel(1) + 5)).toMatchObject({ level: 2, intoLevel: 5 })
    expect(levelProgress(1e12).level).toBe(MAX_PLAYER_LEVEL)
  })
  it('Bonus +0,5 % je Stufe, gedeckelt bei Stufe 25', () => {
    expect(levelProductionMult(1)).toBe(1)
    expect(levelProductionMult(3)).toBeCloseTo(1.01)
    expect(levelProductionMult(40)).toBeCloseTo(1.12)
  })
  it('Offline-EP: nichts für nichts, sonst 5…80', () => {
    expect(xpFromOfflineClaim(0)).toBe(0)
    expect(xpFromOfflineClaim(1)).toBe(5)
    expect(xpFromOfflineClaim(1e12)).toBe(80)
  })
})
