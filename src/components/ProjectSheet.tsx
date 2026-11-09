import { formatErnte, formatDecimal } from '../game/format'
import { useDismiss } from '../game/overlays'
import { PROJECTS, PROJECT_STAGES, projectsMult, stageCost } from '../game/projects'
import { projectOpen } from '../game/state'
import { playSfx } from '../game/sound'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import { DecorArt } from '../theme/DecorArt'
import { chapterCopy } from './chapterCopy'

type GameApi = ReturnType<typeof useGame>

const ART = { pavillon: 'pavillon', brunnen: 'brunnen', dorffest: 'lampions', rosengarten: 'rosenbogen', gartenroute: 'bank' } as const

/** Großprojekte: build stages with chapter currencies. */
export function ProjectSheet({ game, onClose }: { game: GameApi; onClose: () => void }) {
  useDismiss(onClose)
  const { state } = game
  return (
    <div className="upgrade-hud-layer project-layer" onClick={onClose}>
      <div className="upgrade-hud project-sheet" role="dialog" aria-labelledby="project-title" onClick={(e) => e.stopPropagation()}>
        <header className="upgrade-hud-header">
          <h2 id="project-title">{t.projects.title}</h2>
          <button type="button" className="upgrade-hud-close" onClick={onClose} aria-label="×">
            ×
          </button>
        </header>
        <p className="muted">{t.projects.intro}</p>
        <p className="project-total">{t.projects.total(formatDecimal((projectsMult(state.projects) - 1) * 100, 0))}</p>
        <ul className="project-list">
          {PROJECTS.map((p) => {
            const stage = state.projects[p.id] ?? 0
            const open = projectOpen(state, p.id)
            const done = stage >= PROJECT_STAGES
            const costs = done ? [] : stageCost(p, stage)
            const afford = costs.every(({ chapter, cost }) => state.chapters[chapter].cur >= cost)
            return (
              <li key={p.id} className={`project-card${done ? ' done' : ''}${open ? '' : ' locked'}`}>
                <div className="project-art">
                  <DecorArt id={ART[p.id]} />
                </div>
                <div className="project-info">
                  <strong>{t.projects.names[p.id]}</strong>
                  <small>{t.projects.blurbs[p.id]}</small>
                  <div className="project-stages" aria-label={t.projects.stage(stage, PROJECT_STAGES)}>
                    {Array.from({ length: PROJECT_STAGES }, (_, i) => (
                      <span key={i} className={i < stage ? 'on' : ''} />
                    ))}
                  </div>
                  <small className="project-reward">
                    {p.reward.decor
                      ? t.projects.rewardDecor(t.decor.names[p.reward.decor]!)
                      : p.reward.samen
                        ? t.projects.rewardSamen(p.reward.samen)
                        : t.projects.rewardBonus(Math.round((p.reward.bonus ?? 0) * 100))}
                  </small>
                  {!open ? (
                    <small className="project-lock">{t.projects.locked(p.chapters.map((c) => chapterCopy(c).title).join(', '))}</small>
                  ) : done ? (
                    <small className="project-done">{t.projects.done}</small>
                  ) : (
                    <>
                      <ul className="project-costs">
                        {costs.map(({ chapter, cost }) => {
                          const have = state.chapters[chapter].cur
                          return (
                            <li key={chapter} className={have >= cost ? 'ok' : ''}>
                              <span className="project-cur">{chapterCopy(chapter).icon}</span>
                              {formatErnte(Math.min(have, cost))}/{formatErnte(cost)} {chapterCopy(chapter).currency}
                            </li>
                          )
                        })}
                      </ul>
                      <button
                        type="button"
                        className="btn buy"
                        disabled={!afford}
                        onClick={() => {
                          game.buildProject(p.id)
                          playSfx('level')
                        }}
                      >
                        {t.projects.build} · {t.projects.stage(stage + 1, PROJECT_STAGES)}
                      </button>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
