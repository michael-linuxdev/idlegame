import { formatErnte, formatAway } from '../../game/format'
import { useDismiss } from '../../game/overlays'
import { IconBasket } from '../../theme/icons'
import { t } from '../../i18n'

/** „Während du weg warst …“ — one card on return, instead of a silent claim button. */
export function WelcomeBack({
  amount,
  awayMs,
  helped,
  beds = [],
  ready = [],
  onClaim,
  onBed,
  onLater,
}: {
  amount: number
  awayMs: number
  helped: boolean
  /** Bis zu 3 Beete, die nach dem Einsammeln bezahlbar sind */
  beds?: { id: string; name: string }[]
  /** Was inzwischen fertig ist (fertige Texte) */
  ready?: string[]
  onClaim: () => void
  /** Einsammeln und gleich dieses Beet öffnen */
  onBed?: (id: string) => void
  onLater: () => void
}) {
  useDismiss(onLater)
  return (
    <div className="welcome-layer" role="presentation" onClick={onLater}>
      <div className="welcome-card" role="dialog" aria-modal="true" aria-labelledby="welcome-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="welcome-title">{t.ux.welcomeBack.title}</h2>
        <p>{t.ux.welcomeBack.away(formatAway(awayMs))}</p>
        <p className="welcome-amount">
          <IconBasket /> {t.ux.welcomeBack.harvest(formatErnte(amount))}
        </p>
        {helped ? <p className="welcome-helper">{t.ux.welcomeBack.helper}</p> : null}
        {ready.length > 0 ? (
          <p className="welcome-ready">
            {t.ux.welcomeBack.readyTitle} {ready.join(', ')}
          </p>
        ) : null}
        {beds.length > 0 && onBed ? (
          <>
            <p className="welcome-beds-title">{t.ux.welcomeBack.bedsTitle}</p>
            <ul className="welcome-beds">
              {beds.map((b) => (
                <li key={b.id}>
                  <button type="button" className="btn ghost welcome-bed" onClick={() => onBed(b.id)}>
                    {b.name}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
        <button type="button" className="btn buy welcome-claim" onClick={onClaim} autoFocus>
          {t.ux.welcomeBack.claim}
        </button>
      </div>
    </div>
  )
}
