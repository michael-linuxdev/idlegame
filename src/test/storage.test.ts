import { describe, expect, it } from 'vitest'
import { parseSave } from '../game/storage'

describe('save parsing', () => {
  it('rejects garbage', () => {
    expect(parseSave('nope')).toBeNull()
  })
  it('liest keine Felder aus dem alten Format (Neustart 2026-11-09)', () => {
    const s = parseSave({ ash: 123, embers: 7, obsidian: 42, emberUpgrades: { dominionYield: 3 } })!
    expect(s.ernte).not.toBe(123)
    expect(s.erbstuecke).toBe(0)
    expect(s.truhe.gartenschere).toBe(0)
  })
})

import { BUNDLE_VERSION, exportCode, readCode } from '../game/backup'
import { createInitialState, STORAGE_KEY } from '../game/state'

describe('Spielstand sichern', () => {
  it('round-trips a save through the export code', () => {
    const store = new Map<string, string>()
    const ls = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    }
    ;(globalThis as unknown as { localStorage: typeof ls }).localStorage = ls
    const s = { ...createInitialState(0), samen: 99 }
    ls.setItem(STORAGE_KEY, JSON.stringify(s))
    const code = exportCode(0)
    expect(code.startsWith('GARTENERBE1:')).toBe(true)
    const r = readCode(code)
    expect(r.ok).toBe(true)
    if (r.ok) expect(JSON.parse(r.bundle.data[STORAGE_KEY]!).samen).toBe(99)
    expect(readCode('GARTENERBE1:kaputt').ok).toBe(false)
  })

  it('lehnt Codes aus der Vorversion verständlich ab', () => {
    const old = { app: 'gartenerbe', v: 1, at: 0, data: { 'gartenerbe-save-v1': JSON.stringify({ ash: 5, saveVersion: 2 }) } }
    const code = 'GARTENERBE1:' + btoa(JSON.stringify(old))
    expect(readCode(code)).toEqual({ ok: false, old: true })
    expect(readCode(JSON.stringify({ ...old, v: BUNDLE_VERSION + 1 }))).toEqual({ ok: false, newer: true })
  })
})
