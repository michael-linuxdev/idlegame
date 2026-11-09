/** Spielkern — Feste und Festmarken. Öffentlich über src/game/state.ts. */
import { payoutAtGate } from '../economy'
import { festAt, festKeyAt, festShop } from '../fests'
import { YIELD_BOOST_MS } from '../monetization'
import { grantCosmetic } from './core'
import type { GameState } from './types'

/* ———————————— Saisonale Feste ———————————— */

export function syncFest(state: GameState, now = Date.now()): GameState {
  const key = festKeyAt(now)
  if (state.festKey === key) return state
  return { ...state, festKey: key, festTokens: 0, festBought: {} }
}

export function earnFest(state: GameState, amount: number, now = Date.now()): GameState {
  if (amount <= 0) return state
  const synced = syncFest(state, now)
  return { ...synced, festTokens: synced.festTokens + amount }
}

export function buyFestItem(state: GameState, itemId: string, now = Date.now()): GameState {
  const base = syncFest(state, now)
  const fest = festAt(now)
  const item = festShop(fest).find((i) => i.id === itemId)
  if (!item) return state
  const bought = base.festBought[item.id] ?? 0
  if (bought >= item.limit) return state
  if (item.kind === 'variety' && item.variety && base.collection.includes(item.variety)) return state
  if (item.kind === 'skin' && item.skin && base.ownedCosmetics.includes(item.skin)) return state
  if (base.festTokens < item.tokens || base.samen < item.samen) return state
  let next: GameState = {
    ...base,
    festTokens: base.festTokens - item.tokens,
    samen: base.samen - item.samen,
    festBought: { ...base.festBought, [item.id]: bought + 1 },
    lastSeen: now,
  }
  switch (item.kind) {
    case 'variety':
      next = { ...next, collection: [...next.collection, item.variety!], lastVariety: item.variety! }
      break
    case 'skin':
      next = { ...next, ownedCosmetics: grantCosmetic(next.ownedCosmetics, item.skin!), equippedCosmetic: item.skin! }
      break
    case 'seeds':
      next = { ...next, samen: next.samen + (item.amount ?? 0) }
      break
    case 'tokenPack':
      next = { ...next, festTokens: next.festTokens + (item.amount ?? 0) }
      break
    case 'heirlooms': {
      const gain = Math.max(5, Math.round(payoutAtGate(next.saisonenden) * 0.5))
      next = { ...next, erbstuecke: next.erbstuecke + gain }
      break
    }
    case 'boost': {
      const active = next.yieldBoostExpiresAt > now
      next = { ...next, yieldBoostExpiresAt: (active ? next.yieldBoostExpiresAt : now) + YIELD_BOOST_MS }
      break
    }
  }
  return next
}
