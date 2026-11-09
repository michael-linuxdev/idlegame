/**
 * Economy knobs — core formulas (R(n), C(n), offline) unchanged.
 * Player-facing names come from src/theme/strings.ts.
 * Interne Namen folgen den Spielbegriffen (docs/cleanup/namen.md).
 *
 * Balance pass IG-31 (overnight): prestige was ~5 min for engaged play vs
 * design 45–90 min. Raised P_min base + slowed generator ladder (see generators.ts).
 *
 * Soft-Prestige depth (IG-53 / playtest 2026-11-07 + b + 2026-11-08 + d):
 * Erbstücke soft-gate every prestige; interleaved rank unlocks during rebuild;
 * steeper cost curve; √ payout soft-capped so runaway ernte cannot dump the
 * unlocked band in ~40s. Tip band scales with lifetime saisonenden so P2+ never
 * lands on an empty Truhe after tips are already owned.
 */

import { t } from '../i18n'
import type { GeneratorId } from './generators'

export const OFFLINE_SOFT_HOURS = 8
export const OFFLINE_HARD_HOURS = 24
export const OFFLINE_DECAY_RATE = 0.5

/**
 * Prestige gate: P_min = PRESTIGE_BASE · 1.8^p
 * IG-31: 50_000 → 2_000_000 so first Soft-Reset lands ~45–75 min engaged
 * (was ~5–10 min after content-depth rate snowball).
 */
export const PRESTIGE_BASE_ERNTE = 2_000_000
export const PRESTIGE_GROWTH = 1.8

/**
 * Saisonende balance knobs (tuned with scripts/balance/sim.ts).
 *  - gate(p)   = prestigeBase · prestigeGrowth^min(p, knee) · lateGrowth^max(0, p − knee)
 *  - payout    = payoutBase · payoutGrowth^p · f(ernte / gate)
 *    f(r) = √r up to r = 4 (2× base), then +0.5 per doubling — staying a
 *    bit longer pays, spamming at the gate pays the base, nothing explodes.
 * Mutable on purpose so the simulator can sweep values; the game never
 * writes to it.
 */
export const BALANCE = {
  prestigeBase: 25_000_000,
  prestigeGrowth: 3.2,
  /** Seasons that still open new garden corners — steep phase */
  prestigeKnee: 13,
  /** Growth per season after the knee (meta-paced, avoids a content wall) */
  prestigeLateGrowth: 1.12,
  payoutBase: 100,
  payoutGrowth: 1.12,
  /**
   * Probe-Winter (2026-11-09): nur Gartenjahr 1 hat eine eigene, niedrige
   * Schwelle, damit das erste Saisonende in die erste Sitzung fällt
   * (Dauerspieler ~18 min statt ~60). Ab Gartenjahr 2 gilt die Kurve oben.
   */
  firstSeasonGate: 5_000_000,
  /** Auszahlung an der Probe-Schwelle (2–3 Truhen-Käufe); 45 bremste das Spiel danach (Sim: Jahr 12 = 388 min aktiv). */
  firstSeasonPayout: 70,
}

/** Modules that must be online (owned ≥ 1) before Run 2+ Soft-Prestige. */
export const PRESTIGE_MIN_MODULES_ONLINE = 3

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

/**
 * Soft-cap on √ Erbstücke payout (L2 agency without 39k runaway wallets).
 * Raw √ stays linear up to SOFT; overflow diminishes toward CEIL.
 */
export const ERBSTUECKE_PAYOUT_SOFT = 500
export const ERBSTUECKE_PAYOUT_CEIL = 1_600

/** Base Erbstücke paid exactly at the gate for this season. */
/** Probe-Winter gilt nur im allerersten Gartenjahr (nicht nach Tiefem Winter / Generation). */
export function isProbeYear(s: { saisonenden: number; tiefeWinter: number; generation: number }): boolean {
  return s.saisonenden <= 0 && s.tiefeWinter <= 0 && s.generation <= 0
}

export function payoutAtGate(saisonenden: number, probe = false): number {
  if (probe) return BALANCE.firstSeasonPayout
  return Math.round(BALANCE.payoutBase * Math.pow(BALANCE.payoutGrowth, Math.max(0, saisonenden)))
}

/** Min payout before Saisonende — the gate payout (kept for UI copy). */
export function prestigeMinErbstueckeForRun(saisonenden: number): number {
  return payoutAtGate(saisonenden)
}

/** Saisonende gate: Ernte this season ≥ prestigeBase · prestigeGrowth^p */
export function prestigeMinErnte(saisonenden: number, probe = false): number {
  if (probe) return BALANCE.firstSeasonGate
  return Math.floor(
    BALANCE.prestigeBase *
      Math.pow(BALANCE.prestigeGrowth, Math.min(Math.max(0, saisonenden), BALANCE.prestigeKnee)) *
      Math.pow(BALANCE.prestigeLateGrowth, Math.max(0, saisonenden - BALANCE.prestigeKnee)),
  )
}

/** Payout curve over r = ernte / gate. */
function payoutCurve(r: number): number {
  if (r <= 0) return 0
  if (r <= 4) return Math.sqrt(r)
  return 2 + 0.5 * Math.log2(r / 4)
}

/**
 * Erbstücke for ending the season now. Relative to this season's gate, so a
 * stronger garden doesn't turn Saisonende into a 2-minute loop.
 */
export function erbstueckePayout(ernteSeason: number, saisonenden = 0, probe = false): number {
  if (ernteSeason <= 0) return 0
  const r = ernteSeason / Math.max(1, prestigeMinErnte(saisonenden, probe))
  return Math.floor(payoutAtGate(saisonenden, probe) * payoutCurve(r))
}

/** Ernte needed this season to be paid `erbstuecke` (inverse of the √ band). */
export function ernteForErbstueckePayout(erbstuecke: number, saisonenden = 0, probe = false): number {
  if (erbstuecke <= 0) return 0
  const ratio = erbstuecke / Math.max(1, payoutAtGate(saisonenden, probe))
  return Math.ceil(prestigeMinErnte(saisonenden, probe) * ratio * ratio)
}

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

export function modulesOnlineCount(
  owned: Partial<Record<GeneratorId, number>>,
): number {
  let n = 0
  for (const level of Object.values(owned)) {
    if ((level ?? 0) >= 1) n += 1
  }
  return n
}

/** Sum of owned module levels (rebuild progress). */
export function moduleLevelsTotal(
  owned: Partial<Record<GeneratorId, number>>,
): number {
  let n = 0
  for (const level of Object.values(owned)) {
    n += Math.max(0, level ?? 0)
  }
  return n
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

export type PrestigeBlockReason =
  | 'ernte'
  | 'erbstuecke'
  | 'modules'
  | null

/** Soft-gate diagnostics for UI (Erbstücke floor every run + rebuild on Run 2+). */
export function prestigeBlockReason(args: {
  saisonenden: number
  ernteSeason: number
  owned: Partial<Record<GeneratorId, number>>
  probe?: boolean
}): PrestigeBlockReason {
  const min = prestigeMinErnte(args.saisonenden, args.probe)
  if (args.ernteSeason < min) return 'ernte'
  const payout = erbstueckePayout(args.ernteSeason, args.saisonenden, args.probe)
  if (payout <= 0) return 'ernte'
  if (
    args.saisonenden >= 1 &&
    modulesOnlineCount(args.owned) < PRESTIGE_MIN_MODULES_ONLINE
  ) {
    return 'modules'
  }
  return null
}

/**
 * Offline catchup Ernte for elapsed seconds at snapshot rate R (Ernte/s).
 * Soft full rate, then 50% until hard cap; nothing beyond hard.
 */
export function offlineCatchupErnte(
  ratePerSec: number,
  elapsedSec: number,
  softHours: number,
  hardHours: number,
): number {
  if (ratePerSec <= 0 || elapsedSec <= 0) return 0
  const tHours = elapsedSec / 3600
  const soft = softHours
  const hard = hardHours

  if (tHours <= soft) {
    return ratePerSec * tHours * 3600
  }
  if (tHours <= hard) {
    return (
      ratePerSec * soft * 3600 +
      ratePerSec * OFFLINE_DECAY_RATE * (tHours - soft) * 3600
    )
  }
  return (
    ratePerSec * soft * 3600 +
    ratePerSec * OFFLINE_DECAY_RATE * (hard - soft) * 3600
  )
}

/**
 * Active tap bonus — session hook, not a grind sink.
 * IG-31: 45s → 60s of current rate so short visits feel juicier while idle
 * curve stays the prestige pace-setter. Cooldown unchanged (5 min).
 * Tap Mastery adds +15s per rank on top.
 */
export const TAP_BONUS_SECONDS = 60
export const TAP_COOLDOWN_MS = 5 * 60 * 1000

/** Ignore offline banner / claim logs below this away time (false claims). */
export const MIN_OFFLINE_CLAIM_AWAY_MS = 15_000
