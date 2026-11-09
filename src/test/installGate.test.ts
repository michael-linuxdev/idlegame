import { describe, expect, it } from 'vitest'
import { detectPlatform, shouldShowGate, stepsKey } from '../game/installGate'
import { strings } from '../theme/strings'

const UA = {
  iphoneSafari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
  iphoneChrome: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/130.0 Mobile/15E148 Safari/604.1',
  whatsapp: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 WhatsApp/2.24',
  androidChrome: 'Mozilla/5.0 (Linux; Android 15; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36',
  samsung: 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/25.0 Chrome/121.0 Mobile Safari/537.36',
  ipadAsMac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
  desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
}

describe('Installations-Hinweis', () => {
  it('erkennt Gerät und Browser', () => {
    expect(detectPlatform(UA.iphoneSafari)).toEqual({ os: 'ios', browser: 'safari' })
    expect(detectPlatform(UA.iphoneChrome)).toEqual({ os: 'ios', browser: 'chrome' })
    expect(detectPlatform(UA.whatsapp).browser).toBe('inapp')
    expect(detectPlatform(UA.androidChrome)).toEqual({ os: 'android', browser: 'chrome' })
    expect(detectPlatform(UA.samsung)).toEqual({ os: 'android', browser: 'samsung' })
    expect(detectPlatform(UA.ipadAsMac, 5, 'MacIntel').os).toBe('ios')
    expect(detectPlatform(UA.desktop).os).toBe('desktop')
  })

  it('jede Anleitung existiert', () => {
    for (const [os, br] of [['ios', 'safari'], ['ios', 'chrome'], ['ios', 'opera'], ['android', 'samsung'], ['android', 'other'], ['ios', 'inapp']] as const) {
      expect(strings.installGate.steps[stepsKey(os, br)]?.length).toBeGreaterThan(0)
    }
  })

  it('nur im Handy-/Tablet-Browser der Web-Fassung, nicht installiert, nicht kurz nach „weiter“', () => {
    const base = { enabled: true, standalone: false, os: 'ios' as const, skipped: false, webdriver: false, forced: false }
    expect(shouldShowGate(base)).toBe(true)
    expect(shouldShowGate({ ...base, enabled: false })).toBe(false)
    expect(shouldShowGate({ ...base, standalone: true })).toBe(false)
    expect(shouldShowGate({ ...base, os: 'desktop' })).toBe(false)
    expect(shouldShowGate({ ...base, skipped: true })).toBe(false)
    // Tests/Screenshots nur mit ?installGate=1
    expect(shouldShowGate({ ...base, webdriver: true })).toBe(false)
    expect(shouldShowGate({ ...base, webdriver: true, forced: true })).toBe(true)
    // Store-Fassung: auch erzwungen nie
    expect(shouldShowGate({ ...base, enabled: false, forced: true })).toBe(false)
  })
})
