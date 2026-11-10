/**
 * Runde 4, Paket 3: Erledigte Tage der „Heute“-Karte verkürzen die laufende
 * Ruhezeit nach dem Tiefen Winter — je Tag REST_CUT.dayMs, zusammen höchstens
 * 12 h (nie unter 2,5 Tage).
 */
import { describe, expect, it } from 'vitest'
import v1 from './fixtures/save-v1.json'
import { DEEP_REST_MS, EMPTY_REST_CUT, REST_CUT, canDeepNow, creditRestDay, deepRestLeft } from '../game/longLoop'
import { dayKey } from '../game/monetization'
import { parseSave } from '../game/storage'
import { claimDailyOps, claimQuestReward, createInitialState, doDeepReset, type GameState } from '../game/state'
import { dayDone, restStatus } from '../game/state/rest'

const DAY = 86_400_000
const H = 3600_000
const T0 = new Date(2026, 10, 10, 9, 0).getTime()

/** Gartenrunde abholen, alle Tagesziele fertig machen und abholen. */
function finishDay(s: GameState, now: number): GameState {
  s = claimDailyOps(s, now)
  s = { ...s, quests: s.quests.map((q) => ({ ...q, progress: q.target })) }
  for (const q of s.quests) s = claimQuestReward(s, q.id, now)
  return s
}

function resting(at = T0): GameState {
  return { ...createInitialState(at), tiefeWinter: 3, saisonenden: 20, tieferWinterAt: at }
}

describe('Regel', () => {
  it('Deckel: höchstens 12 h, nie unter 2,5 Tage', () => {
    expect(REST_CUT.capMs).toBeLessThanOrEqual(12 * H)
    let cut = { ...EMPTY_REST_CUT }
    for (let d = 0; d < 10; d++) cut = creditRestDay(cut, T0, dayKey(T0 + d * DAY), T0 + d * DAY + 1000)
    expect(cut.ms).toBe(REST_CUT.capMs)
    expect(deepRestLeft(T0, T0, 99 * H)).toBe(DEEP_REST_MS - REST_CUT.capMs)
    expect(DEEP_REST_MS - REST_CUT.capMs).toBeGreaterThanOrEqual(2.5 * DAY)
  })

  it('je Tag nur einmal, nur während die Ruhezeit läuft', () => {
    const day = dayKey(T0)
    const once = creditRestDay(EMPTY_REST_CUT, T0, day, T0 + 1000)
    expect(once.ms).toBe(REST_CUT.dayMs)
    expect(creditRestDay(once, T0, day, T0 + 2000)).toBe(once)
    // Ruhezeit vorbei: nichts mehr
    expect(creditRestDay(EMPTY_REST_CUT, T0, dayKey(T0 + 4 * DAY), T0 + 4 * DAY)).toEqual(EMPTY_REST_CUT)
    // kein Tiefer Winter seit dem Update: nichts
    expect(creditRestDay(EMPTY_REST_CUT, 0, day, T0)).toEqual(EMPTY_REST_CUT)
  })

  it('Uhr zurückgestellt gibt keinen Vorteil', () => {
    const today = creditRestDay(EMPTY_REST_CUT, T0, dayKey(T0 + DAY), T0 + DAY)
    // „gestern“ nach dem Zurückstellen zählt nicht
    expect(creditRestDay(today, T0, dayKey(T0), T0 + 1000)).toBe(today)
    // vor dem Tiefen Winter zählt nichts
    expect(creditRestDay(EMPTY_REST_CUT, T0, dayKey(T0 - DAY), T0 - DAY)).toEqual(EMPTY_REST_CUT)
    // im Spiel: Tag erledigt, Uhr einen Tag zurück, wieder erledigt → keine zweite Verkürzung
    let s = finishDay(resting(), T0 + DAY + 1000)
    const earned = s.ruhezeitVerkuerzung.ms
    s = finishDay(s, T0 + 1000)
    expect(s.ruhezeitVerkuerzung.ms).toBe(earned)
  })
})

describe('im Spiel', () => {
  it('ein erledigter Tag verkürzt die laufende Ruhezeit, ein halber nicht', () => {
    const now = T0 + 2 * H
    let s = claimDailyOps(resting(), now)
    expect(dayDone(s, now)).toBe(false)
    expect(s.ruhezeitVerkuerzung.ms).toBe(0)
    s = finishDay(s, now)
    expect(dayDone(s, now)).toBe(true)
    expect(s.ruhezeitVerkuerzung).toEqual({ ms: REST_CUT.dayMs, day: dayKey(now) })
    expect(deepRestLeft(s.tieferWinterAt, now, s.ruhezeitVerkuerzung.ms)).toBe(DEEP_REST_MS - REST_CUT.dayMs - 2 * H)
    const st = restStatus(s, now)
    expect(st.countedToday).toBe(true)
    expect(st.todayMs).toBe(0)
  })

  it('der Tiefe Winter wird früher möglich und setzt die Verkürzung zurück', () => {
    let s = resting()
    for (let d = 0; d < 3; d++) s = finishDay(s, T0 + d * DAY + 3 * H)
    expect(s.ruhezeitVerkuerzung.ms).toBe(Math.min(REST_CUT.capMs, 3 * REST_CUT.dayMs))
    const early = T0 + DEEP_REST_MS - s.ruhezeitVerkuerzung.ms + 1000
    expect(canDeepNow(s.saisonenden, s.tieferWinterAt, early, s.ruhezeitVerkuerzung.ms)).toBe(true)
    expect(canDeepNow(s.saisonenden, s.tieferWinterAt, early)).toBe(false)
    const after = doDeepReset(s, early)
    expect(after.tiefeWinter).toBe(s.tiefeWinter + 1)
    expect(after.ruhezeitVerkuerzung).toEqual({ ms: 0, day: '' })
    expect(after.tieferWinterAt).toBe(early)
  })

  it('Saisonenden ändern die Verkürzung nicht (nur der Tiefe Winter)', async () => {
    const { doPrestige } = await import('../game/state')
    const s = { ...finishDay(resting(), T0 + H), ernteSeason: 1e60, saisonenden: 3 }
    expect(doPrestige(s).ruhezeitVerkuerzung).toEqual(s.ruhezeitVerkuerzung)
  })
})

describe('alte Stände', () => {
  it('eine schon laufende Ruhezeit wird nie länger', () => {
    const at = T0 - DAY
    const raw = { ...(v1 as Record<string, unknown>), tieferWinterAt: at }
    const s = parseSave(raw)!
    expect(s.ruhezeitVerkuerzung).toEqual({ ms: 0, day: '' })
    expect(deepRestLeft(s.tieferWinterAt, T0, s.ruhezeitVerkuerzung.ms)).toBe(deepRestLeft(at, T0))
  })

  it('kaputte oder zu große Werte: Startwert bzw. Deckel', () => {
    const base = v1 as Record<string, unknown>
    expect(parseSave({ ...base, ruhezeitVerkuerzung: 'x' })!.ruhezeitVerkuerzung).toEqual({ ms: 0, day: '' })
    expect(parseSave({ ...base, ruhezeitVerkuerzung: { ms: 1e12, day: '2026-11-10' } })!.ruhezeitVerkuerzung).toEqual({ ms: REST_CUT.capMs, day: '2026-11-10' })
    expect(parseSave({ ...base, ruhezeitVerkuerzung: { ms: -5, day: 'morgen' } })!.ruhezeitVerkuerzung).toEqual({ ms: 0, day: '' })
  })
})
