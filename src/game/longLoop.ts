/**
 * Long loop — Tiefer Winter (layer 2 prestige).
 *
 * Saison → Saisonende (Erbstücke, Omas Truhe) → Tiefer Winter (Sprösslinge).
 * Once every corner of the garden is open (Gartenjahr ≥ DEEP_GATE_YEAR) the
 * player may let the garden rest through a deep winter: Gartenjahre,
 * Erbstücke and Omas Truhe reset, Sprösslinge buy permanent boosts.
 * Tuned with scripts/balance/sim.ts. Year / era slices remain in the save
 * format for a later layer but have no UI.
 *
 * Ethics: no energy walls; fair events live elsewhere — do not punish here.
 */

import { EMBER_SHOP, type EmberUpgrades } from './economy'

/** L3 season length — 7 weeks wall-clock (calendar stub; not forced logout). */
export const SEASON_LENGTH_MS = 7 * 7 * 24 * 60 * 60 * 1000

/** Soft-prestige runs before deep gate opens (OR shop fill). */
export const DEEP_GATE_PRESTIGES = 12

/** Münzen-shop fill ratio (0–1) that also opens deep gate. */
export const DEEP_GATE_SHOP_FILL = 0.7

/** Seasons that complete one year track. */
export const YEAR_SEASONS_TARGET = 6

/** Prestige lifetime alternate era gate (engaged multi-year). */
export const ERA_GATE_LIFETIME_PRESTIGES = 80

export type LongLoopLayer =
  | 'run'
  | 'softPrestige'
  | 'season'
  | 'year'
  | 'era'

export interface DeepMetaUpgrades {
  /** Tiefe Wurzeln — +10 % global Ernte/s per rank */
  deepYield: number
  /** Winterschutz — +1 h soft / +2 h hard offline per rank */
  deepWatch: number
  /** Saatgutvorrat — start each Tiefer Winter cycle with Erbstücke */
  deepPurse: number
  /** Gartenwissen — Gartenjahr gates open one year earlier per rank */
  deepStart: number
}

export const EMPTY_DEEP_META: DeepMetaUpgrades = {
  deepYield: 0,
  deepWatch: 0,
  deepPurse: 0,
  deepStart: 0,
}

/** First Gartenjahr in which a Tiefer Winter is possible (all corners open). */
export const DEEP_GATE_YEAR = 15

/** Sprösslinge for ending the cycle in Gartenjahr `year` (prestiges + 1). */
export function sproutPayout(prestiges: number): number {
  const over = prestiges + 1 - (DEEP_GATE_YEAR - 2)
  if (over < 2) return 0
  return Math.floor(2 * Math.pow(over, 1.3))
}

export function canDeepReset(prestiges: number): boolean {
  return prestiges + 1 >= DEEP_GATE_YEAR
}

export function deepYieldMult(d: DeepMetaUpgrades): number {
  return 1 + 0.1 * d.deepYield
}

export function deepOfflineBonusHours(d: DeepMetaUpgrades): { soft: number; hard: number } {
  return { soft: d.deepWatch, hard: d.deepWatch * 2 }
}

export function deepStartEmbers(d: DeepMetaUpgrades): number {
  return d.deepPurse * 60
}

/** Effective season count for Gartenjahr gates (Gartenwissen). */
export function gateSeasons(prestiges: number, d: DeepMetaUpgrades): number {
  return prestiges + d.deepStart
}

export type DeepMetaId = keyof DeepMetaUpgrades

export interface EraUpgrades {
  /** Legacy flex +0.5% global soft/sec per rank (max 20) — stub */
  rootYield: number
  /** Cosmetic-adjacent status ranks (max 10) — stub */
  rootBanner: number
}

export const EMPTY_ERA_UPGRADES: EraUpgrades = {
  rootYield: 0,
  rootBanner: 0,
}

export type EraUpgradeId = keyof EraUpgrades

export interface DeepShopItem {
  id: DeepMetaId
  maxRank: number
  /** Cost in Sprossen / season tokens at current rank */
  cost: (rank: number) => number
}

export interface EraShopItem {
  id: EraUpgradeId
  maxRank: number
  cost: (rank: number) => number
}

/** Sprösslings-Laden. */
export const DEEP_SHOP: DeepShopItem[] = [
  { id: 'deepYield', maxRank: 20, cost: (rank) => 3 + 2 * rank },
  { id: 'deepWatch', maxRank: 8, cost: (rank) => 4 + 3 * rank },
  { id: 'deepPurse', maxRank: 10, cost: (rank) => 3 + 3 * rank },
  { id: 'deepStart', maxRank: 3, cost: (rank) => 12 + 12 * rank },
]

export const ERA_SHOP: EraShopItem[] = [
  { id: 'rootYield', maxRank: 20, cost: (rank) => 6 + 4 * rank },
  { id: 'rootBanner', maxRank: 10, cost: (rank) => 8 + 5 * rank },
]

export interface LongLoopStateSlice {
  /** Monotonic season index (0 = Season 1). Survives soft prestige. */
  seasonIndex: number
  /** Wall-clock season start (ms). 0 = not started / use first deep unlock. */
  seasonStartedAt: number
  /** Points toward deep payout this season (earn wiring later). */
  seasonPoints: number
  /** Deep meta currency — Sprossen / Saison-Jetons. */
  deepEmbers: number
  deepUpgrades: DeepMetaUpgrades
  /** How many deep resets completed. */
  deepPrestiges: number
  /** Year track index (0 = Jahr 1). */
  yearIndex: number
  /** Seasons completed toward current year goal. */
  yearSeasonsDone: number
  /** Claimed year milestone ids (stable strings). */
  yearGoalsClaimed: string[]
  /** Era currency — Wurzelsterne. */
  eraPoints: number
  eraUpgrades: EraUpgrades
}

export function emptyLongLoopSlice(): LongLoopStateSlice {
  return {
    seasonIndex: 0,
    seasonStartedAt: 0,
    seasonPoints: 0,
    deepEmbers: 0,
    deepUpgrades: { ...EMPTY_DEEP_META },
    deepPrestiges: 0,
    yearIndex: 0,
    yearSeasonsDone: 0,
    yearGoalsClaimed: [],
    eraPoints: 0,
    eraUpgrades: { ...EMPTY_ERA_UPGRADES },
  }
}

/** Sum of ember shop ranks / max ranks (0…1). */
export function emberShopFillRatio(upgrades: EmberUpgrades): number {
  let have = 0
  let max = 0
  for (const item of EMBER_SHOP) {
    have += Math.min(upgrades[item.id], item.maxRank)
    max += item.maxRank
  }
  if (max <= 0) return 0
  return have / max
}

export function deepGateOpen(args: {
  prestiges: number
  emberUpgrades: EmberUpgrades
}): boolean {
  if (args.prestiges >= DEEP_GATE_PRESTIGES) return true
  return emberShopFillRatio(args.emberUpgrades) >= DEEP_GATE_SHOP_FILL
}

export function eraGateOpen(args: {
  yearIndex: number
  lifetimePrestiges: number
}): boolean {
  return (
    args.yearIndex >= 1 || args.lifetimePrestiges >= ERA_GATE_LIFETIME_PRESTIGES
  )
}

export function seasonEndsAt(seasonStartedAt: number): number {
  if (seasonStartedAt <= 0) return 0
  return seasonStartedAt + SEASON_LENGTH_MS
}

export function seasonRemainingMs(
  seasonStartedAt: number,
  now = Date.now(),
): number {
  const end = seasonEndsAt(seasonStartedAt)
  if (end <= 0) return SEASON_LENGTH_MS
  return Math.max(0, end - now)
}

/** Prestiges still needed for deep gate (0 if shop-fill path already open). */
export function deepGatePrestigesLeft(
  prestiges: number,
  emberUpgrades: EmberUpgrades,
): number {
  if (deepGateOpen({ prestiges, emberUpgrades })) return 0
  return Math.max(0, DEEP_GATE_PRESTIGES - prestiges)
}

export const YEAR_GOAL_DEFS: { id: string; seasonsNeeded: number }[] = [
  { id: 'year-seasons-2', seasonsNeeded: 2 },
  { id: 'year-seasons-4', seasonsNeeded: 4 },
  { id: 'year-seasons-6', seasonsNeeded: YEAR_SEASONS_TARGET },
]

/** Pure preview helpers — no state mutation in scaffold. */
export function previewDeepPayout(seasonPoints: number): number {
  if (seasonPoints <= 0) return 0
  return Math.floor(Math.sqrt(seasonPoints / 5_000))
}

/**
 * Future deep-reset: keep deep/year/era + monetization; soft ranks may
 * partially roll back in a balance PR. Scaffold only documents the contract.
 */
export function deepResetKeeps(): string[] {
  return [
    'deepEmbers',
    'deepUpgrades',
    'yearIndex',
    'yearGoalsClaimed',
    'eraPoints',
    'eraUpgrades',
    'obsidian',
    'cosmetics',
    'streak',
    'adsRemoved',
  ]
}
