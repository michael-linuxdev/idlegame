/** Spielkern — Gießen, Glücksrad, Multiplikator-Aufschlüsselung. Öffentlich über src/game/state.ts. */
import { challengesMult } from '../challenges'
import { prestigeMultiplier, tapBonusSeconds } from '../truhe'
import {
  WHEEL_SEEDS,
  type WheelKind,
  collectionMult,
  varietyForSeasonEnd,
  weatherWaterMult,
  weatherYieldMult,
  wheelWaterMult,
  wheelYieldMult,
} from '../gardenLife'
import { legacyWaterMult } from '../generations'
import { GENERATORS } from '../generators'
import { deepYieldMult } from '../longLoop'
import { levelProductionMult } from '../progression'
import { cardGlobalMult } from '../seasonCards'
import { SAFE_COST, weatherBuffMult, weatherOutcome, type WeatherChoice, type WeatherEventKind } from '../weatherEvents'
import {
  bumpQuest,
  effectiveClanMult,
  effectiveYieldBoostMult,
  eventProductionMult,
  expansionGardenMult,
  flashProductionMult,
  neighbourMult,
  playerLevelOf,
  productionPerSecond,
  rainbowMult,
  syncEventWindow,
  syncMonetization,
  turboMult,
} from './core'
import { withEventProgress } from './events'
import { albumCount, pendingWeatherEvent } from './life'
import { TAP_COOLDOWN_MS } from '../economy'
import type { GameState } from './types'

/** Gießen multiplier from weather (Regen) and the Glücksrad. */
export function waterMult(state: GameState, now = Date.now()): number {
  return (
    weatherWaterMult(now) *
    wheelWaterMult(state.wheelBuff, state.saisonenden) *
    legacyWaterMult(state.legacy)
  )
}

export interface Reward {
  /** Seconds of current production */
  ernteSeconds?: number
  samen?: number
  erbstuecke?: number
  xp?: number
  /** Festmarken */
  fest?: number
  /** Kürbis-kg for the Vereinsrunde */
  kg?: number
}

/** Glücksrad result for the Gartenjahr that just began. */
export function applyWheel(state: GameState, kind: WheelKind): GameState {
  let next: GameState = { ...state, wheelBuff: { kind, prestige: state.saisonenden } }
  if (kind === 'seeds') next = { ...next, samen: next.samen + WHEEL_SEEDS }
  if (kind === 'variety') {
    const planted = GENERATORS.map((g) => g.id)
    const v = varietyForSeasonEnd(planted, next.collection)
    if (v) next = { ...next, collection: [...next.collection, v], lastVariety: v }
  }
  return next
}

export function clearLastVariety(state: GameState): GameState {
  return state.lastVariety ? { ...state, lastVariety: null } : state
}

export function grantTapErnte(
  state: GameState,
  gained: number,
  now = Date.now(),
): GameState {
  if (gained <= 0) return state
  let next = withEventProgress(
    syncEventWindow(syncMonetization(state, now), now),
    gained,
    now,
  )
  next = {
    ...next,
    ernte: next.ernte + gained,
    ernteSeason: next.ernteSeason + gained,
    ernteLifetime: next.ernteLifetime + gained,
    lastTapAt: now,
    lastSeen: now,
  }
  return albumCount(bumpQuest(next, 'earnErnte', gained, now), 'water', 1, now)
}


/* ———————————— Aufschlüsselung der Ernte-Multiplikatoren (HUD) ———————————— */

export type MultKey =
  | 'erbe'
  | 'level'
  | 'verein'
  | 'erntefest'
  | 'sonnenfenster'
  | 'duenger'
  | 'winter'
  | 'pflanzenbuch'
  | 'wetter'
  | 'gluecksrad'
  | 'kapitel'
  | 'nachbarn'
  | 'regenbogen'
  | 'fruehling'
  | 'karte'
  | 'herausforderungen'

/**
 * Every factor of productionPerSecond except the per-area ones, in the order
 * a player thinks about them. Factors of exactly 1 are left out.
 * The product equals the HUD multiplier.
 */
export function multBreakdown(state: GameState, now = Date.now()): { key: MultKey; mult: number }[] {
  const all: [MultKey, number][] = [
    ['erbe', prestigeMultiplier(state.truhe)],
    ['level', levelProductionMult(playerLevelOf(state))],
    ['pflanzenbuch', collectionMult(state.collection)],
    ['kapitel', expansionGardenMult(state)],
    ['winter', deepYieldMult(state.sproesslingLaden)],
    ['nachbarn', neighbourMult(state)],
    ['erntefest', eventProductionMult(now)],
    ['sonnenfenster', flashProductionMult(state, now)],
    ['wetter', weatherYieldMult(now) * weatherBuffMult(state.weatherBuff, now)],
    ['gluecksrad', wheelYieldMult(state.wheelBuff, state.saisonenden)],
    ['verein', effectiveClanMult(state, now)],
    ['duenger', effectiveYieldBoostMult(state, now)],
    ['regenbogen', rainbowMult(state, now)],
    ['fruehling', turboMult(state, now)],
    ['karte', cardGlobalMult(state.seasonCard)],
    ['herausforderungen', challengesMult(state.challengesDone)],
  ]
  return all.filter(([, m]) => Math.abs(m - 1) > 1e-6).map(([key, mult]) => ({ key, mult }))
}

export function totalGardenMult(state: GameState, now = Date.now()): number {
  return multBreakdown(state, now).reduce((p, x) => p * x.mult, 1)
}

/**
 * Was die Wahl für **diesen** Garten bedeutet (Runde 4, Paket 2): Erwartung in
 * Ernte, aus den echten Werten von weatherOutcome und SAFE_COST mit der
 * Ernte/s von jetzt. Grundlage der Anzeige vor der Wahl und der Strategie
 * „beste Wahl“ im Simulator.
 */
export interface WeatherPreview {
  kind: WeatherEventKind
  safe: { samen: number; ernte: number }
  /** Riskant: Ernte bei Pech bzw. Glück, Chance auf Pech, Erwartung, Wert der geleerten Gießkanne */
  risk: { bad: number; good: number; chanceBad: number; expected: number; canCost: number }
}

export function weatherPreview(state: GameState, now = Date.now()): WeatherPreview | null {
  const kind = pendingWeatherEvent(state, now)
  if (!kind) return null
  const rate = productionPerSecond(state, now)
  const gain = (o: ReturnType<typeof weatherOutcome>) => (o.buff ? (o.buff.mult - 1) * rate * ((o.buff.until - now) / 1000) : 0)
  const cost = SAFE_COST[kind]
  const safeOut = weatherOutcome(kind, 'safe', 1, now)
  const safe = {
    samen: cost.samen ?? 0,
    ernte: gain(safeOut) - (cost.minutes ? Math.min(state.ernte, rate * cost.minutes * 60) : 0),
  }
  const bad = gain(weatherOutcome(kind, 'risk', 0, now))
  const good = gain(weatherOutcome(kind, 'risk', 0.99, now))
  const chanceBad = weatherOutcome(kind, 'risk', 0, now).good === weatherOutcome(kind, 'risk', 0.99, now).good ? 0 : 0.5
  // Hitze: „früh gießen“ leert die Gießkanne — so viel ist ihr nächster Guss gerade wert
  let canCost = 0
  if (kind === 'hitze') {
    const sinceTap = state.lastTapAt > 0 ? now - state.lastTapAt : TAP_COOLDOWN_MS
    const filled = Math.min(1, sinceTap / TAP_COOLDOWN_MS)
    canCost = rate * tapBonusSeconds(state.truhe) * waterMult(state, now) * filled
  }
  const expected = chanceBad * bad + (1 - chanceBad) * good - canCost
  return { kind, safe, risk: { bad, good, chanceBad, expected, canCost } }
}

/** Ein Same in Ernte-Sekunden: Markt-Preis „Eine Stunde Ernte“ (40 Samen). Nur für die Strategie im Simulator. */
export const SAMEN_AS_SECONDS = 3600 / 40

/** Strategie „beste Wahl“: höhere Erwartung in Ernte, Samen zum Markt-Preis. */
export function bestWeatherChoice(p: WeatherPreview, rate: number, samen: number): WeatherChoice {
  if (p.safe.samen > samen) return 'risk'
  const safe = p.safe.ernte - p.safe.samen * SAMEN_AS_SECONDS * rate
  return p.risk.expected > safe ? 'risk' : 'safe'
}

