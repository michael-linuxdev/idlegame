import { useState } from 'react'
import { useDismiss } from '../game/overlays'
import { festAt, festEndsAt, festShop, nextFest, type FestShopItem } from '../game/fests'
import { RARITY_BONUS, VARIETIES } from '../game/gardenLife'
import { formatDecimal } from '../game/format'
import { payoutAtGate } from '../game/economy'
import { COSMETICS } from '../game/monetization'
import { playSfx } from '../game/sound'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import { IconFestToken, IconSeeds } from '../theme/icons'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  onClose: () => void
}

/** Festladen — the running seasonal fest: tokens, limited items, paid extras. */
export function FestSheet({ game, onClose }: Props) {
  const { state, nowTick } = game
  const fest = festAt(nowTick)
  const tokenName = t.fest.tokens[fest.id]!
  const name = t.fest.names[fest.id]!
  const tokens = Math.floor(state.festTokens)
  const days = Math.max(1, Math.ceil((festEndsAt(nowTick) - nowTick) / 86_400_000))
  const upcoming = nextFest(nowTick)
  const [note, setNote] = useState<string | null>(null)

  useDismiss(onClose)

  function label(item: FestShopItem): { title: string; blurb: string } {
    switch (item.kind) {
      case 'variety': {
        const v = VARIETIES.find((x) => x.id === item.variety)
        const pct = formatDecimal((v ? RARITY_BONUS[v.rarity] : 0) * 100, 1)
        return {
          title: t.fest.items.variety(t.plantbook.names[item.variety!] ?? item.variety!),
          blurb: t.fest.items.varietyBlurb(pct),
        }
      }
      case 'boost':
        return { title: t.fest.items.boost, blurb: t.fest.items.boostBlurb }
      case 'heirlooms':
        return {
          title: t.fest.items.heirlooms,
          blurb: t.fest.items.heirloomsBlurb(Math.max(5, Math.round(payoutAtGate(state.prestiges) * 0.5))),
        }
      case 'seeds':
        return { title: t.fest.items.seeds, blurb: t.fest.items.seedsBlurb(item.amount ?? 0) }
      case 'skin': {
        const skin = COSMETICS.find((c) => c.id === item.skin)
        return { title: t.fest.items.skin(skin?.name ?? ''), blurb: `${skin?.blurb ?? ''} ${t.fest.items.skinBlurb}` }
      }
      case 'tokenPack':
        return { title: t.fest.items.pack, blurb: t.fest.items.packBlurb(item.amount ?? 0, tokenName) }
    }
  }

  function buy(item: FestShopItem) {
    const before = game.stateRef.current
    game.buyFest(item.id)
    // optimistic toast; buyFestItem is a no-op when not allowed (button disabled)
    if (before.festTokens >= item.tokens && before.samen >= item.samen) {
      playSfx('claim')
      setNote(t.fest.bought(label(item).title))
      window.setTimeout(() => setNote(null), 1600)
    }
  }

  return (
    <div className="upgrade-hud-layer fest-layer" role="presentation" onClick={onClose}>
      <div
        className={`upgrade-hud fest-sheet fest-${fest.id}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fest-title"
        style={{ ['--fest' as string]: fest.color }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="upgrade-hud-header fest-header">
          <div className="upgrade-hud-heading">
            <p className="upgrade-hud-eyebrow">
              {fest.major ? t.fest.major : t.fest.minor} · {t.fest.endsIn(days)}
            </p>
            <h2 id="fest-title">{name}</h2>
            <p className="upgrade-hud-blurb">{t.fest.blurbs[fest.id]}</p>
          </div>
          <button type="button" className="upgrade-hud-close" onClick={onClose} aria-label={t.upgrade.close}>
            ×
          </button>
        </header>

        <div className="fest-wallet">
          <span className="fest-token-big" aria-hidden="true">
            <IconFestToken fest={fest.id} />
          </span>
          <strong>{t.fest.wallet(tokens, tokenName)}</strong>
          <span className="fest-wallet-seeds">
            <IconSeeds /> {state.samen}
          </span>
        </div>
        <p className="fest-expire">{t.fest.expireNote}</p>
        {note ? (
          <p className="fest-note" role="status">
            {note}
          </p>
        ) : null}

        <h3 className="upgrade-hud-modules-title">{t.fest.shopTitle}</h3>
        <ul className="fest-shop">
          {festShop(fest).map((item) => {
            const { title, blurb } = label(item)
            const bought = state.festBought[item.id] ?? 0
            const owned =
              (item.kind === 'variety' && state.collection.includes(item.variety!)) ||
              (item.kind === 'skin' && state.ownedCosmetics.includes(item.skin!))
            const soldOut = bought >= item.limit
            const afford = tokens >= item.tokens && state.samen >= item.samen
            const paid = item.samen > 0
            return (
              <li key={item.id} className={`fest-item${paid ? ' paid' : ''}${owned ? ' owned' : ''}`}>
                <div className="fest-item-info">
                  <p className="fest-item-title">
                    {title}
                    {paid ? <span className="fest-paid">{t.fest.paid}</span> : null}
                  </p>
                  <p className="fest-item-blurb">{blurb}</p>
                  {item.limit > 1 && !soldOut ? (
                    <p className="fest-item-left">{t.fest.left(item.limit - bought)}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className={`btn ${paid ? 'ghost' : 'buy'} fest-buy`}
                  disabled={owned || soldOut || !afford}
                  onClick={() => buy(item)}
                >
                  {owned
                    ? t.fest.owned
                    : soldOut
                      ? t.fest.soldOut
                      : paid
                        ? t.fest.costSamen(item.samen)
                        : t.fest.costTokens(item.tokens, tokenName)}
                </button>
              </li>
            )
          })}
        </ul>

        <h3 className="upgrade-hud-modules-title">{t.fest.earnTitle}</h3>
        <ul className="fest-earn">
          {t.fest.earn.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="fest-next">{t.fest.next(t.fest.names[upcoming.id]!)}</p>
      </div>
    </div>
  )
}
