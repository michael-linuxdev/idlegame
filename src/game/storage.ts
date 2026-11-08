import { EMPTY_EMBER_UPGRADES, type EmberUpgrades } from './economy'
import { GENERATOR_IDS, type GeneratorId } from './generators'
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
import { CHAPTERS, emptyChapter, type ChaptersState, type ChapterState, type ChapterDef } from './chapters'
import { emptyRecipe, ILSE_RANKS, type ContestResult, type Recipe, type SkyEvent } from './extrasCore'
import { GENERATOR_IDS as GEN_IDS } from './generators'
import { EMPTY_LEGACY, type LegacyUpgrades } from './generations'
import { VARIETIES, type WheelBuff } from './gardenLife'

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

/** Field names used before the Ernte/Erbstücke/Samen rename (Nov 2026). */
const RENAMED_FIELDS: Record<string, string> = {
  ash: 'ernte',
  ashEarned: 'ernteSeason',
  lifetimeAshEarned: 'ernteLifetime',
  embers: 'erbstuecke',
  obsidian: 'samen',
  deepEmbers: 'sproesslinge',
}

/** Accept saves written with the old internal field names. */
export function migrateFieldNames(raw: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...raw }
  for (const [oldKey, newKey] of Object.entries(RENAMED_FIELDS)) {
    if (out[newKey] === undefined && out[oldKey] !== undefined) out[newKey] = out[oldKey]
    delete out[oldKey]
  }
  return out
}

/**
 * Spielstand-Migration (aktiv seit 2026-11-08 — echte Spieler):
 *  - Jede Format-Änderung bekommt einen Schritt in MIGRATIONS und erhöht
 *    SAVE_VERSION. Felder werden nie still umbenannt oder entfernt.
 *  - src/test/fixtures/save-v*.json hält echte Stände jeder Version fest;
 *    src/test/migration.test.ts muss sie verlustfrei laden.
 */
export const SAVE_VERSION = 2

type Raw = Record<string, unknown>

const MIGRATIONS: Record<number, (raw: Raw) => Raw> = {
  // v1 → v2: Streuobstwiese lived in `orchard` before the Kapitel-Baukasten
  1: (raw) => {
    const out = { ...raw }
    const o = raw.orchard
    if (isRecord(o) && !isRecord(raw.chapters)) {
      out.chapters = {
        obstwiese: {
          cur: o.obst,
          curLifetime: o.obstLifetime,
          owned: o.owned,
          openedAt: o.openedAt,
          introSeen: o.introSeen,
        },
      }
    }
    delete out.orchard
    return out
  },
}

/** Bring any stored save up to SAVE_VERSION (field renames + version steps). */
export function migrateSave(raw: Raw): Raw {
  let out = migrateFieldNames(raw)
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

  let erbstuecke = 0
  if (typeof parsed.erbstuecke === 'number') {
    erbstuecke = Math.max(0, Math.floor(parsed.erbstuecke))
  } else if (typeof parsed.dominion === 'number') {
    erbstuecke = Math.max(0, Math.floor(parsed.dominion))
  }

  const prestiges =
    typeof parsed.prestiges === 'number'
      ? Math.max(0, Math.floor(parsed.prestiges))
      : 0
  const lastSeen =
    typeof parsed.lastSeen === 'number' && parsed.lastSeen > 0
      ? parsed.lastSeen
      : Date.now()
  const lastTapAt =
    typeof parsed.lastTapAt === 'number' && parsed.lastTapAt >= 0
      ? parsed.lastTapAt
      : 0
  const clanMult =
    typeof parsed.clanMult === 'number' && Number.isFinite(parsed.clanMult)
      ? Math.min(1.25, Math.max(1, parsed.clanMult))
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
  const clanBoostExpiresAt =
    typeof parsed.clanBoostExpiresAt === 'number' &&
    Number.isFinite(parsed.clanBoostExpiresAt)
      ? Math.max(0, parsed.clanBoostExpiresAt)
      : 0

  const dailyClaimDay =
    typeof parsed.dailyClaimDay === 'string' ? parsed.dailyClaimDay : ''
  const dailyStreak =
    typeof parsed.dailyStreak === 'number' && Number.isFinite(parsed.dailyStreak)
      ? Math.max(0, Math.floor(parsed.dailyStreak))
      : 0
  const eventDismissedKey =
    typeof parsed.eventDismissedKey === 'string' ? parsed.eventDismissedKey : ''
  const eventAshProgress =
    typeof parsed.eventAshProgress === 'number' &&
    Number.isFinite(parsed.eventAshProgress)
      ? Math.max(0, parsed.eventAshProgress)
      : 0
  const eventProgressKey =
    typeof parsed.eventProgressKey === 'string' ? parsed.eventProgressKey : ''
  const eventGoalClaimedKey =
    typeof parsed.eventGoalClaimedKey === 'string'
      ? parsed.eventGoalClaimedKey
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
  const yieldBoostExpiresAt =
    typeof parsed.yieldBoostExpiresAt === 'number' &&
    Number.isFinite(parsed.yieldBoostExpiresAt)
      ? Math.max(0, parsed.yieldBoostExpiresAt)
      : 0
  const bpWeekKey =
    typeof parsed.bpWeekKey === 'string' && parsed.bpWeekKey.length > 0
      ? parsed.bpWeekKey
      : weekKey()
  const bpXp =
    typeof parsed.bpXp === 'number' && Number.isFinite(parsed.bpXp)
      ? Math.max(0, Math.floor(parsed.bpXp))
      : 0
  const bpClaimedFree = Array.isArray(parsed.bpClaimedFree)
    ? parsed.bpClaimedFree.filter(
        (n): n is number => typeof n === 'number' && Number.isFinite(n),
      )
    : []
  const bpPremium = parsed.bpPremium === true
  const bpClaimedPremium = Array.isArray(parsed.bpClaimedPremium)
    ? parsed.bpClaimedPremium.filter(
        (n): n is number => typeof n === 'number' && Number.isFinite(n),
      )
    : []
  const bpDailyXpDay =
    typeof parsed.bpDailyXpDay === 'string' ? parsed.bpDailyXpDay : ''

  const prestigeSpikeFlags =
    typeof parsed.prestigeSpikeFlags === 'number' &&
    Number.isFinite(parsed.prestigeSpikeFlags)
      ? Math.max(0, Math.floor(parsed.prestigeSpikeFlags))
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
    emberUpgrades: parseUpgrades(parsed.emberUpgrades),
    prestiges,
    lastSeen,
    lastTapAt,
    clanMult,
    samen,
    ownedCosmetics,
    equippedCosmetic,
    skipHoursUsedToday,
    skipDayKey,
    clanBoostExpiresAt,
    dailyClaimDay,
    dailyStreak,
    eventDismissedKey,
    eventAshProgress,
    eventProgressKey,
    eventGoalClaimedKey,
    playerXp,
    claimedLevelRewards,
    totalUpgrades,
    ernteLifetime,
    claimedDailyOnce,
    claimedOfflineOnce,
    claimedAchievements,
    branches,
    questDayKey: questBundle.dayKey,
    quests: questBundle.quests,
    ownedOfferIds,
    adsRemoved,
    lastRewardedAdAt,
    rewardedAdClaims,
    yieldBoostExpiresAt,
    bpWeekKey,
    bpXp,
    bpClaimedFree,
    bpPremium,
    bpClaimedPremium,
    bpDailyXpDay,
    prestigeSpikeFlags,
    lastSurprise: null,
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
  }
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
    deepUpgrades: parseDeepUpgrades(parsed.deepUpgrades),
    deepPrestiges: parseNonNegInt(parsed.deepPrestiges, defaults.deepPrestiges),
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

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
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
    // Keep the last pre-migration save around, just in case
    if (parsed.saveVersion !== SAVE_VERSION) keepCopy(`${STORAGE_KEY}-before-v${SAVE_VERSION}`, raw)
    return parseGameState(migrateSave(parsed))
  } catch {
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

export function saveState(state: GameState): void {
  if (savesLocked) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, saveVersion: SAVE_VERSION }))
  } catch {
    // Quota / private mode — ignore for MVP
  }
}

export type { GeneratorId }
