import { describe, expect, it } from 'vitest'
import { shouldShowTestNotice } from '../game/testPhase'

describe('Testphasen-Hinweis', () => {
  const base = { enabled: true, standalone: true, answered: false, webdriver: false, forced: false }
  it('erscheint einmal in der installierten App, solange die Testphase läuft', () => {
    expect(shouldShowTestNotice(base)).toBe(true)
    expect(shouldShowTestNotice({ ...base, answered: true })).toBe(false)
    expect(shouldShowTestNotice({ ...base, standalone: false })).toBe(false)
    expect(shouldShowTestNotice({ ...base, enabled: false })).toBe(false)
    expect(shouldShowTestNotice({ ...base, enabled: false, forced: true })).toBe(false)
  })
  it('in Tests nur mit ?testPhase=1', () => {
    expect(shouldShowTestNotice({ ...base, webdriver: true })).toBe(false)
    expect(shouldShowTestNotice({ ...base, webdriver: true, standalone: false, forced: true })).toBe(true)
  })
})
