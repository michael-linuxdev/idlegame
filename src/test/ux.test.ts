import { describe, expect, it } from 'vitest'
import { GENERATORS, generatorRate } from '../game/generators'
import { createInitialState, multBreakdown, productionPerSecond, totalGardenMult } from '../game/state'

describe('HUD multiplier breakdown', () => {
  it('multiplies to exactly the production factor', () => {
    const now = Date.UTC(2026, 10, 8, 12)
    const s = {
      ...createInitialState(now),
      owned: { ...createInitialState(now).owned, gemuesebeet: 40, kompost: 12 },
      collection: ['tomate', 'moehre'],
      playerXp: 5000,
    }
    const base = GENERATORS.reduce((sum, def) => sum + generatorRate(def, s.owned[def.id] ?? 0), 0)
    expect(base * totalGardenMult(s, now)).toBeCloseTo(productionPerSecond(s, now), 6)
  })

  it('leaves out factors of exactly 1', () => {
    const now = Date.UTC(2026, 10, 8, 12)
    for (const row of multBreakdown(createInitialState(now), now)) expect(row.mult).not.toBe(1)
  })
})

describe('formatAway', () => {
  it('reads naturally', async () => {
    const { formatAway } = await import('../game/format')
    expect(formatAway(30_000)).toBe('1 Minute')
    expect(formatAway(12 * 60_000)).toBe('12 Minuten')
    expect(formatAway(3 * 3600_000)).toBe('3 Stunden')
    expect(formatAway(50 * 3600_000)).toBe('2 Tage')
  })
})

describe('formatEta', () => {
  it('estimates the time to a goal', async () => {
    const { formatEta } = await import('../game/format')
    expect(formatEta(600, 1)).toBe('10 min')
    expect(formatEta(3600 * 5 + 600, 1)).toBe('5 h 10 min')
    expect(formatEta(1e12, 1)).toBeNull()
    expect(formatEta(0, 1)).toBeNull()
    expect(formatEta(10, 0)).toBeNull()
  })
})

describe('HUD-Grenze (Runde 4, Paket 2): höchstens drei Ereignis-Pillen', () => {
  it('nie mehr als drei Plätze, was abläuft zuerst', async () => {
    const { selectPills, MAX_EVENT_PILLS } = await import('../game/hudPills')
    const pills = [
      { key: 'card' },
      { key: 'challenge' },
      { key: 'weather' },
      { key: 'boost', msLeft: 50 * 60_000 },
      { key: 'clan', msLeft: 20 * 60_000 },
      { key: 'rainbow', msLeft: 40_000 },
      { key: 'fest' },
    ]
    const { visible, hidden } = selectPills(pills)
    // zwei Pillen + „+N“ = drei Plätze
    expect(visible.length + (hidden.length > 0 ? 1 : 0)).toBeLessThanOrEqual(MAX_EVENT_PILLS)
    expect(visible.map((p) => p.key)).toEqual(['rainbow', 'clan'])
    expect(hidden.map((p) => p.key)).toEqual(['boost', 'fest', 'card', 'challenge', 'weather'])
    for (let n = 0; n <= pills.length; n++) {
      const r = selectPills(pills.slice(0, n))
      expect(r.visible.length + (r.hidden.length ? 1 : 0)).toBeLessThanOrEqual(3)
      expect(r.visible.length + r.hidden.length).toBe(n)
    }
  })

  it('Abholbares kommt vor allem anderen, Unbekanntes zuletzt', async () => {
    const { orderPills } = await import('../game/hudPills')
    const out = orderPills([{ key: 'neu' }, { key: 'turbo', msLeft: 1000 }, { key: 'order', claim: true, msLeft: 9e9 }, { key: 'season' }])
    expect(out.map((p) => p.key)).toEqual(['order', 'turbo', 'season', 'neu'])
  })

  it('Pillen ohne Restzeit verdrängen nie eine ablaufende (Fehler vorher: Karte/Herausforderung vorn)', async () => {
    const { selectPills } = await import('../game/hudPills')
    const { visible } = selectPills([{ key: 'challenge' }, { key: 'card' }, { key: 'flash', msLeft: 5 * 60_000 }, { key: 'weather' }])
    expect(visible[0]!.key).toBe('flash')
  })
})

describe('„Heute“-Karte (Runde 4, Paket 2)', () => {
  const base = {
    quests: [
      { id: 'a', kind: 'upgrades', target: 10, progress: 10, claimed: false },
      { id: 'b', kind: 'upgrades', target: 10, progress: 3, claimed: false },
    ],
    recipe: { day: 'x', dish: 0, areas: ['gemuesebeet'], have: [8], claimed: false },
    saisonenden: 0,
    tiefeWinter: 0,
    generation: 0,
  }
  const extras = { week: { water: 15, upgrades: 0, orders: 0, visitors: 0, seasons: 0, daily: 0, varieties: 0 }, weekClaimed: [], weekBonusClaimed: false }

  it('neue Spieler: Gartenrunde und Tagesziele, Rezept und Wochenplan erst mit ihrem System', async () => {
    const { todaySections } = await import('../game/today')
    const i = { state: base as never, dailyReady: true, recipeOpen: false, extras: extras as never }
    expect(todaySections(i)).toEqual(['daily', 'quests'])
    expect(todaySections({ ...i, recipeOpen: true })).toEqual(['daily', 'recipe', 'quests'])
    expect(todaySections({ ...i, state: { ...base, saisonenden: 1 } as never, recipeOpen: true })).toEqual(['daily', 'recipe', 'quests', 'weekly'])
  })

  it('bestehende Stände: sofort alles, was sie nutzen', async () => {
    const { todaySections } = await import('../game/today')
    const veteran = { ...base, tiefeWinter: 1 }
    expect(todaySections({ state: veteran as never, dailyReady: false, recipeOpen: true, extras: extras as never })).toEqual(['daily', 'recipe', 'quests', 'weekly'])
  })

  it('ein Zugang zählt alles Abholbare (statt einzelner Punkte)', async () => {
    const { todayReadyCount } = await import('../game/today')
    const i = { state: { ...base, saisonenden: 2 } as never, dailyReady: true, recipeOpen: true, extras: extras as never }
    // Gartenrunde + Rezept fertig + 1 Tagesziel + 1 Wochenaufgabe
    expect(todayReadyCount(i)).toBe(4)
    expect(todayReadyCount({ ...i, recipeOpen: false })).toBe(3)
  })
})
