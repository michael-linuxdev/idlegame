import type { NextGoal } from '../game/nextGoal'
import { t } from '../i18n'

interface Props {
  goal: NextGoal
  onActivate?: () => void
}

export function NextGoalStrip({ goal, onActivate }: Props) {
  const ready = goal.ratio >= 0.999
  const pct = Math.round(Math.min(1, Math.max(0, goal.ratio)) * 100)

  return (
    <button
      type="button"
      className={`next-goal-strip kind-${goal.kind}${ready ? ' ready' : ''}`}
      onClick={onActivate}
      aria-label={`${t.goal.stripAria}: ${goal.title}. ${goal.detail}`}
    >
      <span className="next-goal-kicker">{t.goal.stripAria}</span>
      <span className="next-goal-title">{goal.title}</span>
      {goal.detail ? (
        <span className="next-goal-detail">{goal.detail}</span>
      ) : null}
      <span className="next-goal-track" aria-hidden="true">
        <span
          className={`next-goal-fill${ready ? ' pulse' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </span>
    </button>
  )
}
