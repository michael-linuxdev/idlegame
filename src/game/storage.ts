import { EMPTY_EMBER_UPGRADES, type EmberUpgrades } from './economy'
import { GENERATOR_IDS, type GeneratorId } from './generators'
import { parseDecorOwned, parseDecorSlots } from './decor'
import { parseResidentVisit, parseResidentsSeen } from './residents'
import { parseCrossing, parseHybrids } from './crossing'
import { parseProjects } from './projects'
import { parseAlbum } from './album'
import { parseWeatherBuff } from './weatherEvents'
import { COSMETICS, dayKey, weekKey, type CosmeticId } from './monetization'
import { ACHIEVEMENT_IDS, type AchievementId } from './achievements'
import { emptyBranches } from './branches'
import { emptyQuestProgress, type QuestProgress } from './quests'
import {
  EMPTY_DEEP_META,
  emptyLongLoopSlice,
  type DeepMetaUpgrades,
} from './longLoop'
import {
  createInitialState,
  emptyExpansion,
  HELPER_RANKS,
  STORAGE_KEY,
  type ExpansionSlice,
  type GameState,
} from './state'
import { CHAPTERS, CHAPTER_CARE_MAX, emptyChapter, type ChaptersState, type ChapterState, type ChapterDef } from './chapters'
import { emptyRecipe, ILSE_RANKS, type ContestResult, type Recipe, type SkyEvent } from './extrasCore'
import { GENERATOR_IDS as GEN_IDS } from './generators'
import { EMPTY_LEGACY, type LegacyUpgrades } from './generations'
import { VARIETIES, type WheelBuff } from './gardenLife'
import { freePlaytestSpace } from './playtestLog'
import { getSaveBlock, setSaveBlock } from './saveGuard'
import { seasonCardDef, type SeasonCardId } from './seasonCards'
import { isChallengeId } from './challenges'

const COSMETIC_IDS = new Set(COSMETICS.map((c) => c.id))

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function parseOwned(raw: unknown): GameState['owned'] {
  const base = createInitialState().owned
  if (!isRecord(raw)) return base
  for (const id of GENERATOR_IDS) {
    const n = raw[id]
    if (typeof n === 'number' && Number.isFinite(n) && n >= 0) {
      base[id] = Math.floor(n)
    }
  }
  return base
}

function parseUpgrades(raw: unknown): EmberUpgrades {
  const base = { ...EMPTY_EMBER_UPGRADES }
  if (!isRecord(raw)) return base
  for (const key of Object.keys(base) as (keyof EmberUpgrades)[]) {
    const n = raw[key]
    if (typeof n === 'number' && Number.isFinite(n) && n >= 0) {
      base[key] = Math.floor(n)
    }
  }
  return base
}

function parseCosmetics(raw: unknown): CosmeticId[] {
  if (!Array.isArray(raw)) return ['wiese']
  const out: CosmeticId[] = []
  for (const item of raw) {
    if (typeof item === 'string' && COSMETIC_IDS.has(item as CosmeticId)) {
      out.push(item as CosmeticId)
    }
  }
  if (!out.includes('wiese')) out.unshift('wiese')
  return out
}

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

function parseNum(raw: unknown, fallback = 0): number {
  return typeof raw === 'number' && Number.isFinite(raw) ? Math.max(0, raw) : fallback
}

function parseChapter(def: ChapterDef, raw: unknown): ChapterState {
  const base = emptyChapter(def)
  if (!isRecord(raw)) return base
  const owned = { ...base.owned }
  if (isRecord(raw.owned)) {
    for (const a of def.areas) {
      const n = raw.owned[a.id]
      if (typeof n === 'number' && Number.isFinite(n) && n >= 0) owned[a.id] = Math.floor(n)
    }
  }
  return {
    cur: parseNum(raw.cur, base.cur),
    curLifetime: parseNum(raw.curLifetime),
    owned,
    openedAt: parseNum(raw.openedAt),
    introSeen: raw.introSeen === true,
    care: parseCare(def, raw.care),
  }
}

/** Kapitel-Pflege ranks (added 2026-11-08; older saves → all 0). */
function parseCare(def: ChapterDef, raw: unknown): ChapterState['care'] {
  const out: ChapterState['care'] = {}
  if (!isRecord(raw)) return out
  for (const a of def.areas) {
    const r = raw[a.id]
    if (!isRecord(r)) continue
    const grow = Math.min(CHAPTER_CARE_MAX, parseNonNegInt(r.grow))
    const thrift = Math.min(CHAPTER_CARE_MAX, parseNonNegInt(r.thrift))
    if (grow > 0 || thrift > 0) out[a.id] = { grow, thrift }
  }
  return out
}

function parseChapters(raw: unknown): ChaptersState {
  const out = {} as ChaptersState
  for (const def of CHAPTERS) out[def.id] = parseChapter(def, isRecord(raw) ? raw[def.id] : undefined)
  return out
}

function parseNumRecord(raw: unknown): Record<string, number> {
  const out: Record<string, number> = {}
  if (!isRecord(raw)) return out
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === 'number' && Number.isFinite(v) && v >= 0) out[k] = Math.floor(v)
  }
  return out
}

function parseRecipe(raw: unknown): Recipe {
  if (!isRecord(raw) || typeof raw.day !== 'string' || !Array.isArray(raw.areas)) return emptyRecipe()
  const areas = raw.areas.filter((a): a is (typeof GEN_IDS)[number] => GEN_IDS.includes(a as (typeof GEN_IDS)[number]))
  const have = Array.isArray(raw.have) ? raw.have.map((n) => parseNonNegInt(n)) : areas.map(() => 0)
  return { day: raw.day, areas, have, claimed: raw.claimed === true, dish: parseNonNegInt(raw.dish) }
}

function parseSky(raw: unknown): SkyEvent | null {
  if (!isRecord(raw) || (raw.kind !== 'rainbow' && raw.kind !== 'star')) return null
  return { kind: raw.kind, until: parseNum(raw.until) }
}

function parseContestResult(raw: unknown): ContestResult | null {
  if (!isRecord(raw) || typeof raw.week !== 'string') return null
  return { week: raw.week, rank: Math.max(1, parseNonNegInt(raw.rank, 10)), kg: parseNum(raw.kg), claimed: raw.claimed === true }
}

function parseExpansion(parsed: Record<string, unknown>): ExpansionSlice {
  const base = emptyExpansion()
  const legacy = { ...EMPTY_LEGACY }
  if (isRecord(parsed.legacy)) {
    for (const key of Object.keys(legacy) as (keyof LegacyUpgrades)[]) {
      legacy[key] = parseNonNegInt(parsed.legacy[key])
    }
  }
  const festBought: Record<string, number> = {}
  if (isRecord(parsed.festBought)) {
    for (const [k, v] of Object.entries(parsed.festBought)) {
      if (typeof v === 'number' && Number.isFinite(v) && v > 0) festBought[k] = Math.floor(v)
    }
  }
  return {
    helperLevel: Math.min(HELPER_RANKS.length, parseNonNegInt(parsed.helperLevel)),
    helperOn: parsed.helperOn !== false,
    decorOwned: parseDecorOwned(parsed.decorOwned),
    residentsSeen: parseResidentsSeen(parsed.residentsSeen),
    residentNow: parseResidentVisit(parsed.residentNow),
    residentNextAt: parseNum(parsed.residentNextAt),
    crossing: parseCrossing(parsed.crossing),
    hybrids: parseHybrids(parsed.hybrids),
    projects: parseProjects(parsed.projects),
    album: parseAlbum(parsed.album),
    weatherDecided: typeof parsed.weatherDecided === 'string' ? parsed.weatherDecided.slice(0, 16) : '',
    weatherBuff: parseWeatherBuff(parsed.weatherBuff),
    decorSlots: parseDecorSlots(parsed.decorSlots, parseDecorOwned(parsed.decorOwned)),
    helperBlocked: Array.isArray(parsed.helperBlocked)
      ? GENERATOR_IDS.filter((id) => (parsed.helperBlocked as unknown[]).includes(id))
      : [],
    helperCarryMs: 0,
    helperReport: 0,
    turboEndsAt: parseNum(parsed.turboEndsAt),
    chapters: parseChapters(parsed.chapters),
    ilseLevel: Math.min(ILSE_RANKS.length, parseNonNegInt(parsed.ilseLevel)),
    ilseOn: parsed.ilseOn !== false,
    ilseCarryMs: 0,
    weinleseAt: parseNum(parsed.weinleseAt),
    milestoneRecord: parseNumRecord(parsed.milestoneRecord),
    lastChest: null,
    recipe: parseRecipe(parsed.recipe),
    skyEvent: parseSky(parsed.skyEvent),
    skyNextAt: parseNum(parsed.skyNextAt, base.skyNextAt),
    rainbowEndsAt: parseNum(parsed.rainbowEndsAt),
    shieldWeek: typeof parsed.shieldWeek === 'string' ? parsed.shieldWeek : '',
    contestWeek: typeof parsed.contestWeek === 'string' ? parsed.contestWeek : base.contestWeek,
    contestKg: parseNum(parsed.contestKg),
    contestResult: parseContestResult(parsed.contestResult),
    generation: parseNonNegInt(parsed.generation),
    vermaechtnis: parseNonNegInt(parsed.vermaechtnis),
    legacy,
    festKey: typeof parsed.festKey === 'string' ? parsed.festKey : base.festKey,
    festTokens: parseNum(parsed.festTokens),
    festBought,
  }
}

function parseNonNegInt(raw: unknown, fallback = 0): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.max(0, Math.floor(raw))
  }
  return fallback
}

function parseDeepUpgrades(raw: unknown): DeepMetaUpgrades {
  const base = { ...EMPTY_DEEP_META }
  if (!isRecord(raw)) return base
  for (const key of Object.keys(base) as (keyof DeepMetaUpgrades)[]) {
    const n = raw[key]
    if (typeof n === 'number' && Number.isFinite(n) && n >= 0) {
      base[key] = Math.floor(n)
    }
  }
  return base
}

function parseLongLoop(parsed: Record<string, unknown>) {
  const defaults = emptyLongLoopSlice()
  return {
    sproesslinge: parseNonNegInt(parsed.sproesslinge, defaults.sproesslinge),
    sproesslingLaden: parseDeepUpgrades(parsed.sproesslingLaden),
    tiefeWinter: parseNonNegInt(parsed.tiefeWinter, defaults.tiefeWinter),
    collection: Array.isArray(parsed.collection)
      ? parsed.collection.filter(
          (id): id is string => typeof id === 'string' && VARIETY_IDS.has(id),
        )
      : [],
    wheelBuff: parseWheelBuff(parsed.wheelBuff),
  }
}

const VARIETY_IDS = new Set(VARIETIES.map((v) => v.id))

function parseWheelBuff(raw: unknown): WheelBuff | null {
  if (!isRecord(raw)) return null
  const kind = raw.kind
  if (kind !== 'yield' && kind !== 'water' && kind !== 'seeds' && kind !== 'variety') return null
  return { kind, prestige: parseNonNegInt(raw.prestige, 0) }
}

function parseAchievements(raw: unknown): AchievementId[] {
  if (!Array.isArray(raw)) return []
  const allowed = new Set<string>(ACHIEVEMENT_IDS)
  const out: AchievementId[] = []
  for (const item of raw) {
    if (typeof item === 'string' && allowed.has(item)) {
      out.push(item as AchievementId)
    }
  }
  return out
}

function parseBranches(raw: unknown): GameState['branches'] {
  const base = emptyBranches(GENERATOR_IDS)
  if (!isRecord(raw)) return base
  for (const id of GENERATOR_IDS) {
    const row = raw[id]
    if (!isRecord(row)) continue
    const efficiency =
      typeof row.efficiency === 'number' && Number.isFinite(row.efficiency)
        ? Math.max(0, Math.min(5, Math.floor(row.efficiency)))
        : 0
    const capacity =
      typeof row.capacity === 'number' && Number.isFinite(row.capacity)
        ? Math.max(0, Math.min(5, Math.floor(row.capacity)))
        : 0
    base[id] = { efficiency, capacity }
  }
  return base
}

function parseQuests(
  dayRaw: unknown,
  questsRaw: unknown,
): { dayKey: string; quests: QuestProgress[] } {
  const fallback = emptyQuestProgress()
  const key =
    typeof dayRaw === 'string' && dayRaw.length >= 8 ? dayRaw : fallback.dayKey
  if (!Array.isArray(questsRaw) || questsRaw.length === 0) {
    return key === fallback.dayKey ? fallback : emptyQuestProgress()
  }
  const quests: QuestProgress[] = []
  for (const item of questsRaw) {
    if (!isRecord(item)) continue
    if (typeof item.id !== 'string') continue
    if (
      item.kind !== 'upgrades' &&
      item.kind !== 'earnAsh' &&
      item.kind !== 'claimDaily'
    ) {
      continue
    }
    const target =
      typeof item.target === 'number' && Number.isFinite(item.target)
        ? Math.max(1, item.target)
        : 1
    const progress =
      typeof item.progress === 'number' && Number.isFinite(item.progress)
        ? Math.max(0, item.progress)
        : 0
    const rewardAsh =
      typeof item.rewardAsh === 'number' && Number.isFinite(item.rewardAsh)
        ? Math.max(0, Math.floor(item.rewardAsh))
        : 0
    const rewardObsidian =
      typeof item.rewardObsidian === 'number' &&
      Number.isFinite(item.rewardObsidian)
        ? Math.max(0, Math.floor(item.rewardObsidian))
        : 0
    quests.push({
      id: item.id,
      kind: item.kind,
      target,
      progress: Math.min(target, progress),
      rewardAsh,
      rewardObsidian,
      claimed: item.claimed === true,
    })
  }
  if (quests.length < 2) {
    return key === dayKey() ? fallback : emptyQuestProgress()
  }
  return { dayKey: key, quests }
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

export function saveState(state: GameState): void {
  if (savesLocked || getSaveBlock() !== null) return
  try {
    localStorage.setItem(STORAGE_KEY, serializeSave(state))
  } catch {
    // Platz knapp: zuerst das Playtest-Log freigeben, Spielstand geht vor
    try {
      freePlaytestSpace()
      localStorage.setItem(STORAGE_KEY, serializeSave(state))
    } catch {
      /* private mode */
    }
  }
}

export type { GeneratorId }
