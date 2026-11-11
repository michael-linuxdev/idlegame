/**
 * Opt-in Playtest-Log — nur lokal, standardmäßig aus, kein Versand.
 *
 * Läuft über Monate (siehe playtestCore.ts): Tages-Zusammenfassungen bleiben,
 * häufige Ereignisse nur gezählt (je Minute). Roh-Ereignisse: die letzten
 * 48 h im localStorage, ältere wandern ins Langzeit-Archiv (IndexedDB,
 * playtestArchive.ts, ~400 Tage / ~60 MB).
 * Speicher: localStorage in zwei Schlüsseln (abgeschlossene Tage selten,
 * laufender Tag + Roh-Rest alle 12 s), Budget ~1,5 MB + ~0,5 MB. Wird der
 * Platz für den Spielstand knapp, gibt `freePlaytestSpace` zuerst den
 * Roh-Rest frei (Spielstand geht immer vor).
 */
import { APP_VERSION } from './appUpdate'
import { playtestArchive } from './playtestArchive'
import {
  SPILL_BATCH,
  addPlayTime,
  emptyLog,
  eventCount,
  exportLines,
  importLegacyEvents,
  parseDay,
  parseEvent,
  recordEvent,
  sessionShow,
  setSnapshot,
  spillOld,
  type DaySummary,
  type LogState,
  type PlaytestEvent,
  type PlaytestEventType,
  type PlaytestPayload,
} from './playtestCore'
import { copyText, fileStamp, saveFile, type SaveResult } from './saveFile'

export type { PlaytestEvent, PlaytestEventType, PlaytestPayload } from './playtestCore'

const OPT_IN_KEY = 'gartenerbe-playtest-log-on'
const LEGACY_KEY = 'gartenerbe-playtest-log-v1'
const DAYS_KEY = 'gartenerbe-playtest-days-v2'
const LIVE_KEY = 'gartenerbe-playtest-live-v2'
const FLUSH_MS = 12_000

let enabledCache: boolean | null = null
let log: LogState = emptyLog()
let loaded = false
let daysWritten = -1
let dirty = false
let flushTimer: number | null = null
let booted = false
let visibleSince = 0
let snapshotFn: (() => Record<string, number | string>) | null = null

const archive = playtestArchive()
let archiving = false
/** Archiv im Speicher, sobald das Menü es vorgeladen hat (Export ohne Warten → Teilen-Menü am iPhone) */
let archiveCache: PlaytestEvent[] | null = null

function readOptIn(): boolean {
  if (enabledCache != null) return enabledCache
  try {
    enabledCache = localStorage.getItem(OPT_IN_KEY) === '1'
  } catch {
    enabledCache = false
  }
  return enabledCache
}

function writeOptIn(on: boolean): void {
  enabledCache = on
  try {
    localStorage.setItem(OPT_IN_KEY, on ? '1' : '0')
  } catch {
    /* quota / private mode */
  }
}

function loadLog(): LogState {
  let next = emptyLog()
  try {
    const daysRaw = localStorage.getItem(DAYS_KEY)
    if (daysRaw) {
      const parsed: unknown = JSON.parse(daysRaw)
      if (Array.isArray(parsed)) next.days = parsed.map(parseDay).filter((d): d is DaySummary => d !== null)
    }
    const liveRaw = localStorage.getItem(LIVE_KEY)
    if (liveRaw) {
      const live: unknown = JSON.parse(liveRaw)
      if (live && typeof live === 'object') {
        const l = live as Record<string, unknown>
        next.today = parseDay(l.today)
        next.raw = Array.isArray(l.raw) ? l.raw.map(parseEvent).filter((e) => e !== null) : []
        next.spill = Array.isArray(l.spill) ? l.spill.map(parseEvent).filter((e) => e !== null) : []
        next.lastActive = typeof l.lastActive === 'number' ? l.lastActive : 0
      }
    }
    daysWritten = next.days.length
    // Altes Log (v1) einmalig übernehmen
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      next = importLegacyEvents(next, JSON.parse(legacy))
      dirty = true
      persistNow(next)
      localStorage.removeItem(LEGACY_KEY)
    }
  } catch {
    /* kaputter Log-Speicher: neu anfangen, Spielstand ist davon unberührt */
  }
  return next
}

function ensureLoaded(): void {
  if (loaded) return
  loaded = true
  log = loadLog()
}

function persistNow(state: LogState = log): void {
  if (!dirty) return
  dirty = false
  try {
    if (state.days.length !== daysWritten) {
      localStorage.setItem(DAYS_KEY, JSON.stringify(state.days))
      daysWritten = state.days.length
    }
    localStorage.setItem(LIVE_KEY, JSON.stringify({ today: state.today, raw: state.raw, spill: state.spill, lastActive: state.lastActive }))
  } catch {
    // Platz knapp: Roh-Rest halbieren, Tage bleiben
    try {
      log = { ...state, raw: state.raw.slice(Math.floor(state.raw.length / 2)) }
      localStorage.setItem(LIVE_KEY, JSON.stringify({ today: log.today, raw: log.raw, spill: log.spill, lastActive: log.lastActive }))
    } catch {
      /* aufgeben */
    }
  }
}

/**
 * Wartende Ereignisse ins Langzeit-Archiv schreiben. Erst nach Erfolg aus
 * `spill` nehmen — bei Fehler bleiben sie im localStorage und kommen später.
 */
function archiveSpill(force = false): Promise<void> {
  if (archiving || log.spill.length === 0) return Promise.resolve()
  if (!force && log.spill.length < SPILL_BATCH) return Promise.resolve()
  archiving = true
  const batch = log.spill
  const written = new Set(batch)
  return archive
    .append(batch, Date.now())
    .then(() => {
      log = { ...log, spill: log.spill.filter((e) => !written.has(e)) }
      if (archiveCache) archiveCache = [...archiveCache, ...batch]
      dirty = true
      persistNow()
    })
    .catch(() => {
      /* kein IndexedDB / Platz: bleibt in spill (höchstens SPILL_MAX) */
    })
    .finally(() => {
      archiving = false
    })
}

function scheduleFlush(): void {
  if (flushTimer != null) return
  flushTimer = window.setTimeout(() => {
    flushTimer = null
    tickPlayTime()
    persistNow()
    void archiveSpill()
  }, FLUSH_MS)
}

/** Credit visible time so far (also a heartbeat for the session border). */
function tickPlayTime(now = Date.now()): void {
  if (!readOptIn() || visibleSince <= 0) return
  log = addPlayTime(log, visibleSince, now, APP_VERSION)
  visibleSince = now
  if (snapshotFn) {
    try {
      log = setSnapshot(log, snapshotFn(), now)
    } catch {
      /* Schnappschuss ist optional */
    }
  }
  dirty = true
}

export function isPlaytestLogEnabled(): boolean {
  return readOptIn()
}

/** Einträge im Roh-Rest + Anzahl der Tage (für die Anzeige im Menü). */
export function getPlaytestEventCount(): number {
  ensureLoaded()
  return eventCount(log) + (archiveCache?.length ?? 0) + log.days.length + (log.today ? 1 : 0)
}

export function logPlaytest(type: PlaytestEventType, data?: PlaytestPayload): void {
  if (!readOptIn()) return
  ensureLoaded()
  const now = Date.now()
  log = recordEvent(spillOld(log, now), type, data, now, APP_VERSION)
  dirty = true
  scheduleFlush()
}

/** Called by the game: what to store as the day's progress snapshot. */
export function registerPlaytestSnapshot(fn: (() => Record<string, number | string>) | null): void {
  snapshotFn = fn
}

function onShow(now = Date.now()): void {
  if (!readOptIn()) return
  ensureLoaded()
  if (visibleSince > 0) return
  const r = sessionShow(spillOld(log, now), now, APP_VERSION, {
    path: typeof location !== 'undefined' ? location.pathname || '/' : '/',
    standalone: typeof matchMedia !== 'undefined' && matchMedia('(display-mode: standalone)').matches,
  })
  log = r.log
  visibleSince = now
  dirty = true
  persistNow()
  void archiveSpill()
}

function onHide(now = Date.now()): void {
  if (!readOptIn()) return
  tickPlayTime(now)
  visibleSince = 0
  dirty = true
  persistNow()
  void archiveSpill(true)
}

export function setPlaytestLogEnabled(on: boolean): void {
  const was = readOptIn()
  if (on === was) return
  if (on) {
    writeOptIn(true)
    onShow()
  } else {
    onHide()
    writeOptIn(false)
  }
}

export function clearPlaytestLog(): void {
  log = emptyLog()
  daysWritten = 0
  dirty = false
  archiveCache = []
  void archive.clear().catch(() => undefined)
  try {
    localStorage.removeItem(DAYS_KEY)
    localStorage.removeItem(LIVE_KEY)
    localStorage.removeItem(LEGACY_KEY)
  } catch {
    /* ignore */
  }
  if (readOptIn() && visibleSince > 0) {
    visibleSince = 0
    onShow()
  }
}

/** Spielstand geht vor: Roh-Rest des Logs freigeben, wenn der Platz fehlt. */
export function freePlaytestSpace(): void {
  try {
    localStorage.removeItem(LEGACY_KEY)
    localStorage.removeItem(LIVE_KEY)
  } catch {
    /* ignore */
  }
  log = { ...log, raw: [] }
}

/**
 * Langzeit-Archiv in den Speicher laden (beim Öffnen des Menüs), damit der
 * Export später ohne Warten läuft — das Teilen-Menü am iPhone braucht den
 * Tipp „frisch“. Gibt die neue Gesamtzahl für die Anzeige zurück.
 */
export async function preparePlaytestExport(): Promise<number> {
  ensureLoaded()
  if (!archiveCache) {
    try {
      archiveCache = await archive.readAll()
    } catch {
      archiveCache = []
    }
  }
  return getPlaytestEventCount()
}

export function playtestLogText(now = Date.now()): string {
  ensureLoaded()
  tickPlayTime(now)
  persistNow()
  return exportLines(log, now, APP_VERSION, archiveCache ?? [])
}

async function exportText(): Promise<string> {
  if (!archiveCache) await preparePlaytestExport()
  return playtestLogText()
}

/** JSONL speichern — auf dem iPhone über das Teilen-Menü. */
export async function exportPlaytestLog(): Promise<SaveResult> {
  return saveFile(`playtest-log-${fileStamp()}.jsonl`, await exportText(), 'application/x-ndjson')
}

export async function copyPlaytestLog(): Promise<boolean> {
  return copyText(await exportText())
}

/** Call once from App mount — restores the log, tracks visibility. */
export function bootPlaytestLog(): () => void {
  if (booted) return () => undefined
  booted = true
  if (document.visibilityState !== 'hidden') onShow()

  const hide = () => onHide()
  const vis = () => {
    if (document.visibilityState === 'hidden') onHide()
    else onShow()
  }
  const onError = (e: ErrorEvent) => logPlaytest('error', { where: 'window', msg: String(e.message).slice(0, 160) })
  const onRejection = (e: PromiseRejectionEvent) =>
    logPlaytest('error', { where: 'promise', msg: String(e.reason).slice(0, 160) })

  window.addEventListener('pagehide', hide)
  document.addEventListener('visibilitychange', vis)
  window.addEventListener('error', onError)
  window.addEventListener('unhandledrejection', onRejection)

  return () => {
    window.removeEventListener('pagehide', hide)
    document.removeEventListener('visibilitychange', vis)
    window.removeEventListener('error', onError)
    window.removeEventListener('unhandledrejection', onRejection)
    if (flushTimer != null) {
      window.clearTimeout(flushTimer)
      flushTimer = null
    }
    onHide()
    booted = false
  }
}
