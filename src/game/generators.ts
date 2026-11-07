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
  /** Lifetime Ash earned this run */
  ashEarned?: number
  /** Prior building at least this level (OR with ashEarned) */
  requires?: { id: GeneratorId; level: number }
}

export interface GeneratorDef {
  id: GeneratorId
  name: string
  blurb: string
  /** Fixed slot on the fortress map (percent of map box) */
  slot: { left: string; top: string }
  /** CSS building silhouette variant */
  silhouette: SilhouetteKind
  /** Base cost in Ash */
  baseCost: number
  /** Ash produced per second per owned unit */
  baseRate: number
  /** Cost multiplier per owned unit */
  costScale: number
  /** Unlock gate — start buildings omit / empty */
  unlock?: UnlockGate
}

/**
 * Bau-Map v2 — six fixed slots.
 * Rates/costs extend the existing MVP curve (not a rewrite of economy formulas).
 * Economy FTUE worker may retune numbers / IDs later — rebase if they land first.
 */
export const GENERATORS: GeneratorDef[] = [
  {
    id: 'emberPit',
    name: 'Ash Hearth',
    blurb: 'A banked sacrificial fire that distills ash essence.',
    slot: { left: '48%', top: '72%' },
    silhouette: 'hearth',
    baseCost: 15,
    baseRate: 0.1,
    costScale: 1.15,
  },
  {
    id: 'ashForge',
    name: 'Bone Mill',
    blurb: 'Fallen fodder ground into fuel for the legion.',
    slot: { left: '74%', top: '54%' },
    silhouette: 'mill',
    baseCost: 100,
    baseRate: 1,
    costScale: 1.15,
    unlock: { ashEarned: 40, requires: { id: 'emberPit', level: 5 } },
  },
  {
    id: 'cinderBarracks',
    name: 'Legion Altar',
    blurb: 'Ritual stone where the ash legion binds power.',
    slot: { left: '52%', top: '36%' },
    silhouette: 'altar',
    baseCost: 1100,
    baseRate: 8,
    costScale: 1.15,
    unlock: { ashEarned: 500, requires: { id: 'ashForge', level: 8 } },
  },
  {
    id: 'cinderVault',
    name: 'Cinder Vault',
    blurb: 'Sealed crypts that compound banked ash into dominion fuel.',
    slot: { left: '20%', top: '56%' },
    silhouette: 'vault',
    baseCost: 12000,
    baseRate: 55,
    costScale: 1.14,
    unlock: { ashEarned: 5000, requires: { id: 'cinderBarracks', level: 8 } },
  },
  {
    id: 'ashWatch',
    name: 'Ash Watch',
    blurb: 'A scorched tower that scouts the plain and stokes the forges.',
    slot: { left: '24%', top: '30%' },
    silhouette: 'watch',
    baseCost: 130000,
    baseRate: 350,
    costScale: 1.14,
    unlock: { ashEarned: 40000, requires: { id: 'cinderVault', level: 8 } },
  },
  {
    id: 'dominionKeep',
    name: 'Dominion Keep',
    blurb: 'The citadel heart — iron and cinder where the Regent rules.',
    slot: { left: '62%', top: '18%' },
    silhouette: 'keep',
    baseCost: 1400000,
    baseRate: 2200,
    costScale: 1.13,
    unlock: { ashEarned: 250000, requires: { id: 'ashWatch', level: 8 } },
  },
]

export const GENERATOR_IDS: GeneratorId[] = GENERATORS.map((g) => g.id)

export function generatorCost(def: GeneratorDef, owned: number): number {
  return Math.floor(def.baseCost * Math.pow(def.costScale, owned))
}

export function isGeneratorUnlocked(
  def: GeneratorDef,
  ashEarned: number,
  owned: Record<GeneratorId, number>,
): boolean {
  if (!def.unlock) return true
  const { ashEarned: needAsh, requires } = def.unlock
  if (needAsh != null && ashEarned >= needAsh) return true
  if (requires && (owned[requires.id] ?? 0) >= requires.level) return true
  return false
}

export function unlockHint(def: GeneratorDef): string {
  if (!def.unlock) return ''
  const parts: string[] = []
  if (def.unlock.ashEarned != null) {
    parts.push(`${def.unlock.ashEarned.toLocaleString()} Ash earned`)
  }
  if (def.unlock.requires) {
    const prior = GENERATORS.find((g) => g.id === def.unlock!.requires!.id)
    parts.push(
      `${prior?.name ?? def.unlock.requires.id} Lv ${def.unlock.requires.level}`,
    )
  }
  return parts.length ? `Unlock: ${parts.join(' or ')}` : ''
}
