/**
 * Spielstand-Größe bei 50 Kapiteln (Paket 1 Kapitel 13–50): ein voll
 * ausgebautes Kapitel (alle Bereiche hoch, volle Pflege) hochgerechnet auf
 * 50 Kapitel muss unter 100 KB bleiben.
 */
import { describe, expect, it } from 'vitest'
import { CHAPTERS, CHAPTER_CARE_MAX } from '../game/chapters'
import { createInitialState } from '../game/state'
import { serializeSave } from '../game/storage'

describe('Spielstand-Größe', () => {
  it('bleibt mit 50 voll ausgebauten Kapiteln unter 100 KB', () => {
    const s = createInitialState(1_800_000_000_000)
    for (const def of CHAPTERS) {
      const c = s.chapters[def.id]
      for (const a of def.areas) {
        c.owned[a.id] = 9999
        c.care[a.id] = { grow: CHAPTER_CARE_MAX, thrift: CHAPTER_CARE_MAX }
      }
      c.cur = 1.234567891234e30
      c.curLifetime = 9.87654321e31
      c.openedAt = 1_800_000_000_000
      c.introSeen = true
    }
    const total = serializeSave(s).length
    const perChapter = Math.max(...CHAPTERS.map((d) => JSON.stringify(s.chapters[d.id]).length))
    const estimate = total + (50 - CHAPTERS.length) * perChapter
    expect(estimate).toBeLessThan(100 * 1024)
  })
})
