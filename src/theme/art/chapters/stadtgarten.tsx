/**
 * Kapitel 13 — Gemeinschaftsgarten in der Stadt im kräftigen Stil (2026-11-14,
 * Weinberg-Niveau): Ziegelmauer, Kisten, Tonnen und Schuppen mit Kontur,
 * Bausteine aus art/parts/bold.tsx; jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Smoke, Svg } from '../../HandParts'
import { Bunting } from './partsA'
import { Lettuce, Pennant, Shadow } from '../parts'
import { ArchDoor, GableRoof, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { type AreaProps } from './partsB'
import { TomatoPlant } from './partsC'

const K = 0.85
const D = BOLD.detail * K
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

/** Ziegelmauer mit Fugen; Fußpunkt links unten (x, y). */
function Bricks({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const rows = Math.max(1, Math.round(h / 3.4))
  const rh = h / rows
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={P.terracotta} {...line} />
      <path d={Array.from({ length: rows - 1 }, (_, r) => `M${x + 0.6} ${y - h + (r + 1) * rh}h${w - 1.2}`).join('')} stroke={P.terracottaLight} strokeWidth=".7" />
      <path
        d={Array.from({ length: rows }, (_, r) => Array.from({ length: Math.floor(w / 5.6) }, (_, k) => `M${x + k * 5.6 + (r % 2) * 2.8 + 2.4} ${y - h + r * rh}v${rh}`).join('')).join('')}
        stroke={P.terracottaLight}
        strokeWidth=".7"
      />
      <rect x={x + 0.8} y={y - h + 0.8} width={w * 0.22} height={h - 1.6} fill={P.white} opacity=".1" />
    </g>
  )
}

/** Schild auf einem Pflock. */
function Sign({ x, y, c = P.woodLight }: { x: number; y: number; c?: string }) {
  return (
    <g>
      <Post x={x} y={y} h={7} w={1.4} k={K} />
      <rect x={x - 4.4} y={y - 10.4} width="8.8" height="4.8" rx=".8" fill={c} {...detail} />
      <path d={`M${x - 2.6} ${y - 8}h5.2`} stroke={P.outline} strokeWidth={H} />
    </g>
  )
}

function Lights({ x0, x1, y, sag = 5, n = 7, lit = true }: { x0: number; x1: number; y: number; sag?: number; n?: number; lit?: boolean }) {
  return (
    <g>
      <path d={`M${x0} ${y} Q${(x0 + x1) / 2} ${y + sag * 2} ${x1} ${y}`} stroke={P.outline} strokeWidth={H} fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n
        const x = x0 + (x1 - x0) * t
        const yy = y + sag * 2 * 2 * t * (1 - t)
        return <circle key={i} cx={x} cy={yy + 1} r="1.2" fill={lit ? P.lamp : P.stoneLight} stroke={P.outline} strokeWidth={H * 0.6} className={lit ? 'fest-glow' : undefined} />
      })}
    </g>
  )
}

/** Pflanzkiste (Fußpunkt Mitte unten). */
function Crate({ x, y, w, h, winter }: { x: number; y: number; w: number; h: number; winter?: boolean }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx="1" fill={P.wood} {...line} />
      <path d={`M${x - w / 2 + 0.6} ${y - h / 2}h${w - 1.2}`} stroke={P.outline} strokeWidth={H} opacity=".45" />
      <rect x={x - w / 2 + 1} y={y - h + 0.8} width={w * 0.24} height={h - 1.6} fill={P.white} opacity=".18" />
      <rect x={x - w / 2 + 1} y={y - h - 2.4} width={w - 2} height="3" rx="1.2" fill={winter ? P.cream : P.soil} {...detail} />
    </g>
  )
}

function Barrel({ x, c, winter }: { x: number; c: string; winter?: boolean }) {
  return (
    <g>
      <rect x={x} y={50} width="10" height="14" rx="1.6" fill={c} {...line} />
      <rect x={x + 1} y={51} width="2.4" height="12" fill={P.white} opacity=".18" />
      <path d={`M${x + 0.6} 55h8.8M${x + 0.6} 60h8.8`} stroke={P.outline} strokeWidth={H} opacity=".5" />
      <ellipse cx={x + 5} cy={50} rx="5" ry="1.5" fill={winter ? P.white : P.waterDeep} {...detail} />
    </g>
  )
}

export function Stadtgarten({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const ripe = !spring
  switch (id) {
    case 'hochbeete': {
      const n = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          {Array.from({ length: n }, (_, i) => {
            const x = [40, 20, 60][i]!
            const y = [65, 59, 59][i]!
            return (
              <g key={i}>
                <Crate x={x} y={y} w={18} h={10} winter={winter} />
                {!winter ? (
                  <Old>
                    {i === 0 && tier >= 2
                      ? [-5, 0, 5].map((dx) => <TomatoPlant key={dx} x={x + dx} y={y - 12} h={8 + tier} ripe={ripe} fruits={tier >= 3 ? 3 : 1} />)
                      : [-5, 0, 5].map((dx) => <Lettuce key={dx} x={x + dx} y={y - 12} s={0.5} />)}
                  </Old>
                ) : null}
              </g>
            )
          }).reverse()}
          {tier >= 3 ? <Sign x={8} y={66} c={P.label} /> : null}
          {tier >= 4 ? <Person x={72} y={67} c={P.denim} /> : null}
          {tier >= 5 ? <Lights x0={6} x1={74} y={20} lit={winter || autumn} /> : null}
        </Svg>
      )
    }
    case 'palettenbeete':
      return (
        <Svg tier={tier} bold>
          <Bricks x={6} y={60} w={68} h={30} />
          {Array.from({ length: Math.min(3, tier) }, (_, i) => {
            const x = 14 + i * 20
            return (
              <g key={i} transform={`rotate(-6 ${x + 8} 62)`}>
                <Post x={x + 2} y={64} h={32} w={1.8} k={K} />
                <Post x={x + 14} y={64} h={32} w={1.8} k={K} />
                {[0, 1, 2, 3].map((r) => (
                  <g key={r}>
                    {!winter ? [3, 8, 13].map((dx) => <ellipse key={dx} cx={x + dx} cy={33.4 + r * 7} rx="2.2" ry="1.5" fill={r % 2 ? P.leafPale : P.leaf} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
                    <rect x={x} y={34 + r * 7} width="16" height="3.4" rx=".6" fill={P.woodLight} {...detail} />
                  </g>
                ))}
              </g>
            )
          })}
          <rect x="6" y="61" width="68" height="5" rx="1" fill={P.stoneLight} {...line} />
          {tier >= 4 ? (
            <g>
              <path d="M63 61v-9h9v9M63 55h9" stroke={P.outline} strokeWidth="2.4" fill="none" />
              <path d="M63 61v-9h9v9M63 55h9" stroke={P.metal} strokeWidth="1" fill="none" />
            </g>
          ) : null}
          {tier >= 5 ? <Pennant x={74} y={30} s={0.8} /> : null}
          {winter ? <path d="M6 30h68" stroke={P.white} strokeWidth="2.2" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'regenspeicher': {
      const barrels = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Bricks x={0} y={62} w={22} h={44} />
          <path d="M0 18h22l3 3M24 20v26q0 3 4 3h6" stroke={P.outline} strokeWidth="3.4" fill="none" strokeLinejoin="round" />
          <path d="M0 18h22l3 3M24 20v26q0 3 4 3h6" stroke={P.metal} strokeWidth="1.8" fill="none" strokeLinejoin="round" />
          <Shadow grid="chapter" cx={50} rx={28} />
          {Array.from({ length: barrels }, (_, i) => (
            <g key={i}>
              <Barrel x={30 + i * 11} c={i % 2 ? P.leafDark : P.denim} winter={winter} />
              {i < barrels - 1 ? <path d={`M${40 + i * 11} 52h1`} stroke={P.metal} strokeWidth="1.2" /> : null}
            </g>
          ))}
          {tier >= 2 ? <path d={`M${30 + barrels * 11} 60h3v2`} stroke={P.brass} strokeWidth="1.4" fill="none" /> : null}
          {tier >= 3 && !winter ? <path className="ha-fish" d={`M${32 + barrels * 11} 63q1 2 0 3`} stroke={P.waterLight} strokeWidth="1" fill="none" /> : null}
          {tier >= 4 ? <path d="M64 64q-2-4 0-6h6q2 2 0 6z" fill={P.leaf} {...detail} /> : null}
          {tier >= 5 ? <Person x={74} y={67} c={P.yellow} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'wurmkiste': {
      const boxes = Math.min(3, Math.ceil(tier / 2))
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={32} />
          {Array.from({ length: boxes }, (_, i) => (
            <g key={i}>
              <rect x={22} y={56 - i * 9} width="34" height="9" rx="1" fill={i % 2 ? P.woodMid : P.wood} {...line} />
              {[0, 1, 2].map((k) => (
                <circle key={k} cx={28 + k * 11} cy={60.4 - i * 9} r=".9" fill={P.soilDark} />
              ))}
            </g>
          ))}
          <rect x={21} y={54 - (boxes - 1) * 9 - 2} width="36" height="3" rx=".8" fill={P.woodDark} {...detail} />
          <ellipse cx="66" cy="63" rx="8" ry="4" fill={P.compost} {...line} />
          {tier >= 2 ? <path d="M62 61q2-2 4 0t4 0" stroke={P.pink} strokeWidth="1.2" fill="none" className="ha-swim" /> : null}
          {tier >= 3 ? <path d="M9 65v-8l4.4-1v9z" fill={P.metal} {...detail} /> : null}
          {tier >= 3 && !winter ? <ellipse cx="11.4" cy="56" rx="3.2" ry="1.5" fill={P.leafPale} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
          {tier >= 4 ? <Sign x={66} y={57} /> : null}
          {tier >= 5 ? <Person x={14} y={69} c={P.red} s={0.8} /> : null}
          {winter ? <path d={`M22 ${53 - (boxes - 1) * 9}h34`} stroke={P.white} strokeWidth="2" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'kraeuterleiter': {
      const rungs = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Bricks x={12} y={64} w={56} h={56} />
          <path d="M28 66 L36 12M52 66 L44 12" stroke={P.outline} strokeWidth="3.4" strokeLinecap="round" />
          <path d="M28 66 L36 12M52 66 L44 12" stroke={P.woodDark} strokeWidth="1.8" strokeLinecap="round" />
          {Array.from({ length: rungs }, (_, i) => {
            const y = 60 - i * 10
            const t = (66 - y) / 54
            const xl = 28 + 8 * t
            const xr = 52 - 8 * t
            return (
              <g key={i}>
                <path d={`M${xl} ${y}H${xr}`} stroke={P.outline} strokeWidth="3" strokeLinecap="round" />
                <path d={`M${xl} ${y}H${xr}`} stroke={P.woodMid} strokeWidth="1.6" strokeLinecap="round" />
                {[0, 1].map((k) => {
                  const x = xl + 3 + k * (xr - xl - 6)
                  return (
                    <g key={k}>
                      {!winter ? <ellipse cx={x} cy={y - 5} rx="2.8" ry="2" fill={[P.leaf, P.leafMoss, P.leafPale][(i + k) % 3]} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
                      <path d={`M${x - 2.4} ${y - 4}h4.8l-.8 4h-3.2z`} fill={P.terracotta} {...detail} />
                      {season === 'summer' && (i + k) % 3 === 0 ? <circle cx={x} cy={y - 6.6} r=".9" fill={P.lilac} /> : null}
                    </g>
                  )
                })}
              </g>
            )
          })}
          {tier >= 4 ? <path d="M58 64q-2-6 2-8 4 2 2 8z" fill={P.leafDark} {...detail} /> : null}
          {tier >= 5 ? <Person x={66} y={67} c={P.leaf} s={0.8} /> : null}
          {winter ? <path d="M12 8h56" stroke={P.white} strokeWidth="2.2" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'saatgutbibliothek': {
      const drawers = Math.min(4, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={24} />
          <Post x={40} y={66} h={10} w={3} k={K} />
          <Wall x={26} y={26} w={28} h={32} fill={P.wood} k={K} />
          <GableRoof x={26} y={27} w={28} h={9} fill={P.leafDark} over={2.5} k={K} />
          {Array.from({ length: drawers }, (_, i) => (
            <g key={i}>
              <rect x="29" y={29 + i * 7} width="22" height="5.6" rx=".6" fill={P.paper} {...detail} />
              <circle cx="40" cy={31.8 + i * 7} r=".9" fill={P.brass} />
              {[32, 36, 44, 48].map((x, k) => <rect key={k} x={x - 1} y={30 + i * 7} width="2" height="3" fill={[P.red, P.yellow, P.leaf, P.lilac][(i + k) % 4]} />)}
            </g>
          ))}
          {tier >= 3 ? <Sign x={62} y={66} c={P.label} /> : null}
          {tier >= 4 ? <Person x={18} y={67} c={P.lilac} /> : null}
          {tier >= 5 ? <Person x={68} y={69} c={P.blue} s={0.7} /> : null}
          {winter ? <path d="M23.5 27L40 18L56.5 27" stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'lastenrad': {
      const load = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="62" rx="36" ry="6" fill={P.stoneLight} {...line} />
          {[20, 60].map((x) => (
            <g key={x}>
              <circle cx={x} cy="58" r="6" fill="none" stroke={P.outline} strokeWidth="2.6" />
              <circle cx={x} cy="58" r="6" fill="none" stroke={P.charcoal} strokeWidth="1.4" />
              <circle cx={x} cy="58" r="1.2" fill={P.metal} />
            </g>
          ))}
          <path d="M20 58h12l8-12h12l8 12M40 46l-4 12M52 46l-2-8h-4" stroke={P.outline} strokeWidth="2.8" fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M20 58h12l8-12h12l8 12M40 46l-4 12M52 46l-2-8h-4" stroke={P.denim} strokeWidth="1.4" fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <rect x="10" y="44" width="22" height="10" rx="1" fill={P.woodLight} {...line} />
          {Array.from({ length: load }, (_, i) => {
            const k = i % 4
            return k === 0 ? (
              <ellipse key={i} cx="16" cy="43" rx="5" ry="2.4" fill={P.soil} {...detail} />
            ) : k === 1 ? (
              <rect key={i} x="21" y="38" width="9" height="6" rx=".6" fill={P.wood} {...detail} />
            ) : k === 2 ? (
              <g key={i}>{!winter ? <Old><TomatoPlant x={25} y={38} h={6} ripe={ripe} fruits={2} /></Old> : <ellipse cx="25" cy="36" rx="3" ry="1.4" fill={P.white} />}</g>
            ) : (
              <circle key={i} cx="13" cy="38" r="2.6" fill={P.orange} {...detail} />
            )
          })}
          {tier >= 3 ? <Person x={46} y={46} c={P.tomato} s={0.9} /> : null}
          {tier >= 5 ? <path d="M10 44l-2-10 8 3z" fill={P.yellow} {...detail} /> : null}
        </Svg>
      )
    }
    case 'lehmofen':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={32} />
          <rect x="18" y="52" width="40" height="12" rx="1" fill={P.stone} {...line} />
          <path d="M24 52v12M34 52v12M44 52v12M18 58h40" stroke={P.outline} strokeWidth={H} opacity=".35" />
          <path d={tier >= 2 ? 'M22 52 Q22 26 38 26 Q54 26 54 52z' : 'M24 52 Q30 42 38 42 Q46 42 52 52z'} fill={P.woodLight} {...line} />
          <path d={tier >= 2 ? 'M27 46 Q28 32 36 30' : 'M28 50 Q32 45 37 44'} stroke={P.white} strokeWidth={D} fill="none" opacity=".4" strokeLinecap="round" />
          {tier >= 2 ? <path d="M32 52v-8a6 6 0 0 1 12 0v8z" fill={tier >= 3 ? P.amber : P.soilDark} className={tier >= 3 ? 'fest-glow' : undefined} {...detail} /> : null}
          {tier >= 3 ? <path d="M46 31v-7h4v9" fill={P.terracotta} {...detail} /> : null}
          {tier >= 3 ? <Smoke x={48} y={22} /> : null}
          {tier >= 4 ? (
            <g>
              <Post x={62} y={66} h={10} w={1.8} k={K} />
              <Post x={72} y={66} h={10} w={1.8} k={K} />
              <rect x="59" y="54" width="16" height="2.4" rx=".6" fill={P.woodDark} {...detail} />
              <circle cx="67" cy="52.4" r="3" fill={P.amber} {...detail} />
              <path d="M65 52.4h4" stroke={P.tomato} strokeWidth=".8" />
            </g>
          ) : null}
          {tier >= 5 ? <Person x={10} y={67} c={P.leafDark} /> : null}
          {winter ? <path d="M26 34 Q38 22 50 34" stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'werkstatt':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <Wall x={10} y={36} w={54} h={30} fill={P.denim} planks={6} k={K} />
          <path d="M8 37h58l-3-6h-52z" fill={P.charcoal} {...line} />
          <rect x="40" y="40" width="20" height="26" fill={P.charcoal} {...line} />
          {tier >= 2 ? (
            <g stroke={P.stoneLight} strokeWidth="1.2" strokeLinecap="round">
              <path d="M44 44v14M50 44v12M56 44v16" />
              <path d="M42 44h4M48 44h4l-2 3" />
            </g>
          ) : null}
          {tier >= 3 ? (
            <g>
              <rect x="14" y="48" width="18" height="2.4" rx=".6" fill={P.woodLight} {...detail} />
              <path d="M16 50.4v8M30 50.4v8" stroke={P.outline} strokeWidth={D} />
              <rect x="18" y="42" width="10" height="5" rx=".8" fill={P.yellow} {...detail} />
              <path d="M20 44.4h6" stroke={P.outline} strokeWidth={H} />
            </g>
          ) : null}
          {tier >= 4 ? <Lights x0={10} x1={64} y={34} sag={2} n={9} lit={winter || autumn || tier >= 5} /> : null}
          {winter && tier >= 2 ? (
            <g>
              <rect x="66" y="58" width="8" height="8" rx="1" fill={P.tomato} {...line} />
              <Smoke x={70} y={56} />
            </g>
          ) : tier >= 5 ? (
            <Person x={71} y={67} c={P.orange} />
          ) : null}
          <ArchDoor x={18} y={66} w={8} h={12} k={K} />
          {winter ? <path d="M8 31h58" stroke={P.white} strokeWidth="2.2" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'hoffest': {
      const guests = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="60" rx="36" ry="8" fill={winter ? P.white : P.stoneLight} {...line} />
          <Post x={6} y={66} h={50} w={2} k={K} />
          <Post x={74} y={66} h={50} w={2} k={K} />
          <Lights x0={6} x1={74} y={18} n={Math.min(11, 4 + tier * 2)} lit={tier >= 2} />
          {tier >= 3 ? <Lights x0={6} x1={74} y={28} sag={3} n={9} lit /> : null}
          <Post x={20} y={63} h={10} w={1.8} k={K} />
          <Post x={60} y={63} h={10} w={1.8} k={K} />
          <rect x="16" y="50" width="48" height="3" rx=".8" fill={P.wood} {...line} />
          {[24, 34, 46, 56].slice(0, Math.min(4, tier)).map((x, i) => (
            <circle key={x} cx={x} cy={48.6} r="1.8" fill={[P.tomato, P.yellow, P.leaf, P.orange][i]} {...detail} />
          ))}
          {Array.from({ length: guests }, (_, i) => (
            <Person key={i} x={18 + i * 11} y={i % 2 ? 67 : 50} c={[P.blue, P.red, P.leaf, P.lilac, P.yellow][i]!} s={i % 2 ? 1 : 0.8} />
          ))}
          {tier >= 5 ? <Bunting y={8} n={9} x0={6} x1={74} /> : null}
        </Svg>
      )
    }
  }
  return null
}
