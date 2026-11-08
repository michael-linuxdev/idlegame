/**
 * Always-visible “next goal” picker — unlock / level / prestige / upgrade.
 * Biases toward near-complete goals for “one more” pressure (Zeigarnik).
 * No energy walls.
 */

import { formatAsh } from './format'
import {
  GENERATORS,
  isGeneratorUnlocked,
  type GeneratorId,
} from './generators'
import { LEVEL_MODULE_GATES, xpForLevel } from './progression'
import { prestigeMinAsh } from './economy'
import { gateSeasons } from './longLoop'
import type { GameState } from './state'
import { t } from '../i18n'

export type NextGoalKind = 'upgrade' | 'unlock' | 'level' | 'prestige'

/** Near-miss band — sharper “almost there” pulse in HUD. */
export const NEAR_MISS_RATIO = 0.78
export const NEAR_MISS_HOT_RATIO = 0.92

export interface NextGoal {
  kind: NextGoalKind
  /** Short German label for the strip */
  title: string
  /** Supporting detail (cost / remaining / %) */
  detail: string
  /** 0…1 fill for mini progress bar */
  ratio: number
  /** Optional module to open on tap */
  focusId?: GeneratorId
  /** Urgency score — higher wins */
  urgency: number
  /** Zeigarnik near-miss — pulse the strip */
  nearMiss?: boolean
}

function withNearMiss(goal: NextGoal): NextGoal {
  const nearMiss =
    goal.ratio >= NEAR_MISS_RATIO && goal.ratio < 0.999
  if (!nearMiss) return { ...goal, nearMiss: false }
  const leftPct = Math.max(1, Math.round((1 - goal.ratio) * 100))
  const detail =
    goal.detail && !goal.detail.includes('%')
      ? `${goal.detail} · ${t.goal.nearMiss(leftPct)}`
      : goal.detail || t.goal.nearMiss(leftPct)
  let urgency = goal.urgency + 0.16
  if (goal.ratio >= NEAR_MISS_HOT_RATIO) urgency += 0.12
  return { ...goal, detail, urgency, nearMiss: true }
}

function unlockProgress(
  state: GameState,
  id: GeneratorId,
  playerLevel: number,
): { ratio: number; detail: string } | null {
  const def = GENERATORS.find((g) => g.id === id)
  if (!def?.unlock) return null
  if ((def.unlock.seasons ?? 0) > gateSeasons(state.prestiges, state.deepUpgrades)) return null

  let best = 0
  let detail = ''

  if (def.unlock.ernteSeason != null) {
    const need = def.unlock.ernteSeason
    const r = Math.min(1, state.ernteSeason / need)
    if (r > best) {
      best = r
      const left = Math.max(0, need - state.ernteSeason)
      detail =
        r >= 1
          ? t.goal.ready
          : t.goal.unlockAshLeft(formatAsh(left))
    }
  }

  if (def.unlock.requires) {
    const have = state.owned[def.unlock.requires.id] ?? 0
    const need = def.unlock.requires.level
    const r = Math.min(1, have / need)
    if (r > best) {
      best = r
      const prior = GENERATORS.find((g) => g.id === def.unlock!.requires!.id)
      detail = t.goal.unlockLevel(
        prior?.name ?? def.unlock.requires.id,
        have,
        need,
      )
    }
  }

  const levelGate = LEVEL_MODULE_GATES[id]
  if (levelGate != null) {
    const r = Math.min(1, playerLevel / levelGate)
    if (r > best) {
      best = r
      detail = t.goal.unlockPlayerLevel(playerLevel, levelGate)
    }
  }

  return { ratio: best, detail }
}

/**
 * Pick the single most pressing next goal for the HUD strip.
 */
export function computeNextGoal(
  state: GameState,
  opts: {
    playerLevel: number
    playerXpInto: number
    playerXpNeed: number
    playerXpRatio: number
    costOf: (id: GeneratorId) => number
  },
): NextGoal {
  const candidates: NextGoal[] = []

  // Cheapest affordable / near-affordable upgrade on an unlocked line
  let bestUpgrade: NextGoal | null = null
  for (const def of GENERATORS) {
    const unlocked = isGeneratorUnlocked(
      def,
      state.ernteSeason,
      state.owned,
      state.emberUpgrades.firstFlame > 0,
      opts.playerLevel,
      gateSeasons(state.prestiges, state.deepUpgrades),
    )
    if (!unlocked) continue
    const cost = opts.costOf(def.id)
    if (!Number.isFinite(cost) || cost <= 0) continue
    const ratio = Math.min(1, state.ernte / cost)
    const owned = state.owned[def.id] ?? 0
    const action = owned === 0 ? t.upgrade.online : t.upgrade.upgrade
    const urgency =
      ratio >= 1
        ? 0.95 + (1 / (cost + 1)) * 0.04
        : 0.35 + ratio * 0.45 + (ratio >= NEAR_MISS_RATIO ? 0.1 : 0)
    const goal: NextGoal = withNearMiss({
      kind: 'upgrade',
      title: t.goal.upgradeTitle(action, def.name),
      detail: t.goal.upgradeDetail(formatAsh(cost)),
      ratio,
      focusId: def.id,
      urgency,
    })
    if (!bestUpgrade || goal.urgency > bestUpgrade.urgency) {
      bestUpgrade = goal
    }
  }
  if (bestUpgrade) candidates.push(bestUpgrade)

  // Next locked module (earliest in GENERATORS order with any progress)
  for (const def of GENERATORS) {
    const unlocked = isGeneratorUnlocked(
      def,
      state.ernteSeason,
      state.owned,
      state.emberUpgrades.firstFlame > 0,
      opts.playerLevel,
      gateSeasons(state.prestiges, state.deepUpgrades),
    )
    if (unlocked) continue
    const prog = unlockProgress(state, def.id, opts.playerLevel)
    if (!prog) continue
    candidates.push(
      withNearMiss({
        kind: 'unlock',
        title: t.goal.unlockTitle(def.name),
        detail: prog.detail,
        ratio: prog.ratio,
        focusId: def.id,
        urgency: 0.4 + prog.ratio * 0.5,
      }),
    )
    break
  }

  // Next Spieler-Level
  if (opts.playerLevel < 40) {
    const ratio = opts.playerXpRatio
    candidates.push(
      withNearMiss({
        kind: 'level',
        title: t.goal.levelTitle(opts.playerLevel + 1),
        detail: t.goal.levelDetail(opts.playerXpInto, opts.playerXpNeed),
        ratio,
        urgency: 0.35 + ratio * 0.48,
      }),
    )
  }

  // Prestige gate — strong Zeigarnik when “almost ready”
  const prestigeMin = prestigeMinAsh(state.prestiges)
  const prestigeRatio =
    prestigeMin > 0 ? Math.min(1, state.ernteSeason / prestigeMin) : 1
  const prestigeUrgency =
    prestigeRatio >= 1
      ? 0.9
      : 0.28 +
        prestigeRatio * 0.55 +
        (prestigeRatio >= NEAR_MISS_RATIO ? 0.14 : 0) +
        (prestigeRatio >= NEAR_MISS_HOT_RATIO ? 0.1 : 0)
  candidates.push(
    withNearMiss({
      kind: 'prestige',
      title:
        prestigeRatio >= 1
          ? t.goal.prestigeReady
          : t.goal.prestigeTitle,
      detail:
        prestigeRatio >= 1
          ? t.goal.prestigeReadyDetail
          : t.goal.prestigeDetail(
              formatAsh(Math.max(0, prestigeMin - state.ernteSeason)),
            ),
      ratio: prestigeRatio,
      urgency: prestigeUrgency,
    }),
  )

  candidates.sort((a, b) => b.urgency - a.urgency)
  return (
    candidates[0] ?? {
      kind: 'upgrade',
      title: t.goal.fallback,
      detail: '',
      ratio: 0,
      urgency: 0,
      nearMiss: false,
    }
  )
}

/** Unused helper kept for tests / debug — XP remaining to next level. */
export function xpRemaining(level: number, intoLevel: number): number {
  return Math.max(0, xpForLevel(level) - intoLevel)
}
