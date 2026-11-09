/** Kapitel-Grafik Kapitel 26: Paprikafelder bei Kalocsa (Ungarn). */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Bee } from '../parts'
import { P } from '../palette'
import { Person } from './figures'
import { type AreaProps } from './partsB'
import { StringLights, TomatoPlant } from './partsC'
import { Fire, ThatchHouse } from './partsD'
import { PepperPlant, Stork } from './partsE'

/** Schnur getrockneter Paprikaschoten (Füzér), hängt von `y` nach unten. */
function PepperString({ x, y, n = 6, c }: { x: number; y: number; n?: number; c: string }) {
  return (
    <g>
      <path d={`M${x} ${y}v${n * 2.2}`} stroke={P.woodDark} strokeWidth=".3" />
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M${x} ${y + 1 + i * 2.2}q${i % 2 ? 1.6 : -1.6} .4 ${i % 2 ? 1.2 : -1.2} 2.6`} stroke={c} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      ))}
    </g>
  )
}

/** Kalocsa-Blume: bunte Blüte mit Blättern, freihändig gemalt. */
function KalocsaFlower({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 3q-3 -1 -3.4 -3M0 3q3 -1 3.4 -3" stroke={P.leaf} strokeWidth=".8" fill="none" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-1.6" rx=".9" ry="1.6" fill={c} transform={`rotate(${a})`} />
      ))}
      <circle cx="0" cy="0" r=".9" fill={P.yellow} />
    </g>
  )
}

/** Robinie (in Ungarn „Akazie“). */
function Robinia({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const crown = season === 'autumn' ? P.yellow : season === 'spring' ? P.leafPale : P.leaf
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0Q-1 -10 1 -18M0 -10l-5 -6M.6 -14l5 -5" stroke={P.bark} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {season === 'winter' ? (
        <path d="M-5 -16l-2 -3M5.6 -19l2 -3M1 -18l-1 -4" stroke={P.bark} strokeWidth=".6" />
      ) : (
        <g>
          <ellipse cx="-4" cy="-19" rx="6" ry="4.4" fill={crown} stroke={P.outline} strokeWidth=".3" opacity=".95" />
          <ellipse cx="4" cy="-21" rx="6" ry="4.6" fill={crown} stroke={P.outline} strokeWidth=".3" opacity=".95" />
          {season === 'spring'
            ? [
                [-6, -17],
                [-2, -21],
                [3, -18],
                [6, -22],
              ].map(([dx, dy], i) => <path key={i} d={`M${dx} ${dy}v2.6`} stroke={P.white} strokeWidth="1.4" strokeLinecap="round" />)
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
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="37" ry="11" fill={field} />
          {[54, 60, 66].map((y) => (
            <path key={y} d={`M8 ${y}H72`} stroke={winter ? P.white : P.soilDark} strokeWidth=".6" />
          ))}
          {Array.from({ length: n }, (_, i) => (
            <PepperPlant key={i} x={10 + (i % 6) * 12 + (Math.floor(i / 6) % 2) * 5} y={56 + Math.floor(i / 6) * 6} s={0.9} season={season} pods={autumn ? 3 : 2} />
          ))}
          {tier >= 5 ? <Person x={72} y={66} c={P.berry} s={0.65} /> : null}
        </Svg>
      )
    }
    case 'paprikaschnuere': {
      const strings = 1 + tier
      const pod = autumn ? P.tomato : P.autumnDark
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="64" rx="37" ry="5" fill={winter ? P.frost : P.leafPale} />
          <rect x="8" y="30" width="64" height="34" fill={P.white} stroke={P.stoneLight} strokeWidth=".5" />
          <path d="M4 31Q40 18 76 31L76 26Q40 12 4 26z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
          {winter ? <path d="M6 26Q40 13 74 26" stroke={P.white} strokeWidth="1.6" fill="none" /> : null}
          <rect x="34" y="44" width="10" height="20" fill={P.leafDark} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M8 62.6h64" stroke={P.blue} strokeWidth="1.2" />
          {Array.from({ length: strings }, (_, i) => (
            <PepperString key={i} x={[14, 22, 52, 60, 28, 66][i]!} y={31} n={7} c={pod} />
          ))}
          {tier >= 2 ? <rect x="48" y="38" width="9" height="8" fill={P.waterLight} stroke={P.blue} strokeWidth=".8" /> : null}
          {tier >= 3 ? <path d="M70 64v-8h4v8" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 5 ? <Person x={46} y={68} c={P.blue} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'paprikamuehle': {
      const sacks = tier + 1
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="64" rx="37" ry="6" fill={winter ? P.frost : P.canvas} />
          <ThatchHouse x={10} y={60} w={34} h={18} wall={P.white} winter={winter} lit={winter} />
          <g transform="translate(58 58)">
            <ellipse cx="0" cy="0" rx="8" ry="2.6" fill={P.stone} stroke={P.stoneDark} strokeWidth=".4" />
            <rect x="-8" y="-4" width="16" height="4" fill={P.stoneLight} stroke={P.stoneDark} strokeWidth=".4" />
            <ellipse cx="0" cy="-4" rx="8" ry="2.6" fill={P.stoneLight} stroke={P.stoneDark} strokeWidth=".4" />
            <ellipse cx="0" cy="-4" rx="3" ry="1" fill={P.tomato} />
          </g>
          {Array.from({ length: sacks }, (_, i) => (
            <g key={i}>
              <path d={`M${48 + i * 5} 70q-2 -4 0 -6h4q2 2 0 6z`} fill={P.paper} stroke={P.outlineSoft} strokeWidth=".3" />
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
        <Svg tier={tier}>
          <ellipse cx="40" cy="65" rx="37" ry="5" fill={winter ? P.frost : P.leafPale} />
          <rect x="8" y="22" width="64" height="42" fill={P.white} stroke={P.stoneLight} strokeWidth=".5" />
          <path d="M8 22h64" stroke={P.woodDark} strokeWidth="1.6" />
          <rect x="30" y="30" width="20" height="14" fill={P.waterLight} stroke={P.leafDark} strokeWidth="1" />
          <path d="M40 30v14M30 37h20" stroke={P.leafDark} strokeWidth=".6" />
          {Array.from({ length: flowers }, (_, i) => {
            const side = i % 2 ? 1 : -1
            const k = Math.floor(i / 2)
            const x = 40 + side * (16 + (k % 3) * 6)
            const y = 30 + Math.floor(k / 3) * 12 + (k % 3) * 3
            return <KalocsaFlower key={i} x={x} y={y} c={cols[i % cols.length]!} s={1.1} />
          })}
          {tier >= 3 ? <rect x="31" y="48" width="18" height="14" fill={P.cream} stroke={P.woodDark} strokeWidth=".6" /> : null}
          {tier >= 3 ? <KalocsaFlower x={40} y={55} c={P.tomato} s={1.4} /> : null}
          {tier >= 4 ? <path d="M30 44h20" stroke={P.tomato} strokeWidth="1" strokeDasharray="1 1" /> : null}
          {tier >= 5 ? <Person x={62} y={66} c={P.tomato} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'schwengelbrunnen':
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="62" rx="37" ry="9" fill={winter ? P.frost : summer ? P.paper : P.leafPale} />
          <path d="M22 64V26M20 26l2 -2l2 2" stroke={P.woodDark} strokeWidth="1.6" fill="none" />
          <path d="M8 18L58 34" stroke={P.woodMid} strokeWidth="1.2" />
          <rect x="5" y="16" width="6" height="4" fill={P.stoneDark} transform="rotate(18 8 18)" />
          <path d="M56 33.4V54" stroke={P.woodDark} strokeWidth=".6" />
          <path d="M54.4 54h3.2l-.4 3h-2.4z" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" />
          <rect x="50" y="58" width="12" height="5" rx="1" fill={P.white} stroke={P.stone} strokeWidth=".4" />
          <ellipse cx="56" cy="58.6" rx="5" ry="1" fill={winter ? P.glass : P.water} />
          {tier >= 2 ? <path d="M30 66h14v-3h-14z" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 2 ? <path d="M31 64h12" stroke={winter ? P.glass : P.water} strokeWidth="1" /> : null}
          {tier >= 3 ? (
            <g transform="translate(66 68) scale(.75)">
              <path d="M-4 0v-5M-2 0v-5M3 0v-5M5 0v-5" stroke={P.soilDark} strokeWidth="1" />
              <ellipse cx="0" cy="-7" rx="6" ry="3" fill={P.woodDark} />
              <path d="M-5 -8l-4 -4l-1.4 2l2 4z" fill={P.woodDark} />
              <path d="M-9 -12l-1 -1.6" stroke={P.soilDark} strokeWidth=".8" />
              <path d="M6 -8q2 2 1 6" stroke={P.soilDark} strokeWidth=".8" fill="none" />
            </g>
          ) : null}
          {tier >= 4 ? <Stork x={22} y={25} s={0.55} /> : null}
          {tier >= 5 ? <Person x={46} y={66} c={P.denim} s={0.65} /> : null}
        </Svg>
      )
    case 'tomatenfeld': {
      const n = 1 + tier
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="37" ry="10" fill={field} />
          {Array.from({ length: n }, (_, i) => {
            const x = 12 + i * 11
            const y = 62 + (i % 2) * 4
            if (winter) return <path key={i} d={`M${x} ${y}V${y - 14}M${x - 1} ${y - 14}h2`} stroke={P.woodLight} strokeWidth=".8" />
            if (spring) return <path key={i} d={`M${x} ${y}V${y - 6}M${x} ${y - 3}l-2 -1.4M${x} ${y - 4.6}l2 -1.4`} stroke={P.leaf} strokeWidth=".8" />
            return <TomatoPlant key={i} x={x} y={y} h={13} ripe={summer} fruits={3} />
          })}
          {tier >= 4 ? <path d="M64 70h12l-1 -4h-10z" fill={P.wood} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 5 ? <Person x={72} y={60} c={P.leafDark} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'akazienhain': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="62" rx="37" ry="9" fill={winter ? P.frost : P.leafPale} />
          {Array.from({ length: n }, (_, i) => (
            <Robinia key={i} x={[40, 22, 58, 30, 50][i]!} y={[60, 64, 64, 70, 70][i]!} s={[1.2, 0.95, 0.95, 0.8, 0.8][i]!} season={season} />
          ))}
          {tier >= 4 ? <path d="M64 70h8v-6h-8z" fill={P.yellow} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 4 && !winter ? <Bee x={60} y={52} /> : null}
          {tier >= 5 ? <path d="M6 70l6 -3l8 0" stroke={P.woodMid} strokeWidth="1.2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'schilfscheune':
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="64" rx="37" ry="6" fill={winter ? P.frost : P.leafPale} />
          <ThatchHouse x={12} y={62} w={40} h={20} wall={P.white} winter={winter} />
          {tier >= 2 ? Array.from({ length: 3 }, (_, i) => <ellipse key={i} cx={20 + i * 3} cy={48 + i * 0.6} rx="1" ry="2.4" fill={P.yellow} stroke={P.gold} strokeWidth=".2" />) : null}
          {tier >= 3 ? (
            <g>
              <path d="M56 66h14l-2 -6h-10z" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".4" />
              <circle cx="58" cy="67" r="2.4" fill="none" stroke={P.woodDark} strokeWidth=".7" />
              <circle cx="68" cy="67" r="2.4" fill="none" stroke={P.woodDark} strokeWidth=".7" />
            </g>
          ) : null}
          {tier >= 4 ? [58, 62, 66].map((x) => <ellipse key={x} cx={x} cy={59} rx="1.6" ry="2.6" fill={autumn ? P.yellow : P.woodLight} />) : null}
          {tier >= 5 ? <Person x={72} y={64} c={P.woodDark} s={0.6} /> : null}
        </Svg>
      )
    case 'paprikamarkt': {
      const sacks = tier + 1
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="64" rx="37" ry="6" fill={winter ? P.frost : P.canvas} />
          <path d="M14 62V36M66 62V36" stroke={P.woodDark} strokeWidth="1" />
          <path d="M10 36h60l-4 -8h-52z" fill={P.white} stroke={P.stone} strokeWidth=".4" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${14 + i * 9} 28l-1 8h5l-1 -8z`} fill={P.tomato} opacity=".9" />
          ))}
          <rect x="16" y="50" width="48" height="4" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
          {Array.from({ length: sacks }, (_, i) => (
            <g key={i}>
              <path d={`M${20 + i * 7} 50q-2 -5 0 -7h4q2 2 0 7z`} fill={P.paper} stroke={P.outlineSoft} strokeWidth=".3" />
              <ellipse cx={22 + i * 7} cy={43.4} rx="2" ry=".8" fill={[P.tomato, P.berry, P.orange][i % 3]} />
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
        <Svg tier={tier}>
          <ellipse cx="40" cy="62" rx="37" ry="9" fill={winter ? P.frost : P.leafPale} />
          <path d="M30 60L40 40L50 60M40 40v6" stroke={P.charcoal} strokeWidth=".8" fill="none" />
          <Fire x={40} y={62} s={0.6} />
          <path d="M34 52h12l-1 6h-10z" fill={P.charcoal} />
          <ellipse cx="40" cy="52" rx="6" ry="1.2" fill={P.tomato} />
          {Array.from({ length: guests }, (_, i) => (
            <Person key={i} x={[20, 60, 14, 66, 26][i]!} y={[62, 62, 68, 68, 70][i]!} c={[P.tomato, P.blue, P.leafDark, P.berry, P.yellow][i]!} s={0.7} />
          ))}
          {tier >= 3 ? <StringLights x0={6} x1={74} y={20} lit={winter || autumn || tier >= 4} /> : null}
          {tier >= 4 ? <path d="M70 58l4 -10M68.6 54l4 1.4" stroke={P.woodDark} strokeWidth=".8" /> : null}
          {tier >= 5 ? <PepperString x={8} y={30} n={6} c={P.tomato} /> : null}
        </Svg>
      )
    }
  }
  return null
}
