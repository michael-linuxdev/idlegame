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

import type { WheelBuff } from './gardenLife'

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
  // √-like tail: pushing far past Gartenjahr 21 still pays, but linearly
  if (over <= 8) return Math.floor(2 * Math.pow(over, 1.3))
  return Math.floor(2 * Math.pow(8, 1.3) + 3 * (over - 8))
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

export interface DeepShopItem {
  id: DeepMetaId
  maxRank: number
  /** Cost in Sprossen / season tokens at current rank */
  cost: (rank: number) => number
}

/** Sprösslings-Laden. */
export const DEEP_SHOP: DeepShopItem[] = [
  { id: 'deepYield', maxRank: 20, cost: (rank) => 3 + 2 * rank },
  { id: 'deepWatch', maxRank: 8, cost: (rank) => 4 + 3 * rank },
  { id: 'deepPurse', maxRank: 10, cost: (rank) => 3 + 3 * rank },
  { id: 'deepStart', maxRank: 3, cost: (rank) => 12 + 12 * rank },
]

export interface LongLoopStateSlice {
  /** Sprösslinge — Tiefer-Winter currency */
  sproesslinge: number
  deepUpgrades: DeepMetaUpgrades
  /** How many deep resets completed. */
  deepPrestiges: number
  /** Pflanzenbuch — variety ids found (permanent) */
  collection: string[]
  /** Glücksrad buff for one Gartenjahr */
  wheelBuff: WheelBuff | null
}

export function emptyLongLoopSlice(): LongLoopStateSlice {
  return {
    sproesslinge: 0,
    deepUpgrades: { ...EMPTY_DEEP_META },
    deepPrestiges: 0,
    collection: [],
    wheelBuff: null,
  }
}
