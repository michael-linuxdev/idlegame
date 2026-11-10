/**
 * Testgeld für die Testphase: Echtgeld-Angebote im Markt kosten echte Preise
 * (docs/store/preise.md), bezahlt wird mit Testguthaben (50 € Start, +30 € am
 * 1. jedes Monats). Es wird nichts abgebucht; jede Entscheidung landet im
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

/**
 * Testguthaben (seit 2026-11-10): 50 € zum Start — auch für alle, die schon
 * spielen (ihr Rest aus dem alten Monatsguthaben bleibt dazu) — und weitere
 * 30 € am 1. jedes Monats. Nicht Verbrauchtes sammelt sich an.
 */
export const TEST_START_CENTS = 5000
export const TEST_MONTHLY_CENTS = 3000
/** Altes Modell (bis 2026-11-10): 20 € je Kalendermonat, verfiel am Monatsende */
const OLD_MONTHLY_CENTS = 2000

/** Preise je Angebot in Cent (Vorschlag aus docs/store/preise.md) */
export const OFFER_PRICE_CENTS: Readonly<Record<string, number>> = {
  starterBundle: 199,
  samen50: 99,
  samen150: 249,
  samen500: 699,
  cosmeticPackLeaf: 299,
  removeAds: 399,
  gartenwochePlus: 199,
  festPlus: 399,
}

/** Bonus-Werbung in der Testphase: so lange sperrt sie das Spiel (Sekunden). */
export const TEST_AD_SECONDS = [30, 60] as const

const KEY = 'gartenerbe-testgeld-v1'

export interface WalletState {
  /** Monat YYYY-MM, bis zu dem die Monats-Aufladungen schon gutgeschrieben sind */
  month: string
  /** Verfügbares Testgeld in Cent */
  balanceCents: number
  /** Über alle Monate ausgegeben */
  totalCents: number
  purchases: number
}

export function monthKey(now: number): string {
  const d = new Date(now)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** Ganze Monatswechsel von `from` bis `to` (YYYY-MM). */
function monthsBetween(from: string, to: string): number {
  const [fy, fm] = from.split('-').map(Number)
  const [ty, tm] = to.split('-').map(Number)
  if (!fy || !fm || !ty || !tm) return 0
  return Math.max(0, (ty - fy) * 12 + (tm - fm))
}

/** Gelesenes Guthaben + ob es neu gespeichert werden sollte (Start, altes Format). */
function parse(raw: string | null, now: number): { wallet: WalletState; save: boolean } {
  const month = monthKey(now)
  const fresh: WalletState = { month, balanceCents: TEST_START_CENTS, totalCents: 0, purchases: 0 }
  if (!raw) return { wallet: fresh, save: true }
  try {
    const v = JSON.parse(raw) as Record<string, unknown>
    const num = (x: unknown) => (typeof x === 'number' && Number.isFinite(x) && x >= 0 ? Math.floor(x) : 0)
    const totalCents = num(v.totalCents)
    const purchases = num(v.purchases)
    if (v.v === 2 && typeof v.month === 'string') {
      const balanceCents = num(v.balanceCents) + monthsBetween(v.month, month) * TEST_MONTHLY_CENTS
      return { wallet: { month, balanceCents, totalCents, purchases }, save: v.month !== month }
    }
    // Altes Format { month, spentCents }: Rest dieses Monats bleibt, dazu die 50 € Start
    const oldLeft = v.month === month ? Math.max(0, OLD_MONTHLY_CENTS - num(v.spentCents)) : OLD_MONTHLY_CENTS
    return { wallet: { month, balanceCents: TEST_START_CENTS + oldLeft, totalCents, purchases }, save: true }
  } catch {
    return { wallet: fresh, save: true }
  }
}

function store(w: WalletState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: 2, ...w }))
  } catch {
    /* privater Modus: gilt trotzdem für diese Sitzung */
  }
}

export function readWallet(now = Date.now()): WalletState {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY)
  } catch {
    return parse(null, now).wallet
  }
  const { wallet, save } = parse(raw, now)
  // Startguthaben und Aufladungen festhalten, damit sie genau einmal zählen
  if (save) store(wallet)
  return wallet
}

export function walletLeftCents(w: WalletState): number {
  return w.balanceCents
}

/** Bucht `cents` vom Testguthaben ab. Gibt das neue Guthaben zurück, oder null, wenn es nicht reicht. */
export function spendTestMoney(cents: number, now = Date.now()): WalletState | null {
  const w = readWallet(now)
  if (cents > w.balanceCents) return null
  const next: WalletState = { month: w.month, balanceCents: w.balanceCents - cents, totalCents: w.totalCents + cents, purchases: w.purchases + 1 }
  store(next)
  return next
}

export function offerPriceCents(offerId: string): number | null {
  return OFFER_PRICE_CENTS[offerId] ?? null
}

/** Länge der nächsten Test-Werbung (zufällig 30 oder 60 s). */
export function pickTestAdSeconds(rand = Math.random()): number {
  return rand < 0.5 ? TEST_AD_SECONDS[0] : TEST_AD_SECONDS[1]
}
