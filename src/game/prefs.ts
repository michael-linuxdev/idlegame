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

/* —— More device prefs (UX pass): Vibration, große Schrift, ruhige Animationen —— */

export type BoolPref = 'haptics' | 'bigText' | 'calmMotion'

const BOOL_DEFAULTS: Record<BoolPref, boolean> = { haptics: true, bigText: false, calmMotion: false }

function prefKey(p: BoolPref) {
  return `gartenerbe-pref-${p}`
}

export function getPref(p: BoolPref): boolean {
  try {
    const v = localStorage.getItem(prefKey(p))
    return v == null ? BOOL_DEFAULTS[p] : v === '1'
  } catch {
    return BOOL_DEFAULTS[p]
  }
}

export function setPref(p: BoolPref, on: boolean): void {
  try {
    localStorage.setItem(prefKey(p), on ? '1' : '0')
  } catch {
    /* private mode */
  }
  applyPrefClasses()
  window.dispatchEvent(new Event(EVENT))
}

export function usePref(p: BoolPref): boolean {
  return useSyncExternalStore(subscribe, () => getPref(p), () => BOOL_DEFAULTS[p])
}

/** Mirror display prefs onto <html> so CSS can react (pref-big-text, pref-calm). */
export function applyPrefClasses(): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('pref-big-text', getPref('bigText'))
  root.classList.toggle('pref-calm', getPref('calmMotion'))
}

/** A tiny buzz on touch devices (Android; iOS ignores it). */
export function buzz(ms = 10): void {
  if (!getPref('haptics')) return
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* unsupported */
  }
}
