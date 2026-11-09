import { describe, expect, it } from 'vitest'
import { moduleTier, sameTierProps as same0 } from '../theme/tiers'

const sameTierProps = (a: Record<string, unknown> & { level: number }, b: Record<string, unknown> & { level: number }) => same0(a, b)

describe('Grafik: Neuzeichnen nur bei Stufenwechsel', () => {
  it('gleiche Stufe, andere Level → kein Neuzeichnen', () => {
    expect(moduleTier(11)).toBe(moduleTier(24))
    expect(sameTierProps({ id: 'a', level: 11 }, { id: 'a', level: 24 })).toBe(true)
  })
  it('Stufenwechsel oder andere Prop → neu zeichnen', () => {
    expect(sameTierProps({ id: 'a', level: 24 }, { id: 'a', level: 25 })).toBe(false)
    expect(sameTierProps({ id: 'a', level: 30, season: 'summer' }, { id: 'a', level: 30, season: 'winter' })).toBe(false)
    expect(sameTierProps({ id: 'a', level: 30 }, { id: 'b', level: 30 })).toBe(false)
  })
})
