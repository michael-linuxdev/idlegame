import { describe, expect, it } from 'vitest'
import { WATER_NOTIFY_AWAY_MS, WATER_NOTIFY_GAP_MS, waterReminderDelay } from '../game/extras'

describe('Gießkanne reminder', () => {
  const now = 1_000_000_000_000
  it('never pings on a quick app switch', () => {
    expect(waterReminderDelay(now, 0, 0)).toBe(WATER_NOTIFY_AWAY_MS)
  })
  it('waits for the can when it fills later', () => {
    expect(waterReminderDelay(now, 0, 2 * WATER_NOTIFY_AWAY_MS)).toBe(2 * WATER_NOTIFY_AWAY_MS)
  })
  it('at most one reminder every 4 hours', () => {
    expect(waterReminderDelay(now, now - 3600_000, 0)).toBe(WATER_NOTIFY_GAP_MS - 3600_000)
    expect(waterReminderDelay(now, now - WATER_NOTIFY_GAP_MS - 1, 0)).toBe(WATER_NOTIFY_AWAY_MS)
  })
})
