/**
 * Runde 4, Regel 2: Kein Tester steht nach dem Update schlechter da.
 * Vergleicht jede Fixture direkt nach dem Laden mit den Werten des Codes vor
 * Runde 4 (src/test/noWorse/baseline.json, siehe noWorse/core.ts).
 */
import { describe, expect, it } from 'vitest'
import baseline from './noWorse/baseline.json'
import { allSnapshots, type Snapshot } from './noWorse/core'

const before = baseline as Record<string, Snapshot>
const after = allSnapshots()
/** Rundungsrauschen von Fließkomma-Produkten */
const EPS = 1e-9

function atLeast(now: number, was: number, what: string) {
  expect(now, what).toBeGreaterThanOrEqual(was * (1 - EPS))
}

describe('Kein Stand schlechter als vor Runde 4', () => {
  for (const [name, was] of Object.entries(before)) {
    describe(name, () => {
      const now = after[name]!
      it('Ernte/s gleich oder besser', () => atLeast(now.erntePerS, was.erntePerS, 'Ernte/s'))
      it('Ertrag je Kapitel gleich oder besser', () => {
        for (const [id, v] of Object.entries(was.chapterPerS)) atLeast(now.chapterPerS[id] ?? 0, v, id)
      })
      it('alle Währungen gleich oder besser', () => {
        for (const [id, v] of Object.entries(was.currencies)) atLeast(now.currencies[id] ?? 0, v, id)
      })
      it('alle offenen Kapitel bleiben offen', () => {
        for (const id of was.openChapters) expect(now.openChapters, id).toContain(id)
      })
      it('laufende Timer werden nicht länger', () => {
        expect(now.deepRestLeftMs).toBeLessThanOrEqual(was.deepRestLeftMs)
        expect(now.crossingLeftMs).toBeLessThanOrEqual(was.crossingLeftMs)
      })
    })
  }
})
