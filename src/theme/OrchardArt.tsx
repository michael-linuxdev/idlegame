/**
 * Streuobstwiese — art for the ten orchard areas with five growth tiers
 * (same thresholds as the garden: 1 / 10 / 25 / 50 / 100).
 * Kräftiger Stil (parts/bold.tsx) im Kapitel-Raster 80×72.
 */
import { memo, type ReactNode } from 'react'
type OrchardId = string
import { moduleTier, sameTierProps } from './tiers'
import type { Season } from './ambient'
import { ArtSvg } from './ArtSvg'
import { P } from './art/palette'
import { Barrel, Crate, Jar, Pennant, Shadow, seeded } from './art/parts'
import { ArchDoor, GableRoof, Pane, Wall } from './art/parts/bold'
import { BOLD, boldDetail, boldLine } from './art/parts/style'

/** Strichstärken × K im Kapitel-Raster. */
const K = 0.85
const C = BOLD.contour * K
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)
const OUT = P.outline

/** Jede Stufe ist sichtbar mehr: Bäume und Bauwerke wachsen von 72 % auf volle Größe (Fußpunkt bleibt). */
const GROW = [0.72, 0.82, 0.9, 0.96, 1]
function Grow({ tier, children }: { tier: number; children: ReactNode }) {
  const s = GROW[Math.min(5, Math.max(1, tier)) - 1]!
  return s === 1 ? <>{children}</> : <g transform={`translate(40 66) scale(${s}) translate(-40 -66)`}>{children}</g>
}

/** Stange oder Sprosse mit dunkler Kontur. */
function Rod({ d, c = P.woodLight, w = 1.3 }: { d: string; c?: string; w?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={OUT} strokeWidth={w + 1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

type Blob = readonly [number, number, number]
/** Jede Obstart hat eine eigene Kronenform (Kreise x, y, r) und Stammbreite. */
const FRUIT: Partial<Record<string, { fruit: string; crown: string; crownD: string; r: number; trunk: number; blobs: readonly Blob[] }>> = {
  // Apfel: breit und rund
  apfel: { fruit: '#d9483b', crown: '#6ca848', crownD: '#4f8a34', r: 2.1, trunk: 3.2, blobs: [[40, 27, 18], [27, 32, 12], [53, 31, 12], [40, 19, 13]] },
  // Birne: hoch und schmal
  birne: { fruit: '#d8c84a', crown: P.leaf, crownD: '#477e32', r: 2, trunk: 2.8, blobs: [[40, 32, 14], [40, 20, 11.5], [40, 10, 7.5], [32, 36, 9], [48, 36, 9]] },
  // Kirsche: flacher Schirm
  kirsche: { fruit: '#9e1f2c', crown: '#79b452', crownD: '#5a913a', r: 1.6, trunk: 2.8, blobs: [[40, 25, 14], [25, 28, 11], [55, 28, 11], [33, 19, 10], [47, 19, 10]] },
  // Zwetschge: aufrechtes Oval
  zwetschge: { fruit: '#5b3a78', crown: '#65a04a', crownD: '#4b8034', r: 1.9, trunk: 2.8, blobs: [[40, 29, 14.5], [40, 17, 12], [31, 32, 10], [49, 32, 10]] },
  // Walnuss: mächtige, weite Krone auf dickem Stamm
  walnuss: { fruit: P.outlineSoft, crown: '#4f8f3c', crownD: '#386e2a', r: 1.9, trunk: 4.4, blobs: [[40, 25, 20], [24, 31, 13], [56, 31, 13], [30, 17, 12], [50, 17, 12], [40, 12, 12]] },
}

function FruitTree({ id, tier, season = 'summer' }: { id: OrchardId; tier: number; season?: Season }) {
  const base = FRUIT[id]!
  // Real calendar: blossom in spring, fruit in summer/autumn, bare + snow in winter
  const f =
    season === 'autumn'
      ? { ...base, crown: '#a8a845', crownD: '#8a7a32' }
      : season === 'winter'
        ? { ...base, crown: '#7a8a6a', crownD: '#5f6b52' }
        : base
  const fruits = Math.min(14, tier * 3)
  const pear = id === 'birne'
  const [mx, my, mr] = f.blobs[0]!
  const tw = f.trunk
  return (
    <ArtSvg viewBox="0 0 80 72">
      <Shadow grid="chapter" rx={15 + tier * 3.5} />
      {tier >= 2 ? <path d="M24 66 l1.2 -4 l1.4 2.8 l1 -4.8 l1.4 4.8 l1.2 -2.8 l1 4 z" fill={P.leafLight} stroke={OUT} strokeWidth={H} strokeLinejoin="round" /> : null}
      {tier >= 3 ? (
        <g>
          {[14, 21, 58, 66].map((x, i) => (
            <circle key={x} cx={x} cy={65 + (i % 2)} r="1.7" fill={[P.white, P.yellow, P.pink, P.white][i]} stroke={OUT} strokeWidth={H} />
          ))}
        </g>
      ) : null}
      <Grow tier={tier}>
        <path d={`M${40 - tw} 66 L${40 - tw * 0.62} 44 Q40 38 ${40 + tw * 0.62} 44 L${40 + tw} 66 Z`} fill={P.bark} {...line} />
        <path d={`M${40 + tw * 0.2} 46 L${40 + tw * 0.62} 44 L${40 + tw - 0.8} 65 H${40 + tw * 0.3} Z`} fill={OUT} opacity=".2" />
        {/* Krone: eine geschlossene Form mit Kontur, Schatten rechts unten, Licht oben links */}
        {f.blobs.map(([x, y, r], i) => (
          <circle key={`o${i}`} cx={x} cy={y} r={r} fill={f.crownD} stroke={OUT} strokeWidth={C * 2} />
        ))}
        {f.blobs.map(([x, y, r], i) => (
          <circle key={`d${i}`} cx={x} cy={y} r={r} fill={f.crownD} />
        ))}
        {f.blobs.map(([x, y, r], i) => (
          <circle key={`l${i}`} cx={x - r * 0.12} cy={y - r * 0.14} r={r * 0.8} fill={f.crown} />
        ))}
        <circle cx={mx - mr * 0.34} cy={my - mr * 0.5} r={mr * 0.3} fill={P.white} opacity="0.16" />
        {season === 'winter' ? (
          <g>
            <ellipse cx={f.blobs[f.blobs.length - 1]![0]} cy={f.blobs[f.blobs.length - 1]![1] - f.blobs[f.blobs.length - 1]![2] * 0.72} rx={f.blobs[f.blobs.length - 1]![2] * 0.8} ry="3" fill={P.white} />
            <ellipse cx={f.blobs[1]![0] - 1} cy={f.blobs[1]![1] - f.blobs[1]![2] * 0.74} rx={f.blobs[1]![2] * 0.62} ry="2.4" fill={P.white} />
            <ellipse cx={f.blobs[2]![0] + 1} cy={f.blobs[2]![1] - f.blobs[2]![2] * 0.74} rx={f.blobs[2]![2] * 0.62} ry="2.4" fill={P.white} />
          </g>
        ) : null}
        {Array.from({ length: season === 'winter' ? 0 : season === 'spring' ? fruits + 8 : fruits }, (_, i) => {
          const a = seeded(i + 1) * Math.PI * 2
          const d = (0.3 + seeded(i + 7) * 0.62) * mr
          const x = mx + Math.cos(a) * d
          const y = my + Math.sin(a) * d * 0.82
          if (season === 'spring') {
            return <circle key={i} cx={x} cy={y} r={1.7} fill={i % 3 ? P.white : '#f7c6d9'} stroke={OUT} strokeWidth={H * 0.7} strokeOpacity=".5" />
          }
          return pear ? (
            <ellipse key={i} cx={x} cy={y} rx={f.r * 0.85} ry={f.r * 1.25} fill={f.fruit} stroke={OUT} strokeWidth={H} />
          ) : (
            <circle key={i} cx={x} cy={y} r={f.r} fill={f.fruit} stroke={OUT} strokeWidth={H} />
          )
        })}
      </Grow>
      {tier >= 4 ? (
        <g>
          {/* Erntekorb */}
          <circle cx="60" cy="57.6" r="2.3" fill={f.fruit} stroke={OUT} strokeWidth={H} />
          <circle cx="64.4" cy="57" r="2.3" fill={f.fruit} stroke={OUT} strokeWidth={H} />
          <circle cx="68.4" cy="57.8" r="2.1" fill={f.fruit} stroke={OUT} strokeWidth={H} />
          <path d="M56.5 58.5h15l-2 8h-11z" fill={P.woodLight} {...detail} />
          <path d="M57.6 62h12.8" stroke={OUT} strokeWidth={H} opacity=".45" />
        </g>
      ) : null}
      {tier >= 5 ? (
        <g>
          {/* Leiter */}
          <Rod d="M12 67 L20 31 M19.5 67 L27.5 31" />
          <path d="M13.6 60 H21 M15.4 52 H22.8 M17.2 44 H24.6 M18.9 36.5 H26.2" stroke={OUT} strokeWidth={D + 0.3} strokeLinecap="round" />
        </g>
      ) : null}
    </ArtSvg>
  )
}

/** Schaf: Wolle als eine Form mit Kontur, dunkler Kopf. Fußpunkt = zwischen den Beinen. */
function Sheep({ x, y, i, s = 1 }: { x: number; y: number; i: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="sheep" style={{ animationDelay: `${i * 0.7}s` }}>
        <path d="M-4 -3 v3 M3.4 -3 v3" stroke={OUT} strokeWidth="1.7" strokeLinecap="round" />
        <path d="M-7.6 -6.5 q-1.6 -4.2 2.2 -5.2 q1 -3.6 4.8 -2.6 q3.2 -2.6 5.8 .5 q3.7 .5 2.7 4.2 q1 4.2 -3.2 4.8 h-9.6 q-3.8 0 -2.7 -1.7z" fill="#f6f2e8" {...detail} />
        <path d="M-4.6 -11 q1.4 -2 4 -1.4" fill="none" stroke={P.white} strokeWidth="1.1" strokeLinecap="round" opacity=".8" />
        <ellipse cx="8" cy="-8.4" rx="2.9" ry="2.5" fill="#3b3330" stroke={OUT} strokeWidth={H} />
        <circle cx="8.9" cy="-9" r=".6" fill={P.white} />
      </g>
    </g>
  )
}

function Schafe({ tier }: { tier: number }) {
  const n = Math.max(1, Math.min(5, tier))
  const pos = [
    [34, 63],
    [56, 66],
    [20, 56],
    [62, 55],
    [44, 53],
  ]
  return (
    <ArtSvg viewBox="0 0 80 72">
      <ellipse cx="40" cy="58" rx="37" ry="11" fill={P.leafLight} opacity="0.6" />
      {tier >= 4 ? (
        <g>
          {/* Unterstand */}
          <Wall x={52} y={30} w={22} h={15} fill={P.wood} planks={2} k={K} />
          <path d="M57 45 V36 h12 V45 Z" fill={OUT} opacity=".7" />
          <GableRoof x={52} y={31} w={22} h={9} fill="#a5531a" over={3.4} k={K} />
        </g>
      ) : null}
      {/* Weidezaun hinter der Herde */}
      <Rod d="M5 44 H75 M5 50 H75" w={1.2} />
      {[5, 28, 52, 75].map((x) => (
        <rect key={x} x={x - 1.5} y={39} width="3" height="16" rx=".8" fill={P.woodMid} {...detail} />
      ))}
      {tier >= 3 ? (
        <g>
          {/* Tränke */}
          <path d="M4 61 h13 l-1.4 6 h-10.2 z" fill={P.metal} {...detail} />
          <path d="M5.8 62.4 h9.4" stroke={P.waterLight} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ) : null}
      {pos
        .slice(0, n)
        .map(([x, y], i) => ({ x: x!, y: y!, i }))
        .sort((a, b) => a.y - b.y)
        .map(({ x, y, i }) => (
          <Sheep key={i} x={x} y={y} i={i} s={i === 4 ? 0.7 : 1} />
        ))}
    </ArtSvg>
  )
}

function Wildbienen({ tier }: { tier: number }) {
  const rows = Math.min(4, tier)
  const top = 56 - rows * 8
  const w = tier >= 5 ? 38 : 30
  const x = 40 - w / 2
  const cols = tier >= 5 ? 6 : 5
  return (
    <ArtSvg viewBox="0 0 80 72">
      <Shadow grid="chapter" rx={16 + tier * 2} />
      <rect x="37.6" y="54" width="4.8" height="13" rx="1" fill={P.bark} {...detail} />
      <Wall x={x} y={top} w={w} h={rows * 8} fill="#d9b78a" k={K} />
      {rows > 1 ? <path d={Array.from({ length: rows - 1 }, (_, r) => `M${x + 1} ${top + (r + 1) * 8} H${x + w - 1}`).join(' ')} stroke={OUT} strokeWidth={H} /> : null}
      {Array.from({ length: rows * cols }, (_, i) => (
        <circle key={i} cx={x + 4.4 + (i % cols) * ((w - 8.8) / (cols - 1))} cy={top + 4 + Math.floor(i / cols) * 8} r="1.8" fill="#5a3d22" stroke={OUT} strokeWidth={H * 0.8} />
      ))}
      <GableRoof x={x} y={top + 1} w={w} h={9 + tier} fill="#a5531a" over={4} k={K} />
      {Array.from({ length: Math.min(5, tier) }, (_, i) => (
        <g key={`b${i}`} className="bee" style={{ animationDelay: `${i * 0.5}s` }}>
          <ellipse cx={11 + i * 14.5} cy={14 + (i % 2) * 9 - 1.6} rx="1.8" ry="1.2" fill={P.white} opacity=".85" />
          <ellipse cx={11 + i * 14.5} cy={14 + (i % 2) * 9} rx="2.6" ry="1.8" fill={P.yellow} stroke={OUT} strokeWidth={H} />
          <path d={`M${11 + i * 14.5} ${12.4 + (i % 2) * 9} v3.2`} stroke={OUT} strokeWidth={H} />
        </g>
      ))}
      {tier >= 3
        ? [12, 21, 59, 68].map((fx, i) => (
            <g key={fx}>
              <path d={`M${fx} 67 v-${5 + (i % 2) * 2}`} stroke={P.leafDark} strokeWidth={D} strokeLinecap="round" />
              <circle cx={fx} cy={61 - (i % 2) * 2} r="2.5" fill={[P.lilac, P.yellow, P.pink, P.lilac][i]} stroke={OUT} strokeWidth={H} />
            </g>
          ))
        : null}
    </ArtSvg>
  )
}

function Mosterei({ tier }: { tier: number }) {
  return (
    <ArtSvg viewBox="0 0 80 72">
      <Shadow grid="chapter" rx={22 + tier * 2.4} />
      <Grow tier={tier}>
        <Wall x={17} y={36} w={46} h={30} fill="#d9b78a" planks={3} k={K} />
        <GableRoof x={17} y={37} w={46} h={18} fill="#b8403a" over={5} k={K} />
        {/* Scheunentor */}
        <ArchDoor x={32.5} y={66} w={15} h={21} k={K} />
        {tier >= 2 ? (
          <g>
            <Pane x={21} y={44} w={7.5} h={7.5} k={K} />
            <Pane x={51.5} y={44} w={7.5} h={7.5} k={K} />
          </g>
        ) : null}
        {tier >= 3 ? (
          <g>
            {/* Apfel im Giebel */}
            <circle cx="40" cy="29.5" r="3.8" fill={P.cream} {...detail} />
            <circle cx="40" cy="29.9" r="2" fill="#d9483b" />
            <path d="M40 27.9 q1.4 -1.8 2.6 -1" fill="none" stroke={P.leafDark} strokeWidth={H * 1.4} strokeLinecap="round" />
          </g>
        ) : null}
        {tier >= 5 ? <Pennant x={40} y={19.4} s={0.9} /> : null}
      </Grow>
      {Array.from({ length: Math.min(4, tier) }, (_, i) => (
        <Barrel key={i} x={[8, 72, 15.5, 64.5][i]!} y={[67, 67, 68.5, 68.5][i]!} s={0.9} />
      ))}
      {tier >= 4 ? <Crate x={40} y={70.5} s={0.6} fruit="#d9483b" /> : null}
    </ArtSvg>
  )
}

/** Apfelring auf der Dörrstange. */
function Ring({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="2.3" fill={P.cream} stroke={OUT} strokeWidth={H} />
      <circle cx={x} cy={y} r=".8" fill={P.gold} />
    </g>
  )
}

function Doerrhaus({ tier }: { tier: number }) {
  const racks = Math.min(3, tier)
  return (
    <ArtSvg viewBox="0 0 80 72">
      <Shadow grid="chapter" rx={20 + tier * 2.6} />
      <Grow tier={tier}>
        {tier >= 2 ? (
          <g>
            <path className="smoke" d="M52.5 12c-2-3 2-5 0-8" stroke={P.white} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity=".8" />
            <rect x="49.5" y="15" width="6" height="13" rx=".8" fill={P.stone} {...detail} />
            <rect x="48.6" y="13.6" width="7.8" height="2.6" rx=".8" fill={P.stoneDark} stroke={OUT} strokeWidth={H} />
          </g>
        ) : null}
        {/* schmales, hohes Haus */}
        <Wall x={29} y={30} w={26} h={36} fill={P.woodLight} planks={4} k={K} />
        <GableRoof x={29} y={31} w={26} h={14} fill={P.woodDark} over={4.4} k={K} />
        <ArchDoor x={37} y={66} w={10} h={15} k={K} />
        {tier >= 5 ? <Pane x={38.5} y={36} w={7} h={6.5} k={K} /> : null}
        {tier >= 5 ? <Pennant x={42} y={17.4} s={0.85} /> : null}
      </Grow>
      {/* Dörrgestell: je Stufe eine Stange mit Apfelringen mehr */}
      <Rod d={`M6 67 V${45 - racks * 7} M23 67 V${45 - racks * 7}`} w={1.4} />
      {Array.from({ length: racks }, (_, r) => {
        const y = 60 - r * 8
        return (
          <g key={r}>
            <path d={`M6 ${y - 3.4} H23`} stroke={OUT} strokeWidth={D} strokeLinecap="round" />
            <Ring x={10} y={y} />
            <Ring x={14.5} y={y} />
            <Ring x={19} y={y} />
          </g>
        )
      })}
      {tier >= 4 ? (
        <g>
          {/* Dörrobst in Gläsern */}
          <Jar x={62} y={67} s={0.8} c={P.amber} />
          <Jar x={68.5} y={68} s={0.8} c="#b8433f" />
        </g>
      ) : null}
    </ArtSvg>
  )
}

function Obstmarkt({ tier }: { tier: number }) {
  const crates = Math.min(5, tier + 1)
  const colors = ['#d9483b', '#d8c84a', '#5b3a78', '#9e1f2c', P.gold]
  return (
    <ArtSvg viewBox="0 0 80 72">
      <Shadow grid="chapter" rx={24 + tier * 2} />
      <Grow tier={tier}>
        {tier >= 4 ? (
          <g>
            {/* Marktschild */}
            <path d="M40 24 v-4" stroke={OUT} strokeWidth={D} />
            <rect x="32" y="10" width="16" height="10.5" rx="1.4" fill={P.cream} {...line} />
            <circle cx="40" cy="15.6" r="2.7" fill="#d9483b" stroke={OUT} strokeWidth={H} />
            <path d="M40 13 q1.2 -1.6 2.4 -1" fill="none" stroke={P.leafDark} strokeWidth={H * 1.4} strokeLinecap="round" />
          </g>
        ) : null}
        <rect x="13.4" y="33" width="3.2" height="33" rx=".8" fill={P.woodDark} {...detail} />
        <rect x="63.4" y="33" width="3.2" height="33" rx=".8" fill={P.woodDark} {...detail} />
        {/* Markise */}
        <path d="M8 34 L14 23.5 H66 L72 34 Z" fill={P.white} {...line} />
        {[0, 1, 2, 3].map((i) => {
          // oben 52 breit (14…66), unten 64 breit (8…72): sieben Bahnen, jede zweite rot
          const a = 14 + (i * 2 * 52) / 7
          const b = 8 + (i * 2 * 64) / 7
          return <path key={i} d={`M${a.toFixed(2)} 24.2 H${(a + 52 / 7).toFixed(2)} L${(b + 64 / 7).toFixed(2)} 33.4 H${b.toFixed(2)} Z`} fill={P.tomato} />
        })}
        <path d="M52 24.2 H65.6 L70.8 33.4 H54 Z" fill={OUT} opacity=".13" />
        <path d="M8 34 L14 23.5 H66 L72 34 Z" fill="none" {...line} />
        <path d={`M8 34 ${Array.from({ length: 8 }, () => 'q4 4 8 0').join(' ')} Z`} fill={P.tomato} {...detail} />
        {/* Theke */}
        <Wall x={12} y={50} w={56} h={16} fill={P.wood} planks={1} k={K} />
        {Array.from({ length: crates }, (_, i) => (
          <Crate key={i} x={40 + (i - (crates - 1) / 2) * 10.6} y={51} s={0.56} fruit={colors[i]} />
        ))}
        <rect x="10.6" y="48.8" width="58.8" height="3.2" rx="1" fill={P.woodLight} {...detail} />
      </Grow>
      {tier >= 3 ? <Barrel x={73} y={68} s={0.95} /> : null}
      {tier >= 5 ? (
        <g>
          <Crate x={8} y={69} s={0.7} fruit="#d9483b" />
          <Pennant x={69} y={24} s={0.9} />
        </g>
      ) : null}
    </ArtSvg>
  )
}

export const OrchardArt = memo(function OrchardArt({
  id,
  level,
  season,
}: {
  id: OrchardId
  level: number
  season?: Season
}) {
  const tier = Math.max(1, moduleTier(level))
  switch (id) {
    case 'schafe':
      return <Schafe tier={tier} />
    case 'wildbienen':
      return <Wildbienen tier={tier} />
    case 'mosterei':
      return <Mosterei tier={tier} />
    case 'doerrhaus':
      return <Doerrhaus tier={tier} />
    case 'obstmarkt':
      return <Obstmarkt tier={tier} />
    default:
      return <FruitTree id={id} tier={tier} season={season} />
  }
}, sameTierProps)

/** Sapling marker for an unlocked but unplanted orchard spot. */
export function OrchardSapling() {
  return (
    <ArtSvg viewBox="0 0 80 72">
      <ellipse cx="40" cy="62" rx="16" ry="5" fill={P.soil} opacity="0.75" stroke={OUT} strokeWidth={D} />
      <Rod d="M33 62l2-15M47 62l-2-15" w={1.1} />
      <path d="M40 62V44" stroke={OUT} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M40 62V44" stroke={P.bark} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M40 48c-6-2-8-7-6-10 4 1 6 5 6 10zM40 46c5-3 9-3 10 0-3 3-7 3-10 0z" fill={P.leafLight} {...detail} />
    </ArtSvg>
  )
}

/** Overgrown spot (locked) — tall grass and an old stump. */
export function OrchardWild({ seed = 0 }: { seed?: number }) {
  return (
    <ArtSvg viewBox="0 0 80 72">
      <ellipse cx="40" cy="62" rx="26" ry="7" fill={P.leaf} opacity="0.5" />
      <ellipse cx="22" cy="54" rx="11" ry="8" fill="#6d9a3f" stroke={OUT} strokeWidth={D} />
      <ellipse cx="58" cy="55" rx="12" ry="8" fill={P.leaf} stroke={OUT} strokeWidth={D} />
      <circle cx="18" cy="52" r="1.7" fill="#7a2e5a" />
      <circle cx="24" cy="49" r="1.7" fill="#7a2e5a" />
      <circle cx="61" cy="52" r="1.7" fill="#7a2e5a" />
      <path d="M32 62v-8q8-3 16 0v8z" fill={P.bark} {...detail} />
      <ellipse cx="40" cy="54" rx="8" ry="2.4" fill={P.woodLight} stroke={OUT} strokeWidth={H} />
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M${20 + i * 5} 64q${(i % 2 ? 1 : -1) * 3} -${10 + ((i + seed) % 3) * 4} ${(i % 2 ? 4 : -2)} -${16 + ((i + seed) % 4) * 3}`}
          stroke={i % 3 ? '#6d9a3f' : '#a3b85a'}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </ArtSvg>
  )
}
