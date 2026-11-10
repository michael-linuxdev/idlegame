import { formatDecimal } from '../game/format'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'
import { useDismiss } from '../game/overlays'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  onClose: () => void
}

export function ProgressSheet({ game, onClose }: Props) {
  const { playerLevel, levelMult, achievementRows } = game
  const bonusPct = formatDecimal((levelMult - 1) * 100, 1)
  useDismiss(onClose)

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <div
        className="sheet progress-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <header className="sheet-header">
          <div>
            <p className="eyebrow">{t.level.label}</p>
            <h2 id="progress-title">
              {t.level.label} {playerLevel.level}
            </h2>
          </div>
          <button
            type="button"
            className="sheet-x"
            onClick={onClose}
            aria-label={t.hud.progressClose}
          >
            ×
          </button>
        </header>

        <div
          className="level-bar-block"
          aria-label={t.hud.playerLevelAria(
            playerLevel.level,
            playerLevel.intoLevel,
            playerLevel.need,
          )}
        >
          <div className="level-bar-meta">
            <span>
              {playerLevel.intoLevel} / {playerLevel.need} {t.level.xp}
            </span>
            <span className="level-bonus">{t.level.bonus(bonusPct)}</span>
          </div>
          <div className="level-bar-track" aria-hidden="true">
            <div
              className="level-bar-fill"
              style={{ width: `${Math.round(playerLevel.ratio * 100)}%` }}
            />
          </div>
        </div>

        <p className="muted progress-intro progress-today-note">{t.today.movedNote}</p>

        <h3 className="progress-subhead">{t.achievements.title}</h3>
        <p className="muted progress-intro">{t.achievements.intro}</p>
        <ul className="achievement-list">
          {achievementRows.map(({ def, claimed, complete }) => (
            <li
              key={def.id}
              className={`achievement-row${claimed || complete ? ' done' : ''}`}
            >
              <div className="achievement-copy">
                <strong>{def.name()}</strong>
                <span className="muted">{def.blurb()}</span>
                <span className="achievement-reward">{def.rewardLabel()}</span>
              </div>
              {claimed || complete ? (
                <span className="quest-badge">{t.achievements.done}</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

