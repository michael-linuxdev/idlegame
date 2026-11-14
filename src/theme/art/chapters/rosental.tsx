/**
 * Kapitel 28 — Rosental bei Kazanlak im kräftigen Stil (2026-11-14,
 * Weinberg-Niveau): Destillerie, Rosenwasserhaus, Veranda, Rosenboden,
 * Bergquelle, Imkerwagen, Walnussbäume, Pflückkörbe und Fläschchen mit Kontur;
 * Rosenbüsche, Feuer und Bienen behalten ihre Zeichnung. Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Bee } from '../parts'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Person } from './figures'
import { type AreaProps } from './partsB'
import { Fire } from './partsD'
import { RoseBush } from './partsE'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Geflochtener Pflückkorb, gefüllt (Fußpunkt Mitte unten). */
function Basket({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y - 5} rx="4.4" ry="1.8" fill={fill} {...detail} />
      <path d={`M${x - 4} ${y - 5}l1 5h6l1 -5z`} fill={P.woodLight} {...detail} strokeLinejoin="round" />
      <path d={`M${x - 3.6} ${y - 3}h7.2M${x - 3.2} ${y - 1.4}h6.4`} stroke={P.outline} strokeWidth={H} opacity=".6" />
      <path d={`M${x + 1.6} ${y - 4.4}l-.6 4`} stroke={P.outline} strokeWidth={H} opacity=".2" />
    </g>
  )
}

/** Kupferner Destillierkessel mit Helm und Rohr. */
function Alembic({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-6" y="-4" width="12" height="4" rx=".6" fill={P.stoneDark} {...detail} />
      <ellipse cx="0" cy="-9" rx="7" ry="6" fill={P.terracottaLight} {...line} />
      <path d="M2 -4.6a7 6 0 0 0 4.6 -6" stroke={P.outline} strokeWidth="1.4" opacity=".15" fill="none" strokeLinecap="round" />
      <path d="M-3 -14q3 -6 6 0z" fill={P.terracotta} {...detail} strokeLinejoin="round" />
      <path d="M0 -17q8 -2 12 6" stroke={P.outline} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M0 -17q8 -2 12 6" stroke={P.terracotta} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <ellipse cx="-2.6" cy="-11" rx="1.6" ry="2.6" fill={P.white} opacity=".35" />
    </g>
  )
}

/** Walnussbaum. */
function Walnut({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const crown = season === 'autumn' ? P.gold : season === 'spring' ? P.leafPale : P.leaf
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-12M0 -9l-5 -5M0 -11l5 -5" stroke={P.outline} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M0 0V-12M0 -9l-5 -5M0 -11l5 -5" stroke={P.stoneDark} strokeWidth="1.5" strokeLinecap="round" />
      {season === 'winter' ? (
        <g>
          <path d="M-5 -14l-2 -3M5 -16l2 -3M0 -12v-5" stroke={P.outline} strokeWidth="1.9" strokeLinecap="round" />
          <path d="M-5 -14l-2 -3M5 -16l2 -3M0 -12v-5" stroke={P.stoneDark} strokeWidth=".8" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx="0" cy="-18" rx="9" ry="7" fill={crown} {...line} />
          <path d="M-6 -13.4q6 3 12 0" stroke={P.outline} strokeWidth="1.6" opacity=".15" fill="none" strokeLinecap="round" />
          <ellipse cx="-3" cy="-20" rx="4" ry="2.4" fill={P.leafLight} opacity=".4" />
          <path d="M-5.6 -21q2 -2.6 5 -2.8" stroke={P.white} strokeWidth={D} opacity=".35" fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  )
}

/** Bienenkasten in Farbe. */
function Box({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <rect x={x - 2.4} y={y - 4.6} width="4.8" height="4.6" fill={c} {...detail} />
      <rect x={x + 0.8} y={y - 4} width="1.2" height="3.6" fill={P.outline} opacity=".15" />
      <rect x={x - 2.8} y={y - 5.6} width="5.6" height="1.2" rx=".3" fill={P.white} {...detail} />
      <rect x={x - 0.8} y={y - 1.2} width="1.6" height=".6" fill={P.ink} />
    </g>
  )
}

/** Fläschchen. */
function Bottle({ x, y, c = P.blossom }: { x: number; y: number; c?: string }) {
  return (
    <g>
      <rect x={x - 1} y={y - 4} width="2" height="4" rx=".6" fill={c} stroke={P.outline} strokeWidth={H * 0.8} />
      <rect x={x - 0.4} y={y - 5.2} width=".8" height="1.2" fill={P.woodMid} stroke={P.outline} strokeWidth={H * 0.5} />
    </g>
  )
}

export function Rosental({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  const meadow = winter ? P.frost : summer ? P.leafPale : autumn ? P.woodLight : P.leaf
  const petals = spring || summer ? P.pink : autumn ? P.berry : P.white
  switch (id) {
    case 'rosenreihen': {
      const n = 3 + tier * 3
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="60" rx="37" ry="11" fill={winter ? P.frost : P.soil} {...line} />
          {Array.from({ length: n }, (_, i) => (
            <Old key={i}><RoseBush x={10 + (i % 6) * 12 + (Math.floor(i / 6) % 2) * 5} y={56 + Math.floor(i / 6) * 6} s={0.9} season={season} n={spring ? 5 : 3} /></Old>
          ))}
          {tier >= 5 ? <Person x={72} y={68} c={P.berry} s={0.65} /> : null}
        </Svg>
      )
    }
    case 'pflueckkoerbe': {
      const baskets = tier + 1
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="62" rx="37" ry="9" fill={meadow} {...line} />
          {[14, 30, 50, 66].map((x) => (
            <Old key={x}><RoseBush x={x} y={56} s={0.8} season={season} n={3} /></Old>
          ))}
          {Array.from({ length: baskets }, (_, i) => (
            <Basket key={i} x={[24, 40, 56, 32, 48, 16][i]!} y={[66, 68, 66, 72, 72, 70][i]!} fill={petals} />
          ))}
          {tier >= 3 ? <Person x={62} y={60} c={P.tomato} s={0.65} /> : null}
          {tier >= 4 ? <Person x={20} y={60} c={P.leafDark} s={0.65} /> : null}
          {tier >= 5 ? <Person x={40} y={58} c={P.yellow} s={0.65} /> : null}
        </Svg>
      )
    }
    case 'destillierkessel': {
      const stills = tier >= 5 ? 3 : tier >= 3 ? 2 : 1
      const bottles = tier
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="64" rx="37" ry="6" fill={winter ? P.frost : P.canvas} {...line} />
          <rect x="8" y="30" width="64" height="34" fill={P.white} {...line} />
          <rect x="9" y="31" width="62" height="3" fill={P.outline} opacity=".15" />
          <path d="M4 31L40 18L76 31z" fill={P.terracotta} {...line} strokeLinejoin="round" />
          <path d="M40 20L72 30.4H40z" fill={P.outline} opacity=".18" />
          <path d="M14 28.4L30 22.6" stroke={P.white} strokeWidth={D} opacity=".4" strokeLinecap="round" />
          {Array.from({ length: stills }, (_, i) => (
            <Alembic key={i} x={20 + i * 16} y={62} s={0.85} />
          ))}
          <rect x="58" y="44" width="10" height="16" fill={P.stoneLight} {...detail} />
          <path d="M60 46v12" stroke={P.white} strokeWidth={D} opacity=".4" strokeLinecap="round" />
          {Array.from({ length: bottles }, (_, i) => (
            <Bottle key={i} x={14 + i * 4} y={70} c={P.amber} />
          ))}
          {tier >= 2 ? <Old><Fire x={20} y={62} s={0.3} /></Old> : null}
          {tier >= 4 ? (
            <g>
              <path d="M58.6 17v-2h3v2" fill={P.stoneDark} {...detail} />
              <path className="smoke" d="M60 16c-2 -3 2 -5 0 -8" stroke={P.white} strokeWidth="1.6" fill="none" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? <Person x={68} y={68} c={P.denim} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'walnussallee': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="62" rx="37" ry="9" fill={meadow} {...line} />
          <path d="M34 72L38 50h4l4 22z" fill={P.paper} {...detail} strokeLinejoin="round" />
          {Array.from({ length: n }, (_, i) => (
            <Walnut key={i} x={i % 2 ? 56 + (i >> 1) * 6 : 24 - (i >> 1) * 6} y={56 + (i >> 1) * 6} s={0.85 + (i >> 1) * 0.12} season={season} />
          ))}
          {autumn ? [30, 50, 44].map((x) => <circle key={x} cx={x} cy={68} r="1" fill={P.woodDark} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
          {tier >= 3 ? (
            <g>
              <path d="M60 70h12M61 70v2M71 70v2" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
              <path d="M60 70h12M61 70v2M71 70v2" stroke={P.woodMid} strokeWidth="1.1" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 4 ? <Person x={64} y={68} c={P.tomato} s={0.6} /> : null}
          {tier >= 5 ? <Person x={69} y={68} c={P.yellow} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'imkerwagen': {
      const boxes = 1 + tier
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="64" rx="37" ry="7" fill={meadow} {...line} />
          <rect x="14" y="48" width="44" height="8" rx=".8" fill={P.woodMid} {...line} />
          <rect x="15" y="53.4" width="42" height="1.8" fill={P.outline} opacity=".18" />
          <circle cx="22" cy="60" r="4" fill="none" stroke={P.outline} strokeWidth="2.4" />
          <circle cx="22" cy="60" r="4" fill="none" stroke={P.charcoal} strokeWidth="1.2" />
          <circle cx="50" cy="60" r="4" fill="none" stroke={P.outline} strokeWidth="2.4" />
          <circle cx="50" cy="60" r="4" fill="none" stroke={P.charcoal} strokeWidth="1.2" />
          <path d="M22 56.4v7.2M18.4 60h7.2M50 56.4v7.2M46.4 60h7.2" stroke={P.woodDark} strokeWidth=".6" />
          <path d="M58 52h12" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M58 52h12" stroke={P.woodDark} strokeWidth="1" strokeLinecap="round" />
          {Array.from({ length: boxes }, (_, i) => (
            <Box key={i} x={18 + (i % 6) * 7} y={48 - Math.floor(i / 6) * 5} c={[P.yellow, P.blue, P.leaf, P.tomato, P.white, P.denim][i % 6]!} />
          ))}
          {tier >= 3 && !winter ? <Old><Bee x={60} y={38} /></Old> : null}
          {tier >= 3 && !winter ? <Old><Bee x={30} y={34} /></Old> : null}
          {tier >= 3 && winter ? <path d="M14 47.6h44" stroke={P.white} strokeWidth="1.4" strokeLinecap="round" /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M64 66l2 -10M70 66l-2 -10M65 61h4" stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
              <path d="M64 66l2 -10M70 66l-2 -10M65 61h4" stroke={P.woodLight} strokeWidth=".9" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? <Person x={72} y={66} c={P.paper} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'rosenwasser': {
      const bottles = 1 + tier
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="64" rx="37" ry="6" fill={winter ? P.frost : P.canvas} {...line} />
          <rect x="10" y="34" width="38" height="28" fill={P.white} {...line} />
          <rect x="10" y="34" width="38" height="8" fill={P.woodDark} {...detail} />
          <rect x="11" y="42" width="36" height="2" fill={P.outline} opacity=".15" />
          <path d="M6 35L29 24L52 35z" fill={P.terracotta} {...line} strokeLinejoin="round" />
          <path d="M29 26L49 34.4H29z" fill={P.outline} opacity=".18" />
          <path d="M12 32.4L22 27.6" stroke={P.white} strokeWidth={D} opacity=".4" strokeLinecap="round" />
          <rect x="16" y="46" width="9" height="16" fill={P.woodMid} {...detail} />
          <rect x="31" y="46" width="10" height="7" fill={winter ? P.lamp : P.waterLight} {...detail} />
          <path d="M32.6 51.6l3 -4.4" stroke={P.white} strokeWidth={H} opacity=".5" strokeLinecap="round" />
          <path d="M52 62h22M54 62v6M72 62v6" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M52 62h22M54 62v6M72 62v6" stroke={P.woodDark} strokeWidth="1.2" strokeLinecap="round" />
          {Array.from({ length: bottles }, (_, i) => (
            <Bottle key={i} x={55 + i * 3.4} y={61.6} c={i % 2 ? P.blossom : P.pink} />
          ))}
          {tier >= 3 ? <ellipse cx="22" cy="68" rx="5" ry="1.6" fill={P.terracottaLight} {...detail} /> : null}
          {tier >= 3 ? <ellipse cx="22" cy="67.4" rx="3.4" ry=".9" fill={petals} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
          {tier >= 4 ? <Old><RoseBush x={8} y={70} s={0.7} season={season} n={3} /></Old> : null}
          {tier >= 5 ? <Person x={46} y={68} c={P.pink} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'bergquelle':
      return (
        <Svg tier={tier} bold>
          <path d="M6 54Q4 46 8 42L18 28L28 38L44 20L60 34L70 27L76 34Q78 46 74 54z" fill={P.stone} {...line} strokeLinejoin="round" />
          <path d="M44 20L60 34L70 27L76 34Q78 46 74 54H52L48 32z" fill={P.outline} opacity=".14" />
          <path d="M12 40L18 31M34 32L42 23" stroke={P.white} strokeWidth={D} opacity=".35" strokeLinecap="round" />
          {winter || tier >= 4 ? <path d="M40 24l4 -4l4 4M68 28l4 -2l3 2" stroke={P.white} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          <ellipse cx="40" cy="62" rx="37" ry="11" fill={meadow} {...line} />
          <rect x="28" y="38" width="24" height="20" rx="1" fill={P.stoneLight} {...line} />
          <path d="M28 38a12 6 0 0 1 24 0z" fill={P.stone} stroke={P.outline} strokeWidth={H} />
          <rect x="32" y="56" width="16" height="5" fill={P.stoneLight} stroke={P.outline} strokeWidth={H} />
          <path d="M33 56V45a7 5 0 0 1 14 0V56z" fill={P.stone} stroke={P.outline} strokeWidth={H} />
          <path d="M40 48h3" stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
          <path d="M40 48h3" stroke={P.metal} strokeWidth="1" strokeLinecap="round" />
          <path d="M43 48.6q1 3 .6 8" stroke={winter ? P.glass : P.waterLight} strokeWidth="1" fill="none" strokeLinecap="round" />
          <ellipse cx="40" cy="56.6" rx="7" ry="1" fill={winter ? P.glass : P.water} stroke={P.outline} strokeWidth={H} />
          <path d="M36 56.4h3" stroke={P.white} strokeWidth={H} opacity=".5" strokeLinecap="round" />
          {tier >= 2 ? <path d="M48 46h2v3h-2z" fill={P.metal} stroke={P.outline} strokeWidth={H} /> : null}
          {tier >= 3 ? <path d="M16 70q4 -6 10 -4" stroke={P.outline} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d="M16 70q4 -6 10 -4" stroke={P.waterLight} strokeWidth="1.1" fill="none" strokeLinecap="round" /> : null}
          {tier >= 3 ? <Walnut x={66} y={64} s={0.7} season={season} /> : null}
          {tier >= 4 ? <path d="M50 49v3M49 52h2l-.3 2h-1.4z" stroke={P.outline} strokeWidth={H} fill={P.terracotta} strokeLinejoin="round" /> : null}
          {tier >= 5 ? <Person x={20} y={66} c={P.leafDark} s={0.6} /> : null}
        </Svg>
      )
    case 'veranda': {
      const vines = 1 + tier
      const bean = winter ? P.woodMid : autumn ? P.winterLeaf : P.leaf
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="64" rx="37" ry="6" fill={meadow} {...line} />
          <rect x="10" y="40" width="60" height="22" fill={P.woodMid} {...line} />
          <rect x="10" y="22" width="60" height="18" fill={P.white} {...line} />
          <rect x="11" y="23" width="58" height="2.4" fill={P.outline} opacity=".15" />
          <path d="M4 23L40 12L76 23z" fill={P.terracotta} {...line} strokeLinejoin="round" />
          <path d="M40 14L72 22.4H40z" fill={P.outline} opacity=".18" />
          <path d="M12 21L28 16.2" stroke={P.white} strokeWidth={D} opacity=".4" strokeLinecap="round" />
          <path d="M10 40h60M10 46h60" stroke={P.outline} strokeWidth="1.2" />
          {[20, 34, 48, 62].map((x) => (
            <rect key={x} x={x} y="26" width="6" height="8" fill={winter ? P.lamp : P.waterLight} {...detail} />
          ))}
          {Array.from({ length: vines }, (_, i) => {
            const x = 13 + i * 9.4
            return (
              <g key={i}>
                <path d={`M${x} 62Q${x + 2} 54 ${x} 46`} stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d={`M${x} 62Q${x + 2} 54 ${x} 46`} stroke={bean} strokeWidth=".9" fill="none" strokeLinecap="round" />
                {!winter ? <ellipse cx={x + 1} cy={52} rx="1.8" ry="1.2" fill={bean} stroke={P.outline} strokeWidth={H * 0.8} /> : null}
                {summer ? <circle cx={x - 0.6} cy={49} r=".9" fill={P.tomato} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <path d="M30 62v-4h8v4" stroke={P.outline} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M30 62v-4h8v4" stroke={P.woodLight} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : null}
          {tier >= 5 ? <Person x={52} y={62} c={P.berry} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'rosenboden': {
      const racks = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="66" rx="37" ry="5" fill={meadow} {...line} />
          <rect x="10" y="40" width="60" height="24" fill={P.white} {...line} />
          <rect x="11" y="41" width="58" height="2.6" fill={P.outline} opacity=".15" />
          <path d="M6 41L40 14L74 41z" fill={P.woodLight} {...line} strokeLinejoin="round" />
          <path d="M12 40L40 18L68 40z" fill={P.soilDark} opacity=".85" stroke={P.outline} strokeWidth={H} />
          <path d="M9 38.4L20 29.6" stroke={P.white} strokeWidth={D} opacity=".4" strokeLinecap="round" />
          {Array.from({ length: racks }, (_, i) => {
            const y = 38 - i * 4
            const half = 26 - i * 4.4
            return (
              <g key={i}>
                <path d={`M${40 - half} ${y}h${half * 2}`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
                <path d={`M${40 - half} ${y}h${half * 2}`} stroke={P.woodMid} strokeWidth=".9" strokeLinecap="round" />
                {Array.from({ length: Math.max(2, Math.round(half / 3)) }, (_, k) => (
                  <ellipse key={k} cx={40 - half + 2 + k * 6} cy={y - 0.8} rx="1.6" ry=".7" fill={petals} stroke={P.outline} strokeWidth={H * 0.5} />
                ))}
              </g>
            )
          })}
          <rect x="34" y="50" width="12" height="14" fill={P.woodDark} {...detail} />
          <path d="M40 51v12" stroke={P.outline} strokeWidth={H} opacity=".5" />
          {tier >= 5 ? <Person x={64} y={68} c={P.denim} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'rosenfest': {
      const dancers = 1 + tier
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="62" rx="37" ry="9" fill={meadow} {...line} />
          <Post x={6} y={66} h={40} w={2.4} k={K} />
          <Post x={74} y={66} h={40} w={2.4} k={K} />
          <path d="M6 28Q40 40 74 28" stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M6 28Q40 40 74 28" stroke={P.leafDark} strokeWidth=".9" fill="none" strokeLinecap="round" />
          {[12, 22, 32, 40, 48, 58, 68].map((x) => (
            <circle key={x} cx={x} cy={28 + Math.sin(((x - 6) / 68) * Math.PI) * 6} r="1.5" fill={P.pink} stroke={P.outline} strokeWidth={H * 0.8} />
          ))}
          {Array.from({ length: dancers }, (_, i) => (
            <Person key={i} x={16 + i * 8.4} y={66 + (i % 2)} c={[P.white, P.tomato, P.white, P.berry, P.white, P.tomato][i]!} s={0.9} />
          ))}
          {dancers > 1 ? <path d={`M17 61h${(dancers - 1) * 8.4 - 2}`} stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" /> : null}
          {dancers > 1 ? <path d={`M17 61h${(dancers - 1) * 8.4 - 2}`} stroke={P.skin} strokeWidth=".8" strokeLinecap="round" /> : null}
          {tier >= 3 ? <Basket x={66} y={70} fill={petals} /> : null}
          {tier >= 4 ? <path d="M70 58q4 -4 4 2l-2 3" fill={P.white} {...detail} strokeLinejoin="round" /> : null}
          {tier >= 5 ? <Person x={72} y={62} c={P.charcoal} s={0.65} /> : null}
        </Svg>
      )
    }
  }
  return null
}
