/**
 * Third prestige layer — Generationen.
 *
 * After a few Tiefe Winter the garden can be handed down: Gartenjahre,
 * Erbstücke, Omas Truhe, Sprösslinge and the Sprösslings-Laden reset; the
 * family earns Vermächtnis. Vermächtnis buys slowly growing boosts with no
 * upper limit (linear cost, linear effect → always one more rank).
 *
 * The Streuobstwiese, Pflanzenbuch, Samen, Gartenstile, Gärtnerstufe and the
 * Gartenhelfer stay with the family.
 */

/** Tiefe Winter needed before the first hand-down … */
export const GENERATION_GATE_DEEP = 3

/** … plus one more for every generation already handed down (3, 4, 5 …). */
export function generationGate(generation: number): number {
  return GENERATION_GATE_DEEP + Math.max(0, generation)
}

export type LegacyId = 'familie' | 'obstbau' | 'wurzelwerk' | 'daumen' | 'hausrezept'

export type LegacyUpgrades = Record<LegacyId, number>

export const EMPTY_LEGACY: LegacyUpgrades = {
  familie: 0,
  obstbau: 0,
  wurzelwerk: 0,
  daumen: 0,
  hausrezept: 0,
}

export interface LegacyItem {
  id: LegacyId
  /** Vermächtnis for the next rank — linear, never capped */
  cost: (rank: number) => number
}

export const LEGACY_SHOP: LegacyItem[] = [
  { id: 'familie', cost: (r) => 2 + r },
  { id: 'obstbau', cost: (r) => 2 + r },
  { id: 'wurzelwerk', cost: (r) => 3 + 2 * r },
  { id: 'hausrezept', cost: (r) => 2 + 2 * r },
  { id: 'daumen', cost: (r) => 4 + 2 * r },
]

export function canHandDown(tiefeWinter: number, generation = 0): boolean {
  return tiefeWinter >= generationGate(generation)
}

/**
 * Vermächtnis for handing the garden down now: grows with every Tiefer
 * Winter beyond the gate and with the orchard's size.
 */
export function legacyPayout(tiefeWinter: number, orchardLevels: number, generation = 0): number {
  if (!canHandDown(tiefeWinter, generation)) return 0
  const over = tiefeWinter - generationGate(generation) + 1
  return Math.floor(3 * Math.pow(over, 1.25)) + Math.floor(orchardLevels / 100)
}

/** Familiensinn — +15 % garden Ernte per rank. */
export function legacyGardenMult(l: LegacyUpgrades): number {
  return 1 + 0.15 * l.familie
}

/** Obstbautradition — +25 % Obst per rank. */
export function legacyOrchardMult(l: LegacyUpgrades): number {
  return 1 + 0.25 * l.obstbau
}

/** Wurzelwerk — +10 % Sprösslinge per rank. */
export function legacySproutMult(l: LegacyUpgrades): number {
  return 1 + 0.1 * l.wurzelwerk
}

/** Hausrezept — +10 % Gießen per rank. */
export function legacyWaterMult(l: LegacyUpgrades): number {
  return 1 + 0.1 * l.hausrezept
}

/** Grüner Daumen — every rank makes all Ausbauten 3 % cheaper (multiplicative). */
export function legacyCostMult(l: LegacyUpgrades): number {
  return Math.pow(0.97, l.daumen)
}
