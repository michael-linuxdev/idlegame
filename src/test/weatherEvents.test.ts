import { describe, expect, it } from 'vitest'
import { weatherBuffMult, weatherEventAt, weatherOutcome } from '../game/weatherEvents'
import { weatherAt } from '../game/gardenLife'
import { createInitialState, decideWeather, doPrestige, pendingWeatherEvent, productionPerSecond } from '../game/state'
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
    expect(r.state.weatherBuff?.mult).toBe(1.2)
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
