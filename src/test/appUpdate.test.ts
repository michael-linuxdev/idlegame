import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  UPDATE_CHECK_EVERY_MS,
  UPDATE_CHECK_MIN_GAP_MS,
  applyUpdate,
  dismissUpdate,
  markUpdateReady,
  resetUpdateForTest,
  subscribeUpdate,
  updateBannerShown,
  updateReady,
  watchForUpdates,
} from '../game/appUpdate'
import { strings as de } from '../i18n/de/strings'
import { strings as en } from '../i18n/en/strings'

/** „Update verfügbar“: neue Version wartet auf „Jetzt aktualisieren“. */
describe('Update verfügbar', () => {
  // ohne Browser: Fenster und Dokument nachbauen (Zeitgeber, Sichtbarkeit)
  let doc: EventTarget & { visibilityState: string }
  beforeEach(() => {
    doc = Object.assign(new EventTarget(), { visibilityState: 'visible' })
    vi.stubGlobal('document', doc)
    vi.stubGlobal('window', globalThis)
  })
  afterEach(() => {
    resetUpdateForTest()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('shows once a new version is ready; „Später“ hides the banner, not the menu hint', () => {
    const seen = vi.fn()
    subscribeUpdate(seen)
    expect(updateReady()).toBe(false)
    expect(updateBannerShown()).toBe(false)
    markUpdateReady(() => {})
    expect(updateBannerShown()).toBe(true)
    expect(seen).toHaveBeenCalledTimes(1)
    dismissUpdate()
    expect(updateBannerShown()).toBe(false)
    expect(updateReady()).toBe(true)
    // dieselbe Version meldet sich nochmal: bleibt ausgeblendet
    markUpdateReady(() => {})
    expect(updateBannerShown()).toBe(false)
  })

  it('„Jetzt aktualisieren“ switches to the new version and reloads at the latest after 4 s', () => {
    vi.useFakeTimers()
    const swap = vi.fn()
    const reload = vi.fn()
    applyUpdate(reload)
    expect(reload).not.toHaveBeenCalled() // nichts bereit → nichts tun
    markUpdateReady(swap)
    applyUpdate(reload)
    expect(swap).toHaveBeenCalledTimes(1)
    expect(reload).not.toHaveBeenCalled()
    vi.advanceTimersByTime(4000)
    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('looks for a new version every 30 min and when the app comes back (not more often than every 10 min)', () => {
    vi.useFakeTimers()
    let clock = 0
    const update = vi.fn(() => Promise.resolve())
    const stop = watchForUpdates({ update } as unknown as ServiceWorkerRegistration, () => clock)
    clock = UPDATE_CHECK_EVERY_MS
    vi.advanceTimersByTime(UPDATE_CHECK_EVERY_MS)
    expect(update).toHaveBeenCalledTimes(1)
    // gleich danach zurück in die App: zu früh
    clock += 60_000
    doc.dispatchEvent(new Event('visibilitychange'))
    expect(update).toHaveBeenCalledTimes(1)
    clock += UPDATE_CHECK_MIN_GAP_MS
    doc.dispatchEvent(new Event('visibilitychange'))
    expect(update).toHaveBeenCalledTimes(2)
    stop()
    clock += UPDATE_CHECK_EVERY_MS
    vi.advanceTimersByTime(UPDATE_CHECK_EVERY_MS)
    doc.dispatchEvent(new Event('visibilitychange'))
    expect(update).toHaveBeenCalledTimes(2)
  })

  it('has its texts in both languages', () => {
    for (const s of [de, en]) {
      expect(s.appUpdate.available).toBeTruthy()
      expect(s.appUpdate.now).toBeTruthy()
      expect(s.appUpdate.later).toBeTruthy()
    }
  })
})
