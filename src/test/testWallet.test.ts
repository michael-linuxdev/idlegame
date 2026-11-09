import { beforeEach, describe, expect, it } from 'vitest'
import { SHOP_OFFERS } from '../game/monetization'
import {
  OFFER_PRICE_CENTS,
  TEST_BUDGET_CENTS,
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

describe('Testgeld (Testphase)', () => {
  it('jedes Echtgeld-Angebot hat einen Preis', () => {
    for (const o of SHOP_OFFERS) expect(offerPriceCents(o.id), o.id).toBeGreaterThan(0)
    expect(Object.keys(OFFER_PRICE_CENTS).sort()).toEqual(SHOP_OFFERS.map((o) => o.id).sort())
  })

  it('20 € pro Monat, Käufe darüber hinaus werden abgelehnt', () => {
    expect(walletLeftCents(readWallet(NOV))).toBe(TEST_BUDGET_CENTS)
    expect(spendTestMoney(699, NOV)).not.toBeNull()
    expect(spendTestMoney(699, NOV)).not.toBeNull()
    expect(walletLeftCents(readWallet(NOV))).toBe(602)
    expect(spendTestMoney(699, NOV)).toBeNull()
    expect(walletLeftCents(readWallet(NOV))).toBe(602)
  })

  it('neuer Monat: Guthaben wieder voll, Gesamtsumme bleibt', () => {
    spendTestMoney(1999, NOV)
    const w = readWallet(DEC)
    expect(w.month).toBe(monthKey(DEC))
    expect(walletLeftCents(w)).toBe(TEST_BUDGET_CENTS)
    expect(w.totalCents).toBe(1999)
    expect(w.purchases).toBe(1)
  })

  it('kaputter Speicher → leeres Guthaben', () => {
    store.set('gartenerbe-testgeld-v1', '{kaputt')
    expect(walletLeftCents(readWallet(NOV))).toBe(TEST_BUDGET_CENTS)
  })

  it('Werbung dauert 30 oder 60 Sekunden', () => {
    expect(pickTestAdSeconds(0.1)).toBe(30)
    expect(pickTestAdSeconds(0.9)).toBe(60)
  })

  it('Preise je Sprache formatiert', () => {
    __setStringsForTest(de as unknown as Strings, 'de')
    expect(formatPrice(249)).toBe('2,49\u00a0€')
    __setStringsForTest(en, 'en')
    expect(formatPrice(249)).toBe('€2.49')
  })
})
