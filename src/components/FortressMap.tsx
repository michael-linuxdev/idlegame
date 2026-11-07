import { useState } from 'react'
import {
  GENERATORS,
  generatorRate,
  unlockHint,
  type GeneratorId,
} from '../game/generators'
import { formatAsh, formatRate } from '../game/format'
import type { useGame } from '../game/useGame'
import { BuildingSilhouette } from './BuildingSilhouette'
import { UpgradeSheet } from './UpgradeSheet'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  highlightId?: string | null
}

export function FortressMap({ game, highlightId }: Props) {
  const { state, rate, multiplier, rake, tapReady } = game
  const [selected, setSelected] = useState<GeneratorId | null>(null)

  return (
    <section className="fortress-home" aria-labelledby="ash-heading">
      <header className="map-hud">
        <div className="map-hud-brand">
          <p className="eyebrow">Tech · Ops</p>
          <h1 id="ash-heading" className="brand wordmark">
            Orbit Rack
          </h1>
        </div>
        <div className="map-hud-metrics" aria-live="polite">
          <div className="ash-amount compact">
            <span className="ash-value">{formatAsh(state.ash)}</span>
            <span className="ash-label">Compute</span>
          </div>
          <p className="rate-line">
            {formatRate(rate)}
            {multiplier > 1 ? (
              <span className="mult"> · ×{multiplier.toFixed(2)}</span>
            ) : null}
          </p>
          {state.embers > 0 ? (
            <p className="embers-line">{state.embers} Credits</p>
          ) : null}
        </div>
        <button
          type="button"
          className="btn rake compact"
          onClick={rake}
          disabled={!tapReady}
          title={
            tapReady
              ? 'Claim ~45s of current rate (once per 5 min)'
              : 'Tap bonus cooling down'
          }
        >
          {tapReady ? 'Burst cycle' : 'Burst cooling'}
        </button>
      </header>

      {game.offlineGained != null ? (
        <div
          className={`banner offline map-banner${highlightId === 'offline' ? ' ftue-target' : ''}`}
          role="status"
        >
          <p>
            While you were away, the station banked{' '}
            <strong>{formatAsh(game.offlineGained)}</strong> Compute.
          </p>
          <button type="button" className="btn ghost" onClick={game.dismissOffline}>
            Claim
          </button>
        </div>
      ) : null}

      <div className="fortress-stage">
        <div className="fortress-map" role="application" aria-label="Station build map">
          <div className="map-terrain" aria-hidden="true">
            <div className="map-grid" />
            <div className="map-ridge" />
            <div className="map-walls">
              <span className="wall-segment north" />
              <span className="wall-segment east" />
              <span className="wall-segment south" />
              <span className="wall-segment west" />
              <span className="wall-tower nw" />
              <span className="wall-tower ne" />
              <span className="wall-tower sw" />
              <span className="wall-tower se" />
              <span className="wall-gate" />
            </div>
            <div className="map-keep-silhouette" />
            <div className="map-forge-glow" />
            <div className="map-haze" />
          </div>

          {GENERATORS.map((def) => {
            const level = state.owned[def.id] ?? 0
            const unlocked = game.unlocked(def.id)
            const selectedHere = selected === def.id
            const buildingRate =
              unlocked && level > 0 ? generatorRate(def, level) * multiplier : 0
            const hint = !unlocked ? unlockHint(def) : ''
            const hl = highlightId === def.id
            return (
              <button
                key={def.id}
                type="button"
                className={`map-building${selectedHere ? ' selected' : ''}${level > 0 && unlocked ? ' raised' : ''}${!unlocked ? ' locked' : ''}${hl ? ' ftue-target' : ''}`}
                style={{ left: def.slot.left, top: def.slot.top }}
                aria-label={
                  unlocked
                    ? `${def.name}, level ${level}, ${formatRate(buildingRate)}. Tap to upgrade.`
                    : `${def.name}, locked. ${hint}`
                }
                onClick={() => setSelected(def.id)}
              >
                <BuildingSilhouette
                  kind={def.silhouette}
                  level={level}
                  locked={!unlocked}
                />
                <span className="map-building-label">
                  <span className="map-building-name">{def.name}</span>
                  <span className="map-building-meta">
                    {unlocked ? (
                      <>
                        <span className="map-building-lvl">Lv {level}</span>
                        <span className="map-building-rate">{formatRate(buildingRate)}</span>
                      </>
                    ) : (
                      <span className="map-building-lock">Locked</span>
                    )}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
        <p className="map-hint">Tap a module to bring it online or upgrade it.</p>
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
