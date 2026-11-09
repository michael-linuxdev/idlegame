import { describe, expect, it } from 'vitest'
import { emptyQuestProgress, questLabel, questsForDay } from '../game/quests'

describe('Tagesaufgaben', () => {
  const day = new Date(2026, 10, 9, 9).getTime()
  it('drei verschiedene Aufgaben, für denselben Tag immer gleich', () => {
    const a = questsForDay(day)
    expect(a).toHaveLength(3)
    expect(new Set(a.map((q) => q.id)).size).toBe(3)
    expect(questsForDay(day + 3600_000)).toEqual(a)
    expect(a.filter((q) => q.kind === 'claimDaily').length).toBeLessThanOrEqual(1)
  })
  it('Fortschritt beginnt bei 0 und hat einen Text', () => {
    const p = emptyQuestProgress(day)
    expect(p.quests.every((q) => q.progress === 0 && !q.claimed)).toBe(true)
    for (const q of p.quests) expect(questLabel(q).length).toBeGreaterThan(0)
  })
})
