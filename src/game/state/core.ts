/** Spielkern — Gemeinsame Helfer: Stufe, Quests, Fenster, Multiplikatoren, Ernte/s. Öffentlich über src/game/state.ts. */
import { efficiencyMult } from '../branches'
import { challengesMult } from '../challenges'
import { chaptersGardenMult } from '../chapters'
import { hybridsMult } from '../crossing'
import { prestigeMultiplier } from '../truhe'
import { ERNTEFEST_MULT, erntefestWindowKey, isErntefestActive } from '../events'
import { SKY } from '../extrasCore'
import { FLASH_MULT } from '../flashEvent'
import { collectionMult, weatherYieldMult, wheelYieldMult } from '../gardenLife'
import { legacyGardenMult } from '../generations'
import { GENERATORS, generatorRate } from '../generators'
import { deepYieldMult } from '../longLoop'
import { CLAN_BOOST_MAX, type CosmeticId, YIELD_BOOST_MULT, weekKey } from '../monetization'
import { LEVEL_REWARDS, levelProductionMult, levelProgress } from '../progression'
import { projectsMult } from '../projects'
import { type QuestProgress, syncQuestDay } from '../quests'
import { residentsMult } from '../residents'
import { cardAreaMult, cardGlobalMult } from '../seasonCards'
import { weatherBuffMult } from '../weatherEvents'
import { type GameState, TURBO_MULT } from './types'

export function playerLevelOf(state: GameState): number {
  return levelProgress(state.playerXp).level
}

export function withQuestSync(state: GameState, now = Date.now()): GameState {
  const synced = syncQuestDay(state.questDayKey, state.quests, now)
  if (
    synced.dayKey === state.questDayKey &&
    synced.quests === state.quests
  ) {
    return state
  }
  return {
    ...state,
    questDayKey: synced.dayKey,
    quests: synced.quests,
  }
}

export function bumpQuest(
  state: GameState,
  kind: QuestProgress['kind'],
  amount: number,
  now = Date.now(),
): GameState {
  const base = withQuestSync(state, now)
  if (amount <= 0) return base
  let changed = false
  const quests = base.quests.map((q) => {
    if (q.kind !== kind || q.claimed) return q
    if (q.progress >= q.target) return q
    changed = true
    return {
      ...q,
      progress: Math.min(q.target, q.progress + amount),
    }
  })
  return changed ? { ...base, quests } : base
}

export function grantCosmetic(owned: CosmeticId[], id: CosmeticId): CosmeticId[] {
  if (owned.includes(id)) return owned
  return [...owned, id]
}

/** Apply pending level-reward crumbs up to current Spieler-Level. */
export function applyLevelRewards(state: GameState, now = Date.now()): GameState {
  const level = playerLevelOf(state)
  let next = state
  let changed = false
  for (const reward of LEVEL_REWARDS) {
    if (reward.level > level) continue
    if (next.claimedLevelRewards.includes(reward.level)) continue
    changed = true
    let ernte = next.ernte
    let erbstuecke = next.erbstuecke
    let samen = next.samen
    let ownedCosmetics = next.ownedCosmetics
    if (reward.kind === 'ernte') ernte += reward.amount ?? 0
    if (reward.kind === 'erbstuecke') erbstuecke += reward.amount ?? 0
    if (reward.kind === 'samen') samen += reward.amount ?? 0
    if (reward.kind === 'cosmetic' && reward.cosmeticId) {
      ownedCosmetics = grantCosmetic(ownedCosmetics, reward.cosmeticId)
    }
    next = {
      ...next,
      ernte,
      erbstuecke,
      samen,
      ownedCosmetics,
      claimedLevelRewards: [...next.claimedLevelRewards, reward.level],
      lastSeen: now,
    }
  }
  return changed ? next : state
}

export function withXp(state: GameState, amount: number, now = Date.now()): GameState {
  if (amount <= 0) return state
  const next = {
    ...state,
    playerXp: state.playerXp + amount,
    lastSeen: now,
  }
  return applyLevelRewards(next, now)
}

/** Sync event progress window; reset progress when a new erntefest window opens. */
export function syncEventWindow(state: GameState, now = Date.now()): GameState {
  if (!isErntefestActive(now)) return state
  const key = erntefestWindowKey(now)
  if (state.erntefestProgressKey === key) return state
  return {
    ...state,
    erntefestProgressKey: key,
    erntefestErnte: 0,
  }
}

/** Effective clan multiplier honoring expiry + hard max. */
export function effectiveClanMult(state: GameState, now = Date.now()): number {
  if (state.vereinBoostExpiresAt > 0 && now >= state.vereinBoostExpiresAt) {
    return 1
  }
  if (state.vereinBoostExpiresAt <= 0) return 1
  return Math.min(CLAN_BOOST_MAX, Math.max(1, state.vereinMult))
}

/** Drop expired clan boost fields (idempotent). */
export function syncClanBoost(state: GameState, now = Date.now()): GameState {
  if (state.vereinBoostExpiresAt > 0 && now >= state.vereinBoostExpiresAt) {
    return { ...state, vereinMult: 1, vereinBoostExpiresAt: 0 }
  }
  return state
}

/** Clear expired personal yield boost. */
export function syncYieldBoost(state: GameState, now = Date.now()): GameState {
  if (state.yieldBoostExpiresAt > 0 && now >= state.yieldBoostExpiresAt) {
    return { ...state, yieldBoostExpiresAt: 0 }
  }
  return state
}

/** Reset battle-pass progress when the local week rolls. */
export function syncGartenwoche(state: GameState, now = Date.now()): GameState {
  const key = weekKey(now)
  if (state.gartenwocheKey === key) return state
  return {
    ...state,
    gartenwocheKey: key,
    gartenwocheXp: 0,
    gartenwocheClaimedFree: [],
    gartenwochePremium: false,
    gartenwocheClaimedPremium: [],
    gartenwocheXpDay: '',
  }
}

export function syncMonetization(state: GameState, now = Date.now()): GameState {
  return syncGartenwoche(syncYieldBoost(syncClanBoost(state, now), now), now)
}

export function effectiveYieldBoostMult(state: GameState, now = Date.now()): number {
  if (state.yieldBoostExpiresAt <= 0 || now >= state.yieldBoostExpiresAt) return 1
  return YIELD_BOOST_MULT
}

export function eventProductionMult(now = Date.now()): number {
  return isErntefestActive(now) ? ERNTEFEST_MULT : 1
}

export function flashProductionMult(state: GameState, now = Date.now()): number {
  if (!state.flashEventId) return 1
  if (state.flashEndsAt <= now) return 1
  return FLASH_MULT
}

/**
 * Nachbarschaftshilfe — first pass only (no Tiefer Winter / Generation yet):
 * Gartenjahre 11–14 get a production tailwind so the steep gate before the
 * first Tiefer Winter never turns into a 16–24 h season. Later passes are
 * paced by the Sprösslings-Laden instead (a flatter gate there would turn
 * Tiefer Winter into a farm loop).
 */
export const NEIGHBOUR_FROM = 10
export const NEIGHBOUR_STEP = 1.6

export function neighbourMult(state: GameState): number {
  if (state.tiefeWinter > 0 || state.generation > 0) return 1
  const steps = Math.min(state.saisonenden, 13) - NEIGHBOUR_FROM
  return steps > 0 ? Math.pow(NEIGHBOUR_STEP, steps) : 1
}

export function turboMult(state: GameState, now = Date.now()): number {
  return state.turboEndsAt > now ? TURBO_MULT : 1
}

/** Permanent multipliers from Kapitel 2 and Generationen (shown in HUD). */
export function expansionGardenMult(state: GameState): number {
  return chaptersGardenMult(state.chapters) * legacyGardenMult(state.legacy) * residentsMult(state.residentsSeen) * hybridsMult(state.hybrids) * projectsMult(state.projects)
}

export function productionPerSecond(state: GameState, now = Date.now()): number {
  const mPrestige = prestigeMultiplier(state.truhe)
  const mClan = effectiveClanMult(state, now)
  const mEvent = eventProductionMult(now)
  const mFlash = flashProductionMult(state, now)
  const mLevel = levelProductionMult(playerLevelOf(state))
  const mYield = effectiveYieldBoostMult(state, now)
  let sum = 0
  for (const def of GENERATORS) {
    const owned = state.owned[def.id] ?? 0
    const branch = state.branches[def.id]
    const mEff = efficiencyMult(branch?.efficiency ?? 0)
    sum += generatorRate(def, owned) * mEff * cardAreaMult(state.seasonCard, def.id, state.seasonCardAusbau)
  }
  return (
    sum *
    cardGlobalMult(state.seasonCard) *
    challengesMult(state.challengesDone) *
    mPrestige *
    mClan *
    mEvent *
    mFlash *
    mLevel *
    mYield *
    deepYieldMult(state.sproesslingLaden) *
    collectionMult(state.collection) *
    weatherYieldMult(now) *
    weatherBuffMult(state.weatherBuff, now) *
    wheelYieldMult(state.wheelBuff, state.saisonenden) *
    expansionGardenMult(state) *
    neighbourMult(state) *
    rainbowMult(state, now) *
    turboMult(state, now)
  )
}

/* ———————————— Kapitel (Streuobstwiese, Weinberg …) ———————————— */

export function rainbowMult(state: GameState, now = Date.now()): number {
  return state.rainbowEndsAt > now ? SKY.rainbowMult : 1
}
