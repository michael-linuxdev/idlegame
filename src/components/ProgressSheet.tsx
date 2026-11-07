import { formatAsh } from '../game/format'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  onClose: () => void
}

export function ProgressSheet({ game, onClose }: Props) {
  const { playerLevel, levelMult, questRows, achievementRows, claimQuest } =
    game
  const bonusPct = ((levelMult - 1) * 100).toFixed(1)

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
            className="btn ghost sheet-close"
            onClick={onClose}
          >
            {t.hud.progressClose}
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

        <h3 className="progress-subhead">{t.quests.title}</h3>
        <p className="muted progress-intro">{t.quests.intro}</p>
        <ul className="quest-list">
          {questRows.map((q: (typeof questRows)[number]) => (
            <li key={q.id} className={`quest-row${q.claimed ? ' done' : ''}`}>
              <div className="quest-copy">
                <strong>{q.label}</strong>
                <span className="quest-progress">
                  {t.quests.progress(
                    formatAsh(q.progress),
                    formatAsh(q.target),
                  )}
                </span>
                <span className="quest-reward">
                  {t.quests.rewardLine(q.rewardAsh, q.rewardObsidian)}
                </span>
              </div>
              {q.claimed ? (
                <span className="quest-badge">{t.quests.claimed}</span>
              ) : (
                <button
                  type="button"
                  className="btn buy quest-claim"
                  disabled={!q.ready}
                  onClick={() => claimQuest(q.id)}
                >
                  {t.quests.claim}
                </button>
              )}
            </li>
          ))}
        </ul>

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
