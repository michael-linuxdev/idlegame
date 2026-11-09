/** Kapitel-Grafik Kapitel 19: Spreewald (Fließe, Gurken, Blockhäuser). */
import type { ReactNode } from 'react'
import { Smoke, Svg, Window } from '../../HandParts'
import { Bunting, Snowcap } from './partsA'
import { Barrel, Jar, Shadow } from '../parts'
import { P } from '../palette'
import { Person } from './figures'
import { type AreaProps } from './partsB'
import { Punt, WaterBand } from './partsD'

/** Gurkenpflanze am Boden: große Blätter, gelbe Blüten, kleine Gurken. */
function Cucumber({ x, y, season, fruits = 2 }: { x: number; y: number; season?: string; fruits?: number }) {
  if (season === 'winter') return <ellipse cx={x} cy={y} rx="4" ry="1.4" fill={P.woodLight} />
  if (season === 'spring')
    return (
      <g>
        <path d={`M${x} ${y}v-2`} stroke={P.leafDark} strokeWidth=".6" />
        <ellipse cx={x - 1.2} cy={y - 2.2} rx="1.4" ry=".8" fill={P.leaf} />
        <ellipse cx={x + 1.2} cy={y - 2.2} rx="1.4" ry=".8" fill={P.leafPale} />
      </g>
    )
  const leaf = season === 'autumn' ? P.gold : P.leaf
  return (
    <g>
      <path d={`M${x - 5} ${y}q5 -3 10 0`} stroke={P.leafDark} strokeWidth=".5" fill="none" />
      {[-3, 0, 3].map((dx, i) => (
        <path key={i} d={`M${x + dx} ${y - 1}l-2 -2.4l2 -1.4l2 1.4z`} fill={i === 1 ? P.leafDark : leaf} stroke={P.leafDark} strokeWidth=".2" />
      ))}
      {season === 'summer' ? <circle cx={x + 4} cy={y - 3} r=".8" fill={P.yellow} /> : null}
      {Array.from({ length: fruits }, (_, i) => (
        <ellipse key={i} cx={x - 2 + i * 3} cy={y + 0.4} rx="1.8" ry=".7" fill={P.leafDark} stroke={P.leafMoss} strokeWidth=".2" />
      ))}
    </g>
  )
}

/** Blockhaus aus liegenden Stämmen (Fußpunkt unten links). */
function LogHouse({ x, y, w, h, winter, lit, gable = P.woodDark }: { x: number; y: number; w: number; h: number; winter?: boolean; lit?: boolean; gable?: string }) {
  const rows = Math.round(h / 2.4)
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={P.woodMid} stroke={P.outline} strokeWidth=".5" />
      {Array.from({ length: rows }, (_, i) => (
        <path key={i} d={`M${x - 1} ${y - h + i * (h / rows) + 1}h${w + 2}`} stroke={P.woodDark} strokeWidth=".5" />
      ))}
      <path d={`M${x - 3} ${y - h}L${x + w / 2} ${y - h - w * 0.45}L${x + w + 3} ${y - h}z`} fill={gable} stroke={P.outline} strokeWidth=".5" />
      <path d={`M${x + w / 2 - 3} ${y - h - w * 0.45 + 1}l3 -3l3 3`} stroke={P.woodLight} strokeWidth=".7" fill="none" />
      <Window x={x + w * 0.18} y={y - h * 0.7} lit={lit} />
      <rect x={x + w * 0.62} y={y - h * 0.62} width={w * 0.18} height={h * 0.62} fill={P.woodDark} stroke={P.outline} strokeWidth=".3" />
      {winter ? <Snowcap d={`M${x - 2} ${y - h}L${x + w / 2} ${y - h - w * 0.43}L${x + w + 2} ${y - h}`} /> : null}
    </g>
  )
}

/** Erle: dunkler Stamm, runde Krone, im Frühling Kätzchen. */
function Alder({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const h = 18 * s
  const crown = season === 'winter' ? null : season === 'autumn' ? P.winterLeafDark : P.leafDark
  return (
    <g>
      <path d={`M${x} ${y}V${y - h}`} stroke={P.charcoal} strokeWidth={1.4 * s} />
      {crown ? (
        <g>
          <ellipse cx={x} cy={y - h - 3 * s} rx={7 * s} ry={8 * s} fill={crown} stroke={P.outline} strokeWidth=".3" />
          <ellipse cx={x - 2 * s} cy={y - h - 6 * s} rx={3 * s} ry={2.4 * s} fill={P.leaf} opacity=".6" />
        </g>
      ) : (
        <path d={`M${x} ${y - h * 0.6}l-${4 * s} -${6 * s}M${x} ${y - h * 0.8}l${4 * s} -${6 * s}M${x} ${y - h}l-${1 * s} -${5 * s}`} stroke={P.charcoal} strokeWidth=".6" />
      )}
      {season === 'spring' || season === 'winter'
        ? [-3, 0, 3].map((dx) => <path key={dx} d={`M${x + dx * s} ${y - h - 2 * s}v${2.4 * s}`} stroke={P.woodMid} strokeWidth=".8" strokeLinecap="round" />)
        : null}
    </g>
  )
}

/** Storch (stehend). */
function Stork({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-.6 0v-3M.8 0v-3" stroke={P.tomato} strokeWidth=".5" />
      <ellipse cx="0" cy="-4.6" rx="2.6" ry="1.8" fill={P.white} stroke={P.stoneDark} strokeWidth=".2" />
      <path d="M-2.6 -4.4h2.6l-1 1.4z" fill={P.ink} />
      <path d="M1.6 -5.4q1 -2 .6 -3.6" stroke={P.white} strokeWidth=".9" fill="none" />
      <path d="M2.4 -9l2.6 1" stroke={P.tomato} strokeWidth=".6" />
    </g>
  )
}

/** Sorbisches Osterei mit Muster. */
function Egg({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx="1.4" ry="1.8" fill={c} stroke={P.outline} strokeWidth=".2" />
      <path d={`M${x - 1.2} ${y}h2.4M${x} ${y - 1.2}l.6 .8-.6 .8-.6 -.8z`} stroke={P.white} strokeWidth=".3" fill="none" />
    </g>
  )
}

export function Spreewald({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  switch (id) {
    case 'gurkenfeld': {
      const rows = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="36" ry="11" fill={winter ? P.frost : P.soil} />
          {Array.from({ length: rows }, (_, r) => (
            <g key={r}>
              {Array.from({ length: 6 }, (_, k) => (
                <Cucumber key={k} x={12 + k * 11 + (r % 2) * 5} y={66 - r * 5} season={season} fruits={tier >= 3 ? 2 : 1} />
              ))}
            </g>
          ))}
          {tier >= 3 ? <path d="M62 52h12l-1 4h-10z" fill={P.wood} stroke={P.outlineWood} strokeWidth=".4" /> : null}
          {tier >= 3 && !winter ? [64, 67, 70].map((x) => <ellipse key={x} cx={x} cy={51.6} rx="1.6" ry=".7" fill={P.leafDark} />) : null}
          {tier >= 4 ? <Person x={8} y={60} c={P.red} s={0.8} /> : null}
          {tier >= 5 ? <Person x={74} y={66} c={P.denim} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'meerrettich': {
      const n = Math.min(12, 2 + tier * 2)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="34" ry="9" fill={winter ? P.frost : P.paper} />
          {Array.from({ length: n }, (_, i) => {
            const x = 12 + ((i * 17) % 50)
            const y = 56 + ((i * 7) % 10)
            if (winter) return <path key={i} d={`M${x - 2} ${y}h4`} stroke={P.woodLight} strokeWidth="1" />
            const c = autumn ? P.gold : spring ? P.leafPale : P.leaf
            return (
              <g key={i}>
                <path d={`M${x} ${y}Q${x - 4} ${y - 8} ${x - 3} ${y - 13}Q${x} ${y - 8} ${x} ${y}z`} fill={c} stroke={P.leafDark} strokeWidth=".3" />
                <path d={`M${x} ${y}Q${x + 4} ${y - 7} ${x + 4} ${y - 11}Q${x + 1} ${y - 7} ${x} ${y}z`} fill={P.leafDark} stroke={P.leafDark} strokeWidth=".3" />
              </g>
            )
          })}
          {tier >= 2 ? [64, 67, 70].map((x, i) => <path key={x} d={`M${x} 66l${i - 1} -8`} stroke={P.cream} strokeWidth="1.4" strokeLinecap="round" />) : null}
          {tier >= 3 ? <path d="M60 66h14" stroke={P.soilDark} strokeWidth="1.2" /> : null}
          {tier >= 4 ? <path d="M14 66l2 -12M13 54h6" stroke={P.metal} strokeWidth=".8" /> : null}
          {tier >= 5 ? <Person x={24} y={68} c={P.leafDark} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'leinoelmuehle': {
      const flax = Math.min(16, 4 + tier * 3)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="36" ry="9" fill={winter ? P.frost : P.leaf} stroke={P.outlineSoft} strokeWidth=".3" />
          <LogHouse x={30} y={58} w={26} h={16} winter={winter} lit={winter} />
          <circle cx="24" cy="50" r="7" fill={P.stone} stroke={P.outlineStone} strokeWidth=".6" />
          <circle cx="24" cy="50" r="1.4" fill={P.stoneDark} />
          <path d="M24 43v14M17 50h14" stroke={P.stoneDark} strokeWidth=".4" />
          {Array.from({ length: flax }, (_, i) => {
            const x = 8 + ((i * 13) % 66)
            const y = 62 + ((i * 5) % 6)
            if (winter) return <path key={i} d={`M${x} ${y}v-2`} stroke={P.woodLight} strokeWidth=".5" />
            return (
              <g key={i}>
                <path d={`M${x} ${y}v-5`} stroke={autumn ? P.woodLight : P.leafDark} strokeWidth=".4" />
                <circle cx={x} cy={y - 5.4} r=".9" fill={season === 'summer' ? P.denim : autumn ? P.woodMid : P.leafPale} />
              </g>
            )
          })}
          {tier >= 2 ? [60, 63, 66].map((x) => <Jar key={x} x={x} y={57} c={P.gold} s={0.45} />) : null}
          {tier >= 3 ? <Smoke x={50} y={36} /> : null}
          {tier >= 3 ? <rect x="48" y="36" width="3" height="5" fill={P.stone} /> : null}
          {tier >= 4 ? <Barrel x={70} y={58} s={0.5} /> : null}
          {tier >= 5 ? <Person x={16} y={66} c={P.yellow} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'kahnanleger': {
      const punts = Math.min(3, Math.ceil(tier / 2))
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="40" rx="38" ry="8" fill={winter ? P.frost : P.leaf} stroke={P.outlineSoft} strokeWidth=".3" />
          <WaterBand y={56} h={20} frozen={winter} />
          <rect x="6" y="42" width="30" height="4" fill={P.wood} stroke={P.outlineWood} strokeWidth=".4" />
          {[8, 18, 28, 34].map((x) => (
            <path key={x} d={`M${x} 46v10`} stroke={P.woodDark} strokeWidth="1.2" />
          ))}
          {Array.from({ length: punts }, (_, i) => (
            <Punt key={i} x={[50, 44, 56][i]!} y={[52, 60, 66][i]!} w={28} />
          ))}
          {tier >= 2 ? <path d="M48 52V30" stroke={P.woodLight} strokeWidth=".8" /> : null}
          {tier >= 2 ? <Person x={46} y={50} c={P.denim} s={0.8} /> : null}
          {tier >= 4 ? <Person x={52} y={50} c={P.red} s={0.7} /> : null}
          {tier >= 4 ? <Person x={56} y={50} c={P.yellow} s={0.7} /> : null}
          {tier >= 3 ? <path d="M8 42v-8h8v8M7 34h10" stroke={P.woodDark} strokeWidth=".8" fill="none" /> : null}
          {tier >= 5 ? <Alder x={70} y={42} s={0.7} season={season} /> : null}
        </Svg>
      )
    }
    case 'fliessgarten': {
      const n = Math.min(10, 2 + tier * 2)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="48" rx="38" ry="12" fill={winter ? P.frost : P.leaf} stroke={P.outlineSoft} strokeWidth=".3" />
          <rect x="10" y="40" width="58" height="14" rx="2" fill={winter ? P.white : P.soil} stroke={P.outlineWood} strokeWidth=".3" />
          {Array.from({ length: n }, (_, i) => {
            const x = 14 + (i % 5) * 12
            const y = 46 + Math.floor(i / 5) * 6
            if (winter) return <path key={i} d={`M${x - 2} ${y}h4`} stroke={P.woodLight} strokeWidth=".8" />
            if (i % 2)
              return (
                <g key={i}>
                  <path d={`M${x} ${y}v-9`} stroke={P.leafDark} strokeWidth=".6" />
                  <circle cx={x} cy={y - 10} r={spring ? 1.2 : 2.2} fill={autumn ? P.orange : spring ? P.leafPale : P.yellow} stroke={P.autumnDark} strokeWidth=".2" />
                  {!spring ? <circle cx={x} cy={y - 10} r=".8" fill={P.seed} /> : null}
                </g>
              )
            return <ellipse key={i} cx={x} cy={y - 1.6} rx="3" ry="2" fill={autumn ? P.winterLeaf : P.leaf} stroke={P.leafDark} strokeWidth=".2" />
          })}
          <WaterBand y={63} h={10} frozen={winter} />
          {tier >= 2 ? <path d="M70 48h4l-.6 4h-2.8z" fill={P.metal} /> : null}
          {tier >= 3 ? <path d="M6 40v12M6 42l4 1" stroke={P.woodDark} strokeWidth=".7" /> : null}
          {tier >= 4 ? <Person x={74} y={58} c={P.leafDark} s={0.7} /> : null}
          {tier >= 5 ? <Punt x={40} y={65} w={22} cargo={[P.leafDark, P.leafDark, P.yellow]} /> : null}
        </Svg>
      )
    }
    case 'einlegekueche': {
      const barrels = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <LogHouse x={8} y={60} w={30} h={20} winter={winter} lit={winter || tier >= 4} />
          {Array.from({ length: barrels }, (_, i) => (
            <Barrel key={i} x={46 + (i % 2) * 12} y={64 - Math.floor(i / 2) * 2 - (i > 1 ? 10 : 0)} s={0.8} />
          ))}
          {tier >= 2 ? <rect x="44" y="46" width="30" height="2" fill={P.woodDark} /> : null}
          {tier >= 2 ? [48, 54, 60, 66].map((x) => <Jar key={x} x={x} y={46} c={P.leafPale} s={0.5} />) : null}
          {tier >= 3 && !winter ? <path d="M70 64v-10M70 58l-2 -2M70 56l2 -2M68 54q2 -2 4 0" stroke={P.leafDark} strokeWidth=".5" fill="none" /> : null}
          {tier >= 3 ? <Smoke x={30} y={30} /> : null}
          {tier >= 5 ? <Person x={74} y={68} c={P.cream} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'holzschuppen': {
      const stacks = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          <path d="M10 64V36H60V64" fill={P.woodDark} stroke={P.outline} strokeWidth=".5" />
          <path d="M6 37L35 26L64 37z" fill={P.woodMid} stroke={P.outline} strokeWidth=".5" />
          {Array.from({ length: stacks }, (_, r) =>
            Array.from({ length: 8 }, (_, k) => <circle key={`${r}-${k}`} cx={14.4 + k * 5.6 + (r % 2) * 2.8} cy={61 - r * 5} r="2.6" fill={(k + r) % 3 ? P.woodLight : P.wood} stroke={P.outlineWood} strokeWidth=".4" />),
          )}
          {tier >= 2 ? <rect x="66" y="60" width="8" height="4" fill={P.bark} stroke={P.outline} strokeWidth=".3" /> : null}
          {tier >= 2 ? <path d="M70 60l3 -6" stroke={P.woodDark} strokeWidth=".7" /> : null}
          {tier >= 3 ? <path d="M70.4 55l3 -1.6l.6 1.6z" fill={P.metal} /> : null}
          {tier >= 5 ? <Person x={68} y={68} c={P.red} s={0.7} /> : null}
          {winter ? <Snowcap d="M8 36L35 26L62 36" /> : null}
        </Svg>
      )
    }
    case 'trachtenhaus':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          <LogHouse x={10} y={62} w={36} h={20} winter={winter} lit={winter} gable={P.leafMoss} />
          {/* Bemalte Truhe mit Bändern (Heimatstube) */}
          <g transform="translate(57 64) scale(1.2)">
            <rect x="-7" y="-7" width="14" height="7" fill={P.berry} stroke={P.outlineWood} strokeWidth=".3" />
            <path d="M-7.4 -7h14.8l-1 -2.6h-12.8z" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" />
            <rect x="-1" y="-6.4" width="2" height="1.6" fill={P.brass} />
            {tier >= 2 ? (
              <g>
                <circle cx="-3.6" cy="-3" r="1.3" fill={P.yellow} />
                <circle cx="3.6" cy="-3" r="1.3" fill={P.white} />
                <path d="M-5.6 -1.4h11.2" stroke={P.leafLight} strokeWidth=".6" />
              </g>
            ) : null}
            {tier >= 3 ? (
              <g>
                <path d="M3 -9.4q2 3 .6 6.4" stroke={P.blue} strokeWidth=".7" fill="none" />
                <path d="M5 -9.4q2 3 .8 6" stroke={P.gold} strokeWidth=".7" fill="none" />
              </g>
            ) : null}
          </g>
          {tier >= 3 ? <path d="M14 46h28" stroke={P.berry} strokeWidth=".8" strokeDasharray="1.4 .8" /> : null}
          {spring || tier >= 4 ? (
            <g>
              <path d={`M70 64V44M70 52l-4 -4M70 48l4 -4`} stroke={P.bark} strokeWidth=".7" />
              {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
                <Egg key={i} x={[66, 74, 70, 67, 73, 70][i]!} y={[48, 44, 50, 54, 52, 44][i]!} c={[P.berry, P.blue, P.yellow, P.leaf, P.plum, P.orange][i]!} />
              ))}
            </g>
          ) : null}
          {tier >= 5 ? <path d="M20 66h22l-2 -3h-18z" fill={P.wood} stroke={P.outlineWood} strokeWidth=".3" /> : null}
        </Svg>
      )
    case 'erlenwald': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="37" ry="9" fill={winter ? P.glass : P.water} stroke={P.waterDeep} strokeWidth=".4" />
          {Array.from({ length: n }, (_, i) => {
            const x = [40, 22, 58, 30, 66][i]!
            const y = [62, 58, 58, 66, 64][i]!
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx="3.6" ry="1.2" fill={P.leafMoss} />
                <Alder x={x} y={y} s={[1.1, 0.9, 0.9, 0.7, 0.75][i]!} season={season} />
              </g>
            )
          })}
          {!winter ? <path d="M10 64h8M60 68h8" stroke={P.waterLight} strokeWidth=".6" /> : null}
          {tier >= 3 && !winter ? <path d="M12 56q2 -4 1 -8M14 56q1 -3 3 -6" stroke={P.leafDark} strokeWidth=".6" fill="none" /> : null}
          {tier >= 4 ? <Punt x={48} y={68} w={20} /> : null}
          {tier >= 5 && !winter ? (
            <g transform="translate(26 44)">
              <ellipse cx="0" cy="0" rx="1.6" ry="1" fill={P.orange} />
              <ellipse cx="-.4" cy="-1" rx="1.6" ry=".9" fill={P.blue} />
              <path d="M1.2 -1l2 .2" stroke={P.ink} strokeWidth=".4" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'gurkenfest': {
      const boats = Math.min(3, Math.ceil(tier / 2))
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="38" rx="38" ry="8" fill={winter ? P.frost : P.leaf} stroke={P.outlineSoft} strokeWidth=".3" />
          <WaterBand y={56} h={22} frozen={winter} />
          {Array.from({ length: boats }, (_, i) => (
            <Punt key={i} x={[40, 28, 54][i]!} y={[56, 64, 66][i]!} w={26} cargo={[P.leafDark, P.leafDark, P.leaf, P.leafDark, P.leafDark]} />
          ))}
          {tier >= 2 ? <Bunting y={26} n={8} /> : null}
          {tier >= 3 ? [16, 24, 60, 68].map((x, i) => <Person key={x} x={x} y={42} c={[P.berry, P.yellow, P.denim, P.white][i]!} s={0.7} />) : null}
          {tier >= 4 ? <Stork x={70} y={26} s={0.8} /> : null}
          {tier >= 4 ? <path d="M64 26h12l-1 2h-10z" fill={P.woodDark} /> : null}
          {tier >= 5 ? (
            <g>
              <circle cx="40" cy="38" r="2" fill={P.gold} stroke={P.autumnDark} strokeWidth=".3" />
              <Person x={40} y={46} c={P.berry} s={0.8} />
            </g>
          ) : null}
        </Svg>
      )
    }
  }
  return null
}
