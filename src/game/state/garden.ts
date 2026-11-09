/** Spielkern — Garten-Käufe planen, Mehrfachkauf, Gartenhelfer. Öffentlich über src/game/state.ts. */
import { efficiencyMult } from '../branches'
import {
  GENERATORS,
  type GeneratorId,
  generatorCost,
  generatorRate,
  isGeneratorUnlocked,
  nextMilestone,
} from '../generators'
import { buyGenerator, gatePrestiges, lineCostMult } from './buy'
import { playerLevelOf, productionPerSecond } from './core'
import { helperInterval } from './life'
import { type GameState, HELPER_RANKS } from './types'

/** Affordable garden area with the best Δrate / cost. */
export function bestGardenBuy(state: GameState, skip: readonly GeneratorId[] = []): GeneratorId | null {
  const lvl = playerLevelOf(state)
  const gates = gatePrestiges(state)
  let best: GeneratorId | null = null
  let bestScore = 0
  for (const def of GENERATORS) {
    if (skip.includes(def.id)) continue
    if (!isGeneratorUnlocked(def, state.ernteSeason, state.owned, state.truhe.kompostVomVorjahr > 0, lvl, gates)) continue
    const cost = generatorCost(def, state.owned[def.id] ?? 0, lineCostMult(state, def.id))
    if (cost > state.ernte) continue
    const n = state.owned[def.id] ?? 0
    const eff = efficiencyMult(state.branches[def.id]?.efficiency ?? 0)
    const score = ((generatorRate(def, n + 1) - generatorRate(def, n)) * eff) / cost
    if (score > bestScore) {
      bestScore = score
      best = def.id
    }
  }
  return best
}

/** Profi-Jonas looks this far ahead for a Meilenstein (levels). */
const PLAN_HORIZON_LEVELS = 60
/** … and saves up when the planned buy is at most this far away (seconds). */
const PLAN_SAVE_SEC = 120

/**
 * Profi-Jonas (last rank): plans across all garden areas, ignores the
 * Sperrliste. A freshly unlocked area is planted first; otherwise every area
 * is scored by its best package — one level, or all levels up to the next
 * Meilenstein (×2) if that is within PLAN_HORIZON_LEVELS — as Δrate / cost.
 * He buys the next level of the best package, saves for it when it is only
 * a short wait away, else takes the best affordable package.
 */
export function planGardenBuy(state: GameState, now = Date.now()): GeneratorId | null {
  const lvl = playerLevelOf(state)
  const gates = gatePrestiges(state)
  type Cand = { id: GeneratorId; score: number; nextCost: number }
  const cands: Cand[] = []
  for (const def of GENERATORS) {
    if (!isGeneratorUnlocked(def, state.ernteSeason, state.owned, state.truhe.kompostVomVorjahr > 0, lvl, gates)) continue
    const n = state.owned[def.id] ?? 0
    const mult = lineCostMult(state, def.id)
    const nextCost = generatorCost(def, n, mult)
    if (n === 0) {
      if (nextCost <= state.ernte) return def.id
      continue
    }
    const eff = efficiencyMult(state.branches[def.id]?.efficiency ?? 0)
    const steps = [1]
    const m = nextMilestone(n)
    if (m && m.at - n > 1 && m.at - n <= PLAN_HORIZON_LEVELS) steps.push(m.at - n)
    let best = 0
    for (const k of steps) {
      let cost = 0
      for (let i = 0; i < k; i++) cost += generatorCost(def, n + i, mult)
      const gain = (generatorRate(def, n + k) - generatorRate(def, n)) * eff
      if (cost > 0) best = Math.max(best, gain / cost)
    }
    if (best > 0) cands.push({ id: def.id, score: best, nextCost })
  }
  if (cands.length === 0) return null
  cands.sort((a, b) => b.score - a.score)
  const top = cands[0]!
  if (top.nextCost <= state.ernte) return top.id
  const rate = productionPerSecond(state, now)
  if (rate > 0 && (top.nextCost - state.ernte) / rate <= PLAN_SAVE_SEC) return null
  return cands.find((c) => c.nextCost <= state.ernte)?.id ?? null
}

/** Profi-Jonas: the last Gartenhelfer rank plans by himself (no Sperrliste). */
export function helperIsPro(level: number): boolean {
  return level >= HELPER_RANKS.length
}

/** Buy up to `n` levels of one area (stops when Ernte runs out). */
export function buyGeneratorMany(state: GameState, id: GeneratorId, n: number): { state: GameState; bought: number } {
  let next = state
  let bought = 0
  for (let i = 0; i < n; i++) {
    const after = buyGenerator(next, id, i === 0 ? 'manual' : 'bulk')
    if (after === next) break
    next = after
    bought += 1
  }
  return { state: next, bought }
}

/** How many levels of `id` the current Ernte pays for (capped). */
export function affordableLevels(state: GameState, id: GeneratorId, cap = 1000): { count: number; cost: number } {
  const def = GENERATORS.find((g) => g.id === id)
  if (!def) return { count: 0, cost: 0 }
  const mult = lineCostMult(state, id)
  let owned = state.owned[id] ?? 0
  let left = state.ernte
  let count = 0
  let cost = 0
  while (count < cap) {
    const c = generatorCost(def, owned, mult)
    if (c > left) break
    left -= c
    cost += c
    owned += 1
    count += 1
  }
  return { count, cost }
}

/** Total cost of the next `n` levels of `id`. */
export function costForLevels(state: GameState, id: GeneratorId, n: number): number {
  const def = GENERATORS.find((g) => g.id === id)
  if (!def) return Infinity
  const mult = lineCostMult(state, id)
  const owned = state.owned[id] ?? 0
  let sum = 0
  for (let i = 0; i < n; i++) sum += generatorCost(def, owned + i, mult)
  return sum
}

/** „Alles ausbauen“ — spend Ernte on the best buys until nothing is affordable (no longer in the UI). */
export function buyAllBest(state: GameState, cap = 400): { state: GameState; bought: number } {
  let next = state
  let bought = 0
  while (bought < cap) {
    const id = bestGardenBuy(next)
    if (!id) break
    const after = buyGenerator(next, id, bought === 0 ? 'manual' : 'bulk')
    if (after === next) break
    next = after
    bought += 1
  }
  return { state: next, bought }
}

/** Run the Gartenhelfer for `dtMs` (Omas Garten only — Ilse tends the chapters). */
export function runHelper(state: GameState, dtMs: number, maxBuys = 40): { state: GameState; bought: number } {
  if (state.helperLevel <= 0 || !state.helperOn) return { state, bought: 0 }
  const interval = helperInterval(state.helperLevel)
  let carry = state.helperCarryMs + dtMs
  let next = state
  let bought = 0
  while (carry >= interval && bought < maxBuys) {
    const gid = helperIsPro(next.helperLevel) ? planGardenBuy(next) : bestGardenBuy(next, next.helperBlocked)
    if (!gid) {
      carry = Math.min(carry, interval)
      break
    }
    next = buyGenerator(next, gid, 'helper')
    carry -= interval
    bought += 1
  }
  return { state: { ...next, helperCarryMs: Math.min(carry, interval * 2) }, bought }
}
