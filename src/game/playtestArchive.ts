/**
 * Langzeit-Archiv des Playtest-Logs: Roh-Ereignisse, die aus dem 48-h-Rest
 * im localStorage fallen, landen hier in Blöcken (eigene IndexedDB-Datenbank,
 * getrennt von Spielstand und Sicherungen). Hält ~400 Tage bzw. ~60 MB
 * (`ARCHIVE_KEEP_MS`, `ARCHIVE_BUDGET`), älteste Blöcke fallen zuerst weg.
 *
 * Jeder Fehler wird zur abgelehnten Promise; der Aufrufer (playtestLog.ts)
 * behält die Ereignisse dann in `spill` und versucht es später erneut.
 */
import { chunksToPrune, parseEvent, type ArchiveChunkMeta, type PlaytestEvent } from './playtestCore'

export const ARCHIVE_DB = 'gartenerbe-playtest'
const CHUNKS = 'bloecke'
const INDEX = 'verzeichnis'
const DB_VERSION = 1

type IDBFactoryLike = Pick<IDBFactory, 'open'>

function req<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result)
    r.onerror = () => reject(r.error ?? new Error('idb'))
  })
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onabort = tx.onerror = () => reject(tx.error ?? new Error('idb tx'))
  })
}

export interface PlaytestArchive {
  /** Ereignisse als neuen Block anhängen, danach Altes entfernen. */
  append(events: readonly PlaytestEvent[], now: number): Promise<void>
  /** Alle archivierten Ereignisse in Zeitfolge. */
  readAll(): Promise<PlaytestEvent[]>
  clear(): Promise<void>
}

export function playtestArchive(
  factory: IDBFactoryLike | undefined = typeof indexedDB !== 'undefined' ? indexedDB : undefined,
): PlaytestArchive {
  let dbP: Promise<IDBDatabase> | null = null
  const open = (): Promise<IDBDatabase> => {
    if (dbP) return dbP
    dbP = new Promise<IDBDatabase>((resolve, reject) => {
      if (!factory) return reject(new Error('no indexedDB'))
      let r: IDBOpenDBRequest
      try {
        r = factory.open(ARCHIVE_DB, DB_VERSION)
      } catch (e) {
        return reject(e)
      }
      r.onupgradeneeded = () => {
        const db = r.result
        if (!db.objectStoreNames.contains(CHUNKS)) db.createObjectStore(CHUNKS, { keyPath: 'id' })
        if (!db.objectStoreNames.contains(INDEX)) db.createObjectStore(INDEX, { keyPath: 'id' })
      }
      r.onsuccess = () => resolve(r.result)
      r.onerror = () => reject(r.error ?? new Error('idb open'))
      r.onblocked = () => reject(new Error('idb blocked'))
    })
    // Fehlschlag nicht zwischenspeichern: beim nächsten Mal neu versuchen
    dbP.catch(() => {
      dbP = null
    })
    return dbP
  }

  return {
    async append(events, now) {
      if (events.length === 0) return
      const db = await open()
      const tx = db.transaction([CHUNKS, INDEX], 'readwrite')
      const chunks = tx.objectStore(CHUNKS)
      const index = tx.objectStore(INDEX)
      const metas = ((await req(index.getAll())) as unknown[]).filter(isMeta)
      const id = metas.reduce((max, m) => Math.max(max, m.id), 0) + 1
      const size = JSON.stringify(events).length
      const meta: ArchiveChunkMeta = { id, to: events[events.length - 1].t, size }
      chunks.put({ id, events: [...events] })
      index.put(meta)
      for (const old of chunksToPrune([...metas, meta], now)) {
        if (old === id) continue
        chunks.delete(old)
        index.delete(old)
      }
      await done(tx)
    },
    async readAll() {
      const db = await open()
      const tx = db.transaction(CHUNKS, 'readonly')
      const [all] = await Promise.all([req(tx.objectStore(CHUNKS).getAll()), done(tx)])
      const out: PlaytestEvent[] = []
      for (const c of (all as unknown[]).sort(byId)) {
        const list = (c as { events?: unknown }).events
        if (!Array.isArray(list)) continue
        for (const item of list) {
          const e = parseEvent(item)
          if (e) out.push(e)
        }
      }
      return out
    },
    async clear() {
      const db = await open()
      const tx = db.transaction([CHUNKS, INDEX], 'readwrite')
      tx.objectStore(CHUNKS).clear()
      tx.objectStore(INDEX).clear()
      await done(tx)
    },
  }
}

function isMeta(m: unknown): m is ArchiveChunkMeta {
  if (!m || typeof m !== 'object') return false
  const o = m as Record<string, unknown>
  return typeof o.id === 'number' && typeof o.to === 'number' && typeof o.size === 'number'
}

function byId(a: unknown, b: unknown): number {
  return ((a as { id: number }).id ?? 0) - ((b as { id: number }).id ?? 0)
}
