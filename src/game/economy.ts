/**
 * Economy knobs — core formulas (R(n), C(n), offline, ember √) unchanged.
 * Player-facing: soft Phyto (TurmFarm) / Tokens (Tokenhalle) + meta.
 * Internal save fields still map to Ash/Embers.
 *
 * Balance pass IG-31 (overnight): prestige was ~5 min for engaged play vs
 * design 45–90 min. Raised P_min base + slowed generator ladder (see generators.ts).
 * Offline caps / ember √ payout untouched.
 *
 * Soft-Prestige depth (IG-53 / playtest 2026-11-07): Münzen-Baum expanded +
 * progressive rank unlocks so first prestige cannot empty the tree in ~50s.
 * Run 2+ soft-gate (min Münzen + rebuilt modules) blocks worthless tiny resets.
 */

import { t } from '../i18n'
import type { GeneratorId } from './generators'

export const OFFLINE_SOFT_HOURS = 8
export const OFFLINE_HARD_HOURS = 24
export const OFFLINE_DECAY_RATE = 0.5

/**
 * Prestige gate: P_min = PRESTIGE_BASE · 1.8^p
 * IG-31: 50_000 → 2_000_000 so first Soft-Reset lands ~45–75 min engaged
 * (was ~5–10 min after content-depth rate snowball).
 */
export const PRESTIGE_BASE_ASH = 2_000_000
export const PRESTIGE_GROWTH = 1.8

/**
 * Soft-Prestige Run 2+ — reject “curiosity” resets with tiny Münzen payouts
 * (playtest: prestige 2 @ 99 embers felt pointless). First prestige ignores this.
 * 180 Münzen ⇒ ashEarned ≥ 180²·10_000 = 324M this run.
 */
export const PRESTIGE_MIN_EMBERS_FROM_RUN = 180

/** Modules that must be online (owned ≥ 1) before Run 2+ Soft-Prestige. */
export const PRESTIGE_MIN_MODULES_ONLINE = 3

/** Prestige gate: P_min = PRESTIGE_BASE_ASH · PRESTIGE_GROWTH^p */
export function prestigeMinAsh(prestiges: number): number {
  return Math.floor(
    PRESTIGE_BASE_ASH * Math.pow(PRESTIGE_GROWTH, Math.max(0, prestiges)),
  )
}

/** Credits payout: E = floor(sqrt(A / 10_000)) where A = Compute earned this run */
export function emberPayout(ashEarned: number): number {
  if (ashEarned <= 0) return 0
  return Math.floor(Math.sqrt(ashEarned / 10_000))
}

/** Ash this run required to earn `embers` Münzen (inverse of emberPayout). */
export function ashForEmberPayout(embers: number): number {
  if (embers <= 0) return 0
  return embers * embers * 10_000
}

export interface EmberUpgrades {
  /** Rack Yield — +5% global soft/sec per rank */
  dominionYield: number
  /** Long Uptime — +1h soft / +2h hard offline per rank */
  longWatch: number
  /** BOM Discount — 0.98^rank cost mult */
  foundryDiscount: number
  /** Hot Spare — start each run with Cooling Array unlocked (max 1) */
  firstFlame: number
  /** Tap Mastery — +15s tap bonus duration per rank */
  tapMastery: number
  /** Seed Purse — start each prestige run with bonus soft currency */
  seedPurse: number
  /** Canopy — +2% global soft/sec per rank (mid-tier Münzen sink) */
  canopyBoost: number
  /** Night soil — +30 min soft offline per rank (uptime mid-tier) */
  nightSoil: number
  /** Sapling surge — start run with G1 (emberPit) at this level */
  saplingSurge: number
  /** Green lattice — +1.5% global soft/sec per rank (late Münzen sink) */
  greenLattice: number
}

export const EMPTY_EMBER_UPGRADES: EmberUpgrades = {
  dominionYield: 0,
  longWatch: 0,
  foundryDiscount: 0,
  firstFlame: 0,
  tapMastery: 0,
  seedPurse: 0,
  canopyBoost: 0,
  nightSoil: 0,
  saplingSurge: 0,
  greenLattice: 0,
}

export type EmberUpgradeId = keyof EmberUpgrades

export type PrestigeBranchId = 'yield' | 'uptime' | 'start'

export interface EmberShopItem {
  id: EmberUpgradeId
  branch: PrestigeBranchId
  name: string
  blurb: string
  maxRank: number
  /** Cost in Credits at current rank (before purchase) */
  cost: (rank: number) => number
  effectLabel: (rank: number) => string
  /**
   * This-run soft earned required before purchasing `rank` (0-based).
   * Progressive unlock — keeps post-prestige Münzen spending stretched
   * across rebuild (~15–45 min), not a 50s dump.
   */
  rankUnlockAsh?: (rank: number) => number
  /** Modules online (owned ≥ 1) required before any rank of this item. */
  unlockModulesOnline?: number
}

export const EMBER_SHOP: EmberShopItem[] = [
  {
    id: 'dominionYield',
    branch: 'yield',
    name: t.emberShop.dominionYield.name,
    blurb: t.emberShop.dominionYield.blurb,
    maxRank: 40,
    cost: (rank) => 5 + 4 * rank,
    effectLabel: (rank) => t.emberShop.dominionYield.effect(rank),
    // Early 0–4 immediate; mid/late gated so leftover Münzen wait on rebuild.
    rankUnlockAsh: (rank) =>
      rank < 5 ? 0 : rank < 15 ? 12_000 : rank < 28 ? 250_000 : 2_000_000,
  },
  {
    id: 'foundryDiscount',
    branch: 'yield',
    name: t.emberShop.foundryDiscount.name,
    blurb: t.emberShop.foundryDiscount.blurb,
    maxRank: 20,
    cost: (rank) => 4 + 3 * rank,
    effectLabel: (rank) => t.emberShop.foundryDiscount.effect(rank),
    rankUnlockAsh: (rank) =>
      rank < 4 ? 0 : rank < 10 ? 20_000 : 400_000,
  },
  {
    id: 'canopyBoost',
    branch: 'yield',
    name: t.emberShop.canopyBoost.name,
    blurb: t.emberShop.canopyBoost.blurb,
    maxRank: 25,
    cost: (rank) => 12 + 8 * rank,
    effectLabel: (rank) => t.emberShop.canopyBoost.effect(rank),
    rankUnlockAsh: (rank) => (rank < 8 ? 80_000 : 1_200_000),
  },
  {
    id: 'greenLattice',
    branch: 'yield',
    name: t.emberShop.greenLattice.name,
    blurb: t.emberShop.greenLattice.blurb,
    maxRank: 20,
    cost: (rank) => 20 + 12 * rank,
    effectLabel: (rank) => t.emberShop.greenLattice.effect(rank),
    rankUnlockAsh: () => 1_000_000,
  },
  {
    id: 'longWatch',
    branch: 'uptime',
    name: t.emberShop.longWatch.name,
    blurb: t.emberShop.longWatch.blurb,
    maxRank: 8,
    cost: (rank) => 8 + 8 * rank,
    effectLabel: (rank) => t.emberShop.longWatch.effect(rank),
    rankUnlockAsh: (rank) => (rank < 3 ? 8_000 : 180_000),
  },
  {
    id: 'tapMastery',
    branch: 'uptime',
    name: t.emberShop.tapMastery.name,
    blurb: t.emberShop.tapMastery.blurb,
    maxRank: 12,
    cost: (rank) => 6 + 5 * rank,
    effectLabel: (rank) => t.emberShop.tapMastery.effect(rank),
    rankUnlockAsh: (rank) => (rank < 4 ? 8_000 : 220_000),
  },
  {
    id: 'nightSoil',
    branch: 'uptime',
    name: t.emberShop.nightSoil.name,
    blurb: t.emberShop.nightSoil.blurb,
    maxRank: 15,
    cost: (rank) => 10 + 7 * rank,
    effectLabel: (rank) => t.emberShop.nightSoil.effect(rank),
    rankUnlockAsh: (rank) => (rank < 5 ? 60_000 : 900_000),
  },
  {
    id: 'firstFlame',
    branch: 'start',
    name: t.emberShop.firstFlame.name,
    blurb: t.emberShop.firstFlame.blurb,
    maxRank: 1,
    cost: () => 12,
    effectLabel: (rank) => t.emberShop.firstFlame.effect(rank),
  },
  {
    id: 'seedPurse',
    branch: 'start',
    name: t.emberShop.seedPurse.name,
    blurb: t.emberShop.seedPurse.blurb,
    maxRank: 12,
    cost: (rank) => 5 + 6 * rank,
    effectLabel: (rank) => t.emberShop.seedPurse.effect(rank),
    rankUnlockAsh: (rank) =>
      rank < 3 ? 0 : rank < 7 ? 25_000 : 500_000,
  },
  {
    id: 'saplingSurge',
    branch: 'start',
    name: t.emberShop.saplingSurge.name,
    blurb: t.emberShop.saplingSurge.blurb,
    maxRank: 10,
    cost: (rank) => 15 + 10 * rank,
    effectLabel: (rank) => t.emberShop.saplingSurge.effect(rank),
    unlockModulesOnline: 3,
    rankUnlockAsh: (rank) => (rank < 4 ? 40_000 : 750_000),
  },
]

export const PRESTIGE_BRANCHES: {
  id: PrestigeBranchId
  title: string
  blurb: string
}[] = [
  {
    id: 'yield',
    title: t.prestige.branchYieldTitle,
    blurb: t.prestige.branchYieldBlurb,
  },
  {
    id: 'uptime',
    title: t.prestige.branchUptimeTitle,
    blurb: t.prestige.branchUptimeBlurb,
  },
  {
    id: 'start',
    title: t.prestige.branchStartTitle,
    blurb: t.prestige.branchStartBlurb,
  },
]

export function prestigeMultiplier(upgrades: EmberUpgrades): number {
  return (
    1 +
    upgrades.dominionYield * 0.05 +
    upgrades.canopyBoost * 0.02 +
    upgrades.greenLattice * 0.015
  )
}

export function foundryDiscountMult(upgrades: EmberUpgrades): number {
  return Math.pow(0.98, upgrades.foundryDiscount)
}

export function offlineCapsHours(upgrades: EmberUpgrades): {
  soft: number
  hard: number
} {
  return {
    soft: OFFLINE_SOFT_HOURS + upgrades.longWatch * 1 + upgrades.nightSoil * 0.5,
    hard: OFFLINE_HARD_HOURS + upgrades.longWatch * 2 + upgrades.nightSoil * 1,
  }
}

/** Tap bonus seconds including Tap Mastery ranks. */
export function tapBonusSeconds(upgrades: EmberUpgrades): number {
  return TAP_BONUS_SECONDS + upgrades.tapMastery * 15
}

/** Soft wallet granted at the start of a prestige run. */
export function prestigeStartAsh(upgrades: EmberUpgrades): number {
  return upgrades.seedPurse * 50
}

/** Starting G1 module level after Soft-Prestige (saplingSurge). */
export function prestigeStartModuleLevel(upgrades: EmberUpgrades): number {
  return Math.max(0, upgrades.saplingSurge)
}

export function modulesOnlineCount(
  owned: Partial<Record<GeneratorId, number>>,
): number {
  let n = 0
  for (const level of Object.values(owned)) {
    if ((level ?? 0) >= 1) n += 1
  }
  return n
}

/** Whether the next rank of a Münzen-shop item is unlocked this run. */
export function emberRankUnlocked(
  item: EmberShopItem,
  rank: number,
  ashEarnedThisRun: number,
  modulesOnline: number,
): boolean {
  if (rank < 0 || rank >= item.maxRank) return false
  if (
    item.unlockModulesOnline != null &&
    modulesOnline < item.unlockModulesOnline
  ) {
    return false
  }
  const needAsh = item.rankUnlockAsh?.(rank) ?? 0
  return ashEarnedThisRun >= needAsh
}

export type PrestigeBlockReason =
  | 'ash'
  | 'embers'
  | 'modules'
  | null

/** Soft-gate diagnostics for UI (Run 2+ Münzen + rebuild). */
export function prestigeBlockReason(args: {
  prestiges: number
  ashEarned: number
  owned: Partial<Record<GeneratorId, number>>
}): PrestigeBlockReason {
  const min = prestigeMinAsh(args.prestiges)
  if (args.ashEarned < min) return 'ash'
  const payout = emberPayout(args.ashEarned)
  if (payout <= 0) return 'ash'
  if (args.prestiges >= 1) {
    if (payout < PRESTIGE_MIN_EMBERS_FROM_RUN) return 'embers'
    if (modulesOnlineCount(args.owned) < PRESTIGE_MIN_MODULES_ONLINE) {
      return 'modules'
    }
  }
  return null
}

/**
 * Offline catchup Compute for elapsed seconds at snapshot rate R (Compute/sec).
 * Soft full rate, then 50% until hard cap; nothing beyond hard.
 */
export function offlineCatchupAsh(
  ratePerSec: number,
  elapsedSec: number,
  softHours: number,
  hardHours: number,
): number {
  if (ratePerSec <= 0 || elapsedSec <= 0) return 0
  const tHours = elapsedSec / 3600
  const soft = softHours
  const hard = hardHours

  if (tHours <= soft) {
    return ratePerSec * tHours * 3600
  }
  if (tHours <= hard) {
    return (
      ratePerSec * soft * 3600 +
      ratePerSec * OFFLINE_DECAY_RATE * (tHours - soft) * 3600
    )
  }
  return (
    ratePerSec * soft * 3600 +
    ratePerSec * OFFLINE_DECAY_RATE * (hard - soft) * 3600
  )
}

/**
 * Active tap bonus — session hook, not a grind sink.
 * IG-31: 45s → 60s of current rate so short visits feel juicier while idle
 * curve stays the prestige pace-setter. Cooldown unchanged (5 min).
 * Tap Mastery adds +15s per rank on top.
 */
export const TAP_BONUS_SECONDS = 60
export const TAP_COOLDOWN_MS = 5 * 60 * 1000

/** Ignore offline banner / claim logs below this away time (false claims). */
export const MIN_OFFLINE_CLAIM_AWAY_MS = 15_000
