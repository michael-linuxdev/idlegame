/**
 * Installations-Hinweis beim Start im Browser (Muster aus „einbuergerung“):
 * Auf Handy/Tablet im Browser erscheint bei jedem neuen Besuch ein
 * Vollbild-Hinweis „Zuerst die App installieren“ mit der passenden Anleitung.
 * „Im Browser weiter“ gilt 6 Stunden, danach kommt der Hinweis wieder.
 * Nie in der installierten App, nie am Computer, nie in der Store-Fassung
 * (siehe distribution.ts).
 */
import { webInstallGateEnabled } from './distribution'
import { isStandaloneDisplay } from './installPrompt'

export type GateOs = 'ios' | 'android' | 'desktop'
export type GateBrowser = 'safari' | 'chrome' | 'firefox' | 'edge' | 'samsung' | 'opera' | 'inapp' | 'other'

export const GATE_SKIP_KEY = 'gartenerbe-install-gate-skip'
export const GATE_SKIP_HOURS = 6

export function detectPlatform(ua: string, maxTouchPoints = 0, platform = ''): { os: GateOs; browser: GateBrowser } {
  const ios = /iPhone|iPad|iPod/.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1)
  const android = /Android/.test(ua)
  const inapp = /Instagram|FBAN|FBAV|Line\/|Telegram|WhatsApp|TikTok|; wv\)/i.test(ua)
  let browser: GateBrowser = 'other'
  if (inapp) browser = 'inapp'
  else if (ios)
    browser = /CriOS/.test(ua) ? 'chrome' : /FxiOS/.test(ua) ? 'firefox' : /EdgiOS/.test(ua) ? 'edge' : /Safari/.test(ua) ? 'safari' : 'other'
  else if (android)
    browser = /SamsungBrowser/.test(ua)
      ? 'samsung'
      : /Firefox/.test(ua)
        ? 'firefox'
        : /EdgA/.test(ua)
          ? 'edge'
          : /OPR|Opera/.test(ua)
            ? 'opera'
            : /Chrome/.test(ua)
              ? 'chrome'
              : 'other'
  return { os: ios ? 'ios' : android ? 'android' : 'desktop', browser }
}

/** Schlüssel für die passende Schritt-Anleitung in strings.ts (installGate.steps). */
export function stepsKey(os: GateOs, browser: GateBrowser): string {
  if (browser === 'inapp') return 'inapp'
  if (os === 'ios') return ['safari', 'chrome', 'firefox', 'edge'].includes(browser) ? `ios-${browser}` : 'ios-other'
  if (os === 'android') return ['chrome', 'samsung', 'firefox', 'edge', 'opera'].includes(browser) ? `android-${browser}` : 'android-other'
  return 'android-other'
}

export function gateSkippedRecently(now = Date.now()): boolean {
  try {
    const at = Number(localStorage.getItem(GATE_SKIP_KEY) ?? 0)
    return now - at < GATE_SKIP_HOURS * 3600_000
  } catch {
    return false
  }
}

export function skipGate(now = Date.now()): void {
  try {
    localStorage.setItem(GATE_SKIP_KEY, String(now))
  } catch {
    /* privater Modus */
  }
}

/**
 * Soll der Hinweis jetzt erscheinen? Automatisierte Browser (Tests,
 * Store-Screenshots) sehen ihn nur mit `?installGate=1`.
 */
export function shouldShowGate(opts: {
  enabled?: boolean
  standalone: boolean
  os: GateOs
  skipped: boolean
  webdriver: boolean
  forced: boolean
}): boolean {
  if (!(opts.enabled ?? webInstallGateEnabled())) return false
  if (opts.standalone || opts.os === 'desktop') return false
  if (opts.forced) return true
  if (opts.webdriver) return false
  return !opts.skipped
}

/** Alles aus dem echten Browser zusammentragen. */
export function gateFromBrowser(): { show: boolean; os: GateOs; browser: GateBrowser } {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return { show: false, os: 'desktop', browser: 'other' }
  const { os, browser } = detectPlatform(navigator.userAgent, navigator.maxTouchPoints, navigator.platform)
  const forced = new URLSearchParams(window.location.search).get('installGate') === '1'
  const show = shouldShowGate({
    standalone: isStandaloneDisplay(),
    os,
    skipped: gateSkippedRecently(),
    webdriver: navigator.webdriver === true,
    forced,
  })
  return { show, os, browser }
}
