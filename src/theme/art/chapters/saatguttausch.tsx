/**
 * Kapitel 48 — Saatguttausch im kräftigen Stil (2026-11-14, Weinberg-Niveau):
 * Wiese, Tauschtische, Tütchen, Saatgutgläser, Erzählzelt, Briefstation,
 * Pflanzenregal, Weltküche, Bühne und Archivwagen mit Kontur. Jede Stufe
 * bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Bunting } from './partsA'
import type { AreaProps } from './partsB'
import { Fire } from './partsD'
import { LeafTree, Snowfall, Sun, Cloud } from './partsH'
import { Lantern, Letter } from './partsI'
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
  if (z === 'summer') return <g className="art-sky"><Old><Sun x={71} y={9} r={3} /></Old></g>
  if (z === 'spring') return <g className="art-sky"><Old><Cloud x={14} y={9} s={1.1} /></Old></g>
  if (z === 'autumn') return <g className="art-sky"><Old><Cloud x={64} y={9} s={1.2} c={P.stoneLight} /></Old></g>
  return <g className="art-sky"><Old><Snowfall n={7} y1={30} /></Old></g>
}

/** Wiese der alten Gartenschau je Jahreszeit, mit Kontur und etwas Licht. */
function Floor({ season, cy = 61, rx = 36, ry = 9 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const fill = z === 'winter' ? P.cream : z === 'autumn' ? P.leafMoss : P.leaf
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={fill} {...line} />
      <path d={`M${40 - rx * 0.6} ${cy - ry * 0.55}q${rx * 0.6} -${ry * 0.35} ${rx * 1.2} 0`} stroke={P.white} strokeWidth={D} opacity=".3" fill="none" strokeLinecap="round" />
      {z === 'spring' ? [-0.6, -0.2, 0.25, 0.65].map((d, i) => <circle key={d} cx={40 + rx * d} cy={cy + 1 + (i % 2) * 3} r=".9" fill={i % 2 ? P.yellow : P.white} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
      {z === 'summer' ? [-0.55, 0.05, 0.6].map((d) => <path key={d} d={`M${40 + rx * d} ${cy + 4}l-1 -2.2M${40 + rx * d} ${cy + 4}l1 -2.4`} stroke={P.leafDark} strokeWidth=".8" strokeLinecap="round" />) : null}
      {z === 'autumn' ? [-0.6, -0.25, 0.1, 0.45, 0.7].map((d, i) => <ellipse key={d} cx={40 + rx * d} cy={cy + 1 + (i % 3) * 2} rx="1.2" ry=".6" fill={[P.autumn, P.gold, P.autumnDark][i % 3]} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
      {z === 'winter' ? [-0.55, -0.15, 0.25, 0.6].map((d, i) => <ellipse key={d} cx={40 + rx * d} cy={cy + 1 + (i % 2) * 3} rx="3" ry=".9" fill={P.white} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
    </g>
  )
}

/** Tauschtisch: Beine doppelt gestrichen, Platte mit Kontur, Licht und Schatten. */
function Table({ x, y, w, c = P.cream, h = 4 }: { x: number; y: number; w: number; c?: string; h?: number }) {
  const legs = `M${x + 1} ${y}v-${h}M${x + w - 1} ${y}v-${h}`
  return (
    <g>
      <path d={legs} stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
      <path d={legs} stroke={P.woodDark} strokeWidth="1.1" strokeLinecap="round" />
      <rect x={x} y={y - h - 0.6} width={w} height="2.2" rx=".4" fill={c} {...detail} />
      <path d={`M${x + 1} ${y - h - 0.1}h${w - 2}`} stroke={P.white} strokeWidth={H} opacity=".5" strokeLinecap="round" />
      <rect x={x + 1.4} y={y - h + 1.6} width={w - 2.8} height=".8" fill={P.outline} opacity=".15" />
    </g>
  )
}

/** Zelt mit Spitzdach (Fußpunkt unten Mitte), vorn offen, mit Kontur. */
function Tent({ x, y, w = 20, h = 12, c = P.cream, stripe = P.tomato, inside = P.woodLight }: { x: number; y: number; w?: number; h?: number; c?: string; stripe?: string; inside?: string }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h * 0.6} width={w} height={h * 0.6} fill={c} {...line} />
      <rect x={x - w / 2 + 1} y={y - h * 0.6} width={w - 2} height="1.6" fill={P.outline} opacity=".18" />
      <rect x={x - w / 4} y={y - h * 0.5} width={w / 2} height={h * 0.5} fill={inside} {...detail} />
      <path d={`M${x - w / 2 - 1} ${y - h * 0.6}L${x} ${y - h}L${x + w / 2 + 1} ${y - h * 0.6}z`} fill={stripe} {...line} />
      <path d={`M${x - w * 0.36} ${y - h * 0.64}L${x - w * 0.12} ${y - h * 0.86}`} stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".4" />
      <path d={`M${x} ${y - h}v-2.4`} stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
      <path d={`M${x} ${y - h}v-2.4`} stroke={P.woodDark} strokeWidth=".8" strokeLinecap="round" />
      <path d={`M${x} ${y - h - 2.4}l2 .8l-2 .8z`} fill={P.yellow} stroke={P.outline} strokeWidth={H * 0.6} strokeLinejoin="round" />
    </g>
  )
}

/** Samentütchen mit Kontur. */
function Packet({ x, y, c = P.paper, s = 1 }: { x: number; y: number; c?: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1.4 0v-3.6l.4 -.4h2l.4 .4v3.6z" fill={c} stroke={P.outline} strokeWidth={(D * 0.7) / s} strokeLinejoin="round" />
      <circle cx="0" cy="-1.8" r=".6" fill={P.leaf} stroke={P.outline} strokeWidth={(H * 0.5) / s} />
    </g>
  )
}

/** Saatgutglas mit Kontur und Glanz. */
function SeedJar({ x, y, s = 1, seed = P.seed, lid = P.metal }: { x: number; y: number; s?: number; seed?: string; lid?: string }) {
  const w = (D * 0.7) / s
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1.4" y="-3.6" width="2.8" height="3.6" rx=".5" fill={P.glass} stroke={P.outline} strokeWidth={w} />
      <rect x="-1.2" y="-2" width="2.4" height="1.8" rx=".3" fill={seed} />
      <path d="M-.8 -3.2v1" stroke={P.white} strokeWidth={H / s} strokeLinecap="round" opacity=".6" />
      <rect x="-1.5" y="-4.2" width="3" height=".8" rx=".2" fill={lid} stroke={P.outline} strokeWidth={w * 0.8} />
    </g>
  )
}

const COATS = [P.berry, P.blue, P.yellow, P.leaf, P.orange, P.plum, P.denim, P.tomato]
const HATS = [P.woodLight, P.charcoal, P.woodDark, P.plum, P.cream]

/** Gast: Sommer ohne Mütze-Farbe, Winter dicke Mütze (weiß). */
function Guest({ x, y, i, season, s = 1.15 }: { x: number; y: number; i: number; season?: string; s?: number }) {
  const z = ssn(season)
  return <Farmer x={x} y={y} c={COATS[i % COATS.length]!} s={s} hat={z === 'winter' ? P.white : HATS[i % HATS.length]!} />
}

/** Bohne (liegend). */
function Bean({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx="1.6" ry="1" fill={c} stroke={P.outline} strokeWidth={H} />
      <circle cx={x - 0.4} cy={y - 0.3} r=".3" fill={P.white} opacity=".5" />
    </g>
  )
}

/** Topf auf dem Feuer. */
function Pot({ x, y, c = P.metal, steam = true }: { x: number; y: number; c?: string; steam?: boolean }) {
  return (
    <g>
      <path d={`M${x - 3} ${y - 4}h6v3a3 1.4 0 0 1 -6 0z`} fill={c} {...detail} />
      <path d={`M${x - 2} ${y - 3.2}v1.8`} stroke={P.white} strokeWidth={H} strokeLinecap="round" opacity=".4" />
      <rect x={x - 3.4} y={y - 4.6} width="6.8" height=".8" rx=".3" fill={P.charcoal} stroke={P.outline} strokeWidth={H} />
      {steam ? <path className="smoke" d={`M${x} ${y - 5.4}c-1 -2 1 -3 0 -5`} stroke={P.white} strokeWidth=".8" fill="none" strokeLinecap="round" opacity=".85" /> : null}
    </g>
  )
}

export function Saatguttausch({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  const spring = z === 'spring'
  const autumn = z === 'autumn'
  switch (id) {
    case 'tauschtische': {
      const packets = 3 + tier * 2
      const guests = Math.min(3, Math.max(0, tier - 1))
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <Table x={8} y={62} w={30} c={P.paper} h={7} />
          <Table x={42} y={62} w={30} c={P.blossom} h={7} />
          {Array.from({ length: packets }, (_, i) => (
            <Packet key={i} x={i < 7 ? 11.6 + i * 4 : 45.6 + (i - 7) * 4} y={54.2} c={[P.paper, P.yellow, P.glass, P.cream][i % 4]} s={1.25} />
          ))}
          {Array.from({ length: guests }, (_, i) => (
            <Guest key={i} x={20 + i * 20} y={70} i={i} season={season} />
          ))}
          {tier >= 4 ? <Old><Bunting y={24} n={tier + 2} /></Old> : null}
          {tier >= 5 ? <Kid x={70} y={70} c={P.orange} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'sortenschau': {
      const jars = 2 + tier
      const beanColors = [P.berry, P.white, P.ink, P.woodMid, P.plum, P.cream, P.tomato]
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <Post x={14} y={60} h={30} w={1.6} k={K} />
          <Post x={66} y={60} h={30} w={1.6} k={K} />
          <rect x="14" y="30" width="52" height="10" rx=".6" fill={P.cream} {...line} />
          <path d="M16 31.4h48" stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".5" />
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => <g key={i}><Bean x={20 + i * 8} y={34} c={beanColors[i % beanColors.length]!} /><path d={`M${18 + i * 8} 37.4h4`} stroke={P.stoneDark} strokeWidth=".7" strokeLinecap="round" /></g>)}
          <Table x={12} y={62} w={56} c={P.paper} />
          {Array.from({ length: jars }, (_, i) => (
            <SeedJar key={i} x={17 + i * (46 / Math.max(1, jars - 1))} y={57} s={1.4} seed={beanColors[i % beanColors.length]!} />
          ))}
          {tier >= 3 ? Array.from({ length: 8 }, (_, i) => <Bean key={i} x={18 + i * 2.4} y={57.6 + (i % 2) * 0.4} c={beanColors[i % beanColors.length]!} />) : null}
          {tier >= 4 ? <Guest x={70} y={70} i={2} season={season} /> : null}
          {tier >= 5 ? <Kid x={8} y={70} c={P.leaf} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'erzaehlzelt': {
      const listeners = Math.min(5, tier + 1)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <Tent x={40} y={60} w={50} h={40} c={winter ? P.paper : P.cream} stripe={P.terracotta} inside={P.woodDark} />
          <ellipse cx="40" cy="60" rx="12" ry="1.6" fill={P.woodLight} {...detail} />
          <Guest x={40} y={58} i={5} season={season} s={1.1} />
          {Array.from({ length: listeners }, (_, i) => {
            const x = 14 + i * (52 / Math.max(1, listeners - 1))
            return i === Math.floor(listeners / 2) && listeners % 2 === 1 ? <Kid key={i} x={x} y={70} c={COATS[i]!} s={1.5} /> : <Kid key={i} x={x} y={70} c={COATS[(i + 3) % COATS.length]!} s={1.5} hair={i % 2 ? P.woodDark : P.ink} />
          })}
          {tier >= 3 ? [24, 56].map((x) => <Old key={x}><Lantern x={x} y={28} c={autumn || winter ? P.orange : P.yellow} /></Old>) : null}
          {tier >= 4 ? <Old><Lantern x={40} y={24} c={P.red} /></Old> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'briefstation': {
      const letters = 2 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <Post x={10} y={62} h={34} w={2} k={K} />
          <Post x={70} y={62} h={34} w={2} k={K} />
          <path d="M10 30Q40 38 70 30" stroke={P.outline} strokeWidth={H * 1.3} fill="none" strokeLinecap="round" />
          {tier >= 3 ? <path d="M10 42Q40 50 70 42" stroke={P.outline} strokeWidth={H * 1.3} fill="none" strokeLinecap="round" /> : null}
          {Array.from({ length: letters }, (_, i) => {
            const row = i < 7 ? 0 : 1
            const k = row ? i - 7 : i
            const t = (k + 0.5) / 7
            const x = 10 + 60 * t
            const y = (row ? 42 : 30) + 8 * 2 * t * (1 - t) + 3
            return <Old key={i}><Letter x={x} y={y} s={1.3} c={[P.paper, P.cream, P.blossom, P.glass][i % 4]} /></Old>
          })}
          <rect x="62" y="52" width="7" height="10" rx="1.4" fill={P.yellow} {...detail} />
          <rect x="66.6" y="53" width="1.6" height="8" fill={P.outline} opacity=".15" />
          <path d="M63.4 55.8v4.6" stroke={P.white} strokeWidth={H} strokeLinecap="round" opacity=".5" />
          <rect x="63.4" y="54" width="4.2" height=".8" fill={P.charcoal} />
          {tier >= 2 ? <Guest x={30} y={70} i={1} season={season} /> : null}
          {tier >= 4 ? <Guest x={44} y={70} i={4} season={season} /> : null}
          {tier >= 5 ? <Kid x={54} y={70} c={P.berry} s={1.5} hair={P.woodDark} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'samenwerkstatt': {
      const kids = Math.min(4, tier + 1)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <Table x={14} y={62} w={52} c={P.woodLight} h={3} />
          {Array.from({ length: 2 + tier * 2 }, (_, i) => (
            <Packet key={i} x={17 + ((i * 4.7) % 46)} y={58.8} c={i % 3 === 0 ? P.paper : i % 3 === 1 ? P.canvas : P.label} s={0.8} />
          ))}
          {tier >= 2 ? (
            <g>
              <rect x="44" y="56" width="3" height="2.4" rx=".3" fill={P.woodDark} stroke={P.outline} strokeWidth={H} />
              <rect x="43.4" y="58.2" width="4.2" height=".7" fill={P.red} stroke={P.outline} strokeWidth={H * 0.7} />
            </g>
          ) : null}
          {Array.from({ length: kids }, (_, i) => (
            <Kid key={i} x={18 + i * (44 / Math.max(1, kids - 1))} y={70} c={COATS[(i + 2) % COATS.length]!} s={1.5} hair={i % 2 ? P.woodDark : P.bark} />
          ))}
          {tier >= 5 ? <Farmer x={72} y={68} c={P.leaf} s={1.15} hat={P.charcoal} skirt={P.denim} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'pflanzenboerse': {
      const pots = 3 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <path d="M12 62V40h56v22M12 51h56" stroke={P.outline} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 62V40h56v22M12 51h56" stroke={P.woodMid} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {Array.from({ length: pots }, (_, i) => {
            const row = i < 7 ? 0 : 1
            const k = row ? i - 7 : i
            const x = 16 + k * 8
            const y = row ? 51 : 62
            const milk = i % 4 === 3
            return (
              <g key={i}>
                {milk ? (
                  <g>
                    <rect x={x - 1.4} y={y - 4} width="2.8" height="4" fill={P.white} stroke={P.outline} strokeWidth={H} />
                    <rect x={x - 1.4} y={y - 2.4} width="2.8" height="1" fill={P.blue} />
                  </g>
                ) : <path d={`M${x - 1.4} ${y}l-.4 -3.2h3.6l-.4 3.2z`} fill={P.white} stroke={P.outline} strokeWidth={H} strokeLinejoin="round" />}
                {winter ? <path d={`M${x} ${y - 3.4}v-1.4`} stroke={P.leafDark} strokeWidth=".9" strokeLinecap="round" /> : (
                  <g>
                    <path d={`M${x} ${y - 3.4}v-3M${x} ${y - 5}l-1.6 -1M${x} ${y - 5.6}l1.6 -1`} stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
                    <path d={`M${x} ${y - 3.4}v-3M${x} ${y - 5}l-1.6 -1M${x} ${y - 5.6}l1.6 -1`} stroke={autumn ? P.leafMoss : P.leaf} strokeWidth=".9" strokeLinecap="round" />
                  </g>
                )}
                {summer && i % 3 === 0 ? <circle cx={x} cy={y - 6.8} r=".9" fill={P.tomato} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
              </g>
            )
          })}
          {tier >= 3 ? <Guest x={70} y={70} i={6} season={season} /> : null}
          {tier >= 5 ? <Kid x={8} y={70} c={P.yellow} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'weltkueche': {
      const pots = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <path d="M8 30h64l-4 -6h-56z" fill={P.leafDark} {...line} />
          <path d="M14 25.8h22" stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".3" />
          <rect x="12" y="30.6" width="56" height="1.4" fill={P.outline} opacity=".15" />
          <Old><Bunting y={30} n={4 + tier} x0={8} x1={72} /></Old>
          <Post x={12} y={62} h={31} w={1.8} k={K} />
          <Post x={68} y={62} h={31} w={1.8} k={K} />
          <rect x="14" y="52" width="52" height="10" fill={P.wood} {...line} />
          <rect x="15" y="52.6" width="50" height="1.2" fill={P.outline} opacity=".18" />
          <rect x="14" y="50.6" width="52" height="1.6" rx=".4" fill={P.woodLight} {...detail} />
          {Array.from({ length: pots }, (_, i) => (
            <Pot key={i} x={20 + i * 13} y={50.6} c={[P.metal, P.terracotta, P.charcoal, P.blue][i]!} steam={tier >= 2} />
          ))}
          {tier >= 3 ? <Old><Fire x={62} y={62} s={0.8} /></Old> : null}
          {tier >= 3 ? Array.from({ length: 4 }, (_, i) => <circle key={i} cx={22 + i * 4} cy={56} r="1" fill={[P.orange, P.leafLight, P.berry, P.yellow][i]} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
          {tier >= 4 ? <Guest x={28} y={70} i={2} season={season} /> : null}
          {tier >= 5 ? <Guest x={50} y={70} i={6} season={season} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'musikbuehne': {
      const band = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <path d="M12 50V26M68 50V26M10 26h60" stroke={P.outline} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 50V26M68 50V26M10 26h60" stroke={P.woodDark} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="10" y="50" width="60" height="8" fill={P.woodMid} {...line} />
          <rect x="11" y="55.4" width="58" height="1.8" fill={P.outline} opacity=".18" />
          <path d="M11.4 51.2h57.2" stroke={P.woodLight} strokeWidth={D} strokeLinecap="round" />
          <Old><Bunting y={26} n={4 + tier} x0={10} x1={70} /></Old>
          {Array.from({ length: band }, (_, i) => {
            const x = 20 + i * 13
            return (
              <g key={i}>
                <Guest x={x} y={48} i={i + 1} season={season} />
                {i === 0 ? <path d={`M${x + 1.4} 41l3 -2M${x + 0.6} 40.6l2.2 1.6`} stroke={P.outline} strokeWidth="1.6" strokeLinecap="round" /> : null}
                {i === 0 ? <path d={`M${x + 1.4} 41l3 -2M${x + 0.6} 40.6l2.2 1.6`} stroke={P.woodDark} strokeWidth=".7" strokeLinecap="round" /> : null}
                {i === 1 ? <rect x={x - 2.4} y={40} width="4.8" height="3" rx=".4" fill={P.berry} stroke={P.outline} strokeWidth={H} /> : null}
                {i === 2 ? <ellipse cx={x + 2.6} cy={46} rx="2" ry="1.4" fill={P.woodLight} stroke={P.outline} strokeWidth={H} /> : null}
                {i === 3 ? <path d={`M${x + 1.4} 42l2.6 -3`} stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" /> : null}
                {i === 3 ? <path d={`M${x + 1.4} 42l2.6 -3`} stroke={P.woodMid} strokeWidth="1.1" strokeLinecap="round" /> : null}
              </g>
            )
          })}
          {tier >= 2 ? <Kid x={16} y={70} c={P.yellow} s={1.5} /> : null}
          {tier >= 3 ? <Kid x={64} y={70} c={P.leaf} s={1.5} hair={P.woodDark} skirt={P.berry} /> : null}
          {tier >= 5 ? <Guest x={40} y={70} i={4} season={season} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'archivwagen': {
      const jars = 3 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <rect x="12" y="28" width="48" height="26" rx="2" fill={P.leafDark} {...line} />
          <path d="M10 28q26 -8 52 0z" fill={P.leafMoss} {...line} />
          <path d="M18 26.2q8 -2.6 16 -3" stroke={P.white} strokeWidth={D} fill="none" strokeLinecap="round" opacity=".35" />
          {winter ? <path d="M12 26.6q24 -6 48 0" stroke={P.outline} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
          {winter ? <path d="M12 26.6q24 -6 48 0" stroke={P.white} strokeWidth="1.2" fill="none" strokeLinecap="round" /> : null}
          <rect x="16" y="32" width="40" height="18" fill={P.paper} {...detail} />
          <rect x="16.6" y="32.6" width="38.8" height="1.6" fill={P.outline} opacity=".15" />
          {[38, 44, 50].map((y) => <path key={y} d={`M16 ${y}h40`} stroke={P.woodMid} strokeWidth={D} strokeLinecap="round" />)}
          {Array.from({ length: jars }, (_, i) => {
            const row = Math.floor(i / 7)
            return <SeedJar key={i} x={19 + (i % 7) * 5.6} y={38 + row * 6} s={1} seed={[P.seed, P.berry, P.yellow, P.leafMoss, P.cream][i % 5]} />
          })}
          <circle cx="20" cy="56" r="3" fill={P.charcoal} {...detail} />
          <circle cx="20" cy="56" r="1" fill={P.metal} stroke={P.outline} strokeWidth={H} />
          <circle cx="52" cy="56" r="3" fill={P.charcoal} {...detail} />
          <circle cx="52" cy="56" r="1" fill={P.metal} stroke={P.outline} strokeWidth={H} />
          <path d="M60 50l8 4" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M60 50l8 4" stroke={P.woodDark} strokeWidth="1.1" strokeLinecap="round" />
          {tier >= 4 ? <Farmer x={68} y={70} c={P.white} s={1.15} hat={P.ink} /> : null}
          {tier >= 5 ? <Kid x={10} y={70} c={P.blue} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'abschlussrunde': {
      const n = 3 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {spring || summer ? <Old><LeafTree x={40} y={40} s={1} season={season} blossom={P.blossom} n={4} /></Old> : null}
          {autumn || winter ? <Old><LeafTree x={40} y={40} s={1} season={season} n={4} /></Old> : null}
          <ellipse cx="40" cy="60" rx="24" ry="6" fill="none" stroke={P.woodMid} strokeWidth=".9" strokeLinecap="round" strokeDasharray="1.4 1.2" />
          {Array.from({ length: n }, (_, i) => {
            const a = (i / n) * Math.PI * 2 + 0.3
            const x = 40 + Math.cos(a) * 24
            const y = 62 + Math.sin(a) * 6
            return (
              <g key={i}>
                {i % 4 === 3 ? <Kid x={x} y={y + 2} c={COATS[i % COATS.length]!} s={1.4} /> : <Guest x={x} y={y} i={i} season={season} s={1.05} />}
                <Packet x={x + 2} y={y - 3.4} c={[P.paper, P.yellow, P.blossom][i % 3]} s={0.6} />
              </g>
            )
          })}
          {tier >= 4 ? <Old><Lantern x={20} y={24} c={P.orange} /></Old> : null}
          {tier >= 4 ? <Old><Lantern x={60} y={24} c={P.red} /></Old> : null}
          <Sky season={season} />
        </Svg>
      )
    }
  }
  return null
}
