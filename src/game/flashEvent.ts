/**
 * Short timed flash events — fair deadlines, visible progress, no FOMO wipe.
 *
 * Rules:
 * - Window: 18 minutes live
 * - Cooldown: ≥ 2.5 h between starts (also gated on session ticks)
 * - Mult: ×1.15 soft/s while live (stacks with weekend surge)
 * - Goal: earn ~6 minutes of current rate (floor 400), reward 12 Samen
 * - On expire: soft currency / modules never wiped. Unclaimed goal stays
 *   claimable for 10 min after end if progress ≥ goal; else progress just ends.
 * - Dismissible — dismiss only hides UI, does not wipe earned soft.
 */

import { t } from '../i18n'

/** Live window length */
export const FLASH_DURATION_MS = 18 * 60 * 1000
/** Min gap between flash starts */
export const FLASH_COOLDOWN_MS = 2.5 * 60 * 60 * 1000
/** After end, claim window if goal was met */
export const FLASH_CLAIM_GRACE_MS = 10 * 60 * 1000
export const FLASH_MULT = 1.15
export const FLASH_GOAL_REWARD_OBSIDIAN = 12
/** Chance to spawn when eligible (checked ~every visibility / minute) */
export const FLASH_SPAWN_CHANCE = 0.55

export interface FlashEventStatus {
  active: boolean
  /** True when banner should show (active or grace claim) */
  visible: boolean
  id: string
  endsAt: number
  msLeft: number
  mult: number
  goal: number
  progress: number
  ratio: number
  goalMet: boolean
  claimable: boolean
  claimed: boolean
  name: string
  blurb: string
  endsLabel: string
}

export function flashGoalForRate(ratePerSec: number): number {
  return Math.max(400, Math.floor(ratePerSec * 360))
}

export function makeFlashEventId(now = Date.now()): string {
  return `flash-${now}`
}

export function formatFlashEndsLabel(msLeft: number): string {
  if (msLeft <= 0) return t.flash.endsSoon
  const sec = Math.ceil(msLeft / 1000)
  const m = Math.floor(sec / 60)
  const s = sec % 60
  if (m <= 0) return t.flash.endsSec(s)
  return t.flash.endsMin(m, s)
}

export function canSpawnFlashEvent(
  lastFlashAt: number,
  flashEndsAt: number,
  now = Date.now(),
): boolean {
  if (flashEndsAt > now) return false
  if (lastFlashAt > 0 && now - lastFlashAt < FLASH_COOLDOWN_MS) return false
  return true
}

export function rollFlashSpawn(
  lastFlashAt: number,
  flashEndsAt: number,
  now = Date.now(),
  rng = Math.random,
): boolean {
  if (!canSpawnFlashEvent(lastFlashAt, flashEndsAt, now)) return false
  // First eligible session always opens a flash so the loop is discoverable
  if (lastFlashAt <= 0) return true
  return rng() < FLASH_SPAWN_CHANCE
}

export interface FlashStateSlice {
  flashEventId: string
  flashEndsAt: number
  flashProgress: number
  flashGoal: number
  flashClaimed: boolean
  flashDismissed: boolean
  lastFlashAt: number
}

export function flashEventStatus(
  slice: FlashStateSlice,
  now = Date.now(),
): FlashEventStatus {
  const id = slice.flashEventId
  const endsAt = slice.flashEndsAt
  const active = Boolean(id) && endsAt > now
  const grace =
    Boolean(id) &&
    !active &&
    now <= endsAt + FLASH_CLAIM_GRACE_MS &&
    slice.flashProgress >= slice.flashGoal &&
    !slice.flashClaimed
  const goalMet = slice.flashGoal > 0 && slice.flashProgress >= slice.flashGoal
  const claimable = goalMet && !slice.flashClaimed && (active || grace)
  const visible =
    Boolean(id) &&
    !slice.flashDismissed &&
    (active || claimable)
  const msLeft = active ? Math.max(0, endsAt - now) : 0
  const goal = Math.max(1, slice.flashGoal)
  const progress = Math.max(0, slice.flashProgress)
  return {
    active,
    visible,
    id,
    endsAt,
    msLeft,
    mult: active ? FLASH_MULT : 1,
    goal,
    progress,
    ratio: Math.min(1, progress / goal),
    goalMet,
    claimable,
    claimed: slice.flashClaimed,
    name: t.flash.name,
    blurb: t.flash.blurb,
    endsLabel: active
      ? formatFlashEndsLabel(msLeft)
      : claimable
        ? t.flash.graceLabel
        : t.flash.endsSoon,
  }
}
