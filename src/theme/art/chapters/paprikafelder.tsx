/**
 * Kapitel 26 — Paprikafelder bei Kalocsa im kräftigen Stil (2026-11-14,
 * Weinberg-Niveau): Paprikaschnüre, Kalocsa-Blumen, Robinien, Schwengelbrunnen,
 * Mühlstein, Marktstand und Kessel mit Kontur, Licht und Schatten; Häuser,
 * Pflanzen und Störche aus partsC–E behalten ihre Zeichnung. Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Bee } from '../parts'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Person } from './figures'
import { type AreaProps } from './partsB'
import { StringLights, TomatoPlant } from './partsC'
import { Fire, ThatchHouse } from './partsD'
import { PepperPlant, Stork } from './partsE'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Schnur getrockneter Paprikaschoten (Füzér), hängt von `y` nach unten. */
function PepperString({ x, y, n = 6, c }: { x: number; y: number; n?: number; c: string }) {
  return (
    <g>
      <path d={`M${x} ${y}v${n * 2.2}`} stroke={P.outline} strokeWidth="1.4" strokeLinecap="round" />
      <path d={`M${x} ${y}v${n * 2.2}`} stroke={P.woodMid} strokeWidth=".6" strokeLinecap="round" />
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <path d={`M${x} ${y + 1 + i * 2.2}q${i % 2 ? 1.6 : -1.6} .4 ${i % 2 ? 1.2 : -1.2} 2.6`} stroke={P.outline} strokeWidth="2.3" fill="none" strokeLinecap="round" />
          <path d={`M${x} ${y + 1 + i * 2.2}q${i % 2 ? 1.6 : -1.6} .4 ${i % 2 ? 1.2 : -1.2} 2.6`} stroke={c} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}

/** Kalocsa-Blume: bunte Blüte mit Blättern, freihändig gemalt. */
function KalocsaFlower({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 3q-3 -1 -3.4 -3M0 3q3 -1 3.4 -3" stroke={P.outline} strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <path d="M0 3q-3 -1 -3.4 -3M0 3q3 -1 3.4 -3" stroke={P.leaf} strokeWidth=".9" fill="none" strokeLinecap="round" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-1.6" rx=".9" ry="1.6" fill={c} stroke={P.outline} strokeWidth={H * 0.6} transform={`rotate(${a})`} />
      ))}
      <circle cx="0" cy="0" r=".9" fill={P.yellow} stroke={P.outline} strokeWidth={H * 0.6} />
    </g>
  )
}

/** Robinie (in Ungarn „Akazie“). */
function Robinia({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const crown = season === 'autumn' ? P.yellow : season === 'spring' ? P.leafPale : P.leaf
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0Q-1 -10 1 -18M0 -10l-5 -6M.6 -14l5 -5" stroke={P.outline} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M0 0Q-1 -10 1 -18M0 -10l-5 -6M.6 -14l5 -5" stroke={P.bark} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {season === 'winter' ? (
        <g>
          <path d="M-5 -16l-2 -3M5.6 -19l2 -3M1 -18l-1 -4" stroke={P.outline} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M-5 -16l-2 -3M5.6 -19l2 -3M1 -18l-1 -4" stroke={P.bark} strokeWidth=".7" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx="-4" cy="-19" rx="6" ry="4.4" fill={crown} {...line} />
          <ellipse cx="4" cy="-21" rx="6" ry="4.6" fill={crown} {...line} />
          <path d="M-6 -16.4q4 1.6 8 -.4q4 -1 7 -1.8" stroke={P.outline} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".18" />
          <path d="M-8 -20.6q1.6 -2 4 -2.4M1 -23.4q1.8 -1.6 4.4 -1.6" stroke={P.white} strokeWidth={D} fill="none" strokeLinecap="round" opacity=".4" />
          {season === 'spring'
            ? [
                [-6, -17],
                [-2, -21],
                [3, -18],
                [6, -22],
              ].map(([dx, dy], i) => (
                <g key={i}>
                  <path d={`M${dx} ${dy}v2.6`} stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
                  <path d={`M${dx} ${dy}v2.6`} stroke={P.white} strokeWidth="1.2" strokeLinecap="round" />
                </g>
              ))
            : null}
        </g>
      )}
    </g>
  )
}

export function Paprikafelder({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  const field = winter ? P.frost : P.soil
  switch (id) {
    case 'paprikareihen': {
      const n = 3 + tier * 3
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="60" rx="37" ry="11" fill={field} {...line} />
          {[54, 60, 66].map((y) => (
            <path key={y} d={`M8 ${y}H72`} stroke={winter ? P.white : P.soilDark} strokeWidth="1.1" strokeLinecap="round" opacity=".8" />
          ))}
          {Array.from({ length: n }, (_, i) => (
            <Old key={i}><PepperPlant x={10 + (i % 6) * 12 + (Math.floor(i / 6) % 2) * 5} y={56 + Math.floor(i / 6) * 6} s={0.9} season={season} pods={autumn ? 3 : 2} /></Old>
          ))}
          {tier >= 5 ? <Person x={72} y={66} c={P.berry} s={0.65} /> : null}
        </Svg>
      )
    }
    case 'paprikaschnuere': {
      const strings = 1 + tier
      const pod = autumn ? P.tomato : P.autumnDark
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="64" rx="37" ry="5" fill={winter ? P.frost : P.leafPale} {...line} />
          <rect x="8" y="30" width="64" height="34" fill={P.white} {...line} />
          <rect x="9" y="31" width="62" height="2.4" fill={P.outline} opacity=".16" />
          <path d="M4 31Q40 18 76 31L76 26Q40 12 4 26z" fill={P.woodLight} {...line} />
          <path d="M10 26.4Q40 15 70 26.4" stroke={P.white} strokeWidth={D} fill="none" strokeLinecap="round" opacity=".4" />
          {winter ? <path d="M6 26Q40 13 74 26" stroke={P.white} strokeWidth="1.6" fill="none" /> : null}
          <rect x="34" y="44" width="10" height="20" fill={P.leafDark} {...detail} />
          <path d="M9 62.2h62" stroke={P.blue} strokeWidth="1.6" />
          {Array.from({ length: strings }, (_, i) => (
            <PepperString key={i} x={[14, 22, 52, 60, 28, 66][i]!} y={31} n={7} c={pod} />
          ))}
          {tier >= 2 ? (
            <g>
              <rect x="48" y="38" width="9" height="8" fill={P.waterLight} {...detail} />
              <path d="M52.5 38.6v6.8M48.6 42h7.8" stroke={P.blue} strokeWidth=".9" />
              <path d="M49.4 39.6h2" stroke={P.white} strokeWidth=".7" strokeLinecap="round" opacity=".6" />
            </g>
          ) : null}
          {tier >= 3 ? <path d="M70 64v-8h4v8z" fill={P.woodMid} {...detail} /> : null}
          {tier >= 5 ? <Person x={46} y={68} c={P.blue} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'paprikamuehle': {
      const sacks = tier + 1
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="64" rx="37" ry="6" fill={winter ? P.frost : P.canvas} {...line} />
          <Old><ThatchHouse x={10} y={60} w={34} h={18} wall={P.white} winter={winter} lit={winter} /></Old>
          <g transform="translate(58 58)">
            <ellipse cx="0" cy="0" rx="8" ry="2.6" fill={P.stone} {...detail} />
            <rect x="-8" y="-4" width="16" height="4" fill={P.stoneLight} {...detail} />
            <rect x="3" y="-3.4" width="4.6" height="3.4" fill={P.outline} opacity=".15" />
            <ellipse cx="0" cy="-4" rx="8" ry="2.6" fill={P.stoneLight} {...detail} />
            <ellipse cx="0" cy="-4" rx="3" ry="1" fill={P.tomato} stroke={P.outline} strokeWidth={H * 0.7} />
            <path d="M-6 -4.6q2 -1.4 4 -1.6" stroke={P.white} strokeWidth={D} fill="none" strokeLinecap="round" opacity=".5" />
          </g>
          {Array.from({ length: sacks }, (_, i) => (
            <g key={i}>
              <path d={`M${48 + i * 5} 70q-2 -4 0 -6h4q2 2 0 6z`} fill={P.paper} {...detail} />
              <path d={`M${48.4 + i * 5} 65h3.2`} stroke={P.tomato} strokeWidth="1" />
            </g>
          ))}
          {tier >= 3 ? <path d="M54 52q4 -3 8 0" stroke={P.tomato} strokeWidth=".8" fill="none" opacity=".6" /> : null}
          {tier >= 4 ? <PepperString x={12} y={42} n={6} c={autumn ? P.tomato : P.autumnDark} /> : null}
          {tier >= 5 ? <Person x={70} y={66} c={P.paper} s={0.65} /> : null}
        </Svg>
      )
    }
    case 'kalocsastube': {
      const flowers = 2 + tier * 2
      const cols = [P.tomato, P.blue, P.berry, P.plum, P.orange, P.denim]
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="65" rx="37" ry="5" fill={winter ? P.frost : P.leafPale} {...line} />
          <rect x="8" y="22" width="64" height="42" fill={P.white} {...line} />
          <rect x="9" y="23.4" width="62" height="2.2" fill={P.outline} opacity=".15" />
          <path d="M8 22h64" stroke={P.outline} strokeWidth="3" strokeLinecap="round" />
          <path d="M8 22h64" stroke={P.woodMid} strokeWidth="1.6" strokeLinecap="round" />
          <rect x="30" y="30" width="20" height="14" fill={P.waterLight} {...detail} />
          <rect x="31" y="31" width="18" height="12" fill="none" stroke={P.leafDark} strokeWidth="1" />
          <path d="M40 30v14M30 37h20" stroke={P.leafDark} strokeWidth="1" />
          <path d="M32 32.6h4" stroke={P.white} strokeWidth=".8" strokeLinecap="round" opacity=".6" />
          {Array.from({ length: flowers }, (_, i) => {
            const side = i % 2 ? 1 : -1
            const k = Math.floor(i / 2)
            const x = 40 + side * (16 + (k % 3) * 6)
            const y = 30 + Math.floor(k / 3) * 12 + (k % 3) * 3
            return <KalocsaFlower key={i} x={x} y={y} c={cols[i % cols.length]!} s={1.1} />
          })}
          {tier >= 3 ? <rect x="31" y="48" width="18" height="14" fill={P.cream} {...detail} /> : null}
          {tier >= 3 ? <KalocsaFlower x={40} y={55} c={P.tomato} s={1.4} /> : null}
          {tier >= 4 ? <path d="M30 44.6h20" stroke={P.tomato} strokeWidth="1.3" strokeDasharray="1 1" /> : null}
          {tier >= 5 ? <Person x={62} y={66} c={P.tomato} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'schwengelbrunnen':
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="62" rx="37" ry="9" fill={winter ? P.frost : summer ? P.paper : P.leafPale} {...line} />
          <Post x={22} y={64} h={38} w={2.8} k={K} />
          <path d="M20 26l2 -2l2 2" stroke={P.outline} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M20 26l2 -2l2 2" stroke={P.woodDark} strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M8 18L58 34" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M8 18L58 34" stroke={P.woodMid} strokeWidth="1.3" strokeLinecap="round" />
          <rect x="5" y="16" width="6" height="4" fill={P.stoneDark} {...detail} transform="rotate(18 8 18)" />
          <path d="M56 33.4V54" stroke={P.outline} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M56 33.4V54" stroke={P.woodMid} strokeWidth=".6" strokeLinecap="round" />
          <path d="M54.4 54h3.2l-.4 3h-2.4z" fill={P.woodMid} {...detail} />
          <rect x="50" y="58" width="12" height="5" rx="1" fill={P.white} {...detail} />
          <rect x="51" y="61" width="10" height="1.4" fill={P.outline} opacity=".15" />
          <ellipse cx="56" cy="58.6" rx="5" ry="1" fill={winter ? P.glass : P.water} stroke={P.outline} strokeWidth={H * 0.7} />
          <path d="M53 58.4h2.4" stroke={P.white} strokeWidth=".5" strokeLinecap="round" opacity=".6" />
          {tier >= 2 ? <path d="M30 66h14v-3h-14z" fill={P.woodMid} {...detail} /> : null}
          {tier >= 2 ? <path d="M31 64h12" stroke={winter ? P.glass : P.water} strokeWidth="1" /> : null}
          {tier >= 3 ? (
            <g transform="translate(66 68) scale(.75)">
              <path d="M-4 0v-5M-2 0v-5M3 0v-5M5 0v-5" stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
              <path d="M-4 0v-5M-2 0v-5M3 0v-5M5 0v-5" stroke={P.woodDark} strokeWidth="1" strokeLinecap="round" />
              <ellipse cx="0" cy="-7" rx="6" ry="3" fill={P.woodDark} {...detail} />
              <path d="M-5 -8l-4 -4l-1.4 2l2 4z" fill={P.woodDark} {...detail} />
              <path d="M-3 -8.6q3 -1.6 6 -.6" stroke={P.woodMid} strokeWidth=".8" fill="none" strokeLinecap="round" opacity=".6" />
              <path d="M-9 -12l-1 -1.6" stroke={P.outline} strokeWidth="1" strokeLinecap="round" />
              <path d="M6 -8q2 2 1 6" stroke={P.outline} strokeWidth="1" fill="none" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 4 ? <Old><Stork x={22} y={25} s={0.55} /></Old> : null}
          {tier >= 5 ? <Person x={46} y={66} c={P.denim} s={0.65} /> : null}
        </Svg>
      )
    case 'tomatenfeld': {
      const n = 1 + tier
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="60" rx="37" ry="10" fill={field} {...line} />
          {Array.from({ length: n }, (_, i) => {
            const x = 12 + i * 11
            const y = 62 + (i % 2) * 4
            if (winter)
              return (
                <g key={i}>
                  <path d={`M${x} ${y}V${y - 14}M${x - 1} ${y - 14}h2`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
                  <path d={`M${x} ${y}V${y - 14}M${x - 1} ${y - 14}h2`} stroke={P.woodLight} strokeWidth=".9" strokeLinecap="round" />
                </g>
              )
            if (spring)
              return (
                <g key={i}>
                  <path d={`M${x} ${y}V${y - 6}M${x} ${y - 3}l-2 -1.4M${x} ${y - 4.6}l2 -1.4`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
                  <path d={`M${x} ${y}V${y - 6}M${x} ${y - 3}l-2 -1.4M${x} ${y - 4.6}l2 -1.4`} stroke={P.leaf} strokeWidth=".9" strokeLinecap="round" />
                </g>
              )
            return <Old key={i}><TomatoPlant x={x} y={y} h={13} ripe={summer} fruits={3} /></Old>
          })}
          {tier >= 4 ? (
            <g>
              {[67, 70, 73].map((x) => <circle key={x} cx={x} cy={65.6} r="1.3" fill={summer ? P.tomato : P.orange} stroke={P.outline} strokeWidth={H * 0.6} />)}
              <path d="M64 70h12l-1 -4h-10z" fill={P.wood} {...detail} />
              <path d="M65.4 68h9.2" stroke={P.outline} strokeWidth={H} opacity=".4" />
            </g>
          ) : null}
          {tier >= 5 ? <Person x={72} y={60} c={P.leafDark} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'akazienhain': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="62" rx="37" ry="9" fill={winter ? P.frost : P.leafPale} {...line} />
          {Array.from({ length: n }, (_, i) => (
            <Robinia key={i} x={[40, 22, 58, 30, 50][i]!} y={[60, 64, 64, 70, 70][i]!} s={[1.2, 0.95, 0.95, 0.8, 0.8][i]!} season={season} />
          ))}
          {tier >= 4 ? (
            <g>
              <path d="M64 70h8v-6h-8z" fill={P.yellow} {...detail} />
              <path d="M63.4 64h9.2" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
              <path d="M63.4 64h9.2" stroke={P.woodMid} strokeWidth="1" strokeLinecap="round" />
              <rect x="67" y="68" width="2" height="1" fill={P.ink} />
            </g>
          ) : null}
          {tier >= 4 && !winter ? <Old><Bee x={60} y={52} /></Old> : null}
          {tier >= 5 ? (
            <g>
              <path d="M6 70l6 -3l8 0" stroke={P.outline} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 70l6 -3l8 0" stroke={P.woodMid} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'schilfscheune':
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="64" rx="37" ry="6" fill={winter ? P.frost : P.leafPale} {...line} />
          <Old><ThatchHouse x={12} y={62} w={40} h={20} wall={P.white} winter={winter} /></Old>
          {tier >= 2 ? Array.from({ length: 3 }, (_, i) => <ellipse key={i} cx={20 + i * 3} cy={48 + i * 0.6} rx="1" ry="2.4" fill={P.yellow} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
          {tier >= 3 ? (
            <g>
              <path d="M56 66h14l-2 -6h-10z" fill={P.woodMid} {...detail} />
              <circle cx="58" cy="67" r="2.4" fill="none" stroke={P.outline} strokeWidth="1.9" />
              <circle cx="58" cy="67" r="2.4" fill="none" stroke={P.woodMid} strokeWidth=".8" />
              <circle cx="68" cy="67" r="2.4" fill="none" stroke={P.outline} strokeWidth="1.9" />
              <circle cx="68" cy="67" r="2.4" fill="none" stroke={P.woodMid} strokeWidth=".8" />
            </g>
          ) : null}
          {tier >= 4 ? [58, 62, 66].map((x) => <ellipse key={x} cx={x} cy={59} rx="1.6" ry="2.6" fill={autumn ? P.yellow : P.woodLight} stroke={P.outline} strokeWidth={H * 0.7} />) : null}
          {tier >= 5 ? <Person x={72} y={64} c={P.woodDark} s={0.6} /> : null}
        </Svg>
      )
    case 'paprikamarkt': {
      const sacks = tier + 1
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="64" rx="37" ry="6" fill={winter ? P.frost : P.canvas} {...line} />
          <Post x={14} y={62} h={26} w={2.4} k={K} />
          <Post x={66} y={62} h={26} w={2.4} k={K} />
          <path d="M10 36h60l-4 -8h-52z" fill={P.white} {...line} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${14 + i * 9} 28l-1 8h5l-1 -8z`} fill={P.tomato} stroke={P.outline} strokeWidth={H * 0.6} />
          ))}
          <rect x="15" y="36.6" width="50" height="1.8" fill={P.outline} opacity=".16" />
          <path d="M17 29.6h10" stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".35" />
          <rect x="16" y="50" width="48" height="4" fill={P.woodLight} {...line} />
          <rect x="17" y="52.4" width="46" height="1.2" fill={P.outline} opacity=".15" />
          {Array.from({ length: sacks }, (_, i) => (
            <g key={i}>
              <path d={`M${20 + i * 7} 50q-2 -5 0 -7h4q2 2 0 7z`} fill={P.paper} {...detail} />
              <ellipse cx={22 + i * 7} cy={43.4} rx="2" ry=".8" fill={[P.tomato, P.berry, P.orange][i % 3]} stroke={P.outline} strokeWidth={H * 0.6} />
            </g>
          ))}
          {tier >= 3 ? <PepperString x={18} y={36} n={5} c={P.tomato} /> : null}
          {tier >= 4 ? <PepperString x={62} y={36} n={5} c={P.tomato} /> : null}
          {tier >= 5 ? <Person x={44} y={66} c={P.denim} s={0.65} /> : null}
          {tier >= 2 ? <Person x={30} y={66} c={P.yellow} s={0.65} /> : null}
        </Svg>
      )
    }
    case 'paprikafest': {
      const guests = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="62" rx="37" ry="9" fill={winter ? P.frost : P.leafPale} {...line} />
          <path d="M30 60L40 40L50 60M40 40v6" stroke={P.outline} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M30 60L40 40L50 60M40 40v6" stroke={P.metal} strokeWidth=".9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Old><Fire x={40} y={62} s={0.6} /></Old>
          <path d="M34 52h12l-1 6h-10z" fill={P.charcoal} {...detail} />
          <path d="M35.6 53.6l.6 3" stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".3" />
          <ellipse cx="40" cy="52" rx="6" ry="1.2" fill={P.tomato} stroke={P.outline} strokeWidth={H * 0.8} />
          {Array.from({ length: guests }, (_, i) => (
            <Person key={i} x={[20, 60, 14, 66, 26][i]!} y={[62, 62, 68, 68, 70][i]!} c={[P.tomato, P.blue, P.leafDark, P.berry, P.yellow][i]!} s={0.7} />
          ))}
          {tier >= 3 ? <StringLights x0={6} x1={74} y={20} lit={winter || autumn || tier >= 4} /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M70 58l4 -10M68.6 54l4 1.4" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
              <path d="M70 58l4 -10M68.6 54l4 1.4" stroke={P.woodMid} strokeWidth="1" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? <PepperString x={8} y={30} n={6} c={P.tomato} /> : null}
        </Svg>
      )
    }
  }
  return null
}
