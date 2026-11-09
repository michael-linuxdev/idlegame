/** Kapitel-Grafik Kapitel 14: Klostergarten. */
import type { ReactNode } from 'react'
import { Roof, Smoke, Svg, Window } from '../../HandParts'
import { Butterfly, Snowcap } from './partsA'
import { Bee, Flower, Jar, Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Ground, Person } from './partsB'
import { BoxBall, Sign } from './partsC'

/** Schwester im Habit. */
function Sister({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-2.6 0 L-2 -6 Q0 -7 2 -6 L2.6 0z" fill={P.charcoal} />
      <circle cx="0" cy="-7.4" r="1.6" fill={P.skin} />
      <path d="M-2 -7.6 Q0 -10.6 2 -7.6 L2.4 -5 L-2.4 -5z" fill={P.ink} />
      <path d="M-1.4 -6.2h2.8" stroke={P.white} strokeWidth=".6" />
    </g>
  )
}

/** Quittenbaum: knorrig, im Herbst gelbe Früchte. */
function Quince({ x, y, s = 1, season, fruits = 5 }: { x: number; y: number; s?: number; season?: string; fruits?: number }) {
  const winter = season === 'winter'
  const crown = winter ? P.frost : season === 'autumn' ? P.leafMoss : P.leaf
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1.4 0 Q-2 -6 0 -10 Q2 -6 1.4 0z" fill={P.bark} />
      <ellipse cx="0" cy="-15" rx="9" ry="7" fill={crown} stroke={P.outline} strokeWidth=".4" />
      <ellipse cx="-3" cy="-17" rx="4" ry="3" fill={winter ? P.white : P.leafLight} opacity=".7" />
      {season === 'spring'
        ? Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-6 + i * 2.4} cy={-14 - (i % 2) * 3} r="1" fill={P.blossom} />)
        : !winter
          ? Array.from({ length: fruits }, (_, i) => <ellipse key={i} cx={-5 + i * 2.6} cy={-12 - (i % 2) * 4} rx="1.4" ry="1.7" fill={season === 'autumn' ? P.gold : P.leafPale} stroke={P.outlineWood} strokeWidth=".2" />)
          : null}
    </g>
  )
}

export function Klostergarten({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const autumn = season === 'autumn'
  const bloom = season === 'spring' || season === 'summer'
  switch (id) {
    case 'kreuzgang':
      return (
        <Svg tier={tier}>
          <rect x="8" y="44" width="64" height="22" fill={P.stoneLight} />
          {[0, 1, 2, 3].slice(0, Math.min(4, tier)).map((i) => {
            const x = 12 + (i % 2) * 32
            const y = 46 + Math.floor(i / 2) * 10
            return (
              <g key={i}>
                <rect x={x} y={y} width="24" height="8" fill={P.leafDark} />
                <rect x={x + 1} y={y + 1} width="22" height="6" fill={winter ? P.cream : P.soil} />
                {bloom ? [4, 10, 16].map((dx) => <circle key={dx} cx={x + 1 + dx} cy={y + 4} r="1.4" fill={[P.lavender, P.yellow, P.pink][(i + dx) % 3]} />) : null}
              </g>
            )
          })}
          <ellipse cx="40" cy="55" rx="4" ry="2" fill={P.stone} />
          <ellipse cx="40" cy="54.6" rx="2.6" ry="1.2" fill={winter ? P.white : P.water} />
          {tier >= 3 ? (
            <g>
              {[8, 18, 28, 38, 48, 58, 68].map((x) => (
                <path key={x} d={`M${x} 44v-14a5 5 0 0 1 10 0`} stroke={P.stone} strokeWidth="1.8" fill="none" />
              ))}
              <rect x="6" y="20" width="68" height="6" fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".5" />
              <Roof x={6} w={68} y={20} color={P.terracotta} steep={6} />
            </g>
          ) : null}
          {tier >= 4 ? <Sister x={66} y={66} /> : null}
          {tier >= 5 ? <BoxBall x={10} y={66} winter={winter} /> : null}
          {winter && tier >= 3 ? <Snowcap d="M4 14 L40 14 L76 14" /> : null}
        </Svg>
      )
    case 'quittenhain': {
      const trees = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg tier={tier}>
          <Ground color={P.leafLight} winter={winter} />
          {Array.from({ length: trees }, (_, i) => (
            <Quince key={i} x={[40, 18, 62][i]!} y={[64, 58, 58][i]!} s={[1.5, 1.2, 1.2][i]! * (0.85 + tier * 0.08)} season={season} fruits={3 + tier} />
          )).reverse()}
          {tier >= 3 ? <path d="M70 66 L64 40 M74 66 L68 40 M70.8 60h4 M69.4 54h4 M68 48h4" stroke={P.woodMid} strokeWidth=".8" /> : null}
          {tier >= 4 && autumn ? (
            <g>
              <path d="M58 66h12l-1 -5h-10z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
              {[61, 64, 67].map((x) => <circle key={x} cx={x} cy={60.4} r="1.6" fill={P.gold} />)}
            </g>
          ) : null}
          {tier >= 5 ? <Sister x={10} y={66} s={0.9} /> : null}
        </Svg>
      )
    }
    case 'heilpflanzen': {
      const rows = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <rect x="10" y="44" width="60" height="20" fill={P.leafDark} />
          <rect x="11" y="45" width="58" height="18" fill={winter ? P.cream : P.soil} />
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: 8 }, (_, k) => {
              const x = 15 + k * 7
              const y = 49 + r * 4.4
              const c = [P.orange, P.lavender, P.yellow, P.leafPale][r]!
              return (
                <g key={`${r}-${k}`}>
                  {!winter ? <ellipse cx={x} cy={y} rx="2.4" ry="1.4" fill={r % 2 ? P.leafMoss : P.leaf} /> : k % 2 ? <ellipse cx={x} cy={y} rx="2.6" ry="1" fill={P.woodLight} /> : null}
                  {bloom ? <circle cx={x} cy={y - 1.2} r=".9" fill={c} /> : null}
                </g>
              )
            }),
          )}
          {tier >= 2 ? <Sign x={8} y={64} c={P.label} /> : null}
          {tier >= 3 && bloom ? <Butterfly x={60} y={36} c={P.yellow} /> : null}
          {tier >= 5 ? <Sister x={74} y={66} s={0.9} /> : null}
        </Svg>
      )
    }
    case 'brunnenhaus':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={24} />
          <ellipse cx="40" cy="60" rx="14" ry="5" fill={P.stone} stroke={P.outlineStone} strokeWidth=".6" />
          <rect x="26" y="50" width="28" height="10" fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".6" />
          <ellipse cx="40" cy="50" rx="14" ry="4" fill={P.stone} />
          <ellipse cx="40" cy="50" rx="11" ry="2.8" fill={winter ? P.white : P.waterDeep} />
          {tier >= 2 ? <path d="M28 50V30M52 50V30" stroke={P.woodDark} strokeWidth="1.6" /> : null}
          {tier >= 2 ? <path d="M28 34h24" stroke={P.woodMid} strokeWidth="1.4" /> : null}
          {tier >= 2 ? <path d="M40 34v10" stroke={P.outlineSoft} strokeWidth=".5" /> : null}
          {tier >= 2 ? <rect x="37.6" y="44" width="4.8" height="4" fill={P.wood} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 3 ? <Roof x={26} w={28} y={31} color={P.terracotta} steep={10} /> : null}
          {tier >= 4 ? (
            <g>
              <rect x="58" y="56" width="5" height="8" fill={P.metal} />
              <ellipse cx="60.5" cy="56" rx="2.5" ry=".8" fill={P.water} />
            </g>
          ) : null}
          {tier >= 5 ? <Sister x={16} y={66} /> : null}
          {winter && tier >= 3 ? <Snowcap d="M24 31L40 21L56 31" /> : null}
        </Svg>
      )
    case 'bienenmauer': {
      const len = 30 + tier * 8
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={len / 2 + 2} />
          {Array.from({ length: 4 }, (_, r) =>
            Array.from({ length: Math.floor(len / 8) }, (_, k) => (
              <rect key={`${r}-${k}`} x={40 - len / 2 + k * 8 + (r % 2) * 4 - 2} y={62 - (r + 1) * 6} width="7.4" height="5.6" rx="1.4" fill={(r + k) % 3 ? P.stone : P.stoneLight} stroke={P.outlineStone} strokeWidth=".4" />
            )),
          )}
          {Array.from({ length: Math.min(8, tier * 2) }, (_, i) => (
            <circle key={i} cx={40 - len / 2 + 4 + ((i * 11) % (len - 6))} cy={58 - (i % 4) * 6} r=".7" fill={P.ink} />
          ))}
          {bloom ? Array.from({ length: 4 + tier }, (_, i) => <Flower key={i} s={0.5} x={10 + i * 8} y={66} c={[P.lilac, P.yellow, P.cream][i % 3]} />) : null}
          {bloom && tier >= 2 ? <Bee x={58} y={30} s={0.6} /> : null}
          {bloom && tier >= 4 ? <Bee x={24} y={28} s={0.6} /> : null}
          {winter ? <Snowcap d={`M${40 - len / 2} 38h${len}`} /> : null}
        </Svg>
      )
    }
    case 'schwesterngarten': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="56" rx="36" ry="12" fill={winter ? P.cream : P.soil} />
          {Array.from({ length: rows }, (_, r) => {
            const y = 48 + r * 4
            const kind = r % 3
            return (
              <g key={r}>
                {Array.from({ length: 8 }, (_, k) => {
                  const x = 12 + k * 8 + (r % 2) * 2
                  return kind === 0 ? (
                    <circle key={k} cx={x} cy={y} r="2" fill={winter ? P.winterLeaf : P.leafPale} stroke={P.leafDark} strokeWidth=".3" />
                  ) : kind === 1 ? (
                    <path key={k} d={`M${x} ${y}v-4M${x - 1} ${y}l-1-3M${x + 1} ${y}l1-3`} stroke={winter ? P.winterLeafDark : P.leafDark} strokeWidth=".7" />
                  ) : (
                    <path key={k} d={`M${x} ${y}V${y - 6}`} stroke={P.woodMid} strokeWidth=".6" />
                  )
                })}
                {kind === 2 && !winter ? <path d={`M10 ${y - 3} Q40 ${y - 6} 72 ${y - 3}`} stroke={P.leaf} strokeWidth="1.2" fill="none" /> : null}
              </g>
            )
          })}
          {tier >= 4 ? <Sister x={70} y={66} /> : null}
          {tier >= 5 ? <path d="M8 66l6-4h4l-2 4z" fill={P.metal} /> : null}
        </Svg>
      )
    }
    case 'kraeuterboden': {
      const bunches = Math.min(8, 2 + tier)
      return (
        <Svg tier={tier}>
          <rect x="10" y="30" width="60" height="34" fill={P.paper} stroke={P.outlineWood} strokeWidth=".6" />
          <path d="M6 30 L40 10 L74 30z" fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".5" />
          <path d="M14 30 L40 15 L66 30" stroke={P.woodDark} strokeWidth="1" fill="none" />
          <path d="M14 34h52" stroke={P.woodDark} strokeWidth="1" />
          {Array.from({ length: bunches }, (_, i) => {
            const x = 18 + i * (46 / Math.max(1, bunches - 1))
            return (
              <g key={i}>
                <path d={`M${x} 34v3`} stroke={P.outlineSoft} strokeWidth=".4" />
                <path d={`M${x - 2} 37 L${x} 45 L${x + 2} 37z`} fill={[P.leafMoss, P.lavender, P.gold, P.leaf][i % 4]} />
              </g>
            )
          })}
          {tier >= 3 ? <rect x="16" y="54" width="20" height="10" fill={P.wood} stroke={P.outlineWood} strokeWidth=".5" /> : null}
          {tier >= 3 ? [20, 26, 32].map((x) => <Jar key={x} x={x} y={54} c={P.leafPale} s={0.5} />) : null}
          {tier >= 4 ? <Window x={52} y={44} lit={winter} /> : null}
          {tier >= 5 ? <Sister x={60} y={64} s={0.9} /> : null}
          {winter ? <Snowcap d="M8 29L40 11L72 29" /> : null}
        </Svg>
      )
    }
    case 'klosterkueche':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <rect x="10" y="34" width="50" height="30" fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".6" />
          <Roof x={10} w={50} y={34} color={P.terracotta} steep={12} />
          <rect x="48" y="16" width="6" height="12" fill={P.stone} />
          {tier >= 2 ? <Smoke x={51} y={14} /> : null}
          <path d="M18 64v-12a5 5 0 0 1 10 0v12z" fill={P.woodDark} />
          <Window x={36} y={42} lit={winter || tier >= 4} />
          {tier >= 3 ? (
            <g>
              <rect x="62" y="56" width="14" height="2" fill={P.woodDark} />
              <path d="M64 58v6M74 58v6" stroke={P.woodDark} strokeWidth="1" />
              <Jar x={66} y={56} c={P.honey} s={0.5} />
              <Jar x={71} y={56} c={P.gold} s={0.5} />
            </g>
          ) : null}
          {tier >= 4 ? <rect x="34" y="54" width="10" height="5" fill={P.amber} stroke={P.outlineWood} strokeWidth=".4" /> : null}
          {tier >= 5 ? <Sister x={8} y={66} /> : null}
          {winter ? <Snowcap d="M8 34L35 22L62 34" /> : null}
        </Svg>
      )
    case 'saatgutregister': {
      const shelves = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={28} />
          <rect x="16" y="22" width="48" height="42" fill={P.woodDark} stroke={P.outline} strokeWidth=".6" />
          {Array.from({ length: shelves }, (_, r) => (
            <g key={r}>
              <path d={`M18 ${32 + r * 9}h44`} stroke={P.woodMid} strokeWidth="1.2" />
              {Array.from({ length: 9 }, (_, k) => (
                <rect key={k} x={20 + k * 4.6} y={24.4 + r * 9} width="3.6" height="7" fill={[P.paper, P.label, P.canvas][(r + k) % 3]} stroke={P.outlineWood} strokeWidth=".2" />
              ))}
            </g>
          ))}
          {tier >= 2 ? (
            <g>
              <rect x="26" y="58" width="22" height="3" fill={P.wood} />
              <path d="M30 58l7-3 7 3z" fill={P.paper} stroke={P.outlineWood} strokeWidth=".3" />
              <path d="M44 57l4-5" stroke={P.ink} strokeWidth=".4" />
            </g>
          ) : null}
          {tier >= 5 ? <Sister x={70} y={66} /> : null}
          {tier >= 3 ? <path d="M60 64l3-6h4l3 6z" fill={P.lamp} className="fest-glow" opacity=".7" /> : null}
        </Svg>
      )
    }
    case 'glockenhof':
      return (
        <Svg tier={tier}>
          <Ground color={P.stoneLight} winter={winter} />
          <rect x="30" y={tier >= 3 ? 14 : 30} width="20" height={tier >= 3 ? 50 : 34} fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".6" />
          {tier >= 3 ? <path d="M28 14 L40 0 L52 14z" fill={P.leafMoss} stroke={P.outline} strokeWidth=".4" /> : <Roof x={30} w={20} y={30} color={P.terracotta} steep={8} />}
          <path d={tier >= 3 ? 'M36 30v-8a4 4 0 0 1 8 0v8z' : 'M36 44v-6a4 4 0 0 1 8 0v6z'} fill={P.charcoal} />
          <g className="ha-swim">
            <path d={tier >= 3 ? 'M37.6 28 Q37.6 22 40 22 Q42.4 22 42.4 28z' : 'M37.6 42 Q37.6 37 40 37 Q42.4 37 42.4 42z'} fill={P.brass} stroke={P.outlineWood} strokeWidth=".3" />
          </g>
          <path d="M36 64v-8a4 4 0 0 1 8 0v8z" fill={P.woodDark} />
          {tier >= 3 ? <circle cx="40" cy="38" r="3" fill={P.cream} stroke={P.outlineStone} strokeWidth=".5" /> : null}
          {tier >= 3 ? <path d="M40 38v-2M40 38h1.6" stroke={P.ink} strokeWidth=".5" /> : null}
          {tier >= 2 ? <Window x={42} y={44} lit={winter} /> : null}
          {tier >= 4 ? (
            <g>
              <rect x="56" y="56" width="14" height="2" fill={P.woodMid} />
              <path d="M58 58v6M68 58v6" stroke={P.woodDark} strokeWidth="1" />
              <Sister x={63} y={56} s={0.8} />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <Sister x={16} y={66} />
              <Person x={22} y={67} c={P.denim} s={0.8} />
            </g>
          ) : null}
          {winter ? <Snowcap d={tier >= 3 ? 'M30 13L40 1L50 13' : 'M28 30L40 22L52 30'} /> : null}
        </Svg>
      )
  }
  return null
}
