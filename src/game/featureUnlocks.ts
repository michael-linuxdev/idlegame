/**
 * Systeme nach und nach freischalten — eine zentrale Liste.
 *
 * Ziel: In der ersten Sitzung nur Ernte, Ziel, Gießen und Menü (höchstens
 * 2 Ereignis-Pillen), danach etwa ein neues System pro Sitzung bzw.
 * Gartenjahr. Wer schon einen Tiefen Winter oder eine Generation hat, sieht
 * alles. Bestehende Spielstände bekommen ihren Sitzungszähler aus dem
 * Fortschritt (storage.ts), verlieren also nichts, was sie schon kannten.
 */
import { crossingUnlocked } from './crossing'
import { decorUnlocked } from './decor'

export type FeatureId =
  | 'events'
  | 'recipe'
  | 'fest'
  | 'weather'
  | 'clan'
  | 'decor'
  | 'album'
  | 'cross'
  | 'projects'

export interface FeatureCtx {
  saisonenden: number
  tiefeWinter: number
  generation: number
  sessions: number
  owned: Partial<Record<string, number>>
  collection: readonly string[]
  openChapters: number
  /** Was der Spieler laut Spielstand schon benutzt hat — bleibt immer offen */
  used?: ReadonlySet<FeatureId>
}

/** Spuren früherer Nutzung im Spielstand (für bestehende Spieler). */
export function usedFeatures(s: {
  festBought: Record<string, number>
  weatherDecided: string
  contestKg: number
  recipe: { dish: number }
}): Set<FeatureId> {
  const out = new Set<FeatureId>()
  if (Object.keys(s.festBought).length > 0) out.add('fest')
  if (s.weatherDecided) out.add('weather')
  if (s.contestKg > 0) out.add('clan')
  if (s.recipe.dish > 0) out.add('recipe')
  return out
}

/** Fortschritt in „Schritten“: jede weitere Sitzung oder jedes Gartenjahr zählt. */
export function featureStep(c: FeatureCtx): number {
  if (c.tiefeWinter > 0 || c.generation > 0) return 99
  return Math.max(c.sessions - 1, c.saisonenden)
}

interface FeatureDef {
  id: FeatureId
  open: (c: FeatureCtx, step: number) => boolean
}

/** Reihenfolge = Reihenfolge, in der neue Spieler sie kennenlernen. */
export const FEATURES: FeatureDef[] = [
  // Ereignis-Pillen erst, wenn der Kompost wächst (erste Minuten ruhig)
  { id: 'events', open: (c, step) => step >= 1 || (c.owned.kompost ?? 0) > 0 },
  { id: 'recipe', open: (_c, step) => step >= 1 },
  { id: 'fest', open: (_c, step) => step >= 2 },
  { id: 'weather', open: (_c, step) => step >= 3 },
  { id: 'clan', open: (_c, step) => step >= 4 },
  { id: 'decor', open: (c) => decorUnlocked(c) },
  { id: 'album', open: (c) => c.saisonenden >= 1 || c.tiefeWinter > 0 || c.generation > 0 },
  { id: 'cross', open: (c) => crossingUnlocked(c.collection) },
  { id: 'projects', open: (c) => c.openChapters > 0 },
]

export function openFeatures(c: FeatureCtx): Set<FeatureId> {
  const step = featureStep(c)
  return new Set(FEATURES.filter((f) => f.open(c, step) || c.used?.has(f.id)).map((f) => f.id))
}

/* —————— „Neu“-Abzeichen: bis zur ersten Nutzung —————— */

export const FEATURES_SEEN_KEY = 'gartenerbe-features-seen-v1'

/** Systeme mit eigenem Menüpunkt bekommen ein „Neu“-Abzeichen. */
export const MENU_FEATURES: FeatureId[] = ['clan', 'decor', 'album', 'cross', 'projects']

export function loadFeaturesSeen(): FeatureId[] | null {
  try {
    const raw = localStorage.getItem(FEATURES_SEEN_KEY)
    if (raw == null) return null
    const arr = JSON.parse(raw) as unknown
    return Array.isArray(arr) ? (arr.filter((x) => typeof x === 'string') as FeatureId[]) : []
  } catch {
    return []
  }
}

export function saveFeaturesSeen(ids: readonly FeatureId[]): void {
  try {
    localStorage.setItem(FEATURES_SEEN_KEY, JSON.stringify(ids))
  } catch {
    /* ignore */
  }
}

/**
 * Erster Start mit dieser Version: Was ein bestehender Spieler schon offen
 * hat, gilt als bekannt (kein Abzeichen, kein Hinweis). Neue Spieler
 * starten leer.
 */
export function initialFeaturesSeen(c: FeatureCtx, stored: FeatureId[] | null): FeatureId[] {
  if (stored) return stored
  const veteran = c.sessions > 1 || c.saisonenden > 0 || c.tiefeWinter > 0 || c.generation > 0
  return veteran ? [...openFeatures(c)] : []
}

/* —————— Gemeinsamer Speicher für Karte und Menü —————— */

let seenCache: FeatureId[] | null = null
const seenListeners = new Set<() => void>()

/** Load once (seeding veterans), then shared by every component. */
export function ensureFeaturesSeen(c: FeatureCtx): FeatureId[] {
  if (seenCache) return seenCache
  const stored = loadFeaturesSeen()
  seenCache = initialFeaturesSeen(c, stored)
  if (!stored) saveFeaturesSeen(seenCache)
  return seenCache
}

export function getFeaturesSeen(): FeatureId[] {
  return seenCache ?? []
}

export function subscribeFeaturesSeen(cb: () => void): () => void {
  seenListeners.add(cb)
  return () => {
    seenListeners.delete(cb)
  }
}

export function markFeatureSeen(id: FeatureId): void {
  const cur = seenCache ?? []
  if (cur.includes(id)) return
  seenCache = [...cur, id]
  saveFeaturesSeen(seenCache)
  seenListeners.forEach((l) => l())
}

