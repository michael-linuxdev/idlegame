/**
 * Kapitel 16 — Baumschule im kräftigen Stil (2026-11-14, Weinberg-Niveau):
 * Setzlinge mit Pfahl, Ballen, Container, Schuppen und Verkaufsstand mit
 * Kontur, Bausteine aus art/parts/bold.tsx; jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Bunting } from './partsA'
import { Pennant, Shadow } from '../parts'
import { GableRoof, Pane, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { type AreaProps } from './partsB'

const K = 0.85
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

function Sign({ x, y, c = P.label }: { x: number; y: number; c?: string }) {
  return (
    <g>
      <Post x={x} y={y} h={7} w={1.4} k={K} />
      <rect x={x - 4.4} y={y - 10.4} width="8.8" height="4.8" rx=".8" fill={c} {...detail} />
      <path d={`M${x - 2.6} ${y - 8}h5.2`} stroke={P.outline} strokeWidth={H} />
    </g>
  )
}

/** Setzling mit Krone (im Winter kahl), optional mit Pfahl. */
function Sapling({ x, y, s = 1, season, crown, stake = false }: { x: number; y: number; s?: number; season?: string; crown?: string; stake?: boolean }) {
  const c = season === 'winter' ? undefined : season === 'autumn' ? P.autumn : (crown ?? P.leaf)
  const h = 12 * s
  return (
    <g>
      {stake ? (
        <g>
          <path d={`M${x + 1.8} ${y}V${y - h * 0.8}`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
          <path d={`M${x + 1.8} ${y}V${y - h * 0.8}`} stroke={P.woodLight} strokeWidth=".9" strokeLinecap="round" />
        </g>
      ) : null}
      <path d={`M${x} ${y}V${y - h}`} stroke={P.outline} strokeWidth={Math.max(1.8, s * 2.2)} strokeLinecap="round" />
      <path d={`M${x} ${y}V${y - h}`} stroke={P.bark} strokeWidth={Math.max(0.8, s * 1)} strokeLinecap="round" />
      {c ? (
        <g>
          <ellipse cx={x} cy={y - h - 1.4 * s} rx={4 * s} ry={4.6 * s} fill={c} {...detail} />
          <ellipse cx={x - 1.2 * s} cy={y - h - 2.6 * s} rx={1.6 * s} ry={1.4 * s} fill={season === 'autumn' ? P.gold : P.leafPale} opacity=".8" />
        </g>
      ) : (
        <path d={`M${x} ${y - h * 0.6}l-${2.4 * s} -${3 * s}M${x} ${y - h * 0.8}l${2.4 * s} -${3 * s}M${x} ${y - h}l-${1.4 * s} -${2.4 * s}`} stroke={P.bark} strokeWidth=".8" strokeLinecap="round" />
      )}
    </g>
  )
}

/** Wurzelballen in Jute. */
function RootBall({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y - 2.4 * s} rx={3.4 * s} ry={2.8 * s} fill={P.woodLight} {...detail} />
      <path d={`M${x - 3 * s} ${y - 3 * s}q${3 * s} ${1.6 * s} ${6 * s} 0`} stroke={P.woodDark} strokeWidth=".6" fill="none" />
    </g>
  )
}

/** Baumschul-Container. */
function Container({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path d={`M${x - 3 * s} ${y - 5 * s}h${6 * s}l-.8 ${5 * s}h-${4.4 * s}z`} fill={P.charcoal} {...detail} />
}

/** Feld mit Kontur. */
function Field({ c, winter }: { c: string; winter?: boolean }) {
  return <ellipse cx="40" cy="58" rx="36" ry="11" fill={winter ? P.white : c} {...line} />
}

export function Baumschule({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const autumn = season === 'autumn'
  const spring = season === 'spring'
  switch (id) {
    case 'saatbeete': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="57" rx="36" ry="11" fill={winter ? P.cream : P.soil} {...line} />
          {Array.from({ length: rows }, (_, r) => (
            <g key={r}>
              <path d={`M8 ${50 + r * 3.8}h64`} stroke={P.soilDark} strokeWidth=".9" />
              {!winter
                ? Array.from({ length: 12 }, (_, k) => (
                    <path key={k} d={`M${11 + k * 5.4} ${50 + r * 3.8}l-1 -${1 + tier * 0.4}M${11 + k * 5.4} ${50 + r * 3.8}l1 -${1 + tier * 0.4}`} stroke={autumn ? P.autumn : P.leaf} strokeWidth="1" />
                  ))
                : null}
            </g>
          ))}
          {tier >= 2 ? <Sign x={8} y={67} /> : null}
          {tier >= 4 ? <Person x={72} y={67} c={P.tomato} /> : null}
          {tier >= 5 ? <path d="M62 67l3-5h4l-1 5z" fill={P.metal} {...detail} /> : null}
        </Svg>
      )
    }
    case 'veredelung':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={32} />
          {tier >= 3 ? (
            <g>
              <Post x={16} y={48} h={20} w={1.8} k={K} />
              <Post x={52} y={48} h={20} w={1.8} k={K} />
              <path d="M12 30 L34 24 L56 30z" fill={P.canvas} {...line} />
            </g>
          ) : null}
          <Post x={18} y={66} h={15} w={2} k={K} />
          <Post x={50} y={66} h={15} w={2} k={K} />
          <rect x="14" y="48" width="40" height="3" rx=".6" fill={P.wood} {...line} />
          {tier >= 2 ? (
            <g>
              <rect x="24" y="58" width="12" height="7" rx=".6" fill={P.woodLight} {...line} />
              <path d="M26 58l-1-4M29 58v-5M32 58l1-4" stroke={P.bark} strokeWidth="1" strokeLinecap="round" />
            </g>
          ) : null}
          {Array.from({ length: Math.min(5, 1 + tier) }, (_, i) => (
            <g key={i}>
              <path d={`M${20 + i * 7} 48v-8`} stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
              <path d={`M${20 + i * 7} 48v-8`} stroke={P.bark} strokeWidth="1" strokeLinecap="round" />
              <path d={`M${20 + i * 7} 42h1.6`} stroke={P.gold} strokeWidth="1.4" />
              {!winter && tier >= 2 ? <ellipse cx={21 + i * 7} cy={39} rx="1.5" ry=".9" fill={P.leafLight} stroke={P.outline} strokeWidth={H * 0.5} /> : null}
            </g>
          ))}
          {tier >= 3 ? <path d="M40 46l6 -2 1 1-6 2z" fill={P.metal} {...detail} /> : null}
          {tier >= 3 ? <circle cx="34" cy="46.6" r="1.3" fill={P.gold} {...detail} /> : null}
          {tier >= 4 ? <Person x={62} y={66} c={P.leaf} /> : null}
          {tier >= 5 ? [8, 12].map((x) => <RootBall key={x} x={x} y={68} s={0.8} />) : null}
        </Svg>
      )
    case 'obstgehoelze': {
      const n = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Field c={P.leafLight} winter={winter} />
          {Array.from({ length: n }, (_, i) => {
            const x = 12 + i * 14
            return (
              <g key={i}>
                <Sapling x={x} y={60 + (i % 2) * 4} s={0.9 + tier * 0.1} season={season} crown={P.leaf} stake />
                {(season === 'summer' || autumn) && tier >= 3 ? <circle cx={x + 1.6} cy={48 + (i % 2) * 4 - tier} r="1.3" fill={P.red} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
                {spring && tier >= 2 ? <circle cx={x - 1.4} cy={47 + (i % 2) * 4 - tier} r="1.1" fill={P.blossom} /> : null}
                {tier >= 4 ? <rect x={x - 1.6} y={57.6 + (i % 2) * 4} width="3.2" height="1.8" rx=".3" fill={P.label} {...detail} /> : null}
              </g>
            )
          })}
          {tier >= 5 ? <Pennant x={74} y={66} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'alleebaeume': {
      const n = Math.min(4, 1 + Math.floor(tier / 1.3))
      return (
        <Svg tier={tier} bold>
          <Field c={P.leafLight} winter={winter} />
          <path d="M14 66 L36 42 M66 66 L44 42" stroke={P.paper} strokeWidth="2" opacity=".8" />
          {Array.from({ length: n }, (_, i) => (
            <g key={i}>
              <Sapling x={18 + i * 7} y={64 - i * 6} s={1.5 - i * 0.2 + tier * 0.06} season={season} crown={P.leafDark} stake={tier >= 2} />
              <Sapling x={62 - i * 7} y={64 - i * 6} s={1.5 - i * 0.2 + tier * 0.06} season={season} crown={P.leaf} stake={tier >= 2} />
            </g>
          )).reverse()}
          {tier >= 5 ? <Person x={40} y={63} c={P.blue} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'heckenpflanzen': {
      const len = 20 + tier * 10
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={len / 2 + 4} />
          {Array.from({ length: Math.floor(len / 6) }, (_, i) => {
            const x = 40 - len / 2 + 3 + i * 6
            return (
              <g key={i}>
                <path d={`M${x} 64V54`} stroke={P.bark} strokeWidth="1" />
                {!winter ? <ellipse cx={x} cy={52} rx="4" ry="5" fill={[P.leafDark, P.leaf, P.leafMoss][i % 3]} {...detail} /> : <path d={`M${x} 56l-3-4M${x} 56l3-5`} stroke={P.bark} strokeWidth=".8" />}
                {spring && i % 2 === 0 ? <circle cx={x - 1} cy={50} r="1.1" fill={P.white} /> : null}
                {season === 'summer' && i % 3 === 1 ? <circle cx={x + 1} cy={50} r="1.3" fill={P.pink} /> : null}
                {autumn && i % 2 ? <circle cx={x + 1} cy={51} r="1" fill={P.berry} /> : null}
              </g>
            )
          })}
          <path d={`M${40 - len / 2} 64h${len}`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
          <path d={`M${40 - len / 2} 64h${len}`} stroke={P.soil} strokeWidth="1" strokeLinecap="round" />
          {tier >= 3 ? <RootBall x={66} y={68} /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M5 56c4-4 8 0 4 2" stroke={P.outline} strokeWidth="1.2" fill="none" />
              <ellipse cx="7" cy="54" rx="2.8" ry="1.7" fill={P.woodMid} {...detail} />
            </g>
          ) : null}
          {tier >= 5 ? <Sign x={74} y={58} /> : null}
        </Svg>
      )
    }
    case 'containerplatz': {
      const rows = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <rect x="6" y="42" width="68" height="24" rx="1.4" fill={P.stoneLight} {...line} />
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: 8 }, (_, k) => {
              const x = 11 + k * 8.4 + (r % 2) * 2
              const y = 48 + r * 5.4
              return (
                <g key={`${r}-${k}`}>
                  {!winter ? <ellipse cx={x} cy={y - 5} rx="2.6" ry="2" fill={[P.leaf, P.leafDark, P.lilac, P.leafMoss][(r + k) % 4]} stroke={P.outline} strokeWidth={H * 0.6} /> : <path d={`M${x} ${y - 3.5}v-3`} stroke={P.bark} strokeWidth=".8" />}
                  <Container x={x} y={y} s={0.7} />
                </g>
              )
            }),
          )}
          {tier >= 5 ? <Person x={72} y={68} c={P.yellow} /> : null}
        </Svg>
      )
    }
    case 'giessanlage': {
      const sprinklers = Math.min(3, Math.ceil(tier / 1.6))
      return (
        <Svg tier={tier} bold>
          <Field c={P.leafLight} winter={winter} />
          <path d="M4 62 Q40 58 76 62" stroke={P.outline} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M4 62 Q40 58 76 62" stroke={P.leafDark} strokeWidth="1.2" fill="none" strokeLinecap="round" />
          {Array.from({ length: sprinklers }, (_, i) => {
            const x = 20 + i * 20
            return (
              <g key={i}>
                <path d={`M${x} 61V48`} stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
                <path d={`M${x} 61V48`} stroke={P.metal} strokeWidth="1" strokeLinecap="round" />
                <g className="ha-wheel">
                  <path d={`M${x - 3} 48h6`} stroke={P.metal} strokeWidth="1.4" strokeLinecap="round" />
                </g>
                {!winter ? <path d={`M${x} 47 Q${x - 10} 40 ${x - 14} 52M${x} 47 Q${x + 10} 40 ${x + 14} 52`} stroke={P.waterLight} strokeWidth="1" fill="none" strokeDasharray="1 1.4" /> : null}
              </g>
            )
          })}
          {tier >= 2 ? Array.from({ length: 6 }, (_, i) => <Sapling key={i} x={10 + i * 12} y={67} s={0.5} season={season} />) : null}
          {tier >= 3 ? (
            <g>
              <circle cx="8" cy="58" r="3.6" fill={P.leafDark} {...line} />
              <circle cx="8" cy="58" r="1.3" fill={P.metal} />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <rect x="66" y="48" width="10" height="14" rx="1.4" fill={P.denim} {...line} />
              <ellipse cx="71" cy="48" rx="5" ry="1.3" fill={winter ? P.white : P.waterDeep} {...detail} />
            </g>
          ) : null}
          {tier >= 5 ? <Pennant x={4} y={52} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'packschuppen':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <Wall x={10} y={34} w={44} h={30} fill={P.woodMid} planks={6} k={K} />
          <GableRoof x={10} y={35} w={44} h={10} fill={P.metal} over={3} k={K} />
          <rect x="22" y="44" width="20" height="20" fill={P.soilDark} {...detail} />
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
            <RootBall key={i} x={58 + (i % 3) * 7} y={66 - Math.floor(i / 3) * 5} s={0.9} />
          ))}
          {tier >= 3 ? <Sapling x={30} y={64} s={1} season={season} /> : null}
          {tier >= 4 ? <Person x={36} y={64} c={P.orange} s={0.9} /> : null}
          {tier >= 5 ? <path d="M58 52h16" stroke={P.yellow} strokeWidth="1.4" /> : null}
          {winter ? <path d="M7 35L32 25L57 35" stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'hofverkauf':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <Wall x={20} y={42} w={30} h={22} fill={P.wood} planks={3} k={K} />
          <GableRoof x={20} y={43} w={30} h={11} fill={P.roof} over={3} k={K} />
          <rect x="22" y="48" width="26" height="3" rx=".6" fill={P.woodLight} {...detail} />
          <Pane x={31} y={53} w={8} h={7} k={K} />
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <g key={i}>
              <Sapling x={58 + i * 5} y={62} s={0.7} season={season} />
              <Container x={58 + i * 5} y={66} s={0.8} />
            </g>
          ))}
          {tier >= 2 ? <Sign x={12} y={66} c={P.yellow} /> : null}
          {tier >= 3 ? <path d="M5 67h11l-2 -5h-7z" fill={P.metal} {...detail} /> : null}
          {tier >= 4 ? <Person x={52} y={67} c={P.lilac} /> : null}
          {tier >= 5 ? <Person x={46} y={69} c={P.blue} s={0.7} /> : null}
          {winter ? <path d="M17 42.4L35 32L53 42.4" stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'pflanztag': {
      const trees = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Field c={P.leafLight} winter={winter} />
          {Array.from({ length: trees }, (_, i) => {
            const x = 12 + i * 14
            return (
              <g key={i}>
                <ellipse cx={x} cy={62} rx="4" ry="1.5" fill={P.soil} {...detail} />
                <Sapling x={x} y={62} s={0.8} season={season} stake />
                {tier >= 3 ? <path d={`M${x + 1.8} 54h3l-1 1.4 1 1.4h-3`} fill={[P.red, P.yellow, P.blue, P.lilac, P.leaf][i]} {...detail} /> : null}
                {tier >= 2 && i % 2 === 0 ? <Person x={x + 5} y={67} c={[P.tomato, P.denim, P.orange][i / 2]!} s={0.6} /> : null}
              </g>
            )
          })}
          {tier >= 4 ? <path d="M70 67l-3-10M69 57h-3" stroke={P.metal} strokeWidth="1.2" strokeLinecap="round" /> : null}
          {tier >= 5 ? <Bunting y={12} n={8} x0={6} x1={74} /> : null}
        </Svg>
      )
    }
  }
  return null
}
