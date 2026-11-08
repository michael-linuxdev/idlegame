import { describe, expect, it } from 'vitest'
import { formatAsh, formatClock, formatDecimal, formatMult } from '../game/format'

describe('German number formatting', () => {
  it('uses a decimal comma and German long-scale suffixes', () => {
    expect(formatAsh(5)).toBe('5')
    expect(formatAsh(1.4)).toBe('1,4')
    expect(formatAsh(1350)).toBe('1,35K')
    expect(formatAsh(13_500)).toBe('13,5K')
    expect(formatAsh(2_500_000)).toBe('2,50M')
    expect(formatAsh(55_100_000_000)).toBe('55,1 Mrd')
    expect(formatAsh(3e12)).toBe('3,00 Bio')
  })
  it('never prints English B for Milliarde', () => {
    expect(formatAsh(8e9)).not.toMatch(/B$/)
  })
  it('formats helpers', () => {
    expect(formatMult(1.25)).toBe('×1,25')
    expect(formatDecimal(0.5, 1)).toBe('0,5')
    expect(formatClock(65_000)).toBe('1:05')
  })
})
