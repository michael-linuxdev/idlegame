import {
  GENERATORS,
  generatorRate,
  unlockHint,
  type GeneratorId,
} from '../game/generators'
import { formatAsh, formatRate } from '../game/format'
import { t } from '../i18n'
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
          <div>
            <p className="eyebrow">{t.upgrade.moduleEyebrow}</p>
            <h2 id="upgrade-title">{def.name}</h2>
          </div>
          <button type="button" className="btn ghost sheet-close" onClick={onClose}>
            {t.upgrade.close}
          </button>
        </header>
        <p className="muted">{def.blurb}</p>
        {unlocked ? (
          <>
            <p className="sheet-stats">
              {t.upgrade.level} <strong>{owned}</strong>
              {' · '}
              {formatRate(lineRate)} {t.upgrade.now}
              {' · '}
              {t.upgrade.next} {formatRate(nextRate)}
            </p>
            {milestoneNext ? (
              <p className="muted">{t.upgrade.milestone}</p>
            ) : null}
            {owned === 0 ? (
              <p className="sheet-empty">{t.upgrade.offlineEmpty}</p>
            ) : null}
            <button
              type="button"
              className="btn buy sheet-buy"
              disabled={!affordable}
              onClick={() => game.buy(def.id)}
            >
              {t.upgrade.costLine(
                owned === 0 ? t.upgrade.online : t.upgrade.upgrade,
                formatAsh(cost),
              )}
            </button>
          </>
        ) : (
          <div className="sheet-empty-block">
            <p className="sheet-stats sheet-locked-hint">{unlockHint(def)}</p>
            <p className="sheet-empty">{t.upgrade.gateClosed}</p>
            <button type="button" className="btn buy sheet-buy" disabled>
              {t.upgrade.locked}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
