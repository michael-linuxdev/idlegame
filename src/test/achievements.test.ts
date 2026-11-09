import { describe, expect, it } from 'vitest'
import { ACHIEVEMENTS, ACHIEVEMENT_IDS, isAchievementComplete } from '../game/achievements'
import { emptyOwned } from '../game/state'

const base = {
  totalUpgrades: 0,
  ernteLifetime: 0,
  claimedDailyOnce: false,
  claimedOfflineOnce: false,
  playerLevel: 1,
  saisonenden: 0,
  owned: emptyOwned(),
}

describe('Erfolge', () => {
  it('eindeutige IDs', () => {
    expect(new Set(ACHIEVEMENT_IDS).size).toBe(ACHIEVEMENTS.length)
  })
  it('am Anfang ist nichts erreicht', () => {
    for (const id of ACHIEVEMENT_IDS) expect(isAchievementComplete(id, base)).toBe(false)
  })
  it('Bedingungen greifen', () => {
    expect(isAchievementComplete('firstUpgrade', { ...base, totalUpgrades: 1 })).toBe(true)
    expect(isAchievementComplete('earn10k', { ...base, ernteLifetime: 10_000 })).toBe(true)
    expect(isAchievementComplete('prestigeOnce', { ...base, saisonenden: 1 })).toBe(true)
    const five = { ...emptyOwned(), gemuesebeet: 1, kompost: 1, kraeuterspirale: 1, beerenhecke: 1, obstwiese: 1 }
    expect(isAchievementComplete('fiveOnline', { ...base, owned: five })).toBe(true)
  })
})
