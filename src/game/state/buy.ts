/** Spielkern — Ausbauen, Zweige, Aufgaben, Erfolge. Öffentlich über src/game/state.ts. */
import { ACHIEVEMENTS, type AchievementId, isAchievementComplete } from '../achievements'
import { BRANCH_MAX_RANK, type BranchKind, branchCost, capacityCostMult } from '../branches'
import { challengeAllowsBuy } from '../challenges'
import { saatgutkisteMult } from '../truhe'
import { CONTEST_KG } from '../extrasCore'
import { FEST_EARN } from '../fests'
import { rollVarietyOnUpgrade } from '../gardenLife'
import { legacyCostMult } from '../generations'
import { GENERATORS, type GeneratorId, generatorCost, isGeneratorUnlocked } from '../generators'
import { gateSeasons } from '../longLoop'
import { XP_PER_UPGRADE } from '../progression'
import { SURPRISE_MIN_GAP_MS, rollUpgradeSurprise } from '../surpriseJumps'
import { withMilestoneChest } from './chapters'
import {
  bumpQuest,
  grantCosmetic,
  playerLevelOf,
  productionPerSecond,
  turboMult,
  withQuestSync,
  withXp,
} from './core'
import { bumpRecipe, growPumpkin } from './extras'
import { earnFest } from './fest'
import type { GameState } from './types'

export function lineCostMult(state: GameState, id: GeneratorId): number {
  const branch = state.branches[id]
  return (
    saatgutkisteMult(state.truhe) *
    capacityCostMult(branch?.capacity ?? 0) *
    legacyCostMult(state.legacy)
  )
}

/**
 * `mode`: 'manual' rolls surprises; 'bulk' (2nd+ level of a Mengenkauf) and
 * 'helper' (Gartenhelfer) never do — otherwise fast buying would chain the
 * every-5th-Ausbau crumbs into an exponential snowball.
 */
export type BuyMode = 'manual' | 'bulk' | 'helper'

export function buyGenerator(state: GameState, id: GeneratorId, mode: BuyMode | boolean = 'manual'): GameState {
  const buyMode: BuyMode = mode === true ? 'helper' : mode === false ? 'manual' : mode
  const fromHelper = buyMode === 'helper'
  const def = GENERATORS.find((g) => g.id === id)
  if (!def) return state
  if (!challengeAllowsBuy(state.challenge, id, state.owned)) return state
  const now = Date.now()
  const level = playerLevelOf(state)
  if (
    !isGeneratorUnlocked(
      def,
      state.ernteSeason,
      state.owned,
      state.truhe.kompostVomVorjahr > 0,
      level,
      gatePrestiges(state),
    )
  ) {
    return state
  }
  const owned = state.owned[id] ?? 0
  const cost = generatorCost(def, owned, lineCostMult(state, id))
  if (state.ernte < cost) return state
  let next: GameState = {
    ...state,
    ernte: state.ernte - cost,
    owned: { ...state.owned, [id]: owned + 1 },
    totalUpgrades: state.totalUpgrades + 1,
    lastSeen: now,
  }
  // Surprises scale with the steady rate — never with the Frühlingsschub
  const rate = productionPerSecond(next, now) / turboMult(next, now)
  const surprise =
    // Drossel erst, wenn „Max“ frei ist — vorher gibt es keinen anderen Weg als Einzelkauf
    buyMode === 'manual' && (!bulkUnlocks(state).max || now - state.lastSurpriseAt >= SURPRISE_MIN_GAP_MS)
      ? rollUpgradeSurprise(next.totalUpgrades, rate, next.ernteSeason)
      : null
  if (surprise) {
    next = {
      ...next,
      lastSurpriseAt: now,
      ernte: next.ernte + surprise.amount,
      ernteSeason: next.ernteSeason + surprise.amount,
      ernteLifetime: next.ernteLifetime + surprise.amount,
      lastSurprise: surprise,
    }
  }
  const variety = rollVarietyOnUpgrade(id, next.collection)
  if (variety) {
    next = { ...next, collection: [...next.collection, variety], lastVariety: variety }
  }
  next = withMilestoneChest(next, `g:${id}`, owned + 1)
  next = bumpRecipe(next, id, now)
  if (buyMode === 'manual') next = growPumpkin(next, CONTEST_KG.upgrade, now)
  next = bumpQuest(next, 'upgrades', 1, now)
  if (surprise) next = bumpQuest(next, 'earnErnte', surprise.amount, now)
  next = withXp(next, fromHelper ? 2 : XP_PER_UPGRADE, now)
  next = earnFest(next, fromHelper ? FEST_EARN.helperUpgrade : FEST_EARN.upgrade, now)
  return collectReadyAchievements(next, now)
}

export function buyBranch(
  state: GameState,
  id: GeneratorId,
  kind: BranchKind,
): GameState {
  const def = GENERATORS.find((g) => g.id === id)
  if (!def) return state
  const owned = state.owned[id] ?? 0
  if (owned < 1) return state
  const ranks = state.branches[id] ?? { efficiency: 0, capacity: 0 }
  const rank = kind === 'efficiency' ? ranks.efficiency : ranks.capacity
  if (rank >= BRANCH_MAX_RANK) return state
  const cost = branchCost(def, kind, rank)
  if (state.ernte < cost) return state
  const now = Date.now()
  const nextRanks = {
    ...ranks,
    [kind]: rank + 1,
  }
  let next: GameState = {
    ...state,
    ernte: state.ernte - cost,
    branches: { ...state.branches, [id]: nextRanks },
    lastSeen: now,
  }
  // Small XP crumb so branches feed Spieler-Level without outpacing main upgrades
  return withXp(next, Math.max(3, Math.floor(XP_PER_UPGRADE / 2)), now)
}

export function claimQuestReward(
  state: GameState,
  questId: string,
  now = Date.now(),
): GameState {
  const base = withQuestSync(state, now)
  const quest = base.quests.find((q) => q.id === questId)
  if (!quest || quest.claimed) return state
  if (quest.progress < quest.target) return state
  const quests = base.quests.map((q) =>
    q.id === questId ? { ...q, claimed: true } : q,
  )
  return {
    ...base,
    ernte: base.ernte + quest.rewardErnte,
    ernteSeason: base.ernteSeason + quest.rewardErnte,
    ernteLifetime: base.ernteLifetime + quest.rewardErnte,
    samen: base.samen + quest.rewardSamen,
    quests,
    lastSeen: now,
  }
}

export function claimAchievement(
  state: GameState,
  id: AchievementId,
  now = Date.now(),
): GameState {
  if (state.claimedAchievements.includes(id)) return state
  const def = ACHIEVEMENTS.find((a) => a.id === id)
  if (!def) return state
  const stats = {
    totalUpgrades: state.totalUpgrades,
    ernteLifetime: state.ernteLifetime,
    claimedDailyOnce: state.claimedDailyOnce,
    claimedOfflineOnce: state.claimedOfflineOnce,
    playerLevel: playerLevelOf(state),
    saisonenden: state.saisonenden,
    owned: state.owned,
  }
  if (!isAchievementComplete(id, stats)) return state

  let ernte = state.ernte
  let erbstuecke = state.erbstuecke
  let samen = state.samen
  let ownedCosmetics = state.ownedCosmetics
  if (def.rewardKind === 'ernte') ernte += def.rewardAmount ?? 0
  if (def.rewardKind === 'erbstuecke') erbstuecke += def.rewardAmount ?? 0
  if (def.rewardKind === 'samen') samen += def.rewardAmount ?? 0
  if (def.rewardKind === 'cosmetic' && def.cosmeticId) {
    ownedCosmetics = grantCosmetic(ownedCosmetics, def.cosmeticId)
  }
  return {
    ...state,
    ernte,
    erbstuecke,
    samen,
    ownedCosmetics,
    claimedAchievements: [...state.claimedAchievements, id],
    lastSeen: now,
  }
}

/** Auto-claim any newly completed achievements (call after meaningful actions). */
export function collectReadyAchievements(
  state: GameState,
  now = Date.now(),
): GameState {
  let next = state
  for (const def of ACHIEVEMENTS) {
    if (next.claimedAchievements.includes(def.id)) continue
    const stats = {
      totalUpgrades: next.totalUpgrades,
      ernteLifetime: next.ernteLifetime,
      claimedDailyOnce: next.claimedDailyOnce,
      claimedOfflineOnce: next.claimedOfflineOnce,
      playerLevel: playerLevelOf(next),
      saisonenden: next.saisonenden,
      owned: next.owned,
    }
    if (isAchievementComplete(def.id, stats)) {
      next = claimAchievement(next, def.id, now)
    }
  }
  return next
}

/**
 * Mengenkauf unlocks over time (keeps the early game simple):
 *  Max — after the 2nd Saisonende, ×5 — from Gartenjahr 4,
 *  „Alles ausbauen“ — from Gartenjahr 6. Tiefer Winter / Generation keep them.
 */
export function bulkUnlocks(state: GameState): { max: boolean; five: boolean; all: boolean } {
  const meta = state.tiefeWinter > 0 || state.generation > 0
  return {
    max: meta || state.saisonenden >= 2,
    five: meta || state.saisonenden >= 3,
    all: meta || state.saisonenden >= 5,
  }
}

/** Season count used for Gartenjahr gates (includes Gartenwissen). */
export function gatePrestiges(state: GameState): number {
  return gateSeasons(state.saisonenden, state.sproesslingLaden)
}
