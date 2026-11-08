import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDismiss } from '../game/overlays'
import { CHAPTERS, type ChapterId } from '../game/chapters'
import { formatAsh } from '../game/format'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import { IconMap, IconSprout } from '../theme/icons'
import { chapterCopy } from './chapterCopy'

type GameApi = ReturnType<typeof useGame>
type Plot = 'garden' | ChapterId

/**
 * Map-side plot switching: direct round buttons while ≤ 2 other plots are
 * open, one „Grundstücke“ button with a picker sheet beyond that.
 */
export function PlotButtons({ game, current, onGo }: { game: GameApi; current: Plot; onGo: (p: Plot) => void }) {
  const [open, setOpen] = useState(false)
  const others: Plot[] = [
    ...(current === 'garden' ? [] : (['garden'] as Plot[])),
    ...game.openChapters.filter((id) => id !== current),
  ]
  // The Garten tab, tapped again, asks for the picker
  useEffect(() => {
    if (others.length === 0) return
    const onAsk = () => setOpen(true)
    window.addEventListener('gartenerbe-open-plots', onAsk)
    return () => window.removeEventListener('gartenerbe-open-plots', onAsk)
  }, [others.length])
  // Portal: the side buttons live in a low stacking context — the sheet must not
  const sheet = open ? createPortal(
    <PlotSheet
      game={game}
      current={current}
      onGo={(p) => {
        setOpen(false)
        onGo(p)
      }}
      onClose={() => setOpen(false)}
    />,
    document.body,
  ) : null
  if (others.length === 0) return null
  if (others.length <= 2) {
    return (
      <>
        {sheet}
        {others.map((p) => {
          if (p === 'garden') {
            return (
              <button key="garden" type="button" className="map-side-btn plot-switch back" onClick={() => onGo('garden')} aria-label={t.chapterUi.toGarden}>
                <IconSprout />
                <span className="map-side-label">{t.chapterUi.chipGarden}</span>
              </button>
            )
          }
          const c = chapterCopy(p)
          return (
            <button key={p} type="button" className="map-side-btn plot-switch" onClick={() => onGo(p)} aria-label={c.to}>
              {c.icon}
              <span className="map-side-label">{c.chip}</span>
            </button>
          )
        })}
      </>
    )
  }
  return (
    <>
      <button type="button" className="map-side-btn plot-switch" onClick={() => setOpen(true)} aria-label={t.plots.aria}>
        <IconMap />
        <span className="map-side-label">{t.plots.button}</span>
      </button>
      {sheet}
    </>
  )
}

function PlotSheet({ game, current, onGo, onClose }: { game: GameApi; current: Plot; onGo: (p: Plot) => void; onClose: () => void }) {
  useDismiss(onClose)
  const nextLocked = CHAPTERS.find((c) => !game.openChapters.includes(c.id))
  return (
    <div className="upgrade-hud-layer" role="presentation" onClick={onClose}>
      <div className="upgrade-hud plot-sheet" role="dialog" aria-modal="true" aria-labelledby="plots-title" onClick={(e) => e.stopPropagation()}>
        <header className="upgrade-hud-header">
          <div className="upgrade-hud-heading">
            <h2 id="plots-title">{t.plots.title}</h2>
          </div>
          <button type="button" className="upgrade-hud-close" onClick={onClose} aria-label={t.upgrade.close}>
            ×
          </button>
        </header>
        <ul className="plot-list">
          <li>
            <button type="button" className={`plot-row${current === 'garden' ? ' current' : ''}`} onClick={() => onGo('garden')}>
              <span className="plot-row-icon"><IconSprout /></span>
              <span className="plot-row-name">{t.plots.garden}</span>
            </button>
          </li>
          {CHAPTERS.filter((c) => game.openChapters.includes(c.id)).map((c) => {
            const copy = chapterCopy(c.id)
            return (
              <li key={c.id}>
                <button type="button" className={`plot-row${current === c.id ? ' current' : ''}`} onClick={() => onGo(c.id)}>
                  <span className="plot-row-icon">{copy.icon}</span>
                  <span className="plot-row-name">
                    {t.chapterUi.chapter(c.number)} · {copy.title}
                  </span>
                  <span className="plot-row-meta">{t.plots.open(copy.currency, formatAsh(game.state.chapters[c.id].cur))}</span>
                </button>
              </li>
            )
          })}
          {nextLocked ? (
            <li className="plot-row locked">
              <span className="plot-row-icon">{chapterCopy(nextLocked.id).icon}</span>
              <span className="plot-row-name">{chapterCopy(nextLocked.id).teaser}</span>
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  )
}
