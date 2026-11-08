/**
 * Compact German number formatting for idle values.
 * Decimal comma, thousands dot up to 99.999, then Tsd / Mio / Mrd / Bio / Brd
 * (German long scale — never the English „B“ for a Milliarde).
 */
const UNITS = [
  { v: 1e18, s: ' Trd' },
  { v: 1e15, s: ' Brd' },
  { v: 1e12, s: ' Bio' },
  { v: 1e9, s: ' Mrd' },
  { v: 1e6, s: ' Mio' },
  { v: 1e3, s: ' Tsd' },
]

/** 15200 → „15.200“ */
function grouped(n: number): string {
  const sign = n < 0 ? '-' : ''
  return sign + String(Math.floor(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/** Fixed decimals with a German decimal comma. */
export function formatDecimal(n: number, digits: number): string {
  return de(n, digits)
}

function de(n: number, digits: number): string {
  return n.toFixed(digits).replace('.', ',')
}

export function formatAsh(n: number): string {
  if (!Number.isFinite(n)) return '0'
  const abs = Math.abs(n)
  if (abs < 1000) {
    return abs < 10 && n % 1 !== 0 ? de(n, 1) : Math.floor(n).toString()
  }
  if (abs < 100_000) return grouped(n)
  for (const u of UNITS) {
    if (abs >= u.v) {
      const val = n / u.v
      const a = Math.abs(val)
      return `${de(val, a >= 100 ? 0 : a >= 10 ? 1 : 2)}${u.s}`
    }
  }
  return Math.floor(n).toString()
}

export function formatRate(n: number): string {
  return `${formatAsh(n)}/s`
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
  return `×${de(m, 2)}`
}

/** „12 Minuten“, „3 Stunden“, „2 Tage“ — how long the player was away. */
export function formatAway(ms: number): string {
  const min = Math.max(1, Math.round(ms / 60_000))
  if (min < 60) return min === 1 ? '1 Minute' : `${min} Minuten`
  const h = Math.round(min / 60)
  if (h < 24) return h === 1 ? '1 Stunde' : `${h} Stunden`
  const d = Math.round(h / 24)
  return d === 1 ? '1 Tag' : `${d} Tage`
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
