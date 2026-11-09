/** Kapitel-Grafik Kapitel 27: Steinfelder der Aran-Inseln (Inis Mór). */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { P } from '../palette'
import { type AreaProps, Person } from './partsB'
import { StringLights } from './partsC'
import { ThatchHouse, WaterBand } from './partsD'
import { DryWall, WoollySheep } from './partsE'

/** Kalksteinpflaster mit Spalten (Grikes). */
function Limestone({ cx = 40, cy = 60, rx = 36, ry = 10, wet }: { cx?: number; cy?: number; rx?: number; ry?: number; wet?: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={wet ? P.stone : P.stoneLight} stroke={P.outlineStone} strokeWidth=".4" />
      <path d={`M${cx - rx * 0.8} ${cy - 2}h${rx * 0.5}M${cx - rx * 0.2} ${cy + 3}h${rx * 0.7}M${cx - rx * 0.6} ${cy + 6}h${rx * 0.4}M${cx + rx * 0.1} ${cy - 5}h${rx * 0.5}M${cx - rx * 0.3} ${cy - 6}v${ry * 0.9}M${cx + rx * 0.4} ${cy - 1}v${ry * 0.7}`} stroke={P.stoneDark} strokeWidth=".5" />
    </g>
  )
}

/** Feld zwischen Mauern: Gras je Jahreszeit. */
function grass(season?: string): string {
  return season === 'winter' ? P.winterLeafLight : season === 'autumn' ? P.leafMoss : season === 'spring' ? P.leafPale : P.leaf
}

/** Seetang-Haufen. */
function Kelp({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="-1.6" rx="4" ry="2" fill={P.leafMoss} stroke={P.outline} strokeWidth=".2" />
      <path d="M-3 -2q1 -2 2 0q1 -2 2 0q1 -2 2 0" stroke={P.woodDark} strokeWidth=".5" fill="none" />
    </g>
  )
}

/** Currach: leichtes schwarzes Boot (Fußpunkt Mitte, Wasserlinie). */
function Currach({ x, y, s = 1, upturned }: { x: number; y: number; s?: number; upturned?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {upturned ? (
        <path d="M-9 0Q0 -6 9 0z" fill={P.ink} stroke={P.charcoal} strokeWidth=".3" />
      ) : (
        <g className="ha-swim">
          <path d="M-9 -2.6Q0 1.4 9 -3.4L7 0.2H-7z" fill={P.ink} stroke={P.charcoal} strokeWidth=".3" />
          <path d="M-3 -2l-3 -3M3 -2l3 -3" stroke={P.woodLight} strokeWidth=".4" />
        </g>
      )}
    </g>
  )
}

/** Papageitaucher (Puffin). */
function Puffin({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="-2.6" rx="1.6" ry="2.6" fill={P.ink} />
      <ellipse cx=".4" cy="-2" rx=".9" ry="1.8" fill={P.white} />
      <circle cx=".2" cy="-5.2" r="1.3" fill={P.ink} />
      <circle cx=".6" cy="-5.2" r=".7" fill={P.white} />
      <path d="M1.3 -5.6l1.6 .6l-1.6 .6z" fill={P.orange} />
      <path d="M-.4 0v.6M.6 0v.6" stroke={P.orange} strokeWidth=".4" />
    </g>
  )
}

export function Aranfelder({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  const g = grass(season)
  switch (id) {
    case 'feldmauern': {
      const walls = 1 + tier
      const segs: [number, number, number][] = [
        [6, 70, 68],
        [8, 58, 30],
        [42, 58, 30],
        [10, 48, 26],
        [44, 48, 26],
        [24, 40, 32],
      ]
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="37" ry="12" fill={g} />
          {[14, 26, 52, 64].map((x, i) => (
            <path key={x} d={`M${x} ${62 + (i % 2) * 2}l-1 -2M${x + 3} ${63}l1 -2`} stroke={P.leafDark} strokeWidth=".5" />
          ))}
          {Array.from({ length: walls }, (_, i) => (
            <DryWall key={i} x={segs[i]![0]} y={segs[i]![1]} w={segs[i]![2]} h={6} gaps />
          ))}
          {spring ? [20, 36, 58].map((x) => <circle key={x} cx={x} cy={64} r=".9" fill={P.blue} />) : null}
          {tier >= 5 ? <Person x={72} y={64} c={P.cream} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'tangbeete': {
      const piles = tier + 1
      return (
        <Svg tier={tier}>
          <WaterBand y={26} h={10} x0={0} x1={80} />
          <path d="M0 32Q40 28 80 32V36H0z" fill={P.paper} />
          <Limestone cy={58} ry={12} wet={winter} />
          {Array.from({ length: piles }, (_, i) => (
            <Kelp key={i} x={[22, 44, 60, 30, 52, 14][i]!} y={[56, 54, 60, 64, 66, 62][i]!} s={1.1} />
          ))}
          {tier >= 2 ? <ellipse cx="66" cy="50" rx="6" ry="2" fill={P.paper} stroke={P.woodLight} strokeWidth=".3" /> : null}
          {tier >= 3 ? <path d="M30 52h14v6h-14z" fill={g} stroke={P.soilDark} strokeWidth=".4" /> : null}
          {tier >= 4 ? <path d="M68 66q-3 -6 0 -8h6q3 2 0 8z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" /> : null}
          {tier >= 5 ? <Person x={74} y={58} c={P.denim} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'kartoffelfurchen': {
      const ridges = Math.min(6, tier + 1)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="37" ry="11" fill={P.stoneLight} />
          {Array.from({ length: ridges }, (_, i) => {
            const y = 52 + i * 3.4
            return (
              <g key={i}>
                <path d={`M10 ${y}Q40 ${y - 2.4} 70 ${y}v1.6Q40 ${y - 0.8} 10 ${y + 1.6}z`} fill={winter ? P.leafMoss : P.soil} stroke={P.soilDark} strokeWidth=".3" />
                {!winter
                  ? [16, 28, 40, 52, 64].map((x) => (
                      <g key={x}>
                        <ellipse cx={x} cy={y - 1.6} rx={spring ? 1 : 2} ry={spring ? 0.8 : 1.4} fill={autumn ? P.gold : P.leaf} />
                        {summer ? <circle cx={x + 0.6} cy={y - 2.6} r=".5" fill={P.white} /> : null}
                      </g>
                    ))
                  : null}
              </g>
            )
          })}
          {tier >= 3 ? <DryWall x={6} y={72} w={68} h={3.4} gaps /> : null}
          {tier >= 4 && autumn ? [62, 65, 68].map((x) => <ellipse key={x} cx={x} cy={46} rx="1.2" ry=".9" fill={P.woodLight} />) : null}
          {tier >= 4 ? <path d="M58 48h12l-1 -4h-10z" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 5 ? <Person x={74} y={54} c={P.leafDark} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'burrenblumen': {
      const flowers = 2 + tier * 2
      return (
        <Svg tier={tier}>
          <Limestone wet={winter} />
          {Array.from({ length: flowers }, (_, i) => {
            const x = 10 + ((i * 17) % 60)
            const y = 54 + ((i * 7) % 12)
            if (winter) return <path key={i} d={`M${x} ${y}l-1 -2M${x} ${y}l1 -2.4`} stroke={P.winterLeafDark} strokeWidth=".5" />
            const c = spring ? (i % 3 ? P.blue : P.yellow) : summer ? (i % 2 ? P.lilac : P.berry) : i % 2 ? P.lavender : P.leafMoss
            return (
              <g key={i}>
                <path d={`M${x} ${y}v-2.6`} stroke={P.leafDark} strokeWidth=".4" />
                <circle cx={x} cy={y - 3} r={spring ? 1.3 : 1} fill={c} stroke={P.outline} strokeWidth=".12" />
              </g>
            )
          })}
          {tier >= 3 ? <path d="M60 54l3 -6l3 6z" fill={P.stone} stroke={P.outlineStone} strokeWidth=".3" /> : null}
          {tier >= 5 ? <Person x={72} y={62} c={P.yellow} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'aranweide': {
      const sheep = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="37" ry="11" fill={g} />
          <DryWall x={4} y={52} w={72} h={4.4} gaps />
          <DryWall x={4} y={72} w={30} h={4.4} gaps />
          <DryWall x={44} y={72} w={32} h={4.4} gaps />
          {Array.from({ length: sheep }, (_, i) => (
            <WoollySheep key={i} x={[38, 22, 56, 30, 62][i]!} y={[62, 58, 60, 68, 67][i]!} s={0.9} flip={i % 2 === 1} />
          ))}
          {tier >= 3 ? [36, 39, 42].map((x) => <ellipse key={x} cx={x} cy={71} rx="1.4" ry="1" fill={P.stone} stroke={P.outlineStone} strokeWidth=".2" />) : null}
          {tier >= 5 ? <Person x={72} y={60} c={P.leafMoss} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'strickstube': {
      const balls = tier + 1
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="64" rx="37" ry="6" fill={g} />
          <rect x="8" y="30" width="44" height="32" fill={P.cream} stroke={P.stoneDark} strokeWidth=".5" />
          <path d="M4 31Q30 14 56 31z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
          <rect x="14" y="38" width="14" height="10" fill={P.lamp} stroke={P.leafDark} strokeWidth="1" />
          <path d="M21 38v10M14 43h14" stroke={P.leafDark} strokeWidth=".5" />
          <rect x="34" y="42" width="9" height="20" fill={P.berry} stroke={P.outlineWood} strokeWidth=".4" />
          {Array.from({ length: balls }, (_, i) => (
            <g key={i}>
              <circle cx={58 + (i % 3) * 5} cy={66 - Math.floor(i / 3) * 4} r="2.2" fill={[P.cream, P.paper, P.stoneLight, P.woodLight][i % 4]} stroke={P.outlineFur} strokeWidth=".3" />
              <path d={`M${56.6 + (i % 3) * 5} ${65 - Math.floor(i / 3) * 4}q1.4 1.6 2.8 0`} stroke={P.outlineFur} strokeWidth=".25" fill="none" />
            </g>
          ))}
          {tier >= 3 ? (
            <g>
              <circle cx="20" cy="66" r="4" fill="none" stroke={P.woodDark} strokeWidth=".7" />
              <path d="M20 66l3 4M16 70h8" stroke={P.woodDark} strokeWidth=".6" />
            </g>
          ) : null}
          {tier >= 4 ? <path d="M56 30h18M56 29V62M74 29V62" stroke={P.woodDark} strokeWidth=".5" /> : null}
          {tier >= 4 ? <path d="M60 30h8l2 3h-2v8h-8v-8h-2z" fill={P.cream} stroke={P.outlineFur} strokeWidth=".3" /> : null}
          {tier >= 5 ? <Person x={46} y={68} c={P.cream} s={0.65} /> : null}
          {winter ? <path className="smoke" d="M48 18c-2 -3 2 -5 0 -8" stroke={P.stoneLight} strokeWidth="1.4" fill="none" /> : null}
        </Svg>
      )
    }
    case 'strohcottage': {
      const ropes = 1 + tier
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="64" rx="37" ry="6" fill={g} />
          <ThatchHouse x={16} y={62} w={40} h={18} wall={P.white} winter={winter} lit={winter || autumn} />
          {Array.from({ length: ropes }, (_, i) => {
            const x = 18 + (i + 0.5) * (36 / ropes)
            return (
              <g key={i}>
                <path d={`M${x} 46Q${x + (x < 36 ? -2 : 2)} 34 ${36 + (x - 36) * 0.2} 26`} stroke={P.woodDark} strokeWidth=".4" fill="none" />
                <ellipse cx={x} cy={47} rx="1" ry=".8" fill={P.stone} />
              </g>
            )
          })}
          {tier >= 2 ? <rect x="50" y="22" width="4" height="8" fill={P.cream} stroke={P.stoneDark} strokeWidth=".3" /> : null}
          {tier >= 3 ? <path className="smoke" d="M52 20c-2 -3 2 -5 0 -8" stroke={P.stoneLight} strokeWidth="1.4" fill="none" /> : null}
          {tier >= 4 ? <path d="M62 66h10v-6h-10z" fill={P.soilDark} stroke={P.compost} strokeWidth=".3" /> : null}
          {tier >= 5 ? <Person x={10} y={70} c={P.berry} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'klippenpfad': {
      const marks = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <rect x="0" y="40" width="80" height="32" fill={P.waterDeep} />
          <path d="M8 42h10M30 50h12M56 64h8" stroke={P.waterLight} strokeWidth=".6" />
          <path d="M0 72V30L30 32L44 40L46 72z" fill={P.stone} stroke={P.outlineStone} strokeWidth=".4" />
          <path d="M0 30L30 32L44 40" stroke={g} strokeWidth="3" fill="none" />
          <path d="M44 40L46 72" stroke={P.stoneDark} strokeWidth="1" />
          <path d="M46 70q6 -3 12 0q6 -3 12 0" stroke={P.white} strokeWidth="1" fill="none" className="ha-swim" />
          {Array.from({ length: marks }, (_, i) => (
            <g key={i}>
              <path d={`M${6 + i * 8} ${31 + i * 0.6}v-4`} stroke={P.woodDark} strokeWidth=".6" />
              <rect x={5 + i * 8} y={26.6 + i * 0.6} width="2" height="1.4" fill={P.yellow} />
            </g>
          ))}
          {tier >= 3 ? <Puffin x={38} y={46} s={0.9} /> : null}
          {tier >= 4 ? <Puffin x={34} y={52} s={0.8} /> : null}
          {tier >= 5 ? <Person x={20} y={31} c={P.tomato} s={0.6} /> : null}
          {tier >= 2 ? <path d="M60 20q3 -2 6 0q3 -2 6 0" stroke={P.charcoal} strokeWidth=".5" fill="none" /> : null}
        </Svg>
      )
    }
    case 'hafenmauer': {
      const boats = Math.min(3, tier)
      return (
        <Svg tier={tier}>
          <WaterBand y={56} h={26} x0={0} x1={80} />
          <path d="M0 42H52V48H0z" fill={P.stone} stroke={P.outlineStone} strokeWidth=".4" />
          <path d="M52 42h4v28h-4z" fill={P.stoneDark} />
          <DryWall x={0} y={42} w={52} h={3} c={P.stone} />
          {Array.from({ length: boats }, (_, i) => (
            <Currach key={i} x={[20, 36, 66][i]!} y={[58, 64, 60][i]!} s={0.9} />
          ))}
          {tier >= 2 ? <Currach x={10} y={42} s={0.8} upturned /> : null}
          {tier >= 3 ? <path d="M36 42v-3M44 42v-3" stroke={P.charcoal} strokeWidth="1.4" /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M58 40H78L76 48H60z" fill={P.white} stroke={P.charcoal} strokeWidth=".4" />
              <rect x="64" y="34" width="8" height="6" fill={P.white} stroke={P.charcoal} strokeWidth=".3" />
              <rect x="66" y="31" width="2" height="3" fill={P.tomato} />
            </g>
          ) : null}
          {tier >= 5 ? <Person x={28} y={42} c={P.yellow} s={0.6} /> : null}
          {winter ? <path d="M4 32q6 -6 12 0" stroke={P.stoneLight} strokeWidth=".8" fill="none" /> : null}
        </Svg>
      )
    }
    case 'ceili': {
      const dancers = 1 + tier
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="62" rx="37" ry="9" fill={g} />
          <rect x="22" y="30" width="36" height="24" fill={P.cream} stroke={P.stoneDark} strokeWidth=".5" />
          <path d="M18 31Q40 16 62 31z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
          <rect x="36" y="40" width="8" height="14" fill={P.lamp} stroke={P.outlineWood} strokeWidth=".4" />
          {Array.from({ length: dancers }, (_, i) => {
            const a = (i / dancers) * Math.PI * 2
            return <Person key={i} x={40 + Math.cos(a) * 18} y={65 + Math.sin(a) * 4} c={[P.berry, P.leafDark, P.blue, P.yellow, P.cream, P.lilac][i]!} s={0.9} />
          })}
          {tier >= 2 ? <path d="M14 58l3 -4M15 56l4 1" stroke={P.woodDark} strokeWidth=".7" /> : null}
          {tier >= 3 ? <StringLights x0={6} x1={74} y={22} lit={winter || autumn || tier >= 4} /> : null}
          {tier >= 4 ? <Person x={12} y={60} c={P.charcoal} s={0.85} /> : null}
          {tier >= 5 ? <rect x="66" y="56" width="6" height="5" rx="1" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" /> : null}
        </Svg>
      )
    }
  }
  return null
}
