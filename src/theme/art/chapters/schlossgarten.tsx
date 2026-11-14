/**
 * Kapitel 15 — Schlossgarten im kräftigen Stil (2026-11-14, Weinberg-Niveau):
 * Buchs, Kastenlinden, Orangerie, Kaskade und Tempel mit Kontur, Bausteine aus
 * art/parts/bold.tsx; jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Bunting } from './partsA'
import { CitrusPot, Shadow } from '../parts'
import { ArchDoor, GableRoof, Pane, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { type AreaProps } from './partsB'

const K = 0.85
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

function Person({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1 -1v3M1 -1v3" stroke={P.outline} strokeWidth="1" strokeLinecap="round" />
      <path d="M-2.2 -5.4h4.4l.7 4.6h-5.8z" fill={c} {...detail} />
      <circle cx="0" cy="-7.4" r="1.8" fill={P.skin} {...detail} />
    </g>
  )
}

function BoxBall({ x, y, r = 3.6, winter }: { x: number; y: number; r?: number; winter?: boolean }) {
  return (
    <g>
      <rect x={x - 2.4} y={y - 1.6} width="4.8" height="2.4" rx=".6" fill={P.terracotta} {...detail} />
      <ellipse cx={x} cy={y - 1.6 - r * 0.8} rx={r} ry={r * 0.85} fill={P.leafDark} {...line} />
      <ellipse cx={x - r * 0.3} cy={y - 1.6 - r * 1.1} rx={r * 0.45} ry={r * 0.3} fill={P.leaf} />
      {winter ? <path d={`M${x - r * 0.8} ${y - 1.6 - r * 1.2} Q${x} ${y - 1.6 - r * 1.9} ${x + r * 0.8} ${y - 1.6 - r * 1.2}`} stroke={P.white} strokeWidth="1.3" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Linde in Kastenform. */
function Linden({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const c = season === 'winter' ? null : season === 'autumn' ? P.gold : P.leaf
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1.4" y="-14" width="2.8" height="14" fill={P.bark} {...detail} />
      {c ? (
        <g>
          <rect x="-6.4" y="-27" width="12.8" height="14" rx="4" fill={c} {...line} />
          <rect x="-4.8" y="-25.6" width="5" height="5" rx="2" fill={season === 'autumn' ? P.yellow : P.leafLight} opacity=".7" />
        </g>
      ) : (
        <path d="M0 -14l-4 -8M0 -14l4 -9M0 -16v-9" stroke={P.bark} strokeWidth="1" strokeLinecap="round" />
      )}
    </g>
  )
}

function Swan({ x, y }: { x: number; y: number }) {
  return (
    <g className="ha-swim">
      <path d={`M${x + 2.4} ${y - 0.4} q1.6 -1.6 .4 -4.6`} stroke={P.outline} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d={`M${x + 2.4} ${y - 0.4} q1.6 -1.6 .4 -4.6`} stroke={P.white} strokeWidth="1" fill="none" strokeLinecap="round" />
      <ellipse cx={x} cy={y} rx="3.6" ry="1.7" fill={P.white} {...detail} />
      <path d={`M${x + 2.8} ${y - 5}l1.4 .6-1.4 .4z`} fill={P.orange} />
    </g>
  )
}

/** Ziegelmauer (Fußpunkt links unten). */
function Bricks({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const rows = Math.max(1, Math.round(h / 3.4))
  const rh = h / rows
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={P.terracotta} {...line} />
      <path d={Array.from({ length: rows - 1 }, (_, r) => `M${x + 0.6} ${y - h + (r + 1) * rh}h${w - 1.2}`).join('')} stroke={P.terracottaLight} strokeWidth=".7" />
      <path d={Array.from({ length: rows }, (_, r) => Array.from({ length: Math.floor(w / 5.6) }, (_, k) => `M${x + k * 5.6 + (r % 2) * 2.8 + 2.4} ${y - h + r * rh}v${rh}`).join('')).join('')} stroke={P.terracottaLight} strokeWidth=".7" />
    </g>
  )
}

export function Schlossgarten({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const summer = season === 'summer'
  const autumn = season === 'autumn'
  const bloom = spring || summer
  switch (id) {
    case 'parterre': {
      const curls = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="57" rx="36" ry="11" fill={P.paper} {...line} />
          {Array.from({ length: curls }, (_, i) => {
            const cx = [40, 22, 58, 40][i]!
            const cy = [56, 54, 54, 62][i]!
            const d = `M${cx - 10} ${cy} q5 -6 10 0 q5 6 10 0 M${cx - 6} ${cy} a3 2 0 1 1 3 2 M${cx + 6} ${cy} a3 2 0 1 0 -3 -2`
            return (
              <g key={i}>
                <path d={d} stroke={P.outline} strokeWidth="3.2" fill="none" strokeLinecap="round" />
                <path d={d} stroke={winter ? P.winterLeaf : P.leafDark} strokeWidth="1.8" fill="none" strokeLinecap="round" />
                {bloom && tier >= 3 ? <circle cx={cx} cy={cy} r="1.4" fill={i % 2 ? P.red : P.lilac} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
              </g>
            )
          })}
          {tier >= 2 ? <BoxBall x={8} y={60} winter={winter} /> : null}
          {tier >= 2 ? <BoxBall x={72} y={60} winter={winter} /> : null}
          {tier >= 5 ? (
            <g>
              <rect x="37.6" y="34" width="4.8" height="12" fill={P.stoneLight} {...line} />
              <ellipse cx="40" cy="33" rx="3.6" ry="1.6" fill={P.stoneLight} {...detail} />
              <circle cx="40" cy="30.6" r="1.6" fill={P.gold} {...detail} />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'spargelbeete': {
      const ridges = Math.min(4, 1 + Math.floor(tier / 1.4))
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="58" rx="36" ry="11" fill={winter ? P.white : P.leafLight} {...line} />
          {Array.from({ length: ridges }, (_, r) => {
            const y = 50 + r * 5
            return (
              <g key={r}>
                <path d={`M10 ${y + 2} Q40 ${y - 4} 70 ${y + 2}z`} fill={winter ? P.cream : P.soil} {...detail} />
                {spring
                  ? Array.from({ length: 6 }, (_, k) => {
                      const x = 16 + k * 9 + (r % 2) * 3
                      return (
                        <g key={k}>
                          <path d={`M${x} ${y - 1}v-${2 + tier * 0.5}`} stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
                          <path d={`M${x} ${y - 1}v-${2 + tier * 0.5}`} stroke={P.cream} strokeWidth="1.2" strokeLinecap="round" />
                        </g>
                      )
                    })
                  : summer || autumn
                    ? Array.from({ length: 4 }, (_, k) => {
                        const x = 18 + k * 13 + (r % 2) * 4
                        return <path key={k} d={`M${x} ${y - 1}q-2 -6 0 -12M${x} ${y - 6}l-3 -3M${x} ${y - 8}l3 -3`} stroke={autumn ? P.gold : P.leafDark} strokeWidth="1" fill="none" />
                      })
                    : null}
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <path d="M65 66h11l-1-5h-9z" fill={P.woodLight} {...line} />
              {spring ? [68, 70.4, 72.8].map((x) => <path key={x} d={`M${x} 61v-4`} stroke={P.cream} strokeWidth="1.4" strokeLinecap="round" />) : null}
            </g>
          ) : null}
          {tier >= 4 ? <Person x={8} y={67} c={P.leafDark} /> : null}
          {tier >= 5 ? <path d="M18 66l2-8" stroke={P.metal} strokeWidth="1.4" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'kanalallee': {
      const trees = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <path d="M0 58 Q40 54 80 58 V66 Q40 62 0 66z" fill={winter ? P.glass : P.water} {...line} />
          <path d="M6 60h14M40 59h12" stroke={P.white} strokeWidth=".8" opacity=".6" />
          <rect x="0" y="53" width="80" height="2.4" fill={P.stoneLight} {...detail} />
          {Array.from({ length: trees }, (_, i) => (
            <Linden key={i} x={10 + i * 15} y={53} s={0.9 + (i % 2) * 0.06} season={season} />
          ))}
          {tier >= 3 && !winter ? <Swan x={30} y={62} /> : null}
          {tier >= 5 && !winter ? <Swan x={54} y={63} /> : null}
          {tier >= 4 ? <Person x={46} y={53} c={P.lilac} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'heckentheater': {
      const wings = Math.min(3, Math.ceil(tier / 1.6))
      const hedge = winter ? P.winterLeaf : P.leafDark
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="59" rx="34" ry="8" fill={P.stoneLight} {...line} />
          <path d="M22 28 Q40 18 58 28V48H22z" fill={winter ? P.winterLeafDark : P.leafMoss} {...line} />
          <rect x="22" y="48" width="36" height="6" rx="1" fill={P.leafLight} {...detail} />
          {Array.from({ length: wings }, (_, i) => (
            <g key={i}>
              <rect x={14 - i * 4} y={30 + i * 4} width="8" height={20 - i * 2} rx="1.6" fill={hedge} {...line} />
              <rect x={58 + i * 4} y={30 + i * 4} width="8" height={20 - i * 2} rx="1.6" fill={hedge} {...line} />
            </g>
          ))}
          {tier >= 3 ? <Person x={36} y={50} c={P.red} s={0.9} /> : null}
          {tier >= 3 ? <Person x={44} y={50} c={P.yellow} s={0.9} /> : null}
          {tier >= 4
            ? [24, 32, 40, 48, 56].map((x) => (
                <g key={x}>
                  <path d={`M${x - 3} 64h6`} stroke={P.outline} strokeWidth="3" strokeLinecap="round" />
                  <path d={`M${x - 3} 64h6`} stroke={P.woodMid} strokeWidth="1.4" strokeLinecap="round" />
                </g>
              ))
            : null}
          {tier >= 5 ? <Person x={30} y={68} c={P.blue} s={0.7} /> : null}
          {tier >= 5 ? <Person x={50} y={68} c={P.leaf} s={0.7} /> : null}
          {winter ? <path d="M24 27 Q40 19 56 27" stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'mauergarten': {
      const trees = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Bricks x={4} y={56} w={72} h={34} />
          {Array.from({ length: trees }, (_, i) => {
            const x = 14 + i * 18
            const d = `M${x} 56V30M${x} 36h-7M${x} 36h7M${x} 44h-7M${x} 44h7M${x} 52h-6M${x} 52h6`
            return (
              <g key={i}>
                <path d={d} stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
                <path d={d} stroke={P.bark} strokeWidth="1.1" strokeLinecap="round" />
                {!winter
                  ? [36, 44, 52].map((y) => (
                      <g key={y}>
                        <ellipse cx={x - 5} cy={y - 1} rx="2.4" ry="1.3" fill={P.leaf} stroke={P.outline} strokeWidth={H * 0.6} />
                        <ellipse cx={x + 5} cy={y - 1} rx="2.4" ry="1.3" fill={P.leaf} stroke={P.outline} strokeWidth={H * 0.6} />
                        {autumn || summer ? <ellipse cx={x + 3} cy={y + 1.2} rx="1.1" ry="1.5" fill={P.leafPale} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
                      </g>
                    ))
                  : null}
                {spring ? <circle cx={x - 3} cy={34} r="1.1" fill={P.white} /> : null}
              </g>
            )
          })}
          <rect x="4" y="56" width="72" height="10" rx="1" fill={winter ? P.cream : P.soil} {...line} />
          {tier >= 3 && !winter ? [12, 22, 32, 42, 52, 62].map((x) => <ellipse key={x} cx={x} cy={60} rx="2.6" ry="1.6" fill={P.leafPale} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
          {tier >= 5 ? <Person x={70} y={67} c={P.denim} /> : null}
          {winter ? <path d="M4 22h72" stroke={P.white} strokeWidth="2.2" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'kuebelhalle': {
      const pots = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={38} />
          <Wall x={6} y={28} w={68} h={38} fill={P.cream} k={K} />
          {Array.from({ length: 5 }, (_, i) => (
            <path key={i} d={`M${10 + i * 13} 66V38a5 5 0 0 1 10 0V66z`} fill={P.glass} opacity=".9" {...detail} />
          ))}
          <rect x="4" y="26.6" width="72" height="2.6" rx=".6" fill={P.stoneLight} {...detail} />
          {tier >= 2 ? <path d="M28 27 Q40 15 52 27z" fill={P.cream} {...line} /> : null}
          {tier >= 4 ? <circle cx="40" cy="21" r="1.8" fill={P.gold} {...detail} /> : null}
          <Old>
            {Array.from({ length: pots }, (_, i) => {
              const x = 12 + i * 14
              return winter ? <CitrusPot key={i} x={x + 3} y={62} s={0.4} /> : <CitrusPot key={i} x={x} y={69} s={0.48} fruit={i % 2 ? P.orange : P.yellow} />
            })}
          </Old>
          {tier >= 5 ? <Person x={74} y={69} c={P.leafDark} s={0.8} /> : null}
          {winter ? <path d="M4 26h72" stroke={P.white} strokeWidth="2" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'wasserachse': {
      const steps = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="60" rx="30" ry="7" fill={P.stone} {...line} />
          <ellipse cx="40" cy="59.4" rx="27" ry="5.6" fill={winter ? P.glass : P.water} {...detail} />
          {Array.from({ length: steps }, (_, i) => (
            <g key={i}>
              <rect x={34 - i} y={50 - i * 6} width={12 + i * 2} height="4" rx=".6" fill={P.stoneLight} {...line} />
              {!winter ? <path d={`M${35 - i} ${54 - i * 6}h${10 + i * 2}v2h-${10 + i * 2}z`} fill={P.waterLight} opacity=".85" /> : null}
            </g>
          ))}
          {tier >= 3 && !winter ? <path d="M40 58 V40M40 42 Q36 48 35 56M40 42 Q44 48 45 56" stroke={P.glassEdge} strokeWidth="1.4" fill="none" className="fest-glow" strokeLinecap="round" /> : null}
          {tier >= 4 ? <BoxBall x={10} y={64} winter={winter} /> : null}
          {tier >= 4 ? <BoxBall x={70} y={64} winter={winter} /> : null}
          {tier >= 5 && !winter ? <Swan x={24} y={61} /> : null}
        </Svg>
      )
    }
    case 'bosquet': {
      const trees = Math.min(6, 2 + tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="59" rx="36" ry="10" fill={winter ? P.white : P.leafLight} {...line} />
          {Array.from({ length: trees }, (_, i) => {
            const x = [12, 68, 20, 60, 8, 72][i]!
            const y = [50, 50, 58, 58, 62, 62][i]!
            return <Linden key={i} x={x} y={y} s={0.8} season={season} />
          })}
          {tier >= 2 ? (
            <g>
              <ellipse cx="40" cy="62" rx="12" ry="2.6" fill={P.stoneLight} {...line} />
              {[32, 37, 43, 48].map((x) => (
                <rect key={x} x={x - 1} y="46" width="2" height="16" fill={P.cream} {...detail} />
              ))}
              <path d="M28 46 Q40 28 52 46z" fill={tier >= 3 ? P.leafDark : P.stone} {...line} />
              {tier >= 3 ? <circle cx="40" cy="33" r="1.6" fill={P.gold} {...detail} /> : null}
            </g>
          ) : null}
          {tier >= 4 ? <Person x={40} y={62} c={P.pink} s={0.8} /> : null}
          {winter && tier >= 2 ? <path d="M30 44 Q40 30 50 44" stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'schlossgaertnerei':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <rect x="8" y="40" width="40" height="24" fill={P.glass} opacity=".6" />
          <path d="M6 40 L28 28 L50 40z" fill={P.glassEdge} opacity=".7" />
          {[16, 24, 32, 40].map((x) => <path key={x} d={`M${x} 40v24`} stroke={P.outline} strokeWidth={H} opacity=".6" />)}
          <rect x="8" y="40" width="40" height="24" fill="none" stroke={P.outline} strokeWidth={BOLD.contour * K} />
          <path d="M6 40 L28 28 L50 40z" fill="none" stroke={P.outline} strokeWidth={BOLD.contour * K} strokeLinejoin="round" />
          {Array.from({ length: Math.min(4, tier) }, (_, r) => (
            <g key={r}>
              {Array.from({ length: 6 }, (_, k) => (
                <circle key={k} cx={12 + k * 6} cy={60 - r * 4} r="1.5" fill={winter ? P.leafMoss : P.leafLight} stroke={P.outline} strokeWidth={H * 0.5} />
              ))}
            </g>
          ))}
          {tier >= 2 ? (
            <g>
              <Wall x={52} y={44} w={22} h={20} fill={P.paper} k={K} />
              <GableRoof x={52} y={45} w={22} h={9} fill={P.terracotta} over={2} k={K} />
              <Pane x={55} y={49} w={5} h={5} k={K} />
              <ArchDoor x={65} y={64} w={6} h={9} k={K} />
            </g>
          ) : null}
          {tier >= 4 ? <Person x={66} y={69} c={P.leafDark} s={0.8} /> : null}
          {tier >= 5 ? [54, 58, 62].map((x) => <path key={x} d={`M${x - 1.6} 69h3.2l-.4 -3h-2.4z`} fill={P.terracotta} {...detail} />) : null}
          {winter ? <path d="M8 39L28 29L48 39" stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'sommerkonzert': {
      const crowd = Math.min(6, tier + 1)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="59" rx="36" ry="10" fill={winter ? P.white : P.leafLight} {...line} />
          <path d="M20 46 Q40 18 60 46z" fill={P.cream} {...line} />
          <path d="M26 46 Q40 26 54 46" stroke={P.stoneLight} strokeWidth="1.4" fill="none" />
          <rect x="18" y="46" width="44" height="3" rx=".6" fill={P.wood} {...detail} />
          {tier >= 2 ? [30, 38, 46].map((x, i) => <Person key={x} x={x} y={46} c={P.charcoal} s={0.7 + (i % 2) * 0.05} />) : null}
          {tier >= 3 ? <path d="M52 44l3-6" stroke={P.brass} strokeWidth="1.4" strokeLinecap="round" /> : null}
          {Array.from({ length: crowd }, (_, i) => (
            <g key={i}>
              {i % 2 === 0 ? <rect x={8 + i * 11} y={63} width="9" height="3" rx=".6" fill={[P.red, P.blue, P.yellow][i % 3]} {...detail} /> : null}
              <Person x={12 + i * 11} y={66} c={[P.leaf, P.lilac, P.orange, P.denim, P.pink, P.tomato][i]!} s={0.75} />
            </g>
          ))}
          {tier >= 4 ? <Post x={6} y={66} h={18} w={1.6} k={K} /> : null}
          {tier >= 5 ? <Bunting y={10} n={9} x0={8} x1={72} /> : null}
        </Svg>
      )
    }
  }
  return null
}
