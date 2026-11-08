import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { computeBestBuy } from '../game/bestBuy'
import {
  countAffordableEmberBuys,
  countAffordableEmberBuysAfterPrestige,
  emberPayout,
  modulesToNextEmberUnlock,
  postPrestigeStartOwned,
} from '../game/economy'
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
import {
  PRESTIGE_SPIKE_RATIOS,
  type SurpriseKind,
} from '../game/surpriseJumps'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'
import type { Tab } from './AppNav'
import { BestBuyChip } from './BestBuyChip'
import { ModuleArt } from '../theme/ModuleArt'
import { ClearedPlot, WildPlot } from '../theme/PlotArt'
import { DailyOpsBanner } from './DailyOpsBanner'
import { EventBanner } from './EventBanner'
import { FlashEventBanner } from './FlashEventBanner'
import { FloatPops, type FloatPopItem } from './FloatPops'
import { MuteToggle } from './MuteToggle'
import { NextGoalStrip } from './NextGoalStrip'
import { ProgressSheet } from './ProgressSheet'
import { MapBackdrop } from '../theme/MapBackdrop'
import { UpgradeSheet } from './UpgradeSheet'

function surpriseLabel(kind: SurpriseKind, amount: string): string {
  switch (kind) {
    case 'milestone':
      return t.surprise.milestone(amount)
    case 'jackpot':
      return t.surprise.jackpot(amount)
    case 'prestigeNear':
      return t.surprise.prestigeNear(amount)
    case 'offlineJackpot':
      return t.surprise.offlineJackpot(amount)
  }
}

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  highlightId?: string | null
  onOpenTab?: (tab: Tab) => void
}

let popSeq = 0

export function GardenMap({ game, highlightId, onOpenTab }: Props) {
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
    ackSurprise,
    nextPrestige,
    canPrestige,
    prestigeProgress,
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
  const skinClass = equippedCosmetic?.accentClass ?? 'skin-wiese'
  const gardenStage = GENERATORS.filter(
    (g) => (state.owned[g.id] ?? 0) > 0 && game.unlocked(g.id),
  ).length
  /** Only the next wild corner shows its sign — keeps the map calm. */
  const nextWildId = GENERATORS.find((g) => !game.unlocked(g.id))?.id ?? null
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

  const bestBuy = useMemo(
    () =>
      computeBestBuy(state, {
        playerLevel: playerLevel.level,
        ratePerSec: rate,
        costOf: game.costOf,
      }),
    [state, playerLevel.level, rate, game.costOf],
  )

  // After Soft-Prestige the map remounts when the player leaves the Münzen
  // tab — open the affordable Ausbauen HUD immediately so the CTA is never
  // "missing" behind tip-exhausted shop confusion.
  useEffect(() => {
    if (!game.postPrestigeFocus) return
    const id =
      bestBuy?.affordable && bestBuy.id
        ? bestBuy.id
        : ('gemuesebeet' satisfies GeneratorId)
    setSelected(id)
    game.clearPostPrestigeFocus()
  }, [game.postPrestigeFocus, game.clearPostPrestigeFocus, bestBuy])

  /** Map CTA: spend leftover Münzen, or honest prestige preview (never false „lohnt sich“). */
  const prestigeCta = useMemo(() => {
    const readyBuys = countAffordableEmberBuys(
      state.emberUpgrades,
      state.embers,
      state.ashEarned,
      state.owned,
      state.prestiges,
    )
    if (readyBuys > 0 && state.embers > 0) {
      return {
        ready: true,
        embers: state.embers,
        label: t.prestige.spendCta(readyBuys),
        aria: t.prestige.spendAria,
        spend: true,
      }
    }
    const nearTier = PRESTIGE_SPIKE_RATIOS.findIndex((r) => prestigeProgress.ratio >= r)
    if (nearTier < 0 && !canPrestige) return null
    const embers = Math.max(nextPrestige, emberPayout(state.ashEarned))
    if (embers <= 0) return null
    const ready = canPrestige || prestigeProgress.ratio >= 1
    const postBuys = countAffordableEmberBuysAfterPrestige({
      upgrades: state.emberUpgrades,
      embers: state.embers,
      ashEarned: state.ashEarned,
      prestiges: state.prestiges,
    })
    if (postBuys > 0) {
      return {
        ready,
        embers,
        label: ready
          ? t.prestige.worthItCta(embers)
          : t.prestige.worthItNear(embers),
        aria: t.prestige.worthItAria,
        spend: false,
      }
    }
    const mods =
      modulesToNextEmberUnlock(
        state.emberUpgrades,
        0,
        postPrestigeStartOwned(state.emberUpgrades),
        state.prestiges + 1,
      ) ?? 0
    return {
      ready,
      embers,
      label: ready
        ? t.prestige.worthItRebuild(embers, mods)
        : t.prestige.worthItNearRebuild(embers, mods),
      aria: t.prestige.worthItRebuildAria,
      spend: false,
    }
  }, [
    canPrestige,
    nextPrestige,
    prestigeProgress.ratio,
    state.ashEarned,
    state.embers,
    state.emberUpgrades,
    state.owned,
    state.prestiges,
  ])

  useEffect(() => {
    // Ignore passive economy ticks — flashing every 250ms forces layout/paint on iPhone.
    const jump = state.ash - prevAsh.current
    const meaningful = Math.max(rate * 1.25, 1)
    if (jump > meaningful) {
      setTickFlash(true)
      const timer = window.setTimeout(() => setTickFlash(false), 280)
      prevAsh.current = state.ash
      return () => window.clearTimeout(timer)
    }
    prevAsh.current = state.ash
  }, [state.ash, rate])

  useEffect(() => {
    const surprise = state.lastSurprise
    if (!surprise) return
    const amount = formatAsh(surprise.amount)
    playSfx('claim')
    pushPop(surpriseLabel(surprise.kind, amount), 'claim')
    logPlaytest('surprise', {
      kind: surprise.kind,
      amount: Math.round(surprise.amount * 100) / 100,
      tier: surprise.prestigeTier ?? null,
    })
    ackSurprise()
  }, [state.lastSurprise, pushPop, ackSurprise])

  useEffect(() => {
    if (playerLevel.level > prevLevel.current) {
      setLevelPulse(true)
      playSfx('level')
      logPlaytest('level_up', { level: playerLevel.level })
      pushPop(t.hud.levelUp(playerLevel.level), 'upgrade')
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
      onOpenTab?.('prestige')
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

  function openPrestigeCta() {
    logPlaytest('tab_open', { tab: 'prestige', from: 'map_cta' })
    onOpenTab?.('prestige')
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

        {bestBuy ? (
          <BestBuyChip
            hint={bestBuy}
            onActivate={() => {
              logPlaytest('best_buy_tap', {
                id: bestBuy.id,
                affordable: bestBuy.affordable,
              })
              setSelected(bestBuy.id)
            }}
          />
        ) : null}

        {prestigeCta ? (
          <button
            type="button"
            className={`prestige-map-cta${prestigeCta.ready ? ' ready pulse-ready' : ''}${prestigeCta.spend ? ' spend' : ''}`}
            onClick={openPrestigeCta}
            aria-label={prestigeCta.aria}
          >
            {prestigeCta.label}
          </button>
        ) : null}

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
      <FlashEventBanner game={game} />

      <div className={`garden-stage ${skinClass}`}>
        <div
          className="garden-map"
          role="application"
          aria-label={t.hud.mapAria}
          onContextMenu={(e) => e.preventDefault()}
        >
          <MapBackdrop stage={gardenStage} />

          {GENERATORS.map((def, index) => {
            const level = state.owned[def.id] ?? 0
            const unlocked = game.unlocked(def.id)
            const selectedHere = selected === def.id
            const buildingRate =
              unlocked && level > 0 ? generatorRate(def, level) * totalMult : 0
            const producing = buildingRate > 0
            const hint = !unlocked ? unlockHint(def) : ''
            const hl = highlightId === def.id
            const ready = unlocked && level === 0
            const showSign = unlocked || selectedHere || def.id === nextWildId
            const cls =
              'garden-plot' +
              (selectedHere ? ' selected' : '') +
              (!unlocked ? ' wild' : ready ? ' ready' : ' planted') +
              (producing ? ' producing' : '') +
              (hl ? ' ftue-target' : '')
            return (
              <button
                key={def.id}
                type="button"
                className={cls}
                style={{
                  left: def.slot.left,
                  top: def.slot.top,
                  zIndex: 2 + Math.round(Number.parseFloat(def.slot.top)),
                }}
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
                <span className="plot-visual">
                  {!unlocked ? (
                    <WildPlot variant={index} />
                  ) : ready ? (
                    <ClearedPlot />
                  ) : (
                    <ModuleArt
                      kind={def.silhouette}
                      level={level}
                      producing={producing}
                      selected={selectedHere}
                    />
                  )}
                </span>
                {showSign ? (
                  <span className="plot-sign">
                    <span className="plot-name">{def.name}</span>
                    <span className="plot-meta">
                      {!unlocked ? (
                        <>
                          {t.hud.locked} · {shortUnlockGate(def)}
                        </>
                      ) : ready ? (
                        t.upgrade.online
                      ) : (
                        <>
                          {t.hud.levelShort(level)}
                          {producing && selectedHere ? (
                            <> · {formatRate(buildingRate)}</>
                          ) : null}
                        </>
                      )}
                    </span>
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
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
