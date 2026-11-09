/**
 * Erinnerungen — eine Stelle für alle Benachrichtigungen.
 *
 * Regeln (Bindungs-Runde, keine Benachrichtigungs-Flut):
 *  - höchstens 2 pro Kalendertag, mindestens 4 h Abstand
 *  - nie nachts (22–8 Uhr): fällt eine Erinnerung in die Nacht, kommt sie um 8 Uhr
 *  - nie bei kurzem App-Wechsel (frühestens 30 min nach dem Verlassen)
 *  - die Erlaubnis wird erst nach dem ersten Saisonende angeboten
 *
 * Heute: Web-Notification, solange die App im Hintergrund läuft. Die native
 * Store-Version kann `deliver` gegen lokale Benachrichtigungen tauschen.
 */
import { WATER_NOTIFY_AWAY_MS, WATER_NOTIFY_GAP_MS } from './extras'

export type ReminderKind = 'water' | 'cross' | 'basket'

export interface ReminderCandidate {
  kind: ReminderKind
  /** ms ab jetzt, ab wann der Anlass eintritt */
  inMs: number
}

export const REMINDERS_PER_DAY = 2
export const QUIET_FROM_HOUR = 22
export const QUIET_TO_HOUR = 8

function sameLocalDay(a: number, b: number): boolean {
  const x = new Date(a)
  const y = new Date(b)
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate()
}

/** Push a time out of the quiet hours (22–8) to the next 8:00. */
export function outOfQuietHours(t: number): number {
  const d = new Date(t)
  const h = d.getHours()
  if (h >= QUIET_TO_HOUR && h < QUIET_FROM_HOUR) return t
  const next = new Date(t)
  if (h >= QUIET_FROM_HOUR) next.setDate(next.getDate() + 1)
  next.setHours(QUIET_TO_HOUR, 0, 0, 0)
  return next.getTime()
}

/**
 * The next reminder to schedule (earliest allowed candidate), or null.
 * `sent` = timestamps of reminders already shown.
 */
export function planReminder(
  now: number,
  candidates: readonly ReminderCandidate[],
  sent: readonly number[],
): { kind: ReminderKind; delay: number } | null {
  const last = sent.length ? Math.max(...sent) : 0
  let best: { kind: ReminderKind; at: number } | null = null
  for (const c of candidates) {
    if (!(c.inMs >= 0) || !Number.isFinite(c.inMs)) continue
    let at = now + Math.max(c.inMs, WATER_NOTIFY_AWAY_MS)
    at = Math.max(at, last + WATER_NOTIFY_GAP_MS)
    at = outOfQuietHours(at)
    // Tag schon voll → nächster Morgen um 8 Uhr
    for (let i = 0; i < 3 && sent.filter((s) => sameLocalDay(s, at)).length >= REMINDERS_PER_DAY; i++) {
      const next = new Date(at)
      next.setDate(next.getDate() + 1)
      next.setHours(QUIET_TO_HOUR, 0, 0, 0)
      at = next.getTime()
    }
    if (!best || at < best.at) best = { kind: c.kind, at }
  }
  return best ? { kind: best.kind, delay: best.at - now } : null
}

/** Keep only the last few days of sent timestamps. */
export function pruneSent(sent: readonly number[], now: number): number[] {
  return sent.filter((s) => now - s < 3 * 86_400_000).slice(-10)
}

/** Show it (service worker first, plain Notification as fallback). */
export function deliver(title: string, body: string, tag: string): void {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
  const show = () => {
    try {
      new Notification(title, { body, tag })
    } catch {
      /* not allowed in this context */
    }
  }
  const sw = typeof navigator !== 'undefined' ? navigator.serviceWorker : undefined
  if (!sw) return show()
  sw.ready.then((reg) => reg.showNotification(title, { body, icon: './pwa-192.png', tag })).catch(show)
}
