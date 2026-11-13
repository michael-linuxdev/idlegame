/** Hauptgarten-Bereich: gewaechshaus (kräftiger Stil, parts/bold.tsx). */
import { CitrusPot, Flower, Fruit, Lettuce, Pinwheel, Shadow, SnowCap, Sprout, useSeason } from '../parts'
import { Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Grow, LEAF, LEAF_D, LEAF_L, OUT, Rod } from './shared'

const line = boldLine()
const detail = boldDetail()

export function Gewaechshaus({ t }: { t: number }) {
  const winter = useSeason() === 'winter'
  const tomatoes = (x0: number, x1: number, y: number, h: number) =>
    Array.from({ length: Math.floor((x1 - x0) / 9) + 1 }, (_, i) => {
      const x = x0 + i * 9
      return (
        <g key={i}>
          <path d={`M${x} ${y} V${y - h}`} stroke={LEAF_D} strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx={x - 2.4} cy={y - h * 0.66} rx="3.4" ry="2.2" fill={LEAF} />
          <ellipse cx={x + 2.4} cy={y - h * 0.34} rx="3.4" ry="2.2" fill={LEAF_L} />
          <Fruit cx={x + 2} cy={y - h * 0.78} r={2.3} c={P.red} />
          <Fruit cx={x - 2} cy={y - h * 0.22} r={2} c={i % 2 ? P.amber : P.red} ripe={i % 2 === 0} />
        </g>
      )
    })
  if (t === 1) {
    return (
      <g>
        <Shadow rx={36} />
        {/* Frühbeetkasten mit aufgestelltem Glasdeckel */}
        <path d="M24 56 L27 33 H73 L76 56 Z" fill={P.glass} fillOpacity="0.6" />
        <path d="M30 53 L32 36 H40 L39 53 Z" fill={P.white} opacity="0.35" />
        <Rod d="M24 56 L27 33 H73 L76 56 M50 33 V56" c={P.white} w={1.6} />
        <rect x="22" y="53" width="56" height="10" rx="2" fill={winter ? P.cream : P.soil} {...line} />
        <Sprout x={33} y={61} />
        <Sprout x={44} y={61} />
        <Sprout x={56} y={61} />
        <Sprout x={67} y={61} />
        <Wall x={21} y={61} w={58} h={13} planks={1} />
      </g>
    )
  }
  const w = t === 2 ? 46 : t === 3 ? 58 : 72
  const x = 50 - w / 2
  const top = t === 2 ? 50 : t === 3 ? 46 : 41
  const rise = t === 2 ? 15 : t === 3 ? 19 : 23
  const frame = t >= 5 ? P.cream : P.white
  const bars = Math.floor(w / 11)
  const house = `M${x} 68 V${top} H${x + w} V68 M${x - 3.5} ${top} L50 ${top - rise} L${x + w + 3.5} ${top} Z`
  return (
    <g>
      <Shadow rx={w / 2 + 8} />
      <Grow s={t === 4 ? 0.94 : 1}>
        {/* Pflanzen im Haus */}
        {t >= 3 ? <g className="art-under-glass">{tomatoes(x + 7, x + w - 7, 67, t >= 4 ? 21 : 17)}</g> : (
          <g>
            <Lettuce x={39} y={67} />
            <Lettuce x={61} y={67} />
          </g>
        )}
        {/* Glas: Wand und Dach, links Licht, rechts Schatten */}
        <path d={`M${x} 68 V${top} H${x + w} V68 Z M${x - 3.5} ${top} L50 ${top - rise} L${x + w + 3.5} ${top} Z`} fill={P.glass} fillOpacity="0.55" />
        <path d={`M${x + 2.5} ${top + 2} h${w * 0.13} V66 h${-w * 0.13} Z`} fill={P.white} opacity="0.4" />
        <path d={`M50 ${top - rise + 3} L${x + w + 0.5} ${top - 1} H50 Z M${x + w * 0.78} ${top + 1} H${x + w - 1} V67 H${x + w * 0.78} Z`} fill={OUT} opacity="0.1" />
        {/* Sprossen */}
        <path
          d={Array.from({ length: bars }, (_, i) => {
            const bx = x + ((i + 1) * w) / (bars + 1)
            const ry = top - rise * (1 - Math.abs(bx - 50) / (w / 2 + 3.5))
            return `M${bx.toFixed(1)} 68 V${ry.toFixed(1)}`
          }).join(' ')}
          stroke={P.white}
          strokeWidth={BOLD.detail}
        />
        {/* Rahmen mit dunkler Kontur */}
        <Rod d={house} c={frame} w={1.7} />
        {winter ? <SnowCap d={`M${x - 0.5} ${top - 3} L50 ${top - rise - 2.4} L${x + w + 0.5} ${top - 3}`} w={3.6} /> : null}
        {/* Windrad auf dem Dach dreht sich beim Arbeiten */}
        <Pinwheel x={x + w - 4} y={top - 1} s={0.9} />
        {/* Tür */}
        <rect x="44.5" y={top + 6} width="11" height={62 - top} rx="1" fill={P.white} fillOpacity="0.45" {...detail} />
        <circle cx="53.4" cy={top + 6 + (62 - top) * 0.55} r="0.9" fill={P.brass} />
        {/* Sockel */}
        <Wall x={x - 1.5} y={67} w={w + 3} h={7} fill={P.stoneLight} />
        {t >= 4 ? (
          <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 1 }}>
            {/* offene Dachluke */}
            <path d={`M56 ${top - rise + 6} L71 ${top - rise + 8.5} L69 ${top - rise + 16} L56 ${top - rise + 13} Z`} fill={P.glass} fillOpacity="0.8" {...detail} />
          </g>
        ) : null}
        {t >= 5 ? (
          <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 2 }}>
            {/* Firstzier und Knauf */}
            {[36, 43, 57, 64].map((cx) => (
              <circle key={cx} cx={cx} cy={top - rise + Math.abs(cx - 50) * (rise / (w / 2 + 3.5)) - 2.6} r="1.7" fill={P.cream} stroke={OUT} strokeWidth={BOLD.hair} />
            ))}
            <path d={`M50 ${top - rise - 1} v-4`} stroke={OUT} strokeWidth={BOLD.detail} strokeLinecap="round" />
            <circle cx="50" cy={top - rise - 6} r="2.8" fill={P.brass} {...detail} />
          </g>
        ) : null}
      </Grow>
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 3 }}>
          <CitrusPot x={7} y={76.5} s={0.72} fruit={P.red} />
          <CitrusPot x={93} y={76.5} s={0.72} fruit={P.amber} />
        </g>
      ) : null}
      {t >= 5 ? (
        <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 4 }}>
          <Flower x={16} y={77} c={P.red} />
          <Flower x={84} y={77} c={P.pink} />
        </g>
      ) : null}
    </g>
  )
}
