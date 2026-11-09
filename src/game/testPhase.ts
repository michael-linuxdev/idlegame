/**
 * Testphasen-Hinweis: einmal beim ersten Start der installierten App
 * bestätigen, dass die Nutzung aufgezeichnet wird (abwählbar).
 * Schalter: TEST_PHASE in distribution.ts.
 */
import { TEST_PHASE } from './distribution'
import { isStandaloneDisplay } from './installPrompt'

export const TEST_CONSENT_KEY = 'gartenerbe-testphase-v1'

export interface TestConsent {
  at: number
  logging: boolean
}

export function loadTestConsent(): TestConsent | null {
  try {
    const raw = localStorage.getItem(TEST_CONSENT_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as Partial<TestConsent>
    return typeof p.at === 'number' ? { at: p.at, logging: p.logging === true } : null
  } catch {
    return null
  }
}

export function saveTestConsent(logging: boolean, now = Date.now()): void {
  try {
    localStorage.setItem(TEST_CONSENT_KEY, JSON.stringify({ at: now, logging }))
  } catch {
    /* privater Modus */
  }
}

/** Automatisierte Browser sehen den Hinweis nur mit `?testPhase=1`. */
export function shouldShowTestNotice(opts: {
  enabled?: boolean
  standalone: boolean
  answered: boolean
  webdriver: boolean
  forced: boolean
}): boolean {
  if (!(opts.enabled ?? TEST_PHASE)) return false
  if (opts.answered) return false
  if (opts.forced) return true
  if (opts.webdriver) return false
  return opts.standalone
}

export function testNoticeFromBrowser(): boolean {
  if (typeof window === 'undefined') return false
  return shouldShowTestNotice({
    standalone: isStandaloneDisplay(),
    answered: loadTestConsent() !== null,
    webdriver: navigator.webdriver === true,
    forced: new URLSearchParams(window.location.search).get('testPhase') === '1',
  })
}
