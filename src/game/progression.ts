/**
 * Spieler-Level / XP — shared-core progression depth.
 * XP from upgrades, offline claims, daily claims. Level grants small permanent
 * Ertrag/s bonuses + one-time crumbs. Never energy walls.
 */

import { t } from '../i18n'
import type { CosmeticId } from './monetization'

/** Soft cap so late levels stay reachable without exploding. */
export const MAX_PLAYER_LEVEL = 40

/** XP awarded when buying a module upgrade (online / +1). */
export const XP_PER_UPGRADE = 8

/** XP awarded when claiming Daily Ops. */
export const XP_PER_DAILY = 25

/** XP from offline catchup claim — soft-capped. */
export function xpFromOfflineClaim(gained: number): number {
  if (gained <= 0) return 0
  return Math.max(5, Math.min(80, Math.floor(Math.sqrt(gained) * 0.85)))
}

/** XP needed to advance from `level` → `level + 1`. */
export function xpForLevel(level: number): number {
  const L = Math.max(1, Math.min(MAX_PLAYER_LEVEL, level))
  return Math.floor(40 + 25 * L + 8 * L * L)
}

/** Derive level + bar fill from lifetime XP. */
export function levelProgress(xp: number): {
  level: number
  intoLevel: number
  need: number
  ratio: number
} {
  let remaining = Math.max(0, Math.floor(xp))
  let level = 1
  while (level < MAX_PLAYER_LEVEL) {
    const need = xpForLevel(level)
    if (remaining < need) {
      return {
        level,
        intoLevel: remaining,
        need,
        ratio: need > 0 ? remaining / need : 1,
      }
    }
    remaining -= need
    level += 1
  }
  const need = xpForLevel(MAX_PLAYER_LEVEL)
  return { level: MAX_PLAYER_LEVEL, intoLevel: need, need, ratio: 1 }
}

/**
 * Permanent global Ertrag/s bonus from Spieler-Level.
 * +0.5 % per level above 1, soft-capped at +12 % (Lv 25).
 */
export function levelProductionMult(level: number): number {
  const ranks = Math.max(0, Math.min(24, level - 1))
  return 1 + ranks * 0.005
}

export type LevelRewardKind = 'ash' | 'embers' | 'obsidian' | 'cosmetic'

export interface LevelRewardDef {
  level: number
  kind: LevelRewardKind
  amount?: number
  cosmeticId?: CosmeticId
  /** German label via theme strings */
  label: () => string
}

/** One-time crumbs claimed the first time the player reaches each level. */
export const LEVEL_REWARDS: LevelRewardDef[] = [
  {
    level: 2,
    kind: 'ash',
    amount: 40,
    label: () => t.level.rewards.ash(40),
  },
  {
    level: 3,
    kind: 'obsidian',
    amount: 10,
    label: () => t.level.rewards.obsidian(10),
  },
  {
    level: 5,
    kind: 'embers',
    amount: 1,
    label: () => t.level.rewards.embers(1),
  },
  {
    level: 7,
    kind: 'ash',
    amount: 250,
    label: () => t.level.rewards.ash(250),
  },
  {
    level: 10,
    kind: 'cosmetic',
    cosmeticId: 'amberPad',
    label: () => t.level.rewards.cosmetic(t.cosmetics.amberPad.name),
  },
  {
    level: 15,
    kind: 'obsidian',
    amount: 25,
    label: () => t.level.rewards.obsidian(25),
  },
  {
    level: 20,
    kind: 'cosmetic',
    cosmeticId: 'iceAisle',
    label: () => t.level.rewards.cosmetic(t.cosmetics.iceAisle.name),
  },
]

/** Module unlock OR-gates by Spieler-Level (theme-agnostic IDs). */
export const LEVEL_MODULE_GATES: Partial<Record<string, number>> = {
  // Mid/late modules: level can substitute for ash/prior gates
  cinderVault: 6,
  ashWatch: 9,
  dominionKeep: 12,
  batteryBank: 16,
  edgeCache: 20,
  quantumCooler: 25,
  packetScrubber: 30,
}
