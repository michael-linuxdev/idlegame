/** Spielkern — Gießen, Glücksrad, Multiplikator-Aufschlüsselung. Öffentlich über src/game/state.ts. */
import { challengesMult } from '../challenges'
import { prestigeMultiplier } from '../truhe'
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
import { weatherBuffMult } from '../weatherEvents'
import {
  bumpQuest,
  effectiveClanMult,
  effectiveYieldBoostMult,
  eventProductionMult,
  expansionGardenMult,
  flashProductionMult,
  neighbourMult,
  playerLevelOf,
  rainbowMult,
  syncEventWindow,
  syncMonetization,
  turboMult,
} from './core'
import { withEventProgress } from './events'
import { albumCount } from './life'
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
