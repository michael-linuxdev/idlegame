/**
 * PWA install nudge — Android beforeinstallprompt + iOS Share tip.
 * Non-spammy: shown once, dismiss persisted. Economy Day-1: after offline ≥5 min.
 */

export const INSTALL_STORAGE_KEY = 'orbit-rack-install-v1'
export const OFFLINE_NUDGE_MS = 5 * 60 * 1000

const LEGACY_INSTALL_KEYS = [
  'orbital-claim-install-v1',
  'ash-dominion-install-v1',
] as const

export interface InstallPrefs {
  dismissed: boolean
  installed: boolean
  /** Banner was shown at least once — never auto-resurface */
  shown: boolean
}

export function loadInstallPrefs(): InstallPrefs {
  try {
    let raw = localStorage.getItem(INSTALL_STORAGE_KEY)
    if (!raw) {
      for (const key of LEGACY_INSTALL_KEYS) {
        raw = localStorage.getItem(key)
        if (raw) break
      }
    }
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
    for (const key of LEGACY_INSTALL_KEYS) localStorage.removeItem(key)
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
