import { formatErnte, formatAway } from '../../game/format'
import { useDismiss } from '../../game/overlays'
import { IconBasket } from '../../theme/icons'
import { t } from '../../i18n'

/** „Während du weg warst …“ — one card on return, instead of a silent claim button. */
export function WelcomeBack({
  amount,
  awayMs,
  helped,
  rateFrom = 0,
  rateTo = 0,
  beds = [],
  ready = [],
  onClaim,
  onBed,
  onLater,
}: {
  amount: number
  awayMs: number
  /** Jonas' Ausbauten in der Abwesenheit (0 = keine) */
  helped: number
  /** Ernte/s vor und nach der Abwesenheit – gezeigt, wenn Jonas sie gesteigert hat */
  rateFrom?: number
  rateTo?: number
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
  // Korb leer: Jonas hat die ganze Offline-Ernte verbaut – der Zettel zeigt, was daraus wurde
  const empty = amount <= 0.01
  const grew = helped > 0 && rateFrom > 0 && rateTo > rateFrom * 1.01
  return (
    <div className="welcome-layer" role="presentation" onClick={onLater}>
      <div className="welcome-card" role="dialog" aria-modal="true" aria-labelledby="welcome-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="welcome-title">{t.ux.welcomeBack.title}</h2>
        <p>{t.ux.welcomeBack.away(formatAway(awayMs))}</p>
        {empty ? null : (
          <p className="welcome-amount">
            <IconBasket /> {t.ux.welcomeBack.harvest(formatErnte(amount))}
          </p>
        )}
        {helped > 0 ? (
          <p className={`welcome-helper${empty ? ' welcome-helper--main' : ''}`}>
            {t.helper.report(helped)}
            {empty ? `. ${t.ux.welcomeBack.helperSpent}` : ''}
          </p>
        ) : null}
        {grew ? (
          <p className="welcome-rate">{t.ux.welcomeBack.rate(formatErnte(rateFrom), formatErnte(rateTo))}</p>
        ) : null}
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
          {empty ? t.ux.welcomeBack.ok : t.ux.welcomeBack.claim}
        </button>
      </div>
    </div>
  )
}
