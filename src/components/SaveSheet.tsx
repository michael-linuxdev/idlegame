import { useMemo, useRef, useState } from 'react'
import { useDismiss } from '../game/overlays'
import { applyBundle, downloadBackup, exportCode, readCode } from '../game/backup'
import { t } from '../i18n'

interface Props {
  onClose: () => void
}

/** Spielstand sichern — export as code/file, import on a new device. */
export function SaveSheet({ onClose }: Props) {
  useDismiss(onClose)
  const code = useMemo(() => exportCode(), [])
  const [copied, setCopied] = useState(false)
  const [input, setInput] = useState('')
  const [armed, setArmed] = useState(false)
  const [error, setError] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const parsed = input.trim() ? readCode(input) : null

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  function onImport() {
    if (!parsed || !parsed.ok) {
      setError(true)
      return
    }
    if (!armed) {
      setArmed(true)
      window.setTimeout(() => setArmed(false), 4000)
      return
    }
    applyBundle(parsed.bundle)
  }

  return (
    <div className="notebook-layer" role="presentation" onClick={onClose}>
      <div
        className="notebook save-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="notebook-head">
          <h2 id="save-title" className="notebook-title">
            {t.backup.title}
          </h2>
          <button type="button" className="notebook-close" onClick={onClose} aria-label={t.backup.close}>
            ×
          </button>
        </header>
        <p className="notebook-intro">{t.backup.intro}</p>

        <h3>{t.backup.exportTitle}</h3>
        <textarea className="save-code" readOnly value={code} rows={3} aria-label={t.backup.codeAria} onFocus={(e) => e.currentTarget.select()} />
        <div className="save-actions">
          <button type="button" className="btn buy" onClick={copy}>
            {copied ? t.backup.copied : t.backup.copy}
          </button>
          <button type="button" className="btn ghost" onClick={() => downloadBackup(code)}>
            {t.backup.download}
          </button>
        </div>

        <h3>{t.backup.importTitle}</h3>
        <textarea
          className="save-code"
          rows={3}
          value={input}
          placeholder={t.backup.placeholder}
          aria-label={t.backup.importAria}
          onChange={(e) => {
            setInput(e.target.value)
            setError(false)
            setArmed(false)
          }}
        />
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.json,text/plain,application/json"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0]
            if (f) setInput(await f.text())
          }}
        />
        <div className="save-actions">
          <button type="button" className="btn ghost" onClick={() => fileRef.current?.click()}>
            {t.backup.pickFile}
          </button>
          <button type="button" className={`btn ${armed ? 'prestige' : 'buy'}`} onClick={onImport} disabled={!input.trim()}>
            {armed ? t.backup.confirm : t.backup.import}
          </button>
        </div>
        {error || (parsed && !parsed.ok) ? <p className="save-error" role="alert">{parsed && !parsed.ok && parsed.newer ? t.backup.newer : parsed && !parsed.ok && parsed.old ? t.backup.old : t.backup.invalid}</p> : null}
        {parsed && parsed.ok ? (
          <p className="save-ok">{t.backup.found(new Date(parsed.bundle.at).toLocaleString('de-DE'))}</p>
        ) : null}
      </div>
    </div>
  )
}
