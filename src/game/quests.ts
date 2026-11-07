/**
 * Quests / Tagesziele — 2–3 rotating daily goals.
 * Seeded by local dayKey. No energy walls; progress from normal play.
 */

import { t } from '../i18n'
import { dayKey } from './monetization'

export type QuestKind = 'upgrades' | 'earnAsh' | 'claimDaily'

export interface QuestDef {
  id: string
  kind: QuestKind
  /** Target count (upgrades) or Ertrag amount (earnAsh); claimDaily uses 1 */
  target: number
  /** Soft reward on claim */
  rewardAsh: number
  rewardObsidian: number
  label: (target: number) => string
}

export interface QuestProgress {
  id: string
  kind: QuestKind
  target: number
  progress: number
  rewardAsh: number
  rewardObsidian: number
  claimed: boolean
}

/** Pool — three are picked per day via seeded shuffle. */
const QUEST_POOL: Omit<QuestDef, 'id'>[] = [
  {
    kind: 'upgrades',
    target: 5,
    rewardAsh: 40,
    rewardObsidian: 0,
    label: (n) => t.quests.upgradeTimes(n),
  },
  {
    kind: 'upgrades',
    target: 12,
    rewardAsh: 90,
    rewardObsidian: 3,
    label: (n) => t.quests.upgradeTimes(n),
  },
  {
    kind: 'earnAsh',
    target: 500,
    rewardAsh: 50,
    rewardObsidian: 0,
    label: (n) => t.quests.earnAsh(n.toLocaleString('de-DE')),
  },
  {
    kind: 'earnAsh',
    target: 5_000,
    rewardAsh: 200,
    rewardObsidian: 5,
    label: (n) => t.quests.earnAsh(n.toLocaleString('de-DE')),
  },
  {
    kind: 'earnAsh',
    target: 25_000,
    rewardAsh: 500,
    rewardObsidian: 8,
    label: (n) => t.quests.earnAsh(n.toLocaleString('de-DE')),
  },
  {
    kind: 'claimDaily',
    target: 1,
    rewardAsh: 35,
    rewardObsidian: 2,
    label: () => t.quests.claimDaily,
  },
]

function hashDay(key: string): number {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Deterministic pick of 3 distinct pool rows for the local day. */
export function questsForDay(now = Date.now()): QuestDef[] {
  const key = dayKey(now)
  let seed = hashDay(key)
  const indices = QUEST_POOL.map((_, i) => i)
  // Fisher–Yates with LCG
  for (let i = indices.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    const j = seed % (i + 1)
    const tmp = indices[i]!
    indices[i] = indices[j]!
    indices[j] = tmp
  }
  // Prefer variety: take first 3, but ensure at most one claimDaily
  const picked: number[] = []
  let hasDaily = false
  for (const idx of indices) {
    const row = QUEST_POOL[idx]!
    if (row.kind === 'claimDaily' && hasDaily) continue
    if (row.kind === 'claimDaily') hasDaily = true
    picked.push(idx)
    if (picked.length >= 3) break
  }
  while (picked.length < 3) {
    for (const idx of indices) {
      if (!picked.includes(idx)) {
        picked.push(idx)
        break
      }
    }
  }
  return picked.map((idx, order) => {
    const row = QUEST_POOL[idx]!
    return {
      id: `${key}-${order}-${row.kind}-${row.target}`,
      kind: row.kind,
      target: row.target,
      rewardAsh: row.rewardAsh,
      rewardObsidian: row.rewardObsidian,
      label: row.label,
    }
  })
}

export function emptyQuestProgress(now = Date.now()): {
  dayKey: string
  quests: QuestProgress[]
} {
  const key = dayKey(now)
  const defs = questsForDay(now)
  return {
    dayKey: key,
    quests: defs.map((d) => ({
      id: d.id,
      kind: d.kind,
      target: d.target,
      progress: 0,
      rewardAsh: d.rewardAsh,
      rewardObsidian: d.rewardObsidian,
      claimed: false,
    })),
  }
}

export function syncQuestDay(
  day: string,
  quests: QuestProgress[],
  now = Date.now(),
): { dayKey: string; quests: QuestProgress[] } {
  const today = dayKey(now)
  if (day === today && quests.length >= 2) {
    return { dayKey: day, quests }
  }
  return emptyQuestProgress(now)
}

export function questLabel(q: QuestProgress): string {
  const def = QUEST_POOL.find(
    (p) => p.kind === q.kind && p.target === q.target,
  )
  if (def) return def.label(q.target)
  if (q.kind === 'upgrades') return t.quests.upgradeTimes(q.target)
  if (q.kind === 'earnAsh') {
    return t.quests.earnAsh(q.target.toLocaleString('de-DE'))
  }
  return t.quests.claimDaily
}
