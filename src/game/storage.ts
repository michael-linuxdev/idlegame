import { EMPTY_EMBER_UPGRADES, type EmberUpgrades } from './economy'
import type { GeneratorId } from './generators'
import { createInitialState, STORAGE_KEY, type GameState } from './state'

const LEGACY_KEYS = ['ash-dominion-save-v2', 'ash-dominion-save-v1'] as const

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function parseOwned(raw: unknown): GameState['owned'] {
  const base = createInitialState().owned
  if (!isRecord(raw)) return base
  const ids: GeneratorId[] = [
    'emberPit',
    'ashForge',
    'cinderBarracks',
    'sootKiln',
    'pyreVault',
  ]
  for (const id of ids) {
    const n = raw[id]
    if (typeof n === 'number' && Number.isFinite(n) && n >= 0) {
      base[id] = Math.floor(n)
    }
  }
  // Ensure G1 is at least 1 for brand-new-looking saves that somehow zeroed it
  if (base.emberPit < 1 && (raw.emberPit === undefined || raw.emberPit === 0)) {
    // Preserve intentional zero after prestige only when ashEarned reset — handled by createPostPrestige
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

function parseGameState(parsed: Record<string, unknown>): GameState {
  const ash = typeof parsed.ash === 'number' ? Math.max(0, parsed.ash) : 0
  const ashEarned =
    typeof parsed.ashEarned === 'number' ? Math.max(0, parsed.ashEarned) : ash

  // Migrate dominion → embers
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

  const owned = parseOwned(parsed.owned)
  // Legacy saves may have emberPit: 0 with ash — leave as-is; fresh v2 starts at 1
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
