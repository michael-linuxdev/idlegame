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

/**
 * Wirkung der Optionen als Daten (Runde 4: vom Simulator „beste Wahl“
 * angeglichen, docs/systeme-inventur.md):
 *  - safe: Ernte-Faktor für `hours` (nur Hitzewelle; sonst nichts),
 *  - risk: mit `chanceBad` ein schlechter Faktor, sonst `good` (beides für `hours`).
 */
export const WEATHER_EFFECTS: Record<WeatherEventKind, { safe?: { mult: number; hours: number }; risk: { bad: number; good: number; chanceBad: number; hours: number } }> = {
  // Sturm: sichern kostet 10 min Ernte aus dem Korb (höchstens, was drin ist)
  sturm: { risk: { bad: 0.75, good: 1, chanceBad: 0.5, hours: 2 } },
  // Hitzewelle: Schattennetz (+10 % für 4 h, 5 Samen) oder früh gießen (Gießkanne wird geleert)
  // Runde 4: früh gießen +20 % → +16 % (Simulator „beste Wahl“: vorher immer riskant, jetzt 10–45 %)
  hitze: { safe: { mult: 1.1, hours: 4 }, risk: { bad: 1.16, good: 1.16, chanceBad: 0, hours: 2 } },
  // Spätfrost: Vlies (5 Samen) oder riskieren
  frost: { risk: { bad: 0.7, good: 1, chanceBad: 0.5, hours: 2 } },
}

/** Outcome of a choice; `roll` decides risky ones (0–1). */
export function weatherOutcome(kind: WeatherEventKind, choice: WeatherChoice, roll: number, now: number): { buff: WeatherBuff | null; good: boolean } {
  const e = WEATHER_EFFECTS[kind]
  if (choice === 'safe') return { buff: e.safe ? { mult: e.safe.mult, until: now + e.safe.hours * HOUR } : null, good: true }
  const hurt = roll < e.risk.chanceBad
  const mult = hurt ? e.risk.bad : e.risk.good
  return { buff: mult === 1 ? null : { mult, until: now + e.risk.hours * HOUR }, good: !hurt }
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
