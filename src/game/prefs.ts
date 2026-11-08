/**
 * Per-device display preferences (localStorage, not part of the save).
 *  - Schilder immer zeigen: full plot signs on every planted area
 */
import { useSyncExternalStore } from 'react'

const SIGNS_KEY = 'gartenerbe-pref-signs'
const EVENT = 'gartenerbe-prefs'

export function signsAlways(): boolean {
  try {
    return localStorage.getItem(SIGNS_KEY) === '1'
  } catch {
    return false
  }
}

export function setSignsAlways(on: boolean): void {
  try {
    localStorage.setItem(SIGNS_KEY, on ? '1' : '0')
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new Event(EVENT))
}

function subscribe(cb: () => void): () => void {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}

/** Live value of „Schilder immer zeigen“. */
export function useSignsAlways(): boolean {
  return useSyncExternalStore(subscribe, signsAlways, () => false)
}
