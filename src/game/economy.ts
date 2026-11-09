/**
 * Economy knobs — core formulas (R(n), C(n), offline) unchanged.
 * Player-facing names come from src/theme/strings.ts.
 * Internal save fields keep legacy names (ernte / erbstuecke / samen).
 *
 * Balance pass IG-31 (overnight): prestige was ~5 min for engaged play vs
 * design 45–90 min. Raised P_min base + slowed generator ladder (see generators.ts).
 *
 * Soft-Prestige depth (IG-53 / playtest 2026-11-07 + b + 2026-11-08 + d):
 * Münzen soft-gate every prestige; interleaved rank unlocks during rebuild;
 * steeper cost curve; √ payout soft-capped so runaway ernte cannot dump the
 * unlocked band in ~40s. Tip band scales with lifetime saisonenden so P2+ never
 * lands on an empty Münzen shop after tips are already owned.
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
export const PRESTIGE_BASE_ASH = 2_000_000
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
 * Module levels are the primary Münzen-unlock clock (resets each Soft-Prestige).
 * Kept modest so ~8–12 levels/min rebuild opens ranks over minutes, not seconds.
 */
export const EMBER_UNLOCK_PER_MODULE_LEVEL = 800

/**
 * Soft ernte contribution toward unlocks — √ so late-run snowball cannot open
 * the entire tree the moment Phyto explodes. Capped so ernte alone never
 * replaces rebuild.
 */
export const EMBER_UNLOCK_ASH_SQRT_DIV = 100
export const EMBER_UNLOCK_ASH_CAP = 30_000

/** @deprecated Use EMBER_UNLOCK_PER_MODULE_LEVEL — kept for older docs/imports. */
export const EMBER_UNLOCK_ASH_PER_MODULE_LEVEL = EMBER_UNLOCK_PER_MODULE_LEVEL

/**
 * Soft-cap on √ Münzen payout (L2 agency without 39k runaway wallets).
 * Raw √ stays linear up to SOFT; overflow diminishes toward CEIL.
 */
export const EMBER_PAYOUT_SOFT = 500
export const EMBER_PAYOUT_CEIL = 1_600

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
export function prestigeMinEmbersForRun(saisonenden: number): number {
  return payoutAtGate(saisonenden)
}

/** Saisonende gate: Ernte this season ≥ prestigeBase · prestigeGrowth^p */
export function prestigeMinAsh(saisonenden: number, probe = false): number {
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
export function emberPayout(ernteSeason: number, saisonenden = 0, probe = false): number {
  if (ernteSeason <= 0) return 0
  const r = ernteSeason / Math.max(1, prestigeMinAsh(saisonenden, probe))
  return Math.floor(payoutAtGate(saisonenden, probe) * payoutCurve(r))
}

/** Ernte needed this season to be paid `erbstuecke` (inverse of the √ band). */
export function ashForEmberPayout(erbstuecke: number, saisonenden = 0, probe = false): number {
  if (erbstuecke <= 0) return 0
  const ratio = erbstuecke / Math.max(1, payoutAtGate(saisonenden, probe))
  return Math.ceil(prestigeMinAsh(saisonenden, probe) * ratio * ratio)
}

export interface EmberUpgrades {
  /** Rack Yield — +5% global soft/sec per rank */
  gartenschere: number
  /** Long Uptime — +1h soft / +2h hard offline per rank */
  alteGiesskanne: number
  /** BOM Discount — 0.98^rank cost mult */
  saatgutkiste: number
  /** Hot Spare — start each run with Cooling Array unlocked (max 1) */
  kompostVomVorjahr: number
  /** Tap Mastery — +15s tap bonus duration per rank */
  messingBrause: number
  /** Seed Purse — start each prestige run with bonus soft currency */
  notgroschen: number
  /** Canopy — +2% global soft/sec per rank (mid-tier Münzen sink) */
  strohhut: number
  /** Night soil — +30 min soft offline per rank (uptime mid-tier) */
  laterne: number
  /** Sapling surge — start run with G1 (gemuesebeet) at this level */
  guteErde: number
  /** Green lattice — +1.5% global soft/sec per rank (late Münzen sink) */
  rosenbogen: number
}

export const EMPTY_EMBER_UPGRADES: EmberUpgrades = {
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

export type EmberUpgradeId = keyof EmberUpgrades

export type PrestigeBranchId = 'yield' | 'uptime' | 'start'

export interface EmberShopItem {
  id: EmberUpgradeId
  branch: PrestigeBranchId
  name: string
  blurb: string
  maxRank: number
  /** Cost in Credits at current rank (before purchase) */
  cost: (rank: number) => number
  effectLabel: (rank: number) => string
  /**
   * This-run soft earned required before purchasing `rank` (0-based).
   * Progressive unlock — keeps post-prestige Münzen spending stretched
   * across rebuild (~15–45 min), not a 50s dump.
   */
  rankUnlockAsh?: (rank: number) => number
  /** Modules online (owned ≥ 1) required before any rank of this item. */
  unlockModulesOnline?: number
}

/** Geometric Münzen cost — one unlocked band must not clear a mid payout in <1 min. */
function emberGeoCost(base: number, growth: number, rank: number): number {
  return Math.ceil(base * Math.pow(growth, Math.max(0, rank)))
}

/**
 * Staggered unlock offsets so branches reopen one-by-one during rebuild,
 * not as a single mid-band dump.
 */
const EMBER_UNLOCK_OFFSET: Record<EmberUpgradeId, number> = {
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
const EMBER_IMMEDIATE_IDS: ReadonlySet<EmberUpgradeId> = new Set([
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
const EMBER_WAVE2_TIP_IDS: ReadonlySet<EmberUpgradeId> = new Set([
  'messingBrause',
  'strohhut',
])

/** Lifetime prestige credit toward rebuild-gated ranks (not a full dump). */
export const EMBER_UNLOCK_PER_PRESTIGE = 8_000

/** Tip ranks opened immediately after `saisonenden` Soft-Resets (min 1). */
export function tipBandDepth(saisonenden: number): number {
  return Math.max(1, Math.floor(Math.max(0, saisonenden)))
}

/** Whether this rank is in the free post-prestige tip band. */
export function isEmberTipRank(
  id: EmberUpgradeId,
  rank: number,
  saisonenden: number,
): boolean {
  if (rank < 0) return false
  if (id === 'kompostVomVorjahr') return rank === 0
  const depth = tipBandDepth(saisonenden)
  if (EMBER_IMMEDIATE_IDS.has(id) && rank < depth) return true
  if (EMBER_WAVE2_TIP_IDS.has(id) && saisonenden >= 2 && rank < depth - 1) {
    return true
  }
  return false
}

/**
 * Progress needed before purchasing `rank` (0-based) of this item.
 * `saisonenden` = Soft-Resets completed (post-prestige state.saisonenden).
 */
export function emberRankUnlockNeed(
  id: EmberUpgradeId,
  rank: number,
  saisonenden = 0,
): number {
  if (id === 'kompostVomVorjahr') return 0
  if (isEmberTipRank(id, rank, saisonenden)) return 0

  const credit = Math.max(0, saisonenden) * EMBER_UNLOCK_PER_PRESTIGE

  if (id === 'rosenbogen') {
    // Reachable mid post-P2 session (~23 module levels + soft ernte, or ~60 levels alone).
    return Math.max(0, 48_000 + rank * 32_000 - credit)
  }

  const offset = EMBER_UNLOCK_OFFSET[id]
  const raw =
    rank === 0
      ? 12_000 + Math.floor(offset / 2)
      : offset + 28_000 + (rank - 1) * (32_000 + rank * 3_000)
  return Math.max(0, raw - credit)
}

export const EMBER_SHOP: EmberShopItem[] = [
  {
    id: 'gartenschere',
    branch: 'yield',
    name: t.emberShop.gartenschere.name,
    blurb: t.emberShop.gartenschere.blurb,
    maxRank: 40,
    cost: (rank) => emberGeoCost(25, 1.3, rank),
    effectLabel: (rank) => t.emberShop.gartenschere.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('gartenschere', rank),
  },
  {
    id: 'saatgutkiste',
    branch: 'yield',
    name: t.emberShop.saatgutkiste.name,
    blurb: t.emberShop.saatgutkiste.blurb,
    maxRank: 20,
    cost: (rank) => emberGeoCost(18, 1.28, rank),
    effectLabel: (rank) => t.emberShop.saatgutkiste.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('saatgutkiste', rank),
  },
  {
    id: 'strohhut',
    branch: 'yield',
    name: t.emberShop.strohhut.name,
    blurb: t.emberShop.strohhut.blurb,
    maxRank: 25,
    cost: (rank) => emberGeoCost(36, 1.32, rank),
    effectLabel: (rank) => t.emberShop.strohhut.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('strohhut', rank),
  },
  {
    id: 'rosenbogen',
    branch: 'yield',
    name: t.emberShop.rosenbogen.name,
    blurb: t.emberShop.rosenbogen.blurb,
    maxRank: 20,
    cost: (rank) => emberGeoCost(60, 1.34, rank),
    effectLabel: (rank) => t.emberShop.rosenbogen.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('rosenbogen', rank),
  },
  {
    id: 'alteGiesskanne',
    branch: 'uptime',
    name: t.emberShop.alteGiesskanne.name,
    blurb: t.emberShop.alteGiesskanne.blurb,
    maxRank: 8,
    cost: (rank) => emberGeoCost(30, 1.4, rank),
    effectLabel: (rank) => t.emberShop.alteGiesskanne.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('alteGiesskanne', rank),
  },
  {
    id: 'messingBrause',
    branch: 'uptime',
    name: t.emberShop.messingBrause.name,
    blurb: t.emberShop.messingBrause.blurb,
    maxRank: 12,
    cost: (rank) => emberGeoCost(20, 1.32, rank),
    effectLabel: (rank) => t.emberShop.messingBrause.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('messingBrause', rank),
  },
  {
    id: 'laterne',
    branch: 'uptime',
    name: t.emberShop.laterne.name,
    blurb: t.emberShop.laterne.blurb,
    maxRank: 15,
    cost: (rank) => emberGeoCost(34, 1.34, rank),
    effectLabel: (rank) => t.emberShop.laterne.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('laterne', rank),
  },
  {
    id: 'kompostVomVorjahr',
    branch: 'start',
    name: t.emberShop.kompostVomVorjahr.name,
    blurb: t.emberShop.kompostVomVorjahr.blurb,
    maxRank: 1,
    cost: () => 60,
    effectLabel: (rank) => t.emberShop.kompostVomVorjahr.effect(rank),
  },
  {
    id: 'notgroschen',
    branch: 'start',
    name: t.emberShop.notgroschen.name,
    blurb: t.emberShop.notgroschen.blurb,
    maxRank: 12,
    cost: (rank) => emberGeoCost(20, 1.36, rank),
    effectLabel: (rank) => t.emberShop.notgroschen.effect(rank),
    rankUnlockAsh: (rank) => emberRankUnlockNeed('notgroschen', rank),
  },
  {
    id: 'guteErde',
    branch: 'start',
    name: t.emberShop.guteErde.name,
    blurb: t.emberShop.guteErde.blurb,
    maxRank: 10,
    cost: (rank) => emberGeoCost(45, 1.38, rank),
    effectLabel: (rank) => t.emberShop.guteErde.effect(rank),
    unlockModulesOnline: 1,
    rankUnlockAsh: (rank) => emberRankUnlockNeed('guteErde', rank),
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
    id: 'uptime',
    title: t.prestige.branchUptimeTitle,
    blurb: t.prestige.branchUptimeBlurb,
  },
  {
    id: 'start',
    title: t.prestige.branchStartTitle,
    blurb: t.prestige.branchStartBlurb,
  },
]

export function prestigeMultiplier(upgrades: EmberUpgrades): number {
  return (
    1 +
    upgrades.gartenschere * 0.05 +
    upgrades.strohhut * 0.02 +
    upgrades.rosenbogen * 0.015
  )
}

export function foundryDiscountMult(upgrades: EmberUpgrades): number {
  return Math.pow(0.98, upgrades.saatgutkiste)
}

export function offlineCapsHours(upgrades: EmberUpgrades): {
  soft: number
  hard: number
} {
  return {
    soft: OFFLINE_SOFT_HOURS + upgrades.alteGiesskanne * 1 + upgrades.laterne * 0.5,
    hard: OFFLINE_HARD_HOURS + upgrades.alteGiesskanne * 2 + upgrades.laterne * 1,
  }
}

/** Tap bonus seconds including Tap Mastery ranks. */
export function tapBonusSeconds(upgrades: EmberUpgrades): number {
  return TAP_BONUS_SECONDS + upgrades.messingBrause * 15
}

/**
 * Soft wallet granted at the start of a prestige run (Seed-Purse meta).
 * Callers must still floor against the next G1 Ausbauen cost — see
 * `prestigeStartAshFloor` / `createPostPrestigeState`.
 */
export function prestigeStartAsh(upgrades: EmberUpgrades): number {
  // Slightly juicier start crumbs so post-prestige Phyto doesn't feel flat.
  return upgrades.notgroschen * 80
}

/**
 * Minimum spendable Phyto after Soft-Prestige so the primary Ausbauen CTA is
 * never disabled at run start (mirrors Day-1 ernte:28 vs G1 cost ~23).
 */
export function prestigeStartAshFloor(nextG1Cost: number): number {
  const cost = Math.max(1, Math.floor(nextG1Cost))
  // +5 matches createInitialState float; also covers tiny foundry rounding.
  return cost + 5
}

/** Starting G1 module level after Soft-Prestige (guteErde). */
export function prestigeStartModuleLevel(upgrades: EmberUpgrades): number {
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
 * Raw ernte must not open the whole tree mid-run; leftover Münzen should feel
 * like “waiting on next unlock”, not “shop empty”.
 */
export function emberUnlockProgress(
  ashEarnedThisRun: number,
  owned: Partial<Record<GeneratorId, number>>,
): number {
  const modules =
    moduleLevelsTotal(owned) * EMBER_UNLOCK_PER_MODULE_LEVEL
  const ashPart = Math.min(
    EMBER_UNLOCK_ASH_CAP,
    Math.floor(
      Math.sqrt(Math.max(0, ashEarnedThisRun) / EMBER_UNLOCK_ASH_SQRT_DIV),
    ),
  )
  return modules + ashPart
}

/** Whether the next rank of a Münzen-shop item is unlocked this run. */
export function emberRankUnlocked(
  item: EmberShopItem,
  rank: number,
  ashEarnedThisRun: number,
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
  const needAsh = emberRankUnlockNeed(item.id, rank, saisonenden)
  return emberUnlockProgress(ashEarnedThisRun, owned) >= needAsh
}

/** How many Münzen-shop ranks are affordable + unlocked right now. */
export function countAffordableEmberBuys(
  upgrades: EmberUpgrades,
  erbstuecke: number,
  ashEarnedThisRun: number,
  owned: Partial<Record<GeneratorId, number>>,
  saisonenden = 0,
): number {
  let n = 0
  for (const item of EMBER_SHOP) {
    const rank = upgrades[item.id]
    if (rank >= item.maxRank) continue
    if (!emberRankUnlocked(item, rank, ashEarnedThisRun, owned, saisonenden)) {
      continue
    }
    if (erbstuecke >= item.cost(rank)) n += 1
  }
  return n
}

/** Starting owned modules right after Soft-Prestige (guteErde only). */
export function postPrestigeStartOwned(
  upgrades: EmberUpgrades,
): Partial<Record<GeneratorId, number>> {
  const owned: Partial<Record<GeneratorId, number>> = {}
  const startLevel = prestigeStartModuleLevel(upgrades)
  if (startLevel > 0) owned.gemuesebeet = startLevel
  return owned
}

/**
 * Affordable Münzen buys immediately after Soft-Prestige with current wallet
 * + pending payout. Used so “lohnt sich” never fires into an empty tip band.
 */
export function countAffordableEmberBuysAfterPrestige(args: {
  upgrades: EmberUpgrades
  erbstuecke: number
  ernteSeason: number
  saisonenden: number
  probe?: boolean
}): number {
  const postPrestiges = args.saisonenden + 1
  const wallet = args.erbstuecke + emberPayout(args.ernteSeason, args.saisonenden, args.probe)
  return countAffordableEmberBuys(
    args.upgrades,
    wallet,
    0,
    postPrestigeStartOwned(args.upgrades),
    postPrestiges,
  )
}

/** Approx. module levels still needed for the nearest locked Münzen rank. */
export function modulesToNextEmberUnlock(
  upgrades: EmberUpgrades,
  ashEarnedThisRun: number,
  owned: Partial<Record<GeneratorId, number>>,
  saisonenden = 0,
): number | null {
  const next = nextLockedEmberUnlock(
    upgrades,
    ashEarnedThisRun,
    owned,
    saisonenden,
  )
  if (!next) return null
  const deficit = Math.max(0, next.need - next.have)
  if (deficit <= 0) return 0
  return Math.ceil(deficit / EMBER_UNLOCK_PER_MODULE_LEVEL)
}

export interface NextEmberUnlock {
  item: EmberShopItem
  rank: number
  need: number
  have: number
  /** 0…1 progress toward this unlock. */
  ratio: number
}

/**
 * Nearest locked Münzen rank (lowest need). Used for shop “waiting” banner
 * and per-row progress when the wallet is full but the band is gated.
 */
export function nextLockedEmberUnlock(
  upgrades: EmberUpgrades,
  ashEarnedThisRun: number,
  owned: Partial<Record<GeneratorId, number>>,
  saisonenden = 0,
): NextEmberUnlock | null {
  const have = emberUnlockProgress(ashEarnedThisRun, owned)
  const online = modulesOnlineCount(owned)
  let best: NextEmberUnlock | null = null
  for (const item of EMBER_SHOP) {
    const rank = upgrades[item.id]
    if (rank >= item.maxRank) continue
    if (
      item.unlockModulesOnline != null &&
      online < item.unlockModulesOnline
    ) {
      const need = emberRankUnlockNeed(item.id, rank, saisonenden)
      const candidate: NextEmberUnlock = {
        item,
        rank,
        need: Math.max(need, 1),
        have,
        ratio: 0,
      }
      if (!best || candidate.need < best.need) best = candidate
      continue
    }
    const need = emberRankUnlockNeed(item.id, rank, saisonenden)
    if (have >= need) continue
    const candidate: NextEmberUnlock = {
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

/** Immediate tip-band Münzen sink at a given prestige count — balance probe. */
export function immediateEmberSinkCost(saisonenden = 1): number {
  let total = 0
  for (const item of EMBER_SHOP) {
    for (let rank = 0; rank < item.maxRank; rank++) {
      if (emberRankUnlockNeed(item.id, rank, saisonenden) > 0) break
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

/** Soft-gate diagnostics for UI (Münzen floor every run + rebuild on Run 2+). */
export function prestigeBlockReason(args: {
  saisonenden: number
  ernteSeason: number
  owned: Partial<Record<GeneratorId, number>>
  probe?: boolean
}): PrestigeBlockReason {
  const min = prestigeMinAsh(args.saisonenden, args.probe)
  if (args.ernteSeason < min) return 'ernte'
  const payout = emberPayout(args.ernteSeason, args.saisonenden, args.probe)
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
 * Offline catchup Compute for elapsed seconds at snapshot rate R (Compute/sec).
 * Soft full rate, then 50% until hard cap; nothing beyond hard.
 */
export function offlineCatchupAsh(
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
