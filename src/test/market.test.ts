import { describe, expect, it } from 'vitest'
import { AD_ERNTE_MINUTES, AD_SAMEN, MARKET_GIFT_SAMEN, REWARDED_AD_COOLDOWN_MS, WATER_REFILL_COST, WATER_REFILL_PER_DAY } from '../game/monetization'
import { TAP_COOLDOWN_MS } from '../game/economy'
import { buyTimeSkip, chapterPerSecond, claimMarketGift, claimRewardedAd, createInitialState, refillWateringCan, waterRefillsLeft } from '../game/state'
import { parseSave } from '../game/storage'
import { chapterDef } from '../game/chapters'

describe('Markt', () => {
  const now = 1_800_000_000_000
  const base = { ...createInitialState(now), owned: { ...createInitialState(now).owned, gemuesebeet: 30 }, samen: 10 }

  it('ad pays exactly what was picked', () => {
    const e = claimRewardedAd(base, 'ernte', now)
    expect(e.ok && e.ernteGained > 0 && e.state.ernte > base.ernte).toBe(true)
    const s = claimRewardedAd(base, 'samen', now)
    expect(s.ok && s.state.samen).toBe(10 + AD_SAMEN)
    expect(s.ok && s.state.ernte).toBe(base.ernte)
    if (s.ok) expect(claimRewardedAd(s.state, 'samen', now + 1000).ok).toBe(false)
    if (s.ok) expect(claimRewardedAd(s.state, 'samen', now + REWARDED_AD_COOLDOWN_MS).ok).toBe(true)
  })

  const withOrchard = () => {
    const area = chapterDef('obstwiese').areas[0].id
    const orchard = { ...base.chapters.obstwiese, openedAt: 1, cur: 5, owned: { [area]: 3 } }
    return { ...base, samen: 1000, chapters: { ...base.chapters, obstwiese: orchard } }
  }

  it('Ernte-Belohnung geht nur an den gewählten Garten', () => {
    const s = withOrchard()
    const rate = chapterPerSecond(s, 'obstwiese')
    expect(rate).toBeGreaterThan(0)
    const inOrchard = claimRewardedAd(s, 'ernte', now, 'obstwiese')
    expect(inOrchard.ok).toBe(true)
    if (inOrchard.ok) {
      expect(inOrchard.chapter).toBe('obstwiese')
      expect(inOrchard.ernteGained).toBeCloseTo(rate * AD_ERNTE_MINUTES * 60)
      expect(inOrchard.state.chapters.obstwiese.cur).toBeCloseTo(5 + rate * AD_ERNTE_MINUTES * 60)
      expect(inOrchard.state.ernte).toBe(s.ernte)
      expect(claimRewardedAd(inOrchard.state, 'ernte', now + 1000, 'obstwiese').ok).toBe(false)
    }
    const inGarden = claimRewardedAd(s, 'ernte', now)
    expect(inGarden.ok && inGarden.state.ernte > s.ernte).toBe(true)
    expect(inGarden.ok && inGarden.state.chapters.obstwiese.cur).toBe(5)
    // Geschlossenes Kapitel gewählt → Hauptgarten
    const closed = claimRewardedAd(s, 'ernte', now, 'weinberg')
    expect(closed.ok && closed.chapter).toBe(undefined)
    expect(closed.ok && closed.state.ernte > s.ernte).toBe(true)
    const k = claimRewardedAd(s, 'samen', now, 'obstwiese')
    expect(k.ok && k.state.chapters.obstwiese.cur).toBe(5)
  })

  it('Zeitsprung lässt auch offene Kapitel wachsen', () => {
    const s = withOrchard()
    const rate = chapterPerSecond(s, 'obstwiese')
    const after = buyTimeSkip(s, 'harvestHour', now)
    expect(after.samen).toBeLessThan(s.samen)
    expect(after.chapters.obstwiese.cur).toBeCloseTo(5 + rate * 3600)
  })

  it('Werbefrei: Belohnung bleibt (ohne Werbung), Abklingzeit auch', () => {
    const free = { ...base, adsRemoved: true }
    const s = claimRewardedAd(free, 'samen', now)
    expect(s.ok && s.state.samen).toBe(10 + AD_SAMEN)
    if (s.ok) expect(claimRewardedAd(s.state, 'samen', now + 1000).ok).toBe(false)
  })

  it('Tagesgeschenk once per day', () => {
    const a = claimMarketGift(base, now)
    expect(a.samen).toBe(10 + MARKET_GIFT_SAMEN)
    expect(claimMarketGift(a, now + 1000)).toBe(a)
    expect(claimMarketGift(a, now + 86_400_000).samen).toBe(10 + 2 * MARKET_GIFT_SAMEN)
  })

  it('Gießkanne auffüllen only while it refills', () => {
    expect(refillWateringCan({ ...base, lastTapAt: 0 }, now).samen).toBe(10)
    const r = refillWateringCan({ ...base, lastTapAt: now - 60_000 }, now)
    expect(r.samen).toBe(10 - WATER_REFILL_COST)
    expect(r.lastTapAt).toBe(0)
    expect(refillWateringCan({ ...base, lastTapAt: now - TAP_COOLDOWN_MS - 1 }, now).samen).toBe(10)
  })

  it('Gießkanne auffüllen höchstens 3× pro Tag', () => {
    let s = { ...base, samen: 100 }
    for (let i = 0; i < WATER_REFILL_PER_DAY; i++) {
      s = refillWateringCan({ ...s, lastTapAt: now - 1000 }, now + i)
      expect(s.lastTapAt).toBe(0)
    }
    expect(waterRefillsLeft(s, now)).toBe(0)
    const blocked = { ...s, lastTapAt: now - 1000 }
    expect(refillWateringCan(blocked, now + 10)).toBe(blocked)
    // nächster Tag: wieder 3
    expect(waterRefillsLeft(s, now + 86_400_000)).toBe(WATER_REFILL_PER_DAY)
    const tomorrow = now + 86_400_000
    expect(refillWateringCan({ ...s, lastTapAt: tomorrow - 1000 }, tomorrow).lastTapAt).toBe(0)
    // Spielstand behält den Zähler
    const back = parseSave(JSON.parse(JSON.stringify(s)))!
    expect(back.waterRefills).toBe(WATER_REFILL_PER_DAY)
    expect(back.waterRefillDay).toBe(s.waterRefillDay)
  })

  it('old saves load without a gift day', () => {
    const raw = JSON.parse(JSON.stringify(base)) as Record<string, unknown>
    delete raw.marketGiftDay
    expect(parseSave(raw)?.marketGiftDay).toBe('')
  })
})
