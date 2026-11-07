import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
}

export function PrestigePanel({ game }: Props) {
  const { state, nextPrestige, canPrestige, prestige, multiplier } = game

  return (
    <section className="panel prestige-panel" aria-labelledby="prestige-heading">
      <header className="panel-header">
        <h2 id="prestige-heading">Prestige</h2>
        <p className="muted">
          Soft-reset the fortress run. Keep Dominion for a permanent production
          multiplier (+10% each). Buildings return to ruin; meta power remains.
        </p>
      </header>

      <div className="prestige-block">
        <p className="prestige-stats">
          Dominion: <strong>{state.dominion}</strong>
          {' · '}
          Multiplier: <strong>×{multiplier.toFixed(1)}</strong>
          {' · '}
          Runs: <strong>{state.prestiges}</strong>
        </p>
        <p className="prestige-stats">
          Next gain: <strong>+{nextPrestige}</strong> Dominion
        </p>
        <button
          type="button"
          className="btn prestige"
          disabled={!canPrestige}
          onClick={prestige}
        >
          {canPrestige
            ? `Claim +${nextPrestige} Dominion & reset`
            : 'Earn more Ash this run to prestige'}
        </button>
      </div>
    </section>
  )
}
