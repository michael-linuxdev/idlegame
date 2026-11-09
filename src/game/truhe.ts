/**
 * Omas Truhe (Meta-Laden, bezahlt mit Erbstücken): Gegenstände, Kosten,
 * Freischaltung beim Neuanlegen und Effekte. Die Saisonende-Auszahlung
 * steht in economy.ts.
 */
import { t } from '../i18n'
import { OFFLINE_SOFT_HOURS, OFFLINE_HARD_HOURS, erbstueckePayout, modulesOnlineCount, moduleLevelsTotal, TAP_BONUS_SECONDS } from './economy'
import type { GeneratorId } from './generators'

/**
 * Module levels are the primary Truhe-unlock clock (resets each Soft-Prestige).
 * Kept modest so ~8–12 levels/min rebuild opens ranks over minutes, not seconds.
 */
export const TRUHE_UNLOCK_PER_MODULE_LEVEL = 800

/**
 * Soft ernte contribution toward unlocks — √ so late-run snowball cannot open
 * the entire tree the moment Ernte explodes. Capped so ernte alone never
 * replaces rebuild.
 */
export const TRUHE_UNLOCK_ERNTE_SQRT_DIV = 100

export const TRUHE_UNLOCK_ERNTE_CAP = 30_000

/** @deprecated Use TRUHE_UNLOCK_PER_MODULE_LEVEL — kept for older docs/imports. */
export const TRUHE_UNLOCK_ERNTE_PER_MODULE_LEVEL = TRUHE_UNLOCK_PER_MODULE_LEVEL

export interface TruheUpgrades {
  /** Omas Gartenschere — +5% global Ernte/s per rank */
  gartenschere: number
  /** Alte Gießkanne — +1h soft / +2h hard offline per rank */
  alteGiesskanne: number
  /** Saatgutkiste — 0.98^rank cost mult */
  saatgutkiste: number
  /** Kompost vom Vorjahr — start each Saison with Kompost planted (max 1) */
  kompostVomVorjahr: number
  /** Messing-Brause — +15s Gießen bonus duration per rank */
  messingBrause: number
  /** Notgroschen — start each Saison with bonus Ernte */
  notgroschen: number
  /** Strohhut — +2% global Ernte/s per rank (mid-tier Erbstücke sink) */
  strohhut: number
  /** Laterne — +30 min soft offline per rank (Pflege mid-tier) */
  laterne: number
  /** Gute Erde — start each Saison with G1 (gemuesebeet) at this level */
  guteErde: number
  /** Rosenbogen — +1.5% global Ernte/s per rank (late Erbstücke sink) */
  rosenbogen: number
}

export const EMPTY_TRUHE: TruheUpgrades = {
  gartenschere: 0,
  alteGiesskanne: 0,
  saatgutkiste: 0,
  kompostVomVorjahr: 0,
  messingBrause: 0,
  notgroschen: 0,
  strohhut: 0,
  laterne: 0,
  guteErde: 0,
  rosenbogen: 0,
}

export type TruheItemId = keyof TruheUpgrades

export type PrestigeBranchId = 'yield' | 'pflege' | 'start'

export interface TruheItem {
  id: TruheItemId
  branch: PrestigeBranchId
  name: string
  blurb: string
  maxRank: number
  /** Cost in Erbstücke at current rank (before purchase) */
  cost: (rank: number) => number
  effectLabel: (rank: number) => string
  /**
   * This-run soft earned required before purchasing `rank` (0-based).
   * Progressive unlock — keeps post-prestige Erbstücke spending stretched
   * across rebuild (~15–45 min), not a 50s dump.
   */
  rankUnlockErnte?: (rank: number) => number
  /** Modules online (owned ≥ 1) required before any rank of this item. */
  unlockModulesOnline?: number
}

/** Geometric Erbstücke cost — one unlocked band must not clear a mid payout in <1 min. */
function truheGeoCost(base: number, growth: number, rank: number): number {
  return Math.ceil(base * Math.pow(growth, Math.max(0, rank)))
}

/**
 * Staggered unlock offsets so branches reopen one-by-one during rebuild,
 * not as a single mid-band dump.
 */
const TRUHE_UNLOCK_OFFSET: Record<TruheItemId, number> = {
  gartenschere: 0,
  saatgutkiste: 5_000,
  strohhut: 20_000,
  rosenbogen: 0,
  alteGiesskanne: 8_000,
  messingBrause: 14_000,
  laterne: 24_000,
  kompostVomVorjahr: 0,
  notgroschen: 3_000,
  guteErde: 22_000,
}

/**
 * Base tip ids — rank 0 always free on the first Soft-Prestige.
 * Each completed prestige opens one additional tip rank on these ids so P2+
 * never greets an already-owned empty shop (playtest-d).
 */
const TRUHE_IMMEDIATE_IDS: ReadonlySet<TruheItemId> = new Set([
  'gartenschere',
  'saatgutkiste',
  'alteGiesskanne',
  'notgroschen',
  'kompostVomVorjahr',
])

/**
 * Wave-2 tip ids: join the prestige tip band from Soft-Prestige count ≥ 2
 * (rank depth = saisonenden − 1) so mid-branch tips arrive without a full rebuild.
 */
const TRUHE_WAVE2_TIP_IDS: ReadonlySet<TruheItemId> = new Set([
  'messingBrause',
  'strohhut',
])

/** Lifetime prestige credit toward rebuild-gated ranks (not a full dump). */
export const TRUHE_UNLOCK_PER_PRESTIGE = 8_000

/** Tip ranks opened immediately after `saisonenden` Soft-Resets (min 1). */
export function tipBandDepth(saisonenden: number): number {
  return Math.max(1, Math.floor(Math.max(0, saisonenden)))
}

/** Whether this rank is in the free post-prestige tip band. */
export function isTruheTipRank(
  id: TruheItemId,
  rank: number,
  saisonenden: number,
): boolean {
  if (rank < 0) return false
  if (id === 'kompostVomVorjahr') return rank === 0
  const depth = tipBandDepth(saisonenden)
  if (TRUHE_IMMEDIATE_IDS.has(id) && rank < depth) return true
  if (TRUHE_WAVE2_TIP_IDS.has(id) && saisonenden >= 2 && rank < depth - 1) {
    return true
  }
  return false
}

/**
 * Progress needed before purchasing `rank` (0-based) of this item.
 * `saisonenden` = Soft-Resets completed (post-prestige state.saisonenden).
 */
export function truheRankUnlockNeed(
  id: TruheItemId,
  rank: number,
  saisonenden = 0,
): number {
  if (id === 'kompostVomVorjahr') return 0
  if (isTruheTipRank(id, rank, saisonenden)) return 0

  const credit = Math.max(0, saisonenden) * TRUHE_UNLOCK_PER_PRESTIGE

  if (id === 'rosenbogen') {
    // Reachable mid post-P2 session (~23 module levels + soft ernte, or ~60 levels alone).
    return Math.max(0, 48_000 + rank * 32_000 - credit)
  }

  const offset = TRUHE_UNLOCK_OFFSET[id]
  const raw =
    rank === 0
      ? 12_000 + Math.floor(offset / 2)
      : offset + 28_000 + (rank - 1) * (32_000 + rank * 3_000)
  return Math.max(0, raw - credit)
}

export const TRUHE_ITEMS: TruheItem[] = [
  {
    id: 'gartenschere',
    branch: 'yield',
    name: t.truhe.gartenschere.name,
    blurb: t.truhe.gartenschere.blurb,
    maxRank: 40,
    cost: (rank) => truheGeoCost(25, 1.3, rank),
    effectLabel: (rank) => t.truhe.gartenschere.effect(rank),
    rankUnlockErnte: (rank) => truheRankUnlockNeed('gartenschere', rank),
  },
  {
    id: 'saatgutkiste',
    branch: 'yield',
    name: t.truhe.saatgutkiste.name,
    blurb: t.truhe.saatgutkiste.blurb,
    maxRank: 20,
    cost: (rank) => truheGeoCost(18, 1.28, rank),
    effectLabel: (rank) => t.truhe.saatgutkiste.effect(rank),
    rankUnlockErnte: (rank) => truheRankUnlockNeed('saatgutkiste', rank),
  },
  {
    id: 'strohhut',
    branch: 'yield',
    name: t.truhe.strohhut.name,
    blurb: t.truhe.strohhut.blurb,
    maxRank: 25,
    cost: (rank) => truheGeoCost(36, 1.32, rank),
    effectLabel: (rank) => t.truhe.strohhut.effect(rank),
    rankUnlockErnte: (rank) => truheRankUnlockNeed('strohhut', rank),
  },
  {
    id: 'rosenbogen',
    branch: 'yield',
    name: t.truhe.rosenbogen.name,
    blurb: t.truhe.rosenbogen.blurb,
    maxRank: 20,
    cost: (rank) => truheGeoCost(60, 1.34, rank),
    effectLabel: (rank) => t.truhe.rosenbogen.effect(rank),
    rankUnlockErnte: (rank) => truheRankUnlockNeed('rosenbogen', rank),
  },
  {
    id: 'alteGiesskanne',
    branch: 'pflege',
    name: t.truhe.alteGiesskanne.name,
    blurb: t.truhe.alteGiesskanne.blurb,
    maxRank: 8,
    cost: (rank) => truheGeoCost(30, 1.4, rank),
    effectLabel: (rank) => t.truhe.alteGiesskanne.effect(rank),
    rankUnlockErnte: (rank) => truheRankUnlockNeed('alteGiesskanne', rank),
  },
  {
    id: 'messingBrause',
    branch: 'pflege',
    name: t.truhe.messingBrause.name,
    blurb: t.truhe.messingBrause.blurb,
    maxRank: 12,
    cost: (rank) => truheGeoCost(20, 1.32, rank),
    effectLabel: (rank) => t.truhe.messingBrause.effect(rank),
    rankUnlockErnte: (rank) => truheRankUnlockNeed('messingBrause', rank),
  },
  {
    id: 'laterne',
    branch: 'pflege',
    name: t.truhe.laterne.name,
    blurb: t.truhe.laterne.blurb,
    maxRank: 15,
    cost: (rank) => truheGeoCost(34, 1.34, rank),
    effectLabel: (rank) => t.truhe.laterne.effect(rank),
    rankUnlockErnte: (rank) => truheRankUnlockNeed('laterne', rank),
  },
  {
    id: 'kompostVomVorjahr',
    branch: 'start',
    name: t.truhe.kompostVomVorjahr.name,
    blurb: t.truhe.kompostVomVorjahr.blurb,
    maxRank: 1,
    cost: () => 60,
    effectLabel: (rank) => t.truhe.kompostVomVorjahr.effect(rank),
  },
  {
    id: 'notgroschen',
    branch: 'start',
    name: t.truhe.notgroschen.name,
    blurb: t.truhe.notgroschen.blurb,
    maxRank: 12,
    cost: (rank) => truheGeoCost(20, 1.36, rank),
    effectLabel: (rank) => t.truhe.notgroschen.effect(rank),
    rankUnlockErnte: (rank) => truheRankUnlockNeed('notgroschen', rank),
  },
  {
    id: 'guteErde',
    branch: 'start',
    name: t.truhe.guteErde.name,
    blurb: t.truhe.guteErde.blurb,
    maxRank: 10,
    cost: (rank) => truheGeoCost(45, 1.38, rank),
    effectLabel: (rank) => t.truhe.guteErde.effect(rank),
    unlockModulesOnline: 1,
    rankUnlockErnte: (rank) => truheRankUnlockNeed('guteErde', rank),
  },
]

export const PRESTIGE_BRANCHES: {
  id: PrestigeBranchId
  title: string
  blurb: string
}[] = [
  {
    id: 'yield',
    title: t.prestige.branchYieldTitle,
    blurb: t.prestige.branchYieldBlurb,
  },
  {
    id: 'pflege',
    title: t.prestige.branchPflegeTitle,
    blurb: t.prestige.branchPflegeBlurb,
  },
  {
    id: 'start',
    title: t.prestige.branchStartTitle,
    blurb: t.prestige.branchStartBlurb,
  },
]

export function prestigeMultiplier(upgrades: TruheUpgrades): number {
  return (
    1 +
    upgrades.gartenschere * 0.05 +
    upgrades.strohhut * 0.02 +
    upgrades.rosenbogen * 0.015
  )
}

export function saatgutkisteMult(upgrades: TruheUpgrades): number {
  return Math.pow(0.98, upgrades.saatgutkiste)
}

export function offlineCapsHours(upgrades: TruheUpgrades): {
  soft: number
  hard: number
} {
  return {
    soft: OFFLINE_SOFT_HOURS + upgrades.alteGiesskanne * 1 + upgrades.laterne * 0.5,
    hard: OFFLINE_HARD_HOURS + upgrades.alteGiesskanne * 2 + upgrades.laterne * 1,
  }
}

/** Tap bonus seconds including Tap Mastery ranks. */
export function tapBonusSeconds(upgrades: TruheUpgrades): number {
  return TAP_BONUS_SECONDS + upgrades.messingBrause * 15
}

/**
 * Soft wallet granted at the start of a prestige run (Seed-Purse meta).
 * Callers must still floor against the next G1 Ausbauen cost — see
 * `prestigeStartErnteFloor` / `createPostPrestigeState`.
 */
export function prestigeStartErnte(upgrades: TruheUpgrades): number {
  // Slightly juicier start crumbs so post-prestige Ernte doesn't feel flat.
  return upgrades.notgroschen * 80
}

/**
 * Minimum spendable Ernte after Soft-Prestige so the primary Ausbauen CTA is
 * never disabled at run start (mirrors Day-1 ernte:28 vs G1 cost ~23).
 */
export function prestigeStartErnteFloor(nextG1Cost: number): number {
  const cost = Math.max(1, Math.floor(nextG1Cost))
  // +5 matches createInitialState float; also covers tiny Saatgutkiste rounding.
  return cost + 5
}

/** Starting G1 module level after Soft-Prestige (guteErde). */
export function prestigeStartModuleLevel(upgrades: TruheUpgrades): number {
  return Math.max(0, upgrades.guteErde)
}

/**
 * Effective unlock progress: rebuild (module levels) primary + soft √ ernte.
 * Raw ernte must not open the whole tree mid-run; leftover Erbstücke should feel
 * like “waiting on next unlock”, not “shop empty”.
 */
export function truheUnlockProgress(
  ernteThisRun: number,
  owned: Partial<Record<GeneratorId, number>>,
): number {
  const modules =
    moduleLevelsTotal(owned) * TRUHE_UNLOCK_PER_MODULE_LEVEL
  const erntePart = Math.min(
    TRUHE_UNLOCK_ERNTE_CAP,
    Math.floor(
      Math.sqrt(Math.max(0, ernteThisRun) / TRUHE_UNLOCK_ERNTE_SQRT_DIV),
    ),
  )
  return modules + erntePart
}

/** Whether the next rank of a Truhe item is unlocked this run. */
export function truheRankUnlocked(
  item: TruheItem,
  rank: number,
  ernteThisRun: number,
  owned: Partial<Record<GeneratorId, number>>,
  saisonenden = 0,
): boolean {
  if (rank < 0 || rank >= item.maxRank) return false
  const modulesOnline = modulesOnlineCount(owned)
  if (
    item.unlockModulesOnline != null &&
    modulesOnline < item.unlockModulesOnline
  ) {
    return false
  }
  const needErnte = truheRankUnlockNeed(item.id, rank, saisonenden)
  return truheUnlockProgress(ernteThisRun, owned) >= needErnte
}

/** How many Truhe ranks are affordable + unlocked right now. */
export function countAffordableTruheBuys(
  upgrades: TruheUpgrades,
  erbstuecke: number,
  ernteThisRun: number,
  owned: Partial<Record<GeneratorId, number>>,
  saisonenden = 0,
): number {
  let n = 0
  for (const item of TRUHE_ITEMS) {
    const rank = upgrades[item.id]
    if (rank >= item.maxRank) continue
    if (!truheRankUnlocked(item, rank, ernteThisRun, owned, saisonenden)) {
      continue
    }
    if (erbstuecke >= item.cost(rank)) n += 1
  }
  return n
}

/** Starting owned modules right after Soft-Prestige (guteErde only). */
export function postPrestigeStartOwned(
  upgrades: TruheUpgrades,
): Partial<Record<GeneratorId, number>> {
  const owned: Partial<Record<GeneratorId, number>> = {}
  const startLevel = prestigeStartModuleLevel(upgrades)
  if (startLevel > 0) owned.gemuesebeet = startLevel
  return owned
}

/**
 * Affordable Truhe buys immediately after Soft-Prestige with current wallet
 * + pending payout. Used so “lohnt sich” never fires into an empty tip band.
 */
export function countAffordableTruheBuysAfterPrestige(args: {
  upgrades: TruheUpgrades
  erbstuecke: number
  ernteSeason: number
  saisonenden: number
  probe?: boolean
}): number {
  const postPrestiges = args.saisonenden + 1
  const wallet = args.erbstuecke + erbstueckePayout(args.ernteSeason, args.saisonenden, args.probe)
  return countAffordableTruheBuys(
    args.upgrades,
    wallet,
    0,
    postPrestigeStartOwned(args.upgrades),
    postPrestiges,
  )
}

/** Approx. module levels still needed for the nearest locked Truhe rank. */
export function modulesToNextTruheUnlock(
  upgrades: TruheUpgrades,
  ernteThisRun: number,
  owned: Partial<Record<GeneratorId, number>>,
  saisonenden = 0,
): number | null {
  const next = nextLockedTruheUnlock(
    upgrades,
    ernteThisRun,
    owned,
    saisonenden,
  )
  if (!next) return null
  const deficit = Math.max(0, next.need - next.have)
  if (deficit <= 0) return 0
  return Math.ceil(deficit / TRUHE_UNLOCK_PER_MODULE_LEVEL)
}

export interface NextTruheUnlock {
  item: TruheItem
  rank: number
  need: number
  have: number
  /** 0…1 progress toward this unlock. */
  ratio: number
}

/**
 * Nearest locked Truhe rank (lowest need). Used for shop “waiting” banner
 * and per-row progress when the wallet is full but the band is gated.
 */
export function nextLockedTruheUnlock(
  upgrades: TruheUpgrades,
  ernteThisRun: number,
  owned: Partial<Record<GeneratorId, number>>,
  saisonenden = 0,
): NextTruheUnlock | null {
  const have = truheUnlockProgress(ernteThisRun, owned)
  const online = modulesOnlineCount(owned)
  let best: NextTruheUnlock | null = null
  for (const item of TRUHE_ITEMS) {
    const rank = upgrades[item.id]
    if (rank >= item.maxRank) continue
    if (
      item.unlockModulesOnline != null &&
      online < item.unlockModulesOnline
    ) {
      const need = truheRankUnlockNeed(item.id, rank, saisonenden)
      const candidate: NextTruheUnlock = {
        item,
        rank,
        need: Math.max(need, 1),
        have,
        ratio: 0,
      }
      if (!best || candidate.need < best.need) best = candidate
      continue
    }
    const need = truheRankUnlockNeed(item.id, rank, saisonenden)
    if (have >= need) continue
    const candidate: NextTruheUnlock = {
      item,
      rank,
      need,
      have,
      ratio: need > 0 ? Math.min(1, have / need) : 1,
    }
    if (!best || candidate.need < best.need) best = candidate
  }
  return best
}

/** Immediate tip-band Truhe sink at a given prestige count — balance probe. */
export function immediateTruheSinkCost(saisonenden = 1): number {
  let total = 0
  for (const item of TRUHE_ITEMS) {
    for (let rank = 0; rank < item.maxRank; rank++) {
      if (truheRankUnlockNeed(item.id, rank, saisonenden) > 0) break
      total += item.cost(rank)
    }
  }
  return total
}
