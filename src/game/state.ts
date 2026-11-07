import {
  EMBER_SHOP,
  emberPayout,
  EMPTY_EMBER_UPGRADES,
  foundryDiscountMult,
  offlineCapsHours,
  offlineCatchupAsh,
  prestigeMinAsh,
  prestigeMultiplier,
  type EmberUpgradeId,
  type EmberUpgrades,
} from './economy'
import {
  GENERATORS,
  GENERATOR_IDS,
  generatorCost,
  generatorRate,
  isGeneratorUnlocked,
  type GeneratorId,
} from './generators'

export interface GameState {
  /** Soft currency — Compute (economy.md Ash) */
  ash: number
  /** Lifetime Compute earned this run (prestige base) */
  ashEarned: number
  owned: Record<GeneratorId, number>
  /** Soft meta — Credits (economy.md Embers; survives prestige) */
  embers: number
  emberUpgrades: EmberUpgrades
  /** Prestige runs completed (0-indexed for next gate) */
  prestiges: number
  lastSeen: number
  /** Last active tap timestamp */
  lastTapAt: number
  /** Clan boost multiplier stub (1.0–1.25) */
  clanMult: number
}

export const STORAGE_KEY = 'orbit-rack-save-v2'

export function emptyOwned(): Record<GeneratorId, number> {
  const owned = {} as Record<GeneratorId, number>
  for (const id of GENERATOR_IDS) {
    owned[id] = 0
  }
  // G1 Power Plant starts online — producing immediately (economy Day-1)
  owned.emberPit = 1
  return owned
}

export function createInitialState(now = Date.now()): GameState {
  return {
    // Day-1: first Power Plant upgrade affordable immediately
    // (Lv1→2 costs floor(15·1.15)=17; start with a small ops float)
    ash: 20,
    ashEarned: 0,
    owned: emptyOwned(),
    embers: 0,
    emberUpgrades: { ...EMPTY_EMBER_UPGRADES },
    prestiges: 0,
    lastSeen: now,
    lastTapAt: 0,
    clanMult: 1,
  }
}

/** Create a fresh run after prestige, keeping meta. */
export function createPostPrestigeState(prev: GameState, now = Date.now()): GameState {
  return {
    ash: 0,
    ashEarned: 0,
    owned: emptyOwned(),
    embers: prev.embers,
    emberUpgrades: { ...prev.emberUpgrades },
    prestiges: prev.prestiges + 1,
    lastSeen: now,
    lastTapAt: 0,
    clanMult: prev.clanMult,
  }
}

export function productionPerSecond(state: GameState): number {
  const mPrestige = prestigeMultiplier(state.emberUpgrades)
  const mClan = Math.min(1.25, Math.max(1, state.clanMult))
  let sum = 0
  for (const def of GENERATORS) {
    sum += generatorRate(def, state.owned[def.id] ?? 0)
  }
  return sum * mPrestige * mClan
}

export function nextPrestigeEmbers(ashEarned: number): number {
  return emberPayout(ashEarned)
}

export function canPrestigeNow(state: GameState): boolean {
  const min = prestigeMinAsh(state.prestiges)
  return state.ashEarned >= min && emberPayout(state.ashEarned) > 0
}

export function prestigeProgress(state: GameState): {
  min: number
  current: number
  ratio: number
  embers: number
} {
  const min = prestigeMinAsh(state.prestiges)
  const current = state.ashEarned
  return {
    min,
    current,
    ratio: min > 0 ? Math.min(1, current / min) : 1,
    embers: emberPayout(current),
  }
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

export function applyOfflineCatchup(
  state: GameState,
  now = Date.now(),
): { state: GameState; gained: number } {
  const elapsedMs = Math.max(0, now - state.lastSeen)
  const elapsedSec = elapsedMs / 1000
  const rate = productionPerSecond(state)
  const caps = offlineCapsHours(state.emberUpgrades)
  const gained = offlineCatchupAsh(rate, elapsedSec, caps.soft, caps.hard)
  if (gained <= 0) {
    return { state: { ...state, lastSeen: now }, gained: 0 }
  }
  return {
    state: {
      ...state,
      ash: state.ash + gained,
      ashEarned: state.ashEarned + gained,
      lastSeen: now,
    },
    gained,
  }
}

export function buyGenerator(state: GameState, id: GeneratorId): GameState {
  const def = GENERATORS.find((g) => g.id === id)
  if (!def) return state
  if (
    !isGeneratorUnlocked(
      def,
      state.ashEarned,
      state.owned,
      state.emberUpgrades.firstFlame > 0,
    )
  ) {
    return state
  }
  const owned = state.owned[id] ?? 0
  const cost = generatorCost(def, owned, foundryDiscountMult(state.emberUpgrades))
  if (state.ash < cost) return state
  return {
    ...state,
    ash: state.ash - cost,
    owned: { ...state.owned, [id]: owned + 1 },
    lastSeen: Date.now(),
  }
}

export function buyEmberUpgrade(state: GameState, id: EmberUpgradeId): GameState {
  const item = EMBER_SHOP.find((s) => s.id === id)
  if (!item) return state
  const rank = state.emberUpgrades[id]
  if (rank >= item.maxRank) return state
  const cost = item.cost(rank)
  if (state.embers < cost) return state
  return {
    ...state,
    embers: state.embers - cost,
    emberUpgrades: {
      ...state.emberUpgrades,
      [id]: rank + 1,
    },
    lastSeen: Date.now(),
  }
}

export function doPrestige(state: GameState): GameState {
  if (!canPrestigeNow(state)) return state
  const gain = emberPayout(state.ashEarned)
  const next = createPostPrestigeState(state)
  return { ...next, embers: state.embers + gain }
}

export { prestigeMultiplier, GENERATOR_IDS, prestigeMinAsh }
