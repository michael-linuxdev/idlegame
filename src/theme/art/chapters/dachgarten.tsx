/**
 * Kapitel 40 — Dachgarten auf dem alten Parkhaus im kräftigen Stil
 * (2026-11-14, Weinberg-Niveau): Kiesdach, Hochbeete, Mauerpfeffer, Kräuter,
 * Bienenhotel, Glaskuppel, Regentanks, Solarpergola, Geländer, Lastenaufzug und
 * Dachcafé mit Kontur. Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Farmer, Kid } from './figures'
import { StringLights } from './partsC'
import type { AreaProps } from './partsB'
import { Rain } from './partsF'
import { Bee, CafeTable, Can, Cloud, Lettuce, OmaTin, Packet, Parasol, SeedJar, Snowfall, Sun, WoodBox } from './partsH'
import { ssn } from './season'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Dachfläche: Kies mit Fugen der Dachplatten, Winter Schnee. */
function Roof({ season, cy = 61, rx = 36, ry = 9 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const winter = ssn(season) === 'winter'
  return (
    <g>
      <ellipse cx="40" cy={cy + 1.4} rx={rx} ry={ry} fill={P.outline} opacity=".15" />
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={winter ? P.cream : P.stoneLight} {...line} />
      <path d={`M${40 - rx * 0.72} ${cy - ry * 0.5}Q${40 - rx * 0.4} ${cy - ry * 0.85} ${40 - rx * 0.05} ${cy - ry * 0.88}`} stroke={P.white} strokeWidth={D} fill="none" strokeLinecap="round" opacity=".45" />
      {[-0.5, 0, 0.5].map((d) => (
        <path key={d} d={`M${40 + rx * d - 4} ${cy - ry * 0.7}l8 ${ry * 1.4}`} stroke={winter ? P.frost : P.stoneDark} strokeWidth={H} strokeLinecap="round" />
      ))}
      {!winter ? [-0.7, -0.2, 0.3, 0.75].map((d) => <circle key={d} cx={40 + rx * d} cy={cy + 2} r=".6" fill={P.stoneDark} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
    </g>
  )
}

/** Mauerpfeffer-Polster: Frühling grün, Sommer gelbe Blütensterne, Herbst rot, Winter Schnee. */
function Sedum({ x, y, r = 5, season }: { x: number; y: number; r?: number; season?: string }) {
  const z = ssn(season)
  const base = z === 'autumn' ? P.autumnDark : z === 'winter' ? P.winterLeaf : P.leafLight
  const tip = z === 'autumn' ? P.berry : z === 'winter' ? P.white : P.leafPale
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.42} fill={z === 'autumn' ? P.autumn : P.leaf} {...detail} />
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={x - r * 0.7 + (i % 3) * r * 0.7} cy={y - 0.6 - Math.floor(i / 3) * 1.2} r={r * 0.24} fill={i % 2 ? base : tip} stroke={P.outline} strokeWidth={H * 0.5} />
      ))}
      <path d={`M${x - r * 0.8} ${y - 2}q${r * 0.4} -${r * 0.3} ${r * 0.9} -${r * 0.3}`} stroke={P.white} strokeWidth={H} fill="none" strokeLinecap="round" opacity=".35" />
      {z === 'summer'
        ? [-0.5, 0.1, 0.6].map((d) => (
            <g key={d}>
              <path d={`M${x + r * d} ${y - 1.4}v-2`} stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
              <path d={`M${x + r * d} ${y - 1.4}v-2`} stroke={P.leafDark} strokeWidth=".8" strokeLinecap="round" />
              <circle cx={x + r * d} cy={y - 3.6} r="1.1" fill={P.yellow} stroke={P.outline} strokeWidth={H * 0.7} />
            </g>
          ))
        : null}
      {z === 'autumn' ? [-0.3, 0.4].map((d) => <circle key={d} cx={x + r * d} cy={y - 2.8} r=".8" fill={P.woodMid} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
    </g>
  )
}

/** Kräuterbusch: Thymian (lila), Salbei (graugrün), Rosmarin (nadelig, blau). */
function Herb({ x, y, kind, season }: { x: number; y: number; kind: number; season?: string }) {
  const z = ssn(season)
  const leaf = kind === 1 ? P.winterLeafLight : kind === 2 ? P.leafDark : P.leafMoss
  const flower = kind === 0 ? P.lilac : kind === 1 ? P.lavender : P.blue
  return (
    <g>
      <ellipse cx={x} cy={y - 2.4} rx="3.4" ry="2.6" fill={z === 'winter' ? P.winterLeafDark : leaf} {...detail} />
      <ellipse cx={x - 1} cy={y - 3.2} rx="1.4" ry=".9" fill={P.white} opacity=".18" />
      {kind === 2 ? <path d={`M${x - 2.2} ${y - 1.4}l-.8 -3.6M${x} ${y - 2}v-4M${x + 2.2} ${y - 1.4}l.8 -3.6`} stroke={P.outline} strokeWidth="1.6" strokeLinecap="round" /> : null}
      {kind === 2 ? <path d={`M${x - 2.2} ${y - 1.4}l-.8 -3.6M${x} ${y - 2}v-4M${x + 2.2} ${y - 1.4}l.8 -3.6`} stroke={P.leaf} strokeWidth=".7" strokeLinecap="round" /> : null}
      {z === 'summer' || (z === 'spring' && kind === 2) ? [-1.4, 0, 1.4].map((d) => <circle key={d} cx={x + d} cy={y - 4.6} r=".75" fill={flower} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
      {z === 'winter' ? <path d={`M${x - 2.8} ${y - 4.2}q2.8 -1.4 5.6 0`} stroke={P.white} strokeWidth="1" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Solarplatte (schräg), Winter mit Schnee. */
function Panel({ x, y, w = 12, snow }: { x: number; y: number; w?: number; snow?: boolean }) {
  return (
    <g>
      <path d={`M${x} ${y}l2 -4h${w}l-2 4z`} fill={P.blue} {...detail} />
      <path d={`M${x + 1} ${y - 2}h${w}M${x + w / 2 + 1} ${y}l2 -4`} stroke={P.outline} strokeWidth={H} opacity=".7" />
      <path d={`M${x + 2.4} ${y - 0.8}l1.2 -2.4`} stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".4" />
      {snow ? <path d={`M${x + 2.2} ${y - 3.8}h${w - 0.4}`} stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" /> : null}
      {snow ? <path d={`M${x + 2.2} ${y - 3.8}h${w - 0.4}`} stroke={P.white} strokeWidth="1.2" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Brüstung am Dachrand (Geländer). */
function Railing({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  return (
    <g>
      <path d={Array.from({ length: Math.floor((x1 - x0) / 5) + 1 }, (_, i) => `M${x0 + i * 5} ${y}v-6`).join('') + `M${x0} ${y - 6}H${x1}`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
      {Array.from({ length: Math.floor((x1 - x0) / 5) + 1 }, (_, i) => (
        <path key={i} d={`M${x0 + i * 5} ${y}v-6`} stroke={P.metal} strokeWidth=".8" strokeLinecap="round" />
      ))}
      <path d={`M${x0} ${y - 6}H${x1}`} stroke={P.metal} strokeWidth="1.1" strokeLinecap="round" />
    </g>
  )
}

/** Kleine Stadtsilhouette mit Kran (hinter dem Abendrot-Fest). */
function Skyline({ y, lit, c = P.plum }: { y: number; lit?: boolean; c?: string }) {
  return (
    <g>
      {[
        [6, 12, 10],
        [17, 18, 8],
        [26, 9, 12],
        [52, 14, 9],
        [62, 20, 12],
      ].map(([x, h, w], i) => (
        <g key={i}>
          <rect x={x} y={y - h!} width={w} height={h} fill={c} opacity=".75" stroke={P.outline} strokeWidth={H} />
          {lit ? <rect x={x! + 2} y={y - h! + 3} width="1.4" height="1.4" fill={P.lamp} /> : null}
        </g>
      ))}
      <path d={`M44 ${y}V${y - 24}M36 ${y - 22}h20M44 ${y - 24}l-8 2M44 ${y - 24}l12 2`} stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" opacity=".6" />
      <path d={`M44 ${y}V${y - 24}M36 ${y - 22}h20M44 ${y - 24}l-8 2M44 ${y - 24}l12 2`} stroke={c} strokeWidth=".9" strokeLinecap="round" opacity=".9" />
    </g>
  )
}

export function Dachgarten({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  const autumn = z === 'autumn'
  switch (id) {
    case 'dachbeete': {
      const spots: [number, number][] = [[30, 54], [16, 64], [44, 64], [6, 54], [54, 54]]
      return (
        <Svg tier={tier} bold>
          <Roof season={season} />
          {spots.slice(0, Math.min(5, tier)).sort((a, b) => a[1] - b[1]).map(([x, y], i) => (
            <g key={i}>
              <rect x={x + 1} y={y - 0.6} width="20" height="1.8" rx=".9" fill={P.outline} opacity=".15" />
              <path d={`M${x} ${y - 6}l2 -2.4h16l2 2.4z`} fill={winter ? P.white : P.soil} {...detail} />
              <rect x={x} y={y - 6} width="20" height="6" rx=".6" fill={P.wood} {...line} />
              <path d={`M${x} ${y - 3}h20`} stroke={P.outline} strokeWidth={H} />
              <path d={`M${x + 1.6} ${y - 4.6}h7`} stroke={P.woodLight} strokeWidth={H} strokeLinecap="round" opacity=".6" />
              {winter ? (
                <path d={`M${x + 1} ${y - 7}q9 -4 18 0z`} fill={P.cream} stroke={P.outline} strokeWidth={H} />
              ) : (
                [5, 10, 15].map((dx, k) => <Old key={k}><Lettuce x={x + dx} y={y - 6.4} s={1.5} season={season} red={autumn && k === 1} /></Old>)
              )}
            </g>
          ))}
          {tier >= 3 ? <Old><Can x={68} y={68} c={P.leaf} s={1.4} /></Old> : null}
          {tier >= 5 ? <Kid x={72} y={60} c={P.berry} s={1.1} hair={P.woodDark} /> : null}
          {autumn ? <Old><Rain n={5} y0={4} /></Old> : null}
          {summer ? <g className="art-sky"><Old><Sun x={68} y={14} r={3} /></Old></g> : null}
        </Svg>
      )
    }
    case 'bienendach': {
      const spots: [number, number][] = [[24, 60], [44, 56], [34, 66], [14, 54], [54, 65], [62, 57]]
      return (
        <Svg tier={tier} bold>
          <Roof season={season} />
          {spots.slice(0, 1 + tier).map(([x, y], i) => (
            <Sedum key={i} x={x} y={y} r={5 + (i % 2)} season={season} />
          ))}
          {tier >= 2 ? (
            <g>
              <Post x={66} y={64} h={16} w={2.4} k={K} />
              <rect x="59" y="36" width="14" height="12" fill={P.woodLight} {...line} />
              <rect x="60" y="36.8" width="12" height="1.2" fill={P.outline} opacity=".18" />
              <path d="M57.6 36l8.4 -4l8.4 4z" fill={P.woodDark} {...detail} />
              <path d="M60.4 35l5.4 -2.6" stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".3" />
              {Array.from({ length: Math.min(12, tier * 3) }, (_, k) => (
                <circle key={k} cx={61.4 + (k % 4) * 3} cy={38.6 + Math.floor(k / 4) * 3.2} r=".85" fill={k % 3 ? P.soilDark : P.woodMid} stroke={P.outline} strokeWidth={H * 0.6} />
              ))}
              {winter ? <path d="M58.4 35.6l7.6 -3.6l7.6 3.6" stroke={P.white} strokeWidth="1" fill="none" /> : null}
            </g>
          ) : null}
          {!winter && tier >= 3 ? [[26, 50], [46, 46], [36, 58]].slice(0, tier - 2).map(([x, y], i) => <Old key={i}><Bee x={x!} y={y!} s={2.2} /></Old>) : null}
          {winter ? <g className="art-sky"><Old><Snowfall n={6} /></Old></g> : null}
          {tier >= 5 ? <Kid x={72} y={70} c={P.leaf} s={1} /> : null}
        </Svg>
      )
    }
    case 'dachkuppel': {
      const r = 12 + tier * 2
      const struts = 2 + tier
      return (
        <Svg tier={tier} bold>
          <Roof season={season} />
          <ellipse cx="40" cy="62.6" rx={r + 1.4} ry="2.2" fill={P.outline} opacity=".15" />
          <path d={`M${40 - r} 62a${r} ${r * 0.9} 0 0 1 ${2 * r} 0z`} fill={P.glass} opacity=".75" />
          <path d={`M${40 - r} 62a${r} ${r * 0.9} 0 0 1 ${2 * r} 0z`} fill="none" {...line} />
          <path d={`M${40 - r * 0.72} ${62 - r * 0.42}Q${40 - r * 0.62} ${62 - r * 0.68} ${40 - r * 0.38} ${62 - r * 0.74}`} stroke={P.white} strokeWidth={D} fill="none" strokeLinecap="round" opacity=".55" />
          {Array.from({ length: struts }, (_, i) => {
            const t = (i + 1) / (struts + 1)
            const x = 40 - r + 2 * r * t
            return <path key={i} d={`M${x} 62Q${40 + (x - 40) * 0.3} ${62 - r * 1.2} 40 ${62 - r * 0.9}`} stroke={P.outline} strokeWidth={H} fill="none" />
          })}
          <path d={`M${40 - r * 0.7} ${62 - r * 0.45}Q40 ${62 - r * 0.62} ${40 + r * 0.7} ${62 - r * 0.45}`} stroke={P.outline} strokeWidth={H} fill="none" />
          {Array.from({ length: tier + 1 }, (_, k) => (
            <Old key={k}><Lettuce x={40 - r * 0.6 + (k * r * 1.2) / Math.max(1, tier)} y={61} s={1.1} season={winter ? 'summer' : season} /></Old>
          ))}
          {tier >= 3 ? <rect x="37" y="54" width="6" height="8" fill={P.glassEdge} {...detail} /> : null}
          {tier >= 4 ? (
            <g>
              <circle cx="40" cy={62 - r * 0.7} r="2.2" fill={P.lamp} opacity=".25" />
              <circle cx="40" cy={62 - r * 0.7} r="1" fill={P.lamp} stroke={P.outline} strokeWidth={H * 0.8} />
            </g>
          ) : null}
          {winter ? <path d={`M${40 - r * 0.8} ${62 - r * 0.55}Q40 ${62 - r * 1.05} ${40 + r * 0.8} ${62 - r * 0.55}`} stroke={P.white} strokeWidth="1.4" fill="none" strokeLinecap="round" /> : null}
          {winter ? <g className="art-sky"><Old><Snowfall n={6} y1={30} /></Old></g> : null}
          {tier >= 5 ? <Kid x={70} y={70} c={P.blue} s={0.9} /> : null}
        </Svg>
      )
    }
    case 'dachtank': {
      const tanks = Math.min(3, Math.ceil(tier / 2))
      return (
        <Svg tier={tier} bold>
          <Roof season={season} />
          {Array.from({ length: tanks }, (_, i) => {
            const x = 22 + i * 16
            return (
              <g key={i}>
                <ellipse cx={x + 6} cy={62.4} rx="7.4" ry="1.4" fill={P.outline} opacity=".15" />
                <rect x={x} y={40} width="12" height="22" rx="1.4" fill={P.leafDark} {...line} />
                <ellipse cx={x + 6} cy={40} rx="6" ry="1.4" fill={winter ? P.white : P.leafMoss} {...detail} />
                <path d={`M${x + 2} 44v14`} stroke={P.waterLight} strokeWidth=".8" opacity=".9" />
                <path d={`M${x + 2} ${48 + i * 2}h2`} stroke={P.white} strokeWidth=".5" />
              </g>
            )
          })}
          <rect x="2" y="30" width="13" height="30" fill={P.stoneLight} {...line} />
          <rect x="3" y="30.8" width="11" height="1.4" fill={P.outline} opacity=".16" />
          <path d="M1 30h15" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M1 30h15" stroke={P.stoneDark} strokeWidth="1.3" strokeLinecap="round" />
          <rect x="5" y="46" width="6" height="12" fill={P.woodDark} {...detail} />
          <path d="M14 30.6h7v9.4" stroke={P.outline} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 30.6h7v9.4" stroke={P.metal} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {tier >= 2 ? <path d={`M${22 + tanks * 16 - 4} 60h10q4 0 4 3`} stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
          {tier >= 2 ? <path d={`M${22 + tanks * 16 - 4} 60h10q4 0 4 3`} stroke={P.leafDark} strokeWidth="1" fill="none" strokeLinecap="round" /> : null}
          {tier >= 2 ? <Old><WoodBox x={60} y={68} w={14} h={3} snow={winter} /></Old> : null}
          {tier >= 4 ? <path d="M66 62h4v2h-4z" fill={P.metal} {...detail} /> : null}
          {tier >= 4 && !winter ? [62, 66, 70].map((x) => <Old key={x}><Lettuce x={x} y={65} season={season} /></Old>) : null}
          {z === 'spring' || autumn ? <Old><Rain n={6} y0={2} /></Old> : null}
          {tier >= 5 ? <Farmer x={10} y={72} c={P.blue} s={0.6} hat={P.charcoal} /> : null}
        </Svg>
      )
    }
    case 'solarpergola': {
      return (
        <Svg tier={tier} bold>
          <Roof season={season} />
          <ellipse cx="40" cy="61" rx={12 + tier * 4} ry="4" fill={P.stoneDark} opacity=".3" />
          {[10, 40, 70].map((x) => (
            <g key={x}>
              <path d={`M${x} 64V34`} stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
              <path d={`M${x} 64V34`} stroke={P.metal} strokeWidth="1.4" strokeLinecap="round" />
            </g>
          ))}
          <path d="M8 34H72M8 30H72" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M8 34H72M8 30H72" stroke={P.metal} strokeWidth="1" strokeLinecap="round" />
          {Array.from({ length: Math.min(5, tier + 1) }, (_, i) => (
            <Panel key={i} x={8 + i * 12.8} y={34} w={11} snow={winter} />
          ))}
          {Array.from({ length: tier + 1 }, (_, k) => (
            <g key={k}>
              <path d={`M${15 + k * 10} 63l-1.6 -4h7.2l-1.6 4z`} fill={P.terracotta} {...detail} />
              <Herb x={17 + k * 10} y={59.4} kind={k % 3} season={season} />
            </g>
          ))}
          {tier >= 3 ? <path d="M70 46h4v18" stroke={P.outline} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {tier >= 3 ? <path d="M70 46h4v18" stroke={P.charcoal} strokeWidth=".8" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {tier >= 3 ? <rect x="72" y="58" width="5" height="6" rx=".5" fill={P.stone} {...detail} /> : null}
          {tier >= 4 ? <path d="M44 66h12M45 66v-3h10v3" stroke={P.outline} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
          {tier >= 4 ? <path d="M44 66h12M45 66v-3h10v3" stroke={P.woodMid} strokeWidth="1" fill="none" strokeLinecap="round" /> : null}
          {summer ? <g className="art-sky"><Old><Sun x={66} y={12} r={3.4} /></Old></g> : null}
          {tier >= 5 ? <Farmer x={50} y={66} c={P.leaf} s={0.75} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'kraeuterbalkon': {
      const boxes = Math.min(5, tier + 1)
      return (
        <Svg tier={tier} bold>
          <Skyline y={48} c={P.stone} />
          <Roof season={season} />
          <Railing x0={6} x1={74} y={56} />
          {Array.from({ length: boxes }, (_, i) => {
            const x = 6 + i * 14
            return (
              <g key={i}>
                <rect x={x} y={50} width="12" height="4" rx=".5" fill={P.terracotta} {...detail} />
                <path d={`M${x + 1.2} 52.6h5`} stroke={P.terracottaLight} strokeWidth={H} strokeLinecap="round" opacity=".7" />
                <Herb x={x + 3} y={50.6} kind={i % 3} season={season} />
                <Herb x={x + 9} y={50.6} kind={(i + 1) % 3} season={season} />
              </g>
            )
          })}
          {tier >= 3 ? [20, 34].slice(0, tier - 2).map((x, k) => (
            <g key={x}>
              <path d={`M${x} 67l-2 -5h9l-2 5z`} fill={P.terracottaLight} {...detail} />
              <Herb x={x + 2.5} y={62.4} kind={(k + 2) % 3} season={season} />
            </g>
          )) : null}
          {tier >= 4 ? <Old><Can x={56} y={67} c={P.terracotta} s={1.4} /></Old> : null}
          {summer ? <g className="art-sky"><Old><Sun x={68} y={12} r={3} /></Old></g> : null}
          {winter ? <g className="art-sky"><Old><Snowfall n={6} y1={40} /></Old></g> : null}
          {tier >= 5 ? <Kid x={70} y={69} c={P.yellow} s={1.1} /> : null}
        </Svg>
      )
    }
    case 'lastenaufzug': {
      const sacks = tier * 2
      return (
        <Svg tier={tier} bold>
          <Roof season={season} />
          <path d="M12 20l16 10M28 20l-16 10M12 30l16 10M28 30l-16 10M12 40l16 10M28 40l-16 10" stroke={P.outline} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 20l16 10M28 20l-16 10M12 30l16 10M28 30l-16 10M12 40l16 10M28 40l-16 10" stroke={P.metal} strokeWidth=".7" strokeLinecap="round" />
          <rect x="12" y="20" width="16" height="42" fill="none" stroke={P.outline} strokeWidth="2.4" strokeLinejoin="round" />
          <rect x="12" y="20" width="16" height="42" fill="none" stroke={P.metal} strokeWidth="1.1" strokeLinejoin="round" />
          <rect x="10" y="17" width="20" height="3" rx=".5" fill={P.charcoal} {...detail} />
          <rect x="13" y="20.6" width="14" height="1.2" fill={P.outline} opacity=".2" />
          <rect x="14" y="48" width="12" height="13" fill={P.stoneLight} {...line} />
          <path d="M15.6 50v9" stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".45" />
          <path d="M20 20v28" stroke={P.outline} strokeWidth={H} />
          {Array.from({ length: sacks }, (_, i) => (
            <g key={i}>
              <path d={`M${34 + (i % 5) * 7} ${63 - Math.floor(i / 5) * 4}h5.4l-.6 -3.6h-4.2z`} fill={P.woodLight} {...detail} />
              {winter && i >= sacks - 5 ? <path d={`M${34.6 + (i % 5) * 7} ${59.4 - Math.floor(i / 5) * 4}h4`} stroke={P.white} strokeWidth=".8" strokeLinecap="round" /> : null}
            </g>
          ))}
          {tier >= 3 ? (
            <g>
              <rect x="16" y="54" width="8" height="5" fill={P.woodMid} {...detail} />
              {!winter ? [18, 21].map((x) => <Old key={x}><Lettuce x={x} y={55} season={season} /></Old>) : null}
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <path d="M66.4 62l4 -1.6M60 65.4l-1 2" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M66.4 62l4 -1.6M60 65.4l-1 2" stroke={P.metal} strokeWidth=".8" strokeLinecap="round" />
              <path d="M58 62h9l-1.6 3.4h-6z" fill={P.leafDark} {...detail} />
              <circle cx="61" cy="66.6" r="1.4" fill={P.charcoal} {...detail} />
              <circle cx="61" cy="66.6" r=".4" fill={P.metal} />
            </g>
          ) : null}
          {autumn ? <Old><Rain n={5} y0={2} /></Old> : null}
          {tier >= 5 ? <Farmer x={70} y={72} c={P.denim} s={0.6} hat={P.yellow} /> : null}
        </Svg>
      )
    }
    case 'dachcafe': {
      const tables = Math.min(4, tier)
      const colors = [P.tomato, P.blue, P.yellow, P.leaf]
      return (
        <Svg tier={tier} bold>
          <Roof season={season} />
          <rect x="54" y="44" width="20" height="16" fill={P.woodLight} {...line} />
          <rect x="55" y="44.8" width="18" height="1.6" fill={P.outline} opacity=".18" />
          <path d="M52 44h24l-2 -4h-20z" fill={P.leafDark} {...detail} />
          <path d="M55 42.4h14" stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".3" />
          <rect x="56" y="48" width="16" height="5" fill={winter ? P.lamp : P.window} {...detail} />
          {Array.from({ length: tables }, (_, i) => {
            const x = 16 + (i % 2) * 22
            const y = 58 + Math.floor(i / 2) * 9
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(1.35) translate(${-x} ${-y})`}>
                <Old><Parasol x={x} y={y - 3} c={colors[i]!} open={summer || z === 'spring'} /></Old>
                <Old><CafeTable x={x} y={y} /></Old>
                {!winter ? <Old><Lettuce x={x} y={y - 3.6} s={0.7} season={season} /></Old> : null}
              </g>
            )
          })}
          {winter && tier >= 2 ? <Old><StringLights x0={50} x1={76} y={40} n={6} /></Old> : null}
          {tier >= 5 ? <Farmer x={64} y={70} c={P.white} s={0.6} hat={P.charcoal} /> : null}
          {autumn ? <g className="art-sky"><Old><Cloud x={20} y={12} s={1.2} c={P.stoneLight} /></Old></g> : null}
        </Svg>
      )
    }
    case 'saatgutschrank': {
      const drawers = 2 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Roof season={season} />
          <rect x="18" y="26" width="30" height="36" fill={P.woodMid} {...line} />
          <path d="M20 29v30" stroke={P.woodLight} strokeWidth={D} strokeLinecap="round" opacity=".4" />
          <path d="M16 26h34l-2 -3h-30z" fill={P.woodDark} {...detail} />
          <rect x="19" y="26.8" width="28" height="1.6" fill={P.outline} opacity=".18" />
          {Array.from({ length: drawers }, (_, i) => (
            <g key={i}>
              <rect x={20 + (i % 2) * 13.6} y={30 + Math.floor(i / 2) * 5.6} width="12" height="4.6" fill={P.woodLight} stroke={P.outline} strokeWidth={H} />
              <circle cx={26 + (i % 2) * 13.6} cy={32.3 + Math.floor(i / 2) * 5.6} r=".55" fill={P.brass} stroke={P.outline} strokeWidth={H * 0.5} />
            </g>
          ))}
          <Old><OmaTin x={33} y={22.6} s={1.3} /></Old>
          {tier >= 3 ? [56, 60, 64].map((x, i) => <Old key={x}><SeedJar x={x} y={62} s={1.3} seed={[P.seed, P.cream, P.berry][i]!} /></Old>) : null}
          {tier >= 4 ? [54, 58, 62, 66].map((x, i) => <Old key={x}><Packet x={x} y={54} c={[P.paper, P.label, P.canvas, P.cream][i]!} /></Old>) : null}
          {winter ? <path d="M17 23.4h32" stroke={P.white} strokeWidth="1.2" strokeLinecap="round" /> : null}
          {tier >= 5 ? <Kid x={70} y={70} c={P.berry} s={0.9} hair={P.woodDark} /> : null}
        </Svg>
      )
    }
    case 'abendrotfest': {
      const guests = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <circle cx="40" cy="44" r="14" fill={winter ? P.terracottaLight : P.orange} opacity=".85" />
          <circle cx="40" cy="44" r="9" fill={P.amber} opacity=".8" />
          <Skyline y={52} lit={tier >= 3} />
          <Roof season={season} cy={62} ry={8} />
          <Old><StringLights x0={6} x1={74} y={30} n={4 + tier} lit={tier >= 2} /></Old>
          {Array.from({ length: guests }, (_, i) => (
            <Farmer key={i} x={18 + i * 14} y={68 + (i % 2) * 2} c={[P.berry, P.blue, P.leaf, P.yellow][i]!} s={0.7} hat={[P.charcoal, P.woodLight, P.plum, P.woodDark][i]!} />
          ))}
          {tier >= 3 ? <path d="M66 66l4 -6M65 66.4a1.6 1.2 0 1 0 2.4 -1.6z" fill={P.woodMid} {...detail} /> : null}
          {winter ? <g className="art-sky"><Old><Snowfall n={6} y1={26} /></Old></g> : null}
          {z === 'spring' ? <g className="art-sky"><Old><Cloud x={14} y={14} s={0.9} c={P.pink} /></Old></g> : null}
        </Svg>
      )
    }
  }
  return null
}
