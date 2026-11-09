import { MASTERY_MAX } from '../game/mastery'
import { t } from '../i18n'
import { IconStar } from '../theme/icons'

/** Drei Meister-Sterne (gefüllt / leer) mit Text für Screenreader — Sammlung und Kapitel-Karte. */
export function MasteryStars({ stars }: { stars: number }) {
  return (
    <span className="mastery-stars" role="img" aria-label={t.mastery.starsAria(stars, MASTERY_MAX)}>
      {Array.from({ length: MASTERY_MAX }, (_, i) => (
        <span key={i} className={i < stars ? 'on' : undefined}>
          <IconStar />
        </span>
      ))}
    </span>
  )
}
