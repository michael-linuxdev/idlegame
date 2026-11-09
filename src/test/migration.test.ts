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
import { CHAPTERS, emptyChapter } from '../game/chapters'

/** Felder, die absichtlich nicht gespeichert werden (siehe saveCoverage.test.ts). */
const TRANSIENT = new Set(['lastSurprise', 'lastVariety', 'helperReport', 'lastChest', 'helperCarryMs', 'ilseCarryMs'])

/**
 * Felder, die nach v1 dazugekommen sind (kompatibel, ohne neue SAVE_VERSION):
 * fehlen im echten v1-Stand und bekommen beim Laden ihren Startwert.
 */
const ADDED_AFTER_V1: Record<string, unknown> = {
  // Ruhezeit nach dem Tiefen Winter (2026-11, docs/kapitel/balance-bericht.md)
  tieferWinterAt: 0,
  // Abschluss-Szene Kapitel 50 (Welle 8): alte Stände haben sie noch nicht gesehen
  abschlussSeen: false,
}

/** Nur die Kapitel, die im alten Stand schon gespeichert waren (neue füllt parseChapters auf). */
function savedChapters(loaded: unknown, raw: unknown): unknown {
  const l = loaded as Record<string, unknown>
  return Object.fromEntries(Object.keys(raw as object).map((id) => [id, l[id]]))
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
      .filter((k) => !isDeepStrictEqual(k === 'chapters' ? savedChapters(s[k], raw[k]) : s[k], raw[k]))
    expect(changed).toEqual([])
  })

  it('neue Kapitel kommen leer dazu, gespeicherte bleiben unverändert', () => {
    const s = parseSave(v1)!
    const saved = Object.keys(v1.chapters)
    for (const c of CHAPTERS) {
      if (saved.includes(c.id)) continue
      expect(s.chapters[c.id], c.id).toEqual(emptyChapter(c))
    }
  })

  it('neue Großprojekte (Gartenroute, Welle 2) starten bei 0, alte Bauabschnitte bleiben', () => {
    const raw = { ...(v1 as unknown as Record<string, unknown>), projects: { pavillon: 3, brunnen: 1, rosengarten: 2 } }
    const s = parseSave(raw)!
    expect(s.projects).toEqual({ pavillon: 3, brunnen: 1, rosengarten: 2 })
    expect(s.projects.gartenroute ?? 0).toBe(0)
    expect(parseSave(v1)!.projects).toEqual({})
  })

  it('Großprojekt Tauschpost (Welle 3) startet bei 0, alte Bauabschnitte und Kapitel bleiben', () => {
    const raw = { ...(v1 as unknown as Record<string, unknown>), projects: { rosengarten: 3, gartenroute: 2 } }
    const s = parseSave(raw)!
    expect(s.projects).toEqual({ rosengarten: 3, gartenroute: 2 })
    expect(s.projects.tauschpost ?? 0).toBe(0)
    const before = parseSave(v1)!
    for (const id of ['patio', 'korkeichen', 'paprikafelder', 'aranfelder', 'rosental', 'pistazien'] as const) {
      expect(before.chapters[id], id).toEqual(emptyChapter(CHAPTERS.find((c) => c.id === id)!))
    }
  })

  it('Großprojekt Herkunftsbeet (Welle 5) startet bei 0, alte Bauabschnitte und Kapitel bleiben', () => {
    const raw = { ...(v1 as unknown as Record<string, unknown>), projects: { rosengarten: 3, gartenroute: 2, tauschpost: 1 } }
    const s = parseSave(raw)!
    expect(s.projects).toEqual({ rosengarten: 3, gartenroute: 2, tauschpost: 1 })
    expect(s.projects.herkunftsbeet ?? 0).toBe(0)
    const before = parseSave(v1)!
    for (const id of ['oase', 'kakaogarten', 'buschgarten', 'farngarten', 'kimchigarten'] as const) {
      expect(before.chapters[id], id).toEqual(emptyChapter(CHAPTERS.find((c) => c.id === id)!))
    }
    for (const id of Object.keys(v1.chapters)) expect(before.chapters[id as keyof typeof before.chapters], id).toBeDefined()
  })

  it('Kapitel 40–44 (Welle 6) kommen leer dazu, ein Stand mit Kapitel 39 lädt verlustfrei', () => {
    const before = parseSave(v1)!
    for (const id of ['dachgarten', 'schulgarten', 'waldgarten', 'samenbank', 'klimagarten'] as const) {
      expect(before.chapters[id], id).toEqual(emptyChapter(CHAPTERS.find((c) => c.id === id)!))
    }
    // Stand nach Welle 5: Kimchi-Garten angelegt und gepflegt
    const kimchi = { ...emptyChapter(CHAPTERS.find((c) => c.id === 'kimchigarten')!), cur: 1234, curLifetime: 5678, openedAt: 42, introSeen: true }
    kimchi.owned = { ...kimchi.owned, kohlreihen: 12, rettichbeet: 3 }
    const raw = { ...(v1 as unknown as Record<string, unknown>), chapters: { ...v1.chapters, kimchigarten: kimchi } }
    const s = parseSave(raw)!
    expect(s.chapters.kimchigarten).toEqual(kimchi)
    expect(s.chapters.dachgarten).toEqual(emptyChapter(CHAPTERS.find((c) => c.id === 'dachgarten')!))
    for (const id of Object.keys(v1.chapters)) expect(s.chapters[id as keyof typeof s.chapters], id).toEqual(before.chapters[id as keyof typeof before.chapters])
  })

  it('Kapitel 45–49 und Großprojekt „Garten für morgen“ (Welle 7) kommen leer dazu, alte Stände laden verlustfrei', () => {
    const before = parseSave(v1)!
    for (const id of ['wildblumenband', 'fassadengarten', 'solawihof', 'saatguttausch', 'weltgartenschau'] as const) {
      expect(before.chapters[id], id).toEqual(emptyChapter(CHAPTERS.find((c) => c.id === id)!))
    }
    // Stand nach Welle 6: Klimagarten angelegt und gepflegt, drei Großprojekte im Bau
    const klima = { ...emptyChapter(CHAPTERS.find((c) => c.id === 'klimagarten')!), cur: 4321, curLifetime: 8765, openedAt: 77, introSeen: true }
    klima.owned = { ...klima.owned, trockenbeet: 9, schwammflaeche: 4, klimatag: 1 }
    const raw = { ...(v1 as unknown as Record<string, unknown>), chapters: { ...v1.chapters, klimagarten: klima }, projects: { rosengarten: 3, tauschpost: 2, herkunftsbeet: 1 } }
    const s = parseSave(raw)!
    expect(s.chapters.klimagarten).toEqual(klima)
    expect(s.projects).toEqual({ rosengarten: 3, tauschpost: 2, herkunftsbeet: 1 })
    expect(s.projects.morgengarten ?? 0).toBe(0)
    expect(s.chapters.weltgartenschau).toEqual(emptyChapter(CHAPTERS.find((c) => c.id === 'weltgartenschau')!))
    for (const id of Object.keys(v1.chapters)) expect(s.chapters[id as keyof typeof s.chapters], id).toEqual(before.chapters[id as keyof typeof before.chapters])
  })

  it('Kapitel 50 und die Abschluss-Szene (Welle 8) kommen leer dazu, alte Stände laden verlustfrei', () => {
    const before = parseSave(v1)!
    expect(before.chapters.omasgarten).toEqual(emptyChapter(CHAPTERS.find((c) => c.id === 'omasgarten')!))
    expect(before.abschlussSeen).toBe(false)
    // Stand nach Welle 7: Weltgartenschau ganz angelegt und gepflegt, Großprojekt im Bau
    const welt = { ...emptyChapter(CHAPTERS.find((c) => c.id === 'weltgartenschau')!), cur: 99, curLifetime: 12345, openedAt: 88, introSeen: true }
    welt.owned = { ...welt.owned, europabeete: 30, weltbeete: 12, eroeffnung: 2 }
    welt.care = { europabeete: { grow: 3, thrift: 1 } }
    const raw = { ...(v1 as unknown as Record<string, unknown>), chapters: { ...v1.chapters, weltgartenschau: welt }, projects: { morgengarten: 2 } }
    const s = parseSave(raw)!
    expect(s.chapters.weltgartenschau).toEqual(welt)
    expect(s.projects).toEqual({ morgengarten: 2 })
    expect(s.chapters.omasgarten).toEqual(emptyChapter(CHAPTERS.find((c) => c.id === 'omasgarten')!))
    expect(s.abschlussSeen).toBe(false)
    // „Gesehen“ bleibt gespeichert; kaputte Werte zählen als nicht gesehen
    expect(parseSave({ ...raw, abschlussSeen: true })!.abschlussSeen).toBe(true)
    expect(parseSave({ ...raw, abschlussSeen: 'ja' })!.abschlussSeen).toBe(false)
    for (const id of Object.keys(v1.chapters)) expect(s.chapters[id as keyof typeof s.chapters], id).toEqual(before.chapters[id as keyof typeof before.chapters])
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
