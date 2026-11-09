import { beforeEach, describe, expect, it, vi } from 'vitest'
import { isChunkLoadError, reloadForNewVersion } from '../game/chunkReload'

describe('Neue Version: fehlendes Bündel → einmal neu laden', () => {
  const store = new Map<string, string>()
  const reload = vi.fn()
  beforeEach(() => {
    store.clear()
    reload.mockClear()
    ;(globalThis as { sessionStorage?: unknown }).sessionStorage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    }
    ;(globalThis as { window?: unknown }).window = { location: { reload } }
  })

  it('erkennt die Fehlermeldungen der Browser', () => {
    expect(isChunkLoadError(new TypeError('Importing a module script failed.'))).toBe(true)
    expect(isChunkLoadError(new TypeError('Failed to fetch dynamically imported module: https://x/a.js'))).toBe(true)
    expect(isChunkLoadError(new TypeError('error loading dynamically imported module'))).toBe(true)
    expect(isChunkLoadError(new Error('Cannot read properties of undefined'))).toBe(false)
  })

  it('lädt höchstens einmal je Minute neu', () => {
    expect(reloadForNewVersion(1_000_000)).toBe(true)
    expect(reloadForNewVersion(1_030_000)).toBe(false)
    expect(reloadForNewVersion(1_070_000)).toBe(true)
    expect(reload).toHaveBeenCalledTimes(2)
  })
})
