/**
 * Spieler-Level / XP — shared-core progression depth.
 * XP from upgrades, offline claims, daily claims. Level grants small permanent
 * Ertrag/s bonuses + one-time crumbs. Never energy walls.
 */

import { t } from '../i18n'
import type { CosmeticId } from './monetization'

/**
 * Obergrenze der Gärtnerstufe. Bis 2026-11-14 war bei 40 Schluss (nach zwei
 * Tagen erreicht, danach kein Aufstieg mehr — Playtest Tester 1). Die Kurve bis
 * 40 bleibt unverändert, damit niemand eine Stufe verliert; darüber wächst sie
 * linear (LATE_LEVEL_STEP) und gibt alle 5 Stufen Samen.
 */
export const MAX_PLAYER_LEVEL = 100

/** Letzte Stufe der ursprünglichen Kurve. */
export const CLASSIC_MAX_LEVEL = 40

/** Mehrbedarf je Stufe über CLASSIC_MAX_LEVEL. */
export const LATE_LEVEL_STEP = 400

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
  const C = Math.min(L, CLASSIC_MAX_LEVEL)
  return Math.floor(40 + 25 * C + 8 * C * C) + LATE_LEVEL_STEP * Math.max(0, L - CLASSIC_MAX_LEVEL)
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
 * +0.5 % per level above 1 up to Lv 25 (+12 %), then nothing until Lv 40,
 * then +0.25 % per level above 40 (Lv 100: +27 % in total).
 */
export function levelProductionMult(level: number): number {
  const ranks = Math.max(0, Math.min(24, level - 1))
  const late = Math.max(0, Math.min(MAX_PLAYER_LEVEL, level) - CLASSIC_MAX_LEVEL)
  return 1 + ranks * 0.005 + late * 0.0025
}

export type LevelRewardKind = 'ernte' | 'erbstuecke' | 'samen' | 'cosmetic'

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
    kind: 'ernte',
    amount: 40,
    label: () => t.level.rewards.ernte(40),
  },
  {
    level: 3,
    kind: 'samen',
    amount: 10,
    label: () => t.level.rewards.samen(10),
  },
  {
    level: 5,
    kind: 'erbstuecke',
    amount: 1,
    label: () => t.level.rewards.erbstuecke(1),
  },
  {
    level: 7,
    kind: 'ernte',
    amount: 250,
    label: () => t.level.rewards.ernte(250),
  },
  {
    level: 10,
    kind: 'cosmetic',
    cosmeticId: 'bauerngarten',
    label: () => t.level.rewards.cosmetic(t.cosmetics.bauerngarten.name),
  },
  {
    level: 15,
    kind: 'samen',
    amount: 25,
    label: () => t.level.rewards.samen(25),
  },
  {
    level: 20,
    kind: 'cosmetic',
    cosmeticId: 'bluetenmeer',
    label: () => t.level.rewards.cosmetic(t.cosmetics.bluetenmeer.name),
  },
  // Über Stufe 40: alle 5 Stufen Samen (45: 20 … 100: 75)
  ...Array.from({ length: (MAX_PLAYER_LEVEL - CLASSIC_MAX_LEVEL) / 5 }, (_, i): LevelRewardDef => {
    const level = CLASSIC_MAX_LEVEL + 5 * (i + 1)
    const amount = 15 + 5 * (i + 1)
    return { level, kind: 'samen', amount, label: () => t.level.rewards.samen(amount) }
  }),
]

/** Belohnung genau dieser Stufe (für die Aufstiegs-Meldung). */
export function levelRewardAt(level: number): LevelRewardDef | undefined {
  return LEVEL_REWARDS.find((r) => r.level === level)
}

/** Module unlock OR-gates by Spieler-Level (theme-agnostic IDs). */
export const LEVEL_MODULE_GATES: Partial<Record<string, number>> = {
  // Mid/late modules: level can substitute for ernte/prior gates
  beerenhecke: 6,
  obstwiese: 9,
  bienenstock: 12,
  huehnerstall: 16,
  gewaechshaus: 20,
  hofladen: 25,
  orangerie: 30,
}
