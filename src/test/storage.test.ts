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

import { exportCode, readCode } from '../game/backup'
import { createInitialState, STORAGE_KEY } from '../game/state'

describe('Spielstand sichern', () => {
  it('round-trips a save through the export code', () => {
    const store = new Map<string, string>()
    const ls = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    }
    ;(globalThis as unknown as { localStorage: typeof ls }).localStorage = ls
    const s = { ...createInitialState(0), samen: 99 }
    ls.setItem(STORAGE_KEY, JSON.stringify(s))
    const code = exportCode(0)
    expect(code.startsWith('GARTENERBE1:')).toBe(true)
    const r = readCode(code)
    expect(r.ok).toBe(true)
    if (r.ok) expect(JSON.parse(r.bundle.data[STORAGE_KEY]!).samen).toBe(99)
    expect(readCode('GARTENERBE1:kaputt').ok).toBe(false)
  })
})
