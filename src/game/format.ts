/**
 * Compact number formatting for idle values, in the active language.
 *  - Deutsch: Dezimalkomma, Tausenderpunkt bis 99.999, dann Tsd / Mio / Mrd /
 *    Bio / Brd / Trd (lange Skala — nie das englische „B“ für eine Milliarde).
 *  - English: decimal point, comma grouping up to 99,999, then K / M / B / T /
 *    Qa / Qi (short scale: German „Mrd“ = 10⁹ = English „B“).
 * Separators and suffixes live in the language files (`t.num`).
 */
import { localeTag, t } from '../i18n'

const STEPS = [1e18, 1e15, 1e12, 1e9, 1e6, 1e3] as const

/** 15200 → „15.200“ / “15,200” */
function grouped(n: number): string {
  const sign = n < 0 ? '-' : ''
  return sign + String(Math.floor(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, t.num.group)
}

/** Whole number with the language's thousands separator (replaces toLocaleString). */
export function formatInt(n: number): string {
  return Number.isFinite(n) ? grouped(n) : '0'
}

/** Date + time in the active language (backup timestamps …). */
export function formatDateTime(ms: number): string {
  return new Date(ms).toLocaleString(localeTag())
}

/** Fixed decimals with the language's decimal mark. */
export function formatDecimal(n: number, digits: number): string {
  return fixed(n, digits)
}

function fixed(n: number, digits: number): string {
  return n.toFixed(digits).replace('.', t.num.decimal)
}

/** Preis in Cent → „2,49 €“ / „€2.49“ */
export function formatPrice(cents: number): string {
  return t.num.euro(fixed(cents / 100, 2))
}

export function formatErnte(n: number): string {
  if (!Number.isFinite(n)) return '0'
  const abs = Math.abs(n)
  if (abs < 1000) {
    return abs < 10 && n % 1 !== 0 ? fixed(n, 1) : Math.floor(n).toString()
  }
  if (abs < 100_000) return grouped(n)
  // t.num.units: suffix for 1e3, 1e6, 1e9, 1e12, 1e15, 1e18
  for (let i = 0; i < STEPS.length; i++) {
    const v = STEPS[i]!
    if (abs >= v) {
      const val = n / v
      const a = Math.abs(val)
      return `${fixed(val, a >= 100 ? 0 : a >= 10 ? 1 : 2)}${t.num.units[STEPS.length - 1 - i]}`
    }
  }
  return Math.floor(n).toString()
}

export function formatRate(n: number): string {
  return `${formatErnte(n)}/s`
}

/** m:ss for short countdowns */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000))
  // Long timers read as hours (27 h 49) instead of „1669:00“
  if (total >= 3600) {
    const h = Math.floor(total / 3600)
    const min = Math.floor((total % 3600) / 60)
    return h >= 24 && min === 0 ? `${h} h` : `${h} h ${String(min).padStart(2, '0')}`
  }
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** „×1,25“ */
export function formatMult(m: number): string {
  return `×${fixed(m, 2)}`
}

/** „12 Minuten“ / “12 minutes” — how long the player was away. */
export function formatAway(ms: number): string {
  const min = Math.max(1, Math.round(ms / 60_000))
  if (min < 60) return t.num.minutes(min)
  const h = Math.round(min / 60)
  if (h < 24) return t.num.hours(h)
  return t.num.days(Math.round(h / 24))
}

/** Time until a goal at the current rate: „38 min“, „5 h 10 min“; null if far / unknown. */
export function formatEta(remaining: number, perSecond: number): string | null {
  if (!(remaining > 0) || !(perSecond > 0)) return null
  const ms = (remaining / perSecond) * 1000
  if (ms > 48 * 3600_000) return null
  const min = Math.max(1, Math.ceil(ms / 60_000))
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}
