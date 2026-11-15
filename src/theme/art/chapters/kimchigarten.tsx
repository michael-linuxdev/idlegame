/**
 * Kapitel 39 — Kimchi-Garten (Jeolla) im kräftigen Stil (2026-11-14,
 * Weinberg-Niveau): Feldboden, Forsythien, Rettich, Sesam, Perilla, Krugpodest,
 * Chilimatten, Kimjang-Wanne und Chuseok-Tablett mit Kontur; Hanok, Onggi, Kakis,
 * Elstern und Kohl behalten ihre Zeichnung. Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Farmer } from './figures'
import type { AreaProps } from './partsB'
import { Rain } from './partsF'
import { Hanok, Magpie, NapaCabbage, Onggi, Persimmon } from './partsG'
import { ssn } from './season'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Feldboden: Frühling Erde, Sommer grün, Herbst Stroh, Winter Schnee. */
function Floor({ season, cy = 60, rx = 36, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const fill = z === 'spring' ? P.soil : z === 'summer' ? P.leafMoss : z === 'autumn' ? P.woodMid : P.cream
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={fill} {...line} />
      <path d={`M${40 - rx * 0.62} ${cy - ry * 0.5}q${rx * 0.3} -${ry * 0.36} ${rx * 0.62} -${ry * 0.42}`} stroke={P.white} strokeWidth={D} strokeLinecap="round" fill="none" opacity=".3" />
      {z === 'winter' ? <ellipse cx="40" cy={cy} rx={rx - 1.6} ry={ry - 1.1} fill="none" stroke={P.frost} strokeWidth=".7" /> : null}
      {z === 'winter' ? [-0.5, 0, 0.45].map((d) => <ellipse key={d} cx={40 + rx * d} cy={cy + 2} rx="3" ry=".7" fill={P.white} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
      {z === 'spring' ? [-0.6, 0.55].map((d) => <ForsythiaTuft key={d} x={40 + rx * d} y={cy - 2} />) : null}
    </g>
  )
}

/** Forsythie (Gaenari) im Frühling: gelbe Ruten. */
function ForsythiaTuft({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[-3, 0, 3].map((d) => (
        <g key={d}>
          <path d={`M${x} ${y}q${d} -3 ${d * 1.4} -6`} stroke={P.outline} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d={`M${x} ${y}q${d} -3 ${d * 1.4} -6`} stroke={P.yellow} strokeWidth="1.2" fill="none" strokeDasharray=".8 .4" strokeLinecap="round" />
        </g>
      ))}
    </g>
  )
}

/** Rettich: Blätter oben, weiße Rübe schaut aus der Erde. */
function Radish({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  const big = z === 'autumn' || z === 'winter'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="-1" rx={big ? 1.8 : 1.1} ry={big ? 2 : 1.2} fill={P.white} {...detail} />
      <path d={`M-.6 -.4v-${big ? 1.6 : 0.8}`} stroke={P.stone} strokeWidth={H} strokeLinecap="round" opacity=".6" />
      <ellipse cx="0" cy="-2.6" rx={big ? 1.6 : 1} ry=".6" fill={P.leafPale} stroke={P.outline} strokeWidth={H * 0.7} />
      {z === 'winter' ? (
        <g>
          <path d="M-1 -3l-1 -2M1 -3l1 -2" stroke={P.outline} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M-1 -3l-1 -2M1 -3l1 -2" stroke={P.woodLight} strokeWidth=".7" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <path d={`M0 -3q-3 -2 -3.4 -5M0 -3q3 -2 3.4 -5M0 -3v-${z === 'spring' ? 3 : 5}`} stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d={`M0 -3q-3 -2 -3.4 -5M0 -3q3 -2 3.4 -5M0 -3v-${z === 'spring' ? 3 : 5}`} stroke={z === 'spring' ? P.leafLight : P.leaf} strokeWidth="1.1" fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  )
}

/** Sesam: hohe Stängel; Sommer weiße Glockenblüten, Herbst Kapseln, Frühling klein, Winter Garben. */
function Sesame({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  if (z === 'winter') {
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-1.6 0l1.6 -10l1.6 10M0 0v-10" stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-1.6 0l1.6 -10l1.6 10M0 0v-10" stroke={P.woodLight} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-1.2 -4h2.4" stroke={P.woodDark} strokeWidth=".9" strokeLinecap="round" />
      </g>
    )
  }
  const h = z === 'spring' ? 5 : 12
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M0 0V-${h}`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
      <path d={`M0 0V-${h}`} stroke={z === 'autumn' ? P.woodLight : P.leafDark} strokeWidth="1" strokeLinecap="round" />
      {[-0.3, -0.55, -0.8].map((k, i) => (
        <ellipse key={k} cx={i % 2 ? 1.4 : -1.4} cy={h * k} rx="1.4" ry=".7" fill={z === 'autumn' ? P.gold : P.leaf} stroke={P.outline} strokeWidth={H * 0.7} />
      ))}
      {z === 'summer' ? <path d="M-.4 -6l-1 1.2M.4 -9l1 1.2M-.4 -11l-1 1.2" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" /> : null}
      {z === 'summer' ? [-6, -9, -11].map((dy, i) => <path key={dy} d={`M${i % 2 ? 0.4 : -0.4} ${dy}l${i % 2 ? 1 : -1} 1.2`} stroke={P.white} strokeWidth="1" strokeLinecap="round" />) : null}
      {z === 'autumn' ? [-6, -8, -10].map((dy) => <rect key={dy} x="-.5" y={dy} width="1" height="1.6" rx=".3" fill={P.woodMid} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
    </g>
  )
}

/** Perilla: gezackte grün-violette Blätter, im Herbst weiße Ähren. */
function Perilla({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  if (z === 'winter') {
    const d = `M${x - 2 * s} ${y}l${2 * s} ${-4 * s}l${2 * s} ${4 * s}`
    return (
      <g>
        <path d={d} stroke={P.outline} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke={P.woodMid} strokeWidth=".9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )
  }
  const k = z === 'spring' ? 0.6 : 1
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <path d="M0 0V-7" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M0 0V-7" stroke={P.leafDark} strokeWidth=".9" strokeLinecap="round" />
      {[[-2, -2], [2, -3], [-2, -5], [2, -6]].map(([dx, dy], i) => (
        <path key={i} d={`M0 ${dy}q${dx! * 1.6} -1.4 ${dx! * 1.4} 1.4z`} fill={i % 2 ? P.leaf : P.leafMoss} stroke={P.outline} strokeWidth={H * 0.8} strokeLinejoin="round" />
      ))}
      {z === 'autumn' ? <path d="M0 -7v-3" stroke={P.outline} strokeWidth="1.6" strokeLinecap="round" /> : null}
      {z === 'autumn' ? <path d="M0 -7v-3" stroke={P.white} strokeWidth=".9" strokeDasharray=".4 .3" /> : null}
    </g>
  )
}

/** Steinpodest für Krüge (Jangdokdae). */
function Platform({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <rect x={x + 1} y={y + 3} width={w - 2} height="1.4" fill={P.outline} opacity=".18" />
      <rect x={x} y={y} width={w} height="3" rx=".6" fill={P.stoneLight} {...line} />
      <path d={`M${x + w / 3} ${y + 0.4}v2.2M${x + (2 * w) / 3} ${y + 0.4}v2.2`} stroke={P.outline} strokeWidth={H} opacity=".5" />
      <path d={`M${x + 1.4} ${y + 0.9}h${w - 2.8}`} stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".45" />
    </g>
  )
}

/** Hanbok-Farben für Personen. */
const HANBOK = [P.pink, P.blue, P.yellow, P.leaf, P.berry]

export function Kimchigarten({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  const autumn = z === 'autumn'
  switch (id) {
    case 'kohlreihen': {
      const n = 4 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => {
            const row = Math.floor(i / 4)
            return <Old key={i}><NapaCabbage x={18 + (i % 4) * 14 + (row % 2) * 4} y={52 + row * 5} s={1.5} season={season} /></Old>
          })}
          {summer ? <Old><Rain n={5} y0={2} /></Old> : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'rettichbeet': {
      const n = 4 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => {
            const row = Math.floor(i / 5)
            return <Radish key={i} x={16 + (i % 5) * 11 + (row % 2) * 4} y={56 + row * 5} s={1.3} season={season} />
          })}
          {summer ? <Old><Rain n={5} y0={2} /></Old> : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.blue} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'chilimatten': {
      const mats = Math.min(4, tier)
      const chili = z === 'spring' ? P.leafPale : summer ? P.leaf : autumn ? P.berry : P.autumnDark
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: mats }, (_, i) => {
            const x = 10 + (i % 2) * 32
            const y = 50 + Math.floor(i / 2) * 12
            return (
              <g key={i}>
                <rect x={x + 1} y={y + 9} width="26" height="1.4" fill={P.outline} opacity=".16" />
                <rect x={x} y={y} width="28" height="9" rx=".8" fill={P.woodLight} {...line} />
                <path d={`M${x + 0.6} ${y + 3}h26.8M${x + 0.6} ${y + 6}h26.8`} stroke={P.outline} strokeWidth={H} opacity=".45" />
                <path d={Array.from({ length: 12 }, (_, k) => `M${x + 2 + (k % 6) * 4.4} ${y + 2.4 + Math.floor(k / 6) * 4}l2 .8`).join('')} stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
                {Array.from({ length: 12 }, (_, k) => (
                  <path key={k} d={`M${x + 2 + (k % 6) * 4.4} ${y + 2.4 + Math.floor(k / 6) * 4}l2 .8`} stroke={chili} strokeWidth="1.2" strokeLinecap="round" />
                ))}
                {winter ? <path d={`M${x + 1} ${y + 0.6}h26`} stroke={P.white} strokeWidth="1.2" strokeLinecap="round" /> : null}
              </g>
            )
          })}
          {summer ? <Old><Rain n={5} y0={2} /></Old> : null}
          {tier >= 5 ? <Farmer x={72} y={74} c={P.white} s={0.6} hat={P.woodLight} skirt={P.blue} /> : null}
        </Svg>
      )
    }
    case 'onggi': {
      const jars = 2 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <Platform x={10} y={60} w={60} />
          {tier >= 3 ? <Platform x={16} y={52} w={48} /> : null}
          {Array.from({ length: jars }, (_, i) => {
            const back = tier >= 3 && i % 2 === 1
            const k = Math.floor(i / (tier >= 3 ? 2 : 1))
            return back ? (
              <Old key={i}><Onggi x={22 + (k % 6) * 8} y={52} s={1.2} snow={winter} /></Old>
            ) : (
              <Old key={i}><Onggi x={16 + (k % 7) * 8.4} y={60} s={1.5} snow={winter} /></Old>
            )
          })}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.pink} s={0.6} hat={P.charcoal} skirt={P.blue} /> : null}
        </Svg>
      )
    }
    case 'sesamfeld': {
      const n = 4 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => {
            const row = Math.floor(i / 5)
            return <Sesame key={i} x={16 + (i % 5) * 12 + (row % 2) * 5} y={56 + row * 5} s={1.4} season={season} />
          })}
          {summer ? <Old><Rain n={5} y0={2} /></Old> : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'perillabeet': {
      const n = 4 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => {
            const row = Math.floor(i / 5)
            return <Perilla key={i} x={16 + (i % 5) * 12 + (row % 2) * 5} y={56 + row * 5} s={1.6} season={season} />
          })}
          {summer ? <Old><Rain n={5} y0={2} /></Old> : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.leafDark} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'hanokhof':
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="60" rx="36" ry="10" fill={winter ? P.cream : P.woodLight} {...line} />
          <path d="M14 55.4q10 -4.4 24 -5" stroke={P.white} strokeWidth={D} strokeLinecap="round" fill="none" opacity=".3" />
          <Old><Hanok x={38} y={56} w={36} h={14} lit={winter} snow={winter} /></Old>
          {winter ? <path className="smoke" d="M58 38c-1 -2 1 -3 0 -5c-1 -2 1 -3 0 -5" stroke={P.white} strokeWidth="1" fill="none" /> : null}
          {tier >= 2 ? <path d="M10 62h60" stroke={P.outline} strokeWidth="2.6" strokeDasharray="3 1" /> : null}
          {tier >= 2 ? <path d="M10 62h60" stroke={P.stone} strokeWidth="1.4" strokeDasharray="3 1" /> : null}
          {tier >= 3 ? <Old><Onggi x={66} y={66} s={1.3} snow={winter} /></Old> : null}
          {tier >= 3 ? <Old><Onggi x={72} y={68} s={1.1} snow={winter} /></Old> : null}
          {tier >= 4 ? <Old><Persimmon x={12} y={64} s={1} season={season} n={4} /></Old> : null}
          {tier >= 5 ? <Farmer x={40} y={70} c={P.pink} s={0.6} hat={P.charcoal} skirt={P.blue} /> : null}
          {summer ? <Old><Rain n={5} y0={2} /></Old> : null}
        </Svg>
      )
    case 'kimjang': {
      const halves = 2 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <ellipse cx="40" cy="61" rx="20" ry="5.4" fill={P.outline} opacity=".15" />
          <ellipse cx="40" cy="60" rx="20" ry="6" fill={P.blue} {...line} />
          <path d="M23 61.6q4 3.4 10 4" stroke={P.white} strokeWidth={D} strokeLinecap="round" fill="none" opacity=".35" />
          <ellipse cx="40" cy="59.4" rx="16" ry="4.4" fill={P.denim} stroke={P.outline} strokeWidth={H} />
          {Array.from({ length: halves }, (_, i) => (
            <g key={i}>
              <ellipse cx={28 + (i % 6) * 4.6} cy={58 + Math.floor(i / 6) * 2.6} rx="2" ry="1.1" fill={P.tomato} stroke={P.outline} strokeWidth={H * 0.7} />
              <ellipse cx={28.6 + (i % 6) * 4.6} cy={57.8 + Math.floor(i / 6) * 2.6} rx=".9" ry=".5" fill={P.yellow} />
            </g>
          ))}
          {tier >= 2 ? <Farmer x={18} y={64} c={HANBOK[0]!} s={0.7} hat={P.charcoal} skirt={P.white} /> : null}
          {tier >= 3 ? <Farmer x={62} y={64} c={HANBOK[1]!} s={0.7} hat={P.charcoal} skirt={P.white} /> : null}
          {tier >= 3 ? <Old><Onggi x={70} y={72} s={1.2} snow={winter} /></Old> : null}
          {tier >= 4 ? <Farmer x={40} y={72} c={HANBOK[2]!} s={0.7} hat={P.charcoal} /> : null}
          {tier >= 5 ? <Old><Onggi x={10} y={72} s={1.2} snow={winter} /></Old> : null}
          {tier >= 5 ? <Old><NapaCabbage x={54} y={72} s={1.4} season="autumn" /></Old> : null}
        </Svg>
      )
    }
    case 'kakibaum': {
      const n = Math.min(3, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Old key={i}><Persimmon x={[40, 18, 62][i]!} y={[60, 66, 66][i]!} s={[1.9, 1.4, 1.4][i]!} season={season} n={7} /></Old>
          ))}
          {tier >= 3 ? <Old><Magpie x={46} y={30} s={1.3} /></Old> : null}
          {tier >= 4 ? <Old><Magpie x={22} y={68} s={1.2} flip /></Old> : null}
          {tier >= 5 ? <Farmer x={70} y={74} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'chuseok': {
      const cakes = 3 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <circle cx="62" cy="14" r="10" fill={P.lamp} opacity=".2" />
          <circle cx="62" cy="14" r="8" fill={P.cream} stroke={P.outline} strokeWidth={D} />
          <path d="M66 19q3 -2 3.4 -5.4" stroke={P.outline} strokeWidth={D} strokeLinecap="round" fill="none" opacity=".15" />
          <circle cx="59" cy="12" r="1.4" fill={P.paper} />
          <g transform="translate(40 62) scale(1.7) translate(-40 -62)">
            <ellipse cx="40" cy="62.6" rx="11.4" ry="2.8" fill={P.outline} opacity=".15" />
            <ellipse cx="40" cy="62" rx="12" ry="3" fill={P.woodMid} stroke={P.outline} strokeWidth={D * 0.7} />
            <ellipse cx="40" cy="61.4" rx="10" ry="2.2" fill={P.leafLight} stroke={P.outline} strokeWidth={H * 0.5} />
            {Array.from({ length: cakes }, (_, i) => (
              <path key={i} d={`M${32 + (i % 8) * 2.2} ${61.6 - Math.floor(i / 8) * 1.2}a1.1 .8 0 0 1 2 0z`} fill={[P.white, P.pink, P.leafPale][i % 3]} stroke={P.outline} strokeWidth={H * 0.4} />
            ))}
          </g>
          {tier >= 2 ? <Farmer x={22} y={66} c={HANBOK[0]!} s={0.75} hat={P.charcoal} skirt={P.berry} /> : null}
          {tier >= 3 ? <Farmer x={58} y={66} c={HANBOK[3]!} s={0.75} hat={P.charcoal} skirt={P.blue} /> : null}
          {tier >= 4 ? <Farmer x={40} y={72} c={HANBOK[2]!} s={0.75} hat={P.charcoal} skirt={P.pink} /> : null}
          {tier >= 5 ? <path d="M8 34q12 4 24 0M14 35.4v3M26 35.4v3" stroke={P.outline} strokeWidth=".7" fill="none" strokeLinecap="round" /> : null}
          {tier >= 5 ? [14, 26].map((x) => <circle key={x} cx={x} cy={40} r="1.6" fill={P.lamp} stroke={P.outline} strokeWidth={H * 0.8} />) : null}
        </Svg>
      )
    }
  }
  return null
}
