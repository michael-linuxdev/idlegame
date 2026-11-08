import { IMPRESSUM, PRIVACY, impressumComplete } from '../theme/legal'
import { t } from '../i18n'

interface Props {
  onClose: () => void
}

/** Datenschutz (+ Impressum once filled in) on notebook paper. */
export function LegalSheet({ onClose }: Props) {
  return (
    <div className="notebook-layer" role="presentation" onClick={onClose}>
      <div
        className="notebook legal-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="notebook-head">
          <h2 id="legal-title" className="notebook-title">
            {t.legal.title}
          </h2>
          <button type="button" className="notebook-close" onClick={onClose} aria-label={t.legal.close}>
            ×
          </button>
        </header>
        <h3>{PRIVACY.title}</h3>
        <p>{PRIVACY.intro}</p>
        {PRIVACY.sections.map((s) => (
          <section key={s.heading}>
            <h4>{s.heading}</h4>
            <p>{s.body}</p>
          </section>
        ))}
        {impressumComplete() ? (
          <section>
            <h3>{t.legal.impressum}</h3>
            <p>
              {IMPRESSUM.name}
              <br />
              {IMPRESSUM.street}
              <br />
              {IMPRESSUM.city}
              <br />
              {IMPRESSUM.email}
            </p>
          </section>
        ) : null}
      </div>
    </div>
  )
}
