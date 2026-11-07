import { formatAsh } from '../game/format'
import type { BestBuyHint } from '../game/bestBuy'
import { t } from '../i18n'

interface Props {
  hint: BestBuyHint
  onActivate: () => void
}

/** Strong one-line optimization tip — cost + pulse when affordable. */
export function BestBuyChip({ hint, onActivate }: Props) {
  const label = hint.affordable
    ? t.bestBuy.tipCost(hint.name, formatAsh(hint.cost))
    : t.bestBuy.tipSoon(hint.name)

  return (
    <button
      type="button"
      className={`best-buy-chip${hint.affordable ? ' affordable pulse-ready' : ''}`}
      onClick={onActivate}
      aria-label={`${t.bestBuy.aria}: ${label}. ${t.bestBuy.tipHold}`}
      title={t.bestBuy.tipHold}
    >
      <span className="best-buy-chip-label">{label}</span>
    </button>
  )
}
