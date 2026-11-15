import { describe, expect, it } from 'vitest'
import { AD_BONUS_PER_DAY, COSMETICS, GARTENMONAT_FALLBACK_SAMEN, GARTENMONAT_MS, GARTENMONAT_RENEW_MS, SHOP_OFFERS, nextMonatStyle, shopOfferById } from '../game/monetization'
import {
  adBonusLeft,
  adFreeNow,
  buyCosmetic,
  equipCosmetic,
  claimGartenwocheTier,
  createInitialState,
  gartenmonatMsLeft,
  gartenmonatRenewable,
  gartenwochePremiumNow,
  mockBuyOffer,
  type GameState,
} from '../game/state'
import { parseSave, serializeSave } from '../game/storage'
import { OFFER_PRICE_CENTS } from '../game/testWallet'

/** Gartenmonat (30 Tage) ersetzt den Wochen-Pass der Gartenwoche. */
describe('Gartenmonat', () => {
  // Montag 10:00 — die Gartenwoche läuft bis Sonntag
  const now = new Date(2026, 10, 16, 10, 0, 0).getTime()
  const base: GameState = createInitialState(now)
  const offer = shopOfferById('gartenmonat')!

  it('is on sale instead of the weekly pass, for 4,99 €', () => {
    expect(offer.kind).toBe('gartenmonat')
    expect(SHOP_OFFERS.some((o) => o.kind === 'gartenwochePlus')).toBe(false)
    expect(OFFER_PRICE_CENTS.gartenmonat).toBe(499)
    // dauerhaft Werbefrei kostet mehr als ein Monat
    expect(OFFER_PRICE_CENTS.removeAds).toBeGreaterThan(OFFER_PRICE_CENTS.gartenmonat!)
  })

  it('runs 30 days: premium track and bonus without ads, nothing else', () => {
    const s = mockBuyOffer(base, offer, now)
    expect(gartenmonatMsLeft(s, now)).toBe(GARTENMONAT_MS)
    expect(adFreeNow(s, now)).toBe(true)
    expect(gartenwochePremiumNow(s, now)).toBe(true)
    // kein Dauer-Werbefrei, keine Samen, das Tageslimit der Boni gilt weiter
    expect(s.adsRemoved).toBe(false)
    expect(s.samen).toBe(base.samen)
    expect(adBonusLeft(s, now)).toBe(AD_BONUS_PER_DAY)
    // nach 30 Tagen vorbei
    const after = now + GARTENMONAT_MS + 1
    expect(adFreeNow(s, after)).toBe(false)
    expect(gartenwochePremiumNow(s, after)).toBe(false)
  })

  it('premium track pays every week of the month (the weekly pass ended with its week)', () => {
    let s = mockBuyOffer(base, offer, now)
    s = claimGartenwocheTier(s, 1, 'premium', now)
    expect(s.samen).toBe(base.samen + 20)
    // zwei Wochen später: neue Woche, Premium gilt weiter
    const later = now + 14 * 86_400_000
    const again = claimGartenwocheTier(s, 1, 'premium', later)
    expect(again.samen).toBe(s.samen + 20)
    // ohne Gartenmonat bleibt die Premium-Reihe zu
    expect(claimGartenwocheTier(base, 1, 'premium', now)).toBe(base)
  })

  it('brings the next monthly style each time — to keep, never for Samen; then Samen instead', () => {
    const monat = COSMETICS.filter((c) => c.monat)
    expect(monat).toHaveLength(12)
    let s = mockBuyOffer(base, offer, now)
    expect(s.ownedCosmetics).toContain(monat[0]!.id)
    expect(nextMonatStyle(s.ownedCosmetics)?.id).toBe(monat[1]!.id)
    // nicht für Samen zu haben
    const rich = { ...base, samen: 9999 }
    expect(buyCosmetic(rich, monat[0]!.id, now)).toBe(rich)
    // der Stil bleibt nach Ablauf und lässt sich anlegen
    const after = now + GARTENMONAT_MS + 1
    expect(equipCosmetic(s, monat[0]!.id, after).equippedCosmetic).toBe(monat[0]!.id)
    let t = now
    for (let i = 1; i < 12; i++) {
      t += GARTENMONAT_MS
      s = mockBuyOffer(s, offer, t)
      expect(s.ownedCosmetics, `Monat ${i + 1}`).toContain(monat[i]!.id)
    }
    expect(nextMonatStyle(s.ownedCosmetics)).toBeNull()
    expect(s.samen).toBe(base.samen)
    const more = mockBuyOffer(s, offer, t + GARTENMONAT_MS)
    expect(more.samen).toBe(base.samen + GARTENMONAT_FALLBACK_SAMEN)
  })

  it('can only be extended in the last week; the rest carries over', () => {
    const s = mockBuyOffer(base, offer, now)
    expect(gartenmonatRenewable(s, now)).toBe(false)
    expect(mockBuyOffer(s, offer, now)).toBe(s)
    const lastWeek = now + GARTENMONAT_MS - GARTENMONAT_RENEW_MS + 1000
    expect(gartenmonatRenewable(s, lastWeek)).toBe(true)
    const extended = mockBuyOffer(s, offer, lastWeek)
    expect(extended.gartenmonatExpiresAt).toBe(s.gartenmonatExpiresAt + GARTENMONAT_MS)
  })

  it('an old weekly pass keeps its premium track; saves keep the month', () => {
    const weekly = { ...base, gartenwochePremium: true }
    expect(gartenwochePremiumNow(weekly, now)).toBe(true)
    expect(claimGartenwocheTier(weekly, 1, 'premium', now).samen).toBe(base.samen + 20)
    const s = mockBuyOffer(base, offer, now)
    const raw = JSON.parse(serializeSave(s)) as Record<string, unknown>
    expect(parseSave(raw)!.gartenmonatExpiresAt).toBe(s.gartenmonatExpiresAt)
    delete raw.gartenmonatExpiresAt
    expect(parseSave(raw)!.gartenmonatExpiresAt).toBe(0)
  })
})
