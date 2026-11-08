/**
 * Light “best next buy” hint — one chip, no text walls.
 * Scores unlocked modules by Δrate / cost (efficiency). Prefers affordable;
 * else soonest-affordable within ~3 minutes of current rate.
 */

import {
  GENERATORS,
  generatorRate,
  isGeneratorUnlocked,
  type GeneratorId,
} from './generators'
import type { GameState } from './state'
import { efficiencyMult } from './branches'
import { gateSeasons } from './longLoop'

export interface BestBuyHint {
  id: GeneratorId
  name: string
  /** Soft cost of the next level */
  cost: number
  /** Expected Δ soft/s from one upgrade */
  deltaRate: number
  /** True when player can buy now */
  affordable: boolean
  /** Seconds until affordable at current rate (0 if affordable) */
  etaSec: number
  /** Efficiency score deltaRate/cost */
  score: number
}

export function computeBestBuy(
  state: GameState,
  opts: {
    playerLevel: number
    ratePerSec: number
    costOf: (id: GeneratorId) => number
  },
): BestBuyHint | null {
  let bestAffordable: BestBuyHint | null = null
  let bestSoon: BestBuyHint | null = null

  for (const def of GENERATORS) {
    const unlocked = isGeneratorUnlocked(
      def,
      state.ashEarned,
      state.owned,
      state.emberUpgrades.firstFlame > 0,
      opts.playerLevel,
      gateSeasons(state.prestiges, state.deepUpgrades),
    )
    if (!unlocked) continue
    const owned = state.owned[def.id] ?? 0
    const cost = opts.costOf(def.id)
    if (!Number.isFinite(cost) || cost <= 0) continue

    const branch = state.branches[def.id]
    const mEff = efficiencyMult(branch?.efficiency ?? 0)
    const before = generatorRate(def, owned) * mEff
    const after = generatorRate(def, owned + 1) * mEff
    const deltaRate = Math.max(0, after - before)
    if (deltaRate <= 0) continue

    const score = deltaRate / cost
    const affordable = state.ash >= cost
    const need = Math.max(0, cost - state.ash)
    const etaSec =
      affordable || opts.ratePerSec <= 0
        ? 0
        : Math.ceil(need / opts.ratePerSec)

    const hint: BestBuyHint = {
      id: def.id,
      name: def.name,
      cost,
      deltaRate,
      affordable,
      etaSec,
      score,
    }

    if (affordable) {
      if (!bestAffordable) {
        bestAffordable = hint
      } else {
        const bestOwned = state.owned[bestAffordable.id] ?? 0
        // Prefer an already-online line when scores are close so Soft-Prestige
        // with firstFlame doesn't spotlight an empty G2 over G1 Ausbauen.
        const preferOnline =
          owned >= 1 &&
          bestOwned < 1 &&
          hint.score >= bestAffordable.score * 0.85
        if (preferOnline || hint.score > bestAffordable.score) {
          bestAffordable = hint
        }
      }
    } else if (etaSec > 0 && etaSec <= 180) {
      if (
        !bestSoon ||
        hint.score > bestSoon.score * 1.05 ||
        (Math.abs(hint.score - bestSoon.score) < 1e-12 &&
          hint.etaSec < bestSoon.etaSec)
      ) {
        bestSoon = hint
      }
    }
  }

  return bestAffordable ?? bestSoon
}
