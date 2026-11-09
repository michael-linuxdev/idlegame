/**
 * Spielstand lesen: Parser für einzelne Felder und Teilbereiche (Kapitel,
 * Erweiterung, Aufgaben …). Jeder Parser liefert für fehlende oder kaputte
 * Werte einen gültigen Startwert. Zusammengesetzt in storage.ts (parseGameState).
 */
import { ACHIEVEMENT_IDS, type AchievementId } from './achievements'
import { parseAlbum } from './album'
import { emptyBranches } from './branches'
import { CHAPTERS, CHAPTER_CARE_MAX, emptyChapter, type ChaptersState, type ChapterState, type ChapterDef } from './chapters'
import { parseCrossing, parseHybrids } from './crossing'
import { parseDecorOwned, parseDecorSlots } from './decor'
import { emptyRecipe, ILSE_RANKS, type ContestResult, type Recipe, type SkyEvent } from './extrasCore'
import { VARIETIES, type WheelBuff } from './gardenLife'
import { EMPTY_LEGACY, type LegacyUpgrades } from './generations'
import { GENERATOR_IDS, GENERATOR_IDS as GEN_IDS } from './generators'
import { EMPTY_DEEP_META, emptyLongLoopSlice, type DeepMetaUpgrades } from './longLoop'
import { COSMETICS, dayKey, type CosmeticId } from './monetization'
import { parseProjects } from './projects'
import { emptyQuestProgress, type QuestProgress } from './quests'
import { parseResidentVisit, parseResidentsSeen } from './residents'
import { createInitialState, emptyExpansion, HELPER_RANKS, type ExpansionSlice, type GameState } from './state'
import { EMPTY_TRUHE, type TruheUpgrades } from './truhe'
import { parseWeatherBuff } from './weatherEvents'

export const COSMETIC_IDS = new Set(COSMETICS.map((c) => c.id))

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

export function parseOwned(raw: unknown): GameState['owned'] {
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

export function parseUpgrades(raw: unknown): TruheUpgrades {
  const base = { ...EMPTY_TRUHE }
  if (!isRecord(raw)) return base
  for (const key of Object.keys(base) as (keyof TruheUpgrades)[]) {
    const n = raw[key]
    if (typeof n === 'number' && Number.isFinite(n) && n >= 0) {
      base[key] = Math.floor(n)
    }
  }
  return base
}

export function parseCosmetics(raw: unknown): CosmeticId[] {
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

export function parseNum(raw: unknown, fallback = 0): number {
  return typeof raw === 'number' && Number.isFinite(raw) ? Math.max(0, raw) : fallback
}

export function parseChapter(def: ChapterDef, raw: unknown): ChapterState {
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
export function parseCare(def: ChapterDef, raw: unknown): ChapterState['care'] {
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

export function parseChapters(raw: unknown): ChaptersState {
  const out = {} as ChaptersState
  for (const def of CHAPTERS) out[def.id] = parseChapter(def, isRecord(raw) ? raw[def.id] : undefined)
  return out
}

export function parseNumRecord(raw: unknown): Record<string, number> {
  const out: Record<string, number> = {}
  if (!isRecord(raw)) return out
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === 'number' && Number.isFinite(v) && v >= 0) out[k] = Math.floor(v)
  }
  return out
}

export function parseRecipe(raw: unknown): Recipe {
  if (!isRecord(raw) || typeof raw.day !== 'string' || !Array.isArray(raw.areas)) return emptyRecipe()
  const areas = raw.areas.filter((a): a is (typeof GEN_IDS)[number] => GEN_IDS.includes(a as (typeof GEN_IDS)[number]))
  const have = Array.isArray(raw.have) ? raw.have.map((n) => parseNonNegInt(n)) : areas.map(() => 0)
  return { day: raw.day, areas, have, claimed: raw.claimed === true, dish: parseNonNegInt(raw.dish) }
}

export function parseSky(raw: unknown): SkyEvent | null {
  if (!isRecord(raw) || (raw.kind !== 'rainbow' && raw.kind !== 'star')) return null
  return { kind: raw.kind, until: parseNum(raw.until) }
}

export function parseContestResult(raw: unknown): ContestResult | null {
  if (!isRecord(raw) || typeof raw.week !== 'string') return null
  return { week: raw.week, rank: Math.max(1, parseNonNegInt(raw.rank, 10)), kg: parseNum(raw.kg), claimed: raw.claimed === true }
}

export function parseExpansion(parsed: Record<string, unknown>): ExpansionSlice {
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

export function parseNonNegInt(raw: unknown, fallback = 0): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.max(0, Math.floor(raw))
  }
  return fallback
}

export function parseDeepUpgrades(raw: unknown): DeepMetaUpgrades {
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

export function parseLongLoop(parsed: Record<string, unknown>) {
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

export const VARIETY_IDS = new Set(VARIETIES.map((v) => v.id))

export function parseWheelBuff(raw: unknown): WheelBuff | null {
  if (!isRecord(raw)) return null
  const kind = raw.kind
  if (kind !== 'yield' && kind !== 'water' && kind !== 'seeds' && kind !== 'variety') return null
  return { kind, prestige: parseNonNegInt(raw.prestige, 0) }
}

export function parseAchievements(raw: unknown): AchievementId[] {
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

export function parseBranches(raw: unknown): GameState['branches'] {
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

export function parseQuests(
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
      item.kind !== 'earnErnte' &&
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
    const rewardErnte =
      typeof item.rewardErnte === 'number' && Number.isFinite(item.rewardErnte)
        ? Math.max(0, Math.floor(item.rewardErnte))
        : 0
    const rewardSamen =
      typeof item.rewardSamen === 'number' &&
      Number.isFinite(item.rewardSamen)
        ? Math.max(0, Math.floor(item.rewardSamen))
        : 0
    quests.push({
      id: item.id,
      kind: item.kind,
      target,
      progress: Math.min(target, progress),
      rewardErnte,
      rewardSamen,
      claimed: item.claimed === true,
    })
  }
  if (quests.length < 2) {
    return key === dayKey() ? fallback : emptyQuestProgress()
  }
  return { dayKey: key, quests }
}
