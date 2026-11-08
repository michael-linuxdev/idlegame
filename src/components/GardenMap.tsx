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
  milestoneMult,
  milestonesReached,
  seasonsMissing,
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
import { gatePrestiges } from '../game/state'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'
import type { Tab } from './AppNav'
import { ModuleArt } from '../theme/ModuleArt'
import { ClearedPlot, WildPlot } from '../theme/PlotArt'
import { FloatPops, type FloatPopItem } from './FloatPops'
import { BottomBar } from './hud/BottomBar'
import { Visitors } from './Visitors'
import { OmaHint } from './OmaHint'
import { pickHint, useHints } from '../game/hints'
import { canDeepReset } from '../game/longLoop'
import {
  ORDER_PAUSE_MS,
  makeOrder,
  orderProgress,
  type ExtrasState,
  type WeeklyTaskId,
} from '../game/extras'
import { RARITY_BONUS, VARIETIES } from '../game/gardenLife'
import { TIER_LEVELS, moduleTier } from '../theme/tiers'
import { formatClock, formatDecimal } from '../game/format'
import { PlotFx } from './PlotFx'
import { useHarvestFlight } from './HarvestFlight'
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
import { useAmbient } from '../theme/ambient'
import { UpgradeSheet } from './UpgradeSheet'
import { FestSheet } from './FestSheet'
import { HelperWalker } from './HelperWalker'
import { festAt } from '../game/fests'
import { IconApple, IconHelper } from '../theme/icons'

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
  unreadLetters?: number
  onOpenNotebook?: () => void
  extras: ExtrasState
  updateExtras: (fn: (s: ExtrasState) => ExtrasState) => void
  track: (task: WeeklyTaskId, n?: number) => void
  /** FTUE / ceremony / letter on screen — hold Omas hints */
  hintsBlocked?: boolean
  /** Kapitel 2 open → switch to the Streuobstwiese */
  onSwitchPlot?: () => void
}

export function GardenMap({
  game,
  highlightId,
  onOpenTab,
  unreadLetters = 0,
  onOpenNotebook,
  extras,
  updateExtras,
  track,
  hintsBlocked = false,
  onSwitchPlot,
}: Props) {
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
    ackVariety,
    nextPrestige,
    canPrestige,
    prestigeProgress,
  } = game
  const [selected, setSelected] = useState<GeneratorId | null>(() => {
    if (!game.postPrestigeFocus) return null
    const tip = computeBestBuy(game.state, {
      playerLevel: game.playerLevel.level,
      ratePerSec: game.rate,
      costOf: game.costOf,
    })
    return tip?.affordable ? tip.id : 'gemuesebeet'
  })
  const [progressOpen, setProgressOpen] = useState(false)
  const [festOpen, setFestOpen] = useState(false)
  const [tickFlash, setTickFlash] = useState(false)
  const [claimFlash, setClaimFlash] = useState<string | null>(null)
  const [pops, setPops] = useState<FloatPopItem[]>([])
  const [levelPulse, setLevelPulse] = useState(false)
  const prevAsh = useRef(state.ernte)
  const prevLevel = useRef(playerLevel.level)
  const totalMult =
    multiplier * levelMult * clanMult * eventMult * game.expansionMult * game.turboMult
  const skinClass = equippedCosmetic?.accentClass ?? 'skin-wiese'
  const ambient = useAmbient()
  const harvest = useHarvestFlight()
  const { seen: seenHints, markSeen } = useHints()
  const [visitorPresent, setVisitorPresent] = useState(false)
  const gardenStage = GENERATORS.filter(
    (g) => (state.owned[g.id] ?? 0) > 0 && game.unlocked(g.id),
  ).length
  /** Only the next wild corner shows its sign — keeps the map calm. */
  const nextWildId = GENERATORS.find((g) => !game.unlocked(g.id))?.id ?? null
  const questReady = game.questRows.some((q: { ready: boolean }) => q.ready)

  const pushPop = useCallback((text: string, kind?: FloatPopItem['kind']) => {
    setPops((list) => [...list.slice(-4), { id: (list.at(-1)?.id ?? 0) + 1, text, kind }])
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

  // After Saisonende the map remounts — open Omas best tip right away (see
  // the `selected` initializer) and clear the one-shot focus flag.
  const { postPrestigeFocus, clearPostPrestigeFocus } = game
  useEffect(() => {
    if (postPrestigeFocus) clearPostPrestigeFocus()
  }, [postPrestigeFocus, clearPostPrestigeFocus])

  /** Map CTA: spend leftover Münzen, or honest prestige preview (never false „lohnt sich“). */
  const prestigeCta = useMemo(() => {
    const readyBuys = countAffordableEmberBuys(
      state.emberUpgrades,
      state.erbstuecke,
      state.ernteSeason,
      state.owned,
      state.prestiges,
    )
    if (readyBuys > 0 && state.erbstuecke > 0) {
      return {
        ready: true,
        erbstuecke: state.erbstuecke,
        label: t.prestige.spendCta(readyBuys),
        aria: t.prestige.spendAria,
        spend: true,
      }
    }
    const nearTier = PRESTIGE_SPIKE_RATIOS.findIndex((r) => prestigeProgress.ratio >= r)
    if (nearTier < 0 && !canPrestige) return null
    const erbstuecke = Math.max(nextPrestige, emberPayout(state.ernteSeason, state.prestiges))
    if (erbstuecke <= 0) return null
    const ready = canPrestige || prestigeProgress.ratio >= 1
    const postBuys = countAffordableEmberBuysAfterPrestige({
      upgrades: state.emberUpgrades,
      erbstuecke: state.erbstuecke,
      ernteSeason: state.ernteSeason,
      prestiges: state.prestiges,
    })
    if (postBuys > 0) {
      return {
        ready,
        erbstuecke,
        label: ready
          ? t.prestige.worthItCta(erbstuecke)
          : t.prestige.worthItNear(erbstuecke),
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
      erbstuecke,
      label: ready
        ? t.prestige.worthItRebuild(erbstuecke, mods)
        : t.prestige.worthItNearRebuild(erbstuecke, mods),
      aria: t.prestige.worthItRebuildAria,
      spend: false,
    }
  }, [
    canPrestige,
    nextPrestige,
    prestigeProgress.ratio,
    state.ernteSeason,
    state.erbstuecke,
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
          : t.prestige.creditsAmount(prestigeCta.erbstuecke),
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
        ratio: cost > 0 ? Math.min(1, state.ernte / cost) : 1,
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
      ? { label: t.prestige.pill(prestigeCta.erbstuecke), onOpen: openPrestigeCta }
      : null

  useEffect(() => {
    // Ignore passive economy ticks — flashing every 250ms forces layout/paint on iPhone.
    const jump = state.ernte - prevAsh.current
    const meaningful = Math.max(rate * 1.25, 1)
    if (jump > meaningful) {
      setTickFlash(true)
      const timer = window.setTimeout(() => setTickFlash(false), 280)
      prevAsh.current = state.ernte
      return () => window.clearTimeout(timer)
    }
    prevAsh.current = state.ernte
  }, [state.ernte, rate])

  // Surprise pops: add the pop during render (guarded by identity) …
  const [seenSurprise, setSeenSurprise] = useState(state.lastSurprise)
  if (state.lastSurprise && state.lastSurprise !== seenSurprise) {
    const surprise = state.lastSurprise
    setSeenSurprise(surprise)
    setPops((list) => [
      ...list.slice(-4),
      {
        id: (list.at(-1)?.id ?? 0) + 1,
        text: surpriseLabel(surprise.kind, formatAsh(surprise.amount)),
        kind: 'claim',
      },
    ])
  }
  // … and keep the side effects (sound, log, ack) in an effect.
  useEffect(() => {
    const surprise = state.lastSurprise
    if (!surprise) return
    playSfx('claim')
    logPlaytest('surprise', {
      kind: surprise.kind,
      amount: Math.round(surprise.amount * 100) / 100,
      tier: surprise.prestigeTier ?? null,
    })
    ackSurprise()
  }, [state.lastSurprise, ackSurprise])

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
    harvest.launch(document.querySelector('.hud-claim'))
    const amount = game.offlineGained ?? 0
    const xp = xpFromOfflineClaim(amount)
    game.dismissOffline()
    playSfx('claim')
    pushPop(`+${formatAsh(amount)}`, 'claim')
    const toast =
      xp > 0
        ? t.hud.claimCelebrate(formatAsh(amount), xp)
        : t.hud.claimCelebrateShort(formatAsh(amount))
    const helped = state.helperReport
    showToast(helped > 0 ? `${toast} · ${t.helper.report(helped)}` : toast)
    if (helped > 0) game.ackHelperReport()
  }

  function showToast(text: string) {
    setClaimFlash(text)
    window.setTimeout(() => setClaimFlash(null), 1800)
  }

  function onRake() {
    if (!tapReady) return
    harvest.launch(document.querySelector('.hud-water'))
    track('water')
    const before = state.ernte
    playSfx('tap')
    logPlaytest('schub')
    rake()
    // Burst grant lands on next state tick; optimistic pop from ~45s rate
    const estimate = Math.max(rate * 45, 1)
    pushPop(`+${formatAsh(estimate)}`, 'gain')
    void before
  }

  function claimDaily() {
    harvest.launch(document.querySelector('.hud-claim'))
    const preview = game.dailyPreview
    const bits: string[] = []
    if (preview.compute > 0) bits.push(t.daily.rewardCompute(formatAsh(preview.compute)))
    if (preview.credits > 0) bits.push(t.daily.rewardCredits(preview.credits))
    if (preview.samen > 0) bits.push(t.daily.rewardObsidian(preview.samen))
    game.claimDaily()
    track('daily')
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
    track('upgrades')
    playSfx('upgrade')
    pushPop(`−${formatAsh(deltaCost)}`, 'upgrade')
  }

  // —— Hofladen-Bestellungen ——
  const order = extras.order
  const orderHave = order ? orderProgress(order, state.ernteLifetime) : 0
  const orderDone = order ? orderHave >= order.need : false
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now()
      if (!extras.order && now >= extras.nextOrderAt && rate > 0) {
        updateExtras((s) =>
          s.order ? s : { ...s, order: makeOrder(now, rate, state.ernteLifetime, now) },
        )
      } else if (
        extras.order &&
        now > extras.order.expiresAt &&
        orderProgress(extras.order, state.ernteLifetime) < extras.order.need
      ) {
        updateExtras((s) => ({ ...s, order: null, nextOrderAt: now + ORDER_PAUSE_MS }))
        showToast(t.orders.expired)
      }
    }, 2000)
    return () => window.clearInterval(id)
  }, [extras.order, extras.nextOrderAt, rate, state.ernteLifetime, updateExtras])

  function claimOrder() {
    if (!order || !orderDone) return
    const name = t.orders.customers[order.customer % t.orders.customers.length]!
    harvest.launch(document.querySelector('.pill-order'))
    game.grant({ samen: order.seeds, ernteSeconds: 300, fest: 8 })
    playSfx('claim')
    showToast(t.orders.done(name))
    const now = Date.now()
    updateExtras((s) => ({
      ...s,
      order: null,
      nextOrderAt: now + ORDER_PAUSE_MS,
      week: { ...s.week, orders: s.week.orders + 1 },
    }))
  }

  const orderPill = order
    ? (() => {
        const name = t.orders.customers[order.customer % t.orders.customers.length]!
        return {
          label: orderDone
            ? t.orders.claim(name)
            : t.orders.progress(
                formatAsh(Math.min(orderHave, order.need)),
                formatAsh(order.need),
                formatClock(order.expiresAt - game.nowTick),
              ),
          detail: `${t.orders.label(name)} — ${t.orders.detail(formatAsh(order.need))} ${t.orders.reward(order.seeds)}`,
          ratio: Math.min(1, orderHave / order.need),
          claim: orderDone,
          onClaim: claimOrder,
        }
      })()
    : null

  // —— Pflanzenbuch: new variety pop ——
  useEffect(() => {
    const id = state.lastVariety
    if (!id) return
    const def = VARIETIES.find((v) => v.id === id)
    if (def) {
      showToast(
        t.plantbook.newVariety(
          t.plantbook.names[id] ?? id,
          formatDecimal(RARITY_BONUS[def.rarity] * 100, 1),
        ),
      )
      playSfx('streak')
      track('varieties')
    }
    ackVariety()
  }, [state.lastVariety, ackVariety, track])

  // —— Meilenstein-Sprünge: toast when an area crosses ×2 ——
  const prevStars = useRef<Record<string, number> | null>(null)
  useEffect(() => {
    const now: Record<string, number> = {}
    for (const g of GENERATORS) now[g.id] = milestonesReached(state.owned[g.id] ?? 0)
    const before = prevStars.current
    prevStars.current = now
    if (!before || game.postPrestigeFocus) return
    for (const g of GENERATORS) {
      if ((now[g.id] ?? 0) > (before[g.id] ?? 0)) {
        playSfx('level')
        showToast(t.milestones.reached(g.name, formatMult(milestoneMult(state.owned[g.id] ?? 0))))
        break
      }
    }
  }, [state.owned, game.postPrestigeFocus])

  const hint = hintsBlocked
    ? null
    : pickHint(
        {
          visitor: visitorPresent,
          order: Boolean(extras.order),
          variety: state.collection.length > 0,
          season: canPrestige && state.prestiges === 0,
          truhe: Boolean(prestigeCta?.spend),
          weekly: state.prestiges >= 1,
          deep: canDeepReset(state.prestiges),
        },
        seenHints,
      )

  return (
    <section className="fortress-home" aria-labelledby="ernte-heading">
      <h1 id="ernte-heading" className="sr-only">
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
            aria-label={t.hud.walletAria(formatAsh(state.ernte), formatRate(rate))}
          >
            <span className={`hud-amount${tickFlash ? ' tick' : ''}`}>
              <span className="hud-amount-icon">
                <IconBasket />
              </span>
              {formatAsh(state.ernte)}
            </span>
            <span className="hud-rate">
              {formatRate(rate)}
              {totalMult > 1 ? <span className="hud-mult"> {formatMult(totalMult)}</span> : null}
            </span>
            <span className="hud-sub">
              {state.erbstuecke > 0 ? (
                <span className="hud-sub-item" title={t.resources.credits}>
                  <IconChest /> {state.erbstuecke}
                </span>
              ) : null}
              <span className="hud-sub-item" title={t.resources.samen}>
                <IconSeeds /> {state.samen}
              </span>
            </span>
          </div>
        </div>

        <GoalStrip goal={hudGoal} />
        <EventPills
          game={game}
          season={seasonPill}
          order={orderPill}
          onOpenFest={() => setFestOpen(true)}
        />
      </header>

      <FloatPops items={pops} onDone={removePop} />
      {harvest.layer}

      {claimFlash ? (
        <div className="hud-toast" role="status">
          {claimFlash}
        </div>
      ) : null}

      {hint ? <OmaHint id={hint} onOk={() => markSeen(hint)} /> : null}

      {state.helperLevel > 0 || onSwitchPlot ? (
        <div className="map-side">
          {onSwitchPlot ? (
            <button
              type="button"
              className="map-side-btn plot-switch"
              onClick={onSwitchPlot}
              aria-label={t.orchard.toOrchard}
            >
              <IconApple />
              <span>{t.orchard.chipOrchard}</span>
            </button>
          ) : null}
          {state.helperLevel > 0 ? (
            <button
              type="button"
              className={`map-side-btn helper-chip${state.helperOn ? ' on' : ''}`}
              onClick={game.switchHelper}
              aria-pressed={state.helperOn}
              aria-label={t.helper.toggleAria(state.helperOn)}
            >
              <IconHelper />
              <span>{state.helperOn ? t.helper.chipOn : t.helper.chipOff}</span>
            </button>
          ) : null}
        </div>
      ) : null}

      <BottomBar
        game={game}
        highlightOffline={highlightId === 'offline'}
        onClaimOffline={claimOffline}
        onClaimDaily={claimDaily}
        onWater={onRake}
      />

      <div
        className={`garden-stage ${skinClass}`}
        data-daypart={ambient.daypart}
        data-season={ambient.season}
      >
        <div
          className="garden-map"
          role="application"
          aria-label={t.hud.mapAria}
          onContextMenu={(e) => e.preventDefault()}
        >
          <MapBackdrop
            stage={gardenStage}
            ambient={ambient}
            skin={skinClass}
            fest={festAt(game.nowTick).id}
          />
          {state.helperLevel > 0 && state.helperOn ? <HelperWalker /> : null}
          <Visitors
            game={game}
            extras={extras}
            update={updateExtras}
            onVisited={showToast}
            onPresence={setVisitorPresent}
          />

          <button
            type="button"
            className={`laube-hotspot${unreadLetters > 0 ? ' has-letter' : ''}`}
            onClick={onOpenNotebook}
            aria-label={unreadLetters > 0 ? t.notebook.newLetterAria : t.notebook.laubeAria}
          >
            {unreadLetters > 0 ? (
              <span className="laube-letter" aria-hidden="true">
                <svg viewBox="0 0 32 24" width="100%" height="100%">
                  <rect x="1.5" y="1.5" width="29" height="21" rx="2.5" fill="#fdf8ec" stroke="#8a6a40" strokeWidth="1.6" />
                  <path d="M2 3 L16 14 L30 3" fill="none" stroke="#8a6a40" strokeWidth="1.6" />
                  <circle cx="16" cy="14" r="3.4" fill="#c4553f" />
                </svg>
              </span>
            ) : null}
          </button>

          {GENERATORS.map((def, index) => {
            const level = state.owned[def.id] ?? 0
            const unlocked = game.unlocked(def.id)
            const selectedHere = selected === def.id
            const buildingRate =
              unlocked && level > 0 ? generatorRate(def, level) * totalMult : 0
            const producing = buildingRate > 0
            const hint = !unlocked ? unlockHint(def, gatePrestiges(state)) : ''
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
                <PlotFx
                  unlocked={unlocked}
                  planted={level > 0}
                  tier={moduleTier(level)}
                  onTier={(tier) => {
                    if (tier >= 2) showToast(t.milestone.tier(def.name, tier))
                  }}
                />
                {showSign ? (
                  <span className="plot-sign">
                    <span className="plot-name">{def.name}</span>
                    <span className="plot-meta">
                      {!unlocked ? (
                        seasonsMissing(def, gatePrestiges(state)) > 0 ? (
                          shortUnlockGate(def, gatePrestiges(state))
                        ) : (
                          <>
                            {t.hud.locked} · {shortUnlockGate(def, gatePrestiges(state))}
                          </>
                        )
                      ) : ready ? (
                        t.upgrade.online
                      ) : (
                        <>
                          {t.hud.levelShort(level)}
                          {milestonesReached(level) > 0 ? (
                            <span className="plot-stars" aria-label={t.milestones.starsAria(milestonesReached(level))}>
                              {' '}
                              {'★'.repeat(Math.min(3, milestonesReached(level)))}
                            </span>
                          ) : null}
                          {producing && selectedHere ? (
                            <> · {formatRate(buildingRate)}</>
                          ) : null}
                          <TierBar level={level} />
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

      {festOpen ? <FestSheet game={game} onClose={() => setFestOpen(false)} /> : null}

      {progressOpen ? (
        <ProgressSheet
          game={game}
          onClose={() => setProgressOpen(false)}
          extras={extras}
          updateExtras={updateExtras}
        />
      ) : null}
    </section>
  )
}

/** Thin progress bar on the plant sign toward the next growth tier. */
function TierBar({ level }: { level: number }) {
  const tier = moduleTier(level)
  if (tier >= TIER_LEVELS.length) return null
  const from = tier === 0 ? 0 : TIER_LEVELS[tier - 1]!
  const to = TIER_LEVELS[tier]!
  const pct = Math.round(((level - from) / (to - from)) * 100)
  return (
    <span className="plot-tierbar" aria-hidden="true">
      <span style={{ width: `${pct}%` }} />
    </span>
  )
}
