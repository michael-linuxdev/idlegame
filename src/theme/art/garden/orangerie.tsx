/** Hauptgarten-Bereich: orangerie (kräftiger Stil, parts/bold.tsx). */
import { CitrusPot, Shadow, SnowCap, useSeason } from '../parts'
import { Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P, tone } from '../palette'
import { Grow, OUT, Rod } from './shared'

const line = boldLine()
const detail = boldDetail()
const STONE = tone('#e9e2d2')
const IRON = tone('#4a5a52')

/** Hohes Bogenfenster mit Zitrusbäumchen dahinter; (x, y) = linke untere Ecke. */
function ArchWindow({ x, y, w, h, fruit }: { x: number; y: number; w: number; h: number; fruit: string }) {
  const cx = x + w / 2
  return (
    <g>
      <path d={`M${x} ${y} V${y - h + w / 2} a${w / 2} ${w / 2} 0 0 1 ${w} 0 V${y} Z`} fill={P.glassWarm} {...detail} />
      <circle cx={cx} cy={y - h * 0.36} r={w * 0.36} fill={P.leafDark} />
      <circle cx={cx - w * 0.14} cy={y - h * 0.3} r={w * 0.11} fill={fruit} />
      <circle cx={cx + w * 0.15} cy={y - h * 0.44} r={w * 0.11} fill={fruit} />
      <path d={`M${cx} ${y - 0.8} V${y - h * 0.2}`} stroke={P.bark} strokeWidth={w * 0.12} />
      <path d={`M${x + 0.8} ${y - h + w / 2} H${x + w - 0.8}`} stroke={P.white} strokeWidth={BOLD.hair} />
    </g>
  )
}

export function Orangerie({ t }: { t: number }) {
  const winter = useSeason() === 'winter'
  if (t === 1) {
    return (
      <g>
        <Shadow rx={30} />
        <CitrusPot x={44} y={77} s={1.9} />
        <CitrusPot x={73} y={76} s={1.1} fruit={P.amber} />
      </g>
    )
  }
  if (t === 2) {
    return (
      <g>
        <Shadow rx={40} />
        {/* Eisengestell mit Glas */}
        <path d="M22 75 V46 Q50 12 78 46 V75 Z" fill={P.glassWarm} fillOpacity="0.4" />
        <path d="M26 72 V47 Q30 40 35 35 V72 Z" fill={P.white} opacity="0.3" />
        <path d="M36 75 V33.5 M50 75 V29 M64 75 V33.5 M22 55 H78" stroke={IRON} strokeWidth={BOLD.detail} />
        <Rod d="M22 75 V46 Q50 12 78 46 V75" c={IRON} w={2.2} />
        {winter ? <SnowCap d="M32 34 Q50 20 68 34" w={3.2} /> : null}
        <CitrusPot x={37} y={77} s={1.25} />
        <CitrusPot x={64} y={77} s={1.25} fruit={P.amber} />
      </g>
    )
  }
  const w = t === 3 ? 58 : t === 4 ? 68 : 80
  const x = 50 - w / 2
  const n = t === 3 ? 3 : t === 4 ? 4 : 5
  const top = 37
  const r = t === 4 ? 16 : 21
  const ww = 10
  const gap = (w - n * ww) / (n + 1)
  return (
    <g>
      <Shadow rx={w / 2 + 6} />
      <Grow s={t === 3 ? 0.96 : 1}>
        {t >= 4 ? (
          <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 1 }}>
            {/* Glaskuppel */}
            <path d={`M${50 - r} ${top - 2} A${r} ${r * 0.95} 0 0 1 ${50 + r} ${top - 2} Z`} fill={P.glassWarm} fillOpacity="0.7" />
            <path d={`M${50 - r * 0.82} ${top - 4} A${r * 0.82} ${r * 0.8} 0 0 1 ${50 - r * 0.3} ${top - 2 - r * 0.8} Q${50 - r * 0.62} ${top - r * 0.5} ${50 - r * 0.56} ${top - 4} Z`} fill={P.white} opacity="0.45" />
            <path d={`M50 ${top - 2} V${top - 2 - r * 0.95} M${50 - r * 0.5} ${top - 2} Q${50 - r * 0.5} ${top - r * 0.8} 50 ${top - 2 - r * 0.95} Q${50 + r * 0.5} ${top - r * 0.8} ${50 + r * 0.5} ${top - 2}`} fill="none" stroke={P.white} strokeWidth={BOLD.detail} />
            <Rod d={`M${50 - r} ${top - 2} A${r} ${r * 0.95} 0 0 1 ${50 + r} ${top - 2}`} c={P.cream} w={1.7} />
            {winter ? <SnowCap d={`M${50 - r * 0.6} ${top - 2 - r * 0.74} Q50 ${top - 2 - r * 1.16} ${50 + r * 0.6} ${top - 2 - r * 0.74}`} w={3.2} /> : null}
            <path d={`M50 ${top - 2 - r * 0.95} v-3.4`} stroke={OUT} strokeWidth={BOLD.detail} strokeLinecap="round" />
            <circle cx="50" cy={top - 2 - r * 0.95 - 4.6} r="2.6" fill={P.brass} {...detail} />
          </g>
        ) : (
          <g>
            {/* flaches Glasdach */}
            <path d={`M${x + 1} ${top - 2} L50 ${top - 15} L${x + w - 1} ${top - 2} Z`} fill={P.glassWarm} fillOpacity="0.7" />
            <path d={`M50 ${top - 2} V${top - 14} M${x + w * 0.28} ${top - 2} V${top - 8.4} M${x + w * 0.72} ${top - 2} V${top - 8.4}`} stroke={P.white} strokeWidth={BOLD.detail} />
            <Rod d={`M${x + 1} ${top - 2} L50 ${top - 15} L${x + w - 1} ${top - 2}`} c={P.cream} w={1.7} />
            {winter ? <SnowCap d={`M${x + 8} ${top - 6.5} L50 ${top - 17.6} L${x + w - 8} ${top - 6.5}`} w={3.2} /> : null}
          </g>
        )}
        {/* Steinbau mit hohen Bogenfenstern */}
        <Wall x={x} y={top} w={w} h={70 - top} fill={STONE} />
        {Array.from({ length: n }, (_, i) => (
          <ArchWindow key={i} x={x + gap + i * (ww + gap)} y={67} w={ww} h={24} fruit={i % 2 ? P.amber : P.yellow} />
        ))}
        {/* Lichtreflex wandert über das Glas */}
        <path d={`M${x + gap + 2} 50 l4 8 M${x + gap + 5.4} 49 l2.4 4.6`} stroke={P.white} strokeWidth="1.6" strokeLinecap="round" className="ma-glint" />
        {/* Gesims und Sockel */}
        <rect x={x - 2.5} y={top - 3} width={w + 5} height="5" rx="1.2" fill={P.cream} {...line} />
        {winter ? <SnowCap d={t >= 4 ? `M${x} ${top - 4.4} H${50 - r - 2} M${50 + r + 2} ${top - 4.4} H${x + w}` : `M${x} ${top - 4.4} h5 M${x + w - 5} ${top - 4.4} h5`} w={3} /> : null}
        <Wall x={x - 2} y={67} w={w + 4} h={7} fill={P.stoneLight} />
      </Grow>
      {t >= 3 ? (
        <g className={t === 3 ? 't-new' : undefined} style={{ ["--i" as string]: 2 }}>
          <CitrusPot x={t >= 5 ? 93.5 : 91} y={77} s={0.85} fruit={P.amber} />
        </g>
      ) : null}
      {t >= 5 ? (
        <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 3 }}>
          {/* Springbrunnen */}
          <path d="M8 74 q-5 -9 0 -12 M8 74 q5 -9 0 -12" stroke={P.waterLight} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <ellipse cx="8" cy="74" rx="10" ry="3.6" fill={P.stoneLight} {...detail} />
          <ellipse cx="8" cy="73.6" rx="7" ry="2" fill={P.pond} stroke={OUT} strokeWidth={BOLD.hair} />
          <Rod d="M8 73.5 V66" c={P.stoneLight} w={1.6} />
        </g>
      ) : null}
    </g>
  )
}
