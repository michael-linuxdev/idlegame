export type GeneratorId = 'emberPit' | 'ashForge' | 'cinderBarracks'

export interface GeneratorDef {
  id: GeneratorId
  name: string
  blurb: string
  /** Base cost in Ash */
  baseCost: number
  /** Ash produced per second per owned unit */
  baseRate: number
  /** Cost multiplier per owned unit */
  costScale: number
}

export const GENERATORS: GeneratorDef[] = [
  {
    id: 'emberPit',
    name: 'Ember Pit',
    blurb: 'Smoldering pits rake embers from the waste.',
    baseCost: 15,
    baseRate: 0.1,
    costScale: 1.15,
  },
  {
    id: 'ashForge',
    name: 'Ash Forge',
    blurb: 'Forges melt cinder into usable ash.',
    baseCost: 100,
    baseRate: 1,
    costScale: 1.15,
  },
  {
    id: 'cinderBarracks',
    name: 'Cinder Barracks',
    blurb: 'Legionnaires harvest ash from the front.',
    baseCost: 1100,
    baseRate: 8,
    costScale: 1.15,
  },
]

export function generatorCost(def: GeneratorDef, owned: number): number {
  return Math.floor(def.baseCost * Math.pow(def.costScale, owned))
}
