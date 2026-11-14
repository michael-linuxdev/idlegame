import { useEffect, useState } from 'react'
import { CARD_SWITCH_EVENT } from '../game/cardSwitch'
import { formatClock, formatErnte } from '../game/format'
import { logPlaytest } from '../game/playtestLog'
import { playSfx } from '../game/sound'
import { bestCardOffer, offerValue, seasonCardDef, type CardOffer, type SeasonCardId } from '../game/seasonCards'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import { cardEffectText } from './cardEffect'

type GameApi = ReturnType<typeof useGame>

function previewText(p: number): string {
  const pct = Math.round((p - 1) * 100)
  return pct === 0 ? t.seasonCards.previewEven : t.seasonCards.preview(pct)
}

/** Was die Karte mit dem letzten Garten gebracht hätte — konkret in Ernte, wenn bekannt. */
function offerLine(o: CardOffer): string {
  const def = seasonCardDef(o.id)
  if (def?.offline) return t.seasonCards.previewAway(Math.round((o.preview - 1) * 100), Math.round((o.preview * def.offline - 1) * 100))
  if (o.ernte && offerValue(o) > 0) {
    const amount = formatErnte(o.ernte * offerValue(o))
    return o.ausbau ? t.seasonCards.savedAmount(amount) : t.seasonCards.gainAmount(amount)
  }
  return o.ausbau ? t.seasonCards.previewAusbau(Math.round((1 - 1 / o.preview) * 100)) : previewText(o.preview)
}

/**
 * Nach dem Saisonende: 1 von 3 Jahres-Themen wählen (oder ohne weiter). Omas
 * Tipp ist markiert. In den ersten Minuten danach öffnet dieselbe Ansicht
 * zum einmaligen Wechsel (CARD_SWITCH_EVENT).
 */
export function SeasonCardPicker({ game }: { game: GameApi }) {
  const [switching, setSwitching] = useState(false)
  const switchLeft = game.cardSwitchLeftMs

  useEffect(() => {
    const onAsk = () => setSwitching(true)
    window.addEventListener(CARD_SWITCH_EVENT, onAsk)
    return () => window.removeEventListener(CARD_SWITCH_EVENT, onAsk)
  }, [])

  const offer = game.state.seasonCardOffer
  const switchMode = offer.length === 0 && switching && switchLeft > 0
  const list = switchMode ? game.state.seasonCardChoices : offer
  if (list.length === 0) return null

  const tip = bestCardOffer(list)
  const current = switchMode ? game.state.seasonCard : null

  function pick(id: SeasonCardId | null) {
    playSfx(id ? 'upgrade' : 'tap')
    if (switchMode) {
      if (id && id !== current) {
        logPlaytest('season_card', { id, switched: true, tip: id === tip })
        game.switchSeasonCard(id)
      }
      setSwitching(false)
      return
    }
    logPlaytest('season_card', { id: id ?? 'keine', tip: id != null && id === tip })
    game.pickSeasonCard(id)
  }

  return (
    <div className="notebook-layer season-card-layer" role="presentation">
      <div className="notebook season-card-sheet" role="dialog" aria-modal="true" aria-labelledby="season-card-title">
        <h2 id="season-card-title" className="notebook-title">
          {switchMode ? t.seasonCards.switchTitle : t.seasonCards.title}
        </h2>
        <p className="notebook-intro">{switchMode ? t.seasonCards.switchIntro(formatClock(switchLeft)) : t.seasonCards.intro}</p>
        <ul className="season-card-list">
          {list.map((o) => {
            const def = seasonCardDef(o.id)
            if (!def) return null
            const copy = t.seasonCards.cards[o.id]
            const isTip = o.id === tip
            const isCurrent = o.id === current
            return (
              <li key={o.id}>
                <button
                  type="button"
                  className={`season-card${isTip ? ' tip' : ''}${isCurrent ? ' current' : ''}`}
                  onClick={() => pick(o.id)}
                  aria-current={isCurrent ? 'true' : undefined}
                  autoFocus={isTip && !switchMode}
                >
                  <span className="season-card-head">
                    <span className="season-card-name">{copy.name}</span>
                    {isCurrent ? (
                      <span className="season-card-badge current">{t.seasonCards.switchCurrent}</span>
                    ) : isTip ? (
                      <span className="season-card-badge">{t.seasonCards.tip}</span>
                    ) : null}
                  </span>
                  <span className="season-card-effect">{cardEffectText(o.id, o.ausbau)}</span>
                  <span className={`season-card-preview${o.preview >= 1 ? ' up' : ' down'}`}>{offerLine(o)}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <button type="button" className="btn ghost season-card-skip" onClick={() => pick(null)}>
          {switchMode ? t.seasonCards.switchKeep : t.seasonCards.skip}
        </button>
      </div>
    </div>
  )
}
