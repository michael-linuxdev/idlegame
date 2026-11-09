/**
 * Vollbild-Hinweis „Zuerst die App installieren“ — nur Web-Fassung auf
 * Handy/Tablet im Browser (siehe game/distribution.ts und game/installGate.ts).
 */
import { useEffect, useRef, useState } from 'react'
import { exportCode } from '../game/backup'
import { gateFromBrowser, skipGate, stepsKey } from '../game/installGate'
import { copyText } from '../game/saveFile'
import { t } from '../i18n'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const SHARE_ICON = (
  <svg className="web-install-share" viewBox="0 0 24 24" aria-label="Teilen" role="img">
    <path d="M12 3v12M8 7l4-4 4 4M5 12v8h14v-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function withShareIcon(text: string) {
  const parts = text.split('{S}')
  return parts.map((p, i) => (
    <span key={i}>
      {p}
      {i < parts.length - 1 ? SHARE_ICON : null}
    </span>
  ))
}

/** `hasProgress`: im Browser schon gespielt → Code zum Mitnehmen anbieten. */
export function InstallGate({ hasProgress }: { hasProgress: boolean }) {
  const [gate] = useState(gateFromBrowser)
  const [open, setOpen] = useState(gate.show)
  const [canNative, setCanNative] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const deferred = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (!open) return
    const onBip = (e: Event) => {
      e.preventDefault()
      deferred.current = e as BeforeInstallPromptEvent
      setCanNative(true)
    }
    const onInstalled = () => setOpen(false)
    window.addEventListener('beforeinstallprompt', onBip)
    window.addEventListener('appinstalled', onInstalled)
    document.documentElement.classList.add('web-install-open')
    return () => {
      window.removeEventListener('beforeinstallprompt', onBip)
      window.removeEventListener('appinstalled', onInstalled)
      document.documentElement.classList.remove('web-install-open')
    }
  }, [open])

  if (!open) return null

  const g = t.installGate
  const steps = g.steps[stepsKey(gate.os, gate.browser)] ?? g.steps['android-other']

  async function nativeInstall() {
    const evt = deferred.current
    if (!evt) return
    await evt.prompt()
    const r = await evt.userChoice
    deferred.current = null
    setCanNative(false)
    if (r.outcome === 'accepted') setOpen(false)
  }

  async function copy(text: string, ok: string) {
    setNote((await copyText(text)) ? ok : text)
  }

  return (
    <div className="web-install" role="dialog" aria-modal="true" aria-labelledby="web-install-title">
      <div className="web-install-in">
        <div className="web-install-top">
          <img src="./pwa-192.png" alt="" width={36} height={36} />
          <b>{t.brand}</b>
        </div>
        <h1 id="web-install-title">{g.title}</h1>

        <section className="web-install-card">
          <h2>{g.howTo}</h2>
          <p className="web-install-detected">{g.detected(g.os[gate.os] ?? '', g.browser[gate.browser] ?? '')}</p>
          {canNative ? (
            <button type="button" className="btn buy web-install-native" onClick={nativeInstall}>
              {g.nativeInstall}
            </button>
          ) : null}
          <ol className="web-install-steps">
            {steps.map((s, i) => (
              <li key={i}>{withShareIcon(s)}</li>
            ))}
          </ol>
          {gate.browser === 'inapp' || gate.browser === 'other' ? (
            <button type="button" className="btn ghost" onClick={() => copy(window.location.origin + window.location.pathname, g.urlCopied)}>
              {g.copyUrl}
            </button>
          ) : null}
        </section>

        <ul className="web-install-why">
          {g.why.map(([b, rest]) => (
            <li key={b}>
              <b>{b}</b>
              {rest}
            </li>
          ))}
        </ul>

        {gate.os === 'ios' && gate.browser !== 'inapp' ? <p className="web-install-warn">{g.iosWarning}</p> : null}

        {hasProgress ? (
          <section className="web-install-carry">
            <b>{g.carryTitle}</b>
            <p>{g.carryBody}</p>
            <button type="button" className="btn ghost" onClick={() => copy(exportCode(), g.carryCopied)}>
              {g.carryCopy}
            </button>
          </section>
        ) : null}

        {note ? (
          <p className="web-install-note" role="status">
            {note}
          </p>
        ) : null}

        <button
          type="button"
          className="web-install-skip"
          onClick={() => {
            skipGate()
            setOpen(false)
          }}
        >
          {g.skip}
        </button>
        <p className="web-install-skipnote">{g.skipNote}</p>
      </div>
    </div>
  )
}
