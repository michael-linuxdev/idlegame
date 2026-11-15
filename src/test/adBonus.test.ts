import { describe, expect, it } from 'vitest'
import { AD_BONUS_PER_DAY, OFFLINE_DOUBLE_MIN_AWAY_MS, REWARDED_AD_COOLDOWN_MS } from '../game/monetization'
import { adBonusLeft, claimOfflineDouble, claimRewardedAd, createInitialState, offlineDoubleReady, type GameState } from '../game/state'
import { parseSave, serializeSave } from '../game/storage'

/** Tageslimit der Boni (Markt-Bonus + verdoppelter Korb) und Korb verdoppeln im Willkommens-Zettel. */
describe('Bonus: Tageslimit und Korb verdoppeln', () => {
  // 10:00 Ortszeit, damit acht Abklingzeiten im selben Kalendertag liegen
  const now = new Date(2026, 10, 16, 10, 0, 0).getTime()
  const init = createInitialState(now)
  const base: GameState = { ...init, owned: { ...init.owned, gemuesebeet: 30 }, saisonenden: 2 }

  it(`Markt-Bonus: höchstens ${AD_BONUS_PER_DAY} am Tag, auch mit Werbefrei`, () => {
    let s: GameState = { ...base, adsRemoved: true }
    let t = now
    for (let i = 0; i < AD_BONUS_PER_DAY; i++) {
      const r = claimRewardedAd(s, 'ernte', t)
      expect(r.ok, `Bonus ${i + 1}`).toBe(true)
      if (r.ok) s = r.state
      t += REWARDED_AD_COOLDOWN_MS
    }
    expect(adBonusLeft(s, t)).toBe(0)
    const over = claimRewardedAd(s, 'ernte', t)
    expect(over.ok).toBe(false)
    if (!over.ok) expect(over.reason).toBe('limit')
    // am nächsten Tag wieder voll
    const tomorrow = t + 24 * 3600_000
    expect(adBonusLeft(s, tomorrow)).toBe(AD_BONUS_PER_DAY)
    expect(claimRewardedAd(s, 'ernte', tomorrow).ok).toBe(true)
  })

  it('Korb verdoppeln: dieselbe Menge noch einmal, zählt als Bonus, ohne Markt-Abklingzeit', () => {
    const s = claimOfflineDouble(base, 5000, now)
    expect(s.ernte).toBe(base.ernte + 5000)
    expect(s.ernteSeason).toBe(base.ernteSeason + 5000)
    expect(s.ernteLifetime).toBe(base.ernteLifetime + 5000)
    expect(adBonusLeft(s, now)).toBe(AD_BONUS_PER_DAY - 1)
    expect(s.lastRewardedAdAt).toBe(base.lastRewardedAdAt)
    expect(claimRewardedAd(s, 'ernte', now).ok).toBe(true)
    // nichts ohne Korb, nichts über dem Tageslimit
    expect(claimOfflineDouble(base, 0, now)).toBe(base)
    expect(claimOfflineDouble(base, Number.NaN, now)).toBe(base)
    const full = { ...base, werbeBonusDay: s.werbeBonusDay, werbeBoni: AD_BONUS_PER_DAY }
    expect(claimOfflineDouble(full, 5000, now)).toBe(full)
  })

  it('Angebot im Zettel: erst nach 30 min, nicht in der ersten Saison, nicht über dem Limit', () => {
    expect(offlineDoubleReady(base, 5000, OFFLINE_DOUBLE_MIN_AWAY_MS, now)).toBe(true)
    expect(offlineDoubleReady(base, 5000, OFFLINE_DOUBLE_MIN_AWAY_MS - 1, now)).toBe(false)
    expect(offlineDoubleReady(base, 0, 3600_000, now)).toBe(false)
    expect(offlineDoubleReady({ ...base, saisonenden: 0 }, 5000, 3600_000, now)).toBe(false)
    expect(offlineDoubleReady({ ...base, saisonenden: 0, tiefeWinter: 1 }, 5000, 3600_000, now)).toBe(true)
    const s = claimOfflineDouble(base, 5000, now)
    expect(offlineDoubleReady({ ...s, werbeBoni: AD_BONUS_PER_DAY }, 5000, 3600_000, now)).toBe(false)
  })

  it('Zähler übersteht Speichern/Laden; alte Stände starten bei 0', () => {
    const s = claimOfflineDouble(base, 5000, now)
    const back = parseSave(JSON.parse(serializeSave(s)))!
    expect(back.werbeBonusDay).toBe(s.werbeBonusDay)
    expect(back.werbeBoni).toBe(1)
    const old = JSON.parse(serializeSave(s)) as Record<string, unknown>
    delete old.werbeBonusDay
    delete old.werbeBoni
    const fromOld = parseSave(old)!
    expect(fromOld.werbeBonusDay).toBe('')
    expect(fromOld.werbeBoni).toBe(0)
    expect(adBonusLeft(fromOld, now)).toBe(AD_BONUS_PER_DAY)
  })
})
