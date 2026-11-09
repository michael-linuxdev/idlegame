import { describe, expect, it } from 'vitest'
import { GENERATORS, generatorRate, milestoneMult, nextMilestone } from '../game/generators'
import { FESTS, festAt, festKeyAt, festShop } from '../game/fests'
import { GENERATION_GATE_DEEP, generationGate, legacyPayout } from '../game/generations'
import { CHAPTERS, chaptersGardenMult } from '../game/chapters'
import { contestRank, makeRecipe, neighbourFinals, RECIPE_NEED, WEINLESE } from '../game/extrasCore'
import { completedSets, GARDEN_VARIETIES } from '../game/gardenLife'
import {
  applyTick,
  buyAllBest,
  buyFestItem,
  buyHelper,
  buyLegacy,
  buyChapterArea,
  buyIlse,
  catchRainbow,
  claimDailyOps,
  claimRecipe,
  finishWeinlese,
  neighbourMult,
  recipeReady,
  runIlse,
  syncChaptersOpen,
  syncContest,
  syncSky,
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
    const s = buyHelper({ ...fresh, saisonenden: 1 })
    expect(s.helperLevel).toBe(1)
    const rich = { ...s, ernte: 1e6 }
    // Rank 1 is slow on purpose: one Ausbau every 30 s
    const { state, bought } = runHelper(rich, 5 * 60_000)
    expect(bought).toBeGreaterThanOrEqual(9)
    expect(bought).toBeLessThanOrEqual(10)
    expect(state.ernte).toBeLessThan(rich.ernte)
  })

  it('survives Saisonende and Tiefer Winter', () => {
    const s: GameState = {
      ...createInitialState(0),
      helperLevel: 3,
      saisonenden: DEEP_GATE_YEAR,
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

describe('Kapitel (Streuobstwiese, Weinberg)', () => {
  it('opens the Streuobstwiese after the first Tiefer Winter and boosts the garden', () => {
    const s = { ...createInitialState(0), saisonenden: DEEP_GATE_YEAR }
    const after = doDeepReset(s)
    expect(after.chapters.obstwiese.openedAt).toBeGreaterThan(0)
    expect(after.chapters.weinberg.openedAt).toBe(0)
    const before = productionPerSecond(after)
    let o = { ...after, chapters: { ...after.chapters, obstwiese: { ...after.chapters.obstwiese, cur: 1e6 } } }
    for (let i = 0; i < 40; i++) o = buyChapterArea(o, 'obstwiese', 'apfel')
    expect(o.chapters.obstwiese.owned.apfel).toBeGreaterThan(30)
    expect(chaptersGardenMult(o.chapters)).toBeGreaterThan(1.1)
    expect(productionPerSecond(o)).toBeGreaterThan(before)
  })

  it('opens the Weinberg with the first Generation', () => {
    const s = syncChaptersOpen({ ...createInitialState(0), generation: 1 }, 5)
    expect(s.chapters.weinberg.openedAt).toBe(5)
  })

  it('every chapter has ten areas with copy', () => {
    for (const c of CHAPTERS) expect(c.areas).toHaveLength(10)
  })

  it('grows chapter currency while the game ticks', () => {
    const base = createInitialState(0)
    const s = { ...base, chapters: { ...base.chapters, weinberg: { ...base.chapters.weinberg, openedAt: 1 } } }
    const next = applyTick(s, 10)
    expect(next.chapters.weinberg.cur).toBeGreaterThan(s.chapters.weinberg.cur)
  })

  it('Ilse tends the chapters for Obst', () => {
    const base = createInitialState(0)
    let s = { ...base, chapters: { ...base.chapters, obstwiese: { ...base.chapters.obstwiese, openedAt: 1, cur: 1e5 } } }
    s = buyIlse(s)
    expect(s.ilseLevel).toBe(1)
    const r = runIlse(s, 30_000)
    expect(r.bought).toBeGreaterThan(3)
  })

  it('Weinlese pays per ripe grape, once per hour', () => {
    const base = createInitialState(0)
    const s = { ...base, chapters: { ...base.chapters, weinberg: { ...base.chapters.weinberg, openedAt: 1 } } }
    const now = 10 * 3600_000
    const a = finishWeinlese(s, 7, now)
    expect(a.chapters.weinberg.cur).toBeGreaterThan(s.chapters.weinberg.cur)
    expect(finishWeinlese(a, 10, now + 1000)).toBe(a)
    expect(finishWeinlese(a, 10, now + WEINLESE.cooldownMs)).not.toBe(a)
  })
})

describe('Bindung', () => {
  it('Tagesrezept: three different areas, cook once', () => {
    const r = makeRecipe('2026-11-09', ['gemuesebeet', 'kompost', 'kraeuterspirale', 'beerenhecke'])
    expect(new Set(r.areas).size).toBe(3)
    const s = { ...createInitialState(0), recipe: { ...r, have: [RECIPE_NEED, RECIPE_NEED, RECIPE_NEED] } }
    expect(recipeReady(s)).toBe(true)
    const done = claimRecipe(s)
    expect(done.samen).toBeGreaterThan(s.samen)
    expect(claimRecipe(done)).toBe(done)
  })

  it('Regenbogen: spawns, tap → ×5 for a minute', () => {
    const now = new Date(2026, 10, 9, 12).getTime()
    const s = syncSky({ ...createInitialState(0), skyNextAt: now - 1 }, now)
    expect(s.skyEvent?.kind).toBe('rainbow')
    const r = catchRainbow(s, now + 1000)
    expect(productionPerSecond(r, now + 2000) / productionPerSecond(s, now + 2000)).toBeCloseTo(5)
  })

  it('Messing-Gießkanne bridges one missed day per week', () => {
    const mon = new Date(2026, 10, 9, 10).getTime()
    const s = { ...createInitialState(0), dailyClaimDay: '2026-11-07', dailyStreak: 4 }
    const a = claimDailyOps(s, mon)
    expect(a.dailyStreak).toBe(6)
    expect(a.shieldWeek).not.toBe('')
  })

  it('Größter Kürbis: settles the rank when the week rolls', () => {
    const week = '2026-W1109'
    expect(contestRank(week, 999)).toBe(1)
    expect(contestRank(week, 0)).toBe(neighbourFinals(week).length + 1)
    const s = syncContest({ ...createInitialState(0), contestWeek: week, contestKg: 999 }, new Date(2026, 10, 17).getTime())
    expect(s.contestResult?.rank).toBe(1)
    expect(s.contestKg).toBe(0)
  })

  it('Pflanzenbuch-Sets add a bonus per complete area', () => {
    const kompost = GARDEN_VARIETIES.filter((v) => v.module === 'kompost').map((v) => v.id)
    expect(completedSets(kompost)).toEqual(['kompost'])
  })

  it('Nachbarschaftshilfe only helps the first pass in Gartenjahr 11–14', () => {
    const s = { ...createInitialState(0), saisonenden: 12 }
    expect(neighbourMult(s)).toBeGreaterThan(1)
    expect(neighbourMult({ ...s, tiefeWinter: 1 })).toBe(1)
    expect(neighbourMult({ ...s, saisonenden: 5 })).toBe(1)
  })
})

describe('Generationen', () => {
  it('needs one more Tiefer Winter per generation (3, 4, 5 …)', () => {
    expect(generationGate(0)).toBe(3)
    expect(generationGate(1)).toBe(4)
    expect(generationGate(7)).toBe(10)
    const base = createInitialState(0)
    const g2 = { ...base, generation: 2, tiefeWinter: 4 }
    expect(doGeneration(g2)).toBe(g2)
    const ready = { ...g2, tiefeWinter: 5 }
    expect(doGeneration(ready).generation).toBe(3)
    expect(legacyPayout(5, 0, 2)).toBe(legacyPayout(3, 0, 0))
  })

  it('needs three Tiefe Winter and keeps orchard, helper and Pflanzenbuch', () => {
    const base = createInitialState(0)
    const s: GameState = {
      ...base,
      tiefeWinter: GENERATION_GATE_DEEP - 1,
      helperLevel: 2,
      collection: ['wurmhumus'],
      chapters: { ...base.chapters, obstwiese: { ...base.chapters.obstwiese, openedAt: 1, owned: { ...base.chapters.obstwiese.owned, apfel: 40 } } },
    }
    expect(doGeneration(s)).toBe(s)
    const ready = { ...s, tiefeWinter: GENERATION_GATE_DEEP, sproesslinge: 40 }
    const n = doGeneration(ready)
    expect(n.generation).toBe(1)
    expect(n.vermaechtnis).toBe(legacyPayout(GENERATION_GATE_DEEP, 40))
    expect(n.tiefeWinter).toBe(0)
    expect(n.sproesslinge).toBe(0)
    expect(n.helperLevel).toBe(2)
    expect(n.chapters.obstwiese.owned.apfel).toBe(40)
    expect(n.chapters.weinberg.openedAt).toBeGreaterThan(0)
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
      chapters: { ...base.chapters, obstwiese: { ...base.chapters.obstwiese, cur: 99, openedAt: 5, introSeen: true, owned: { ...base.chapters.obstwiese.owned, birne: 7 } } },
      ilseLevel: 2,
      milestoneRecord: { 'g:kompost': 2 },
    }
    const back = parseSave(JSON.parse(JSON.stringify(s)))!
    expect(back.helperLevel).toBe(4)
    expect(back.helperOn).toBe(false)
    expect(back.generation).toBe(2)
    expect(back.legacy.daumen).toBe(3)
    expect(back.festTokens).toBe(42.5)
    expect(back.festBought).toEqual({ boost: 2 })
    expect(back.chapters.obstwiese.owned.birne).toBe(7)
    expect(back.chapters.obstwiese.introSeen).toBe(true)
    expect(back.ilseLevel).toBe(2)
    expect(back.milestoneRecord).toEqual({ 'g:kompost': 2 })
  })
})

describe('Mengenkauf-Freischaltung', () => {
  it('×1 zuerst, Max nach dem 2. Saisonende, ×5 ab Jahr 4, Alles ausbauen ab Jahr 6', async () => {
    const { bulkUnlocks } = await import('../game/state')
    const base = createInitialState(0)
    expect(bulkUnlocks(base)).toEqual({ max: false, five: false, all: false })
    expect(bulkUnlocks({ ...base, saisonenden: 1 })).toEqual({ max: false, five: false, all: false })
    expect(bulkUnlocks({ ...base, saisonenden: 2 })).toEqual({ max: true, five: false, all: false })
    expect(bulkUnlocks({ ...base, saisonenden: 3 })).toEqual({ max: true, five: true, all: false })
    expect(bulkUnlocks({ ...base, saisonenden: 5 })).toEqual({ max: true, five: true, all: true })
    expect(bulkUnlocks({ ...base, tiefeWinter: 1 })).toEqual({ max: true, five: true, all: true })
  })
})
