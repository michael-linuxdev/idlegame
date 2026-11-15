/**
 * Kapitel 38 — Farngarten (Farnwald in Northland, Neuseeland) im kräftigen Stil
 * (2026-11-14, Weinberg-Niveau): Waldboden, Ufer- und Waldbaum, Tūī, Kauripfad,
 * Hängebrücke, Glühwurmgrotte, Kūmara-Hügel mit Pātaka, Wasserfall,
 * Pflanzschule, Hanghütte und Matariki-Feuer mit Kontur. Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Farmer } from './figures'
import type { AreaProps } from './partsB'
import { Fire, WaterBand } from './partsD'
import { Rain } from './partsF'
import { Harakeke, Kauri, Stars, TreeFern } from './partsG'
import { ssn } from './season'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Waldboden: Frühling frisch, Sommer dunkelgrün, Herbst Laub, Winter nass und moosig. */
function Floor({ season, cy = 60, rx = 36, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const fill = z === 'spring' ? P.leaf : z === 'summer' ? P.leafDark : z === 'autumn' ? P.woodMid : P.leafMoss
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={fill} {...line} />
      <path d={`M${40 - rx * 0.6} ${cy - ry * 0.55}q${rx * 0.6} ${-ry * 0.35} ${rx * 1.2} 0`} stroke={P.white} strokeWidth=".8" opacity=".25" fill="none" strokeLinecap="round" />
      {z === 'autumn' ? [-0.5, -0.1, 0.3, 0.6].map((d) => <ellipse key={d} cx={40 + rx * d} cy={cy + 2} rx="1.4" ry=".6" fill={P.gold} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
      {z === 'winter' ? <ellipse cx={40 + rx * 0.4} cy={cy + 2.4} rx="5" ry="1.3" fill={P.water} stroke={P.outline} strokeWidth={H * 0.7} opacity=".9" /> : null}
    </g>
  )
}

/** Kleiner Ufer-/Waldbaum: im Frühling Kōwhai (gelb), im Sommer Pōhutukawa (rot), sonst grün. */
function NativeTree({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  const bloom = z === 'spring' ? P.yellow : z === 'summer' ? P.berry : null
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-8M0 -6l-4 -4M0 -7l4 -4" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M0 0V-8M0 -6l-4 -4M0 -7l4 -4" stroke={P.bark} strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="-3" cy="-11" rx="5" ry="3.4" fill={z === 'winter' ? P.winterLeafDark : P.leafDark} {...detail} />
      <ellipse cx="3" cy="-12" rx="5" ry="3.4" fill={z === 'winter' ? P.winterLeaf : P.leafMoss} {...detail} />
      <path d="M-1 -9.4q4 1.6 7.4 -.6" stroke={P.outline} strokeWidth="1" opacity=".16" fill="none" strokeLinecap="round" />
      <path d="M0.6 -14q2.4 -1.4 4.6 -.2" stroke={P.white} strokeWidth=".7" opacity=".35" fill="none" strokeLinecap="round" />
      {bloom ? [[-5, -12], [-1, -14], [3, -13], [6, -11], [-3, -9]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r="1" fill={bloom} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
    </g>
  )
}

/** Tūī: dunkler Vogel mit weißem Kehlbüschel (Fußpunkt unten). */
function Tui({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1.6 -2.4l-3 1.6" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M-1.6 -2.4l-3 1.6" stroke={P.charcoal} strokeWidth=".9" strokeLinecap="round" />
      <ellipse cx="0" cy="-2.6" rx="1.9" ry="1.3" fill={P.charcoal} {...detail} />
      <circle cx="1.6" cy="-3.8" r=".9" fill={P.charcoal} {...detail} />
      <path d="M-1 -3.4q1 -.5 2 -.2" stroke={P.blue} strokeWidth=".4" opacity=".6" fill="none" />
      <circle cx="1.6" cy="-2.6" r=".35" fill={P.white} />
      <path d="M2.4 -3.8l.9 .2" stroke={P.outline} strokeWidth=".5" strokeLinecap="round" />
    </g>
  )
}

export function Farngarten({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  switch (id) {
    case 'baumfarne': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Old key={i}><TreeFern x={[40, 20, 60, 30, 52][i]!} y={[56, 62, 62, 70, 70][i]!} s={[1.6, 1.3, 1.3, 1.1, 1.1][i]!} season={season} h={[20, 14, 16, 10, 12][i]} /></Old>
          ))}
          {winter ? <Old><Rain n={6} y0={2} /></Old> : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.leafDark} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'kauripfad':
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <Old><Kauri x={46} y={60} s={1.7} season={season} /></Old>
          <path d="M6 68L30 62L56 64L78 58" stroke={P.outline} strokeWidth="5.4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M6 68L30 62L56 64L78 58" stroke={P.woodMid} strokeWidth="4" fill="none" strokeLinejoin="round" />
          <path d="M6 68L30 62L56 64L78 58" stroke={P.woodLight} strokeWidth="2.6" fill="none" strokeDasharray="1.2 .5" strokeLinejoin="round" />
          {tier >= 2 ? (
            <g>
              <rect x="10" y="56" width="8" height="6" fill={P.leafDark} {...detail} />
              <path d="M11 57.6h6" stroke={P.white} strokeWidth=".5" opacity=".4" />
              <path d="M11 55h6" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
              <path d="M11 55h6" stroke={P.woodDark} strokeWidth="1" strokeLinecap="round" />
              <rect x="19" y="56" width="1.6" height="3.4" rx=".4" fill={P.blue} stroke={P.outline} strokeWidth={H * 0.8} />
            </g>
          ) : null}
          {tier >= 3 ? <Old><TreeFern x={20} y={52} s={0.9} season={season} h={12} /></Old> : null}
          {tier >= 4 ? <Old><Kauri x={70} y={52} s={0.9} season={season} /></Old> : null}
          {tier >= 5 ? <Farmer x={34} y={62} c={P.leafDark} s={0.6} hat={P.woodLight} /> : null}
          {winter ? <Old><Rain n={6} y0={2} /></Old> : null}
        </Svg>
      )
    case 'harakeke': {
      const n = 1 + tier
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Old key={i}><Harakeke x={[40, 20, 60, 30, 52, 70][i]!} y={[58, 62, 62, 69, 69, 70][i]!} s={[1.8, 1.4, 1.4, 1.2, 1.2, 1][i]!} season={season} /></Old>
          ))}
          {z === 'summer' && tier >= 3 ? <Tui x={46} y={36} s={1.2} /> : null}
          {tier >= 5 ? <Farmer x={12} y={72} c={P.berry} s={0.6} hat={P.charcoal} skirt={P.charcoal} /> : null}
        </Svg>
      )
    }
    case 'haengebruecke':
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="58" rx="37" ry="12" fill={z === 'autumn' ? P.woodMid : P.leafMoss} {...line} />
          <path d="M26 50Q40 60 54 50L56 70H24z" fill={P.stoneDark} {...line} />
          <path d="M28 53q12 6 24 0" stroke={P.outline} strokeWidth="1.2" opacity=".18" fill="none" />
          <Old><WaterBand y={64} h={4} x0={28} x1={52} /></Old>
          <path d="M14 48Q40 58 66 48" stroke={P.outline} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M14 48Q40 58 66 48" stroke={P.woodMid} strokeWidth="1.8" fill="none" strokeDasharray="1.6 .4" />
          <path d="M14 42Q40 52 66 42" stroke={P.outline} strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M14 42Q40 52 66 42" stroke={P.metal} strokeWidth=".55" fill="none" />
          {Array.from({ length: 6 + tier }, (_, i) => {
            const t = (i + 0.5) / (6 + tier)
            const x = 14 + t * 52
            const yb = 48 + Math.sin(t * Math.PI) * 5
            return <path key={i} d={`M${x} ${yb}V${yb - 6}`} stroke={P.outline} strokeWidth=".5" />
          })}
          <Post x={14} y={49} h={10} w={2.2} k={K} />
          <Post x={66} y={49} h={10} w={2.2} k={K} />
          <Old><TreeFern x={8} y={58} s={0.9} season={season} h={10} /></Old>
          {tier >= 2 ? <Old><TreeFern x={72} y={58} s={0.9} season={season} h={12} /></Old> : null}
          {tier >= 3 ? <NativeTree x={66} y={70} s={1} season={season} /> : null}
          {tier >= 4 ? <Farmer x={36} y={52} c={P.leafDark} s={0.55} hat={P.woodLight} /> : null}
          {tier >= 5 ? <Tui x={20} y={36} s={1.2} /> : null}
          {winter ? <Old><Rain n={5} y0={2} /></Old> : null}
        </Svg>
      )
    case 'gluehwurmgrotte': {
      const glow = 4 + tier * 3
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="62" rx="36" ry="9" fill={P.leafMoss} {...line} />
          <path d="M10 66Q12 30 40 26Q68 30 70 66z" fill={P.stoneDark} {...line} />
          <path d="M14 40Q24 29 40 28" stroke={P.white} strokeWidth=".9" opacity=".25" fill="none" strokeLinecap="round" />
          <path d="M18 66Q20 38 40 36Q60 38 62 66z" fill={P.charcoal} stroke={P.outline} strokeWidth={D} strokeLinejoin="round" />
          {Array.from({ length: glow }, (_, i) => {
            const x = 22 + ((i * 13) % 36)
            const y = 40 + ((i * 7) % 10)
            return (
              <g key={i}>
                <path d={`M${x} ${y - 3}V${y}`} stroke={P.glassEdge} strokeWidth=".3" opacity=".8" />
                <circle cx={x} cy={y} r=".65" fill={P.waterLight} stroke={P.glass} strokeWidth={H * 0.5} />
              </g>
            )
          })}
          {tier >= 2 ? <Old><WaterBand y={62} h={3} x0={24} x1={56} /></Old> : null}
          {tier >= 3 ? <Old><TreeFern x={10} y={66} s={0.8} season={season} h={10} /></Old> : null}
          {tier >= 4 ? <Old><TreeFern x={70} y={66} s={0.8} season={season} h={12} /></Old> : null}
          {tier >= 5 ? <Farmer x={46} y={72} c={P.leafDark} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'kumaragarten': {
      const mounds = tier + 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: mounds }, (_, i) => {
            const x = 14 + (i % 4) * 14
            const y = 56 + Math.floor(i / 4) * 10
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx="5" ry="2.4" fill={P.soil} {...detail} />
                {z === 'spring' ? <path d={`M${x} ${y - 2}v-2`} stroke={P.leafLight} strokeWidth=".8" strokeLinecap="round" /> : null}
                {z === 'summer'
                  ? [-2.4, 0, 2.4].map((d) => <path key={d} d={`M${x + d} ${y - 1.6}a1.2 1.2 0 1 1 1.6 -1.2z`} fill={P.leaf} stroke={P.outline} strokeWidth={H * 0.7} />)
                  : null}
                {z === 'autumn' ? <ellipse cx={x + 3.4} cy={y + 1.4} rx="1.8" ry=".9" fill={P.plum} stroke={P.outline} strokeWidth={H} /> : null}
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <path d="M58 70V64L66 60L74 64V70z" fill={P.woodMid} {...line} />
              <path d="M58.6 65.2L66 61.2L73.4 65.2" stroke={P.outline} strokeWidth="1" opacity=".18" fill="none" />
              <path d="M56 64.4L66 58.6L76 64.4" stroke={P.outline} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M56 64.4L66 58.6L76 64.4" stroke={P.woodDark} strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M60 63.6L66 60" stroke={P.woodLight} strokeWidth=".5" opacity=".5" />
              <rect x="64" y="65" width="4" height="5" fill={P.soilDark} {...detail} />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={46} y={72} c={P.berry} s={0.6} hat={P.charcoal} /> : null}
          {winter ? <Old><Rain n={5} y0={2} /></Old> : null}
        </Svg>
      )
    }
    case 'wasserfall':
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <path d="M24 60V22Q40 16 56 22V60z" fill={P.stoneDark} {...line} />
          <path d="M26 24Q40 18.6 54 24" stroke={P.white} strokeWidth=".8" opacity=".22" fill="none" strokeLinecap="round" />
          <path d="M28 30l4 -2M48 40l4 2M30 50l3 2" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M28 30l4 -2M48 40l4 2M30 50l3 2" stroke={P.leafMoss} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M36 22V60h8V22z" fill={P.waterLight} stroke={P.outline} strokeWidth={H} />
          <path d="M38 24v34M42 26v32" stroke={P.white} strokeWidth=".5" strokeDasharray="3 2" />
          <ellipse cx="40" cy="62" rx="16" ry="4.4" fill={P.water} {...line} />
          <path d="M34 60q2 -1.4 4 0M42 61q2 -1.4 4 0" stroke={P.white} strokeWidth=".6" opacity=".6" fill="none" strokeLinecap="round" />
          {tier >= 2 ? <Old><TreeFern x={16} y={62} s={1} season={season} h={14} /></Old> : null}
          {tier >= 3 ? <Old><TreeFern x={66} y={62} s={1} season={season} h={12} /></Old> : null}
          {tier >= 4 ? <path d="M32 64q3 -1.6 6 0t5 .4" stroke={P.outline} strokeWidth="1.8" fill="none" strokeLinecap="round" /> : null}
          {tier >= 4 ? <path d="M32 64q3 -1.6 6 0t5 .4" stroke={P.charcoal} strokeWidth=".9" fill="none" strokeLinecap="round" /> : null}
          {tier >= 5 ? <Farmer x={60} y={72} c={P.leafDark} s={0.6} hat={P.woodLight} /> : null}
          {winter ? <Old><Rain n={5} y0={2} /></Old> : null}
        </Svg>
      )
    case 'pflanzschule': {
      const trays = tier + 1
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <path d="M10 48h60M12 48v18M68 48v18" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M10 48h60M12 48v18M68 48v18" stroke={P.woodDark} strokeWidth="1.1" strokeLinecap="round" />
          <rect x="10" y="46" width="60" height="2" rx=".5" fill={P.woodMid} {...detail} />
          <path d="M12 48.8h56" stroke={P.outline} strokeWidth="1" opacity=".15" />
          {Array.from({ length: trays }, (_, i) => {
            const x = 14 + (i % 3) * 18
            const y = 58 + Math.floor(i / 3) * 8
            return (
              <g key={i}>
                <rect x={x} y={y} width="14" height="3" rx=".4" fill={P.charcoal} {...detail} />
                {[2, 5, 8, 11].map((d) => (
                  <g key={d}>
                    <path d={`M${x + d} ${y}v-3`} stroke={P.leafDark} strokeWidth=".6" strokeLinecap="round" />
                    <ellipse cx={x + d} cy={y - 3.4} rx="1.3" ry=".8" fill={winter ? P.leafMoss : i % 2 ? P.leaf : P.leafLight} stroke={P.outline} strokeWidth={H * 0.6} />
                  </g>
                ))}
              </g>
            )
          })}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.leafDark} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'hanghuette':
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <rect x="20" y="42" width="30" height="18" fill={P.woodLight} {...line} />
          <path d="M20.6 44.4h28.8" stroke={P.outline} strokeWidth="1.6" opacity=".16" />
          <path d="M16 43L35 32L54 43z" fill={P.berry} {...line} strokeLinejoin="round" />
          <path d="M22 40.4L35 33" stroke={P.white} strokeWidth=".7" opacity=".35" strokeLinecap="round" />
          <rect x="31" y="49" width="7" height="11" fill={P.leafDark} {...detail} />
          <rect x="23" y="46" width="6" height="5" fill={winter ? P.lamp : P.window} {...detail} />
          <path d="M44 37.2V30h3v8.9z" fill={P.stoneDark} {...detail} strokeLinejoin="round" />
          {winter ? <path className="smoke" d="M45.5 28c-1 -2 1 -3 0 -5" stroke={P.white} strokeWidth=".8" fill="none" /> : null}
          {tier >= 2 ? <path d="M18 60h34" stroke={P.outline} strokeWidth="2.8" strokeLinecap="round" /> : null}
          {tier >= 2 ? <path d="M18 60h34" stroke={P.woodMid} strokeWidth="1.6" strokeLinecap="round" /> : null}
          {tier >= 3 ? <Old><TreeFern x={64} y={62} s={1.1} season={season} h={14} /></Old> : null}
          {tier >= 4
            ? [40, 44].map((x) => (
                <path key={x} d={`M${x} 60v-3h1.6v2h1.2v1z`} fill={P.charcoal} stroke={P.outline} strokeWidth={H} strokeLinejoin="round" />
              ))
            : null}
          {tier >= 5 ? <Farmer x={14} y={70} c={P.leafDark} s={0.6} hat={P.woodLight} /> : null}
          {tier >= 5 ? <path d="M54 66h8M54 68h8" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" /> : null}
          {tier >= 5 ? <path d="M54 66h8M54 68h8" stroke={P.woodMid} strokeWidth="1.2" strokeLinecap="round" /> : null}
          {winter ? <Old><Rain n={5} y0={2} /></Old> : null}
        </Svg>
      )
    case 'matariki': {
      const people = Math.min(3, tier - 1)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <g>
            {[[52, 10], [55, 8], [57, 11], [54, 13], [58, 14], [50, 13], [56, 6], [60, 9], [53, 16]].slice(0, 4 + tier).map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i < 2 ? 1.1 : 0.8} fill={P.white} stroke={P.outline} strokeWidth={H * 0.5} />
            ))}
          </g>
          <Old><Stars n={4} y0={4} y1={24} /></Old>
          <ellipse cx="40" cy="62" rx="6" ry="2" fill={P.charcoal} {...detail} />
          <path d="M35.4 62.6q4.6 1.6 9.2 0" stroke={P.stone} strokeWidth=".8" opacity=".6" fill="none" strokeLinecap="round" />
          <Old><Fire x={40} y={62} s={0.7} /></Old>
          {Array.from({ length: Math.max(0, people) }, (_, i) => (
            <Farmer key={i} x={[24, 56, 40][i]!} y={[66, 66, 72][i]!} s={0.7} c={[P.berry, P.leafDark, P.gold][i]!} hat={P.charcoal} />
          ))}
          {tier >= 4 ? <path d="M12 66q6 -4 10 0" stroke={P.outline} strokeWidth="2.6" fill="none" strokeLinecap="round" /> : null}
          {tier >= 4 ? <path d="M12 66q6 -4 10 0" stroke={P.woodMid} strokeWidth="1.4" fill="none" strokeLinecap="round" /> : null}
          {tier >= 5 ? <path d="M60 72h10" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" /> : null}
          {tier >= 5 ? <path d="M60 72h10" stroke={P.woodMid} strokeWidth="1.4" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
  }
  return null
}
