/**
 * Spielstand-Migration: every fixture is a real save of one format version.
 * Rule (see CLAUDE.md): never drop progress — add a fixture for each new
 * SAVE_VERSION and keep the old ones loading.
 *
 * save-v1.json: erster Stand des neuen Formats (2026-11-09, Aufräum-Runde),
 * erzeugt mit echten Spielfunktionen (20 Saisonenden, ein Tiefer Winter,
 * Markt, Deko, Bewohner, Kreuzen, Wetter, Gartenwoche …).
 */
import { isDeepStrictEqual } from 'node:util'
import { describe, expect, it } from 'vitest'
import v1 from './fixtures/save-v1.json'
import { SAVE_VERSION, migrateSave, parseSave } from '../game/storage'
import { createInitialState } from '../game/state'
import { CHAPTERS } from '../game/chapters'

/** Felder, die absichtlich nicht gespeichert werden (siehe saveCoverage.test.ts). */
const TRANSIENT = new Set(['lastSurprise', 'lastVariety', 'helperReport', 'lastChest', 'helperCarryMs', 'ilseCarryMs'])

/**
 * Felder, die nach v1 dazugekommen sind (kompatibel, ohne neue SAVE_VERSION):
 * fehlen im echten v1-Stand und bekommen beim Laden ihren Startwert.
 */
const ADDED_AFTER_V1: Record<string, unknown> = {
  // Ruhezeit nach dem Tiefen Winter (2026-11, docs/kapitel/balance-bericht.md)
  tieferWinterAt: 0,
}

describe('Spielstand v1 (neues Format ab 2026-11-09)', () => {
  it('enthält jedes Feld des GameState', () => {
    const missing = Object.keys(createInitialState(0)).filter((k) => !(k in v1) && !(k in ADDED_AFTER_V1))
    expect(missing).toEqual([])
    expect(v1.saveVersion).toBe(1)
  })

  it('lädt verlustfrei: jedes gespeicherte Feld kommt unverändert zurück', () => {
    const s = parseSave(v1)! as unknown as Record<string, unknown>
    const raw = v1 as unknown as Record<string, unknown>
    const changed = Object.keys(createInitialState(0))
      .filter((k) => !TRANSIENT.has(k) && !(k in ADDED_AFTER_V1))
      .filter((k) => !isDeepStrictEqual(s[k], raw[k]))
    expect(changed).toEqual([])
  })

  it('gibt später hinzugekommenen Feldern ihren Startwert', () => {
    const s = parseSave(v1)! as unknown as Record<string, unknown>
    for (const [k, v] of Object.entries(ADDED_AFTER_V1)) expect(s[k]).toEqual(v)
  })

  it('kennt die umbenannten Felder (Wörterbuch docs/cleanup/namen.md)', () => {
    const s = parseSave(v1)!
    expect(s.saisonenden).toBe(v1.saisonenden)
    expect(s.tiefeWinter).toBe(1)
    expect(s.truhe.gartenschere).toBe(v1.truhe.gartenschere)
    expect(s.truhe.gartenschere).toBeGreaterThan(0)
    expect(s.sproesslingLaden.tiefeWurzeln).toBe(v1.sproesslingLaden.tiefeWurzeln)
    expect(s.vereinMult).toBe(v1.vereinMult)
    expect(s.vereinBoostExpiresAt).toBeGreaterThan(0)
    expect(s.erntefestErnte).toBe(v1.erntefestErnte)
    expect(s.erntefestProgressKey.startsWith('ef-')).toBe(true)
    expect(s.gartenwocheXp).toBe(v1.gartenwocheXp)
    expect(s.gartenwochePremium).toBe(true)
    expect(s.gartenwocheClaimedFree).toEqual(v1.gartenwocheClaimedFree)
    expect(s.ownedOfferIds).toEqual(v1.ownedOfferIds)
    expect(s.saisonendeSpikeFlags).toBe(v1.saisonendeSpikeFlags)
  })

  it('round-trips: parse → save → parse is stable', () => {
    const once = parseSave(v1)!
    const twice = parseSave(JSON.parse(JSON.stringify({ ...once, saveVersion: SAVE_VERSION })))!
    expect(twice).toEqual(once)
  })

  it('stamps the current version and knows every chapter', () => {
    expect(migrateSave(v1 as Record<string, unknown>).saveVersion).toBe(SAVE_VERSION)
    const s = parseSave(v1)!
    for (const c of CHAPTERS) expect(s.chapters[c.id]).toBeDefined()
  })
})
