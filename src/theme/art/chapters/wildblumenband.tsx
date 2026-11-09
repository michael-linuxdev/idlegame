/**
 * Kapitel-Grafik Kapitel 45: Wildblumenband vom Moor bis in die Stadt.
 * Jahreszeiten: Frühling = Knospen, Hecke blüht weiß; Sommer = Mohn und
 * Kornblumen, Hummeln; Herbst = Samenstände, Schlehen und Hagebutten, Laub;
 * Winter = trockene Stängel mit Schnee, Totholz und Steine verschneit.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Bunting } from './partsA'
import type { AreaProps } from './partsB'
import { Patch } from './partsF'
import { Bee, Cloud, Packet, Signpost, Snowfall, Sun } from './partsH'
import { Floor, Partridge, Shrub, Table, Tuft, WildFlower } from './partsI'
import { Butterfly } from './partsA'
import { P } from '../palette'
import { Farmer, Kid } from './figures'
import { ssn } from './season'

/** Himmel: Sommer Sonne, Frühling Wolke, Herbst Wolke grau, Winter Schnee. */
function Sky({ season }: { season?: string }) {
  const z = ssn(season)
  if (z === 'summer') return <g className="art-sky"><Sun x={70} y={10} r={3.2} /></g>
  if (z === 'spring') return <g className="art-sky"><Cloud x={16} y={10} s={1.1} /></g>
  if (z === 'autumn') return <g className="art-sky"><Cloud x={62} y={10} s={1.2} c={P.stoneLight} /></g>
  return <g className="art-sky"><Snowfall n={7} y1={34} /></g>
}

/** Hummeln und Falter nur im Frühling/Sommer. */
function Buzz({ n, season, y0 = 30 }: { n: number; season?: string; y0?: number }) {
  const z = ssn(season)
  if (z === 'winter' || z === 'autumn') return null
  return (
    <g>
      {Array.from({ length: n }, (_, i) =>
        i % 3 === 2 ? <Butterfly key={i} x={14 + ((i * 23) % 52)} y={y0 + ((i * 7) % 12)} c={i % 2 ? P.yellow : P.white} /> : <Bee key={i} x={12 + ((i * 19) % 56)} y={y0 + ((i * 11) % 14)} s={1.3} bumble />,
      )}
    </g>
  )
}

/** Feldstein. */
function Stone({ x, y, r = 2.6, c = P.stone, snow }: { x: number; y: number; r?: number; c?: string; snow?: boolean }) {
  return (
    <g>
      <ellipse cx={x} cy={y - r * 0.6} rx={r} ry={r * 0.7} fill={c} stroke={P.outlineStone} strokeWidth=".3" />
      <ellipse cx={x - r * 0.3} cy={y - r * 0.9} rx={r * 0.4} ry={r * 0.2} fill={P.white} opacity=".25" />
      {snow ? <path d={`M${x - r * 0.7} ${y - r * 1.15}q${r * 0.7} -.6 ${r * 1.4} 0`} stroke={P.white} strokeWidth=".9" fill="none" /> : null}
    </g>
  )
}

/** Eidechse auf dem Stein. */
function Lizard({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 4} ${y}q2 -1 4 0t4 -.6`} stroke={P.leafDark} strokeWidth="1" fill="none" strokeLinecap="round" />
      <ellipse cx={x + 3.6} cy={y - 0.5} rx="1.1" ry=".6" fill={P.leafDark} />
      <path d={`M${x - 1} ${y}l-.6 1M${x + 1.6} ${y - 0.2}l.6 1`} stroke={P.leafDark} strokeWidth=".4" />
    </g>
  )
}

export function Wildblumenband({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  const spring = z === 'spring'
  const autumn = z === 'autumn'
  switch (id) {
    case 'bluehstreifen': {
      const n = 6 + tier * 4
      return (
        <Svg tier={tier}>
          <Patch fill={winter ? P.cream : P.soil} cx={40} cy={62} rx={36} ry={8} edge={P.outlineSoft} />
          <path d="M6 60q34 -6 68 0" stroke={winter ? P.white : spring ? P.leafLight : autumn ? P.gold : P.leaf} strokeWidth="9" strokeLinecap="round" fill="none" />
          {Array.from({ length: n }, (_, i) => (
            <WildFlower key={i} x={8 + ((i * 13) % 64)} y={64 - ((i * 5) % 8)} kind={i} season={season} h={8 + (i % 3) * 2} />
          ))}
          <Buzz n={Math.max(0, tier - 1)} season={season} y0={40} />
          {tier >= 5 ? <Farmer x={70} y={66} c={P.leafDark} s={1.15} hat={P.woodLight} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'totholz': {
      const ends = Math.min(10, 2 + tier * 2)
      const slots: [number, number][] = [[24, 62], [30.4, 62], [36.8, 62], [43.2, 62], [27.2, 56.6], [33.6, 56.6], [40, 56.6], [30.4, 51.2], [36.8, 51.2], [33.6, 45.8]]
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <path d="M18 62l34 -10M20 60l28 -14M46 50l4 -5" stroke={P.bark} strokeWidth="1.6" strokeLinecap="round" />
          {slots.slice(0, ends).map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="3.1" fill={i % 3 === 1 ? P.wood : P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
              <circle cx={x} cy={y} r="1.5" fill="none" stroke={P.woodMid} strokeWidth=".3" />
              <circle cx={x} cy={y} r=".4" fill={P.woodMid} />
            </g>
          ))}
          {winter ? <path d={`M${slots[ends - 1]![0] - 3} ${slots[ends - 1]![1] - 2.6}q3 -1.6 6 0`} stroke={P.white} strokeWidth="1.2" fill="none" strokeLinecap="round" /> : null}
          {tier >= 2 ? <path d="M48 62l10 -9M54 57l3 1M52 64l12 -3M60 62l2 -2" stroke={P.bark} strokeWidth="1" strokeLinecap="round" /> : null}
          {tier >= 3 ? (
            <g>
              <ellipse cx="58" cy="65" rx="2" ry="1.2" fill={P.woodDark} />
              <path d="M59.6 64.4l1.6 -1.6l.7 .7M59.6 65.2l1.6 .9" stroke={P.woodDark} strokeWidth=".5" />
            </g>
          ) : null}
          {tier >= 3 && !winter ? Array.from({ length: tier }, (_, i) => <ellipse key={i} cx={slots[i]![0] + 1.6} cy={slots[i]![1] - 2.6} rx="1.4" ry=".7" fill={spring ? P.leafLight : P.leafMoss} />) : null}
          {tier >= 4 ? (
            <g>
              <path d="M8 66Q7 60 11.4 59Q16 58 17 62.6L18.4 65z" fill={P.bark} stroke={P.woodDark} strokeWidth=".3" />
              <path d="M9 61.6l-1 -1M11.4 59.4l-.4 -1.2M14 59.4l.4 -1.2M16 61l1 -.6" stroke={P.woodDark} strokeWidth=".5" />
              <circle cx="18.2" cy="64.4" r=".4" fill={P.ink} />
            </g>
          ) : null}
          {tier >= 5 ? <Kid x={68} y={70} c={P.yellow} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'sandarium': {
      const holes = tier * 3
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <ellipse cx="40" cy="60" rx="28" ry="7" fill={winter ? P.white : P.paper} stroke={P.woodLight} strokeWidth=".6" />
          <path d="M12 60q4 -6 10 -7q10 -1 18 -1q10 0 18 1q6 1 10 7" stroke={P.woodMid} strokeWidth="1.2" fill="none" />
          {Array.from({ length: holes }, (_, i) => {
            const x = 18 + ((i * 7.3) % 44)
            const y = 58 + ((i * 3.7) % 6)
            return (
              <g key={i}>
                <ellipse cx={x + 0.9} cy={y + 0.2} rx="1.1" ry=".5" fill={P.woodLight} />
                <circle cx={x} cy={y} r=".5" fill={winter ? P.stone : P.soilDark} />
              </g>
            )
          })}
          {Array.from({ length: Math.min(3, tier) }, (_, i) => (
            <Tuft key={i} x={14 + i * 26} y={64 - (i % 2)} season={season} h={4} />
          ))}
          {summer || spring ? Array.from({ length: tier }, (_, i) => <Bee key={i} x={22 + i * 9} y={48 - (i % 2) * 4} s={1.4} />) : null}
          {tier >= 4 ? <Signpost x={66} y={64} dir="left" c={P.paper} /> : null}
          {tier >= 5 ? <Kid x={70} y={70} c={P.berry} s={1.5} hair={P.woodDark} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'feldrain': {
      const tufts = 3 + tier * 2
      const fl = tier * 2
      return (
        <Svg tier={tier}>
          <Patch fill={winter ? P.cream : P.soil} cx={40} cy={62} rx={36} ry={9} edge={P.outlineSoft} />
          {Array.from({ length: 14 }, (_, i) => {
            const x = 8 + (i % 7) * 4.2 + Math.floor(i / 7) * 2
            const y = 58 + Math.floor(i / 7) * 5
            const c = winter ? P.woodLight : autumn ? P.soilDark : spring ? P.leafLight : P.gold
            return autumn || winter ? (
              <path key={i} d={`M${x} ${y}v-2`} stroke={c} strokeWidth=".8" />
            ) : (
              <g key={i}>
                <path d={`M${x} ${y}v-${spring ? 4 : 9}`} stroke={c} strokeWidth=".6" />
                {summer ? <ellipse cx={x} cy={y - 9.6} rx=".7" ry="1.6" fill={P.gold} stroke={P.woodMid} strokeWidth=".15" /> : null}
              </g>
            )
          })}
          <path d="M54 70q2 -10 8 -18h5q-3 8 -1 18z" fill={winter ? P.white : P.woodLight} />
          {Array.from({ length: tufts }, (_, i) => (
            <Tuft key={i} x={38 + ((i * 3.1) % 14)} y={66 - ((i * 7) % 10)} season={season} h={4 + (i % 3)} />
          ))}
          {Array.from({ length: fl }, (_, i) => (
            <WildFlower key={i} x={39 + ((i * 4.3) % 12)} y={64 - ((i * 5) % 9)} kind={i + 1} season={season} h={6} />
          ))}
          {tier >= 3 ? <Stone x={46} y={66} r={2} snow={winter} /> : null}
          {tier >= 4 ? <Partridge x={44} y={60} s={1.2} /> : null}
          {tier >= 5 ? <Farmer x={64} y={64} c={P.blue} s={1.15} hat={P.woodLight} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'feldhecke': {
      const n = 1 + tier
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Shrub key={i} x={12 + i * (56 / Math.max(1, n - 1))} y={60 + (i % 2) * 2} s={1.45} season={season} n={3 + tier} fruit={i % 2 ? P.berry : P.plum} />
          ))}
          {Array.from({ length: tier }, (_, i) => (
            <Tuft key={i} x={10 + i * 14} y={66} season={season} />
          ))}
          {tier >= 3 ? <Partridge x={30} y={67} s={1.3} /> : null}
          {tier >= 4 && !winter ? [0, 1, 2].map((i) => <ellipse key={i} cx={36 + i * 2.6} cy={66.6} rx=".9" ry=".7" fill={P.woodLight} stroke={P.woodMid} strokeWidth=".2" />) : null}
          {tier >= 4 ? <Partridge x={46} y={67} s={1.2} flip /> : null}
          {tier >= 5 ? <Farmer x={70} y={68} c={P.leafDark} s={1.15} hat={P.woodLight} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'tuempel': {
      const reeds = 2 + tier * 2
      const w = summer ? 14 : 20
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <ellipse cx="40" cy="61" rx="24" ry="6" fill={summer ? P.soil : P.soilDark} />
          <ellipse cx="40" cy="61" rx={w} ry={summer ? 3.4 : 4.6} fill={winter ? P.glassEdge : P.pond} stroke={winter ? P.frost : P.waterDeep} strokeWidth=".4" />
          {winter ? <path d="M30 60l6 1.4M44 62l5 -1" stroke={P.white} strokeWidth=".5" /> : <path d="M32 60h6M44 62h4" stroke={P.waterLight} strokeWidth=".6" />}
          {Array.from({ length: reeds }, (_, i) => {
            const left = i % 2 === 0
            const x = left ? 16 + (i % 5) * 1.8 : 64 - (i % 5) * 1.8
            return (
              <g key={i}>
                <path d={`M${x} 62v-${9 + (i % 3) * 2}`} stroke={winter ? P.woodLight : autumn ? P.gold : P.leafDark} strokeWidth="1" />
                {(summer || autumn) && i % 3 === 0 ? <rect x={x - 0.6} y={52 - (i % 3) * 2} width="1.2" height="3" rx=".5" fill={P.woodDark} /> : null}
              </g>
            )
          })}
          {tier >= 2 && !winter ? [34, 46].slice(0, tier >= 3 ? 2 : 1).map((x) => <ellipse key={x} cx={x} cy={61} rx="2" ry=".9" fill={P.leaf} />) : null}
          {tier >= 3 && spring ? Array.from({ length: 5 }, (_, i) => <circle key={i} cx={42 + (i % 3)} cy={60 + Math.floor(i / 3)} r=".5" fill={P.ink} stroke={P.glass} strokeWidth=".3" />) : null}
          {tier >= 3 ? (
            <g>
              <ellipse cx="50" cy="61.4" rx="1.6" ry="1" fill={winter ? P.stone : P.leafMoss} />
              {!winter ? <circle cx="50.8" cy="60.6" r=".5" fill={P.leafMoss} /> : null}
            </g>
          ) : null}
          {tier >= 4 && !winter ? (
            <g>
              <path d="M28 44h6" stroke={P.blue} strokeWidth="1" />
              <ellipse cx="30" cy="43.4" rx="1.6" ry=".6" fill={P.glass} opacity=".9" />
              <ellipse cx="32" cy="43.4" rx="1.6" ry=".6" fill={P.glass} opacity=".9" />
            </g>
          ) : null}
          {tier >= 4 ? <Stone x={60} y={66} r={2} snow={winter} /> : null}
          {tier >= 5 ? (
            <g>
              <Kid x={68} y={70} c={P.yellow} s={1.5} />
              <path d="M70 62l6 -8" stroke={P.woodDark} strokeWidth=".5" />
              <ellipse cx="76.4" cy="53.4" rx="1.6" ry="1" fill={P.white} opacity=".8" />
            </g>
          ) : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'steinriegel': {
      const stones = 3 + tier * 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: stones }, (_, i) => {
            const row = i < 5 ? 0 : i < 9 ? 1 : i < 12 ? 2 : 3
            const k = [i, i - 5, i - 9, i - 12][row]!
            const x = 20 + k * 8 + row * 4
            const top = stones > 12 ? 3 : stones > 9 ? 2 : stones > 5 ? 1 : 0
            return <Stone key={i} x={x} y={64 - row * 4.4} r={3.8 - row * 0.3} c={[P.stone, P.stoneLight, P.stoneDark][(i + row) % 3]} snow={winter && row === top} />
          })}
          {!winter ? Array.from({ length: tier }, (_, i) => <WildFlower key={i} x={20 + i * 10} y={62 - (i % 2) * 4} kind={i % 2 ? 3 : 2} season={season} h={5} />) : null}
          {winter ? Array.from({ length: tier }, (_, i) => <Tuft key={i} x={20 + i * 10} y={64} season={season} />) : null}
          {tier >= 3 && !winter ? <Lizard x={36} y={55.4} /> : null}
          {tier >= 3 && winter ? <ellipse cx="36" cy="56" rx="3" ry=".8" fill={P.white} /> : null}
          {tier >= 5 ? <Farmer x={70} y={68} c={P.denim} s={1.15} hat={P.woodLight} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'wildsaatgut': {
      const rows = Math.min(4, tier)
      const hay = winter ? P.woodLight : spring ? P.leafLight : autumn ? P.woodMid : P.gold
      return (
        <Svg tier={tier}>
          <Floor season={season} base={P.leafMoss} />
          {Array.from({ length: rows }, (_, i) => (
            <g key={i}>
              <path d={`M12 ${56 + i * 3.4}q28 -2.4 56 0`} stroke={hay} strokeWidth="2.4" strokeLinecap="round" fill="none" />
              <path d={`M14 ${55.6 + i * 3.4}q26 -2 52 0`} stroke={winter ? P.white : P.woodLight} strokeWidth=".5" strokeDasharray="1 2" fill="none" />
            </g>
          ))}
          {Array.from({ length: tier + 1 }, (_, i) => (
            <WildFlower key={i} x={10 + i * 12} y={68} kind={i} season={season} h={7} />
          ))}
          {tier >= 3 ? (
            <g>
              <rect x="54" y="44" width="16" height="6" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" />
              <path d="M54 44q8 -6 16 0" fill={hay} stroke={P.outlineSoft} strokeWidth=".3" />
              <circle cx="57" cy="51" r="2" fill={P.charcoal} />
              <circle cx="67" cy="51" r="2" fill={P.charcoal} />
              <path d="M54 48h-4" stroke={P.woodDark} strokeWidth=".6" />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <path d="M16 50h6l1 6h-8z" fill={P.paper} stroke={P.outlineSoft} strokeWidth=".3" />
              <path d="M17 50q2 -2 4 0" stroke={P.woodMid} strokeWidth=".5" fill="none" />
            </g>
          ) : null}
          {tier >= 2 ? (
            <g>
              <Farmer x={30} y={68} c={P.leaf} s={1.15} hat={P.woodLight} />
              <path d="M32 58l6 -10M35 48.6l5 1.8" stroke={P.woodDark} strokeWidth=".6" />
            </g>
          ) : null}
          {tier >= 5 ? <Kid x={46} y={70} c={P.berry} s={1.5} hair={P.woodDark} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'gruenbruecke': {
      const plants = 2 + tier * 2
      return (
        <Svg tier={tier}>
          <Patch fill={P.charcoal} cx={40} cy={64} rx={38} ry={5} />
          <path d="M4 64h72" stroke={winter ? P.white : P.yellow} strokeWidth=".7" strokeDasharray="4 3" />
          <path d="M10 40h60l2 4h-64z" fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".4" />
          <path d="M14 44v16h6v-12q20 -6 40 0v12h6v-16z" fill={P.stone} stroke={P.outlineStone} strokeWidth=".4" />
          <path d="M8 40q32 -5 64 0" fill={winter ? P.white : spring ? P.leafLight : autumn ? P.leafMoss : P.leaf} stroke={P.leafDark} strokeWidth=".4" />
          {Array.from({ length: plants }, (_, i) => {
            const x = 12 + ((i * 9.7) % 56)
            return i % 3 === 0 ? <Shrub key={i} x={x} y={38.6} s={0.6} season={season} n={2} /> : <WildFlower key={i} x={x} y={39} kind={i} season={season} h={4} />
          })}
          {tier >= 2 ? (
            <g>
              <rect x="24" y="56" width="10" height="5" rx=".6" fill={P.blue} />
              <rect x="34" y="57.4" width="4" height="3.6" fill={P.denim} />
              <circle cx="27" cy="61.6" r="1" fill={P.ink} />
              <circle cx="35.6" cy="61.6" r="1" fill={P.ink} />
            </g>
          ) : null}
          {tier >= 3 ? (
            <g transform="translate(52 37)">
              <ellipse cx="0" cy="-3" rx="2.8" ry="1.5" fill={P.woodMid} />
              <path d="M-2 -1.6v2M-1 -1.6v2M1.4 -1.6v2M2.2 -1.6v2" stroke={P.woodDark} strokeWidth=".4" />
              <path d="M2.2 -3.6l1.2 -2.6" stroke={P.woodMid} strokeWidth=".9" />
              <ellipse cx="3.8" cy="-6.6" rx="1.2" ry=".8" fill={P.woodMid} />
              <ellipse cx="-2.6" cy="-3.4" rx=".6" ry=".5" fill={P.white} />
            </g>
          ) : null}
          {tier >= 4 ? <Buzz n={3} season={season} y0={24} /> : null}
          {tier >= 4 ? <path d="M70 36v-4h3v4" stroke={P.metal} strokeWidth=".5" fill={P.leafLight} /> : null}
          {tier >= 5 ? <Kid x={20} y={39} c={P.yellow} s={1.4} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'bestaeuberfest': {
      const guests = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <Bunting y={22} n={3 + tier} />
          <Table x={14} y={60} w={22} c={P.paper} />
          {Array.from({ length: 2 + tier }, (_, i) => (
            <Packet key={i} x={16.4 + i * 3} y={54.4} c={[P.paper, P.yellow, P.blossom, P.glass][i % 4]} s={0.8} />
          ))}
          <path d="M48 60V38" stroke={P.woodDark} strokeWidth=".8" />
          <rect x="40" y="38" width="16" height="10" fill={P.white} stroke={P.stone} strokeWidth=".4" />
          <Bee x={48} y={43.6} s={2.2} bumble />
          {Array.from({ length: guests }, (_, i) => (
            <g key={i}>
              <Farmer x={22 + i * 13} y={70 - (i % 2)} c={[P.berry, P.blue, P.yellow, P.leaf][i]!} s={1.15} hat={[P.woodLight, P.charcoal, P.plum, P.woodDark][i]!} />
              <rect x={24 + i * 13} y={62 - (i % 2)} width="2" height="2.6" fill={P.white} stroke={P.stone} strokeWidth=".2" />
            </g>
          ))}
          {tier >= 5 ? <Kid x={70} y={70} c={P.orange} s={1.5} /> : null}
          <Buzz n={tier} season={season} y0={28} />
          <Sky season={season} />
        </Svg>
      )
    }
  }
  return null
}
