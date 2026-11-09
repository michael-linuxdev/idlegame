import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getSaveBlock, setSaveBlock, subscribeSaveBlock } from '../game/saveGuard'

describe('Spielstand-Sperre', () => {
  it('meldet Änderungen; „neuerer Stand“ wird nie wieder aufgehoben', () => {
    const seen: unknown[] = []
    const off = subscribeSaveBlock((b) => seen.push(b))
    setSaveBlock('pending')
    setSaveBlock(null)
    expect(getSaveBlock()).toBeNull()
    setSaveBlock('newer')
    setSaveBlock(null)
    setSaveBlock('otherTab')
    expect(getSaveBlock()).toBe('newer')
    off()
    expect(seen).toEqual(['pending', null, 'newer'])
  })
})

/** Einfache Web-Locks-Nachbildung: eine Sperre, Warteschlange, release() gibt sie weiter. */
function fakeLocks(held: boolean) {
  const queue: ((lock: unknown) => unknown)[] = []
  return {
    release() {
      held = false
      const next = queue.shift()
      if (next) {
        held = true
        next({})
      }
    },
    request(_name: string, options: { ifAvailable?: boolean }, cb: (lock: unknown) => unknown) {
      if (!held) {
        held = true
        return Promise.resolve(cb({}))
      }
      if (options.ifAvailable) return Promise.resolve(cb(null))
      queue.push(cb)
      return new Promise(() => {})
    },
  }
}

describe('Spielstand-Sperre beim Start', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('freie Sperre: sofort speichern, kein Neuladen', async () => {
    const g = await import('../game/saveGuard')
    const reload = vi.fn()
    g.startSaveLock(fakeLocks(false), reload, () => 'stand')
    await vi.runAllTimersAsync()
    expect(g.getSaveBlock()).toBeNull()
    expect(reload).not.toHaveBeenCalled()
  })

  it('Neuladen (alte Seite gibt die Sperre gleich frei, Stand unverändert): kein zweites Neuladen, kein Hinweis', async () => {
    const g = await import('../game/saveGuard')
    const locks = fakeLocks(true)
    const reload = vi.fn()
    g.startSaveLock(locks, reload, () => 'stand')
    await vi.advanceTimersByTimeAsync(50)
    expect(g.getSaveBlock()).toBe('pending')
    locks.release()
    await vi.runAllTimersAsync()
    expect(g.getSaveBlock()).toBeNull()
    expect(reload).not.toHaveBeenCalled()
  })

  it('anderes Fenster: Hinweis nach kurzer Zeit; hat es gespeichert, lädt diese Seite danach neu', async () => {
    const g = await import('../game/saveGuard')
    const locks = fakeLocks(true)
    const reload = vi.fn()
    let stored = 'alt'
    g.startSaveLock(locks, reload, () => stored)
    await vi.advanceTimersByTimeAsync(g.OTHER_TAB_GRACE_MS + 10)
    expect(g.getSaveBlock()).toBe('otherTab')
    stored = 'neu'
    locks.release()
    await vi.runAllTimersAsync()
    expect(reload).toHaveBeenCalledTimes(1)
    expect(g.getSaveBlock()).toBe('otherTab')
  })

  it('anderes Fenster ohne Änderung: übernimmt ohne Neuladen', async () => {
    const g = await import('../game/saveGuard')
    const locks = fakeLocks(true)
    const reload = vi.fn()
    g.startSaveLock(locks, reload, () => 'stand')
    await vi.advanceTimersByTimeAsync(g.OTHER_TAB_GRACE_MS + 10)
    expect(g.getSaveBlock()).toBe('otherTab')
    locks.release()
    await vi.runAllTimersAsync()
    expect(g.getSaveBlock()).toBeNull()
    expect(reload).not.toHaveBeenCalled()
  })
})
