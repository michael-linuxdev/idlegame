/**
 * Start mit leerem oder kaputtem Spielstand, aber vorhandenen automatischen
 * Sicherungen (autoBackup.ts): fragen, **bevor** ein neuer Garten entsteht.
 * Nie still wiederherstellen.
 */
import type { BackupMeta } from '../game/backupTarget'
import { t } from '../i18n'
import { BackupList } from './BackupList'
import '../App.css'
import '../theme/story.css'
import '../theme/ux.css'

interface Props {
  backups: BackupMeta[]
  onNewGarden: () => void
}

export function RestoreOffer({ backups, onNewGarden }: Props) {
  return (
    <div className="test-phase-layer restore-offer-layer" role="presentation">
      <div className="test-phase restore-offer" role="dialog" aria-modal="true" aria-labelledby="restore-offer-title">
        <h2 id="restore-offer-title">{t.backup.offerTitle}</h2>
        <p>{t.backup.offerBody}</p>
        <BackupList initial={backups} confirm={false} />
        <button type="button" className="btn ghost restore-offer-new" onClick={onNewGarden}>
          {t.backup.offerNew}
        </button>
        <p className="test-phase-later">{t.backup.offerNewNote}</p>
      </div>
    </div>
  )
}
