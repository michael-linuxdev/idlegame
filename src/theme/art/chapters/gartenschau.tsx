/**
 * Kapitel 12 — Gartenschau im kräftigen Stil (2026-11-14, Weinberg-Niveau):
 * Tore, Hecken, Brunnen, Turm, Zelt, Bühne und Pavillon mit Kontur, Bausteine
 * aus art/parts/bold.tsx; jede Stufe bringt Neues. Wachstum übernimmt `Svg`.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Bunting, Butterfly } from './partsA'
import { Pennant, Pot, Shadow } from '../parts'
import { GableRoof, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { type AreaProps } from './partsB'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Person({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1 -1v3M1 -1v3" stroke={P.outline} strokeWidth="1" strokeLinecap="round" />
      <path d="M-2.2 -5.4h4.4l.7 4.6h-5.8z" fill={c} {...detail} />
      <circle cx="0" cy="-7.4" r="1.8" fill={P.skin} {...detail} />
    </g>
  )
}

/** Hecke als dicker Strich mit dunklem Rand. */
function Hedge({ d, winter, w = 3.6 }: { d: string; winter?: boolean; w?: number }) {
  return (
    <g>
      <path d={d} stroke={P.outline} strokeWidth={w + 2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={winter ? P.winterLeafLight : P.leaf} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

/** Rasen mit Kontur. */
function Lawn({ winter, c = P.leafLight }: { winter?: boolean; c?: string }) {
  return (
    <g>
      <ellipse cx="40" cy="58" rx="36" ry="11" fill={winter ? P.white : c} {...line} />
      <path d="M14 53q14-5 30-4" stroke={P.white} strokeWidth={D} fill="none" opacity=".3" strokeLinecap="round" />
    </g>
  )
}

/** Fahne an einer Stange. */
function Flag({ x, y, h, c }: { x: number; y: number; h: number; c: string }) {
  return (
    <g>
      <path d={`M${x} ${y}V${y - h}`} stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
      <path d={`M${x} ${y}V${y - h}`} stroke={P.stoneLight} strokeWidth="1" strokeLinecap="round" />
      <path d={`M${x + 0.6} ${y - h}l7 2.6-7 2.6z`} fill={c} {...detail} />
    </g>
  )
}

export function Gartenschau({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const summer = season === 'summer'
  const autumn = season === 'autumn'
  const bloom = !winter
  switch (id) {
    case 'eingangstor':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          {/* Pfeiler und Bogen */}
          <rect x="11" y="32" width="7" height="32" rx="1" fill={P.stoneLight} {...line} />
          <rect x="62" y="32" width="7" height="32" rx="1" fill={P.stoneLight} {...line} />
          <path d="M14.5 34 Q40 14 65.5 34" stroke={P.outline} strokeWidth="6.4" fill="none" strokeLinecap="round" />
          <path d="M14.5 34 Q40 14 65.5 34" stroke={winter ? P.winterLeaf : P.leafDark} strokeWidth="4.4" fill="none" strokeLinecap="round" />
          {bloom
            ? Array.from({ length: 9 }, (_, i) => {
                const t = i / 8
                return <circle key={i} cx={14.5 + 51 * t} cy={34 - Math.sin(t * Math.PI) * 11} r="2.1" fill={[P.red, P.yellow, P.cream][i % 3]} stroke={P.outline} strokeWidth={H} />
              })
            : null}
          <rect x="28" y="22" width="24" height="7.4" rx="1.4" fill={P.cream} {...line} />
          <path d="M32 25.7h16" stroke={P.leafDark} strokeWidth="1.4" />
          {tier >= 2 ? (
            <g>
              <path d="M20 64V47h40v17" stroke={P.outline} strokeWidth="2.6" fill="none" />
              <path d="M20 64V47h40v17" stroke={P.woodLight} strokeWidth="1.2" fill="none" />
            </g>
          ) : null}
          {tier >= 3 ? <Flag x={6} y={64} h={42} c={P.tomato} /> : null}
          {tier >= 3 ? <Flag x={74} y={64} h={42} c={P.blue} /> : null}
          {tier >= 4 ? <Person x={36} y={66} c={P.blue} /> : null}
          {tier >= 4 ? <Person x={44} y={67} c={P.red} s={0.8} /> : null}
          {tier >= 5 ? <Bunting y={12} n={8} x0={8} x1={72} /> : null}
          {winter ? <path d="M16 33 Q40 15 64 33" stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'blumenkorso': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          {/* Wagen mit Deichsel */}
          <path d="M10 57h52l6 -10h-6l-4 4h-44z" fill={P.woodMid} {...line} />
          <path d="M12 56 Q20 30 40 34 Q58 30 62 56z" fill={winter ? P.winterLeafLight : P.leaf} {...line} />
          {bloom
            ? Array.from({ length: rows * 7 }, (_, i) => {
                const r = Math.floor(i / 7)
                const k = i % 7
                return <circle key={i} cx={18 + k * 6.4} cy={52 - r * 3.6 - Math.sin((k / 6) * Math.PI) * 3} r="2" fill={[P.red, P.orange, P.yellow, P.lilac, P.cream][(i + r) % 5]} stroke={P.outline} strokeWidth={H * 0.6} />
              })
            : null}
          {[18, 54].map((x) => (
            <g key={x}>
              <circle cx={x} cy="61" r="4.4" fill={P.charcoal} {...line} />
              <circle cx={x} cy="61" r="1.6" fill={P.stoneLight} />
            </g>
          ))}
          {tier >= 4 ? <Person x={72} y={66} c={P.yellow} /> : null}
          {tier >= 5 ? <Pennant x={40} y={34} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'rosenbogen': {
      const arches = Math.min(4, 1 + Math.floor(tier / 1.5))
      return (
        <Svg tier={tier} bold>
          <Lawn winter={winter} />
          {Array.from({ length: arches }, (_, i) => {
            const s = 1 - i * 0.16
            const y = 64 - i * 6
            const w = 30 * s
            const d = `M${40 - w / 2} ${y}V${y - 22 * s} Q40 ${y - 34 * s} ${40 + w / 2} ${y - 22 * s} V${y}`
            return (
              <g key={i}>
                <path d={d} stroke={P.outline} strokeWidth={3.4 * s} fill="none" />
                <path d={d} stroke={P.woodLight} strokeWidth={1.6 * s} fill="none" />
                {summer || spring
                  ? Array.from({ length: 9 }, (_, k) => {
                      const t = k / 8
                      const ang = Math.PI * (1 - t)
                      return <circle key={k} cx={40 + Math.cos(ang) * (w / 2)} cy={y - 22 * s - Math.sin(ang) * 11 * s} r={2 * s} fill={k % 2 ? P.leaf : summer ? [P.red, P.pink, P.cream][i % 3] : P.leaf} stroke={P.outline} strokeWidth={H * 0.6} />
                    })
                  : null}
              </g>
            )
          }).reverse()}
          {tier >= 4 ? [66, 70, 74].map((x) => <circle key={x} cx={x} cy={60} r="1.8" fill={P.red} stroke={P.outline} strokeWidth={H} />) : null}
          {tier >= 5 ? (
            <g>
              <path d="M6 62h14" stroke={P.outline} strokeWidth="3.6" strokeLinecap="round" />
              <path d="M6 62h14" stroke={P.woodLight} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M8 63v3M18 63v3" stroke={P.outline} strokeWidth={D} />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'labyrinth': {
      const rings = Math.min(4, 1 + Math.floor(tier / 1.4))
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="56" rx="36" ry="13" fill={winter ? P.white : P.paper} {...line} />
          {Array.from({ length: rings }, (_, r) => {
            const rx = 32 - r * 7
            const ry = 11 - r * 2.4
            return <Hedge key={r} winter={winter} d={`M${40 + 3} ${56 - ry} A${rx} ${ry} 0 1 1 ${40 - 3} ${56 - ry}`} />
          })}
          {tier >= 3 ? <circle cx="40" cy="55" r="2.2" fill={P.gold} {...detail} /> : null}
          {tier >= 4 ? <Person x={18} y={68} c={P.blue} s={0.8} /> : null}
          {tier >= 5 ? <Pennant x={40} y={55} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'wasserspiele': {
      const jets = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="58" rx="32" ry="10" fill={P.stoneLight} {...line} />
          <ellipse cx="40" cy="57" rx="28.6" ry="8.2" fill={winter ? P.glass : P.water} {...detail} />
          <path d="M22 54q14-4 28-2" stroke={P.white} strokeWidth={D} fill="none" opacity=".45" strokeLinecap="round" />
          <rect x="37" y="44" width="6" height="12" fill={P.stoneLight} {...detail} />
          <ellipse cx="40" cy="44" rx="7.4" ry="2.6" fill={P.stoneLight} {...detail} />
          {!winter ? (
            <g>
              <path d="M40 43 V22 M40 24 Q34 30 34 42 M40 24 Q46 30 46 42" stroke={P.waterLight} strokeWidth="1.8" fill="none" className="fest-glow" strokeLinecap="round" />
              {Array.from({ length: jets }, (_, i) => {
                const x = [20, 60, 28, 52, 40][i]!
                const y = [58, 58, 62, 62, 64][i]!
                return <path key={i} d={`M${x} ${y} Q${x + 2} ${y - 14} ${x + 4} ${y - 2}`} stroke={P.waterLight} strokeWidth="1.5" fill="none" strokeLinecap="round" />
              })}
            </g>
          ) : null}
          {tier >= 5 && summer ? <path d="M12 30 Q40 0 68 30" stroke={P.red} strokeWidth="1.2" fill="none" opacity=".55" /> : null}
          {tier >= 5 && summer ? <path d="M14 30 Q40 3 66 30" stroke={P.yellow} strokeWidth="1.2" fill="none" opacity=".55" /> : null}
        </Svg>
      )
    }
    case 'aussichtsturm': {
      const h = 22 + tier * 6
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={26} />
          {Array.from({ length: Math.floor(h / 8) }, (_, i) => {
            const y = 64 - (i + 1) * 8
            const t = (64 - y) / h
            return <path key={i} d={`M${30 + 6 * t} ${y} L${50 - 6 * t} ${y + 8}M${50 - 6 * t} ${y} L${30 + 6 * t} ${y + 8}`} stroke={P.woodDark} strokeWidth="1" />
          })}
          <path d={`M30 64 L36 ${64 - h} M44 ${64 - h} L50 64`} stroke={P.outline} strokeWidth="3.6" fill="none" strokeLinecap="round" />
          <path d={`M30 64 L36 ${64 - h} M44 ${64 - h} L50 64`} stroke={P.woodMid} strokeWidth="2" fill="none" strokeLinecap="round" />
          <Wall x={33} y={64 - h - 5} w={14} h={5} fill={P.paper} k={K} />
          <GableRoof x={33} y={64 - h - 4.6} w={14} h={6} fill={P.barn} over={2} k={K} />
          {tier >= 3 ? <Flag x={40} y={64 - h - 10} h={7} c={P.blue} /> : null}
          {tier >= 4 ? <Person x={38} y={64 - h - 0.4} c={P.red} s={0.5} /> : null}
          {tier >= 2 ? (
            <g>
              <path d="M54 63h14" stroke={P.outline} strokeWidth="3.6" strokeLinecap="round" />
              <path d="M54 63h14" stroke={P.woodLight} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M56 64v3M66 64v3" stroke={P.outline} strokeWidth={D} />
            </g>
          ) : null}
          {winter ? <path d={`M31.5 ${64 - h - 4.6} L40 ${64 - h - 10.6} L48.5 ${64 - h - 4.6}`} stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'festzelt': {
      const w = 40 + tier * 4
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <rect x={40 - w / 2} y="44" width={w} height="20" fill={P.cream} {...line} />
          {Array.from({ length: Math.floor(w / 6) }, (_, i) => (
            <path key={i} d={`M${40 - w / 2 + 3 + i * 6} 44.6v18.8`} stroke={P.tomato} strokeWidth="1.8" opacity=".55" />
          ))}
          <path d={`M${40 - w / 2 - 3} 44 L40 26 L${40 + w / 2 + 3} 44z`} fill={P.cream} {...line} />
          <path d={`M${40 - w / 4} 44 L40 26 M${40 + w / 4} 44 L40 26`} stroke={P.tomato} strokeWidth="1.6" />
          <Flag x={40} y={26} h={7} c={P.tomato} />
          <path d="M34 64V52 a6 6 0 0 1 12 0 V64" fill={P.lamp} className="art-window" {...detail} />
          {tier >= 3 ? Array.from({ length: 6 }, (_, i) => <circle key={i} className="fest-glow" cx={40 - w / 2 + 4 + i * ((w - 8) / 5)} cy="46.4" r="1.4" fill={P.amber} stroke={P.outline} strokeWidth={H} />) : null}
          {tier >= 4 ? <Person x={26} y={67} c={P.blue} s={0.8} /> : null}
          {tier >= 5 ? <Person x={56} y={67} c={P.leaf} s={0.8} /> : null}
          {winter ? <path d={`M${40 - w / 2} 43 L40 27 L${40 + w / 2} 43`} stroke={P.white} strokeWidth="1.8" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'seebuehne':
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="57.4" rx="35" ry="13" fill={P.leafLight} {...line} />
          <ellipse cx="40" cy="56" rx="32" ry="11" fill={winter ? P.glass : P.water} {...detail} />
          {[20, 40, 60].map((x) => (
            <Post key={x} x={x} y={59} h={6} w={2} k={K} />
          ))}
          <rect x="17" y="50" width="46" height="4.4" rx="1" fill={P.woodMid} {...line} />
          {/* Muschel */}
          <path d="M20 50 Q40 18 60 50z" fill={P.denim} {...line} />
          <path d="M26 50 Q40 30 54 50z" fill={P.charcoal} {...detail} />
          <path d="M24 46q16-24 32 0" stroke={P.white} strokeWidth={H} fill="none" opacity=".4" />
          {tier >= 2 ? <Person x={34} y={50} c={P.red} s={0.8} /> : null}
          {tier >= 3 ? <Person x={46} y={50} c={P.yellow} s={0.8} /> : null}
          {tier >= 4 ? Array.from({ length: 5 }, (_, i) => <circle key={i} className="fest-glow" cx={24 + i * 8} cy={47 - Math.sin((i / 4) * Math.PI) * 10} r="1.3" fill={P.lamp} stroke={P.outline} strokeWidth={H} />) : null}
          {tier >= 5 && !winter ? <path d="M8 67q4 -2 8 0M64 67q4 -2 8 0" stroke={P.white} strokeWidth="1" fill="none" /> : null}
        </Svg>
      )
    case 'ehrenpavillon':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={32} />
          <ellipse cx="40" cy="62" rx="22" ry="4" fill={P.paper} {...line} />
          {[24, 34, 46, 56].map((x) => (
            <rect key={x} x={x - 1.6} y="40" width="3.2" height="22" fill={P.cream} {...detail} />
          ))}
          <rect x="20" y="37" width="40" height="4" rx=".6" fill={P.cream} {...line} />
          <path d="M20 37 Q40 12 60 37z" fill={tier >= 3 ? P.gold : P.winterLeafLight} {...line} />
          <path d="M28 33 Q32 27.4 37 25.6" stroke={P.white} strokeWidth={D} fill="none" opacity=".6" strokeLinecap="round" />
          {tier >= 2 ? <circle cx="40" cy="19" r="2" fill={P.gold} {...detail} /> : null}
          {tier >= 4 ? (
            <g>
              <rect x="36" y="52" width="8" height="10" fill={P.stoneLight} {...detail} />
              <path d="M37 52 l3 -6 3 6z" fill={P.gold} {...detail} />
            </g>
          ) : null}
          {tier >= 5 ? Array.from({ length: 6 }, (_, i) => <circle key={i} cx={20 + i * 8} cy={67} r="1.6" fill={bloom ? [P.red, P.yellow, P.cream][i % 3] : P.frost} stroke={P.outline} strokeWidth={H} />) : null}
          {tier >= 3 ? <Pot x={10} y={66} s={0.5} /> : null}
          {winter ? <path d="M22 35 Q40 13 58 35" stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'gedenkgarten':
      return (
        <Svg tier={tier} bold>
          <Lawn winter={winter} />
          {bloom
            ? Array.from({ length: 6 + tier * 4 }, (_, i) => (
                <g key={i}>
                  <path d={`M${8 + ((i * 17) % 64)} ${57 + ((i * 11) % 9)}v-3`} stroke={P.leafDark} strokeWidth=".7" />
                  <circle cx={8 + ((i * 17) % 64)} cy={54 + ((i * 11) % 9)} r="1.4" fill={spring || summer ? P.denim : P.winterLeafLight} stroke={P.outline} strokeWidth={H * 0.5} />
                </g>
              ))
            : null}
          {/* Gedenkstein */}
          <path d="M35 60v-6a5 5 0 0 1 10 0v6z" fill={P.stoneLight} {...line} />
          <path d="M38 55h4" stroke={P.outline} strokeWidth={H} opacity=".6" />
          {tier >= 2 ? (
            <g>
              <path d="M48 52h20" stroke={P.outline} strokeWidth="3.6" strokeLinecap="round" />
              <path d="M48 52h20" stroke={P.woodDark} strokeWidth="2" strokeLinecap="round" />
              <path d="M48 47h20" stroke={P.outline} strokeWidth="2.8" strokeLinecap="round" />
              <path d="M48 47h20" stroke={P.woodDark} strokeWidth="1.4" strokeLinecap="round" />
              <path d="M50 52v5M66 52v5M50 47v5M66 47v5" stroke={P.outline} strokeWidth={D} />
            </g>
          ) : null}
          {tier >= 3 ? (
            <g>
              <path d="M16 62 V45" stroke={P.leafDark} strokeWidth="1.2" />
              <circle cx="16" cy="43" r="2.6" fill={bloom ? P.red : P.woodDark} {...detail} />
              <path d="M16 51 q-3-1-4-3 M16 55 q3-1 4-3" stroke={P.leafDark} strokeWidth="1" fill="none" />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <path d="M28 64 Q24 42 30 30" stroke={P.outline} strokeWidth="3.6" fill="none" strokeLinecap="round" />
              <path d="M28 64 Q24 42 30 30" stroke={P.bark} strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="30" cy="28" r="7" fill={winter ? P.frost : autumn ? P.honey : P.leaf} {...line} />
              <circle cx="24" cy="32" r="5" fill={winter ? P.frost : autumn ? P.autumn : P.leafLight} {...line} />
            </g>
          ) : null}
          {tier >= 5 ? <Butterfly x={58} y={36} c={P.cream} /> : null}
          {tier >= 5 ? <path d="M38 38c0-3 4-3 4 0l-2 3z" fill={P.pink} className="fest-glow" {...detail} /> : null}
        </Svg>
      )
  }
  return null
}
