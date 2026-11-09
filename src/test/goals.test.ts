import { describe, expect, it } from 'vitest'
import { computeBestBuy } from '../game/bestBuy'
import { computeNextGoal } from '../game/nextGoal'
import { GENERATORS, generatorCost, type GeneratorId } from '../game/generators'
import { createInitialState, lineCostMult, type GameState } from '../game/state'

const NOW = 1_800_000_000_000
const costOf = (s: GameState) => (id: GeneratorId) => {
  const def = GENERATORS.find((g) => g.id === id)!
  return generatorCost(def, s.owned[id] ?? 0, lineCostMult(s, id))
}

describe('Omas Tipp (bester Kauf)', () => {
  it('am Anfang: das Gemüsebeet, bezahlbar', () => {
    const s = createInitialState(NOW)
    const tip = computeBestBuy(s, { playerLevel: 1, ratePerSec: 1, costOf: costOf(s) })
    expect(tip?.id).toBe('gemuesebeet')
    expect(tip?.affordable).toBe(true)
  })
  it('ohne Ernte und ohne Ertrag kein Tipp, der in Minuten erreichbar wäre', () => {
    const s = { ...createInitialState(NOW), ernte: 0 }
    const tip = computeBestBuy(s, { playerLevel: 1, ratePerSec: 0, costOf: costOf(s) })
    expect(tip === null || tip.affordable === false).toBe(true)
  })
})

describe('Ziel-Zeile (nächstes Ziel)', () => {
  it('liefert ein Ziel mit Titel und Anteil 0…1', () => {
    const s = createInitialState(NOW)
    const g = computeNextGoal(s, { playerLevel: 1, playerXpInto: 0, playerXpNeed: 100, playerXpRatio: 0, costOf: costOf(s) })
    expect(g.title.length).toBeGreaterThan(0)
    expect(g.ratio).toBeGreaterThanOrEqual(0)
    expect(g.ratio).toBeLessThanOrEqual(1)
  })
})
