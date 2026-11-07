import { useState } from 'react'
import { GENERATORS, type GeneratorId } from '../game/generators'
import { formatAsh, formatRate } from '../game/format'
import type { useGame } from '../game/useGame'
import { BuildingSilhouette } from './BuildingSilhouette'
import { UpgradeSheet } from './UpgradeSheet'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
}

export function FortressMap({ game }: Props) {
  const { state, rate, multiplier, rake } = game
  const [selected, setSelected] = useState<GeneratorId | null>(null)

  return (
    <section className="fortress-home" aria-labelledby="ash-heading">
      <header className="map-hud">
        <div className="map-hud-brand">
          <p className="eyebrow">Regent of the Ash Legion</p>
          <h1 id="ash-heading" className="brand wordmark">
            Ash Dominion
          </h1>
        </div>
        <div className="map-hud-metrics" aria-live="polite">
          <div className="ash-amount compact">
            <span className="ash-value">{formatAsh(state.ash)}</span>
            <span className="ash-label">Ash</span>
          </div>
          <p className="rate-line">
            {formatRate(rate)}
            {multiplier > 1 ? (
              <span className="mult"> · ×{multiplier.toFixed(1)}</span>
            ) : null}
          </p>
        </div>
        <button type="button" className="btn rake compact" onClick={rake}>
          Rake embers
        </button>
      </header>

      {game.offlineGained != null ? (
        <div className="banner offline map-banner" role="status">
          <p>
            While you were away, the fortress gathered{' '}
            <strong>{formatAsh(game.offlineGained)}</strong> Ash.
          </p>
          <button type="button" className="btn ghost" onClick={game.dismissOffline}>
            Continue
          </button>
        </div>
      ) : null}

      <div className="fortress-stage">
        <div className="fortress-map" role="application" aria-label="Fortress build map">
          <div className="map-terrain" aria-hidden="true">
            <div className="map-grid" />
            <div className="map-ridge" />
            <div className="map-keep" />
            <div className="map-haze" />
          </div>

          {GENERATORS.map((def) => {
            const level = state.owned[def.id] ?? 0
            const selectedHere = selected === def.id
            const buildingRate = level * def.baseRate * multiplier
            return (
              <button
                key={def.id}
                type="button"
                className={`map-building${selectedHere ? ' selected' : ''}${level > 0 ? ' raised' : ''}`}
                style={{ left: def.slot.left, top: def.slot.top }}
                aria-label={`${def.name}, level ${level}, ${formatRate(buildingRate)}. Tap to upgrade.`}
                onClick={() => setSelected(def.id)}
              >
                <BuildingSilhouette kind={def.silhouette} level={level} />
                <span className="map-building-label">
                  <span className="map-building-name">{def.name}</span>
                  <span className="map-building-meta">
                    <span className="map-building-lvl">Lv {level}</span>
                    <span className="map-building-rate">{formatRate(buildingRate)}</span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
        <p className="map-hint">Tap a building to raise or upgrade it.</p>
      </div>

      {selected ? (
        <UpgradeSheet
          game={game}
          selectedId={selected}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </section>
  )
}
