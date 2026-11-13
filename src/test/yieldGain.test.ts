import { describe, expect, it } from 'vitest'
import { EMPTY_TRUHE, prestigeMultiplier, yieldGainAfterPrestige } from '../game/truhe'

describe('Vorschau „Ernte ×N“ am Saisonende', () => {
  const base = { upgrades: EMPTY_TRUHE, erbstuecke: 0, ernteSeason: 0, saisonenden: 0 }

  it('ohne Erbstücke bringt es nichts', () => {
    expect(yieldGainAfterPrestige(base)).toBe(1)
  })

  it('erstes Saisonende: die Gartenschere ist sofort frei (+5 %)', () => {
    // 25 Erbstücke = Rang 1 der Gartenschere; Rang 2 öffnet sich erst beim Neuanlegen
    expect(yieldGainAfterPrestige({ ...base, erbstuecke: 25 })).toBeCloseTo(1.05, 6)
    expect(yieldGainAfterPrestige({ ...base, erbstuecke: 5000 })).toBeCloseTo(1.05, 6)
  })

  it('mit mehr Saisonenden sind mehr Ränge sofort frei', () => {
    const early = yieldGainAfterPrestige({ ...base, erbstuecke: 1389, saisonenden: 1 })
    const later = yieldGainAfterPrestige({ ...base, erbstuecke: 1389, saisonenden: 4, upgrades: { ...EMPTY_TRUHE, gartenschere: 1 } })
    expect(later).toBeGreaterThan(early)
    expect(later).toBeGreaterThan(1.1)
  })

  it('ist ein Verhältnis zum heutigen Bonus, nie kleiner als 1', () => {
    const upgrades = { ...EMPTY_TRUHE, gartenschere: 10, strohhut: 5 }
    const gain = yieldGainAfterPrestige({ ...base, upgrades, erbstuecke: 3, saisonenden: 12 })
    expect(gain).toBe(1)
    expect(prestigeMultiplier(upgrades)).toBeCloseTo(1.6, 6)
  })
})
