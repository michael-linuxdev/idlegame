/**
 * Jeder Bogen spielt sich anders (Runde 4, Paket 4). Eine Regel je Bogen der
 * Kapitel 13–49, als Daten und reine Funktionen; Wirkung über
 * chapterPerSecond (und die Kosten im Kapitel), damit sie online, offline und
 * im Simulator gleich gilt.
 *
 *  - Bogen I (13–19) Patenbeet: ein Bereich wird Patenbeet — seine Nachbarn
 *    im Layout tragen mehr, er selbst nicht.
 *  - Bogen II (20–29) Tauschpost: das Kapitel richtet sich auf einen von drei
 *    Wegen aus — mehr Ertrag, günstigerer Ausbau oder günstigere Pflege.
 *  - Bogen III (30–39) Wasser verteilen: eine feste Zahl Wasserpunkte auf die
 *    zehn Bereiche, je Bereich begrenzt.
 *  - Bogen IV (40–49) Plan für morgen: Schwerpunkt Ertrag jetzt (beim Spielen)
 *    oder Ertrag, während du weg bist.
 *
 * Rahmen: Solange nichts gewählt ist, ist alles exakt wie vorher. Eine Regel
 * wirkt nur nach oben, höchstens ARC_RULE_CAP auf den Ertrag in der Währung
 * des eigenen Kapitels; kein Garten-Bonus, keine Samen, kein Einfluss auf die
 * Freischaltung (das Anlegen eines Bereichs wird nie billiger). Jederzeit
 * änderbar, ohne Tippen im Takt und ohne Timer. Ilse entscheidet nie.
 * Gespeichert in einem Feld für alle vier Regeln: GameState.bogenWahl.
 */
import type { AreaDef, ChapterDef, ChapterId } from './chapters'

export type ArcId = 'I' | 'II' | 'III' | 'IV'

/** Höchstens +25 % Ertrag in der Kapitel-Währung. */
export const ARC_RULE_CAP = 1.25

export function arcOf(number: number): ArcId | null {
  if (number >= 13 && number <= 19) return 'I'
  if (number >= 20 && number <= 29) return 'II'
  if (number >= 30 && number <= 39) return 'III'
  if (number >= 40 && number <= 49) return 'IV'
  return null
}

/** Bogen I: Nachbarn des Patenbeets (im Layout davor und danach). */
export const PATE = { neighbourMult: 1.5 }

/** Bogen II: drei Wege. */
export const TAUSCH = {
  ertrag: { rate: 1.12 },
  /** Ausbauen ab Stufe 1 (Anlegen bleibt gleich teuer — die Freischaltung hängt am Anlegen) */
  ausbau: { areaCost: 0.8 },
  pflege: { careCost: 0.65 },
} as const
export type TauschWeg = keyof typeof TAUSCH
export const TAUSCH_WEGE = Object.keys(TAUSCH) as TauschWeg[]

/** Bogen III: Wasserpunkte. */
export const WASSER = { points: 6, maxPerArea: 2, perPoint: 0.1 }

/** Bogen IV: Schwerpunkt. */
export const PLAN = { heute: { online: 1.15 }, morgen: { away: 1.25 } } as const
export type PlanWahl = keyof typeof PLAN
export const PLAN_WAHLEN = Object.keys(PLAN) as PlanWahl[]

/** Gespeicherte Wahl je Kapitel (Text, je Bogen eigenes Format). */
export type BogenWahl = Partial<Record<ChapterId, string>>

/** Prüft eine gespeicherte Wahl; ungültig → null (= keine Wahl, neutral). */
export function normalizeChoice(def: Pick<ChapterDef, 'number' | 'areas'>, raw: unknown): string | null {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > 64) return null
  switch (arcOf(def.number)) {
    case 'I':
      return def.areas.some((a) => a.id === raw) ? raw : null
    case 'II':
      return (TAUSCH_WEGE as string[]).includes(raw) ? raw : null
    case 'III': {
      const pts = waterPoints(def, raw)
      return pts && pts.some((p) => p > 0) ? pts.join(',') : null
    }
    case 'IV':
      return (PLAN_WAHLEN as string[]).includes(raw) ? raw : null
    default:
      return null
  }
}

/** Bogen III: Wasserpunkte je Bereich aus „0,2,1,…“ (null = ungültig). */
export function waterPoints(def: Pick<ChapterDef, 'areas'>, raw: string | null | undefined): number[] | null {
  if (!raw) return null
  const parts = raw.split(',')
  if (parts.length !== def.areas.length) return null
  const pts = parts.map((p) => Number(p))
  if (pts.some((p) => !Number.isInteger(p) || p < 0 || p > WASSER.maxPerArea)) return null
  if (pts.reduce((a, b) => a + b, 0) > WASSER.points) return null
  return pts
}

/** Ertrags-Faktor je Bereich durch die Wahl (ohne Deckel). */
export function areaMults(def: Pick<ChapterDef, 'number' | 'areas'>, choice: string | null | undefined, away = false): number[] {
  const ones = def.areas.map(() => 1)
  if (!choice) return ones
  switch (arcOf(def.number)) {
    case 'I': {
      const i = def.areas.findIndex((a) => a.id === choice)
      if (i < 0) return ones
      return ones.map((m, k) => (k === i - 1 || k === i + 1 ? PATE.neighbourMult : m))
    }
    case 'II':
      return choice === 'ertrag' ? ones.map(() => TAUSCH.ertrag.rate) : ones
    case 'III': {
      const pts = waterPoints(def, choice)
      return pts ? pts.map((p) => 1 + WASSER.perPoint * p) : ones
    }
    case 'IV':
      if (choice === 'heute') return ones.map(() => (away ? 1 : PLAN.heute.online))
      if (choice === 'morgen') return ones.map(() => (away ? PLAN.morgen.away : 1))
      return ones
    default:
      return ones
  }
}

/**
 * Faktor auf den Ertrag des ganzen Kapitels: gewichteter Mittelwert der
 * Bereichs-Faktoren mit dem heutigen Ertrag je Bereich, gedeckelt auf
 * [1, ARC_RULE_CAP]. `rates` = Ertrag je Bereich ohne Regel.
 */
export function arcRateMult(def: Pick<ChapterDef, 'number' | 'areas'>, rates: readonly number[], choice: string | null | undefined, away = false): number {
  if (!choice || arcOf(def.number) == null) return 1
  const mults = areaMults(def, choice, away)
  let base = 0
  let withRule = 0
  for (let k = 0; k < rates.length; k++) {
    base += rates[k]!
    withRule += rates[k]! * mults[k]!
  }
  if (!(base > 0)) return 1
  return Math.min(ARC_RULE_CAP, Math.max(1, withRule / base))
}

/** Faktor für einen einzelnen Bereich (für das Bereichsblatt): sein Faktor, mit dem Deckel des Kapitels gestaucht. */
export function areaFactor(def: Pick<ChapterDef, 'number' | 'areas'>, rates: readonly number[], choice: string | null | undefined, k: number, away = false): number {
  if (!choice || arcOf(def.number) == null) return 1
  const mults = areaMults(def, choice, away)
  let base = 0
  let withRule = 0
  for (let i = 0; i < rates.length; i++) {
    base += rates[i]!
    withRule += rates[i]! * mults[i]!
  }
  if (!(base > 0) || withRule <= base) return 1
  const capped = arcRateMult(def, rates, choice, away)
  // Anteil des Zuwachses, der nach dem Deckel bleibt, gilt für jeden Bereich gleich
  const keep = (capped * base - base) / (withRule - base)
  return 1 + (mults[k]! - 1) * keep
}

/** Bogen II: Kosten-Faktor. Anlegen (Stufe 0 → 1) bleibt immer gleich teuer. */
export function arcCostMult(def: Pick<ChapterDef, 'number'>, choice: string | null | undefined, kind: 'area' | 'care', owned: number): number {
  if (arcOf(def.number) !== 'II' || !choice) return 1
  if (kind === 'area') return choice === 'ausbau' && owned >= 1 ? TAUSCH.ausbau.areaCost : 1
  return choice === 'pflege' ? TAUSCH.pflege.careCost : 1
}

/** Für Anzeige und Simulator: Faktor einer Wahl mit diesem Kapitel. */
export function previewChoice(def: Pick<ChapterDef, 'number' | 'areas'>, rates: readonly number[], choice: string, away = false): number {
  return arcRateMult(def, rates, choice, away)
}

/**
 * „Beste Wahl“ für den Simulator (und eine Empfehlung, falls gewünscht):
 * die Wahl mit dem höchsten Faktor. `awayShare` = Anteil der Zeit, die der
 * Spieler weg ist (nur Bogen IV). Bogen II: „Ertrag“ ist der einzige Weg, der
 * direkt mehr bringt; die Kosten-Wege wirken über mehr Stufen.
 */
export function bestChoice(def: Pick<ChapterDef, 'number' | 'areas'>, rates: readonly number[], awayShare = 0): string | null {
  const arc = arcOf(def.number)
  if (!arc) return null
  if (arc === 'II') return 'ertrag'
  if (arc === 'IV') {
    const heute = (1 - awayShare) * PLAN.heute.online + awayShare
    const morgen = (1 - awayShare) + awayShare * PLAN.morgen.away
    return morgen > heute ? 'morgen' : 'heute'
  }
  if (arc === 'I') {
    let best: string | null = null
    let bestM = 1
    for (const a of def.areas) {
      const m = arcRateMult(def, rates, a.id)
      if (m > bestM) {
        bestM = m
        best = a.id
      }
    }
    return best
  }
  // III: Punkte nacheinander dorthin, wo sie am meisten bringen (ertragsstärkste Bereiche)
  const pts = def.areas.map(() => 0)
  for (let n = 0; n < WASSER.points; n++) {
    let bestK = -1
    for (let k = 0; k < pts.length; k++) {
      if (pts[k]! >= WASSER.maxPerArea || !(rates[k]! > 0)) continue
      if (bestK < 0 || rates[k]! > rates[bestK]!) bestK = k
    }
    if (bestK < 0) break
    pts[bestK]! += 1
  }
  return pts.some((p) => p > 0) ? pts.join(',') : null
}

export type { AreaDef }
