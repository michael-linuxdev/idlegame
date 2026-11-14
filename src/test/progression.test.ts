import { describe, expect, it } from 'vitest'
import { CLASSIC_MAX_LEVEL, LEVEL_REWARDS, MAX_PLAYER_LEVEL, levelProductionMult, levelProgress, levelRewardAt, xpForLevel, xpFromOfflineClaim } from '../game/progression'

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
  it('Über Stufe 40: kleiner Bonus je Stufe, gedeckelt bei 100', () => {
    expect(levelProductionMult(41)).toBeCloseTo(1.1225)
    expect(levelProductionMult(100)).toBeCloseTo(1.27)
    expect(levelProductionMult(500)).toBeCloseTo(1.27)
  })
  it('Kurve bis Stufe 40 unverändert — niemand verliert durch das Update eine Stufe', () => {
    // Werte der alten Formel 40 + 25 L + 8 L² (Obergrenze 40)
    for (const L of [1, 10, 25, 39]) expect(xpForLevel(L)).toBe(Math.floor(40 + 25 * L + 8 * L * L))
    let total = 0
    for (let L = 1; L < CLASSIC_MAX_LEVEL; L++) total += xpForLevel(L)
    expect(levelProgress(total).level).toBe(CLASSIC_MAX_LEVEL)
    expect(levelProgress(total - 1).level).toBe(CLASSIC_MAX_LEVEL - 1)
    // jede Stufe darüber kostet mehr als die davor
    for (let L = CLASSIC_MAX_LEVEL; L < MAX_PLAYER_LEVEL; L++) expect(xpForLevel(L + 1)).toBeGreaterThan(xpForLevel(L))
  })
  it('Alle 5 Stufen über 40 eine Samen-Belohnung', () => {
    for (let L = 45; L <= MAX_PLAYER_LEVEL; L += 5) expect(levelRewardAt(L)).toMatchObject({ kind: 'samen' })
    expect(levelRewardAt(41)).toBeUndefined()
    expect(new Set(LEVEL_REWARDS.map((r) => r.level)).size).toBe(LEVEL_REWARDS.length)
  })
  it('Offline-EP: nichts für nichts, sonst 5…80', () => {
    expect(xpFromOfflineClaim(0)).toBe(0)
    expect(xpFromOfflineClaim(1)).toBe(5)
    expect(xpFromOfflineClaim(1e12)).toBe(80)
  })
})
