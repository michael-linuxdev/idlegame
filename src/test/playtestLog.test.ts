import { describe, expect, it } from 'vitest'
import {
  ARCHIVE_BUDGET,
  ARCHIVE_KEEP_MS,
  DAYS_BUDGET,
  RAW_KEEP_MS,
  RAW_MAX,
  SPILL_MAX,
  chunksToPrune,
  spillOld,
  addPlayTime,
  emptyLog,
  exportLines,
  importLegacyEvents,
  recordEvent,
  sessionShow,
  setSnapshot,
  type LogState,
  type PlaytestEvent,
} from '../game/playtestCore'
import { canShareFile, prefersShare } from '../game/saveFile'

const T0 = new Date(2026, 10, 8, 9, 0, 0).getTime()
const MIN = 60_000
const H = 60 * MIN

/** One busy play day: 3 sessions, lots of buying, a few rarer events. */
function playDay(log: LogState, dayStart: number): LogState {
  let l = log
  for (const startH of [8, 13, 20]) {
    const t = dayStart + startH * H
    l = sessionShow(l, t, 'test').log
    for (let i = 0; i < 400; i++) {
      l = recordEvent(l, 'upgrade', { id: `bereich${i % 10}`, level: i, kind: 'module' }, t + i * 300)
      if (i % 4 === 0) l = recordEvent(l, 'surprise', { kind: 'milestone', amount: 123456789 }, t + i * 300 + 1)
    }
    for (let i = 0; i < 25; i++) l = recordEvent(l, 'tab_open', { tab: i % 2 ? 'shop' : 'garten' }, t + 3 * MIN + i)
    l = recordEvent(l, 'prestige', { run: 3, erbstuecke: 500 }, t + 10 * MIN)
    l = setSnapshot(l, { saisons: 3, stufe: 20, erntePerS: 123456 }, t + 15 * MIN)
    l = addPlayTime(l, t, t + 20 * MIN, 'test')
  }
  return l
}

describe('Playtest-Log über Monate', () => {
  it('bleibt nach 180 Spieltagen unter dem Budget und behält jeden Tag', () => {
    let log = emptyLog()
    for (let d = 0; d < 180; d++) log = playDay(log, T0 - 9 * H + d * 24 * H)
    const daysSize = JSON.stringify(log.days).length
    expect(log.days.length).toBe(179)
    expect(log.today).not.toBeNull()
    expect(daysSize).toBeLessThan(DAYS_BUDGET)
    // ~2 KB pro Tag Ziel
    expect(daysSize / log.days.length).toBeLessThan(2048)
    // Roh-Rest nur der letzten 48 h
    const newest = log.raw[log.raw.length - 1].t
    expect(log.raw.every((e) => e.t >= newest - RAW_KEEP_MS)).toBe(true)
    expect(JSON.stringify(log.raw).length).toBeLessThan(500_000)

    const day = log.days[100]
    expect(day.sessions).toBe(3)
    expect(day.playMs).toBe(60 * MIN)
    expect(day.counts.upgrade).toBe(1200)
    expect(day.counts.prestige).toBe(3)
    expect(day.counts.erbstueckeGained).toBe(1500)
    expect(day.snap?.saisons).toBe(3)

    const text = exportLines(log, newest, 'test')
    const lines = text.trim().split('\n').map((l) => JSON.parse(l))
    expect(lines[0]).toMatchObject({ kind: 'header', schema: 2, days: 180 })
    expect(lines.filter((l) => l.kind === 'day')).toHaveLength(180)
    expect(lines).toHaveLength(1 + 180 + log.raw.length)
  })

  it('zählt häufige Ereignisse je Minute statt einzeln', () => {
    let log = emptyLog()
    for (let i = 0; i < 100; i++) log = recordEvent(log, 'upgrade', { id: 'kompost' }, T0 + i * 150)
    log = recordEvent(log, 'schub', undefined, T0 + 20_000)
    expect(log.raw).toHaveLength(1)
    expect(log.raw[0]).toMatchObject({ type: 'minute', data: { upgrade: 100, schub: 1 } })
    expect(log.today?.counts['upgrade:kompost']).toBe(100)
  })

  it('Neuladen und kurze Pausen sind keine neue Sitzung', () => {
    let log = emptyLog()
    let r = sessionShow(log, T0)
    expect(r.isNew).toBe(true)
    log = addPlayTime(r.log, T0, T0 + 5 * MIN)
    r = sessionShow(log, T0 + 5 * MIN + 2_000) // Neuladen
    expect(r.isNew).toBe(false)
    log = addPlayTime(r.log, T0 + 5 * MIN, T0 + 10 * MIN)
    r = sessionShow(log, T0 + 25 * MIN) // 15 min Pause
    expect(r.isNew).toBe(false)
    r = sessionShow(r.log, T0 + 2 * H) // echte Pause
    expect(r.isNew).toBe(true)
    expect(r.log.today?.sessions).toBe(2)
  })

  it('schreibt die App-Version in session_start', () => {
    const r = sessionShow(emptyLog(), T0, '2026-11-11 · abc1234', { path: '/' })
    const ev = r.log.raw.find((e) => e.type === 'session_start')
    expect(ev?.data).toMatchObject({ path: '/', version: '2026-11-11 · abc1234' })
  })

  it('übernimmt das alte v1-Log und übersetzt alte Namen', () => {
    const legacy = [
      { t: T0, type: 'session_start', data: { app: 'gartenerbe' } },
      // altname-ok: Einträge aus einem alten Log werden übersetzt
      { t: T0 + 1000, type: 'upgrade', data: { id: 'dominionYield', kind: 'ember' } },
      { t: T0 + 2000, type: 'tab_open', data: { tab: 'fortress' } }, // altname-ok
      { t: T0 + 3000, type: 'session_end' },
      { t: T0 + 4000, type: 'session_start' },
      { nonsense: true },
    ]
    const log = importLegacyEvents(emptyLog(), legacy)
    expect(log.today?.sessions).toBe(1)
    expect(log.today?.counts['upgrade:gartenschere']).toBe(1)
    expect(log.today?.counts['tab_open:garten']).toBe(1)
    const tab = log.raw.find((e) => e.type === 'tab_open')
    expect(tab?.data?.tab).toBe('garten')
  })

  it('Tageswechsel schließt den Vortag ab', () => {
    let log = recordEvent(emptyLog(), 'menu_open', undefined, T0)
    log = recordEvent(log, 'menu_open', undefined, T0 + 24 * H)
    expect(log.days).toHaveLength(1)
    expect(log.days[0].counts.menu_open).toBe(1)
    expect(log.today?.counts.menu_open).toBe(1)
  })
})

describe('Datei speichern (iOS)', () => {
  it('nutzt das Teilen-Menü nur auf iPhone/iPad', () => {
    expect(prefersShare('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')).toBe(true)
    expect(prefersShare('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 5)).toBe(true)
    expect(prefersShare('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 0)).toBe(false)
    expect(prefersShare('Mozilla/5.0 (Linux; Android 15)')).toBe(false)
  })

  it('prüft, ob der Browser Dateien teilen kann', () => {
    const file = new File(['x'], 'a.txt', { type: 'text/plain' })
    expect(canShareFile(undefined, file)).toBe(false)
    expect(canShareFile({ share: async () => undefined }, file)).toBe(false)
    expect(canShareFile({ share: async () => undefined, canShare: () => true }, file)).toBe(true)
    expect(
      canShareFile(
        {
          share: async () => undefined,
          canShare: () => {
            throw new Error('nope')
          },
        },
        file,
      ),
    ).toBe(false)
  })
})

describe('Langzeit-Archiv der Roh-Ereignisse', () => {
  it('verliert über 90 Tage kein Roh-Ereignis (spill → Archiv)', () => {
    let log = emptyLog()
    const archived: PlaytestEvent[] = []
    let written = 0
    for (let d = 0; d < 90; d++) {
      for (let i = 0; i < 40; i++) {
        const t = T0 + d * 24 * H + i * 5 * MIN
        log = recordEvent(spillOld(log, t), 'tab_open', { tab: 'garten' }, t)
        written++
        // wie playtestLog.ts: ab und zu ins Archiv
        if (log.spill.length >= 500) {
          archived.push(...log.spill)
          log = { ...log, spill: [] }
        }
      }
    }
    expect(archived.length + log.spill.length + log.raw.length).toBe(written)
    const all = [...archived, ...log.spill, ...log.raw]
    expect(all.every((e, i) => i === 0 || e.t >= all[i - 1].t)).toBe(true)

    const lines = exportLines(log, T0 + 91 * 24 * H, 'test', archived).trim().split('\n')
    const header = JSON.parse(lines[0])
    expect(header.raw).toBe(written)
    expect(header.archived).toBe(archived.length)
    expect(header.rawFrom).toBe(T0)
  })

  it('spillOld hält RAW_MAX ein und begrenzt spill ohne Archiv', () => {
    let log = emptyLog()
    for (let i = 0; i < RAW_MAX + SPILL_MAX + 100; i++) {
      const t = T0 + i * 1000
      log = recordEvent(spillOld(log, t), 'tab_open', { tab: 'markt' }, t)
    }
    expect(log.raw.length).toBe(RAW_MAX)
    expect(log.spill.length).toBe(SPILL_MAX)
    expect(log.spill[log.spill.length - 1].t).toBeLessThan(log.raw[0].t)
  })

  it('räumt nur zu alte oder zu viele Blöcke ab, älteste zuerst', () => {
    const now = T0 + 500 * 24 * H
    const old = { id: 1, to: now - ARCHIVE_KEEP_MS - 1, size: 1000 }
    const fresh = { id: 2, to: now - H, size: 1000 }
    expect(chunksToPrune([fresh, old], now)).toEqual([1])
    expect(chunksToPrune([fresh], now)).toEqual([])
    const big = [1, 2, 3].map((id) => ({ id, to: now, size: ARCHIVE_BUDGET / 2 }))
    expect(chunksToPrune(big, now)).toEqual([1])
  })
})
