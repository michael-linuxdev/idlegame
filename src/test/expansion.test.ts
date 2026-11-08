import { describe, expect, it } from 'vitest'
import { GENERATORS, generatorRate, milestoneMult, nextMilestone } from '../game/generators'
import { FESTS, festAt, festKeyAt, festShop } from '../game/fests'
import { GENERATION_GATE_DEEP, legacyPayout } from '../game/generations'
import { orchardGardenMult } from '../game/orchard'
import {
  applyTick,
  buyAllBest,
  buyFestItem,
  buyHelper,
  buyLegacy,
  buyOrchard,
  createInitialState,
  doDeepReset,
  doGeneration,
  doPrestige,
  earnFest,
  productionPerSecond,
  runHelper,
  syncFest,
  type GameState,
} from '../game/state'
import { parseSave } from '../game/storage'
import { DEEP_GATE_YEAR } from '../game/longLoop'

const day = (m: number, d: number, y = 2026) => new Date(y, m - 1, d, 12).getTime()

describe('Meilenstein-Sprünge', () => {
  it('doubles an area at 25, 50, 100 …', () => {
    const g1 = GENERATORS[0]!
    expect(generatorRate(g1, 25) / generatorRate(g1, 24)).toBeGreaterThan(2)
    expect(milestoneMult(24)).toBe(1)
    expect(milestoneMult(25)).toBe(2)
    expect(milestoneMult(100)).toBe(8)
    expect(nextMilestone(30)).toEqual({ at: 50, from: 25 })
  })
})

describe('Saisonale Feste', () => {
  it('always has exactly one fest running, every day of the year', () => {
    for (let i = 0; i < 366; i++) {
      const t = new Date(2028, 0, 1 + i, 12).getTime()
      expect(FESTS).toContain(festAt(t))
    }
    expect(festAt(day(11, 8)).id).toBe('laternenfest')
    expect(festAt(day(12, 10)).id).toBe('advent')
    expect(festAt(day(4, 2)).id).toBe('fruehlingsfest')
  })

  it('keys the Raunächte by the year they started', () => {
    expect(festKeyAt(day(12, 30, 2026))).toBe('raunaechte-2026')
    expect(festKeyAt(day(1, 10, 2027))).toBe('raunaechte-2026')
  })

  it('sells a Festsorte once and resets tokens with the next fest', () => {
    const now = day(11, 8)
    const fest = festAt(now)
    let s = syncFest(createInitialState(now), now)
    s = earnFest(s, 100, now)
    const variety = festShop(fest).find((i) => i.kind === 'variety')!
    s = buyFestItem(s, variety.id, now)
    expect(s.collection).toContain(variety.variety)
    expect(s.festTokens).toBe(100 - variety.tokens)
    expect(buyFestItem(s, variety.id, now)).toBe(s)
    const later = syncFest(s, day(12, 2))
    expect(later.festTokens).toBe(0)
    expect(later.collection).toContain(variety.variety)
  })

  it('charges Samen for the paid Fest-Gartenstil', () => {
    const now = day(12, 5)
    const skin = festShop(festAt(now)).find((i) => i.kind === 'skin')!
    const poor = { ...createInitialState(now), samen: 10 }
    expect(buyFestItem(poor, skin.id, now)).toBe(poor)
    const rich = buyFestItem({ ...createInitialState(now), samen: 500 }, skin.id, now)
    expect(rich.ownedCosmetics).toContain(skin.skin)
    expect(rich.samen).toBe(500 - skin.samen)
  })
})

describe('Gartenhelfer', () => {
  it('is hired after the first Saisonende and keeps building', () => {
    const fresh = { ...createInitialState(0), erbstuecke: 1000 }
    expect(buyHelper(fresh)).toBe(fresh)
    const s = buyHelper({ ...fresh, prestiges: 1 })
    expect(s.helperLevel).toBe(1)
    const rich = { ...s, ernte: 1e6 }
    const { state, bought } = runHelper(rich, 30_000)
    expect(bought).toBeGreaterThan(5)
    expect(state.ernte).toBeLessThan(rich.ernte)
  })

  it('survives Saisonende and Tiefer Winter', () => {
    const s: GameState = {
      ...createInitialState(0),
      helperLevel: 3,
      prestiges: DEEP_GATE_YEAR,
      ernteSeason: 1e30,
      owned: { ...createInitialState(0).owned, gemuesebeet: 50, kompost: 30, kraeuterspirale: 20 },
    }
    expect(doPrestige(s).helperLevel).toBe(3)
    expect(doDeepReset(s).helperLevel).toBe(3)
  })

  it('„Alles ausbauen“ spends on the best buys', () => {
    const s = { ...createInitialState(0), ernte: 50_000 }
    const r = buyAllBest(s)
    expect(r.bought).toBeGreaterThan(10)
    expect(r.state.ernte).toBeLessThan(5_000)
  })
})

describe('Kapitel 2 — Streuobstwiese', () => {
  it('opens after the first Tiefer Winter and boosts the garden', () => {
    const s = { ...createInitialState(0), prestiges: DEEP_GATE_YEAR }
    const after = doDeepReset(s)
    expect(after.orchard.openedAt).toBeGreaterThan(0)
    const before = productionPerSecond(after)
    let o = { ...after, orchard: { ...after.orchard, obst: 1e6 } }
    for (let i = 0; i < 40; i++) o = buyOrchard(o, 'apfel')
    expect(o.orchard.owned.apfel).toBeGreaterThan(30)
    expect(orchardGardenMult(o.orchard)).toBeGreaterThan(1.1)
    expect(productionPerSecond(o)).toBeGreaterThan(before)
  })

  it('grows Obst while the game ticks', () => {
    const s = { ...createInitialState(0), orchard: { ...createInitialState(0).orchard, openedAt: 1 } }
    const next = applyTick(s, 10)
    expect(next.orchard.obst).toBeGreaterThan(s.orchard.obst)
  })
})

describe('Generationen', () => {
  it('needs three Tiefe Winter and keeps orchard, helper and Pflanzenbuch', () => {
    const base = createInitialState(0)
    const s: GameState = {
      ...base,
      deepPrestiges: GENERATION_GATE_DEEP - 1,
      helperLevel: 2,
      collection: ['wurmhumus'],
      orchard: { ...base.orchard, openedAt: 1, owned: { ...base.orchard.owned, apfel: 40 } },
    }
    expect(doGeneration(s)).toBe(s)
    const ready = { ...s, deepPrestiges: GENERATION_GATE_DEEP, sproesslinge: 40 }
    const n = doGeneration(ready)
    expect(n.generation).toBe(1)
    expect(n.vermaechtnis).toBe(legacyPayout(GENERATION_GATE_DEEP, 40))
    expect(n.deepPrestiges).toBe(0)
    expect(n.sproesslinge).toBe(0)
    expect(n.helperLevel).toBe(2)
    expect(n.orchard.owned.apfel).toBe(40)
    expect(n.collection).toContain('wurmhumus')
  })

  it('Familiensinn has no upper limit', () => {
    let s = { ...createInitialState(0), vermaechtnis: 10_000 }
    for (let i = 0; i < 60; i++) s = buyLegacy(s, 'familie')
    expect(s.legacy.familie).toBe(60)
    expect(productionPerSecond(s)).toBeGreaterThan(productionPerSecond(createInitialState(0)) * 9)
  })
})

describe('Speicherstand', () => {
  it('round-trips the new fields', () => {
    const base = createInitialState(0)
    const s: GameState = {
      ...base,
      helperLevel: 4,
      helperOn: false,
      generation: 2,
      vermaechtnis: 7,
      legacy: { ...base.legacy, daumen: 3 },
      festTokens: 42.5,
      festBought: { boost: 2 },
      orchard: { ...base.orchard, obst: 99, openedAt: 5, introSeen: true, owned: { ...base.orchard.owned, birne: 7 } },
    }
    const back = parseSave(JSON.parse(JSON.stringify(s)))!
    expect(back.helperLevel).toBe(4)
    expect(back.helperOn).toBe(false)
    expect(back.generation).toBe(2)
    expect(back.legacy.daumen).toBe(3)
    expect(back.festTokens).toBe(42.5)
    expect(back.festBought).toEqual({ boost: 2 })
    expect(back.orchard.owned.birne).toBe(7)
    expect(back.orchard.introSeen).toBe(true)
  })
})
