/** Spielkern — Generationen und Vermächtnis. Öffentlich über src/game/state.ts. */
import { totalChapterLevels } from '../chapters'
import { EMPTY_TRUHE } from '../truhe'
import { LEGACY_SHOP, type LegacyId, canHandDown, legacyPayout } from '../generations'
import { EMPTY_DEEP_META } from '../longLoop'
import { collectReadyAchievements } from './buy'
import { syncChaptersOpen } from './chapters'
import { createPostPrestigeState } from './create'
import type { GameState } from './types'

export function generationPayout(state: GameState): number {
  return legacyPayout(state.tiefeWinter, totalChapterLevels(state.chapters), state.generation)
}

export function canHandDownNow(state: GameState): boolean {
  return canHandDown(state.tiefeWinter, state.generation)
}

/**
 * Hand the garden down: Gartenjahre, Erbstücke, Truhe, Sprösslinge and the
 * Sprösslings-Laden reset. Vermächtnis, orchard, Pflanzenbuch, Samen,
 * Gartenstile, Gärtnerstufe and the Gartenhelfer stay.
 */
export function doGeneration(state: GameState, now = Date.now()): GameState {
  if (!canHandDownNow(state)) return state
  const gain = generationPayout(state)
  const fresh = createPostPrestigeState(
    { ...state, erbstuecke: 0, truhe: { ...EMPTY_TRUHE } },
    now,
  )
  return collectReadyAchievements(syncChaptersOpen({
    ...fresh,
    saisonenden: 0,
    erbstuecke: 0,
    truhe: { ...EMPTY_TRUHE },
    sproesslinge: 0,
    wintervorrat: 0,
    sproesslingLaden: { ...EMPTY_DEEP_META },
    tiefeWinter: 0,
    generation: state.generation + 1,
    vermaechtnis: state.vermaechtnis + gain,
    wheelBuff: null,
  }, now))
}

export function buyLegacy(state: GameState, id: LegacyId): GameState {
  const item = LEGACY_SHOP.find((l) => l.id === id)
  if (!item) return state
  const rank = state.legacy[id]
  const cost = item.cost(rank)
  if (state.vermaechtnis < cost) return state
  return {
    ...state,
    vermaechtnis: state.vermaechtnis - cost,
    legacy: { ...state.legacy, [id]: rank + 1 },
    lastSeen: Date.now(),
  }
}
