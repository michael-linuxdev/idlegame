/**
 * Spielstand-Migration: every fixture is a real save of one format version.
 * Rule (see CLAUDE.md): never drop progress — add a fixture for each new
 * SAVE_VERSION and keep the old ones loading.
 */
import { describe, expect, it } from 'vitest'
import v1 from './fixtures/save-v1.json'
import v2 from './fixtures/save-v2.json'
import { SAVE_VERSION, migrateSave, parseSave } from '../game/storage'
import { CHAPTERS } from '../game/chapters'

describe('Spielstand-Migration', () => {
  it('loads a v1 save (Streuobstwiese still in `orchard`, old field names)', () => {
    const s = parseSave(v1)!
    expect(s.ernte).toBe(123456)
    expect(s.owned.gemuesebeet).toBe(37)
    expect(s.prestiges).toBe(1)
    expect(s.samen).toBe(333)
    expect(s.generation).toBe(1)
    expect(s.legacy.familie).toBe(2)
    expect(s.chapters.obstwiese.cur).toBe(7777)
    expect(s.chapters.obstwiese.owned.apfel).toBe(42)
    expect(s.chapters.obstwiese.openedAt).toBeGreaterThan(0)
    expect(s.collection).toContain('physalis')
  })

  it('loads the current v2 save without losing anything', () => {
    const s = parseSave(v2)!
    expect(s.ernte).toBe(123456)
    expect(s.erbstuecke).toBe(v2.erbstuecke)
    expect(s.helperLevel).toBe(2)
    expect(s.ilseLevel).toBe(1)
    expect(s.festTokens).toBe(41.5)
    expect(s.milestoneRecord).toEqual({ 'g:gemuesebeet': 2 })
    expect(s.equippedCosmetic).toBe('festAdvent')
    expect(s.chapters.obstwiese.owned.birne).toBe(11)
    expect(s.playerXp).toBe(4321)
  })

  it('round-trips: parse → save → parse is stable', () => {
    const once = parseSave(v2)!
    const twice = parseSave(JSON.parse(JSON.stringify({ ...once, saveVersion: SAVE_VERSION })))!
    expect(twice).toEqual(once)
  })

  it('stamps the current version and knows every chapter', () => {
    expect(migrateSave(v1 as Record<string, unknown>).saveVersion).toBe(SAVE_VERSION)
    const s = parseSave(v2)!
    for (const c of CHAPTERS) expect(s.chapters[c.id]).toBeDefined()
  })
})
