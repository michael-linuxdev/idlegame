import { describe, expect, it } from 'vitest'
import {
  DAYS_BUDGET,
  RAW_KEEP_MS,
  addPlayTime,
  emptyLog,
  exportLines,
  importLegacyEvents,
  recordEvent,
  sessionShow,
  setSnapshot,
  type LogState,
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
    for (let i = 0; i < 25; i++) l = recordEvent(l, 'tab_open', { tab: i % 2 ? 'shop' : 'fortress' }, t + 3 * MIN + i)
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

  it('übernimmt das alte v1-Log und übersetzt alte Namen', () => {
    const legacy = [
      { t: T0, type: 'session_start', data: { app: 'gartenerbe' } },
      { t: T0 + 1000, type: 'upgrade', data: { id: 'dominionYield', kind: 'ember' } },
      { t: T0 + 2000, type: 'tab_open', data: { tab: 'fortress' } },
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
