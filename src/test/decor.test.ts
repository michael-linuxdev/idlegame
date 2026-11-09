import { describe, expect, it } from 'vitest'
import { DECOR_SLOTS, decorUnlocked } from '../game/decor'
import { buyDecor, createInitialState, doPrestige, grantDecor, placeDecor } from '../game/state'
import { parseSave } from '../game/storage'

describe('Deko frei platzieren', () => {
  const base = { ...createInitialState(0), saisonenden: 1, samen: 100 }
  it('opens after the first Saisonende', () => {
    expect(decorUnlocked(createInitialState(0))).toBe(false)
    expect(decorUnlocked(base)).toBe(true)
  })
  it('buy once with Samen; exclusive pieces only as reward', () => {
    const a = buyDecor(base, 'zwerg')
    expect(a.decorOwned).toEqual(['zwerg'])
    expect(a.samen).toBe(85)
    expect(buyDecor(a, 'zwerg')).toBe(a)
    expect(buyDecor(base, 'schneemann')).toBe(base)
    expect(grantDecor(base, 'schneemann').decorOwned).toEqual(['schneemann'])
  })
  it('place, move, clear', () => {
    let s = buyDecor(base, 'bank')
    expect(placeDecor(s, 0, 'zwerg')).toBe(s)
    s = placeDecor(s, 2, 'bank')
    expect(s.decorSlots[2]).toBe('bank')
    s = placeDecor(s, 5, 'bank')
    expect(s.decorSlots[2]).toBeNull()
    expect(s.decorSlots[5]).toBe('bank')
    s = placeDecor(s, 5, null)
    expect(s.decorSlots.every((x) => x == null)).toBe(true)
    expect(s.decorSlots).toHaveLength(DECOR_SLOTS.length)
  })
  it('survives Saisonende; old saves load empty; junk is dropped', () => {
    const s = placeDecor(buyDecor({ ...base, ernteSeason: 1e40 }, 'bank'), 1, 'bank')
    expect(doPrestige(s).decorSlots[1]).toBe('bank')
    const raw = JSON.parse(JSON.stringify(s)) as Record<string, unknown>
    delete raw.decorOwned
    delete raw.decorSlots
    expect(parseSave(raw)?.decorOwned).toEqual([])
    raw.decorOwned = ['bank', 'quatsch']
    raw.decorSlots = ['zwerg', 'bank', 'bank']
    const p = parseSave(raw)!
    expect(p.decorOwned).toEqual(['bank'])
    expect(p.decorSlots.slice(0, 3)).toEqual([null, 'bank', null])
  })
})
