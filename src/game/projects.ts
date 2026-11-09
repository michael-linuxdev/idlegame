/**
 * Großprojekte: long builds across chapters. Each project has PROJECT_STAGES
 * stages; a stage costs the currencies of its chapters (scaled to each
 * chapter's own economy). Every stage: +2 % Ernte; the last one a reward.
 */
import { chapterDef, type ChapterId } from './chapters'
import type { DecorId } from './decor'

export type ProjectId = 'pavillon' | 'brunnen' | 'dorffest' | 'rosengarten' | 'gartenroute' | 'tauschpost' | 'herkunftsbeet' | 'morgengarten'

export interface ProjectDef {
  id: ProjectId
  chapters: ChapterId[]
  reward: { decor?: DecorId; samen?: number; bonus?: number }
}

export const PROJECTS: ProjectDef[] = [
  { id: 'pavillon', chapters: ['obstwiese', 'weinberg'], reward: { decor: 'pavillon' } },
  { id: 'brunnen', chapters: ['bauernhof', 'imkerei', 'teich'], reward: { decor: 'brunnen' } },
  { id: 'dorffest', chapters: ['kraeuter', 'botanik', 'alm'], reward: { samen: 150 } },
  { id: 'rosengarten', chapters: ['lavendel', 'japangarten', 'gartenschau'], reward: { bonus: 0.05 } },
  // Bogen I „Nach der Schau“ (Kapitel 13–19)
  {
    id: 'gartenroute',
    chapters: ['stadtgarten', 'klostergarten', 'schlossgarten', 'baumschule', 'moorgarten', 'deichgarten', 'spreewald'],
    reward: { samen: 300 },
  },
  // Bogen II „Omas Saatgutbriefe“ (Kapitel 20–29)
  {
    id: 'tauschpost',
    chapters: ['cottagegarten', 'tulpenfelder', 'artischocken', 'beerenwald', 'patio', 'korkeichen', 'paprikafelder', 'aranfelder', 'rosental', 'pistazien'],
    reward: { samen: 400 },
  },
  // Bogen III „Wo die Samen herkommen“ (Kapitel 30–39)
  {
    id: 'herkunftsbeet',
    chapters: ['andenkartoffeln', 'milpa', 'kaffeewald', 'reisterrassen', 'gewuerzgarten', 'oase', 'kakaogarten', 'buschgarten', 'farngarten', 'kimchigarten'],
    reward: { samen: 450 },
  },
  // Bogen IV „Saatgut für morgen“ (Kapitel 40–49)
  {
    id: 'morgengarten',
    chapters: ['dachgarten', 'schulgarten', 'waldgarten', 'samenbank', 'klimagarten', 'wildblumenband', 'fassadengarten', 'solawihof', 'saatguttausch', 'weltgartenschau'],
    reward: { samen: 500 },
  },
]

export const PROJECT_IDS: ProjectId[] = PROJECTS.map((p) => p.id)
export const PROJECT_STAGES = 3
export const PROJECT_STAGE_BONUS = 0.02

/** Area index whose base cost sets the price of a stage (×3). */
const STAGE_AREA = [3, 5, 7]

export function projectDef(id: string): ProjectDef | undefined {
  return PROJECTS.find((p) => p.id === id)
}

/** Currency cost of a stage, per chapter. */
export function stageCost(def: ProjectDef, stage: number): { chapter: ChapterId; cost: number }[] {
  const idx = STAGE_AREA[Math.min(stage, STAGE_AREA.length - 1)]!
  return def.chapters.map((chapter) => ({ chapter, cost: chapterDef(chapter).areas[idx]!.baseCost * 3 }))
}

export function projectsMult(done: Partial<Record<ProjectId, number>>): number {
  let bonus = 0
  for (const def of PROJECTS) {
    const n = Math.min(PROJECT_STAGES, done[def.id] ?? 0)
    bonus += n * PROJECT_STAGE_BONUS
    if (n >= PROJECT_STAGES && def.reward.bonus) bonus += def.reward.bonus
  }
  return 1 + bonus
}

export function parseProjects(raw: unknown): Partial<Record<ProjectId, number>> {
  const out: Partial<Record<ProjectId, number>> = {}
  if (raw == null || typeof raw !== 'object') return out
  for (const id of PROJECT_IDS) {
    const v = (raw as Record<string, unknown>)[id]
    if (typeof v === 'number' && Number.isFinite(v) && v > 0) out[id] = Math.min(PROJECT_STAGES, Math.floor(v))
  }
  return out
}
