/**
 * „Kein Tester steht nach dem Update schlechter da“ (Runde 4, Regel 2).
 *
 * Aus jeder Fixture (und zwei daraus abgeleiteten späten Ständen) werden
 * direkt nach dem Laden die Kennzahlen gezogen, die ein Spieler spürt:
 * Ernte/s, Ertrag je offenem Kapitel, alle Währungen, offene Kapitel und
 * laufende Timer. `baseline.json` hält die Werte des Codes **vor** Runde 4
 * fest (erzeugt am 2026-11-10 aus Commit bb5054f); noWorse.test.ts prüft,
 * dass jede Zahl gleich oder besser ist.
 */
import v1 from '../fixtures/save-v1.json'
import { CHAPTERS, type ChapterId } from '../../game/chapters'
import { deepRestLeft } from '../../game/longLoop'
import { parseSave } from '../../game/storage'
import { chapterPerSecond, openChapters, productionPerSecond, type GameState } from '../../game/state'

/** Feste Uhr: kurz nach dem Speichern des v1-Stands (lastSeen). */
export const NOW = 1794221700000 + 60_000

type Raw = Record<string, unknown>

function chapterWith(raw: Raw, id: ChapterId, level: number, openedAgoMs: number): Raw {
  const def = CHAPTERS.find((c) => c.id === id)!
  const owned = Object.fromEntries(def.areas.map((a, i) => [a.id, Math.max(1, level - i * 7)]))
  const care = { [def.areas[0]!.id]: { grow: 3, thrift: 2 } }
  return {
    ...(raw.chapters as Raw),
    [id]: { cur: 1e9, curLifetime: 5e10, openedAt: NOW - openedAgoMs, introSeen: true, owned, care },
  }
}

/** Fixtures plus späte Stände (Kapitel aus allen vier Bögen offen, Ruhezeit läuft). */
export function fixtureStates(): Record<string, Raw> {
  const base = v1 as unknown as Raw
  let late: Raw = { ...base, generation: 24, tiefeWinter: 40, tieferWinterAt: NOW - 86_400_000 }
  for (const [id, lvl] of [['stadtgarten', 120], ['spreewald', 90], ['cottagegarten', 110], ['pistazien', 60], ['andenkartoffeln', 100], ['kimchigarten', 50], ['dachgarten', 80], ['weltgartenschau', 40]] as const) {
    late = { ...late, chapters: chapterWith(late, id, lvl, 20 * 86_400_000) }
  }
  // Ruhezeit beginnt gerade (Tiefer Winter vor einer Minute)
  const fresh: Raw = { ...late, tieferWinterAt: NOW - 60_000 }
  return { 'save-v1': base, 'v1-spaet': late, 'v1-spaet-ruhe-frisch': fresh }
}

export interface Snapshot {
  erntePerS: number
  chapterPerS: Record<string, number>
  currencies: Record<string, number>
  openChapters: string[]
  /** Restzeit der Ruhezeit nach dem Tiefen Winter (kleiner = besser) */
  deepRestLeftMs: number
  /** Kreuzung: Restzeit (kleiner = besser), sonst 0 */
  crossingLeftMs: number
}

export function snapshot(s: GameState, now = NOW): Snapshot {
  const chapterPerS: Record<string, number> = {}
  const currencies: Record<string, number> = {
    ernte: s.ernte,
    ernteSeason: s.ernteSeason,
    erbstuecke: s.erbstuecke,
    samen: s.samen,
    sproesslinge: s.sproesslinge,
    vermaechtnis: s.vermaechtnis,
  }
  for (const id of openChapters(s)) {
    chapterPerS[id] = chapterPerSecond(s, id)
    currencies[`kapitel:${id}`] = s.chapters[id].cur
  }
  return {
    erntePerS: productionPerSecond(s, now),
    chapterPerS,
    currencies,
    openChapters: openChapters(s),
    // ab Runde 4 (Paket 3) zählt die verdiente Verkürzung mit; vorher gab es sie nicht (= 0)
    deepRestLeftMs: deepRestLeft(s.tieferWinterAt, now, (s as { ruhezeitVerkuerzung?: { ms: number } }).ruhezeitVerkuerzung?.ms ?? 0),
    crossingLeftMs: s.crossing ? Math.max(0, s.crossing.endsAt - now) : 0,
  }
}

export function allSnapshots(): Record<string, Snapshot> {
  return Object.fromEntries(Object.entries(fixtureStates()).map(([k, raw]) => [k, snapshot(parseSave(raw)!)]))
}
