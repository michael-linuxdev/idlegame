import {
  GENERATORS,
  generatorRate,
  unlockHint,
  type GeneratorId,
} from '../game/generators'
import { formatAsh, formatRate } from '../game/format'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  selectedId: GeneratorId
  onClose: () => void
}

export function UpgradeSheet({ game, selectedId, onClose }: Props) {
  const def = GENERATORS.find((g) => g.id === selectedId)
  if (!def) return null

  const owned = game.state.owned[def.id] ?? 0
  const unlocked = game.unlocked(def.id)
  const cost = game.costOf(def.id)
  const affordable = unlocked && game.state.ash >= cost
  const lineRate = generatorRate(def, owned) * game.multiplier
  const nextRate = generatorRate(def, owned + 1) * game.multiplier
  const milestoneNext = owned > 0 && (owned + 1) % 10 === 0

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <header className="sheet-header">
          <h2 id="upgrade-title">{def.name}</h2>
          <button type="button" className="btn ghost sheet-close" onClick={onClose}>
            Close
          </button>
        </header>
        <p className="muted">{def.blurb}</p>
        {unlocked ? (
          <>
            <p className="sheet-stats">
              Level <strong>{owned}</strong>
              {' · '}
              {formatRate(lineRate)} now
              {' · '}
              next {formatRate(nextRate)}
            </p>
            {milestoneNext ? (
              <p className="muted">Next level hits a +2% milestone on this line.</p>
            ) : null}
            <button
              type="button"
              className="btn buy sheet-buy"
              disabled={!affordable}
              onClick={() => game.buy(def.id)}
            >
              {owned === 0 ? 'Online' : 'Upgrade'} · {formatAsh(cost)} Compute
            </button>
          </>
        ) : (
          <>
            <p className="sheet-stats sheet-locked-hint">{unlockHint(def)}</p>
            <button type="button" className="btn buy sheet-buy" disabled>
              Locked
            </button>
          </>
        )}
      </div>
    </div>
  )
}
