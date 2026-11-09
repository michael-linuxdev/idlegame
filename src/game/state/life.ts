/** Spielkern — Jonas, Wetter, Album, Großprojekte, Kreuzen, Bewohner, Deko. Öffentlich über src/game/state.ts. */
import {
  ALBUM_GOALS,
  ALBUM_REWARD_AT,
  ALBUM_REWARD_FALLBACK_SAMEN,
  ALBUM_STAMP_SAMEN,
  type AlbumStat,
  SEASON_DECOR,
  albumProgress,
  seasonKey,
  seasonOfKey,
} from '../album'
import { totalChapterLevels } from '../chapters'
import { CROSS_MISS_SAMEN, CROSS_MS, CROSS_SKIP_SAMEN, type HybridId, hybridFor } from '../crossing'
import { type DecorId, decorDef } from '../decor'
import type { GeneratorId } from '../generators'
import { dayKey } from '../monetization'
import { PROJECT_STAGES, type ProjectId, projectDef, stageCost } from '../projects'
import {
  RESIDENT_FIRST_SAMEN,
  RESIDENT_GAP_MS,
  RESIDENT_REPEAT_SEC,
  RESIDENT_STAY_MS,
  type ResidentId,
} from '../residents'
import {
  SAFE_COST,
  type WeatherChoice,
  type WeatherEventKind,
  weatherEventAt,
  weatherOutcome,
} from '../weatherEvents'
import { productionPerSecond } from './core'
import { type GameState, HELPER_RANKS } from './types'

/* ———————————— Gartenhelfer & Mengenkauf ———————————— */

export function helperUnlocked(state: GameState): boolean {
  return state.saisonenden >= 1 || state.tiefeWinter > 0 || state.generation > 0 || state.helperLevel > 0
}

export function helperInterval(level: number): number {
  if (level <= 0) return Infinity
  return HELPER_RANKS[Math.min(HELPER_RANKS.length, level) - 1]!.intervalMs
}

export function buyHelper(state: GameState): GameState {
  if (!helperUnlocked(state)) return state
  const rank = HELPER_RANKS[state.helperLevel]
  if (!rank) return state
  if (state[rank.currency] < rank.cost) return state
  return {
    ...state,
    [rank.currency]: state[rank.currency] - rank.cost,
    helperLevel: state.helperLevel + 1,
    helperOn: true,
    lastSeen: Date.now(),
  }
}

/* ——— Wetter-Entscheidungen ——— */

/** Today's open weather decision, if any. */
export function pendingWeatherEvent(state: GameState, now = Date.now()): WeatherEventKind | null {
  if (state.weatherDecided === dayKey(now)) return null
  return weatherEventAt(now)
}

export function decideWeather(state: GameState, choice: WeatherChoice, now = Date.now(), roll = Math.random()): { state: GameState; good: boolean } {
  const kind = pendingWeatherEvent(state, now)
  if (!kind) return { state, good: true }
  const cost = SAFE_COST[kind]
  let next: GameState = state
  if (choice === 'safe') {
    if (cost.samen) {
      if (state.samen < cost.samen) return { state, good: true }
      next = { ...next, samen: next.samen - cost.samen }
    }
    if (cost.minutes) next = { ...next, ernte: Math.max(0, next.ernte - productionPerSecond(state, now) * cost.minutes * 60) }
  }
  if (kind === 'hitze' && choice === 'risk') next = { ...next, lastTapAt: now }
  const out = weatherOutcome(kind, choice, roll, now)
  return { good: out.good, state: { ...next, weatherDecided: dayKey(now), weatherBuff: out.buff ?? next.weatherBuff } }
}

/* ——— Jahreszeiten-Album ——— */

/** Lifetime values the album measures from the season's start. */
export function albumStats(state: GameState): Record<AlbumStat, number> {
  let visits = 0
  let species = 0
  for (const n of Object.values(state.residentsSeen)) {
    visits += n ?? 0
    if ((n ?? 0) > 0) species += 1
  }
  let stages = 0
  for (const n of Object.values(state.projects)) stages += n ?? 0
  return {
    water: 0,
    seasons: 0,
    daily: 0,
    offline: 0,
    upgrades: state.totalUpgrades,
    varieties: state.collection.length,
    visits,
    species,
    hybrids: state.hybrids.length,
    decor: state.decorOwned.length,
    chapterLevels: totalChapterLevels(state.chapters),
    projectStages: stages,
  }
}

/** Start a fresh album when the real season changed. */
export function syncAlbum(state: GameState, now = Date.now()): GameState {
  const key = seasonKey(now)
  if (state.album.key === key) return state
  return { ...state, album: { key, base: albumStats(state), counts: {}, claimed: [], rewarded: false } }
}

/** Count one of the game-bumped album stats. */
export function albumCount(state: GameState, id: AlbumStat, n = 1, now = Date.now()): GameState {
  const s = syncAlbum(state, now)
  return { ...s, album: { ...s.album, counts: { ...s.album.counts, [id]: (s.album.counts[id] ?? 0) + n } } }
}

/** Claim a finished goal's stamp (+Samen); the ALBUM_REWARD_AT-th stamp brings the season Deko. */
export function claimAlbumStamp(state: GameState, id: AlbumStat, now = Date.now()): GameState {
  const s = syncAlbum(state, now)
  const goal = ALBUM_GOALS.find((g) => g.id === id)
  if (!goal || s.album.claimed.includes(id)) return state
  if (albumProgress(s.album, albumStats(s), id) < goal.need) return state
  let next: GameState = { ...s, samen: s.samen + ALBUM_STAMP_SAMEN, album: { ...s.album, claimed: [...s.album.claimed, id] } }
  if (!next.album.rewarded && next.album.claimed.length >= ALBUM_REWARD_AT) {
    const decor = SEASON_DECOR[seasonOfKey(next.album.key)]
    next = next.decorOwned.includes(decor) ? { ...next, samen: next.samen + ALBUM_REWARD_FALLBACK_SAMEN } : grantDecor(next, decor)
    next = { ...next, album: { ...next.album, rewarded: true } }
  }
  return next
}

/* ——— Großprojekte ——— */

export function projectOpen(state: GameState, id: ProjectId): boolean {
  const def = projectDef(id)
  return !!def && def.chapters.every((c) => state.chapters[c].openedAt > 0)
}

/** Build the next stage of a project, paying every chapter's currency. */
export function buildProjectStage(state: GameState, id: ProjectId): GameState {
  const def = projectDef(id)
  const stage = state.projects[id] ?? 0
  if (!def || stage >= PROJECT_STAGES || !projectOpen(state, id)) return state
  const costs = stageCost(def, stage)
  if (costs.some(({ chapter, cost }) => state.chapters[chapter].cur < cost)) return state
  const chapters = { ...state.chapters }
  for (const { chapter, cost } of costs) chapters[chapter] = { ...chapters[chapter], cur: chapters[chapter].cur - cost }
  let next: GameState = { ...state, chapters, projects: { ...state.projects, [id]: stage + 1 } }
  if (stage + 1 >= PROJECT_STAGES) {
    if (def.reward.decor) next = grantDecor(next, def.reward.decor)
    if (def.reward.samen) next = { ...next, samen: next.samen + def.reward.samen }
  }
  return next
}

/* ——— Saatgut kreuzen ——— */

export function startCrossing(state: GameState, a: string, b: string, now = Date.now()): GameState {
  if (state.crossing || a === b) return state
  if (!state.collection.includes(a) || !state.collection.includes(b)) return state
  return { ...state, crossing: { a, b, endsAt: now + CROSS_MS } }
}

/** Finish the wait right away for a few Samen. */
export function skipCrossing(state: GameState, now = Date.now()): GameState {
  if (!state.crossing || state.crossing.endsAt <= now || state.samen < CROSS_SKIP_SAMEN) return state
  return { ...state, samen: state.samen - CROSS_SKIP_SAMEN, crossing: { ...state.crossing, endsAt: now } }
}

/** Harvest a finished crossing: a new Kreuzung, or a handful of Samen. */
export function harvestCrossing(state: GameState, now = Date.now()): { state: GameState; hybrid: HybridId | null; samen: number } {
  const c = state.crossing
  if (!c || c.endsAt > now) return { state, hybrid: null, samen: 0 }
  const hybrid = hybridFor(c.a, c.b, state.hybrids)
  const samen = hybrid ? 0 : CROSS_MISS_SAMEN
  return {
    hybrid,
    samen,
    state: { ...state, crossing: null, hybrids: hybrid ? [...state.hybrids, hybrid] : state.hybrids, samen: state.samen + samen },
  }
}

/* ——— Gartenbewohner ——— */

/** Let a visitor in (UI calls this when it is time and one fits). */
export function spawnResident(state: GameState, id: ResidentId, now = Date.now()): GameState {
  if (state.residentNow && state.residentNow.until > now) return state
  return { ...state, residentNow: { id, until: now + RESIDENT_STAY_MS } }
}

/** Visitor left unnoticed (or nobody fits): plan the next try. */
export function residentGone(state: GameState, now = Date.now(), rng = Math.random): GameState {
  const [a, b] = RESIDENT_GAP_MS
  return { ...state, residentNow: null, residentNextAt: now + a + rng() * (b - a) }
}

/** Player tapped the visitor: note it; first find pays Samen, later visits a bit of Ernte. */
export function greetResident(state: GameState, now = Date.now()): { state: GameState; first: boolean; ernte: number } {
  const v = state.residentNow
  if (!v || v.until <= now) return { state, first: false, ernte: 0 }
  const first = (state.residentsSeen[v.id] ?? 0) === 0
  const seen = { ...state.residentsSeen, [v.id]: (state.residentsSeen[v.id] ?? 0) + 1 }
  const ernte = first ? 0 : productionPerSecond(state, now) * RESIDENT_REPEAT_SEC
  const next = residentGone({ ...state, residentsSeen: seen }, now)
  return {
    first,
    ernte,
    state: {
      ...next,
      samen: next.samen + (first ? RESIDENT_FIRST_SAMEN : 0),
      ernte: next.ernte + ernte,
      ernteSeason: next.ernteSeason + ernte,
      ernteLifetime: next.ernteLifetime + ernte,
    },
  }
}

/* ——— Deko frei platzieren ——— */

export function buyDecor(state: GameState, id: DecorId): GameState {
  const def = decorDef(id)
  if (!def || def.exclusive || state.decorOwned.includes(id) || state.samen < def.cost) return state
  return { ...state, samen: state.samen - def.cost, decorOwned: [...state.decorOwned, id] }
}

/** Exclusive Deko as a reward (album, projects); no-op if already owned. */
export function grantDecor(state: GameState, id: DecorId): GameState {
  if (state.decorOwned.includes(id)) return state
  return { ...state, decorOwned: [...state.decorOwned, id] }
}

/** Put owned Deko on a Dekoplatz (moves it if it stood elsewhere); null clears the spot. */
export function placeDecor(state: GameState, slot: number, id: DecorId | null): GameState {
  if (slot < 0 || slot >= state.decorSlots.length) return state
  if (id != null && !state.decorOwned.includes(id)) return state
  const slots = state.decorSlots.map((x) => (id != null && x === id ? null : x))
  slots[slot] = id
  return { ...state, decorSlots: slots }
}

/** Allow / forbid Jonas one garden area. */
export function toggleHelperArea(state: GameState, id: GeneratorId): GameState {
  const blocked = state.helperBlocked.includes(id) ? state.helperBlocked.filter((x) => x !== id) : [...state.helperBlocked, id]
  return { ...state, helperBlocked: blocked }
}

export function toggleHelper(state: GameState): GameState {
  if (state.helperLevel <= 0) return state
  return { ...state, helperOn: !state.helperOn }
}
