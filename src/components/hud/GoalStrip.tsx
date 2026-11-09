import { useId, type ReactNode } from 'react'

export interface HudGoal {
  key: string
  title: string
  detail: string
  /** 0…1 progress */
  ratio: number
  tone: 'goal' | 'tip' | 'season'
  nearMiss?: boolean
  icon: ReactNode
  aria: string
  onActivate: () => void
}

/** The one and only goal line — next step, Omas tip or Saisonende. */
export function GoalStrip({ goal }: { goal: HudGoal }) {
  // Name = sichtbarer Text (WCAG „label in name“); die Langfassung ist die Beschreibung
  const descId = useId()
  const pct = Math.round(Math.min(1, Math.max(0, goal.ratio)) * 100)
  const ready = pct >= 100
  return (
    <button
      type="button"
      className={`hud-goal tone-${goal.tone}${ready ? ' ready' : ''}${goal.nearMiss ? ' near' : ''}`}
      onClick={goal.onActivate}
      aria-describedby={descId}
    >
      <span className="sr-only" id={descId}>
        {goal.aria}
      </span>
      <span className="hud-goal-icon">{goal.icon}</span>
      <span className="hud-goal-text">
        <span className="hud-goal-title">{goal.title}</span>
        {goal.detail ? <span className="hud-goal-detail">{goal.detail}</span> : null}
      </span>
      <span className="hud-goal-track" aria-hidden="true">
        <span className="hud-goal-fill" style={{ width: `${pct}%` }} />
      </span>
    </button>
  )
}
