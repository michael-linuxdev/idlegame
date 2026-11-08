import { useEffect, useState } from 'react'
import {
  clearPlaytestLog,
  copyPlaytestLog,
  exportPlaytestLog,
  getPlaytestEventCount,
  isPlaytestLogEnabled,
  setPlaytestLogEnabled,
} from '../game/playtestLog'
import { t } from '../i18n'

/** Compact Menü controls — opt-in local playtest log only. */
export function PlaytestLogControls() {
  const [on, setOn] = useState(() => isPlaytestLogEnabled())
  const [count, setCount] = useState(() => getPlaytestEventCount())

  function toggle() {
    const next = !on
    setPlaytestLogEnabled(next)
    setOn(next)
    setCount(getPlaytestEventCount())
  }

  // Kurze Rückmeldung nach Export/Kopieren
  const [note, setNote] = useState<string | null>(null)
  useEffect(() => {
    if (!note) return
    const id = window.setTimeout(() => setNote(null), 3000)
    return () => window.clearTimeout(id)
  }, [note])

  async function onExport() {
    const r = await exportPlaytestLog()
    setCount(getPlaytestEventCount())
    if (r === 'failed') setNote(t.playtest.failed)
    else if (r !== 'cancelled') setNote(t.playtest.saved)
  }

  async function onCopy() {
    const ok = await copyPlaytestLog()
    setNote(ok ? t.playtest.copied : t.playtest.failed)
  }

  // Two taps: first asks, second (within 4 s) really clears the log
  const [confirmClear, setConfirmClear] = useState(false)
  useEffect(() => {
    if (!confirmClear) return
    const id = window.setTimeout(() => setConfirmClear(false), 4000)
    return () => window.clearTimeout(id)
  }, [confirmClear])

  function onClear() {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    clearPlaytestLog()
    setConfirmClear(false)
    setCount(getPlaytestEventCount())
  }

  return (
    <div className="nav-menu-playtest" role="group" aria-label={t.playtest.title}>
      <button
        type="button"
        role="menuitemcheckbox"
        className={`nav-menu-item playtest-toggle${on ? ' active' : ''}`}
        aria-checked={on}
        onClick={toggle}
      >
        <span className="tab-label">
          {t.playtest.title}
          <span className="playtest-state">
            {on ? t.playtest.on : t.playtest.off}
          </span>
        </span>
      </button>
      {on ? (
        <>
          <button
            type="button"
            role="menuitem"
            className="nav-menu-item playtest-action"
            onClick={onExport}
          >
            <span className="tab-label">
              {t.playtest.export}
              {count > 0 ? (
                <span className="playtest-count">{count}</span>
              ) : null}
            </span>
          </button>
          <button type="button" role="menuitem" className="nav-menu-item playtest-action" onClick={onCopy}>
            <span className="tab-label">{t.playtest.copy}</span>
          </button>
          {note ? (
            <p className="playtest-note" role="status" aria-live="polite">
              {note}
            </p>
          ) : null}
          <button
            type="button"
            role="menuitem"
            className={`nav-menu-item playtest-action playtest-clear${confirmClear ? ' confirm' : ''}`}
            onClick={onClear}
          >
            <span className="tab-label">{confirmClear ? t.playtest.clearConfirm : t.playtest.clear}</span>
          </button>
        </>
      ) : null}
    </div>
  )
}
