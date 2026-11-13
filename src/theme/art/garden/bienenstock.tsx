/** Hauptgarten-Bereich: bienenstock (kräftiger Stil, parts/bold.tsx). */
import { BEE_SCALE, Bee, Jar, Shadow, SnowCap, useSeason } from '../parts'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P, tone } from '../palette'
import { LEAF_D, OUT } from './shared'

const line = boldLine()
const detail = boldDetail()
const BEE = BEE_SCALE * 1.5

/** Magazinbeute: Zargen mit Griffmulde, Flugbrett und Blechdach. Fußpunkt = linke untere Ecke der untersten Zarge. */
function Hive({ x, y, c = tone('#f2d27a'), stories = 1 }: { x: number; y: number; c?: string; stories?: number }) {
  const h = 9.5
  const w = 23
  const top = y - stories * h
  const winter = useSeason() === 'winter'
  return (
    <g>
      {/* Beine */}
      <Post x={x + 2.5} y={y + 7} h={7} w={3} />
      <Post x={x + w - 2.5} y={y + 7} h={7} w={3} />
      {Array.from({ length: stories }, (_, i) => {
        const zy = y - (i + 1) * h
        return (
          <g key={i}>
            <rect x={x} y={zy} width={w} height={h} rx="1" fill={c} {...line} />
            <rect x={x + 1} y={zy + 1} width={w * 0.26} height={h - 2} fill={P.white} opacity="0.2" />
            <rect x={x + w * 0.7} y={zy + 1} width={w * 0.3 - 1} height={h - 2} fill={OUT} opacity="0.14" />
            {/* Griffmulde */}
            <rect x={x + w / 2 - 3.5} y={zy + 2.6} width="7" height="2" rx="1" fill={OUT} opacity="0.4" />
          </g>
        )
      })}
      {/* Flugloch und Flugbrett */}
      <rect x={x + 6} y={y - 3.4} width={w - 12} height="2.4" rx="1.2" fill={OUT} />
      <path d={`M${x - 1.5} ${y} H${x + w + 1.5}`} stroke={OUT} strokeWidth={BOLD.contour + 1.2} strokeLinecap="round" />
      <path d={`M${x - 1.5} ${y} H${x + w + 1.5}`} stroke={P.woodLight} strokeWidth={BOLD.contour - 0.6} strokeLinecap="round" />
      {/* Dach */}
      <path d={`M${x - 3} ${top + 1} L${x + w / 2} ${top - 6.5} L${x + w + 3} ${top + 1} Z`} fill={P.roof} {...line} />
      <path d={`M${x + w / 2} ${top - 4.6} L${x + w + 0.6} ${top} H${x + w / 2} Z`} fill={OUT} opacity="0.18" />
      {winter ? (
        <g>
          {/* Strohhaube hält das Volk warm */}
          <path d={`M${x - 4} ${top + 2} Q${x + w / 2} ${top - 14} ${x + w + 4} ${top + 2} L${x + w + 2} ${top + 7} L${x - 2} ${top + 7} Z`} fill={P.woodLight} {...detail} />
          <path d={`M${x + 2} ${top + 1} l-1 5 M${x + 8} ${top - 2} l-0.6 8 M${x + 15} ${top - 2} l0.6 8 M${x + 21} ${top + 1} l1 5`} stroke={P.woodMid} strokeWidth={BOLD.hair} />
          <SnowCap d={`M${x + 3} ${top - 5} Q${x + w / 2} ${top - 11} ${x + w - 3} ${top - 5}`} w={3} />
        </g>
      ) : null}
    </g>
  )
}

export function Bienenstock({ t, producing }: { t: number; producing: boolean }) {
  const winter = useSeason() === 'winter'
  return (
    <g>
      <Shadow rx={43} />
      {t >= 5 ? (
        <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 1 }}>
          {/* Bienenhaus: Schutzdach auf zwei Pfosten */}
          <Post x={9.5} y={76} h={40} w={4} />
          <Post x={90.5} y={76} h={40} w={4} />
          <path d="M2 39 L50 20 L98 39 V44 H2 Z" fill={P.roof} {...line} />
          <path d="M50 22.4 L96 40 V43 H50 Z" fill={OUT} opacity="0.18" />
          <path d="M12 37.5 L40 26.5" fill="none" stroke={P.white} strokeWidth={BOLD.detail} strokeLinecap="round" opacity="0.4" />
          {winter ? <SnowCap d="M6 36.5 L50 19 L94 36.5" w={3.6} /> : null}
        </g>
      ) : null}
      {t >= 2 ? (
        <g className={t === 2 ? 't-new' : undefined} style={{ ["--i" as string]: 2 }}>
          {/* Lavendel als Bienenweide */}
          <ellipse cx="15" cy="72" rx="11" ry="4.6" fill={LEAF_D} stroke={OUT} strokeWidth={BOLD.detail} />
          {[8, 15, 22].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 71 v-${7 + i * 2}`} stroke={OUT} strokeWidth="4.6" strokeLinecap="round" />
              <path d={`M${x} 71 v-${7 + i * 2}`} stroke={P.lavender} strokeWidth="2.8" strokeLinecap="round" />
            </g>
          ))}
        </g>
      ) : null}
      {t <= 2 ? (
        <g transform={`translate(50 68) scale(${t <= 1 ? 1.7 : 1.5}) translate(-50 -68)`}>
          <Hive x={38.5} y={68} stories={t} />
        </g>
      ) : null}
      {t === 3 ? (
        <g className="t-new" style={{ ["--i" as string]: 3 }}>
          <g transform="translate(50 68) scale(1.22) translate(-50 -68)">
            <Hive x={25} y={66} stories={2} />
            <Hive x={53} y={68} stories={2} c={tone('#9ec9e2')} />
          </g>
        </g>
      ) : null}
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 4 }}>
          <Hive x={15} y={65} stories={2} />
          <Hive x={39} y={63} stories={3} c={tone('#9ec9e2')} />
          <Hive x={63} y={67} stories={2} c={P.cream} />
        </g>
      ) : null}
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 5 }}>
          <Jar x={90} y={75} s={1.25} />
          <Jar x={97} y={76.5} s={1.25} />
        </g>
      ) : null}
      {producing || t >= 3 ? (
        <g>
          <Bee x={34} y={30} s={BEE} />
          {t >= 3 ? <g className={t === 3 ? 't-new' : undefined} style={{ ["--i" as string]: 0 }}><Bee x={66} y={26} s={BEE} /></g> : null}
          {t >= 4 ? <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 1 }}><Bee x={50} y={15} s={BEE} /></g> : null}
        </g>
      ) : null}
    </g>
  )
}
