import { describe, expect, it } from 'vitest'
import { outOfQuietHours, planReminder, pruneSent } from '../game/notify'
import { WATER_NOTIFY_AWAY_MS, WATER_NOTIFY_GAP_MS } from '../game/extras'

const at = (h: number, m = 0, day = 9) => new Date(2026, 10, day, h, m).getTime()

describe('Erinnerungen', () => {
  it('nie nachts: 22–8 Uhr wird auf 8 Uhr verschoben', () => {
    expect(outOfQuietHours(at(14))).toBe(at(14))
    expect(new Date(outOfQuietHours(at(23))).getHours()).toBe(8)
    expect(new Date(outOfQuietHours(at(23))).getDate()).toBe(10)
    expect(outOfQuietHours(at(3))).toBe(at(8))
  })

  it('frühestens 30 min nach dem Verlassen, das früheste Ereignis gewinnt', () => {
    const now = at(10)
    const p = planReminder(now, [
      { kind: 'water', inMs: 60_000 },
      { kind: 'cross', inMs: 2 * 3600_000 },
    ], [])
    expect(p).toEqual({ kind: 'water', delay: WATER_NOTIFY_AWAY_MS })
  })

  it('mindestens 4 h Abstand und höchstens 2 pro Tag', () => {
    const now = at(10)
    const gap = planReminder(now, [{ kind: 'water', inMs: 0 }], [at(9)])!
    expect(now + gap.delay).toBe(at(9) + WATER_NOTIFY_GAP_MS)
    // schon 2 heute → erst morgen um 8
    const p = planReminder(at(18), [{ kind: 'basket', inMs: 0 }], [at(9), at(13, 30)])!
    expect(new Date(at(18) + p.delay).getDate()).toBe(10)
    expect(new Date(at(18) + p.delay).getHours()).toBe(8)
  })

  it('alte Zeitstempel fallen weg', () => {
    expect(pruneSent([at(9, 0, 1), at(9)], at(10))).toEqual([at(9)])
  })
})
