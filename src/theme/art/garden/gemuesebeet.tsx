/** Hauptgarten-Bereich: gemuesebeet (kräftiger Stil, parts/bold.tsx). */
import { Flower, Fruit, Lettuce, Shadow, Sprout, useSeason } from '../parts'
import { Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { LEAF, LEAF_D, LEAF_L, OUT, Pumpkin, Rod } from './shared'

const line = boldLine()
const detail = boldDetail()

function Carrot({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y} q-6 -8 -2 -10.5 q1.6 2.6 2 4.5 q0.4 -3.4 2.4 -5.5 q3.6 3.5 -2.4 11.5 z`} fill={LEAF} stroke={OUT} strokeWidth={BOLD.hair} strokeLinejoin="round" />
      <path d={`M${x - 2.3} ${y - 0.6} h4.6 l-2.3 3.8 z`} fill={P.orange} stroke={OUT} strokeWidth={BOLD.hair} strokeLinejoin="round" />
    </g>
  )
}

function Radish({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y - 1.5} q-5 -3 -4 -7.5 q3.6 1 4 5 q0.4 -4 4 -5 q1 4.5 -4 7.5 z`} fill={LEAF_L} stroke={OUT} strokeWidth={BOLD.hair} strokeLinejoin="round" />
      <Fruit cx={x} cy={y} r={2.7} c={P.red} />
    </g>
  )
}

/** Steckschild mit Samentüte. */
function Label({ x, y, h = 9 }: { x: number; y: number; h?: number }) {
  return (
    <g>
      <Rod d={`M${x} ${y} V${y - h}`} c={P.woodLight} w={1.2} />
      <rect x={x - 4.5} y={y - h - 5.5} width="9" height="6.5" rx="1" fill={P.canvas} {...detail} />
      <circle cx={x} cy={y - h - 2.2} r="1.3" fill={P.tomato} />
    </g>
  )
}

export function Gemuesebeet({ t }: { t: number }) {
  const season = useSeason()
  const winter = season === 'winter'
  // Beet je Stufe: Breite, Oberkante der Erde, Tiefe der Erde, Höhe der Holzfront
  const bed = t <= 1 ? { w: 54, top: 53, h: 18, front: 0 } : t === 2 ? { w: 68, top: 48, h: 19, front: 5 } : { w: 78, top: 44, h: 20, front: 10 }
  const left = 50 - bed.w / 2
  const right = left + bed.w
  const bottom = bed.top + bed.h
  return (
    <g>
      <Shadow rx={t <= 1 ? 34 : t === 2 ? 40 : 45} />
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 1 }}>
          {/* Bohnenzelt */}
          {!winter ? (
            <g>
              <path d="M19 48 Q27 30 33 15 Q39 30 47 48 Z" fill={LEAF_D} {...line} />
              <path d="M25 46 Q30 33 33 22 Q34.5 34 34 46 Z" fill={LEAF} />
              <circle cx="38" cy="33" r="1.7" fill={P.tomato} stroke={OUT} strokeWidth={BOLD.hair} />
              <circle cx="29" cy="39" r="1.7" fill={P.tomato} stroke={OUT} strokeWidth={BOLD.hair} />
              <circle cx="34" cy="25" r="1.5" fill={P.cream} stroke={OUT} strokeWidth={BOLD.hair} />
            </g>
          ) : null}
          <Rod d="M18 49 L36 8 M48 49 L30 8" c={P.woodLight} w={1.5} />
        </g>
      ) : null}
      {t >= 5 ? (
        <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 2 }}>
          {/* Vogelscheuche steht hinten im Beet (SIZE.vogelscheuche = 30) */}
          <Rod d="M72 50 V26 M61 31.5 H83" c={P.woodLight} w={1.6} />
          <path d="M64.5 30 H79.5 L78 44 H66 Z" fill={P.denim} {...detail} />
          <path d="M72 31 V43" stroke={OUT} strokeWidth={BOLD.hair} opacity="0.5" />
          <circle cx="72" cy="25" r="5" fill={P.skinLight} {...detail} />
          <path d="M63.5 22.5 H80.5 L77 14.5 H67 Z" fill={P.brass} {...detail} />
          <circle cx="70.2" cy="25.4" r="0.8" fill={OUT} />
          <circle cx="73.8" cy="25.4" r="0.8" fill={OUT} />
        </g>
      ) : null}
      {/* Beet: Erdfläche, ab Stufe 2 mit Holzrahmen, ab Stufe 3 als Hochbeet */}
      {bed.front > 0 ? <Wall x={left} y={bottom - 1} w={bed.w} h={bed.front + 1} planks={bed.front > 7 ? 1 : 0} /> : null}
      <rect x={left} y={bed.top} width={bed.w} height={bed.h} rx="3" fill={winter ? P.cream : P.soil} {...line} />
      {!winter ? (
        <g>
          <path d={`M${left + 4} ${bed.top + bed.h * 0.42} H${right - 4} M${left + 4} ${bed.top + bed.h * 0.78} H${right - 4}`} stroke={P.soilDark} strokeWidth={BOLD.detail} strokeDasharray="3 3" />
          <path d={`M${left + 3.5} ${bed.top + 2.6} H${left + bed.w * 0.4}`} stroke={P.white} strokeWidth="1.4" strokeLinecap="round" opacity="0.22" />
        </g>
      ) : null}
      {t >= 3 ? (
        <g>
          <Post x={left + 1.5} y={bottom + bed.front + 1} h={bed.front + 4} w={4} fill={P.woodLight} />
          <Post x={right - 1.5} y={bottom + bed.front + 1} h={bed.front + 4} w={4} />
        </g>
      ) : null}
      {t <= 1 ? (
        <g>
          {[30, 43, 56, 69].map((x) => (
            <Sprout key={x} x={x} y={60} />
          ))}
          {[36, 49, 62].map((x) => (
            <Sprout key={x} x={x} y={68} />
          ))}
          <Label x={80} y={58} h={11} />
        </g>
      ) : t === 2 ? (
        <g>
          {[26, 38, 50, 62, 74].map((x) => (
            <Lettuce key={x} x={x} y={59} s={0.9} />
          ))}
          {[22, 31, 40, 50, 60, 69, 78].map((x) => (
            <Carrot key={x} x={x} y={65} />
          ))}
        </g>
      ) : (
        <g>
          {[20, 32, 44, 56, 68, 80].map((x) => (
            <Lettuce key={x} x={x} y={54} s={1.1} />
          ))}
          {[18, 27, 36, 45, 55, 64, 73, 82].map((x, i) =>
            i % 2 ? <Radish key={x} x={x} y={61.5} /> : <Carrot key={x} x={x} y={62} />,
          )}
        </g>
      )}
      {winter ? (
        <g className="art-snow">
          {/* Vlies über dem Beet */}
          <path d={`M${left - 1} ${bottom} V${bed.top - 2} Q50 ${bed.top - 13} ${right + 1} ${bed.top - 2} V${bottom} Z`} fill={P.white} fillOpacity="0.82" stroke={OUT} strokeWidth={BOLD.detail} strokeOpacity="0.55" strokeLinejoin="round" />
          <path d={`M${left + 8} ${bed.top + 2} q6 -3 12 0 M${right - 24} ${bed.top + 1} q6 -3 12 0`} stroke={P.frost} strokeWidth={BOLD.hair} fill="none" />
        </g>
      ) : null}
      {season === 'autumn' && t >= 2 && t <= 4 ? <Pumpkin x={left - 3} y={bottom + bed.front - 3} r={5.6} /> : null}
      {t >= 3 ? (
        <g className={t === 3 ? 't-new' : undefined} style={{ ["--i" as string]: 3 }}>
          {/* Pflanzschilder */}
          <Label x={9} y={56} />
          <Label x={57} y={45} h={7} />
        </g>
      ) : null}
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 4 }}>
          {/* Gießkanne */}
          <Rod d="M94 69 L99 64" c={P.water} w={1.6} />
          <path d="M88 66 h8 v9.4 h-8 z" fill={P.water} {...detail} />
          <path d="M88.8 66 q3.2 -6 6.4 0" fill="none" stroke={OUT} strokeWidth={BOLD.detail} strokeLinecap="round" />
          <rect x="89" y="67" width="2" height="7.4" fill={P.white} opacity="0.3" />
        </g>
      ) : null}
      {t >= 5 ? (
        <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 5 }}>
          <Pumpkin x={8} y={70} r={7} />
          <Pumpkin x={19.5} y={73.6} r={4.2} c={P.amber} />
          <Flower x={3} y={62} c={P.pink} />
          <Flower x={15} y={64} c={P.yellow} />
        </g>
      ) : null}
    </g>
  )
}
