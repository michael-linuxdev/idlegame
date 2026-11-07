import { useEffect, useRef, useState } from 'react'
import {
  detectInstallMode,
  isStandaloneDisplay,
  loadInstallPrefs,
  OFFLINE_NUDGE_MS,
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
  offlineAwayMs: number
  offlineClaimed: boolean
  /** True while early FTUE beats are on screen — hold the nudge */
  holdForFtue?: boolean
}

export function InstallPrompt({
  offlineAwayMs,
  offlineClaimed,
  holdForFtue = false,
}: Props) {
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

    const eligible = offlineAwayMs >= OFFLINE_NUDGE_MS || offlineClaimed
    if (!eligible) return

    const timer = window.setTimeout(() => {
      const nextMode = detectInstallMode(Boolean(deferred.current))
      setMode(nextMode)
      setVisible(true)
      setPrefs((prev) => {
        const next = { ...prev, shown: true }
        saveInstallPrefs(next)
        return next
      })
    }, 1600)
    return () => window.clearTimeout(timer)
  }, [
    offlineAwayMs,
    offlineClaimed,
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
            const next = { ...prev, installed: true, dismissed: true, shown: true }
            saveInstallPrefs(next)
            return next
          })
          setVisible(false)
          return
        }
        // Declined native sheet — persist dismiss so we do not spam
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
        {t.install.iosBefore} <strong>{t.install.iosShare}</strong> {t.install.iosMid}{' '}
        <strong>{t.install.iosAdd}</strong>
        {t.install.iosAfter}
      </>
    ) : mode === 'android' ? (
      t.install.androidBody
    ) : (
      t.install.manualBody
    )

  return (
    <div className="install-prompt" role="status">
      <div className="install-prompt-inner">
        <p className="install-eyebrow">{t.eyebrow}</p>
        <p className="install-title">{t.install.title}</p>
        <p className="install-body">{body}</p>
        <div className="install-actions">
          {mode === 'android' ? (
            <button type="button" className="btn buy" onClick={() => void install()}>
              {t.install.install}
            </button>
          ) : null}
          {mode === 'manual' ? (
            <button type="button" className="btn buy" onClick={dismiss}>
              {t.install.gotIt}
            </button>
          ) : null}
          <button type="button" className="btn ghost" onClick={dismiss}>
            {t.install.notNow}
          </button>
        </div>
      </div>
    </div>
  )
}
