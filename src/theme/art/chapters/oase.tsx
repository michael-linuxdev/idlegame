/**
 * Kapitel 35 — Dattel-Oase (Tafilalet, Marokko) im kräftigen Stil (2026-11-14,
 * Weinberg-Niveau): Oasenboden, Körbe, Teekanne, Teppiche, Beete,
 * Khettara-Schächte mit Haspel, Ksar-Mauer, Brunnenhof, Webstuhl und Zelt mit
 * Kontur; Palmen, Türme und Granatäpfel behalten ihre Zeichnung. Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Farmer } from './figures'
import type { AreaProps } from './partsB'
import { Fire } from './partsD'
import { DatePalm, MudTower, PomegranateTree, Stars } from './partsG'
import { ssn } from './season'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Oasenboden: Sand außen, Gartenerde innen (Farbe je Jahreszeit). */
function Floor({ season, cy = 60, rx = 36, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const inner = z === 'spring' ? P.leaf : z === 'summer' ? P.wood : z === 'autumn' ? P.soil : P.leafMoss
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={P.woodLight} {...line} />
      <ellipse cx="40" cy={cy + 1} rx={rx * 0.78} ry={ry * 0.7} fill={inner} {...detail} />
      <path d={`M${40 - rx * 0.5} ${cy - ry * 0.25}q${rx * 0.5} ${-ry * 0.3} ${rx} 0`} stroke={P.white} strokeWidth={D} fill="none" opacity=".35" strokeLinecap="round" />
      {z === 'summer' ? [-0.4, 0.1, 0.5].map((d) => <path key={d} d={`M${40 + rx * d} ${cy}l1 -1l1 1`} stroke={P.woodDark} strokeWidth=".8" fill="none" strokeLinecap="round" />) : null}
    </g>
  )
}

/** Datteln im Korb je Jahreszeit (Herbst voll, sonst wenige). */
function dateColor(z: string) {
  return z === 'autumn' ? P.autumnDark : z === 'summer' ? P.yellow : z === 'spring' ? P.woodMid : P.soilDark
}

/** Flacher Palmblattkorb (Fußpunkt Mitte unten). */
function Basket({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g>
      <path d={`M${x - 3.4} ${y - 2.6}h6.8l-1 2.6h-4.8z`} fill={P.woodLight} {...detail} />
      <path d={`M${x - 2.6} ${y - 1.4}h5.2`} stroke={P.woodMid} strokeWidth=".7" />
      {[-1.8, -0.6, 0.6, 1.8].map((d) => (
        <circle key={d} cx={x + d} cy={y - 3} r=".85" fill={fill} stroke={P.outline} strokeWidth={H * 0.6} />
      ))}
    </g>
  )
}

/** Teekanne aus Messing (Fußpunkt Mitte unten). */
function Teapot({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M2.2 -1.6l2 -2" stroke={P.outline} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M2.2 -1.6l2 -2" stroke={P.brass} strokeWidth=".7" strokeLinecap="round" />
      <path d="M-2 0q-.8 -2.4 0 -3.4h4q.8 1 0 3.4z" fill={P.brass} {...detail} />
      <path d="M-1 -3.4l1 -1.6l1 1.6z" fill={P.brass} {...detail} />
      <path d="M-1.2 -.8q-.4 -1.2 0 -2" stroke={P.white} strokeWidth=".5" fill="none" opacity=".55" strokeLinecap="round" />
    </g>
  )
}

/** Teppich mit Rautenmuster (links oben x/y). */
function Rug({ x, y, w, h, c = P.berry }: { x: number; y: number; w: number; h: number; c?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={c} {...detail} />
      <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} fill="none" stroke={P.cream} strokeWidth=".5" />
      <path d={`M${x + w / 2} ${y + 1.6}l${w / 4} ${h / 2 - 1.6}l${-w / 4} ${h / 2 - 1.6}l${-w / 4} ${-h / 2 + 1.6}z`} fill={P.cream} opacity=".9" stroke={P.outline} strokeWidth={H * 0.6} />
      <path d={`M${x + w / 2} ${y + h / 2 - 1}v2`} stroke={P.ink} strokeWidth=".5" />
    </g>
  )
}

export function Oase({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const autumn = z === 'autumn'
  switch (id) {
    case 'dattelpalmen': {
      const n = Math.min(5, tier)
      const xs = [40, 20, 60, 30, 52]
      const ys = [58, 62, 62, 68, 68]
      const ss = [1.5, 1.2, 1.2, 1.05, 1.05]
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Old key={i}><DatePalm x={xs[i]!} y={ys[i]!} s={ss[i]!} season={season} bunches={i === 0 ? 3 : 2} lean={[0, -0.5, 0.5, -0.3, 0.3][i]} /></Old>
          ))}
          {tier >= 5 ? <Farmer x={72} y={70} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'stockwerkgarten': {
      const beds = tier + 1
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <Old><DatePalm x={24} y={56} s={1.4} season={season} /></Old>
          {tier >= 3 ? <Old><DatePalm x={58} y={54} s={1.25} season={season} lean={0.4} /></Old> : null}
          <Old><PomegranateTree x={42} y={60} s={1} season={season} n={3} /></Old>
          {tier >= 2 ? <Old><PomegranateTree x={64} y={64} s={0.8} season={season} n={2} /></Old> : null}
          {Array.from({ length: beds }, (_, i) => {
            const x = 14 + i * 10
            return (
              <g key={i}>
                <path d={`M${x} 69h8`} stroke={P.outline} strokeWidth="2.8" strokeLinecap="round" />
                <path d={`M${x + 1.4} 68.4v-2.2M${x + 4} 68.4v-2.2M${x + 6.6} 68.4v-2.2`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
                <path d={`M${x} 69h8`} stroke={P.soilDark} strokeWidth="1.6" strokeLinecap="round" />
                {[1.4, 4, 6.6].map((d) => (
                  <path key={d} d={`M${x + d} 68.4v-2.2`} stroke={winter ? P.leafDark : z === 'summer' ? P.gold : z === 'autumn' ? P.woodLight : P.leafLight} strokeWidth=".8" strokeLinecap="round" />
                ))}
              </g>
            )
          })}
          {tier >= 5 ? <Farmer x={70} y={72} c={P.blue} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'khettara': {
      const shafts = tier + 1
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="58" rx="37" ry="12" fill={P.woodLight} {...line} />
          <path d="M14 52q26 -7 52 0" stroke={P.white} strokeWidth={D} fill="none" opacity=".35" strokeLinecap="round" />
          <path d="M6 48Q30 52 46 60T76 70" stroke={P.wood} strokeWidth="1" strokeDasharray="1.6 1.2" fill="none" />
          {Array.from({ length: shafts }, (_, i) => {
            const t = i / Math.max(1, 5)
            const x = 8 + t * 52
            const y = 48 + t * 14
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx="5.4" ry="2.6" fill={P.wood} {...detail} />
                <ellipse cx={x} cy={y - 0.8} rx="3.4" ry="1.4" fill={P.woodMid} />
                <ellipse cx={x} cy={y - 0.8} rx="1.8" ry=".8" fill={P.soilDark} stroke={P.outline} strokeWidth={H * 0.7} />
              </g>
            )
          })}
          <path d="M62 66Q68 70 76 69" stroke={P.outline} strokeWidth="3.6" fill="none" strokeLinecap="round" />
          <path d="M62 66Q68 70 76 69" stroke={P.water} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M64 67Q69 70 74 69.4" stroke={P.waterLight} strokeWidth=".8" fill="none" opacity=".8" strokeLinecap="round" />
          {tier >= 3 ? <Old><DatePalm x={70} y={66} s={0.9} season={season} /></Old> : null}
          {tier >= 4 ? <path d="M22 48l2 -8M28 48l-2 -8M21 41h8M25 41v4" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" /> : null}
          {tier >= 4 ? <path d="M22 48l2 -8M28 48l-2 -8M21 41h8M25 41v4" stroke={P.woodMid} strokeWidth="1" strokeLinecap="round" /> : null}
          {tier >= 4 ? <path d="M25 45v3" stroke={P.woodLight} strokeWidth=".7" strokeLinecap="round" /> : null}
          {tier >= 5 ? <Farmer x={38} y={58} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'ksar':
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <rect x="14" y="48" width="52" height="16" fill={P.terracottaLight} {...line} />
          <rect x="14" y="49" width="52" height="1.6" fill={P.outline} opacity=".15" />
          <path d="M16 52v9" stroke={P.white} strokeWidth={D} opacity=".3" strokeLinecap="round" />
          <path d="M14 48h52" stroke={P.terracotta} strokeWidth="1.2" strokeDasharray="2 1.4" />
          <path d="M36 64v-7a4 4 0 0 1 8 0v7z" fill={P.woodDark} {...detail} />
          {tier >= 2 ? <Old><MudTower x={16} y={64} w={10} h={26} lit={winter} /></Old> : null}
          {tier >= 3 ? <Old><MudTower x={64} y={64} w={10} h={26} lit={winter} /></Old> : null}
          {tier >= 4 ? <Old><MudTower x={40} y={50} w={9} h={14} lit={winter} /></Old> : null}
          {tier >= 4 ? <path d="M22 54h6M52 54h6" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" /> : null}
          {tier >= 4 ? <path d="M22 54h6M52 54h6" stroke={P.soilDark} strokeWidth="1.4" strokeLinecap="round" /> : null}
          {tier >= 5 ? <Old><DatePalm x={72} y={70} s={0.9} season={season} /></Old> : null}
          {tier >= 5 ? <Farmer x={30} y={70} c={P.white} s={0.6} hat={P.white} /> : null}
        </Svg>
      )
    case 'granataepfel': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Old key={i}><PomegranateTree x={[40, 20, 60, 30, 52][i]!} y={[58, 63, 63, 70, 70][i]!} s={[1.7, 1.4, 1.4, 1.2, 1.2][i]!} season={season} n={4 + (i % 2)} /></Old>
          ))}
          {tier >= 5 ? <Farmer x={70} y={72} c={P.leafDark} s={0.6} hat={P.woodLight} skirt={P.berry} /> : null}
        </Svg>
      )
    }
    case 'minzbeet': {
      const tufts = 4 + tier * 2
      const mint = winter ? P.leafMoss : z === 'summer' ? P.leafDark : P.leaf
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <rect x="12" y="54" width="44" height="14" rx="2" fill={P.soil} {...line} />
          <rect x="13" y="55" width="42" height="12" rx="1.6" fill="none" stroke={P.terracotta} strokeWidth="1" />
          {Array.from({ length: tufts }, (_, i) => {
            const x = 15 + (i % 7) * 6 + (Math.floor(i / 7) % 2) * 3
            const y = 58 + Math.floor(i / 7) * 5
            return (
              <g key={i}>
                <ellipse cx={x - 1} cy={y} rx="1.6" ry="1.1" fill={mint} stroke={P.outline} strokeWidth={H * 0.7} />
                <ellipse cx={x + 1} cy={y - 0.6} rx="1.6" ry="1.1" fill={P.leafLight} stroke={P.outline} strokeWidth={H * 0.7} />
                {z === 'summer' && i % 3 === 0 ? <path d={`M${x} ${y - 1}v-2.4`} stroke={P.lilac} strokeWidth=".8" strokeLinecap="round" /> : null}
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <ellipse cx="66" cy="66" rx="7" ry="2" fill={P.brass} {...detail} />
              <path d="M61 65.4q5 -1.2 10 0" stroke={P.white} strokeWidth=".5" fill="none" opacity=".45" strokeLinecap="round" />
              <Teapot x={64} y={65} s={1.1} />
              {[68, 70.4].map((x) => (
                <path key={x} d={`M${x} 65h1.4l-.2 -1.8h-1z`} fill={P.glass} stroke={P.outline} strokeWidth={H * 0.7} />
              ))}
            </g>
          ) : null}
          {tier >= 4 ? <path className="smoke" d="M64 58c-1 -2 1 -3 0 -5" stroke={P.white} strokeWidth="1" fill="none" strokeLinecap="round" /> : null}
          {tier >= 5 ? <Farmer x={22} y={74} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'brunnenhof':
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="60" rx="36" ry="11" fill={P.cream} {...line} />
          <ellipse cx="40" cy="60.4" rx="33.4" ry="9.4" fill="none" stroke={P.terracottaLight} strokeWidth=".8" />
          {Array.from({ length: 4 + tier * 2 }, (_, i) => (
            <path key={i} d={`M${12 + (i % 7) * 9} ${54 + Math.floor(i / 7) * 10}l2 1.2l-2 1.2l-2 -1.2z`} fill={i % 2 ? P.blue : P.leafDark} stroke={P.outline} strokeWidth={H * 0.6} />
          ))}
          <ellipse cx="40" cy="60" rx="11" ry="4.4" fill={P.leafDark} {...line} />
          <ellipse cx="40" cy="60" rx="10.2" ry="3.9" fill="none" stroke={P.white} strokeWidth=".7" />
          <ellipse cx="40" cy="59.6" rx="9" ry="3.4" fill={P.water} stroke={P.outline} strokeWidth={H} />
          <path d="M33 59.4q3 -1.6 6 -1.6" stroke={P.waterLight} strokeWidth=".7" fill="none" opacity=".6" strokeLinecap="round" />
          <path d="M40 59V52" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M40 59V52" stroke={P.stoneLight} strokeWidth="1.2" strokeLinecap="round" />
          <ellipse cx="40" cy="52" rx="3" ry="1" fill={P.stoneLight} {...detail} />
          {tier >= 2 ? <path d="M40 51.4c-1 -3 -3 -3 -4 0M40 51.4c1 -3 3 -3 4 0" stroke={P.waterLight} strokeWidth=".8" fill="none" strokeLinecap="round" /> : null}
          {tier >= 3 ? <Old><DatePalm x={14} y={60} s={1} season={season} /></Old> : null}
          {tier >= 4 ? (
            <g>
              <rect x="56" y="62" width="14" height="4" rx="1.6" fill={P.berry} {...detail} />
              <rect x="57" y="59" width="12" height="3.4" rx="1.4" fill={P.orange} {...detail} />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={60} y={60} c={P.white} s={0.6} hat={P.white} /> : null}
          {tier >= 5 ? <Teapot x={30} y={70} s={1} /> : null}
        </Svg>
      )
    case 'teppichstube': {
      const rugs = Math.min(3, tier - 1)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <path d="M14 66V36M38 66V36M12 37h28M12 62h28" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M14 66V36M38 66V36M12 37h28M12 62h28" stroke={P.woodMid} strokeWidth="1.3" strokeLinecap="round" />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${16 + i * 2.6} 37V62`} stroke={P.cream} strokeWidth=".45" />
          ))}
          <rect x="15.6" y={62 - tier * 4} width="21" height={tier * 4} fill={P.berry} stroke={P.outline} strokeWidth={H} />
          {Array.from({ length: tier }, (_, i) => (
            <path key={i} d={`M17 ${60 - i * 4}l3 -2l3 2l3 -2l3 2l3 -2l3 2`} stroke={i % 2 ? P.cream : P.amber} strokeWidth=".7" fill="none" />
          ))}
          {rugs > 0 ? (
            <g>
              <path d="M44 40h32" stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
              <path d="M44 40h32" stroke={P.woodMid} strokeWidth=".9" strokeLinecap="round" />
            </g>
          ) : null}
          {Array.from({ length: Math.max(0, rugs) }, (_, i) => (
            <Rug key={i} x={45 + i * 10.4} y={40} w={9} h={16} c={[P.berry, P.orange, P.blue][i]} />
          ))}
          {tier >= 4 ? [48, 54, 60].map((x, i) => <ellipse key={x} cx={x} cy={66} rx="2.4" ry="1.6" fill={[P.amber, P.berry, P.cream][i]} {...detail} />) : null}
          {tier >= 5 ? <Farmer x={70} y={70} c={P.lilac} s={0.6} hat={P.white} skirt={P.berry} /> : null}
        </Svg>
      )
    }
    case 'dattelernte': {
      const baskets = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <Old><DatePalm x={22} y={60} s={1.6} season={season} bunches={4} /></Old>
          {tier >= 2 ? <Old><DatePalm x={58} y={58} s={1.4} season={season} bunches={3} lean={0.4} /></Old> : null}
          {tier >= 3 ? <path d="M24 20Q30 40 34 64" stroke={P.outline} strokeWidth="1.6" fill="none" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d="M24 20Q30 40 34 64" stroke={P.woodLight} strokeWidth=".8" fill="none" strokeLinecap="round" /> : null}
          {tier >= 3 ? <Farmer x={22} y={34} c={P.white} s={0.55} hat={P.woodLight} /> : null}
          {Array.from({ length: baskets }, (_, i) => (
            <Basket key={i} x={34 + i * 8} y={66} fill={autumn ? dateColor(z) : i % 2 ? dateColor(z) : P.woodMid} />
          ))}
          {tier >= 5 ? <Farmer x={70} y={72} c={P.blue} s={0.6} hat={P.white} /> : null}
        </Svg>
      )
    }
    case 'sternenabend':
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <path d="M14 58L22 42H58L66 58z" fill={P.soilDark} {...line} />
          <path d="M22 42H58L59 44.4H21z" fill={P.outline} opacity=".18" />
          <path d="M22 42L40 38L58 42" stroke={P.outline} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 42L40 38L58 42" stroke={P.compost} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 41.2L40 37.8" stroke={P.white} strokeWidth=".5" fill="none" opacity=".3" strokeLinecap="round" />
          <Rug x={22} y={58} w={36} h={8} c={P.berry} />
          <Old><Stars n={3 + tier * 2} y0={4} y1={30} /></Old>
          {tier >= 2 ? <Old><Fire x={70} y={64} s={0.5} /></Old> : null}
          {tier >= 3 ? <Farmer x={28} y={62} c={P.white} s={0.6} hat={P.white} /> : null}
          {tier >= 3 ? <ellipse cx="32" cy="60" rx="2" ry="2" fill={P.woodLight} {...detail} /> : null}
          {tier >= 4 ? <Farmer x={50} y={62} c={P.blue} s={0.6} hat={P.white} /> : null}
          {tier >= 4 ? <Teapot x={40} y={63} s={1} /> : null}
          {tier >= 5 ? [26, 54].map((x) => <circle key={x} cx={x} cy={46} r="1.4" fill={P.lamp} stroke={P.outline} strokeWidth={H * 0.8} />) : null}
        </Svg>
      )
  }
  return null
}
