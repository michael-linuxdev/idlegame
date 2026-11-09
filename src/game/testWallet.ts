/**
 * Testgeld für die Testphase: Echtgeld-Angebote im Markt kosten echte Preise
 * (docs/store/preise.md), bezahlt wird mit einem Testguthaben von 20 € pro
 * Kalendermonat. Es wird nichts abgebucht; jede Entscheidung landet im
 * Playtest-Log („test_purchase“), damit sich abschätzen lässt, wie viel Geld
 * tatsächlich ausgegeben würde.
 *
 * Dazu läuft die Bonus-Werbung in der Testphase so lange wie eine echte
 * (30 oder 60 Sekunden) und sperrt das Spiel währenddessen (AdOverlay.tsx).
 *
 * Nur aktiv, solange TEST_PHASE gilt und es noch keine echten Käufe gibt
 * (STORE_ENABLED). Das Guthaben liegt bewusst NICHT im Spielstand
 * (kein Fortschritt, keine Migration), sondern in einem eigenen Schlüssel.
 */
import { TEST_PHASE } from './distribution'
import { STORE_ENABLED } from './monetization'

export const TEST_WALLET_ENABLED = TEST_PHASE && !STORE_ENABLED

/** Testguthaben je Kalendermonat in Cent */
export const TEST_BUDGET_CENTS = 2000

/** Preise je Angebot in Cent (Vorschlag aus docs/store/preise.md) */
export const OFFER_PRICE_CENTS: Readonly<Record<string, number>> = {
  starterBundle: 199,
  samen50: 99,
  samen150: 249,
  samen500: 699,
  cosmeticPackLeaf: 299,
  removeAds: 399,
  gartenwochePlus: 199,
}

/** Bonus-Werbung in der Testphase: so lange sperrt sie das Spiel (Sekunden). */
export const TEST_AD_SECONDS = [30, 60] as const

const KEY = 'gartenerbe-testgeld-v1'

export interface WalletState {
  /** Kalendermonat YYYY-MM, für den `spentCents` gilt */
  month: string
  spentCents: number
  /** Über alle Monate */
  totalCents: number
  purchases: number
}

export function monthKey(now: number): string {
  const d = new Date(now)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function parse(raw: string | null, now: number): WalletState {
  const month = monthKey(now)
  const empty: WalletState = { month, spentCents: 0, totalCents: 0, purchases: 0 }
  if (!raw) return empty
  try {
    const v = JSON.parse(raw) as Partial<WalletState>
    const num = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) && x >= 0 ? Math.floor(x) : 0)
    const totalCents = num(v.totalCents)
    const purchases = num(v.purchases)
    // Neuer Monat: Guthaben wieder voll
    return { month, spentCents: v.month === month ? num(v.spentCents) : 0, totalCents, purchases }
  } catch {
    return empty
  }
}

export function readWallet(now = Date.now()): WalletState {
  try {
    return parse(localStorage.getItem(KEY), now)
  } catch {
    return parse(null, now)
  }
}

export function walletLeftCents(w: WalletState): number {
  return Math.max(0, TEST_BUDGET_CENTS - w.spentCents)
}

/** Bucht `cents` vom Testguthaben ab. Gibt das neue Guthaben zurück, oder null, wenn es nicht reicht. */
export function spendTestMoney(cents: number, now = Date.now()): WalletState | null {
  const w = readWallet(now)
  if (cents > walletLeftCents(w)) return null
  const next: WalletState = { month: w.month, spentCents: w.spentCents + cents, totalCents: w.totalCents + cents, purchases: w.purchases + 1 }
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* privater Modus: Kauf gilt trotzdem für diese Sitzung */
  }
  return next
}

export function offerPriceCents(offerId: string): number | null {
  return OFFER_PRICE_CENTS[offerId] ?? null
}

/** Länge der nächsten Test-Werbung (zufällig 30 oder 60 s). */
export function pickTestAdSeconds(rand = Math.random()): number {
  return rand < 0.5 ? TEST_AD_SECONDS[0] : TEST_AD_SECONDS[1]
}
