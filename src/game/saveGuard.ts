/**
 * Wann darf der Spielstand NICHT geschrieben werden?
 *  - 'newer':    gespeicherter Stand stammt aus einer neueren App-Version
 *                (alter Tab / alter Service Worker) → nie überschreiben.
 *  - 'otherTab': Gartenerbe läuft schon in einem anderen Fenster; nur das
 *                erste Fenster speichert (Web Locks). Schließt es, lädt
 *                dieses Fenster neu und übernimmt.
 *  - 'pending':  kurz beim Start, bis die Sperre geklärt ist.
 */
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

/** Hold the save lock for the lifetime of this page (first tab wins). */
export function startSaveLock(
  locks: LockManagerLike | undefined = typeof navigator !== 'undefined'
    ? (navigator as Navigator & { locks?: LockManagerLike }).locks
    : undefined,
  reload: () => void = () => window.location.reload(),
): void {
  if (!locks?.request) return
  setSaveBlock('pending')
  const forever = () => new Promise<void>(() => {})
  locks
    .request(LOCK_NAME, { ifAvailable: true }, (lock) => {
      if (lock) {
        if (block === 'pending') setSaveBlock(null)
        return forever()
      }
      setSaveBlock('otherTab')
      // Warten, bis das andere Fenster zu ist — dann frisch laden
      void locks.request(LOCK_NAME, {}, () => {
        reload()
        return forever()
      })
      return undefined
    })
    .catch(() => {
      if (block === 'pending') setSaveBlock(null)
    })
}
