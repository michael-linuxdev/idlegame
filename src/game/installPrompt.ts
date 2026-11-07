/**
 * PWA install nudge — non-intrusive, dismissible, persisted.
 * Economy Day-1: after first offline return ≥5 min away.
 */

export const INSTALL_STORAGE_KEY = 'orbital-claim-install-v1'
export const OFFLINE_NUDGE_MS = 5 * 60 * 1000

export interface InstallPrefs {
  dismissed: boolean
  /** Already installed / standalone */
  installed: boolean
  /** Shown at least once */
  shown: boolean
}

export function loadInstallPrefs(): InstallPrefs {
  try {
    const raw =
      localStorage.getItem(INSTALL_STORAGE_KEY) ??
      localStorage.getItem('ash-dominion-install-v1')
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
    localStorage.removeItem('ash-dominion-install-v1')
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
  const chrome = /CriOS|Chrome|Firefox|EdgiOS/.test(ua)
  return iOS && webkit && !chrome
}
