import {
  EMBER_SHOP,
  payoutAtGate,
  emberPayout,
  emberRankUnlocked,
  EMPTY_EMBER_UPGRADES,
  foundryDiscountMult,
  offlineCapsHours,
  offlineCatchupAsh,
  prestigeBlockReason,
  prestigeMinAsh,
  prestigeMultiplier,
  prestigeStartAsh,
  prestigeStartAshFloor,
  prestigeStartModuleLevel,
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
  ORCHARD,
  emptyOrchard,
  orchardAreaRate,
  orchardBaseRate,
  orchardCost,
  orchardGardenMult,
  orchardLevels,
  orchardUnlocked,
  type OrchardId,
  type OrchardState,
} from './orchard'
import {
  EMPTY_LEGACY,
  LEGACY_SHOP,
  canHandDown,
  legacyCostMult,
  legacyGardenMult,
  legacyOrchardMult,
  legacyPayout,
  legacySproutMult,
  legacyWaterMult,
  type LegacyId,
  type LegacyUpgrades,
} from './generations'
import { FEST_EARN, festAt, festKeyAt, festShop } from './fests'
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
  WHEEL_SEEDS,
  collectionMult,
  rollVarietyOnUpgrade,
  varietyForSeasonEnd,
  weatherWaterMult,
  weatherYieldMult,
  wheelWaterMult,
  wheelYieldMult,
  type WheelBuff,
  type WheelKind,
} from './gardenLife'
import {
  emptyQuestProgress,
  syncQuestDay,
  type QuestProgress,
} from './quests'
import {
  DEEP_SHOP,
  EMPTY_DEEP_META,
  canDeepReset,
  deepOfflineBonusHours,
  deepStartEmbers,
  deepYieldMult,
  emptyLongLoopSlice,
  gateSeasons,
  sproutPayout,
  type DeepMetaId,
  type DeepMetaUpgrades,
} from './longLoop'

export interface GameState {
  /** Soft currency — Compute (economy.md Ash) */
  ernte: number
  /** Lifetime Compute earned this run (prestige base) */
  ernteSeason: number
  owned: Record<GeneratorId, number>
  /** Soft meta — Credits (economy.md Embers; survives prestige) */
  erbstuecke: number
  emberUpgrades: EmberUpgrades
  /** Prestige runs completed (0-indexed for next gate) */
  prestiges: number
  lastSeen: number
  /** Last active tap timestamp */
  lastTapAt: number
  /** Active clan boost multiplier while clanBoostExpiresAt > now (1.0–1.25) */
  clanMult: number
  /** Hard currency — Obsidian (survives prestige) */
  samen: number
  /** Owned cosmetic ids (survives prestige) */
  ownedCosmetics: CosmeticId[]
  /** Equipped garden skin */
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
  ernteLifetime: number
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
  /** Pflanzenbuch variety just found (transient, for the UI pop) */
  lastVariety: string | null
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
  /** Deep meta currency (Sprossen / Saison-Jetons) */
  sproesslinge: number
  deepUpgrades: DeepMetaUpgrades
  /** Deep resets completed */
  deepPrestiges: number
  /** Pflanzenbuch — variety ids found (permanent across all resets) */
  collection: string[]
  /** Glücksrad buff for one Gartenjahr */
  wheelBuff: WheelBuff | null
  /** Gartenhelfer rank (0 = none) — permanent, bought with Erbstücke */
  helperLevel: number
  /** Gartenhelfer switched on */
  helperOn: boolean
  /** Helper time carry (ms) between buys */
  helperCarryMs: number
  /** Transient: buys the helper made while away (for the offline toast) */
  helperReport: number
  /** Frühlingsschub end (×3 right after Saisonende) */
  turboEndsAt: number
  /** Kapitel 2 — Streuobstwiese */
  orchard: OrchardState
  /** Generationen handed down */
  generation: number
  /** Vermächtnis — Generation currency */
  vermaechtnis: number
  legacy: LegacyUpgrades
  /** Running fest instance (fests.ts festKeyAt) */
  festKey: string
  /** Festmarken (fractional; UI floors) */
  festTokens: number
  /** Fest shop purchases this fest: item id → count */
  festBought: Record<string, number>
}

/** Gartenhelfer ranks: Erbstücke cost and time between two Ausbauten. */
export const HELPER_RANKS = [
  { cost: 40, intervalMs: 2500 },
  { cost: 150, intervalMs: 1500 },
  { cost: 400, intervalMs: 900 },
  { cost: 900, intervalMs: 500 },
  { cost: 2000, intervalMs: 250 },
] as const

/** Frühlingsschub after every Saisonende / Tiefer Winter / Generation. */
export const TURBO_MS = 2 * 60 * 1000
export const TURBO_MULT = 3

export interface ExpansionSlice {
  helperLevel: number
  helperOn: boolean
  helperCarryMs: number
  helperReport: number
  turboEndsAt: number
  orchard: OrchardState
  generation: number
  vermaechtnis: number
  legacy: LegacyUpgrades
  festKey: string
  festTokens: number
  festBought: Record<string, number>
}

export function emptyExpansion(now = Date.now()): ExpansionSlice {
  return {
    helperLevel: 0,
    helperOn: true,
    helperCarryMs: 0,
    helperReport: 0,
    turboEndsAt: 0,
    orchard: emptyOrchard(),
    generation: 0,
    vermaechtnis: 0,
    legacy: { ...EMPTY_LEGACY },
    festKey: festKeyAt(now),
    festTokens: 0,
    festBought: {},
  }
}

/** Expansion fields survive Saisonende (copied as-is). */
export function pickExpansion(s: GameState): ExpansionSlice {
  return {
    helperLevel: s.helperLevel,
    helperOn: s.helperOn,
    helperCarryMs: 0,
    helperReport: 0,
    turboEndsAt: s.turboEndsAt,
    orchard: s.orchard,
    generation: s.generation,
    vermaechtnis: s.vermaechtnis,
    legacy: { ...s.legacy },
    festKey: s.festKey,
    festTokens: s.festTokens,
    festBought: { ...s.festBought },
  }
}

export const STORAGE_KEY = 'gartenerbe-save-v1'

export function emptyOwned(): Record<GeneratorId, number> {
  const owned = {} as Record<GeneratorId, number>
  for (const id of GENERATOR_IDS) {
    owned[id] = 0
  }
  // G1 (first module) starts online — producing immediately (economy Day-1)
  owned.gemuesebeet = 1
  return owned
}

export function createInitialState(now = Date.now()): GameState {
  const quests = emptyQuestProgress(now)
  return {
    // Day-1: first greenhouse upgrade affordable immediately
    // IG-31: G1 C0=20 g=1.18 → Lv1→2 costs floor(20·1.18)=23; float 28
    ernte: 28,
    ernteSeason: 0,
    owned: emptyOwned(),
    erbstuecke: 0,
    emberUpgrades: { ...EMPTY_EMBER_UPGRADES },
    prestiges: 0,
    lastSeen: now,
    lastTapAt: 0,
    clanMult: 1,
    // Day-1 login gift: 20 Obsidian (economy.md §10)
    samen: 20,
    ownedCosmetics: ['wiese'],
    equippedCosmetic: 'wiese',
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
    ernteLifetime: 0,
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
    lastVariety: null,
    flashEventId: '',
    flashEndsAt: 0,
    flashProgress: 0,
    flashGoal: 0,
    flashClaimed: false,
    flashDismissed: false,
    lastFlashAt: 0,
    ...emptyLongLoopSlice(),
    ...emptyExpansion(now),
  }
}

/** Create a fresh run after prestige, keeping meta + monetization unlocks. */
export function createPostPrestigeState(prev: GameState, now = Date.now()): GameState {
  const owned = emptyOwned()
  const startLevel = prestigeStartModuleLevel(prev.emberUpgrades)
  if (startLevel > 0) {
    owned.gemuesebeet = Math.max(owned.gemuesebeet, startLevel)
  }
  const g1 = GENERATORS.find((g) => g.id === 'gemuesebeet')
  const g1Level = owned.gemuesebeet
  const g1Cost = g1
    ? generatorCost(g1, g1Level, foundryDiscountMult(prev.emberUpgrades))
    : 23
  // Always afford the next G1 Ausbauen immediately — Seed-Purse alone can be 0.
  const startAsh = Math.max(
    prestigeStartAsh(prev.emberUpgrades),
    prestigeStartAshFloor(g1Cost),
  )
  return {
    ernte: startAsh,
    ernteSeason: 0,
    owned,
    erbstuecke: prev.erbstuecke,
    emberUpgrades: { ...prev.emberUpgrades },
    prestiges: prev.prestiges + 1,
    lastSeen: now,
    lastTapAt: 0,
    clanMult: prev.clanMult,
    samen: prev.samen,
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
    ernteLifetime: prev.ernteLifetime,
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
    lastVariety: null,
    flashEventId: prev.flashEventId,
    flashEndsAt: prev.flashEndsAt,
    flashProgress: prev.flashProgress,
    flashGoal: prev.flashGoal,
    flashClaimed: prev.flashClaimed,
    flashDismissed: prev.flashDismissed,
    lastFlashAt: prev.lastFlashAt,
    // L3–L5 survive soft prestige
    sproesslinge: prev.sproesslinge,
    deepUpgrades: { ...prev.deepUpgrades },
    deepPrestiges: prev.deepPrestiges,
    collection: [...prev.collection],
    wheelBuff: prev.wheelBuff,
    ...pickExpansion(prev),
    turboEndsAt: now + TURBO_MS,
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
    let ernte = next.ernte
    let erbstuecke = next.erbstuecke
    let samen = next.samen
    let ownedCosmetics = next.ownedCosmetics
    if (reward.kind === 'ernte') ernte += reward.amount ?? 0
    if (reward.kind === 'erbstuecke') erbstuecke += reward.amount ?? 0
    if (reward.kind === 'samen') samen += reward.amount ?? 0
    if (reward.kind === 'cosmetic' && reward.cosmeticId) {
      ownedCosmetics = grantCosmetic(ownedCosmetics, reward.cosmeticId)
    }
    next = {
      ...next,
      ernte,
      erbstuecke,
      samen,
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

/**
 * Nachbarschaftshilfe — first pass only (no Tiefer Winter / Generation yet):
 * Gartenjahre 11–14 get a production tailwind so the steep gate before the
 * first Tiefer Winter never turns into a 16–24 h season. Later passes are
 * paced by the Sprösslings-Laden instead (a flatter gate there would turn
 * Tiefer Winter into a farm loop).
 */
export const NEIGHBOUR_FROM = 10
export const NEIGHBOUR_STEP = 1.6

export function neighbourMult(state: GameState): number {
  if (state.deepPrestiges > 0 || state.generation > 0) return 1
  const steps = Math.min(state.prestiges, 13) - NEIGHBOUR_FROM
  return steps > 0 ? Math.pow(NEIGHBOUR_STEP, steps) : 1
}

export function turboMult(state: GameState, now = Date.now()): number {
  return state.turboEndsAt > now ? TURBO_MULT : 1
}

/** Permanent multipliers from Kapitel 2 and Generationen (shown in HUD). */
export function expansionGardenMult(state: GameState): number {
  return orchardGardenMult(state.orchard) * legacyGardenMult(state.legacy)
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
  return (
    sum *
    mPrestige *
    mClan *
    mEvent *
    mFlash *
    mLevel *
    mYield *
    deepYieldMult(state.deepUpgrades) *
    collectionMult(state.collection) *
    weatherYieldMult(now) *
    wheelYieldMult(state.wheelBuff, state.prestiges) *
    expansionGardenMult(state) *
    neighbourMult(state) *
    turboMult(state, now)
  )
}

/* ———————————— Kapitel 2: Streuobstwiese ———————————— */

export function orchardOpen(state: GameState): boolean {
  return state.orchard.openedAt > 0
}

/** Opens Kapitel 2 once the first Tiefer Winter (or a Generation) is done. */
export function syncOrchardOpen(state: GameState, now = Date.now(), force = false): GameState {
  if (state.orchard.openedAt > 0) return state
  if (!force && state.deepPrestiges < 1 && state.generation < 1) return state
  return { ...state, orchard: { ...state.orchard, openedAt: now } }
}

export function orchardRateMult(state: GameState): number {
  return (
    legacyOrchardMult(state.legacy) *
    (1 + 0.05 * state.deepPrestiges) *
    (1 + 0.1 * state.generation) *
    levelProductionMult(playerLevelOf(state))
  )
}

export function orchardPerSecond(state: GameState): number {
  if (!orchardOpen(state)) return 0
  return orchardBaseRate(state.orchard) * orchardRateMult(state)
}

function withObst(state: GameState, gained: number): GameState {
  if (gained <= 0) return state
  return {
    ...state,
    orchard: {
      ...state.orchard,
      obst: state.orchard.obst + gained,
      obstLifetime: state.orchard.obstLifetime + gained,
    },
  }
}

export function orchardCostOf(state: GameState, id: OrchardId): number {
  const def = ORCHARD.find((o) => o.id === id)
  if (!def) return Infinity
  return orchardCost(def, state.orchard.owned[id] ?? 0, legacyCostMult(state.legacy))
}

export function buyOrchard(state: GameState, id: OrchardId, fromHelper = false): GameState {
  if (!orchardOpen(state)) return state
  const def = ORCHARD.find((o) => o.id === id)
  if (!def || !orchardUnlocked(def, state.orchard.owned)) return state
  const cost = orchardCostOf(state, id)
  if (state.orchard.obst < cost) return state
  const owned = state.orchard.owned[id] ?? 0
  const next: GameState = {
    ...state,
    orchard: {
      ...state.orchard,
      obst: state.orchard.obst - cost,
      owned: { ...state.orchard.owned, [id]: owned + 1 },
    },
    totalUpgrades: state.totalUpgrades + 1,
    lastSeen: Date.now(),
  }
  return earnFest(withXp(next, fromHelper ? 1 : XP_PER_UPGRADE), fromHelper ? FEST_EARN.helperUpgrade : FEST_EARN.upgrade)
}

/** Buy up to `n` orchard levels (stops when Obst runs out). */
export function buyOrchardMany(state: GameState, id: OrchardId, n: number): { state: GameState; bought: number } {
  let next = state
  let bought = 0
  for (let i = 0; i < n; i++) {
    const after = buyOrchard(next, id)
    if (after === next) break
    next = after
    bought += 1
  }
  return { state: next, bought }
}

/** Best Obst buy by Δrate / cost (affordable only). */
export function bestOrchardBuy(state: GameState): OrchardId | null {
  let best: OrchardId | null = null
  let bestScore = 0
  for (const def of ORCHARD) {
    if (!orchardUnlocked(def, state.orchard.owned)) continue
    const cost = orchardCostOf(state, def.id)
    if (cost > state.orchard.obst) continue
    const n = state.orchard.owned[def.id] ?? 0
    const score = (orchardAreaRate(def, n + 1) - orchardAreaRate(def, n)) / cost
    if (score > bestScore) {
      bestScore = score
      best = def.id
    }
  }
  return best
}

/* ———————————— Generationen ———————————— */

export function generationPayout(state: GameState): number {
  return legacyPayout(state.deepPrestiges, orchardLevels(state.orchard))
}

export function canHandDownNow(state: GameState): boolean {
  return canHandDown(state.deepPrestiges)
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
    { ...state, erbstuecke: 0, emberUpgrades: { ...EMPTY_EMBER_UPGRADES } },
    now,
  )
  return collectReadyAchievements({
    ...fresh,
    prestiges: 0,
    erbstuecke: 0,
    emberUpgrades: { ...EMPTY_EMBER_UPGRADES },
    sproesslinge: 0,
    deepUpgrades: { ...EMPTY_DEEP_META },
    deepPrestiges: 0,
    generation: state.generation + 1,
    vermaechtnis: state.vermaechtnis + gain,
    wheelBuff: null,
  })
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

/* ———————————— Saisonale Feste ———————————— */

export function syncFest(state: GameState, now = Date.now()): GameState {
  const key = festKeyAt(now)
  if (state.festKey === key) return state
  return { ...state, festKey: key, festTokens: 0, festBought: {} }
}

export function earnFest(state: GameState, amount: number, now = Date.now()): GameState {
  if (amount <= 0) return state
  const synced = syncFest(state, now)
  return { ...synced, festTokens: synced.festTokens + amount }
}

export function buyFestItem(state: GameState, itemId: string, now = Date.now()): GameState {
  const base = syncFest(state, now)
  const fest = festAt(now)
  const item = festShop(fest).find((i) => i.id === itemId)
  if (!item) return state
  const bought = base.festBought[item.id] ?? 0
  if (bought >= item.limit) return state
  if (item.kind === 'variety' && item.variety && base.collection.includes(item.variety)) return state
  if (item.kind === 'skin' && item.skin && base.ownedCosmetics.includes(item.skin)) return state
  if (base.festTokens < item.tokens || base.samen < item.samen) return state
  let next: GameState = {
    ...base,
    festTokens: base.festTokens - item.tokens,
    samen: base.samen - item.samen,
    festBought: { ...base.festBought, [item.id]: bought + 1 },
    lastSeen: now,
  }
  switch (item.kind) {
    case 'variety':
      next = { ...next, collection: [...next.collection, item.variety!], lastVariety: item.variety! }
      break
    case 'skin':
      next = { ...next, ownedCosmetics: grantCosmetic(next.ownedCosmetics, item.skin!), equippedCosmetic: item.skin! }
      break
    case 'seeds':
      next = { ...next, samen: next.samen + (item.amount ?? 0) }
      break
    case 'tokenPack':
      next = { ...next, festTokens: next.festTokens + (item.amount ?? 0) }
      break
    case 'heirlooms': {
      const gain = Math.max(5, Math.round(payoutAtGate(next.prestiges) * 0.5))
      next = { ...next, erbstuecke: next.erbstuecke + gain }
      break
    }
    case 'boost': {
      const active = next.yieldBoostExpiresAt > now
      next = { ...next, yieldBoostExpiresAt: (active ? next.yieldBoostExpiresAt : now) + YIELD_BOOST_MS }
      break
    }
  }
  return next
}

/* ———————————— Gartenhelfer & Mengenkauf ———————————— */

export function helperUnlocked(state: GameState): boolean {
  return state.prestiges >= 1 || state.deepPrestiges > 0 || state.generation > 0 || state.helperLevel > 0
}

export function helperInterval(level: number): number {
  if (level <= 0) return Infinity
  return HELPER_RANKS[Math.min(HELPER_RANKS.length, level) - 1]!.intervalMs
}

export function buyHelper(state: GameState): GameState {
  if (!helperUnlocked(state)) return state
  const rank = HELPER_RANKS[state.helperLevel]
  if (!rank) return state
  if (state.erbstuecke < rank.cost) return state
  return {
    ...state,
    erbstuecke: state.erbstuecke - rank.cost,
    helperLevel: state.helperLevel + 1,
    helperOn: true,
    lastSeen: Date.now(),
  }
}

export function toggleHelper(state: GameState): GameState {
  if (state.helperLevel <= 0) return state
  return { ...state, helperOn: !state.helperOn }
}

/** Affordable garden area with the best Δrate / cost. */
export function bestGardenBuy(state: GameState): GeneratorId | null {
  const lvl = playerLevelOf(state)
  const gates = gatePrestiges(state)
  let best: GeneratorId | null = null
  let bestScore = 0
  for (const def of GENERATORS) {
    if (!isGeneratorUnlocked(def, state.ernteSeason, state.owned, state.emberUpgrades.firstFlame > 0, lvl, gates)) continue
    const cost = generatorCost(def, state.owned[def.id] ?? 0, lineCostMult(state, def.id))
    if (cost > state.ernte) continue
    const n = state.owned[def.id] ?? 0
    const eff = efficiencyMult(state.branches[def.id]?.efficiency ?? 0)
    const score = ((generatorRate(def, n + 1) - generatorRate(def, n)) * eff) / cost
    if (score > bestScore) {
      bestScore = score
      best = def.id
    }
  }
  return best
}

/** Buy up to `n` levels of one area (stops when Ernte runs out). */
export function buyGeneratorMany(state: GameState, id: GeneratorId, n: number): { state: GameState; bought: number } {
  let next = state
  let bought = 0
  for (let i = 0; i < n; i++) {
    const after = buyGenerator(next, id, i === 0 ? 'manual' : 'bulk')
    if (after === next) break
    next = after
    bought += 1
  }
  return { state: next, bought }
}

/** How many levels of `id` the current Ernte pays for (capped). */
export function affordableLevels(state: GameState, id: GeneratorId, cap = 1000): { count: number; cost: number } {
  const def = GENERATORS.find((g) => g.id === id)
  if (!def) return { count: 0, cost: 0 }
  const mult = lineCostMult(state, id)
  let owned = state.owned[id] ?? 0
  let left = state.ernte
  let count = 0
  let cost = 0
  while (count < cap) {
    const c = generatorCost(def, owned, mult)
    if (c > left) break
    left -= c
    cost += c
    owned += 1
    count += 1
  }
  return { count, cost }
}

/** Total cost of the next `n` levels of `id`. */
export function costForLevels(state: GameState, id: GeneratorId, n: number): number {
  const def = GENERATORS.find((g) => g.id === id)
  if (!def) return Infinity
  const mult = lineCostMult(state, id)
  const owned = state.owned[id] ?? 0
  let sum = 0
  for (let i = 0; i < n; i++) sum += generatorCost(def, owned + i, mult)
  return sum
}

/** „Alles ausbauen“ — spend Ernte on the best buys until nothing is affordable. */
export function buyAllBest(state: GameState, cap = 400): { state: GameState; bought: number } {
  let next = state
  let bought = 0
  while (bought < cap) {
    const id = bestGardenBuy(next)
    if (!id) break
    const after = buyGenerator(next, id, bought === 0 ? 'manual' : 'bulk')
    if (after === next) break
    next = after
    bought += 1
  }
  return { state: next, bought }
}

/** Run the Gartenhelfer for `dtMs` (garden first, then Streuobstwiese). */
export function runHelper(state: GameState, dtMs: number, maxBuys = 40): { state: GameState; bought: number } {
  if (state.helperLevel <= 0 || !state.helperOn) return { state, bought: 0 }
  const interval = helperInterval(state.helperLevel)
  let carry = state.helperCarryMs + dtMs
  let next = state
  let bought = 0
  while (carry >= interval && bought < maxBuys) {
    const gid = bestGardenBuy(next)
    if (gid) {
      next = buyGenerator(next, gid, 'helper')
    } else {
      const oid = orchardOpen(next) ? bestOrchardBuy(next) : null
      if (!oid) {
        carry = Math.min(carry, interval)
        break
      }
      next = buyOrchard(next, oid, true)
    }
    carry -= interval
    bought += 1
  }
  return { state: { ...next, helperCarryMs: Math.min(carry, interval * 2) }, bought }
}

/** Season count used for Gartenjahr gates (includes Gartenwissen). */
export function gatePrestiges(state: GameState): number {
  return gateSeasons(state.prestiges, state.deepUpgrades)
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
  const rate = productionPerSecond(state, now) / turboMult(state, now)
  const spike = rollPrestigeSpike(
    state.ernteSeason,
    state.prestiges,
    state.prestigeSpikeFlags,
    rate,
  )
  if (!spike || spike.prestigeTier == null) return state
  return {
    ...state,
    ernte: state.ernte + spike.amount,
    ernteSeason: state.ernteSeason + spike.amount,
    ernteLifetime: state.ernteLifetime + spike.amount,
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
    samen: state.samen + FLASH_GOAL_REWARD_OBSIDIAN,
    flashClaimed: true,
    flashDismissed: true,
    lastSeen: now,
  }
}

export function nextPrestigeEmbers(ernteSeason: number, prestiges = 0): number {
  return emberPayout(ernteSeason, prestiges)
}

export function canPrestigeNow(state: GameState): boolean {
  return (
    prestigeBlockReason({
      prestiges: state.prestiges,
      ernteSeason: state.ernteSeason,
      owned: state.owned,
    }) === null
  )
}

export function prestigeProgress(state: GameState): {
  min: number
  current: number
  ratio: number
  erbstuecke: number
} {
  const min = prestigeMinAsh(state.prestiges)
  const current = state.ernteSeason
  return {
    min,
    current,
    ratio: min > 0 ? Math.min(1, current / min) : 1,
    erbstuecke: emberPayout(current, state.prestiges),
  }
}

export function applyTick(state: GameState, dtSeconds: number): GameState {
  if (dtSeconds <= 0) return state
  const now = Date.now()
  let synced = withQuestSync(syncEventWindow(syncMonetization(state, now), now), now)
  synced = syncFest(syncOrchardOpen(synced, now), now)
  synced = withObst(synced, orchardPerSecond(synced) * dtSeconds)
  if (synced.helperLevel > 0 && synced.helperOn) {
    synced = runHelper(synced, dtSeconds * 1000).state
  }
  const gained = productionPerSecond(synced, now) * dtSeconds
  if (gained <= 0) {
    return maybePrestigeSpike({ ...synced, lastSeen: now }, now)
  }
  let withProg = withEventProgress(synced, gained, now)
  withProg = {
    ...withProg,
    ernte: withProg.ernte + gained,
    ernteSeason: withProg.ernteSeason + gained,
    ernteLifetime: withProg.ernteLifetime + gained,
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
  if (next.samen < def.cost) return state
  const rate = productionPerSecond(next, now)
  const gained = rate * hours * 3600
  next = withEventProgress(next, gained, now)
  return {
    ...next,
    samen: next.samen - def.cost,
    ernte: next.ernte + gained,
    ernteSeason: next.ernteSeason + gained,
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
    ernte: next.ernte + reward.compute,
    ernteSeason: next.ernteSeason + reward.compute,
    ernteLifetime: next.ernteLifetime + reward.compute,
    erbstuecke: next.erbstuecke + reward.credits,
    samen: next.samen + reward.samen,
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
    samen: next.samen + BANDWIDTH_SURGE_GOAL_REWARD,
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
  if (state.samen < def.cost) return state
  return {
    ...state,
    samen: state.samen - def.cost,
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
  if (next.samen < CLAN_BOOST.cost) return state
  const active = next.clanBoostExpiresAt > now
  const baseExpiry = active ? next.clanBoostExpiresAt : now
  const nextMult = Math.min(
    CLAN_BOOST_MAX,
    Math.max(next.clanMult > 1 ? next.clanMult : 1, CLAN_BOOST.mult),
  )
  return {
    ...next,
    samen: next.samen - CLAN_BOOST.cost,
    clanMult: nextMult,
    clanBoostExpiresAt: baseExpiry + CLAN_BOOST.durationMs,
    lastSeen: now,
  }
}

/** Personal Phyto-Schub — Samen sink, temporary mult. */
export function buyYieldBoost(state: GameState, now = Date.now()): GameState {
  let next = syncMonetization(state, now)
  if (next.samen < YIELD_BOOST_COST) return state
  const active = next.yieldBoostExpiresAt > now
  const baseExpiry = active ? next.yieldBoostExpiresAt : now
  return {
    ...next,
    samen: next.samen - YIELD_BOOST_COST,
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
    samen: next.samen + (offer.samen ?? 0),
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
    obsidianGained = reward.samen ?? 0
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
      ernte: next.ernte + ashGained,
      ernteSeason: next.ernteSeason + ashGained,
      ernteLifetime: next.ernteLifetime + ashGained,
      samen: next.samen + obsidianGained,
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
    ernte: next.ernte + ashGained,
    ernteSeason: next.ernteSeason + ashGained,
    ernteLifetime: next.ernteLifetime + ashGained,
    samen: next.samen + obsidianGained,
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
  const emberCaps = offlineCapsHours(base.emberUpgrades)
  const deepCaps = deepOfflineBonusHours(base.deepUpgrades)
  const gained = offlineCatchupAsh(
    rate,
    elapsedSec,
    emberCaps.soft + deepCaps.soft,
    emberCaps.hard + deepCaps.hard,
  )
  // Streuobstwiese grows offline with the same caps
  base = syncFest(syncOrchardOpen(base, now), now)
  const obstRate = orchardPerSecond(base)
  if (obstRate > 0) {
    base = withObst(
      base,
      offlineCatchupAsh(obstRate, elapsedSec, emberCaps.soft + deepCaps.soft, emberCaps.hard + deepCaps.hard),
    )
  }
  if (elapsedSec >= 3600) {
    base = earnFest(base, Math.min(FEST_EARN.offlineCap, Math.floor(elapsedSec / 3600) * FEST_EARN.offlineHour), now)
  }
  if (gained <= 0) {
    return { state: { ...base, lastSeen: now }, gained: 0 }
  }
  let total = gained
  const jackpot = rollOfflineJackpot(gained, elapsedMs)
  if (jackpot) total += jackpot.amount
  let withProg = withEventProgress(base, total, now)
  withProg = {
    ...withProg,
    ernte: withProg.ernte + total,
    ernteSeason: withProg.ernteSeason + total,
    ernteLifetime: withProg.ernteLifetime + total,
    lastSeen: now,
    lastSurprise: jackpot ?? withProg.lastSurprise,
  }
  withProg = bumpQuest(withProg, 'earnAsh', total, now)
  // Gartenhelfer keeps working while you are away (spends the catch-up)
  if (withProg.helperLevel > 0 && withProg.helperOn && elapsedMs > 60_000) {
    const helper = runHelper(withProg, Math.min(elapsedMs, 8 * 3600_000), 300)
    withProg = { ...helper.state, helperReport: helper.bought }
  }
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
    capacityCostMult(branch?.capacity ?? 0) *
    legacyCostMult(state.legacy)
  )
}

/**
 * `mode`: 'manual' rolls surprises; 'bulk' (2nd+ level of a Mengenkauf) and
 * 'helper' (Gartenhelfer) never do — otherwise fast buying would chain the
 * every-5th-Ausbau crumbs into an exponential snowball.
 */
export type BuyMode = 'manual' | 'bulk' | 'helper'

export function buyGenerator(state: GameState, id: GeneratorId, mode: BuyMode | boolean = 'manual'): GameState {
  const buyMode: BuyMode = mode === true ? 'helper' : mode === false ? 'manual' : mode
  const fromHelper = buyMode === 'helper'
  const def = GENERATORS.find((g) => g.id === id)
  if (!def) return state
  const now = Date.now()
  const level = playerLevelOf(state)
  if (
    !isGeneratorUnlocked(
      def,
      state.ernteSeason,
      state.owned,
      state.emberUpgrades.firstFlame > 0,
      level,
      gatePrestiges(state),
    )
  ) {
    return state
  }
  const owned = state.owned[id] ?? 0
  const cost = generatorCost(def, owned, lineCostMult(state, id))
  if (state.ernte < cost) return state
  let next: GameState = {
    ...state,
    ernte: state.ernte - cost,
    owned: { ...state.owned, [id]: owned + 1 },
    totalUpgrades: state.totalUpgrades + 1,
    lastSeen: now,
  }
  // Surprises scale with the steady rate — never with the Frühlingsschub
  const rate = productionPerSecond(next, now) / turboMult(next, now)
  const surprise =
    buyMode === 'manual' ? rollUpgradeSurprise(next.totalUpgrades, rate, next.ernteSeason) : null
  if (surprise) {
    next = {
      ...next,
      ernte: next.ernte + surprise.amount,
      ernteSeason: next.ernteSeason + surprise.amount,
      ernteLifetime: next.ernteLifetime + surprise.amount,
      lastSurprise: surprise,
    }
  }
  const variety = rollVarietyOnUpgrade(id, next.collection)
  if (variety) {
    next = { ...next, collection: [...next.collection, variety], lastVariety: variety }
  }
  next = bumpQuest(next, 'upgrades', 1, now)
  if (surprise) next = bumpQuest(next, 'earnAsh', surprise.amount, now)
  next = withXp(next, fromHelper ? 2 : XP_PER_UPGRADE, now)
  next = earnFest(next, fromHelper ? FEST_EARN.helperUpgrade : FEST_EARN.upgrade, now)
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
  if (state.ernte < cost) return state
  const now = Date.now()
  const nextRanks = {
    ...ranks,
    [kind]: rank + 1,
  }
  let next: GameState = {
    ...state,
    ernte: state.ernte - cost,
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
    ernte: base.ernte + quest.rewardAsh,
    ernteSeason: base.ernteSeason + quest.rewardAsh,
    ernteLifetime: base.ernteLifetime + quest.rewardAsh,
    samen: base.samen + quest.rewardObsidian,
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
    ernteLifetime: state.ernteLifetime,
    claimedDailyOnce: state.claimedDailyOnce,
    claimedOfflineOnce: state.claimedOfflineOnce,
    playerLevel: playerLevelOf(state),
    prestiges: state.prestiges,
    owned: state.owned,
  }
  if (!isAchievementComplete(id, stats)) return state

  let ernte = state.ernte
  let erbstuecke = state.erbstuecke
  let samen = state.samen
  let ownedCosmetics = state.ownedCosmetics
  if (def.rewardKind === 'ernte') ernte += def.rewardAmount ?? 0
  if (def.rewardKind === 'erbstuecke') erbstuecke += def.rewardAmount ?? 0
  if (def.rewardKind === 'samen') samen += def.rewardAmount ?? 0
  if (def.rewardKind === 'cosmetic' && def.cosmeticId) {
    ownedCosmetics = grantCosmetic(ownedCosmetics, def.cosmeticId)
  }
  return {
    ...state,
    ernte,
    erbstuecke,
    samen,
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
      ernteLifetime: next.ernteLifetime,
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
  if (
    !emberRankUnlocked(
      item,
      rank,
      state.ernteSeason,
      state.owned,
      state.prestiges,
    )
  ) {
    return state
  }
  const cost = item.cost(rank)
  if (state.erbstuecke < cost) return state
  return {
    ...state,
    erbstuecke: state.erbstuecke - cost,
    emberUpgrades: {
      ...state.emberUpgrades,
      [id]: rank + 1,
    },
    lastSeen: Date.now(),
  }
}

export function doPrestige(state: GameState): GameState {
  if (!canPrestigeNow(state)) return state
  const gain = emberPayout(state.ernteSeason, state.prestiges)
  const planted = GENERATORS.filter((g) => (state.owned[g.id] ?? 0) > 0).map((g) => g.id)
  const variety = varietyForSeasonEnd(planted, state.collection)
  const next = createPostPrestigeState(
    variety ? { ...state, collection: [...state.collection, variety] } : state,
  )
  const withEmbers = { ...next, erbstuecke: state.erbstuecke + gain, lastVariety: variety }
  return collectReadyAchievements(earnFest(withEmbers, FEST_EARN.seasonEnd))
}

/** Sprösslinge for a Tiefer Winter now (incl. Wurzelwerk). */
export function deepSproutPayout(state: GameState): number {
  return Math.floor(sproutPayout(state.prestiges) * legacySproutMult(state.legacy))
}

/** Sprösslings-Laden purchase. */
export function buyDeepUpgrade(state: GameState, id: DeepMetaId): GameState {
  const item = DEEP_SHOP.find((d) => d.id === id)
  if (!item) return state
  const rank = state.deepUpgrades[id]
  if (rank >= item.maxRank) return state
  const cost = item.cost(rank)
  if (state.sproesslinge < cost) return state
  return {
    ...state,
    sproesslinge: state.sproesslinge - cost,
    deepUpgrades: { ...state.deepUpgrades, [id]: rank + 1 },
    lastSeen: Date.now(),
  }
}

/**
 * Tiefer Winter: Gartenjahre, Erbstücke and Omas Truhe reset; Sprösslinge,
 * their boosts, Samen, Gartenstile, Gärtnerstufe and streaks stay.
 */
export function doDeepReset(state: GameState): GameState {
  if (!canDeepReset(state.prestiges)) return state
  const sprouts = deepSproutPayout(state)
  const fresh = createPostPrestigeState({
    ...state,
    erbstuecke: 0,
    emberUpgrades: { ...EMPTY_EMBER_UPGRADES },
  })
  return collectReadyAchievements(
    syncOrchardOpen({
      ...fresh,
      prestiges: 0,
      erbstuecke: deepStartEmbers(state.deepUpgrades),
      emberUpgrades: { ...EMPTY_EMBER_UPGRADES },
      sproesslinge: state.sproesslinge + sprouts,
      deepPrestiges: state.deepPrestiges + 1,
    }),
  )
}

/** Gießen multiplier from weather (Regen) and the Glücksrad. */
export function waterMult(state: GameState, now = Date.now()): number {
  return (
    weatherWaterMult(now) *
    wheelWaterMult(state.wheelBuff, state.prestiges) *
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
}

/** Generic reward for visitors, orders, weekly plan, comeback gifts. */
export function grantReward(state: GameState, reward: Reward, now = Date.now()): GameState {
  const ernte = Math.max(0, (reward.ernteSeconds ?? 0) * productionPerSecond(state, now))
  let next: GameState = {
    ...withEventProgress(state, ernte, now),
    ernte: state.ernte + ernte,
    ernteSeason: state.ernteSeason + ernte,
    ernteLifetime: state.ernteLifetime + ernte,
    samen: state.samen + (reward.samen ?? 0),
    erbstuecke: state.erbstuecke + (reward.erbstuecke ?? 0),
    lastSeen: now,
  }
  if (ernte > 0) next = bumpQuest(next, 'earnAsh', ernte, now)
  if (reward.xp) next = withXp(next, reward.xp, now)
  if (reward.fest) next = earnFest(next, reward.fest, now)
  return next
}

/** Glücksrad result for the Gartenjahr that just began. */
export function applyWheel(state: GameState, kind: WheelKind): GameState {
  let next: GameState = { ...state, wheelBuff: { kind, prestige: state.prestiges } }
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
    ernte: next.ernte + gained,
    ernteSeason: next.ernteSeason + gained,
    ernteLifetime: next.ernteLifetime + gained,
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
