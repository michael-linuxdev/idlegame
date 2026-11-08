/**
 * Kapitel 2 — Streuobstwiese.
 *
 * A second plot with its own ten areas and its own currency (Obst). It runs
 * in parallel to Omas Garten (also offline), never resets on Saisonende,
 * Tiefer Winter or Generation, and lifts the garden's Ernte by a small,
 * uncapped bonus per orchard level.
 *
 * Opens after the first Tiefer Winter (or any Generation).
 */
import { milestoneMult } from './generators'

export type OrchardId =
  | 'apfel'
  | 'birne'
  | 'kirsche'
  | 'zwetschge'
  | 'schafe'
  | 'wildbienen'
  | 'walnuss'
  | 'mosterei'
  | 'doerrhaus'
  | 'obstmarkt'

export interface OrchardDef {
  id: OrchardId
  /** Map position in percent of the orchard map box */
  slot: { left: string; top: string }
  baseRate: number
  baseCost: number
  costScale: number
  /** Previous area level needed to plant this one */
  requires?: { id: OrchardId; level: number }
}

export const ORCHARD: OrchardDef[] = [
  { id: 'apfel', slot: { left: '30%', top: '85%' }, baseRate: 2, baseCost: 15, costScale: 1.15 },
  { id: 'birne', slot: { left: '72%', top: '80%' }, baseRate: 10, baseCost: 220, costScale: 1.15, requires: { id: 'apfel', level: 10 } },
  { id: 'kirsche', slot: { left: '22%', top: '71%' }, baseRate: 60, baseCost: 3_000, costScale: 1.145, requires: { id: 'birne', level: 10 } },
  { id: 'zwetschge', slot: { left: '66%', top: '67%' }, baseRate: 360, baseCost: 40_000, costScale: 1.14, requires: { id: 'kirsche', level: 10 } },
  { id: 'schafe', slot: { left: '34%', top: '57%' }, baseRate: 2_200, baseCost: 500_000, costScale: 1.135, requires: { id: 'zwetschge', level: 10 } },
  { id: 'wildbienen', slot: { left: '78%', top: '54%' }, baseRate: 13_000, baseCost: 6_000_000, costScale: 1.13, requires: { id: 'schafe', level: 10 } },
  { id: 'walnuss', slot: { left: '20%', top: '44%' }, baseRate: 80_000, baseCost: 75_000_000, costScale: 1.125, requires: { id: 'wildbienen', level: 10 } },
  { id: 'mosterei', slot: { left: '64%', top: '41%' }, baseRate: 480_000, baseCost: 900_000_000, costScale: 1.12, requires: { id: 'walnuss', level: 10 } },
  { id: 'doerrhaus', slot: { left: '28%', top: '31%' }, baseRate: 2_900_000, baseCost: 11_000_000_000, costScale: 1.115, requires: { id: 'mosterei', level: 10 } },
  { id: 'obstmarkt', slot: { left: '72%', top: '29%' }, baseRate: 17_000_000, baseCost: 130_000_000_000, costScale: 1.11, requires: { id: 'doerrhaus', level: 10 } },
]

export const ORCHARD_IDS: OrchardId[] = ORCHARD.map((o) => o.id)

export interface OrchardState {
  /** Obst — orchard currency */
  obst: number
  obstLifetime: number
  owned: Record<OrchardId, number>
  /** When Kapitel 2 opened (0 = still closed) */
  openedAt: number
  /** Omas Streuobst letter read */
  introSeen: boolean
}

export function emptyOrchard(): OrchardState {
  const owned = {} as Record<OrchardId, number>
  for (const id of ORCHARD_IDS) owned[id] = 0
  owned.apfel = 1
  return { obst: 20, obstLifetime: 0, owned, openedAt: 0, introSeen: false }
}

export function orchardCost(def: OrchardDef, owned: number, mult = 1): number {
  return Math.max(1, Math.floor(def.baseCost * Math.pow(def.costScale, owned) * mult))
}

export function orchardAreaRate(def: OrchardDef, owned: number): number {
  if (owned <= 0) return 0
  return def.baseRate * owned * milestoneMult(owned)
}

export function orchardUnlocked(def: OrchardDef, owned: Record<OrchardId, number>): boolean {
  if (!def.requires) return true
  return (owned[def.requires.id] ?? 0) >= def.requires.level
}

export function orchardLevels(o: OrchardState): number {
  let n = 0
  for (const id of ORCHARD_IDS) n += o.owned[id] ?? 0
  return n
}

/** Garden Ernte bonus from the orchard: +0,4 % per orchard level, no cap. */
export const ORCHARD_GARDEN_BONUS_PER_LEVEL = 0.004

export function orchardGardenMult(o: OrchardState): number {
  if (o.openedAt <= 0) return 1
  return 1 + ORCHARD_GARDEN_BONUS_PER_LEVEL * orchardLevels(o)
}

/** Raw Obst/s before global multipliers. */
export function orchardBaseRate(o: OrchardState): number {
  let sum = 0
  for (const def of ORCHARD) sum += orchardAreaRate(def, o.owned[def.id] ?? 0)
  return sum
}

/** Areas planted (0–10) — drives the orchard backdrop. */
export function orchardStage(o: OrchardState): number {
  return ORCHARD.filter((d) => (o.owned[d.id] ?? 0) > 0).length
}
