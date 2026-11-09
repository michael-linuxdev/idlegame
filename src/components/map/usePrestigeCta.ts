/** Saisonende-/Truhe-Hinweis auf der Karte. Teil von GardenMap. */
import { useMemo } from 'react'
import { erbstueckePayout, isProbeYear } from '../../game/economy'
import { PRESTIGE_SPIKE_RATIOS } from '../../game/surpriseJumps'
import {
  countAffordableTruheBuys,
  countAffordableTruheBuysAfterPrestige,
  modulesToNextTruheUnlock,
  postPrestigeStartOwned,
} from '../../game/truhe'
import type { useGame } from '../../game/useGame'
import { t } from '../../i18n'

type GameApi = ReturnType<typeof useGame>

export interface PrestigeCta {
  ready: boolean
  erbstuecke: number
  label: string
  aria: string
  spend: boolean
}

/** Map CTA: spend leftover Erbstücke, or honest prestige preview (never false „lohnt sich“). */
export function usePrestigeCta(game: GameApi): PrestigeCta | null {
  const { state, nextPrestige, canPrestige, prestigeProgress } = game
  const probe = isProbeYear(state)
  return useMemo(() => {
    const readyBuys = countAffordableTruheBuys(
      state.truhe,
      state.erbstuecke,
      state.ernteSeason,
      state.owned,
      state.saisonenden,
    )
    // Truhe erst nach dem ersten Saisonende als Ziel (vorher verwirrt sie nur)
    if (readyBuys > 0 && state.erbstuecke > 0 && (state.saisonenden > 0 || state.tiefeWinter > 0 || state.generation > 0)) {
      return {
        ready: true,
        erbstuecke: state.erbstuecke,
        label: t.prestige.spendCta(readyBuys),
        aria: t.prestige.spendAria,
        spend: true,
      }
    }
    const nearTier = PRESTIGE_SPIKE_RATIOS.findIndex((r) => prestigeProgress.ratio >= r)
    if (nearTier < 0 && !canPrestige) return null
    const erbstuecke = Math.max(nextPrestige, erbstueckePayout(state.ernteSeason, state.saisonenden, probe))
    if (erbstuecke <= 0) return null
    const ready = canPrestige || prestigeProgress.ratio >= 1
    const postBuys = countAffordableTruheBuysAfterPrestige({
      upgrades: state.truhe,
      erbstuecke: state.erbstuecke,
      ernteSeason: state.ernteSeason,
      saisonenden: state.saisonenden,
      probe,
    })
    if (postBuys > 0) {
      return {
        ready,
        erbstuecke,
        label: ready
          ? t.prestige.worthItCta(erbstuecke)
          : t.prestige.worthItNear(erbstuecke),
        aria: t.prestige.worthItAria,
        spend: false,
      }
    }
    const mods =
      modulesToNextTruheUnlock(
        state.truhe,
        0,
        postPrestigeStartOwned(state.truhe),
        state.saisonenden + 1,
      ) ?? 0
    return {
      ready,
      erbstuecke,
      label: ready
        ? t.prestige.worthItRebuild(erbstuecke, mods)
        : t.prestige.worthItNearRebuild(erbstuecke, mods),
      aria: t.prestige.worthItRebuildAria,
      spend: false,
    }
  }, [
    canPrestige,
    nextPrestige,
    prestigeProgress.ratio,
    state.ernteSeason,
    state.erbstuecke,
    state.truhe,
    state.owned,
    state.saisonenden,
    state.tiefeWinter,
    state.generation,
    probe,
  ])
}
