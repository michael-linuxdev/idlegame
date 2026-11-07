export type GeneratorId = 'emberPit' | 'ashForge' | 'cinderBarracks'

export interface GeneratorDef {
  id: GeneratorId
  name: string
  blurb: string
  /** Fixed slot on the fortress map (percent of map box) */
  slot: { left: string; top: string }
  /** CSS building silhouette variant */
  silhouette: 'hearth' | 'mill' | 'altar'
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
    name: 'Ash Hearth',
    blurb: 'A banked sacrificial fire that distills ash essence.',
    slot: { left: '18%', top: '58%' },
    silhouette: 'hearth',
    baseCost: 15,
    baseRate: 0.1,
    costScale: 1.15,
  },
  {
    id: 'ashForge',
    name: 'Bone Mill',
    blurb: 'Fallen fodder ground into fuel for the legion.',
    slot: { left: '62%', top: '48%' },
    silhouette: 'mill',
    baseCost: 100,
    baseRate: 1,
    costScale: 1.15,
  },
  {
    id: 'cinderBarracks',
    name: 'Legion Altar',
    blurb: 'Ritual stone where the ash legion binds power.',
    slot: { left: '40%', top: '28%' },
    silhouette: 'altar',
    baseCost: 1100,
    baseRate: 8,
    costScale: 1.15,
  },
]

export function generatorCost(def: GeneratorDef, owned: number): number {
  return Math.floor(def.baseCost * Math.pow(def.costScale, owned))
}
