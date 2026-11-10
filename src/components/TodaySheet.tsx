/**
 * „Heute“-Karte (Runde 4, Paket 2): Tägliche Gartenrunde, Omas Tagesrezept,
 * Tagesziele und Omas Wochenplan an einer Stelle. Ein Zugang unten links
 * (BottomBar) statt einzelner Pillen und roter Punkte.
 */
import { formatErnte } from '../game/format'
import { t } from '../i18n'
import { WEEKLY_BONUS, WEEKLY_TASKS, type ExtrasState, type WeeklyTaskId } from '../game/extras'
import { RECIPE_NEED } from '../game/extrasCore'
import { GENERATORS } from '../game/generators'
import { playSfx } from '../game/sound'
import { todaySections } from '../game/today'
import type { useGame } from '../game/useGame'
import { useDismiss } from '../game/overlays'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  onClose: () => void
  extras: ExtrasState
  updateExtras: (fn: (s: ExtrasState) => ExtrasState) => void
  onClaimDaily: () => void
  onCooked: (msg: string) => void
}

export function TodaySheet({ game, onClose, extras, updateExtras, onClaimDaily, onCooked }: Props) {
  const { questRows, claimQuest, state } = game
  useDismiss(onClose)
  const sections = todaySections({ state, dailyReady: game.dailyReady, recipeOpen: game.features.has('recipe'), extras })
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
  const streak = state.dailyStreak
  const day = Math.max(1, Math.min(7, (streak || 0) + 1))
  const r = state.recipe
  const dish = t.recipe.dishes[r.dish % t.recipe.dishes.length]!

  const dailyBlock = (
    <section className="today-section today-daily" aria-labelledby="today-daily-title">
      <h3 className="progress-subhead" id="today-daily-title">{t.daily.kicker}</h3>
      <div className={`quest-row${game.dailyReady ? '' : ' done'}`}>
        <div className="quest-copy">
          <strong>{game.dailyPreview.comeback ? t.daily.comebackLabel : t.daily.dayOf(day)}</strong>
          <span className="quest-reward">{game.dailyPreview.label}</span>
        </div>
        {game.dailyReady ? (
          <button type="button" className="btn buy quest-claim" onClick={onClaimDaily}>
            {t.daily.claim}
          </button>
        ) : (
          <span className="quest-badge">{t.today.dailyDone}</span>
        )}
      </div>
    </section>
  )

  const recipeBlock = (
    <section className="today-section today-recipe" aria-labelledby="today-recipe-title">
      <h3 className="progress-subhead" id="today-recipe-title">{t.recipe.title}</h3>
      <p className="muted progress-intro">{r.claimed ? t.recipe.done : `${t.recipe.line(dish)} · ${t.recipe.need(RECIPE_NEED)}`}</p>
      {r.claimed ? null : (
        <>
          <ul className="recipe-list">
            {r.areas.map((id, i) => {
              const name = GENERATORS.find((g) => g.id === id)?.name ?? id
              const have = r.have[i] ?? 0
              return (
                <li key={id} className={have >= RECIPE_NEED ? 'done' : undefined}>
                  <span>{t.recipe.ingredient(name, have, RECIPE_NEED)}</span>
                  <span className="milestone-track" aria-hidden="true">
                    <span style={{ width: `${Math.min(100, (have / RECIPE_NEED) * 100)}%` }} />
                  </span>
                </li>
              )
            })}
          </ul>
          <p className="fest-expire">{t.recipe.reward}</p>
          <button
            type="button"
            className="btn buy today-cook"
            disabled={!game.recipeReady}
            onClick={() => {
              game.cookRecipe()
              playSfx('streak')
              onCooked(t.recipe.cooked(dish))
            }}
          >
            {t.recipe.cook}
          </button>
        </>
      )}
    </section>
  )

  const weeklyBlock = (
    <section className="today-section today-weekly">
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
    </section>
  )
  const questsBlock = (
    <section className="today-section today-quests">
        <h3 className="progress-subhead">{t.quests.title}</h3>
        <p className="muted progress-intro">{t.quests.intro}</p>
        <ul className="quest-list">
          {quests.map((q: (typeof questRows)[number]) => (
            <li key={q.id} className={`quest-row${q.claimed ? ' done' : ''}`}>
              <div className="quest-copy">
                <strong>{q.label}</strong>
                <span className="quest-progress">
                  {t.quests.progress(
                    formatErnte(q.progress),
                    formatErnte(q.target),
                  )}
                </span>
                <span className="quest-reward">
                  {t.quests.rewardLine(q.rewardErnte, q.rewardSamen)}
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
    </section>
  )

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <div
        className="sheet progress-sheet today-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="today-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <header className="sheet-header">
          <div>
            <p className="eyebrow">{t.today.eyebrow}</p>
            <h2 id="today-title">{t.today.title}</h2>
          </div>
          <button type="button" className="sheet-x" onClick={onClose} aria-label={t.today.close}>
            ×
          </button>
        </header>
        {dailyBlock}
        {sections.includes('recipe') ? recipeBlock : null}
        {questsBlock}
        {sections.includes('weekly') ? weeklyBlock : null}
      </div>
    </div>
  )
}

/** Small progress ring for a task that is not done yet (instead of a dead button). */
export function QuestMeter({ ratio }: { ratio: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, ratio)) * 100)
  return (
    <span className="quest-meter" aria-label={`${pct} %`} style={{ ['--p' as string]: pct }}>
      {pct} %
    </span>
  )
}
