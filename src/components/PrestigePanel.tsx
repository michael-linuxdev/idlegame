import { EMBER_SHOP, PRESTIGE_BRANCHES } from '../game/economy'
import { formatAsh } from '../game/format'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  highlight?: boolean
}

export function PrestigePanel({ game, highlight }: Props) {
  const { state, nextPrestige, canPrestige, prestige, multiplier, prestigeMin, prestigeProgress } =
    game
  const teaser = prestigeProgress.ratio >= 0.5 && !canPrestige

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
          {teaser ? (
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

        {!canPrestige && prestigeProgress.ratio < 0.05 ? (
          <p className="panel-empty">{t.prestige.emptyGate}</p>
        ) : null}
        <button
          type="button"
          className="btn prestige"
          disabled={!canPrestige}
          onClick={prestige}
        >
          {canPrestige
            ? t.prestige.claimReset(nextPrestige)
            : t.prestige.needMore(
                formatAsh(Math.max(0, prestigeMin - state.ashEarned)),
              )}
        </button>
      </div>

      <h3 className="subhead">{t.prestige.shopTitle}</h3>
      <p className="muted">{t.prestige.shopIntro}</p>
      {state.embers <= 0 ? (
        <p className="panel-empty">{t.prestige.emptyShop}</p>
      ) : null}

      <div className="prestige-tree">
        {PRESTIGE_BRANCHES.map((branch) => {
          const items = EMBER_SHOP.filter((item) => item.branch === branch.id)
          return (
            <section key={branch.id} className="prestige-branch" aria-labelledby={`branch-${branch.id}`}>
              <h4 id={`branch-${branch.id}`} className="prestige-branch-title">
                {branch.title}
              </h4>
              <p className="prestige-branch-blurb">{branch.blurb}</p>
              <ul className="ember-shop">
                {items.map((item) => {
                  const rank = state.emberUpgrades[item.id]
                  const maxed = rank >= item.maxRank
                  const cost = item.cost(rank)
                  const affordable = state.embers >= cost && !maxed
                  return (
                    <li key={item.id} className="ember-shop-row">
                      <div className="ember-shop-info">
                        <div className="ember-shop-name">
                          {item.name}{' '}
                          <span className="ember-shop-rank">
                            {rank}/{item.maxRank}
                          </span>
                        </div>
                        <p className="ember-shop-blurb">{item.blurb}</p>
                        <p className="ember-shop-effect">{item.effectLabel(rank)}</p>
                      </div>
                      <button
                        type="button"
                        className="btn buy"
                        disabled={!affordable}
                        onClick={() => game.buyMeta(item.id)}
                      >
                        {maxed ? t.prestige.max : t.prestige.costCredits(cost)}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </section>
  )
}
