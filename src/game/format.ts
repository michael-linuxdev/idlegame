/** Compact number formatting for idle games */
export function formatAsh(n: number): string {
  if (!Number.isFinite(n)) return '0'
  const abs = Math.abs(n)
  if (abs < 1000) {
    return n < 10 && n % 1 !== 0 ? n.toFixed(1) : Math.floor(n).toString()
  }
  const units = [
    { v: 1e15, s: 'Qa' },
    { v: 1e12, s: 'T' },
    { v: 1e9, s: 'B' },
    { v: 1e6, s: 'M' },
    { v: 1e3, s: 'K' },
  ]
  for (const u of units) {
    if (abs >= u.v) {
      const val = n / u.v
      return `${val >= 100 ? val.toFixed(0) : val.toFixed(2)}${u.s}`
    }
  }
  return Math.floor(n).toString()
}

export function formatRate(n: number): string {
  return `${formatAsh(n)}/s`
}
