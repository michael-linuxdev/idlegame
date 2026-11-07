import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  GENERATORS,
  generatorRate,
  shortUnlockGate,
  unlockHint,
  type GeneratorId,
} from '../game/generators'
import { formatAsh, formatRate } from '../game/format'
import { computeNextGoal } from '../game/nextGoal'
import { xpFromOfflineClaim } from '../game/progression'
import { logPlaytest } from '../game/playtestLog'
import { playSfx } from '../game/sound'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'
import { activeTheme } from '../themes'
import { BuildingSilhouette } from './BuildingSilhouette'
import { DailyOpsBanner } from './DailyOpsBanner'
import { EventBanner } from './EventBanner'
import { FloatPops, type FloatPopItem } from './FloatPops'
import { MuteToggle } from './MuteToggle'
import { NextGoalStrip } from './NextGoalStrip'
import { ProgressSheet } from './ProgressSheet'
import { ThemeMapBackdrop } from './ThemeMapBackdrop'
import { UpgradeSheet } from './UpgradeSheet'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  highlightId?: string | null
}

let popSeq = 0

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
  const [claimFlash, setClaimFlash] = useState<string | null>(null)
  const [pops, setPops] = useState<FloatPopItem[]>([])
  const [levelPulse, setLevelPulse] = useState(false)
  const prevAsh = useRef(state.ash)
  const prevLevel = useRef(playerLevel.level)
  const totalMult = multiplier * levelMult * clanMult * eventMult
  const skinClass = equippedCosmetic?.accentClass ?? 'skin-steel'
  const bonusPct = ((levelMult - 1) * 100).toFixed(1)
  const questReady = game.questRows.some((q: { ready: boolean }) => q.ready)

  const pushPop = useCallback((text: string, kind?: FloatPopItem['kind']) => {
    const id = ++popSeq
    setPops((list) => [...list.slice(-4), { id, text, kind }])
  }, [])

  const removePop = useCallback((id: number) => {
    setPops((list) => list.filter((p) => p.id !== id))
  }, [])

  const nextGoal = useMemo(
    () =>
      computeNextGoal(state, {
        playerLevel: playerLevel.level,
        playerXpInto: playerLevel.intoLevel,
        playerXpNeed: playerLevel.need,
        playerXpRatio: playerLevel.ratio,
        costOf: game.costOf,
      }),
    [
      state,
      playerLevel.level,
      playerLevel.intoLevel,
      playerLevel.need,
      playerLevel.ratio,
      game.costOf,
    ],
  )

  useEffect(() => {
    if (state.ash > prevAsh.current + 0.05) {
      setTickFlash(true)
      const timer = window.setTimeout(() => setTickFlash(false), 280)
      prevAsh.current = state.ash
      return () => window.clearTimeout(timer)
    }
    prevAsh.current = state.ash
  }, [state.ash])

  useEffect(() => {
    if (playerLevel.level > prevLevel.current) {
      setLevelPulse(true)
      playSfx('level')
      logPlaytest('level_up', { level: playerLevel.level })
      pushPop(`Level ${playerLevel.level}!`, 'upgrade')
      const timer = window.setTimeout(() => setLevelPulse(false), 900)
      prevLevel.current = playerLevel.level
      return () => window.clearTimeout(timer)
    }
    prevLevel.current = playerLevel.level
  }, [playerLevel.level, pushPop])

  function claimOffline() {
    const amount = game.offlineGained ?? 0
    const xp = xpFromOfflineClaim(amount)
    game.dismissOffline()
    playSfx('claim')
    pushPop(`+${formatAsh(amount)}`, 'claim')
    const toast =
      xp > 0
        ? t.hud.claimCelebrate(formatAsh(amount), xp)
        : t.hud.claimCelebrateShort(formatAsh(amount))
    setClaimFlash(toast)
    window.setTimeout(() => setClaimFlash(null), 1600)
  }

  function onRake() {
    if (!tapReady) return
    const before = state.ash
    playSfx('tap')
    logPlaytest('schub')
    rake()
    // Burst grant lands on next state tick; optimistic pop from ~45s rate
    const estimate = Math.max(rate * 45, 1)
    pushPop(`+${formatAsh(estimate)}`, 'gain')
    void before
  }

  function onGoalActivate() {
    if (nextGoal.kind === 'prestige') {
      /* Prestige lives on its own tab — strip still shows pressure */
      return
    }
    if (nextGoal.kind === 'level') {
      setProgressOpen(true)
      return
    }
    if (nextGoal.focusId) {
      setSelected(nextGoal.focusId)
    }
  }

  function onUpgradeBought(deltaCost: number) {
    playSfx('upgrade')
    pushPop(`−${formatAsh(deltaCost)}`, 'upgrade')
  }

  return (
    <section className="fortress-home" aria-labelledby="ash-heading">
      <h1 id="ash-heading" className="sr-only">
        {t.brand}
      </h1>
      {/* Clash HUD: floating chips only — no white card tiles */}
      <header className="map-hud">
        <button
          type="button"
          className={`hud-chip level${questReady ? ' has-claim' : ''}${levelPulse ? ' level-up' : ''}`}
          onClick={() => setProgressOpen(true)}
          aria-label={t.hud.playerLevelAria(
            playerLevel.level,
            playerLevel.intoLevel,
            playerLevel.need,
          )}
        >
          <span className="hud-chip-title">
            {t.level.label} {playerLevel.level}
          </span>
          <span className="hud-chip-bar" aria-hidden="true">
            <span
              className="hud-chip-fill"
              style={{ width: `${Math.round(playerLevel.ratio * 100)}%` }}
            />
          </span>
          <span className="hud-chip-meta">
            {playerLevel.intoLevel}/{playerLevel.need}
            {levelMult > 1 ? ` · ${t.level.bonus(bonusPct)}` : ''}
          </span>
        </button>

        <div className="hud-chip resources" aria-live="polite">
          <div className={`hud-res-main${tickFlash ? ' ticking' : ''}`}>
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
          <div className="hud-res-meta">
            {state.embers > 0 ? (
              <span className="embers-line">
                {state.embers} {t.resources.credits}
              </span>
            ) : null}
            <span className="obsidian-line">
              {state.obsidian} {t.resources.obsidian}
            </span>
            <MuteToggle />
          </div>
        </div>

        <NextGoalStrip goal={nextGoal} onActivate={onGoalActivate} />

        {tapReady ? (
          <button
            type="button"
            className="btn rake pulse-ready hud-schub"
            onClick={onRake}
            title={t.hud.burstReadyTitle}
          >
            {t.hud.burstReady}
          </button>
        ) : null}
      </header>

      <FloatPops items={pops} onDone={removePop} />

      {game.offlineGained != null ? (
        <div
          className={`banner offline map-banner claim-fab celebrate${highlightId === 'offline' ? ' ftue-target' : ''}`}
          role="status"
        >
          {/* Map-mode: single Abholen CTA only — no kicker ghost text */}
          <div className="banner-copy claim-detail">
            <p>
              {t.hud.offlineBefore}{' '}
              <strong className="offline-amount">
                {formatAsh(game.offlineGained)}
              </strong>{' '}
              {t.hud.offlineAfter}
            </p>
          </div>
          <button
            type="button"
            className="btn buy claim-cta pulse-ready"
            onClick={claimOffline}
            aria-label={`${t.hud.claim}: ${formatAsh(game.offlineGained)} ${t.resources.compute}`}
          >
            {t.hud.claim}
          </button>
        </div>
      ) : null}

      {claimFlash ? (
        <div className="claim-toast celebrate" role="status">
          {claimFlash}
        </div>
      ) : null}

      {/* One Abholen row: offline claim wins over daily chip */}
      {game.offlineGained == null ? (
        <DailyOpsBanner game={game} onClaimed={() => playSfx('streak')} />
      ) : null}
      <EventBanner game={game} />

      <div className={`fortress-stage ${skinClass} ${activeTheme.mapClass}`}>
        <div
          className="fortress-map slots-10"
          role="application"
          aria-label={t.hud.mapAria}
          onContextMenu={(e) => e.preventDefault()}
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
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              >
                <BuildingSilhouette
                  kind={def.silhouette}
                  level={level}
                  locked={!unlocked}
                  producing={producing}
                  selected={selectedHere}
                />
                {/* Locked: tiny chip until selected — kills GESPERRT plaque piles */}
                {unlocked || selectedHere ? (
                  <span className="map-building-label">
                    <span className="map-building-name">{def.name}</span>
                    <span className="map-building-meta">
                      {unlocked ? (
                        <>
                          <span className="map-building-lvl">
                            {t.hud.levelShort(level)}
                          </span>
                          {producing || selectedHere ? (
                            <span className="map-building-rate">
                              {formatRate(buildingRate)}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <span className="map-building-lock-line">
                          <span className="map-building-lock">{t.hud.locked}</span>
                          <span className="map-building-gate" aria-hidden="true">
                            ·
                          </span>
                          <span className="map-building-gate">
                            {shortUnlockGate(def)}
                          </span>
                        </span>
                      )}
                    </span>
                  </span>
                ) : (
                  <span className="map-building-lock-chip" aria-hidden="true" />
                )}
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
          onUpgraded={onUpgradeBought}
        />
      ) : null}

      {progressOpen ? (
        <ProgressSheet game={game} onClose={() => setProgressOpen(false)} />
      ) : null}
    </section>
  )
}
