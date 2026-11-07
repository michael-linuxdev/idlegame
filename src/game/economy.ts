/**
 * Economy knobs — core formulas (R(n), C(n), offline, ember √) unchanged.
 * Player-facing: soft Ertrag + meta Münzen (TurmFarm).
 * Internal save fields still map to Ash/Embers.
 *
 * Balance pass IG-31 (overnight): prestige was ~5 min for engaged play vs
 * design 45–90 min. Raised P_min base + slowed generator ladder (see generators.ts).
 * Offline caps / ember shop costs untouched.
 */

import { t } from '../i18n'

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

export interface EmberUpgrades {
  /** Rack Yield — +5% global Compute/sec per rank (max 20) */
  dominionYield: number
  /** Long Uptime — +1h soft / +2h hard offline per rank (max 4) */
  longWatch: number
  /** BOM Discount — 0.98^rank cost mult (max 10) */
  foundryDiscount: number
  /** Hot Spare — start each run with Cooling Array unlocked (max 1) */
  firstFlame: number
}

export const EMPTY_EMBER_UPGRADES: EmberUpgrades = {
  dominionYield: 0,
  longWatch: 0,
  foundryDiscount: 0,
  firstFlame: 0,
}

export type EmberUpgradeId = keyof EmberUpgrades

export interface EmberShopItem {
  id: EmberUpgradeId
  name: string
  blurb: string
  maxRank: number
  /** Cost in Credits at current rank (before purchase) */
  cost: (rank: number) => number
  effectLabel: (rank: number) => string
}

export const EMBER_SHOP: EmberShopItem[] = [
  {
    id: 'dominionYield',
    name: t.emberShop.dominionYield.name,
    blurb: t.emberShop.dominionYield.blurb,
    maxRank: 20,
    cost: (rank) => 3 + 2 * rank,
    effectLabel: (rank) => t.emberShop.dominionYield.effect(rank),
  },
  {
    id: 'longWatch',
    name: t.emberShop.longWatch.name,
    blurb: t.emberShop.longWatch.blurb,
    maxRank: 4,
    cost: (rank) => 5 + 5 * rank,
    effectLabel: (rank) => t.emberShop.longWatch.effect(rank),
  },
  {
    id: 'foundryDiscount',
    name: t.emberShop.foundryDiscount.name,
    blurb: t.emberShop.foundryDiscount.blurb,
    maxRank: 10,
    cost: (rank) => 2 + 2 * rank,
    effectLabel: (rank) => t.emberShop.foundryDiscount.effect(rank),
  },
  {
    id: 'firstFlame',
    name: t.emberShop.firstFlame.name,
    blurb: t.emberShop.firstFlame.blurb,
    maxRank: 1,
    cost: () => 8,
    effectLabel: (rank) => t.emberShop.firstFlame.effect(rank),
  },
]

export function prestigeMultiplier(upgrades: EmberUpgrades): number {
  return 1 + upgrades.dominionYield * 0.05
}

export function foundryDiscountMult(upgrades: EmberUpgrades): number {
  return Math.pow(0.98, upgrades.foundryDiscount)
}

export function offlineCapsHours(upgrades: EmberUpgrades): {
  soft: number
  hard: number
} {
  return {
    soft: OFFLINE_SOFT_HOURS + upgrades.longWatch * 1,
    hard: OFFLINE_HARD_HOURS + upgrades.longWatch * 2,
  }
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
 */
export const TAP_BONUS_SECONDS = 60
export const TAP_COOLDOWN_MS = 5 * 60 * 1000
