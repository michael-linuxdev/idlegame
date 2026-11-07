/**
 * Module definitions — Bau-Map v2 six slots + economy.md formulas for G1–G3.
 * Tone: space data centers / Orbit Rack (vision.md). Loop unchanged.
 *
 * Stable IDs (map worker):
 *   emberPit, ashForge, cinderBarracks, cinderVault, ashWatch, dominionKeep
 *
 * Display (datacenter ops):
 *   Power Plant, Cooling Array, Rack Bay, Uplink, Beam Relay, Core Switch
 */

export type GeneratorId =
  | 'emberPit'
  | 'ashForge'
  | 'cinderBarracks'
  | 'cinderVault'
  | 'ashWatch'
  | 'dominionKeep'

export type SilhouetteKind =
  | 'hearth'
  | 'mill'
  | 'altar'
  | 'vault'
  | 'watch'
  | 'keep'

export interface UnlockGate {
  /** Lifetime Compute earned this run (economy Ash) */
  ashEarned?: number
  /** Prior module at least this level (OR with ashEarned) */
  requires?: { id: GeneratorId; level: number }
}

export interface GeneratorDef {
  id: GeneratorId
  economyId: 'G1' | 'G2' | 'G3' | 'G4' | 'G5' | 'G6'
  name: string
  blurb: string
  /** Fixed slot on the station map (percent of map box) */
  slot: { left: string; top: string }
  silhouette: SilhouetteKind
  /** Base Compute/sec at level 1 (`r0`) */
  baseRate: number
  /** Cost C0 for level 0 → 1 */
  baseCost: number
  /** Growth `g` in C(n) = C0 · g^n */
  costScale: number
  /** Unlock gate — start modules omit */
  unlock?: UnlockGate
}

/**
 * Bau-Map v2 — six fixed slots (layout from map worker).
 * G1–G3 rates/costs/growth from economy.md; G4–G6 extend the curve.
 */
export const GENERATORS: GeneratorDef[] = [
  {
    id: 'emberPit',
    economyId: 'G1',
    name: 'Power Plant',
    blurb: 'Orbital reactors that feed raw Compute into the station bus.',
    slot: { left: '48%', top: '72%' },
    silhouette: 'hearth',
    baseRate: 1,
    baseCost: 15,
    costScale: 1.15,
  },
  {
    id: 'ashForge',
    economyId: 'G2',
    name: 'Cooling Array',
    blurb: 'Radiators and chill loops that keep racks in thermal envelope.',
    slot: { left: '74%', top: '54%' },
    silhouette: 'mill',
    baseRate: 8,
    baseCost: 120,
    costScale: 1.14,
    unlock: { ashEarned: 250, requires: { id: 'emberPit', level: 10 } },
  },
  {
    id: 'cinderBarracks',
    economyId: 'G3',
    name: 'Rack Bay',
    blurb: 'Dense server floors that turn power into billable Compute.',
    slot: { left: '52%', top: '36%' },
    silhouette: 'altar',
    baseRate: 60,
    baseCost: 900,
    costScale: 1.13,
    unlock: { ashEarned: 8_000, requires: { id: 'ashForge', level: 10 } },
  },
  {
    id: 'cinderVault',
    economyId: 'G4',
    name: 'Uplink',
    blurb: 'High-gain dishes that sell spare cycles to the belt mesh.',
    slot: { left: '20%', top: '56%' },
    silhouette: 'vault',
    baseRate: 400,
    baseCost: 12_000,
    costScale: 1.12,
    unlock: { ashEarned: 80_000, requires: { id: 'cinderBarracks', level: 10 } },
  },
  {
    id: 'ashWatch',
    economyId: 'G5',
    name: 'Beam Relay',
    blurb: 'Laser backhaul that stitches distant pods into one fabric.',
    slot: { left: '24%', top: '30%' },
    silhouette: 'watch',
    baseRate: 2_500,
    baseCost: 90_000,
    costScale: 1.11,
    unlock: { ashEarned: 600_000, requires: { id: 'cinderVault', level: 10 } },
  },
  {
    id: 'dominionKeep',
    economyId: 'G6',
    name: 'Core Switch',
    blurb: 'The control plane — routes every rack, chill loop, and contract.',
    slot: { left: '62%', top: '18%' },
    silhouette: 'keep',
    baseRate: 15_000,
    baseCost: 750_000,
    costScale: 1.1,
    unlock: { ashEarned: 4_000_000, requires: { id: 'ashWatch', level: 10 } },
  },
]

export const GENERATOR_IDS: GeneratorId[] = GENERATORS.map((g) => g.id)

/** @deprecated alias — prefer GENERATOR_IDS */
export const MVP_GENERATOR_IDS = GENERATOR_IDS

/** Cost to buy level n → n+1: C(n) = C0 · g^n */
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

export function isGeneratorUnlocked(
  def: GeneratorDef,
  ashEarned: number,
  owned: Record<GeneratorId, number>,
  firstBeacon = false,
): boolean {
  if (!def.unlock) return true
  if (firstBeacon && def.id === 'ashForge') return true
  const { ashEarned: needAsh, requires } = def.unlock
  if (needAsh != null && ashEarned >= needAsh) return true
  if (requires && (owned[requires.id] ?? 0) >= requires.level) return true
  return false
}

/** Legacy helper */
export function isUnlocked(
  def: GeneratorDef,
  ashEarned: number,
  firstFlame: boolean,
  owned: Record<GeneratorId, number> = {} as Record<GeneratorId, number>,
): boolean {
  return isGeneratorUnlocked(def, ashEarned, owned, firstFlame)
}

export function unlockHint(def: GeneratorDef): string {
  if (!def.unlock) return ''
  const parts: string[] = []
  if (def.unlock.ashEarned != null) {
    parts.push(`${def.unlock.ashEarned.toLocaleString()} Compute earned`)
  }
  if (def.unlock.requires) {
    const prior = GENERATORS.find((g) => g.id === def.unlock!.requires!.id)
    parts.push(
      `${prior?.name ?? def.unlock.requires.id} Lv ${def.unlock.requires.level}`,
    )
  }
  return parts.length ? `Unlock: ${parts.join(' or ')}` : ''
}
