import { useSyncExternalStore } from 'react'
import { applyUpdate, dismissUpdate, subscribeUpdate, updateBannerShown } from '../game/appUpdate'
import { t } from '../i18n'

/** „Update verfügbar“ — neue Version liegt bereit; aktualisiert wird erst auf Tipp. */
export function UpdateBanner({ hidden = false }: { hidden?: boolean }) {
  const shown = useSyncExternalStore(subscribeUpdate, updateBannerShown)
  if (!shown || hidden) return null
  return (
    <div className="save-guard update-banner" role="status">
      <p>
        <strong>{t.appUpdate.available}</strong> {t.appUpdate.availableBody}
      </p>
      <button type="button" className="btn buy" onClick={() => applyUpdate()}>
        {t.appUpdate.now}
      </button>
      <button type="button" className="btn ghost" onClick={dismissUpdate}>
        {t.appUpdate.later}
      </button>
    </div>
  )
}
