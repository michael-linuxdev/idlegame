import { describe, expect, it } from 'vitest'
import { CHAPTERS, CHAPTER_CARE_MAX, chapterBaseRate, chapterDef, type ChapterId } from '../game/chapters'
import { MASTERY_MAX, MASTERY_STEPS, masteryMult, masteryProgress, masteryStars, totalMasteryStars } from '../game/mastery'
import { buyChapterCare, chapterPerSecond, chapterRateMult, createInitialState, type GameState } from '../game/state'
import { parseSave, serializeSave } from '../game/storage'
import v1 from './fixtures/save-v1.json'

/** Kapitel öffnen, alle Bereiche auf `level`, beide Pflege-Arten auf `care` (Ausnahmen je Bereich). */
function withChapter(
  s: GameState,
  id: ChapterId,
  level: number,
  care = 0,
  except: Record<string, { level?: number; grow?: number; thrift?: number }> = {},
): GameState {
  const def = chapterDef(id)
  const owned: Record<string, number> = {}
  const cares: Record<string, { grow: number; thrift: number }> = {}
  for (const a of def.areas) {
    const x = except[a.id] ?? {}
    owned[a.id] = x.level ?? level
    cares[a.id] = { grow: x.grow ?? care, thrift: x.thrift ?? care }
  }
  return { ...s, chapters: { ...s.chapters, [id]: { ...s.chapters[id], openedAt: 1, owned, care: cares } } }
}

const def = chapterDef('obstwiese')
const stars = (s: GameState) => masteryStars(def, s.chapters.obstwiese)

describe('Kapitel-Meisterschaft', () => {
  const base = createInitialState(0)

  it('★ alle Bereiche Stufe 100, ★★ beide Pflege-Arten Rang 5, ★★★ voll gepflegt', () => {
    expect(MASTERY_STEPS).toEqual([
      { kind: 'level', need: 100 },
      { kind: 'care', need: 5 },
      { kind: 'care', need: CHAPTER_CARE_MAX },
    ])
    expect(stars(withChapter(base, 'obstwiese', 99, 10))).toBe(0)
    expect(stars(withChapter(base, 'obstwiese', 100))).toBe(1)
    expect(stars(withChapter(base, 'obstwiese', 100, 4))).toBe(1)
    expect(stars(withChapter(base, 'obstwiese', 100, 5))).toBe(2)
    expect(stars(withChapter(base, 'obstwiese', 100, 9))).toBe(2)
    expect(stars(withChapter(base, 'obstwiese', 5000, 10))).toBe(MASTERY_MAX)
  })

  it('der schwächste Bereich zählt — Stufe oder eine der beiden Pflege-Arten', () => {
    expect(stars(withChapter(base, 'obstwiese', 300, 10, { obstmarkt: { level: 99 } }))).toBe(0)
    expect(stars(withChapter(base, 'obstwiese', 300, 10, { apfel: { thrift: 4 } }))).toBe(1)
    expect(stars(withChapter(base, 'obstwiese', 300, 10, { apfel: { grow: 9 } }))).toBe(2)
    const s = withChapter(base, 'obstwiese', 120, 0, { obstmarkt: { level: 80 }, doerrhaus: { level: 99 } })
    expect(masteryProgress(def, s.chapters.obstwiese)).toEqual({ stars: 0, next: { kind: 'level', need: 100 }, have: 8, total: 10 })
  })

  it('Fortschritt zeigt den nächsten Stern; voll = next null', () => {
    const s = withChapter(base, 'obstwiese', 150, 5, { apfel: { grow: 10, thrift: 10 }, birne: { grow: 10, thrift: 10 } })
    expect(masteryProgress(def, s.chapters.obstwiese)).toEqual({ stars: 2, next: { kind: 'care', need: 10 }, have: 2, total: 10 })
    const full = withChapter(base, 'obstwiese', 150, 10)
    expect(masteryProgress(def, full.chapters.obstwiese)).toEqual({ stars: 3, next: null, have: 10, total: 10 })
  })

  it('geschlossene Kapitel haben keine Sterne', () => {
    const s = withChapter(base, 'weinberg', 200, 10)
    expect(masteryStars(chapterDef('weinberg'), { ...s.chapters.weinberg, openedAt: 0 })).toBe(0)
  })

  it('Pflege kaufen bringt den Stern (über die echte Spielfunktion)', () => {
    let s = withChapter(base, 'obstwiese', 100, 5, { obstmarkt: { thrift: 4 } })
    s = { ...s, chapters: { ...s.chapters, obstwiese: { ...s.chapters.obstwiese, cur: 1e30 } } }
    expect(stars(s)).toBe(1)
    s = buyChapterCare(s, 'obstwiese', 'obstmarkt', 'thrift')
    expect(stars(s)).toBe(2)
  })

  it('Bonus: +5 % Kapitel-Ertrag je Stern, gedeckelt bei +15 %', () => {
    expect(masteryMult(0)).toBe(1)
    expect(masteryMult(1)).toBeCloseTo(1.05)
    expect(masteryMult(3)).toBeCloseTo(1.15)
    expect(masteryMult(99)).toBeCloseTo(1.15)
    expect(masteryMult(-1)).toBe(1)
    const s = withChapter(base, 'obstwiese', 100, 5)
    const raw = chapterBaseRate(def, s.chapters.obstwiese) * chapterRateMult(s)
    expect(chapterPerSecond(s, 'obstwiese') / raw).toBeCloseTo(1.1)
  })

  it('gilt nur für das eigene Kapitel', () => {
    const s = withChapter(withChapter(base, 'obstwiese', 100, 10), 'weinberg', 10)
    const w = chapterDef('weinberg')
    expect(chapterPerSecond(s, 'weinberg')).toBeCloseTo(chapterBaseRate(w, s.chapters.weinberg) * chapterRateMult(s))
  })

  it('Summe über alle Kapitel: 0 … 3 × Kapitelzahl', () => {
    const s = withChapter(withChapter(base, 'obstwiese', 100, 10), 'weinberg', 100)
    expect(totalMasteryStars(s.chapters)).toEqual({ have: 4, total: CHAPTERS.length * 3 })
    expect(totalMasteryStars(base.chapters).have).toBe(0)
  })

  it('kein Spielstand-Feld: alter Stand behält Stufen und Pflege und damit die Sterne, auch nach Speichern', () => {
    const loaded = parseSave(v1)!
    const again = parseSave(JSON.parse(serializeSave(loaded)))!
    expect(Object.keys(loaded).some((k) => k.toLowerCase().includes('master'))).toBe(false)
    expect(totalMasteryStars(again.chapters)).toEqual(totalMasteryStars(loaded.chapters))
    const raw = v1.chapters as Record<string, { owned: unknown; care?: unknown }>
    for (const id of Object.keys(raw) as ChapterId[]) {
      expect(loaded.chapters[id].owned).toEqual(raw[id]!.owned)
      expect(loaded.chapters[id].care).toEqual(raw[id]!.care ?? {})
    }
  })
})
