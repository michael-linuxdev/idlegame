import { useState, useSyncExternalStore } from 'react'
import { checkForUpdate, reloadNow } from '../game/appUpdate'
import { getSaveBlock, subscribeSaveBlock, type SaveBlock } from '../game/saveGuard'
import { t } from '../i18n'

/** Hinweis, solange dieses Fenster nicht speichern darf. */
export function SaveGuardBanner() {
  const block: SaveBlock = useSyncExternalStore(subscribeSaveBlock, getSaveBlock)
  const [busy, setBusy] = useState(false)

  if (block !== 'newer' && block !== 'otherTab') return null

  async function update() {
    setBusy(true)
    const r = await checkForUpdate()
    if (r !== 'reloading') reloadNow()
  }

  return (
    <div className="save-guard" role="alert">
      <p>{block === 'newer' ? t.saveGuard.newer : t.saveGuard.otherTab}</p>
      {block === 'newer' ? (
        <button type="button" className="btn buy" onClick={update} disabled={busy}>
          {t.saveGuard.update}
        </button>
      ) : null}
    </div>
  )
}
