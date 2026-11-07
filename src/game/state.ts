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
import {
  canClaimDaily,
  nextStreakAfterClaim,
  rewardForStreak,
} from './dailyOps'
import {
  BANDWIDTH_SURGE_GOAL,
  BANDWIDTH_SURGE_GOAL_REWARD,
  BANDWIDTH_SURGE_MULT,
  bandwidthSurgeWindowKey,
  isBandwidthSurgeActive,
} from './events'
import {
  CLAN_BOOST,
  CLAN_BOOST_MAX,
  COSMETICS,
  DAILY_SKIP_CAP_HOURS,
  TIME_SKIPS,
  dayKey,
  type CosmeticId,
  type ObsidianPackDef,
  type TimeSkipId,
} from './monetization'

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
  /** Active clan boost multiplier while clanBoostExpiresAt > now (1.0–1.25) */
  clanMult: number
  /** Hard currency — Obsidian (survives prestige) */
  obsidian: number
  /** Owned cosmetic ids (survives prestige) */
  ownedCosmetics: CosmeticId[]
  /** Equipped station skin */
  equippedCosmetic: CosmeticId
  /** Hours of paid time-skip used on skipDayKey */
  skipHoursUsedToday: number
  /** Local calendar day for skipHoursUsedToday */
  skipDayKey: string
  /** Clan boost expiry timestamp; 0 = inactive */
  clanBoostExpiresAt: number
  /** Daily Ops — last claim day key (local); empty = never */
  dailyClaimDay: string
  /** Daily Ops streak (freeze on miss, never energy) */
  dailyStreak: number
  /** Bandwidth Surge window key last dismissed */
  eventDismissedKey: string
  /** Compute earned toward surge goal in current window */
  eventAshProgress: number
  /** Window key for eventAshProgress */
  eventProgressKey: string
  /** Window key when surge goal reward was claimed */
  eventGoalClaimedKey: string
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
    // Day-1 login gift: 20 Obsidian (economy.md §10)
    obsidian: 20,
    ownedCosmetics: ['steelDeck'],
    equippedCosmetic: 'steelDeck',
    skipHoursUsedToday: 0,
    skipDayKey: dayKey(now),
    clanBoostExpiresAt: 0,
    dailyClaimDay: '',
    dailyStreak: 0,
    eventDismissedKey: '',
    eventAshProgress: 0,
    eventProgressKey: '',
    eventGoalClaimedKey: '',
  }
}

/** Create a fresh run after prestige, keeping meta + monetization unlocks. */
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
    obsidian: prev.obsidian,
    ownedCosmetics: [...prev.ownedCosmetics],
    equippedCosmetic: prev.equippedCosmetic,
    skipHoursUsedToday: prev.skipHoursUsedToday,
    skipDayKey: prev.skipDayKey,
    clanBoostExpiresAt: prev.clanBoostExpiresAt,
    dailyClaimDay: prev.dailyClaimDay,
    dailyStreak: prev.dailyStreak,
    eventDismissedKey: prev.eventDismissedKey,
    eventAshProgress: prev.eventAshProgress,
    eventProgressKey: prev.eventProgressKey,
    eventGoalClaimedKey: prev.eventGoalClaimedKey,
  }
}

/** Sync event progress window; reset progress when a new surge window opens. */
export function syncEventWindow(state: GameState, now = Date.now()): GameState {
  if (!isBandwidthSurgeActive(now)) return state
  const key = bandwidthSurgeWindowKey(now)
  if (state.eventProgressKey === key) return state
  return {
    ...state,
    eventProgressKey: key,
    eventAshProgress: 0,
  }
}

export function eventProductionMult(now = Date.now()): number {
  return isBandwidthSurgeActive(now) ? BANDWIDTH_SURGE_MULT : 1
}

/** Effective clan multiplier honoring expiry + hard max. */
export function effectiveClanMult(state: GameState, now = Date.now()): number {
  if (state.clanBoostExpiresAt > 0 && now >= state.clanBoostExpiresAt) {
    return 1
  }
  if (state.clanBoostExpiresAt <= 0) return 1
  return Math.min(CLAN_BOOST_MAX, Math.max(1, state.clanMult))
}

/** Drop expired clan boost fields (idempotent). */
export function syncClanBoost(state: GameState, now = Date.now()): GameState {
  if (state.clanBoostExpiresAt > 0 && now >= state.clanBoostExpiresAt) {
    return { ...state, clanMult: 1, clanBoostExpiresAt: 0 }
  }
  return state
}

export function productionPerSecond(state: GameState, now = Date.now()): number {
  const mPrestige = prestigeMultiplier(state.emberUpgrades)
  const mClan = effectiveClanMult(state, now)
  const mEvent = eventProductionMult(now)
  let sum = 0
  for (const def of GENERATORS) {
    sum += generatorRate(def, state.owned[def.id] ?? 0)
  }
  return sum * mPrestige * mClan * mEvent
}

function withEventProgress(state: GameState, gained: number, now: number): GameState {
  if (gained <= 0 || !isBandwidthSurgeActive(now)) return state
  const synced = syncEventWindow(state, now)
  return {
    ...synced,
    eventAshProgress: synced.eventAshProgress + gained,
  }
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
  const now = Date.now()
  const synced = syncEventWindow(syncClanBoost(state, now), now)
  const gained = productionPerSecond(synced, now) * dtSeconds
  if (gained <= 0) {
    return { ...synced, lastSeen: now }
  }
  const withProg = withEventProgress(synced, gained, now)
  return {
    ...withProg,
    ash: withProg.ash + gained,
    ashEarned: withProg.ashEarned + gained,
    lastSeen: now,
  }
}

function withSkipDay(state: GameState, now = Date.now()): GameState {
  const key = dayKey(now)
  if (state.skipDayKey === key) return state
  return { ...state, skipDayKey: key, skipHoursUsedToday: 0 }
}

export function skipHoursRemaining(state: GameState, now = Date.now()): number {
  const s = withSkipDay(state, now)
  return Math.max(0, DAILY_SKIP_CAP_HOURS - s.skipHoursUsedToday)
}

export function buyTimeSkip(state: GameState, id: TimeSkipId, now = Date.now()): GameState {
  const def = TIME_SKIPS.find((t) => t.id === id)
  if (!def) return state
  let next = syncEventWindow(syncClanBoost(withSkipDay(state, now), now), now)
  const remaining = DAILY_SKIP_CAP_HOURS - next.skipHoursUsedToday
  if (remaining <= 0) return state
  const hours = Math.min(def.hours, remaining, 4)
  if (hours <= 0) return state
  if (next.obsidian < def.cost) return state
  const rate = productionPerSecond(next, now)
  const gained = rate * hours * 3600
  next = withEventProgress(next, gained, now)
  return {
    ...next,
    obsidian: next.obsidian - def.cost,
    ash: next.ash + gained,
    ashEarned: next.ashEarned + gained,
    skipHoursUsedToday: next.skipHoursUsedToday + hours,
    lastSeen: now,
  }
}

export function claimDailyOps(state: GameState, now = Date.now()): GameState {
  if (!canClaimDaily(state.dailyClaimDay, now)) return state
  const streak = nextStreakAfterClaim(state.dailyClaimDay, state.dailyStreak, now)
  const rate = productionPerSecond(state, now)
  const reward = rewardForStreak(Math.max(0, streak - 1), rate)
  let next = syncEventWindow(syncClanBoost(state, now), now)
  next = withEventProgress(next, reward.compute, now)
  return {
    ...next,
    ash: next.ash + reward.compute,
    ashEarned: next.ashEarned + reward.compute,
    embers: next.embers + reward.credits,
    obsidian: next.obsidian + reward.obsidian,
    dailyClaimDay: dayKey(now),
    dailyStreak: streak,
    lastSeen: now,
  }
}

export function dismissBandwidthSurge(state: GameState, now = Date.now()): GameState {
  if (!isBandwidthSurgeActive(now)) return state
  return {
    ...state,
    eventDismissedKey: bandwidthSurgeWindowKey(now),
    lastSeen: now,
  }
}

export function claimBandwidthSurgeGoal(state: GameState, now = Date.now()): GameState {
  if (!isBandwidthSurgeActive(now)) return state
  const key = bandwidthSurgeWindowKey(now)
  let next = syncEventWindow(state, now)
  if (next.eventGoalClaimedKey === key) return state
  if (next.eventAshProgress < BANDWIDTH_SURGE_GOAL) return state
  return {
    ...next,
    obsidian: next.obsidian + BANDWIDTH_SURGE_GOAL_REWARD,
    eventGoalClaimedKey: key,
    lastSeen: now,
  }
}

export function buyCosmetic(state: GameState, id: CosmeticId, now = Date.now()): GameState {
  const def = COSMETICS.find((c) => c.id === id)
  if (!def) return state
  if (state.ownedCosmetics.includes(id)) return state
  if (def.cost <= 0) {
    return {
      ...state,
      ownedCosmetics: [...state.ownedCosmetics, id],
      lastSeen: now,
    }
  }
  if (state.obsidian < def.cost) return state
  return {
    ...state,
    obsidian: state.obsidian - def.cost,
    ownedCosmetics: [...state.ownedCosmetics, id],
    lastSeen: now,
  }
}

export function equipCosmetic(state: GameState, id: CosmeticId, now = Date.now()): GameState {
  if (!state.ownedCosmetics.includes(id)) return state
  if (state.equippedCosmetic === id) return state
  return { ...state, equippedCosmetic: id, lastSeen: now }
}

export function buyClanBoost(state: GameState, now = Date.now()): GameState {
  let next = syncClanBoost(state, now)
  if (next.obsidian < CLAN_BOOST.cost) return state
  const active = next.clanBoostExpiresAt > now
  const baseExpiry = active ? next.clanBoostExpiresAt : now
  const nextMult = Math.min(
    CLAN_BOOST_MAX,
    Math.max(next.clanMult > 1 ? next.clanMult : 1, CLAN_BOOST.mult),
  )
  return {
    ...next,
    obsidian: next.obsidian - CLAN_BOOST.cost,
    clanMult: nextMult,
    clanBoostExpiresAt: baseExpiry + CLAN_BOOST.durationMs,
    lastSeen: now,
  }
}

export function mockBuyPack(state: GameState, pack: ObsidianPackDef, now = Date.now()): GameState {
  const owned = new Set(state.ownedCosmetics)
  if (pack.cosmeticId) owned.add(pack.cosmeticId)
  return {
    ...state,
    obsidian: state.obsidian + pack.obsidian,
    ownedCosmetics: Array.from(owned),
    lastSeen: now,
  }
}

export function applyOfflineCatchup(
  state: GameState,
  now = Date.now(),
): { state: GameState; gained: number } {
  const elapsedMs = Math.max(0, now - state.lastSeen)
  const elapsedSec = elapsedMs / 1000
  const base = syncEventWindow(syncClanBoost(state, now), now)
  const rate = productionPerSecond(base, now)
  const caps = offlineCapsHours(base.emberUpgrades)
  const gained = offlineCatchupAsh(rate, elapsedSec, caps.soft, caps.hard)
  if (gained <= 0) {
    return { state: { ...base, lastSeen: now }, gained: 0 }
  }
  const withProg = withEventProgress(base, gained, now)
  return {
    state: {
      ...withProg,
      ash: withProg.ash + gained,
      ashEarned: withProg.ashEarned + gained,
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
