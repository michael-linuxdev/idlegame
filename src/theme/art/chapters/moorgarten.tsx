/**
 * Kapitel 17 — Moor- und Heidegarten im kräftigen Stil (2026-11-14,
 * Weinberg-Niveau): Moorwasser mit Torfrand, Bohlen, Turm und Hütten mit Kontur,
 * Bausteine aus art/parts/bold.tsx; jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Smoke, Svg } from '../../HandParts'
import { Lantern, Pennant, Shadow } from '../parts'
import { ArchDoor, Pane, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { type AreaProps } from './partsB'
import { Birch } from './partsC'

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

/** Dunkles Moorwasser mit Torfrand und Lichtreflex. */
function Bog({ cx = 40, cy = 58, rx = 32, ry = 9, frozen }: { cx?: number; cy?: number; rx?: number; ry?: number; frozen?: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 1} rx={rx + 3} ry={ry + 2.4} fill={P.soilDark} {...line} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={frozen ? P.glass : P.waterDeep} {...detail} />
      <path d={`M${cx - rx * 0.55} ${cy - ry * 0.35}q${rx * 0.3}-${ry * 0.3} ${rx * 0.6}-${ry * 0.12}`} stroke={P.white} strokeWidth={D} fill="none" opacity=".4" strokeLinecap="round" />
    </g>
  )
}

function Moss({ cx, cy, rx, winter, red }: { cx: number; cy: number; rx: number; winter?: boolean; red?: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.4} fill={winter ? P.frost : red ? P.autumn : P.leafMoss} {...detail} />
      <ellipse cx={cx - rx * 0.3} cy={cy - rx * 0.12} rx={rx * 0.45} ry={rx * 0.18} fill={winter ? P.white : P.leafPale} opacity=".7" />
    </g>
  )
}

/** Heidschnucke. */
function HeathSheep({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <g className="ha-graze">
        <path d="M-3 -1v2.4M2 -1v2.4" stroke={P.ink} strokeWidth="1" strokeLinecap="round" />
        <ellipse cx="0" cy="-4" rx="5.2" ry="3.3" fill={P.stoneLight} {...detail} />
        <ellipse cx="5.2" cy="-5" rx="1.9" ry="1.5" fill={P.ink} {...detail} />
        <path d="M4.6 -6.2q-1.6 -1.4 -.4 -2.4" stroke={P.woodLight} strokeWidth=".9" fill="none" />
      </g>
    </g>
  )
}

function Heather({ x, y, season }: { x: number; y: number; season?: string }) {
  const c = season === 'autumn' || season === 'summer' ? P.lavender : season === 'winter' ? P.winterLeaf : P.leafMoss
  return <ellipse cx={x} cy={y} rx="3.2" ry="1.7" fill={c} stroke={P.outline} strokeWidth={H * 0.7} />
}

/** Heidefläche mit Kontur. */
function Heath({ c, winter }: { c: string; winter?: boolean }) {
  return <ellipse cx="40" cy="58" rx="35" ry="10" fill={winter ? P.frost : c} {...line} />
}

export function Moorgarten({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  switch (id) {
    case 'torfmoos': {
      const pads = Math.min(6, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Bog frozen={winter} />
          {Array.from({ length: pads }, (_, i) => (
            <Moss key={i} cx={[20, 58, 40, 30, 50, 66][i]!} cy={[56, 56, 62, 52, 52, 60][i]!} rx={6 + (i % 2) * 2} winter={winter} red={autumn && i % 2 === 1} />
          ))}
          {tier >= 4 ? <path d="M12 58q2 -8 4 -10M14 58q-1 -6 2 -8" stroke={P.leafDark} strokeWidth="1" fill="none" /> : null}
          {tier >= 5 && !winter ? <path d="M66 46l4 -1M66 46l-3 -2" stroke={P.denim} strokeWidth="1.2" className="ha-swim" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'moosbeeren': {
      const n = Math.min(24, 6 + tier * 4)
      return (
        <Svg tier={tier} bold>
          <Heath c={P.leafMoss} winter={winter} />
          {!winter ? Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${10 + ((i * 13) % 60)} ${52 + ((i * 7) % 12)}q2 -1 4 0`} stroke={P.leafDark} strokeWidth=".8" fill="none" />) : null}
          {autumn || summer
            ? Array.from({ length: n }, (_, i) => <circle key={i} cx={12 + ((i * 17) % 56)} cy={52 + ((i * 11) % 12)} r="1.3" fill={autumn ? P.berry : P.blossom} stroke={P.outline} strokeWidth={H * 0.5} />)
            : spring
              ? Array.from({ length: Math.ceil(n / 2) }, (_, i) => <circle key={i} cx={12 + ((i * 19) % 56)} cy={52 + ((i * 7) % 12)} r="1" fill={P.pink} />)
              : null}
          {winter ? Array.from({ length: tier * 2 }, (_, i) => <ellipse key={i} cx={14 + ((i * 17) % 52)} cy={54 + ((i * 7) % 9)} rx="2.4" ry="1" fill={P.white} />) : null}
          {tier >= 3 ? <path d="M63 66h11l-1 -5h-9z" fill={P.woodLight} {...line} /> : null}
          {tier >= 3 && autumn ? [66.6, 70].map((x) => <circle key={x} cx={x} cy={60.6} r="1.4" fill={P.berry} {...detail} />) : null}
          {tier >= 5 ? <Person x={8} y={67} c={P.leafDark} /> : null}
        </Svg>
      )
    }
    case 'wollgras': {
      const n = Math.min(20, 4 + tier * 3)
      return (
        <Svg tier={tier} bold>
          <Heath c={autumn ? P.woodLight : P.leafLight} winter={winter} />
          {Array.from({ length: n }, (_, i) => {
            const x = 10 + ((i * 23) % 60)
            const y = 64 - ((i * 7) % 12)
            const h = 8 + (i % 3) * 3
            return (
              <g key={i} className={i % 3 ? undefined : 'ma-sway'}>
                <path d={`M${x} ${y}q1 -${h / 2} 0 -${h}`} stroke={autumn ? P.woodDark : P.leafDark} strokeWidth=".9" fill="none" />
                {spring || summer ? <ellipse cx={x} cy={y - h - 1.2} rx="1.7" ry="2.1" fill={P.white} stroke={P.outline} strokeWidth={H * 0.5} /> : null}
              </g>
            )
          })}
          {tier >= 5 ? <Pennant x={72} y={62} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'sonnentau': {
      const plants = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <Moss cx={40} cy={58} rx={30} winter={winter} />
          {Array.from({ length: plants }, (_, i) => {
            const x = 18 + i * 11
            const y = 58 + (i % 2) * 2
            return (
              <g key={i}>
                {Array.from({ length: 6 }, (_, k) => {
                  const a = (k / 6) * Math.PI * 2
                  const ex = x + Math.cos(a) * 3.8
                  const ey = y + Math.sin(a) * 1.7 - 1
                  return (
                    <g key={k}>
                      <path d={`M${x} ${y - 1}L${ex} ${ey}`} stroke={winter ? P.stone : P.berry} strokeWidth="1" strokeLinecap="round" />
                      {!winter ? <circle cx={ex} cy={ey} r=".8" fill={P.glassEdge} stroke={P.berry} strokeWidth=".3" /> : null}
                    </g>
                  )
                })}
                {summer && tier >= 3 ? (
                  <g>
                    <path d={`M${x} ${y - 1}V${y - 10}`} stroke={P.leafDark} strokeWidth=".8" />
                    <circle cx={x} cy={y - 10.6} r="1" fill={P.white} stroke={P.outline} strokeWidth={H * 0.5} />
                  </g>
                ) : null}
              </g>
            )
          })}
          {tier >= 4 ? <path d="M62 52l2-1 1 1-2 1z" fill={P.charcoal} {...detail} /> : null}
        </Svg>
      )
    }
    case 'birkenhain': {
      const n = Math.min(6, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Heath c={P.leafLight} winter={winter} />
          <Old>
            {Array.from({ length: n }, (_, i) => {
              const x = [40, 22, 58, 12, 68, 32][i]!
              const y = [60, 56, 56, 62, 62, 64][i]!
              return <Birch key={i} x={x} y={y} s={0.8 + (i % 3) * 0.15} season={season} />
            })}
          </Old>
          {tier >= 4 ? <Heather x={50} y={64} season={season} /> : null}
          {tier >= 4 ? <Heather x={28} y={66} season={season} /> : null}
          {tier >= 5 ? <Pennant x={74} y={64} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'bohlenweg': {
      const len = Math.min(5, tier + 1)
      return (
        <Svg tier={tier} bold>
          <Bog frozen={winter} />
          {Array.from({ length: len * 4 }, (_, i) => {
            const t = i / (len * 4)
            const x = 10 + t * 60
            const y = 62 - Math.sin(t * Math.PI) * 6
            return <rect key={i} x={x - 1.6} y={y - 1.2} width="3" height="5" rx=".4" fill={i % 2 ? P.wood : P.woodMid} {...detail} transform={`rotate(-12 ${x} ${y})`} />
          })}
          {tier >= 3
            ? Array.from({ length: len }, (_, i) => {
                const t = (i * 4 + 2) / (len * 4)
                const x = 10 + t * 60
                const y = 62 - Math.sin(t * Math.PI) * 6
                return <Post key={i} x={x} y={y - 1} h={5} w={1.4} k={K} />
              })
            : null}
          {tier >= 4 ? <Person x={36} y={56} c={P.tomato} s={0.8} /> : null}
          {winter ? <path d="M12 61 Q40 52 68 61" stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'beobachtungsturm': {
      const h = 18 + tier * 6
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={22} />
          {Array.from({ length: Math.floor(h / 8) }, (_, i) => (
            <path key={i} d={`M33 ${62 - i * 8}L47 ${56 - i * 8}`} stroke={P.woodDark} strokeWidth="1" />
          ))}
          <path d={`M32 64 L35 ${64 - h} M48 64 L45 ${64 - h}`} stroke={P.outline} strokeWidth="3.4" strokeLinecap="round" />
          <path d={`M32 64 L35 ${64 - h} M48 64 L45 ${64 - h}`} stroke={P.woodMid} strokeWidth="1.8" strokeLinecap="round" />
          <Wall x={32} y={64 - h - 6} w={16} h={6} fill={P.wood} k={K} />
          <path d={`M30 ${64 - h - 6} L40 ${64 - h - 13} L50 ${64 - h - 6}z`} fill={P.woodDark} {...line} />
          {tier >= 2 ? <path d={`M30 ${64 - h}h20M31 ${64 - h}v-3M49 ${64 - h}v-3`} stroke={P.outline} strokeWidth="1" /> : null}
          {tier >= 3 ? <Person x={40} y={64 - h - 1} c={P.leafDark} s={0.6} /> : null}
          {tier >= 4 && (autumn || spring) ? (
            <g stroke={P.charcoal} strokeWidth=".9" fill="none" strokeLinecap="round">
              <path d="M60 18l2 -1 2 1M66 14l2 -1 2 1M70 20l2 -1 2 1" />
            </g>
          ) : null}
          {tier >= 5 ? <Heather x={18} y={64} season={season} /> : null}
          {winter ? <path d={`M31 ${64 - h - 6.4}L40 ${64 - h - 12.4}L49 ${64 - h - 6.4}`} stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'moorhuette':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={32} />
          {tier >= 2 ? (
            <g>
              <rect x="48" y="25" width="4.4" height="11" fill={P.stone} {...detail} />
              <Smoke x={50} y={23} />
            </g>
          ) : null}
          <Wall x={20} y={44} w={34} h={20} fill={P.woodMid} planks={4} k={K} />
          {/* Reetdach */}
          <path d="M14 46 Q37 20 60 46z" fill={P.woodLight} {...line} />
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M${21 + i * 6} 44 l2 -${8 + (i % 3) * 3}`} stroke={P.woodDark} strokeWidth=".7" />
          ))}
          <ArchDoor x={27} y={64} w={7} h={11} k={K} />
          <Pane x={40} y={50} w={6} h={6} k={K} />
          {tier >= 3 ? (
            <g>
              <Post x={60} y={66} h={7} w={1.8} k={K} />
              <Post x={70} y={66} h={7} w={1.8} k={K} />
              <path d="M58 59h14" stroke={P.outline} strokeWidth="3.4" strokeLinecap="round" />
              <path d="M58 59h14" stroke={P.woodLight} strokeWidth="1.6" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 4 ? <Lantern x={16} y={58} s={0.6} /> : null}
          {tier >= 5 ? <Person x={64} y={58} c={P.denim} s={0.8} /> : null}
          {winter ? <path d="M16 44 Q37 22 58 44" stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'schnuckenstall': {
      const sheep = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <Heath c={P.leafMoss} winter={winter} />
          {Array.from({ length: 6 }, (_, i) => (
            <Heather key={i} x={10 + i * 12} y={52 + (i % 2) * 3} season={season} />
          ))}
          <Wall x={8} y={34} w={26} h={16} fill={P.woodDark} planks={3} k={K} />
          <path d="M4 36 L21 22 L38 36z" fill={P.woodLight} {...line} />
          <path d="M16 50v-9h8v9z" fill={P.soilDark} {...detail} />
          {Array.from({ length: sheep }, (_, i) => (
            <HeathSheep key={i} x={42 + (i % 3) * 12} y={58 + Math.floor(i / 3) * 6} flip={i % 2 === 1} />
          ))}
          {tier >= 4 ? <Person x={74} y={61} c={P.woodMid} /> : null}
          {tier >= 4 ? <path d="M76 61l2 -12q1 -1 1 1" stroke={P.outline} strokeWidth="1" fill="none" strokeLinecap="round" /> : null}
          {winter ? <path d="M6 35L21 23L36 35" stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'moorfest': {
      const lanterns = Math.min(8, 2 + tier)
      return (
        <Svg tier={tier} bold>
          <Bog cy={60} ry={7} frozen={winter} />
          <path d="M6 30 Q40 44 74 30" stroke={P.outline} strokeWidth={H} fill="none" />
          {Array.from({ length: lanterns }, (_, i) => {
            const t = (i + 0.5) / lanterns
            const x = 6 + 68 * t
            const y = 30 + 14 * 2 * t * (1 - t) * 2
            return <circle key={i} cx={x} cy={y + 1.4} r="1.8" fill={[P.lamp, P.amber, P.orange][i % 3]} stroke={P.outline} strokeWidth={H} className="fest-glow" />
          })}
          {tier >= 2 ? <Post x={6} y={66} h={38} w={2} k={K} /> : null}
          {tier >= 2 ? <Post x={74} y={66} h={38} w={2} k={K} /> : null}
          {tier >= 3 ? Array.from({ length: 3 }, (_, i) => <circle key={i} cx={28 + i * 12} cy={60 + (i % 2)} r="1.2" fill={P.lamp} className="fest-glow" opacity=".85" />) : null}
          {tier >= 4 ? [16, 24, 58, 66].map((x, i) => <Person key={x} x={x} y={69} c={[P.red, P.lilac, P.blue, P.leaf][i]!} s={0.7} />) : null}
          {tier >= 5 ? (
            <Old>
              <Birch x={70} y={52} s={0.6} season={season} />
            </Old>
          ) : null}
        </Svg>
      )
    }
  }
  return null
}
