/** Spielkern — Kapitel 2+, Oma Ilse, Weinlese, Meilenstein-Truhe. Öffentlich über src/game/state.ts. */
import {
  CHAPTERS,
  CHAPTER_CARE_MAX,
  type CareKind,
  type ChapterId,
  areaCost,
  areaRate,
  areaUnlocked,
  careCost,
  careOf,
  careThriftMult,
  chapterBaseRate,
  chapterDef,
} from '../chapters'
import { ILSE_RANKS, WEINLESE, rollChest } from '../extrasCore'
import { FEST_EARN } from '../fests'
import { legacyCostMult, legacyOrchardMult } from '../generations'
import { milestonesReached } from '../generators'
import { XP_PER_UPGRADE, levelProductionMult } from '../progression'
import type { BuyMode } from './buy'
import { playerLevelOf, withXp } from './core'
import { earnFest } from './fest'
import type { GameState } from './types'

export function chapterOpen(state: GameState, id: ChapterId): boolean {
  return state.chapters[id].openedAt > 0
}

export function openChapters(state: GameState): ChapterId[] {
  return CHAPTERS.filter((c) => chapterOpen(state, c.id)).map((c) => c.id)
}

/**
 * Abschluss-Szene (nur Darstellung): sobald Kapitel 50 vollständig angelegt ist
 * (letzter Bereich gepflanzt) und der Brief gelesen wurde — einmalig.
 */
export function abschlussDue(state: GameState): boolean {
  if (state.abschlussSeen) return false
  const c = state.chapters.omasgarten
  if (!c || c.openedAt <= 0 || !c.introSeen) return false
  const last = chapterDef('omasgarten').areas.at(-1)!
  return (c.owned[last.id] ?? 0) >= 1
}

/** Opens every chapter whose rule is met (or `force`, test hook). */
export function syncChaptersOpen(state: GameState, now = Date.now(), force?: ChapterId): GameState {
  let chapters = state.chapters
  let changed = false
  for (const def of CHAPTERS) {
    const c = chapters[def.id]
    if (c.openedAt > 0) continue
    if (force === def.id || def.unlock(state)) {
      chapters = { ...chapters, [def.id]: { ...c, openedAt: now } }
      changed = true
    }
  }
  return changed ? { ...state, chapters } : state
}

export function chapterRateMult(state: GameState): number {
  return (
    legacyOrchardMult(state.legacy) *
    (1 + 0.05 * state.tiefeWinter) *
    (1 + 0.1 * state.generation) *
    levelProductionMult(playerLevelOf(state))
  )
}

export function chapterPerSecond(state: GameState, id: ChapterId): number {
  if (!chapterOpen(state, id)) return 0
  return chapterBaseRate(chapterDef(id), state.chapters[id]) * chapterRateMult(state)
}

function withChapterCur(state: GameState, id: ChapterId, gained: number): GameState {
  if (gained <= 0) return state
  const c = state.chapters[id]
  return {
    ...state,
    chapters: { ...state.chapters, [id]: { ...c, cur: c.cur + gained, curLifetime: c.curLifetime + gained } },
  }
}

export function tickChapters(state: GameState, seconds: (rate: number) => number): GameState {
  let next = state
  for (const def of CHAPTERS) {
    const rate = chapterPerSecond(next, def.id)
    if (rate > 0) next = withChapterCur(next, def.id, seconds(rate))
  }
  return next
}

export function chapterCostOf(state: GameState, id: ChapterId, areaId: string): number {
  const a = chapterDef(id).areas.find((x) => x.id === areaId)
  if (!a) return Infinity
  const c = state.chapters[id]
  return areaCost(a, c.owned[areaId] ?? 0, legacyCostMult(state.legacy) * careThriftMult(careOf(c, areaId).thrift))
}

/** Kapitel-Pflege: buy one rank of „Wachsen“ or „Sparen“ for an area. */
export function buyChapterCare(state: GameState, id: ChapterId, areaId: string, kind: CareKind): GameState {
  if (!chapterOpen(state, id)) return state
  const c = state.chapters[id]
  const a = chapterDef(id).areas.find((x) => x.id === areaId)
  if (!a || (c.owned[areaId] ?? 0) < 1) return state
  const ranks = careOf(c, areaId)
  if (ranks[kind] >= CHAPTER_CARE_MAX) return state
  const cost = careCost(a, kind, ranks[kind])
  if (c.cur < cost) return state
  return {
    ...state,
    chapters: {
      ...state.chapters,
      [id]: { ...c, cur: c.cur - cost, care: { ...c.care, [areaId]: { ...ranks, [kind]: ranks[kind] + 1 } } },
    },
    lastSeen: Date.now(),
  }
}

export function buyChapterArea(
  state: GameState,
  id: ChapterId,
  areaId: string,
  mode: BuyMode = 'manual',
): GameState {
  if (!chapterOpen(state, id)) return state
  const c = state.chapters[id]
  const a = chapterDef(id).areas.find((x) => x.id === areaId)
  if (!a || !areaUnlocked(a, c.owned)) return state
  const cost = chapterCostOf(state, id, areaId)
  if (c.cur < cost) return state
  const owned = c.owned[areaId] ?? 0
  let next: GameState = {
    ...state,
    chapters: {
      ...state.chapters,
      [id]: { ...c, cur: c.cur - cost, owned: { ...c.owned, [areaId]: owned + 1 } },
    },
    totalUpgrades: state.totalUpgrades + 1,
    lastSeen: Date.now(),
  }
  next = withMilestoneChest(next, `${id}:${areaId}`, owned + 1)
  next = withXp(next, mode === 'helper' ? 1 : XP_PER_UPGRADE)
  return earnFest(next, mode === 'helper' ? FEST_EARN.helperUpgrade : FEST_EARN.upgrade)
}

/** Buy up to `n` levels of one chapter area. */
export function buyChapterMany(
  state: GameState,
  id: ChapterId,
  areaId: string,
  n: number,
): { state: GameState; bought: number } {
  let next = state
  let bought = 0
  for (let i = 0; i < n; i++) {
    const after = buyChapterArea(next, id, areaId, i === 0 ? 'manual' : 'bulk')
    if (after === next) break
    next = after
    bought += 1
  }
  return { state: next, bought }
}

/** Best affordable chapter buy by Δrate / cost. */
export function bestChapterBuy(state: GameState, id: ChapterId): string | null {
  const c = state.chapters[id]
  let best: string | null = null
  let bestScore = 0
  for (const a of chapterDef(id).areas) {
    if (!areaUnlocked(a, c.owned)) continue
    const cost = chapterCostOf(state, id, a.id)
    if (cost > c.cur) continue
    const n = c.owned[a.id] ?? 0
    const score = (areaRate(a, n + 1) - areaRate(a, n)) / cost
    if (score > bestScore) {
      bestScore = score
      best = a.id
    }
  }
  return best
}

/* ———————————— Oma Ilse (Kapitel-Helferin) ———————————— */

export function ilseUnlocked(state: GameState): boolean {
  return chapterOpen(state, 'obstwiese')
}

export function buyIlse(state: GameState): GameState {
  if (!ilseUnlocked(state)) return state
  const rank = ILSE_RANKS[state.ilseLevel]
  if (!rank) return state
  const c = state.chapters.obstwiese
  if (c.cur < rank.cost) return state
  return {
    ...state,
    chapters: { ...state.chapters, obstwiese: { ...c, cur: c.cur - rank.cost } },
    ilseLevel: state.ilseLevel + 1,
    ilseOn: true,
    lastSeen: Date.now(),
  }
}

export function toggleIlse(state: GameState): GameState {
  return state.ilseLevel > 0 ? { ...state, ilseOn: !state.ilseOn } : state
}

export function runIlse(state: GameState, dtMs: number, maxBuys = 40): { state: GameState; bought: number } {
  if (state.ilseLevel <= 0 || !state.ilseOn) return { state, bought: 0 }
  const ids = openChapters(state)
  if (ids.length === 0) return { state, bought: 0 }
  const interval = ILSE_RANKS[Math.min(ILSE_RANKS.length, state.ilseLevel) - 1]!.intervalMs
  let carry = state.ilseCarryMs + dtMs
  let next = state
  let bought = 0
  while (carry >= interval && bought < maxBuys) {
    let did = false
    for (let k = 0; k < ids.length; k++) {
      const id = ids[(bought + k) % ids.length]!
      const area = bestChapterBuy(next, id)
      if (!area) continue
      next = buyChapterArea(next, id, area, 'helper')
      did = true
      break
    }
    if (!did) {
      carry = Math.min(carry, interval)
      break
    }
    carry -= interval
    bought += 1
  }
  return { state: { ...next, ilseCarryMs: Math.min(carry, interval * 2) }, bought }
}

/* ———————————— Weinlese ———————————— */

export function weinleseReady(state: GameState, now = Date.now()): boolean {
  return chapterOpen(state, 'weinberg') && now - state.weinleseAt >= WEINLESE.cooldownMs
}

/** Finish the Weinlese with `hits` ripe grapes tapped (0…WEINLESE.grapes). */
export function finishWeinlese(state: GameState, hits: number, now = Date.now()): GameState {
  if (!weinleseReady(state, now)) return state
  const h = Math.max(0, Math.min(WEINLESE.grapes, Math.floor(hits)))
  const trauben = chapterPerSecond(state, 'weinberg') * WEINLESE.secondsPerHit * h
  const next = withChapterCur({ ...state, weinleseAt: now, lastSeen: now }, 'weinberg', Math.max(h * 10, trauben))
  return earnFest(next, h, now)
}

/* ———————————— Meilenstein-Truhen ———————————— */

/** A new lifetime record of Meilensteine on an area opens one Truhe. */
export function withMilestoneChest(state: GameState, key: string, level: number): GameState {
  const stars = milestonesReached(level)
  if (stars <= (state.milestoneRecord[key] ?? 0)) return state
  const chest = rollChest(state.saisonenden, state.collection)
  let next: GameState = {
    ...state,
    milestoneRecord: { ...state.milestoneRecord, [key]: stars },
    lastChest: chest,
  }
  if (chest.kind === 'samen') next = { ...next, samen: next.samen + chest.amount }
  if (chest.kind === 'erbstuecke') next = { ...next, erbstuecke: next.erbstuecke + chest.amount }
  if (chest.kind === 'fest') next = earnFest(next, chest.amount)
  if (chest.kind === 'variety' && chest.variety) {
    next = { ...next, collection: [...next.collection, chest.variety], lastVariety: chest.variety }
  }
  return next
}

export function clearLastChest(state: GameState): GameState {
  return state.lastChest ? { ...state, lastChest: null } : state
}
