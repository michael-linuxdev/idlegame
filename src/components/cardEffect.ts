/** Wirkung einer Saison-Karte als Text (Ausbau-Regel ab Runde 4, sonst die gespeicherte Ertrags-Regel). */
import { GENERATORS } from '../game/generators'
import { CARD_AUSBAU, seasonCardDef, type SeasonCardId } from '../game/seasonCards'
import { t } from '../i18n'

export function cardEffectText(id: SeasonCardId, ausbau: boolean | undefined): string {
  const def = seasonCardDef(id)
  if (!def?.area || !ausbau) return t.seasonCards.cards[id].effect
  const name = (g: string) => GENERATORS.find((x) => x.id === g)?.name ?? g
  return t.seasonCards.effectAusbau(
    name(def.area.boost),
    Math.round(CARD_AUSBAU.discount * 100),
    // ohne Aufschlag (seit 2026-11-14) kein Gegenspieler im Text
    def.area.dampen && CARD_AUSBAU.surcharge > 0 ? name(def.area.dampen) : '',
    Math.round(CARD_AUSBAU.surcharge * 100),
  )
}
