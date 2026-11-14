/**
 * Kapitel 33 — Reisterrassen auf Bali im kräftigen Stil (2026-11-14,
 * Weinberg-Niveau): Hang, Reisfelder, Quellhaus, Wasserteiler, Bambusbrücke,
 * Flechtwerkstatt mit Strohdach, Garben, Obstkörbe, Tabletts und Festtisch mit
 * Kontur; Palmen, Enten, Lumbung und Wimpel behalten ihre Zeichnung (Kontur über
 * hand-art). Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Farmer } from './figures'
import { Bunting } from './partsA'
import type { AreaProps } from './partsB'
import { CoconutPalm, Lumbung, RunnerDuck } from './partsF'
import { ssn } from './season'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Farbe eines Reisfelds je Jahreszeit (Fläche, Muster). */
function paddy(z: string): [string, string] {
  if (z === 'spring') return [P.water, P.leafLight]
  if (z === 'autumn') return [P.gold, P.yellow]
  if (z === 'winter') return [P.woodMid, P.woodLight]
  return [P.leaf, P.leafDark]
}

/** Grüner Hangboden. */
function Hill({ season, cy = 60, rx = 36, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={z === 'winter' ? P.leafMoss : P.leafDark} {...line} />
      <path d={`M${40 - rx * 0.62} ${cy - ry * 0.62}q${rx * 0.3} ${-ry * 0.3} ${rx * 0.62} ${-ry * 0.34}`} stroke={P.white} strokeWidth={D} opacity=".2" fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Ein Reisfeld als flache Fläche mit Muster (Setzlinge, Halme, Rispen oder Stoppeln). */
function PaddyPlot({ x, y, w, h, z }: { x: number; y: number; w: number; h: number; z: string }) {
  const [fill, mark] = paddy(z)
  const n = Math.max(2, Math.floor(w / 5))
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} {...detail} />
      <path d={`M${x + h / 2} ${y + h - 1}h${w - h}`} stroke={P.outline} strokeWidth="1" opacity=".18" strokeLinecap="round" />
      {z === 'spring' ? <path d={`M${x + w * 0.2} ${y + h * 0.35}h${w * 0.25}`} stroke={P.white} strokeWidth=".8" opacity=".55" strokeLinecap="round" /> : null}
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M${x + 3 + i * ((w - 6) / (n - 1))} ${y + h * 0.75}v${z === 'summer' ? -2.4 : z === 'autumn' ? -2 : -1.2}`} stroke={mark} strokeWidth={z === 'autumn' ? 1.1 : 0.7} strokeLinecap="round" />
      ))}
    </g>
  )
}

/** Quellhaus: Steinsockel mit Wasserbecken, Pfosten und schlichtes Strohdach, Bambusrohr zum Teich (Fußpunkt Mitte unten). */
function SpringHouse({ x, y, s = 1, winter }: { x: number; y: number; s?: number; winter?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-8" y="-4" width="16" height="4" fill={P.stone} {...detail} />
      <rect x="-7.4" y="-1.6" width="14.8" height="1.2" fill={P.outline} opacity=".15" />
      <path d="M-5 -4v-2.6h10V-4" fill={P.waterLight} {...detail} />
      <Post x={-6.4} y={-4} h={8.4} w={1.3} k={K * 0.7} />
      <Post x={6.4} y={-4} h={8.4} w={1.3} k={K * 0.7} />
      <path d="M-10 -11.4L0 -17L10 -11.4z" fill={winter ? P.woodMid : P.woodLight} stroke={P.outline} strokeWidth={D * 0.8} strokeLinejoin="round" />
      <path d="M0 -16L8.4 -11.8H0z" fill={P.outline} opacity=".15" />
      <path d="M-6.6 -12.4L0 -16M6.6 -12.4L0 -16" stroke={P.outline} strokeWidth={H * 0.6} opacity=".5" />
      <path d="M-7 -12.4L-2.6 -15" stroke={P.white} strokeWidth=".6" opacity=".45" strokeLinecap="round" />
      <path d="M7 -5.4h7" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 -5.4h7" stroke={P.leafPale} strokeWidth="1" strokeLinecap="round" />
      <path d="M14 -5.2q1 1.6 .8 4.6" stroke={P.water} strokeWidth=".9" fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Reisgarben: gebündelte Halme, zum Trocknen aufgestellt (Fußpunkt Mitte unten). */
function Sheaves({ x, y, s = 1, z }: { x: number; y: number; s?: number; z: string }) {
  const c = z === 'spring' || z === 'summer' ? P.gold : P.yellow
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-4, 0, 4].map((dx) => (
        <path key={dx} d={`M${dx - 2.4} 0l${2.4} -9l${2.4} 9z`} fill={c} stroke={P.outline} strokeWidth={D * 0.7} strokeLinejoin="round" />
      ))}
      <path d="M-5.6 -3.4h11.2" stroke={P.outline} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M-5.6 -3.4h11.2" stroke={P.woodMid} strokeWidth=".6" strokeLinecap="round" />
    </g>
  )
}

/** Flacher Korb mit Obst (Fußpunkt Mitte unten). */
function FruitBasket({ x, y, i = 0 }: { x: number; y: number; i?: number }) {
  return (
    <g>
      <path d={`M${x - 3} ${y - 2.2}h6l-1 2.2h-4z`} fill={P.woodLight} {...detail} />
      {[-1.6, 0, 1.6].map((dx, k) => (
        <circle key={k} cx={x + dx} cy={y - 2.8} r=".9" fill={[P.orange, P.berry, P.yellow, P.leafLight][(i + k) % 4]} stroke={P.outline} strokeWidth={H * 0.6} />
      ))}
    </g>
  )
}

/** Geflochtenes Tablett (Ware der Flechtwerkstatt). */
function Tray({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y - 0.6} rx="2" ry=".8" fill={P.woodLight} stroke={P.outline} strokeWidth={H} />
      <path d={`M${x - 1.3} ${y - 0.6}h2.6`} stroke={P.outline} strokeWidth={H * 0.6} opacity=".5" />
    </g>
  )
}

export function Reisterrassen({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  switch (id) {
    case 'sawah': {
      const rows = 1 + tier
      return (
        <Svg tier={tier} bold>
          <Hill season={season} cy={62} ry={11} />
          {Array.from({ length: rows }, (_, k) => {
            const i = rows - 1 - k
            const y = 64 - i * 7
            const w = 70 - i * 6 - (i % 2) * 4
            return <PaddyPlot key={i} x={40 - w / 2 + (i % 2) * 3} y={y} w={w} h={6} z={z} />
          })}
          {tier >= 4 ? <Old><CoconutPalm x={70} y={46} s={0.6} season={season} /></Old> : null}
          {tier >= 5 ? <Farmer x={60} y={62} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'wasserteiler': {
      const outs = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Hill season={season} cy={52} ry={20} />
          {Array.from({ length: outs }, (_, i) => (
            <PaddyPlot key={i} x={[6, 44, 6, 44][i]!} y={[60, 60, 50, 50][i]!} w={30} h={7} z={z} />
          ))}
          <path d="M40 34V46" stroke={P.outline} strokeWidth="6.6" />
          <path d="M40 34V46" stroke={P.stone} strokeWidth="5" />
          <path d="M40 34V46" stroke={P.water} strokeWidth="3" />
          <path d="M39.4 36v6" stroke={P.white} strokeWidth=".6" opacity=".5" strokeLinecap="round" />
          <rect x="33" y="44" width="14" height="8" rx="1" fill={P.stone} {...line} />
          <rect x="34" y="49.6" width="12" height="1.6" fill={P.outline} opacity=".15" />
          <rect x="35" y="46" width="5" height="3" fill={P.water} stroke={P.outline} strokeWidth={H} />
          <rect x="42" y="46" width="2.4" height="3" fill={P.water} stroke={P.outline} strokeWidth={H} />
          <path d="M37.4 52v4q0 3 -8 4M43.2 52v4q0 3 6 4" stroke={P.outline} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M37.4 52v4q0 3 -8 4M43.2 52v4q0 3 6 4" stroke={P.water} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {tier >= 3 ? <path d="M48 46q2 -4 5 -4M48 46q1 -3 0 -6M48 46q-2 -3 -5 -3" stroke={P.outline} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d="M48 46q2 -4 5 -4M48 46q1 -3 0 -6M48 46q-2 -3 -5 -3" stroke={winter ? P.winterLeaf : P.leaf} strokeWidth="1" fill="none" strokeLinecap="round" /> : null}
          {tier >= 5 ? <Farmer x={70} y={50} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'wassertempel':
      return (
        <Svg tier={tier} bold>
          <Hill season={season} cy={56} ry={14} />
          <PaddyPlot x={10} y={42} w={60} h={6} z={z} />
          <ellipse cx="56" cy="64" rx="13" ry="4" fill={winter ? P.waterLight : P.water} {...line} />
          <path d="M48 63q5 -2 11 -1.6" stroke={P.white} strokeWidth=".8" opacity=".45" fill="none" strokeLinecap="round" />
          <SpringHouse x={28} y={64} s={1.5} winter={winter} />
          {tier >= 2 ? (
            <g>
              <path d="M10 66h4l-.6 -3.4h-2.8z" fill={P.metal} {...detail} />
              <path d="M10.4 62.6q1.6 -2 3.2 0" stroke={P.outline} strokeWidth=".6" fill="none" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 3 ? (
            <g>
              <path d="M66 62V40" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
              <path d="M66 62V40" stroke={P.bark} strokeWidth="1.3" strokeLinecap="round" />
              <ellipse cx="66" cy="38" rx="7" ry="4" fill={winter ? P.leafMoss : P.leafDark} {...line} />
              <path d="M61 36.4q3 -2.4 7 -2.2" stroke={P.white} strokeWidth=".8" opacity=".25" fill="none" strokeLinecap="round" />
              {[62, 66, 70, 64, 68].map((x, i) => (
                <circle key={i} cx={x} cy={36 + (i % 2) * 3} r="1" fill={z === 'autumn' ? P.yellow : P.white} stroke={P.outline} strokeWidth={H * 0.5} />
              ))}
            </g>
          ) : null}
          {tier >= 4
            ? [44, 49].map((x) => <path key={x} d={`M${x - 2} 70q-.6 -3 .6 -4.4h2.8q1.2 1.4 .6 4.4z`} fill={P.terracotta} {...detail} />)
            : null}
          {tier >= 5 ? <Farmer x={70} y={72} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    case 'kokospalmen': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <Hill season={season} cy={56} ry={14} />
          <PaddyPlot x={10} y={42} w={60} h={6} z={z} />
          {Array.from({ length: n }, (_, i) => (
            <Old key={i}><CoconutPalm x={[36, 20, 56, 28, 48][i]!} y={[62, 66, 64, 70, 70][i]!} s={[1.2, 1, 1, 0.85, 0.85][i]!} lean={i % 2 ? -1 : 1} nuts={2 + (i % 3)} season={season} /></Old>
          ))}
          {tier >= 5 ? <Farmer x={70} y={70} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'entenweide': {
      const ducks = 1 + tier
      return (
        <Svg tier={tier} bold>
          <Hill season={season} cy={60} ry={12} />
          <PaddyPlot x={6} y={52} w={68} h={14} z={z} />
          {Array.from({ length: ducks }, (_, i) => (
            <Old key={i}><RunnerDuck x={14 + i * 8} y={62 - (i % 2)} s={1.25} c={i % 3 === 2 ? P.woodLight : P.white} flip /></Old>
          ))}
          {tier >= 5 ? (
            <g>
              <Farmer x={70} y={62} c={P.white} s={0.7} hat={P.woodLight} />
              <path d="M72 58l6 -10" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M72 58l6 -10" stroke={P.woodMid} strokeWidth=".8" strokeLinecap="round" />
              <path d="M78 48l3 1l-3 1.6z" fill={P.tomato} stroke={P.outline} strokeWidth={H} strokeLinejoin="round" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'lumbung':
      return (
        <Svg tier={tier} bold>
          <Hill season={season} cy={56} ry={14} />
          <PaddyPlot x={10} y={42} w={60} h={6} z={z} />
          <Old><Lumbung x={34} y={66} s={1.6} full={tier >= 3} /></Old>
          {tier >= 2
            ? Array.from({ length: Math.min(4, tier) }, (_, i) => (
                <path key={i} d={`M${54 + i * 5} 66l1.4 -8l1.4 8z`} fill={z === 'spring' || z === 'summer' ? P.gold : P.yellow} stroke={P.outline} strokeWidth={D * 0.8} strokeLinejoin="round" />
              ))
            : null}
          {tier >= 4 ? <Old><Lumbung x={66} y={52} s={0.7} /></Old> : null}
          {tier >= 5 ? <Farmer x={16} y={70} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    case 'hanggarten': {
      const beds = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Hill season={season} cy={60} ry={12} />
          <g transform="translate(40 66) scale(1.25) translate(-40 -66)">
          {Array.from({ length: beds }, (_, i) => {
            const y = 66 - i * 7
            return (
              <g key={i}>
                <rect x={12 + i * 3} y={y - 3} width={56 - i * 6} height="4" rx="2" fill={P.soil} {...detail} />
                {i === 0
                  ? [16, 26, 36, 46, 56].map((x) => <path key={x} d={`M${x} ${y - 2}l-2 -5M${x} ${y - 2}v-6M${x} ${y - 2}l2 -5`} stroke={winter ? P.winterLeaf : P.leaf} strokeWidth="1" strokeLinecap="round" />)
                  : null}
                {i === 1
                  ? [18, 30, 42, 54].map((x) => (
                      <g key={x}>
                        <path d={`M${x - 1} ${y - 3}l.4 2.6M${x + 1} ${y - 3}l-.2 2.4`} stroke={winter ? P.woodMid : P.tomato} strokeWidth="1" strokeLinecap="round" />
                        <ellipse cx={x} cy={y - 4} rx="2.6" ry="2" fill={P.leafDark} {...detail} />
                      </g>
                    ))
                  : null}
                {i === 2
                  ? [20, 34, 48].map((x) => (
                      <g key={x}>
                        <path d={`M${x} ${y - 2}V${y - 12}`} stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
                        <path d={`M${x} ${y - 2}V${y - 12}`} stroke={P.woodLight} strokeWidth=".8" strokeLinecap="round" />
                        <path d={`M${x} ${y - 4}q2 -2 0 -4q-2 -2 0 -4`} stroke={P.leafDark} strokeWidth="1" fill="none" strokeLinecap="round" />
                        {!winter ? <path d={`M${x + 1} ${y - 6}v4`} stroke={P.leafLight} strokeWidth=".5" /> : null}
                      </g>
                    ))
                  : null}
                {i === 3 ? [22, 32, 42].map((x) => <circle key={x} cx={x} cy={y - 3} r="2" fill={z === 'spring' ? P.white : P.leaf} {...detail} />) : null}
              </g>
            )
          })}
          </g>
          {tier >= 5 ? <Farmer x={70} y={70} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'bambusbruecke':
      return (
        <Svg tier={tier} bold>
          <Hill season={season} cy={58} ry={15} />
          <PaddyPlot x={4} y={48} w={26} h={8} z={z} />
          <PaddyPlot x={50} y={48} w={26} h={8} z={z} />
          <PaddyPlot x={6} y={62} w={22} h={7} z={z} />
          <PaddyPlot x={52} y={62} w={22} h={7} z={z} />
          <path d="M40 40V72" stroke={P.outline} strokeWidth="14.4" />
          <path d="M40 40V72" stroke={P.leafMoss} strokeWidth="12.6" />
          <path d="M40 40V72" stroke={P.water} strokeWidth="10" />
          <path d="M38 44v6M42 54v6M38 64v5" stroke={P.white} strokeWidth=".9" opacity=".5" strokeLinecap="round" />
          <path d="M28 57h24M28 58.6h24M28 60.2h24" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M28 57h24M28 58.6h24M28 60.2h24" stroke={P.woodLight} strokeWidth="1.1" strokeLinecap="round" />
          <path d="M30 57v4M50 57v4" stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
          <path d="M30 57v4M50 57v4" stroke={P.woodDark} strokeWidth=".9" strokeLinecap="round" />
          {tier >= 2 ? <path d="M28 52h24M30 52v5M50 52v5" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" /> : null}
          {tier >= 2 ? <path d="M28 52h24M30 52v5M50 52v5" stroke={P.woodMid} strokeWidth="1" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d="M36 52v5M44 52v5M28 53.4h24" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d="M36 52v5M44 52v5M28 53.4h24" stroke={P.woodMid} strokeWidth=".8" strokeLinecap="round" /> : null}
          {tier >= 4 ? (
            <g>
              <Farmer x={38} y={57} c={P.white} s={0.75} hat={P.woodLight} />
              <path d="M34 48l1.6 -4l1.6 4zM39 48l1.6 -4l1.6 4z" fill={P.gold} stroke={P.outline} strokeWidth={H} strokeLinejoin="round" />
            </g>
          ) : null}
          {tier >= 5 ? <Old><CoconutPalm x={70} y={48} s={0.55} season={season} /></Old> : null}
        </Svg>
      )
    case 'flechtwerkstatt': {
      const trays = 1 + tier
      return (
        <Svg tier={tier} bold>
          <Hill season={season} cy={52} ry={21} />
          <PaddyPlot x={8} y={32} w={64} h={6} z={z} />
          <rect x="14" y="54" width="50" height="5" fill={P.stoneLight} {...line} />
          <rect x="15" y="56.8" width="48" height="1.6" fill={P.outline} opacity=".15" />
          <Post x={18} y={54} h={15} w={2.2} k={K} />
          <Post x={60} y={54} h={15} w={2.2} k={K} />
          <path d="M8 40L39 26L70 40Q39 37 8 40z" fill={P.woodLight} {...line} />
          <path d="M39 27.4L67 39.4Q53 38.2 39 38.4z" fill={P.outline} opacity=".15" />
          <path d="M16 39.4L39 27.6M62 39.4L39 27.6" stroke={P.outline} strokeWidth={H} opacity=".5" />
          <path d="M17 36.4L33 29" stroke={P.white} strokeWidth={D} opacity=".4" strokeLinecap="round" />
          <path d="M14 41.2Q39 38.6 64 41.2" stroke={P.outline} strokeWidth="1.4" opacity=".18" fill="none" />
          {Array.from({ length: trays }, (_, i) => (
            <Tray key={i} x={22 + (i % 6) * 7} y={54} />
          ))}
          {tier >= 3
            ? [16, 66].map((x) => (
                <g key={x}>
                  <path d={`M${x - 4} 68h8l-1.4 -5h-5.2z`} fill={P.woodLight} {...detail} />
                  <path d={`M${x - 3} 65.4h6M${x - 2.6} 66.8h5.4`} stroke={P.outline} strokeWidth={H * 0.7} opacity=".55" />
                </g>
              ))
            : null}
          {tier >= 4 ? <path d="M40 66q-6 -6 -12 -4M40 66q6 -6 12 -4M40 66q0 -6 -1 -8" stroke={P.outline} strokeWidth="2.6" fill="none" strokeLinecap="round" /> : null}
          {tier >= 4 ? <path d="M40 66q-6 -6 -12 -4M40 66q6 -6 12 -4M40 66q0 -6 -1 -8" stroke={P.leafPale} strokeWidth="1.2" fill="none" strokeLinecap="round" /> : null}
          {tier >= 5 ? <Farmer x={44} y={52} c={P.yellow} s={0.6} hat={P.white} skirt={P.berry} /> : null}
        </Svg>
      )
    }
    case 'tempelfest': {
      const baskets = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Hill season={season} cy={52} ry={21} />
          <PaddyPlot x={8} y={32} w={64} h={6} z={z} />
          <ellipse cx="40" cy="60" rx="30" ry="5" fill={P.stoneLight} {...line} />
          <Sheaves x={40} y={58} s={1.4} z={z} />
          {Array.from({ length: baskets }, (_, i) => (
            <FruitBasket key={i} x={[24, 56, 16, 64][i]!} y={60} i={i} />
          ))}
          {tier >= 2 ? (
            <g>
              <Post x={8} y={62} h={20} w={1.6} fill={P.woodMid} k={K * 0.8} />
              <Post x={72} y={62} h={20} w={1.6} fill={P.woodMid} k={K * 0.8} />
              <Old><Bunting y={42} n={7} x0={8} x1={72} /></Old>
            </g>
          ) : null}
          {tier >= 3 ? (
            <g>
              <path d="M52 66v3M66 66v3" stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
              <path d="M52 66v3M66 66v3" stroke={P.woodDark} strokeWidth=".9" strokeLinecap="round" />
              <rect x="50" y="64" width="18" height="2" fill={P.woodLight} {...detail} />
              {[54, 59, 64].map((x) => <ellipse key={x} cx={x} cy={63.6} rx="1.6" ry=".7" fill={P.white} stroke={P.outline} strokeWidth={H * 0.7} />)}
            </g>
          ) : null}
          {tier >= 4
            ? [24, 32, 42].map((x, i) => (
                <g key={x}>
                  <Farmer x={x} y={72} c={[P.white, P.yellow, P.white][i]!} s={0.7} hat={P.white} skirt={i % 2 ? P.berry : P.yellow} />
                </g>
              ))
            : null}
          {tier >= 5 ? (
            <g>
              <rect x="8" y="64" width="7" height="5" rx="2.4" fill={P.woodMid} {...detail} />
              <path d="M10 65v3" stroke={P.white} strokeWidth=".6" opacity=".35" strokeLinecap="round" />
              <ellipse cx="8" cy="66.5" rx="1" ry="2.4" fill={P.cream} {...detail} />
              <path d="M17 62l-2 3" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M17 62l-2 3" stroke={P.woodDark} strokeWidth=".8" strokeLinecap="round" />
            </g>
          ) : null}
        </Svg>
      )
    }
  }
  return null
}
