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
  tiefeWurzeln: number
  /** Winterschutz — +1 h soft / +2 h hard offline per rank */
  winterschutz: number
  /** Saatgutvorrat — start each Tiefer Winter cycle with Erbstücke */
  saatgutvorrat: number
  /** Gartenwissen — Gartenjahr gates open one year earlier per rank */
  gartenwissen: number
}

export const EMPTY_DEEP_META: DeepMetaUpgrades = {
  tiefeWurzeln: 0,
  winterschutz: 0,
  saatgutvorrat: 0,
  gartenwissen: 0,
}

/** First Gartenjahr in which a Tiefer Winter is possible (all corners open). */
export const DEEP_GATE_YEAR = 15

/** Sprösslinge for ending the cycle in Gartenjahr `year` (saisonenden + 1). */
export function sproutPayout(saisonenden: number): number {
  const over = saisonenden + 1 - (DEEP_GATE_YEAR - 2)
  if (over < 2) return 0
  // √-like tail: pushing far past Gartenjahr 21 still pays, but linearly
  if (over <= 8) return Math.floor(2 * Math.pow(over, 1.3))
  return Math.floor(2 * Math.pow(8, 1.3) + 3 * (over - 8))
}

export function canDeepReset(saisonenden: number): boolean {
  return saisonenden + 1 >= DEEP_GATE_YEAR
}

/**
 * Ruhezeit nach einem Tiefen Winter: drei Tage. Normale Spieler machen ohnehin
 * nur alle 3–7 Tage einen; die Ruhezeit bremst nur den Kreislauf aus starken
 * Kapiteln → Gartenjahr 15 in Stunden → Generationen im Tagestakt
 * (docs/kapitel/balance-bericht.md).
 */
export const DEEP_REST_MS = 3 * 86_400_000

/** Restliche Ruhezeit in ms (0 = Tiefer Winter möglich, sobald das Gartenjahr reicht). */
export function deepRestLeft(tieferWinterAt: number, now: number): number {
  if (!(tieferWinterAt > 0)) return 0
  return Math.max(0, tieferWinterAt + DEEP_REST_MS - now)
}

/** Gartenjahr reicht und die Ruhezeit ist vorbei. */
export function canDeepNow(saisonenden: number, tieferWinterAt: number, now: number): boolean {
  return canDeepReset(saisonenden) && deepRestLeft(tieferWinterAt, now) <= 0
}

export function deepYieldMult(d: DeepMetaUpgrades): number {
  return 1 + 0.1 * d.tiefeWurzeln
}

export function deepOfflineBonusHours(d: DeepMetaUpgrades): { soft: number; hard: number } {
  return { soft: d.winterschutz, hard: d.winterschutz * 2 }
}

export function deepStartErbstuecke(d: DeepMetaUpgrades): number {
  return d.saatgutvorrat * 60
}

/** Effective season count for Gartenjahr gates (Gartenwissen). */
export function gateSeasons(saisonenden: number, d: DeepMetaUpgrades): number {
  return saisonenden + d.gartenwissen
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
  { id: 'tiefeWurzeln', maxRank: 20, cost: (rank) => 3 + 2 * rank },
  { id: 'winterschutz', maxRank: 8, cost: (rank) => 4 + 3 * rank },
  { id: 'saatgutvorrat', maxRank: 10, cost: (rank) => 3 + 3 * rank },
  { id: 'gartenwissen', maxRank: 3, cost: (rank) => 12 + 12 * rank },
]

export interface LongLoopStateSlice {
  /** Sprösslinge — Tiefer-Winter currency */
  sproesslinge: number
  sproesslingLaden: DeepMetaUpgrades
  /** How many deep resets completed. */
  tiefeWinter: number
  /** Pflanzenbuch — variety ids found (permanent) */
  collection: string[]
  /** Glücksrad buff for one Gartenjahr */
  wheelBuff: WheelBuff | null
}

export function emptyLongLoopSlice(): LongLoopStateSlice {
  return {
    sproesslinge: 0,
    sproesslingLaden: { ...EMPTY_DEEP_META },
    tiefeWinter: 0,
    collection: [],
    wheelBuff: null,
  }
}
