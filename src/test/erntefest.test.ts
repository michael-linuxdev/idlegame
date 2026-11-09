import { describe, expect, it } from 'vitest'
import { ERNTEFEST_MULT, erntefestStatus, erntefestWindowKey, isErntefestActive } from '../game/events'

const at = (y: number, m: number, d: number, h: number) => new Date(y, m - 1, d, h).getTime()

describe('Erntefest (Wochenende)', () => {
  it('Freitag ab 18 Uhr bis Sonntag', () => {
    expect(isErntefestActive(at(2026, 11, 6, 17))).toBe(false) // Freitag 17 Uhr
    expect(isErntefestActive(at(2026, 11, 6, 18))).toBe(true)
    expect(isErntefestActive(at(2026, 11, 8, 23))).toBe(true) // Sonntag
    expect(isErntefestActive(at(2026, 11, 9, 10))).toBe(false) // Montag
  })
  it('ein Fenster-Schlüssel je Wochenende (Freitag), Format ef-JJJJ-MM-TT', () => {
    const fri = erntefestWindowKey(at(2026, 11, 6, 20))
    expect(fri).toBe('ef-2026-11-06')
    expect(erntefestWindowKey(at(2026, 11, 7, 12))).toBe(fri)
    expect(erntefestWindowKey(at(2026, 11, 8, 12))).toBe(fri)
  })
  it('Bonus nur, wenn aktiv', () => {
    expect(erntefestStatus(at(2026, 11, 7, 12)).mult).toBe(ERNTEFEST_MULT)
    expect(erntefestStatus(at(2026, 11, 10, 12)).mult).toBe(1)
  })
})
