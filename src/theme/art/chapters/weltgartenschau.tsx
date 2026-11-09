/**
 * Kapitel-Grafik Kapitel 49: Weltgartenschau (Leitung Dr. Elisabeth Grün).
 * Länderbeete aus Bogen II (Europa) und Bogen III (Ursprünge), Zukunftshalle,
 * Seilbahn, Pavillon der Familie. Jahreszeiten: Frühling = Tulpen, Aufbau;
 * Sommer = Hauptsaison, Fontänen, Ballons; Herbst = Laub, Kürbis und Mais;
 * Winter = Schnee, Lichter, die Beete ruhen.
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
import { Floor, Lantern, Paving } from './partsI'
import { P } from '../palette'
import { Farmer, Kid } from './figures'
import { ssn } from './season'

function Sky({ season, balloons = 0 }: { season?: string; balloons?: number }) {
  const z = ssn(season)
  return (
    <g className="art-sky">
      {z === 'summer' ? <Sun x={71} y={9} r={3} /> : z === 'spring' ? <Cloud x={14} y={9} s={1.1} /> : z === 'autumn' ? <Cloud x={64} y={9} s={1.2} c={P.stoneLight} /> : <Snowfall n={7} y1={30} />}
      {Array.from({ length: balloons }, (_, i) => (
        <g key={i}>
          <path d={`M${10 + i * 7} ${22 + (i % 2) * 3}v6`} stroke={P.charcoal} strokeWidth=".2" />
          <ellipse cx={10 + i * 7} cy={20 + (i % 2) * 3} rx="1.8" ry="2.2" fill={[P.red, P.yellow, P.blue, P.leafLight][i % 4]} stroke={P.outline} strokeWidth=".15" />
        </g>
      ))}
    </g>
  )
}

/** Rundes Beet mit Rand (Fußpunkt Mitte). */
function Bed({ x, y, rx = 9, ry = 3.4, season }: { x: number; y: number; rx?: number; ry?: number; season?: string }) {
  const z = ssn(season)
  return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={z === 'winter' ? P.white : P.soil} stroke={P.stone} strokeWidth=".8" />
}

/** Stockrose (hoch, Blüten am Stängel). */
function Hollyhock({ x, y, season }: { x: number; y: number; season?: string }) {
  const z = ssn(season)
  if (z === 'winter') return <path d={`M${x} ${y}v-6`} stroke={P.woodLight} strokeWidth=".6" />
  const h = z === 'spring' ? 5 : 12
  return (
    <g>
      <path d={`M${x} ${y}v-${h}`} stroke={P.leafDark} strokeWidth=".7" />
      <ellipse cx={x - 1.4} cy={y - 1.6} rx="1.6" ry="1" fill={P.leaf} />
      {z !== 'spring' ? [3, 6, 9].map((d) => <circle key={d} cx={x + (d % 2 ? 0.6 : -0.6)} cy={y - d} r="1.1" fill={z === 'autumn' ? P.woodMid : P.pink} stroke={P.outline} strokeWidth=".12" />) : null}
    </g>
  )
}

/** Länderschild (kleines Fähnchen mit Farbstreifen). */
function Flag({ x, y, a, b }: { x: number; y: number; a: string; b: string }) {
  return (
    <g>
      <path d={`M${x} ${y}v-8`} stroke={P.woodDark} strokeWidth=".5" />
      <rect x={x} y={y - 8} width="4" height="1.4" fill={a} />
      <rect x={x} y={y - 6.6} width="4" height="1.4" fill={b} />
    </g>
  )
}

/** Gondel an einem Seil. */
function Gondola({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <path d={`M${x} ${y}v3`} stroke={P.charcoal} strokeWidth=".5" />
      <rect x={x - 3.6} y={y + 3} width="7.2" height="6" rx="1.4" fill={c} stroke={P.outline} strokeWidth=".3" />
      <rect x={x - 2.6} y={y + 4} width="5.2" height="2.4" fill={P.glass} />
    </g>
  )
}

/** Bilderrahmen. */
function Frame({ x, y, i, s = 1 }: { x: number; y: number; i: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
      <rect x={x - 2.4} y={y - 3} width="4.8" height="3.6" fill={P.paper} stroke={P.woodDark} strokeWidth=".5" />
      <circle cx={x} cy={y - 1.8} r=".7" fill={P.skin} />
      <path d={`M${x - 1.2} ${y + 0.4}q1.2 -1.6 2.4 0`} fill={[P.berry, P.blue, P.leaf, P.yellow, P.plum][i % 5]} />
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
        <Svg tier={tier}>
          <Paving season={season} fill={P.paper} />
          {bedOrder(beds).map((i) => {
            const [x, y] = spots[i]!
            return (
            <g key={i} transform={`translate(${x} ${y}) scale(1.45) translate(${-x} ${-y})`}>
              <Bed x={x} y={y} season={season} />
              {i === 0 ? [-6, -3, 0, 3, 6].map((d) => <Hollyhock key={d} x={x + d} y={y} season={season} />) : null}
              {i === 1 ? [-6, -3, 0, 3, 6].map((d, k) => (winter ? <ellipse key={d} cx={x + d} cy={y - 0.4} rx="1" ry=".4" fill={P.soilDark} /> : <Tulip key={d} x={x + d} y={y} c={[P.red, P.yellow, P.white, P.plum, P.pink][k]!} head={z === 'spring' || summer} />)) : null}
              {i === 2 ? [-5, 0, 5].map((d) => <RoseBush key={d} x={x + d} y={y} s={0.7} season={season} n={4} />) : null}
              {i === 3 ? [-5, 0, 5].map((d) => <RoseBush key={d} x={x + d} y={y} s={0.6} season={season === 'summer' ? 'spring' : season} n={3} />) : null}
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
        <Svg tier={tier}>
          <Paving season={season} fill={P.paper} />
          {bedOrder(beds).map((i) => {
            const [x, y] = spots[i]!
            return (
            <g key={i} transform={`translate(${x} ${y}) scale(1.45) translate(${-x} ${-y})`}>
              <Bed x={x} y={y} season={season} />
              {i === 0 ? [-5, 0, 5].map((d) => <PotatoPlant key={d} x={x + d} y={y} s={0.9} season={season} />) : null}
              {i === 1 ? [-5, 0, 5].map((d) => <CornPlant key={d} x={x + d} y={y} s={0.7} season={season} beans={d === 0} />) : null}
              {i === 2 ? [-5, 0, 5].map((d) => <NapaCabbage key={d} x={x + d} y={y} s={0.9} season={season} />) : null}
              {i === 3 ? [-5, 0, 5].map((d) => (winter ? <ellipse key={d} cx={x + d} cy={y - 0.4} rx="1.2" ry=".5" fill={P.soilDark} /> : <path key={d} d={`M${x + d} ${y}v-6M${x + d} ${y - 3}l-2 -1.6M${x + d} ${y - 4.6}l2 -1.4`} stroke={P.leafDark} strokeWidth=".7" />)) : null}
              {i === 3 && !winter ? [-5, 0, 5].map((d) => <circle key={`c${d}`} cx={x + d + 1} cy={y - 5} r=".8" fill={autumn ? P.berry : P.leafPale} />) : null}
              {i === 4 ? [-3, 3].map((d) => <PotatoPlant key={d} x={x + d} y={y} s={0.8} season={season} flower={P.white} />) : null}
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
        <Svg tier={tier}>
          <Paving season={season} />
          <Glasshouse x={x0} w={w} h={20} roofH={8} curved tint={P.glass} ground={62} />
          <path d={`M${x0 - 1} 42Q40 ${32 - tier} ${x0 + w + 1} 42`} stroke={winter ? P.white : P.leaf} strokeWidth="2.4" fill="none" />
          {tier >= 2 ? Array.from({ length: Math.min(4, tier - 1) }, (_, i) => <rect key={i} x={x0 + 4 + i * 7} y={52} width="5" height="10" fill={P.terracottaLight} stroke={P.outlineStone} strokeWidth=".2" />) : null}
          {tier >= 3 ? <path d="M40 62V48M36 50h8" stroke={P.leafDark} strokeWidth=".8" /> : null}
          {tier >= 3 ? <ellipse cx="40" cy="46" rx="5" ry="3.6" fill={winter ? P.winterLeaf : P.leaf} /> : null}
          {tier >= 4 ? <path d={`M${x0 + w - 12} 52l8 -2v6l-8 2z`} fill={P.blue} stroke={P.metal} strokeWidth=".3" /> : null}
          {tier >= 5 ? <Farmer x={66} y={70} c={P.leaf} s={1.15} hat={P.woodLight} /> : null}
          {tier >= 5 ? <Kid x={58} y={70} c={P.berry} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'gondelbahn': {
      const gondolas = tier
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {[10, 70].map((x) => (
            <g key={x}>
              <path d={`M${x - 3} 64L${x} 16L${x + 3} 64`} stroke={P.metal} strokeWidth="1" fill="none" />
              <path d={`M${x - 2} 40h4M${x - 2.6} 52h5.2M${x - 3} 16h6`} stroke={P.metal} strokeWidth=".6" />
            </g>
          ))}
          <path d="M7 16Q40 26 73 16" stroke={P.charcoal} strokeWidth=".5" fill="none" />
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
        <Svg tier={tier}>
          <Paving season={season} />
          <ellipse cx="40" cy="60" rx="30" ry="6" fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".5" />
          <ellipse cx="40" cy="60" rx="27" ry="4.8" fill={winter ? P.glassEdge : P.pond} />
          {Array.from({ length: jets }, (_, i) => {
            const x = 40 + (i - (jets - 1) / 2) * (44 / Math.max(1, jets - 1))
            const h = 14 + ((i * 7) % 3) * 6
            const c = lit[i % lit.length]!
            return winter ? (
              <g key={i}>
                <path d={`M${x} 60v-3`} stroke={P.white} strokeWidth="1.4" strokeLinecap="round" />
                <circle cx={x} cy={56} r=".8" fill={c} />
              </g>
            ) : (
              <g key={i}>
                <path d={`M${x} 60V${60 - h}`} stroke={c} strokeWidth="1.6" strokeLinecap="round" opacity=".9" />
                <path d={`M${x} ${60 - h}q-3 2 -4 6M${x} ${60 - h}q3 2 4 6`} stroke={c} strokeWidth=".7" fill="none" opacity=".8" />
              </g>
            )
          })}
          {tier >= 3 ? [16, 64].map((x) => <circle key={x} cx={x} cy={62.4} r="1" fill={P.lamp} stroke={P.metal} strokeWidth=".2" />) : null}
          {tier >= 5 ? <Kid x={72} y={70} c={P.blue} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'saatguttempel': {
      const cols = 2 + tier
      return (
        <Svg tier={tier}>
          <Paving season={season} />
          <ellipse cx="40" cy="62" rx="26" ry="4" fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".4" />
          <rect x="18" y="36" width="44" height="24" fill={P.glass} opacity=".7" />
          {[44, 52].map((y) => <path key={y} d={`M20 ${y}h40`} stroke={P.woodMid} strokeWidth=".6" />)}
          {Array.from({ length: Math.min(12, 2 + tier * 2) }, (_, i) => (
            <SeedJar key={i} x={23 + (i % 6) * 7} y={i < 6 ? 52 : 44} s={1.1} seed={[P.seed, P.berry, P.yellow, P.leafMoss, P.cream, P.plum][i % 6]} />
          ))}
          {Array.from({ length: cols }, (_, i) => (
            <rect key={i} x={17 + i * (44 / Math.max(1, cols - 1))} y="36" width="2" height="24" fill={P.white} stroke={P.stone} strokeWidth=".3" />
          ))}
          <rect x="15" y="33" width="50" height="3" fill={P.white} stroke={P.stone} strokeWidth=".4" />
          <path d="M16 33Q40 8 64 33z" fill={winter ? P.white : P.leafLight} stroke={P.leafDark} strokeWidth=".4" />
          {tier >= 4 ? <OmaTin x={40} y={28} s={1.2} /> : null}
          {tier >= 5 ? <Farmer x={72} y={70} c={P.white} s={1.15} hat={P.ink} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'kinderwald': {
      const trees = 1 + tier
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: trees }, (_, i) => {
            const x = 12 + i * (56 / Math.max(1, trees - 1))
            const y = 60 + (i % 2) * 4
            return (
              <g key={i}>
                <Sapling x={x} y={y} s={0.9 + (i % 3) * 0.15} season={season} crown={[P.leaf, P.leafDark, P.leafLight][i % 3]} stake />
                <rect x={x + 1.6} y={y - 6} width="3" height="1.8" fill={P.label} stroke={P.outlineSoft} strokeWidth=".15" />
              </g>
            )
          })}
          {tier >= 2 ? <Kid x={24} y={70} c={P.red} s={1.5} /> : null}
          {tier >= 3 ? <Kid x={48} y={70} c={P.yellow} s={1.5} hair={P.woodLight} /> : null}
          {tier >= 4 ? <Signpost x={66} y={70} dir="left" /> : null}
          {tier >= 5 ? <Farmer x={36} y={70} c={P.plum} s={1.15} hat={P.charcoal} skirt={P.denim} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'familienpavillon': {
      const frames = 1 + tier
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <path d="M12 30L40 16L68 30z" fill={P.leafDark} stroke={P.outline} strokeWidth=".4" />
          {winter ? <path d="M14 29.4L40 16.6L66 29.4" stroke={P.white} strokeWidth="1.2" fill="none" /> : null}
          <rect x="16" y="30" width="48" height="30" fill={P.cream} stroke={P.outlineWood} strokeWidth=".4" />
          {[16, 64].map((x) => <rect key={x} x={x - 1.4} y="30" width="2.8" height="30" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />)}
          {Array.from({ length: frames }, (_, i) => (
            <Frame key={i} x={25 + (i % 3) * 15} y={i < 3 ? 42 : 52} i={i} s={2} />
          ))}
          <Lantern x={40} y={34} c={P.lamp} lit={winter || autumn} />
          {tier >= 3 ? <path d="M24 56h32" stroke={P.woodDark} strokeWidth="1.4" /> : null}
          {tier >= 3 ? <OmaTin x={40} y={55.6} s={0.9} /> : null}
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
        <Svg tier={tier}>
          <Floor season={season} />
          <path d={`M8 62Q${8 + len * 0.5} ${48 - tier} ${8 + len} ${40 - tier * 2}`} stroke={P.woodMid} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d={`M8 59Q${8 + len * 0.5} ${45 - tier} ${8 + len} ${37 - tier * 2}`} stroke={P.metal} strokeWidth=".5" fill="none" />
          {Array.from({ length: posts }, (_, i) => {
            const t = (i + 1) / (posts + 0.4)
            const x = 8 + len * t
            const y = (1 - t) * (1 - t) * 62 + 2 * (1 - t) * t * (48 - tier) + t * t * (40 - tier * 2)
            return <path key={i} d={`M${x.toFixed(2)} ${(y + 1).toFixed(2)}V64`} stroke={P.metal} strokeWidth=".8" />
          })}
          {tier >= 2 ? <Farmer x={8 + len * 0.55} y={51 - tier} c={P.blue} s={1.1} hat={P.woodLight} /> : null}
          {tier >= 3 ? <Kid x={8 + len * 0.8} y={47 - tier * 1.6} c={P.yellow} s={1.4} /> : null}
          {tier >= 4 ? <path d={`M${8 + len} ${40 - tier * 2}v-8l4 1.6l-4 1.6`} stroke={P.charcoal} strokeWidth=".4" fill={P.red} /> : null}
          {tier >= 5 ? <Farmer x={40} y={70} c={P.berry} s={1.15} hat={P.charcoal} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'eroeffnung': {
      const crowd = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Paving season={season} />
          <Bunting y={18} n={4 + tier} />
          <path d="M14 62V40M66 62V40" stroke={P.woodDark} strokeWidth="1.2" />
          <path d="M14 46Q40 52 66 46" stroke={P.red} strokeWidth="1.4" fill="none" />
          <path d="M38 48l2 3l2 -3z" fill={P.red} />
          <Farmer x={40} y={60} c={P.leafDark} s={1.25} hat={P.cream} skirt={P.leafDark} />
          <path d="M42 54l3 -2M43.4 52.6l1.4 1" stroke={P.metal} strokeWidth=".6" />
          {Array.from({ length: crowd }, (_, i) => (
            <g key={i}>{i % 2 ? <Kid x={18 + i * 14} y={72} c={[P.yellow, P.blue, P.orange, P.leaf][i]!} s={1.5} /> : <Farmer x={18 + i * 14} y={70} c={[P.berry, P.blue, P.plum, P.orange][i]!} s={1.15} hat={P.woodLight} />}</g>
          ))}
          {tier >= 4 ? [12, 68].map((x) => <Lantern key={x} x={x} y={28} c={P.orange} lit={winter || autumn} />) : null}
          <Sky season={season} balloons={Math.max(0, tier - 1)} />
        </Svg>
      )
    }
  }
  return null
}
