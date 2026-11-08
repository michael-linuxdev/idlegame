import { describe, expect, it } from 'vitest'
import { PROJECT_STAGES, projectDef, projectsMult, stageCost } from '../game/projects'
import { buildProjectStage, createInitialState, doPrestige, projectOpen } from '../game/state'
import { parseSave } from '../game/storage'

function withChapters(rich: boolean) {
  const base = createInitialState(0)
  const chapters = { ...base.chapters }
  for (const id of ['obstwiese', 'weinberg'] as const) chapters[id] = { ...chapters[id], openedAt: 1, cur: rich ? 1e15 : 0 }
  return { ...base, chapters, samen: 0 }
}

describe('Großprojekte', () => {
  it('needs its chapters open and their currencies', () => {
    const closed = createInitialState(0)
    expect(projectOpen(closed, 'pavillon')).toBe(false)
    expect(buildProjectStage(closed, 'pavillon')).toBe(closed)
    const poor = withChapters(false)
    expect(projectOpen(poor, 'pavillon')).toBe(true)
    expect(buildProjectStage(poor, 'pavillon')).toBe(poor)
  })
  it('stages cost every chapter, get pricier, end with the reward', () => {
    const def = projectDef('pavillon')!
    expect(stageCost(def, 1)[0]!.cost).toBeGreaterThan(stageCost(def, 0)[0]!.cost)
    let s = withChapters(true)
    const cost = stageCost(def, 0)
    s = buildProjectStage(s, 'pavillon')
    expect(s.projects.pavillon).toBe(1)
    expect(s.chapters.obstwiese.cur).toBe(1e15 - cost[0]!.cost)
    expect(s.chapters.weinberg.cur).toBe(1e15 - cost[1]!.cost)
    for (let i = 1; i < PROJECT_STAGES; i++) s = buildProjectStage(s, 'pavillon')
    expect(s.projects.pavillon).toBe(PROJECT_STAGES)
    expect(s.decorOwned).toContain('pavillon')
    expect(buildProjectStage(s, 'pavillon')).toBe(s)
    expect(projectsMult(s.projects)).toBeCloseTo(1 + 0.02 * PROJECT_STAGES)
  })
  it('survives Saisonende; old saves load empty', () => {
    const s = { ...createInitialState(0), projects: { brunnen: 2 }, ernteSeason: 1e40 }
    expect(doPrestige(s).projects).toEqual({ brunnen: 2 })
    const raw = JSON.parse(JSON.stringify(s)) as Record<string, unknown>
    delete raw.projects
    expect(parseSave(raw)?.projects).toEqual({})
  })
})
