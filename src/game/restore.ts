/**
 * Eine automatische Sicherung wiederherstellen — nie still, nie über einen
 * neueren Stand, nie während ein anderes Fenster speichert (saveGuard.ts).
 */
import { applyBundle, readCode, type Bundle } from './backup'
import { backupBeforeOccasion, readBackup, withTimeout } from './autoBackup'
import type { BackupTarget } from './backupTarget'
import { getSaveBlock } from './saveGuard'
import { keepBrokenCopy, storedSaveState } from './storage'
import type { GameState } from './state'

export type RestoreCheck =
  | { ok: true; bundle: Bundle }
  | { ok: false; reason: 'missing' | 'invalid' | 'newer' | 'blocked' }

/**
 * Darf diese Sicherung jetzt eingespielt werden?
 *  - 'blocked': dieses Fenster darf nicht speichern (anderes Fenster offen,
 *    oder der gespeicherte Stand stammt aus einer neueren Version),
 *  - 'newer': die Sicherung selbst stammt aus einer neueren Version.
 */
export async function checkRestore(id: string, to?: BackupTarget): Promise<RestoreCheck> {
  const block = getSaveBlock()
  if (block === 'newer' || block === 'otherTab' || storedSaveState() === 'newer') return { ok: false, reason: 'blocked' }
  const entry = await readBackup(id, to)
  if (!entry) return { ok: false, reason: 'missing' }
  const r = readCode(entry.code)
  if (!r.ok) return { ok: false, reason: r.newer ? 'newer' : 'invalid' }
  return { ok: true, bundle: r.bundle }
}

/**
 * Einspielen und neu laden. Liegt ein gültiger Stand vor, wird er vorher als
 * Anlass-Sicherung `restore` abgelegt (höchstens 2 s warten); ein kaputter
 * Stand bleibt als `…-broken` in localStorage liegen.
 */
export async function restoreBackup(
  id: string,
  current: GameState | null = null,
  to?: BackupTarget,
  apply: (b: Bundle) => void = applyBundle,
): Promise<RestoreCheck> {
  const check = await checkRestore(id, to)
  if (!check.ok) return check
  const cur = storedSaveState()
  if (cur === 'ok') await withTimeout(backupBeforeOccasion('restore', current), 2000, false)
  else if (cur === 'broken') keepBrokenCopy()
  apply(check.bundle)
  return check
}
