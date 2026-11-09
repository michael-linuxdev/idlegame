import { logPlaytest } from '../game/playtestLog'
import { playSfx } from '../game/sound'
import { seasonCardDef, type SeasonCardId } from '../game/seasonCards'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'

type GameApi = ReturnType<typeof useGame>

function previewText(p: number): string {
  const pct = Math.round((p - 1) * 100)
  return pct === 0 ? t.seasonCards.previewEven : t.seasonCards.preview(pct)
}

/** Nach dem Saisonende: 1 von 3 Jahres-Themen wählen (oder ohne weiter). */
export function SeasonCardPicker({ game }: { game: GameApi }) {
  const offer = game.state.seasonCardOffer
  if (offer.length === 0) return null

  function pick(id: SeasonCardId | null) {
    playSfx(id ? 'upgrade' : 'tap')
    logPlaytest('season_card', { id: id ?? 'keine' })
    game.pickSeasonCard(id)
  }

  return (
    <div className="notebook-layer season-card-layer" role="presentation">
      <div className="notebook season-card-sheet" role="dialog" aria-modal="true" aria-labelledby="season-card-title">
        <h2 id="season-card-title" className="notebook-title">
          {t.seasonCards.title}
        </h2>
        <p className="notebook-intro">{t.seasonCards.intro}</p>
        <ul className="season-card-list">
          {offer.map((o) => {
            const def = seasonCardDef(o.id)
            if (!def) return null
            const copy = t.seasonCards.cards[o.id]
            return (
              <li key={o.id}>
                <button type="button" className="season-card" onClick={() => pick(o.id)}>
                  <span className="season-card-name">{copy.name}</span>
                  <span className="season-card-effect">{copy.effect}</span>
                  <span className={`season-card-preview${o.preview >= 1 ? ' up' : ' down'}`}>
                    {o.id === 'ruhigesJahr' ? t.seasonCards.previewQuiet : previewText(o.preview)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        <button type="button" className="btn ghost season-card-skip" onClick={() => pick(null)}>
          {t.seasonCards.skip}
        </button>
      </div>
    </div>
  )
}
