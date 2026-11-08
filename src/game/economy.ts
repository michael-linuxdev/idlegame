/**
 * Economy knobs — core formulas (R(n), C(n), offline) unchanged.
 * Player-facing: soft Phyto (TurmFarm) / Tokens (Tokenhalle) + meta.
 * Internal save fields still map to Ash/Embers.
 *
 * Balance pass IG-31 (overnight): prestige was ~5 min for engaged play vs
 * design 45–90 min. Raised P_min base + slowed generator ladder (see generators.ts).
 *
 * Soft-Prestige depth (IG-53 / playtest 2026-11-07 + b + 2026-11-08):
 * Münzen soft-gate every prestige; interleaved rank unlocks during rebuild;
 * steeper cost curve; √ payout soft-capped so runaway ash cannot dump the
 * unlocked band in ~40s or leave a 39k wallet with an empty shop.
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
 * Soft-Prestige Münzen floor — reject tiny “curiosity” resets.
 * First prestige: 120 Münzen ⇒ ashEarned ≥ 120²·10_000 = 144M this run
 * (playtest-b: 38-Münzen first reset emptied early pool and felt dead).
 * Run 2+: 180 Münzen ⇒ 324M this run.
 */
export const PRESTIGE_MIN_EMBERS_FIRST = 120
export const PRESTIGE_MIN_EMBERS_FROM_RUN = 180

/** Modules that must be online (owned ≥ 1) before Run 2+ Soft-Prestige. */
export const PRESTIGE_MIN_MODULES_ONLINE = 3

/**
 * Module levels are the primary Münzen-unlock clock (resets each Soft-Prestige).
 * Kept modest so ~8–12 levels/min rebuild opens ranks over minutes, not seconds.
 */
export const EMBER_UNLOCK_PER_MODULE_LEVEL = 800

/**
 * Soft ash contribution toward unlocks — √ so late-run snowball cannot open
 * the entire tree the moment Phyto explodes. Capped so ash alone never
 * replaces rebuild.
 */
export const EMBER_UNLOCK_ASH_SQRT_DIV = 100
export const EMBER_UNLOCK_ASH_CAP = 30_000

/** @deprecated Use EMBER_UNLOCK_PER_MODULE_LEVEL — kept for older docs/imports. */
export const EMBER_UNLOCK_ASH_PER_MODULE_LEVEL = EMBER_UNLOCK_PER_MODULE_LEVEL

/**
 * Soft-cap on √ Münzen payout (L2 agency without 39k runaway wallets).
 * Raw √ stays linear up to SOFT; overflow diminishes toward CEIL.
 */
export const EMBER_PAYOUT_SOFT = 500
export const EMBER_PAYOUT_CEIL = 1_600

/** Min Münzen payout required before Soft-Prestige at this prestige count. */
export function prestigeMinEmbersForRun(prestiges: number): number {
  return prestiges < 1 ? PRESTIGE_MIN_EMBERS_FIRST : PRESTIGE_MIN_EMBERS_FROM_RUN
}

/** Prestige gate: P_min = PRESTIGE_BASE_ASH · PRESTIGE_GROWTH^p */
export function prestigeMinAsh(prestiges: number): number {
  return Math.floor(
    PRESTIGE_BASE_ASH * Math.pow(PRESTIGE_GROWTH, Math.max(0, prestiges)),
  )
}

/**
 * Credits payout: soft-capped √ — E_raw = floor(sqrt(A / 10_000)), then
 * diminish above EMBER_PAYOUT_SOFT toward EMBER_PAYOUT_CEIL.
 */
export function emberPayout(ashEarned: number): number {
  if (ashEarned <= 0) return 0
  const raw = Math.floor(Math.sqrt(ashEarned / 10_000))
  if (raw <= EMBER_PAYOUT_SOFT) return raw
  const over = raw - EMBER_PAYOUT_SOFT
  const softened =
    EMBER_PAYOUT_SOFT + Math.floor(Math.sqrt(over * 45))
  return Math.min(EMBER_PAYOUT_CEIL, softened)
}

/**
 * Ash this run required to earn `embers` Münzen before soft-cap.
 * Valid inverse for gate values (≤ EMBER_PAYOUT_SOFT); above soft-cap the
 * true ash need is higher — callers only use this for min-gate copy.
 */
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

/** Geometric Münzen cost — one unlocked band must not clear a mid payout in <1 min. */
function emberGeoCost(base: number, growth: number, rank: number): number {
  return Math.ceil(base * Math.pow(growth, Math.max(0, rank)))
}

/**
 * Staggered unlock offsets so branches reopen one-by-one during rebuild,
 * not as a single mid-band dump.
 */
const EMBER_UNLOCK_OFFSET: Record<EmberUpgradeId, number> = {
  dominionYield: 0,
  foundryDiscount: 5_000,
  canopyBoost: 20_000,
  greenLattice: 0,
  longWatch: 8_000,
  tapMastery: 14_000,
  nightSoil: 24_000,
  firstFlame: 0,
  seedPurse: 3_000,
  saplingSurge: 22_000,
}

/** Immediate post-prestige band — one tip per branch + Start-Bonus. */
const EMBER_IMMEDIATE_IDS: ReadonlySet<EmberUpgradeId> = new Set([
  'dominionYield',
  'foundryDiscount',
  'longWatch',
  'seedPurse',
  'firstFlame',
])

/** Progress needed before purchasing `rank` (0-based) of this item. */
export function emberRankUnlockNeed(
  id: EmberUpgradeId,
  rank: number,
): number {
  if (id === 'firstFlame') return 0
  if (id === 'greenLattice') {
    // Reachable mid post-P2 session (~23 module levels + soft ash, or ~60 levels alone).
    return 48_000 + rank * 32_000
  }
  if (rank === 0 && EMBER_IMMEDIATE_IDS.has(id)) return 0
  const offset = EMBER_UNLOCK_OFFSET[id]
  if (rank === 0) return 12_000 + Math.floor(offset / 2)
  return offset + 28_000 + (rank - 1) * (32_000 + rank * 3_000)
}

export const EMBER_SHOP: EmberShopItem[] = [
  {
    id: 'dominionYield',
    branch: 'yield',
    name: t.emberShop.dominionYield.name,
    blurb: t.emberShop.dominionYield.blurb,
    maxRank: 40,
    cost: (rank) => emberGeoCost(25, 1.3, rank),
    effectLabel: (rank) => t.emberShop.dominionYield.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('dominionYield', rank),
  },
  {
    id: 'foundryDiscount',
    branch: 'yield',
    name: t.emberShop.foundryDiscount.name,
    blurb: t.emberShop.foundryDiscount.blurb,
    maxRank: 20,
    cost: (rank) => emberGeoCost(18, 1.28, rank),
    effectLabel: (rank) => t.emberShop.foundryDiscount.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('foundryDiscount', rank),
  },
  {
    id: 'canopyBoost',
    branch: 'yield',
    name: t.emberShop.canopyBoost.name,
    blurb: t.emberShop.canopyBoost.blurb,
    maxRank: 25,
    cost: (rank) => emberGeoCost(36, 1.32, rank),
    effectLabel: (rank) => t.emberShop.canopyBoost.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('canopyBoost', rank),
  },
  {
    id: 'greenLattice',
    branch: 'yield',
    name: t.emberShop.greenLattice.name,
    blurb: t.emberShop.greenLattice.blurb,
    maxRank: 20,
    cost: (rank) => emberGeoCost(60, 1.34, rank),
    effectLabel: (rank) => t.emberShop.greenLattice.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('greenLattice', rank),
  },
  {
    id: 'longWatch',
    branch: 'uptime',
    name: t.emberShop.longWatch.name,
    blurb: t.emberShop.longWatch.blurb,
    maxRank: 8,
    cost: (rank) => emberGeoCost(30, 1.4, rank),
    effectLabel: (rank) => t.emberShop.longWatch.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('longWatch', rank),
  },
  {
    id: 'tapMastery',
    branch: 'uptime',
    name: t.emberShop.tapMastery.name,
    blurb: t.emberShop.tapMastery.blurb,
    maxRank: 12,
    cost: (rank) => emberGeoCost(20, 1.32, rank),
    effectLabel: (rank) => t.emberShop.tapMastery.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('tapMastery', rank),
  },
  {
    id: 'nightSoil',
    branch: 'uptime',
    name: t.emberShop.nightSoil.name,
    blurb: t.emberShop.nightSoil.blurb,
    maxRank: 15,
    cost: (rank) => emberGeoCost(34, 1.34, rank),
    effectLabel: (rank) => t.emberShop.nightSoil.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('nightSoil', rank),
  },
  {
    id: 'firstFlame',
    branch: 'start',
    name: t.emberShop.firstFlame.name,
    blurb: t.emberShop.firstFlame.blurb,
    maxRank: 1,
    cost: () => 60,
    effectLabel: (rank) => t.emberShop.firstFlame.effect(rank),
  },
  {
    id: 'seedPurse',
    branch: 'start',
    name: t.emberShop.seedPurse.name,
    blurb: t.emberShop.seedPurse.blurb,
    maxRank: 12,
    cost: (rank) => emberGeoCost(20, 1.36, rank),
    effectLabel: (rank) => t.emberShop.seedPurse.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('seedPurse', rank),
  },
  {
    id: 'saplingSurge',
    branch: 'start',
    name: t.emberShop.saplingSurge.name,
    blurb: t.emberShop.saplingSurge.blurb,
    maxRank: 10,
    cost: (rank) => emberGeoCost(45, 1.38, rank),
    effectLabel: (rank) => t.emberShop.saplingSurge.effect(rank),
    unlockModulesOnline: 1,
    rankUnlockAsh: (rank) => emberRankUnlockNeed('saplingSurge', rank),
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
  // Slightly juicier start crumbs so post-prestige Phyto doesn't feel flat.
  return upgrades.seedPurse * 80
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

/** Sum of owned module levels (rebuild progress). */
export function moduleLevelsTotal(
  owned: Partial<Record<GeneratorId, number>>,
): number {
  let n = 0
  for (const level of Object.values(owned)) {
    n += Math.max(0, level ?? 0)
  }
  return n
}

/**
 * Effective unlock progress: rebuild (module levels) primary + soft √ ash.
 * Raw ash must not open the whole tree mid-run; leftover Münzen should feel
 * like “waiting on next unlock”, not “shop empty”.
 */
export function emberUnlockProgress(
  ashEarnedThisRun: number,
  owned: Partial<Record<GeneratorId, number>>,
): number {
  const modules =
    moduleLevelsTotal(owned) * EMBER_UNLOCK_PER_MODULE_LEVEL
  const ashPart = Math.min(
    EMBER_UNLOCK_ASH_CAP,
    Math.floor(
      Math.sqrt(Math.max(0, ashEarnedThisRun) / EMBER_UNLOCK_ASH_SQRT_DIV),
    ),
  )
  return modules + ashPart
}

/** Whether the next rank of a Münzen-shop item is unlocked this run. */
export function emberRankUnlocked(
  item: EmberShopItem,
  rank: number,
  ashEarnedThisRun: number,
  owned: Partial<Record<GeneratorId, number>>,
): boolean {
  if (rank < 0 || rank >= item.maxRank) return false
  const modulesOnline = modulesOnlineCount(owned)
  if (
    item.unlockModulesOnline != null &&
    modulesOnline < item.unlockModulesOnline
  ) {
    return false
  }
  const needAsh = item.rankUnlockAsh?.(rank) ?? 0
  return emberUnlockProgress(ashEarnedThisRun, owned) >= needAsh
}

/** How many Münzen-shop ranks are affordable + unlocked right now. */
export function countAffordableEmberBuys(
  upgrades: EmberUpgrades,
  embers: number,
  ashEarnedThisRun: number,
  owned: Partial<Record<GeneratorId, number>>,
): number {
  let n = 0
  for (const item of EMBER_SHOP) {
    const rank = upgrades[item.id]
    if (rank >= item.maxRank) continue
    if (!emberRankUnlocked(item, rank, ashEarnedThisRun, owned)) continue
    if (embers >= item.cost(rank)) n += 1
  }
  return n
}

export interface NextEmberUnlock {
  item: EmberShopItem
  rank: number
  need: number
  have: number
  /** 0…1 progress toward this unlock. */
  ratio: number
}

/**
 * Nearest locked Münzen rank (lowest need). Used for shop “waiting” banner
 * and per-row progress when the wallet is full but the band is gated.
 */
export function nextLockedEmberUnlock(
  upgrades: EmberUpgrades,
  ashEarnedThisRun: number,
  owned: Partial<Record<GeneratorId, number>>,
): NextEmberUnlock | null {
  const have = emberUnlockProgress(ashEarnedThisRun, owned)
  const online = modulesOnlineCount(owned)
  let best: NextEmberUnlock | null = null
  for (const item of EMBER_SHOP) {
    const rank = upgrades[item.id]
    if (rank >= item.maxRank) continue
    if (
      item.unlockModulesOnline != null &&
      online < item.unlockModulesOnline
    ) {
      const need = item.rankUnlockAsh?.(rank) ?? 0
      const candidate: NextEmberUnlock = {
        item,
        rank,
        need: Math.max(need, 1),
        have,
        ratio: 0,
      }
      if (!best || candidate.need < best.need) best = candidate
      continue
    }
    const need = item.rankUnlockAsh?.(rank) ?? 0
    if (have >= need) continue
    const candidate: NextEmberUnlock = {
      item,
      rank,
      need,
      have,
      ratio: need > 0 ? Math.min(1, have / need) : 1,
    }
    if (!best || candidate.need < best.need) best = candidate
  }
  return best
}

/** Immediate-band Münzen sink (progress 0) — balance probe / docs. */
export function immediateEmberSinkCost(): number {
  let total = 0
  for (const item of EMBER_SHOP) {
    for (let rank = 0; rank < item.maxRank; rank++) {
      if ((item.rankUnlockAsh?.(rank) ?? 0) > 0) break
      total += item.cost(rank)
    }
  }
  return total
}

export type PrestigeBlockReason =
  | 'ash'
  | 'embers'
  | 'modules'
  | null

/** Soft-gate diagnostics for UI (Münzen floor every run + rebuild on Run 2+). */
export function prestigeBlockReason(args: {
  prestiges: number
  ashEarned: number
  owned: Partial<Record<GeneratorId, number>>
}): PrestigeBlockReason {
  const min = prestigeMinAsh(args.prestiges)
  if (args.ashEarned < min) return 'ash'
  const payout = emberPayout(args.ashEarned)
  if (payout <= 0) return 'ash'
  if (payout < prestigeMinEmbersForRun(args.prestiges)) return 'embers'
  if (
    args.prestiges >= 1 &&
    modulesOnlineCount(args.owned) < PRESTIGE_MIN_MODULES_ONLINE
  ) {
    return 'modules'
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
