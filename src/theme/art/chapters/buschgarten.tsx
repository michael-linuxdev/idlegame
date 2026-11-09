/**
 * Kapitel-Grafik Kapitel 37: Buschgarten in Australien (Norden von New South Wales).
 * Jahreszeiten der Südhalbkugel, das Spieljahr gedeutet wie vor Ort:
 * Frühling (September) = Akazien blühen gelb; Sommer = heiß und trocken,
 * Gras golden, reife Hülsen; Herbst = Fingerlimetten reif, milder;
 * Winter = kühl und grün, Pfützen, Wassertanks voll.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { P } from '../palette'
import { Farmer } from './figures'
import type { AreaProps } from './partsB'
import { Fire } from './partsD'
import { Patch } from './partsF'
import { Eucalyptus, Kangaroo, Stars, Wattle } from './partsG'
import { ssn } from './season'

/** Roter Boden mit Gras je Jahreszeit. */
function Floor({ season, cy = 60, rx = 36, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const grass = z === 'spring' ? P.leaf : z === 'summer' ? P.gold : z === 'autumn' ? P.woodLight : P.leafMoss
  return (
    <g>
      <Patch fill={P.terracotta} cy={cy} rx={rx} ry={ry} />
      <Patch fill={grass} cy={cy - 1} rx={rx * 0.8} ry={ry * 0.62} />
      {[-0.6, -0.2, 0.25, 0.6].map((d) => (
        <path key={d} d={`M${40 + rx * d} ${cy + 1}l-1 -2.4M${40 + rx * d} ${cy + 1}v-2.8M${40 + rx * d} ${cy + 1}l1 -2.4`} stroke={z === 'summer' ? P.woodMid : P.leafDark} strokeWidth=".4" />
      ))}
      {z === 'winter' ? <ellipse cx={40 + rx * 0.45} cy={cy + 3} rx="4" ry="1.1" fill={P.water} opacity=".85" /> : null}
    </g>
  )
}

/** Fingerlimettenstrauch: dorniger Busch, Früchte wie Finger (Herbst bunt, Sommer grün, Frühling weiße Blüten). */
function FingerLime({ x, y, s = 1, season, n = 5 }: { x: number; y: number; s?: number; season?: string; n?: number }) {
  const z = ssn(season)
  const pts: [number, number][] = [[-4, -5], [3, -7], [-1, -9], [5, -4], [-5, -9], [1, -4]]
  const fruit = [P.berry, P.leafLight, P.plum, P.yellow, P.pink, P.leafDark]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-6M0 -3l-4 -3M0 -4l4 -4" stroke={P.bark} strokeWidth=".7" />
      <ellipse cx="0" cy="-7" rx="7" ry="5" fill={z === 'winter' ? P.leafMoss : P.leafDark} />
      <ellipse cx="-2" cy="-8" rx="4" ry="3" fill={P.leafMoss} />
      {[[-5, -7], [4, -9], [0, -11], [6, -6]].map(([px, py], i) => (
        <path key={i} d={`M${px} ${py}l.8 -.8`} stroke={P.woodLight} strokeWidth=".3" />
      ))}
      {pts.slice(0, n).map(([px, py], i) =>
        z === 'spring' ? (
          <circle key={i} cx={px} cy={py} r=".7" fill={P.white} />
        ) : z === 'winter' && i % 2 ? null : (
          <path key={i} d={`M${px} ${py}v2.6`} stroke={z === 'autumn' ? fruit[i]! : z === 'winter' ? P.plum : P.leafLight} strokeWidth="1.2" strokeLinecap="round" />
        ),
      )}
    </g>
  )
}

/** Zitronenmyrte: dichter Strauch, im Sommer cremeweiße Blütenbüschel. */
function LemonMyrtle({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-6" stroke={P.bark} strokeWidth="1" />
      <ellipse cx="0" cy="-10" rx="7" ry="6" fill={z === 'spring' ? P.leaf : P.leafDark} stroke={P.outline} strokeWidth=".2" />
      <ellipse cx="-2" cy="-12" rx="4" ry="3" fill={z === 'spring' ? P.leafPale : P.leaf} />
      {z === 'summer'
        ? [[-4, -11], [3, -13], [0, -8], [5, -9], [-2, -14]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r="1" fill={P.cream} stroke={P.outlineSoft} strokeWidth=".1" />)
        : z === 'spring'
          ? [[-4, -11], [3, -13], [0, -8]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r=".5" fill={P.cream} />)
          : null}
    </g>
  )
}

/** Salzbusch: rundlich, silbergrau. */
function Saltbush({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="-3" rx="6" ry="3.6" fill={P.winterLeaf} stroke={P.winterLeafDark} strokeWidth=".3" />
      <ellipse cx="-1.6" cy="-4" rx="3.4" ry="2.2" fill={P.winterLeafLight} />
      <ellipse cx="2.4" cy="-4.4" rx="2" ry="1.4" fill={z === 'winter' ? P.stoneLight : P.frost} />
      {z === 'autumn' ? [-3, 0, 3].map((d) => <circle key={d} cx={d} cy={-6} r=".5" fill={P.terracottaLight} />) : null}
    </g>
  )
}

/** Wellblechtank (Mitte unten). */
function Tank({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-6" y="-12" width="12" height="12" fill={P.stoneLight} stroke={P.metal} strokeWidth=".35" />
      {[-4, -2, 0, 2, 4].map((d) => (
        <path key={d} d={`M${d} -12v12`} stroke={P.stone} strokeWidth=".35" />
      ))}
      <ellipse cx="0" cy="-12" rx="6" ry="1.4" fill={P.stone} stroke={P.metal} strokeWidth=".3" />
      <path d="M-6 -1.2h12" stroke={P.metal} strokeWidth=".4" />
      <path d="M5 -3h2v2" stroke={P.metal} strokeWidth=".5" fill="none" />
    </g>
  )
}

export function Buschgarten({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  switch (id) {
    case 'wattlehain': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Wattle key={i} x={[40, 20, 60, 30, 52][i]!} y={[58, 63, 63, 70, 70][i]!} s={[1.8, 1.4, 1.4, 1.15, 1.15][i]!} season={season} n={8} />
          ))}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.leafDark} s={0.6} hat={P.woodDark} /> : null}
        </Svg>
      )
    }
    case 'fingerlimetten': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <FingerLime key={i} x={[40, 20, 60, 30, 52][i]!} y={[56, 62, 62, 70, 70][i]!} s={[2, 1.6, 1.6, 1.3, 1.3][i]!} season={season} n={6} />
          ))}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.blue} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'zitronenmyrte': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <LemonMyrtle key={i} x={[40, 20, 60, 30, 52][i]!} y={[58, 63, 63, 70, 70][i]!} s={[1.8, 1.4, 1.4, 1.15, 1.15][i]!} season={season} />
          ))}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.berry} s={0.6} hat={P.woodDark} /> : null}
        </Svg>
      )
    }
    case 'saltbush': {
      const n = 1 + tier
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Saltbush key={i} x={[40, 20, 60, 30, 52, 70][i]!} y={[58, 62, 62, 68, 68, 68][i]!} s={[2, 1.6, 1.6, 1.4, 1.4, 1.2][i]!} season={season} />
          ))}
          {tier >= 5 ? <Farmer x={14} y={72} c={P.leafDark} s={0.6} hat={P.woodDark} /> : null}
        </Svg>
      )
    }
    case 'wasserloch':
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <ellipse cx="40" cy="60" rx={summer ? 15 : 20} ry={summer ? 5 : 6.4} fill={P.water} stroke={P.terracottaLight} strokeWidth="1" />
          <path d="M30 59q5 -1 10 0" stroke={P.waterLight} strokeWidth=".5" fill="none" />
          <ellipse cx="18" cy="56" rx="5" ry="3" fill={P.terracottaLight} stroke={P.autumnDark} strokeWidth=".3" />
          {tier >= 2 ? <ellipse cx="62" cy="54" rx="4" ry="2.4" fill={P.terracottaLight} stroke={P.autumnDark} strokeWidth=".3" /> : null}
          {tier >= 3 ? <Kangaroo x={60} y={68} s={1.7} graze /> : null}
          {tier >= 4 ? <Kangaroo x={24} y={69} s={1.5} flip /> : null}
          {tier >= 5 ? <Eucalyptus x={70} y={58} s={0.9} season={season} /> : null}
          {Array.from({ length: tier }, (_, i) => (
            <path key={i} d={`M${30 + i * 5} 54l-1 -3M${30 + i * 5} 54v-3.4`} stroke={P.leafDark} strokeWidth=".5" />
          ))}
        </Svg>
      )
    case 'eukalyptus': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Eucalyptus key={i} x={[40, 20, 60, 30, 52][i]!} y={[58, 62, 62, 70, 70][i]!} s={[1.6, 1.25, 1.25, 1.05, 1.05][i]!} season={season} />
          ))}
          {tier >= 3 ? <path d="M14 66q3 -1 6 0M58 70q3 -1 6 0" stroke={P.woodLight} strokeWidth=".8" strokeLinecap="round" /> : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.leafDark} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'mahlstein': {
      const piles = tier
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <ellipse cx="38" cy="60" rx="13" ry="4.4" fill={P.stone} stroke={P.outlineStone} strokeWidth=".4" />
          <ellipse cx="38" cy="59.2" rx="10" ry="3" fill={P.stoneLight} />
          <ellipse cx="40" cy="57.6" rx="4" ry="2.4" fill={P.stoneDark} stroke={P.outlineStone} strokeWidth=".3" />
          <ellipse cx="32" cy="59.6" rx="3" ry=".8" fill={P.woodLight} />
          {Array.from({ length: piles }, (_, i) => (
            <g key={i}>
              <ellipse cx={14 + i * 12} cy={67.6} rx="4.4" ry="1.6" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" />
              <ellipse cx={14 + i * 12} cy={67} rx="3" ry=".9" fill={i % 2 ? P.woodDark : P.woodLight} />
            </g>
          ))}
          {tier >= 3 ? <Wattle x={66} y={56} s={1.1} season={season} n={6} /> : null}
          {tier >= 4 ? <Farmer x={54} y={64} c={P.berry} s={0.6} hat={P.woodDark} skirt={P.leafDark} /> : null}
        </Svg>
      )
    }
    case 'saatguthuette': {
      const jars = 2 + tier
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <rect x="16" y="40" width="34" height="20" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M12 41h42l-4 -8H16z" fill={P.stoneLight} stroke={P.metal} strokeWidth=".4" />
          {[18, 24, 30, 36, 42, 48].map((x) => (
            <path key={x} d={`M${x} 34v7`} stroke={P.stone} strokeWidth=".4" />
          ))}
          <rect x="20" y="46" width="8" height="14" fill={P.woodDark} />
          <path d="M32 46h16M32 52h16" stroke={P.woodDark} strokeWidth=".6" />
          {Array.from({ length: jars }, (_, i) => (
            <rect key={i} x={33 + (i % 5) * 3} y={i < 5 ? 43 : 49} width="2.2" height="3" rx=".4" fill={P.glass} stroke={P.stone} strokeWidth=".2" />
          ))}
          {Array.from({ length: jars }, (_, i) => (
            <rect key={`s${i}`} x={33.3 + (i % 5) * 3} y={i < 5 ? 44.4 : 50.4} width="1.6" height="1.4" fill={[P.woodDark, P.gold, P.leafDark, P.terracotta][i % 4]} />
          ))}
          {tier >= 4 ? <Tank x={62} y={62} s={1} /> : null}
          {tier >= 5 ? <Farmer x={56} y={70} c={P.leafDark} s={0.6} hat={P.woodDark} /> : null}
        </Svg>
      )
    }
    case 'regentank': {
      const tanks = Math.min(3, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <rect x="8" y="38" width="22" height="20" fill={P.cream} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M5 39h28l-4 -7H9z" fill={P.stone} stroke={P.metal} strokeWidth=".4" />
          <path d="M5 39h30v2" stroke={P.metal} strokeWidth=".6" fill="none" />
          <rect x="16" y="46" width="6" height="12" fill={P.leafDark} />
          {Array.from({ length: tanks }, (_, i) => (
            <Tank key={i} x={[42, 58, 70][i]!} y={[60, 62, 66][i]!} s={[1.4, 1.2, 1][i]!} />
          ))}
          {tier >= 4 ? <path d="M35 41h4v10" stroke={P.metal} strokeWidth=".7" fill="none" /> : null}
          {tier >= 5 ? <Farmer x={30} y={70} c={P.blue} s={0.6} hat={P.woodLight} /> : null}
          {winter ? [44, 52, 60].map((x) => <path key={x} d={`M${x} 20l-1 4`} stroke={P.waterLight} strokeWidth=".6" />) : null}
        </Svg>
      )
    }
    case 'feuerabend':
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <ellipse cx="40" cy="62" rx="7" ry="2.4" fill={P.charcoal} />
          <Fire x={40} y={62} s={0.8} />
          <Stars n={2 + tier * 2} y0={4} y1={26} />
          {tier >= 2 ? <ellipse cx="46" cy="64" rx="2.4" ry="1" fill={P.woodLight} stroke={P.woodDark} strokeWidth=".3" /> : null}
          {tier >= 3 ? <Farmer x={24} y={66} c={P.leafDark} s={0.7} hat={P.woodDark} /> : null}
          {tier >= 4 ? <Farmer x={58} y={66} c={P.berry} s={0.7} hat={P.woodDark} skirt={P.blue} /> : null}
          {tier >= 5 ? <Farmer x={40} y={72} c={P.gold} s={0.7} hat={P.woodDark} /> : null}
          {tier >= 5 ? <path d="M12 60h10M60 72h10" stroke={P.woodMid} strokeWidth="1.4" strokeLinecap="round" /> : null}
        </Svg>
      )
  }
  return null
}
