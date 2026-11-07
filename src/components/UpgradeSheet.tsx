import { useState } from 'react'
import {
  GENERATORS,
  generatorRate,
  unlockHint,
  type GeneratorId,
} from '../game/generators'
import { efficiencyMult, type BranchKind } from '../game/branches'
import { formatAsh, formatRate } from '../game/format'
import { playSfx } from '../game/sound'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  selectedId: GeneratorId
  onClose: () => void
  onUpgraded?: (cost: number) => void
}

export function UpgradeSheet({ game, selectedId, onClose, onUpgraded }: Props) {
  const def = GENERATORS.find((g) => g.id === selectedId)
  const [flash, setFlash] = useState(false)
  if (!def) return null

  const owned = game.state.owned[def.id] ?? 0
  const unlocked = game.unlocked(def.id)
  const cost = game.costOf(def.id)
  const affordable = unlocked && game.state.ash >= cost
  const branch = game.state.branches[def.id] ?? { efficiency: 0, capacity: 0 }
  const lineMult =
    game.multiplier * game.levelMult * game.clanMult * game.eventMult
  const eff = efficiencyMult(branch.efficiency)
  const lineRate = generatorRate(def, owned) * lineMult * eff
  const nextRate = generatorRate(def, owned + 1) * lineMult * eff
  const affordRatio =
    cost > 0 ? Math.min(1, game.state.ash / cost) : unlocked ? 1 : 0
  const actionLabel = owned === 0 ? t.upgrade.online : t.upgrade.upgrade
  const flavor =
    def.blurb.length > 78 ? `${def.blurb.slice(0, 75).trimEnd()}…` : def.blurb

  function buyBranch(kind: BranchKind) {
    game.buyModuleBranch(selectedId, kind)
    playSfx('upgrade')
  }

  function buyUpgrade() {
    if (!affordable) return
    const paid = cost
    game.buy(def!.id)
    setFlash(true)
    window.setTimeout(() => setFlash(false), 420)
    onUpgraded?.(paid)
  }

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <div
        className={`sheet sheet-compact sheet-hud${flash ? ' upgrade-flash' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <header className="sheet-header sheet-header-hud">
          <div className="sheet-heading">
            <h2 id="upgrade-title">{def.name}</h2>
            {unlocked ? (
              <p className="sheet-blurb" title={def.blurb}>
                {flavor}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="sheet-close-x"
            onClick={onClose}
            aria-label={t.upgrade.close}
          >
            ×
          </button>
        </header>

        {unlocked ? (
          <>
            <p className="sheet-stats sheet-stats-hud">
              {t.upgrade.level} {owned}
              {' · '}
              {formatRate(lineRate)}
              {' → '}
              {formatRate(nextRate)}
            </p>
            <div className="upgrade-afford-track" aria-hidden="true">
              <span
                className={`upgrade-afford-fill${affordable ? ' ready' : ''}`}
                style={{ width: `${Math.round(affordRatio * 100)}%` }}
              />
            </div>
            <div className="sheet-cta">
              <button
                type="button"
                className={`btn buy sheet-buy sheet-buy-hud${affordable ? ' pulse-ready' : ''}${flash ? ' just-bought' : ''}`}
                disabled={!affordable}
                onClick={buyUpgrade}
              >
                {t.upgrade.costLine(actionLabel, formatAsh(cost))}
              </button>
            </div>

            {owned >= 1 ? (
              <div className="branch-block branch-block-hud">
                <h3 className="branch-title">{t.branches.title}</h3>
                <BranchRow
                  kind="efficiency"
                  rank={branch.efficiency}
                  max={game.branchMaxRank}
                  cost={game.branchCostOf(def.id, 'efficiency')}
                  ash={game.state.ash}
                  onBuy={() => buyBranch('efficiency')}
                />
                <BranchRow
                  kind="capacity"
                  rank={branch.capacity}
                  max={game.branchMaxRank}
                  cost={game.branchCostOf(def.id, 'capacity')}
                  ash={game.state.ash}
                  onBuy={() => buyBranch('capacity')}
                />
              </div>
            ) : null}
          </>
        ) : (
          <div className="sheet-empty-block">
            <p className="sheet-stats sheet-locked-hint">{unlockHint(def)}</p>
            <div className="sheet-cta">
              <button type="button" className="btn buy sheet-buy sheet-buy-hud" disabled>
                {t.upgrade.locked}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BranchRow({
  kind,
  rank,
  max,
  cost,
  ash,
  onBuy,
}: {
  kind: BranchKind
  rank: number
  max: number
  cost: number
  ash: number
  onBuy: () => void
}) {
  const maxed = rank >= max
  const name = kind === 'efficiency' ? t.branches.efficiency : t.branches.capacity
  const perRank =
    kind === 'efficiency'
      ? t.branches.efficiencyPerRank
      : t.branches.capacityPerRank
  const total =
    kind === 'efficiency'
      ? t.branches.efficiencyEffect(rank * 4)
      : t.branches.capacityEffect(Math.pow(0.97, rank).toFixed(3))

  return (
    <div className="branch-row compact">
      <p className="branch-hud">
        <strong className="branch-name">{name}</strong>
        <span className="branch-rank">{rank}/{max}</span>
        <span className="branch-sep" aria-hidden="true">
          ·
        </span>
        <span className="branch-per">{perRank}</span>
        <span className="branch-sep" aria-hidden="true">
          ·
        </span>
        <span className="branch-effect">{total}</span>
      </p>
      {maxed ? (
        <span className="quest-badge">{t.branches.maxed}</span>
      ) : (
        <button
          type="button"
          className="btn ghost branch-buy"
          disabled={ash < cost}
          onClick={onBuy}
          title={t.upgrade.costLine(name, formatAsh(cost))}
        >
          {t.upgrade.costLine(name, formatAsh(cost))}
        </button>
      )}
    </div>
  )
}
