/**
 * Module definitions — Bau-Map content depth (10 slots) + economy.md formulas for G1–G3.
 * Tone: space data centers / Orbit Rack (vision.md). Loop unchanged.
 *
 * Stable IDs (map worker + content depth):
 *   emberPit, ashForge, cinderBarracks, cinderVault, ashWatch, dominionKeep,
 *   batteryBank, edgeCache, quantumCooler, packetScrubber
 *
 * Display (datacenter ops) + silhouettes:
 *   Power Plant (power), Cooling Array (cool), Rack Bay (rack),
 *   Uplink (uplink), Beam Relay (relay), Core Switch (switch),
 *   Battery Bank (battery), Edge Cache (cache), Quantum Cooler (quantum),
 *   Packet Scrubber (scrub)
 */

export type GeneratorId =
  | 'emberPit'
  | 'ashForge'
  | 'cinderBarracks'
  | 'cinderVault'
  | 'ashWatch'
  | 'dominionKeep'
  | 'batteryBank'
  | 'edgeCache'
  | 'quantumCooler'
  | 'packetScrubber'

export type SilhouetteKind =
  | 'power'
  | 'cool'
  | 'rack'
  | 'uplink'
  | 'relay'
  | 'switch'
  | 'battery'
  | 'cache'
  | 'quantum'
  | 'scrub'

export type EconomyId =
  | 'G1'
  | 'G2'
  | 'G3'
  | 'G4'
  | 'G5'
  | 'G6'
  | 'G7'
  | 'G8'
  | 'G9'
  | 'G10'

export interface UnlockGate {
  /** Lifetime Compute earned this run (economy Ash) */
  ashEarned?: number
  /** Prior module at least this level (OR with ashEarned) */
  requires?: { id: GeneratorId; level: number }
}

export interface GeneratorDef {
  id: GeneratorId
  economyId: EconomyId
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
 * Bau-Map content depth — ten fixed slots.
 * G1–G3 rates/costs/growth from economy.md; G4–G10 extend the same curve
 * (r0 ≈ ×6–7, C0 ≈ ×7, g −0.005…0.01, unlock ≈ ×6–8).
 *
 * Feel polish (IG-19) — small early-game knobs only (documented):
 * - G2 unlock 250 → 200 Compute
 * - G2 C0 120 → 100
 * Formulas R(n)/C(n) unchanged.
 */
export const GENERATORS: GeneratorDef[] = [
  {
    id: 'emberPit',
    economyId: 'G1',
    name: 'Power Plant',
    blurb: 'Orbital reactors that feed raw Compute into the station bus.',
    slot: { left: '48%', top: '78%' },
    silhouette: 'power',
    baseRate: 1,
    baseCost: 15,
    costScale: 1.15,
  },
  {
    id: 'ashForge',
    economyId: 'G2',
    name: 'Cooling Array',
    blurb: 'Radiators and chill loops that keep racks in thermal envelope.',
    slot: { left: '76%', top: '62%' },
    silhouette: 'cool',
    baseRate: 8,
    baseCost: 100,
    costScale: 1.14,
    unlock: { ashEarned: 200, requires: { id: 'emberPit', level: 10 } },
  },
  {
    id: 'cinderBarracks',
    economyId: 'G3',
    name: 'Rack Bay',
    blurb: 'Dense server floors that turn power into billable Compute.',
    slot: { left: '50%', top: '48%' },
    silhouette: 'rack',
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
    slot: { left: '18%', top: '60%' },
    silhouette: 'uplink',
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
    slot: { left: '22%', top: '36%' },
    silhouette: 'relay',
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
    slot: { left: '58%', top: '28%' },
    silhouette: 'switch',
    baseRate: 15_000,
    baseCost: 750_000,
    costScale: 1.1,
    unlock: { ashEarned: 4_000_000, requires: { id: 'ashWatch', level: 10 } },
  },
  {
    id: 'batteryBank',
    economyId: 'G7',
    name: 'Batteriebank',
    blurb: 'Kondensator-Gewölbe, die Orbit-Finsternisse abfangen.',
    slot: { left: '84%', top: '40%' },
    silhouette: 'battery',
    baseRate: 90_000,
    baseCost: 5_000_000,
    costScale: 1.09,
    unlock: { ashEarned: 25_000_000, requires: { id: 'dominionKeep', level: 10 } },
  },
  {
    id: 'edgeCache',
    economyId: 'G8',
    name: 'Edge-Cache',
    blurb: 'Nahorbit-CDN-Pods, die heiße Requests in Compute verwandeln.',
    slot: { left: '36%', top: '22%' },
    silhouette: 'cache',
    baseRate: 550_000,
    baseCost: 40_000_000,
    costScale: 1.085,
    unlock: { ashEarned: 180_000_000, requires: { id: 'batteryBank', level: 10 } },
  },
  {
    id: 'quantumCooler',
    economyId: 'G9',
    name: 'Quantenkühler',
    blurb: 'Kryo-Gitter für dichtere Qubit- und ASIC-Böden.',
    slot: { left: '8%', top: '24%' },
    silhouette: 'quantum',
    baseRate: 3_500_000,
    baseCost: 280_000_000,
    costScale: 1.08,
    unlock: {
      ashEarned: 1_200_000_000,
      requires: { id: 'edgeCache', level: 10 },
    },
  },
  {
    id: 'packetScrubber',
    economyId: 'G10',
    name: 'Paketfilter',
    blurb: 'Inline-Filter, die Abfallpakete in abrechenbare Zyklen holen.',
    slot: { left: '78%', top: '14%' },
    silhouette: 'scrub',
    baseRate: 22_000_000,
    baseCost: 2_000_000_000,
    costScale: 1.075,
    unlock: {
      ashEarned: 8_000_000_000,
      requires: { id: 'quantumCooler', level: 10 },
    },
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
    parts.push(`${def.unlock.ashEarned.toLocaleString('de-DE')} Compute verdient`)
  }
  if (def.unlock.requires) {
    const prior = GENERATORS.find((g) => g.id === def.unlock!.requires!.id)
    parts.push(
      `${prior?.name ?? def.unlock.requires.id} Stufe ${def.unlock.requires.level}`,
    )
  }
  return parts.length ? `Freischalten: ${parts.join(' oder ')}` : ''
}
