/**
 * HUD-Grenze (Runde 4, Paket 2): nie mehr als drei Ereignis-Pillen
 * gleichzeitig. Vorrang hat, was abläuft:
 *  1. was man jetzt abholen kann (`claim`),
 *  2. was eine Restzeit hat — die kürzeste zuerst,
 *  3. der Rest in fester Reihenfolge (PILL_PRIORITY), Unbekanntes zuletzt.
 * Die übrigen stehen hinter „+N“ nur als Liste (EventPills), nie als
 * weitere Pillen.
 */
export const MAX_EVENT_PILLS = 3

/** Feste Reihenfolge für Pillen ohne Restzeit. */
export const PILL_PRIORITY = ['deep', 'season', 'order', 'erntefest', 'fest', 'card', 'challenge', 'weather', 'wheel'] as const

export interface PillLike {
  key: string
  claim?: boolean
  /** Restzeit in ms, falls die Pille abläuft */
  msLeft?: number
}

function rank(p: PillLike): [number, number, number] {
  const prio = (PILL_PRIORITY as readonly string[]).indexOf(p.key)
  return [p.claim ? 0 : 1, p.msLeft != null && p.msLeft > 0 ? p.msLeft : Infinity, prio < 0 ? 999 : prio]
}

export function orderPills<T extends PillLike>(pills: readonly T[]): T[] {
  return [...pills].sort((a, b) => {
    const ra = rank(a)
    const rb = rank(b)
    return ra[0] - rb[0] || ra[1] - rb[1] || ra[2] - rb[2]
  })
}

/**
 * Sichtbare Pillen und der Rest. Passt alles, sind es bis zu drei; sonst
 * zwei Pillen plus der „+N“-Knopf (er zählt als dritter Platz).
 */
export function selectPills<T extends PillLike>(pills: readonly T[], max = MAX_EVENT_PILLS): { visible: T[]; hidden: T[] } {
  const ordered = orderPills(pills)
  if (ordered.length <= max) return { visible: ordered, hidden: [] }
  return { visible: ordered.slice(0, max - 1), hidden: ordered.slice(max - 1) }
}
