/** Spielkern — Spielstand-Typ, Konstanten und Erweiterungs-Ausschnitt. Öffentlich über src/game/state.ts. */
import type { AchievementId } from '../achievements'
import type { BogenWahl } from '../arcRules'
import { type AlbumState, emptyAlbum } from '../album'
import type { BranchRanks } from '../branches'
import type { ChallengeId } from '../challenges'
import { type ChaptersState, emptyChapters } from '../chapters'
import type { Crossing, HybridId } from '../crossing'
import { type DecorId, emptySlots } from '../decor'
import type { TruheUpgrades } from '../truhe'
import {
  type ChestReward,
  type ContestResult,
  type Recipe,
  SKY,
  type SkyEvent,
  emptyRecipe,
} from '../extrasCore'
import { festKeyAt } from '../fests'
import type { WheelBuff } from '../gardenLife'
import { EMPTY_LEGACY, type LegacyUpgrades } from '../generations'
import type { GeneratorId } from '../generators'
import { EMPTY_REST_CUT, type DeepMetaUpgrades, type RestCut } from '../longLoop'
import { type CosmeticId, weekKey } from '../monetization'
import type { ProjectId } from '../projects'
import type { QuestProgress } from '../quests'
import type { ResidentId, ResidentVisit } from '../residents'
import type { CardOffer, SeasonCardId } from '../seasonCards'
import type { SurpriseJump } from '../surpriseJumps'
import type { WeatherBuff } from '../weatherEvents'

export interface GameState {
  /** Laufende Währung — Ernte */
  ernte: number
  /** Ernte earned this Saison (Saisonende base) */
  ernteSeason: number
  owned: Record<GeneratorId, number>
  /** Meta-Währung — Erbstücke (survives Saisonende) */
  erbstuecke: number
  truhe: TruheUpgrades
  /** Prestige runs completed (0-indexed for next gate) */
  saisonenden: number
  lastSeen: number
  /** Last active tap timestamp */
  lastTapAt: number
  /** Active clan boost multiplier while vereinBoostExpiresAt > now (1.0–1.25) */
  vereinMult: number
  /** Premium-Währung — Samen (survives Saisonende) */
  samen: number
  /** Owned cosmetic ids (survives prestige) */
  ownedCosmetics: CosmeticId[]
  /** Equipped garden skin */
  equippedCosmetic: CosmeticId
  /** Hours of paid time-skip used on skipDayKey */
  skipHoursUsedToday: number
  /** Local calendar day for skipHoursUsedToday */
  skipDayKey: string
  /** Clan boost expiry timestamp; 0 = inactive */
  vereinBoostExpiresAt: number
  /** Daily Ops — last claim day key (local); empty = never */
  dailyClaimDay: string
  /** Daily Ops streak (freeze on miss, never energy) */
  dailyStreak: number
  /** Erntefest window key last dismissed */
  erntefestDismissedKey: string
  /** Ernte earned toward the Erntefest goal in the current window */
  erntefestErnte: number
  /** Window key for erntefestErnte */
  erntefestProgressKey: string
  /** Window key when erntefest goal reward was claimed */
  erntefestGoalClaimedKey: string
  /** Spieler-Level XP (survives prestige) */
  playerXp: number
  /** Level reward crumbs already claimed (by level number) */
  claimedLevelRewards: number[]
  /** Lifetime upgrades bought (survives prestige) */
  totalUpgrades: number
  /** Lifetime soft earned across saisonenden (survives) */
  ernteLifetime: number
  /** Achievement flags */
  claimedDailyOnce: boolean
  claimedOfflineOnce: boolean
  /** Ernte from being away that waits for the „Ernten“ tap (0 = nothing waiting) */
  offlinePending: number
  /** Claimed achievement ids */
  claimedAchievements: AchievementId[]
  /** Branch ranks — reset on prestige */
  branches: BranchRanks
  /** Daily quest day key */
  questDayKey: string
  /** Daily quest progress rows */
  quests: QuestProgress[]
  /** One-time mock IAP / offer ids already owned (survives prestige) */
  ownedOfferIds: string[]
  /** Permanent remove-ads stub (survives prestige) */
  adsRemoved: boolean
  /** Last rewarded-ad claim timestamp */
  lastRewardedAdAt: number
  /** How many rewarded ads claimed (rotates reward kinds) */
  rewardedAdClaims: number
  /** Day key of the last Markt-Tagesgeschenk ('' = never) */
  marketGiftDay: string
  /** Day key of the last bought Gießkanne refill ('' = never) */
  waterRefillDay: string
  /** Refills bought on waterRefillDay (max WATER_REFILL_PER_DAY) */
  waterRefills: number
  /** Echte Sitzungen (neu erst nach ≥ 30 min Pause) — steuert das Freischalten */
  sessions: number
  /** Saison-Karte dieses Gartenjahres (seasonCards.ts), null = keine */
  seasonCard: SeasonCardId | null
  /** Saison-Karte nach der Ausbau-Regel gewählt (Runde 4); false = alte Ertrags-Regel */
  seasonCardAusbau: boolean
  /** Angebot nach dem Saisonende (leer = keine Wahl offen) */
  seasonCardOffer: CardOffer[]
  /** Karte des Vorjahres (nie zweimal hintereinander) */
  lastSeasonCard: string
  /** Omas Herausforderung dieser Saison (challenges.ts), null = keine */
  challenge: ChallengeId | null
  /** Gewählt für die nächste Saison (startet beim Saisonende) */
  challengeNext: ChallengeId | null
  /** Geschaffte Herausforderungen (dauerhafter Bonus) */
  challengesDone: ChallengeId[]
  /** Personal yield boost expiry; 0 = inactive */
  yieldBoostExpiresAt: number
  /** Battle-pass lite week key */
  gartenwocheKey: string
  /** Battle-pass XP this week (0–100) */
  gartenwocheXp: number
  /** Free-track tiers claimed this week */
  gartenwocheClaimedFree: number[]
  /** Premium track unlocked for current week (stub) */
  gartenwochePremium: boolean
  /** Premium-track tiers claimed this week */
  gartenwocheClaimedPremium: number[]
  /** Day key of last battle-pass daily XP claim */
  gartenwocheXpDay: string
  /** Bitmask of prestige near-miss spikes already fired this run */
  saisonendeSpikeFlags: number
  /** Last surprise juice for HUD (cleared by UI) */
  lastSurprise: SurpriseJump | null
  /** Zeit des letzten Ausbau-Krümels (Drossel SURPRISE_MIN_GAP_MS) */
  lastSurpriseAt: number
  /** Pflanzenbuch variety just found (transient, for the UI pop) */
  lastVariety: string | null
  /** Short flash event id; empty = none */
  flashEventId: string
  /** Flash event end timestamp */
  flashEndsAt: number
  /** Soft earned toward flash goal */
  flashProgress: number
  /** Soft goal for current flash */
  flashGoal: number
  /** Whether flash goal reward was claimed */
  flashClaimed: boolean
  /** UI dismissed (does not wipe soft) */
  flashDismissed: boolean
  /** Last flash start time (cooldown) */
  lastFlashAt: number
  /** Deep meta currency (Sprossen / Saison-Jetons) */
  sproesslinge: number
  sproesslingLaden: DeepMetaUpgrades
  /** Deep resets completed */
  tiefeWinter: number
  /** Pflanzenbuch — variety ids found (permanent across all resets) */
  collection: string[]
  /** Glücksrad buff for one Gartenjahr */
  wheelBuff: WheelBuff | null
  /** Gartenhelfer rank (0 = none) — permanent, bought with Erbstücke */
  helperLevel: number
  /** Gartenhelfer switched on */
  helperOn: boolean
  /** Garden areas Jonas must not build (player's choice, default none) */
  helperBlocked: GeneratorId[]
  /** Deko the player owns (forever) */
  decorOwned: DecorId[]
  /** Deko standing on each Dekoplatz (null = empty) */
  decorSlots: (DecorId | null)[]
  /** Gartenbewohner: species → visits noted */
  residentsSeen: Partial<Record<ResidentId, number>>
  /** Visitor currently in the garden */
  residentNow: ResidentVisit | null
  /** No new visitor before this time */
  residentNextAt: number
  /** Saatgut kreuzen: the running crossing */
  crossing: Crossing | null
  /** Kreuzungen found (forever) */
  hybrids: HybridId[]
  /** Großprojekte: stages built per project */
  projects: Partial<Record<ProjectId, number>>
  /** Jahreszeiten-Album of the current real season */
  album: AlbumState
  /** Day key of the last Wetter-Entscheidung ('' = none yet) */
  weatherDecided: string
  /** Effect of the last decision */
  weatherBuff: WeatherBuff | null
  /** Helper time carry (ms) between buys */
  helperCarryMs: number
  /** Transient: buys the helper made while away (for the offline toast) */
  helperReport: number
  /** Frühlingsschub end (×3 right after Saisonende) */
  turboEndsAt: number
  /** Kapitel 2+ — Streuobstwiese, Weinberg … */
  chapters: ChaptersState
  /** Oma Ilse — helper for the chapters (bought with Obst) */
  ilseLevel: number
  ilseOn: boolean
  ilseCarryMs: number
  /** Last Weinlese minigame */
  weinleseAt: number
  /** Letzter Tiefer Winter (Ruhezeit, longLoop.DEEP_REST_MS); 0 = noch keiner seit dem Update */
  tieferWinterAt: number
  /** Verdiente Verkürzung der laufenden Ruhezeit (Runde 4, longLoop.creditRestDay); beim Tiefen Winter wieder 0 */
  ruhezeitVerkuerzung: RestCut
  /** Bogen-Regeln der Kapitel 13–49 (Runde 4, game/arcRules.ts): Wahl je Kapitel; fehlt = keine Wahl (neutral) */
  bogenWahl: BogenWahl
  /** Abschluss-Szene von Kapitel 50 (Omas Schrebergarten) gesehen — einmalig, übersteht jeden Reset */
  abschlussSeen: boolean
  /** Best Meilenstein count per area (lifetime) — new record opens a Truhe */
  milestoneRecord: Record<string, number>
  /** Transient: Meilenstein-Truhe just opened (UI pop) */
  lastChest: ChestReward | null
  /** Omas Tagesrezept */
  recipe: Recipe
  /** Himmelsereignis waiting to be tapped */
  skyEvent: SkyEvent | null
  skyNextAt: number
  /** Regenbogen ×5 active until */
  rainbowEndsAt: number
  /** Messing-Gießkanne used in this week (weekKey) */
  shieldWeek: string
  /** Größter Kürbis — week key, kg this week, pending result of last week */
  contestWeek: string
  contestKg: number
  contestResult: ContestResult | null
  /** Generationen handed down */
  generation: number
  /** Vermächtnis — Generation currency */
  vermaechtnis: number
  legacy: LegacyUpgrades
  /** Running fest instance (fests.ts festKeyAt) */
  festKey: string
  /** Festmarken (fractional; UI floors) */
  festTokens: number
  /** Fest shop purchases this fest: item id → count */
  festBought: Record<string, number>
}

/** Gartenhelfer ranks: Erbstücke cost and time between two Ausbauten. */
export type HelperCurrency = 'erbstuecke' | 'sproesslinge' | 'vermaechtnis'

/**
 * Jonas stays through every reset, so the later ranks are paid in the
 * currency of the layer they need: Erbstücke → Sprösslinge (Tiefer Winter)
 * → Vermächtnis (Generation, Profi-Jonas).
 */
export const HELPER_RANKS: readonly { cost: number; currency: HelperCurrency; intervalMs: number }[] = [
  { cost: 50, currency: 'erbstuecke', intervalMs: 30_000 },
  { cost: 250, currency: 'erbstuecke', intervalMs: 12_000 },
  { cost: 800, currency: 'erbstuecke', intervalMs: 5000 },
  { cost: 20, currency: 'sproesslinge', intervalMs: 2000 },
  { cost: 3, currency: 'vermaechtnis', intervalMs: 800 },
]

/** Frühlingsschub after every Saisonende / Tiefer Winter / Generation. */
export const TURBO_MS = 2 * 60 * 1000
export const TURBO_MULT = 3

export interface ExpansionSlice {
  helperLevel: number
  helperOn: boolean
  /** Garden areas Jonas must not build (player's choice, default none) */
  helperBlocked: GeneratorId[]
  /** Deko the player owns (forever) */
  decorOwned: DecorId[]
  /** Deko standing on each Dekoplatz (null = empty) */
  decorSlots: (DecorId | null)[]
  /** Gartenbewohner: species → visits noted */
  residentsSeen: Partial<Record<ResidentId, number>>
  /** Visitor currently in the garden */
  residentNow: ResidentVisit | null
  /** No new visitor before this time */
  residentNextAt: number
  /** Saatgut kreuzen: the running crossing */
  crossing: Crossing | null
  /** Kreuzungen found (forever) */
  hybrids: HybridId[]
  /** Großprojekte: stages built per project */
  projects: Partial<Record<ProjectId, number>>
  /** Jahreszeiten-Album of the current real season */
  album: AlbumState
  /** Day key of the last Wetter-Entscheidung ('' = none yet) */
  weatherDecided: string
  /** Effect of the last decision */
  weatherBuff: WeatherBuff | null
  helperCarryMs: number
  helperReport: number
  turboEndsAt: number
  chapters: ChaptersState
  ilseLevel: number
  ilseOn: boolean
  ilseCarryMs: number
  weinleseAt: number
  tieferWinterAt: number
  ruhezeitVerkuerzung: RestCut
  bogenWahl: BogenWahl
  abschlussSeen: boolean
  milestoneRecord: Record<string, number>
  lastChest: ChestReward | null
  recipe: Recipe
  skyEvent: SkyEvent | null
  skyNextAt: number
  rainbowEndsAt: number
  shieldWeek: string
  contestWeek: string
  contestKg: number
  contestResult: ContestResult | null
  generation: number
  vermaechtnis: number
  legacy: LegacyUpgrades
  festKey: string
  festTokens: number
  festBought: Record<string, number>
}

export function emptyExpansion(now = Date.now()): ExpansionSlice {
  return {
    helperLevel: 0,
    helperOn: true,
    helperBlocked: [],
    decorOwned: [],
    decorSlots: emptySlots(),
    residentsSeen: {},
    residentNow: null,
    residentNextAt: 0,
    crossing: null,
    hybrids: [],
    projects: {},
    album: emptyAlbum(),
    weatherDecided: '',
    weatherBuff: null,
    helperCarryMs: 0,
    helperReport: 0,
    turboEndsAt: 0,
    chapters: emptyChapters(),
    ilseLevel: 0,
    ilseOn: true,
    ilseCarryMs: 0,
    weinleseAt: 0,
    tieferWinterAt: 0,
    ruhezeitVerkuerzung: { ...EMPTY_REST_CUT },
    bogenWahl: {},
    abschlussSeen: false,
    milestoneRecord: {},
    lastChest: null,
    recipe: emptyRecipe(),
    skyEvent: null,
    skyNextAt: now + SKY.firstDelayMs,
    rainbowEndsAt: 0,
    shieldWeek: '',
    contestWeek: weekKey(now),
    contestKg: 0,
    contestResult: null,
    generation: 0,
    vermaechtnis: 0,
    legacy: { ...EMPTY_LEGACY },
    festKey: festKeyAt(now),
    festTokens: 0,
    festBought: {},
  }
}

/** Expansion fields survive Saisonende (copied as-is). */
export function pickExpansion(s: GameState): ExpansionSlice {
  return {
    helperLevel: s.helperLevel,
    helperOn: s.helperOn,
    helperBlocked: s.helperBlocked,
    decorOwned: s.decorOwned,
    decorSlots: s.decorSlots,
    residentsSeen: s.residentsSeen,
    residentNow: s.residentNow,
    residentNextAt: s.residentNextAt,
    crossing: s.crossing,
    hybrids: s.hybrids,
    projects: s.projects,
    album: s.album,
    weatherDecided: s.weatherDecided,
    weatherBuff: s.weatherBuff,
    helperCarryMs: 0,
    helperReport: 0,
    turboEndsAt: s.turboEndsAt,
    chapters: s.chapters,
    ilseLevel: s.ilseLevel,
    ilseOn: s.ilseOn,
    ilseCarryMs: 0,
    weinleseAt: s.weinleseAt,
    tieferWinterAt: s.tieferWinterAt,
    ruhezeitVerkuerzung: s.ruhezeitVerkuerzung,
    bogenWahl: s.bogenWahl,
    abschlussSeen: s.abschlussSeen,
    milestoneRecord: { ...s.milestoneRecord },
    lastChest: null,
    recipe: s.recipe,
    skyEvent: s.skyEvent,
    skyNextAt: s.skyNextAt,
    rainbowEndsAt: s.rainbowEndsAt,
    shieldWeek: s.shieldWeek,
    contestWeek: s.contestWeek,
    contestKg: s.contestKg,
    contestResult: s.contestResult,
    generation: s.generation,
    vermaechtnis: s.vermaechtnis,
    legacy: { ...s.legacy },
    festKey: s.festKey,
    festTokens: s.festTokens,
    festBought: { ...s.festBought },
  }
}

/**
 * Spielstand-Schlüssel. Bis 2026-11-09 hieß er `gartenerbe-save-v1` (anderes
 * Format, ohne Migration verworfen) — der alte Schlüssel bleibt unangetastet liegen.
 */
export const STORAGE_KEY = 'gartenerbe-spielstand-v1'
