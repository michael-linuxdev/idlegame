import { CHAPTERS, laterProgressNeeded } from '../game/chapters'
import { collectionPercent, collectionRows, nearSets } from '../game/collections'
import { GENERATORS } from '../game/generators'
import { useDismiss } from '../game/overlays'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import { chapterCopy } from './chapterCopy'

type GameApi = ReturnType<typeof useGame>

/** Wann ein Kapitel aufgeht (Text zur Silhouette). */
function chapterCondition(number: number): string {
  if (number === 2) return t.collections.chapterFirst
  if (number === 3) return t.collections.chapterSecond
  if (number <= 12) return t.collections.chapterLater(number - 2, number - 1)
  const need = laterProgressNeeded(number)
  return t.collections.chapterLater13(Math.floor(need), need % 1 !== 0, number - 1)
}

/** Sammlung & Ziele: alles Gesammelte und alle Kapitel auf einer Seite. */
export function CollectionSheet({ game, onClose }: { game: GameApi; onClose: () => void }) {
  useDismiss(onClose)
  const { state } = game
  const rows = collectionRows(state)
  const pct = collectionPercent(rows)
  const near = nearSets(state.collection)
  return (
    <div className="upgrade-hud-layer project-layer" onClick={onClose}>
      <div className="upgrade-hud project-sheet collection-sheet" role="dialog" aria-labelledby="collection-title" onClick={(e) => e.stopPropagation()}>
        <header className="upgrade-hud-header">
          <h2 id="collection-title">{t.collections.title}</h2>
          <button type="button" className="upgrade-hud-close" onClick={onClose} aria-label={t.upgrade.close}>
            ×
          </button>
        </header>
        <p className="collection-total">{t.collections.total(pct)}</p>
        <ul className="collection-rows">
          {rows.map((r) => (
            <li key={r.key}>
              <span className="collection-name">{t.collections.rows[r.key]}</span>
              <span className="collection-count">
                {r.have}/{r.total}
              </span>
              <span className="collection-bar" aria-hidden="true">
                <span style={{ width: `${Math.round((r.have / Math.max(1, r.total)) * 100)}%` }} />
              </span>
            </li>
          ))}
        </ul>
        {near.length > 0 ? (
          <ul className="collection-near">
            {near.slice(0, 3).map((n) => (
              <li key={n.module}>{t.collections.nearSet(n.missing, GENERATORS.find((g) => g.id === n.module)?.name ?? n.module)}</li>
            ))}
          </ul>
        ) : null}

        <h3 className="subhead">{t.collections.chaptersTitle}</h3>
        <ul className="collection-chapters">
          {CHAPTERS.map((c) => {
            const open = game.openChapters.includes(c.id)
            const copy = chapterCopy(c.id)
            return (
              <li key={c.id} className={open ? 'open' : 'locked'}>
                <span className="collection-chapter-icon" aria-hidden="true">
                  {copy.icon}
                </span>
                <span className="collection-chapter-text">
                  <strong>
                    {t.chapterUi.chapter(c.number)} · {open ? copy.title : t.collections.unknown}
                  </strong>
                  <small>{open ? t.collections.chapterOpen : chapterCondition(c.number)}</small>
                </span>
              </li>
            )
          })}
          <li className="locked">
            <span className="collection-chapter-text">
              <small>{t.chapterUi.moreSoon}</small>
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
