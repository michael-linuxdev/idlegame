/**
 * Wann darf der Spielstand NICHT geschrieben werden?
 *  - 'newer':    gespeicherter Stand stammt aus einer neueren App-Version
 *                (alter Tab / alter Service Worker) → nie überschreiben.
 *  - 'otherTab': Gartenerbe läuft schon in einem anderen Fenster; nur das
 *                erste Fenster speichert (Web Locks). Schließt es, übernimmt
 *                dieses Fenster (neu geladen, falls sich der Stand geändert hat).
 *  - 'pending':  kurz beim Start, bis die Sperre geklärt ist.
 */
import { STORAGE_KEY } from './state/types'

export type SaveBlock = null | 'pending' | 'newer' | 'otherTab'

const LOCK_NAME = 'gartenerbe-spielstand'

let block: SaveBlock = null
const listeners = new Set<(b: SaveBlock) => void>()

export function getSaveBlock(): SaveBlock {
  return block
}

export function setSaveBlock(next: SaveBlock): void {
  // „neuer Stand“ hat Vorrang und wird nie wieder aufgehoben
  if (block === 'newer' && next !== 'newer') return
  if (block === next) return
  block = next
  for (const cb of listeners) cb(block)
}

export function subscribeSaveBlock(cb: (b: SaveBlock) => void): () => void {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

interface LockManagerLike {
  request: (
    name: string,
    options: { ifAvailable?: boolean },
    cb: (lock: unknown) => Promise<unknown> | unknown,
  ) => Promise<unknown>
}

/**
 * Beim Neuladen hält oft noch die alte Seite derselben Registerkarte die
 * Sperre (sie wird gerade entladen). Erst wenn sie nach dieser Zeit noch
 * belegt ist, zeigt die App „anderes Fenster“.
 */
export const OTHER_TAB_GRACE_MS = 1500

function readStoredSave(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

/**
 * Hold the save lock for the lifetime of this page (first tab wins).
 *
 * Ist die Sperre beim Start belegt, wartet die Seite darauf. Hat in der
 * Zwischenzeit jemand den Spielstand geschrieben (ein echtes anderes
 * Fenster), lädt sie danach neu und übernimmt dessen Stand. Ist der
 * gespeicherte Stand unverändert (typisch: die eigene alte Seite beim
 * Neuladen), geht es ohne zweites Neuladen weiter — ein zweites Neuladen
 * mitten im Start konnte laufende Navigationen abbrechen und eine leere
 * Seite hinterlassen (docs/leistung.md).
 */
export function startSaveLock(
  locks: LockManagerLike | undefined = typeof navigator !== 'undefined'
    ? (navigator as Navigator & { locks?: LockManagerLike }).locks
    : undefined,
  reload: () => void = () => window.location.reload(),
  readSave: () => string | null = readStoredSave,
): void {
  if (!locks?.request) return
  setSaveBlock('pending')
  // Stand vor dem ersten Laden: diese Seite liest ihn danach und schreibt
  // nichts, solange gesperrt (storage.ts) — jede Änderung kommt von woanders.
  const before = readSave()
  const forever = () => new Promise<void>(() => {})
  locks
    .request(LOCK_NAME, { ifAvailable: true }, (lock) => {
      if (lock) {
        if (block === 'pending') setSaveBlock(null)
        return forever()
      }
      const timer = setTimeout(() => {
        if (block === 'pending') setSaveBlock('otherTab')
      }, OTHER_TAB_GRACE_MS)
      // Warten, bis das andere Fenster zu ist — dann weiter oder frisch laden
      void locks.request(LOCK_NAME, {}, () => {
        clearTimeout(timer)
        if (readSave() === before) setSaveBlock(null)
        else reload()
        return forever()
      })
      return undefined
    })
    .catch(() => {
      if (block === 'pending') setSaveBlock(null)
    })
}
