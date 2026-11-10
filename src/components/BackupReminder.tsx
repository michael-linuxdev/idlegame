import { useEffect, useState } from 'react'
import { downloadBackup, exportCode } from '../game/backup'
import { markExported, markReminded } from '../game/backupReminder'
import { playSfx } from '../game/sound'
import type { GameState } from '../game/state'
import { t } from '../i18n'

/**
 * Omas Hinweis „Sicherung außerhalb des Geräts“ (backupReminder.ts): mit
 * direktem Knopf zum Teilen/Speichern. Wird beim Erscheinen vermerkt, damit
 * er höchstens einmal in 7 Tagen kommt.
 */
export function BackupReminder({ state, onDone }: { state: GameState; onDone: () => void }) {
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    playSfx('letter')
    markReminded()
  }, [])
  async function save() {
    setBusy(true)
    const r = await downloadBackup(exportCode())
    if (r === 'shared' || r === 'downloaded') markExported(state)
    setBusy(false)
    onDone()
  }
  return (
    <aside className="oma-hint at-bottom backup-reminder" role="status" aria-live="polite">
      <p className="oma-hint-label">{t.hints.label}</p>
      <p className="oma-hint-text">{t.backup.remindText}</p>
      <div className="save-actions">
        <button type="button" className="btn buy oma-hint-ok" disabled={busy} onClick={() => void save()}>
          {t.backup.remindSave}
        </button>
        <button type="button" className="btn ghost oma-hint-ok" onClick={onDone}>
          {t.backup.remindLater}
        </button>
      </div>
    </aside>
  )
}
