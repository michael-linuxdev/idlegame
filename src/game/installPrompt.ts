/**
 * PWA install nudge — first-launch gate (einbuergerung.micana.de pattern).
 * Android beforeinstallprompt + iOS Share tip. Dismiss persists; never blocks play forever.
 */

export const INSTALL_STORAGE_KEY = 'gartenerbe-install-v1'

/** Soft delay before first-launch cue — lets the shell paint. */
export const FIRST_LAUNCH_DELAY_MS = 700

export interface InstallPrefs {
  dismissed: boolean
  installed: boolean
  /** Banner/gate was shown at least once — never auto-resurface */
  shown: boolean
}

export function loadInstallPrefs(): InstallPrefs {
  try {
    const raw = localStorage.getItem(INSTALL_STORAGE_KEY)
    if (!raw) return { dismissed: false, installed: false, shown: false }
    const p = JSON.parse(raw) as Record<string, unknown>
    return {
      dismissed: p.dismissed === true,
      installed: p.installed === true,
      shown: p.shown === true,
    }
  } catch {
    return { dismissed: false, installed: false, shown: false }
  }
}

export function saveInstallPrefs(prefs: InstallPrefs): void {
  try {
    localStorage.setItem(INSTALL_STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // ignore
  }
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false
  const mq = window.matchMedia('(display-mode: standalone)').matches
  const ios =
    'standalone' in navigator &&
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  return mq || ios
}

export function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const webkit = /WebKit/.test(ua)
  const chrome = /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)
  return iOS && webkit && !chrome
}

export type InstallMode = 'android' | 'ios' | 'manual'

export function detectInstallMode(hasDeferredPrompt: boolean): InstallMode {
  if (hasDeferredPrompt) return 'android'
  if (isIosSafari()) return 'ios'
  return 'manual'
}
