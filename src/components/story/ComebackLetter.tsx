import { useEffect } from 'react'
import { playSfx } from '../../game/sound'
import { t } from '../../i18n'
import { IconSeeds } from '../../theme/icons'

export const COMEBACK_SEEDS = 20

/** Oma welcomes you back after two or more days away — with a small gift. */
export function ComebackLetter({ onAccept }: { onAccept: () => void }) {
  useEffect(() => {
    playSfx('letter')
  }, [])
  return (
    <div className="notebook-layer comeback-layer" role="presentation">
      <article className="season-letter comeback-letter" role="dialog" aria-modal="true" aria-labelledby="comeback-title">
        <h2 id="comeback-title">{t.comeback.title}</h2>
        <p>{t.comeback.body}</p>
        <p className="notebook-signature">{t.notebook.signature}</p>
        <p className="season-gain">
          <IconSeeds /> {t.comeback.gift(COMEBACK_SEEDS)}
        </p>
        <button type="button" className="btn buy" onClick={onAccept}>
          {t.comeback.cta}
        </button>
      </article>
    </div>
  )
}
