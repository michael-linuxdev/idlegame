/** Hauptgarten-Bereich: bienenstock. */
import { Bee, Jar, Shadow, SnowCap, useSeason } from '../parts'
import { P, tone } from '../palette'
import { LEAF_D, OUT, WOOD_D } from './shared'

function Hive({
  x,
  y,
  c = tone('#f2d27a'),
  stories = 1,
}: {
  x: number
  y: number
  c?: string
  stories?: number
}) {
  const h = 9
  const top = y - stories * h
  const winter = useSeason() === 'winter'
  return (
    <g>
      <rect x={x - 1} y={y} width="3" height="7" fill={WOOD_D} />
      <rect x={x + 15} y={y} width="3" height="7" fill={WOOD_D} />
      {Array.from({ length: stories }, (_, i) => (
        <rect key={i} x={x - 2} y={y - (i + 1) * h} width="21" height={h} rx="1" fill={c} stroke={OUT} strokeWidth="1.2" />
      ))}
      <path d={`M${x - 4} ${top + 1} L${x + 8.5} ${top - 5} L${x + 21} ${top + 1} Z`} fill={P.roof} stroke={OUT} strokeWidth="1.2" strokeLinejoin="round" />
      {winter ? (
        <g>
          {/* Strohhaube hält das Volk warm */}
          <path d={`M${x - 5} ${top + 2} Q${x + 8.5} ${top - 12} ${x + 22} ${top + 2} L${x + 20} ${top + 7} L${x - 3} ${top + 7} Z`} fill={P.woodLight} stroke={P.woodMid} strokeWidth="1" />
          <path d={`M${x} ${top + 1} l-1 5 M${x + 5} ${top - 1} l-0.6 7 M${x + 12} ${top - 1} l0.6 7 M${x + 17} ${top + 1} l1 5`} stroke={P.woodMid} strokeWidth="0.8" />
          <SnowCap d={`M${x + 1} ${top - 4} Q${x + 8.5} ${top - 9} ${x + 16} ${top - 4}`} w={2.4} />
        </g>
      ) : null}
      <rect x={x + 5} y={y - 3} width="9" height="2" rx="1" fill={OUT} />
    </g>
  )
}

export function Bienenstock({ t, producing }: { t: number; producing: boolean }) {
  const winter = useSeason() === 'winter'
  return (
    <g>
      <Shadow rx={42} />
      {t >= 5 ? (
        <g>
          {/* bee house shelter */}
          <rect x="10" y="34" width="3" height="38" fill={WOOD_D} />
          <rect x="87" y="34" width="3" height="38" fill={WOOD_D} />
          <path d="M4 38 L50 22 L96 38 L96 42 L4 42 Z" fill={P.roof} stroke={OUT} strokeWidth="1.3" strokeLinejoin="round" />
          {winter ? <SnowCap d="M7 36.5 L50 21.5 L93 36.5" w={3} /> : null}
        </g>
      ) : null}
      {t >= 2 ? (
        <g>
          <ellipse cx="18" cy="70" rx="10" ry="4" fill={LEAF_D} />
          {[12, 18, 24].map((x, i) => (
            <path key={x} d={`M${x} 70 v-${6 + i * 2}`} stroke={P.lavender} strokeWidth="2.6" strokeLinecap="round" />
          ))}
        </g>
      ) : null}
      {t <= 2 ? (
        <g transform={`translate(50 66) scale(${t <= 1 ? 1.8 : 1.6}) translate(-50 -66)`}>
          <Hive x={40} y={66} stories={t} />
        </g>
      ) : null}
      {t === 3 ? (
        <g>
          <g transform="translate(50 66) scale(1.25) translate(-50 -66)">
            <Hive x={28} y={64} stories={2} />
            <Hive x={53} y={66} stories={2} c={tone('#9ec9e2')} />
          </g>
        </g>
      ) : null}
      {t >= 4 ? (
        <g>
          <Hive x={24} y={62} stories={2} />
          <Hive x={46} y={60} stories={3} c={tone('#9ec9e2')} />
          <Hive x={68} y={64} stories={2} c={P.cream} />
        </g>
      ) : null}
      {t >= 4 ? (
        <g>
          <Jar x={87} y={73} />
          <Jar x={94} y={74} />
        </g>
      ) : null}
      {producing || t >= 3 ? (
        <g>
          <Bee x={36} y={30} />
          {t >= 3 ? <Bee x={64} y={26} /> : null}
          {t >= 4 ? <Bee x={50} y={18} /> : null}
        </g>
      ) : null}
    </g>
  )
}
