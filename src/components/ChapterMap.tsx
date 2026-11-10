import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useDismiss } from '../game/overlays'
import { careNamesFor } from '../theme/careNames'
import {
  CHAPTER_CARE_MAX,
  areaRateWithCare,
  careOf,
  type CareKind,
  areaCost,
  areaUnlocked, chapterDef, chapterLevels, chapterStage, type ChapterId } from '../game/chapters'
import { milestonesReached, nextMilestone } from '../game/generators'
import { MASTERY_BONUS, masteryMult, masteryProgress, masteryStars } from '../game/mastery'
import { formatErnte, formatClock, formatDecimal } from '../game/format'
import { playSfx } from '../game/sound'
import { abschlussDue, bestChapterBuy, chapterAreaRates, chapterCareCostOf } from '../game/state'
import { arcOf, areaFactor, arcRateMult } from '../game/arcRules'
import { useHints, type HintId } from '../game/hints'
import { useOverlayOpen } from '../game/overlays'
import { OmaHint } from './OmaHint'
import { ArcRuleSheet } from './ArcRuleSheet'
import { WEINLESE } from '../game/extrasCore'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import { useChapterArt } from '../theme/art/chapterArt'
import { chapterArc } from '../game/chapterPlan'
import { ChapterCritters } from './ChapterCritters'
import { AbschlussScene } from './AbschlussScene'
import { PlotButtons } from './PlotPicker'
import { useSignsAlways } from '../game/prefs'
import {
  IconGrapes,
  IconIlse,
  IconSprout,
  IconStar,
  IconStars,
} from '../theme/icons'
import { chapterCopy } from './chapterCopy'
import { surpriseText } from './surpriseText'
import { logPlaytest } from '../game/playtestLog'
import { MasteryStars } from './MasteryStars'
import { useAmbient } from '../theme/ambient'
import { HelperWalker } from './HelperWalker'
import { SpeechBubble } from './SpeechBubble'
import { GoalStrip, type HudGoal } from './hud/GoalStrip'
import { ArtSvg } from '../theme/ArtSvg'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  chapter: ChapterId
  /** Go to another plot ('garden' or a chapter) */
  onGo: (plot: 'garden' | ChapterId) => void
}

/** Kapitel-Karte: own wallet, goal, ten areas — Streuobstwiese, Weinberg, … */
export function ChapterMap({ game, chapter, onGo }: Props) {
  const { state } = game
  const def = chapterDef(chapter)
  const c = state.chapters[chapter]
  const copy = chapterCopy(chapter)
  const ambient = useAmbient()
  const art = useChapterArt(chapter)
  const [selected, setSelected] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)
  function showToast(text: string, ms: number) {
    window.clearTimeout(toastTimer.current)
    setToast(text)
    toastTimer.current = window.setTimeout(() => setToast(null), ms)
  }
  const [weinleseOpen, setWeinleseOpen] = useState(false)
  // Bogen-Regel (Runde 4): eigene Pille oben, Wahl im Fenster; Ilse entscheidet nie
  const arc = arcOf(def.number)
  const [arcOpen, setArcOpen] = useState(false)
  const arcChoice = state.bogenWahl[chapter] ?? null
  const arcMult = arc && arcChoice ? arcRateMult(def, chapterAreaRates(def, c), arcChoice) : 1
  const { seen: seenHints, markSeen } = useHints()
  const overlayOpen = useOverlayOpen()
  const signsAll = useSignsAlways()
  const stage = chapterStage(def, c)
  const bonusPct = formatDecimal(def.gardenBonusPerLevel * chapterLevels(c) * 100, 1)
  const nextId = def.areas.find((a) => !areaUnlocked(a, c.owned))?.id ?? null
  const rate = game.chapterRate(chapter)
  const mastery = masteryProgress(def, c)


  const prevStars = useRef<Record<string, number> | null>(null)
  useEffect(() => {
    const now: Record<string, number> = {}
    for (const a of def.areas) now[a.id] = milestonesReached(c.owned[a.id] ?? 0)
    const before = prevStars.current
    prevStars.current = now
    if (!before) return
    for (const a of def.areas) {
      if ((now[a.id] ?? 0) > (before[a.id] ?? 0)) {
        playSfx('level')
        showToast(t.milestones.reached(copy.areas[a.id]!.name, `×${2 ** (now[a.id] ?? 0)}`), 1800)
        break
      }
    }
  }, [c.owned, def.areas, copy.areas])

  // Neuer Meister-Stern, während die Karte offen ist → kurzer Hinweis (nach dem Meilenstein, ersetzt ihn)
  const prevMastery = useRef<{ chapter: ChapterId; stars: number } | null>(null)
  useEffect(() => {
    const before = prevMastery.current
    prevMastery.current = { chapter, stars: mastery.stars }
    if (!before || before.chapter !== chapter || mastery.stars <= before.stars) return
    playSfx('level')
    showToast(t.mastery.toast(mastery.stars, Math.round(MASTERY_BONUS.perStar * mastery.stars * 100)), 2600)
  }, [chapter, mastery.stars])
  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  // Kapitel-Jackpot beim Ausbau: kurzer Hinweis hier (Garten-Überraschungen zeigt die Gartenkarte)
  const { ackSurprise } = game
  const surprise = state.lastSurprise
  const [seenSurprise, setSeenSurprise] = useState(surprise)
  if (surprise && surprise !== seenSurprise && surprise.chapter === chapter) {
    setSeenSurprise(surprise)
    setToast(surpriseText(surprise))
  }
  useEffect(() => {
    if (!surprise || surprise.chapter !== chapter) return
    playSfx('claim')
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1800)
    logPlaytest('surprise', { kind: surprise.kind, amount: Math.round(surprise.amount * 100) / 100, tier: null, chapter })
    ackSurprise()
  }, [surprise, chapter, ackSurprise])


  const best = bestChapterBuy(state, chapter)
  const target =
    best ??
    [...def.areas]
      .filter((a) => areaUnlocked(a, c.owned))
      .sort((a, b) => game.chapterCostOf(chapter, a.id) - game.chapterCostOf(chapter, b.id))[0]?.id ??
    def.areas[0]!.id
  const targetCost = game.chapterCostOf(chapter, target)
  const targetName = copy.areas[target]!.name
  const goal: HudGoal = {
    key: `${chapter}-${target}`,
    title: (c.owned[target] ?? 0) > 0 ? t.chapterUi.goal(targetName) : t.chapterUi.goalPlant(targetName),
    detail: `${formatErnte(targetCost)} ${copy.currency}`,
    ratio: targetCost > 0 ? Math.min(1, c.cur / targetCost) : 1,
    tone: best ? 'tip' : 'goal',
    icon: <IconSprout />,
    aria: `${t.goal.stripAria}: ${targetName}`,
    onActivate: () => setSelected(target),
  }


  return (
    <section className={`garten-home orchard-home chapter-${chapter}`} aria-labelledby="chapter-heading">
      <h1 id="chapter-heading" className="sr-only">
        {copy.title}
      </h1>
      <header className="hud">
        <div className="hud-row">
          <div className="hud-card hud-garden orchard-card">
            <span className="hud-stage">{copy.title}</span>
            <span className="orchard-bonus-row">
              <span className="orchard-bonus">{t.chapterUi.bonus(bonusPct)}</span>
              {stage === def.areas.length ? <MasteryStars stars={mastery.stars} /> : null}
            </span>
          </div>
          <div
            className="hud-card hud-wallet"
            role="status"
            aria-label={t.chapterUi.walletAria(formatErnte(c.cur), copy.currency, formatErnte(rate))}
          >
            <span className="hud-amount">
              <span className="hud-amount-icon">{copy.icon}</span>
              {formatErnte(c.cur)}
            </span>
            <span className="hud-rate">{t.chapterUi.rate(formatErnte(rate), copy.currency)}</span>
          </div>
        </div>
        <GoalStrip goal={goal} />
        {arc ? (
          <div className="hud-pills-wrap">
            <div className="hud-pills">
              <button
                type="button"
                className={`hud-pill pill-arc${arcChoice ? '' : ' claim'}`}
                onClick={() => setArcOpen(true)}
                aria-haspopup="dialog"
              >
                <span className="hud-pill-icon">
                  <IconSprout />
                </span>
                <span className="hud-pill-name">{t.arcRules.pill[arc]}</span>
                <span className="hud-pill-label">
                  {arcChoice ? (arcMult > 1 ? `+${formatDecimal((arcMult - 1) * 100, (arcMult - 1) * 100 < 10 ? 1 : 0)} %` : '✓') : t.arcRules.open}
                </span>
              </button>
            </div>
          </div>
        ) : null}
        {chapter === 'weinberg' ? (
          <div className="hud-pills-wrap">
            <div className="hud-pills">
              <button
                type="button"
                className={`hud-pill pill-weinlese${game.weinleseReady ? ' claim' : ''}`}
                disabled={!game.weinleseReady}
                onClick={() => setWeinleseOpen(true)}
              >
                <span className="hud-pill-icon">
                  <IconGrapes />
                </span>
                <span className="hud-pill-label">
                  {game.weinleseReady
                    ? t.weinlese.button
                    : t.weinlese.cooldown(formatClock(state.weinleseAt + WEINLESE.cooldownMs - game.nowTick))}
                </span>
              </button>
            </div>
          </div>
        ) : null}
      </header>

      {toast ? (
        <div className="hud-toast" role="status">
          {toast}
        </div>
      ) : null}

      <div className="map-side map-side--right">
        <PlotButtons game={game} current={chapter} onGo={onGo} />
      </div>
      <div className="map-side">
        {state.ilseLevel > 0 ? (
          <button
            type="button"
            className={`map-side-btn helper-chip${state.ilseOn ? ' on' : ''}`}
            onClick={game.switchIlse}
            aria-pressed={state.ilseOn}
            aria-label={t.ilse.toggleAria(state.ilseOn)}
          >
            <IconIlse />
          </button>
        ) : null}
      </div>

      <div className={`garden-stage orchard-stage stage-${chapter}`} data-daypart={ambient.daypart} data-season={ambient.season}>
        <div className="garden-map" role="application" aria-label={copy.title}>
          <art.backdrop stage={stage} />
          <ChapterCritters chapter={chapter} daypart={ambient.daypart} season={ambient.season} />
          {state.ilseLevel > 0 && state.ilseOn ? (
            <>
              <HelperWalker variant="ilse" />
              <SpeechBubble lines={t.ilse.sayings} who="ilse" />
            </>
          ) : null}
          {def.areas.map((a, index) => {
            const level = c.owned[a.id] ?? 0
            const unlocked = areaUnlocked(a, c.owned)
            const ac = copy.areas[a.id]!
            const ready = unlocked && level === 0
            const isSel = selected === a.id
            const showSign = isSel || ready || a.id === nextId || (signsAll && unlocked)
            const stars = milestonesReached(level)
            const canBuy = unlocked && game.chapterCostOf(chapter, a.id) <= c.cur
            return (
              <button
                key={a.id}
                type="button"
                className={`garden-plot${isSel ? ' selected' : ''}${!unlocked ? ' wild' : ready ? ' ready' : ' planted producing'}${canBuy ? ' can-buy' : ''}${a.id === target ? ' goal-target' : ''}`}
                style={{ left: a.slot.left, top: a.slot.top, zIndex: 2 + Math.round(Number.parseFloat(a.slot.top)) }}
                aria-pressed={isSel}
                onClick={() => setSelected(a.id)}
              >
                {/* Name = sichtbarer Text (Schild/Plakette, WCAG „label in name“), Stufe/gesperrt als unsichtbarer Zusatz */}
                {!showSign && !(unlocked && level > 0) ? (
                  <span className="sr-only">{`${ac.name}, ${unlocked ? t.chapterUi.plant : t.hud.locked}`}</span>
                ) : null}
                <span className="plot-visual">
                  {!unlocked ? (
                    <art.wild seed={index} />
                  ) : ready ? (
                    <art.ready />
                  ) : (
                    <art.area id={a.id} level={level} season={ambient.season} />
                  )}
                </span>
                {!showSign && unlocked && level > 0 ? (
                  <span className="plot-badge">
                    {canBuy ? <span className="plot-canbuy in-badge" aria-hidden="true" /> : null}
                    <span className="plot-badge-name">{ac.name}</span>
                    <span className="sr-only">{`, ${t.chapterUi.level(level)}`}</span>
                    <span className="plot-badge-level" aria-hidden="true">
                      {level}
                      {stars > 0 ? <span className="plot-badge-stars"><IconStars n={Math.min(3, stars)} /></span> : null}
                    </span>
                  </span>
                ) : null}
                {showSign ? (
                  <span className="plot-sign">
                    <span className="plot-name">{ac.name}</span>
                    {!unlocked ? <span className="sr-only">{`, ${t.hud.locked}:`}</span> : null}
                    <span className="plot-meta">
                      {!unlocked
                        ? t.chapterUi.locked(copy.areas[a.requires!.id]!.name)
                        : ready
                          ? t.chapterUi.plant
                          : t.chapterUi.level(level)}
                      {stars > 0 ? <span className="plot-stars" aria-hidden="true"> <IconStars n={Math.min(3, stars)} /></span> : null}
                    </span>
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      {selected ? (
        <ChapterSheet game={game} chapter={chapter} area={selected} onClose={() => setSelected(null)} />
      ) : null}

      {weinleseOpen ? (
        <WeinleseGame
          onDone={(hits) => {
            game.weinlese(hits)
            setWeinleseOpen(false)
          }}
          rewardPerHit={rate * WEINLESE.secondsPerHit}
        />
      ) : null}

      {arcOpen ? <ArcRuleSheet game={game} chapter={chapter} onClose={() => setArcOpen(false)} /> : null}
      {arc && !arcChoice && c.introSeen && !selected && !arcOpen && !overlayOpen && stage >= 2 && !seenHints.includes(`arc${arc}` as HintId) ? (
        <OmaHint id={`arc${arc}` as HintId} onOk={() => markSeen(`arc${arc}` as HintId)} />
      ) : null}
      {!c.introSeen ? <ChapterIntro chapter={chapter} onDone={() => game.seeChapterIntro(chapter)} /> : null}
      {chapter === 'omasgarten' && abschlussDue(state) && !selected ? <AbschlussScene onDone={game.seeAbschluss} /> : null}
    </section>
  )
}

type ChapterBulk = 1 | 5 | 'max'

function ChapterSheet({
  game,
  chapter,
  area,
  onClose,
}: {
  game: GameApi
  chapter: ChapterId
  area: string
  onClose: () => void
}) {
  useDismiss(onClose)
  const def = chapterDef(chapter)
  const a = def.areas.find((x) => x.id === area)!
  const copy = chapterCopy(chapter)
  const ac = copy.areas[area]!
  const c = game.state.chapters[chapter]
  const level = c.owned[area] ?? 0
  const unlocked = areaUnlocked(a, c.owned)
  const nextCost = game.chapterCostOf(chapter, area)
  const costMult = nextCost / Math.max(1, areaCost(a, level))
  // Bogen-Regel: Faktor dieses Bereichs (mit dem Deckel des Kapitels)
  const arcFactor = areaFactor(def, chapterAreaRates(def, c), game.state.bogenWahl[chapter], def.areas.indexOf(a))
  const mult = game.chapterRateMult * masteryMult(masteryStars(chapterDef(chapter), c)) * arcFactor
  const ms = nextMilestone(level)
  const stars = milestonesReached(level)
  const ambient = useAmbient()
  const art = useChapterArt(chapter)
  const bulk = 1 as ChapterBulk
  const [flash, setFlash] = useState(false)
  const hold = useRef<number | null>(null)

  // Cost / count for the chosen amount
  let count = 1
  let cost = nextCost
  if (bulk === 5) {
    count = 5
    cost = 0
    for (let i = 0; i < 5; i++) cost += areaCost(a, level + i, costMult)
  } else if (bulk === 'max') {
    let left = c.cur
    let n = 0
    let sum = 0
    while (n < 1000) {
      const step = areaCost(a, level + n, costMult)
      if (step > left) break
      left -= step
      sum += step
      n += 1
    }
    count = Math.max(1, n)
    cost = n > 0 ? sum : nextCost
  }
  const affordable = unlocked && c.cur >= cost
  const affordRatio = cost > 0 ? Math.min(1, c.cur / cost) : 1
  const rate = areaRateWithCare(a, level, c) * mult
  const gain = (areaRateWithCare(a, level + count, c) - areaRateWithCare(a, level, c)) * mult
  const care = careOf(c, area)
  const careNames = careNamesFor(area, t.chapterCare.names[chapter] ?? t.chapterCare.fallback)
  const action = level === 0 ? t.chapterUi.plant : t.chapterUi.upgrade

  useEffect(
    () => () => {
      if (hold.current != null) window.clearInterval(hold.current)
    },
    [],
  )

  function pop() {
    playSfx('upgrade')
    setFlash(true)
    window.setTimeout(() => setFlash(false), 200)
  }

  function once() {
    game.buyChapter(chapter, area)
    pop()
  }

  function down(e: ReactPointerEvent) {
    if (e.button !== 0 || !affordable) return
    e.preventDefault()
    if (bulk !== 1) {
      if (game.buyChapterBulk(chapter, area, bulk === 5 ? 5 : Infinity) > 0) pop()
      return
    }
    once()
    hold.current = window.setInterval(once, 140)
  }

  function up() {
    if (hold.current != null) window.clearInterval(hold.current)
    hold.current = null
  }

  return (
    <div className="upgrade-hud-layer" role="presentation" onClick={onClose}>
      <div
        className={`upgrade-hud gc-card chapter-card${flash ? ' upgrade-flash' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chapter-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="gc-top">
          <div className={`gc-portrait${!unlocked ? ' locked' : ''}`} aria-hidden="true">
            <span className="gc-portrait-art">
              {!unlocked ? (
                <art.wild seed={0} />
              ) : level === 0 ? (
                <art.ready />
              ) : (
                <art.area id={area} level={level} season={ambient.season} />
              )}
            </span>
            {unlocked && level > 0 ? <span className="gc-level">{level}</span> : null}
          </div>
          <div className="gc-info">
            <p className="gc-eyebrow">
              {t.chapterUi.chapter(def.number)} · {copy.title}
            </p>
            <h2 id="chapter-sheet-title" className="gc-name">
              {ac.name}
            </h2>
            {unlocked ? (
              <>
                <div className="gc-stars" role="img" aria-label={t.milestones.starsAria(stars)}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < stars ? 'on' : undefined}>
                      <IconStar />
                    </span>
                  ))}
                  {stars > 5 ? <em>+{stars - 5}</em> : null}
                </div>
                <p className="gc-rate">
                  {copy.icon} {formatErnte(rate)}/s
                  <span className="upgrade-gain"> +{formatErnte(gain)}/s</span>
                </p>
              </>
            ) : (
              <p className="gc-locked-hint">{t.chapterUi.locked(copy.areas[a.requires!.id]!.name)}</p>
            )}
          </div>
          <button type="button" className="upgrade-hud-close" onClick={onClose} aria-label={t.upgrade.close}>
            ×
          </button>
        </div>

        {level === 0 && unlocked ? (
          <figure className="oma-note">
            {/* Bogen IV: Mila schreibt; Kapitel 50 (Bogen 5) wieder Oma */}
            <figcaption className="oma-note-label">{chapterArc(def.number) === 4 ? t.chapterUi.noteLabelMila : t.upgrade.noteLabel}</figcaption>
            <blockquote className="oma-note-text">{ac.note}</blockquote>
          </figure>
        ) : null}

        {unlocked ? (
          <>
            {ms ? (
              <div className="gc-milestone" title={t.milestones.next(ms.at)}>
                <span className="gc-milestone-fill" style={{ width: `${Math.round(((level - ms.from) / (ms.at - ms.from)) * 100)}%` }} />
                <span className="gc-milestone-label">{t.milestones.short(ms.at)}</span>
                <span className="gc-milestone-star" aria-hidden="true">
                  <IconStar />
                </span>
              </div>
            ) : null}
            {/* „×5“ und „Max“ sind raus (Wunsch 2026-11-09): nur Einzelkauf, Gedrückthalten baut schnell weiter */}
            <button
              type="button"
              className={`btn buy upgrade-hud-buy gc-buy${affordable ? ' pulse-ready' : ''}`}
              disabled={!affordable}
              onPointerDown={down}
              onPointerUp={up}
              onPointerLeave={up}
              onPointerCancel={up}
              onContextMenu={(e) => e.preventDefault()}
              aria-label={t.chapterUi.cost(action, formatErnte(cost), copy.currency)}
            >
              <span className="gc-buy-fill" style={{ width: `${Math.round(affordRatio * 100)}%` }} aria-hidden="true" />
              <span className="gc-buy-label">
                {action}
                {bulk !== 1 ? ` ×${count}` : ''}
              </span>
              <span className="gc-buy-cost">
                {copy.icon} {formatErnte(cost)}
              </span>
            </button>
            <p className="upgrade-hold-hint">
              {affordable
                ? bulk === 1
                  ? t.upgrade.holdHint
                  : ''
                : t.chapterUi.needMore(formatErnte(Math.max(0, cost - c.cur)), copy.currency)}
            </p>
            {level >= 1 ? (
              <div className="gc-care" aria-label={t.chapterCare.title}>
                {(['grow', 'thrift'] as CareKind[]).map((kind, i) => {
                  const rank = care[kind]
                  const maxed = rank >= CHAPTER_CARE_MAX
                  const price = chapterCareCostOf(game.state, chapter, a, kind, rank)
                  const name = careNames[i]!
                  return (
                    <div
                      key={kind}
                      className={`gc-care-tile ${kind === 'grow' ? 'efficiency' : 'capacity'}`}
                      title={kind === 'grow' ? t.chapterCare.growTotal(rank * 6) : t.chapterCare.thriftTotal(Math.round((1 - Math.pow(0.96, rank)) * 100))}
                    >
                      <div className="gc-care-head">
                        <span className="gc-care-icon" aria-hidden="true">
                          {kind === 'grow' ? <IconSprout /> : copy.icon}
                        </span>
                        <span className="gc-care-name">{name}</span>
                      </div>
                      <div className="gc-pips" aria-label={`${rank}/${CHAPTER_CARE_MAX}`}>
                        {Array.from({ length: CHAPTER_CARE_MAX }, (_, k) => (
                          <span key={k} className={k < rank ? 'on' : undefined} />
                        ))}
                      </div>
                      <p className="gc-care-effect">{kind === 'grow' ? t.chapterCare.growPer : t.chapterCare.thriftPer}</p>
                      {maxed ? (
                        <span className="gc-care-max">{t.chapterCare.maxed}</span>
                      ) : (
                        <button
                          type="button"
                          className="gc-care-buy"
                          disabled={c.cur < price}
                          onClick={() => {
                            game.buyChapterCareRank(chapter, area, kind)
                            pop()
                          }}
                          aria-label={t.chapterUi.cost(name, formatErnte(price), copy.currency)}
                        >
                          {copy.icon} {formatErnte(price)}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : null}
          </>
        ) : (
          <button type="button" className="btn buy upgrade-hud-buy gc-buy" disabled>
            <span className="gc-buy-label">{t.upgrade.locked}</span>
          </button>
        )}
      </div>
    </div>
  )
}

function ChapterIntro({ chapter, onDone }: { chapter: ChapterId; onDone: () => void }) {
  const copy = chapterCopy(chapter)
  const body = copy.intro.body
  return (
    <div className="season-ceremony phase-letter orchard-intro" role="dialog" aria-modal="true">
      <article className="season-letter">
        <p className="upgrade-hud-eyebrow">{t.chapterUi.chapter(chapterDef(chapter).number)}</p>
        <h2>{copy.intro.title}</h2>
        {body.map((line, i) => (
          <p key={i} className={i === body.length - 1 ? 'notebook-signature' : undefined}>
            {line}
          </p>
        ))}
        <button type="button" className="btn buy" onClick={onDone}>
          {copy.intro.cta}
        </button>
      </article>
    </div>
  )
}

type GrapeState = 'green' | 'ripe' | 'over' | 'picked' | 'missed'

/**
 * Weinlese: ten grapes ripen one after the other; tap while ripe (dark).
 * Each grape: green 0–1.2 s, ripe 1.2–2.2 s, then overripe.
 */
function WeinleseGame({ onDone, rewardPerHit }: { onDone: (hits: number) => void; rewardPerHit: number }) {
  const [started, setStarted] = useState(false)
  const [now, setNow] = useState(0)
  const [grapes, setGrapes] = useState<GrapeState[]>(() => Array(WEINLESE.grapes).fill('green'))
  const [feedback, setFeedback] = useState<string | null>(null)
  const startRef = useRef(0)
  const STAGGER = 1700
  const GREEN = 1200
  const RIPE = 1000

  useEffect(() => {
    if (!started) return
    startRef.current = performance.now()
    const id = window.setInterval(() => setNow(performance.now() - startRef.current), 80)
    return () => window.clearInterval(id)
  }, [started])

  function phase(i: number): 'wait' | 'green' | 'ripe' | 'over' {
    const t0 = i * STAGGER
    if (now < t0) return 'wait'
    if (now < t0 + GREEN) return 'green'
    if (now < t0 + GREEN + RIPE) return 'ripe'
    return 'over'
  }

  const finished = started && now > (WEINLESE.grapes - 1) * STAGGER + GREEN + RIPE + 400
  const hits = grapes.filter((g) => g === 'picked').length

  function tap(i: number) {
    if (grapes[i] !== 'green') return
    const p = phase(i)
    if (p === 'wait') return
    const next = [...grapes]
    if (p === 'ripe') {
      next[i] = 'picked'
      playSfx('claim')
      setFeedback(t.weinlese.ripe)
    } else {
      next[i] = 'missed'
      setFeedback(p === 'green' ? t.weinlese.unripe : t.weinlese.overripe)
    }
    setGrapes(next)
    window.setTimeout(() => setFeedback(null), 600)
  }

  return (
    <div className="season-ceremony phase-letter weinlese" role="dialog" aria-modal="true" aria-labelledby="weinlese-title">
      <article className="season-letter weinlese-card">
        <h2 id="weinlese-title">{t.weinlese.title}</h2>
        {!started ? (
          <>
            <p>{t.weinlese.intro}</p>
            <button type="button" className="btn buy" onClick={() => setStarted(true)}>
              {t.weinlese.start}
            </button>
          </>
        ) : (
          <>
            <p className="weinlese-score" role="status">
              {finished
                ? t.weinlese.result(hits, formatErnte(Math.max(hits * 10, rewardPerHit * hits)))
                : feedback ?? t.weinlese.hits(hits, WEINLESE.grapes)}
            </p>
            <div className="weinlese-vine">
              {grapes.map((g, i) => {
                const p = phase(i)
                const look = g === 'picked' ? 'picked' : g === 'missed' ? 'missed' : p
                return (
                  <button
                    key={i}
                    type="button"
                    className={`weinlese-grape look-${look}`}
                    onClick={() => tap(i)}
                    disabled={g !== 'green' || p === 'wait'}
                    aria-label={t.weinlese.grapeAria(i + 1)}
                  >
                    <ArtSvg viewBox="0 0 30 40">
                      <path d="M15 2v6" stroke="#6e4a2b" strokeWidth="1.6" />
                      {[[15, 12], [10, 15], [20, 15], [6, 20], [15, 20], [24, 20], [10, 26], [20, 26], [15, 32]].map(([x, y], k) => (
                        <circle key={k} cx={x} cy={y} r="4.4" />
                      ))}
                    </ArtSvg>
                  </button>
                )
              })}
            </div>
            {finished ? (
              <button type="button" className="btn buy" onClick={() => onDone(hits)}>
                {t.weinlese.done}
              </button>
            ) : null}
          </>
        )}
      </article>
    </div>
  )
}
