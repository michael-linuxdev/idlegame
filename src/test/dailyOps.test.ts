import { describe, expect, it } from 'vitest'
import { canClaimDaily, comebackScale, daysSinceClaim, isComebackClaim, nextStreakAfterClaim, previousDayKey } from '../game/dailyOps'
import { dayKey } from '../game/monetization'

const NOW = new Date(2026, 10, 9, 12).getTime()
const TODAY = dayKey(NOW)
const YESTERDAY = previousDayKey(TODAY)

describe('Tägliche Gartenrunde', () => {
  it('rechnet Kalendertage rückwärts', () => {
    expect(previousDayKey('2026-03-01')).toBe('2026-02-28')
    expect(daysSinceClaim(YESTERDAY, NOW)).toBe(1)
    expect(daysSinceClaim(previousDayKey(YESTERDAY), NOW)).toBe(2)
  })
  it('einmal pro Tag abholen', () => {
    expect(canClaimDaily(TODAY, NOW)).toBe(false)
    expect(canClaimDaily(YESTERDAY, NOW)).toBe(true)
    expect(canClaimDaily('', NOW)).toBe(true)
  })
  it('Serie wächst am Folgetag, friert bei Lücken ein (nie zurück auf 0)', () => {
    expect(nextStreakAfterClaim('', 0, NOW)).toBe(1)
    expect(nextStreakAfterClaim(YESTERDAY, 4, NOW)).toBe(5)
    expect(nextStreakAfterClaim('2026-01-01', 4, NOW)).toBe(4)
    expect(nextStreakAfterClaim(TODAY, 4, NOW)).toBe(4)
  })
  it('Rückkehr-Geschenk ab zwei Tagen Pause, größer bei längerer Pause', () => {
    expect(isComebackClaim(YESTERDAY, NOW)).toBe(false)
    expect(isComebackClaim(previousDayKey(YESTERDAY), NOW)).toBe(true)
    expect(comebackScale(5).samen).toBeGreaterThan(comebackScale(2).samen)
  })
})
