import { useEffect, useRef, useState } from 'react'
import {
  isIosSafari,
  isStandaloneDisplay,
  loadInstallPrefs,
  OFFLINE_NUDGE_MS,
  saveInstallPrefs,
  type InstallPrefs,
} from '../game/installPrompt'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface Props {
  /** ms away on this resume — show after ≥5 min offline return */
  offlineAwayMs: number
  offlineClaimed: boolean
}

export function InstallPrompt({ offlineAwayMs, offlineClaimed }: Props) {
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
  const [iosTip, setIosTip] = useState(false)
  const deferred = useRef<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const onBip = (e: Event) => {
      e.preventDefault()
      deferred.current = e as BeforeInstallPromptEvent
    }
    window.addEventListener('beforeinstallprompt', onBip)
    return () => window.removeEventListener('beforeinstallprompt', onBip)
  }, [])

  useEffect(() => {
    if (prefs.dismissed || prefs.installed || prefs.shown) return
    if (isStandaloneDisplay()) return

    const eligible = offlineAwayMs >= OFFLINE_NUDGE_MS || offlineClaimed
    if (!eligible) return

    const t = window.setTimeout(() => {
      setVisible(true)
      setIosTip(isIosSafari() && !deferred.current)
      setPrefs((prev) => {
        const next = { ...prev, shown: true }
        saveInstallPrefs(next)
        return next
      })
    }, 1800)
    return () => window.clearTimeout(t)
  }, [offlineAwayMs, offlineClaimed, prefs.dismissed, prefs.installed, prefs.shown])

  function dismiss() {
    const next = { ...prefs, dismissed: true }
    setPrefs(next)
    saveInstallPrefs(next)
    setVisible(false)
  }

  async function install() {
    const evt = deferred.current
    if (evt) {
      await evt.prompt()
      const choice = await evt.userChoice
      if (choice.outcome === 'accepted') {
        const next = { ...prefs, installed: true, dismissed: true }
        setPrefs(next)
        saveInstallPrefs(next)
        setVisible(false)
        return
      }
    }
    if (isIosSafari()) {
      setIosTip(true)
      return
    }
    dismiss()
  }

  if (!visible || prefs.dismissed || prefs.installed) return null

  return (
    <div className="install-prompt" role="status">
      <div className="install-prompt-inner">
        <p className="install-title">Add Orbital Claim home</p>
        {iosTip ? (
          <p className="install-body">
            On iPhone: tap Share, then <strong>Add to Home Screen</strong> for
            one-tap return while your drills keep running.
          </p>
        ) : (
          <p className="install-body">
            Install the PWA for faster reopen — offline Ore still accrues either
            way.
          </p>
        )}
        <div className="install-actions">
          {!iosTip ? (
            <button type="button" className="btn buy" onClick={() => void install()}>
              Install
            </button>
          ) : null}
          <button type="button" className="btn ghost" onClick={dismiss}>
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
