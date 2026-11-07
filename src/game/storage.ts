import { createInitialState, STORAGE_KEY, type GameState } from './state'
import { GENERATOR_IDS } from './generators'

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

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    const parsed: unknown = JSON.parse(raw)
    if (!isRecord(parsed)) return createInitialState()

    const ash = typeof parsed.ash === 'number' ? Math.max(0, parsed.ash) : 0
    const ashEarned =
      typeof parsed.ashEarned === 'number' ? Math.max(0, parsed.ashEarned) : ash
    const dominion =
      typeof parsed.dominion === 'number' ? Math.max(0, Math.floor(parsed.dominion)) : 0
    const prestiges =
      typeof parsed.prestiges === 'number'
        ? Math.max(0, Math.floor(parsed.prestiges))
        : 0
    const lastSeen =
      typeof parsed.lastSeen === 'number' && parsed.lastSeen > 0
        ? parsed.lastSeen
        : Date.now()

    return {
      ash,
      ashEarned,
      owned: parseOwned(parsed.owned),
      dominion,
      prestiges,
      lastSeen,
    }
  } catch {
    return createInitialState()
  }
}

export function saveState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Quota / private mode — ignore for MVP
  }
}
