import {
  EMBER_SHOP,
  emberPayout,
  EMPTY_EMBER_UPGRADES,
  foundryDiscountMult,
  offlineCapsHours,
  offlineCatchupAsh,
  prestigeMinAsh,
  prestigeMultiplier,
  prestigeStartAsh,
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
  daysSinceClaim,
  isComebackClaim,
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
  FLASH_CLAIM_GRACE_MS,
  FLASH_DURATION_MS,
  FLASH_GOAL_REWARD_OBSIDIAN,
  FLASH_MULT,
  canSpawnFlashEvent,
  flashGoalForRate,
  makeFlashEventId,
  rollFlashSpawn,
} from './flashEvent'
import {
  prestigeSpikeBit,
  rollOfflineJackpot,
  rollPrestigeSpike,
  rollUpgradeSurprise,
  type SurpriseJump,
} from './surpriseJumps'
import {
  BATTLE_PASS_AD_XP,
  BATTLE_PASS_DAILY_XP,
  BATTLE_PASS_MAX_XP,
  BATTLE_PASS_TIERS,
  CLAN_BOOST,
  CLAN_BOOST_MAX,
  COSMETICS,
  DAILY_SKIP_CAP_HOURS,
  TIME_SKIPS,
  YIELD_BOOST_COST,
  YIELD_BOOST_MS,
  YIELD_BOOST_MULT,
  dayKey,
  nextRewardedAdReward,
  rewardedAdReady,
  shopOfferById,
  weekKey,
  type CosmeticId,
  type ShopOfferDef,
  type TimeSkipId,
} from './monetization'
import {
  ACHIEVEMENTS,
  isAchievementComplete,
  type AchievementId,
} from './achievements'
import {
  BRANCH_MAX_RANK,
  branchCost,
  capacityCostMult,
  efficiencyMult,
  emptyBranches,
  type BranchKind,
  type BranchRanks,
} from './branches'
import {
  LEVEL_REWARDS,
  XP_PER_DAILY,
  XP_PER_UPGRADE,
  levelProductionMult,
  levelProgress,
  xpFromOfflineClaim,
} from './progression'
import {
  emptyQuestProgress,
  syncQuestDay,
  type QuestProgress,
} from './quests'

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
  /** Spieler-Level XP (survives prestige) */
  playerXp: number
  /** Level reward crumbs already claimed (by level number) */
  claimedLevelRewards: number[]
  /** Lifetime upgrades bought (survives prestige) */
  totalUpgrades: number
  /** Lifetime soft earned across prestiges (survives) */
  lifetimeAshEarned: number
  /** Achievement flags */
  claimedDailyOnce: boolean
  claimedOfflineOnce: boolean
  /** Claimed achievement ids */
  claimedAchievements: AchievementId[]
  /** Branch ranks — reset on prestige */
  branches: BranchRanks
  /** Daily quest day key */
  questDayKey: string
  /** Daily quest progress rows */
  quests: QuestProgress[]
  /** One-time mock IAP / offer ids already owned (survives prestige) */
  ownedOfferIds: string[]
  /** Permanent remove-ads stub (survives prestige) */
  adsRemoved: boolean
  /** Last rewarded-ad claim timestamp */
  lastRewardedAdAt: number
  /** How many rewarded ads claimed (rotates reward kinds) */
  rewardedAdClaims: number
  /** Personal yield boost expiry; 0 = inactive */
  yieldBoostExpiresAt: number
  /** Battle-pass lite week key */
  bpWeekKey: string
  /** Battle-pass XP this week (0–100) */
  bpXp: number
  /** Free-track tiers claimed this week */
  bpClaimedFree: number[]
  /** Premium track unlocked for current week (stub) */
  bpPremium: boolean
  /** Premium-track tiers claimed this week */
  bpClaimedPremium: number[]
  /** Day key of last battle-pass daily XP claim */
  bpDailyXpDay: string
  /** Bitmask of prestige near-miss spikes already fired this run */
  prestigeSpikeFlags: number
  /** Last surprise juice for HUD (cleared by UI) */
  lastSurprise: SurpriseJump | null
  /** Short flash event id; empty = none */
  flashEventId: string
  /** Flash event end timestamp */
  flashEndsAt: number
  /** Soft earned toward flash goal */
  flashProgress: number
  /** Soft goal for current flash */
  flashGoal: number
  /** Whether flash goal reward was claimed */
  flashClaimed: boolean
  /** UI dismissed (does not wipe soft) */
  flashDismissed: boolean
  /** Last flash start time (cooldown) */
  lastFlashAt: number
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
  const quests = emptyQuestProgress(now)
  return {
    // Day-1: first greenhouse upgrade affordable immediately
    // IG-31: G1 C0=20 g=1.18 → Lv1→2 costs floor(20·1.18)=23; float 28
    ash: 28,
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
    playerXp: 0,
    claimedLevelRewards: [],
    totalUpgrades: 0,
    lifetimeAshEarned: 0,
    claimedDailyOnce: false,
    claimedOfflineOnce: false,
    claimedAchievements: [],
    branches: emptyBranches(GENERATOR_IDS),
    questDayKey: quests.dayKey,
    quests: quests.quests,
    ownedOfferIds: [],
    adsRemoved: false,
    lastRewardedAdAt: 0,
    rewardedAdClaims: 0,
    yieldBoostExpiresAt: 0,
    bpWeekKey: weekKey(now),
    bpXp: 0,
    bpClaimedFree: [],
    bpPremium: false,
    bpClaimedPremium: [],
    bpDailyXpDay: '',
    prestigeSpikeFlags: 0,
    lastSurprise: null,
    flashEventId: '',
    flashEndsAt: 0,
    flashProgress: 0,
    flashGoal: 0,
    flashClaimed: false,
    flashDismissed: false,
    lastFlashAt: 0,
  }
}

/** Create a fresh run after prestige, keeping meta + monetization unlocks. */
export function createPostPrestigeState(prev: GameState, now = Date.now()): GameState {
  const startAsh = prestigeStartAsh(prev.emberUpgrades)
  return {
    ash: startAsh,
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
    playerXp: prev.playerXp,
    claimedLevelRewards: [...prev.claimedLevelRewards],
    totalUpgrades: prev.totalUpgrades,
    lifetimeAshEarned: prev.lifetimeAshEarned,
    claimedDailyOnce: prev.claimedDailyOnce,
    claimedOfflineOnce: prev.claimedOfflineOnce,
    claimedAchievements: [...prev.claimedAchievements],
    // Branches reset with the run — soft sinks stay fair
    branches: emptyBranches(GENERATOR_IDS),
    questDayKey: prev.questDayKey,
    quests: prev.quests.map((q) => ({ ...q })),
    ownedOfferIds: [...prev.ownedOfferIds],
    adsRemoved: prev.adsRemoved,
    lastRewardedAdAt: prev.lastRewardedAdAt,
    rewardedAdClaims: prev.rewardedAdClaims,
    yieldBoostExpiresAt: prev.yieldBoostExpiresAt,
    bpWeekKey: prev.bpWeekKey,
    bpXp: prev.bpXp,
    bpClaimedFree: [...prev.bpClaimedFree],
    bpPremium: prev.bpPremium,
    bpClaimedPremium: [...prev.bpClaimedPremium],
    bpDailyXpDay: prev.bpDailyXpDay,
    // Prestige spikes reset per run; flash / daily survive
    prestigeSpikeFlags: 0,
    lastSurprise: null,
    flashEventId: prev.flashEventId,
    flashEndsAt: prev.flashEndsAt,
    flashProgress: prev.flashProgress,
    flashGoal: prev.flashGoal,
    flashClaimed: prev.flashClaimed,
    flashDismissed: prev.flashDismissed,
    lastFlashAt: prev.lastFlashAt,
  }
}

export function playerLevelOf(state: GameState): number {
  return levelProgress(state.playerXp).level
}

function withQuestSync(state: GameState, now = Date.now()): GameState {
  const synced = syncQuestDay(state.questDayKey, state.quests, now)
  if (
    synced.dayKey === state.questDayKey &&
    synced.quests === state.quests
  ) {
    return state
  }
  return {
    ...state,
    questDayKey: synced.dayKey,
    quests: synced.quests,
  }
}

function bumpQuest(
  state: GameState,
  kind: QuestProgress['kind'],
  amount: number,
  now = Date.now(),
): GameState {
  const base = withQuestSync(state, now)
  if (amount <= 0) return base
  let changed = false
  const quests = base.quests.map((q) => {
    if (q.kind !== kind || q.claimed) return q
    if (q.progress >= q.target) return q
    changed = true
    return {
      ...q,
      progress: Math.min(q.target, q.progress + amount),
    }
  })
  return changed ? { ...base, quests } : base
}

function grantCosmetic(owned: CosmeticId[], id: CosmeticId): CosmeticId[] {
  if (owned.includes(id)) return owned
  return [...owned, id]
}

/** Apply pending level-reward crumbs up to current Spieler-Level. */
export function applyLevelRewards(state: GameState, now = Date.now()): GameState {
  const level = playerLevelOf(state)
  let next = state
  let changed = false
  for (const reward of LEVEL_REWARDS) {
    if (reward.level > level) continue
    if (next.claimedLevelRewards.includes(reward.level)) continue
    changed = true
    let ash = next.ash
    let embers = next.embers
    let obsidian = next.obsidian
    let ownedCosmetics = next.ownedCosmetics
    if (reward.kind === 'ash') ash += reward.amount ?? 0
    if (reward.kind === 'embers') embers += reward.amount ?? 0
    if (reward.kind === 'obsidian') obsidian += reward.amount ?? 0
    if (reward.kind === 'cosmetic' && reward.cosmeticId) {
      ownedCosmetics = grantCosmetic(ownedCosmetics, reward.cosmeticId)
    }
    next = {
      ...next,
      ash,
      embers,
      obsidian,
      ownedCosmetics,
      claimedLevelRewards: [...next.claimedLevelRewards, reward.level],
      lastSeen: now,
    }
  }
  return changed ? next : state
}

function withXp(state: GameState, amount: number, now = Date.now()): GameState {
  if (amount <= 0) return state
  const next = {
    ...state,
    playerXp: state.playerXp + amount,
    lastSeen: now,
  }
  return applyLevelRewards(next, now)
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

/** Clear expired personal yield boost. */
export function syncYieldBoost(state: GameState, now = Date.now()): GameState {
  if (state.yieldBoostExpiresAt > 0 && now >= state.yieldBoostExpiresAt) {
    return { ...state, yieldBoostExpiresAt: 0 }
  }
  return state
}

/** Reset battle-pass progress when the local week rolls. */
export function syncBattlePass(state: GameState, now = Date.now()): GameState {
  const key = weekKey(now)
  if (state.bpWeekKey === key) return state
  return {
    ...state,
    bpWeekKey: key,
    bpXp: 0,
    bpClaimedFree: [],
    bpPremium: false,
    bpClaimedPremium: [],
    bpDailyXpDay: '',
  }
}

export function syncMonetization(state: GameState, now = Date.now()): GameState {
  return syncBattlePass(syncYieldBoost(syncClanBoost(state, now), now), now)
}

export function effectiveYieldBoostMult(state: GameState, now = Date.now()): number {
  if (state.yieldBoostExpiresAt <= 0 || now >= state.yieldBoostExpiresAt) return 1
  return YIELD_BOOST_MULT
}

export function eventProductionMult(now = Date.now()): number {
  return isBandwidthSurgeActive(now) ? BANDWIDTH_SURGE_MULT : 1
}

export function flashProductionMult(state: GameState, now = Date.now()): number {
  if (!state.flashEventId) return 1
  if (state.flashEndsAt <= now) return 1
  return FLASH_MULT
}

export function productionPerSecond(state: GameState, now = Date.now()): number {
  const mPrestige = prestigeMultiplier(state.emberUpgrades)
  const mClan = effectiveClanMult(state, now)
  const mEvent = eventProductionMult(now)
  const mFlash = flashProductionMult(state, now)
  const mLevel = levelProductionMult(playerLevelOf(state))
  const mYield = effectiveYieldBoostMult(state, now)
  let sum = 0
  for (const def of GENERATORS) {
    const owned = state.owned[def.id] ?? 0
    const branch = state.branches[def.id]
    const mEff = efficiencyMult(branch?.efficiency ?? 0)
    sum += generatorRate(def, owned) * mEff
  }
  return sum * mPrestige * mClan * mEvent * mFlash * mLevel * mYield
}

function withEventProgress(state: GameState, gained: number, now: number): GameState {
  if (gained <= 0) return state
  let next = state
  if (isBandwidthSurgeActive(now)) {
    const synced = syncEventWindow(next, now)
    next = {
      ...synced,
      eventAshProgress: synced.eventAshProgress + gained,
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

function maybePrestigeSpike(state: GameState, now: number): GameState {
  const rate = productionPerSecond(state, now)
  const spike = rollPrestigeSpike(
    state.ashEarned,
    state.prestiges,
    state.prestigeSpikeFlags,
    rate,
  )
  if (!spike || spike.prestigeTier == null) return state
  return {
    ...state,
    ash: state.ash + spike.amount,
    ashEarned: state.ashEarned + spike.amount,
    lifetimeAshEarned: state.lifetimeAshEarned + spike.amount,
    prestigeSpikeFlags:
      state.prestigeSpikeFlags | prestigeSpikeBit(spike.prestigeTier),
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
    obsidian: state.obsidian + FLASH_GOAL_REWARD_OBSIDIAN,
    flashClaimed: true,
    flashDismissed: true,
    lastSeen: now,
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
  let synced = withQuestSync(syncEventWindow(syncMonetization(state, now), now), now)
  const gained = productionPerSecond(synced, now) * dtSeconds
  if (gained <= 0) {
    return maybePrestigeSpike({ ...synced, lastSeen: now }, now)
  }
  let withProg = withEventProgress(synced, gained, now)
  withProg = {
    ...withProg,
    ash: withProg.ash + gained,
    ashEarned: withProg.ashEarned + gained,
    lifetimeAshEarned: withProg.lifetimeAshEarned + gained,
    lastSeen: now,
  }
  // Quest earnAsh tracks session production without spammy XP
  withProg = bumpQuest(withProg, 'earnAsh', gained, now)
  return maybePrestigeSpike(withProg, now)
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
  let next = syncEventWindow(syncMonetization(withSkipDay(state, now), now), now)
  const remaining = DAILY_SKIP_CAP_HOURS - next.skipHoursUsedToday
  if (remaining <= 0) return state
  const hours = Math.min(def.hours, remaining)
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
  const comeback = isComebackClaim(state.dailyClaimDay, now)
  const gapDays = comeback ? daysSinceClaim(state.dailyClaimDay, now) : 0
  const reward = rewardForStreak(Math.max(0, streak - 1), rate, {
    comeback,
    gapDays,
  })
  let next = syncEventWindow(syncMonetization(state, now), now)
  next = withEventProgress(next, reward.compute, now)
  next = {
    ...next,
    ash: next.ash + reward.compute,
    ashEarned: next.ashEarned + reward.compute,
    lifetimeAshEarned: next.lifetimeAshEarned + reward.compute,
    embers: next.embers + reward.credits,
    obsidian: next.obsidian + reward.obsidian,
    dailyClaimDay: dayKey(now),
    dailyStreak: streak,
    claimedDailyOnce: true,
    lastSeen: now,
  }
  next = bumpQuest(next, 'claimDaily', 1, now)
  next = bumpQuest(next, 'earnAsh', reward.compute, now)
  next = withXp(next, XP_PER_DAILY, now)
  return collectReadyAchievements(next, now)
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
  let next = syncMonetization(state, now)
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

/** Personal Phyto-Schub — Samen sink, temporary mult. */
export function buyYieldBoost(state: GameState, now = Date.now()): GameState {
  let next = syncMonetization(state, now)
  if (next.obsidian < YIELD_BOOST_COST) return state
  const active = next.yieldBoostExpiresAt > now
  const baseExpiry = active ? next.yieldBoostExpiresAt : now
  return {
    ...next,
    obsidian: next.obsidian - YIELD_BOOST_COST,
    yieldBoostExpiresAt: baseExpiry + YIELD_BOOST_MS,
    lastSeen: now,
  }
}

export function mockBuyOffer(state: GameState, offer: ShopOfferDef, now = Date.now()): GameState {
  let next = syncMonetization(state, now)
  if (offer.once && next.ownedOfferIds.includes(offer.id)) return state
  if (offer.kind === 'removeAds' && next.adsRemoved) return state
  if (offer.kind === 'battlePassPremium' && next.bpPremium) return state

  const ownedCosmetics = new Set(next.ownedCosmetics)
  for (const id of offer.cosmeticIds ?? []) ownedCosmetics.add(id)

  const ownedOfferIds =
    offer.once || offer.kind === 'removeAds'
      ? Array.from(new Set([...next.ownedOfferIds, offer.id]))
      : next.ownedOfferIds

  return {
    ...next,
    obsidian: next.obsidian + (offer.obsidian ?? 0),
    ownedCosmetics: Array.from(ownedCosmetics),
    ownedOfferIds,
    adsRemoved: offer.kind === 'removeAds' ? true : next.adsRemoved,
    bpPremium: offer.kind === 'battlePassPremium' ? true : next.bpPremium,
    lastSeen: now,
  }
}

/** @deprecated Prefer mockBuyOffer */
export function mockBuyPack(state: GameState, pack: ShopOfferDef, now = Date.now()): GameState {
  return mockBuyOffer(state, pack, now)
}

export function mockBuyOfferById(state: GameState, id: string, now = Date.now()): GameState {
  const offer = shopOfferById(id)
  if (!offer) return state
  return mockBuyOffer(state, offer, now)
}

export type RewardedAdResult =
  | { ok: false; reason: 'adsRemoved' | 'cooldown' }
  | {
      ok: true
      state: GameState
      kind: 'skipCrumb' | 'obsidianCrumb' | 'yieldCrumb'
      ashGained: number
      obsidianGained: number
    }

/** Grant optional rewarded-ad crumb after mock interstitial. Never blocks play. */
export function claimRewardedAd(state: GameState, now = Date.now()): RewardedAdResult {
  let next = syncMonetization(state, now)
  if (next.adsRemoved) return { ok: false, reason: 'adsRemoved' }
  if (!rewardedAdReady(next.lastRewardedAdAt, now)) {
    return { ok: false, reason: 'cooldown' }
  }
  const reward = nextRewardedAdReward(next.rewardedAdClaims)
  const rate = productionPerSecond(next, now)
  let ashGained = 0
  let obsidianGained = 0
  if (reward.kind === 'skipCrumb' || reward.kind === 'yieldCrumb') {
    const minutes = reward.minutes ?? 1
    ashGained = rate * minutes * 60
  } else if (reward.kind === 'obsidianCrumb') {
    obsidianGained = reward.obsidian ?? 0
  }
  next = withEventProgress(next, ashGained, now)
  const bpXp = Math.min(BATTLE_PASS_MAX_XP, next.bpXp + BATTLE_PASS_AD_XP)
  return {
    ok: true,
    kind: reward.kind,
    ashGained,
    obsidianGained,
    state: {
      ...next,
      ash: next.ash + ashGained,
      ashEarned: next.ashEarned + ashGained,
      lifetimeAshEarned: next.lifetimeAshEarned + ashGained,
      obsidian: next.obsidian + obsidianGained,
      lastRewardedAdAt: now,
      rewardedAdClaims: next.rewardedAdClaims + 1,
      bpXp,
      lastSeen: now,
    },
  }
}

export function claimBattlePassDailyXp(state: GameState, now = Date.now()): GameState {
  let next = syncMonetization(state, now)
  const today = dayKey(now)
  if (next.bpDailyXpDay === today) return state
  return {
    ...next,
    bpXp: Math.min(BATTLE_PASS_MAX_XP, next.bpXp + BATTLE_PASS_DAILY_XP),
    bpDailyXpDay: today,
    lastSeen: now,
  }
}

export function claimBattlePassTier(
  state: GameState,
  tier: number,
  track: 'free' | 'premium',
  now = Date.now(),
): GameState {
  let next = syncMonetization(state, now)
  const def = BATTLE_PASS_TIERS.find((row) => row.tier === tier)
  if (!def) return state
  if (next.bpXp < def.xp) return state
  if (track === 'premium' && !next.bpPremium) return state
  const claimed =
    track === 'free' ? next.bpClaimedFree : next.bpClaimedPremium
  if (claimed.includes(tier)) return state
  const reward = track === 'free' ? def.free : def.premium
  let ashGained = 0
  let obsidianGained = 0
  if (reward.kind === 'computeSec') {
    ashGained = productionPerSecond(next, now) * reward.amount
  } else {
    obsidianGained = reward.amount
  }
  next = withEventProgress(next, ashGained, now)
  const nextClaimed = [...claimed, tier]
  return {
    ...next,
    ash: next.ash + ashGained,
    ashEarned: next.ashEarned + ashGained,
    lifetimeAshEarned: next.lifetimeAshEarned + ashGained,
    obsidian: next.obsidian + obsidianGained,
    bpClaimedFree: track === 'free' ? nextClaimed : next.bpClaimedFree,
    bpClaimedPremium: track === 'premium' ? nextClaimed : next.bpClaimedPremium,
    lastSeen: now,
  }
}

export function applyOfflineCatchup(
  state: GameState,
  now = Date.now(),
): { state: GameState; gained: number } {
  const elapsedMs = Math.max(0, now - state.lastSeen)
  const elapsedSec = elapsedMs / 1000
  let base = withQuestSync(syncEventWindow(syncMonetization(state, now), now), now)
  base = applyLevelRewards(base, now)
  const rate = productionPerSecond(base, now)
  const caps = offlineCapsHours(base.emberUpgrades)
  const gained = offlineCatchupAsh(rate, elapsedSec, caps.soft, caps.hard)
  if (gained <= 0) {
    return { state: { ...base, lastSeen: now }, gained: 0 }
  }
  let total = gained
  const jackpot = rollOfflineJackpot(gained, elapsedMs)
  if (jackpot) total += jackpot.amount
  let withProg = withEventProgress(base, total, now)
  withProg = {
    ...withProg,
    ash: withProg.ash + total,
    ashEarned: withProg.ashEarned + total,
    lifetimeAshEarned: withProg.lifetimeAshEarned + total,
    lastSeen: now,
    lastSurprise: jackpot ?? withProg.lastSurprise,
  }
  withProg = bumpQuest(withProg, 'earnAsh', total, now)
  // XP for offline is granted when the player taps Abholen (claimOfflineReward)
  return { state: withProg, gained: total }
}

/**
 * Player tapped Abholen on the offline banner — grant XP + mark achievement flag.
 * Pass the claimed amount so EP scales with the catchup.
 */
export function claimOfflineReward(
  state: GameState,
  gained: number,
  now = Date.now(),
): GameState {
  let next: GameState = {
    ...state,
    claimedOfflineOnce: true,
    lastSeen: now,
  }
  next = withXp(next, xpFromOfflineClaim(gained), now)
  return collectReadyAchievements(next, now)
}

export function lineCostMult(state: GameState, id: GeneratorId): number {
  const branch = state.branches[id]
  return (
    foundryDiscountMult(state.emberUpgrades) *
    capacityCostMult(branch?.capacity ?? 0)
  )
}

export function buyGenerator(state: GameState, id: GeneratorId): GameState {
  const def = GENERATORS.find((g) => g.id === id)
  if (!def) return state
  const now = Date.now()
  const level = playerLevelOf(state)
  if (
    !isGeneratorUnlocked(
      def,
      state.ashEarned,
      state.owned,
      state.emberUpgrades.firstFlame > 0,
      level,
    )
  ) {
    return state
  }
  const owned = state.owned[id] ?? 0
  const cost = generatorCost(def, owned, lineCostMult(state, id))
  if (state.ash < cost) return state
  let next: GameState = {
    ...state,
    ash: state.ash - cost,
    owned: { ...state.owned, [id]: owned + 1 },
    totalUpgrades: state.totalUpgrades + 1,
    lastSeen: now,
  }
  const rate = productionPerSecond(next, now)
  const surprise = rollUpgradeSurprise(
    next.totalUpgrades,
    rate,
    next.ashEarned,
  )
  if (surprise) {
    next = {
      ...next,
      ash: next.ash + surprise.amount,
      ashEarned: next.ashEarned + surprise.amount,
      lifetimeAshEarned: next.lifetimeAshEarned + surprise.amount,
      lastSurprise: surprise,
    }
  }
  next = bumpQuest(next, 'upgrades', 1, now)
  if (surprise) next = bumpQuest(next, 'earnAsh', surprise.amount, now)
  next = withXp(next, XP_PER_UPGRADE, now)
  return collectReadyAchievements(next, now)
}

export function buyBranch(
  state: GameState,
  id: GeneratorId,
  kind: BranchKind,
): GameState {
  const def = GENERATORS.find((g) => g.id === id)
  if (!def) return state
  const owned = state.owned[id] ?? 0
  if (owned < 1) return state
  const ranks = state.branches[id] ?? { efficiency: 0, capacity: 0 }
  const rank = kind === 'efficiency' ? ranks.efficiency : ranks.capacity
  if (rank >= BRANCH_MAX_RANK) return state
  const cost = branchCost(def, kind, rank)
  if (state.ash < cost) return state
  const now = Date.now()
  const nextRanks = {
    ...ranks,
    [kind]: rank + 1,
  }
  let next: GameState = {
    ...state,
    ash: state.ash - cost,
    branches: { ...state.branches, [id]: nextRanks },
    lastSeen: now,
  }
  // Small XP crumb so branches feed Spieler-Level without outpacing main upgrades
  return withXp(next, Math.max(3, Math.floor(XP_PER_UPGRADE / 2)), now)
}

export function claimQuestReward(
  state: GameState,
  questId: string,
  now = Date.now(),
): GameState {
  const base = withQuestSync(state, now)
  const quest = base.quests.find((q) => q.id === questId)
  if (!quest || quest.claimed) return state
  if (quest.progress < quest.target) return state
  const quests = base.quests.map((q) =>
    q.id === questId ? { ...q, claimed: true } : q,
  )
  return {
    ...base,
    ash: base.ash + quest.rewardAsh,
    ashEarned: base.ashEarned + quest.rewardAsh,
    lifetimeAshEarned: base.lifetimeAshEarned + quest.rewardAsh,
    obsidian: base.obsidian + quest.rewardObsidian,
    quests,
    lastSeen: now,
  }
}

export function claimAchievement(
  state: GameState,
  id: AchievementId,
  now = Date.now(),
): GameState {
  if (state.claimedAchievements.includes(id)) return state
  const def = ACHIEVEMENTS.find((a) => a.id === id)
  if (!def) return state
  const stats = {
    totalUpgrades: state.totalUpgrades,
    lifetimeAshEarned: state.lifetimeAshEarned,
    claimedDailyOnce: state.claimedDailyOnce,
    claimedOfflineOnce: state.claimedOfflineOnce,
    playerLevel: playerLevelOf(state),
    prestiges: state.prestiges,
    owned: state.owned,
  }
  if (!isAchievementComplete(id, stats)) return state

  let ash = state.ash
  let embers = state.embers
  let obsidian = state.obsidian
  let ownedCosmetics = state.ownedCosmetics
  if (def.rewardKind === 'ash') ash += def.rewardAmount ?? 0
  if (def.rewardKind === 'embers') embers += def.rewardAmount ?? 0
  if (def.rewardKind === 'obsidian') obsidian += def.rewardAmount ?? 0
  if (def.rewardKind === 'cosmetic' && def.cosmeticId) {
    ownedCosmetics = grantCosmetic(ownedCosmetics, def.cosmeticId)
  }
  return {
    ...state,
    ash,
    embers,
    obsidian,
    ownedCosmetics,
    claimedAchievements: [...state.claimedAchievements, id],
    lastSeen: now,
  }
}

/** Auto-claim any newly completed achievements (call after meaningful actions). */
export function collectReadyAchievements(
  state: GameState,
  now = Date.now(),
): GameState {
  let next = state
  for (const def of ACHIEVEMENTS) {
    if (next.claimedAchievements.includes(def.id)) continue
    const stats = {
      totalUpgrades: next.totalUpgrades,
      lifetimeAshEarned: next.lifetimeAshEarned,
      claimedDailyOnce: next.claimedDailyOnce,
      claimedOfflineOnce: next.claimedOfflineOnce,
      playerLevel: playerLevelOf(next),
      prestiges: next.prestiges,
      owned: next.owned,
    }
    if (isAchievementComplete(def.id, stats)) {
      next = claimAchievement(next, def.id, now)
    }
  }
  return next
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
  const withEmbers = { ...next, embers: state.embers + gain }
  return collectReadyAchievements(withEmbers)
}

export function grantTapAsh(
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
    ash: next.ash + gained,
    ashEarned: next.ashEarned + gained,
    lifetimeAshEarned: next.lifetimeAshEarned + gained,
    lastTapAt: now,
    lastSeen: now,
  }
  return bumpQuest(next, 'earnAsh', gained, now)
}

export {
  prestigeMultiplier,
  GENERATOR_IDS,
  prestigeMinAsh,
  levelProgress,
  levelProductionMult,
  BRANCH_MAX_RANK,
  branchCost,
  efficiencyMult,
  capacityCostMult,
}
export type { BranchKind, AchievementId, QuestProgress }
