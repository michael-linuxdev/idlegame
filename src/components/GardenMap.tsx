import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WeatherDecision } from './WeatherDecision'
import { Residents } from './Residents'
import { DecorLayer } from './DecorLayer'
import { WeatherLayer } from './WeatherLayer'
import { computeBestBuy } from '../game/bestBuy'
import { GENERATORS, milestoneMult, milestonesReached, type GeneratorId } from '../game/generators'
import { formatErnte, formatEta, formatMult } from '../game/format'
import { computeNextGoal } from '../game/nextGoal'
import { xpFromOfflineClaim } from '../game/progression'
import { logPlaytest } from '../game/playtestLog'
import { playSfx } from '../game/sound'
import { multBreakdown } from '../game/state'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'
import type { Tab } from './AppNav'
import { FloatPops, type FloatPopItem } from './FloatPops'
import { BottomBar } from './hud/BottomBar'
import { Visitors } from './Visitors'
import { OmaHint } from './OmaHint'
import { BackupReminder } from './BackupReminder'
import { exportReminderDue, loadRecord } from '../game/backupReminder'
import { hasOpenWindow, useOverlayOpen } from '../game/overlays'
import { MultSheet } from './hud/MultSheet'
import { WelcomeBack } from './hud/WelcomeBack'
import { pickHint, useHints } from '../game/hints'
import { canDeepReset } from '../game/longLoop'
import {
  ORDER_PAUSE_MS,
  makeOrder,
  orderProgress,
  type ExtrasState,
  type WeeklyTaskId,
} from '../game/extras'
import { RARITY_BONUS, VARIETIES, weatherAt } from '../game/gardenLife'
import { formatClock, formatDecimal } from '../game/format'
import { ArtSvg } from '../theme/ArtSvg'
import { ArtDefs } from '../theme/art/parts'
import { useHarvestFlight } from './HarvestFlight'
import { type HudGoal } from './hud/GoalStrip'
import { MapBackdrop } from '../theme/MapBackdrop'
import { useAmbient, weatherOverride } from '../theme/ambient'
import { UpgradeSheet } from './UpgradeSheet'
import { HelperWalker } from './HelperWalker'
import { festAt } from '../game/fests'
import { IconHelper } from '../theme/icons'
import { PlotButtons } from './PlotPicker'
import { useSignsAlways } from '../game/prefs'
import type { ChapterId } from '../game/chapters'
import { COSMETICS, type CosmeticId } from '../game/monetization'
import { SpeechBubble } from './SpeechBubble'
import { CrossSheet, DecorSheet, FestSheet, ProgressSheet, TodaySheet } from './lazy'
import { GardenPlot } from './map/GardenPlot'
import { usePrestigeCta } from './map/usePrestigeCta'
import { buildHudGoal } from './map/hudGoal'
import { MapHud } from './map/MapHud'
import { GardenCritters } from './GardenCritters'
import { PhotoOverlay, SkyEventButton, WishSheet } from './GardenExtras'
import { surpriseText } from './surpriseText'


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
  /** Switch to a chapter plot */
  onGoPlot?: (plot: 'garden' | ChapterId) => void
  /** Gartenstil-Vorschau (shop) */
  previewSkin?: CosmeticId | null
  onEndPreview?: () => void
  /** Foto-Modus: HUD hidden, postcard export */
  photoMode?: boolean
  onExitPhoto?: () => void
  /** Deko / Saatgut kreuzen sheet (opened from the Menü) */
  sheet?: 'decor' | 'cross' | null
  onSheet?: (sheet: 'decor' | 'cross' | null) => void
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
  onGoPlot,
  previewSkin = null,
  onEndPreview,
  photoMode = false,
  sheet = null,
  onSheet,
  onExitPhoto,
}: Props) {
  const {
    state,
    rate,
    rake,
    tapReady,
    equippedCosmetic,
    playerLevel,
    ackSurprise,
    ackVariety,
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
  const prevErnte = useRef(state.ernte)
  const prevLevel = useRef(playerLevel.level)
  const multRows = multBreakdown(state, game.nowTick)
  const totalMult = multRows.reduce((p, r) => p * r.mult, 1)
  const [multOpen, setMultOpen] = useState(false)
  // Desktop shortcuts: G gießen · M Menü · 1–9 Beete (Esc is handled by every window)
  const onRakeRef = useRef<() => void>(() => {})
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      if (hasOpenWindow()) return
      const k = e.key.toLowerCase()
      if (k === 'g') onRakeRef.current()
      else if (k === 'm') window.dispatchEvent(new Event('gartenerbe-open-menu'))
      else if (/^[1-9]$/.test(k)) {
        const def = GENERATORS[Number(k) - 1]
        if (def) setSelected(def.id)
      } else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  // Expose the HUD's height as --hud-bottom so notes can sit right under it
  const hudRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = hudRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      el.parentElement?.style.setProperty('--hud-bottom', `${Math.round(r.bottom + 10)}px`)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  // Welcome-back card: once per app start, only after a real break
  const [welcomeDone, setWelcomeDone] = useState(false)
  /** First minutes: only Ernte, goal, Gießen and the menu — events come once Kompost grows */
  const earlyGame = !game.features.has('events')
  const previewDef = previewSkin ? COSMETICS.find((c) => c.id === previewSkin) ?? null : null
  const skinClass = previewDef?.accentClass ?? equippedCosmetic?.accentClass ?? 'skin-wiese'
  const [todayOpen, setTodayOpen] = useState(false)
  const decorOpen = sheet === 'decor'
  const crossOpen = sheet === 'cross'
  const setDecorOpen = (open: boolean) => onSheet?.(open ? 'decor' : null)
  const setCrossOpen = (open: boolean) => onSheet?.(open ? 'cross' : null)
  const [decorEdit, setDecorEdit] = useState(false)
  const [wishOpen, setWishOpen] = useState(false)
  const [growing, setGrowing] = useState<string | null>(null)
  // Bewegung beim Produzieren: reihum immer nur ein Bereich (plus der gewählte),
  // damit die Karte lebt, ohne jede Sekunde alle SVGs neu zu zeichnen.
  const [animTick, setAnimTick] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setAnimTick((n) => n + 1), 3500)
    return () => window.clearInterval(id)
  }, [])
  const signsAll = useSignsAlways()
  const ambient = useAmbient()
  const harvest = useHarvestFlight()
  const { seen: seenHints, markSeen } = useHints()
  const [visitorPresent, setVisitorPresent] = useState(false)
  const gardenStage = GENERATORS.filter(
    (g) => (state.owned[g.id] ?? 0) > 0 && game.unlocked(g.id),
  ).length
  /** Only the next wild corner shows its sign — keeps the map calm. */
  const nextWildId = GENERATORS.find((g) => !game.unlocked(g.id))?.id ?? null
  const producingIds = GENERATORS.filter((g) => (state.owned[g.id] ?? 0) > 0 && game.unlocked(g.id)).map((g) => g.id)
  const animId = producingIds.length ? producingIds[animTick % producingIds.length] : null
  const pushPop = useCallback((text: string, kind?: FloatPopItem['kind']) => {
    setPops((list) => [...list.slice(-4), { id: (list.at(-1)?.id ?? 0) + 1, text, kind }])
  }, [])

  const removePop = useCallback((id: number) => {
    setPops((list) => list.filter((p) => p.id !== id))
  }, [])

  // Texte darin folgen einem Sprachwechsel mit dem nächsten Takt (state ändert sich alle 250 ms)
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

  const prestigeCta = usePrestigeCta(game)

  const stageName =
    t.gardenStage.names[Math.min(gardenStage, t.gardenStage.names.length - 1)]

  const hudGoal: HudGoal = buildHudGoal({
    state,
    prestigeCta,
    nextGoal,
    bestBuy,
    onOpenPrestige: openPrestigeCta,
    onGoal: onGoalActivate,
    onSelect: setSelected,
  })

  /** Saisonende in sight but not yet the main goal → small pill. */
  const seasonPill =
    prestigeCta && !prestigeCta.ready && !prestigeCta.spend
      ? (() => {
          const eta = formatEta(prestigeProgress.min - state.ernteSeason, rate)
          return {
            label: eta ? `${t.prestige.pill(prestigeCta.erbstuecke)} · ${t.ux.season.eta(eta)}` : t.prestige.pill(prestigeCta.erbstuecke),
            short: eta ? `+${formatErnte(prestigeCta.erbstuecke)} · ${eta}` : `+${formatErnte(prestigeCta.erbstuecke)}`,
            onOpen: openPrestigeCta,
          }
        })()
      : null

  useEffect(() => {
    // Ignore passive economy ticks — flashing every 250ms forces layout/paint on iPhone.
    const jump = state.ernte - prevErnte.current
    const meaningful = Math.max(rate * 1.25, 1)
    if (jump > meaningful) {
      setTickFlash(true)
      const timer = window.setTimeout(() => setTickFlash(false), 280)
      prevErnte.current = state.ernte
      return () => window.clearTimeout(timer)
    }
    prevErnte.current = state.ernte
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
        text: surpriseText(surprise),
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
      chapter: surprise.chapter ?? null,
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
    pushPop(`+${formatErnte(amount)}`, 'claim')
    const toast =
      xp > 0
        ? t.hud.claimCelebrate(formatErnte(amount), xp)
        : t.hud.claimCelebrateShort(formatErnte(amount))
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
    pushPop(`+${formatErnte(estimate)}`, 'gain')
    void before
  }  useEffect(() => {
    onRakeRef.current = onRake
  })


  function claimDaily() {
    harvest.launch(document.querySelector('.hud-claim'))
    const preview = game.dailyPreview
    const bits: string[] = []
    if (preview.ernte > 0) bits.push(t.daily.rewardErnte(formatErnte(preview.ernte)))
    if (preview.erbstuecke > 0) bits.push(t.daily.rewardErbstuecke(preview.erbstuecke))
    if (preview.samen > 0) bits.push(t.daily.rewardSamen(preview.samen))
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
    pushPop(`−${formatErnte(deltaCost)}`, 'upgrade')
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
    game.grant({ samen: order.seeds, ernteSeconds: 300, fest: 8, kg: 2 })
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
                formatErnte(Math.min(orderHave, order.need)),
                formatErnte(order.need),
                formatClock(order.expiresAt - game.nowTick),
              ),
          detail: `${t.orders.label(name)} — ${t.orders.detail(formatErnte(order.need))} ${t.orders.reward(order.seeds)}`,
          ratio: Math.min(1, orderHave / order.need),
          claim: orderDone,
          onClaim: claimOrder,
          msLeft: Math.max(0, order.expiresAt - game.nowTick),
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

  // —— Meilenstein-Truhe toast ——
  const { ackChest } = game
  useEffect(() => {
    const chest = state.lastChest
    if (!chest) return
    playSfx('claim')
    showToast(
      chest.kind === 'variety'
        ? t.chest.variety(t.plantbook.names[chest.variety ?? ''] ?? '')
        : t.chest[chest.kind](chest.amount),
    )
    ackChest()
  }, [state.lastChest, ackChest])

  const overlayOpen = useOverlayOpen()
  // One message at a time: a new note waits until toasts and pops are gone,
  // but a note already on screen stays while the player reads it.
  const quiet = claimFlash == null && pops.length === 0
  const candidate = hintsBlocked || overlayOpen
    ? null
    : pickHint(
        {
          visitor: visitorPresent,
          order: Boolean(extras.order),
          variety: state.collection.length > 0,
          season: canPrestige && state.saisonenden === 0,
          truhe: Boolean(prestigeCta?.spend),
          weekly: state.saisonenden >= 1,
          deep: canDeepReset(state.saisonenden),
          helperAreas: state.helperLevel > 0,
          recipeNew: !earlyGame && game.features.has('recipe') && state.recipe.areas.length > 0,
          festNew: !earlyGame && game.features.has('fest'),
          weatherNew: !earlyGame && game.features.has('weather'),
          clanNew: game.features.has('clan'),
          // Termin für die Rückkehr: erste Kreuzung anlegen (4 h)
          crossNew: game.features.has('cross') && !state.crossing && state.hybrids.length === 0,
        },
        seenHints,
      )
  const [shownHint, setShownHint] = useState<typeof candidate>(null)
  if (candidate !== shownHint && (candidate === null || quiet)) setShownHint(candidate)
  const hint = candidate !== null && candidate === shownHint ? candidate : null
  // Sicherung außerhalb des Geräts: nur, wenn sonst kein Hinweis und kein Fenster offen ist
  // (Regel zuletzt prüfen — sie liest einen kleinen Eintrag aus localStorage)
  const [remindDone, setRemindDone] = useState(false)
  const [remindShown, setRemindShown] = useState(false)
  if (!remindShown && !remindDone && candidate === null && !hint && quiet && !hintsBlocked && !overlayOpen && !photoMode && exportReminderDue(loadRecord(), state, Date.now())) setRemindShown(true)

  return (
    <section className={`garten-home${photoMode ? ' photo-mode' : ''}`} aria-labelledby="ernte-heading">
      <h1 id="ernte-heading" className="sr-only">
        {t.brand}
      </h1>
      {/* Clash HUD: floating chips only — no white card tiles */}
      <MapHud
        game={game}
        hudRef={hudRef}
        stageName={stageName}
        levelPulse={levelPulse}
        tickFlash={tickFlash}
        totalMult={totalMult}
        earlyGame={earlyGame}
        hudGoal={hudGoal}
        seasonPill={seasonPill}
        orderPill={orderPill}
        onOpenProgress={() => setProgressOpen(true)}
        onOpenMult={() => setMultOpen(true)}
        onOpenFest={() => setFestOpen(true)}
      />

      <FloatPops items={pops} onDone={removePop} />
      {harvest.layer}

      {claimFlash ? (
        <div className="hud-toast" role="status">
          {claimFlash}
        </div>
      ) : null}

      {hint ? <OmaHint id={hint} onOk={() => markSeen(hint)} /> : null}
      {remindShown && !remindDone && !hint && !overlayOpen ? (
        <BackupReminder
          state={state}
          onDone={() => {
            setRemindDone(true)
            setRemindShown(false)
          }}
        />
      ) : null}
      {multOpen ? <MultSheet rows={multRows} onClose={() => setMultOpen(false)} /> : null}
      {!welcomeDone && !hintsBlocked && !photoMode && game.offlineGained != null && game.offlineAwayMs >= 5 * 60_000 ? (
        <WelcomeBack
          amount={game.offlineGained}
          awayMs={game.offlineAwayMs}
          helped={state.helperReport > 0}
          beds={GENERATORS.filter(
            (g) => game.unlocked(g.id) && game.costOf(g.id) <= state.ernte + (game.offlineGained ?? 0),
          )
            .sort((a, b) => (a.id === bestBuy?.id ? -1 : b.id === bestBuy?.id ? 1 : game.costOf(b.id) - game.costOf(a.id)))
            .slice(0, 3)
            .map((g) => ({ id: g.id, name: g.name }))}
          ready={[
            ...(state.crossing && state.crossing.endsAt <= game.nowTick ? [t.ux.welcomeBack.ready.cross] : []),
            ...(game.albumReady > 0 && game.features.has('album') ? [t.ux.welcomeBack.ready.album] : []),
            ...(game.giftReady ? [t.ux.welcomeBack.ready.gift] : []),
            ...(game.dailyReady ? [t.ux.welcomeBack.ready.daily] : []),
          ]}
          onBed={(id) => {
            setWelcomeDone(true)
            claimOffline()
            setSelected(id as GeneratorId)
          }}
          onClaim={() => {
            setWelcomeDone(true)
            claimOffline()
          }}
          onLater={() => setWelcomeDone(true)}
        />
      ) : null}

      {previewDef ? (
        <div className="preview-banner" role="status">
          <span>{t.preview.banner(previewDef.name)}</span>
          <button
            type="button"
            className="btn buy"
            disabled={game.state.samen < previewDef.cost || game.state.ownedCosmetics.includes(previewDef.id)}
            onClick={() => {
              game.purchaseCosmetic(previewDef.id)
              game.setEquippedCosmetic(previewDef.id)
              onEndPreview?.()
            }}
          >
            {t.preview.buy(previewDef.cost)}
          </button>
          <button type="button" className="btn ghost" onClick={onEndPreview}>
            {t.preview.back}
          </button>
        </div>
      ) : null}

      {photoMode ? (
        <PhotoOverlay
          caption={t.photo.caption(stageName, state.saisonenden + 1)}
          onClose={() => onExitPhoto?.()}
        />
      ) : null}

      {state.helperLevel > 0 || game.openChapters.length > 0 ? (
        <div className="map-side">
          {onGoPlot ? <PlotButtons game={game} current="garden" onGo={onGoPlot} /> : null}
          {state.helperLevel > 0 ? (
            <button
              type="button"
              className={`map-side-btn helper-chip${state.helperOn ? ' on' : ''}`}
              onClick={game.switchHelper}
              aria-pressed={state.helperOn}
              aria-label={t.helper.toggleAria(state.helperOn)}
            >
              <IconHelper />
              <span className="map-side-label">{state.helperOn ? t.ux.map.helperOn : t.ux.map.helperOff}</span>
            </button>
          ) : null}
        </div>
      ) : null}

      {!photoMode && game.features.has('weather') && !overlayOpen ? <WeatherDecision game={game} onToast={showToast} /> : null}

      <BottomBar
        game={game}
        highlightOffline={highlightId === 'offline'}
        onClaimOffline={claimOffline}
        onOpenToday={() => setTodayOpen(true)}
        extras={extras}
        onWater={onRake}
      />

      <div
        className={`garden-stage ${skinClass}`}
        data-daypart={ambient.daypart}
        data-season={ambient.season}
      >
        <ArtDefs />
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
          {game.features.has('weather') || weatherOverride() ? (
            <WeatherLayer weather={weatherOverride() ?? weatherAt(game.nowTick)} season={ambient.season} />
          ) : null}
          <DecorLayer game={game} season={ambient.season} editing={decorEdit} onDone={() => setDecorEdit(false)} />
          {state.helperLevel > 0 && state.helperOn ? (
            <>
              <HelperWalker />
              {!photoMode ? <SpeechBubble lines={t.jonas.sayings} who="jonas" /> : null}
            </>
          ) : null}
          <GardenCritters
            chickens={(state.owned.huehnerstall ?? 0) > 0}
            bees={(state.owned.bienenstock ?? 0) > 0}
            daypart={ambient.daypart}
          />
          {!photoMode ? <SkyEventButton game={game} onWish={() => setWishOpen(true)} /> : null}
          {!photoMode ? <Residents game={game} ambient={ambient} onToast={showToast} /> : null}
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
                <ArtSvg viewBox="0 0 32 24" width="100%" height="100%">
                  <rect x="1.5" y="1.5" width="29" height="21" rx="2.5" fill="#fdf8ec" stroke="#8a6a40" strokeWidth="1.6" />
                  <path d="M2 3 L16 14 L30 3" fill="none" stroke="#8a6a40" strokeWidth="1.6" />
                  <circle cx="16" cy="14" r="3.4" fill="#c4553f" />
                </ArtSvg>
              </span>
            ) : null}
          </button>

          {GENERATORS.map((def) => (
            <GardenPlot
              key={def.id}
              def={def}
              game={game}
              selectedHere={selected === def.id}
              animated={animId === def.id}
              totalMult={totalMult}
              hl={highlightId === def.id}
              nextWild={def.id === nextWildId}
              signsAll={signsAll}
              bestBuy={bestBuy}
              growing={growing === def.id}
              season={ambient.season}
              onSelect={() => setSelected(def.id)}
              onTier={(tier) => {
                if (tier >= 2) showToast(t.milestone.tier(def.name, tier))
                setGrowing(def.id)
                window.setTimeout(() => setGrowing((g) => (g === def.id ? null : g)), 1300)
              }}
            />
          ))}
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

      {crossOpen ? <CrossSheet game={game} onClose={() => setCrossOpen(false)} onToast={showToast} /> : null}
      {decorOpen ? (
        <DecorSheet
          game={game}
          onClose={() => setDecorOpen(false)}
          onPlace={() => {
            setDecorOpen(false)
            setDecorEdit(true)
          }}
        />
      ) : null}
      {festOpen ? <FestSheet game={game} onClose={() => setFestOpen(false)} /> : null}
      {wishOpen ? <WishSheet game={game} onClose={() => setWishOpen(false)} /> : null}

      {progressOpen ? (
        <ProgressSheet game={game} onClose={() => setProgressOpen(false)} />
      ) : null}
      {todayOpen ? (
        <TodaySheet
          game={game}
          onClose={() => setTodayOpen(false)}
          extras={extras}
          updateExtras={updateExtras}
          onClaimDaily={claimDaily}
          onCooked={showToast}
        />
      ) : null}
    </section>
  )
}
