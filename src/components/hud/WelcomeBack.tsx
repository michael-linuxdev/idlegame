import { formatAsh, formatAway } from '../../game/format'
import { useDismiss } from '../../game/overlays'
import { IconBasket } from '../../theme/icons'
import { t } from '../../i18n'

/** „Während du weg warst …“ — one card on return, instead of a silent claim button. */
export function WelcomeBack({
  amount,
  awayMs,
  helped,
  onClaim,
  onLater,
}: {
  amount: number
  awayMs: number
  helped: boolean
  onClaim: () => void
  onLater: () => void
}) {
  useDismiss(onLater)
  return (
    <div className="welcome-layer" role="presentation" onClick={onLater}>
      <div className="welcome-card" role="dialog" aria-modal="true" aria-labelledby="welcome-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="welcome-title">{t.ux.welcomeBack.title}</h2>
        <p>{t.ux.welcomeBack.away(formatAway(awayMs))}</p>
        <p className="welcome-amount">
          <IconBasket /> {t.ux.welcomeBack.harvest(formatAsh(amount))}
        </p>
        {helped ? <p className="welcome-helper">{t.ux.welcomeBack.helper}</p> : null}
        <button type="button" className="btn buy welcome-claim" onClick={onClaim} autoFocus>
          {t.ux.welcomeBack.claim}
        </button>
      </div>
    </div>
  )
}
