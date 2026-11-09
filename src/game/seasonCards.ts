/**
 * Saison-Karten (Jahres-Themen): Nach dem Saisonende wählt der Spieler ab
 * Gartenjahr 4 eines von drei Themen, das genau ein Gartenjahr gilt.
 *
 * Regeln: netto leicht positiv, nie eine Falle — jede Karte zeigt vorher,
 * was sie mit dem Garten der letzten Saison ungefähr gebracht hätte.
 * Angeboten werden nur Karten, deren gestärkter Bereich angelegt war, nie
 * dieselbe Karte zweimal hintereinander.
 */
import { GENERATORS, generatorRate, type GeneratorId } from './generators'

export type SeasonCardId =
  | 'tomatenjahr'
  | 'kompostjahr'
  | 'kraeuterjahr'
  | 'beerenjahr'
  | 'obstjahr'
  | 'bienenjahr'
  | 'huehnerjahr'
  | 'glashausjahr'
  | 'hofladenjahr'
  | 'ruhigesJahr'
  | 'fleissjahr'
  | 'gutesJahr'

export interface SeasonCardDef {
  id: SeasonCardId
  /** Bereich ×boost (und optional ein anderer ×dampen) */
  area?: { boost: GeneratorId; mult: number; dampen?: GeneratorId; dampenMult?: number }
  /** auf die gesamte Garten-Ernte */
  mult?: number
  /** nur auf die Ernte, während du weg bist */
  offline?: number
}

export const SEASON_CARDS: SeasonCardDef[] = [
  { id: 'tomatenjahr', area: { boost: 'gemuesebeet', mult: 2, dampen: 'obstwiese', dampenMult: 0.8 } },
  { id: 'kompostjahr', area: { boost: 'kompost', mult: 2, dampen: 'beerenhecke', dampenMult: 0.8 } },
  { id: 'kraeuterjahr', area: { boost: 'kraeuterspirale', mult: 2, dampen: 'gemuesebeet', dampenMult: 0.8 } },
  { id: 'beerenjahr', area: { boost: 'beerenhecke', mult: 2, dampen: 'kompost', dampenMult: 0.8 } },
  { id: 'obstjahr', area: { boost: 'obstwiese', mult: 1.8, dampen: 'kraeuterspirale', dampenMult: 0.8 } },
  { id: 'bienenjahr', area: { boost: 'bienenstock', mult: 1.8, dampen: 'huehnerstall', dampenMult: 0.8 } },
  { id: 'huehnerjahr', area: { boost: 'huehnerstall', mult: 1.8, dampen: 'bienenstock', dampenMult: 0.8 } },
  { id: 'glashausjahr', area: { boost: 'gewaechshaus', mult: 1.8, dampen: 'beerenhecke', dampenMult: 0.8 } },
  { id: 'hofladenjahr', area: { boost: 'hofladen', mult: 1.8, dampen: 'gewaechshaus', dampenMult: 0.8 } },
  // „Ruhiges Jahr“: aktiv −20 %, weg +50 % (0,8 × 1,875)
  { id: 'ruhigesJahr', mult: 0.8, offline: 1.875 },
  { id: 'fleissjahr', mult: 1.1, offline: 0.6 },
  { id: 'gutesJahr', mult: 1.05 },
]

/** Ab diesem Gartenjahr gibt es Saison-Karten (prestiges nach dem Saisonende). */
export const SEASON_CARDS_FROM_PRESTIGES = 3

export function seasonCardDef(id: string | null | undefined): SeasonCardDef | null {
  return SEASON_CARDS.find((c) => c.id === id) ?? null
}

/** Multiplikator dieses Bereichs durch die aktive Karte. */
export function cardAreaMult(id: string | null, area: GeneratorId): number {
  const c = seasonCardDef(id)
  if (!c?.area) return 1
  if (c.area.boost === area) return c.area.mult
  if (c.area.dampen === area) return c.area.dampenMult ?? 1
  return 1
}

export function cardGlobalMult(id: string | null): number {
  return seasonCardDef(id)?.mult ?? 1
}

export function cardOfflineMult(id: string | null): number {
  return seasonCardDef(id)?.offline ?? 1
}

/**
 * Ungefährer Ertrags-Faktor der Karte mit diesen Bereichs-Stufen (ohne
 * Abwesenheit). Grundlage der Vorschau „≈ +12 %“.
 */
export function cardPreview(id: SeasonCardId, owned: Partial<Record<GeneratorId, number>>): number {
  let base = 0
  let withCard = 0
  for (const def of GENERATORS) {
    const r = generatorRate(def, owned[def.id] ?? 0)
    base += r
    withCard += r * cardAreaMult(id, def.id)
  }
  if (base <= 0) return cardGlobalMult(id)
  return (withCard / base) * cardGlobalMult(id)
}

export interface CardOffer {
  id: SeasonCardId
  /** Faktor mit dem Garten der letzten Saison (1,12 = +12 %) */
  preview: number
}

/**
 * Drei Karten zur Wahl. Gewichtet nach dem letzten Garten: Bereichs-Karten
 * nur, wenn der gestärkte Bereich angelegt war, und nur wenn sie netto
 * nicht schaden (Vorschau ≥ 1). Nie die Karte vom letzten Jahr.
 */
export function offerSeasonCards(
  owned: Partial<Record<GeneratorId, number>>,
  last: string | null,
  rng = Math.random,
): CardOffer[] {
  const pool = SEASON_CARDS.filter((c) => c.id !== last)
    .filter((c) => !c.area || (owned[c.area.boost] ?? 0) > 0)
    .map((c) => ({ id: c.id, preview: cardPreview(c.id, owned) }))
    // keine Falle: aktiv mindestens gleich, außer bei „Ruhiges Jahr“ (zahlt sich offline aus)
    .filter((o) => o.preview >= 1 || o.id === 'ruhigesJahr')
  const out: CardOffer[] = []
  const left = [...pool]
  while (out.length < 3 && left.length > 0) {
    // stärkere Vorschau etwas wahrscheinlicher
    const weights = left.map((o) => Math.max(0.2, o.preview))
    const sum = weights.reduce((a, b) => a + b, 0)
    let roll = rng() * sum
    let i = 0
    while (i < left.length - 1 && roll >= weights[i]) {
      roll -= weights[i]
      i++
    }
    out.push(left[i])
    left.splice(i, 1)
  }
  return out
}
