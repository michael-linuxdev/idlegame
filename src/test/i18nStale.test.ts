/**
 * Live language switch guard: no module may copy a text out of `t` at import
 * time. We import every game/component module in German, swap in a
 * pseudo-locale and look for German texts left behind in module exports.
 */
import { afterAll, describe, expect, it } from 'vitest'
import { __setStringsForTest, type Strings } from '../i18n'
import { strings as de } from '../i18n/de/strings'

const modules = {
  ...import.meta.glob('../game/**/*.ts', { eager: true }),
  ...import.meta.glob('../components/**/*.{ts,tsx}', { eager: true }),
  ...import.meta.glob('../theme/**/*.{ts,tsx}', { eager: true }),
  ...import.meta.glob('../App.tsx', { eager: true }),
}

function collectStrings(v: unknown, out: Set<string>, depth = 0): void {
  if (depth > 12 || v == null) return
  if (typeof v === 'string') {
    out.add(v)
    return
  }
  if (typeof v === 'function') {
    for (const [, val] of Object.entries(v)) collectStrings(val, out, depth + 1)
    return
  }
  if (Array.isArray(v)) {
    for (const x of v) collectStrings(x, out, depth + 1)
    return
  }
  if (typeof v === 'object') for (const val of Object.values(v as object)) collectStrings(val, out, depth + 1)
}

/** Wrap every text so we can tell a live read from a stale copy. */
function pseudo<T>(v: T): T {
  if (typeof v === 'string') return `⟪${v}⟫` as T
  if (typeof v === 'function') return ((...a: unknown[]) => pseudo((v as (...x: unknown[]) => unknown)(...a))) as T
  if (Array.isArray(v)) return v.map(pseudo) as T
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, pseudo(x)])) as T
  return v
}

describe('live language switch', () => {
  afterAll(() => __setStringsForTest(de as unknown as Strings, 'de'))

  it('keeps no German text captured at import time', () => {
    const german = new Set<string>()
    collectStrings(de, german)
    __setStringsForTest(pseudo(de) as unknown as Strings, 'en')
    const stale: string[] = []
    for (const [path, mod] of Object.entries(modules)) {
      if (path.includes('/i18n/')) continue
      // TODO(en, Paket 6): Datenschutz zieht in die Sprachdateien um
      if (path.endsWith('/theme/legal.ts')) continue
      for (const [name, val] of Object.entries(mod as object)) {
        const found = new Set<string>()
        collectStrings(val, found)
        for (const s of found) if (s.length >= 4 && german.has(s)) stale.push(`${path} ${name}: ${s}`)
      }
    }
    expect(stale).toEqual([])
  })
})
