/**
 * Kapitel-Meisterschaft — ein Ziel für die Zeit nach Kapitel 50
 * (Konzept und Messung: docs/nach-kapitel-50.md).
 *
 * Drei Meister-Sterne je Kapitel; es zählt immer der **schwächste** der zehn
 * Bereiche:
 *  ★   Ausbau  — alle Bereiche auf Stufe 100 (dritter Meilenstein)
 *  ★★  Pflege  — alle Bereiche „Wachsen“ und „Sparen“ mindestens auf Rang 5
 *  ★★★ Meister — alle Bereiche voll gepflegt (beide Ränge 10)
 * Die Sterne kommen der Reihe nach (★★ setzt ★ voraus). Jeder Stern gibt dem
 * Kapitel +5 % Ertrag in seiner eigenen Währung, höchstens +15 %.
 *
 * Warum Pflege und nicht höhere Stufen: Kapitel-Stufen laufen im Simulator
 * schnell auf ein gemeinsames Niveau (≈ 130–180, je nach Gesamt-Bonus), das
 * für alle Kapitel gleich ist — eine Stufen-Schwelle wäre ein globaler
 * Zähler, kein Ziel je Kapitel. Kapitel-Pflege kauft nur der Spieler selbst
 * (Ilse nicht), sie ist je Kapitel und bleibt für immer.
 *
 * Kein eigenes Spielstand-Feld: Die Sterne folgen allein aus Kapitel-Stufen
 * und -Pflege (`chapters[id].owned` / `.care`), die nie zurückgesetzt werden.
 * Alte Spielstände bekommen ihre Sterne deshalb sofort und verlustfrei.
 */
import { CHAPTERS, CHAPTER_CARE_MAX, careOf, type ChapterDef, type ChapterState, type ChaptersState } from './chapters'

export type MasteryKind = 'level' | 'care'

/** Bedingung je Stern: Stufe aller Bereiche bzw. Mindest-Rang beider Pflege-Arten. */
export const MASTERY_STEPS: readonly { kind: MasteryKind; need: number }[] = [
  { kind: 'level', need: 100 },
  { kind: 'care', need: 5 },
  { kind: 'care', need: CHAPTER_CARE_MAX },
]
export const MASTERY_MAX = MASTERY_STEPS.length
/** Ertrag des Kapitels je Stern (in der Kapitel-Währung); der Balance-Simulator kann ihn überschreiben (MASTERY_PER_STAR). */
export const MASTERY_BONUS = { perStar: 0.05 }

/** Erfüllt ein Bereich die Bedingung eines Sterns? */
function areaMeets(c: ChapterState, areaId: string, step: { kind: MasteryKind; need: number }): boolean {
  if (step.kind === 'level') return (c.owned[areaId] ?? 0) >= step.need
  const care = careOf(c, areaId)
  return (c.owned[areaId] ?? 0) >= 1 && Math.min(care.grow, care.thrift) >= step.need
}

/** Meister-Sterne eines Kapitels (0 … 3); geschlossene Kapitel haben keine. */
export function masteryStars(def: ChapterDef, c: ChapterState): number {
  if (c.openedAt <= 0) return 0
  let stars = 0
  for (const step of MASTERY_STEPS) {
    if (!def.areas.every((a) => areaMeets(c, a.id, step))) break
    stars += 1
  }
  return stars
}

/** Faktor auf den Kapitel-Ertrag (1 … 1,15). */
export function masteryMult(stars: number): number {
  return 1 + MASTERY_BONUS.perStar * Math.max(0, Math.min(MASTERY_MAX, Math.floor(stars)))
}

export interface MasteryProgress {
  stars: number
  /** Bedingung für den nächsten Stern, `null` wenn alle drei da sind */
  next: { kind: MasteryKind; need: number } | null
  /** Bereiche, die diese Bedingung schon erfüllen */
  have: number
  total: number
}

/** Stand bis zum nächsten Stern (für Sammlung und Kapitel-Karte). */
export function masteryProgress(def: ChapterDef, c: ChapterState): MasteryProgress {
  const stars = masteryStars(def, c)
  const next = MASTERY_STEPS[stars] ?? null
  const total = def.areas.length
  if (next === null) return { stars, next, have: total, total }
  const have = def.areas.filter((a) => areaMeets(c, a.id, next)).length
  return { stars, next, have, total }
}

/** Alle Meister-Sterne über alle Kapitel und das Höchstmaß. */
export function totalMasteryStars(chapters: ChaptersState): { have: number; total: number } {
  let have = 0
  for (const def of CHAPTERS) have += masteryStars(def, chapters[def.id])
  return { have, total: CHAPTERS.length * MASTERY_MAX }
}
