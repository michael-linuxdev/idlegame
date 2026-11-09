/** Ziel-Zeile im HUD (GoalStrip). Teil von GardenMap. */
import { nearSets } from '../../game/collections'
import { formatErnte } from '../../game/format'
import { GENERATORS, type GeneratorId } from '../../game/generators'
import type { computeBestBuy } from '../../game/bestBuy'
import type { computeNextGoal } from '../../game/nextGoal'
import { logPlaytest } from '../../game/playtestLog'
import type { GameState } from '../../game/state'
import { t } from '../../i18n'
import { IconChest, IconNotebook, IconSnow, IconSprout } from '../../theme/icons'
import type { HudGoal } from '../hud/GoalStrip'
import type { PrestigeCta } from './usePrestigeCta'

interface GoalInput {
  state: GameState
  prestigeCta: PrestigeCta | null
  nextGoal: ReturnType<typeof computeNextGoal>
  bestBuy: ReturnType<typeof computeBestBuy>
  onOpenPrestige: () => void
  onGoal: () => void
  onSelect: (id: GeneratorId) => void
}

/**
 * One goal line, no contradictions: Saisonende/Truhe wins when ready,
 * otherwise Omas best-buy tip replaces a generic „ausbauen“ goal, else the
 * next unlock / level goal.
 */
export function buildHudGoal({ state, prestigeCta, nextGoal, bestBuy, onOpenPrestige, onGoal, onSelect }: GoalInput): HudGoal {
  if (prestigeCta && (prestigeCta.ready || prestigeCta.spend)) {
    return {
      key: 'season',
      title: prestigeCta.spend ? t.prestige.shopTitle : t.goal.prestigeReady,
      detail: prestigeCta.spend
        ? prestigeCta.label.replace(`${t.prestige.shopTitle} · `, '')
        : t.prestige.erbstueckeAmount(prestigeCta.erbstuecke),
      ratio: 1,
      tone: 'season',
      icon: prestigeCta.spend ? <IconChest /> : <IconSnow />,
      aria: prestigeCta.aria,
      onActivate: onOpenPrestige,
    }
  }
  if (nextGoal.kind === 'upgrade' && bestBuy) {
    const cost = bestBuy.cost
    const owned = state.owned[bestBuy.id] ?? 0
    const action = owned === 0 ? t.upgrade.online : t.upgrade.upgrade
    return {
      key: `tip-${bestBuy.id}`,
      title: t.goal.upgradeTitle(action, bestBuy.name),
      detail: t.goal.upgradeDetail(formatErnte(cost)),
      ratio: cost > 0 ? Math.min(1, state.ernte / cost) : 1,
      tone: bestBuy.affordable ? 'tip' : 'goal',
      icon: <IconSprout />,
      aria: `${t.bestBuy.aria}: ${bestBuy.name}`,
      onActivate: () => {
        logPlaytest('best_buy_tap', { id: bestBuy.id, affordable: bestBuy.affordable })
        onSelect(bestBuy.id)
      },
    }
  }
  // Ab Gartenjahr 2: ein fast fertiges Pflanzenbuch-Set als Ziel, wenn gerade kein Kauf ansteht
  const near = state.saisonenden >= 1 && !(bestBuy?.affordable) ? nearSets(state.collection, 1)[0] : undefined
  if (near && nextGoal.kind !== 'prestige') {
    const area = GENERATORS.find((g) => g.id === near.module)?.name ?? near.module
    return {
      key: `set-${near.module}`,
      title: t.collections.goalTitle(area),
      detail: t.collections.goalDetail(near.missing),
      ratio: 0.9,
      tone: 'goal',
      icon: <IconNotebook />,
      aria: `${t.goal.stripAria}: ${t.collections.goalTitle(area)}. ${t.collections.goalDetail(near.missing)}`,
      onActivate: onGoal,
    }
  }
  return {
    key: `goal-${nextGoal.kind}`,
    title: nextGoal.title,
    detail: nextGoal.detail,
    ratio: nextGoal.ratio,
    tone: 'goal',
    nearMiss: nextGoal.nearMiss,
    icon: nextGoal.kind === 'prestige' ? <IconSnow /> : <IconNotebook />,
    aria: `${t.goal.stripAria}: ${nextGoal.title}. ${nextGoal.detail}`,
    onActivate: onGoal,
  }
}
