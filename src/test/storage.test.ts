import { describe, expect, it } from 'vitest'
import { migrateFieldNames, parseSave } from '../game/storage'

describe('save compatibility', () => {
  it('loads saves written with the old internal field names', () => {
    const old = { ash: 123, ashEarned: 456, lifetimeAshEarned: 789, embers: 7, obsidian: 42, deepEmbers: 3, owned: { gemuesebeet: 5 } }
    const s = parseSave(old)!
    expect(s.ernte).toBe(123)
    expect(s.ernteSeason).toBe(456)
    expect(s.ernteLifetime).toBe(789)
    expect(s.erbstuecke).toBe(7)
    expect(s.samen).toBe(42)
    expect(s.sproesslinge).toBe(3)
    expect(s.owned.gemuesebeet).toBe(5)
  })
  it('prefers new names when both exist', () => {
    expect(migrateFieldNames({ ash: 1, ernte: 2 }).ernte).toBe(2)
  })
  it('rejects garbage', () => {
    expect(parseSave('nope')).toBeNull()
  })
})
