/**
 * Hinweis beim ersten Start der installierten App während der Testphase:
 * Die Nutzung wird aufgezeichnet (Playtest-Log, nur auf dem Gerät).
 * Muss bestätigt werden; die Aufzeichnung ist per Häkchen abwählbar.
 */
import { useState } from 'react'
import { setPlaytestLogEnabled } from '../game/playtestLog'
import { saveTestConsent, testNoticeFromBrowser } from '../game/testPhase'
import { t } from '../i18n'

export function TestPhaseNotice() {
  const [open, setOpen] = useState(testNoticeFromBrowser)
  const [logging, setLogging] = useState(true)
  if (!open) return null
  const c = t.testPhase

  function confirm() {
    setPlaytestLogEnabled(logging)
    saveTestConsent(logging)
    setOpen(false)
  }

  return (
    <div className="test-phase-layer" role="presentation">
      <div className="test-phase" role="dialog" aria-modal="true" aria-labelledby="test-phase-title">
        <h2 id="test-phase-title">{c.title}</h2>
        <p>{c.intro}</p>
        <ul>
          {c.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <label className="test-phase-check">
          <input type="checkbox" checked={logging} onChange={(e) => setLogging(e.target.checked)} />
          <span>{c.checkbox}</span>
        </label>
        <p className="test-phase-later">{c.later}</p>
        <button type="button" className="btn buy test-phase-ok" onClick={confirm}>
          {c.confirm}
        </button>
      </div>
    </div>
  )
}
