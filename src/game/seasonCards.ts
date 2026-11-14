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
  // Runde 4: offline 0,6 → 0,9 (mit Abwesenheit gerechnet war es für jeden Spieler eine Falle)
  { id: 'fleissjahr', mult: 1.1, offline: 0.9 },
  { id: 'gutesJahr', mult: 1.05 },
]

/** Ab diesem Gartenjahr gibt es Saison-Karten (saisonenden nach dem Saisonende). */
export const SEASON_CARDS_FROM_PRESTIGES = 3

export function seasonCardDef(id: string | null | undefined): SeasonCardDef | null {
  return SEASON_CARDS.find((c) => c.id === id) ?? null
}

/**
 * Ausbau statt Ertrag (Runde 4, nach Nutzerentscheid): Eine Bereichs-Karte
 * macht den Ausbau ihres Bereichs billiger und den des Gegenspielers teurer,
 * statt den Ertrag zu ändern. So lohnt sie genau für den Bereich, den man
 * diese Saison hochziehen will. Gilt für Karten, die nach dem Update gewählt
 * werden (GameState.seasonCardAusbau); eine schon laufende Karte behält die
 * alte Ertrags-Regel.
 */
export const CARD_AUSBAU = { discount: 0.3, surcharge: 0, minPreview: 1.03 }

/*
 * 2026-11-14 (Playtest Tester 1: „Wirkung schwer einzuschätzen, keine Lust auf
 * Commitment“): kein Gegenspieler mehr (surcharge 0), dafür −30 % statt −40 %
 * — im Simulator gleicher Takt (docs/kapitel/balance-bericht.md). Dazu Omas Tipp
 * (bestCardOffer) und ein kostenloser Wechsel in den ersten Minuten (CARD_SWITCH_MS).
 */

/** So lange nach der Wahl lässt sich das Thema einmal kostenlos wechseln. */
export const CARD_SWITCH_MS = 5 * 60_000

/** Kosten-Faktor eines Bereichs durch die aktive Karte (nur Ausbau-Regel). */
export function cardCostMult(id: string | null, area: GeneratorId, ausbau: boolean): number {
  if (!ausbau) return 1
  const c = seasonCardDef(id)
  if (!c?.area) return 1
  if (c.area.boost === area) return 1 - CARD_AUSBAU.discount
  if (c.area.dampen === area) return 1 + CARD_AUSBAU.surcharge
  return 1
}

/**
 * Wofür die Ernte einer Saison ausgegeben wurde: Summe der Ausbaukosten bis
 * zur erreichten Stufe je Bereich (Anteile, ohne Rabatte — gleich für alle Karten).
 */
export function spendShares(owned: Partial<Record<GeneratorId, number>>): Map<GeneratorId, number> {
  const spent = new Map<GeneratorId, number>()
  let total = 0
  for (const def of GENERATORS) {
    const n = owned[def.id] ?? 0
    const sum = n > 0 ? (def.baseCost * (Math.pow(def.costScale, n) - 1)) / (def.costScale - 1) : 0
    spent.set(def.id, sum)
    total += sum
  }
  if (total > 0) for (const [k, v] of spent) spent.set(k, v / total)
  return spent
}

/** Ausbau-Regel: Anteil der Ausbaukosten, den die Karte mit diesem Garten gespart hätte (negativ = teurer). */
export function cardSaving(id: SeasonCardId, owned: Partial<Record<GeneratorId, number>>): number {
  const c = seasonCardDef(id)
  if (!c?.area) return 0
  const sh = spendShares(owned)
  return CARD_AUSBAU.discount * (sh.get(c.area.boost) ?? 0) - (c.area.dampen ? CARD_AUSBAU.surcharge * (sh.get(c.area.dampen) ?? 0) : 0)
}

/** Multiplikator dieses Bereichs durch die aktive Karte (Ausbau-Regel: kein Ertrags-Faktor). */
export function cardAreaMult(id: string | null, area: GeneratorId, ausbau = false): number {
  if (ausbau) return 1
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
  /** Faktor mit dem Garten der letzten Saison (1,12 = +12 %); Ausbau-Regel: gleichwertiger Faktor 1 / (1 − Ersparnis) */
  preview: number
  /** Bereichs-Karte nach der Ausbau-Regel (fehlt bei älteren Angeboten = alte Ertrags-Regel) */
  ausbau?: boolean
  /** Ernte der Saison, nach der das Angebot kam (für „≈ 1,2 Mrd gespart“); fehlt bei älteren Angeboten */
  ernte?: number
}

/** Was die Karte mit dem letzten Garten gebracht hätte: Anteil gesparter Ausbaukosten bzw. mehr Ernte (beim Spielen). */
export function offerValue(o: CardOffer): number {
  return o.ausbau ? 1 - 1 / o.preview : o.preview - 1
}

/** Omas Tipp: die Karte, die mit dem letzten Garten am meisten gebracht hätte (nie „Ruhiges Jahr“). */
export function bestCardOffer(offer: CardOffer[]): SeasonCardId | null {
  let best: CardOffer | null = null
  for (const o of offer) {
    if (o.id === 'ruhigesJahr' || offerValue(o) <= 0) continue
    if (!best || offerValue(o) > offerValue(best)) best = o
  }
  return best?.id ?? null
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
  ernte?: number,
): CardOffer[] {
  const pool = SEASON_CARDS.filter((c) => c.id !== last)
    .filter((c) => !c.area || (owned[c.area.boost] ?? 0) > 0)
    .map((c) => (c.area ? { id: c.id, preview: 1 / (1 - cardSaving(c.id, owned)), ausbau: true } : { id: c.id, preview: cardPreview(c.id, owned) }))
    // keine Falle: aktiv mindestens gleich, außer bei „Ruhiges Jahr“ (zahlt sich offline aus);
    // Ausbau-Karten nur, wenn sie mit diesem Garten etwas bringen (keine toten Optionen)
    .filter((o) => (o.preview >= 1 && (!('ausbau' in o) || o.preview >= CARD_AUSBAU.minPreview)) || o.id === 'ruhigesJahr')
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
  return ernte != null && ernte > 0 ? out.map((o) => ({ ...o, ernte })) : out
}
