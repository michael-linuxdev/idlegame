import { formatAsh } from '../game/format'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
}

/** Bandbreiten-Schub — Wochenend-Event, schließbar. */
export function EventBanner({ game }: Props) {
  const {
    surge,
    surgeVisible,
    surgeGoalDone,
    surgeGoalClaimed,
    state,
    dismissEvent,
    claimEventGoal,
    eventMult,
  } = game

  if (!surgeVisible) return null

  const progress = Math.min(1, state.eventAshProgress / surge.goal)
  const progressLabel = `${formatAsh(Math.min(state.eventAshProgress, surge.goal))} / ${formatAsh(surge.goal)}`

  return (
    <div className="banner event-surge map-banner compact" role="status">
      <div className="banner-copy">
        <p className="banner-kicker">
          {surge.name}
          {eventMult > 1 ? (
            <span className="banner-mult"> · ×{eventMult.toFixed(2)}</span>
          ) : null}
        </p>
        <p className="banner-oneline">
          <span className="banner-meta">{surge.endsLabel}</span>
          <span className="banner-reward">
            {' '}
            · {t.event.goalLine(progressLabel, surge.goalReward)}
          </span>
        </p>
        <div
          className="event-goal"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t.event.goalAria}
        >
          <div className="event-goal-bar" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      <div className="banner-actions">
        {surgeGoalDone && !surgeGoalClaimed ? (
          <button type="button" className="btn buy" onClick={claimEventGoal}>
            {t.event.claimGoal}
          </button>
        ) : null}
        {surgeGoalClaimed ? (
          <p className="banner-meta claimed">{t.event.claimed}</p>
        ) : null}
        <button
          type="button"
          className="btn ghost event-dismiss"
          onClick={dismissEvent}
          aria-label={t.event.dismiss}
        >
          ×
        </button>
      </div>
    </div>
  )
}
