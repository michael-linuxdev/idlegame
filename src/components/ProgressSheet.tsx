import { formatAsh, formatDecimal } from '../game/format'
import { t } from '../i18n'
import { WEEKLY_BONUS, WEEKLY_TASKS, type ExtrasState, type WeeklyTaskId } from '../game/extras'
import { playSfx } from '../game/sound'
import type { useGame } from '../game/useGame'
import { useDismiss } from '../game/overlays'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  onClose: () => void
  extras: ExtrasState
  updateExtras: (fn: (s: ExtrasState) => ExtrasState) => void
}

export function ProgressSheet({ game, onClose, extras, updateExtras }: Props) {
  const { playerLevel, levelMult, questRows, achievementRows, claimQuest } =
    game
  const bonusPct = formatDecimal((levelMult - 1) * 100, 1)
  useDismiss(onClose)
  // Ready to claim first, then open tasks, done ones last
  const weekly = [...WEEKLY_TASKS].sort((a, b) => rank(a.id) - rank(b.id))
  function rank(id: WeeklyTaskId) {
    const task = WEEKLY_TASKS.find((x) => x.id === id)!
    if (extras.weekClaimed.includes(id)) return 2
    return extras.week[id] >= task.target ? 0 : 1
  }
  const quests = [...questRows].sort(
    (a, b) => (a.claimed ? 2 : a.ready ? 0 : 1) - (b.claimed ? 2 : b.ready ? 0 : 1),
  )

  const weeklyBlock = (
    <>
        <h3 className="progress-subhead">{t.weekly.title}</h3>
        <p className="muted progress-intro">{t.weekly.intro}</p>
        <ul className="quest-list weekly-list">
          {weekly.map((task) => {
            const have = Math.min(extras.week[task.id], task.target)
            const ready = have >= task.target
            const claimed = extras.weekClaimed.includes(task.id)
            return (
              <li key={task.id} className={`quest-row${claimed ? ' done' : ''}`}>
                <div className="quest-copy">
                  <p className="quest-label">{t.weekly.tasks[task.id](task.target)}</p>
                  <p className="quest-progress">{have} / {task.target}</p>
                  <p className="quest-reward">{t.weekly.reward(task.seeds)}</p>
                </div>
                {claimed ? (
                  <span className="quest-badge">{t.weekly.done}</span>
                ) : ready ? (
                  <button
                    type="button"
                    className="btn buy quest-claim"
                    onClick={() => {
                      game.grant({ samen: task.seeds })
                      playSfx('claim')
                      updateExtras((s) => ({ ...s, weekClaimed: [...s.weekClaimed, task.id as WeeklyTaskId] }))
                    }}
                  >
                    {t.weekly.claim}
                  </button>
                ) : (
                  <QuestMeter ratio={have / task.target} />
                )}
              </li>
            )
          })}
          {(() => {
            const left = WEEKLY_TASKS.length - extras.weekClaimed.length
            return (
              <li className={`quest-row weekly-bonus${extras.weekBonusClaimed ? ' done' : ''}`}>
                <div className="quest-copy">
                  <p className="quest-label">{t.weekly.bonusTitle}</p>
                  <p className="quest-reward">{t.weekly.bonusReward(WEEKLY_BONUS.seeds, WEEKLY_BONUS.erbstuecke)}</p>
                </div>
                <button
                  type="button"
                  className="btn buy quest-claim"
                  disabled={left > 0 || extras.weekBonusClaimed}
                  onClick={() => {
                    game.grant({ samen: WEEKLY_BONUS.seeds, erbstuecke: WEEKLY_BONUS.erbstuecke })
                    playSfx('streak')
                    updateExtras((s) => ({ ...s, weekBonusClaimed: true }))
                  }}
                >
                  {extras.weekBonusClaimed ? t.weekly.done : left > 0 ? t.weekly.bonusLocked(left) : t.weekly.claim}
                </button>
              </li>
            )
          })()}
        </ul>
    </>
  )
  const questsBlock = (
    <>
        <h3 className="progress-subhead">{t.quests.title}</h3>
        <p className="muted progress-intro">{t.quests.intro}</p>
        <ul className="quest-list">
          {quests.map((q: (typeof questRows)[number]) => (
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
              ) : q.ready ? (
                <button type="button" className="btn buy quest-claim" onClick={() => claimQuest(q.id)}>
                  {t.quests.claim}
                </button>
              ) : (
                <QuestMeter ratio={q.target > 0 ? q.progress / q.target : 0} />
              )}
            </li>
          ))}
        </ul>
    </>
  )
  // The HUD dot means „something to claim“ — put that list first
  const weeklyReady = WEEKLY_TASKS.some((x) => !extras.weekClaimed.includes(x.id) && extras.week[x.id] >= x.target)
  const questsFirst = !weeklyReady && quests.some((q) => q.ready)

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

        {questsFirst ? questsBlock : weeklyBlock}

        {questsFirst ? weeklyBlock : questsBlock}

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

/** Small progress ring for a task that is not done yet (instead of a dead button). */
function QuestMeter({ ratio }: { ratio: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, ratio)) * 100)
  return (
    <span className="quest-meter" aria-label={`${pct} %`} style={{ ['--p' as string]: pct }}>
      {pct} %
    </span>
  )
}
