import { useState } from 'react'
import { formatAsh } from '../game/format'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  onClaimed?: () => void
}

/** Tägliche Pflege — Streak + Comeback. Keine Energy-Walls. */
export function DailyOpsBanner({ game, onClaimed }: Props) {
  const { dailyReady, dailyPreview, state, claimDaily } = game
  const [celebrate, setCelebrate] = useState(false)

  if (!dailyReady && !celebrate) return null

  if (celebrate) {
    return (
      <div className="claim-toast celebrate" role="status">
        {t.daily.claimToast}
      </div>
    )
  }

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

  const streak = state.dailyStreak
  const streakLabel =
    streak > 0 ? t.daily.streakNext(streak) : t.daily.firstShift
  const comeback = dailyPreview.comeback === true
  const displayStreak = Math.max(1, Math.min(7, (streak || 0) + 1))

  function onClaim() {
    claimDaily()
    onClaimed?.()
    setCelebrate(true)
    window.setTimeout(() => setCelebrate(false), 1200)
  }

  return (
    <div
      className={`banner daily-ops map-banner compact${comeback ? ' comeback' : ''}`}
      role="status"
    >
      <div className="banner-copy">
        <p className="banner-kicker">{t.daily.kicker}</p>
        <p className="banner-oneline">
          <strong>{dailyPreview.label}</strong>
          <span className="banner-meta"> · {streakLabel}</span>
          {bits.length ? (
            <span className="banner-reward"> · {bits.join(' · ')}</span>
          ) : null}
        </p>
        {comeback ? (
          <p className="banner-meta comeback-meta">{t.daily.comebackMeta}</p>
        ) : null}
        <div
          className="streak-dots"
          aria-label={t.daily.streakDotsAria(Math.min(7, streak || 0))}
        >
          {Array.from({ length: 7 }, (_, i) => (
            <span
              key={i}
              className={`streak-dot${i < displayStreak ? ' on' : ''}`}
            />
          ))}
        </div>
      </div>
      <button type="button" className="btn buy pulse-ready" onClick={onClaim}>
        {t.daily.claim}
      </button>
    </div>
  )
}
