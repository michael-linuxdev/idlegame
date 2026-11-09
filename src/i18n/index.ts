/**
 * Locale entry. German (`de/`) is the source language and ships in the start
 * chunk; English (`en/`) is loaded on demand.
 *
 * Live switch: `t` is a proxy onto the active locale, so every read at render
 * time sees the current language. Data modules must therefore never copy a
 * text out of `t` at import time — they keep a getter or a function instead
 * (guarded by `src/test/i18nStale.test.ts`). Components re-render through
 * `useLocale()`, which the app root subscribes to.
 */
import { useSyncExternalStore } from 'react'
import { getLangPref, setLangPref } from '../game/prefs'
import { strings as de } from './de/strings'
import { LOCALES, type Locale, type Strings } from './types'

export type { Locale, Strings }
export { LOCALES }

let locale: Locale = 'de'
let current: Strings = de
const loaded: Partial<Record<Locale, Strings>> = { de }
const listeners = new Set<() => void>()

/** Active copy. Read it at render/call time — never cache sub-objects in module scope. */
export const t: Strings = new Proxy({} as Strings, {
  get: (_, key) => Reflect.get(current, key),
  has: (_, key) => Reflect.has(current, key),
  ownKeys: () => Reflect.ownKeys(current),
  getOwnPropertyDescriptor: (_, key) => {
    const d = Reflect.getOwnPropertyDescriptor(current, key)
    return d ? { ...d, configurable: true } : undefined
  },
})

export function getLocale(): Locale {
  return locale
}

/** BCP-47 tag for Intl formatters. */
export function localeTag(l: Locale = locale): string {
  return l === 'de' ? 'de-DE' : 'en-US'
}

function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v)
}

/** Browser language → `de*` is German, everything else English. */
export function browserLocale(langs: readonly string[] | undefined): Locale {
  const first = langs?.find((l) => typeof l === 'string' && l.length > 0)
  return first?.toLowerCase().startsWith('de') ? 'de' : 'en'
}

/**
 * Which language to start in: `?lang=` (tests / store screenshots), then the
 * player's stored choice, then the browser.
 */
export function detectLocale(): Locale {
  try {
    const q = new URLSearchParams(location.search).get('lang')
    if (isLocale(q)) return q
  } catch {
    /* no location (tests) */
  }
  const stored = getLangPref()
  if (isLocale(stored)) return stored
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
    return browserLocale(langs)
  } catch {
    return 'de'
  }
}

async function load(l: Locale): Promise<Strings> {
  const have = loaded[l]
  if (have) return have
  const mod = await import('./en/strings')
  loaded.en = mod.strings
  return mod.strings
}

function apply(l: Locale, s: Strings): void {
  locale = l
  current = s
  if (typeof document !== 'undefined') {
    document.documentElement.lang = l
    document.title = s.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', s.meta.description)
  }
  for (const fn of listeners) fn()
}

/** Switch language live. `persist` stores the choice on this device (not in the save). */
export async function setLocale(l: Locale, opts: { persist?: boolean } = {}): Promise<void> {
  const s = await load(l)
  if (opts.persist) setLangPref(l)
  apply(l, s)
}

/** Call once before the first render. */
export function initLocale(): Promise<void> {
  return setLocale(detectLocale()).catch(() => apply('de', de))
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Re-render on language change; returns the active locale. */
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, getLocale, getLocale)
}

/** Tests only: swap in arbitrary copy (e.g. a pseudo-locale) without loading a file. */
export function __setStringsForTest(s: Strings, l: Locale = locale): void {
  apply(l, s)
}
