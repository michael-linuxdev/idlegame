/**
 * Kapitel-Grafik Kapitel 39: Kimchi-Garten in Korea (Provinz Jeolla).
 * Jahreszeiten: Frühling = Forsythien gelb, Setzlinge; Sommer = Monsun,
 * sattgrün, Sesam blüht; Herbst = rote Chilis, Kakis, Chuseok und Kimjang;
 * Winter = Schnee auf den Onggi, Rauch der Ondol-Heizung.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { P } from '../palette'
import type { AreaProps } from './partsB'
import { Farmer, Patch, Rain } from './partsF'
import { Hanok, Magpie, NapaCabbage, Onggi, Persimmon } from './partsG'
import { ssn } from './season'

/** Feldboden: Frühling Erde, Sommer grün, Herbst Stroh, Winter Schnee. */
function Floor({ season, cy = 60, rx = 36, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const fill = z === 'spring' ? P.soil : z === 'summer' ? P.leafMoss : z === 'autumn' ? P.woodMid : P.cream
  return (
    <g>
      <Patch fill={fill} cy={cy} rx={rx} ry={ry} edge={z === 'winter' ? P.frost : undefined} />
      {z === 'winter' ? [-0.5, 0, 0.45].map((d) => <ellipse key={d} cx={40 + rx * d} cy={cy + 2} rx="3" ry=".7" fill={P.white} />) : null}
      {z === 'spring' ? [-0.6, 0.55].map((d) => <ForsythiaTuft key={d} x={40 + rx * d} y={cy - 2} />) : null}
    </g>
  )
}

/** Forsythie (Gaenari) im Frühling: gelbe Ruten. */
function ForsythiaTuft({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[-3, 0, 3].map((d) => (
        <path key={d} d={`M${x} ${y}q${d} -3 ${d * 1.4} -6`} stroke={P.yellow} strokeWidth="1" fill="none" strokeDasharray=".8 .4" strokeLinecap="round" />
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
      <ellipse cx="0" cy="-1" rx={big ? 1.8 : 1.1} ry={big ? 2 : 1.2} fill={P.white} stroke={P.stone} strokeWidth=".2" />
      <ellipse cx="0" cy="-2.6" rx={big ? 1.6 : 1} ry=".6" fill={P.leafPale} />
      {z === 'winter' ? (
        <path d="M-1 -3l-1 -2M1 -3l1 -2" stroke={P.woodLight} strokeWidth=".5" />
      ) : (
        <path d={`M0 -3q-3 -2 -3.4 -5M0 -3q3 -2 3.4 -5M0 -3v-${z === 'spring' ? 3 : 5}`} stroke={z === 'spring' ? P.leafLight : P.leafDark} strokeWidth="1" fill="none" strokeLinecap="round" />
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
        <path d="M-1.6 0l1.6 -10l1.6 10M0 0v-10" stroke={P.woodLight} strokeWidth=".7" fill="none" />
        <path d="M-1 -4h2" stroke={P.woodDark} strokeWidth=".6" />
      </g>
    )
  }
  const h = z === 'spring' ? 5 : 12
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M0 0V-${h}`} stroke={z === 'autumn' ? P.woodLight : P.leafDark} strokeWidth=".7" />
      {[-0.3, -0.55, -0.8].map((k, i) => (
        <ellipse key={k} cx={i % 2 ? 1.4 : -1.4} cy={h * k} rx="1.4" ry=".7" fill={z === 'autumn' ? P.gold : P.leaf} />
      ))}
      {z === 'summer' ? [-6, -9, -11].map((dy, i) => <path key={dy} d={`M${i % 2 ? 0.4 : -0.4} ${dy}l${i % 2 ? 1 : -1} 1.2`} stroke={P.white} strokeWidth="1" strokeLinecap="round" />) : null}
      {z === 'autumn' ? [-6, -8, -10].map((dy) => <rect key={dy} x="-.5" y={dy} width="1" height="1.6" fill={P.woodMid} />) : null}
    </g>
  )
}

/** Perilla: gezackte grün-violette Blätter, im Herbst weiße Ähren. */
function Perilla({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  if (z === 'winter') return <path d={`M${x - 2 * s} ${y}l${2 * s} ${-4 * s}l${2 * s} ${4 * s}`} stroke={P.woodMid} strokeWidth=".5" fill="none" />
  const k = z === 'spring' ? 0.6 : 1
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <path d="M0 0V-7" stroke={P.leafDark} strokeWidth=".6" />
      {[[-2, -2], [2, -3], [-2, -5], [2, -6]].map(([dx, dy], i) => (
        <path key={i} d={`M0 ${dy}q${dx! * 1.6} -1.4 ${dx! * 1.4} 1.4z`} fill={i % 2 ? P.leaf : P.leafMoss} stroke={P.plum} strokeWidth=".2" />
      ))}
      {z === 'autumn' ? <path d="M0 -7v-3" stroke={P.white} strokeWidth=".8" strokeDasharray=".4 .3" /> : null}
    </g>
  )
}

/** Steinpodest für Krüge (Jangdokdae). */
function Platform({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="3" fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".3" />
      <path d={`M${x} ${y + 3}h${w}`} stroke={P.stoneDark} strokeWidth=".6" />
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
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => {
            const row = Math.floor(i / 4)
            return <NapaCabbage key={i} x={18 + (i % 4) * 14 + (row % 2) * 4} y={52 + row * 5} s={1.5} season={season} />
          })}
          {summer ? <Rain n={5} y0={2} /> : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'rettichbeet': {
      const n = 4 + tier * 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => {
            const row = Math.floor(i / 5)
            return <Radish key={i} x={16 + (i % 5) * 11 + (row % 2) * 4} y={56 + row * 5} s={1.3} season={season} />
          })}
          {summer ? <Rain n={5} y0={2} /> : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.blue} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'chilimatten': {
      const mats = Math.min(4, tier)
      const chili = z === 'spring' ? P.leafPale : summer ? P.leaf : autumn ? P.berry : P.autumnDark
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: mats }, (_, i) => {
            const x = 10 + (i % 2) * 32
            const y = 50 + Math.floor(i / 2) * 12
            return (
              <g key={i}>
                <rect x={x} y={y} width="28" height="9" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
                <path d={`M${x} ${y + 3}h28M${x} ${y + 6}h28`} stroke={P.wood} strokeWidth=".3" />
                {Array.from({ length: 12 }, (_, k) => (
                  <path key={k} d={`M${x + 2 + (k % 6) * 4.4} ${y + 2.4 + Math.floor(k / 6) * 4}l2 .8`} stroke={chili} strokeWidth="1.2" strokeLinecap="round" />
                ))}
                {winter ? <path d={`M${x + 1} ${y + 0.6}h26`} stroke={P.white} strokeWidth="1.2" strokeLinecap="round" /> : null}
              </g>
            )
          })}
          {summer ? <Rain n={5} y0={2} /> : null}
          {tier >= 5 ? <Farmer x={72} y={74} c={P.white} s={0.6} hat={P.woodLight} skirt={P.blue} /> : null}
        </Svg>
      )
    }
    case 'onggi': {
      const jars = 2 + tier * 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <Platform x={10} y={60} w={60} />
          {tier >= 3 ? <Platform x={16} y={52} w={48} /> : null}
          {Array.from({ length: jars }, (_, i) => {
            const back = tier >= 3 && i % 2 === 1
            const k = Math.floor(i / (tier >= 3 ? 2 : 1))
            return back ? (
              <Onggi key={i} x={22 + (k % 6) * 8} y={52} s={1.2} snow={winter} />
            ) : (
              <Onggi key={i} x={16 + (k % 7) * 8.4} y={60} s={1.5} snow={winter} />
            )
          })}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.pink} s={0.6} hat={P.charcoal} skirt={P.blue} /> : null}
        </Svg>
      )
    }
    case 'sesamfeld': {
      const n = 4 + tier * 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => {
            const row = Math.floor(i / 5)
            return <Sesame key={i} x={16 + (i % 5) * 12 + (row % 2) * 5} y={56 + row * 5} s={1.4} season={season} />
          })}
          {summer ? <Rain n={5} y0={2} /> : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'perillabeet': {
      const n = 4 + tier * 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => {
            const row = Math.floor(i / 5)
            return <Perilla key={i} x={16 + (i % 5) * 12 + (row % 2) * 5} y={56 + row * 5} s={1.6} season={season} />
          })}
          {summer ? <Rain n={5} y0={2} /> : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.leafDark} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'hanokhof':
      return (
        <Svg tier={tier}>
          <Patch fill={winter ? P.cream : P.woodLight} cy={60} rx={36} ry={10} />
          <Hanok x={38} y={56} w={36} h={14} lit={winter} snow={winter} />
          {winter ? <path className="smoke" d="M58 38c-1 -2 1 -3 0 -5c-1 -2 1 -3 0 -5" stroke={P.white} strokeWidth="1" fill="none" /> : null}
          {tier >= 2 ? <path d="M10 62h60" stroke={P.stone} strokeWidth="1.4" strokeDasharray="3 1" /> : null}
          {tier >= 3 ? <Onggi x={66} y={66} s={1.3} snow={winter} /> : null}
          {tier >= 3 ? <Onggi x={72} y={68} s={1.1} snow={winter} /> : null}
          {tier >= 4 ? <Persimmon x={12} y={64} s={1} season={season} n={4} /> : null}
          {tier >= 5 ? <Farmer x={40} y={70} c={P.pink} s={0.6} hat={P.charcoal} skirt={P.blue} /> : null}
          {summer ? <Rain n={5} y0={2} /> : null}
        </Svg>
      )
    case 'kimjang': {
      const halves = 2 + tier * 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <ellipse cx="40" cy="60" rx="20" ry="6" fill={P.blue} stroke={P.denim} strokeWidth=".4" />
          <ellipse cx="40" cy="59.4" rx="16" ry="4.4" fill={P.denim} />
          {Array.from({ length: halves }, (_, i) => (
            <g key={i}>
              <ellipse cx={28 + (i % 6) * 4.6} cy={58 + Math.floor(i / 6) * 2.6} rx="2" ry="1.1" fill={P.tomato} stroke={P.berry} strokeWidth=".2" />
              <ellipse cx={28.6 + (i % 6) * 4.6} cy={57.8 + Math.floor(i / 6) * 2.6} rx=".9" ry=".5" fill={P.yellow} />
            </g>
          ))}
          {tier >= 2 ? <Farmer x={18} y={64} c={HANBOK[0]!} s={0.7} hat={P.charcoal} skirt={P.white} /> : null}
          {tier >= 3 ? <Farmer x={62} y={64} c={HANBOK[1]!} s={0.7} hat={P.charcoal} skirt={P.white} /> : null}
          {tier >= 3 ? <Onggi x={70} y={72} s={1.2} snow={winter} /> : null}
          {tier >= 4 ? <Farmer x={40} y={72} c={HANBOK[2]!} s={0.7} hat={P.charcoal} /> : null}
          {tier >= 5 ? <Onggi x={10} y={72} s={1.2} snow={winter} /> : null}
          {tier >= 5 ? <NapaCabbage x={54} y={72} s={1.4} season="autumn" /> : null}
        </Svg>
      )
    }
    case 'kakibaum': {
      const n = Math.min(3, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Persimmon key={i} x={[40, 18, 62][i]!} y={[60, 66, 66][i]!} s={[1.9, 1.4, 1.4][i]!} season={season} n={7} />
          ))}
          {tier >= 3 ? <Magpie x={46} y={30} s={1.3} /> : null}
          {tier >= 4 ? <Magpie x={22} y={68} s={1.2} flip /> : null}
          {tier >= 5 ? <Farmer x={70} y={74} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'chuseok': {
      const cakes = 3 + tier * 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <circle cx="62" cy="14" r="8" fill={P.cream} stroke={P.lamp} strokeWidth=".6" />
          <circle cx="59" cy="12" r="1.4" fill={P.paper} />
          <ellipse cx="40" cy="62" rx="12" ry="3" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" />
          <ellipse cx="40" cy="61.4" rx="10" ry="2.2" fill={P.leafLight} />
          {Array.from({ length: cakes }, (_, i) => (
            <path key={i} d={`M${32 + (i % 8) * 2.2} ${61.6 - Math.floor(i / 8) * 1.2}a1.1 .8 0 0 1 2 0z`} fill={[P.white, P.pink, P.leafPale][i % 3]} stroke={P.stone} strokeWidth=".15" />
          ))}
          {tier >= 2 ? <Farmer x={22} y={66} c={HANBOK[0]!} s={0.75} hat={P.charcoal} skirt={P.berry} /> : null}
          {tier >= 3 ? <Farmer x={58} y={66} c={HANBOK[3]!} s={0.75} hat={P.charcoal} skirt={P.blue} /> : null}
          {tier >= 4 ? <Farmer x={40} y={72} c={HANBOK[2]!} s={0.75} hat={P.charcoal} skirt={P.pink} /> : null}
          {tier >= 5 ? [14, 26].map((x) => <circle key={x} cx={x} cy={40} r="1.6" fill={P.lamp} stroke={P.berry} strokeWidth=".3" />) : null}
        </Svg>
      )
    }
  }
  return null
}
