/** Spielkern — Omas Extras: Rezept, Himmel, Kürbis, Belohnungen gutschreiben. Öffentlich über src/game/state.ts. */
import {
  CONTEST_REWARDS,
  type ContestResult,
  RECIPE_NEED,
  RECIPE_REWARD,
  SKY,
  type SkyEvent,
  contestRank,
  makeRecipe,
} from '../extrasCore'
import { GENERATORS, type GeneratorId } from '../generators'
import { dayKey, weekKey } from '../monetization'
import { bumpQuest, productionPerSecond, withXp } from './core'
import { withEventProgress } from './events'
import { earnFest } from './fest'
import type { Reward } from './rewards'
import type { GameState } from './types'

/* ———————————— Omas Tagesrezept ———————————— */

export function syncRecipe(state: GameState, now = Date.now()): GameState {
  const day = dayKey(now)
  if (state.recipe.day === day) return state
  const planted = GENERATORS.filter((g) => (state.owned[g.id] ?? 0) > 0).map((g) => g.id)
  return { ...state, recipe: makeRecipe(day, planted) }
}

export function bumpRecipe(state: GameState, id: GeneratorId, now: number): GameState {
  const synced = syncRecipe(state, now)
  const i = synced.recipe.areas.indexOf(id)
  if (i < 0 || synced.recipe.claimed) return synced
  if ((synced.recipe.have[i] ?? 0) >= RECIPE_NEED) return synced
  const have = [...synced.recipe.have]
  have[i] = (have[i] ?? 0) + 1
  return { ...synced, recipe: { ...synced.recipe, have } }
}

export function recipeReady(state: GameState): boolean {
  const r = state.recipe
  return !r.claimed && r.areas.length > 0 && r.areas.every((_, i) => (r.have[i] ?? 0) >= RECIPE_NEED)
}

export function claimRecipe(state: GameState, now = Date.now()): GameState {
  if (!recipeReady(state)) return state
  const next = grantReward(state, RECIPE_REWARD, now)
  return { ...next, recipe: { ...next.recipe, claimed: true } }
}

/* ———————————— Himmelsereignisse ———————————— */

/** Spawn a Regenbogen (day) or Sternschnuppe (night) now and then. */
export function syncSky(state: GameState, now = Date.now()): GameState {
  if (state.skyEvent && state.skyEvent.until <= now) {
    return { ...state, skyEvent: null }
  }
  if (state.skyEvent || now < state.skyNextAt) return state
  const hour = new Date(now).getHours()
  const kind: SkyEvent['kind'] = hour >= 21 || hour < 5 ? 'star' : 'rainbow'
  const gap = SKY.minGapMs + Math.random() * (SKY.maxGapMs - SKY.minGapMs)
  return { ...state, skyEvent: { kind, until: now + SKY.windowMs }, skyNextAt: now + gap }
}

export function catchRainbow(state: GameState, now = Date.now()): GameState {
  if (state.skyEvent?.kind !== 'rainbow' || state.skyEvent.until <= now) return state
  return { ...state, skyEvent: null, rainbowEndsAt: now + SKY.rainbowMs, lastSeen: now }
}

export type Wish = 'samen' | 'ernte' | 'fest'

export function makeWish(state: GameState, wish: Wish, now = Date.now()): GameState {
  if (state.skyEvent?.kind !== 'star' || state.skyEvent.until <= now) return state
  const base = { ...state, skyEvent: null }
  if (wish === 'samen') return grantReward(base, { samen: SKY.wishSamen }, now)
  if (wish === 'ernte') return grantReward(base, { ernteSeconds: SKY.wishErnteSec }, now)
  return grantReward(base, { fest: SKY.wishFest }, now)
}

/* ———————————— Größter Kürbis (Vereinsrunde) ———————————— */

/** Roll the week: settle last week's rank, start fresh. */
export function syncContest(state: GameState, now = Date.now()): GameState {
  const key = weekKey(now)
  if (state.contestWeek === key) return state
  const rank = contestRank(state.contestWeek, state.contestKg)
  const result: ContestResult | null =
    state.contestKg > 0 ? { week: state.contestWeek, rank, kg: state.contestKg, claimed: false } : null
  return { ...state, contestWeek: key, contestKg: 0, contestResult: result ?? state.contestResult }
}

export function growPumpkin(state: GameState, kg: number, now = Date.now()): GameState {
  if (kg <= 0) return state
  const synced = syncContest(state, now)
  return { ...synced, contestKg: synced.contestKg + kg }
}

export function claimContest(state: GameState, now = Date.now()): GameState {
  const r = state.contestResult
  if (!r || r.claimed) return state
  const samen = CONTEST_REWARDS[Math.min(r.rank, CONTEST_REWARDS.length) - 1] ?? 5
  return { ...grantReward(state, { samen }, now), contestResult: { ...r, claimed: true } }
}


/* ———————————— Generationen ———————————— */

/** Generic reward for visitors, orders, weekly plan, comeback gifts. */
export function grantReward(state: GameState, reward: Reward, now = Date.now()): GameState {
  const ernte = Math.max(0, (reward.ernteSeconds ?? 0) * productionPerSecond(state, now))
  let next: GameState = {
    ...withEventProgress(state, ernte, now),
    ernte: state.ernte + ernte,
    ernteSeason: state.ernteSeason + ernte,
    ernteLifetime: state.ernteLifetime + ernte,
    samen: state.samen + (reward.samen ?? 0),
    erbstuecke: state.erbstuecke + (reward.erbstuecke ?? 0),
    lastSeen: now,
  }
  if (ernte > 0) next = bumpQuest(next, 'earnErnte', ernte, now)
  if (reward.xp) next = withXp(next, reward.xp, now)
  if (reward.fest) next = earnFest(next, reward.fest, now)
  if (reward.kg) next = growPumpkin(next, reward.kg, now)
  return next
}
