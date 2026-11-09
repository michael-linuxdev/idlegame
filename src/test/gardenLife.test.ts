import { describe, expect, it } from 'vitest'
import {
  GARDEN_VARIETIES,
  VARIETIES,
  collectionMult,
  rollVarietyOnUpgrade,
  varietyForSeasonEnd,
  weatherAt,
  weatherWaterMult,
  weatherYieldMult,
  wheelYieldMult,
} from '../game/gardenLife'
import { WEEKLY_TASKS, makeOrder, orderProgress, syncWeek, loadExtras } from '../game/extras'
import { createInitialState, doPrestige, grantReward } from '../game/state'
import { strings } from '../i18n/de/strings'

describe('Pflanzenbuch', () => {
  it('every variety has a German name and the bonus stays moderate', () => {
    for (const v of VARIETIES) expect(strings.plantbook.names[v.id]).toBeTruthy()
    const all = collectionMult(GARDEN_VARIETIES.map((v) => v.id))
    expect(all).toBeGreaterThan(1.2)
    // varieties ≈ +36 %, plus 10 Pflanzenbuch-Sets à +2 %
    expect(all).toBeLessThan(1.6)
    // Festsorten add a little on top, never more than ~+20 %
    expect(collectionMult(VARIETIES.map((v) => v.id)) - all).toBeLessThan(0.2)
  })
  it('never rolls a variety twice', () => {
    const owned = VARIETIES.filter((v) => v.module === 'gemuesebeet').map((v) => v.id)
    expect(rollVarietyOnUpgrade('gemuesebeet', owned, () => 0)).toBeNull()
  })
  it('Saisonende gifts commons first', () => {
    const v = varietyForSeasonEnd(['gemuesebeet', 'kompost'], [], () => 0)
    expect(VARIETIES.find((x) => x.id === v)?.rarity).toBe('common')
  })
})

describe('Wetter & Glücksrad', () => {
  it('is deterministic per day and shapes yield / Gießen', () => {
    const noon = new Date(2026, 10, 13, 12).getTime()
    expect(weatherAt(noon)).toBe(weatherAt(noon + 3 * 3600_000))
    const w = weatherAt(noon)
    expect(weatherYieldMult(noon)).toBe(w === 'sonne' ? 1.1 : 1)
    expect(weatherWaterMult(noon)).toBe(w === 'regen' ? 2 : 1)
  })
  it('wheel buff only lasts for its Gartenjahr', () => {
    expect(wheelYieldMult({ kind: 'yield', prestige: 3 }, 3)).toBe(1.25)
    expect(wheelYieldMult({ kind: 'yield', prestige: 3 }, 4)).toBe(1)
  })
})

describe('Bestellungen, Wochenplan, Belohnungen', () => {
  it('orders scale with production and track lifetime Ernte', () => {
    const o = makeOrder(1, 100, 5_000, 0, () => 0)
    expect(o.need).toBe(100 * 600)
    expect(orderProgress(o, 6_000)).toBe(1_000)
  })
  it('week rolls over', () => {
    const s = { ...loadExtras(0), weekKey: 'old', week: { ...loadExtras(0).week, water: 9 } }
    expect(syncWeek(s, Date.now()).week.water).toBe(0)
    expect(WEEKLY_TASKS).toHaveLength(7)
  })
  it('grantReward pays Samen and seconds of production', () => {
    const s = createInitialState(0)
    const n = grantReward(s, { samen: 5, ernteSeconds: 10 }, 0)
    expect(n.samen).toBe(s.samen + 5)
    expect(n.ernte).toBeGreaterThan(s.ernte)
  })
  it('Saisonende adds a variety to the collection', () => {
    const s = { ...createInitialState(0), ernteSeason: 1e9 }
    s.owned = { ...s.owned, gemuesebeet: 20, kompost: 10, kraeuterspirale: 5 }
    const n = doPrestige(s)
    expect(n.collection.length).toBe(1)
  })
})
