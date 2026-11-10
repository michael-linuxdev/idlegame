import { useEffect } from 'react'
import type { HintId } from '../game/hints'
import { playSfx } from '../game/sound'
import { t } from '../i18n'

/** Hints about things in the top HUD (goal strip, pills) sit right under it, with an arrow up. */
const TOP_HINTS: ReadonlySet<HintId> = new Set<HintId>(['season', 'truhe', 'deep', 'order'])

/** A small handwritten note from Oma, shown once per new system — next to what it explains. */
export function OmaHint({ id, onOk }: { id: HintId; onOk: () => void }) {
  useEffect(() => {
    playSfx('letter')
  }, [id])
  const top = TOP_HINTS.has(id)
  return (
    <aside className={`oma-hint ${top ? 'at-top' : 'at-bottom'}`} role="status" aria-live="polite">
      <p className="oma-hint-label">{t.hints.label}</p>
      <p className="oma-hint-text">{t.hints[id]}</p>
      <button type="button" className="btn buy oma-hint-ok" onClick={onOk}>
        {t.hints.ok}
      </button>
    </aside>
  )
}
