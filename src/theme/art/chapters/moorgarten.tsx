/** Kapitel-Grafik Kapitel 17: Moor- und Heidegarten. */
import type { ReactNode } from 'react'
import { Smoke, Svg, Window } from '../../HandParts'
import { Snowcap } from './partsA'
import { Lantern, Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Person } from './partsB'
import { Birch } from './partsC'

/** Dunkles Moorwasser mit Torfrand. */
function Bog({ cx = 40, cy = 58, rx = 32, ry = 9, frozen }: { cx?: number; cy?: number; rx?: number; ry?: number; frozen?: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 1} rx={rx + 2} ry={ry + 2} fill={P.soilDark} opacity=".7" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={frozen ? P.glass : P.waterDeep} />
      <ellipse cx={cx - rx * 0.3} cy={cy - ry * 0.3} rx={rx * 0.3} ry={ry * 0.15} fill={P.white} opacity=".2" />
    </g>
  )
}

/** Moospolster. */
function Moss({ cx, cy, rx, winter, red }: { cx: number; cy: number; rx: number; winter?: boolean; red?: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.4} fill={winter ? P.frost : red ? P.autumn : P.leafMoss} />
      <ellipse cx={cx - rx * 0.3} cy={cy - rx * 0.12} rx={rx * 0.45} ry={rx * 0.18} fill={winter ? P.white : P.leafPale} opacity=".7" />
    </g>
  )
}

/** Heidschnucke (graues Fell, schwarzer Kopf, Hörner). */
function HeathSheep({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <g className="ha-graze">
        <ellipse cx="0" cy="-4" rx="5" ry="3.2" fill={P.stoneLight} stroke={P.outlineFur} strokeWidth=".4" />
        <ellipse cx="5" cy="-5" rx="1.8" ry="1.4" fill={P.ink} />
        <path d="M4.4 -6.2q-1.6 -1.4 -.4 -2.4" stroke={P.woodLight} strokeWidth=".6" fill="none" />
        <path d="M-3 -1v2M2 -1v2" stroke={P.ink} strokeWidth=".7" />
      </g>
    </g>
  )
}

/** Heidekraut-Tupfen. */
function Heather({ x, y, season }: { x: number; y: number; season?: string }) {
  const c = season === 'autumn' || season === 'summer' ? P.lavender : season === 'winter' ? P.winterLeaf : P.leafMoss
  return <ellipse cx={x} cy={y} rx="3" ry="1.6" fill={c} />
}

export function Moorgarten({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  switch (id) {
    case 'torfmoos': {
      const pads = Math.min(6, 1 + tier)
      return (
        <Svg tier={tier}>
          <Bog frozen={winter} />
          {Array.from({ length: pads }, (_, i) => (
            <Moss key={i} cx={[20, 58, 40, 30, 50, 66][i]!} cy={[56, 56, 62, 52, 52, 60][i]!} rx={6 + (i % 2) * 2} winter={winter} red={autumn && i % 2 === 1} />
          ))}
          {tier >= 4 ? <path d="M12 58q2 -8 4 -10M14 58q-1 -6 2 -8" stroke={P.leafDark} strokeWidth=".7" fill="none" /> : null}
          {tier >= 5 && !winter ? <path d="M66 46l4 -1M66 46l-3 -2" stroke={P.denim} strokeWidth=".8" className="ha-swim" /> : null}
        </Svg>
      )
    }
    case 'moosbeeren': {
      const n = Math.min(24, 6 + tier * 4)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="34" ry="10" fill={winter ? P.frost : P.leafMoss} />
          {!winter
            ? Array.from({ length: 30 }, (_, i) => (
                <path key={i} d={`M${10 + ((i * 13) % 60)} ${52 + ((i * 7) % 12)}q2 -1 4 0`} stroke={P.leafDark} strokeWidth=".5" fill="none" />
              ))
            : null}
          {autumn || season === 'summer'
            ? Array.from({ length: n }, (_, i) => (
                <circle key={i} cx={12 + ((i * 17) % 56)} cy={52 + ((i * 11) % 12)} r="1.2" fill={autumn ? P.berry : P.blossom} stroke={P.outlineWood} strokeWidth=".2" />
              ))
            : spring
              ? Array.from({ length: Math.ceil(n / 2) }, (_, i) => <circle key={i} cx={12 + ((i * 19) % 56)} cy={52 + ((i * 7) % 12)} r=".9" fill={P.pink} />)
              : null}
          {winter ? Array.from({ length: tier * 2 }, (_, i) => <ellipse key={i} cx={14 + ((i * 17) % 52)} cy={54 + ((i * 7) % 9)} rx="2.4" ry="1" fill={P.white} />) : null}
          {tier >= 3 ? <path d="M64 66h10l-1 -5h-8z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" /> : null}
          {tier >= 3 && autumn ? [67, 70].map((x) => <circle key={x} cx={x} cy={60.6} r="1.3" fill={P.berry} />) : null}
          {tier >= 5 ? <Person x={8} y={66} c={P.leafDark} /> : null}
        </Svg>
      )
    }
    case 'wollgras': {
      const n = Math.min(20, 4 + tier * 3)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="34" ry="10" fill={winter ? P.frost : autumn ? P.woodLight : P.leafLight} />
          {Array.from({ length: n }, (_, i) => {
            const x = 10 + ((i * 23) % 60)
            const y = 64 - ((i * 7) % 12)
            const h = 8 + (i % 3) * 3
            return (
              <g key={i} className={i % 3 ? undefined : 'ma-sway'}>
                <path d={`M${x} ${y}q1 -${h / 2} 0 -${h}`} stroke={autumn ? P.woodMid : P.leafDark} strokeWidth=".6" fill="none" />
                {spring || season === 'summer' ? <ellipse cx={x} cy={y - h - 1.2} rx="1.6" ry="2" fill={P.white} stroke={P.stoneLight} strokeWidth=".2" /> : null}
              </g>
            )
          })}
        </Svg>
      )
    }
    case 'sonnentau': {
      const plants = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Moss cx={40} cy={58} rx={30} winter={winter} />
          {Array.from({ length: plants }, (_, i) => {
            const x = 18 + i * 11
            const y = 58 + (i % 2) * 2
            return (
              <g key={i}>
                {Array.from({ length: 6 }, (_, k) => {
                  const a = (k / 6) * Math.PI * 2
                  const ex = x + Math.cos(a) * 3.6
                  const ey = y + Math.sin(a) * 1.6 - 1
                  return (
                    <g key={k}>
                      <path d={`M${x} ${y - 1}L${ex} ${ey}`} stroke={winter ? P.stone : P.red} strokeWidth=".8" />
                      {!winter ? <circle cx={ex} cy={ey} r=".6" fill={P.glassEdge} stroke={P.red} strokeWidth=".2" /> : null}
                    </g>
                  )
                })}
                {season === 'summer' && tier >= 3 ? (
                  <g>
                    <path d={`M${x} ${y - 1}V${y - 10}`} stroke={P.leafDark} strokeWidth=".5" />
                    <circle cx={x} cy={y - 10.6} r=".9" fill={P.white} />
                  </g>
                ) : null}
              </g>
            )
          })}
          {tier >= 4 ? <path d="M62 52l2-1 1 1-2 1z" fill={P.charcoal} /> : null}
        </Svg>
      )
    }
    case 'birkenhain': {
      const n = Math.min(6, 1 + tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="34" ry="10" fill={winter ? P.frost : P.leafLight} />
          {Array.from({ length: n }, (_, i) => {
            const x = [40, 22, 58, 12, 68, 32][i]!
            const y = [60, 56, 56, 62, 62, 64][i]!
            return <Birch key={i} x={x} y={y} s={0.8 + (i % 3) * 0.15} season={season} />
          })}
          {tier >= 4 ? <Heather x={50} y={64} season={season} /> : null}
          {tier >= 4 ? <Heather x={28} y={66} season={season} /> : null}
        </Svg>
      )
    }
    case 'bohlenweg': {
      const len = Math.min(5, tier + 1)
      return (
        <Svg tier={tier}>
          <Bog frozen={winter} />
          {Array.from({ length: len * 4 }, (_, i) => {
            const t = i / (len * 4)
            const x = 10 + t * 60
            const y = 62 - Math.sin(t * Math.PI) * 6
            return <rect key={i} x={x - 1.6} y={y - 1.2} width="3" height="5" rx=".4" fill={i % 2 ? P.wood : P.woodMid} stroke={P.outlineWood} strokeWidth=".3" transform={`rotate(-12 ${x} ${y})`} />
          })}
          {tier >= 3
            ? Array.from({ length: len }, (_, i) => {
                const t = (i * 4 + 2) / (len * 4)
                const x = 10 + t * 60
                const y = 62 - Math.sin(t * Math.PI) * 6
                return <path key={i} d={`M${x} ${y - 1}v-5`} stroke={P.woodDark} strokeWidth=".7" />
              })
            : null}
          {tier >= 4 ? <Person x={36} y={56} c={P.tomato} s={0.8} /> : null}
          {winter ? <Snowcap d="M12 61 Q40 52 68 61" /> : null}
        </Svg>
      )
    }
    case 'beobachtungsturm': {
      const h = 18 + tier * 6
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={20} />
          <path d={`M32 64 L35 ${64 - h} M48 64 L45 ${64 - h}`} stroke={P.woodDark} strokeWidth="1.8" />
          {Array.from({ length: Math.floor(h / 8) }, (_, i) => (
            <path key={i} d={`M33 ${62 - i * 8}L47 ${56 - i * 8}`} stroke={P.woodMid} strokeWidth=".8" />
          ))}
          <rect x="32" y={64 - h - 6} width="16" height="6" fill={P.wood} stroke={P.outlineWood} strokeWidth=".5" />
          <path d={`M30 ${64 - h - 6} L40 ${64 - h - 13} L50 ${64 - h - 6}z`} fill={P.woodDark} />
          {tier >= 2 ? <path d={`M30 ${64 - h}h20M31 ${64 - h}v-3M49 ${64 - h}v-3`} stroke={P.woodDark} strokeWidth=".7" /> : null}
          {tier >= 3 ? <Person x={40} y={64 - h - 1} c={P.leafDark} s={0.6} /> : null}
          {tier >= 4 && (autumn || spring) ? (
            <g stroke={P.charcoal} strokeWidth=".6" fill="none">
              <path d="M60 18l2 -1 2 1M66 14l2 -1 2 1M70 20l2 -1 2 1" />
            </g>
          ) : null}
          {tier >= 5 ? <Heather x={18} y={64} season={season} /> : null}
          {winter ? <Snowcap d={`M31 ${64 - h - 6}L40 ${64 - h - 12}L49 ${64 - h - 6}`} /> : null}
        </Svg>
      )
    }
    case 'moorhuette':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          <rect x="20" y="44" width="34" height="20" fill={P.woodMid} stroke={P.outline} strokeWidth=".6" />
          <path d="M14 46 Q37 20 60 46z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".6" />
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M${20 + i * 6} 44 l2 -${8 + (i % 3) * 3}`} stroke={P.woodMid} strokeWidth=".5" />
          ))}
          <path d="M28 64v-11h7v11z" fill={P.woodDark} />
          <Window x={40} y={50} lit={winter || tier >= 4} />
          {tier >= 2 ? <rect x="48" y="26" width="4" height="10" fill={P.stone} /> : null}
          {tier >= 2 ? <Smoke x={50} y={24} /> : null}
          {tier >= 3 ? <path d="M58 64h12M60 64v-6M68 64v-6M58 58h12" stroke={P.woodDark} strokeWidth="1" /> : null}
          {tier >= 4 ? <Lantern x={18} y={56} s={0.6} /> : null}
          {tier >= 5 ? <Person x={64} y={58} c={P.denim} s={0.8} /> : null}
          {winter ? <Snowcap d="M16 44 Q37 22 58 44" /> : null}
        </Svg>
      )
    case 'schnuckenstall': {
      const sheep = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="36" ry="10" fill={winter ? P.frost : P.leafMoss} />
          {Array.from({ length: 6 }, (_, i) => (
            <Heather key={i} x={10 + i * 12} y={52 + (i % 2) * 3} season={season} />
          ))}
          <rect x="8" y="34" width="26" height="16" fill={P.woodDark} stroke={P.outline} strokeWidth=".5" />
          <path d="M4 36 L21 22 L38 36z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".5" />
          <path d="M16 50v-9h8v9z" fill={P.soilDark} />
          {Array.from({ length: sheep }, (_, i) => (
            <HeathSheep key={i} x={42 + (i % 3) * 12} y={58 + Math.floor(i / 3) * 6} flip={i % 2 === 1} />
          ))}
          {tier >= 4 ? <Person x={74} y={60} c={P.woodMid} /> : null}
          {tier >= 4 ? <path d="M76 60l2 -12q1 -1 1 1" stroke={P.woodDark} strokeWidth=".6" fill="none" /> : null}
          {winter ? <Snowcap d="M6 35L21 23L36 35" /> : null}
        </Svg>
      )
    }
    case 'moorfest': {
      const lanterns = Math.min(8, 2 + tier)
      return (
        <Svg tier={tier}>
          <Bog cy={60} ry={7} frozen={winter} />
          <path d="M6 30 Q40 44 74 30" stroke={P.outlineWood} strokeWidth=".4" fill="none" />
          {Array.from({ length: lanterns }, (_, i) => {
            const t = (i + 0.5) / lanterns
            const x = 6 + 68 * t
            const y = 30 + 14 * 2 * t * (1 - t) * 2
            return <circle key={i} cx={x} cy={y + 1.4} r="1.6" fill={[P.lamp, P.amber, P.orange][i % 3]} className="fest-glow" />
          })}
          {tier >= 2 ? <path d="M6 66V28M74 66V28" stroke={P.woodDark} strokeWidth="1" /> : null}
          {tier >= 3 ? Array.from({ length: 3 }, (_, i) => <circle key={i} cx={28 + i * 12} cy={60 + (i % 2)} r="1.1" fill={P.lamp} className="fest-glow" opacity=".8" />) : null}
          {tier >= 4 ? [16, 24, 58, 66].map((x, i) => <Person key={x} x={x} y={68} c={[P.red, P.lilac, P.blue, P.leaf][i]!} s={0.7} />) : null}
          {tier >= 5 ? <Birch x={70} y={52} s={0.6} season={season} /> : null}
        </Svg>
      )
    }
  }
  return null
}
