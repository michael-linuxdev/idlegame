import { useState, type ReactNode } from 'react'
import { formatErnte, formatDecimal, formatMult } from '../game/format'
import {
  AD_ERNTE_MINUTES,
  AD_SAMEN,
  BATTLE_PASS_MAX_XP,
  BATTLE_PASS_TIERS,
  CLAN_BOOST,
  COSMETICS,
  type CosmeticId,
  DAILY_SKIP_CAP_HOURS,
  MARKET_GIFT_SAMEN,
  SHOP_OFFERS,
  TIME_SKIPS,
  WATER_REFILL_COST,
  YIELD_BOOST_COST,
  YIELD_BOOST_MULT,
  type ShopOfferDef,
} from '../game/monetization'
import { t } from '../i18n'
import { STORE_ENABLED } from '../game/monetization'
import type { useGame } from '../game/useGame'
import { waterRefillsLeft } from '../game/state'
import { IconCheck } from '../theme/icons'

type GameApi = ReturnType<typeof useGame>
type Tab = 'free' | 'boosts' | 'styles' | 'seeds'

const TAB_KEY = 'gartenerbe-market-tab'
const TABS: Tab[] = STORE_ENABLED ? ['free', 'boosts', 'styles', 'seeds'] : ['free', 'boosts', 'styles']

interface Props {
  game: GameApi
  /** Gartenstil-Vorschau live on the map */
  onPreview?: (id: CosmeticId) => void
}

function formatMsLeft(ms: number): string {
  const totalSec = Math.ceil(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function loadTab(): Tab {
  try {
    const v = localStorage.getItem(TAB_KEY) as Tab | null
    return v && TABS.includes(v) ? v : 'free'
  } catch {
    return 'free'
  }
}

/** One shop row: name, short text, effect line, action on the right. */
function Row({ name, blurb, effect, children }: { name: string; blurb?: string; effect?: ReactNode; children: ReactNode }) {
  return (
    <li className="laden-row">
      <div className="laden-info">
        <div className="laden-name">{name}</div>
        {blurb ? <p className="laden-blurb">{blurb}</p> : null}
        {effect ? <p className="laden-effect">{effect}</p> : null}
      </div>
      <div className="laden-action">{children}</div>
    </li>
  )
}

function OfferButton({ offer, owned, onBuy }: { offer: ShopOfferDef; owned: boolean; onBuy: () => void }) {
  return (
    <Row name={offer.name} blurb={offer.blurb} effect={offer.samen != null && offer.samen > 0 ? t.shop.packEffect(offer.samen) : undefined}>
      <button type="button" className="btn buy" disabled={owned} onClick={onBuy}>
        {owned ? t.shop.owned : offer.label}
      </button>
    </Row>
  )
}

export function ShopPanel({ game, onPreview }: Props) {
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
    adWatching,
    adResult,
    giftReady,
    tapReady,
    tapCooldownLeftMs,
    purchaseTimeSkip,
    purchaseCosmetic,
    setEquippedCosmetic,
    purchaseClanBoost,
    purchaseOffer,
    purchaseYieldBoost,
    watchRewardedAd,
    claimGift,
    buyWaterRefill,
    claimBpDailyXp,
    claimBpTier,
    bpDailyXpReady,
  } = game

  const [tab, setTab] = useState<Tab>(loadTab)
  const pick = (next: Tab) => {
    setTab(next)
    try {
      localStorage.setItem(TAB_KEY, next)
    } catch {
      /* ignore */
    }
  }

  const offerOwned = (offer: ShopOfferDef) => {
    if (offer.kind === 'removeAds') return state.adsRemoved
    if (offer.kind === 'battlePassPremium') return state.gartenwochePremium
    if (offer.once) return state.ownedOfferIds.includes(offer.id)
    return false
  }

  const bundles = SHOP_OFFERS.filter((o) => o.section === 'bundles')
  const removeAds = SHOP_OFFERS.filter((o) => o.section === 'removeAds')
  const currency = SHOP_OFFERS.filter((o) => o.section === 'currency')
  const cosmeticPacks = SHOP_OFFERS.filter((o) => o.section === 'cosmetics')
  const bpPremiumOffer = SHOP_OFFERS.find((o) => o.kind === 'battlePassPremium')

  const rewardLabel = (kind: 'samen' | 'ernteSec', amount: number) =>
    kind === 'samen' ? t.shop.rewardSamen(amount) : t.shop.rewardErnteSec(amount)

  const adErnte = rate * AD_ERNTE_MINUTES * 60

  return (
    <section className="panel shop-panel" aria-labelledby="shop-heading">
      <header className="panel-header">
        <h2 id="shop-heading">{t.shop.title}</h2>
        <p className="muted">{t.shop.intro}</p>
      </header>

      <div className="shop-wallet sticky-wallet" aria-live="polite">
        <div className="shop-wallet-chip">
          <span className="shop-wallet-label">{t.resources.samen}</span>
          <span className="shop-wallet-value">{state.samen}</span>
        </div>
        {state.adsRemoved ? (
          <div className="shop-wallet-chip ads-free">
            <span className="shop-wallet-label">{t.shop.adsRemovedBadge}</span>
            <span className="shop-wallet-value"><IconCheck /></span>
          </div>
        ) : null}
      </div>

      <div className="shop-tabs" role="tablist" aria-label={t.shop.tabsAria}>
        {TABS.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`shop-tab${tab === id ? ' active' : ''}${id === 'free' && (giftReady || adReady) ? ' has-new' : ''}`}
            onClick={() => pick(id)}
          >
            {t.shop.tabs[id]}
          </button>
        ))}
      </div>

      {tab === 'free' ? (
        <div role="tabpanel">
          <ul className="laden shop-list">
            <Row name={t.shop.giftTitle} blurb={t.shop.giftIntro}>
              <button type="button" className="btn buy" disabled={!giftReady} onClick={claimGift}>
                {giftReady ? t.shop.giftClaim(MARKET_GIFT_SAMEN) : t.shop.giftDone}
              </button>
            </Row>
          </ul>

          {!state.adsRemoved ? (
            <>
              <h3 className="subhead">{t.shop.adsTitle}</h3>
              <p className="muted">{t.shop.adsIntro}</p>
              <div className="shop-ad-box">
                {adWatching ? (
                  <p className="shop-ad-status" role="status">
                    {t.shop.adsWatching}
                  </p>
                ) : adReady ? (
                  <>
                    <p className="shop-ad-status">{t.shop.adsPick}</p>
                    <div className="shop-ad-choices">
                      <button type="button" className="btn buy" onClick={() => watchRewardedAd('ernte')}>
                        {t.shop.adsErnte(AD_ERNTE_MINUTES, formatErnte(adErnte))}
                      </button>
                      <button type="button" className="btn buy" onClick={() => watchRewardedAd('samen')}>
                        {t.shop.adsSamen(AD_SAMEN)}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="shop-ad-status">{t.shop.adsCooldown(formatMsLeft(adCooldownMs))}</p>
                )}
                {adResult && !adWatching ? (
                  <p className="shop-ad-toast" role="status" aria-live="polite">
                    {t.shop.adsGot(adResult.choice === 'ernte' ? t.shop.adsGotErnte(formatErnte(adResult.ernte)) : t.shop.adsSamen(adResult.samen))}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          {STORE_ENABLED ? (
            <>
              <h3 className="subhead">{t.shop.battlePassTitle}</h3>
              <p className="muted">{t.shop.battlePassIntro}</p>
              <div className="shop-bp-header">
                <div className="shop-wallet-chip">
                  <span className="shop-wallet-label">EP</span>
                  <span className="shop-wallet-value">{t.shop.battlePassXp(state.gartenwocheXp, BATTLE_PASS_MAX_XP)}</span>
                </div>
                <button type="button" className="btn ghost" disabled={!bpDailyXpReady} onClick={claimBpDailyXp}>
                  {bpDailyXpReady ? t.shop.battlePassDailyXp : t.shop.battlePassDailyDone}
                </button>
              </div>
              <ul className="shop-bp-list">
                {BATTLE_PASS_TIERS.map((tier) => {
                  const xpOk = state.gartenwocheXp >= tier.xp
                  const freeClaimed = state.gartenwocheClaimedFree.includes(tier.tier)
                  const premClaimed = state.gartenwocheClaimedPremium.includes(tier.tier)
                  return (
                    <li key={tier.tier} className="shop-bp-row">
                      <div className="shop-bp-tier">
                        <span className="shop-bp-tier-num">T{tier.tier}</span>
                        <span className="muted">{t.shop.battlePassNeedXp(tier.xp)}</span>
                      </div>
                      <div className="shop-bp-track">
                        <span className="shop-bp-track-label">{t.shop.battlePassFree}</span>
                        <span className="laden-effect">{rewardLabel(tier.free.kind, tier.free.amount)}</span>
                        <button type="button" className="btn ghost" disabled={!xpOk || freeClaimed} onClick={() => claimBpTier(tier.tier, 'free')}>
                          {freeClaimed ? t.shop.battlePassClaimed : xpOk ? t.shop.battlePassClaim : t.shop.battlePassLocked}
                        </button>
                      </div>
                      <div className="shop-bp-track premium">
                        <span className="shop-bp-track-label">{t.shop.battlePassPremium}</span>
                        <span className="laden-effect">{rewardLabel(tier.premium.kind, tier.premium.amount)}</span>
                        <button
                          type="button"
                          className="btn ghost"
                          disabled={!state.gartenwochePremium || !xpOk || premClaimed}
                          onClick={() => claimBpTier(tier.tier, 'premium')}
                        >
                          {premClaimed
                            ? t.shop.battlePassClaimed
                            : !state.gartenwochePremium
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
        </div>
      ) : null}

      {tab === 'boosts' ? (
        <div role="tabpanel">
          <ul className="laden shop-list">
            <Row
              name={t.shop.refillTitle}
              blurb={t.shop.refillIntro}
              effect={`${tapReady ? t.shop.refillReady : t.shop.refillWaiting(formatMsLeft(tapCooldownLeftMs))} · ${t.shop.refillLeft(waterRefillsLeft(state))}`}
            >
              <button
                type="button"
                className="btn buy"
                disabled={tapReady || state.samen < WATER_REFILL_COST || waterRefillsLeft(state) <= 0}
                onClick={buyWaterRefill}
              >
                {t.shop.costSamen(WATER_REFILL_COST)}
              </button>
              {state.samen < WATER_REFILL_COST ? <span className="shop-need">{t.ux.shop.need(WATER_REFILL_COST - state.samen)}</span> : null}
            </Row>
            <Row
              name={t.shop.yieldBoostTitle}
              blurb={`${t.shop.yieldBoostIntro} ${formatMult(YIELD_BOOST_MULT)}`}
              effect={yieldBoostActive ? t.shop.yieldBoostActive(formatDecimal(yieldBoostMult, 2), formatMsLeft(yieldBoostMsLeft)) : t.shop.yieldBoostInactive}
            >
              <button type="button" className="btn buy" disabled={state.samen < YIELD_BOOST_COST} onClick={purchaseYieldBoost}>
                {t.shop.yieldBoostBuy(YIELD_BOOST_COST)}
              </button>
              {state.samen < YIELD_BOOST_COST ? <span className="shop-need">{t.ux.shop.need(YIELD_BOOST_COST - state.samen)}</span> : null}
            </Row>
            <Row
              name={CLAN_BOOST.name}
              blurb={CLAN_BOOST.blurb}
              effect={clanBoostActive ? t.shop.boostActiveShort(formatDecimal(game.vereinMult, 2), formatMsLeft(clanBoostMsLeft)) : t.shop.boostInactiveShort}
            >
              <button type="button" className="btn buy" disabled={state.samen < CLAN_BOOST.cost} onClick={purchaseClanBoost}>
                {t.shop.costSamen(CLAN_BOOST.cost)}
              </button>
              {state.samen < CLAN_BOOST.cost ? <span className="shop-need">{t.ux.shop.need(CLAN_BOOST.cost - state.samen)}</span> : null}
            </Row>
          </ul>

          <h3 className="subhead">{t.shop.skipsTitle}</h3>
          <p className="muted">
            {t.shop.skipsIntro(formatErnte(rate), DAILY_SKIP_CAP_HOURS)} · {t.shop.skipLeftToday} {t.shop.skipHours(skipHoursRemaining, DAILY_SKIP_CAP_HOURS)}
          </p>
          <ul className="laden shop-list">
            {TIME_SKIPS.map((skip) => {
              const capped = skipHoursRemaining <= 0
              const hours = Math.min(skip.hours, skipHoursRemaining, 4)
              const disabled = capped || state.samen < skip.cost || hours <= 0
              return (
                <Row key={skip.id} name={skip.name} blurb={skip.blurb} effect={capped ? t.shop.dailyCapReached : t.shop.ernteGain(formatErnte(rate * hours * 3600))}>
                  <button type="button" className="btn buy" disabled={disabled} onClick={() => purchaseTimeSkip(skip.id)}>
                    {t.shop.costSamen(skip.cost)}
                  </button>
              {state.samen < skip.cost ? <span className="shop-need">{t.ux.shop.need(skip.cost - state.samen)}</span> : null}
                </Row>
              )
            })}
          </ul>
        </div>
      ) : null}

      {tab === 'styles' ? (
        <div role="tabpanel">
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
                    <div className="laden-name">
                      {skin.name}
                      {equipped ? <span className="cosmetic-tag">{t.shop.equipped}</span> : null}
                    </div>
                    <p className="laden-blurb">{skin.blurb}</p>
                  </div>
                  {owned ? (
                    <button type="button" className="btn ghost" disabled={equipped} onClick={() => setEquippedCosmetic(skin.id)}>
                      {equipped ? t.shop.active : t.shop.equip}
                    </button>
                  ) : (
                    <div className="cosmetic-actions">
                      {onPreview ? (
                        <button type="button" className="btn ghost" onClick={() => onPreview(skin.id)}>
                          {t.preview.button}
                        </button>
                      ) : null}
                      <button type="button" className="btn buy" disabled={!afford || skin.cost <= 0} onClick={() => purchaseCosmetic(skin.id)}>
                        {skin.cost <= 0 ? t.shop.free : t.shop.costSamen(skin.cost)}
                      </button>
                      {!afford && skin.cost > 0 ? <span className="shop-need">{t.ux.shop.need(skin.cost - state.samen)}</span> : null}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
          {STORE_ENABLED ? (
            <>
              <h3 className="subhead">{t.shop.cosmeticPacksTitle}</h3>
              <p className="muted">{t.shop.cosmeticPacksIntro}</p>
              <ul className="laden shop-list">
                {cosmeticPacks.map((offer) => (
                  <OfferButton key={offer.id} offer={offer} owned={offerOwned(offer)} onBuy={() => purchaseOffer(offer)} />
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}

      {tab === 'seeds' && STORE_ENABLED ? (
        <div role="tabpanel">
          <p className="shop-placeholder-note" role="note">
            {t.shopNote.placeholder}
          </p>
          <h3 className="subhead">{t.shop.packsTitle}</h3>
          <p className="muted">{t.shop.packsIntro}</p>
          <ul className="laden shop-list">
            {bundles.map((offer) => (
              <OfferButton key={offer.id} offer={offer} owned={offerOwned(offer)} onBuy={() => purchaseOffer(offer)} />
            ))}
          </ul>
          <h3 className="subhead">{t.shop.currencyPacksTitle}</h3>
          <p className="muted">{t.shop.currencyPacksIntro}</p>
          <ul className="laden shop-list">
            {currency.map((offer) => (
              <OfferButton key={offer.id} offer={offer} owned={false} onBuy={() => purchaseOffer(offer)} />
            ))}
          </ul>
          <h3 className="subhead">{t.shop.removeAdsTitle}</h3>
          <p className="muted">{t.shop.removeAdsIntro}</p>
          <ul className="laden shop-list">
            {removeAds.map((offer) => (
              <OfferButton key={offer.id} offer={offer} owned={offerOwned(offer)} onBuy={() => purchaseOffer(offer)} />
            ))}
            {bpPremiumOffer ? <OfferButton offer={bpPremiumOffer} owned={state.gartenwochePremium} onBuy={() => purchaseOffer(bpPremiumOffer)} /> : null}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
