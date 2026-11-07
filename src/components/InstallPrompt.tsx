import { useEffect, useRef, useState } from 'react'
import {
  detectInstallMode,
  FIRST_LAUNCH_DELAY_MS,
  isStandaloneDisplay,
  loadInstallPrefs,
  saveInstallPrefs,
  type InstallMode,
  type InstallPrefs,
} from '../game/installPrompt'
import { t } from '../i18n'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface Props {
  /** True while early FTUE beats are on screen — hold the first-launch gate briefly */
  holdForFtue?: boolean
}

/**
 * First-launch install cue (mirrors einbuergerung.micana.de gate + skip).
 * Shows once; "Ohne Installation" dismisses permanently — play is never locked.
 */
export function InstallPrompt({ holdForFtue = false }: Props) {
  const [prefs, setPrefs] = useState<InstallPrefs>(() => {
    const loaded = loadInstallPrefs()
    if (isStandaloneDisplay()) {
      const next = { ...loaded, installed: true }
      saveInstallPrefs(next)
      return next
    }
    return loaded
  })
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<InstallMode>('manual')
  const [bipReady, setBipReady] = useState(false)
  const deferred = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const onBip = (e: Event) => {
      e.preventDefault()
      deferred.current = e as BeforeInstallPromptEvent
      setBipReady(true)
    }
    const onInstalled = () => {
      setPrefs((prev) => {
        const next = { ...prev, installed: true, dismissed: true, shown: true }
        saveInstallPrefs(next)
        return next
      })
      setVisible(false)
      deferred.current = null
    }
    window.addEventListener('beforeinstallprompt', onBip)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBip)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  useEffect(() => {
    if (prefs.dismissed || prefs.installed || prefs.shown) return
    if (isStandaloneDisplay()) return
    if (holdForFtue) return

    const timer = window.setTimeout(() => {
      const nextMode = detectInstallMode(Boolean(deferred.current))
      setMode(nextMode)
      setVisible(true)
      setPrefs((prev) => {
        const next = { ...prev, shown: true }
        saveInstallPrefs(next)
        return next
      })
    }, FIRST_LAUNCH_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [
    prefs.dismissed,
    prefs.installed,
    prefs.shown,
    holdForFtue,
    bipReady,
  ])

  function dismiss() {
    setPrefs((prev) => {
      const next = { ...prev, dismissed: true, shown: true }
      saveInstallPrefs(next)
      return next
    })
    setVisible(false)
  }

  async function install() {
    const evt = deferred.current
    if (evt) {
      try {
        await evt.prompt()
        const choice = await evt.userChoice
        deferred.current = null
        if (choice.outcome === 'accepted') {
          setPrefs((prev) => {
            const next = {
              ...prev,
              installed: true,
              dismissed: true,
              shown: true,
            }
            saveInstallPrefs(next)
            return next
          })
          setVisible(false)
          return
        }
        dismiss()
        return
      } catch {
        // fall through to tip
      }
    }
    if (mode === 'ios') return
    setMode('manual')
  }

  if (!visible || prefs.dismissed || prefs.installed) return null

  const body =
    mode === 'ios' ? (
      <>
        {t.install.iosBefore} <strong>{t.install.iosShare}</strong>{' '}
        {t.install.iosMid} <strong>{t.install.iosAdd}</strong>
        {t.install.iosAfter}
      </>
    ) : mode === 'android' ? (
      t.install.androidBody
    ) : (
      t.install.manualBody
    )

  return (
    <div
      className="install-gate"
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-gate-title"
    >
      <div className="install-gate-card">
        <p className="install-eyebrow">{t.brand}</p>
        <h2 id="install-gate-title" className="install-title">
          {t.install.title}
        </h2>
        <p className="install-body">{body}</p>
        <ul className="install-why">
          <li>{t.install.whyHome}</li>
          <li>{t.install.whyOffline}</li>
          <li>{t.install.whyFast}</li>
        </ul>
        <div className="install-actions">
          {mode === 'android' ? (
            <button
              type="button"
              className="btn buy"
              onClick={() => void install()}
            >
              {t.install.install}
            </button>
          ) : null}
          {mode === 'manual' ? (
            <button type="button" className="btn buy" onClick={dismiss}>
              {t.install.gotIt}
            </button>
          ) : null}
          {mode === 'ios' ? (
            <button type="button" className="btn buy" onClick={dismiss}>
              {t.install.gotIt}
            </button>
          ) : null}
        </div>
        <button type="button" className="install-skip" onClick={dismiss}>
          {t.install.skipBrowser}
        </button>
      </div>
    </div>
  )
}
