/**
 * Kapitel 47 — Solawi-Hof im kräftigen Stil (2026-11-14, Weinberg-Niveau): Acker,
 * Kohl, Möhren, Bohnenstangen, Folientunnel, Scheunen, Erdkeller, Hühnermobil,
 * Saatgut, Vogelscheuche und Werkzeug mit Kontur. Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Bunting } from './partsA'
import type { AreaProps } from './partsB'
import { TomatoPlant } from './partsC'
import { PotatoPlant, Squash } from './partsF'
import { Cloud, Lettuce, Snowfall, Sun } from './partsH'
import { Crate, Floor, Goose, Hen, Table } from './partsI'
import { Post } from '../parts/bold'
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

function Sky({ season }: { season?: string }) {
  const z = ssn(season)
  if (z === 'summer') return <g className="art-sky"><Old><Sun x={70} y={9} r={3} /></Old></g>
  if (z === 'spring') return <g className="art-sky"><Old><Cloud x={14} y={9} s={1.1} /></Old></g>
  if (z === 'autumn') return <g className="art-sky"><Old><Cloud x={64} y={9} s={1.2} c={P.stoneLight} /></Old></g>
  return <g className="art-sky"><Old><Snowfall n={7} y1={32} /></Old></g>
}

/** Ackerboden mit Furchen. */
function Field({ season, cy = 60, rx = 36, ry = 9 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={z === 'winter' ? P.cream : P.soil} {...line} />
      {[-4, 0, 4].map((d) => (
        <path key={d} d={`M${40 - rx * 0.85} ${cy + d}h${rx * 1.7}`} stroke={z === 'winter' ? P.white : P.soilDark} strokeWidth={D} strokeLinecap="round" opacity=".7" />
      ))}
    </g>
  )
}

/** Kohlkopf: Frühling klein, Sommer blaugrün, Herbst groß, Winter Grünkohl mit Schnee. */
function Cabbage({ x, y, season, s = 1 }: { x: number; y: number; season?: string; s?: number }) {
  const z = ssn(season)
  const k = z === 'spring' ? 0.6 : 1
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <ellipse cx="0" cy="-1.6" rx="2.6" ry="1.8" fill={z === 'winter' ? P.winterLeafDark : P.winterLeaf} {...detail} />
      <ellipse cx="0" cy="-2" rx="1.5" ry="1.1" fill={z === 'winter' ? P.white : P.winterLeafLight} stroke={P.outline} strokeWidth={H * 0.6} />
    </g>
  )
}

/** Möhrenreihe (fiedriges Grün). */
function CarrotTop({ x, y, season }: { x: number; y: number; season?: string }) {
  const z = ssn(season)
  if (z === 'winter') return <ellipse cx={x} cy={y - 0.4} rx="1.4" ry=".5" fill={P.white} stroke={P.outline} strokeWidth={H * 0.6} />
  const h = z === 'spring' ? 2.4 : 4.6
  const d = `M${x} ${y}l-1.4 -${h}M${x} ${y}v-${h + 0.6}M${x} ${y}l1.4 -${h}`
  return (
    <g>
      <path d={d} stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
      <path d={d} stroke={z === 'autumn' ? P.leafMoss : P.leafLight} strokeWidth=".9" strokeLinecap="round" />
    </g>
  )
}

/** Bohnenstange mit Ranke. */
function BeanPole({ x, y, season }: { x: number; y: number; season?: string }) {
  const z = ssn(season)
  return (
    <g>
      <path d={`M${x} ${y}V${y - 14}`} stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
      <path d={`M${x} ${y}V${y - 14}`} stroke={P.woodMid} strokeWidth="1" strokeLinecap="round" />
      {z !== 'winter' ? <path d={`M${x} ${y}q-1.4 -${z === 'spring' ? 2 : 4} 0 -${z === 'spring' ? 4 : 8}q1.4 -2 0 -${z === 'spring' ? 1 : 5}`} stroke={P.leafDark} strokeWidth=".9" fill="none" strokeLinecap="round" /> : null}
      {z === 'summer' || z === 'autumn'
        ? [-4, -8, -11].map((d) => <ellipse key={d} cx={x + (d % 2 ? 1 : -1)} cy={y + d} rx="1" ry=".7" fill={z === 'autumn' ? P.gold : P.leaf} stroke={P.outline} strokeWidth={H * 0.6} />)
        : null}
    </g>
  )
}

/** Folientunnel (Fußpunkt unten links). */
function Tunnel({ x, y, w, h = 14, season }: { x: number; y: number; w: number; h?: number; season?: string }) {
  const z = ssn(season)
  const hoops = Math.max(2, Math.round(w / 6))
  return (
    <g>
      <path d={`M${x} ${y}V${y - h * 0.4}Q${x} ${y - h} ${x + h * 0.6} ${y - h}H${x + w - h * 0.6}Q${x + w} ${y - h} ${x + w} ${y - h * 0.4}V${y}z`} fill={P.glass} opacity=".42" />
      <path d={`M${x} ${y}V${y - h * 0.4}Q${x} ${y - h} ${x + h * 0.6} ${y - h}H${x + w - h * 0.6}Q${x + w} ${y - h} ${x + w} ${y - h * 0.4}V${y}`} fill="none" {...line} />
      <path d={`M${x + 2} ${y - h * 0.45}Q${x + 2} ${y - h + 2} ${x + h * 0.6} ${y - h + 2}H${x + w * 0.5}`} stroke={P.white} strokeWidth={D} fill="none" strokeLinecap="round" opacity=".5" />
      {Array.from({ length: hoops + 1 }, (_, i) => (
        <path key={i} d={`M${x + (w / hoops) * i} ${y}v-${(h * (i === 0 || i === hoops ? 0.4 : 1)).toFixed(1)}`} stroke={P.outline} strokeWidth={H} opacity=".7" />
      ))}
      {z === 'winter' ? <path d={`M${x + 2} ${y - h + 0.6}H${x + w - 2}`} stroke={P.outline} strokeWidth="3.2" strokeLinecap="round" /> : null}
      {z === 'winter' ? <path d={`M${x + 2} ${y - h + 0.6}H${x + w - 2}`} stroke={P.white} strokeWidth="2.2" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Scheune mit Satteldach (Fußpunkt unten links). */
function Barn({ x, y, w, h, roof = P.roof, wall = P.barn, snow, door = true }: { x: number; y: number; w: number; h: number; roof?: string; wall?: string; snow?: boolean; door?: boolean }) {
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={wall} {...line} />
      {Array.from({ length: Math.floor(w / 4) }, (_, i) => <path key={i} d={`M${x + 4 + i * 4} ${y - h}v${h}`} stroke={P.outline} strokeWidth={H} opacity=".35" />)}
      <rect x={x + 0.8} y={y - h} width={w - 1.6} height="1.8" fill={P.outline} opacity=".18" />
      <path d={`M${x - 2} ${y - h}L${x + w / 2} ${y - h - w * 0.32}L${x + w + 2} ${y - h}z`} fill={roof} {...line} />
      <path d={`M${x + w * 0.12} ${y - h - w * 0.08 + 1}L${x + w * 0.34} ${y - h - w * 0.22 + 1}`} stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".4" />
      {snow ? <path d={`M${x - 1} ${y - h - 0.4}L${x + w / 2} ${y - h - w * 0.32 + 0.4}L${x + w + 1} ${y - h - 0.4}`} stroke={P.outline} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
      {snow ? <path d={`M${x - 1} ${y - h - 0.4}L${x + w / 2} ${y - h - w * 0.32 + 0.4}L${x + w + 1} ${y - h - 0.4}`} stroke={P.white} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
      {door ? <rect x={x + w / 2 - w * 0.18} y={y - h * 0.62} width={w * 0.36} height={h * 0.62} fill={P.woodDark} {...detail} /> : null}
    </g>
  )
}

export function Solawihof({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  const spring = z === 'spring'
  const autumn = z === 'autumn'
  switch (id) {
    case 'gemueseschlaege': {
      const rows = Math.min(5, tier + 1)
      return (
        <Svg tier={tier} bold>
          <Field season={season} />
          {Array.from({ length: rows }, (_, r) => {
            const y = 54 + r * 3.4
            return (
              <g key={r}>
                {Array.from({ length: 7 }, (_, k) => {
                  const x = 14 + k * 8.4 + (r % 2) * 2
                  const kind = r % 5
                  if (kind === 4) return k % 2 === 0 ? <BeanPole key={k} x={x} y={y} season={season} /> : null
                  if (kind === 0) return <Cabbage key={k} x={x} y={y} season={season} />
                  if (kind === 1) return <CarrotTop key={k} x={x} y={y} season={season} />
                  if (kind === 2) return <Old key={k}><PotatoPlant x={x} y={y} s={0.7} season={season} /></Old>
                  return <Old key={k}><Lettuce x={x} y={y} season={season} red={k % 2 === 0} /></Old>
                })}
              </g>
            )
          })}
          {tier >= 3 ? [10, 70].map((x) => <Post key={x} x={x} y={64} h={6} w={1.4} k={K} />) : null}
          {tier >= 3 ? <path d="M7 58h6l-1 2h-4z" fill={P.paper} {...detail} /> : null}
          {tier >= 4 ? <Farmer x={66} y={68} c={P.leafDark} s={1.15} hat={P.woodLight} /> : null}
          {tier >= 5 ? <Farmer x={22} y={70} c={P.berry} s={1.15} hat={P.charcoal} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'folientunnel': {
      const w = 26 + tier * 8
      const plants = Math.max(2, Math.floor((w - 8) / 7))
      return (
        <Svg tier={tier} bold>
          <Old><Floor season={season} /></Old>
          {Array.from({ length: plants }, (_, i) =>
            winter ? (
              <ellipse key={i} cx={40 - w / 2 + 5 + i * 7} cy={61} rx="2" ry=".8" fill={P.leafDark} stroke={P.outline} strokeWidth={H * 0.7} />
            ) : (
              <Old key={i}><TomatoPlant x={40 - w / 2 + 5 + i * 7} y={62} h={spring ? 6 : 11} ripe={autumn || (summer && i % 2 === 0)} fruits={spring ? 0 : 2} /></Old>
            ),
          )}
          <Tunnel x={40 - w / 2} y={63} w={w} h={20} season={season} />
          {tier >= 3 ? <path d={`M${40 - w / 2 - 1} 58h-4v5`} stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {tier >= 3 ? <path d={`M${40 - w / 2 - 1} 58h-4v5`} stroke={P.metal} strokeWidth=".9" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {tier >= 5 ? <Farmer x={40} y={70} c={P.leaf} s={1.15} hat={P.woodLight} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'abholraum': {
      const crates = 1 + tier
      const veg = winter ? [P.orange, P.winterLeaf, P.paper] : autumn ? [P.orange, P.berry, P.woodLight] : spring ? [P.leaf, P.red, P.leafPale] : [P.tomato, P.leaf, P.yellow]
      return (
        <Svg tier={tier} bold>
          <Old><Floor season={season} /></Old>
          <Barn x={10} y={60} w={60} h={30} wall={P.woodLight} roof={P.roof} snow={winter} door={false} />
          <rect x="16" y="34" width="48" height="26" fill={P.paper} {...detail} />
          <rect x="16.6" y="34.6" width="46.8" height="1.6" fill={P.outline} opacity=".15" />
          <rect x="20" y="37" width="14" height="9" fill={P.charcoal} {...detail} />
          {Array.from({ length: Math.min(4, tier + 1) }, (_, i) => <path key={i} d={`M22 ${39 + i * 2}h${6 + ((i * 3) % 5)}`} stroke={P.white} strokeWidth=".5" />)}
          <path d="M18 50h44" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M18 50h44" stroke={P.woodDark} strokeWidth="1" strokeLinecap="round" />
          {Array.from({ length: crates }, (_, i) => (
            <Old key={i}><Crate x={18 + (i % 3) * 14} y={i < 3 ? 60 : 50} w={11} fill={veg[i % 3]} /></Old>
          ))}
          {tier >= 3 ? (
            <g>
              <path d="M56 41.2v4M53 45h6" stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
              <path d="M56 41.2v4M53 45h6" stroke={P.metal} strokeWidth=".9" strokeLinecap="round" />
              <rect x="52" y="40" width="8" height="1.2" fill={P.metal} {...detail} />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={66} y={70} c={P.blue} s={1.15} hat={P.woodLight} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'kartoffelkeller': {
      const crates = Math.min(5, tier + 1)
      return (
        <Svg tier={tier} bold>
          <Old><Floor season={season} /></Old>
          <path d="M8 62Q12 34 40 32Q68 34 72 62z" fill={winter ? P.white : spring ? P.leafLight : autumn ? P.leafMoss : P.leaf} {...line} />
          <path d="M14 54Q18 38 34 35.4" stroke={P.white} strokeWidth={D} fill="none" strokeLinecap="round" opacity=".35" />
          <path d="M28 62V46h24v16z" fill={P.stoneLight} {...line} />
          <path d="M26 46q14 -8 28 0" fill={P.stone} {...line} />
          <rect x="28.8" y="46" width="22.4" height="1.6" fill={P.outline} opacity=".18" />
          <rect x="33" y="49" width="14" height="13" fill={P.woodDark} {...detail} />
          <path d="M40 49v13" stroke={P.outline} strokeWidth={H} />
          {([[6, 70], [15.6, 70], [56, 70], [65.6, 70], [10.8, 66.4]] as const).slice(0, crates).map(([x, y], i) => (
            <Old key={i}><Crate x={x} y={y} w={9} fill={P.woodLight} wood={P.wood} /></Old>
          ))}
          {tier >= 3 ? <path d="M20 66h6l-.6 -5h-4.8z" fill={P.paper} {...detail} /> : null}
          {tier >= 4 ? <path d="M40 31v-5" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" /> : null}
          {tier >= 4 ? <path d="M40 31v-5" stroke={P.metal} strokeWidth="1.3" strokeLinecap="round" /> : null}
          {tier >= 5 ? <Kid x={40} y={70} c={P.yellow} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'huehnermobil': {
      const hens = 1 + tier
      return (
        <Svg tier={tier} bold>
          <Old><Floor season={season} /></Old>
          <rect x="22" y="36" width="30" height="16" rx="1.2" fill={P.white} {...line} />
          <rect x="22.8" y="36" width="28.4" height="1.8" fill={P.outline} opacity=".15" />
          <path d="M20 36h34l-3 -5h-28z" fill={P.leafDark} {...line} />
          <path d="M24.4 32.4h12" stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".35" />
          {winter ? <path d="M21 31.4h32" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" /> : null}
          {winter ? <path d="M21 31.4h32" stroke={P.white} strokeWidth="1.4" strokeLinecap="round" /> : null}
          <rect x="26" y="40" width="5" height="4" fill={P.window} {...detail} />
          <rect x="43" y="40" width="5" height="4" fill={P.window} {...detail} />
          <path d="M34 52l6 8" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M34 52l6 8" stroke={P.woodMid} strokeWidth="1.3" strokeLinecap="round" />
          {[26, 48].map((x) => (
            <g key={x}>
              <circle cx={x} cy={53} r="3" fill={P.charcoal} {...detail} />
              <circle cx={x} cy={53} r="1" fill={P.metal} stroke={P.outline} strokeWidth={H * 0.6} />
            </g>
          ))}
          {tier >= 3 ? <path d="M8 66v-7M18 68v-7M62 68v-7M72 66v-7M8 61l10 2M62 63l10 -2" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d="M8 66v-7M18 68v-7M62 68v-7M72 66v-7M8 61l10 2M62 63l10 -2" stroke={P.metal} strokeWidth=".8" strokeLinecap="round" /> : null}
          {Array.from({ length: hens }, (_, i) => (
            <Old key={i}><Hen x={12 + ((i * 13) % 58)} y={64 + (i % 2) * 3} s={1.4} flip={i % 2 === 1} c={[P.woodMid, P.white, P.bark][i % 3]} /></Old>
          ))}
          {tier >= 5 ? <Farmer x={64} y={60} c={P.leafDark} s={1.15} hat={P.woodLight} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'hofsaatgut': {
      const n = 2 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Field season={season} />
          {Array.from({ length: n }, (_, i) => {
            const x = 12 + ((i * 9.3) % 56)
            const y = 58 + ((i * 5) % 8)
            if (winter) return <ellipse key={i} cx={x} cy={y - 0.4} rx="1.6" ry=".6" fill={P.white} stroke={P.outline} strokeWidth={H * 0.6} />
            if (spring) return <CarrotTop key={i} x={x} y={y} season="summer" />
            return (
              <g key={i}>
                <path d={`M${x} ${y}v-12M${x} ${y - 6}l-3 -3`} stroke={P.outline} strokeWidth="1.9" strokeLinecap="round" />
                <path d={`M${x} ${y}v-12M${x} ${y - 6}l-3 -3`} stroke={autumn ? P.woodLight : P.leafDark} strokeWidth=".9" strokeLinecap="round" />
                <ellipse cx={x} cy={y - 12.4} rx="2.6" ry="1" fill={autumn ? P.woodMid : P.white} stroke={P.outline} strokeWidth={H * 0.8} />
                <ellipse cx={x - 3} cy={y - 9.2} rx="1.4" ry=".6" fill={autumn ? P.woodMid : P.cream} stroke={P.outline} strokeWidth={H * 0.6} />
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <ellipse cx="62" cy="68" rx="9" ry="2.4" fill={P.paper} {...detail} />
              {[58, 61, 64, 66].map((x) => <circle key={x} cx={x} cy={67.6} r=".6" fill={P.seed} stroke={P.outline} strokeWidth={H * 0.5} />)}
            </g>
          ) : null}
          {tier >= 4 ? <ellipse cx="16" cy="68" rx="5" ry="1.8" fill={P.woodLight} {...detail} /> : null}
          {tier >= 4 ? <path d="M11.4 68h9.2" stroke={P.outline} strokeWidth={H} strokeDasharray=".6 .6" /> : null}
          {tier >= 5 ? <Farmer x={40} y={70} c={P.leaf} s={1.15} hat={P.woodLight} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'versammlung': {
      const people = 1 + tier
      return (
        <Svg tier={tier} bold>
          <Old><Floor season={season} /></Old>
          <Barn x={8} y={56} w={64} h={18} wall={P.woodMid} roof={P.roof} snow={winter} door={false} />
          <rect x="12" y="40" width="56" height="16" fill={P.woodDark} stroke={P.outline} strokeWidth={H} />
          <rect x="12" y="40" width="56" height="2" fill={P.outline} opacity=".2" />
          <rect x="34" y="42" width="12" height="8" fill={P.white} {...detail} />
          {Array.from({ length: Math.min(4, tier) }, (_, i) => <path key={i} d={`M36 ${43.6 + i * 1.6}h${4 + ((i * 3) % 5)}`} stroke={P.charcoal} strokeWidth=".4" />)}
          <path d="M14 66h52M16 66v2M64 66v2" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M14 66h52M16 66v2M64 66v2" stroke={P.woodLight} strokeWidth="1.1" strokeLinecap="round" />
          {Array.from({ length: people }, (_, i) => (
            <g key={i}>
              <Farmer x={14 + i * (52 / Math.max(1, people - 1))} y={66} c={[P.berry, P.blue, P.yellow, P.leaf, P.orange, P.plum][i % 6]!} s={1.1} hat={[P.woodLight, P.charcoal, P.woodDark][i % 3]!} />
              {i % 2 === 0 ? <rect x={15 + i * (52 / Math.max(1, people - 1))} y="58" width="1.8" height="2.2" fill={P.white} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
            </g>
          ))}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'werkzeugscheune': {
      const tools = 1 + tier
      return (
        <Svg tier={tier} bold>
          <Old><Floor season={season} /></Old>
          <Barn x={14} y={62} w={40} h={22} wall={P.barn} roof={P.terracotta} snow={winter} />
          {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${14 + i * 2} ${40 - i * 2}h${40 - i * 4}`} stroke={P.autumnDark} strokeWidth={H} opacity=".7" />)}
          <g transform="translate(58 62) scale(1.35) translate(-58 -62)">
          {Array.from({ length: tools }, (_, i) => {
            const x = 58 + (i % 3) * 5
            const y = 62 - Math.floor(i / 3) * 2
            return (
              <g key={i}>
                <path d={`M${x} ${y}V${y - 14}`} stroke={P.outline} strokeWidth="1.9" strokeLinecap="round" />
                <path d={`M${x} ${y}V${y - 14}`} stroke={P.woodLight} strokeWidth=".9" strokeLinecap="round" />
                {i % 3 === 0 ? (
                  <path d={`M${x - 1.6} ${y - 14}h3.2v2.4h-3.2z`} fill={P.metal} stroke={P.outline} strokeWidth={H * 0.8} />
                ) : i % 3 === 1 ? (
                  <g>
                    <path d={`M${x - 2} ${y - 14}h4M${x - 2} ${y - 14}v1.6M${x} ${y - 14}v1.6M${x + 2} ${y - 14}v1.6`} stroke={P.outline} strokeWidth="1.4" strokeLinecap="round" />
                    <path d={`M${x - 2} ${y - 14}h4M${x - 2} ${y - 14}v1.6M${x} ${y - 14}v1.6M${x + 2} ${y - 14}v1.6`} stroke={P.metal} strokeWidth=".6" strokeLinecap="round" />
                  </g>
                ) : (
                  <path d={`M${x - 1.4} ${y - 1}h2.8l-.4 -3h-2z`} fill={P.metal} stroke={P.outline} strokeWidth={H * 0.8} />
                )}
              </g>
            )
          })}
          </g>
          {tier >= 3 ? (
            <g>
              <path d="M8 66l8 -2l4 2" stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 66l8 -2l4 2" stroke={P.metal} strokeWidth=".9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 64h8l-1 -3h-6z" fill={P.leafDark} {...detail} />
              <circle cx="10" cy="66" r="1.4" fill={P.charcoal} {...detail} />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <Farmer x={30} y={70} c={P.denim} s={1.1} hat={P.woodDark} />
              <path d="M32.4 70l.6 -6" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M32.4 70l.6 -6" stroke={P.woodDark} strokeWidth=".8" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={44} y={70} c={P.leafDark} s={1.15} hat={P.woodLight} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'kinderacker': {
      const pumpkins = 1 + tier
      return (
        <Svg tier={tier} bold>
          <Field season={season} />
          {Array.from({ length: pumpkins }, (_, i) => (
            <Old key={i}><Squash x={12 + ((i * 11.3) % 52)} y={60 + ((i * 3) % 6)} s={1.3 + (i % 3) * 0.2} season={season} /></Old>
          ))}
          {tier >= 2 ? (
            <g>
              <path d="M40 66V40M33 47h14" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
              <path d="M40 66V40M33 47h14" stroke={P.woodDark} strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="40" cy="37" r="3" fill={P.paper} {...detail} />
              <path d="M35.6 36h8.8l-1.4 -3h-6z" fill={P.woodLight} {...detail} />
              <path d="M34 46h12l-2 8h-8z" fill={P.blue} {...detail} />
              <path d="M36 47.6l-1 5" stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".3" />
              <path d="M33 47l-2 3M47 47l2 3" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M33 47l-2 3M47 47l2 3" stroke={P.woodLight} strokeWidth=".8" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 3 ? <Kid x={22} y={70} c={P.red} s={1.5} /> : null}
          {tier >= 4 ? <Kid x={58} y={70} c={P.yellow} s={1.5} hair={P.woodLight} /> : null}
          {tier >= 5 ? <Kid x={68} y={66} c={P.leaf} s={1.4} skirt={P.berry} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'solawifest': {
      const cakes = 1 + tier
      return (
        <Svg tier={tier} bold>
          <Old><Floor season={season} /></Old>
          <Old><Bunting y={22} n={3 + tier} /></Old>
          <Old><Table x={12} y={60} w={50} c={P.cream} /></Old>
          {Array.from({ length: cakes }, (_, i) => (
            <g key={i}>
              <path d={`M${15 + i * 7.4} 55h6.4l-.4 -3.6h-5.6z`} fill={[P.woodLight, P.berry, P.wood][i % 3]} {...detail} />
              <path d={`M${14.8 + i * 7.4} 51.4h6.8`} stroke={P.outline} strokeWidth="1.9" strokeLinecap="round" />
              <path d={`M${14.8 + i * 7.4} 51.4h6.8`} stroke={P.cream} strokeWidth=".9" strokeLinecap="round" />
            </g>
          ))}
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <Farmer key={i} x={18 + i * 12} y={70} c={[P.berry, P.blue, P.yellow, P.leaf][i]!} s={1.15} hat={[P.woodLight, P.charcoal, P.plum, P.woodDark][i]!} />
          ))}
          {tier >= 2 ? <Old><Goose x={70} y={66} s={1.3} flip /></Old> : null}
          {tier >= 4 ? <Old><Goose x={66} y={70} s={1.2} flip /></Old> : null}
          {tier >= 5 ? <Kid x={8} y={70} c={P.orange} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
  }
  return null
}
