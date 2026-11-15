/**
 * Kapitel 49 — Weltgartenschau im kräftigen Stil (2026-11-14, Weinberg-Niveau):
 * Länderbeete, Fähnchen, Zukunftshalle, Seilbahn mit Gondeln, Wasserlichter,
 * Saatguttempel, Familienpavillon, Aussichtssteg und Eröffnungsband mit Kontur.
 * Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Bunting, Glasshouse } from './partsA'
import type { AreaProps } from './partsB'
import { Sapling } from './partsC'
import { Tulip } from './partsD'
import { RoseBush } from './partsE'
import { CornPlant, PotatoPlant } from './partsF'
import { NapaCabbage } from './partsG'
import { Cloud, OmaTin, SeedJar, Signpost, Snowfall, Sun } from './partsH'
import { Lantern } from './partsI'
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

/** Rasenboden: Frühling/Sommer grün, Herbst moosig mit Laub, Winter hell mit Schneewehen. */
function Floor({ season, cy = 61, rx = 36, ry = 9 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const fill = z === 'winter' ? P.cream : z === 'autumn' ? P.leafMoss : P.leaf
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={fill} {...line} />
      <ellipse cx={40 - rx * 0.3} cy={cy - ry * 0.45} rx={rx * 0.42} ry={ry * 0.2} fill={P.white} opacity=".18" />
      {z === 'autumn' ? [-0.55, -0.15, 0.3, 0.62].map((d) => <ellipse key={d} cx={40 + rx * d} cy={cy + 3} rx="1.2" ry=".5" fill={P.autumn} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
      {z === 'winter' ? [-0.45, 0.4].map((d) => <ellipse key={d} cx={40 + rx * d} cy={cy + 2.4} rx="6" ry="1.4" fill={P.white} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
    </g>
  )
}

/** Gepflasterter Platz mit Fugen; Herbst Laub, Winter Schneewehen. */
function Paving({ season, cy = 62, rx = 36, ry = 8, fill = P.stoneLight }: { season?: string; cy?: number; rx?: number; ry?: number; fill?: string }) {
  const z = ssn(season)
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={fill} {...line} />
      <path d={`M${40 - rx * 0.8} ${cy - ry * 0.5}h${rx * 1.6}M${40 - rx * 0.92} ${cy}h${rx * 1.84}M${40 - rx * 0.8} ${cy + ry * 0.5}h${rx * 1.6}`} stroke={P.outline} strokeWidth={H} opacity=".3" />
      <ellipse cx={40 - rx * 0.3} cy={cy - ry * 0.55} rx={rx * 0.4} ry={ry * 0.16} fill={P.white} opacity=".3" />
      {z === 'autumn' ? [-0.55, -0.15, 0.25, 0.6].map((d) => <ellipse key={d} cx={40 + rx * d} cy={cy + 2.4} rx="1.2" ry=".5" fill={P.autumn} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
      {z === 'winter' ? [-0.5, 0.1, 0.55].map((d) => <ellipse key={d} cx={40 + rx * d} cy={cy + 2} rx="4" ry="1.2" fill={P.white} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
    </g>
  )
}

function Sky({ season, balloons = 0 }: { season?: string; balloons?: number }) {
  const z = ssn(season)
  return (
    <g className="art-sky">
      {z === 'summer' ? <Old><Sun x={71} y={9} r={3} /></Old> : z === 'spring' ? <Old><Cloud x={14} y={9} s={1.1} /></Old> : z === 'autumn' ? <Old><Cloud x={64} y={9} s={1.2} c={P.stoneLight} /></Old> : <Old><Snowfall n={7} y1={30} /></Old>}
      {Array.from({ length: balloons }, (_, i) => (
        <g key={i}>
          <path d={`M${10 + i * 7} ${22 + (i % 2) * 3}v6`} stroke={P.outline} strokeWidth=".5" strokeLinecap="round" />
          <ellipse cx={10 + i * 7} cy={20 + (i % 2) * 3} rx="1.8" ry="2.2" fill={[P.red, P.yellow, P.blue, P.leafLight][i % 4]} {...detail} />
          <ellipse cx={9.4 + i * 7} cy={19 + (i % 2) * 3} rx=".5" ry=".8" fill={P.white} opacity=".45" />
        </g>
      ))}
    </g>
  )
}

/** Rundes Beet mit Rand (Fußpunkt Mitte). */
function Bed({ x, y, rx = 9, ry = 3.4, season }: { x: number; y: number; rx?: number; ry?: number; season?: string }) {
  const z = ssn(season)
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={P.stone} {...detail} />
      <ellipse cx={x} cy={y - 0.3} rx={rx - 0.9} ry={ry - 0.7} fill={z === 'winter' ? P.white : P.soil} stroke={P.outline} strokeWidth={H} />
      <ellipse cx={x - rx * 0.3} cy={y - ry * 0.55} rx={rx * 0.35} ry={ry * 0.15} fill={P.white} opacity=".3" />
    </g>
  )
}

/** Stockrose (hoch, Blüten am Stängel). */
function Hollyhock({ x, y, season }: { x: number; y: number; season?: string }) {
  const z = ssn(season)
  if (z === 'winter') {
    return (
      <g>
        <path d={`M${x} ${y}v-6`} stroke={P.outline} strokeWidth="1.6" strokeLinecap="round" />
        <path d={`M${x} ${y}v-6`} stroke={P.woodLight} strokeWidth=".7" strokeLinecap="round" />
      </g>
    )
  }
  const h = z === 'spring' ? 5 : 12
  return (
    <g>
      <path d={`M${x} ${y}v-${h}`} stroke={P.outline} strokeWidth="1.7" strokeLinecap="round" />
      <path d={`M${x} ${y}v-${h}`} stroke={P.leafDark} strokeWidth=".8" strokeLinecap="round" />
      <ellipse cx={x - 1.4} cy={y - 1.6} rx="1.6" ry="1" fill={P.leaf} stroke={P.outline} strokeWidth={H * 0.8} />
      {z !== 'spring' ? [3, 6, 9].map((d) => <circle key={d} cx={x + (d % 2 ? 0.6 : -0.6)} cy={y - d} r="1.1" fill={z === 'autumn' ? P.woodMid : P.pink} stroke={P.outline} strokeWidth={H * 0.7} />) : null}
    </g>
  )
}

/** Länderschild (kleines Fähnchen mit Farbstreifen). */
function Flag({ x, y, a, b }: { x: number; y: number; a: string; b: string }) {
  return (
    <g>
      <path d={`M${x} ${y}v-8`} stroke={P.outline} strokeWidth="1.5" strokeLinecap="round" />
      <path d={`M${x} ${y}v-8`} stroke={P.woodMid} strokeWidth=".7" strokeLinecap="round" />
      <rect x={x} y={y - 8} width="4" height="1.4" fill={a} />
      <rect x={x} y={y - 6.6} width="4" height="1.4" fill={b} />
      <rect x={x} y={y - 8} width="4" height="2.8" fill="none" stroke={P.outline} strokeWidth={H} strokeLinejoin="round" />
      <circle cx={x} cy={y - 8.3} r=".45" fill={P.gold} stroke={P.outline} strokeWidth={H * 0.6} />
    </g>
  )
}

/** Gondel an einem Seil. */
function Gondola({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <path d={`M${x} ${y}v3`} stroke={P.outline} strokeWidth="1" strokeLinecap="round" />
      <rect x={x - 1} y={y - 0.6} width="2" height="1.2" rx=".4" fill={P.metal} stroke={P.outline} strokeWidth={H} />
      <rect x={x - 3.6} y={y + 3} width="7.2" height="6" rx="1.4" fill={c} {...detail} />
      <rect x={x - 2.6} y={y + 4} width="5.2" height="2.4" fill={P.glass} stroke={P.outline} strokeWidth={H} />
      <path d={`M${x - 2} ${y + 6}l1.6 -1.6`} stroke={P.white} strokeWidth=".5" strokeLinecap="round" opacity=".6" />
      <rect x={x - 3} y={y + 7.4} width="6" height="1.2" rx=".6" fill={P.outline} opacity=".15" />
    </g>
  )
}

/** Bilderrahmen. */
function Frame({ x, y, i, s = 1 }: { x: number; y: number; i: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
      <rect x={x - 2.6} y={y - 3.2} width="5.2" height="4.2" rx=".3" fill={P.woodMid} stroke={P.outline} strokeWidth={H} />
      <rect x={x - 2} y={y - 2.6} width="4" height="3" fill={P.paper} stroke={P.outline} strokeWidth={H * 0.6} />
      <circle cx={x} cy={y - 1.8} r=".7" fill={P.skin} stroke={P.outline} strokeWidth={H * 0.5} />
      <path d={`M${x - 1.2} ${y + 0.4}q1.2 -1.6 2.4 0`} fill={[P.berry, P.blue, P.leaf, P.yellow, P.plum][i % 5]} stroke={P.outline} strokeWidth={H * 0.5} />
    </g>
  )
}

/** Beete der Europa-/Welt-Beete: eins in der Mitte, dann hinten links/rechts, vorne links/rechts. */
const BED_SPOTS: [number, number][] = [[40, 58], [18, 52], [62, 52], [26, 68], [54, 68]]

/** Beet-Nummern für `n` Beete, von hinten nach vorne gezeichnet. */
function bedOrder(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i).sort((a, b) => BED_SPOTS[a]![1] - BED_SPOTS[b]![1])
}

export function Weltgartenschau({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  const autumn = z === 'autumn'
  switch (id) {
    case 'europabeete': {
      const beds = Math.min(5, tier)
      const spots: [number, number][] = BED_SPOTS
      return (
        <Svg tier={tier} bold>
          <Paving season={season} fill={P.paper} />
          {bedOrder(beds).map((i) => {
            const [x, y] = spots[i]!
            return (
            <g key={i} transform={`translate(${x} ${y}) scale(1.45) translate(${-x} ${-y})`}>
              <Bed x={x} y={y} season={season} />
              {i === 0 ? [-6, -3, 0, 3, 6].map((d) => <Hollyhock key={d} x={x + d} y={y} season={season} />) : null}
              {i === 1 ? [-6, -3, 0, 3, 6].map((d, k) => (winter ? <ellipse key={d} cx={x + d} cy={y - 0.4} rx="1" ry=".4" fill={P.soilDark} stroke={P.outline} strokeWidth={H * 0.6} /> : <Old key={d}><Tulip x={x + d} y={y} c={[P.red, P.yellow, P.white, P.plum, P.pink][k]!} head={z === 'spring' || summer} /></Old>)) : null}
              {i === 2 ? [-5, 0, 5].map((d) => <Old key={d}><RoseBush x={x + d} y={y} s={0.7} season={season} n={4} /></Old>) : null}
              {i === 3 ? [-5, 0, 5].map((d) => <Old key={d}><RoseBush x={x + d} y={y} s={0.6} season={season === 'summer' ? 'spring' : season} n={3} /></Old>) : null}
              {i === 4 ? [-4, 0, 4].map((d) => <Hollyhock key={d} x={x + d} y={y} season={season} />) : null}
              <Flag x={x + 8} y={y} a={[P.blue, P.orange, P.leaf, P.red, P.white][i]!} b={[P.white, P.white, P.white, P.leaf, P.red][i]!} />
            </g>
            )
          })}
          {tier >= 5 ? <Farmer x={72} y={70} c={P.leafDark} s={1.15} hat={P.woodLight} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'weltbeete': {
      const beds = Math.min(5, tier)
      const spots: [number, number][] = BED_SPOTS
      return (
        <Svg tier={tier} bold>
          <Paving season={season} fill={P.paper} />
          {bedOrder(beds).map((i) => {
            const [x, y] = spots[i]!
            return (
            <g key={i} transform={`translate(${x} ${y}) scale(1.45) translate(${-x} ${-y})`}>
              <Bed x={x} y={y} season={season} />
              {i === 0 ? [-5, 0, 5].map((d) => <Old key={d}><PotatoPlant x={x + d} y={y} s={0.9} season={season} /></Old>) : null}
              {i === 1 ? [-5, 0, 5].map((d) => <Old key={d}><CornPlant x={x + d} y={y} s={0.7} season={season} beans={d === 0} /></Old>) : null}
              {i === 2 ? [-5, 0, 5].map((d) => <Old key={d}><NapaCabbage x={x + d} y={y} s={0.9} season={season} /></Old>) : null}
              {i === 3 ? [-5, 0, 5].map((d) => (winter ? <ellipse key={d} cx={x + d} cy={y - 0.4} rx="1.2" ry=".5" fill={P.soilDark} stroke={P.outline} strokeWidth={H * 0.6} /> : (
                <g key={d}>
                  <path d={`M${x + d} ${y}v-6M${x + d} ${y - 3}l-2 -1.6M${x + d} ${y - 4.6}l2 -1.4`} stroke={P.outline} strokeWidth="1.7" strokeLinecap="round" />
                  <path d={`M${x + d} ${y}v-6M${x + d} ${y - 3}l-2 -1.6M${x + d} ${y - 4.6}l2 -1.4`} stroke={P.leafDark} strokeWidth=".8" strokeLinecap="round" />
                </g>
              ))) : null}
              {i === 3 && !winter ? [-5, 0, 5].map((d) => <circle key={`c${d}`} cx={x + d + 1} cy={y - 5} r=".9" fill={autumn ? P.berry : P.leafPale} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
              {i === 4 ? [-3, 3].map((d) => <Old key={d}><PotatoPlant x={x + d} y={y} s={0.8} season={season} flower={P.white} /></Old>) : null}
              <Flag x={x + 7} y={y} a={[P.red, P.leaf, P.blue, P.yellow, P.orange][i]!} b={[P.white, P.white, P.red, P.leaf, P.white][i]!} />
            </g>
            )
          })}
          {tier >= 5 ? <Kid x={72} y={70} c={P.yellow} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'zukunftshalle': {
      const w = 24 + tier * 8
      const x0 = 40 - w / 2
      return (
        <Svg tier={tier} bold>
          <Paving season={season} />
          <Old><Glasshouse x={x0} w={w} h={20} roofH={8} curved tint={P.glass} ground={62} /></Old>
          <path d={`M${x0 - 1} 42Q40 ${32 - tier} ${x0 + w + 1} 42`} stroke={P.outline} strokeWidth="3.8" strokeLinecap="round" fill="none" />
          <path d={`M${x0 - 1} 42Q40 ${32 - tier} ${x0 + w + 1} 42`} stroke={winter ? P.white : P.leaf} strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <path d={`M${x0 + 2} 40.6Q40 ${31 - tier} ${x0 + w - 2} 40.6`} stroke={P.white} strokeWidth=".6" strokeLinecap="round" fill="none" opacity=".4" />
          {tier >= 2 ? Array.from({ length: Math.min(4, tier - 1) }, (_, i) => (
                <g key={i}>
                  <rect x={x0 + 4 + i * 7} y={52} width="5" height="10" fill={P.terracottaLight} {...detail} />
                  <rect x={x0 + 3.6 + i * 7} y={51.4} width="5.8" height="1.6" rx=".4" fill={P.terracotta} stroke={P.outline} strokeWidth={H} />
                  <path d={`M${x0 + 5 + i * 7} 54.4v6`} stroke={P.white} strokeWidth=".5" strokeLinecap="round" opacity=".35" />
                </g>
              )) : null}
          {tier >= 3 ? <path d="M40 62V48M36 50h8" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d="M40 62V48M36 50h8" stroke={P.woodMid} strokeWidth="1" strokeLinecap="round" /> : null}
          {tier >= 3 ? (
            <g>
              <ellipse cx="40" cy="46" rx="5" ry="3.6" fill={winter ? P.winterLeaf : P.leaf} {...line} />
              <ellipse cx="38.4" cy="44.6" rx="2.4" ry="1.1" fill={P.white} opacity=".3" />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <path d={`M${x0 + w - 12} 52l8 -2v6l-8 2z`} fill={P.blue} {...detail} />
              <path d={`M${x0 + w - 8} 51v6M${x0 + w - 12} 55l8 -2`} stroke={P.metal} strokeWidth={H} />
              <path d={`M${x0 + w - 11} 53.2l2.6 -.7`} stroke={P.white} strokeWidth=".5" strokeLinecap="round" opacity=".5" />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={66} y={70} c={P.leaf} s={1.15} hat={P.woodLight} /> : null}
          {tier >= 5 ? <Kid x={58} y={70} c={P.berry} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'gondelbahn': {
      const gondolas = tier
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {[10, 70].map((x) => (
            <g key={x}>
              <path d={`M${x - 3} 64L${x} 16L${x + 3} 64M${x - 2} 40h4M${x - 2.6} 52h5.2M${x - 3} 16h6`} stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d={`M${x - 3} 64L${x} 16L${x + 3} 64`} stroke={P.metal} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d={`M${x - 2} 40h4M${x - 2.6} 52h5.2M${x - 3} 16h6`} stroke={P.metal} strokeWidth=".8" strokeLinecap="round" />
              <rect x={x - 4.4} y="62.6" width="8.8" height="2" rx=".6" fill={P.stone} {...detail} />
            </g>
          ))}
          <path d="M7 16Q40 26 73 16" stroke={P.outline} strokeWidth={D * 0.8} strokeLinecap="round" fill="none" />
          {Array.from({ length: gondolas }, (_, i) => {
            const t = (i + 0.5) / gondolas
            const x = 7 + 66 * t
            const y = 16 + 10 * 2 * t * (1 - t) * 2
            return <Gondola key={i} x={x} y={y} c={[P.red, P.yellow, P.blue, P.leaf, P.orange][i % 5]!} />
          })}
          {Array.from({ length: 2 + tier }, (_, i) => (
            <Bed key={i} x={18 + ((i * 11) % 46)} y={58 + ((i * 5) % 8)} rx={4} ry={1.6} season={season} />
          ))}
          {tier >= 5 ? <Kid x={40} y={70} c={P.yellow} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'wasserlichter': {
      const jets = 1 + tier
      const lit = [P.waterLight, P.lilac, P.lamp, P.pink, P.leafPale, P.water]
      return (
        <Svg tier={tier} bold>
          <Paving season={season} />
          <ellipse cx="40" cy="60" rx="30" ry="6" fill={P.stoneLight} {...line} />
          <ellipse cx="40" cy="60" rx="27" ry="4.8" fill={winter ? P.glassEdge : P.pond} stroke={P.outline} strokeWidth={D} />
          <ellipse cx="32" cy="58.4" rx="10" ry="1" fill={P.white} opacity=".3" />
          {Array.from({ length: jets }, (_, i) => {
            const x = 40 + (i - (jets - 1) / 2) * (44 / Math.max(1, jets - 1))
            const h = 14 + ((i * 7) % 3) * 6
            const c = lit[i % lit.length]!
            return winter ? (
              <g key={i}>
                <path d={`M${x} 60v-3`} stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
                <path d={`M${x} 60v-3`} stroke={P.white} strokeWidth="1.4" strokeLinecap="round" />
                <circle cx={x} cy={56} r=".9" fill={c} stroke={P.outline} strokeWidth={H * 0.6} />
              </g>
            ) : (
              <g key={i}>
                <path d={`M${x} 60V${60 - h}`} stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" opacity=".5" />
                <path d={`M${x} 60V${60 - h}`} stroke={c} strokeWidth="1.6" strokeLinecap="round" opacity=".9" />
                <path d={`M${x - 0.3} 59V${61 - h}`} stroke={P.white} strokeWidth=".4" strokeLinecap="round" opacity=".5" />
                <path d={`M${x} ${60 - h}q-3 2 -4 6M${x} ${60 - h}q3 2 4 6`} stroke={c} strokeWidth=".9" strokeLinecap="round" fill="none" opacity=".8" />
              </g>
            )
          })}
          {tier >= 3 ? [16, 64].map((x) => (
            <g key={x}>
              <circle cx={x} cy={62.4} r="1.2" fill={P.lamp} {...detail} />
              <circle cx={x - 0.35} cy={62} r=".35" fill={P.white} opacity=".7" />
            </g>
          )) : null}
          {tier >= 5 ? <Kid x={72} y={70} c={P.blue} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'saatguttempel': {
      const cols = 2 + tier
      return (
        <Svg tier={tier} bold>
          <Paving season={season} />
          <ellipse cx="40" cy="62" rx="26" ry="4" fill={P.stoneLight} {...line} />
          <ellipse cx="34" cy="60.6" rx="12" ry="1" fill={P.white} opacity=".35" />
          <rect x="18" y="36" width="44" height="24" fill={P.glass} opacity=".7" />
          <path d="M22 58l8 -20M27 58l6 -14" stroke={P.white} strokeWidth=".8" strokeLinecap="round" opacity=".35" />
          {[44, 52].map((y) => (
            <g key={y}>
              <path d={`M20 ${y}h40`} stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
              <path d={`M20 ${y}h40`} stroke={P.woodMid} strokeWidth=".9" strokeLinecap="round" />
            </g>
          ))}
          {Array.from({ length: Math.min(12, 2 + tier * 2) }, (_, i) => (
            <Old key={i}><SeedJar x={23 + (i % 6) * 7} y={i < 6 ? 52 : 44} s={1.1} seed={[P.seed, P.berry, P.yellow, P.leafMoss, P.cream, P.plum][i % 6]} /></Old>
          ))}
          {Array.from({ length: cols }, (_, i) => (
            <rect key={i} x={17 + i * (44 / Math.max(1, cols - 1))} y="36" width="2" height="24" fill={P.white} {...detail} />
          ))}
          <rect x="15" y="33" width="50" height="3" fill={P.white} {...line} />
          <rect x="18" y="36.9" width="44" height="1.6" fill={P.outline} opacity=".18" />
          <path d="M16 33Q40 8 64 33z" fill={winter ? P.white : P.leafLight} {...line} />
          <path d="M23 28Q30 19 39 17.6" stroke={P.white} strokeWidth=".9" strokeLinecap="round" fill="none" opacity=".45" />
          {tier >= 4 ? <Old><OmaTin x={40} y={28} s={1.2} /></Old> : null}
          {tier >= 5 ? <Farmer x={72} y={70} c={P.white} s={1.15} hat={P.ink} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'kinderwald': {
      const trees = 1 + tier
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: trees }, (_, i) => {
            const x = 12 + i * (56 / Math.max(1, trees - 1))
            const y = 60 + (i % 2) * 4
            return (
              <g key={i}>
                <Old><Sapling x={x} y={y} s={0.9 + (i % 3) * 0.15} season={season} crown={[P.leaf, P.leafDark, P.leafLight][i % 3]} stake /></Old>
                <rect x={x + 1.6} y={y - 6} width="3" height="1.8" fill={P.label} stroke={P.outline} strokeWidth={H} strokeLinejoin="round" />
                <path d={`M${x + 2.2} ${y - 5.1}h1.8`} stroke={P.outline} strokeWidth={H * 0.6} />
              </g>
            )
          })}
          {tier >= 2 ? <Kid x={24} y={70} c={P.red} s={1.5} /> : null}
          {tier >= 3 ? <Kid x={48} y={70} c={P.yellow} s={1.5} hair={P.woodLight} /> : null}
          {tier >= 4 ? <Old><Signpost x={66} y={70} dir="left" /></Old> : null}
          {tier >= 5 ? <Farmer x={36} y={70} c={P.plum} s={1.15} hat={P.charcoal} skirt={P.denim} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'familienpavillon': {
      const frames = 1 + tier
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <path d="M12 30L40 16L68 30z" fill={P.leafDark} {...line} />
          <path d="M18 28.2L40 17.4" stroke={P.white} strokeWidth=".8" strokeLinecap="round" opacity=".35" />
          {winter ? <path d="M14 29.4L40 16.6L66 29.4" stroke={P.white} strokeWidth="1.2" fill="none" /> : null}
          <rect x="16" y="30" width="48" height="30" fill={P.cream} {...line} />
          <rect x="17" y="30.8" width="46" height="2.2" fill={P.outline} opacity=".15" />
          {[16, 64].map((x) => <rect key={x} x={x - 1.4} y="30" width="2.8" height="30" fill={P.woodLight} {...detail} />)}
          {Array.from({ length: frames }, (_, i) => (
            <Frame key={i} x={25 + (i % 3) * 15} y={i < 3 ? 42 : 52} i={i} s={2} />
          ))}
          <Old><Lantern x={40} y={34} c={P.lamp} lit={winter || autumn} /></Old>
          {tier >= 3 ? <path d="M24 56h32" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d="M24 56h32" stroke={P.woodMid} strokeWidth="1.4" strokeLinecap="round" /> : null}
          {tier >= 3 ? <Old><OmaTin x={40} y={55.6} s={0.9} /></Old> : null}
          {tier >= 4 ? <Farmer x={70} y={70} c={P.berry} s={1.15} hat={P.woodLight} /> : null}
          {tier >= 5 ? <Kid x={10} y={70} c={P.blue} s={1.5} hair={P.woodDark} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'aussichtssteg': {
      const posts = 1 + tier
      const len = 20 + tier * 10
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <path d={`M8 62Q${8 + len * 0.5} ${48 - tier} ${8 + len} ${40 - tier * 2}`} stroke={P.outline} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d={`M8 62Q${8 + len * 0.5} ${48 - tier} ${8 + len} ${40 - tier * 2}`} stroke={P.woodMid} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d={`M8 61.4Q${8 + len * 0.5} ${47.4 - tier} ${8 + len} ${39.4 - tier * 2}`} stroke={P.woodLight} strokeWidth=".6" fill="none" strokeLinecap="round" opacity=".6" />
          <path d={`M8 59Q${8 + len * 0.5} ${45 - tier} ${8 + len} ${37 - tier * 2}`} stroke={P.outline} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d={`M8 59Q${8 + len * 0.5} ${45 - tier} ${8 + len} ${37 - tier * 2}`} stroke={P.metal} strokeWidth=".6" fill="none" strokeLinecap="round" />
          {Array.from({ length: posts }, (_, i) => {
            const t = (i + 1) / (posts + 0.4)
            const x = 8 + len * t
            const y = (1 - t) * (1 - t) * 62 + 2 * (1 - t) * t * (48 - tier) + t * t * (40 - tier * 2)
            return (
              <g key={i}>
                <path d={`M${x.toFixed(2)} ${(y + 1).toFixed(2)}V64`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
                <path d={`M${x.toFixed(2)} ${(y + 1).toFixed(2)}V64`} stroke={P.metal} strokeWidth=".9" strokeLinecap="round" />
              </g>
            )
          })}
          {tier >= 2 ? <Farmer x={8 + len * 0.55} y={51 - tier} c={P.blue} s={1.1} hat={P.woodLight} /> : null}
          {tier >= 3 ? <Kid x={8 + len * 0.8} y={47 - tier * 1.6} c={P.yellow} s={1.4} /> : null}
          {tier >= 4 ? <path d={`M${8 + len} ${40 - tier * 2}v-8l4 1.6l-4 1.6`} stroke={P.outline} strokeWidth={D} strokeLinejoin="round" strokeLinecap="round" fill={P.red} /> : null}
          {tier >= 5 ? <Farmer x={40} y={70} c={P.berry} s={1.15} hat={P.charcoal} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'eroeffnung': {
      const crowd = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Paving season={season} />
          <Old><Bunting y={18} n={4 + tier} /></Old>
          <Post x={14} y={62} h={22} w={2.2} fill={P.woodMid} k={K} />
          <Post x={66} y={62} h={22} w={2.2} fill={P.woodMid} k={K} />
          <path d="M14 46Q40 52 66 46" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M14 46Q40 52 66 46" stroke={P.red} strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M18 46.4Q40 51.2 62 46.4" stroke={P.white} strokeWidth=".4" strokeLinecap="round" fill="none" opacity=".4" />
          <path d="M38 48l2 3l2 -3z" fill={P.red} stroke={P.outline} strokeWidth={H} strokeLinejoin="round" />
          <Farmer x={40} y={60} c={P.leafDark} s={1.25} hat={P.cream} skirt={P.leafDark} />
          <path d="M42 54l3 -2M43.4 52.6l1.4 1" stroke={P.outline} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M42 54l3 -2M43.4 52.6l1.4 1" stroke={P.metal} strokeWidth=".6" strokeLinecap="round" />
          {Array.from({ length: crowd }, (_, i) => (
            <g key={i}>{i % 2 ? <Kid x={18 + i * 14} y={72} c={[P.yellow, P.blue, P.orange, P.leaf][i]!} s={1.5} /> : <Farmer x={18 + i * 14} y={70} c={[P.berry, P.blue, P.plum, P.orange][i]!} s={1.15} hat={P.woodLight} />}</g>
          ))}
          {tier >= 4 ? [12, 68].map((x) => <Old key={x}><Lantern x={x} y={28} c={P.orange} lit={winter || autumn} /></Old>) : null}
          <Sky season={season} balloons={Math.max(0, tier - 1)} />
        </Svg>
      )
    }
  }
  return null
}
