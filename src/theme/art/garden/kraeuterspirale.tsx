/** Hauptgarten-Bereich: kraeuterspirale (kräftiger Stil, parts/bold.tsx). */
import { Flower, Shadow, useSeason } from '../parts'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P, tone } from '../palette'
import { Grow, LEAF, LEAF_D, OUT } from './shared'

const line = boldLine()
const detail = boldDetail()

/**
 * Eine Windung der Spirale: Trockenmauer (Höhe h) mit Erde obenauf.
 * (cx, y) = Mitte der Erdfläche.
 */
function Ring({ cx, y, rx, h, joints = 5 }: { cx: number; y: number; rx: number; h: number; joints?: number }) {
  const ry = rx * 0.42
  return (
    <g>
      <path d={`M${cx - rx} ${y} a${rx} ${ry} 0 0 0 ${2 * rx} 0 v${h} a${rx} ${ry} 0 0 1 ${-2 * rx} 0 Z`} fill={P.stoneLight} {...line} />
      <path d={`M${cx} ${y + ry} a${rx} ${ry} 0 0 0 ${rx} ${-ry} v${h} a${rx} ${ry} 0 0 1 ${-rx} ${ry} Z`} fill={OUT} opacity="0.16" />
      <path
        d={Array.from({ length: joints }, (_, i) => {
          const a = Math.PI * (0.14 + (0.72 * i) / Math.max(1, joints - 1))
          const jx = cx - Math.cos(a) * rx
          const jy = y + Math.sin(a) * ry
          return `M${jx.toFixed(1)} ${(jy + 1).toFixed(1)} v${(h - 1.4).toFixed(1)}`
        }).join(' ')}
        stroke={OUT}
        strokeWidth={BOLD.hair}
        opacity="0.45"
      />
      <ellipse cx={cx} cy={y} rx={rx} ry={ry} fill={P.soil} {...line} />
      <path d={`M${cx - rx * 0.72} ${y - ry * 0.3} q${rx * 0.3} ${-ry * 0.5} ${rx * 0.62} ${-ry * 0.52}`} fill="none" stroke={P.white} strokeWidth="1.3" strokeLinecap="round" opacity="0.2" />
    </g>
  )
}

/** Kräuterbusch; `spike` = Blütenkerze (Lavendel, Salbei). */
function Herb({ x, y, c, r = 4.4, spike }: { x: number; y: number; c: string; r?: number; spike?: string }) {
  return (
    <g>
      {spike ? (
        <g>
          <path d={`M${x} ${y - r} v-7`} stroke={OUT} strokeWidth="4.4" strokeLinecap="round" />
          <path d={`M${x} ${y - r} v-7`} stroke={spike} strokeWidth="2.6" strokeLinecap="round" />
        </g>
      ) : null}
      <circle cx={x} cy={y - r * 0.7} r={r} fill={c} {...detail} />
      <circle cx={x - r * 0.3} cy={y - r} r={r * 0.4} fill={P.white} opacity="0.25" />
    </g>
  )
}

export function Kraeuterspirale({ t }: { t: number }) {
  const season = useSeason()
  const winter = season === 'winter'
  const herbs = [LEAF, tone('#8fbf5a'), tone('#6d9b56'), tone('#a3c47a')]
  return (
    <g>
      <Shadow rx={t <= 1 ? 34 : t === 2 ? 39 : 44} />
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 1 }}>
          {/* Wasserstelle am Fuß der Spirale */}
          <ellipse cx="84" cy="69" rx="13" ry="5.6" fill={P.stoneLight} {...line} />
          <ellipse cx="84" cy="69" rx="9.6" ry="3.6" fill={P.pond} stroke={OUT} strokeWidth={BOLD.hair} />
          <path d="M78 68 h5" stroke={P.white} strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
          <ellipse cx="88" cy="69.6" rx="3" ry="1.4" fill={LEAF} stroke={OUT} strokeWidth={BOLD.hair} />
        </g>
      ) : null}
      {/* Die Mauer endet über der Schild-Zone (SIGN_ZONE_Y) */}
      <g transform={`translate(0 ${t <= 1 ? -4 : t === 2 ? -6 : t === 3 ? -4 : -8})`}>
      <Grow s={t === 3 ? 0.9 : 1} cx={46}>
        {t <= 1 ? (
          <g>
            <Ring cx={50} y={63} rx={25} h={4.5} joints={6} />
            <g className="ma-sway">
              <Herb x={36} y={64} c={herbs[0]!} />
              <Herb x={50} y={67} c={herbs[1]!} />
              <Herb x={63} y={64} c={herbs[2]!} />
              <Herb x={50} y={59} c={herbs[3]!} r={3.6} />
            </g>
          </g>
        ) : t === 2 ? (
          <g>
            <Ring cx={49} y={62} rx={29} h={7} joints={6} />
            <g className="ma-sway">
              <Herb x={27} y={64} c={herbs[2]!} />
              <Herb x={38} y={70} c={herbs[1]!} />
              <Herb x={72} y={66} c={herbs[0]!} />
            </g>
            <Ring cx={53} y={53} rx={16} h={7} joints={4} />
            <g className="ma-sway">
              <Herb x={46} y={55} c={herbs[3]!} />
              <Herb x={58} y={56} c={herbs[0]!} />
              <Herb x={53} y={51} c={herbs[1]!} r={3.6} />
            </g>
          </g>
        ) : (
          <g>
            <Ring cx={46} y={61} rx={33} h={8} joints={7} />
            <g className="ma-sway">
              <Herb x={19} y={62} c={herbs[2]!} />
              <Herb x={29} y={70} c={herbs[1]!} spike={P.lavender} />
              <Herb x={42} y={74} c={herbs[0]!} />
              <Herb x={73} y={64} c={herbs[3]!} />
            </g>
            <Ring cx={50} y={49} rx={21} h={8} joints={5} />
            <g className="ma-sway">
              <Herb x={34} y={50} c={herbs[0]!} />
              <Herb x={44} y={57} c={herbs[3]!} />
              <Herb x={65} y={52} c={herbs[1]!} spike={P.lilac} />
            </g>
            <Ring cx={53} y={38} rx={11} h={7} joints={3} />
            <g className="ma-sway">
              <Herb x={48} y={40} c={herbs[1]!} />
              <Herb x={58} y={41} c={herbs[2]!} />
              <Herb x={53} y={36} c={LEAF_D} r={4} spike={P.lavender} />
            </g>
          </g>
        )}
        {winter ? (
          <g className="art-snow" fill={P.white}>
            {/* Schnee auf der Spirale */}
            <ellipse cx={t >= 3 ? 53 : t === 2 ? 53 : 50} cy={t >= 3 ? 34 : t === 2 ? 49 : 60} rx={t >= 3 ? 9 : 13} ry={t >= 3 ? 3 : 4} opacity="0.95" />
            <ellipse cx="32" cy={t >= 3 ? 58 : 62} rx="8" ry="2.4" opacity="0.9" />
            <ellipse cx="66" cy={t >= 3 ? 59 : 63} rx="7" ry="2.2" opacity="0.9" />
          </g>
        ) : null}
      </Grow>
      </g>
      {season === 'spring' ? (
        <g>
          {/* Frühblüher am Fuß der Mauer */}
          {[
            [10, 72, P.yellow],
            [16, 76, P.white],
            [92, 76, P.lilac],
          ].map(([x, y, c], i) => (
            <circle key={i} cx={x as number} cy={y as number} r="2" fill={c as string} stroke={OUT} strokeWidth={BOLD.hair} />
          ))}
        </g>
      ) : null}
      {t >= 5 ? (
        <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 2 }}>
          {/* Gartenzwerg */}
          <g transform="translate(0 -3)">
            <rect x="5" y="70" width="10" height="8" rx="2" fill={P.denim} {...detail} />
            <circle cx="10" cy="66" r="4.2" fill={P.skinLight} {...detail} />
            <path d="M6 66.5 Q10 77 14 66.5 Z" fill={P.white} stroke={OUT} strokeWidth={BOLD.hair} strokeLinejoin="round" />
            <path d="M4.6 63.6 L10 48 L15.4 63.6 Z" fill={P.roof} {...detail} />
          </g>
          <Flower x={95} y={58} c={P.yellow} />
          <Flower x={2.6} y={62} c={P.lavender} />
          <Flower x={18.6} y={76} c={P.white} />
        </g>
      ) : null}
    </g>
  )
}
