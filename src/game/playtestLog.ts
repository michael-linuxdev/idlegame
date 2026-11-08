/**
 * Opt-in playtest session logger — local only.
 * Default OFF. No remote analytics / network send.
 * Events live in memory + periodic flush to localStorage (capped).
 */

export type PlaytestEventType =
  | 'session_start'
  | 'session_end'
  | 'upgrade'
  | 'offline_claim'
  | 'prestige'
  | 'deep_reset'
  | 'schub'
  | 'level_up'
  | 'shop_tap'
  | 'tab_open'
  | 'menu_open'
  | 'surprise'
  | 'flash_event'
  | 'daily_claim'
  | 'best_buy_tap'

export type PlaytestPayload = Record<
  string,
  string | number | boolean | null | undefined
>

export interface PlaytestEvent {
  t: number
  type: PlaytestEventType
  data?: PlaytestPayload
}

const OPT_IN_KEY = 'gartenerbe-playtest-log-on'
const EVENTS_KEY = 'gartenerbe-playtest-log-v1'
/** Soft cap: keep roughly last 1–2h of dense play (~1.5 MB / 2500 events). */
const MAX_EVENTS = 2500
const MAX_BYTES = 1_500_000
const FLUSH_MS = 12_000

let enabledCache: boolean | null = null
let events: PlaytestEvent[] = []
let dirty = false
let flushTimer: number | null = null
let booted = false
let sessionActive = false

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

function trimToCap(list: PlaytestEvent[]): PlaytestEvent[] {
  let next = list
  if (next.length > MAX_EVENTS) next = next.slice(-MAX_EVENTS)
  let encoded = JSON.stringify(next)
  while (encoded.length > MAX_BYTES && next.length > 50) {
    const drop = Math.max(25, Math.floor(next.length * 0.1))
    next = next.slice(drop)
    encoded = JSON.stringify(next)
  }
  return next
}

function loadEvents(): PlaytestEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const out: PlaytestEvent[] = []
    for (const item of parsed) {
      if (!item || typeof item !== 'object') continue
      const row = item as Record<string, unknown>
      if (typeof row.t !== 'number' || typeof row.type !== 'string') continue
      out.push({
        t: row.t,
        type: row.type as PlaytestEventType,
        data:
          row.data && typeof row.data === 'object'
            ? (row.data as PlaytestPayload)
            : undefined,
      })
    }
    return trimToCap(out)
  } catch {
    return []
  }
}

function persistNow(): void {
  if (!dirty) return
  dirty = false
  try {
    const trimmed = trimToCap(events)
    events = trimmed
    localStorage.setItem(EVENTS_KEY, JSON.stringify(trimmed))
  } catch {
    // Quota — drop oldest half and retry once
    try {
      events = events.slice(Math.floor(events.length / 2))
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
    } catch {
      /* give up */
    }
  }
}

function scheduleFlush(): void {
  if (flushTimer != null) return
  flushTimer = window.setTimeout(() => {
    flushTimer = null
    persistNow()
  }, FLUSH_MS)
}

function push(type: PlaytestEventType, data?: PlaytestPayload): void {
  if (!readOptIn()) return
  const entry: PlaytestEvent = { t: Date.now(), type }
  if (data) {
    const clean: PlaytestPayload = {}
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) clean[k] = v
    }
    if (Object.keys(clean).length > 0) entry.data = clean
  }
  events.push(entry)
  if (events.length > MAX_EVENTS + 50) events = trimToCap(events)
  dirty = true
  scheduleFlush()
}

export function isPlaytestLogEnabled(): boolean {
  return readOptIn()
}

export function getPlaytestEventCount(): number {
  return events.length
}

export function logPlaytest(
  type: PlaytestEventType,
  data?: PlaytestPayload,
): void {
  push(type, data)
}

function endSessionIfActive(): void {
  if (!sessionActive) return
  sessionActive = false
  push('session_end')
  persistNow()
}

function startSession(): void {
  if (!readOptIn()) return
  if (sessionActive) return
  sessionActive = true
  push('session_start', {
    app: 'gartenerbe',
    path:
      typeof location !== 'undefined' ? location.pathname || '/' : '/',
  })
  persistNow()
}

export function setPlaytestLogEnabled(on: boolean): void {
  const was = readOptIn()
  if (on === was) return
  if (on) {
    writeOptIn(true)
    if (events.length === 0) events = loadEvents()
    startSession()
  } else {
    // Emit session_end while still opted in, then flip the flag off.
    endSessionIfActive()
    writeOptIn(false)
  }
}

export function clearPlaytestLog(): void {
  events = []
  dirty = false
  try {
    localStorage.removeItem(EVENTS_KEY)
  } catch {
    /* ignore */
  }
  if (readOptIn() && sessionActive) {
    push('session_start', { cleared: true })
    persistNow()
  }
}

/** JSONL download — one event per line. */
export function exportPlaytestLog(): void {
  persistNow()
  const lines = events.map((e) => JSON.stringify(e)).join('\n')
  const blob = new Blob([lines.length ? `${lines}\n` : ''], {
    type: 'application/x-ndjson',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  a.href = url
  a.download = `playtest-log-${stamp}.jsonl`
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 2_000)
}

/** Call once from App mount — restores buffer, starts session if opted in. */
export function bootPlaytestLog(): () => void {
  if (booted) return () => undefined
  booted = true
  events = loadEvents()
  if (readOptIn()) startSession()

  const onHide = () => {
    if (!readOptIn()) return
    endSessionIfActive()
  }
  const onShow = () => {
    if (!readOptIn()) return
    startSession()
  }
  const onVis = () => {
    if (document.visibilityState === 'hidden') onHide()
    else onShow()
  }

  window.addEventListener('pagehide', onHide)
  document.addEventListener('visibilitychange', onVis)

  return () => {
    window.removeEventListener('pagehide', onHide)
    document.removeEventListener('visibilitychange', onVis)
    if (flushTimer != null) {
      window.clearTimeout(flushTimer)
      flushTimer = null
    }
    endSessionIfActive()
    booted = false
  }
}
