/**
 * Branch upgrades (Effizienz / Kapazität) on existing modules.
 * Paid in soft Ertrag; reset on prestige so runs stay fair.
 * Main Upgrade CTA stays primary — branches are secondary sinks.
 */

import { t } from '../i18n'
import type { GeneratorDef, GeneratorId } from './generators'

export type BranchKind = 'efficiency' | 'capacity'

export const BRANCH_MAX_RANK = 5

/** +4 % line rate per Effizienz-Rang. */
export function efficiencyMult(rank: number): number {
  return 1 + 0.04 * Math.max(0, Math.min(BRANCH_MAX_RANK, rank))
}

/** ×0.97^rank line upgrade costs per Kapazität-Rang. */
export function capacityCostMult(rank: number): number {
  return Math.pow(0.97, Math.max(0, Math.min(BRANCH_MAX_RANK, rank)))
}

export type BranchRanks = Record<GeneratorId, { efficiency: number; capacity: number }>

export function emptyBranches(ids: GeneratorId[]): BranchRanks {
  const out = {} as BranchRanks
  for (const id of ids) {
    out[id] = { efficiency: 0, capacity: 0 }
  }
  return out
}

/**
 * Branch cost in Ertrag.
 * ~2.2× module C0 · 1.5^rank — meaningful but not a wall next to main upgrades.
 */
export function branchCost(
  def: GeneratorDef,
  kind: BranchKind,
  rank: number,
): number {
  const kindMult = kind === 'capacity' ? 1.15 : 1
  const raw = def.baseCost * 2.2 * Math.pow(1.5, Math.max(0, rank)) * kindMult
  return Math.max(25, Math.floor(raw))
}

export function branchLabel(kind: BranchKind): string {
  return kind === 'efficiency' ? t.branches.efficiency : t.branches.capacity
}

export function branchBlurb(kind: BranchKind): string {
  return kind === 'efficiency'
    ? t.branches.efficiencyBlurb
    : t.branches.capacityBlurb
}

export function branchEffectLabel(kind: BranchKind, rank: number): string {
  if (kind === 'efficiency') {
    return t.branches.efficiencyEffect(rank * 4)
  }
  return t.branches.capacityEffect(
    Math.pow(0.97, rank).toFixed(3),
  )
}

/** Branches unlock once the module is online (owned ≥ 1). */
export function canBuyBranch(
  owned: number,
  rank: number,
  ash: number,
  cost: number,
): boolean {
  return owned >= 1 && rank < BRANCH_MAX_RANK && ash >= cost
}
