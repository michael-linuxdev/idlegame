import { describe, expect, it } from 'vitest'
import { NEUTRAL_WEATHER_CTX, WEATHER_EFFECTS, WEATHER_GARDEN, weatherBuffMult, weatherCtx, weatherEventAt, weatherOutcome, weatherRisk } from '../game/weatherEvents'
import { weatherAt } from '../game/gardenLife'
import { bestWeatherChoice, createInitialState, decideWeather, doPrestige, pendingWeatherEvent, productionPerSecond, weatherPreview } from '../game/state'
import { parseSave } from '../game/storage'

/** First day from `start` whose weather event is `kind`. */
function dayWith(kind: string, start: number): number {
  for (let i = 0; i < 400; i++) {
    const t = start + i * 86_400_000
    if (weatherEventAt(t) === kind) return t
  }
  throw new Error('no day')
}

describe('Wetter-Entscheidungen', () => {
  const summer = new Date(2026, 6, 1, 12).getTime()
  const winter = new Date(2026, 0, 5, 12).getTime()
  it('events follow weather + season', () => {
    const t = dayWith('sturm', summer)
    expect(weatherAt(t)).toBe('wind')
    expect(weatherEventAt(dayWith('hitze', summer))).toBe('hitze')
    expect(weatherEventAt(dayWith('frost', winter))).toBe('frost')
  })
  it('risk can hurt, safe costs; one decision per day', () => {
    expect(weatherOutcome('sturm', 'risk', 0.1, 0).buff?.mult).toBe(0.75)
    expect(weatherOutcome('sturm', 'risk', 0.9, 0).buff).toBeNull()
    const t = dayWith('frost', winter)
    const s = { ...createInitialState(0), owned: { ...createInitialState(0).owned, gemuesebeet: 10 }, samen: 5 }
    expect(pendingWeatherEvent(s, t)).toBe('frost')
    const safe = decideWeather(s, 'safe', t, 0.1)
    expect(safe.state.samen).toBe(0)
    expect(pendingWeatherEvent(safe.state, t)).toBeNull()
    const bad = decideWeather(s, 'risk', t, 0.1)
    expect(bad.good).toBe(false)
    expect(productionPerSecond(bad.state, t + 1000)).toBeCloseTo(productionPerSecond(s, t + 1000) * 0.7, 3)
    expect(weatherBuffMult(bad.state.weatherBuff, t + 3 * 3600_000)).toBe(1)
  })
  it('hitze: früh gießen empties the can and boosts', () => {
    const t = dayWith('hitze', summer)
    const r = decideWeather(createInitialState(0), 'risk', t, 0.5)
    expect(r.state.lastTapAt).toBe(t)
    expect(r.state.weatherBuff?.mult).toBe(1.16) // Runde 4: +20 % → +16 % (docs/systeme-inventur.md)
  })
  it('survives Saisonende; old saves load empty', () => {
    const s = { ...createInitialState(0), weatherDecided: '2026-07-01', ernteSeason: 1e40 }
    expect(doPrestige(s).weatherDecided).toBe('2026-07-01')
    const raw = JSON.parse(JSON.stringify(s)) as Record<string, unknown>
    delete raw.weatherDecided
    delete raw.weatherBuff
    expect(parseSave(raw)?.weatherDecided).toBe('')
    expect(parseSave(raw)?.weatherBuff).toBeNull()
  })
})

describe('Entscheidungen schärfen (Runde 4, Paket 2)', () => {
  const summer = new Date(2026, 6, 1, 12).getTime()
  const garden = (extra: Partial<ReturnType<typeof createInitialState>> = {}) => ({
    ...createInitialState(0),
    owned: { ...createInitialState(0).owned, gemuesebeet: 60, kompost: 40, kraeuterspirale: 25 },
    samen: 100,
    ...extra,
  })

  it('Sturm (Paket 5): Sichern kostet Ernte/s, auch bei leerem Korb; die Hecke bricht den Wind', () => {
    const t = dayWith('sturm', summer)
    const rate = productionPerSecond(garden(), t)
    const empty = weatherPreview(garden({ ernte: 0 }), t)!
    // −8 % für 2 h, unabhängig vom Korb (vorher: gratis, wenn der Korb leer war)
    expect(empty.safe.ernte).toBeCloseTo(-0.08 * rate * 7200, 3)
    expect(weatherPreview(garden({ ernte: 1e12 }), t)!.safe.ernte).toBeCloseTo(empty.safe.ernte, 3)
    expect(empty.risk.bad).toBeCloseTo(-0.25 * rate * 7200, 3)
    // ohne Hecke 50 %, mit voller Hecke selten
    const noHedge = weatherPreview(garden({ owned: { ...garden().owned, beerenhecke: 0 } }), t)!
    const hedge = weatherPreview(garden({ owned: { ...garden().owned, beerenhecke: WEATHER_GARDEN.sturm.hedgeFull } }), t)!
    expect(noHedge.risk.chanceBad).toBe(0.5)
    expect(hedge.risk.chanceBad).toBeCloseTo(WEATHER_GARDEN.sturm.chanceMin, 10)
    const r = (x: ReturnType<typeof garden>) => productionPerSecond(x, t)
    expect(bestWeatherChoice(noHedge, r(garden()), 100)).toBe('safe')
    expect(bestWeatherChoice(hedge, r(garden()), 100)).toBe('risk')
    // Ausgang folgt der Chance mit diesem Garten
    const hedged = garden({ owned: { ...garden().owned, beerenhecke: WEATHER_GARDEN.sturm.hedgeFull } })
    expect(decideWeather(hedged, 'risk', t, 0.3).good).toBe(true)
    expect(decideWeather(garden({ owned: { ...garden().owned, beerenhecke: 0 } }), 'risk', t, 0.3).good).toBe(false)
  })

  it('Spätfrost (Paket 5): Glas hält den Großteil des Schadens ab', () => {
    const winter = new Date(2026, 0, 5, 12).getTime()
    const t = dayWith('frost', winter)
    const open = garden()
    const glass = garden({ owned: { ...garden().owned, gewaechshaus: 200, orangerie: 200 } })
    expect(weatherCtx(open.owned).openShare).toBe(1)
    expect(weatherCtx(glass.owned).openShare).toBeLessThan(0.2)
    const po = weatherPreview(open, t)!
    const pg = weatherPreview(glass, t)!
    expect(po.risk.bad / (productionPerSecond(open, t) * 7200)).toBeCloseTo(-0.3, 6)
    // im Freien voller Schaden, unter Glas nur (1 − glassProtect)
    const outside = weatherCtx(glass.owned).openShare
    const hit = outside + (1 - outside) * (1 - WEATHER_GARDEN.frost.glassProtect)
    expect(Math.abs(pg.risk.bad / (productionPerSecond(glass, t) * 7200))).toBeCloseTo(0.3 * hit, 6)
    expect(hit).toBeLessThan(0.5)
    expect(bestWeatherChoice(po, productionPerSecond(open, t), 100)).toBe('safe')
    expect(bestWeatherChoice(pg, productionPerSecond(glass, t), 100)).toBe('risk')
    expect(weatherRisk('frost', NEUTRAL_WEATHER_CTX).bad).toBe(0.7)
  })

  it('Hitzewelle ist eine echte Entscheidung: die Gießkanne entscheidet mit', () => {
    const t = dayWith('hitze', summer)
    const rate = productionPerSecond(garden(), t)
    const justWatered = weatherPreview(garden({ lastTapAt: t - 1000 }), t)!
    const canFull = weatherPreview(garden({ lastTapAt: 0, truhe: { ...createInitialState(0).truhe, messingBrause: 10 } }), t)!
    expect(justWatered.risk.canCost).toBeLessThan(canFull.risk.canCost)
    expect(bestWeatherChoice(justWatered, rate, 100)).toBe('risk')
    expect(bestWeatherChoice(canFull, productionPerSecond(garden({ truhe: { ...createInitialState(0).truhe, messingBrause: 10 } }), t), 100)).toBe('safe')
    // ohne Samen bleibt nur „früh gießen“
    expect(bestWeatherChoice(canFull, rate, 0)).toBe('risk')
  })

  it('nach der Wahl stimmt die Wirkung mit der Vorschau überein', () => {
    const t = dayWith('hitze', summer)
    const s = garden({ lastTapAt: t - 1000 })
    const p = weatherPreview(s, t)!
    const r = decideWeather(s, 'risk', t, 0.5).state
    expect(r.weatherBuff!.mult).toBe(WEATHER_EFFECTS.hitze.risk.good)
    expect(p.risk.good).toBeCloseTo((WEATHER_EFFECTS.hitze.risk.good - 1) * productionPerSecond(s, t) * 7200, 3)
  })
})

describe('Saison-Karte: was das Thema gebracht hat', () => {
  it('gleiche Zahl wie die Vorschau, mit den Stufen am Saisonende', async () => {
    const { cardPreview } = await import('../game/seasonCards')
    const owned = { gemuesebeet: 80, kompost: 10 }
    const p = cardPreview('tomatenjahr', owned)
    expect(p).toBeGreaterThan(1)
    expect(cardPreview('gutesJahr', owned)).toBeCloseTo(1.05, 6)
  })
})
