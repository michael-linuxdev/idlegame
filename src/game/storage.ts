import { EMPTY_EMBER_UPGRADES, type EmberUpgrades } from './economy'
import { GENERATOR_IDS, type GeneratorId } from './generators'
import { COSMETICS, dayKey, type CosmeticId } from './monetization'
import { createInitialState, STORAGE_KEY, type GameState } from './state'

const LEGACY_KEYS = [
  'orbital-claim-save-v2',
  'ash-dominion-save-v2',
  'ash-dominion-save-v1',
] as const

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
  if (!Array.isArray(raw)) return ['steelDeck']
  const out: CosmeticId[] = []
  for (const item of raw) {
    if (typeof item === 'string' && COSMETIC_IDS.has(item as CosmeticId)) {
      out.push(item as CosmeticId)
    }
  }
  if (!out.includes('steelDeck')) out.unshift('steelDeck')
  return out
}

function parseGameState(parsed: Record<string, unknown>): GameState {
  const ash = typeof parsed.ash === 'number' ? Math.max(0, parsed.ash) : 0
  const ashEarned =
    typeof parsed.ashEarned === 'number' ? Math.max(0, parsed.ashEarned) : ash

  let embers = 0
  if (typeof parsed.embers === 'number') {
    embers = Math.max(0, Math.floor(parsed.embers))
  } else if (typeof parsed.dominion === 'number') {
    embers = Math.max(0, Math.floor(parsed.dominion))
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

  const obsidian =
    typeof parsed.obsidian === 'number' && Number.isFinite(parsed.obsidian)
      ? Math.max(0, Math.floor(parsed.obsidian))
      : 20

  const ownedCosmetics = parseCosmetics(parsed.ownedCosmetics)
  let equippedCosmetic: CosmeticId = 'steelDeck'
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
    owned.emberPit = 1
  }

  return {
    ash,
    ashEarned,
    owned,
    embers,
    emberUpgrades: parseUpgrades(parsed.emberUpgrades),
    prestiges,
    lastSeen,
    lastTapAt,
    clanMult,
    obsidian,
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
  }
}

export function loadState(): GameState {
  try {
    let raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      for (const key of LEGACY_KEYS) {
        raw = localStorage.getItem(key)
        if (raw) break
      }
    }
    if (!raw) return createInitialState()
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return createInitialState()
    return parseGameState(parsed)
  } catch {
    return createInitialState()
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    for (const key of LEGACY_KEYS) localStorage.removeItem(key)
  } catch {
    // Quota / private mode — ignore for MVP
  }
}

export type { GeneratorId }
