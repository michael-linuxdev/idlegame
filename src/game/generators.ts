/**
 * Module definitions — Bau-Map content depth (10 slots) + economy.md formulas for G1–G3.
 * Tone: Urban Vertical Farm / TurmFarm. Loop unchanged.
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
 * Formulas R(n)/C(n) unchanged; knobs retuned in IG-31 balance pass.
 *
 * IG-31 targets (engaged, ~10s buy cadence): G2 ~3–5 min, G3 ~8–15 min,
 * first prestige ~45–75 min. Prior ladder snowballed prestige in ~5–10 min.
 *
 * Ladder vs pre-pass: G2+ rates ≈ ×0.5, C0 ≈ ×1.5–2.5, g +0.03,
 * unlock ash ≈ ×3–6 (G1 mild steepen only; Day-1 first upgrade still free).
 */
export const GENERATORS: GeneratorDef[] = [
  {
    id: 'emberPit',
    economyId: 'G1',
    name: t.modules.emberPit.name,
    blurb: t.modules.emberPit.blurb,
    /* Slot lattice: ≥26% horiz / ≥16% vert between centers so plaques don’t collide on phone */
    slot: { left: '50%', top: '86%' },
    silhouette: 'power',
    baseRate: 1,
    baseCost: 20,
    costScale: 1.18,
  },
  {
    id: 'ashForge',
    economyId: 'G2',
    name: t.modules.ashForge.name,
    blurb: t.modules.ashForge.blurb,
    slot: { left: '84%', top: '70%' },
    silhouette: 'cool',
    baseRate: 4,
    baseCost: 150,
    costScale: 1.17,
    unlock: { ashEarned: 600, requires: { id: 'emberPit', level: 10 } },
  },
  {
    id: 'cinderBarracks',
    economyId: 'G3',
    name: t.modules.cinderBarracks.name,
    blurb: t.modules.cinderBarracks.blurb,
    slot: { left: '50%', top: '54%' },
    silhouette: 'rack',
    baseRate: 25,
    baseCost: 1_800,
    costScale: 1.16,
    unlock: { ashEarned: 50_000, requires: { id: 'ashForge', level: 10 } },
  },
  {
    id: 'cinderVault',
    economyId: 'G4',
    name: t.modules.cinderVault.name,
    blurb: t.modules.cinderVault.blurb,
    slot: { left: '14%', top: '70%' },
    silhouette: 'uplink',
    baseRate: 150,
    baseCost: 25_000,
    costScale: 1.15,
    unlock: { ashEarned: 500_000, requires: { id: 'cinderBarracks', level: 10 } },
  },
  {
    id: 'ashWatch',
    economyId: 'G5',
    name: t.modules.ashWatch.name,
    blurb: t.modules.ashWatch.blurb,
    slot: { left: '16%', top: '42%' },
    silhouette: 'relay',
    baseRate: 900,
    baseCost: 200_000,
    costScale: 1.14,
    unlock: { ashEarned: 4_000_000, requires: { id: 'cinderVault', level: 10 } },
  },
  {
    id: 'dominionKeep',
    economyId: 'G6',
    name: t.modules.dominionKeep.name,
    blurb: t.modules.dominionKeep.blurb,
    slot: { left: '68%', top: '36%' },
    silhouette: 'switch',
    baseRate: 5_000,
    baseCost: 1_500_000,
    costScale: 1.13,
    unlock: { ashEarned: 25_000_000, requires: { id: 'ashWatch', level: 10 } },
  },
  {
    id: 'batteryBank',
    economyId: 'G7',
    name: t.modules.batteryBank.name,
    blurb: t.modules.batteryBank.blurb,
    slot: { left: '86%', top: '50%' },
    silhouette: 'battery',
    baseRate: 30_000,
    baseCost: 12_000_000,
    costScale: 1.12,
    unlock: { ashEarned: 150_000_000, requires: { id: 'dominionKeep', level: 10 } },
  },
  {
    id: 'edgeCache',
    economyId: 'G8',
    name: t.modules.edgeCache.name,
    blurb: t.modules.edgeCache.blurb,
    slot: { left: '38%', top: '20%' },
    silhouette: 'cache',
    baseRate: 180_000,
    baseCost: 90_000_000,
    costScale: 1.115,
    unlock: { ashEarned: 1_000_000_000, requires: { id: 'batteryBank', level: 10 } },
  },
  {
    id: 'quantumCooler',
    economyId: 'G9',
    name: t.modules.quantumCooler.name,
    blurb: t.modules.quantumCooler.blurb,
    slot: { left: '12%', top: '22%' },
    silhouette: 'quantum',
    baseRate: 1_100_000,
    baseCost: 700_000_000,
    costScale: 1.11,
    unlock: {
      ashEarned: 8_000_000_000,
      requires: { id: 'edgeCache', level: 10 },
    },
  },
  {
    id: 'packetScrubber',
    economyId: 'G10',
    name: t.modules.packetScrubber.name,
    blurb: t.modules.packetScrubber.blurb,
    slot: { left: '84%', top: '18%' },
    silhouette: 'scrub',
    baseRate: 7_000_000,
    baseCost: 5_000_000_000,
    costScale: 1.105,
    unlock: {
      ashEarned: 50_000_000_000,
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
