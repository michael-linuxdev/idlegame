/**
 * „Heute“-Karte (Runde 4, Paket 2): ein Zugang für Tägliche Gartenrunde,
 * Omas Tagesrezept, Tagesziele und Omas Wochenplan. Die Systeme bleiben in
 * Spielstand und Regeln getrennt; hier wird nur gebündelt, was die Karte
 * zeigt und was davon bereit zum Abholen ist.
 */
import { RECIPE_NEED } from './extrasCore'
import { WEEKLY_TASKS, type ExtrasState } from './extras'
import type { GameState } from './state'

export type TodaySection = 'daily' | 'recipe' | 'quests' | 'weekly'

export interface TodayInput {
  state: Pick<GameState, 'quests' | 'recipe' | 'saisonenden' | 'tiefeWinter' | 'generation'>
  dailyReady: boolean
  recipeOpen: boolean
  extras: Pick<ExtrasState, 'week' | 'weekClaimed' | 'weekBonusClaimed'>
}

/** Wochenplan erst ab dem ersten Saisonende (wie Omas Hinweis), alte Stände sofort. */
export function weeklyOpen(s: TodayInput['state']): boolean {
  return s.saisonenden >= 1 || s.tiefeWinter > 0 || s.generation > 0
}

export function todaySections(i: TodayInput): TodaySection[] {
  const out: TodaySection[] = ['daily']
  if (i.recipeOpen && i.state.recipe.areas.length > 0) out.push('recipe')
  out.push('quests')
  if (weeklyOpen(i.state)) out.push('weekly')
  return out
}

export function recipeIsReady(r: GameState['recipe']): boolean {
  return !r.claimed && r.areas.length > 0 && r.areas.every((_, k) => (r.have[k] ?? 0) >= RECIPE_NEED)
}

/** Wie viele Dinge auf der Karte gerade abgeholt werden können (ein Punkt am Zugang). */
export function todayReadyCount(i: TodayInput): number {
  const sec = todaySections(i)
  let n = 0
  if (i.dailyReady) n += 1
  if (sec.includes('recipe') && recipeIsReady(i.state.recipe)) n += 1
  n += i.state.quests.filter((q) => !q.claimed && q.progress >= q.target).length
  if (sec.includes('weekly')) {
    n += WEEKLY_TASKS.filter((x) => !i.extras.weekClaimed.includes(x.id) && i.extras.week[x.id] >= x.target).length
    if (!i.extras.weekBonusClaimed && i.extras.weekClaimed.length >= WEEKLY_TASKS.length) n += 1
  }
  return n
}
