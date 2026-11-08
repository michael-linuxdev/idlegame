import { useState } from 'react'
import { DEEP_GATE_YEAR, DEEP_SHOP, canDeepReset, sproutPayout } from '../game/longLoop'
import {
  EMBER_SHOP,
  PRESTIGE_BRANCHES,
  PRESTIGE_MIN_MODULES_ONLINE,
  countAffordableEmberBuys,
  countAffordableEmberBuysAfterPrestige,
  emberPayout,
  emberRankUnlocked,
  emberRankUnlockNeed,
  emberUnlockProgress,
  modulesOnlineCount,
  modulesToNextEmberUnlock,
  nextLockedEmberUnlock,
  postPrestigeStartOwned,
  prestigeBlockReason,
} from '../game/economy'
import { formatAsh, formatMult } from '../game/format'
import { t } from '../i18n'
import { WinterScene } from '../theme/WinterScene'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  highlight?: boolean
}

function shopRowPriority(
  affordable: boolean,
  unlocked: boolean,
  maxed: boolean,
): number {
  if (affordable) return 0
  if (!maxed && unlocked) return 1
  if (!maxed) return 2
  return 3
}

export function PrestigePanel({ game, highlight }: Props) {
  const { state, nextPrestige, canPrestige, prestige, multiplier, prestigeMin, prestigeProgress } =
    game
  const teaser = prestigeProgress.ratio >= 0.5 && !canPrestige
  const payout = emberPayout(state.ernteSeason, state.prestiges)
  const online = modulesOnlineCount(state.owned)
  const block = prestigeBlockReason({
    prestiges: state.prestiges,
    ernteSeason: state.ernteSeason,
    owned: state.owned,
  })
  const unlockProgress = emberUnlockProgress(state.ernteSeason, state.owned)
  const readyBuys = countAffordableEmberBuys(
    state.emberUpgrades,
    state.erbstuecke,
    state.ernteSeason,
    state.owned,
    state.prestiges,
  )
  const nextUnlock = nextLockedEmberUnlock(
    state.emberUpgrades,
    state.ernteSeason,
    state.owned,
    state.prestiges,
  )
  const postBuys = countAffordableEmberBuysAfterPrestige({
    upgrades: state.emberUpgrades,
    erbstuecke: state.erbstuecke,
    ernteSeason: state.ernteSeason,
    prestiges: state.prestiges,
  })

  const deepOpen = canDeepReset(state.prestiges)
  const [deepArmed, setDeepArmed] = useState(false)
  const deepPayout = sproutPayout(state.prestiges)

  const postUnlockMods =
    modulesToNextEmberUnlock(
      state.emberUpgrades,
      0,
      postPrestigeStartOwned(state.emberUpgrades),
      state.prestiges + 1,
    ) ?? 0

  let claimLabel: string
  if (canPrestige) {
    claimLabel =
      postBuys > 0
        ? t.prestige.claimReset(nextPrestige)
        : t.prestige.claimResetRebuild(nextPrestige, postUnlockMods)
  } else if (block === 'modules') {
    claimLabel = t.prestige.needModules(online, PRESTIGE_MIN_MODULES_ONLINE)
  } else {
    claimLabel = t.prestige.needMore(
      formatAsh(Math.max(0, prestigeMin - state.ernteSeason)),
    )
  }

  return (
    <section
      className={`panel prestige-panel${highlight ? ' ftue-target' : ''}`}
      aria-labelledby="prestige-heading"
    >
      <header className="panel-header">
        <p className="eyebrow">{t.season.springTitle(state.prestiges + 1)}</p>
        <h2 id="prestige-heading">{t.prestige.title}</h2>
        <p className="muted">
          {t.prestige.introBefore} <strong>{t.resources.credits}</strong>{' '}
          {t.prestige.introAfter}
        </p>
      </header>

      <div className="season-hero" aria-hidden="true">
        <WinterScene />
      </div>

      <div className="prestige-block">
        <dl className="season-stats">
          <div>
            <dt>{t.prestige.credits.replace(':', '')}</dt>
            <dd>{state.erbstuecke}</dd>
          </div>
          <div>
            <dt>{t.prestige.multiplier.replace(':', '')}</dt>
            <dd>{formatMult(multiplier)}</dd>
          </div>
          <div>
            <dt>{t.prestige.runs.replace(':', '')}</dt>
            <dd>{state.prestiges}</dd>
          </div>
        </dl>
        <p className="prestige-stats">
          {t.prestige.thisRun} <strong>{formatAsh(state.ernteSeason)}</strong> /{' '}
          {formatAsh(prestigeMin)} {t.resources.compute}
        </p>
        <div className="prestige-bar" aria-hidden="true">
          <div
            className="prestige-bar-fill"
            style={{ width: `${Math.min(100, prestigeProgress.ratio * 100)}%` }}
          />
        </div>

        <p className="prestige-stats">
          {t.prestige.nextPayout} <strong>{t.prestige.creditsAmount(payout)}</strong>
          {canPrestige ? <span className="prestige-teaser"> · {t.prestige.longerHint}</span> : null}
          {teaser ? <span className="prestige-teaser"> · {t.prestige.creditsPreview(nextPrestige)}</span> : null}
        </p>

        <div className="prestige-preview" aria-label={t.prestige.title}>
          <div className="prestige-preview-card keep">
            <p className="prestige-preview-label">{t.prestige.keepTitle}</p>
            <ul className="prestige-preview-list">
              {t.prestige.keepItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="prestige-preview-card lose">
            <p className="prestige-preview-label">{t.prestige.loseTitle}</p>
            <ul className="prestige-preview-list">
              {t.prestige.loseItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {!canPrestige && prestigeProgress.ratio < 0.05 && block === 'ernte' ? (
          <p className="panel-empty">{t.prestige.emptyGate}</p>
        ) : null}
        <button
          type="button"
          className="btn prestige"
          disabled={!canPrestige}
          onClick={prestige}
        >
          {claimLabel}
        </button>
      </div>

      <h3 className="subhead">{t.prestige.shopTitle}</h3>
      <p className="muted">{t.prestige.shopIntro}</p>
      {state.erbstuecke <= 0 ? (
        <p className="panel-empty">{t.prestige.emptyShop}</p>
      ) : readyBuys > 0 ? (
        <p className="prestige-shop-ready">{t.prestige.shopReady(readyBuys)}</p>
      ) : nextUnlock ? (
        <div className="prestige-shop-waiting">
          <p className="prestige-shop-ready prestige-shop-ready--wait">
            {t.prestige.shopWaiting(
              nextUnlock.item.name,
              nextUnlock.rank + 1,
              Math.round(nextUnlock.ratio * 100),
            )}
          </p>
          <div
            className="ember-unlock-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(nextUnlock.ratio * 100)}
            aria-label={t.prestige.shopUnlockAria(nextUnlock.item.name)}
          >
            <div
              className="ember-unlock-bar-fill"
              style={{ width: `${Math.round(nextUnlock.ratio * 100)}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="prestige-tree">
        {PRESTIGE_BRANCHES.map((branch) => {
          const items = EMBER_SHOP.filter((item) => item.branch === branch.id)
            .map((item) => {
              const rank = state.emberUpgrades[item.id]
              const maxed = rank >= item.maxRank
              const cost = item.cost(rank)
              const unlocked = emberRankUnlocked(
                item,
                rank,
                state.ernteSeason,
                state.owned,
                state.prestiges,
              )
              const affordable = state.erbstuecke >= cost && !maxed && unlocked
              const isNext =
                !!nextUnlock &&
                nextUnlock.item.id === item.id &&
                nextUnlock.rank === rank
              return {
                item,
                rank,
                maxed,
                cost,
                unlocked,
                affordable,
                isNext,
                priority: shopRowPriority(affordable, unlocked, maxed),
              }
            })
            .sort((a, b) => {
              if (a.isNext !== b.isNext) return a.isNext ? -1 : 1
              return a.priority - b.priority || a.item.id.localeCompare(b.item.id)
            })
          return (
            <section key={branch.id} className="prestige-branch" aria-labelledby={`branch-${branch.id}`}>
              <h4 id={`branch-${branch.id}`} className="prestige-branch-title">
                {branch.title}
              </h4>
              <p className="prestige-branch-blurb">{branch.blurb}</p>
              <ul className="ember-shop">
                {items.map(({ item, rank, maxed, cost, unlocked, affordable, isNext }) => {
                  const needAsh = emberRankUnlockNeed(
                    item.id,
                    rank,
                    state.prestiges,
                  )
                  const needMods = item.unlockModulesOnline
                  let lockHint: string | null = null
                  let unlockRatio = 0
                  if (!maxed && !unlocked) {
                    if (needMods != null && online < needMods) {
                      lockHint = t.prestige.shopModulesLocked(needMods)
                    } else if (needAsh > 0) {
                      unlockRatio = Math.min(1, unlockProgress / needAsh)
                      lockHint = t.prestige.shopRankLockedProgress(
                        Math.round(unlockRatio * 100),
                        formatAsh(Math.max(0, needAsh - unlockProgress)),
                      )
                    }
                  }
                  return (
                    <li
                      key={item.id}
                      className={`ember-shop-row${affordable ? ' ember-shop-row--ready' : ''}${!unlocked && !maxed ? ' ember-shop-row--locked' : ''}${isNext ? ' ember-shop-row--next' : ''}`}
                    >
                      <div className="ember-shop-info">
                        <div className="ember-shop-name">
                          {item.name}{' '}
                          <span className="ember-shop-rank">
                            {rank}/{item.maxRank}
                          </span>
                          {isNext ? (
                            <span className="ember-shop-next-tag">
                              {t.prestige.shopNextTag}
                            </span>
                          ) : null}
                        </div>
                        <p className="ember-shop-blurb">{item.blurb}</p>
                        <p className="ember-shop-effect">{item.effectLabel(rank)}</p>
                        {lockHint ? (
                          <p className="ember-shop-lock muted">{lockHint}</p>
                        ) : null}
                        {!maxed && !unlocked && needAsh > 0 ? (
                          <div
                            className="ember-unlock-bar ember-unlock-bar--row"
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(unlockRatio * 100)}
                          >
                            <div
                              className="ember-unlock-bar-fill"
                              style={{
                                width: `${Math.round(unlockRatio * 100)}%`,
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className="btn buy"
                        disabled={!affordable}
                        onClick={() => game.buyMeta(item.id)}
                      >
                        {maxed
                          ? t.prestige.max
                          : !unlocked
                            ? t.upgrade.locked
                            : t.prestige.costCredits(cost)}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      <section className="long-loop-block deep-winter" aria-labelledby="deep-winter">
        <h3 id="deep-winter" className="subhead">
          {t.longLoop.title}
        </h3>
        <p className="muted">{t.longLoop.intro}</p>
        <dl className="season-stats">
          <div>
            <dt>{t.longLoop.sprouts}</dt>
            <dd>{state.sproesslinge}</dd>
          </div>
          <div>
            <dt>{t.longLoop.winters}</dt>
            <dd>{state.deepPrestiges}</dd>
          </div>
          <div>
            <dt>{t.longLoop.payout}</dt>
            <dd>+{deepPayout}</dd>
          </div>
        </dl>
        <div className="prestige-preview">
          <div className="prestige-preview-card keep">
            <p className="prestige-preview-label">{t.prestige.keepTitle}</p>
            <ul className="prestige-preview-list">
              {t.longLoop.keepItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="prestige-preview-card lose">
            <p className="prestige-preview-label">{t.longLoop.loseTitle}</p>
            <ul className="prestige-preview-list">
              {t.longLoop.loseItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <button
          type="button"
          className="btn prestige deep"
          disabled={!deepOpen}
          onClick={() => {
            if (deepArmed) {
              setDeepArmed(false)
              game.deepReset()
            } else {
              setDeepArmed(true)
              window.setTimeout(() => setDeepArmed(false), 4000)
            }
          }}
        >
          {!deepOpen
            ? t.longLoop.gateClosed(DEEP_GATE_YEAR)
            : deepArmed
              ? t.longLoop.confirmCta
              : t.longLoop.cta(deepPayout)}
        </button>

        <h4 className="prestige-branch-title">{t.longLoop.shopTitle}</h4>
        <ul className="ember-shop long-loop-shop">
          {DEEP_SHOP.map((item) => {
            const rank = state.deepUpgrades[item.id]
            const copy = t.longLoop.items[item.id]
            const maxed = rank >= item.maxRank
            const cost = item.cost(rank)
            const affordable = !maxed && state.sproesslinge >= cost
            return (
              <li
                key={item.id}
                className={`ember-shop-row${affordable ? ' ember-shop-row--ready' : ''}`}
              >
                <div className="ember-shop-info">
                  <div className="ember-shop-name">
                    {copy.name}{' '}
                    <span className="ember-shop-rank">
                      {t.longLoop.rank(rank, item.maxRank)}
                    </span>
                  </div>
                  <p className="ember-shop-blurb">{copy.blurb}</p>
                  <p className="ember-shop-effect">{copy.effect(rank)}</p>
                </div>
                <button
                  type="button"
                  className="btn buy"
                  disabled={!affordable}
                  onClick={() => game.buyDeep(item.id)}
                >
                  {maxed ? t.prestige.max : t.longLoop.cost(cost)}
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </section>
  )
}
