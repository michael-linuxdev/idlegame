import type { GeneratorId } from './generators'
import { dayKey, weekKey, type CosmeticId } from './monetization'
import { createInitialState, STORAGE_KEY, type GameState } from './state'
import { freePlaytestSpace } from './playtestLog'
import { getSaveBlock, setSaveBlock } from './saveGuard'
import { seasonCardDef, type SeasonCardId } from './seasonCards'
import { isChallengeId } from './challenges'
import {
  COSMETIC_IDS,
  isRecord,
  parseOwned,
  parseUpgrades,
  parseCosmetics,
  parseNum,
  parseExpansion,
  parseNonNegInt,
  parseLongLoop,
  parseAchievements,
  parseBranches,
  parseQuests,
} from './saveFields'

/**
 * Spielstand-Format. Neu begonnen am 2026-11-09 (Aufräum-Runde, neuer
 * Speicherschlüssel `gartenerbe-spielstand-v1`, Wörterbuch docs/cleanup/namen.md).
 *  - Jede inkompatible Format-Änderung bekommt einen Schritt in MIGRATIONS
 *    und erhöht SAVE_VERSION. Felder werden nie still umbenannt oder entfernt.
 *  - src/test/fixtures/save-v*.json hält echte Stände jeder Version fest;
 *    src/test/migration.test.ts muss sie verlustfrei laden.
 */
export const SAVE_VERSION = 1

type Raw = Record<string, unknown>

/** MIGRATIONS[v]: Stand der Version v → v + 1. */
const MIGRATIONS: Record<number, (raw: Raw) => Raw> = {}

/** Bring any stored save up to SAVE_VERSION. */
export function migrateSave(raw: Raw): Raw {
  let out = raw
  let v = typeof out.saveVersion === 'number' && out.saveVersion >= 1 ? Math.floor(out.saveVersion) : 1
  while (v < SAVE_VERSION) {
    const step = MIGRATIONS[v]
    if (step) out = step(out)
    v += 1
  }
  return { ...out, saveVersion: SAVE_VERSION }
}

/** Parse + sanitise any JSON object into a valid GameState. */
export function parseSave(raw: unknown): GameState | null {
  if (!isRecord(raw)) return null
  return parseGameState(migrateSave(raw))
}

function parseGameState(parsed: Record<string, unknown>): GameState {
  const ernte = typeof parsed.ernte === 'number' ? Math.max(0, parsed.ernte) : 0
  const ernteSeason =
    typeof parsed.ernteSeason === 'number' ? Math.max(0, parsed.ernteSeason) : ernte

  const erbstuecke =
    typeof parsed.erbstuecke === 'number' ? Math.max(0, Math.floor(parsed.erbstuecke)) : 0

  const saisonenden =
    typeof parsed.saisonenden === 'number'
      ? Math.max(0, Math.floor(parsed.saisonenden))
      : 0
  const lastSeen =
    typeof parsed.lastSeen === 'number' && parsed.lastSeen > 0
      ? parsed.lastSeen
      : Date.now()
  const lastTapAt =
    typeof parsed.lastTapAt === 'number' && parsed.lastTapAt >= 0
      ? parsed.lastTapAt
      : 0
  const vereinMult =
    typeof parsed.vereinMult === 'number' && Number.isFinite(parsed.vereinMult)
      ? Math.min(1.25, Math.max(1, parsed.vereinMult))
      : 1

  const samen =
    typeof parsed.samen === 'number' && Number.isFinite(parsed.samen)
      ? Math.max(0, Math.floor(parsed.samen))
      : 20

  const ownedCosmetics = parseCosmetics(parsed.ownedCosmetics)
  let equippedCosmetic: CosmeticId = 'wiese'
  if (
    typeof parsed.equippedCosmetic === 'string' &&
    COSMETIC_IDS.has(parsed.equippedCosmetic as CosmeticId) &&
    ownedCosmetics.includes(parsed.equippedCosmetic as CosmeticId)
  ) {
    equippedCosmetic = parsed.equippedCosmetic as CosmeticId
  }

  const skipDayKey =
    typeof parsed.skipDayKey === 'string' && parsed.skipDayKey.length >= 8
      ? parsed.skipDayKey
      : dayKey()
  const skipHoursUsedToday =
    typeof parsed.skipHoursUsedToday === 'number' &&
    Number.isFinite(parsed.skipHoursUsedToday)
      ? Math.max(0, parsed.skipHoursUsedToday)
      : 0
  const vereinBoostExpiresAt =
    typeof parsed.vereinBoostExpiresAt === 'number' &&
    Number.isFinite(parsed.vereinBoostExpiresAt)
      ? Math.max(0, parsed.vereinBoostExpiresAt)
      : 0

  const dailyClaimDay =
    typeof parsed.dailyClaimDay === 'string' ? parsed.dailyClaimDay : ''
  const dailyStreak =
    typeof parsed.dailyStreak === 'number' && Number.isFinite(parsed.dailyStreak)
      ? Math.max(0, Math.floor(parsed.dailyStreak))
      : 0
  const erntefestDismissedKey =
    typeof parsed.erntefestDismissedKey === 'string' ? parsed.erntefestDismissedKey : ''
  const erntefestErnte =
    typeof parsed.erntefestErnte === 'number' &&
    Number.isFinite(parsed.erntefestErnte)
      ? Math.max(0, parsed.erntefestErnte)
      : 0
  const erntefestProgressKey =
    typeof parsed.erntefestProgressKey === 'string' ? parsed.erntefestProgressKey : ''
  const erntefestGoalClaimedKey =
    typeof parsed.erntefestGoalClaimedKey === 'string'
      ? parsed.erntefestGoalClaimedKey
      : ''

  const owned = parseOwned(parsed.owned)
  if (!isRecord(parsed.owned) || Object.keys(parsed.owned).length === 0) {
    owned.gemuesebeet = 1
  }

  const playerXp =
    typeof parsed.playerXp === 'number' && Number.isFinite(parsed.playerXp)
      ? Math.max(0, Math.floor(parsed.playerXp))
      : 0
  const claimedLevelRewards = Array.isArray(parsed.claimedLevelRewards)
    ? parsed.claimedLevelRewards.filter(
        (n): n is number => typeof n === 'number' && Number.isFinite(n),
      )
    : []
  const totalUpgrades =
    typeof parsed.totalUpgrades === 'number' &&
    Number.isFinite(parsed.totalUpgrades)
      ? Math.max(0, Math.floor(parsed.totalUpgrades))
      : 0
  const ernteLifetime =
    typeof parsed.ernteLifetime === 'number' &&
    Number.isFinite(parsed.ernteLifetime)
      ? Math.max(0, parsed.ernteLifetime)
      : ernteSeason
  const claimedDailyOnce = parsed.claimedDailyOnce === true
  const claimedOfflineOnce = parsed.claimedOfflineOnce === true
  const offlinePending = parseNum(parsed.offlinePending)
  const claimedAchievements = parseAchievements(parsed.claimedAchievements)
  const branches = parseBranches(parsed.branches)
  const questBundle = parseQuests(parsed.questDayKey, parsed.quests)

  const ownedOfferIds = Array.isArray(parsed.ownedOfferIds)
    ? parsed.ownedOfferIds.filter((id): id is string => typeof id === 'string')
    : []
  const adsRemoved = parsed.adsRemoved === true
  const lastRewardedAdAt =
    typeof parsed.lastRewardedAdAt === 'number' &&
    Number.isFinite(parsed.lastRewardedAdAt)
      ? Math.max(0, parsed.lastRewardedAdAt)
      : 0
  const rewardedAdClaims =
    typeof parsed.rewardedAdClaims === 'number' &&
    Number.isFinite(parsed.rewardedAdClaims)
      ? Math.max(0, Math.floor(parsed.rewardedAdClaims))
      : 0
  const marketGiftDay = typeof parsed.marketGiftDay === 'string' ? parsed.marketGiftDay.slice(0, 16) : ''
  // Gießkanne-Limit (2026-11-09; ältere Stände → heute noch nichts gekauft)
  const waterRefillDay = typeof parsed.waterRefillDay === 'string' ? parsed.waterRefillDay.slice(0, 16) : ''
  const waterRefills = parseNonNegInt(parsed.waterRefills)
  // Sitzungszähler (2026-11-09). Ältere Stände: aus dem Fortschritt ableiten,
  // damit bestehende Spieler nichts wieder verlieren, was sie schon kannten.
  const sessions =
    typeof parsed.sessions === 'number' && Number.isFinite(parsed.sessions) && parsed.sessions >= 1
      ? Math.floor(parsed.sessions)
      : saisonenden > 0 || parseNonNegInt(parsed.tiefeWinter) > 0 || parseNonNegInt(parsed.generation) > 0
        ? 10
        : totalUpgrades > 0
          ? 2
          : 1
  const yieldBoostExpiresAt =
    typeof parsed.yieldBoostExpiresAt === 'number' &&
    Number.isFinite(parsed.yieldBoostExpiresAt)
      ? Math.max(0, parsed.yieldBoostExpiresAt)
      : 0
  const gartenwocheKey =
    typeof parsed.gartenwocheKey === 'string' && parsed.gartenwocheKey.length > 0
      ? parsed.gartenwocheKey
      : weekKey()
  const gartenwocheXp =
    typeof parsed.gartenwocheXp === 'number' && Number.isFinite(parsed.gartenwocheXp)
      ? Math.max(0, Math.floor(parsed.gartenwocheXp))
      : 0
  const gartenwocheClaimedFree = Array.isArray(parsed.gartenwocheClaimedFree)
    ? parsed.gartenwocheClaimedFree.filter(
        (n): n is number => typeof n === 'number' && Number.isFinite(n),
      )
    : []
  const gartenwochePremium = parsed.gartenwochePremium === true
  const gartenwocheClaimedPremium = Array.isArray(parsed.gartenwocheClaimedPremium)
    ? parsed.gartenwocheClaimedPremium.filter(
        (n): n is number => typeof n === 'number' && Number.isFinite(n),
      )
    : []
  const gartenwocheXpDay =
    typeof parsed.gartenwocheXpDay === 'string' ? parsed.gartenwocheXpDay : ''

  const saisonendeSpikeFlags =
    typeof parsed.saisonendeSpikeFlags === 'number' &&
    Number.isFinite(parsed.saisonendeSpikeFlags)
      ? Math.max(0, Math.floor(parsed.saisonendeSpikeFlags))
      : 0
  const flashEventId =
    typeof parsed.flashEventId === 'string' ? parsed.flashEventId : ''
  const flashEndsAt =
    typeof parsed.flashEndsAt === 'number' && Number.isFinite(parsed.flashEndsAt)
      ? Math.max(0, parsed.flashEndsAt)
      : 0
  const flashProgress =
    typeof parsed.flashProgress === 'number' &&
    Number.isFinite(parsed.flashProgress)
      ? Math.max(0, parsed.flashProgress)
      : 0
  const flashGoal =
    typeof parsed.flashGoal === 'number' && Number.isFinite(parsed.flashGoal)
      ? Math.max(0, parsed.flashGoal)
      : 0
  const flashClaimed = parsed.flashClaimed === true
  const flashDismissed = parsed.flashDismissed === true
  const lastFlashAt =
    typeof parsed.lastFlashAt === 'number' && Number.isFinite(parsed.lastFlashAt)
      ? Math.max(0, parsed.lastFlashAt)
      : 0
  const longLoop = parseLongLoop(parsed)
  const expansion = parseExpansion(parsed)

  return {
    ernte,
    ernteSeason,
    owned,
    erbstuecke,
    truhe: parseUpgrades(parsed.truhe),
    saisonenden,
    lastSeen,
    lastTapAt,
    vereinMult,
    samen,
    ownedCosmetics,
    equippedCosmetic,
    skipHoursUsedToday,
    skipDayKey,
    vereinBoostExpiresAt,
    dailyClaimDay,
    dailyStreak,
    erntefestDismissedKey,
    erntefestErnte,
    erntefestProgressKey,
    erntefestGoalClaimedKey,
    playerXp,
    claimedLevelRewards,
    totalUpgrades,
    ernteLifetime,
    claimedDailyOnce,
    claimedOfflineOnce,
    offlinePending,
    claimedAchievements,
    branches,
    questDayKey: questBundle.dayKey,
    quests: questBundle.quests,
    ownedOfferIds,
    adsRemoved,
    lastRewardedAdAt,
    rewardedAdClaims,
    marketGiftDay,
    waterRefillDay,
    waterRefills,
    sessions,
    // Saison-Karten (2026-11-09; ältere Stände: keine Karte, kein Angebot)
    seasonCard: seasonCardDef(parsed.seasonCard as string)?.id ?? null,
    seasonCardOffer: Array.isArray(parsed.seasonCardOffer)
      ? (parsed.seasonCardOffer as unknown[])
          .filter((o): o is { id: string; preview: number } => isRecord(o) && typeof o.id === 'string')
          .map((o) => ({ id: seasonCardDef(o.id)?.id, preview: typeof o.preview === 'number' && Number.isFinite(o.preview) ? o.preview : 1 }))
          .filter((o): o is { id: SeasonCardId; preview: number } => o.id != null)
          .slice(0, 3)
      : [],
    lastSeasonCard: typeof parsed.lastSeasonCard === 'string' ? parsed.lastSeasonCard.slice(0, 32) : '',
    // Omas Herausforderungen (2026-11-09; ältere Stände: keine)
    challenge: isChallengeId(parsed.challenge) ? parsed.challenge : null,
    challengeNext: isChallengeId(parsed.challengeNext) ? parsed.challengeNext : null,
    challengesDone: Array.isArray(parsed.challengesDone)
      ? [...new Set((parsed.challengesDone as unknown[]).filter(isChallengeId))]
      : [],
    yieldBoostExpiresAt,
    gartenwocheKey,
    gartenwocheXp,
    gartenwocheClaimedFree,
    gartenwochePremium,
    gartenwocheClaimedPremium,
    gartenwocheXpDay,
    saisonendeSpikeFlags,
    lastSurprise: null,
    lastSurpriseAt: parseNum(parsed.lastSurpriseAt),
    lastVariety: null,
    flashEventId,
    flashEndsAt,
    flashProgress,
    flashGoal,
    flashClaimed,
    flashDismissed,
    lastFlashAt,
    ...longLoop,
    ...expansion,
  }
}

/** Felder, die diese App-Version nicht kennt (aus einer neueren Version) — beim Speichern unverändert mitschreiben. */
let passthrough: Record<string, unknown> = {}

/** Keys of a stored save this version does not know (kept on save). */
export function unknownFields(raw: Record<string, unknown>): Record<string, unknown> {
  const known = new Set<string>([...Object.keys(createInitialState(0)), 'saveVersion'])
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(raw)) if (!known.has(k)) out[k] = v
  return out
}

/** Stored save from a newer app version than this one? */
export function isNewerSave(raw: Record<string, unknown>): boolean {
  return typeof raw.saveVersion === 'number' && raw.saveVersion > SAVE_VERSION
}

export function loadState(): GameState {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      keepCopy(`${STORAGE_KEY}-broken`, raw)
      return createInitialState()
    }
    if (!isRecord(parsed)) {
      keepCopy(`${STORAGE_KEY}-broken`, raw)
      return createInitialState()
    }
    if (isNewerSave(parsed)) {
      // Neuere Version hat gespeichert: lesen ja, überschreiben nie
      setSaveBlock('newer')
      return parseGameState(parsed)
    }
    // Keep the last pre-migration save around, just in case
    if (parsed.saveVersion !== SAVE_VERSION) keepCopy(`${STORAGE_KEY}-before-v${SAVE_VERSION}`, raw)
    const migrated = migrateSave(parsed)
    passthrough = unknownFields(migrated)
    return parseGameState(migrated)
  } catch {
    if (raw) keepCopy(`${STORAGE_KEY}-broken`, raw)
    return createInitialState()
  }
}

function keepCopy(key: string, raw: string): void {
  try {
    if (!localStorage.getItem(key)) localStorage.setItem(key, raw)
  } catch {
    /* quota — nothing we can do */
  }
}

let savesLocked = false

/** Stop all further saves (used right before an import reloads the page). */
export function lockSaves(): void {
  savesLocked = true
}

/** JSON as stored: unknown fields of newer versions survive. */
export function serializeSave(state: GameState, extra: Record<string, unknown> = passthrough): string {
  return JSON.stringify({ ...extra, ...state, saveVersion: SAVE_VERSION })
}

/** true = der Stand liegt jetzt in localStorage. */
export function saveState(state: GameState): boolean {
  if (savesLocked || getSaveBlock() !== null) return false
  try {
    localStorage.setItem(STORAGE_KEY, serializeSave(state))
    return true
  } catch {
    // Platz knapp: zuerst das Playtest-Log freigeben, Spielstand geht vor
    try {
      freePlaytestSpace()
      localStorage.setItem(STORAGE_KEY, serializeSave(state))
      return true
    } catch {
      /* private mode */
      return false
    }
  }
}

/**
 * Ist der gespeicherte Spielstand leer oder kaputt? Dann bietet der Start
 * eine automatische Sicherung an, bevor ein neuer Garten entsteht.
 * Ein Stand aus einer neueren Version gilt nie als kaputt.
 */
export function storedSaveState(): 'ok' | 'empty' | 'broken' | 'newer' {
  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    return 'empty'
  }
  if (!raw) return 'empty'
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return 'broken'
    if (isNewerSave(parsed)) return 'newer'
    return parseSave(parsed) ? 'ok' : 'broken'
  } catch {
    return 'broken'
  }
}

/** Kaputten Stand aufheben, bevor eine Sicherung ihn ersetzt (wie loadState). */
export function keepBrokenCopy(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) keepCopy(`${STORAGE_KEY}-broken`, raw)
  } catch {
    /* nichts zu retten */
  }
}

export type { GeneratorId }
