import { useEffect, useState } from 'react'
import { GENERATORS } from '../../game/generators'
import { yearLetterFor } from '../../game/notebook'
import { playSfx } from '../../game/sound'
import { t } from '../../i18n'
import { IconChest, IconSnow, IconSprout } from '../../theme/icons'

export interface SeasonEnd {
  /** Gartenjahr that now begins */
  year: number
  gained: number
  /** Tiefer Winter instead of a regular Saisonende */
  deep?: boolean
}

interface Props {
  event: SeasonEnd
  onDone: () => void
}

type Phase = 'winter' | 'letter' | 'spring'

/**
 * Saisonende as a little ritual: snow over the sleeping garden → Omas
 * letter for the new year (if any) → spring with what was kept.
 */
export function SeasonCeremony({ event, onDone }: Props) {
  const letterId = event.deep ? 'deep1' : yearLetterFor(event.year)
  const [phase, setPhase] = useState<Phase>('winter')
  const corner = event.deep
    ? null
    : GENERATORS.find((g) => (g.unlock?.seasons ?? -1) === event.year - 1)

  useEffect(() => {
    playSfx('season')
  }, [])

  useEffect(() => {
    if (phase !== 'winter') return
    const id = window.setTimeout(() => setPhase(letterId ? 'letter' : 'spring'), 2600)
    return () => window.clearTimeout(id)
  }, [phase, letterId])

  function advance() {
    if (phase === 'winter') setPhase(letterId ? 'letter' : 'spring')
    else if (phase === 'letter') setPhase('spring')
    else onDone()
  }

  const letter = letterId ? t.notebook.entries[letterId] : null

  return (
    <div className={`season-ceremony phase-${phase}${event.deep ? " deep" : ""}`} role="dialog" aria-modal="true" aria-live="polite" onClick={advance}>
      <div className="season-sky" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${-i * 0.45}s` }} />
        ))}
      </div>

      {phase === 'winter' ? (
        <div className="season-card">
          <span className="season-icon">
            <IconSnow />
          </span>
          <h2>{event.deep ? t.season.deepTitle : t.season.winterTitle}</h2>
          <p>{event.deep ? t.season.deepLine : t.season.winterLine}</p>
        </div>
      ) : null}

      {phase === 'letter' && letter ? (
        <article className="season-letter" onClick={(e) => e.stopPropagation()}>
          <h2>{letter.title}</h2>
          <p>{letter.body}</p>
          <p className="notebook-signature">{t.notebook.signature}</p>
          <button type="button" className="btn buy" onClick={advance}>
            {t.season.skip}
          </button>
        </article>
      ) : null}

      {phase === 'spring' ? (
        <div className="season-card spring" onClick={(e) => e.stopPropagation()}>
          <span className="season-icon">
            <IconSprout />
          </span>
          <h2>{event.deep ? t.season.deepSpringTitle : t.season.springTitle(event.year)}</h2>
          <p>{t.season.springLine}</p>
          <p className="season-gain">
            {event.deep ? <IconSprout /> : <IconChest />}{' '}
            {t.season.gained(event.deep ? t.season.sprouts(event.gained) : t.prestige.creditsAmount(event.gained))}
          </p>
          {corner ? <p className="season-corner">{t.season.newCorner(corner.name)}</p> : null}
          <button type="button" className="btn buy" onClick={onDone}>
            {t.season.cta}
          </button>
        </div>
      ) : null}
    </div>
  )
}
