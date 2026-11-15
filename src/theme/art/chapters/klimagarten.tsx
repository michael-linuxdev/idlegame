/**
 * Kapitel 44 — Klimagarten (Schwammstadt) im kräftigen Stil (2026-11-14,
 * Weinberg-Niveau): Boden, Trockenstauden, Mulde mit Wasser, Mulchweg, Zisterne
 * mit Regenrinnen, Wetterstation, Lehrküche und Infotafel mit Kontur. Jede
 * Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Farmer, Kid } from './figures'
import { Bunting } from './partsA'
import type { AreaProps } from './partsB'
import { Rain } from './partsF'
import { Can, Cloud, LeafLitter, LeafTree, Snowfall, SnowDrifts, Sun } from './partsH'
import { ssn } from './season'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Boden: Frühling feucht dunkel, Sommer trocken hell mit Rissen, Herbst Laub, Winter Frost. */
function Floor({ season, cy = 61, rx = 36, ry = 9 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const fill = z === 'spring' ? P.soil : z === 'summer' ? P.woodLight : z === 'autumn' ? P.woodMid : P.cream
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={fill} {...line} />
      <path d={`M${40 - rx * 0.6} ${cy - ry * 0.62}q${rx * 0.6} -${ry * 0.3} ${rx * 1.2} 0`} stroke={P.white} strokeWidth=".8" strokeLinecap="round" fill="none" opacity=".25" />
      {z === 'summer' ? <path d={`M${40 - rx * 0.6} ${cy + 3}l3 -1l2 1.4M${40 + rx * 0.3} ${cy + 4}l2 -1.4l3 .6`} stroke={P.woodDark} strokeWidth=".6" strokeLinecap="round" strokeLinejoin="round" fill="none" /> : null}
      {z === 'autumn' ? <Old><LeafLitter cy={cy + 2} w={rx * 1.6} n={8} /></Old> : null}
      {z === 'winter' ? <Old><SnowDrifts cy={cy + 2} w={rx * 1.4} /></Old> : null}
    </g>
  )
}

/** Wetter über dem Motiv: Frühling Schauer, Sommer Sonne, Herbst Starkregen, Winter Schnee. */
function Weather({ season }: { season?: string }) {
  const z = ssn(season)
  if (z === 'summer') return <g className="art-sky"><Old><Sun x={68} y={12} r={3.4} /></Old></g>
  if (z === 'spring') return <g className="art-sky"><Old><Cloud x={18} y={10} s={1.1} c={P.stoneLight} /></Old><Old><Rain n={4} x0={10} x1={28} y0={14} h={6} /></Old></g>
  if (z === 'autumn') return <g className="art-sky"><Old><Cloud x={58} y={10} s={1.3} c={P.stone} /></Old><Old><Rain n={6} x0={46} x1={72} y0={14} h={8} /></Old></g>
  return <g className="art-sky"><Old><Snowfall n={6} y1={34} /></Old></g>
}

/** Trockenheitsliebende Staude: 0 Lavendel, 1 Salbei, 2 Fetthenne. */
function DryPlant({ x, y, kind, season }: { x: number; y: number; kind: number; season?: string }) {
  const z = ssn(season)
  const winter = z === 'winter'
  const leaf = kind === 0 ? P.winterLeafLight : kind === 1 ? P.winterLeaf : P.leafLight
  const flower = kind === 0 ? P.lavender : kind === 1 ? P.blue : z === 'autumn' ? P.berry : P.pink
  const blooms = (kind === 0 && z === 'summer') || (kind === 1 && (z === 'spring' || z === 'summer')) || (kind === 2 && (z === 'summer' || z === 'autumn'))
  return (
    <g>
      <ellipse cx={x} cy={y - 2.4} rx="3.4" ry="2.4" fill={winter ? P.winterLeafDark : leaf} {...detail} />
      <path d={`M${x - 2} ${y - 3.6}q2 -1.2 4 0`} stroke={P.white} strokeWidth=".5" strokeLinecap="round" fill="none" opacity=".35" />
      {kind === 0 && !winter ? <path d={[-2, -0.6, 0.8, 2.2].map((d) => `M${x + d * 0.6} ${y - 3.6}l${d * 0.5} -4`).join('')} stroke={P.outline} strokeWidth="1.9" strokeLinecap="round" /> : null}
      {kind === 0 && !winter ? [-2, -0.6, 0.8, 2.2].map((d) => <path key={d} d={`M${x + d * 0.6} ${y - 3.6}l${d * 0.5} -4`} stroke={blooms ? flower : P.winterLeaf} strokeWidth="1" strokeLinecap="round" />) : null}
      {kind === 1 && blooms ? <path d={`M${x - 1.4} ${y - 4}v-3M${x + 1.4} ${y - 4}v-3`} stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" /> : null}
      {kind === 1 && blooms ? [-1.4, 1.4].map((d) => <path key={d} d={`M${x + d} ${y - 4}v-3`} stroke={flower} strokeWidth="1" strokeDasharray=".6 .4" />) : null}
      {kind === 2 && blooms ? <ellipse cx={x} cy={y - 4.6} rx="2.4" ry="1.1" fill={flower} stroke={P.outline} strokeWidth={H * 0.7} /> : null}
      {winter ? <path d={`M${x - 3} ${y - 4}q3 -1.6 6 0`} stroke={P.white} strokeWidth="1" strokeLinecap="round" fill="none" /> : null}
    </g>
  )
}

/** Möhre (fiedriges Grün) bzw. Zwiebel (Röhrenblätter). */
function Veg({ x, y, kind, season }: { x: number; y: number; kind: number; season?: string }) {
  const z = ssn(season)
  if (z === 'winter') return <ellipse cx={x} cy={y - 0.5} rx="1.6" ry=".6" fill={P.white} stroke={P.outline} strokeWidth={H * 0.5} />
  const h = z === 'spring' ? 3 : 6
  if (kind === 0) {
    return (
      <g>
        {z !== 'spring' ? <path d={`M${x - 0.7} ${y}h1.4l-.7 2.2z`} fill={P.orange} stroke={P.outline} strokeWidth={H * 0.5} strokeLinejoin="round" /> : null}
        <path d={`M${x} ${y}l-2 -${h}M${x} ${y}v-${h + 1}M${x} ${y}l2 -${h}`} stroke={z === 'autumn' ? P.leafMoss : P.leaf} strokeWidth=".9" strokeDasharray="1 .4" />
      </g>
    )
  }
  return (
    <g>
      {z !== 'spring' ? <ellipse cx={x} cy={y - 0.4} rx="1.3" ry="1.1" fill={P.paper} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
      <path d={`M${x - 0.5} ${y - 1}l-.6 -${h}M${x + 0.5} ${y - 1}l.6 -${h}M${x} ${y - 1}v-${h + 1}`} stroke={z === 'autumn' ? P.woodLight : P.leafDark} strokeWidth=".9" strokeLinecap="round" />
    </g>
  )
}

/** Heckenstrauch: Frühling weiße Blüte (Weißdorn), Sommer grün, Herbst rote Hagebutten, Winter kahl. */
function HedgeShrub({ x, y, s = 1, season, n = 4 }: { x: number; y: number; s?: number; season?: string; n?: number }) {
  const z = ssn(season)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy=".2" rx="5" ry="1.2" fill={P.outline} opacity=".15" />
      <path d="M0 0l-3 -8M0 0v-10M0 0l3 -8" stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
      <path d="M0 0l-3 -8M0 0v-10M0 0l3 -8" stroke={P.bark} strokeWidth="1" strokeLinecap="round" />
      {z === 'winter' ? (
        <path d="M-3 -8l-1 -2M3 -8l1 -2M-3.4 -8.6l1.4 .4" stroke={P.white} strokeWidth=".9" strokeLinecap="round" />
      ) : (
        <g>
          <ellipse cx="0" cy="-8" rx="6" ry="5" fill={z === 'autumn' ? P.autumnDark : P.leafDark} {...detail} />
          <ellipse cx="-1.6" cy="-9.6" rx="3" ry="2" fill={z === 'autumn' ? P.autumn : P.leaf} />
          <path d="M-4.4 -10.6q1.8 -2 4.6 -1.8" stroke={P.white} strokeWidth=".6" strokeLinecap="round" fill="none" opacity=".35" />
        </g>
      )}
      {Array.from({ length: z === 'winter' ? 0 : n }, (_, i) => (
        <circle key={i} cx={-4 + ((i * 3) % 8)} cy={-10 + ((i * 5) % 6)} r=".8" fill={z === 'spring' ? P.white : z === 'autumn' ? P.berry : P.leafPale} stroke={P.outline} strokeWidth={H * 0.5} />
      ))}
    </g>
  )
}

export function Klimagarten({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  const spring = z === 'spring'
  const autumn = z === 'autumn'
  const wet = spring || autumn
  switch (id) {
    case 'trockenbeet': {
      const n = 2 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <ellipse cx="40" cy="60" rx="30" ry="7" fill={winter ? P.white : P.stoneLight} {...line} />
          {[16, 30, 52, 62].map((x, i) => (
            <ellipse key={x} cx={x} cy={62 - (i % 2) * 4} rx="2.4" ry="1.4" fill={P.stone} {...detail} />
          ))}
          {Array.from({ length: n }, (_, i) => (
            <DryPlant key={i} x={14 + ((i * 11) % 54)} y={58 + ((i * 7) % 8)} kind={i % 3} season={season} />
          ))}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.leaf} s={0.75} hat={P.woodLight} /> : null}
          <Weather season={season} />
        </Svg>
      )
    }
    case 'schwammflaeche': {
      const plants = 2 + tier * 2
      const water = winter ? P.glassEdge : wet ? P.water : null
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <ellipse cx="40" cy="61" rx="26" ry="6.4" fill={winter ? P.cream : summer ? P.leafMoss : P.soilDark} {...line} />
          {water ? <ellipse cx="40" cy="61.6" rx={10 + tier * 2.4} ry={2.4 + tier * 0.5} fill={water} {...detail} /> : null}
          {water ? <path d={`M${34 - tier} 60.4q${6 + tier} -1.4 ${12 + tier * 2} 0`} stroke={P.white} strokeWidth=".7" strokeLinecap="round" fill="none" opacity=".45" /> : null}
          {spring || autumn ? <path d="M6 54q8 2 14 6" stroke={P.outline} strokeWidth="2.4" fill="none" strokeDasharray="2 1" /> : null}
          {spring || autumn ? <path d="M6 54q8 2 14 6" stroke={P.waterLight} strokeWidth="1.2" fill="none" strokeDasharray="2 1" /> : null}
          {Array.from({ length: plants }, (_, i) => {
            const a = (i / plants) * Math.PI * 2
            const x = 40 + Math.cos(a) * 24
            const y = 61 + Math.sin(a) * 5.6
            return (
              <g key={i}>
                <path d={`M${x.toFixed(2)} ${y.toFixed(2)}l-1.4 -6M${x.toFixed(2)} ${y.toFixed(2)}v-7M${x.toFixed(2)} ${y.toFixed(2)}l1.4 -6`} stroke={winter ? P.woodLight : autumn ? P.gold : P.leafDark} strokeWidth="1" strokeLinecap="round" />
                {summer && i % 2 === 0 ? <ellipse cx={x} cy={y - 7.4} rx="1" ry="1.4" fill={P.lavender} stroke={P.outline} strokeWidth={H * 0.5} /> : null}
              </g>
            )
          })}
          {tier >= 4 ? <path d="M66 52h8v8" stroke={P.outline} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {tier >= 4 ? <path d="M66 52h8v8" stroke={P.metal} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {tier >= 5 ? <Kid x={70} y={72} c={P.yellow} s={1.1} /> : null}
          <Weather season={season} />
        </Svg>
      )
    }
    case 'mulchwege': {
      const beds = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <path d="M12 65L68 55" stroke={P.outline} strokeWidth="8.6" strokeLinecap="round" />
          <path d="M12 65L68 55" stroke={winter ? P.white : P.woodMid} strokeWidth="7" strokeLinecap="round" />
          {!winter ? Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${13 + i * 4.6} ${64.6 - i * 0.82}l1.4 -.6`} stroke={P.woodLight} strokeWidth=".8" strokeLinecap="round" />) : null}
          {Array.from({ length: beds }, (_, i) => {
            const x = 10 + (i % 2) * 34
            const y = i < 2 ? 56 : 70
            return (
              <g key={i}>
                <rect x={x} y={y - 6} width="24" height="5" rx="1" fill={winter ? P.cream : P.compost} {...detail} />
                {winter ? null : [4, 10, 16, 20].map((dx) => <ellipse key={dx} cx={x + dx} cy={y - 7} rx="2" ry="1.4" fill={autumn ? P.leafMoss : P.leaf} stroke={P.outline} strokeWidth={H * 0.6} />)}
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <path d="M70 64l4 -1.6" stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
              <path d="M70 64l4 -1.6" stroke={P.woodMid} strokeWidth="1" strokeLinecap="round" />
              <path d="M60 64h10l-1.6 3.4h-7z" fill={P.leafDark} {...detail} />
              <ellipse cx="65" cy="63.6" rx="5" ry="1.4" fill={P.woodLight} stroke={P.outline} strokeWidth={H} />
              <circle cx="62" cy="68.4" r="1.4" fill={P.charcoal} {...detail} />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={54} y={72} c={P.blue} s={0.75} hat={P.woodLight} /> : null}
          <Weather season={season} />
        </Svg>
      )
    }
    case 'schattenbaum': {
      const s = 1.2 + tier * 0.15
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {!winter ? <ellipse cx={summer ? 46 : 42} cy="63" rx={10 + tier * 3} ry="4" fill={P.leafDark} opacity=".35" /> : null}
          <Old><LeafTree x={40} y={62} s={s} season={season} crown={P.leafDark} fruit={summer ? P.yellow : undefined} n={tier + 2} /></Old>
          {tier >= 2 ? <path d="M48 66h12M49 66v-2.4h10V66" stroke={P.outline} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {tier >= 2 ? <path d="M48 66h12M49 66v-2.4h10V66" stroke={P.woodMid} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {tier >= 3 ? <Kid x={52} y={64} c={P.berry} s={1.1} /> : null}
          {tier >= 4 ? <Farmer x={58} y={66} c={P.blue} s={0.75} hat={P.woodLight} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M22 66v-6h3v6" fill={P.white} {...detail} />
              <path d="M23.5 65v-3" stroke={P.red} strokeWidth=".8" strokeLinecap="round" />
            </g>
          ) : null}
          <Weather season={season} />
        </Svg>
      )
    }
    case 'zisternenspiel': {
      const gutters = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <ellipse cx="18" cy="58" rx="10" ry="3" fill={P.stoneLight} {...line} />
          <ellipse cx="18" cy="57.4" rx="7" ry="2" fill={P.stone} stroke={P.outline} strokeWidth={H} />
          <rect x="16" y="40" width="4" height="17" rx="1" fill={P.metal} {...detail} />
          <path d="M17.2 42v13" stroke={P.white} strokeWidth=".6" strokeLinecap="round" opacity=".4" />
          <path d="M18 41l-7 -5" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M18 41l-7 -5" stroke={P.charcoal} strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="18" cy="41" r="1" fill={P.charcoal} stroke={P.outline} strokeWidth={H} />
          <path d="M20 46h4.4v1.6" stroke={P.outline} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M20 46h4.4v1.6" stroke={P.metal} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {Array.from({ length: gutters }, (_, i) => {
            const x0 = 24 + i * 12
            const y0 = 47 + i * 3
            return (
              <g key={i}>
                <path d={`M${x0} ${y0}l12 3`} stroke={P.outline} strokeWidth="3.2" strokeLinecap="round" />
                <path d={`M${x0} ${y0}l12 3`} stroke={P.woodMid} strokeWidth="2" strokeLinecap="round" />
                <path d={`M${x0} ${y0 - 0.6}l12 3`} stroke={!winter && tier >= 2 ? P.waterLight : P.woodLight} strokeWidth=".7" />
                <path d={`M${x0 + 2} ${y0 + 1}v${14 - i * 3}`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
                <path d={`M${x0 + 2} ${y0 + 1}v${14 - i * 3}`} stroke={P.woodMid} strokeWidth="1" strokeLinecap="round" />
              </g>
            )
          })}
          <rect x="62" y="58" width="14" height="6" rx="1" fill={winter ? P.cream : P.soil} {...detail} />
          {!winter ? [65, 69, 73].map((x) => <ellipse key={x} cx={x} cy={57} rx="1.6" ry="1.2" fill={P.leaf} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
          {tier >= 3 ? <Kid x={12} y={68} c={P.yellow} s={1.1} /> : null}
          {tier >= 4 ? <Kid x={34} y={68} c={P.red} s={1.1} hair={P.woodLight} /> : null}
          {tier >= 5 ? <Old><Can x={44} y={70} c={P.blue} s={1.4} /></Old> : null}
          <Weather season={season} />
        </Svg>
      )
    }
    case 'mischkultur': {
      const rows = Math.min(5, tier + 1)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: rows }, (_, r) => (
            <g key={r}>
              <path d={`M10 ${52 + r * 4}h60`} stroke={winter ? P.frost : P.soilDark} strokeWidth="1.8" strokeLinecap="round" />
              {Array.from({ length: 8 }, (_, k) => (
                <Veg key={k} x={13 + k * 7.6 + (r % 2) * 2} y={52 + r * 4} kind={r % 2} season={season} />
              ))}
            </g>
          ))}
          {tier >= 3 ? [8, 72].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy={58} rx="2.4" ry="1.6" fill={winter ? P.winterLeafDark : P.leaf} {...detail} />
              {!winter ? <circle cx={x} cy={56.6} r="1.2" fill={autumn ? P.autumnDark : P.orange} stroke={P.outline} strokeWidth={H * 0.7} /> : null}
            </g>
          )) : null}
          {tier >= 5 ? <Kid x={70} y={72} c={P.leaf} s={1.1} /> : null}
          <Weather season={season} />
        </Svg>
      )
    }
    case 'windhecke': {
      const n = 2 + tier
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <HedgeShrub key={i} x={10 + i * (60 / Math.max(1, n - 1))} y={60 + (i % 2) * 3} s={1.4} season={season} n={3 + Math.min(3, tier)} />
          ))}
          {[16, 24, 32].slice(0, Math.min(3, tier)).map((y) => (
            <path key={y} d={`M2 ${y}q6 -3 12 0q6 3 12 0`} stroke={P.white} strokeWidth=".9" strokeLinecap="round" fill="none" opacity=".8" />
          ))}
          {tier >= 4 ? (
            <g>
              <path d="M72 66V52" stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
              <path d="M72 66V52" stroke={P.metal} strokeWidth="1" strokeLinecap="round" />
              <path d="M72.4 52l4 1.6l-4 1.6z" fill={P.red} stroke={P.outline} strokeWidth={D} strokeLinejoin="round" />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={60} y={72} c={P.leafDark} s={0.75} hat={P.woodLight} /> : null}
          {winter ? <g className="art-sky"><Old><Snowfall n={6} y1={30} /></Old></g> : null}
          {summer ? <g className="art-sky"><Old><Sun x={68} y={12} r={3} /></Old></g> : null}
        </Svg>
      )
    }
    case 'wetterstation': {
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <path d="M34 64l6 -10l6 10" stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M34 64l6 -10l6 10" stroke={P.metal} strokeWidth=".9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M40 64V18M33 20h14" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M40 64V18" stroke={P.metal} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M40 20h-7M40 20h7" stroke={P.metal} strokeWidth="1" strokeLinecap="round" />
          {[-7, 7].map((d) => (
            <path key={d} d={`M${40 + d - 1.6} 20a1.6 1.6 0 0 1 3.2 0z`} fill={P.white} stroke={P.outline} strokeWidth={H} strokeLinejoin="round" />
          ))}
          {tier >= 2 ? <path d="M40 26l8 0l2 -2v4z M40 26l-4 -1.4v2.8z" fill={P.red} stroke={P.outline} strokeWidth={H} strokeLinejoin="round" /> : null}
          {tier >= 3 ? (
            <g>
              <path d="M14 54v10M22 54v10" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
              <path d="M14 54v10M22 54v10" stroke={P.stoneLight} strokeWidth="1" strokeLinecap="round" />
              <rect x="12" y="44" width="12" height="10" fill={P.white} {...detail} />
              <path d="M12 47h12M12 50h12" stroke={P.stone} strokeWidth={H} />
              <rect x="12.4" y="44.4" width="11.2" height="1.2" fill={P.outline} opacity=".15" />
              <path d="M10 44l8 -4l8 4z" fill={P.white} {...detail} />
              <path d="M13 42.6l5 -2.4" stroke={P.stoneLight} strokeWidth=".6" strokeLinecap="round" opacity=".6" />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <rect x="56" y="52" width="4" height="10" fill={P.metal} {...detail} />
              <ellipse cx="58" cy="52" rx="2.4" ry=".8" fill={P.glass} stroke={P.outline} strokeWidth={H} />
              <path d="M46 40l8 -3v5l-8 3z" fill={P.blue} {...detail} />
              <path d="M47 41l6 -2.2" stroke={P.white} strokeWidth=".5" strokeLinecap="round" opacity=".5" />
            </g>
          ) : null}
          <rect x="37" y="36" width="6" height="4" rx=".6" fill={P.stoneLight} {...detail} />
          {tier >= 5 ? <Kid x={66} y={72} c={P.berry} s={1.1} hair={P.woodDark} /> : null}
          {tier >= 5 ? <path d="M32 66v-4M32 62l-1 -1" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" /> : null}
          {tier >= 5 ? <path d="M32 66v-4M32 62l-1 -1" stroke={P.metal} strokeWidth=".8" strokeLinecap="round" /> : null}
          <Weather season={season} />
        </Svg>
      )
    }
    case 'lehrkueche': {
      const pots = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <Post x={12} y={64} h={30} w={2.2} k={K} />
          <Post x={68} y={64} h={30} w={2.2} k={K} />
          <path d="M8 34h64l-4 -6h-56z" fill={P.leafDark} {...line} />
          <path d="M14 29.6h52" stroke={P.white} strokeWidth=".8" strokeLinecap="round" opacity=".3" />
          {winter ? <path d="M9 28.4h62" stroke={P.white} strokeWidth="1.4" /> : null}
          {summer ? <path d="M8 34h64v1.6h-64z" fill={P.leafLight} /> : null}
          <rect x="11" y="34.4" width="58" height="1.4" fill={P.outline} opacity=".15" />
          <rect x="16" y="53" width="48" height="9" fill={P.wood} {...line} />
          <rect x="16" y="53" width="48" height="1.4" fill={P.outline} opacity=".15" />
          <rect x="16" y="50" width="48" height="3" rx=".6" fill={P.woodLight} {...detail} />
          <rect x="18" y="42" width="10" height="8" rx="1" fill={P.terracotta} {...detail} />
          <path d="M20 46a3 2 0 0 1 6 0" fill={P.charcoal} />
          {tier >= 2 ? <path className="smoke" d="M23 40c-1 -2 1 -3 0 -5" stroke={P.white} strokeWidth=".7" fill="none" /> : null}
          {Array.from({ length: pots }, (_, i) => (
            <g key={i}>
              <path d={`M${32 + i * 8} 50v-3h6v3z`} fill={[P.metal, P.berry, P.blue, P.leaf][i]} {...detail} />
              <ellipse cx={35 + i * 8} cy={47} rx="3" ry=".6" fill={[P.orange, P.leafLight, P.yellow, P.berry][i]} stroke={P.outline} strokeWidth={H * 0.6} />
            </g>
          ))}
          {tier >= 3 ? [30, 34, 38].map((x, i) => <circle key={x} cx={x} cy={56.6} r="1.4" fill={[P.orange, P.yellow, P.leafLight][i]} stroke={P.outline} strokeWidth={H * 0.7} />) : null}
          {tier >= 4 ? <Kid x={24} y={70} c={P.yellow} s={1.1} /> : null}
          {tier >= 5 ? <Farmer x={50} y={70} c={P.white} s={0.75} hat={P.white} /> : null}
          {autumn ? <Old><Rain n={5} y0={2} h={6} /></Old> : null}
        </Svg>
      )
    }
    case 'klimatag': {
      const guests = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <Old><Bunting y={20} n={3 + tier} /></Old>
          <Post x={14} y={60} h={24} w={1.8} k={K} />
          <Post x={50} y={60} h={24} w={1.8} k={K} />
          <rect x="14" y="36" width="36" height="16" rx=".8" fill={P.white} {...line} />
          <path d="M18 48q8 -8 14 -2t14 -6" stroke={P.water} strokeWidth="1.2" fill="none" />
          <ellipse cx="26" cy="42" rx="4" ry="2" fill={P.leafLight} stroke={P.outline} strokeWidth={H} />
          <circle cx="40" cy="44" r="1.6" fill={P.waterDeep} stroke={P.outline} strokeWidth={H} />
          {tier >= 2 ? <path d="M56 50v10M70 50v10" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" /> : null}
          {tier >= 2 ? <path d="M56 50v10M70 50v10" stroke={P.woodMid} strokeWidth="1" strokeLinecap="round" /> : null}
          {tier >= 2 ? <rect x="54" y="48" width="18" height="2" rx=".5" fill={P.woodLight} {...detail} /> : null}
          {tier >= 3 ? [57, 61, 65, 69].map((x) => <rect key={x} x={x - 1} y="45" width="2.4" height="3" fill={P.glass} stroke={P.outline} strokeWidth={H * 0.7} />) : null}
          {Array.from({ length: guests }, (_, i) => (
            <Farmer key={i} x={16 + i * 14} y={68 + (i % 2) * 2} c={[P.berry, P.blue, P.yellow, P.leaf][i]!} s={0.75} hat={[P.charcoal, P.woodLight, P.plum, P.woodDark][i]!} />
          ))}
          {tier >= 5 ? <Kid x={72} y={70} c={P.orange} s={1.1} /> : null}
          <Weather season={season} />
        </Svg>
      )
    }
  }
  return null
}
