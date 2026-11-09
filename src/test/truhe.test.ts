import { describe, expect, it } from 'vitest'
import {
  EMPTY_TRUHE,
  TRUHE_ITEMS,
  offlineCapsHours,
  prestigeMultiplier,
  prestigeStartErnte,
  prestigeStartErnteFloor,
  saatgutkisteMult,
  tapBonusSeconds,
  truheRankUnlockNeed,
} from '../game/truhe'
import { OFFLINE_HARD_HOURS, OFFLINE_SOFT_HOURS, TAP_BONUS_SECONDS } from '../game/economy'

describe('Omas Truhe', () => {
  it('jeder Gegenstand gehört zu einem Rang-Schlüssel und kostet mehr mit jedem Rang', () => {
    expect(TRUHE_ITEMS.map((i) => i.id).sort()).toEqual(Object.keys(EMPTY_TRUHE).sort())
    for (const item of TRUHE_ITEMS) {
      if (item.maxRank > 1) expect(item.cost(1)).toBeGreaterThanOrEqual(item.cost(0))
    }
  })
  it('ohne Ränge keine Boni', () => {
    expect(prestigeMultiplier(EMPTY_TRUHE)).toBe(1)
    expect(saatgutkisteMult(EMPTY_TRUHE)).toBe(1)
    expect(offlineCapsHours(EMPTY_TRUHE)).toEqual({ soft: OFFLINE_SOFT_HOURS, hard: OFFLINE_HARD_HOURS })
    expect(tapBonusSeconds(EMPTY_TRUHE)).toBe(TAP_BONUS_SECONDS)
    expect(prestigeStartErnte(EMPTY_TRUHE)).toBe(0)
  })
  it('Effekte wie im Text: Gartenschere +5 %, Saatgutkiste −2 %, Brause +15 s, Notgroschen +80', () => {
    expect(prestigeMultiplier({ ...EMPTY_TRUHE, gartenschere: 2 })).toBeCloseTo(1.1)
    expect(saatgutkisteMult({ ...EMPTY_TRUHE, saatgutkiste: 1 })).toBeCloseTo(0.98)
    expect(tapBonusSeconds({ ...EMPTY_TRUHE, messingBrause: 2 })).toBe(TAP_BONUS_SECONDS + 30)
    expect(prestigeStartErnte({ ...EMPTY_TRUHE, notgroschen: 3 })).toBe(240)
    expect(offlineCapsHours({ ...EMPTY_TRUHE, alteGiesskanne: 1 }).hard).toBe(OFFLINE_HARD_HOURS + 2)
  })
  it('Startvorrat reicht immer für den ersten Ausbau', () => {
    expect(prestigeStartErnteFloor(23)).toBeGreaterThan(23)
  })
  it('spätere Ränge brauchen mehr Fortschritt', () => {
    const item = TRUHE_ITEMS.find((i) => i.maxRank >= 3)!
    expect(truheRankUnlockNeed(item.id, 2, 0)).toBeGreaterThanOrEqual(truheRankUnlockNeed(item.id, 0, 0))
  })
})
