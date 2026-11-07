/**
 * Economy knobs from docs/economy.md — formulas unchanged.
 * Player-facing: soft Compute + meta Credits (Orbit Rack / space data centers).
 * Internal save fields still map to Ash/Embers.
 */

export const OFFLINE_SOFT_HOURS = 8
export const OFFLINE_HARD_HOURS = 24
export const OFFLINE_DECAY_RATE = 0.5

/** Prestige gate: P_min = 50_000 · 1.8^p */
export function prestigeMinAsh(prestiges: number): number {
  return Math.floor(50_000 * Math.pow(1.8, Math.max(0, prestiges)))
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
    name: 'Rack Yield',
    blurb: '+5% global Compute/sec per rank.',
    maxRank: 20,
    cost: (rank) => 3 + 2 * rank,
    effectLabel: (rank) => `+${rank * 5}% Compute/sec`,
  },
  {
    id: 'longWatch',
    name: 'Long Uptime',
    blurb: 'Extend offline soft (+1h) and hard (+2h) caps per rank.',
    maxRank: 4,
    cost: (rank) => 5 + 5 * rank,
    effectLabel: (rank) => `+${rank}h soft / +${rank * 2}h hard`,
  },
  {
    id: 'foundryDiscount',
    name: 'BOM Discount',
    blurb: '−2% all module upgrade costs per rank (compounds).',
    maxRank: 10,
    cost: (rank) => 2 + 2 * rank,
    effectLabel: (rank) => `×${Math.pow(0.98, rank).toFixed(3)} costs`,
  },
  {
    id: 'firstFlame',
    name: 'Hot Spare',
    blurb: 'Start each run with Cooling Array unlocked.',
    maxRank: 1,
    cost: () => 8,
    effectLabel: (rank) => (rank > 0 ? 'Cooling unlocked at start' : 'Locked'),
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

/** Active tap bonus: ~45s of current rate; cooldown 5 minutes. */
export const TAP_BONUS_SECONDS = 45
export const TAP_COOLDOWN_MS = 5 * 60 * 1000
