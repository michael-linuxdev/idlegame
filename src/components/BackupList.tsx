import { useEffect, useState } from 'react'
import { listBackups } from '../game/autoBackup'
import type { BackupMeta } from '../game/backupTarget'
import { formatDateTime } from '../game/format'
import { restoreBackup, type RestoreCheck } from '../game/restore'
import type { GameState } from '../game/state'
import { t } from '../i18n'

interface Props {
  /** Startangebot: schon geladene Liste, ein Tipp genügt (der Stand ist ja leer) */
  initial?: BackupMeta[]
  /** Zweimal tippen (Bestätigung), weil ein Garten ersetzt wird */
  confirm: boolean
  /** Laufender Garten (wird vor dem Wiederherstellen gesichert) */
  state?: GameState
}

/** Liste der automatischen Sicherungen mit „Wiederherstellen“. */
export function BackupList({ initial, confirm, state }: Props) {
  const [list, setList] = useState<BackupMeta[] | null>(initial ?? null)
  const [armed, setArmed] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<Exclude<RestoreCheck, { ok: true }>['reason'] | null>(null)

  useEffect(() => {
    if (initial) return
    let live = true
    void listBackups().then((l) => {
      if (live) setList(l)
    })
    return () => {
      live = false
    }
  }, [initial])

  async function onRestore(id: string) {
    setError(null)
    if (confirm && armed !== id) {
      setArmed(id)
      return
    }
    setBusy(true)
    const r = await restoreBackup(id, state ?? null)
    if (!r.ok) {
      setBusy(false)
      setArmed(null)
      setError(r.reason)
    }
  }

  if (list === null) return null
  if (list.length === 0) return <p className="backup-empty">{t.backup.autoEmpty}</p>
  return (
    <>
      <ul className="backup-list">
        {list.map((m) => (
          <li key={m.id} className="backup-row">
            <span className="backup-row-text">
              <strong>{t.backup.kinds[m.kind]}</strong>
              <span>{t.backup.row(formatDateTime(m.at), m.gardenYear, m.chapters)}</span>
            </span>
            <button
              type="button"
              className={`btn ${armed === m.id ? 'prestige' : 'ghost'} backup-restore`}
              disabled={busy}
              onClick={() => void onRestore(m.id)}
            >
              {armed === m.id ? t.backup.restoreConfirm : t.backup.restore}
            </button>
          </li>
        ))}
      </ul>
      {error ? (
        <p className="save-error" role="alert">
          {error === 'blocked' ? t.backup.restoreBlocked : error === 'newer' ? t.backup.newer : t.backup.restoreFailed}
        </p>
      ) : null}
    </>
  )
}
