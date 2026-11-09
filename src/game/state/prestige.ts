/** Spielkern — Omas Truhe, Saisonende, Tiefer Winter. Öffentlich über src/game/state.ts. */
import { erbstueckePayout, isProbeYear } from '../economy'
import { EMPTY_TRUHE, TRUHE_ITEMS, type TruheItemId, truheRankUnlocked } from '../truhe'
import { FEST_EARN } from '../fests'
import { varietyForSeasonEnd } from '../gardenLife'
import { legacySproutMult } from '../generations'
import { GENERATORS } from '../generators'
import { DEEP_SHOP, type DeepMetaId, canDeepNow, deepStartErbstuecke, sproutPayout } from '../longLoop'
import { collectReadyAchievements } from './buy'
import { syncChaptersOpen } from './chapters'
import { createPostPrestigeState } from './create'
import { earnFest } from './fest'
import { albumCount } from './life'
import { canPrestigeNow } from './tick'
import type { GameState } from './types'

export function buyTruheItem(state: GameState, id: TruheItemId): GameState {
  const item = TRUHE_ITEMS.find((s) => s.id === id)
  if (!item) return state
  const rank = state.truhe[id]
  if (rank >= item.maxRank) return state
  if (
    !truheRankUnlocked(
      item,
      rank,
      state.ernteSeason,
      state.owned,
      state.saisonenden,
    )
  ) {
    return state
  }
  const cost = item.cost(rank)
  if (state.erbstuecke < cost) return state
  return {
    ...state,
    erbstuecke: state.erbstuecke - cost,
    truhe: {
      ...state.truhe,
      [id]: rank + 1,
    },
    lastSeen: Date.now(),
  }
}

export function doPrestige(state: GameState): GameState {
  if (!canPrestigeNow(state)) return state
  const gain = erbstueckePayout(state.ernteSeason, state.saisonenden, isProbeYear(state))
  const planted = GENERATORS.filter((g) => (state.owned[g.id] ?? 0) > 0).map((g) => g.id)
  const variety = varietyForSeasonEnd(planted, state.collection)
  const next = createPostPrestigeState(
    variety ? { ...state, collection: [...state.collection, variety] } : state,
  )
  const withErbstuecke = { ...next, erbstuecke: state.erbstuecke + gain, lastVariety: variety }
  return albumCount(collectReadyAchievements(earnFest(withErbstuecke, FEST_EARN.seasonEnd)), 'seasons')
}

/** Sprösslinge for a Tiefer Winter now (incl. Wurzelwerk). */
export function deepSproutPayout(state: GameState): number {
  return Math.floor(sproutPayout(state.saisonenden) * legacySproutMult(state.legacy))
}

/** Sprösslings-Laden purchase. */
export function buyDeepUpgrade(state: GameState, id: DeepMetaId): GameState {
  const item = DEEP_SHOP.find((d) => d.id === id)
  if (!item) return state
  const rank = state.sproesslingLaden[id]
  if (rank >= item.maxRank) return state
  const cost = item.cost(rank)
  if (state.sproesslinge < cost) return state
  return {
    ...state,
    sproesslinge: state.sproesslinge - cost,
    sproesslingLaden: { ...state.sproesslingLaden, [id]: rank + 1 },
    lastSeen: Date.now(),
  }
}

/**
 * Tiefer Winter: Gartenjahre, Erbstücke and Omas Truhe reset; Sprösslinge,
 * their boosts, Samen, Gartenstile, Gärtnerstufe and streaks stay.
 */
export function doDeepReset(state: GameState, now = Date.now()): GameState {
  if (!canDeepNow(state.saisonenden, state.tieferWinterAt, now)) return state
  const sprouts = deepSproutPayout(state)
  const fresh = createPostPrestigeState({
    ...state,
    erbstuecke: 0,
    truhe: { ...EMPTY_TRUHE },
  })
  return collectReadyAchievements(
    syncChaptersOpen({
      ...fresh,
      saisonenden: 0,
      erbstuecke: deepStartErbstuecke(state.sproesslingLaden),
      truhe: { ...EMPTY_TRUHE },
      sproesslinge: state.sproesslinge + sprouts,
      tiefeWinter: state.tiefeWinter + 1,
      tieferWinterAt: now,
    }),
  )
}
