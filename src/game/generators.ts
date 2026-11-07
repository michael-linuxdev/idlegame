/**
 * Module definitions — formulas from docs/economy.md (Ore = soft, Plasma = meta).
 * Tone: Sci-Fi Outpost / Orbital Claim (vision.md). Loop unchanged.
 *
 * Map-worker IDs (Bau-Map v2): keep these stable.
 *   MVP on-map: emberPit, ashForge, cinderBarracks
 *   Later slots: sootKiln, pyreVault (defs ready; not rendered until map places them)
 *
 * Display names (sci-fi):
 *   emberPit → Drill Rig (G1)
 *   ashForge → Hab Module (G2)
 *   cinderBarracks → Fusion Array (G3)
 *   sootKiln → Ore Refinery (G4)
 *   pyreVault → Cargo Vault (G5)
 */

export type GeneratorId =
  | 'emberPit'
  | 'ashForge'
  | 'cinderBarracks'
  | 'sootKiln'
  | 'pyreVault'

export type SilhouetteKind = 'hearth' | 'mill' | 'altar' | 'kiln' | 'vault'

export interface GeneratorDef {
  id: GeneratorId
  /** Economy G-number label for docs / map worker */
  economyId: 'G1' | 'G2' | 'G3' | 'G4' | 'G5'
  name: string
  blurb: string
  /** Fixed slot on the outpost map (percent of map box). Undefined = deferred to Bau-Map v2. */
  slot?: { left: string; top: string }
  silhouette: SilhouetteKind
  /** Base Ore/sec at level 1 (`r0`) */
  baseRate: number
  /** Cost C0 for level 0 → 1 */
  baseCost: number
  /** Growth `g` in C(n) = C0 · g^n */
  costScale: number
  /** Lifetime-Ore-this-run unlock gate (0 = start) */
  unlockAsh: number
  /** Shown on current outpost map home */
  onMap: boolean
}

/** MVP modules placed on the outpost map home. */
export const GENERATORS: GeneratorDef[] = [
  {
    id: 'emberPit',
    economyId: 'G1',
    name: 'Drill Rig',
    blurb: 'Surface drills that pull raw ore from the claim.',
    slot: { left: '18%', top: '58%' },
    silhouette: 'hearth',
    baseRate: 1,
    baseCost: 15,
    costScale: 1.15,
    unlockAsh: 0,
    onMap: true,
  },
  {
    id: 'ashForge',
    economyId: 'G2',
    name: 'Hab Module',
    blurb: 'Crew quarters that keep the outpost staffed and productive.',
    slot: { left: '62%', top: '48%' },
    silhouette: 'mill',
    baseRate: 8,
    baseCost: 120,
    costScale: 1.14,
    unlockAsh: 250,
    onMap: true,
  },
  {
    id: 'cinderBarracks',
    economyId: 'G3',
    name: 'Fusion Array',
    blurb: 'Compact reactors that multiply ore throughput.',
    slot: { left: '40%', top: '28%' },
    silhouette: 'altar',
    baseRate: 60,
    baseCost: 900,
    costScale: 1.13,
    unlockAsh: 8_000,
    onMap: true,
  },
]

/**
 * Extra defs for Bau-Map v2 later slots — not rendered on current home.
 * Rough progression placeholders (economy.md MVP is 3 gens); tune with Economy owner.
 */
export const FUTURE_GENERATORS: GeneratorDef[] = [
  {
    id: 'sootKiln',
    economyId: 'G4',
    name: 'Ore Refinery',
    blurb: 'Smelts and grades ore into denser feedstock.',
    silhouette: 'kiln',
    baseRate: 400,
    baseCost: 12_000,
    costScale: 1.12,
    unlockAsh: 80_000,
    onMap: false,
  },
  {
    id: 'pyreVault',
    economyId: 'G5',
    name: 'Cargo Vault',
    blurb: 'Sealed holds for deep-stock ore and plasma reserves.',
    silhouette: 'vault',
    baseRate: 2_500,
    baseCost: 90_000,
    costScale: 1.11,
    unlockAsh: 600_000,
    onMap: false,
  },
]

export const ALL_GENERATORS: GeneratorDef[] = [...GENERATORS, ...FUTURE_GENERATORS]

export const MVP_GENERATOR_IDS: GeneratorId[] = GENERATORS.map((g) => g.id)

/** Cost to buy level n → n+1: C(n) = C0 · g^n (n = current level). */
export function generatorCost(def: GeneratorDef, owned: number, discountMult = 1): number {
  const raw = def.baseCost * Math.pow(def.costScale, owned) * discountMult
  return Math.max(1, Math.floor(raw))
}

/**
 * Production at level n (n ≥ 1):
 * R(n) = r0 · n · (1 + 0.02 · floor(n/10))
 */
export function generatorRate(def: GeneratorDef, owned: number): number {
  if (owned <= 0) return 0
  const milestone = 1 + 0.02 * Math.floor(owned / 10)
  return def.baseRate * owned * milestone
}

export function isUnlocked(
  def: GeneratorDef,
  ashEarned: number,
  firstFlame: boolean,
): boolean {
  if (def.unlockAsh <= 0) return true
  if (firstFlame && def.id === 'ashForge') return true
  return ashEarned >= def.unlockAsh
}
