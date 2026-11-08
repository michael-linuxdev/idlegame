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
import { formatAsh, formatMult, formatRate } from '../game/format'
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
import { ModuleArt } from '../theme/ModuleArt'
import { ClearedPlot, WildPlot } from '../theme/PlotArt'
import { FloatPops, type FloatPopItem } from './FloatPops'
import { BottomBar } from './hud/BottomBar'
import { EventPills } from './hud/EventPills'
import { GoalStrip, type HudGoal } from './hud/GoalStrip'
import {
  IconBasket,
  IconChest,
  IconNotebook,
  IconSeeds,
  IconSnow,
  IconSprout,
} from '../theme/icons'
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

  const stageName =
    t.gardenStage.names[Math.min(gardenStage, t.gardenStage.names.length - 1)]

  /**
   * One goal line, no contradictions: Saisonende/Truhe wins when ready,
   * otherwise Omas best-buy tip replaces a generic „ausbauen“ goal, else the
   * next unlock / level goal.
   */
  const hudGoal: HudGoal = (() => {
    if (prestigeCta && (prestigeCta.ready || prestigeCta.spend)) {
      return {
        key: 'season',
        title: prestigeCta.spend ? t.prestige.shopTitle : t.goal.prestigeReady,
        detail: prestigeCta.spend
          ? prestigeCta.label.replace(`${t.prestige.shopTitle} · `, '')
          : t.prestige.creditsAmount(prestigeCta.embers),
        ratio: 1,
        tone: 'season',
        icon: prestigeCta.spend ? <IconChest /> : <IconSnow />,
        aria: prestigeCta.aria,
        onActivate: openPrestigeCta,
      }
    }
    if (nextGoal.kind === 'upgrade' && bestBuy) {
      const cost = bestBuy.cost
      const owned = state.owned[bestBuy.id] ?? 0
      const action = owned === 0 ? t.upgrade.online : t.upgrade.upgrade
      return {
        key: `tip-${bestBuy.id}`,
        title: t.goal.upgradeTitle(action, bestBuy.name),
        detail: t.goal.upgradeDetail(formatAsh(cost)),
        ratio: cost > 0 ? Math.min(1, state.ash / cost) : 1,
        tone: bestBuy.affordable ? 'tip' : 'goal',
        icon: <IconSprout />,
        aria: `${t.bestBuy.aria}: ${bestBuy.name}`,
        onActivate: () => {
          logPlaytest('best_buy_tap', { id: bestBuy.id, affordable: bestBuy.affordable })
          setSelected(bestBuy.id)
        },
      }
    }
    return {
      key: `goal-${nextGoal.kind}`,
      title: nextGoal.title,
      detail: nextGoal.detail,
      ratio: nextGoal.ratio,
      tone: 'goal',
      nearMiss: nextGoal.nearMiss,
      icon: nextGoal.kind === 'prestige' ? <IconSnow /> : <IconNotebook />,
      aria: `${t.goal.stripAria}: ${nextGoal.title}. ${nextGoal.detail}`,
      onActivate: onGoalActivate,
    }
  })()

  /** Saisonende in sight but not yet the main goal → small pill. */
  const seasonPill =
    prestigeCta && !prestigeCta.ready && !prestigeCta.spend
      ? { label: t.prestige.pill(prestigeCta.embers), onOpen: openPrestigeCta }
      : null

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
    showToast(toast)
  }

  function showToast(text: string) {
    setClaimFlash(text)
    window.setTimeout(() => setClaimFlash(null), 1800)
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

  function claimDaily() {
    const preview = game.dailyPreview
    const bits: string[] = []
    if (preview.compute > 0) bits.push(t.daily.rewardCompute(formatAsh(preview.compute)))
    if (preview.credits > 0) bits.push(t.daily.rewardCredits(preview.credits))
    if (preview.obsidian > 0) bits.push(t.daily.rewardObsidian(preview.obsidian))
    game.claimDaily()
    playSfx('streak')
    showToast(bits.length ? `${t.daily.claimToast} · +${bits.join(' · +')}` : t.daily.claimToast)
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
      <header className="hud">
        <div className="hud-row">
          <button
            type="button"
            className={`hud-card hud-garden${levelPulse ? ' level-up' : ''}`}
            onClick={() => setProgressOpen(true)}
            aria-label={t.hud.gardenAria(stageName, playerLevel.level)}
          >
            <span className="hud-stage">{stageName}</span>
            <span className="hud-level">
              <span className="hud-level-label">
                {t.level.short} {playerLevel.level}
              </span>
              <span className="hud-xp" aria-hidden="true">
                <span style={{ width: `${Math.round(playerLevel.ratio * 100)}%` }} />
              </span>
            </span>
            {questReady ? (
              <span className="hud-dot" title={t.hud.questReady} aria-hidden="true" />
            ) : null}
          </button>

          <div
            className="hud-card hud-wallet"
            role="status"
            aria-label={t.hud.walletAria(formatAsh(state.ash), formatRate(rate))}
          >
            <span className={`hud-amount${tickFlash ? ' tick' : ''}`}>
              <span className="hud-amount-icon">
                <IconBasket />
              </span>
              {formatAsh(state.ash)}
            </span>
            <span className="hud-rate">
              {formatRate(rate)}
              {totalMult > 1 ? <span className="hud-mult"> {formatMult(totalMult)}</span> : null}
            </span>
            <span className="hud-sub">
              {state.embers > 0 ? (
                <span className="hud-sub-item" title={t.resources.credits}>
                  <IconChest /> {state.embers}
                </span>
              ) : null}
              <span className="hud-sub-item" title={t.resources.obsidian}>
                <IconSeeds /> {state.obsidian}
              </span>
            </span>
          </div>
        </div>

        <GoalStrip goal={hudGoal} />
        <EventPills game={game} season={seasonPill} />
      </header>

      <FloatPops items={pops} onDone={removePop} />

      {claimFlash ? (
        <div className="hud-toast" role="status">
          {claimFlash}
        </div>
      ) : null}

      <BottomBar
        game={game}
        highlightOffline={highlightId === 'offline'}
        onClaimOffline={claimOffline}
        onClaimDaily={claimDaily}
        onWater={onRake}
      />

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
                      id={def.id}
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
