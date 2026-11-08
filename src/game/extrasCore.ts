/**
 * Small engagement systems that live in the save (no React):
 *  - Oma Ilse — helper for the chapters (bought with Obst)
 *  - Weinlese — timing minigame on the Weinberg, once per hour
 *  - Meilenstein-Truhen — a new lifetime Meilenstein record opens a chest
 *  - Omas Tagesrezept — three ingredients from three areas, once a day
 *  - Himmelsereignisse — Regenbogen (×5 for 60 s) / Sternschnuppe (wish)
 *  - Größter Kürbis — weekly Vereinsrunde against simulated neighbours
 *    (offline, clearly labelled; can move to a real server later)
 */
import { payoutAtGate } from './economy'
import { GARDEN_VARIETIES } from './gardenLife'
import type { GeneratorId } from './generators'

/* ——— Oma Ilse ——— */

export const ILSE_RANKS = [
  { cost: 5_000, intervalMs: 2500 },
  { cost: 150_000, intervalMs: 1500 },
  { cost: 4_000_000, intervalMs: 900 },
  { cost: 100_000_000, intervalMs: 500 },
  { cost: 3_000_000_000, intervalMs: 250 },
] as const

/* ——— Weinlese ——— */

export const WEINLESE = {
  cooldownMs: 60 * 60 * 1000,
  durationMs: 20_000,
  grapes: 10,
  /** Trauben reward per ripe grape, in seconds of Weinberg production */
  secondsPerHit: 120,
} as const

/* ——— Meilenstein-Truhen ——— */

export interface ChestReward {
  kind: 'samen' | 'erbstuecke' | 'fest' | 'variety'
  amount: number
  variety?: string
}

export function rollChest(prestiges: number, collection: readonly string[], rng = Math.random): ChestReward {
  const r = rng()
  if (r < 0.1) {
    const open = GARDEN_VARIETIES.filter((v) => !collection.includes(v.id))
    if (open.length > 0) {
      const v = open[Math.floor(rng() * open.length)]!
      return { kind: 'variety', amount: 1, variety: v.id }
    }
    return { kind: 'samen', amount: 25 }
  }
  if (r < 0.35) return { kind: 'erbstuecke', amount: Math.max(3, Math.round(payoutAtGate(prestiges) * 0.25)) }
  if (r < 0.5) return { kind: 'fest', amount: 10 + Math.floor(rng() * 16) }
  return { kind: 'samen', amount: 5 + Math.floor(rng() * 11) }
}

/* ——— Omas Tagesrezept ——— */

export interface Recipe {
  /** Local day key */
  day: string
  /** Three garden areas (ingredients) */
  areas: GeneratorId[]
  /** Ausbauten done per ingredient today */
  have: number[]
  claimed: boolean
  /** Index into strings.recipe.dishes */
  dish: number
}

export const RECIPE_NEED = 8
export const RECIPE_REWARD = { samen: 12, ernteSeconds: 600, fest: 6, xp: 20 } as const

export function emptyRecipe(): Recipe {
  return { day: '', areas: [], have: [], claimed: false, dish: 0 }
}

function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Deterministic per day: three different planted areas. */
export function makeRecipe(day: string, planted: GeneratorId[]): Recipe {
  const pool = [...planted]
  const areas: GeneratorId[] = []
  let h = hash(day)
  while (areas.length < 3 && pool.length > 0) {
    const i = h % pool.length
    areas.push(pool.splice(i, 1)[0]!)
    h = Math.imul(h ^ (h >>> 13), 2654435761) >>> 0
  }
  return { day, areas, have: areas.map(() => 0), claimed: false, dish: hash(day + 'd') % 8 }
}

/* ——— Himmelsereignisse ——— */

export interface SkyEvent {
  kind: 'rainbow' | 'star'
  /** Tap window ends */
  until: number
}

export const SKY = {
  firstDelayMs: 15 * 60 * 1000,
  minGapMs: 40 * 60 * 1000,
  maxGapMs: 80 * 60 * 1000,
  windowMs: 90 * 1000,
  rainbowMs: 60 * 1000,
  rainbowMult: 5,
  wishSamen: 20,
  wishErnteSec: 900,
  wishFest: 15,
} as const

/* ——— Größter Kürbis ——— */

export const CONTEST_KG = {
  water: 1.2,
  upgrade: 0.02,
  daily: 3,
  order: 2,
  visitor: 0.5,
} as const

/** Samen for rank 1…10 */
export const CONTEST_REWARDS = [60, 40, 25, 15, 15, 8, 8, 5, 5, 5] as const

export interface ContestResult {
  week: string
  rank: number
  kg: number
  claimed: boolean
}

export const NEIGHBOURS = ['Erna', 'Herbert', 'Gisela', 'Kalle', 'Ute', 'Mehmet', 'Rosi', 'Bernd', 'Jutta'] as const

/** Final kg of each neighbour for a week (deterministic). */
export function neighbourFinals(week: string): number[] {
  return NEIGHBOURS.map((n, i) => {
    const h = hash(`${week}:${n}`)
    const base = 18 + (h % 1000) / 1000 * 70 // 18–88 kg
    return Math.round((base + i * 0.7) * 10) / 10
  })
}

/** Neighbour weight now: grows through the week (Mon 00:00 → Sun 24:00). */
export function neighbourNow(week: string, now: number): number[] {
  // weekKey format: YYYY-WMMDD (Monday)
  const y = Number(week.slice(0, 4))
  const m = Number(week.slice(6, 8))
  const d = Number(week.slice(8, 10))
  const start = new Date(y, m - 1, d).getTime()
  const p = Math.max(0, Math.min(1, (now - start) / (7 * 86_400_000)))
  return neighbourFinals(week).map((kg) => Math.round(kg * (0.15 + 0.85 * p) * 10) / 10)
}

/** 1-based rank of `kg` against the neighbours' final weights. */
export function contestRank(week: string, kg: number): number {
  return 1 + neighbourFinals(week).filter((n) => n > kg).length
}
