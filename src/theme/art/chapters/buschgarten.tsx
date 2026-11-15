/**
 * Kapitel 37 — Buschgarten (Norden von New South Wales) im kräftigen Stil
 * (2026-11-14, Weinberg-Niveau): roter Boden, Fingerlimetten, Zitronenmyrte,
 * Salzbusch, Wellblechtanks, Wasserloch, Mahlstein, Saatguthütte und Regentank
 * mit Kontur. Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Farmer } from './figures'
import type { AreaProps } from './partsB'
import { Fire } from './partsD'
import { Eucalyptus, Kangaroo, Stars, Wattle } from './partsG'
import { ssn } from './season'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Roter Boden mit Gras je Jahreszeit. */
function Floor({ season, cy = 60, rx = 36, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const grass = z === 'spring' ? P.leaf : z === 'summer' ? P.gold : z === 'autumn' ? P.woodLight : P.leafMoss
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={P.terracotta} {...line} />
      <ellipse cx="40" cy={cy - 1} rx={rx * 0.8} ry={ry * 0.62} fill={grass} {...detail} />
      <path d={`M${40 - rx * 0.55} ${cy - ry * 0.35}q${rx * 0.3} -${ry * 0.18} ${rx * 0.6} -${ry * 0.06}`} stroke={P.white} strokeWidth={D} opacity=".3" fill="none" strokeLinecap="round" />
      {[-0.6, -0.2, 0.25, 0.6].map((d) => (
        <path key={d} d={`M${40 + rx * d} ${cy + 1}l-1 -2.4M${40 + rx * d} ${cy + 1}v-2.8M${40 + rx * d} ${cy + 1}l1 -2.4`} stroke={z === 'summer' ? P.woodMid : P.leafDark} strokeWidth=".8" strokeLinecap="round" />
      ))}
      {z === 'winter' ? <ellipse cx={40 + rx * 0.45} cy={cy + 3} rx="4" ry="1.1" fill={P.water} {...detail} /> : null}
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
      <ellipse cx="0" cy="-.2" rx="5" ry="1.2" fill={P.outline} opacity=".15" />
      <path d="M0 0V-6M0 -3l-4 -3M0 -4l4 -4" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M0 0V-6M0 -3l-4 -3M0 -4l4 -4" stroke={P.bark} strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="0" cy="-7" rx="7" ry="5" fill={z === 'winter' ? P.leafMoss : P.leafDark} {...line} />
      <ellipse cx="-2" cy="-8" rx="4" ry="3" fill={P.leafMoss} />
      <path d="M-4.4 -9.6q2 -1.6 4.4 -1.4" stroke={P.white} strokeWidth={D} opacity=".35" fill="none" strokeLinecap="round" />
      {[[-5, -7], [4, -9], [0, -11], [6, -6]].map(([px, py], i) => (
        <path key={i} d={`M${px} ${py}l.8 -.8`} stroke={P.woodLight} strokeWidth={H} strokeLinecap="round" />
      ))}
      {pts.slice(0, n).map(([px, py], i) =>
        z === 'spring' ? (
          <circle key={i} cx={px} cy={py} r=".8" fill={P.white} stroke={P.outline} strokeWidth={H * 0.5} />
        ) : z === 'winter' && i % 2 ? null : (
          <g key={i}>
            <path d={`M${px} ${py}v2.6`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
            <path d={`M${px} ${py}v2.6`} stroke={z === 'autumn' ? fruit[i]! : z === 'winter' ? P.plum : P.leafLight} strokeWidth="1.2" strokeLinecap="round" />
          </g>
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
      <ellipse cx="0" cy="-.2" rx="5" ry="1.2" fill={P.outline} opacity=".15" />
      <path d="M0 0V-6" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M0 0V-6" stroke={P.bark} strokeWidth="1.3" strokeLinecap="round" />
      <ellipse cx="0" cy="-10" rx="7" ry="6" fill={z === 'spring' ? P.leaf : P.leafDark} {...line} />
      <ellipse cx="-2" cy="-12" rx="4" ry="3" fill={z === 'spring' ? P.leafPale : P.leaf} />
      <path d="M-4.6 -13.4q2 -2 4.6 -1.8" stroke={P.white} strokeWidth={D} opacity=".35" fill="none" strokeLinecap="round" />
      {z === 'summer'
        ? [[-4, -11], [3, -13], [0, -8], [5, -9], [-2, -14]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r="1" fill={P.cream} stroke={P.outline} strokeWidth={H * 0.6} />)
        : z === 'spring'
          ? [[-4, -11], [3, -13], [0, -8]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r=".6" fill={P.cream} stroke={P.outline} strokeWidth={H * 0.4} />)
          : null}
    </g>
  )
}

/** Salzbusch: rundlich, silbergrau. */
function Saltbush({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="-3" rx="6" ry="3.6" fill={P.winterLeaf} {...line} />
      <ellipse cx="-1.6" cy="-4" rx="3.4" ry="2.2" fill={P.winterLeafLight} />
      <ellipse cx="2.4" cy="-4.4" rx="2" ry="1.4" fill={z === 'winter' ? P.stoneLight : P.frost} />
      {z === 'autumn' ? [-3, 0, 3].map((d) => <circle key={d} cx={d} cy={-6} r=".6" fill={P.terracottaLight} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
    </g>
  )
}

/** Wellblechtank (Mitte unten). */
function Tank({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-6" y="-12" width="12" height="12" fill={P.stoneLight} {...line} />
      {[-4, -2, 0, 2, 4].map((d) => (
        <path key={d} d={`M${d} -11v10`} stroke={P.stone} strokeWidth=".7" />
      ))}
      <rect x="-6" y="-11.4" width="12" height="1.6" fill={P.outline} opacity=".15" />
      <path d="M-4.8 -10v8" stroke={P.white} strokeWidth=".8" opacity=".45" strokeLinecap="round" />
      <ellipse cx="0" cy="-12" rx="6" ry="1.4" fill={P.stone} {...detail} />
      <path d="M-6 -1.2h12" stroke={P.metal} strokeWidth=".7" />
      <path d="M5 -3h2v2" stroke={P.outline} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 -3h2v2" stroke={P.metal} strokeWidth=".8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Old key={i}><Wattle x={[40, 20, 60, 30, 52][i]!} y={[58, 63, 63, 70, 70][i]!} s={[1.8, 1.4, 1.4, 1.15, 1.15][i]!} season={season} n={8} /></Old>
          ))}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.leafDark} s={0.6} hat={P.woodDark} /> : null}
        </Svg>
      )
    }
    case 'fingerlimetten': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
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
        <Svg tier={tier} bold>
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
        <Svg tier={tier} bold>
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
        <Svg tier={tier} bold>
          <Floor season={season} />
          <ellipse cx="40" cy="60" rx={summer ? 15 : 20} ry={summer ? 5 : 6.4} fill={P.water} {...line} />
          <path d="M30 59q5 -1 10 0" stroke={P.waterLight} strokeWidth={D} fill="none" strokeLinecap="round" />
          <path d="M44 62q3 .6 6 0" stroke={P.white} strokeWidth={D} opacity=".4" fill="none" strokeLinecap="round" />
          <ellipse cx="18" cy="56" rx="5" ry="3" fill={P.terracottaLight} {...detail} />
          <path d="M15.4 55q2 -1.4 4.4 -1" stroke={P.white} strokeWidth={H} opacity=".4" fill="none" strokeLinecap="round" />
          {tier >= 2 ? <ellipse cx="62" cy="54" rx="4" ry="2.4" fill={P.terracottaLight} {...detail} /> : null}
          {tier >= 3 ? <Old><Kangaroo x={60} y={68} s={1.7} graze /></Old> : null}
          {tier >= 4 ? <Old><Kangaroo x={24} y={69} s={1.5} flip /></Old> : null}
          {tier >= 5 ? <Old><Eucalyptus x={70} y={58} s={0.9} season={season} /></Old> : null}
          {Array.from({ length: tier }, (_, i) => (
            <g key={i}>
              <path d={`M${30 + i * 5} 54l-1 -3M${30 + i * 5} 54v-3.4`} stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
              <path d={`M${30 + i * 5} 54l-1 -3M${30 + i * 5} 54v-3.4`} stroke={P.leafDark} strokeWidth=".9" strokeLinecap="round" />
            </g>
          ))}
        </Svg>
      )
    case 'eukalyptus': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Old key={i}><Eucalyptus x={[40, 20, 60, 30, 52][i]!} y={[58, 62, 62, 70, 70][i]!} s={[1.6, 1.25, 1.25, 1.05, 1.05][i]!} season={season} /></Old>
          ))}
          {tier >= 3 ? <path d="M14 66q3 -1 6 0M58 70q3 -1 6 0" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" fill="none" /> : null}
          {tier >= 3 ? <path d="M14 66q3 -1 6 0M58 70q3 -1 6 0" stroke={P.woodLight} strokeWidth="1" strokeLinecap="round" fill="none" /> : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.leafDark} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'mahlstein': {
      const piles = tier
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <ellipse cx="38" cy="60" rx="13" ry="4.4" fill={P.stone} {...line} />
          <ellipse cx="38" cy="59.2" rx="10" ry="3" fill={P.stoneLight} />
          <path d="M29 58.4q4 -1.6 9 -1.8" stroke={P.white} strokeWidth={D} opacity=".45" fill="none" strokeLinecap="round" />
          <ellipse cx="40" cy="57.6" rx="4" ry="2.4" fill={P.stoneDark} {...detail} />
          <ellipse cx="32" cy="59.6" rx="3" ry=".8" fill={P.woodLight} />
          {Array.from({ length: piles }, (_, i) => (
            <g key={i}>
              <ellipse cx={14 + i * 12} cy={67.6} rx="4.4" ry="1.6" fill={P.woodMid} {...detail} />
              <ellipse cx={14 + i * 12} cy={67} rx="3" ry=".9" fill={i % 2 ? P.woodDark : P.woodLight} />
            </g>
          ))}
          {tier >= 3 ? <Old><Wattle x={66} y={56} s={1.1} season={season} n={6} /></Old> : null}
          {tier >= 4 ? <Farmer x={54} y={64} c={P.berry} s={0.6} hat={P.woodDark} skirt={P.leafDark} /> : null}
        </Svg>
      )
    }
    case 'saatguthuette': {
      const jars = 2 + tier
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <rect x="16" y="40" width="34" height="20" fill={P.woodLight} {...line} />
          <rect x="16" y="41" width="34" height="2.2" fill={P.outline} opacity=".15" />
          <path d="M12 41h42l-4 -8H16z" fill={P.stoneLight} {...line} />
          {[18, 24, 30, 36, 42, 48].map((x) => (
            <path key={x} d={`M${x} 34v7`} stroke={P.stone} strokeWidth=".8" />
          ))}
          <path d="M17 34.4h32" stroke={P.white} strokeWidth={D} opacity=".45" strokeLinecap="round" />
          <rect x="20" y="46" width="8" height="14" fill={P.woodDark} {...detail} />
          <path d="M32 46h16M32 52h16" stroke={P.woodDark} strokeWidth="1" strokeLinecap="round" />
          {Array.from({ length: jars }, (_, i) => (
            <rect key={i} x={33 + (i % 5) * 3} y={i < 5 ? 43 : 49} width="2.2" height="3" rx=".4" fill={P.glass} stroke={P.outline} strokeWidth={H * 0.6} />
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
        <Svg tier={tier} bold>
          <Floor season={season} />
          <rect x="8" y="38" width="22" height="20" fill={P.cream} {...line} />
          <rect x="8" y="39" width="22" height="2.2" fill={P.outline} opacity=".15" />
          <path d="M5 39h28l-4 -7H9z" fill={P.stone} {...line} />
          <path d="M10 33.4h18" stroke={P.white} strokeWidth={D} opacity=".45" strokeLinecap="round" />
          <path d="M5 39h30v2" stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M5 39h30v2" stroke={P.metal} strokeWidth=".9" fill="none" strokeLinecap="round" />
          <rect x="16" y="46" width="6" height="12" fill={P.leafDark} {...detail} />
          {Array.from({ length: tanks }, (_, i) => (
            <Tank key={i} x={[42, 58, 70][i]!} y={[60, 62, 66][i]!} s={[1.4, 1.2, 1][i]!} />
          ))}
          {tier >= 4 ? <path d="M35 41h4v10" stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {tier >= 4 ? <path d="M35 41h4v10" stroke={P.metal} strokeWidth=".9" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
          {tier >= 5 ? <Farmer x={30} y={70} c={P.blue} s={0.6} hat={P.woodLight} /> : null}
          {winter ? [44, 52, 60].map((x) => <path key={x} d={`M${x} 20l-1 4`} stroke={P.waterLight} strokeWidth=".9" strokeLinecap="round" />) : null}
        </Svg>
      )
    }
    case 'feuerabend':
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <ellipse cx="40" cy="62" rx="7" ry="2.4" fill={P.charcoal} {...detail} />
          <Old><Fire x={40} y={62} s={0.8} /></Old>
          <Old><Stars n={2 + tier * 2} y0={4} y1={26} /></Old>
          {tier >= 2 ? <ellipse cx="46" cy="64" rx="2.4" ry="1" fill={P.woodLight} {...detail} /> : null}
          {tier >= 3 ? <Farmer x={24} y={66} c={P.leafDark} s={0.7} hat={P.woodDark} /> : null}
          {tier >= 4 ? <Farmer x={58} y={66} c={P.berry} s={0.7} hat={P.woodDark} skirt={P.blue} /> : null}
          {tier >= 5 ? <Farmer x={40} y={72} c={P.gold} s={0.7} hat={P.woodDark} /> : null}
          {tier >= 5 ? <path d="M12 60h10M60 72h10" stroke={P.outline} strokeWidth="2.8" strokeLinecap="round" /> : null}
          {tier >= 5 ? <path d="M12 60h10M60 72h10" stroke={P.woodMid} strokeWidth="1.4" strokeLinecap="round" /> : null}
        </Svg>
      )
  }
  return null
}
