import { useEffect, useState } from 'react'
import { playSfx } from '../../game/sound'
import {
  NOTEBOOK_ENTRIES,
  type NotebookEntryId,
  type NotebookState,
} from '../../game/notebook'
import { t } from '../../i18n'

interface Props {
  notebook: NotebookState
  /** Open straight on this letter (e.g. a new one) */
  initialEntry?: NotebookEntryId | null
  onRead: (id: NotebookEntryId) => void
  onClose: () => void
}

function hintFor(def: (typeof NOTEBOOK_ENTRIES)[number]): string {
  if (def.deep != null) return t.notebook.lockedHintDeep
  if (def.year != null) return t.notebook.lockedHintYear(def.year)
  if (def.stage != null) return t.notebook.lockedHintStage(t.gardenStage.names[def.stage])
  return t.notebook.lockedEntry
}

/** Omas Notizbuch — a paper notebook with all letters found so far. */
export function NotebookSheet({ notebook, initialEntry, onRead, onClose }: Props) {
  const [open, setOpen] = useState<NotebookEntryId | null>(initialEntry ?? null)

  useEffect(() => {
    if (!open) return
    onRead(open)
    playSfx('letter')
  }, [open, onRead])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (open) setOpen(null)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const entry = open ? t.notebook.entries[open] : null

  return (
    <div className="notebook-layer" role="presentation" onClick={onClose}>
      <div
        className="notebook"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notebook-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="notebook-head">
          {open ? (
            <button type="button" className="notebook-back" onClick={() => setOpen(null)}>
              ‹ {t.notebook.title}
            </button>
          ) : (
            <h2 id="notebook-title" className="notebook-title">
              {t.notebook.title}
            </h2>
          )}
          <button type="button" className="notebook-close" onClick={onClose} aria-label={t.notebook.close}>
            ×
          </button>
        </header>

        {entry ? (
          <article className="notebook-letter" aria-live="polite">
            <h3 id={open ? 'notebook-title' : undefined}>{entry.title}</h3>
            <p>{entry.body}</p>
            <p className="notebook-signature">{t.notebook.signature}</p>
          </article>
        ) : (
          <>
            <p className="notebook-intro">{t.notebook.intro}</p>
            <ol className="notebook-pages">
              {NOTEBOOK_ENTRIES.map((def) => {
                const unlocked = notebook.unlocked.includes(def.id)
                const unread = unlocked && !notebook.read.includes(def.id) && def.id !== 'welcome'
                const copy = t.notebook.entries[def.id]
                return (
                  <li key={def.id}>
                    {unlocked ? (
                      <button
                        type="button"
                        className={`notebook-page${unread ? ' unread' : ''}`}
                        onClick={() => setOpen(def.id)}
                      >
                        <span className="notebook-page-title">{copy.title}</span>
                        <span className="notebook-page-snippet">{copy.body.slice(0, 64)}…</span>
                      </button>
                    ) : (
                      <div className="notebook-page locked" aria-label={t.notebook.lockedEntry}>
                        <span className="notebook-page-title">{t.notebook.lockedEntry}</span>
                        <span className="notebook-page-snippet">{hintFor(def)}</span>
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>
          </>
        )}
      </div>
    </div>
  )
}
