import { memo, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import {
  ORCHARD,
  ORCHARD_GARDEN_BONUS_PER_LEVEL,
  orchardAreaRate,
  orchardLevels,
  orchardStage,
  orchardUnlocked,
  type OrchardId,
} from '../game/orchard'
import { milestonesReached, nextMilestone } from '../game/generators'
import { formatAsh, formatDecimal, formatRate } from '../game/format'
import { playSfx } from '../game/sound'
import { orchardRateMult, bestOrchardBuy } from '../game/state'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import { OrchardArt, OrchardSapling, OrchardWild } from '../theme/OrchardArt'
import { IconApple, IconHelper, IconSprout } from '../theme/icons'
import { useAmbient } from '../theme/ambient'
import { HelperWalker } from './HelperWalker'
import { GoalStrip, type HudGoal } from './hud/GoalStrip'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  onSwitchPlot: () => void
}

const PATH = 'M50 100 C46 90 40 86 44 78 C48 70 58 68 54 58 C50 50 40 48 46 40 C50 34 52 30 50 22'

const OrchardBackdrop = memo(function OrchardBackdrop({ stage }: { stage: number }) {
  return (
    <div className="garden-ground orchard-ground" aria-hidden="true" data-stage={stage}>
      <svg className="garden-ground-svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="og-grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a9cf7a" />
            <stop offset="50%" stopColor="#93c167" />
            <stop offset="100%" stopColor="#7fb058" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#og-grass)" />
        {/* gentle hill bands */}
        <path d="M0 30 Q30 24 60 30 T100 28 V100 H0z" fill="#ffffff" opacity="0.05" />
        <path d="M0 52 Q40 44 70 52 T100 50 V100 H0z" fill="#ffffff" opacity="0.05" />
        {/* stream */}
        <path d="M100 58 C92 62 96 70 88 76 C80 82 86 92 78 100" stroke="#6aa6c9" strokeWidth="14" fill="none" vectorEffect="non-scaling-stroke" opacity="0.9" />
        <path d="M100 58 C92 62 96 70 88 76 C80 82 86 92 78 100" stroke="#a9d6ee" strokeWidth="5" fill="none" vectorEffect="non-scaling-stroke" strokeDasharray="6 8" className="orchard-stream" />
        {/* meadow path */}
        <path d={PATH} stroke="#b8a070" strokeWidth="22" fill="none" vectorEffect="non-scaling-stroke" opacity="0.55" />
        <path d={PATH} stroke="#d9c79a" strokeWidth="16" fill="none" vectorEffect="non-scaling-stroke" />
        {/* meadow flowers */}
        {Array.from({ length: 40 }, (_, i) => {
          const x = (i * 37) % 100
          const y = 24 + ((i * 53) % 74)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="0.45"
              fill={['#ffffff', '#f5c542', '#c77dd1', '#f28ab2'][i % 4]}
              opacity={stage >= (i % 10) ? 0.9 : 0.25}
            />
          )
        })}
      </svg>
      <div className="garden-hedge orchard-hills">
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" focusable="false">
          <path d="M0 60 V30 Q50 6 110 26 T230 20 T340 24 T400 18 V60z" fill="#6f9c4c" />
          <path d="M0 60 V42 Q70 24 150 40 T300 36 T400 34 V60z" fill="#5d8a3f" />
          <g fill="#8a6a40">
            <path d="M188 30 l12 -10 l12 10 v14 h-24z" />
          </g>
          <path d="M186 30 l14 -12 l14 12" stroke="#b8403a" strokeWidth="4" fill="none" />
        </svg>
      </div>
      <div className="garden-fence">
        <svg viewBox="0 0 400 30" preserveAspectRatio="none" focusable="false">
          <path d="M0 14 H400 M0 22 H400" stroke="#8a6a40" strokeWidth="2.4" />
          {Array.from({ length: 21 }, (_, i) => (
            <rect key={i} x={i * 20 - 2} y="6" width="4" height="24" fill="#a5733f" />
          ))}
        </svg>
      </div>
      <div className="ambient-tint" />
    </div>
  )
})

/** Kapitel 2 — Opas Streuobstwiese: its own map, wallet and ten areas. */
export function OrchardMap({ game, onSwitchPlot }: Props) {
  const { state } = game
  const o = state.orchard
  const ambient = useAmbient()
  const [selected, setSelected] = useState<OrchardId | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const stage = orchardStage(o)
  const bonusPct = formatDecimal(ORCHARD_GARDEN_BONUS_PER_LEVEL * orchardLevels(o) * 100, 1)
  const mult = orchardRateMult(state)
  const nextId = ORCHARD.find((d) => !orchardUnlocked(d, o.owned))?.id ?? null

  const prevStars = useRef<Record<string, number> | null>(null)
  useEffect(() => {
    const now: Record<string, number> = {}
    for (const d of ORCHARD) now[d.id] = milestonesReached(o.owned[d.id] ?? 0)
    const before = prevStars.current
    prevStars.current = now
    if (!before) return
    for (const d of ORCHARD) {
      if ((now[d.id] ?? 0) > (before[d.id] ?? 0)) {
        playSfx('level')
        setToast(t.milestones.reached(t.orchard.areas[d.id].name, `×${2 ** (now[d.id] ?? 0)}`))
        window.setTimeout(() => setToast(null), 1800)
        break
      }
    }
  }, [o.owned])

  const goal: HudGoal = (() => {
    const best = bestOrchardBuy(state)
    const target =
      best ??
      ORCHARD.filter((d) => orchardUnlocked(d, o.owned)).sort(
        (a, b) => game.orchardCostOf(a.id) - game.orchardCostOf(b.id),
      )[0]?.id ??
      'apfel'
    const cost = game.orchardCostOf(target)
    const name = t.orchard.areas[target].name
    const planted = (o.owned[target] ?? 0) > 0
    return {
      key: `orchard-${target}`,
      title: planted ? t.orchard.goal(name) : t.orchard.goalPlant(name),
      detail: `${formatAsh(cost)} ${t.orchard.currency}`,
      ratio: cost > 0 ? Math.min(1, o.obst / cost) : 1,
      tone: best ? 'tip' : 'goal',
      icon: <IconSprout />,
      aria: `${t.goal.stripAria}: ${name}`,
      onActivate: () => setSelected(target),
    }
  })()

  return (
    <section className="fortress-home orchard-home" aria-labelledby="orchard-heading">
      <h1 id="orchard-heading" className="sr-only">
        {t.orchard.title}
      </h1>
      <header className="hud">
        <div className="hud-row">
          <div className="hud-card hud-garden orchard-card">
            <span className="hud-stage">{t.orchard.title}</span>
            <span className="orchard-bonus">{t.orchard.bonus(bonusPct)}</span>
          </div>
          <div
            className="hud-card hud-wallet"
            role="status"
            aria-label={t.orchard.walletAria(formatAsh(o.obst), formatRate(game.orchardRate))}
          >
            <span className="hud-amount">
              <span className="hud-amount-icon">
                <IconApple />
              </span>
              {formatAsh(o.obst)}
            </span>
            <span className="hud-rate">{t.orchard.rate(formatAsh(game.orchardRate))}</span>
          </div>
        </div>
        <GoalStrip goal={goal} />
      </header>

      {toast ? (
        <div className="hud-toast" role="status">
          {toast}
        </div>
      ) : null}

      <div className="map-side">
        <button type="button" className="map-side-btn plot-switch back" onClick={onSwitchPlot} aria-label={t.orchard.toGarden}>
          <IconSprout />
          <span>{t.orchard.chipGarden}</span>
        </button>
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

      <div className="garden-stage orchard-stage" data-daypart={ambient.daypart} data-season={ambient.season}>
        <div className="garden-map" role="application" aria-label={t.orchard.title}>
          <OrchardBackdrop stage={stage} />
          {state.helperLevel > 0 && state.helperOn ? <HelperWalker variant="orchard" /> : null}
          {ORCHARD.map((def, index) => {
            const level = o.owned[def.id] ?? 0
            const unlocked = orchardUnlocked(def, o.owned)
            const copy = t.orchard.areas[def.id]
            const ready = unlocked && level === 0
            const isSel = selected === def.id
            const showSign = unlocked || isSel || def.id === nextId
            const stars = milestonesReached(level)
            return (
              <button
                key={def.id}
                type="button"
                className={`garden-plot${isSel ? ' selected' : ''}${!unlocked ? ' wild' : ready ? ' ready' : ' planted producing'}`}
                style={{ left: def.slot.left, top: def.slot.top, zIndex: 2 + Math.round(Number.parseFloat(def.slot.top)) }}
                aria-label={`${copy.name}, ${unlocked ? t.orchard.level(level) : t.hud.locked}`}
                aria-pressed={isSel}
                onClick={() => setSelected(def.id)}
              >
                <span className="plot-visual">
                  {!unlocked ? <OrchardWild seed={index} /> : ready ? <OrchardSapling /> : <OrchardArt id={def.id} level={level} />}
                </span>
                {showSign ? (
                  <span className="plot-sign">
                    <span className="plot-name">{copy.name}</span>
                    <span className="plot-meta">
                      {!unlocked
                        ? t.orchard.locked(t.orchard.areas[def.requires!.id].name)
                        : ready
                          ? t.orchard.plant
                          : t.orchard.level(level)}
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
        <OrchardSheet game={game} id={selected} mult={mult} onClose={() => setSelected(null)} />
      ) : null}

      {!o.introSeen ? <OrchardIntro onDone={game.seeOrchardIntro} /> : null}
    </section>
  )
}

function OrchardSheet({
  game,
  id,
  mult,
  onClose,
}: {
  game: GameApi
  id: OrchardId
  mult: number
  onClose: () => void
}) {
  const def = ORCHARD.find((d) => d.id === id)!
  const copy = t.orchard.areas[id]
  const o = game.state.orchard
  const level = o.owned[id] ?? 0
  const unlocked = orchardUnlocked(def, o.owned)
  const cost = game.orchardCostOf(id)
  const affordable = unlocked && o.obst >= cost
  const rate = orchardAreaRate(def, level) * mult
  const next = orchardAreaRate(def, level + 1) * mult
  const ms = nextMilestone(level)
  const [flash, setFlash] = useState(false)
  const hold = useRef<number | null>(null)

  useEffect(() => () => {
    if (hold.current != null) window.clearInterval(hold.current)
  }, [])

  function once() {
    game.buyOrchardArea(id)
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
        aria-labelledby="orchard-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="upgrade-hud-header">
          <div className="upgrade-hud-heading">
            <p className="upgrade-hud-eyebrow">{t.orchard.chapter} · {t.orchard.title}</p>
            <h2 id="orchard-sheet-title">{copy.name}</h2>
            <p className="upgrade-hud-blurb">{copy.blurb}</p>
          </div>
          <button type="button" className="upgrade-hud-close" onClick={onClose} aria-label={t.upgrade.close}>
            ×
          </button>
        </header>
        <figure className="oma-note">
          <figcaption className="oma-note-label">{t.upgrade.noteLabel}</figcaption>
          <blockquote className="oma-note-text">{copy.note}</blockquote>
        </figure>
        {unlocked ? (
          <>
            <p className="upgrade-hud-stats">
              {t.orchard.level(level)} · {t.orchard.rate(formatAsh(rate))} → {t.orchard.rate(formatAsh(next))}
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
                {t.orchard.cost(level === 0 ? t.orchard.plant : t.orchard.upgrade, formatAsh(cost))}
              </button>
              <div className="bulk-toggle">
                <button
                  type="button"
                  className="bulk-chip"
                  disabled={!affordable}
                  onClick={() => {
                    if (game.buyOrchardBulk(id, 10) > 0) playSfx('upgrade')
                  }}
                >
                  {t.bulk.ten}
                </button>
                <button
                  type="button"
                  className="bulk-chip"
                  disabled={!affordable}
                  onClick={() => {
                    if (game.buyOrchardBulk(id, Infinity) > 0) playSfx('upgrade')
                  }}
                >
                  {t.bulk.max}
                </button>
              </div>
              <p className="upgrade-hold-hint">
                {affordable ? t.upgrade.holdHint : t.orchard.needMore(formatAsh(Math.max(0, cost - o.obst)))}
              </p>
            </div>
          </>
        ) : (
          <p className="upgrade-hud-stats sheet-locked-hint">
            {t.orchard.locked(t.orchard.areas[def.requires!.id].name)}
          </p>
        )}
      </div>
    </div>
  )
}

function OrchardIntro({ onDone }: { onDone: () => void }) {
  return (
    <div className="season-ceremony phase-letter orchard-intro" role="dialog" aria-modal="true">
      <article className="season-letter">
        <p className="upgrade-hud-eyebrow">{t.orchard.chapter}</p>
        <h2>{t.orchard.intro.title}</h2>
        {t.orchard.intro.body.map((line, i) => (
          <p key={i} className={i === t.orchard.intro.body.length - 1 ? 'notebook-signature' : undefined}>
            {line}
          </p>
        ))}
        <button type="button" className="btn buy" onClick={onDone}>
          {t.orchard.intro.cta}
        </button>
      </article>
    </div>
  )
}
