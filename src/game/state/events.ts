/** Spielkern — Erntefest-Fortschritt, Saisonende-Hinweise, Sonnenfenster. Öffentlich über src/game/state.ts. */
import { isProbeYear } from '../economy'
import { isErntefestActive } from '../events'
import {
  FLASH_CLAIM_GRACE_MS,
  FLASH_DURATION_MS,
  FLASH_GOAL_REWARD_SAMEN,
  canSpawnFlashEvent,
  flashGoalForRate,
  makeFlashEventId,
  rollFlashSpawn,
} from '../flashEvent'
import { prestigeSpikeBit, rollPrestigeSpike } from '../surpriseJumps'
import { productionPerSecond, syncEventWindow, turboMult } from './core'
import type { GameState } from './types'

export function withEventProgress(state: GameState, gained: number, now: number): GameState {
  if (gained <= 0) return state
  let next = state
  if (isErntefestActive(now)) {
    const synced = syncEventWindow(next, now)
    next = {
      ...synced,
      erntefestErnte: synced.erntefestErnte + gained,
    }
  }
  if (next.flashEventId && next.flashEndsAt > now && !next.flashClaimed) {
    next = {
      ...next,
      flashProgress: next.flashProgress + gained,
    }
  }
  return next
}

export function maybePrestigeSpike(state: GameState, now: number): GameState {
  const rate = productionPerSecond(state, now) / turboMult(state, now)
  const spike = rollPrestigeSpike(
    state.ernteSeason,
    state.saisonenden,
    state.saisonendeSpikeFlags,
    rate,
    isProbeYear(state),
  )
  if (!spike || spike.prestigeTier == null) return state
  return {
    ...state,
    ernte: state.ernte + spike.amount,
    ernteSeason: state.ernteSeason + spike.amount,
    ernteLifetime: state.ernteLifetime + spike.amount,
    saisonendeSpikeFlags:
      state.saisonendeSpikeFlags | prestigeSpikeBit(spike.prestigeTier),
    lastSurprise: spike,
    lastSeen: now,
  }
}

export function clearLastSurprise(state: GameState): GameState {
  if (!state.lastSurprise) return state
  return { ...state, lastSurprise: null }
}

export function maybeStartFlashEvent(
  state: GameState,
  now = Date.now(),
  force = false,
): GameState {
  if (
    !force &&
    !rollFlashSpawn(state.lastFlashAt, state.flashEndsAt, now)
  ) {
    return state
  }
  if (!canSpawnFlashEvent(state.lastFlashAt, state.flashEndsAt, now) && !force) {
    return state
  }
  const rate = productionPerSecond(
    {
      ...state,
      flashEventId: '',
      flashEndsAt: 0,
    },
    now,
  )
  return {
    ...state,
    flashEventId: makeFlashEventId(now),
    flashEndsAt: now + FLASH_DURATION_MS,
    flashProgress: 0,
    flashGoal: flashGoalForRate(rate),
    flashClaimed: false,
    flashDismissed: false,
    lastFlashAt: now,
    lastSeen: now,
  }
}

export function dismissFlashEvent(state: GameState, now = Date.now()): GameState {
  if (!state.flashEventId) return state
  return { ...state, flashDismissed: true, lastSeen: now }
}

export function claimFlashEventGoal(
  state: GameState,
  now = Date.now(),
): GameState {
  if (!state.flashEventId || state.flashClaimed) return state
  if (state.flashProgress < state.flashGoal) return state
  const inWindow =
    state.flashEndsAt > now || now <= state.flashEndsAt + FLASH_CLAIM_GRACE_MS
  if (!inWindow) return state
  return {
    ...state,
    samen: state.samen + FLASH_GOAL_REWARD_SAMEN,
    flashClaimed: true,
    flashDismissed: true,
    lastSeen: now,
  }
}
