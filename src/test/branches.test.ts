import { describe, expect, it } from 'vitest'
import { BRANCH_MAX_RANK, branchCost, capacityCostMult, efficiencyMult, emptyBranches } from '../game/branches'
import { GENERATORS, GENERATOR_IDS } from '../game/generators'

describe('Pflege-Zweige', () => {
  it('Effizienz +4 % und Kapazität ×0,97 je Rang, gedeckelt', () => {
    expect(efficiencyMult(0)).toBe(1)
    expect(efficiencyMult(2)).toBeCloseTo(1.08)
    expect(efficiencyMult(99)).toBeCloseTo(efficiencyMult(BRANCH_MAX_RANK))
    expect(capacityCostMult(1)).toBeCloseTo(0.97)
  })
  it('Kosten steigen je Rang, nie unter 25', () => {
    const def = GENERATORS[0]!
    expect(branchCost(def, 'efficiency', 1)).toBeGreaterThan(branchCost(def, 'efficiency', 0))
    expect(branchCost(def, 'capacity', 0)).toBeGreaterThanOrEqual(branchCost(def, 'efficiency', 0))
    expect(branchCost(def, 'efficiency', 0)).toBeGreaterThanOrEqual(25)
  })
  it('leere Zweige für jeden Bereich', () => {
    const b = emptyBranches(GENERATOR_IDS)
    expect(Object.keys(b)).toEqual(GENERATOR_IDS)
    expect(b.gemuesebeet).toEqual({ efficiency: 0, capacity: 0 })
  })
})
