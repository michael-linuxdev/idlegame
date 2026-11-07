import { useEffect, useRef, useState } from 'react'
import {
  GENERATORS,
  generatorRate,
  shortUnlockGate,
  unlockHint,
  type GeneratorId,
} from '../game/generators'
import { formatAsh, formatRate } from '../game/format'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'
import { activeTheme } from '../themes'
import { BuildingSilhouette } from './BuildingSilhouette'
import { DailyOpsBanner } from './DailyOpsBanner'
import { EventBanner } from './EventBanner'
import { ProgressSheet } from './ProgressSheet'
import { ThemeMapBackdrop } from './ThemeMapBackdrop'
import { UpgradeSheet } from './UpgradeSheet'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  highlightId?: string | null
}

export function FortressMap({ game, highlightId }: Props) {
  const {
    state,
    rate,
    multiplier,
    levelMult,
    clanMult,
    eventMult,
    rake,
    tapReady,
    equippedCosmetic,
    playerLevel,
  } = game
  const [selected, setSelected] = useState<GeneratorId | null>(null)
  const [progressOpen, setProgressOpen] = useState(false)
  const [tickFlash, setTickFlash] = useState(false)
  const [claimFlash, setClaimFlash] = useState(false)
  const prevAsh = useRef(state.ash)
  const totalMult = multiplier * levelMult * clanMult * eventMult
  const skinClass = equippedCosmetic?.accentClass ?? 'skin-steel'
  const bonusPct = ((levelMult - 1) * 100).toFixed(1)
  const questReady = game.questRows.some((q: { ready: boolean }) => q.ready)

  useEffect(() => {
    if (state.ash > prevAsh.current + 0.05) {
      setTickFlash(true)
      const timer = window.setTimeout(() => setTickFlash(false), 280)
      prevAsh.current = state.ash
      return () => window.clearTimeout(timer)
    }
    prevAsh.current = state.ash
  }, [state.ash])

  function claimOffline() {
    game.dismissOffline()
    setClaimFlash(true)
    window.setTimeout(() => setClaimFlash(false), 900)
  }

  return (
    <section className="fortress-home" aria-labelledby="ash-heading">
      <header className="map-hud">
        <div className="map-hud-brand">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 id="ash-heading" className="brand wordmark">
            {t.brand}
          </h1>
          <button
            type="button"
            className={`player-level-chip${questReady ? ' has-claim' : ''}`}
            onClick={() => setProgressOpen(true)}
            aria-label={t.hud.playerLevelAria(
              playerLevel.level,
              playerLevel.intoLevel,
              playerLevel.need,
            )}
          >
            <span className="player-level-num">
              {t.level.label} {playerLevel.level}
            </span>
            <span className="player-level-track" aria-hidden="true">
              <span
                className="player-level-fill"
                style={{ width: `${Math.round(playerLevel.ratio * 100)}%` }}
              />
            </span>
            <span className="player-level-meta">
              {playerLevel.intoLevel}/{playerLevel.need} {t.level.xp}
              {levelMult > 1 ? ` · ${t.level.bonus(bonusPct)}` : ''}
            </span>
          </button>
        </div>
        <div className="map-hud-metrics" aria-live="polite">
          <div className={`hud-metric-chip${tickFlash ? ' ticking' : ''}`}>
            <div className="ash-amount compact">
              <span className={`ash-value${tickFlash ? ' tick' : ''}`}>
                {formatAsh(state.ash)}
              </span>
              <span className="ash-label">{t.resources.compute}</span>
            </div>
            <p className="rate-line">
              {formatRate(rate)}
              {totalMult > 1 ? (
                <span className="mult"> · ×{totalMult.toFixed(2)}</span>
              ) : null}
            </p>
          </div>
          <div className="hud-meta-row">
            {state.embers > 0 ? (
              <p className="embers-line">
                {state.embers} {t.resources.credits}
              </p>
            ) : null}
            <p className="obsidian-line">
              {state.obsidian} {t.resources.obsidian}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn rake"
          onClick={rake}
          disabled={!tapReady}
          title={tapReady ? t.hud.burstReadyTitle : t.hud.burstCoolingTitle}
        >
          {tapReady ? t.hud.burstReady : t.hud.burstCooling}
        </button>
      </header>

      {game.offlineGained != null ? (
        <div
          className={`banner offline map-banner${highlightId === 'offline' ? ' ftue-target' : ''}`}
          role="status"
        >
          <p>
            {t.hud.offlineBefore}{' '}
            <strong>{formatAsh(game.offlineGained)}</strong> {t.hud.offlineAfter}
          </p>
          <button type="button" className="btn buy claim-cta" onClick={claimOffline}>
            {t.hud.claim}
          </button>
        </div>
      ) : null}

      {claimFlash ? (
        <div className="claim-toast" role="status">
          {t.hud.claimToast}
        </div>
      ) : null}

      <DailyOpsBanner game={game} />
      <EventBanner game={game} />

      <div className={`fortress-stage ${skinClass} ${activeTheme.mapClass}`}>
        <div
          className="fortress-map slots-10"
          role="application"
          aria-label={t.hud.mapAria}
        >
          <ThemeMapBackdrop />

          {GENERATORS.map((def) => {
            const level = state.owned[def.id] ?? 0
            const unlocked = game.unlocked(def.id)
            const selectedHere = selected === def.id
            const buildingRate =
              unlocked && level > 0 ? generatorRate(def, level) * totalMult : 0
            const producing = buildingRate > 0
            const hint = !unlocked ? unlockHint(def) : ''
            const hl = highlightId === def.id
            return (
              <button
                key={def.id}
                type="button"
                className={`map-building${selectedHere ? ' selected' : ''}${level > 0 && unlocked ? ' raised' : ''}${!unlocked ? ' locked' : ''}${producing ? ' producing' : ''}${hl ? ' ftue-target' : ''}`}
                style={{ left: def.slot.left, top: def.slot.top }}
                aria-label={
                  unlocked
                    ? t.hud.buildingAriaUnlocked(
                        def.name,
                        level,
                        formatRate(buildingRate),
                      )
                    : t.hud.buildingAriaLocked(def.name, hint)
                }
                aria-pressed={selectedHere}
                onClick={() => setSelected(def.id)}
              >
                <BuildingSilhouette
                  kind={def.silhouette}
                  level={level}
                  locked={!unlocked}
                  producing={producing}
                  selected={selectedHere}
                />
                <span className="map-building-label">
                  <span className="map-building-name">{def.name}</span>
                  <span className="map-building-meta">
                    {unlocked ? (
                      <>
                        <span className="map-building-lvl">
                          {t.hud.levelShort(level)}
                        </span>
                        <span className="map-building-rate">
                          {formatRate(buildingRate)}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="map-building-lock">{t.hud.locked}</span>
                        <span className="map-building-gate">
                          {shortUnlockGate(def)}
                        </span>
                      </>
                    )}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
        <p className="map-hint">{t.hud.mapHint}</p>
      </div>

      {selected ? (
        <UpgradeSheet
          game={game}
          selectedId={selected}
          onClose={() => setSelected(null)}
        />
      ) : null}

      {progressOpen ? (
        <ProgressSheet game={game} onClose={() => setProgressOpen(false)} />
      ) : null}
    </section>
  )
}
