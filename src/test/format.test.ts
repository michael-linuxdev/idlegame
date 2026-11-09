import { describe, expect, it } from 'vitest'
import { formatErnte, formatClock, formatDecimal, formatMult } from '../game/format'

describe('German number formatting', () => {
  it('uses a decimal comma and German long-scale suffixes', () => {
    expect(formatErnte(5)).toBe('5')
    expect(formatErnte(1.4)).toBe('1,4')
    expect(formatErnte(1350)).toBe('1.350')
    expect(formatErnte(13_500)).toBe('13.500')
    expect(formatErnte(152_400)).toBe('152 Tsd')
    expect(formatErnte(2_500_000)).toBe('2,50 Mio')
    expect(formatErnte(55_100_000_000)).toBe('55,1 Mrd')
    expect(formatErnte(3e12)).toBe('3,00 Bio')
  })
  it('never prints English B for Milliarde', () => {
    expect(formatErnte(8e9)).not.toMatch(/B$/)
  })
  it('formats helpers', () => {
    expect(formatMult(1.25)).toBe('×1,25')
    expect(formatDecimal(0.5, 1)).toBe('0,5')
    expect(formatClock(65_000)).toBe('1:05')
    expect(formatClock(1669 * 60_000)).toBe('27 h 49')
  })
})
