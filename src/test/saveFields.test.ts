import { describe, expect, it } from 'vitest'
import { parseAchievements, parseCosmetics, parseNonNegInt, parseNum, parseOwned, parseUpgrades } from '../game/saveFields'
import { EMPTY_TRUHE } from '../game/truhe'

describe('Feld-Parser: kaputte Werte werden zu gültigen Startwerten', () => {
  it('Zahlen', () => {
    expect(parseNum('x')).toBe(0)
    expect(parseNum(-5)).toBe(0)
    expect(parseNum(Number.NaN, 7)).toBe(7)
    expect(parseNonNegInt(3.9)).toBe(3)
  })
  it('Bereiche und Truhe: nur bekannte Schlüssel, ganze Zahlen ≥ 0', () => {
    const owned = parseOwned({ gemuesebeet: 4.7, unbekannt: 9, kompost: -1 })
    expect(owned.gemuesebeet).toBe(4)
    expect(owned.kompost).toBe(0)
    expect('unbekannt' in owned).toBe(false)
    expect(parseUpgrades({ gartenschere: 2, foo: 1 })).toEqual({ ...EMPTY_TRUHE, gartenschere: 2 })
    expect(parseUpgrades(null)).toEqual(EMPTY_TRUHE)
  })
  it('Gartenstile: „wiese“ ist immer dabei, Unbekanntes fällt weg', () => {
    expect(parseCosmetics(['gibtsnicht'])).toEqual(['wiese'])
    expect(parseCosmetics('x')).toEqual(['wiese'])
  })
  it('Erfolge: nur bekannte IDs', () => {
    expect(parseAchievements(['firstUpgrade', 'quatsch', 3])).toEqual(['firstUpgrade'])
  })
})
