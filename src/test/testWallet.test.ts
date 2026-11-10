import { beforeEach, describe, expect, it } from 'vitest'
import { SHOP_OFFERS } from '../game/monetization'
import {
  OFFER_PRICE_CENTS,
  TEST_MONTHLY_CENTS,
  TEST_START_CENTS,
  monthKey,
  offerPriceCents,
  pickTestAdSeconds,
  readWallet,
  spendTestMoney,
  walletLeftCents,
} from '../game/testWallet'
import { __setStringsForTest, type Strings } from '../i18n'
import { formatPrice } from '../game/format'
import { strings as de } from '../i18n/de/strings'
import { strings as en } from '../i18n/en/strings'

const KEY = 'gartenerbe-testgeld-v1'
const store = new Map<string, string>()
beforeEach(() => {
  store.clear()
  ;(globalThis as { localStorage?: unknown }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  }
})

const NOV = new Date(2026, 10, 9, 12).getTime()
const DEC = new Date(2026, 11, 1, 9).getTime()
const FEB = new Date(2027, 1, 1, 9).getTime()

describe('Testgeld (Testphase)', () => {
  it('jedes Echtgeld-Angebot hat einen Preis', () => {
    for (const o of SHOP_OFFERS) expect(offerPriceCents(o.id), o.id).toBeGreaterThan(0)
    expect(Object.keys(OFFER_PRICE_CENTS).sort()).toEqual(SHOP_OFFERS.map((o) => o.id).sort())
  })

  it('50 € zum Start, Käufe darüber hinaus werden abgelehnt', () => {
    expect(TEST_START_CENTS).toBe(5000)
    expect(walletLeftCents(readWallet(NOV))).toBe(5000)
    for (let i = 0; i < 7; i++) expect(spendTestMoney(699, NOV)).not.toBeNull()
    expect(walletLeftCents(readWallet(NOV))).toBe(5000 - 7 * 699)
    expect(spendTestMoney(699, NOV)).toBeNull()
  })

  it('am 1. jedes Monats +30 €, Rest sammelt sich an', () => {
    expect(TEST_MONTHLY_CENTS).toBe(3000)
    spendTestMoney(1999, NOV)
    const dec = readWallet(DEC)
    expect(dec.month).toBe(monthKey(DEC))
    expect(walletLeftCents(dec)).toBe(5000 - 1999 + 3000)
    // mehrmals lesen bucht nicht doppelt
    expect(walletLeftCents(readWallet(DEC))).toBe(5000 - 1999 + 3000)
    // Januar und Februar dazu
    expect(walletLeftCents(readWallet(FEB))).toBe(5000 - 1999 + 3 * 3000)
    expect(readWallet(FEB).totalCents).toBe(1999)
    expect(readWallet(FEB).purchases).toBe(1)
  })

  it('wer schon spielt (altes Format): Rest bleibt, dazu 50 €', () => {
    store.set(KEY, JSON.stringify({ month: monthKey(NOV), spentCents: 1993, totalCents: 1993, purchases: 8 }))
    const w = readWallet(NOV)
    expect(walletLeftCents(w)).toBe(5000 + 7)
    expect(w.totalCents).toBe(1993)
    expect(w.purchases).toBe(8)
    // nur einmal
    expect(walletLeftCents(readWallet(NOV))).toBe(5007)
    expect(walletLeftCents(readWallet(DEC))).toBe(5007 + 3000)
  })

  it('kaputter Speicher → Startguthaben', () => {
    store.set(KEY, '{kaputt')
    expect(walletLeftCents(readWallet(NOV))).toBe(TEST_START_CENTS)
  })

  it('Werbung dauert 30 oder 60 Sekunden', () => {
    expect(pickTestAdSeconds(0.1)).toBe(30)
    expect(pickTestAdSeconds(0.9)).toBe(60)
  })

  it('Preise je Sprache formatiert', () => {
    __setStringsForTest(de as unknown as Strings, 'de')
    expect(formatPrice(249)).toBe('2,49 €')
    __setStringsForTest(en, 'en')
    expect(formatPrice(249)).toBe('€2.49')
  })
})
