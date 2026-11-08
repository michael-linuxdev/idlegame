import { useEffect, useRef, useState } from 'react'
import { formatAsh, formatDecimal, formatMult } from '../game/format'
import {
  BATTLE_PASS_MAX_XP,
  BATTLE_PASS_TIERS,
  CLAN_BOOST,
  COSMETICS,
  DAILY_SKIP_CAP_HOURS,
  REWARDED_AD_DELAY_MS,
  SHOP_OFFERS,
  TIME_SKIPS,
  YIELD_BOOST_COST,
  YIELD_BOOST_MULT,
  nextRewardedAdReward,
  type ShopOfferDef,
} from '../game/monetization'
import { t } from '../i18n'
import { STORE_ENABLED } from '../game/monetization'
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

function OfferButton({
  offer,
  owned,
  onBuy,
}: {
  offer: ShopOfferDef
  owned: boolean
  onBuy: () => void
}) {
  return (
    <li className="ember-shop-row">
      <div className="ember-shop-info">
        <div className="ember-shop-name">{offer.name}</div>
        <p className="ember-shop-blurb">{offer.blurb}</p>
        {offer.samen != null && offer.samen > 0 ? (
          <p className="ember-shop-effect">{t.shop.packEffect(offer.samen)}</p>
        ) : null}
      </div>
      <button
        type="button"
        className="btn buy"
        disabled={owned}
        onClick={onBuy}
      >
        {owned ? t.shop.owned : offer.label}
      </button>
    </li>
  )
}

export function ShopPanel({ game }: Props) {
  const {
    state,
    rate,
    skipHoursRemaining,
    clanBoostActive,
    clanBoostMsLeft,
    yieldBoostActive,
    yieldBoostMsLeft,
    yieldBoostMult,
    adReady,
    adCooldownMs,
    purchaseTimeSkip,
    purchaseCosmetic,
    setEquippedCosmetic,
    purchaseClanBoost,
    purchaseOffer,
    purchaseYieldBoost,
    watchRewardedAd,
    claimBpDailyXp,
    claimBpTier,
    bpDailyXpReady,
  } = game

  const [watchingAd, setWatchingAd] = useState(false)
  const [lastAdNote, setLastAdNote] = useState<string | null>(null)
  const watchTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (watchTimer.current != null) window.clearTimeout(watchTimer.current)
    }
  }, [])

  const startRewardedAd = () => {
    if (!adReady || watchingAd || state.adsRemoved) return
    setWatchingAd(true)
    setLastAdNote(null)
    const rewardPreview = nextRewardedAdReward(state.rewardedAdClaims)
    watchTimer.current = window.setTimeout(() => {
      watchRewardedAd()
      const amount = formatAsh(rate * (rewardPreview.minutes ?? 0) * 60)
      if (rewardPreview.kind === 'skipCrumb') {
        setLastAdNote(
          t.shop.adsRewardSkip(rewardPreview.minutes ?? 0, amount),
        )
      } else if (rewardPreview.kind === 'obsidianCrumb') {
        setLastAdNote(t.shop.adsRewardObsidian(rewardPreview.samen ?? 0))
      } else {
        setLastAdNote(
          t.shop.adsRewardYield(rewardPreview.minutes ?? 0, amount),
        )
      }
      setWatchingAd(false)
      watchTimer.current = null
    }, REWARDED_AD_DELAY_MS)
  }

  const offerOwned = (offer: ShopOfferDef) => {
    if (offer.kind === 'removeAds') return state.adsRemoved
    if (offer.kind === 'battlePassPremium') return state.bpPremium
    if (offer.once) return state.ownedOfferIds.includes(offer.id)
    return false
  }

  const bundles = SHOP_OFFERS.filter((o) => o.section === 'bundles')
  const removeAds = SHOP_OFFERS.filter((o) => o.section === 'removeAds')
  const currency = SHOP_OFFERS.filter((o) => o.section === 'currency')
  const cosmeticPacks = SHOP_OFFERS.filter((o) => o.section === 'cosmetics')
  const bpPremiumOffer = SHOP_OFFERS.find((o) => o.kind === 'battlePassPremium')

  const rewardLabel = (kind: 'samen' | 'computeSec', amount: number) =>
    kind === 'samen'
      ? t.shop.rewardObsidian(amount)
      : t.shop.rewardComputeSec(amount)

  return (
    <section className="panel shop-panel" aria-labelledby="shop-heading">
      <header className="panel-header">
        <h2 id="shop-heading">{t.shop.title}</h2>
        <p className="muted">{t.shop.intro}</p>
      </header>

      <div className="shop-wallet" aria-live="polite">
        <div className="shop-wallet-chip">
          <span className="shop-wallet-label">{t.resources.samen}</span>
          <span className="shop-wallet-value">{state.samen}</span>
        </div>
        <div className="shop-wallet-chip secondary">
          <span className="shop-wallet-label">{t.shop.skipLeftToday}</span>
          <span className="shop-wallet-value">
            {t.shop.skipHours(skipHoursRemaining, DAILY_SKIP_CAP_HOURS)}
          </span>
        </div>
        {state.adsRemoved ? (
          <div className="shop-wallet-chip ads-free">
            <span className="shop-wallet-label">{t.shop.adsRemovedBadge}</span>
            <span className="shop-wallet-value">✓</span>
          </div>
        ) : null}
      </div>

      {STORE_ENABLED ? (
        <>
      <p className="shop-placeholder-note" role="note">
        {t.shopNote.placeholder}
      </p>
      {!state.adsRemoved ? (
        <>
          <h3 className="subhead">{t.shop.adsTitle}</h3>
          <p className="muted">{t.shop.adsIntro}</p>
          <div className="shop-ad-row">
            <div className="ember-shop-info">
              <div className="ember-shop-name">{t.shop.adsWatch}</div>
              <p className="ember-shop-blurb">
                {watchingAd
                  ? t.shop.adsWatching
                  : t.shop.adsRewardSkip(5, formatAsh(rate * 5 * 60))}
              </p>
              {lastAdNote ? (
                <p className="shop-ad-toast" role="status" aria-live="polite">
                  {lastAdNote}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className="btn buy"
              disabled={!adReady || watchingAd}
              onClick={startRewardedAd}
            >
              {watchingAd
                ? t.shop.adsWatching
                : adReady
                  ? t.shop.adsWatch
                  : t.shop.adsCooldown(formatMsLeft(adCooldownMs))}
            </button>
          </div>
        </>
      ) : null}

      <h3 className="subhead">{t.shop.removeAdsTitle}</h3>
      <p className="muted">{t.shop.removeAdsIntro}</p>
      <ul className="ember-shop shop-list">
        {removeAds.map((offer) => (
          <OfferButton
            key={offer.id}
            offer={offer}
            owned={offerOwned(offer)}
            onBuy={() => purchaseOffer(offer)}
          />
        ))}
      </ul>

      <h3 className="subhead">{t.shop.packsTitle}</h3>
      <p className="muted">{t.shop.packsIntro}</p>
      <ul className="ember-shop shop-list">
        {bundles.map((offer) => (
          <OfferButton
            key={offer.id}
            offer={offer}
            owned={offerOwned(offer)}
            onBuy={() => purchaseOffer(offer)}
          />
        ))}
      </ul>

      <h3 className="subhead">{t.shop.currencyPacksTitle}</h3>
      <p className="muted">{t.shop.currencyPacksIntro}</p>
      <ul className="ember-shop shop-list">
        {currency.map((offer) => (
          <OfferButton
            key={offer.id}
            offer={offer}
            owned={false}
            onBuy={() => purchaseOffer(offer)}
          />
        ))}
      </ul>

        </>
      ) : null}

      <h3 className="subhead">{t.shop.yieldBoostTitle}</h3>
      <p className="muted">{t.shop.yieldBoostIntro}</p>
      <div className="clan-boost-row">
        <div className="ember-shop-info">
          <div className="ember-shop-name">{t.shop.yieldBoostTitle}</div>
          <p className="ember-shop-effect">
            {yieldBoostActive
              ? t.shop.yieldBoostActive(
                  formatDecimal(yieldBoostMult, 2),
                  formatMsLeft(yieldBoostMsLeft),
                )
              : t.shop.yieldBoostInactive}
          </p>
          <p className="ember-shop-blurb">
            {formatMult(YIELD_BOOST_MULT)} · 30 Min
          </p>
        </div>
        <button
          type="button"
          className="btn buy"
          disabled={state.samen < YIELD_BOOST_COST}
          onClick={purchaseYieldBoost}
        >
          {t.shop.yieldBoostBuy(YIELD_BOOST_COST)}
        </button>
      </div>

      <h3 className="subhead">{t.shop.skipsTitle}</h3>
      <p className="muted">{t.shop.skipsIntro(formatAsh(rate), DAILY_SKIP_CAP_HOURS)}</p>
      <ul className="ember-shop shop-list">
        {TIME_SKIPS.map((skip) => {
          const capped = skipHoursRemaining <= 0
          const afford = state.samen >= skip.cost
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

      {STORE_ENABLED ? (
        <>
      <h3 className="subhead">{t.shop.cosmeticPacksTitle}</h3>
      <p className="muted">{t.shop.cosmeticPacksIntro}</p>
      <ul className="ember-shop shop-list">
        {cosmeticPacks.map((offer) => (
          <OfferButton
            key={offer.id}
            offer={offer}
            owned={offerOwned(offer)}
            onBuy={() => purchaseOffer(offer)}
          />
        ))}
      </ul>

        </>
      ) : null}

      <h3 className="subhead">{t.shop.skinsTitle}</h3>
      <p className="muted">{t.shop.skinsIntro}</p>
      <ul className="cosmetic-grid">
        {COSMETICS.filter((c) => !c.fest || state.ownedCosmetics.includes(c.id)).map((skin) => {
          const owned = state.ownedCosmetics.includes(skin.id)
          const equipped = state.equippedCosmetic === skin.id
          const afford = state.samen >= skin.cost
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

      {STORE_ENABLED ? (
        <>
      <h3 className="subhead">{t.shop.battlePassTitle}</h3>
      <p className="muted">{t.shop.battlePassIntro}</p>
      <div className="shop-bp-header">
        <div className="shop-wallet-chip">
          <span className="shop-wallet-label">XP</span>
          <span className="shop-wallet-value">
            {t.shop.battlePassXp(state.bpXp, BATTLE_PASS_MAX_XP)}
          </span>
        </div>
        <button
          type="button"
          className="btn ghost"
          disabled={!bpDailyXpReady}
          onClick={claimBpDailyXp}
        >
          {bpDailyXpReady ? t.shop.battlePassDailyXp : t.shop.battlePassDailyDone}
        </button>
        {bpPremiumOffer ? (
          <button
            type="button"
            className="btn buy"
            disabled={state.bpPremium}
            onClick={() => purchaseOffer(bpPremiumOffer)}
          >
            {state.bpPremium ? t.shop.owned : bpPremiumOffer.label}
          </button>
        ) : null}
      </div>
      <ul className="shop-bp-list">
        {BATTLE_PASS_TIERS.map((tier) => {
          const xpOk = state.bpXp >= tier.xp
          const freeClaimed = state.bpClaimedFree.includes(tier.tier)
          const premClaimed = state.bpClaimedPremium.includes(tier.tier)
          return (
            <li key={tier.tier} className="shop-bp-row">
              <div className="shop-bp-tier">
                <span className="shop-bp-tier-num">T{tier.tier}</span>
                <span className="muted">{t.shop.battlePassNeedXp(tier.xp)}</span>
              </div>
              <div className="shop-bp-track">
                <span className="shop-bp-track-label">{t.shop.battlePassFree}</span>
                <span className="ember-shop-effect">
                  {rewardLabel(tier.free.kind, tier.free.amount)}
                </span>
                <button
                  type="button"
                  className="btn ghost"
                  disabled={!xpOk || freeClaimed}
                  onClick={() => claimBpTier(tier.tier, 'free')}
                >
                  {freeClaimed
                    ? t.shop.battlePassClaimed
                    : xpOk
                      ? t.shop.battlePassClaim
                      : t.shop.battlePassLocked}
                </button>
              </div>
              <div className="shop-bp-track premium">
                <span className="shop-bp-track-label">{t.shop.battlePassPremium}</span>
                <span className="ember-shop-effect">
                  {rewardLabel(tier.premium.kind, tier.premium.amount)}
                </span>
                <button
                  type="button"
                  className="btn ghost"
                  disabled={!state.bpPremium || !xpOk || premClaimed}
                  onClick={() => claimBpTier(tier.tier, 'premium')}
                >
                  {premClaimed
                    ? t.shop.battlePassClaimed
                    : !state.bpPremium
                      ? t.shop.battlePassNeedPremium
                      : xpOk
                        ? t.shop.battlePassClaim
                        : t.shop.battlePassLocked}
                </button>
              </div>
            </li>
          )
        })}
      </ul>

        </>
      ) : null}

      <h3 className="subhead">{t.shop.clanBoostTitle}</h3>
      <p className="muted">{t.shop.clanBoostIntro}</p>
      <div className="clan-boost-row">
        <div className="ember-shop-info">
          <div className="ember-shop-name">{CLAN_BOOST.name}</div>
          <p className="ember-shop-blurb">{CLAN_BOOST.blurb}</p>
          <p className="ember-shop-effect">
            {clanBoostActive
              ? t.shop.boostActiveShort(
                  formatDecimal(game.clanMult, 2),
                  formatMsLeft(clanBoostMsLeft),
                )
              : t.shop.boostInactiveShort}
          </p>
        </div>
        <button
          type="button"
          className="btn buy"
          disabled={state.samen < CLAN_BOOST.cost}
          onClick={purchaseClanBoost}
        >
          {t.shop.costObsidian(CLAN_BOOST.cost)}
        </button>
      </div>
    </section>
  )
}
