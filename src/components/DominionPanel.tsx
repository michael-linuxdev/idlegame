import { GENERATORS, generatorCost } from '../game/generators'
import { formatAsh, formatRate } from '../game/format'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
}

export function DominionPanel({ game }: Props) {
  const {
    state,
    rate,
    multiplier,
    nextPrestige,
    canPrestige,
    rake,
    buy,
    prestige,
  } = game

  return (
    <section className="panel dominion-panel" aria-labelledby="ash-heading">
      <header className="resource-hero">
        <p className="eyebrow">Regent of the Ash Legion</p>
        <h1 id="ash-heading" className="brand">
          Ash Dominion
        </h1>
        <p className="ash-amount" aria-live="polite">
          <span className="ash-value">{formatAsh(state.ash)}</span>
          <span className="ash-label">Ash</span>
        </p>
        <p className="rate-line">
          {formatRate(rate)}
          {multiplier > 1 ? (
            <span className="mult"> · ×{multiplier.toFixed(1)} dominion</span>
          ) : null}
        </p>
        <button type="button" className="btn rake" onClick={rake}>
          Rake embers
        </button>
      </header>

      {game.offlineGained != null ? (
        <div className="banner offline" role="status">
          <p>
            While you were away, the legion gathered{' '}
            <strong>{formatAsh(game.offlineGained)}</strong> Ash.
          </p>
          <button type="button" className="btn ghost" onClick={game.dismissOffline}>
            Continue
          </button>
        </div>
      ) : null}

      <h2 className="subhead">Generators</h2>
      <ul className="generator-list">
        {GENERATORS.map((def) => {
          const owned = state.owned[def.id] ?? 0
          const cost = generatorCost(def, owned)
          const affordable = state.ash >= cost
          const unitRate = def.baseRate * multiplier
          return (
            <li key={def.id} className="generator">
              <div className="generator-info">
                <div className="generator-title">
                  <span className="generator-name">{def.name}</span>
                  <span className="generator-owned">×{owned}</span>
                </div>
                <p className="generator-blurb">{def.blurb}</p>
                <p className="generator-rate">
                  {formatRate(unitRate)} each · {formatRate(unitRate * owned)} total
                </p>
              </div>
              <button
                type="button"
                className="btn buy"
                disabled={!affordable}
                onClick={() => buy(def.id)}
              >
                Buy · {formatAsh(cost)}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="prestige-block">
        <h2 className="subhead">Prestige</h2>
        <p className="muted">
          Soft-reset the run. Keep Dominion for a permanent production multiplier
          (+10% each). Gain based on Ash earned this run.
        </p>
        <p className="prestige-stats">
          Dominion: <strong>{state.dominion}</strong> · Runs:{' '}
          <strong>{state.prestiges}</strong> · Next gain:{' '}
          <strong>+{nextPrestige}</strong>
        </p>
        <button
          type="button"
          className="btn prestige"
          disabled={!canPrestige}
          onClick={prestige}
        >
          {canPrestige
            ? `Claim +${nextPrestige} Dominion & reset`
            : 'Earn more Ash to prestige'}
        </button>
      </div>
    </section>
  )
}
