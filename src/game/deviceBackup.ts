/**
 * Sicherungsziel „dieses Gerät“: eigene IndexedDB-Datenbank, getrennt vom
 * Spielstand (der liegt in localStorage). Jeder Fehler wird zur
 * abgelehnten Promise — der Aufrufer (autoBackup.ts) fängt alles ab, das
 * Spiel merkt davon nichts.
 */
import { toMeta, type BackupEntry, type BackupMeta, type BackupTarget } from './backupTarget'

export const BACKUP_DB = 'gartenerbe-sicherungen'
const STORE = 'sicherungen'
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

export function deviceTarget(factory: IDBFactoryLike | undefined = typeof indexedDB !== 'undefined' ? indexedDB : undefined): BackupTarget {
  let dbP: Promise<IDBDatabase> | null = null
  const open = (): Promise<IDBDatabase> => {
    if (dbP) return dbP
    dbP = new Promise<IDBDatabase>((resolve, reject) => {
      if (!factory) return reject(new Error('no indexedDB'))
      let r: IDBOpenDBRequest
      try {
        r = factory.open(BACKUP_DB, DB_VERSION)
      } catch (e) {
        return reject(e)
      }
      r.onupgradeneeded = () => {
        const db = r.result
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' })
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
  const run = async <T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T> | null): Promise<T | undefined> => {
    const db = await open()
    const tx = db.transaction(STORE, mode)
    const r = fn(tx.objectStore(STORE))
    const [value] = await Promise.all([r ? req(r) : Promise.resolve(undefined), done(tx)])
    return value
  }
  return {
    name: 'device',
    async write(entry) {
      await run('readwrite', (s) => s.put(entry))
    },
    async list(): Promise<BackupMeta[]> {
      const all = ((await run('readonly', (s) => s.getAll())) ?? []) as BackupEntry[]
      return all.filter(isEntry).map(toMeta).sort((a, b) => b.at - a.at)
    },
    async read(id) {
      const e = await run('readonly', (s) => s.get(id))
      return isEntry(e) ? e : null
    },
    async remove(id) {
      await run('readwrite', (s) => s.delete(id))
    },
  }
}

function isEntry(e: unknown): e is BackupEntry {
  if (typeof e !== 'object' || e === null) return false
  const x = e as Record<string, unknown>
  return typeof x.id === 'string' && typeof x.code === 'string' && typeof x.at === 'number' && typeof x.kind === 'string'
}
