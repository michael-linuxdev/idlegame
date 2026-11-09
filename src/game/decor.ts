/**
 * Deko frei platzieren: Samen buy decoration that stays forever; the player
 * sets it on fixed Dekoplätze in Omas Garten. Some pieces are exclusive
 * rewards (Jahreszeiten-Album, Großprojekte) and can't be bought.
 * Several pieces attract Gartenbewohner (see residents.ts).
 */
export type DecorId =
  | 'zwerg'
  | 'laubhaufen'
  | 'futterhaus'
  | 'traenke'
  | 'insektenhotel'
  | 'bank'
  | 'windrad'
  | 'lampions'
  | 'sonnenuhr'
  | 'rosenbogen'
  | 'blumenkorb'
  | 'strandkorb'
  | 'kuerbislaterne'
  | 'schneemann'
  | 'brunnen'
  | 'pavillon'

export interface DecorDef {
  id: DecorId
  /** Samen; 0 + exclusive = reward only */
  cost: number
  exclusive?: boolean
}

export const DECOR: DecorDef[] = [
  { id: 'zwerg', cost: 15 },
  { id: 'laubhaufen', cost: 10 },
  { id: 'futterhaus', cost: 20 },
  { id: 'traenke', cost: 25 },
  { id: 'insektenhotel', cost: 30 },
  { id: 'windrad', cost: 30 },
  { id: 'bank', cost: 35 },
  { id: 'lampions', cost: 40 },
  { id: 'sonnenuhr', cost: 50 },
  { id: 'rosenbogen', cost: 60 },
  { id: 'blumenkorb', cost: 0, exclusive: true },
  { id: 'strandkorb', cost: 0, exclusive: true },
  { id: 'kuerbislaterne', cost: 0, exclusive: true },
  { id: 'schneemann', cost: 0, exclusive: true },
  { id: 'brunnen', cost: 0, exclusive: true },
  { id: 'pavillon', cost: 0, exclusive: true },
]

export const DECOR_IDS: DecorId[] = DECOR.map((d) => d.id)

/** Fixed Dekoplätze on Omas Garten map (percent of the map, bottom-centre anchor). */
export const DECOR_SLOTS: { left: number; top: number }[] = [
  { left: 9, top: 79 },
  { left: 41, top: 53 },
  { left: 87, top: 32 },
  { left: 13, top: 24 },
  { left: 86, top: 73 },
  { left: 58, top: 79 },
  { left: 94, top: 59 },
  { left: 38, top: 43 },
]

export function decorDef(id: string): DecorDef | undefined {
  return DECOR.find((d) => d.id === id)
}

/** Dekoplätze open after the first Saisonende (garden has shape by then). */
export function decorUnlocked(s: { saisonenden: number; tiefeWinter: number; generation: number }): boolean {
  return s.saisonenden >= 1 || s.tiefeWinter > 0 || s.generation > 0
}

export function emptySlots(): (DecorId | null)[] {
  return DECOR_SLOTS.map(() => null)
}

export function parseDecorOwned(raw: unknown): DecorId[] {
  return Array.isArray(raw) ? DECOR_IDS.filter((id) => raw.includes(id)) : []
}

export function parseDecorSlots(raw: unknown, owned: readonly DecorId[]): (DecorId | null)[] {
  const out = emptySlots()
  if (!Array.isArray(raw)) return out
  const used = new Set<DecorId>()
  raw.slice(0, out.length).forEach((v, i) => {
    if (typeof v === 'string' && owned.includes(v as DecorId) && !used.has(v as DecorId)) {
      out[i] = v as DecorId
      used.add(v as DecorId)
    }
  })
  return out
}

/** Decor currently standing in the garden (for residents). */
export function placedDecor(slots: readonly (DecorId | null)[]): DecorId[] {
  return slots.filter((x): x is DecorId => x != null)
}
