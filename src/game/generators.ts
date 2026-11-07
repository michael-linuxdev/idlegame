/**
 * Module definitions — Bau-Map content depth (10 slots) + economy.md formulas for G1–G3.
 * Tone: space data centers / Orbit Rack (vision.md). Loop unchanged.
 *
 * Stable IDs (map worker + content depth):
 *   emberPit, ashForge, cinderBarracks, cinderVault, ashWatch, dominionKeep,
 *   batteryBank, edgeCache, quantumCooler, packetScrubber
 *
 * Display names (DE via i18n) + silhouettes:
 *   Kraftwerk (power), Kühlanlage (cool), Rack-Bucht (rack),
 *   Uplink (uplink), Strahl-Relais (relay), Core-Switch (switch),
 *   Batteriebank (battery), Edge-Cache (cache), Quantenkühler (quantum),
 *   Paketfilter (scrub)
 */

import { t } from '../i18n'
import { LEVEL_MODULE_GATES } from './progression'

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
    name: t.modules.emberPit.name,
    blurb: t.modules.emberPit.blurb,
    slot: { left: '48%', top: '78%' },
    silhouette: 'power',
    baseRate: 1,
    baseCost: 15,
    costScale: 1.15,
  },
  {
    id: 'ashForge',
    economyId: 'G2',
    name: t.modules.ashForge.name,
    blurb: t.modules.ashForge.blurb,
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
    name: t.modules.cinderBarracks.name,
    blurb: t.modules.cinderBarracks.blurb,
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
    name: t.modules.cinderVault.name,
    blurb: t.modules.cinderVault.blurb,
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
    name: t.modules.ashWatch.name,
    blurb: t.modules.ashWatch.blurb,
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
    name: t.modules.dominionKeep.name,
    blurb: t.modules.dominionKeep.blurb,
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
    name: t.modules.batteryBank.name,
    blurb: t.modules.batteryBank.blurb,
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
    name: t.modules.edgeCache.name,
    blurb: t.modules.edgeCache.blurb,
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
    name: t.modules.quantumCooler.name,
    blurb: t.modules.quantumCooler.blurb,
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
    name: t.modules.packetScrubber.name,
    blurb: t.modules.packetScrubber.blurb,
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
  playerLevel = 1,
): boolean {
  if (!def.unlock) return true
  if (firstBeacon && def.id === 'ashForge') return true
  const { ashEarned: needAsh, requires } = def.unlock
  if (needAsh != null && ashEarned >= needAsh) return true
  if (requires && (owned[requires.id] ?? 0) >= requires.level) return true
  const levelGate = LEVEL_MODULE_GATES[def.id]
  if (levelGate != null && playerLevel >= levelGate) return true
  return false
}

/** Legacy helper */
export function isUnlocked(
  def: GeneratorDef,
  ashEarned: number,
  firstFlame: boolean,
  owned: Record<GeneratorId, number> = {} as Record<GeneratorId, number>,
  playerLevel = 1,
): boolean {
  return isGeneratorUnlocked(def, ashEarned, owned, firstFlame, playerLevel)
}

export function unlockHint(def: GeneratorDef): string {
  if (!def.unlock) return ''
  const parts: string[] = []
  if (def.unlock.ashEarned != null) {
    parts.push(
      t.unlock.computeEarned(def.unlock.ashEarned.toLocaleString('de-DE')),
    )
  }
  if (def.unlock.requires) {
    const prior = GENERATORS.find((g) => g.id === def.unlock!.requires!.id)
    parts.push(
      t.unlock.levelOf(
        prior?.name ?? def.unlock.requires.id,
        def.unlock.requires.level,
      ),
    )
  }
  const levelGate = LEVEL_MODULE_GATES[def.id]
  if (levelGate != null) {
    parts.push(t.unlock.playerLevel(levelGate))
  }
  return parts.length ? `${t.unlock.prefix} ${parts.join(t.unlock.or)}` : ''
}

/** Compact unlock gate for map plaques (phone-scale labels). */
export function shortUnlockGate(def: GeneratorDef): string {
  if (!def.unlock) return t.hud.locked
  if (def.unlock.ashEarned != null) {
    const n = def.unlock.ashEarned
    const label =
      n >= 1_000_000_000
        ? `${n / 1_000_000_000}B`
        : n >= 1_000_000
          ? `${n / 1_000_000}M`
          : n >= 1_000
            ? `${Math.round(n / 1_000)}k`
            : `${n}`
    return t.hud.gateCompute(label)
  }
  if (def.unlock.requires) {
    const prior = GENERATORS.find((g) => g.id === def.unlock!.requires!.id)
    return t.unlock.levelOf(
      prior?.name ?? def.unlock.requires.id,
      def.unlock.requires.level,
    )
  }
  return t.hud.locked
}
