import { useState } from 'react'
import {
  clearPlaytestLog,
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

  function onExport() {
    exportPlaytestLog()
    setCount(getPlaytestEventCount())
  }

  function onClear() {
    clearPlaytestLog()
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
          <button
            type="button"
            role="menuitem"
            className="nav-menu-item playtest-action"
            onClick={onClear}
          >
            <span className="tab-label">{t.playtest.clear}</span>
          </button>
        </>
      ) : null}
    </div>
  )
}
