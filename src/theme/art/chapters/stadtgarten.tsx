/** Kapitel-Grafik Kapitel 13: Gemeinschaftsgarten in der Stadt (Hinterhof). */
import type { ReactNode } from 'react'
import { Roof, Smoke, Svg } from '../../HandParts'
import { Bunting, Snowcap } from './partsA'
import { Lettuce, Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Ground, Person } from './partsB'
import { BrickWall, Sign, StringLights, TomatoPlant } from './partsC'

/** Holzkiste als Beet (Fußpunkt Mitte unten). */
function Crate({ x, y, w, h, winter }: { x: number; y: number; w: number; h: number; winter?: boolean }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} fill={P.wood} stroke={P.outline} strokeWidth=".5" />
      <path d={`M${x - w / 2} ${y - h / 2}h${w}`} stroke={P.woodDark} strokeWidth=".5" />
      <rect x={x - w / 2} y={y - h - 2} width={w} height="2.4" fill={winter ? P.cream : P.soil} stroke={P.outline} strokeWidth=".4" />
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
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          {Array.from({ length: n }, (_, i) => {
            const x = [40, 20, 60][i]!
            const y = [64, 58, 58][i]!
            return (
              <g key={i}>
                <Crate x={x} y={y} w={18} h={10} winter={winter} />
                {!winter ? (
                  i === 0 && tier >= 2 ? (
                    [-5, 0, 5].map((dx) => <TomatoPlant key={dx} x={x + dx} y={y - 12} h={8 + tier} ripe={ripe} fruits={tier >= 3 ? 3 : 1} />)
                  ) : (
                    [-5, 0, 5].map((dx) => <Lettuce key={dx} x={x + dx} y={y - 12} s={0.5} />)
                  )
                ) : null}
              </g>
            )
          }).reverse()}
          {tier >= 3 ? <Sign x={8} y={64} c={P.label} /> : null}
          {tier >= 4 ? <Person x={70} y={66} c={P.denim} /> : null}
          {tier >= 5 ? <StringLights x0={6} x1={74} y={20} lit={winter || autumn} /> : null}
        </Svg>
      )
    }
    case 'palettenbeete':
      return (
        <Svg tier={tier}>
          <BrickWall x={6} y={60} w={68} h={30} />
          {Array.from({ length: Math.min(3, tier) }, (_, i) => {
            const x = 14 + i * 20
            return (
              <g key={i} transform={`rotate(-6 ${x + 8} 62)`}>
                {[0, 1, 2, 3].map((r) => (
                  <g key={r}>
                    <rect x={x} y={34 + r * 7} width="16" height="3.4" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
                    {!winter ? [3, 8, 13].map((dx) => <ellipse key={dx} cx={x + dx} cy={33.4 + r * 7} rx="2" ry="1.4" fill={r % 2 ? P.leafPale : P.leaf} />) : null}
                  </g>
                ))}
                <path d={`M${x + 2} 32v30M${x + 14} 32v30`} stroke={P.woodDark} strokeWidth="1" />
              </g>
            )
          })}
          <ellipse cx="40" cy="64" rx="34" ry="3" fill={P.stoneLight} />
          {tier >= 4 ? <path d="M62 64v-8h8v8M62 58h8" stroke={P.metal} strokeWidth=".8" fill="none" /> : null}
          {winter ? <Snowcap d="M6 30h68" /> : null}
        </Svg>
      )
    case 'regenspeicher': {
      const barrels = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <BrickWall x={0} y={62} w={22} h={44} />
          <path d="M0 18h22l3 3" stroke={P.metal} strokeWidth="1.8" fill="none" />
          <path d="M24 20v26q0 3 4 3h6" stroke={P.metal} strokeWidth="1.8" fill="none" />
          <Shadow grid="chapter" cx={50} rx={26} />
          {Array.from({ length: barrels }, (_, i) => {
            const x = 30 + i * 11
            return (
              <g key={i}>
                <rect x={x} y={50} width="10" height="14" rx="1.4" fill={i % 2 ? P.leafDark : P.denim} stroke={P.outline} strokeWidth=".5" />
                <ellipse cx={x + 5} cy={50} rx="5" ry="1.4" fill={winter ? P.white : P.waterDeep} stroke={P.outline} strokeWidth=".4" />
                <path d={`M${x} 55h10M${x} 60h10`} stroke={P.outline} strokeWidth=".3" opacity=".5" />
                {i < barrels - 1 ? <path d={`M${x + 10} 52h1`} stroke={P.metal} strokeWidth="1" /> : null}
              </g>
            )
          })}
          {tier >= 2 ? <path d={`M${30 + barrels * 11} 60h3v2`} stroke={P.brass} strokeWidth="1" fill="none" /> : null}
          {tier >= 3 && !winter ? <path className="ha-fish" d={`M${32 + barrels * 11} 63q1 2 0 3`} stroke={P.waterLight} strokeWidth=".8" fill="none" /> : null}
          {tier >= 4 ? <path d="M64 64q-2-4 0-6h6q2 2 0 6z" fill={P.leaf} stroke={P.leafDark} strokeWidth=".4" /> : null}
          {tier >= 5 ? <Person x={74} y={66} c={P.yellow} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'wurmkiste': {
      const boxes = Math.min(3, Math.ceil(tier / 2))
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          {Array.from({ length: boxes }, (_, i) => (
            <g key={i}>
              <rect x={22} y={56 - i * 9} width="34" height="9" fill={i % 2 ? P.woodMid : P.wood} stroke={P.outline} strokeWidth=".5" />
              {[0, 1, 2].map((k) => (
                <circle key={k} cx={28 + k * 11} cy={60.4 - i * 9} r=".7" fill={P.soilDark} />
              ))}
            </g>
          ))}
          <rect x={21} y={54 - (boxes - 1) * 9 - 2} width="36" height="3" rx=".8" fill={P.woodDark} stroke={P.outline} strokeWidth=".4" />
          <ellipse cx="66" cy="62" rx="8" ry="4" fill={P.compost} />
          {tier >= 2 ? <path d="M62 60q2-2 4 0t4 0" stroke={P.pink} strokeWidth="1" fill="none" className="ha-swim" /> : null}
          {tier >= 3 ? <path d="M10 64v-8l4-1v9z" fill={P.metal} /> : null}
          {tier >= 3 && !winter ? <ellipse cx="12" cy="56" rx="3" ry="1.4" fill={P.leafPale} /> : null}
          {tier >= 4 ? <Sign x={66} y={56} /> : null}
          {tier >= 5 ? <Person x={14} y={68} c={P.red} s={0.8} /> : null}
          {winter ? <Snowcap d={`M22 ${53 - (boxes - 1) * 9}h34`} /> : null}
        </Svg>
      )
    }
    case 'kraeuterleiter': {
      const rungs = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <BrickWall x={12} y={64} w={56} h={56} />
          <path d="M28 66 L36 12M52 66 L44 12" stroke={P.woodDark} strokeWidth="1.6" />
          {Array.from({ length: rungs }, (_, i) => {
            const y = 60 - i * 10
            const t = (66 - y) / 54
            const xl = 28 + 8 * t
            const xr = 52 - 8 * t
            return (
              <g key={i}>
                <path d={`M${xl} ${y}H${xr}`} stroke={P.woodMid} strokeWidth="1.6" />
                {[0, 1].map((k) => {
                  const x = xl + 3 + k * (xr - xl - 6)
                  return (
                    <g key={k}>
                      <path d={`M${x - 2.4} ${y - 4}h4.8l-.8 4h-3.2z`} fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".3" />
                      {!winter ? <ellipse cx={x} cy={y - 5} rx="2.8" ry="2" fill={[P.leaf, P.leafMoss, P.leafPale][(i + k) % 3]} /> : null}
                      {season === 'summer' && (i + k) % 3 === 0 ? <circle cx={x} cy={y - 6.4} r=".7" fill={P.lilac} /> : null}
                    </g>
                  )
                })}
              </g>
            )
          })}
          {tier >= 4 ? <path d="M58 64q-2-6 2-8 4 2 2 8z" fill={P.leafDark} /> : null}
          {tier >= 5 ? <Person x={66} y={66} c={P.leaf} s={0.8} /> : null}
          {winter ? <Snowcap d="M12 8h56" /> : null}
        </Svg>
      )
    }
    case 'saatgutbibliothek': {
      const drawers = Math.min(4, 1 + tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={22} />
          <path d="M38 66v-8M42 66v-8" stroke={P.woodDark} strokeWidth="1.4" />
          <rect x="26" y="26" width="28" height="32" fill={P.wood} stroke={P.outline} strokeWidth=".6" />
          <Roof x={26} w={28} y={26} color={P.leafDark} steep={8} />
          {Array.from({ length: drawers }, (_, i) => (
            <g key={i}>
              <rect x="29" y={29 + i * 7} width="22" height="5.6" fill={P.paper} stroke={P.outlineWood} strokeWidth=".4" />
              <circle cx="40" cy={31.8 + i * 7} r=".7" fill={P.brass} />
              {[32, 36, 44, 48].map((x, k) => <rect key={k} x={x - 1} y={30 + i * 7} width="2" height="3" fill={[P.red, P.yellow, P.leaf, P.lilac][(i + k) % 4]} opacity=".8" />)}
            </g>
          ))}
          {tier >= 3 ? <Sign x={62} y={64} c={P.label} /> : null}
          {tier >= 4 ? <Person x={18} y={66} c={P.lilac} /> : null}
          {tier >= 5 ? <Person x={68} y={68} c={P.blue} s={0.7} /> : null}
          {winter ? <Snowcap d="M24 26L40 18L56 26" /> : null}
        </Svg>
      )
    }
    case 'lastenrad': {
      const load = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Ground color={P.stoneLight} />
          <circle cx="20" cy="58" r="6" fill="none" stroke={P.charcoal} strokeWidth="1.4" />
          <circle cx="60" cy="58" r="6" fill="none" stroke={P.charcoal} strokeWidth="1.4" />
          <path d="M20 58h12l8-12h12l8 12M40 46l-4 12M52 46l-2-8h-4" stroke={P.denim} strokeWidth="1.4" fill="none" />
          <path d="M58 38h4" stroke={P.charcoal} strokeWidth="1.2" />
          <rect x="10" y="44" width="22" height="10" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".5" />
          {Array.from({ length: load }, (_, i) => {
            const k = i % 4
            return k === 0 ? (
              <ellipse key={i} cx="16" cy="43" rx="5" ry="2.4" fill={P.soil} />
            ) : k === 1 ? (
              <rect key={i} x="21" y="38" width="9" height="6" fill={P.wood} stroke={P.outlineWood} strokeWidth=".4" />
            ) : k === 2 ? (
              <g key={i}>{!winter ? <TomatoPlant x={25} y={38} h={6} ripe={ripe} fruits={2} /> : <ellipse cx="25" cy="36" rx="3" ry="1.4" fill={P.white} />}</g>
            ) : (
              <circle key={i} cx="13" cy="38" r="2.4" fill={P.skin} />
            )
          })}
          {tier >= 3 ? <Person x={46} y={46} c={P.tomato} s={0.9} /> : null}
          {tier >= 5 ? <path d="M10 44l-2-10 8 3z" fill={P.yellow} stroke={P.outlineWood} strokeWidth=".3" /> : null}
        </Svg>
      )
    }
    case 'lehmofen':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          <rect x="18" y="52" width="40" height="12" fill={P.stone} stroke={P.outlineStone} strokeWidth=".5" />
          <path d={tier >= 2 ? 'M22 52 Q22 26 38 26 Q54 26 54 52z' : 'M24 52 Q30 42 38 42 Q46 42 52 52z'} fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".6" />
          {tier >= 2 ? <path d="M32 52v-8a6 6 0 0 1 12 0v8z" fill={tier >= 3 ? P.amber : P.soilDark} className={tier >= 3 ? 'fest-glow' : undefined} /> : null}
          {tier >= 3 ? <path d="M46 30v-6h4v8" fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".4" /> : null}
          {tier >= 3 ? <Smoke x={48} y={22} /> : null}
          {tier >= 4 ? (
            <g>
              <rect x="60" y="54" width="14" height="2" fill={P.woodDark} />
              <path d="M62 56v8M72 56v8" stroke={P.woodDark} strokeWidth="1" />
              <circle cx="67" cy="53" r="3" fill={P.amber} stroke={P.tomato} strokeWidth=".8" />
            </g>
          ) : null}
          {tier >= 5 ? <Person x={10} y={66} c={P.leafDark} /> : null}
          {winter ? <Snowcap d="M26 34 Q38 22 50 34" /> : null}
        </Svg>
      )
    case 'werkstatt':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <rect x="10" y="34" width="54" height="30" fill={P.denim} stroke={P.outline} strokeWidth=".6" />
          {Array.from({ length: 13 }, (_, i) => (
            <path key={i} d={`M${12 + i * 4} 35v28`} stroke={P.blue} strokeWidth=".8" opacity=".6" />
          ))}
          <rect x="40" y="38" width="20" height="26" fill={P.charcoal} />
          {tier >= 2 ? (
            <g stroke={P.metal} strokeWidth="1">
              <path d="M44 42v14M50 42v12M56 42v16" />
              <path d="M42 42h4M48 42h4l-2 3" />
            </g>
          ) : null}
          {tier >= 3 ? <rect x="14" y="44" width="16" height="2" fill={P.woodLight} /> : null}
          {tier >= 3 ? <Sign x={22} y={44} c={P.yellow} /> : null}
          {tier >= 4 ? <StringLights x0={10} x1={64} y={34} sag={2} n={9} lit={winter || autumn || tier >= 5} /> : null}
          {winter && tier >= 2 ? (
            <g>
              <rect x="66" y="56" width="8" height="8" rx="1" fill={P.tomato} stroke={P.outline} strokeWidth=".4" />
              <Smoke x={70} y={54} />
            </g>
          ) : tier >= 5 ? (
            <Person x={70} y={66} c={P.orange} />
          ) : null}
          {winter ? <Snowcap d="M10 34h54" /> : null}
        </Svg>
      )
    case 'hoffest': {
      const guests = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <Ground color={P.stoneLight} winter={winter} />
          <path d="M6 66V16M74 66V16" stroke={P.woodDark} strokeWidth="1.2" />
          <StringLights x0={6} x1={74} y={18} n={Math.min(11, 4 + tier * 2)} lit={tier >= 2} />
          {tier >= 3 ? <StringLights x0={6} x1={74} y={28} sag={3} n={9} lit /> : null}
          <rect x="16" y="50" width="48" height="3" fill={P.wood} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M20 53v10M60 53v10" stroke={P.woodDark} strokeWidth="1.2" />
          {[24, 34, 46, 56].slice(0, Math.min(4, tier)).map((x, i) => (
            <circle key={x} cx={x} cy={49} r="1.6" fill={[P.tomato, P.yellow, P.leaf, P.orange][i]} />
          ))}
          {Array.from({ length: guests }, (_, i) => (
            <Person key={i} x={18 + i * 11} y={i % 2 ? 66 : 50} c={[P.blue, P.red, P.leaf, P.lilac, P.yellow][i]!} s={i % 2 ? 1 : 0.8} />
          ))}
          {tier >= 5 ? <Bunting y={8} n={9} x0={6} x1={74} /> : null}
        </Svg>
      )
    }
  }
  return null
}
