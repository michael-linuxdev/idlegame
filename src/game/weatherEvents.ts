/**
 * Wetter-Entscheidungen: on some days the weather asks for a choice —
 * Sturm (wind), Hitzewelle (sun in summer), Spätfrost (mild days in winter /
 * spring). One decision per day; the choice changes Ernte for a few hours.
 */
import { weatherAt } from './gardenLife'
import { ambientAt } from '../theme/ambient'

export type WeatherEventKind = 'sturm' | 'hitze' | 'frost'
export type WeatherChoice = 'safe' | 'risk'

export interface WeatherBuff {
  mult: number
  until: number
}

export const HOUR = 3600_000

/** Today's weather event (null = nothing to decide). */
export function weatherEventAt(now: number): WeatherEventKind | null {
  const w = weatherAt(now)
  const season = ambientAt(new Date(now)).season
  if (w === 'wind') return 'sturm'
  if (w === 'sonne' && season === 'summer') return 'hitze'
  if (w === 'mild' && (season === 'winter' || season === 'spring')) return 'frost'
  return null
}

/** Cost of the safe option: Samen, or minutes of production (Sturm). */
export const SAFE_COST: Record<WeatherEventKind, { samen?: number; minutes?: number }> = {
  sturm: { minutes: 10 },
  hitze: { samen: 5 },
  frost: { samen: 5 },
}

/** Outcome of a choice; `roll` decides risky ones (0–1). */
export function weatherOutcome(kind: WeatherEventKind, choice: WeatherChoice, roll: number, now: number): { buff: WeatherBuff | null; good: boolean } {
  if (kind === 'hitze') {
    // safe = Schattennetz (+10 % for 4 h); risk = früh gießen (+20 % 2 h, can is emptied)
    return choice === 'safe'
      ? { buff: { mult: 1.1, until: now + 4 * HOUR }, good: true }
      : { buff: { mult: 1.2, until: now + 2 * HOUR }, good: true }
  }
  if (choice === 'safe') return { buff: null, good: true }
  const hurt = roll < 0.5
  if (!hurt) return { buff: null, good: true }
  return { buff: { mult: kind === 'sturm' ? 0.75 : 0.7, until: now + 2 * HOUR }, good: false }
}

export function weatherBuffMult(buff: WeatherBuff | null, now: number): number {
  return buff && buff.until > now ? buff.mult : 1
}

export function parseWeatherBuff(raw: unknown): WeatherBuff | null {
  if (raw == null || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (typeof r.mult !== 'number' || typeof r.until !== 'number' || !Number.isFinite(r.mult) || r.mult <= 0 || r.mult > 2) return null
  return { mult: r.mult, until: r.until }
}
