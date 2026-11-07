import { formatAsh } from '../game/format'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
}

/** Tägliche Ops — Anspruch auf Compute / Credits / Obsidian. Keine Energy-Walls. */
export function DailyOpsBanner({ game }: Props) {
  const { dailyReady, dailyPreview, state, claimDaily } = game
  if (!dailyReady) return null

  const bits: string[] = []
  if (dailyPreview.compute > 0) bits.push(`${formatAsh(dailyPreview.compute)} Compute`)
  if (dailyPreview.credits > 0) bits.push(`${dailyPreview.credits} Credits`)
  if (dailyPreview.obsidian > 0) bits.push(`${dailyPreview.obsidian} Obsidian`)

  const streakLabel =
    state.dailyStreak > 0
      ? `Serie ${state.dailyStreak} · nächster Tag`
      : 'Erste Schicht'

  return (
    <div className="banner daily-ops map-banner" role="status">
      <div className="banner-copy">
        <p className="banner-kicker">Tägliche Ops</p>
        <p>
          <strong>{dailyPreview.label}</strong>
          <span className="banner-meta"> · {streakLabel}</span>
        </p>
        <p className="banner-reward">{bits.join(' · ')}</p>
      </div>
      <button type="button" className="btn buy" onClick={claimDaily}>
        Abholen
      </button>
    </div>
  )
}
