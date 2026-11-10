/**
 * Sicherung außerhalb des Geräts (Runde 4, Paket 1.3).
 *
 * Das Gerät merkt sich (eigener localStorage-Schlüssel, nicht im GameState),
 * wann zuletzt Code oder Datei exportiert wurde und wie weit der Garten da war.
 * Omas Hinweis kommt höchstens einmal in 7 Tagen, wenn
 *  - der letzte Export (oder der erste Start mit dieser Version) länger als
 *    14 Tage her ist **und**
 *  - seitdem ein Tiefer Winter, eine Generation oder ein neues Kapitel dazukam,
 * nie in der ersten Sitzung und nie über einem offenen Fenster (GardenMap).
 */
import { openChapters, type GameState } from './state'

export const BACKUP_DEVICE_KEY = 'gartenerbe-sicherung-v1'
export const EXPORT_STALE_MS = 14 * 86_400_000
export const REMIND_EVERY_MS = 7 * 86_400_000

export interface Progress {
  tiefeWinter: number
  generation: number
  chapters: number
}

export interface DeviceBackupRecord {
  /** Erster Start mit automatischer Sicherung (zählt wie ein Export) */
  firstSeenAt: number
  lastExportAt: number
  lastReminderAt: number
  /** Fortschritt beim letzten Export bzw. beim ersten Start */
  progress: Progress
}

export function progressOf(s: GameState): Progress {
  return { tiefeWinter: s.tiefeWinter, generation: s.generation, chapters: openChapters(s).length }
}

function num(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : 0
}

export function loadRecord(): DeviceBackupRecord | null {
  try {
    const raw = localStorage.getItem(BACKUP_DEVICE_KEY)
    if (!raw) return null
    const r = JSON.parse(raw) as Record<string, unknown>
    const p = (typeof r.progress === 'object' && r.progress ? r.progress : {}) as Record<string, unknown>
    return {
      firstSeenAt: num(r.firstSeenAt),
      lastExportAt: num(r.lastExportAt),
      lastReminderAt: num(r.lastReminderAt),
      progress: { tiefeWinter: num(p.tiefeWinter), generation: num(p.generation), chapters: num(p.chapters) },
    }
  } catch {
    return null
  }
}

function store(r: DeviceBackupRecord): void {
  try {
    localStorage.setItem(BACKUP_DEVICE_KEY, JSON.stringify(r))
  } catch {
    /* ohne Speicher keine Erinnerung — das Spiel läuft weiter */
  }
}

/** Beim Start: Eintrag anlegen, falls es noch keinen gibt. */
export function ensureRecord(s: GameState, now = Date.now()): DeviceBackupRecord {
  const cur = loadRecord()
  if (cur) return cur
  const r: DeviceBackupRecord = { firstSeenAt: now, lastExportAt: 0, lastReminderAt: 0, progress: progressOf(s) }
  store(r)
  return r
}

/** Code kopiert oder Datei gespeichert/geteilt. */
export function markExported(s: GameState, now = Date.now()): void {
  const cur = loadRecord() ?? { firstSeenAt: now, lastExportAt: 0, lastReminderAt: 0, progress: progressOf(s) }
  store({ ...cur, lastExportAt: now, progress: progressOf(s) })
}

export function markReminded(now = Date.now()): void {
  const cur = loadRecord()
  if (cur) store({ ...cur, lastReminderAt: now })
}

/** Reine Regel (ohne erste Sitzung / offenes Fenster — das prüft die Anzeige). */
export function exportReminderDue(r: DeviceBackupRecord | null, s: GameState, now: number): boolean {
  if (!r) return false
  if (s.sessions < 2) return false
  const since = Math.max(r.lastExportAt, r.firstSeenAt)
  if (now - since <= EXPORT_STALE_MS) return false
  if (now < r.lastReminderAt) return false // Uhr zurückgestellt: lieber still
  if (now - r.lastReminderAt < REMIND_EVERY_MS) return false
  const p = progressOf(s)
  return p.tiefeWinter > r.progress.tiefeWinter || p.generation > r.progress.generation || p.chapters > r.progress.chapters
}
