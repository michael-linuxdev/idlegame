/**
 * Wetter-Entscheidungen: on some days the weather asks for a choice —
 * Sturm (wind), Hitzewelle (sun in summer), Spätfrost (mild days in winter /
 * spring). One decision per day; the choice changes Ernte for a few hours.
 */
import { weatherAt } from './gardenLife'
import { ambientAt } from '../theme/ambient'
import { GENERATORS, generatorRate, type GeneratorId } from './generators'

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

/**
 * Kosten der sicheren Option. Runde 4 (Paket 5): „Beete sichern“ beim Sturm
 * kostet Ernte/s (−8 % für 2 h, siehe WEATHER_EFFECTS) statt 10 min Ernte aus
 * dem Korb — der Korb ist bei aktiven Spielern fast immer leer, Sichern war
 * dann gratis.
 */
export const SAFE_COST: Record<WeatherEventKind, { samen?: number; minutes?: number }> = {
  sturm: {},
  hitze: { samen: 5 },
  frost: { samen: 5 },
}

/**
 * Was der Garten mitbringt (Runde 4, Paket 5):
 *  - Sturm: Die Beerenhecke bricht den Wind — je höher sie ist, desto seltener
 *    richtet der Sturm Schaden an (`chanceMax` ohne Hecke → `chanceMin` ab Stufe `hedgeFull`).
 *  - Spätfrost: Unter Glas (Gewächshaus, Orangerie) hält das Glas 69 % des
 *    Schadens ab; im Freien trifft er voll.
 */
export const WEATHER_GARDEN = {
  sturm: { chanceMax: 0.5, chanceMin: 0.2, hedgeFull: 150 },
  frost: { glass: ['gewaechshaus', 'orangerie'] as readonly GeneratorId[], glassProtect: 0.69 },
}

export interface WeatherCtx {
  /** Stufe der Beerenhecke */
  hedge: number
  /** Anteil der Garten-Ernte im Freien (0–1) */
  openShare: number
}

/** Ohne Garten (Tests, alte Aufrufe): volle Wirkung wie vor Runde 4. */
export const NEUTRAL_WEATHER_CTX: WeatherCtx = { hedge: 0, openShare: 1 }

export function weatherCtx(owned: Partial<Record<GeneratorId, number>>): WeatherCtx {
  let total = 0
  let open = 0
  for (const def of GENERATORS) {
    const r = generatorRate(def, owned[def.id] ?? 0)
    total += r
    if (!WEATHER_GARDEN.frost.glass.includes(def.id)) open += r
  }
  return { hedge: owned.beerenhecke ?? 0, openShare: total > 0 ? open / total : 1 }
}

/**
 * Wirkung der Optionen als Daten (Runde 4: vom Simulator „beste Wahl“
 * angeglichen, docs/systeme-inventur.md):
 *  - safe: Ernte-Faktor für `hours` (Sturm: Kosten des Sicherns, Hitzewelle: Schattennetz),
 *  - risk: mit `chanceBad` ein schlechter Faktor, sonst `good` (beides für `hours`);
 *    Sturm und Frost hängen zusätzlich am Garten (weatherRisk).
 */
export const WEATHER_EFFECTS: Record<WeatherEventKind, { safe?: { mult: number; hours: number }; risk: { bad: number; good: number; chanceBad: number; hours: number } }> = {
  // Sturm: sichern −8 % für 2 h; riskieren: Schaden −25 % für 2 h, wie oft hängt an der Hecke
  sturm: { safe: { mult: 0.92, hours: 2 }, risk: { bad: 0.75, good: 1, chanceBad: 0.5, hours: 2 } },
  // Runde 4: früh gießen +20 % → +16 % (Simulator „beste Wahl“: vorher immer riskant, jetzt 10–45 %)
  hitze: { safe: { mult: 1.1, hours: 4 }, risk: { bad: 1.16, good: 1.16, chanceBad: 0, hours: 2 } },
  // Spätfrost: Vlies (5 Samen) oder riskieren: −30 % auf den Anteil im Freien
  frost: { risk: { bad: 0.7, good: 1, chanceBad: 0.5, hours: 2 } },
}

/** Risiko mit diesem Garten: Chance auf Schaden und Faktor bei Schaden. */
export function weatherRisk(kind: WeatherEventKind, ctx: WeatherCtx = NEUTRAL_WEATHER_CTX): { chanceBad: number; bad: number } {
  const e = WEATHER_EFFECTS[kind].risk
  if (kind === 'sturm') {
    const g = WEATHER_GARDEN.sturm
    const t = Math.min(1, Math.max(0, ctx.hedge) / g.hedgeFull)
    // Sturm-Werte aus WEATHER_EFFECTS (chanceBad = ohne Hecke)
    const max = Math.min(e.chanceBad, g.chanceMax)
    return { chanceBad: max - (max - g.chanceMin) * t, bad: e.bad }
  }
  if (kind === 'frost') {
    // Glas hält `glassProtect` des Schadens ab
    const open = Math.min(1, Math.max(0, ctx.openShare))
    const hit = open + (1 - open) * (1 - WEATHER_GARDEN.frost.glassProtect)
    return { chanceBad: e.chanceBad, bad: 1 - (1 - e.bad) * hit }
  }
  return { chanceBad: e.chanceBad, bad: e.bad }
}

/** Outcome of a choice; `roll` decides risky ones (0–1). */
export function weatherOutcome(kind: WeatherEventKind, choice: WeatherChoice, roll: number, now: number, ctx: WeatherCtx = NEUTRAL_WEATHER_CTX): { buff: WeatherBuff | null; good: boolean } {
  const e = WEATHER_EFFECTS[kind]
  if (choice === 'safe') return { buff: e.safe ? { mult: e.safe.mult, until: now + e.safe.hours * HOUR } : null, good: true }
  const r = weatherRisk(kind, ctx)
  const hurt = roll < r.chanceBad
  const mult = hurt ? r.bad : e.risk.good
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
