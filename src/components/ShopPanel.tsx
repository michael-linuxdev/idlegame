import { formatAsh } from '../game/format'
import {
  CLAN_BOOST,
  COSMETICS,
  DAILY_SKIP_CAP_HOURS,
  OBSIDIAN_PACKS,
  TIME_SKIPS,
} from '../game/monetization'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
}

function formatMsLeft(ms: number): string {
  const totalSec = Math.ceil(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function ShopPanel({ game }: Props) {
  const {
    state,
    rate,
    skipHoursRemaining,
    clanBoostActive,
    clanBoostMsLeft,
    purchaseTimeSkip,
    purchaseCosmetic,
    setEquippedCosmetic,
    purchaseClanBoost,
    purchasePack,
  } = game

  return (
    <section className="panel shop-panel" aria-labelledby="shop-heading">
      <header className="panel-header">
        <h2 id="shop-heading">{t.shop.title}</h2>
        <p className="muted">{t.shop.intro}</p>
      </header>

      <div className="shop-wallet" aria-live="polite">
        <div className="shop-wallet-chip">
          <span className="shop-wallet-label">{t.resources.obsidian}</span>
          <span className="shop-wallet-value">{state.obsidian}</span>
        </div>
        <div className="shop-wallet-chip secondary">
          <span className="shop-wallet-label">{t.shop.skipLeftToday}</span>
          <span className="shop-wallet-value">
            {t.shop.skipHours(skipHoursRemaining, DAILY_SKIP_CAP_HOURS)}
          </span>
        </div>
      </div>

      <h3 className="subhead">{t.shop.packsTitle}</h3>
      <p className="muted">{t.shop.packsIntro}</p>
      <ul className="ember-shop shop-list">
        {OBSIDIAN_PACKS.map((pack) => (
          <li key={pack.id} className="ember-shop-row">
            <div className="ember-shop-info">
              <div className="ember-shop-name">{pack.name}</div>
              <p className="ember-shop-blurb">{pack.blurb}</p>
              <p className="ember-shop-effect">{t.shop.packEffect(pack.obsidian)}</p>
            </div>
            <button
              type="button"
              className="btn buy"
              onClick={() => purchasePack(pack)}
            >
              {pack.label}
            </button>
          </li>
        ))}
      </ul>

      <h3 className="subhead">{t.shop.skipsTitle}</h3>
      <p className="muted">{t.shop.skipsIntro(formatAsh(rate), DAILY_SKIP_CAP_HOURS)}</p>
      <ul className="ember-shop shop-list">
        {TIME_SKIPS.map((skip) => {
          const capped = skipHoursRemaining <= 0
          const afford = state.obsidian >= skip.cost
          const hours = Math.min(skip.hours, skipHoursRemaining, 4)
          const disabled = capped || !afford || hours <= 0
          return (
            <li key={skip.id} className="ember-shop-row">
              <div className="ember-shop-info">
                <div className="ember-shop-name">{skip.name}</div>
                <p className="ember-shop-blurb">{skip.blurb}</p>
                <p className="ember-shop-effect">
                  {capped
                    ? t.shop.dailyCapReached
                    : t.shop.computeGain(formatAsh(rate * hours * 3600))}
                </p>
              </div>
              <button
                type="button"
                className="btn buy"
                disabled={disabled}
                onClick={() => purchaseTimeSkip(skip.id)}
              >
                {t.shop.costObsidian(skip.cost)}
              </button>
            </li>
          )
        })}
      </ul>

      <h3 className="subhead">{t.shop.skinsTitle}</h3>
      <p className="muted">{t.shop.skinsIntro}</p>
      <ul className="cosmetic-grid">
        {COSMETICS.map((skin) => {
          const owned = state.ownedCosmetics.includes(skin.id)
          const equipped = state.equippedCosmetic === skin.id
          const afford = state.obsidian >= skin.cost
          return (
            <li key={skin.id} className={`cosmetic-card${equipped ? ' equipped' : ''}`}>
              <div className={`cosmetic-swatch ${skin.accentClass}`} aria-hidden="true" />
              <div className="cosmetic-info">
                <div className="ember-shop-name">
                  {skin.name}
                  {equipped ? (
                    <span className="cosmetic-tag">{t.shop.equipped}</span>
                  ) : null}
                </div>
                <p className="ember-shop-blurb">{skin.blurb}</p>
              </div>
              {owned ? (
                <button
                  type="button"
                  className="btn ghost"
                  disabled={equipped}
                  onClick={() => setEquippedCosmetic(skin.id)}
                >
                  {equipped ? t.shop.active : t.shop.equip}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn buy"
                  disabled={!afford || skin.cost <= 0}
                  onClick={() => purchaseCosmetic(skin.id)}
                >
                  {skin.cost <= 0 ? t.shop.free : t.shop.costObsidian(skin.cost)}
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <h3 className="subhead">{t.shop.clanBoostTitle}</h3>
      <p className="muted">{t.shop.clanBoostIntro}</p>
      <div className="clan-boost-row">
        <div className="ember-shop-info">
          <div className="ember-shop-name">{CLAN_BOOST.name}</div>
          <p className="ember-shop-blurb">{CLAN_BOOST.blurb}</p>
          <p className="ember-shop-effect">
            {clanBoostActive
              ? t.shop.boostActiveShort(
                  game.clanMult.toFixed(2),
                  formatMsLeft(clanBoostMsLeft),
                )
              : t.shop.boostInactiveShort}
          </p>
        </div>
        <button
          type="button"
          className="btn buy"
          disabled={state.obsidian < CLAN_BOOST.cost}
          onClick={purchaseClanBoost}
        >
          {t.shop.costObsidian(CLAN_BOOST.cost)}
        </button>
      </div>
    </section>
  )
}
