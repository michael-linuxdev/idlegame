/**
 * Playtest-Log, Kern ohne Browser — läuft über Monate:
 *  - Roh-Ereignisse nur der letzten 48 h (und gedeckelt).
 *  - Häufige Ereignisse (Ausbauen, Überraschungen, Gießen) werden nie einzeln
 *    gespeichert, sondern je Minute gezählt.
 *  - Je Kalendertag eine kleine Zusammenfassung, die dauerhaft bleibt.
 *  - Eine Sitzung beginnt erst nach ≥ 30 min Pause (Neuladen zählt nicht).
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
  | 'generation'
  | 'buy_all'
  | 'fest_buy'
  | 'plot_switch'
  | 'app_update'
  | 'weinlese'
  | 'recipe'
  | 'photo'
  | 'minute'
  | 'decor'
  | 'resident'
  | 'crossing'
  | 'project'
  | 'album'
  | 'weather_choice'
  | 'letter'
  | 'water_refill'
  | 'wheel'
  | 'error'
  | 'storage'

export type PlaytestPayload = Record<string, string | number | boolean | null | undefined>

export interface PlaytestEvent {
  t: number
  type: PlaytestEventType
  data?: PlaytestPayload
}

export interface DaySummary {
  /** Lokaler Kalendertag YYYY-MM-DD */
  day: string
  /** Zähler je Typ und je „Typ:Detail“ */
  counts: Record<string, number>
  /** Echte Sitzungen (≥ 30 min Pause davor) */
  sessions: number
  /** Sichtbare Spielzeit in ms */
  playMs: number
  first: number
  last: number
  version?: string
  /** Letzter Fortschritts-Stand des Tages */
  snap?: Record<string, number | string>
}

export interface LogState {
  days: DaySummary[]
  today: DaySummary | null
  raw: PlaytestEvent[]
  /** Letzte Aktivität (für die Sitzungsgrenze) */
  lastActive: number
}

export const LOG_SCHEMA = 2
export const SESSION_GAP_MS = 30 * 60_000
export const RAW_KEEP_MS = 48 * 3600_000
export const RAW_MAX = 3000
/** Größte Menge an Detail-Schlüsseln pro Tag */
export const DAY_MAX_KEYS = 200
/** Budget für alle abgeschlossenen Tage (JSON-Zeichen) */
export const DAYS_BUDGET = 1_500_000
/** Sichtbare Zeit ohne Pause wird höchstens so lange angerechnet */
const PLAY_SLICE_MAX_MS = 2 * 3600_000

/** Ereignisse, die nur gezählt (Minute + Tag), nie einzeln gespeichert werden. */
export const HIGH_FREQUENCY = new Set<PlaytestEventType>(['upgrade', 'surprise', 'schub'])

/** Alte interne Namen → deutsche Begriffe (nur im Log). */
export const LOG_NAMES: Record<string, string> = {
  fortress: 'garten',
  prestige: 'saison',
  shop: 'markt',
  clan: 'verein',
  ember: 'erbstueck',
  dominionYield: 'gartenschere',
  longWatch: 'alteGiesskanne',
  foundryDiscount: 'saatgutkiste',
  firstFlame: 'kompostVomVorjahr',
  tapMastery: 'messingBrause',
  seedPurse: 'notgroschen',
  canopyBoost: 'strohhut',
  nightSoil: 'laterne',
  saplingSurge: 'guteErde',
  greenLattice: 'rosenbogen',
  obsidian50: 'samen50',
  obsidian150: 'samen150',
  obsidian500: 'samen500',
}

export function emptyLog(): LogState {
  return { days: [], today: null, raw: [], lastActive: 0 }
}

export function localDay(t: number): string {
  const d = new Date(t)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Payload säubern und alte Namen übersetzen. */
export function cleanPayload(data?: PlaytestPayload): PlaytestPayload | undefined {
  if (!data) return undefined
  const out: PlaytestPayload = {}
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue
    out[k] = typeof v === 'string' && LOG_NAMES[v] ? LOG_NAMES[v] : v
  }
  return Object.keys(out).length > 0 ? out : undefined
}

function detailOf(data?: PlaytestPayload): string | null {
  if (!data) return null
  for (const k of ['id', 'tab', 'action', 'kind', 'choice', 'to'] as const) {
    const v = data[k]
    if (typeof v === 'string' && v.length > 0) return v.slice(0, 32)
  }
  return null
}

function newDay(t: number, version?: string): DaySummary {
  return { day: localDay(t), counts: {}, sessions: 0, playMs: 0, first: t, last: t, version }
}

/** Ensure `today` matches the day of `t`; closes the previous day. */
export function rollDay(log: LogState, t: number, version?: string): LogState {
  const key = localDay(t)
  if (log.today && log.today.day === key) return log
  const days = log.today ? [...log.days, log.today] : log.days
  return { ...log, days: fitDaysBudget(days), today: newDay(t, version) }
}

function bump(counts: Record<string, number>, key: string, n = 1): void {
  if (counts[key] !== undefined || Object.keys(counts).length < DAY_MAX_KEYS) {
    counts[key] = (counts[key] ?? 0) + n
  } else {
    const other = `${key.split(':')[0]}:…`
    counts[other] = (counts[other] ?? 0) + n
  }
}

/** Record one event at time `t`. Pure: returns a new state. */
export function recordEvent(
  log: LogState,
  type: PlaytestEventType,
  data: PlaytestPayload | undefined,
  t: number,
  version?: string,
): LogState {
  const rolled = rollDay(log, t, version)
  const clean = cleanPayload(data)
  const today: DaySummary = { ...rolled.today!, counts: { ...rolled.today!.counts }, last: t }
  bump(today.counts, type)
  const detail = detailOf(clean)
  if (detail) bump(today.counts, `${type}:${detail}`)
  if (type === 'prestige' && typeof clean?.erbstuecke === 'number') {
    bump(today.counts, 'erbstueckeGained', clean.erbstuecke)
  }

  let raw = rolled.raw
  if (HIGH_FREQUENCY.has(type)) {
    const minute = Math.floor(t / 60_000) * 60_000
    const last = raw[raw.length - 1]
    if (last && last.type === 'minute' && last.t === minute) {
      const d = { ...(last.data ?? {}) }
      d[type] = (typeof d[type] === 'number' ? (d[type] as number) : 0) + 1
      raw = [...raw.slice(0, -1), { ...last, data: d }]
    } else {
      raw = [...raw, { t: minute, type: 'minute', data: { [type]: 1 } }]
    }
  } else {
    const entry: PlaytestEvent = { t, type }
    if (clean) entry.data = clean
    raw = [...raw, entry]
  }
  return { ...rolled, today, raw: trimRaw(raw, t) }
}

export function trimRaw(raw: PlaytestEvent[], now: number): PlaytestEvent[] {
  const cut = now - RAW_KEEP_MS
  let start = 0
  while (start < raw.length && raw[start].t < cut) start++
  let out = start > 0 ? raw.slice(start) : raw
  if (out.length > RAW_MAX) out = out.slice(-RAW_MAX)
  return out
}

/** Too big → oldest days lose their detail keys (type totals stay). */
export function fitDaysBudget(days: DaySummary[]): DaySummary[] {
  let size = JSON.stringify(days).length
  if (size <= DAYS_BUDGET) return days
  const out = [...days]
  for (let i = 0; i < out.length && size > DAYS_BUDGET; i++) {
    const d = out[i]
    const counts: Record<string, number> = {}
    for (const [k, v] of Object.entries(d.counts)) if (!k.includes(':')) counts[k] = v
    const slim: DaySummary = { ...d, counts }
    delete slim.snap
    size -= JSON.stringify(d).length - JSON.stringify(slim).length
    out[i] = slim
  }
  return out
}

/**
 * The app became visible. Starts a new session only after a real pause;
 * a reload or quick app switch continues the current one.
 */
export function sessionShow(
  log: LogState,
  t: number,
  version?: string,
  meta?: PlaytestPayload,
): { log: LogState; isNew: boolean } {
  const isNew = log.lastActive <= 0 || t - log.lastActive >= SESSION_GAP_MS
  let next = rollDay(log, t, version)
  if (isNew) {
    const gapMin = log.lastActive > 0 ? Math.round((t - log.lastActive) / 60_000) : null
    next = recordEvent(next, 'session_start', { ...meta, gapMin }, t, version)
    next = { ...next, today: { ...next.today!, sessions: next.today!.sessions + 1 } }
  }
  return { log: { ...next, lastActive: t }, isNew }
}

/** Credit visible play time [from, to) to the right days. */
export function addPlayTime(log: LogState, from: number, to: number, version?: string): LogState {
  if (!(to > from)) return log
  const span = Math.min(to - from, PLAY_SLICE_MAX_MS)
  const next = rollDay(log, to, version)
  return {
    ...next,
    today: { ...next.today!, playMs: next.today!.playMs + span, last: to },
    lastActive: to,
  }
}

export function setSnapshot(log: LogState, snap: Record<string, number | string>, t: number): LogState {
  const next = rollDay(log, t)
  return { ...next, today: { ...next.today!, snap } }
}

/* —————————————— Einlesen (auch alte Formate) —————————————— */

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

export function parseEvent(item: unknown): PlaytestEvent | null {
  if (!isRecord(item) || typeof item.t !== 'number' || typeof item.type !== 'string') return null
  const ev: PlaytestEvent = { t: item.t, type: item.type as PlaytestEventType }
  const data = isRecord(item.data) ? cleanPayload(item.data as PlaytestPayload) : undefined
  if (data) ev.data = data
  return ev
}

export function parseDay(item: unknown): DaySummary | null {
  if (!isRecord(item) || typeof item.day !== 'string') return null
  const counts: Record<string, number> = {}
  if (isRecord(item.counts)) {
    for (const [k, v] of Object.entries(item.counts)) if (typeof v === 'number' && Number.isFinite(v)) counts[k] = v
  }
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0)
  const day: DaySummary = {
    day: item.day,
    counts,
    sessions: num(item.sessions),
    playMs: num(item.playMs),
    first: num(item.first),
    last: num(item.last),
  }
  if (typeof item.version === 'string') day.version = item.version
  if (isRecord(item.snap)) day.snap = item.snap as Record<string, number | string>
  return day
}

/**
 * Turn the old v1 log (plain event list, ~1 h) into the new format: every
 * event is replayed, so its days get summaries and nothing is thrown away.
 */
export function importLegacyEvents(log: LogState, list: unknown): LogState {
  if (!Array.isArray(list)) return log
  let next = log
  for (const item of list) {
    const ev = parseEvent(item)
    if (!ev) continue
    if (ev.type === 'session_start') {
      next = sessionShow(next, ev.t, undefined, ev.data).log
    } else if (ev.type !== 'session_end') {
      next = recordEvent(next, ev.type, ev.data, ev.t)
      next = { ...next, lastActive: Math.max(next.lastActive, ev.t) }
    }
  }
  return next
}

/* —————————————— Export —————————————— */

export function eventCount(log: LogState): number {
  return log.raw.length
}

/** JSONL: Kopfzeile, dann Tage, dann Roh-Ereignisse der letzten 48 h. */
export function exportLines(log: LogState, now: number, version: string): string {
  const days = log.today ? [...log.days, log.today] : log.days
  const header = {
    kind: 'header',
    app: 'gartenerbe',
    schema: LOG_SCHEMA,
    version,
    exportedAt: now,
    from: days[0]?.day ?? null,
    to: days[days.length - 1]?.day ?? null,
    days: days.length,
    raw: log.raw.length,
  }
  const lines = [JSON.stringify(header)]
  for (const d of days) lines.push(JSON.stringify({ kind: 'day', ...d }))
  for (const e of log.raw) lines.push(JSON.stringify(e))
  return `${lines.join('\n')}\n`
}
