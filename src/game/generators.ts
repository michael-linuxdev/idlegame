/**
 * Module definitions — Bau-Map content depth (10 slots) + Kosten-/Ertragsformeln (Balance: ROADMAP.md).
 * Display names come from src/theme/strings.ts (DE).
 *
 * Garden ladder (G1 → G10): Gemüsebeet, Kompost, Kräuterspirale, Beerenhecke,
 * Obstwiese, Bienenstock, Hühnerstall, Gewächshaus, Hofladen, Orangerie.
 */

import { t } from '../i18n'
import { formatAsh } from './format'
import { LEVEL_MODULE_GATES } from './progression'

export type GeneratorId =
  | 'gemuesebeet'
  | 'kompost'
  | 'kraeuterspirale'
  | 'beerenhecke'
  | 'obstwiese'
  | 'bienenstock'
  | 'huehnerstall'
  | 'gewaechshaus'
  | 'hofladen'
  | 'orangerie'


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
  /**
   * Gartenjahr gate (hard, AND): Saisonenden completed before this corner of
   * Omas garden can be cleared at all. Paces content across seasons.
   */
  seasons?: number
  /** Lifetime Compute earned this run (economy Ash) */
  ernteSeason?: number
  /** Prior module at least this level (OR with ernteSeason) */
  requires?: { id: GeneratorId; level: number }
}

export interface GeneratorDef {
  id: GeneratorId
  economyId: EconomyId
  name: string
  blurb: string
  /** Omas Notizbuch quote for this module */
  note: string
  /** Plot centre on the garden map (percent of map box) */
  slot: { left: string; top: string }
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
 * unlock ernte ≈ ×3–6 (G1 mild steepen only; Day-1 first upgrade still free).
 */
export const GENERATORS: GeneratorDef[] = [
  {
    id: 'gemuesebeet',
    economyId: 'G1',
    name: t.modules.gemuesebeet.name,
    blurb: t.modules.gemuesebeet.blurb,
    note: t.modules.gemuesebeet.note,
    /* Plot lattice: zig-zag along the garden path, gate (bottom) → Laube (top). See theme/MapBackdrop. */
    slot: { left: '34%', top: '84%' },
    baseRate: 1,
    baseCost: 20,
    costScale: 1.18,
  },
  {
    id: 'kompost',
    economyId: 'G2',
    name: t.modules.kompost.name,
    blurb: t.modules.kompost.blurb,
    note: t.modules.kompost.note,
    slot: { left: '74%', top: '80%' },
    baseRate: 4,
    baseCost: 150,
    costScale: 1.17,
    unlock: { ernteSeason: 600, requires: { id: 'gemuesebeet', level: 10 } },
  },
  {
    id: 'kraeuterspirale',
    economyId: 'G3',
    name: t.modules.kraeuterspirale.name,
    blurb: t.modules.kraeuterspirale.blurb,
    note: t.modules.kraeuterspirale.note,
    slot: { left: '20%', top: '71%' },
    baseRate: 25,
    baseCost: 1_800,
    costScale: 1.16,
    unlock: { ernteSeason: 50_000, requires: { id: 'kompost', level: 10 } },
  },
  {
    id: 'beerenhecke',
    economyId: 'G4',
    name: t.modules.beerenhecke.name,
    blurb: t.modules.beerenhecke.blurb,
    note: t.modules.beerenhecke.note,
    slot: { left: '62%', top: '68%' },
    baseRate: 150,
    baseCost: 25_000,
    costScale: 1.15,
    unlock: { ernteSeason: 500_000, requires: { id: 'kraeuterspirale', level: 10 } },
  },
  {
    id: 'obstwiese',
    economyId: 'G5',
    name: t.modules.obstwiese.name,
    blurb: t.modules.obstwiese.blurb,
    note: t.modules.obstwiese.note,
    slot: { left: '30%', top: '58%' },
    baseRate: 900,
    baseCost: 200_000,
    costScale: 1.14,
    unlock: { seasons: 1, ernteSeason: 4_000_000, requires: { id: 'beerenhecke', level: 10 } },
  },
  {
    id: 'bienenstock',
    economyId: 'G6',
    name: t.modules.bienenstock.name,
    blurb: t.modules.bienenstock.blurb,
    note: t.modules.bienenstock.note,
    slot: { left: '76%', top: '55%' },
    baseRate: 5_000,
    baseCost: 1_500_000,
    costScale: 1.13,
    unlock: { seasons: 2, ernteSeason: 25_000_000, requires: { id: 'obstwiese', level: 10 } },
  },
  {
    id: 'huehnerstall',
    economyId: 'G7',
    name: t.modules.huehnerstall.name,
    blurb: t.modules.huehnerstall.blurb,
    note: t.modules.huehnerstall.note,
    slot: { left: '20%', top: '45%' },
    baseRate: 30_000,
    baseCost: 12_000_000,
    costScale: 1.12,
    unlock: { seasons: 4, ernteSeason: 150_000_000, requires: { id: 'bienenstock', level: 10 } },
  },
  {
    id: 'gewaechshaus',
    economyId: 'G8',
    name: t.modules.gewaechshaus.name,
    blurb: t.modules.gewaechshaus.blurb,
    note: t.modules.gewaechshaus.note,
    slot: { left: '62%', top: '42%' },
    baseRate: 180_000,
    baseCost: 90_000_000,
    costScale: 1.115,
    unlock: { seasons: 6, ernteSeason: 1_000_000_000, requires: { id: 'huehnerstall', level: 10 } },
  },
  {
    id: 'hofladen',
    economyId: 'G9',
    name: t.modules.hofladen.name,
    blurb: t.modules.hofladen.blurb,
    note: t.modules.hofladen.note,
    slot: { left: '27%', top: '32%' },
    baseRate: 1_100_000,
    baseCost: 700_000_000,
    costScale: 1.11,
    unlock: { seasons: 9,
      ernteSeason: 8_000_000_000,
      requires: { id: 'gewaechshaus', level: 10 },
    },
  },
  {
    id: 'orangerie',
    economyId: 'G10',
    name: t.modules.orangerie.name,
    blurb: t.modules.orangerie.blurb,
    note: t.modules.orangerie.note,
    slot: { left: '72%', top: '30%' },
    baseRate: 7_000_000,
    baseCost: 5_000_000_000,
    costScale: 1.105,
    unlock: { seasons: 12,
      ernteSeason: 50_000_000_000,
      requires: { id: 'hofladen', level: 10 },
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
 * Meilenstein-Sprünge: every listed level doubles that area's Ernte. Gives a
 * visible goal inside each season (×2 at 25, 50, 100 …) instead of a flat
 * +2 % per ten levels.
 */
export const MILESTONE_LEVELS = [25, 50, 100, 150, 200, 300, 400, 500, 750, 1000] as const
export const MILESTONE_FACTOR = 2

export function milestonesReached(level: number): number {
  let n = 0
  for (const m of MILESTONE_LEVELS) if (level >= m) n += 1
  return n
}

export function milestoneMult(level: number): number {
  return Math.pow(MILESTONE_FACTOR, milestonesReached(level))
}

/** Next Meilenstein level above `level`, or null when all are reached. */
export function nextMilestone(level: number): { at: number; from: number } | null {
  let from = 0
  for (const m of MILESTONE_LEVELS) {
    if (level < m) return { at: m, from }
    from = m
  }
  return null
}

/**
 * Production at level n (n ≥ 1):
 * R(n) = r0 · n · 2^(Meilensteine erreicht)
 */
export function generatorRate(def: GeneratorDef, owned: number): number {
  if (owned <= 0) return 0
  return def.baseRate * owned * milestoneMult(owned)
}

export function isGeneratorUnlocked(
  def: GeneratorDef,
  ernteSeason: number,
  owned: Record<GeneratorId, number>,
  firstBeacon = false,
  playerLevel = 1,
  prestiges = 0,
): boolean {
  if (!def.unlock) return true
  if ((def.unlock.seasons ?? 0) > prestiges) return false
  if (firstBeacon && def.id === 'kompost') return true
  const { ernteSeason: needAsh, requires } = def.unlock
  if (needAsh != null && ernteSeason >= needAsh) return true
  if (requires && (owned[requires.id] ?? 0) >= requires.level) return true
  const levelGate = LEVEL_MODULE_GATES[def.id]
  if (levelGate != null && playerLevel >= levelGate) {
    // Spieler-Level may substitute for ernte / prior-level gates mid-run, but
    // the prior module must already be online. Otherwise Soft-Prestige leaves
    // mid-ladder husks "unlocked" at six-figure costs while G1 is the only
    // real buy — classic "kann nicht ausbauen" with a disabled CTA.
    if (!requires || (owned[requires.id] ?? 0) >= 1) return true
  }
  return false
}

/** Legacy helper */
export function isUnlocked(
  def: GeneratorDef,
  ernteSeason: number,
  firstFlame: boolean,
  owned: Record<GeneratorId, number> = {} as Record<GeneratorId, number>,
  playerLevel = 1,
  prestiges = 0,
): boolean {
  return isGeneratorUnlocked(def, ernteSeason, owned, firstFlame, playerLevel, prestiges)
}

/** Gartenjahr still missing for this corner (0 = no season gate left). */
export function seasonsMissing(def: GeneratorDef, prestiges: number): number {
  return Math.max(0, (def.unlock?.seasons ?? 0) - prestiges)
}

export function unlockHint(def: GeneratorDef, prestiges = 0): string {
  if (!def.unlock) return ''
  if (seasonsMissing(def, prestiges) > 0) {
    return t.unlock.seasonGate(def.unlock.seasons! + 1)
  }
  const parts: string[] = []
  if (def.unlock.ernteSeason != null) {
    parts.push(
      t.unlock.computeEarned(def.unlock.ernteSeason.toLocaleString('de-DE')),
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
export function shortUnlockGate(def: GeneratorDef, prestiges = 0): string {
  if (!def.unlock) return t.hud.locked
  if (seasonsMissing(def, prestiges) > 0) return t.unlock.seasonShort(def.unlock.seasons! + 1)
  if (def.unlock.ernteSeason != null) {
    return t.hud.gateCompute(formatAsh(def.unlock.ernteSeason).replace(/,0+(?=\D|$)/, ''))
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
