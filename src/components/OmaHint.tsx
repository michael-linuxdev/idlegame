import { useEffect } from 'react'
import type { HintId } from '../game/hints'
import { playSfx } from '../game/sound'
import { t } from '../i18n'

/** A small handwritten note from Oma, shown once per new system. */
export function OmaHint({ id, onOk }: { id: HintId; onOk: () => void }) {
  useEffect(() => {
    playSfx('letter')
  }, [id])
  return (
    <aside className="oma-hint" role="status" aria-live="polite">
      <p className="oma-hint-label">{t.hints.label}</p>
      <p className="oma-hint-text">{t.hints[id]}</p>
      <button type="button" className="btn buy oma-hint-ok" onClick={onOk}>
        {t.hints.ok}
      </button>
    </aside>
  )
}
