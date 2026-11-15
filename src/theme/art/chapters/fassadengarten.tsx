/**
 * Kapitel 46 — Fassadengarten an Milas Haus im kräftigen Stil (2026-11-14,
 * Weinberg-Niveau): Fassade mit Sims, Moos, Hortensie, Hopfen, Tropfschlauch,
 * Balkone, Nistkästen, Sensoren, Fensterbänke, Hofcafé und Lichterketten mit
 * Kontur. Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import type { AreaProps } from './partsB'
import { CafeTable, Can, Lettuce, Parasol, Snowfall, Sun, WoodBox } from './partsH'
import { Creeper, Paving, Sparrow, Wall } from './partsI'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Farmer, Kid } from './figures'
import { ssn } from './season'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Fassadenstück (Fußpunkt unten links), Ziegelfugen angedeutet. */
function Facade({ x = 12, y = 62, w = 56, h = 46, c = P.terracottaLight, snow }: { x?: number; y?: number; w?: number; h?: number; c?: string; snow?: boolean }) {
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={c} {...line} />
      <path d={`M${x + 1.4} ${y - h + 2}v${h - 4}`} stroke={P.white} strokeWidth=".9" strokeLinecap="round" opacity=".25" />
      {Array.from({ length: Math.floor(h / 6) }, (_, i) => (
        <path key={i} d={`M${x} ${y - 3 - i * 6}h${w}`} stroke={P.outline} strokeWidth={H * 0.6} opacity=".22" />
      ))}
      <rect x={x} y={y - h} width={w} height="1.4" fill={P.outline} opacity=".16" />
      <rect x={x - 1} y={y - h - 1.6} width={w + 2} height="1.6" fill={P.stoneLight} {...detail} />
      {snow ? (
        <g>
          <path d={`M${x - 1} ${y - h - 1.8}h${w + 2}`} stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
          <path d={`M${x - 1} ${y - h - 1.8}h${w + 2}`} stroke={P.white} strokeWidth="1.4" strokeLinecap="round" />
        </g>
      ) : null}
    </g>
  )
}

/** Wetter: Sommer Sonne, Herbst Blätter im Wind, Winter Schnee, Frühling nichts. */
function Sky({ season }: { season?: string }) {
  const z = ssn(season)
  if (z === 'summer') return <g className="art-sky"><Old><Sun x={72} y={8} r={3} /></Old></g>
  if (z === 'winter') return <g className="art-sky"><Old><Snowfall n={7} y1={30} /></Old></g>
  if (z === 'autumn') return (
      <g className="art-sky">
        <path d="M70 12l2 1M74 18l1.4 1.4M66 20l2 -.4" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M70 12l2 1M74 18l1.4 1.4M66 20l2 -.4" stroke={P.red} strokeWidth="1.1" strokeLinecap="round" />
      </g>
    )
  return null
}

/** Moospolster. */
function Moss({ x, y, r = 3, season }: { x: number; y: number; r?: number; season?: string }) {
  const z = ssn(season)
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.75} fill={z === 'winter' ? P.winterLeaf : z === 'spring' ? P.leafPale : z === 'autumn' ? P.leafMoss : P.leaf} {...detail} />
      <ellipse cx={x - r * 0.3} cy={y - r * 0.25} rx={r * 0.45} ry={r * 0.3} fill={z === 'winter' ? P.white : P.leafLight} opacity=".8" />
    </g>
  )
}

/** Hortensien-Dolde (flach, weiß); Winter trocken braun. */
function Umbel({ x, y, season }: { x: number; y: number; season?: string }) {
  const z = ssn(season)
  if (z === 'spring') return <ellipse cx={x} cy={y} rx="1.4" ry=".8" fill={P.leafPale} stroke={P.outline} strokeWidth={H * 0.7} />
  const c = z === 'winter' ? P.woodLight : z === 'autumn' ? P.blossom : P.white
  return (
    <g>
      <ellipse cx={x} cy={y} rx="2.6" ry="1.4" fill={c} {...detail} />
      {[-1.4, 0, 1.4].map((d) => <circle key={d} cx={x + d} cy={y - 0.2} r=".45" fill={z === 'winter' ? P.woodMid : P.cream} stroke={P.outline} strokeWidth={H * 0.5} />)}
    </g>
  )
}

/** Hopfendolde (hellgrüner Zapfen). */
function HopCone({ x, y, ripe }: { x: number; y: number; ripe?: boolean }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx="1.3" ry="1.9" fill={ripe ? P.leafPale : P.leafLight} stroke={P.outline} strokeWidth={H * 0.8} />
      <path d={`M${x - 0.8} ${y - 0.3}h1.6M${x - 0.7} ${y + 0.5}h1.4`} stroke={P.leafDark} strokeWidth={H * 0.6} />
    </g>
  )
}

/** Nistkasten (Fußpunkt unten Mitte). */
function NestBox({ x, y, c = P.wood, swift }: { x: number; y: number; c?: string; swift?: boolean }) {
  return swift ? (
    <g>
      <rect x={x - 3.6} y={y - 3} width="7.2" height="3" fill={P.stone} {...detail} />
      <ellipse cx={x + 2} cy={y - 0.6} rx="1" ry=".45" fill={P.ink} />
    </g>
  ) : (
    <g>
      <rect x={x - 2} y={y - 5} width="4" height="5" fill={c} {...detail} />
      <path d={`M${x - 2.6} ${y - 5}l2.6 -1.6l2.6 1.6z`} fill={P.woodDark} stroke={P.outline} strokeWidth={D} strokeLinejoin="round" />
      <circle cx={x} cy={y - 3} r=".8" fill={P.ink} />
    </g>
  )
}

/** Sensor-Stab mit Lämpchen. */
function Sensor({ x, y, dry }: { x: number; y: number; dry?: boolean }) {
  return (
    <g>
      <path d={`M${x} ${y}v-6`} stroke={P.outline} strokeWidth="1.9" strokeLinecap="round" />
      <path d={`M${x} ${y}v-6`} stroke={P.metal} strokeWidth=".9" strokeLinecap="round" />
      <rect x={x - 1} y={y - 8} width="2" height="2.4" rx=".3" fill={P.white} {...detail} />
      <circle cx={x} cy={y - 6.8} r=".55" fill={dry ? P.red : P.leafLight} stroke={P.outline} strokeWidth={H * 0.5} />
    </g>
  )
}

/** Joghurtbecher mit Setzling. */
function Cup({ x, y, season }: { x: number; y: number; season?: string }) {
  const z = ssn(season)
  return (
    <g>
      <path d={`M${x - 1} ${y}l-.3 -2h2.6l-.3 2z`} fill={P.white} stroke={P.outline} strokeWidth={H * 0.7} />
      {z === 'winter' ? <path d={`M${x} ${y - 2}v-1`} stroke={P.leaf} strokeWidth=".5" /> : <path d={`M${x} ${y - 2}v-1.6M${x} ${y - 3}l-1 -.6M${x} ${y - 3.2}l1 -.6`} stroke={z === 'autumn' ? P.leafMoss : P.leafLight} strokeWidth=".5" />}
    </g>
  )
}

/** Lichterkette als Girlande von a nach b. */
function Lights({ x0, x1, y, sag = 3, n = 6, on = true }: { x0: number; x1: number; y: number; sag?: number; n?: number; on?: boolean }) {
  return (
    <g>
      <path d={`M${x0} ${y}Q${(x0 + x1) / 2} ${y + sag * 2} ${x1} ${y}`} stroke={P.outline} strokeWidth=".6" fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n
        const xx = x0 + (x1 - x0) * t
        const yy = y + sag * 2 * 2 * t * (1 - t)
        return <circle key={i} cx={xx.toFixed(2)} cy={(yy + 0.8).toFixed(2)} r=".8" fill={on ? P.lamp : P.paper} stroke={P.outline} strokeWidth={H * 0.5} />
      })}
    </g>
  )
}

export function Fassadengarten({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  const spring = z === 'spring'
  const autumn = z === 'autumn'
  switch (id) {
    case 'moosfassade': {
      const n = 3 + tier * 3
      return (
        <Svg tier={tier} bold>
          <Old><Paving season={season} /></Old>
          <Facade c={P.stoneLight} snow={winter} />
          {Array.from({ length: 4 }, (_, i) => <path key={i} d={`M${16 + i * 14} 18v42`} stroke={P.outline} strokeWidth={H} opacity=".35" />)}
          {Array.from({ length: n }, (_, i) => (
            <Moss key={i} x={17 + ((i * 17.3) % 46)} y={22 + ((i * 7.7) % 34)} r={2.6 + (i % 3) * 0.6} season={season} />
          ))}
          {spring || autumn ? Array.from({ length: Math.min(4, tier) }, (_, i) => <circle key={i} cx={20 + i * 12} cy={30 + (i % 2) * 14} r=".6" fill={P.waterLight} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
          {tier >= 4 ? (
            <g>
              <path d="M66 16v44M64 60h4" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
              <path d="M66 16v44M64 60h4" stroke={P.metal} strokeWidth="1.1" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? <Kid x={70} y={70} c={P.berry} s={1.5} hair={P.woodDark} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'kletterhortensie': {
      const stems = 1 + tier
      return (
        <Svg tier={tier} bold>
          <Old><Paving season={season} /></Old>
          <Facade c={P.stoneLight} snow={winter} />
          <Old><Wall x={24} y={30} w={32} h={10} c={P.stoneLight} rows={1} cols={2} lit={winter} /></Old>
          {Array.from({ length: stems }, (_, i) => {
            const x = 14 + i * (52 / Math.max(1, stems - 1))
            const h = 18 + ((i * 7) % 3) * 6 + tier * 2
            return (
              <g key={i}>
                <Old><Creeper x={x} y={62} h={h} season={summer ? 'summer' : season} n={3 + Math.floor(tier / 2)} sway={2} /></Old>
                {i % 2 === 0 || tier >= 4 ? <Umbel x={x + 1.6} y={62 - h * 0.7} season={season} /> : null}
              </g>
            )
          })}
          {autumn ? Array.from({ length: stems }, (_, i) => <ellipse key={i} cx={16 + i * 9} cy={50 - (i % 3) * 8} rx="1.6" ry="1" fill={P.gold} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
          {tier >= 5 ? <Farmer x={68} y={70} c={P.leafDark} s={1.15} hat={P.woodLight} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'hopfenranken': {
      const wires = 1 + tier
      const grow = winter ? 0 : spring ? 0.4 : 1
      return (
        <Svg tier={tier} bold>
          <Old><Paving season={season} /></Old>
          <Facade c={P.cream} snow={winter} />
          {Array.from({ length: wires }, (_, i) => {
            const x = 16 + i * (48 / Math.max(1, wires - 1))
            const h = (20 + tier * 4) * grow
            return (
              <g key={i}>
                <path d={`M${x} 62V16`} stroke={P.outline} strokeWidth="1.6" strokeLinecap="round" />
                <path d={`M${x} 62V16`} stroke={P.metal} strokeWidth=".7" strokeLinecap="round" />
                <rect x={x - 1.4} y="58" width="2.8" height="4" fill={P.terracotta} {...detail} />
                {h > 0 ? (
                  <g>
                    <path d={`M${x} 58q1.6 -${(h / 4).toFixed(1)} 0 -${(h / 2).toFixed(1)}t0 -${(h / 2).toFixed(1)}`} stroke={P.outline} strokeWidth="1.9" fill="none" strokeLinecap="round" />
                    <path d={`M${x} 58q1.6 -${(h / 4).toFixed(1)} 0 -${(h / 2).toFixed(1)}t0 -${(h / 2).toFixed(1)}`} stroke={autumn ? P.woodLight : P.leaf} strokeWidth=".9" fill="none" strokeLinecap="round" />
                    {Array.from({ length: Math.max(1, Math.round(h / 6)) }, (_, k) => (
                      <path key={k} d={`M${x} ${(56 - k * 6).toFixed(1)}l${k % 2 ? 3.4 : -3.4} -2.4l${k % 2 ? -1.4 : 1.4} 3.6z`} fill={autumn ? P.gold : P.leaf} stroke={P.outline} strokeWidth={H * 0.8} strokeLinejoin="round" />
                    ))}
                    {summer || autumn ? Array.from({ length: Math.max(1, Math.round(h / 10)) }, (_, k) => <HopCone key={k} x={x + (k % 2 ? 2.2 : -2.2)} y={58 - h + 4 + k * 7} ripe={autumn} />) : null}
                  </g>
                ) : (
                  <path d={`M${x - 1.2} 57.6h2.4`} stroke={P.white} strokeWidth="1" strokeLinecap="round" />
                )}
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <path d="M12 16h56" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M12 16h56" stroke={P.metal} strokeWidth=".8" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={70} y={70} c={P.blue} s={1.15} hat={P.woodLight} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'tropfschlauch': {
      const boxes = Math.min(4, tier)
      const levels = [58, 45, 32, 19]
      return (
        <Svg tier={tier} bold>
          <Old><Paving season={season} /></Old>
          <Facade c={P.paper} snow={winter} />
          <path d={`M64 62V${levels[boxes - 1]! - 4}`} stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
          <path d={`M64 62V${levels[boxes - 1]! - 4}`} stroke={P.charcoal} strokeWidth="1" strokeLinecap="round" />
          {Array.from({ length: boxes }, (_, i) => {
            const y = levels[i]!
            return (
              <g key={i}>
                <path d={`M64 ${y - 4}H18`} stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
                <path d={`M64 ${y - 4}H18`} stroke={P.charcoal} strokeWidth=".8" strokeLinecap="round" />
                <Old><WoodBox x={18} y={y} w={42} h={4} snow={winter} fill={P.woodMid} /></Old>
                {Array.from({ length: 5 }, (_, k) => (
                  <g key={k}>
                    {winter ? <ellipse cx={22 + k * 8} cy={y - 5} rx="2.4" ry="1" fill={P.white} stroke={P.outline} strokeWidth={H * 0.6} /> : <Old><Lettuce x={22 + k * 8} y={y - 4} s={1.2} season={season} red={k % 2 === 1} /></Old>}
                    {!winter && tier >= 2 ? <path d={`M${22 + k * 8 + 1.6} ${y - 4}v1.2`} stroke={P.waterLight} strokeWidth=".7" strokeLinecap="round" /> : null}
                  </g>
                ))}
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <rect x="66" y="50" width="8" height="12" rx="1" fill={P.leafDark} {...detail} />
              <path d="M66 54h8" stroke={P.leafMoss} strokeWidth=".6" />
              <path d="M67.4 55.6v5" stroke={P.white} strokeWidth=".7" strokeLinecap="round" opacity=".3" />
            </g>
          ) : null}
          {tier >= 5 ? <Kid x={8} y={70} c={P.yellow} s={1.5} /> : null}
          {tier >= 5 ? <Old><Can x={12} y={70} c={P.blue} s={1.2} /></Old> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'balkonbeete': {
      const floors = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Old><Paving season={season} /></Old>
          <Facade c={P.stoneLight} snow={winter} />
          {Array.from({ length: floors }, (_, i) => {
            const y = 58 - i * 12
            const crop = i % 2 === 0
            return (
              <g key={i}>
                <rect x="24" y={y - 9} width="10" height="9" fill={P.window} {...detail} />
                <path d={`M25.4 ${y - 7.4}l3 -1`} stroke={P.white} strokeWidth=".6" strokeLinecap="round" opacity=".5" />
                <rect x="20" y={y + 0.6} width="40" height="1" fill={P.outline} opacity=".15" />
                <rect x="20" y={y - 1} width="40" height="1.6" fill={P.stoneLight} {...detail} />
                <path d={`M20 ${y - 1}v-4h40v4`} stroke={P.outline} strokeWidth="1.6" fill="none" strokeLinejoin="round" />
                <path d={`M20 ${y - 1}v-4h40v4`} stroke={P.metal} strokeWidth=".7" fill="none" strokeLinejoin="round" />
                <rect x="38" y={y - 4} width="18" height="3" fill={P.terracotta} {...detail} />
                {winter ? (
                  <g>
                    <path d={`M38 ${y - 4.2}h18`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
                    <path d={`M38 ${y - 4.2}h18`} stroke={P.white} strokeWidth="1" strokeLinecap="round" />
                  </g>
                ) : crop ? (
                  [41, 47, 53].map((x) => (
                    <g key={x}>
                      <path d={`M${x} ${y - 4}v-${spring ? 2 : 5}`} stroke={P.leafDark} strokeWidth=".6" />
                      {summer || autumn ? <circle cx={x + 0.8} cy={y - 6} r="1" fill={autumn ? P.orange : P.tomato} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
                    </g>
                  ))
                ) : (
                  [40, 44, 48, 52, 56].map((x) => <path key={x} d={`M${x} ${y - 4}q-.8 -${spring ? 1.6 : 3} 0 -${spring ? 3 : 7}`} stroke={P.leaf} strokeWidth=".6" fill="none" />)
                )}
              </g>
            )
          })}
          {tier >= 3 ? <path d="M56 46V30" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d="M56 46V30" stroke={P.woodLight} strokeWidth=".8" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d="M54 38h4l-.6 2h-2.8z" fill={P.woodLight} {...detail} /> : null}
          {tier >= 5 ? <Farmer x={70} y={70} c={P.berry} s={1.15} hat={P.charcoal} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'nistwand': {
      const boxes = 1 + tier
      return (
        <Svg tier={tier} bold>
          <Old><Paving season={season} /></Old>
          <Facade snow={winter} />
          <Old><Creeper x={14} y={62} h={36} season={season} n={6} /></Old>
          <Old><Creeper x={66} y={62} h={30} season={season} n={5} /></Old>
          {Array.from({ length: boxes }, (_, i) => (
            <NestBox key={i} x={22 + i * (36 / Math.max(1, boxes - 1))} y={34} c={[P.wood, P.woodLight][i % 2]} />
          ))}
          {tier >= 4 ? [28, 40, 52].map((x) => <NestBox key={x} x={x} y={22} swift />) : null}
          {Array.from({ length: tier }, (_, i) => (
            <Old key={i}><Sparrow x={20 + i * 10} y={i % 2 ? 29 : 60} s={1.5} flip={i % 2 === 1} /></Old>
          ))}
          {tier >= 5 ? <Kid x={70} y={70} c={P.leaf} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'sensorgarten': {
      const sensors = 1 + tier
      return (
        <Svg tier={tier} bold>
          <Old><Paving season={season} /></Old>
          <Facade c={P.paper} h={30} snow={winter} />
          <Old><Creeper x={20} y={62} h={24} season={season} n={4} /></Old>
          <Old><Creeper x={60} y={62} h={26} season={season} n={4} /></Old>
          <rect x="12" y="54" width="56" height="8" fill={P.wood} {...line} />
          <path d="M13.4 58h53.2" stroke={P.outline} strokeWidth={H} opacity=".3" />
          <rect x="13" y="52.8" width="54" height="1.6" fill={winter ? P.white : P.soil} stroke={P.outline} strokeWidth={H} />
          {!winter ? Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={17 + i * 9} cy={51.6} rx="3" ry="2" fill={autumn ? P.leafMoss : spring ? P.leafLight : P.leaf} {...detail} />) : null}
          {Array.from({ length: sensors }, (_, i) => (
            <Sensor key={i} x={16 + i * (48 / Math.max(1, sensors - 1))} y={53} dry={i === 1 && summer} />
          ))}
          {tier >= 3 ? (
            <g>
              <path d="M62 32l10 -2v6l-10 2z" fill={P.blue} {...detail} strokeLinejoin="round" />
              <path d="M67 31v6" stroke={P.outline} strokeWidth={H} />
              <path d="M63 33.2l3 -.6" stroke={P.white} strokeWidth=".6" strokeLinecap="round" opacity=".45" />
            </g>
          ) : null}
          {tier >= 4 ? <rect x="70" y="54" width="5" height="8" rx="1" fill={P.metal} {...detail} /> : null}
          {tier >= 5 ? (
            <g>
              <Kid x={8} y={70} c={P.berry} s={1.5} hair={P.woodDark} />
              <rect x="9" y="61" width="3" height="2.2" fill={P.charcoal} stroke={P.outline} strokeWidth={H} />
            </g>
          ) : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'fensterbank': {
      const wins = Math.min(6, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Old><Paving season={season} /></Old>
          <Facade c={P.terracottaLight} snow={winter} />
          {Array.from({ length: wins }, (_, i) => {
            const x = 18 + (i % 3) * 16
            const y = 32 + Math.floor(i / 3) * 18
            return (
              <g key={i}>
                <rect x={x} y={y - 10} width="12" height="10" fill={winter ? P.lamp : P.window} {...detail} />
                <path d={`M${x + 6} ${y - 10}v10`} stroke={P.white} strokeWidth=".6" />
                <rect x={x} y={y + 1.2} width="12" height=".8" fill={P.outline} opacity=".15" />
                <rect x={x - 1} y={y} width="14" height="1.2" fill={P.stoneLight} {...detail} />
                {[2.4, 5, 7.6, 10.2].map((d) => <Cup key={d} x={x + d} y={y} season={season} />)}
              </g>
            )
          })}
          {tier >= 5 ? <Farmer x={70} y={70} c={P.yellow} s={1.15} hat={P.woodDark} /> : null}
          {tier >= 5 ? <Kid x={62} y={70} c={P.blue} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'hofcafe': {
      const tables = Math.min(3, tier)
      return (
        <Svg tier={tier} bold>
          <Old><Paving season={season} cy={63} /></Old>
          <Facade h={38} snow={winter} />
          {[14, 26, 38, 50, 62].map((x, i) => <Old key={x}><Creeper x={x} y={52} h={22 + (i % 2) * 6} season={season} n={4} /></Old>)}
          <rect x="30" y="38" width="20" height="14" fill={P.woodDark} {...line} />
          <rect x="32" y="40" width="16" height="12" fill={winter ? P.lamp : P.window} {...detail} />
          <rect x="32" y="40" width="16" height="1.2" fill={P.outline} opacity=".2" />
          <path d="M28 38l2 -3h20l2 3z" fill={P.leafDark} {...line} strokeLinejoin="round" />
          <path d="M31 36.2h18" stroke={P.white} strokeWidth=".6" strokeLinecap="round" opacity=".35" />
          {Array.from({ length: tables }, (_, i) => (
            <g key={i}>
              <g transform={`translate(${16 + i * 22} 67) scale(1.5) translate(${-(16 + i * 22)} -67)`}>
                <Old><CafeTable x={16 + i * 22} y={67} /></Old>
                {tier >= 2 ? <Old><Parasol x={16 + i * 22} y={64} c={[P.tomato, P.yellow, P.leafLight][i]} open={summer || spring} /></Old> : null}
              </g>
            </g>
          ))}
          {tier >= 3 ? <path d="M30 56h-6l1 6h4z" fill={P.white} {...detail} strokeLinejoin="round" /> : null}
          {tier >= 4 ? <Farmer x={44} y={70} c={P.white} s={1.15} hat={P.white} /> : null}
          {tier >= 5 ? <Kid x={70} y={70} c={P.orange} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'lichterfassade': {
      const strands = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Old><Paving season={season} /></Old>
          <Facade c={P.stone} snow={winter} />
          {[16, 30, 44, 58].map((x, i) => <Old key={x}><Creeper x={x} y={62} h={34 + (i % 2) * 8} season={season} n={6} sway={4} /></Old>)}
          {Array.from({ length: strands }, (_, i) => (
            <Lights key={i} x0={12} x1={68} y={22 + i * 9} sag={3} n={6 + tier} on={winter || autumn || i % 2 === 0} />
          ))}
          {tier >= 3 ? (
            <g>
              <path d="M40 14v-6M37 11h6" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
              <path d="M40 14v-6M37 11h6" stroke={P.lamp} strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 4 ? <Kid x={18} y={70} c={P.berry} s={1.5} /> : null}
          {tier >= 5 ? <Farmer x={70} y={70} c={P.leafDark} s={1.15} hat={P.charcoal} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
  }
  return null
}
