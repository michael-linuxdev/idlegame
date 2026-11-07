import { formatAsh } from '../game/format'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
}

/** Tägliche Ops — Anspruch auf Rechenleistung / Credits / Obsidian. Keine Energy-Walls. */
export function DailyOpsBanner({ game }: Props) {
  const { dailyReady, dailyPreview, state, claimDaily } = game
  if (!dailyReady) return null

  const bits: string[] = []
  if (dailyPreview.compute > 0) {
    bits.push(t.daily.rewardCompute(formatAsh(dailyPreview.compute)))
  }
  if (dailyPreview.credits > 0) {
    bits.push(t.daily.rewardCredits(dailyPreview.credits))
  }
  if (dailyPreview.obsidian > 0) {
    bits.push(t.daily.rewardObsidian(dailyPreview.obsidian))
  }

  const streakLabel =
    state.dailyStreak > 0
      ? t.daily.streakNext(state.dailyStreak)
      : t.daily.firstShift

  return (
    <div className="banner daily-ops map-banner" role="status">
      <div className="banner-copy">
        <p className="banner-kicker">{t.daily.kicker}</p>
        <p>
          <strong>{dailyPreview.label}</strong>
          <span className="banner-meta"> · {streakLabel}</span>
        </p>
        <p className="banner-reward">{bits.join(' · ')}</p>
      </div>
      <button type="button" className="btn buy" onClick={claimDaily}>
        {t.daily.claim}
      </button>
    </div>
  )
}
