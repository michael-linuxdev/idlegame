import { describe, expect, it } from 'vitest'
import { RESIDENT_FIRST_SAMEN, pickResident, residentFits, residentDef, residentsMult } from '../game/residents'
import { createInitialState, doPrestige, greetResident, productionPerSecond, spawnResident } from '../game/state'
import { parseSave } from '../game/storage'

const ctx = { placed: [] as never[], owned: {}, season: 'summer' as const, daypart: 'day' as const }

describe('Gartenbewohner', () => {
  it('needs the right Deko, area level, season and time', () => {
    const igel = residentDef('igel')!
    expect(residentFits(igel, { ...ctx, placed: ['laubhaufen'], daypart: 'night' })).toBe(true)
    expect(residentFits(igel, { ...ctx, placed: ['laubhaufen'], daypart: 'day' })).toBe(false)
    expect(residentFits(igel, { ...ctx, placed: ['laubhaufen'], daypart: 'night', season: 'winter' })).toBe(false)
    expect(residentFits(residentDef('amsel')!, { ...ctx, owned: { gemuesebeet: 9 } })).toBe(false)
    expect(residentFits(residentDef('amsel')!, { ...ctx, owned: { gemuesebeet: 10 } })).toBe(true)
  })
  it('nobody comes to a bare garden', () => {
    expect(pickResident(ctx, {})).toBeNull()
  })
  it('greeting: first find pays Samen and +1 %, later visits Ernte', () => {
    const base = { ...createInitialState(0), owned: { ...createInitialState(0).owned, gemuesebeet: 20 }, samen: 0 }
    const before = productionPerSecond(base, 1000)
    const s1 = spawnResident(base, 'amsel', 1000)
    const r1 = greetResident(s1, 2000)
    expect(r1.first).toBe(true)
    expect(r1.state.samen).toBe(RESIDENT_FIRST_SAMEN)
    expect(r1.state.residentsSeen.amsel).toBe(1)
    expect(r1.state.residentNow).toBeNull()
    expect(productionPerSecond(r1.state, 3000)).toBeCloseTo(before * 1.01, 3)
    const r2 = greetResident(spawnResident(r1.state, 'amsel', 10_000_000), 10_000_100)
    expect(r2.first).toBe(false)
    expect(r2.ernte).toBeGreaterThan(0)
    expect(residentsMult(r2.state.residentsSeen)).toBeCloseTo(1.01)
    // gone visitors can't be greeted
    const gone = spawnResident(base, 'amsel', 0)
    expect(greetResident(gone, 999_999).state).toBe(gone)
  })
  it('album survives Saisonende; old saves load empty', () => {
    const s = { ...createInitialState(0), residentsSeen: { igel: 2 }, ernteSeason: 1e40 }
    expect(doPrestige(s).residentsSeen).toEqual({ igel: 2 })
    const raw = JSON.parse(JSON.stringify(s)) as Record<string, unknown>
    delete raw.residentsSeen
    delete raw.residentNow
    expect(parseSave(raw)?.residentsSeen).toEqual({})
    raw.residentsSeen = { igel: 3, quatsch: 5 }
    expect(parseSave(raw)?.residentsSeen).toEqual({ igel: 3 })
  })
})
