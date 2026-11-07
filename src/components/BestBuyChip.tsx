import type { BestBuyHint } from '../game/bestBuy'
import { t } from '../i18n'

interface Props {
  hint: BestBuyHint
  onActivate: () => void
}

/** One-line optimization tip — no text walls. */
export function BestBuyChip({ hint, onActivate }: Props) {
  const label = hint.affordable
    ? t.bestBuy.tipAffordable(hint.name)
    : t.bestBuy.tipSoon(hint.name)

  return (
    <button
      type="button"
      className={`best-buy-chip${hint.affordable ? ' affordable' : ''}`}
      onClick={onActivate}
      aria-label={`${t.bestBuy.aria}: ${label}`}
    >
      {label}
    </button>
  )
}
