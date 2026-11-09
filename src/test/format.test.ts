import { afterEach, describe, expect, it } from 'vitest'
import { formatAway, formatClock, formatDecimal, formatErnte, formatInt, formatMult } from '../game/format'
import { __setStringsForTest, type Strings } from '../i18n'
import { strings as de } from '../i18n/de/strings'
import { strings as en } from '../i18n/en/strings'

const useDe = () => __setStringsForTest(de as unknown as Strings, 'de')
const useEn = () => __setStringsForTest(en, 'en')

describe('German number formatting', () => {
  afterEach(useDe)
  it('uses a decimal comma and German long-scale suffixes', () => {
    useDe()
    expect(formatErnte(5)).toBe('5')
    expect(formatErnte(1.4)).toBe('1,4')
    expect(formatErnte(1350)).toBe('1.350')
    expect(formatErnte(13_500)).toBe('13.500')
    expect(formatErnte(152_400)).toBe('152 Tsd')
    expect(formatErnte(2_500_000)).toBe('2,50 Mio')
    expect(formatErnte(55_100_000_000)).toBe('55,1 Mrd')
    expect(formatErnte(3e12)).toBe('3,00 Bio')
  })
  it('never prints English B for Milliarde', () => {
    useDe()
    expect(formatErnte(8e9)).not.toMatch(/B$/)
  })
  it('handles the boundaries', () => {
    useDe()
    expect(formatErnte(999)).toBe('999')
    expect(formatErnte(1000)).toBe('1.000')
    expect(formatErnte(99_999)).toBe('99.999')
    expect(formatErnte(100_000)).toBe('100 Tsd')
    expect(formatErnte(1e6)).toBe('1,00 Mio')
    expect(formatErnte(1e9)).toBe('1,00 Mrd')
    expect(formatErnte(1e15)).toBe('1,00 Brd')
    expect(formatErnte(1e18)).toBe('1,00 Trd')
  })
  it('formats helpers', () => {
    useDe()
    expect(formatMult(1.25)).toBe('×1,25')
    expect(formatDecimal(0.5, 1)).toBe('0,5')
    expect(formatClock(65_000)).toBe('1:05')
    expect(formatClock(1669 * 60_000)).toBe('27 h 49')
    expect(formatInt(25_000)).toBe('25.000')
    expect(formatAway(60_000)).toBe('1 Minute')
    expect(formatAway(3 * 3600_000)).toBe('3 Stunden')
    expect(formatAway(48 * 3600_000)).toBe('2 Tage')
  })
})

describe('English number formatting', () => {
  afterEach(useDe)
  it('uses a decimal point, comma grouping and the short scale', () => {
    useEn()
    expect(formatErnte(1.4)).toBe('1.4')
    expect(formatErnte(999)).toBe('999')
    expect(formatErnte(1000)).toBe('1,000')
    expect(formatErnte(99_999)).toBe('99,999')
    expect(formatErnte(100_000)).toBe('100K')
    expect(formatErnte(1e6)).toBe('1.00M')
    expect(formatErnte(1e9)).toBe('1.00B')
    expect(formatErnte(55_100_000_000)).toBe('55.1B')
    expect(formatErnte(1e12)).toBe('1.00T')
    expect(formatErnte(1e15)).toBe('1.00Qa')
    expect(formatErnte(1e18)).toBe('1.00Qi')
  })
  it('formats helpers', () => {
    useEn()
    expect(formatMult(1.25)).toBe('×1.25')
    expect(formatDecimal(0.5, 1)).toBe('0.5')
    expect(formatInt(25_000)).toBe('25,000')
    expect(formatAway(60_000)).toBe('1 minute')
    expect(formatAway(3 * 3600_000)).toBe('3 hours')
    expect(formatAway(48 * 3600_000)).toBe('2 days')
  })
})
