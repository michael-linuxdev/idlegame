/**
 * Ruhezeit verkürzen (Runde 4, Paket 3): ein erledigter Tag der „Heute“-Karte
 * zählt für die laufende Ruhezeit nach dem Tiefen Winter (longLoop.creditRestDay).
 * Erledigt = Tägliche Gartenrunde abgeholt und alle Tagesziele des Tages abgeholt
 * — beides liegt im Spielstand; Wochenplan und Rezept zählen nicht mit
 * (Wochenplan liegt außerhalb des Spielstands, das Rezept ist erst später offen).
 */
import { creditRestDay, deepRestLeft, REST_CUT, restCutCap, restMsFor } from '../longLoop'
import { dayKey } from '../monetization'
import type { GameState } from './types'

export function dayDone(s: Pick<GameState, 'dailyClaimDay' | 'questDayKey' | 'quests'>, now: number): boolean {
  const day = dayKey(now)
  return s.dailyClaimDay === day && s.questDayKey === day && s.quests.length > 0 && s.quests.every((q) => q.claimed)
}

/** Nach dem Abholen: Ist der Tag gerade fertig geworden, zählt er (höchstens einmal). */
export function withRestCredit(prev: GameState, next: GameState, now: number): GameState {
  if (next === prev || dayDone(prev, now) || !dayDone(next, now)) return next
  const cut = creditRestDay(next.ruhezeitVerkuerzung, next.tieferWinterAt, dayKey(now), now, restMsFor(next))
  return cut === next.ruhezeitVerkuerzung ? next : { ...next, ruhezeitVerkuerzung: cut }
}

/** Für die Anzeige im Saison-Panel. */
export function restStatus(s: GameState, now: number) {
  const cut = s.ruhezeitVerkuerzung
  const restMs = restMsFor(s)
  const cap = restCutCap(restMs)
  const left = deepRestLeft(s.tieferWinterAt, now, cut.ms, restMs)
  const today = dayKey(now)
  const countedToday = cut.day === today
  const capLeft = Math.max(0, cap - cut.ms)
  return {
    leftMs: left,
    earnedMs: Math.min(cap, cut.ms),
    capMs: cap,
    /** Was heute noch geht (0, wenn heute schon gezählt, der Deckel erreicht oder die Ruhezeit vorbei ist) */
    todayMs: left > 0 && !countedToday ? Math.min(REST_CUT.dayMs, capLeft, left) : 0,
    countedToday,
    doneToday: dayDone(s, now),
  }
}
