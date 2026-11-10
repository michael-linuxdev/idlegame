import { describe, expect, it } from 'vitest'
import { WEATHER_EFFECTS, weatherBuffMult, weatherEventAt, weatherOutcome } from '../game/weatherEvents'
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

  it('zeigt die Folge in Ernte für diesen Garten (Sturm: höchstens, was im Korb liegt)', () => {
    const t = dayWith('sturm', summer)
    const rate = productionPerSecond(garden(), t)
    const full = weatherPreview(garden({ ernte: 1e12 }), t)!
    expect(full.safe.ernte).toBeCloseTo(-rate * 600, 3)
    expect(full.risk.chanceBad).toBe(0.5)
    expect(full.risk.bad).toBeCloseTo(-0.25 * rate * 7200, 3)
    const empty = weatherPreview(garden({ ernte: 0 }), t)!
    expect(empty.safe.ernte).toBe(0)
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
