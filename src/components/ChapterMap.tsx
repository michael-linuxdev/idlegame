import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { areaRate, areaUnlocked, chapterDef, chapterLevels, chapterStage, type ChapterId } from '../game/chapters'
import { milestonesReached, nextMilestone } from '../game/generators'
import { formatAsh, formatClock, formatDecimal } from '../game/format'
import { playSfx } from '../game/sound'
import { bestChapterBuy } from '../game/state'
import { WEINLESE } from '../game/extrasCore'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import { OrchardArt, OrchardSapling, OrchardWild } from '../theme/OrchardArt'
import { OrchardBackdrop } from '../theme/OrchardBackdrop'
import { VineyardArt, VineyardBackdrop, VineyardStakes, VineyardWild } from '../theme/VineyardArt'
import { ChapterAreaArt, ChapterBackdrop, ChapterReady, ChapterWild } from '../theme/ChapterArt'
import { CHAPTER_ART } from '../theme/chapterArtSpecs'
import { PlotButtons } from './PlotPicker'
import { useSignsAlways } from '../game/prefs'
import { IconGrapes, IconIlse, IconSprout } from '../theme/icons'
import { chapterCopy } from './chapterCopy'
import { useAmbient, type Season } from '../theme/ambient'
import { HelperWalker } from './HelperWalker'
import { SpeechBubble } from './SpeechBubble'
import { GoalStrip, type HudGoal } from './hud/GoalStrip'

type GameApi = ReturnType<typeof useGame>

function AreaArt({ chapter, id, level, season }: { chapter: ChapterId; id: string; level: number; season: Season }) {
  if (chapter === 'weinberg') return <VineyardArt id={id} level={level} season={season} />
  if (chapter === 'obstwiese') return <OrchardArt id={id} level={level} season={season} />
  const spec = CHAPTER_ART[chapter]?.areas[id]
  return spec ? <ChapterAreaArt spec={spec} level={level} season={season} /> : <ChapterReady />
}

function Backdrop({ chapter, stage }: { chapter: ChapterId; stage: number }) {
  if (chapter === 'weinberg') return <VineyardBackdrop stage={stage} />
  if (chapter === 'obstwiese') return <OrchardBackdrop stage={stage} />
  const spec = CHAPTER_ART[chapter]?.backdrop
  return spec ? <ChapterBackdrop spec={spec} stage={stage} /> : <OrchardBackdrop stage={stage} />
}

function WildSpot({ chapter, seed }: { chapter: ChapterId; seed: number }) {
  if (chapter === 'weinberg') return <VineyardWild seed={seed} />
  if (chapter === 'obstwiese') return <OrchardWild seed={seed} />
  return <ChapterWild seed={seed} />
}

function ReadySpot({ chapter }: { chapter: ChapterId }) {
  if (chapter === 'weinberg') return <VineyardStakes />
  if (chapter === 'obstwiese') return <OrchardSapling />
  return <ChapterReady />
}

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
  const [selected, setSelected] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [weinleseOpen, setWeinleseOpen] = useState(false)
  const signsAll = useSignsAlways()
  const stage = chapterStage(def, c)
  const bonusPct = formatDecimal(def.gardenBonusPerLevel * chapterLevels(c) * 100, 1)
  const nextId = def.areas.find((a) => !areaUnlocked(a, c.owned))?.id ?? null
  const rate = game.chapterRate(chapter)

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
        setToast(t.milestones.reached(copy.areas[a.id]!.name, `×${2 ** (now[a.id] ?? 0)}`))
        window.setTimeout(() => setToast(null), 1800)
        break
      }
    }
  }, [c.owned, def.areas, copy.areas])


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
    detail: `${formatAsh(targetCost)} ${copy.currency}`,
    ratio: targetCost > 0 ? Math.min(1, c.cur / targetCost) : 1,
    tone: best ? 'tip' : 'goal',
    icon: <IconSprout />,
    aria: `${t.goal.stripAria}: ${targetName}`,
    onActivate: () => setSelected(target),
  }


  return (
    <section className={`fortress-home orchard-home chapter-${chapter}`} aria-labelledby="chapter-heading">
      <h1 id="chapter-heading" className="sr-only">
        {copy.title}
      </h1>
      <header className="hud">
        <div className="hud-row">
          <div className="hud-card hud-garden orchard-card">
            <span className="hud-stage">{copy.title}</span>
            <span className="orchard-bonus">{t.chapterUi.bonus(bonusPct)}</span>
          </div>
          <div
            className="hud-card hud-wallet"
            role="status"
            aria-label={t.chapterUi.walletAria(formatAsh(c.cur), copy.currency, formatAsh(rate))}
          >
            <span className="hud-amount">
              <span className="hud-amount-icon">{copy.icon}</span>
              {formatAsh(c.cur)}
            </span>
            <span className="hud-rate">{t.chapterUi.rate(formatAsh(rate), copy.currency)}</span>
          </div>
        </div>
        <GoalStrip goal={goal} />
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

      <div className="map-side">
        <PlotButtons game={game} current={chapter} onGo={onGo} />
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
          <Backdrop chapter={chapter} stage={stage} />
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
            return (
              <button
                key={a.id}
                type="button"
                className={`garden-plot${isSel ? ' selected' : ''}${!unlocked ? ' wild' : ready ? ' ready' : ' planted producing'}`}
                style={{ left: a.slot.left, top: a.slot.top, zIndex: 2 + Math.round(Number.parseFloat(a.slot.top)) }}
                aria-label={`${ac.name}, ${unlocked ? t.chapterUi.level(level) : t.hud.locked}`}
                aria-pressed={isSel}
                onClick={() => setSelected(a.id)}
              >
                <span className="plot-visual">
                  {!unlocked ? (
                    <WildSpot chapter={chapter} seed={index} />
                  ) : ready ? (
                    <ReadySpot chapter={chapter} />
                  ) : (
                    <AreaArt chapter={chapter} id={a.id} level={level} season={ambient.season} />
                  )}
                </span>
                {!showSign && unlocked && level > 0 ? (
                  <span className="plot-badge" aria-hidden="true">
                    {level}
                    {stars > 0 ? <span className="plot-badge-stars">{'★'.repeat(Math.min(3, stars))}</span> : null}
                  </span>
                ) : null}
                {showSign ? (
                  <span className="plot-sign">
                    <span className="plot-name">{ac.name}</span>
                    <span className="plot-meta">
                      {!unlocked
                        ? t.chapterUi.locked(copy.areas[a.requires!.id]!.name)
                        : ready
                          ? t.chapterUi.plant
                          : t.chapterUi.level(level)}
                      {stars > 0 ? <span className="plot-stars"> {'★'.repeat(Math.min(3, stars))}</span> : null}
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

      {!c.introSeen ? <ChapterIntro chapter={chapter} onDone={() => game.seeChapterIntro(chapter)} /> : null}
    </section>
  )
}

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
  const def = chapterDef(chapter)
  const a = def.areas.find((x) => x.id === area)!
  const copy = chapterCopy(chapter)
  const ac = copy.areas[area]!
  const c = game.state.chapters[chapter]
  const level = c.owned[area] ?? 0
  const unlocked = areaUnlocked(a, c.owned)
  const cost = game.chapterCostOf(chapter, area)
  const affordable = unlocked && c.cur >= cost
  const mult = game.chapterRateMult
  const ms = nextMilestone(level)
  const [flash, setFlash] = useState(false)
  const hold = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (hold.current != null) window.clearInterval(hold.current)
    },
    [],
  )

  function once() {
    game.buyChapter(chapter, area)
    playSfx('upgrade')
    setFlash(true)
    window.setTimeout(() => setFlash(false), 200)
  }

  function down(e: ReactPointerEvent) {
    if (e.button !== 0 || !affordable) return
    e.preventDefault()
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
        className={`upgrade-hud${flash ? ' upgrade-flash' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chapter-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="upgrade-hud-header">
          <div className="upgrade-hud-heading">
            <p className="upgrade-hud-eyebrow">
              {t.chapterUi.chapter(def.number)} · {copy.title}
            </p>
            <h2 id="chapter-sheet-title">{ac.name}</h2>
            <p className="upgrade-hud-blurb">{ac.blurb}</p>
          </div>
          <button type="button" className="upgrade-hud-close" onClick={onClose} aria-label={t.upgrade.close}>
            ×
          </button>
        </header>
        <figure className="oma-note">
          <figcaption className="oma-note-label">{t.upgrade.noteLabel}</figcaption>
          <blockquote className="oma-note-text">{ac.note}</blockquote>
        </figure>
        {unlocked ? (
          <>
            <p className="upgrade-hud-stats">
              {t.chapterUi.level(level)} · {t.chapterUi.rate(formatAsh(areaRate(a, level) * mult), copy.currency)} →{' '}
              {t.chapterUi.rate(formatAsh(areaRate(a, level + 1) * mult), copy.currency)}
            </p>
            <div className="milestone-line">
              <span>{ms ? t.milestones.next(ms.at) : t.milestones.all}</span>
              {ms ? (
                <span className="milestone-track" aria-hidden="true">
                  <span style={{ width: `${Math.round(((level - ms.from) / (ms.at - ms.from)) * 100)}%` }} />
                </span>
              ) : null}
            </div>
            <div className="upgrade-hud-cta">
              <button
                type="button"
                className={`btn buy upgrade-hud-buy${affordable ? ' pulse-ready' : ''}`}
                disabled={!affordable}
                onPointerDown={down}
                onPointerUp={up}
                onPointerLeave={up}
                onPointerCancel={up}
                onContextMenu={(e) => e.preventDefault()}
              >
                {t.chapterUi.cost(level === 0 ? t.chapterUi.plant : t.chapterUi.upgrade, formatAsh(cost), copy.currency)}
              </button>
              <div className="bulk-toggle">
                <button
                  type="button"
                  className="bulk-chip"
                  disabled={!affordable}
                  onClick={() => {
                    if (game.buyChapterBulk(chapter, area, 10) > 0) playSfx('upgrade')
                  }}
                >
                  {t.bulk.ten}
                </button>
                <button
                  type="button"
                  className="bulk-chip"
                  disabled={!affordable}
                  onClick={() => {
                    if (game.buyChapterBulk(chapter, area, Infinity) > 0) playSfx('upgrade')
                  }}
                >
                  {t.bulk.max}
                </button>
              </div>
              <p className="upgrade-hold-hint">
                {affordable ? t.upgrade.holdHint : t.chapterUi.needMore(formatAsh(Math.max(0, cost - c.cur)), copy.currency)}
              </p>
            </div>
          </>
        ) : (
          <p className="upgrade-hud-stats sheet-locked-hint">{t.chapterUi.locked(copy.areas[a.requires!.id]!.name)}</p>
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
                ? t.weinlese.result(hits, formatAsh(Math.max(hits * 10, rewardPerHit * hits)))
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
                    aria-label={`Traube ${i + 1}`}
                  >
                    <svg viewBox="0 0 30 40" aria-hidden="true">
                      <path d="M15 2v6" stroke="#6e4a2b" strokeWidth="1.6" />
                      {[[15, 12], [10, 15], [20, 15], [6, 20], [15, 20], [24, 20], [10, 26], [20, 26], [15, 32]].map(([x, y], k) => (
                        <circle key={k} cx={x} cy={y} r="4.4" />
                      ))}
                    </svg>
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
