/** Kapitel-Grafik Kapitel 16: Baumschule. */
import type { ReactNode } from 'react'
import { Roof, Svg, Window } from '../../HandParts'
import { Bunting, Snowcap } from './partsA'
import { Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Ground, Person } from './partsB'
import { Sapling, Sign } from './partsC'

/** Wurzelballen in Jute. */
function RootBall({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y - 2.4 * s} rx={3.4 * s} ry={2.8 * s} fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
      <path d={`M${x - 3 * s} ${y - 3 * s}q${3 * s} ${1.6 * s} ${6 * s} 0`} stroke={P.woodMid} strokeWidth=".4" fill="none" />
    </g>
  )
}

/** Topf (schwarz, Baumschul-Container). */
function Container({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path d={`M${x - 3 * s} ${y - 5 * s}h${6 * s}l-.8 ${5 * s}h-${4.4 * s}z`} fill={P.charcoal} stroke={P.ink} strokeWidth=".3" />
}

export function Baumschule({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const autumn = season === 'autumn'
  const spring = season === 'spring'
  switch (id) {
    case 'saatbeete': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="56" rx="36" ry="12" fill={winter ? P.cream : P.soil} />
          {Array.from({ length: rows }, (_, r) => (
            <g key={r}>
              <path d={`M8 ${48 + r * 4}h64`} stroke={P.soilDark} strokeWidth=".6" />
              {!winter
                ? Array.from({ length: 12 }, (_, k) => (
                    <path key={k} d={`M${11 + k * 5.4} ${48 + r * 4}l-1 -${1 + tier * 0.4}M${11 + k * 5.4} ${48 + r * 4}l1 -${1 + tier * 0.4}`} stroke={autumn ? P.autumn : P.leaf} strokeWidth=".7" />
                  ))
                : null}
            </g>
          ))}
          {tier >= 2 ? <Sign x={8} y={66} c={P.label} /> : null}
          {tier >= 4 ? <Person x={72} y={66} c={P.tomato} /> : null}
          {tier >= 5 ? <path d="M62 66l3-5h4l-1 5z" fill={P.metal} /> : null}
        </Svg>
      )
    }
    case 'veredelung':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          <rect x="14" y="48" width="40" height="3" fill={P.wood} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M18 51v13M50 51v13" stroke={P.woodDark} strokeWidth="1.4" />
          {Array.from({ length: Math.min(5, 1 + tier) }, (_, i) => (
            <g key={i}>
              <path d={`M${20 + i * 7} 48v-8`} stroke={P.bark} strokeWidth="1" />
              <path d={`M${20 + i * 7} 42h1.6`} stroke={P.gold} strokeWidth="1.2" />
              {!winter && tier >= 2 ? <ellipse cx={21 + i * 7} cy={39} rx="1.4" ry=".8" fill={P.leafLight} /> : null}
            </g>
          ))}
          {tier >= 3 ? <path d="M40 46l6 -2 1 1-6 2z" fill={P.metal} /> : null}
          {tier >= 3 ? <circle cx="34" cy="46.6" r="1.2" fill={P.gold} /> : null}
          {tier >= 4 ? <Person x={62} y={64} c={P.leaf} /> : null}
          {tier >= 5 ? [8, 12].map((x) => <RootBall key={x} x={x} y={66} s={0.8} />) : null}
        </Svg>
      )
    case 'obstgehoelze': {
      const n = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <Ground color={P.leafLight} winter={winter} />
          {Array.from({ length: n }, (_, i) => {
            const x = 12 + i * 14
            return (
              <g key={i}>
                <Sapling x={x} y={60 + (i % 2) * 4} s={0.9 + tier * 0.1} season={season} crown={P.leaf} stake />
                {(season === 'summer' || autumn) && tier >= 3 ? <circle cx={x + 1.6} cy={48 + (i % 2) * 4 - tier} r="1.2" fill={P.red} /> : null}
                {spring && tier >= 2 ? <circle cx={x - 1.4} cy={47 + (i % 2) * 4 - tier} r="1" fill={P.blossom} /> : null}
                {tier >= 4 ? <rect x={x - 1.4} y={58 + (i % 2) * 4} width="2.8" height="1.6" fill={P.label} /> : null}
              </g>
            )
          })}
        </Svg>
      )
    }
    case 'alleebaeume': {
      const n = Math.min(4, 1 + Math.floor(tier / 1.3))
      return (
        <Svg tier={tier}>
          <Ground color={P.leafLight} winter={winter} />
          <path d="M10 64 L36 40 M70 64 L44 40" stroke={P.woodLight} strokeWidth=".6" opacity=".6" />
          {Array.from({ length: n }, (_, i) => (
            <g key={i}>
              <Sapling x={18 + i * 7} y={64 - i * 6} s={1.5 - i * 0.2 + tier * 0.06} season={season} crown={P.leafDark} stake={tier >= 2} />
              <Sapling x={62 - i * 7} y={64 - i * 6} s={1.5 - i * 0.2 + tier * 0.06} season={season} crown={P.leaf} stake={tier >= 2} />
            </g>
          )).reverse()}
          {tier >= 5 ? <Person x={40} y={62} c={P.blue} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'heckenpflanzen': {
      const len = 20 + tier * 10
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={len / 2 + 4} />
          {Array.from({ length: Math.floor(len / 6) }, (_, i) => {
            const x = 40 - len / 2 + 3 + i * 6
            return (
              <g key={i}>
                <path d={`M${x} 64V54`} stroke={P.bark} strokeWidth=".8" />
                {!winter ? <ellipse cx={x} cy={52} rx="4" ry="5" fill={[P.leafDark, P.leaf, P.leafMoss][i % 3]} stroke={P.outline} strokeWidth=".3" /> : <path d={`M${x} 56l-3-4M${x} 56l3-5`} stroke={P.bark} strokeWidth=".5" />}
                {spring && i % 2 === 0 ? <circle cx={x - 1} cy={50} r="1" fill={P.white} /> : null}
                {season === 'summer' && i % 3 === 1 ? <circle cx={x + 1} cy={50} r="1.2" fill={P.pink} /> : null}
                {autumn && i % 2 ? <circle cx={x + 1} cy={51} r=".9" fill={P.berry} /> : null}
              </g>
            )
          })}
          {tier >= 3 ? <RootBall x={66} y={66} /> : null}
          {tier >= 4 ? <path d="M6 54c4-4 8 0 4 2" stroke={P.woodDark} strokeWidth=".6" fill="none" /> : null}
          {tier >= 4 ? <ellipse cx="8" cy="52" rx="2.6" ry="1.6" fill={P.woodMid} /> : null}
        </Svg>
      )
    }
    case 'containerplatz': {
      const rows = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <rect x="6" y="42" width="68" height="24" fill={P.charcoal} opacity=".3" />
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: 8 }, (_, k) => {
              const x = 11 + k * 8.4 + (r % 2) * 2
              const y = 48 + r * 5.4
              return (
                <g key={`${r}-${k}`}>
                  <Container x={x} y={y} s={0.7} />
                  {!winter ? <ellipse cx={x} cy={y - 5} rx="2.6" ry="2" fill={[P.leaf, P.leafDark, P.lilac, P.leafMoss][(r + k) % 4]} /> : <path d={`M${x} ${y - 3.5}v-3`} stroke={P.bark} strokeWidth=".5" />}
                </g>
              )
            }),
          )}
          {tier >= 5 ? <Person x={72} y={66} c={P.yellow} /> : null}
        </Svg>
      )
    }
    case 'giessanlage': {
      const sprinklers = Math.min(3, Math.ceil(tier / 1.6))
      return (
        <Svg tier={tier}>
          <Ground color={P.leafLight} winter={winter} />
          <path d="M4 62 Q40 58 76 62" stroke={P.leafDark} strokeWidth="1.4" fill="none" />
          {Array.from({ length: sprinklers }, (_, i) => {
            const x = 20 + i * 20
            return (
              <g key={i}>
                <path d={`M${x} 61V48`} stroke={P.metal} strokeWidth="1" />
                <g className="ha-wheel">
                  <path d={`M${x - 3} 48h6`} stroke={P.metal} strokeWidth="1" />
                </g>
                {!winter ? <path d={`M${x} 47 Q${x - 10} 40 ${x - 14} 52M${x} 47 Q${x + 10} 40 ${x + 14} 52`} stroke={P.waterLight} strokeWidth=".8" fill="none" strokeDasharray="1 1.4" /> : null}
              </g>
            )
          })}
          {tier >= 2 ? Array.from({ length: 6 }, (_, i) => <Sapling key={i} x={10 + i * 12} y={66} s={0.5} season={season} />) : null}
          {tier >= 3 ? (
            <g>
              <circle cx="8" cy="58" r="3.4" fill={P.leafDark} stroke={P.outline} strokeWidth=".4" />
              <circle cx="8" cy="58" r="1.2" fill={P.metal} />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <rect x="66" y="48" width="10" height="14" rx="1" fill={P.denim} stroke={P.outline} strokeWidth=".4" />
              <ellipse cx="71" cy="48" rx="5" ry="1.2" fill={P.blue} />
            </g>
          ) : null}
          {winter ? <Snowcap d="M66 47h10" /> : null}
        </Svg>
      )
    }
    case 'packschuppen':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <rect x="10" y="34" width="44" height="30" fill={P.woodMid} stroke={P.outline} strokeWidth=".6" />
          {Array.from({ length: 10 }, (_, i) => (
            <path key={i} d={`M${12 + i * 4.4} 35v28`} stroke={P.woodDark} strokeWidth=".6" />
          ))}
          <Roof x={10} w={44} y={34} color={P.metal} steep={10} />
          <rect x="22" y="44" width="20" height="20" fill={P.soilDark} />
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
            <RootBall key={i} x={58 + (i % 3) * 7} y={66 - Math.floor(i / 3) * 5} s={0.9} />
          ))}
          {tier >= 3 ? <Sapling x={30} y={64} s={1} season={season} /> : null}
          {tier >= 4 ? <Person x={36} y={64} c={P.orange} s={0.9} /> : null}
          {tier >= 5 ? <path d="M58 52h16" stroke={P.yellow} strokeWidth="1" /> : null}
          {winter ? <Snowcap d="M8 34L32 24L56 34" /> : null}
        </Svg>
      )
    case 'hofverkauf':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <rect x="20" y="42" width="30" height="22" fill={P.wood} stroke={P.outline} strokeWidth=".6" />
          <path d="M16 42 L35 30 L54 42z" fill={P.roof} stroke={P.outlineWood} strokeWidth=".5" />
          <rect x="22" y="48" width="26" height="3" fill={P.woodLight} />
          <Window x={32} y={53} lit={winter} />
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <g key={i}>
              <Container x={58 + i * 5} y={66} s={0.8} />
              <Sapling x={58 + i * 5} y={62} s={0.7} season={season} />
            </g>
          ))}
          {tier >= 2 ? <Sign x={12} y={66} c={P.yellow} /> : null}
          {tier >= 3 ? <path d="M6 66h10l-2 -5h-6z" fill={P.metal} /> : null}
          {tier >= 4 ? <Person x={52} y={66} c={P.lilac} /> : null}
          {tier >= 5 ? <Person x={46} y={68} c={P.blue} s={0.7} /> : null}
          {winter ? <Snowcap d="M18 41L35 31L52 41" /> : null}
        </Svg>
      )
    case 'pflanztag': {
      const trees = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <Ground color={P.leafLight} winter={winter} />
          {Array.from({ length: trees }, (_, i) => {
            const x = 12 + i * 14
            return (
              <g key={i}>
                <ellipse cx={x} cy={62} rx="4" ry="1.4" fill={P.soil} />
                <Sapling x={x} y={62} s={0.8} season={season} stake />
                {tier >= 3 ? <path d={`M${x + 1.6} 54h3l-1 1.4 1 1.4h-3`} fill={[P.red, P.yellow, P.blue, P.lilac, P.leaf][i]} /> : null}
                {tier >= 2 && i % 2 === 0 ? <Person x={x + 5} y={66} c={[P.tomato, P.denim, P.orange][i / 2]!} s={0.6} /> : null}
              </g>
            )
          })}
          {tier >= 4 ? <path d="M70 66l-3-10M69 56h-3" stroke={P.metal} strokeWidth=".8" /> : null}
          {tier >= 5 ? <Bunting y={12} n={8} x0={6} x1={74} /> : null}
        </Svg>
      )
    }
  }
  return null
}
