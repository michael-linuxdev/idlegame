import {
  DEEP_SHOP,
  ERA_SHOP,
  YEAR_SEASONS_TARGET,
  deepGateOpen,
  deepGatePrestigesLeft,
  emberShopFillRatio,
  eraGateOpen,
  previewDeepPayout,
} from '../game/longLoop'
import {
  EMBER_SHOP,
  PRESTIGE_BRANCHES,
  PRESTIGE_MIN_MODULES_ONLINE,
  countAffordableEmberBuys,
  emberPayout,
  emberRankUnlocked,
  emberUnlockProgress,
  modulesOnlineCount,
  prestigeBlockReason,
  prestigeMinEmbersForRun,
} from '../game/economy'
import { formatAsh } from '../game/format'
import { t } from '../i18n'
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
  const payout = emberPayout(state.ashEarned)
  const online = modulesOnlineCount(state.owned)
  const minEmbers = prestigeMinEmbersForRun(state.prestiges)
  const block = prestigeBlockReason({
    prestiges: state.prestiges,
    ashEarned: state.ashEarned,
    owned: state.owned,
  })
  const unlockProgress = emberUnlockProgress(state.ashEarned, state.owned)
  const readyBuys = countAffordableEmberBuys(
    state.emberUpgrades,
    state.embers,
    state.ashEarned,
    state.owned,
  )

  const fill = emberShopFillRatio(state.emberUpgrades)
  const deepOpen = deepGateOpen({
    prestiges: state.prestiges,
    emberUpgrades: state.emberUpgrades,
  })
  const prestigesLeft = deepGatePrestigesLeft(
    state.prestiges,
    state.emberUpgrades,
  )
  const eraOpen = eraGateOpen({
    yearIndex: state.yearIndex,
    lifetimePrestiges: state.prestiges,
  })
  const deepPreview = previewDeepPayout(state.seasonPoints)

  let claimLabel: string
  if (canPrestige) {
    claimLabel = t.prestige.claimReset(nextPrestige)
  } else if (block === 'embers') {
    claimLabel = t.prestige.needEmbers(payout, minEmbers)
  } else if (block === 'modules') {
    claimLabel = t.prestige.needModules(online, PRESTIGE_MIN_MODULES_ONLINE)
  } else {
    claimLabel = t.prestige.needMore(
      formatAsh(Math.max(0, prestigeMin - state.ashEarned)),
    )
  }

  return (
    <section
      className={`panel prestige-panel${highlight ? ' ftue-target' : ''}`}
      aria-labelledby="prestige-heading"
    >
      <header className="panel-header">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 id="prestige-heading">{t.prestige.title}</h2>
        <p className="muted">
          {t.prestige.introBefore} <strong>{t.resources.credits}</strong>{' '}
          {t.prestige.introAfter}
        </p>
      </header>

      <div className="prestige-block">
        <p className="prestige-stats">
          {t.prestige.credits} <strong>{state.embers}</strong>
          {' · '}
          {t.prestige.multiplier} <strong>×{multiplier.toFixed(2)}</strong>
          {' · '}
          {t.prestige.runs} <strong>{state.prestiges}</strong>
        </p>
        <p className="prestige-stats">
          {t.prestige.thisRun} <strong>{formatAsh(state.ashEarned)}</strong>{' '}
          {t.resources.compute}
          {' · '}
          {t.prestige.gate} <strong>{formatAsh(prestigeMin)}</strong>
          {teaser || canPrestige ? (
            <>
              {' · '}
              <span className="prestige-teaser">
                {t.prestige.creditsPreview(nextPrestige)}
              </span>
            </>
          ) : null}
        </p>
        <p className="prestige-stats">
          {t.prestige.nextPayout}{' '}
          <strong>{t.prestige.creditsAmount(nextPrestige)}</strong>
          {payout < minEmbers ? (
            <>
              {' · '}
              {t.prestige.needEmbers(payout, minEmbers)}
            </>
          ) : (
            <>
              {' · '}
              {t.prestige.creditsPreview(payout)}
            </>
          )}
          {state.prestiges >= 1 ? (
            <>
              {' · '}
              {t.prestige.needModules(online, PRESTIGE_MIN_MODULES_ONLINE)}
            </>
          ) : null}
        </p>
        <div className="prestige-bar" aria-hidden="true">
          <div
            className="prestige-bar-fill"
            style={{ width: `${Math.min(100, prestigeProgress.ratio * 100)}%` }}
          />
        </div>

        <div className="prestige-preview" aria-label="Prestige-Vorschau">
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

        {!canPrestige && prestigeProgress.ratio < 0.05 && block === 'ash' ? (
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
      {state.embers <= 0 ? (
        <p className="panel-empty">{t.prestige.emptyShop}</p>
      ) : readyBuys > 0 ? (
        <p className="prestige-shop-ready">{t.prestige.shopReady(readyBuys)}</p>
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
                state.ashEarned,
                state.owned,
              )
              const affordable = state.embers >= cost && !maxed && unlocked
              return {
                item,
                rank,
                maxed,
                cost,
                unlocked,
                affordable,
                priority: shopRowPriority(affordable, unlocked, maxed),
              }
            })
            .sort((a, b) => a.priority - b.priority || a.item.id.localeCompare(b.item.id))
          return (
            <section key={branch.id} className="prestige-branch" aria-labelledby={`branch-${branch.id}`}>
              <h4 id={`branch-${branch.id}`} className="prestige-branch-title">
                {branch.title}
              </h4>
              <p className="prestige-branch-blurb">{branch.blurb}</p>
              <ul className="ember-shop">
                {items.map(({ item, rank, maxed, cost, unlocked, affordable }) => {
                  const needAsh = item.rankUnlockAsh?.(rank) ?? 0
                  const needMods = item.unlockModulesOnline
                  let lockHint: string | null = null
                  if (!maxed && !unlocked) {
                    if (needMods != null && online < needMods) {
                      lockHint = t.prestige.shopModulesLocked(needMods)
                    } else if (needAsh > 0) {
                      const left = Math.max(0, needAsh - unlockProgress)
                      lockHint = t.prestige.shopRankLocked(formatAsh(left > 0 ? left : needAsh))
                    }
                  }
                  return (
                    <li
                      key={item.id}
                      className={`ember-shop-row${affordable ? ' ember-shop-row--ready' : ''}${!unlocked && !maxed ? ' ember-shop-row--locked' : ''}`}
                    >
                      <div className="ember-shop-info">
                        <div className="ember-shop-name">
                          {item.name}{' '}
                          <span className="ember-shop-rank">
                            {rank}/{item.maxRank}
                          </span>
                        </div>
                        <p className="ember-shop-blurb">{item.blurb}</p>
                        <p className="ember-shop-effect">{item.effectLabel(rank)}</p>
                        {lockHint ? (
                          <p className="ember-shop-lock muted">{lockHint}</p>
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

      {/* L3–L5 scaffold — gated teasers; no purchases yet (balance PRs). */}
      <section className="long-loop-block" aria-labelledby="long-loop-season">
        <h3 id="long-loop-season" className="subhead">
          {t.longLoop.seasonTitle}
        </h3>
        <p className="muted">{t.longLoop.seasonIntro}</p>
        <p className="prestige-stats">
          {t.longLoop.seasonLabel(state.seasonIndex + 1)}
          {' · '}
          {t.longLoop.seasonPoints(state.seasonPoints)}
          {' · '}
          {t.longLoop.sproutLabel} <strong>{state.deepEmbers}</strong>
          {' · '}
          {t.longLoop.deepRuns} <strong>{state.deepPrestiges}</strong>
        </p>
        <p className="muted">
          {deepOpen
            ? t.longLoop.gateOpen
            : t.longLoop.gateClosed(
                prestigesLeft,
                Math.round(fill * 100),
              )}
        </p>
        {deepOpen && deepPreview > 0 ? (
          <p className="prestige-stats">
            {t.prestige.nextPayout}{' '}
            <strong>
              +{deepPreview} {t.longLoop.sproutLabel.replace(':', '')}
            </strong>
          </p>
        ) : null}
        <h4 className="prestige-branch-title">{t.longLoop.deepShopTitle}</h4>
        <ul className="ember-shop long-loop-shop">
          {DEEP_SHOP.map((item) => {
            const rank = state.deepUpgrades[item.id]
            const label =
              item.id === 'deepYield'
                ? t.longLoop.deepYield
                : item.id === 'deepWatch'
                  ? t.longLoop.deepWatch
                  : t.longLoop.deepPurse
            return (
              <li key={item.id} className="ember-shop-row">
                <div className="ember-shop-info">
                  <div className="ember-shop-name">
                    {label}{' '}
                    <span className="ember-shop-rank">
                      {t.longLoop.stubRank(rank, item.maxRank)}
                    </span>
                  </div>
                  <p className="ember-shop-blurb">{t.longLoop.deepShopLocked}</p>
                </div>
                <button type="button" className="btn buy" disabled>
                  {t.longLoop.deepShopLocked}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="long-loop-block" aria-labelledby="long-loop-year">
        <h3 id="long-loop-year" className="subhead">
          {t.longLoop.yearTitle}
        </h3>
        <p className="prestige-stats">
          {t.longLoop.yearLabel(state.yearIndex + 1)}
          {' · '}
          {t.longLoop.yearProgress(state.yearSeasonsDone, YEAR_SEASONS_TARGET)}
        </p>
        <p className="muted">{t.longLoop.yearLocked}</p>
      </section>

      <section className="long-loop-block" aria-labelledby="long-loop-era">
        <h3 id="long-loop-era" className="subhead">
          {t.longLoop.eraTitle}
        </h3>
        <p className="muted">{t.longLoop.eraIntro}</p>
        <p className="prestige-stats">
          {t.longLoop.eraPoints} <strong>{state.eraPoints}</strong>
        </p>
        <p className="muted">
          {eraOpen ? t.longLoop.eraGateOpen : t.longLoop.eraGateClosed}
        </p>
        <ul className="ember-shop long-loop-shop">
          {ERA_SHOP.map((item) => {
            const rank = state.eraUpgrades[item.id]
            const label =
              item.id === 'rootYield'
                ? t.longLoop.rootYield
                : t.longLoop.rootBanner
            return (
              <li key={item.id} className="ember-shop-row">
                <div className="ember-shop-info">
                  <div className="ember-shop-name">
                    {label}{' '}
                    <span className="ember-shop-rank">
                      {t.longLoop.stubRank(rank, item.maxRank)}
                    </span>
                  </div>
                </div>
                <button type="button" className="btn buy" disabled>
                  {eraOpen ? t.longLoop.eraGateOpen : t.longLoop.eraGateClosed}
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </section>
  )
}
