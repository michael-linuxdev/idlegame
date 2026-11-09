/**
 * Testphase: Kauf-Rückfrage mit echtem Preis und Testgeld (game/testWallet.ts).
 * Jede Antwort landet im Playtest-Log („test_purchase“): ja, eher nicht,
 * oder „hätte ich gekauft“, wenn das Testgeld nicht mehr reicht.
 */
import { useEffect, useRef, useState } from 'react'
import { formatPrice } from '../game/format'
import type { ShopOfferDef } from '../game/monetization'
import { logPlaytest } from '../game/playtestLog'
import { offerPriceCents, readWallet, spendTestMoney, walletLeftCents } from '../game/testWallet'
import { t } from '../i18n'

export interface PurchaseContext {
  samen: number
  generation: number
  tiefeWinter: number
  saisonenden: number
  kapitel: number
}

export function TestPurchaseDialog({
  offer,
  context,
  onBuy,
  onClose,
}: {
  offer: ShopOfferDef
  context: PurchaseContext
  onBuy: () => void
  onClose: () => void
}) {
  const [wallet] = useState(() => readWallet())
  const yesRef = useRef<HTMLButtonElement>(null)
  useEffect(() => yesRef.current?.focus(), [])
  const cents = offerPriceCents(offer.id) ?? 0
  const left = walletLeftCents(wallet)
  const enough = cents <= left
  const c = t.testMoney

  function answer(kind: 'yes' | 'no' | 'yes_no_budget' | 'no_budget_close') {
    let leftAfter = left
    if (kind === 'yes') {
      const next = spendTestMoney(cents)
      if (!next) return
      leftAfter = walletLeftCents(next)
      onBuy()
    }
    logPlaytest('test_purchase', { id: offer.id, cents, answer: kind, leftCents: leftAfter, ...context })
    onClose()
  }

  return (
    <div className="test-phase-layer" role="presentation">
      <div className="test-phase test-purchase" role="dialog" aria-modal="true" aria-labelledby="test-purchase-title">
        <h2 id="test-purchase-title">{c.title}</h2>
        <p className="test-purchase-question">{c.question(offer.name, formatPrice(cents))}</p>
        <p className="muted">{offer.blurb}</p>
        <p className="test-phase-later">{c.honest}</p>
        <p className="test-purchase-balance">{enough ? c.balance(formatPrice(left)) : c.short}</p>
        <div className="test-purchase-actions">
          {enough ? (
            <>
              <button ref={yesRef} type="button" className="btn buy" onClick={() => answer('yes')}>
                {c.yes}
              </button>
              <button type="button" className="btn ghost" onClick={() => answer('no')}>
                {c.no}
              </button>
            </>
          ) : (
            <>
              <button ref={yesRef} type="button" className="btn buy" onClick={() => answer('yes_no_budget')}>
                {c.wouldBuy}
              </button>
              <button type="button" className="btn ghost" onClick={() => answer('no_budget_close')}>
                {c.close}
              </button>
            </>
          )}
        </div>
        <p className="test-phase-later">{c.note}</p>
      </div>
    </div>
  )
}
