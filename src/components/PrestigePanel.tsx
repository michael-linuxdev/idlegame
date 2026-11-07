import { EMBER_SHOP } from '../game/economy'
import { formatAsh } from '../game/format'
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
        <h2 id="prestige-heading">Prestige</h2>
        <p className="muted">
          Soft-reset the outpost run. Keep <strong>Plasma</strong> for permanent
          meta upgrades. Modules power down; Ore wallet clears.
        </p>
      </header>

      <div className="prestige-block">
        <p className="prestige-stats">
          Plasma: <strong>{state.embers}</strong>
          {' · '}
          Multiplier: <strong>×{multiplier.toFixed(2)}</strong>
          {' · '}
          Runs: <strong>{state.prestiges}</strong>
        </p>
        <p className="prestige-stats">
          This run: <strong>{formatAsh(state.ashEarned)}</strong> Ore
          {' · '}
          Gate: <strong>{formatAsh(prestigeMin)}</strong>
          {teaser ? (
            <>
              {' · '}
              <span className="prestige-teaser">Plasma preview +{nextPrestige}</span>
            </>
          ) : null}
        </p>
        <p className="prestige-stats">
          Next payout: <strong>+{nextPrestige}</strong> Plasma
        </p>
        <div className="prestige-bar" aria-hidden="true">
          <div
            className="prestige-bar-fill"
            style={{ width: `${Math.min(100, prestigeProgress.ratio * 100)}%` }}
          />
        </div>
        <button
          type="button"
          className="btn prestige"
          disabled={!canPrestige}
          onClick={prestige}
        >
          {canPrestige
            ? `Claim +${nextPrestige} Plasma & reset`
            : `Need ${formatAsh(Math.max(0, prestigeMin - state.ashEarned))} more Ore this run`}
        </button>
      </div>

      <h3 className="subhead">Plasma shop</h3>
      <p className="muted">Spend Plasma on permanent power. Never sold for cash.</p>
      <ul className="ember-shop">
        {EMBER_SHOP.map((item) => {
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
                {maxed ? 'Max' : `${cost} Plasma`}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
