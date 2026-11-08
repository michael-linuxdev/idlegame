/**
 * Saatgut kreuzen: pick two found Pflanzenbuch-Sorten, wait CROSS_MS (real
 * time, runs offline too) and harvest the seed. If the two sorts come from
 * the areas of a Kreuzung not found yet, that Kreuzung is born (+2 % Ernte
 * for good). Any other pair still gives a few Samen.
 */
import { GARDEN_VARIETIES, VARIETIES } from './gardenLife'
import type { GeneratorId } from './generators'

export type HybridId =
  | 'kraeutertomate'
  | 'riesentomate'
  | 'feuerpaprika'
  | 'jostabeere'
  | 'beerenapfel'
  | 'apfelquitte'
  | 'honigbirne'
  | 'lavendelhonig'
  | 'sonnenthymian'
  | 'feigenpflaume'
  | 'goldkuerbis'
  | 'goldhumus'

export interface HybridDef {
  id: HybridId
  areas: [GeneratorId, GeneratorId]
}

export const HYBRIDS: HybridDef[] = [
  { id: 'kraeutertomate', areas: ['gemuesebeet', 'kraeuterspirale'] },
  { id: 'riesentomate', areas: ['gemuesebeet', 'kompost'] },
  { id: 'feuerpaprika', areas: ['gemuesebeet', 'gewaechshaus'] },
  { id: 'jostabeere', areas: ['beerenhecke', 'beerenhecke'] },
  { id: 'beerenapfel', areas: ['obstwiese', 'beerenhecke'] },
  { id: 'apfelquitte', areas: ['obstwiese', 'obstwiese'] },
  { id: 'honigbirne', areas: ['obstwiese', 'bienenstock'] },
  { id: 'lavendelhonig', areas: ['kraeuterspirale', 'bienenstock'] },
  { id: 'sonnenthymian', areas: ['kraeuterspirale', 'orangerie'] },
  { id: 'feigenpflaume', areas: ['obstwiese', 'orangerie'] },
  { id: 'goldkuerbis', areas: ['hofladen', 'gewaechshaus'] },
  { id: 'goldhumus', areas: ['kompost', 'huehnerstall'] },
]

export const HYBRID_IDS: HybridId[] = HYBRIDS.map((h) => h.id)
export const CROSS_MS = 4 * 3600_000
export const CROSS_SKIP_SAMEN = 15
export const CROSS_MISS_SAMEN = 5
export const HYBRID_BONUS = 0.02

export interface Crossing {
  a: string
  b: string
  endsAt: number
}

/** Kreuzen opens once two garden sorts are in the Pflanzenbuch. */
export function crossingUnlocked(collection: readonly string[]): boolean {
  return GARDEN_VARIETIES.filter((v) => collection.includes(v.id)).length >= 2
}

/** Which not-yet-found Kreuzung the pair would give (null = Zufallssaat). */
export function hybridFor(a: string, b: string, found: readonly string[]): HybridId | null {
  const va = VARIETIES.find((v) => v.id === a)
  const vb = VARIETIES.find((v) => v.id === b)
  if (!va || !vb || a === b) return null
  for (const h of HYBRIDS) {
    if (found.includes(h.id)) continue
    const [x, y] = h.areas
    if ((va.module === x && vb.module === y) || (va.module === y && vb.module === x)) return h.id
  }
  return null
}

export function hybridsMult(found: readonly string[]): number {
  return 1 + HYBRID_BONUS * HYBRID_IDS.filter((id) => found.includes(id)).length
}

export function parseHybrids(raw: unknown): HybridId[] {
  return Array.isArray(raw) ? HYBRID_IDS.filter((id) => raw.includes(id)) : []
}

export function parseCrossing(raw: unknown): Crossing | null {
  if (raw == null || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (typeof r.a !== 'string' || typeof r.b !== 'string' || typeof r.endsAt !== 'number') return null
  if (!VARIETIES.some((v) => v.id === r.a) || !VARIETIES.some((v) => v.id === r.b)) return null
  return { a: r.a, b: r.b, endsAt: r.endsAt }
}
