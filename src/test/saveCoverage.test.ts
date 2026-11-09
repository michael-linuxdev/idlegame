/**
 * Jedes Feld im GameState muss Speichern → Laden überstehen. Neue Felder,
 * die im Parser vergessen werden, fallen hier sofort auf (CLAUDE.md).
 */
import { describe, expect, it } from 'vitest'
import { createInitialState, STORAGE_KEY, type GameState } from '../game/state'
import { isNewerSave, parseSave, SAVE_VERSION, serializeSave, unknownFields } from '../game/storage'
import { BUNDLE_VERSION, readCode } from '../game/backup'

const NOW = 1_800_000_000_000

/** Transiente Felder: werden absichtlich nicht gespeichert/geladen. */
const TRANSIENT = new Set<string>([
  'lastSurprise',
  'lastVariety',
  'helperReport',
  'lastChest',
  'saveVersion',
  // Restzeit bis zum nächsten Helfer-Kauf (Sekunden) — bewusst nicht gespeichert
  'helperCarryMs',
  'ilseCarryMs',
])

/** Felder, die beim Laden aus anderen Feldern abgeleitet/gedeckelt werden. */
const DERIVED = new Set<string>(['vereinMult'])

function bumped(v: unknown): unknown {
  if (typeof v === 'number') return v + 3
  if (typeof v === 'boolean') return !v
  return undefined
}

describe('Spielstand: jedes Feld übersteht Speichern und Laden', () => {
  const base = createInitialState(NOW)
  const keys = Object.keys(base) as (keyof GameState)[]

  it('kennt alle Felder (Zahl/Ja-Nein) des GameState', () => {
    const lost: string[] = []
    for (const k of keys) {
      if (TRANSIENT.has(k) || DERIVED.has(k)) continue
      const next = bumped(base[k])
      if (next === undefined) continue
      const raw = JSON.parse(serializeSave({ ...base, [k]: next } as GameState, {}))
      const back = parseSave(raw) as unknown as Record<string, unknown>
      if (back[k] !== next) lost.push(`${k}: ${String(next)} → ${String(back[k])}`)
    }
    expect(lost).toEqual([])
  })

  it('verliert keine Felder ganz', () => {
    const back = parseSave(JSON.parse(serializeSave(base, {})))!
    const missing = keys.filter((k) => !TRANSIENT.has(k) && !(k in back))
    expect(missing).toEqual([])
  })
})

describe('Spielstand aus neuerer Version', () => {
  it('erkennt neuere Stände', () => {
    expect(isNewerSave({ saveVersion: SAVE_VERSION + 1 })).toBe(true)
    expect(isNewerSave({ saveVersion: SAVE_VERSION })).toBe(false)
    expect(isNewerSave({})).toBe(false)
  })

  it('unbekannte Felder werden beim Speichern mitgeschrieben', () => {
    const base = createInitialState(NOW)
    const raw = { ...JSON.parse(serializeSave(base, {})), zukunftsFeld: { a: 1 }, nochEins: 7 }
    const extra = unknownFields(raw)
    expect(extra).toEqual({ zukunftsFeld: { a: 1 }, nochEins: 7 })
    const again = JSON.parse(serializeSave(parseSave(raw)!, extra))
    expect(again.zukunftsFeld).toEqual({ a: 1 })
    expect(again.nochEins).toBe(7)
    expect(again.saveVersion).toBe(SAVE_VERSION)
  })

  it('Sicherungscode aus neuerer Version wird nicht eingespielt', () => {
    const save = JSON.parse(serializeSave(createInitialState(NOW), {}))
    const bundle = (sv: number, inner: number) =>
      JSON.stringify({
        app: 'gartenerbe',
        v: BUNDLE_VERSION,
        at: NOW,
        saveVersion: sv,
        data: { [STORAGE_KEY]: JSON.stringify({ ...save, saveVersion: inner }) },
      })
    expect(readCode(bundle(SAVE_VERSION, SAVE_VERSION)).ok).toBe(true)
    expect(readCode(bundle(SAVE_VERSION + 1, SAVE_VERSION + 1))).toEqual({ ok: false, newer: true })
    // auch ohne Versionsangabe im Bündel (ältere Codes): Stand selbst zählt
    expect(readCode(bundle(0, SAVE_VERSION + 1))).toEqual({ ok: false, newer: true })
  })
})
