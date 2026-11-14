import { useEffect, useState } from 'react'
import { GENERATORS } from '../../game/generators'
import { yearLetterFor } from '../../game/notebook'
import { WHEEL_SEGMENTS, type WheelKind } from '../../game/gardenLife'
import { playSfx } from '../../game/sound'
import { t } from '../../i18n'
import { WINTERVORRAT } from '../../game/longLoop'
import { IconChest, IconSnow, IconSprout } from '../../theme/icons'
import { ArtSvg } from '../../theme/ArtSvg'
import type { SeasonCardId } from '../../game/seasonCards'

export interface SeasonEnd {
  /** Gartenjahr that now begins */
  year: number
  gained: number
  /** Tiefer Winter instead of a regular Saisonende */
  deep?: boolean
  /** Generation handed down (number of the new generation) */
  generation?: number
  /** Saison-Karte des Jahres, das gerade endet: was sie mit diesem Garten gebracht hat */
  card?: { id: SeasonCardId; preview: number; offline?: number; saving?: number }
  /** Wintervorrat nach diesem Saisonende, wenn er gerade gewachsen ist */
  vorrat?: number
}

interface Props {
  event: SeasonEnd
  onDone: () => void
  /** Glücksrad result for the new Gartenjahr */
  onSpin?: (kind: WheelKind) => void
}

type Phase = 'winter' | 'letter' | 'spring'

/**
 * Saisonende as a little ritual: snow over the sleeping garden → Omas
 * letter for the new year (if any) → spring with what was kept.
 */
export function SeasonCeremony({ event, onDone, onSpin }: Props) {
  const gen = event.generation ?? 0
  const letterId = gen ? null : event.deep ? 'deep1' : yearLetterFor(event.year)
  const [phase, setPhase] = useState<Phase>('winter')
  const corner = event.deep
    ? null
    : GENERATORS.find((g) => (g.unlock?.seasons ?? -1) === event.year - 1)

  useEffect(() => {
    playSfx('season')
  }, [])

  useEffect(() => {
    if (phase !== 'winter') return
    const id = window.setTimeout(() => setPhase(letterId ? 'letter' : 'spring'), 2600)
    return () => window.clearTimeout(id)
  }, [phase, letterId])

  function advance() {
    if (phase === 'winter') setPhase(letterId ? 'letter' : 'spring')
    else if (phase === 'letter') setPhase('spring')
    else onDone()
  }

  const letter = letterId ? t.notebook.entries[letterId] : null

  return (
    <div className={`season-ceremony phase-${phase}${event.deep ? " deep" : ""}`} role="dialog" aria-modal="true" aria-live="polite" onClick={advance}>
      <div className="season-sky" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${-i * 0.45}s` }} />
        ))}
      </div>

      {phase === 'winter' ? (
        <div className="season-card">
          <span className="season-icon">
            <IconSnow />
          </span>
          <h2>{gen ? t.generation.ceremonyTitle : event.deep ? t.season.deepTitle : t.season.winterTitle}</h2>
          <p>{gen ? t.generation.ceremonyLine : event.deep ? t.season.deepLine : t.season.winterLine}</p>
        </div>
      ) : null}

      {phase === 'letter' && letter ? (
        <article className="season-letter" onClick={(e) => e.stopPropagation()}>
          <h2>{letter.title}</h2>
          <p>{letter.body}</p>
          <p className="notebook-signature">{t.notebook.signature}</p>
          <button type="button" className="btn buy" onClick={advance}>
            {t.season.skip}
          </button>
        </article>
      ) : null}

      {phase === 'spring' ? (
        <div className="season-card spring" onClick={(e) => e.stopPropagation()}>
          <span className="season-icon">
            <IconSprout />
          </span>
          <h2>
            {gen
              ? t.generation.springTitle(gen)
              : event.deep
                ? t.season.deepSpringTitle
                : t.season.springTitle(event.year)}
          </h2>
          <p>{t.season.springLine}</p>
          <p className="season-gain">
            {event.deep ? <IconSprout /> : <IconChest />}{' '}
            {t.season.gained(
              gen
                ? t.generation.gained(event.gained)
                : event.deep
                  ? t.season.sprouts(event.gained)
                  : t.prestige.erbstueckeAmount(event.gained),
            )}
          </p>
          {corner ? <p className="season-corner">{t.season.newCorner(corner.name)}</p> : null}
          {event.card ? (
            <p className="season-corner season-card-result">
              {event.card.saving != null
                ? t.seasonCards.resultAusbau(t.seasonCards.cards[event.card.id].name, Math.round(event.card.saving * 100))
                : event.card.offline
                ? t.seasonCards.resultAway(
                    t.seasonCards.cards[event.card.id].name,
                    Math.round((event.card.preview - 1) * 100),
                    Math.round((event.card.preview * event.card.offline - 1) * 100),
                  )
                : t.seasonCards.result(t.seasonCards.cards[event.card.id].name, Math.round((event.card.preview - 1) * 100))}
            </p>
          ) : null}
          {event.vorrat != null ? (
            <p className="season-corner season-vorrat">{t.longLoop.vorratGained(event.vorrat, WINTERVORRAT.max)}</p>
          ) : null}
          {onSpin && !event.deep ? <LuckyWheel onSpin={onSpin} onDone={onDone} /> : (
            <button type="button" className="btn buy" onClick={onDone}>
              {t.season.cta}
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}

const SEG_COLORS = ['#e0485e', '#f5c542', '#7fbf5a', '#6aa6c9', '#f08a2c', '#c76bd9']
/** Kurzbeschriftung je Segment (Sorte aus den Sprachdateien). */
function segGlyph(kind: WheelKind): string {
  return kind === 'yield' ? '+25 %' : kind === 'water' ? '×2' : kind === 'seeds' ? '+30' : t.wheel.glyphVariety
}

/** Glücksrad — one spin per Saisonende, buff for the coming Gartenjahr. */
function LuckyWheel({ onSpin, onDone }: { onSpin: (k: WheelKind) => void; onDone: () => void }) {
  const [angle, setAngle] = useState(0)
  const [result, setResult] = useState<WheelKind | null>(null)
  const [spinning, setSpinning] = useState(false)

  function spin() {
    if (spinning || result) return
    const idx = Math.floor(Math.random() * WHEEL_SEGMENTS.length)
    setSpinning(true)
    setAngle(360 * 5 + (360 - (idx * 60 + 30)))
    playSfx('tick')
    window.setTimeout(() => {
      const kind = WHEEL_SEGMENTS[idx]!
      setResult(kind)
      setSpinning(false)
      onSpin(kind)
      playSfx('streak')
    }, 2300)
  }

  return (
    <div className="lucky-wheel">
      <p className="lucky-title">{t.wheel.title}</p>
      <div className="lucky-dial">
        <span className="lucky-pointer" aria-hidden="true" />
        <ArtSvg viewBox="-50 -50 100 100" style={{ transform: `rotate(${angle}deg)` }}>
          {WHEEL_SEGMENTS.map((kind, i) => {
            const a0 = ((i * 60 - 90) * Math.PI) / 180
            const a1 = (((i + 1) * 60 - 90) * Math.PI) / 180
            const mid = ((i * 60 + 30 - 90) * Math.PI) / 180
            return (
              <g key={i}>
                <path
                  d={`M0 0 L${46 * Math.cos(a0)} ${46 * Math.sin(a0)} A46 46 0 0 1 ${46 * Math.cos(a1)} ${46 * Math.sin(a1)} Z`}
                  fill={SEG_COLORS[i]}
                  stroke="#fdf8ec"
                  strokeWidth="1.5"
                />
                <text
                  x={29 * Math.cos(mid)}
                  y={29 * Math.sin(mid) + 3}
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="700"
                  fill="#fff"
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth="0.6"
                  paintOrder="stroke"
                  transform={`rotate(${i * 60 + 30} ${29 * Math.cos(mid)} ${29 * Math.sin(mid)})`}
                >
                  {segGlyph(kind)}
                </text>
              </g>
            )
          })}
          <circle r="46" fill="none" stroke="#5e3b25" strokeWidth="2" />
          <circle r="6" fill="#fdf8ec" stroke="#5e3b25" strokeWidth="1.5" />
        </ArtSvg>
      </div>
      {result ? <p className="lucky-result">{t.wheel.results[result]}</p> : null}
      {result ? (
        <button type="button" className="btn buy" onClick={onDone}>
          {t.season.cta}
        </button>
      ) : (
        <button type="button" className="btn buy" onClick={spin} disabled={spinning}>
          {spinning ? t.wheel.spinning : t.wheel.spin}
        </button>
      )}
    </div>
  )
}
