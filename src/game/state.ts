import { GENERATORS, GENERATOR_IDS, type GeneratorId } from './generators'

export interface GameState {
  /** Current Ash (Embers) */
  ash: number
  /** Lifetime ash earned this run (for prestige calc) */
  ashEarned: number
  owned: Record<GeneratorId, number>
  /** Soft-reset meta currency */
  dominion: number
  /** Prestige runs completed */
  prestiges: number
  lastSeen: number
}

export const STORAGE_KEY = 'ash-dominion-save-v1'

export function emptyOwned(): Record<GeneratorId, number> {
  const owned = {} as Record<GeneratorId, number>
  for (const id of GENERATOR_IDS) {
    owned[id] = 0
  }
  return owned
}

export function createInitialState(now = Date.now()): GameState {
  return {
    ash: 0,
    ashEarned: 0,
    owned: emptyOwned(),
    dominion: 0,
    prestiges: 0,
    lastSeen: now,
  }
}

/** Meta production multiplier from dominion */
export function prestigeMultiplier(dominion: number): number {
  return 1 + dominion * 0.1
}

export function productionPerSecond(state: GameState): number {
  const mult = prestigeMultiplier(state.dominion)
  let rate = 0
  for (const def of GENERATORS) {
    rate += def.baseRate * (state.owned[def.id] ?? 0)
  }
  return rate * mult
}

/** Dominions gained if prestige now (floor of sqrt(ashEarned / 1000)) */
export function prestigeGain(ashEarned: number): number {
  return Math.floor(Math.sqrt(ashEarned / 1000))
}

export function applyTick(state: GameState, dtSeconds: number): GameState {
  if (dtSeconds <= 0) return state
  const gained = productionPerSecond(state) * dtSeconds
  if (gained <= 0) {
    return { ...state, lastSeen: Date.now() }
  }
  return {
    ...state,
    ash: state.ash + gained,
    ashEarned: state.ashEarned + gained,
    lastSeen: Date.now(),
  }
}

export function applyOfflineCatchup(state: GameState, now = Date.now()): GameState {
  const elapsedMs = Math.max(0, now - state.lastSeen)
  // Cap catchup at 7 days to avoid absurd numbers from clock skew
  const capped = Math.min(elapsedMs, 7 * 24 * 60 * 60 * 1000)
  return applyTick(state, capped / 1000)
}
