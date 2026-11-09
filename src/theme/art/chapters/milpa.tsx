/**
 * Kapitel-Grafik Kapitel 31: Milpa in Mexiko (Michoacán).
 * Jahreszeiten: Frühling = Trockenzeit und Aussaat (gepflügte Erde, Keimlinge),
 * Sommer = Regenzeit (sattgrün, Mais mit Fahnen, Kürbisblüten), Herbst = Ernte
 * (goldene Kolben, orange Kürbisse, Monarchfalter), Winter = trocken (geknickte,
 * braune Stängel, Vorräte).
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { P } from '../palette'
import type { AreaProps } from './partsB'
import { Fire } from './partsD'
import { CornPlant, Farmer, Monarch, Patch, Squash } from './partsF'
import { ssn } from './season'

const KERNELS = [P.blue, P.berry, P.yellow, P.cream, P.plum, P.orange]
/** Marktware je Jahreszeit: Frühling Kräuter und Bohnen, Sommer Kürbisblüten und grüne Chilis, Herbst Kürbisse und Kolben, Winter getrocknete Chilis und Bohnen. */
const MARKET = {
  spring: [P.leafPale, P.leaf, P.plum, P.cream],
  summer: [P.yellow, P.leaf, P.tomato, P.leafDark],
  autumn: [P.orange, P.yellow, P.blue, P.gold],
  winter: [P.berry, P.woodDark, P.plum, P.cream],
} as const

/** Ackerboden: Frühling gepflügt, Sommer grün, Herbst trockenes Gold, Winter staubig hell. */
function Field({ season, cy = 60, rx = 36, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const fill = z === 'spring' ? P.soil : z === 'summer' ? P.leafDark : z === 'autumn' ? P.woodLight : P.paper
  return (
    <g>
      <Patch fill={fill} cy={cy} rx={rx} ry={ry} />
      {z === 'spring' ? <path d={`M${40 - rx * 0.7} ${cy - 2}h${rx * 1.4}M${40 - rx * 0.8} ${cy + 2}h${rx * 1.6}`} stroke={P.soilDark} strokeWidth=".5" /> : null}
    </g>
  )
}

/** Chilipflanze: Frühling klein mit Blüte, Sommer grüne Schoten, Herbst rote, Winter trocken. */
function Chili({ x, y, s = 1, season, pods = 3 }: { x: number; y: number; s?: number; season?: string; pods?: number }) {
  const z = ssn(season)
  if (z === 'winter') return <path d={`M${x} ${y}v-4l-2 -2M${x} ${y - 3}l2 -2`} stroke={P.woodMid} strokeWidth=".6" fill="none" />
  const pod = z === 'autumn' ? P.tomato : z === 'summer' ? P.berry : P.leafPale
  const leaf = z === 'spring' ? P.leaf : P.leafDark
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-4M0 -2l-2.4 -2.4M0 -2.6l2.4 -2.2" stroke={P.leafMoss} strokeWidth=".6" />
      <ellipse cx="-2.6" cy="-5.6" rx="2.2" ry="1.5" fill={leaf} />
      <ellipse cx="2.6" cy="-5.8" rx="2.2" ry="1.5" fill={leaf} />
      <ellipse cx="0" cy="-7.4" rx="2.4" ry="1.7" fill={P.leaf} />
      {z === 'spring' ? <circle cx="1" cy="-8.4" r=".8" fill={P.white} /> : null}
      {Array.from({ length: pods }, (_, i) => (
        <path key={i} d={`M${-2.6 + i * 2.4} -6.4q1.4 .4 .6 4.6q-.5 .5 -1 0q-.6 -3.2 .4 -4.6z`} fill={i % 2 && z === 'autumn' ? P.orange : pod} stroke={P.outline} strokeWidth=".2" />
      ))}
    </g>
  )
}

/** Amaranth: aufrechte Rispe (Frühling grün klein, Sommer magenta, Herbst dunkelrot, Winter Stoppel). */
function Amaranth({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  if (z === 'winter') return <path d={`M${x} ${y}v-4M${x + 1.2} ${y}v-3`} stroke={P.woodMid} strokeWidth=".7" />
  const k = z === 'spring' ? 0.5 : 1
  const plume = z === 'summer' ? P.berry : z === 'autumn' ? P.plum : P.leafPale
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <path d="M0 0V-14" stroke={P.leafDark} strokeWidth=".8" />
      <ellipse cx="-2.6" cy="-6" rx="2.4" ry="1.2" fill={P.leaf} transform="rotate(-20 -2.6 -6)" />
      <ellipse cx="2.6" cy="-9" rx="2.4" ry="1.2" fill={P.leaf} transform="rotate(20 2.6 -9)" />
      <path d="M0 -12Q-3 -17 -.6 -24Q.6 -22 1 -24Q3 -17 0 -12z" fill={plume} stroke={P.outline} strokeWidth=".2" />
      <path d="M0 -15Q-3 -16 -4 -19" stroke={plume} strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </g>
  )
}

/** Agave: blaugrüne Rosette mit spitzen Blättern. */
function Agave({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-60, -35, -12, 12, 35, 60, -80, 80].map((a, i) => (
        <path key={i} d="M-1.2 0Q0 -9 0 -11Q0 -9 1.2 0z" fill={i % 2 ? P.winterLeafDark : P.winterLeaf} stroke={P.leafMoss} strokeWidth=".35" transform={`rotate(${a})`} />
      ))}
    </g>
  )
}

/** Kolben am Bündel (Farbe des Korns). */
function Cob({ x, y, c, r = 0 }: { x: number; y: number; c: string; r?: number }) {
  return (
    <g transform={`rotate(${r} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx="1.2" ry="2.6" fill={c} stroke={P.outline} strokeWidth=".2" />
      <path d={`M${x} ${y - 2.6}l-1.4 -1.6M${x} ${y - 2.6}l1.4 -1.6`} stroke={P.woodLight} strokeWidth=".5" />
    </g>
  )
}

/** Tonkrug (Fußpunkt Mitte unten), oben Saatgut in Farbe. */
function Jar({ x, y, s = 1, seed }: { x: number; y: number; s?: number; seed: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-3 0Q-5 -4 -3 -7.6H3Q5 -4 3 0z" fill={P.terracotta} stroke={P.autumnDark} strokeWidth=".35" />
      <rect x="-2.4" y="-9" width="4.8" height="1.6" fill={P.terracottaLight} stroke={P.autumnDark} strokeWidth=".3" />
      <ellipse cx="0" cy="-9" rx="2.2" ry=".7" fill={seed} />
      <path d="M-3 -3.6h6" stroke={P.cream} strokeWidth=".35" />
    </g>
  )
}

/** Papel picado: bunte Papierfahnen an einer Schnur. */
function Picado({ x0, x1, y, n }: { x0: number; x1: number; y: number; n: number }) {
  return (
    <g>
      <path d={`M${x0} ${y}Q${(x0 + x1) / 2} ${y + 4} ${x1} ${y}`} stroke={P.outlineWood} strokeWidth=".3" fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n
        const x = x0 + (x1 - x0) * t
        const yy = y + 4 * 2 * t * (1 - t) * 2
        return <rect key={i} x={x - 1.6} y={yy} width="3.2" height="3.6" fill={[P.pink, P.orange, P.blue, P.yellow, P.leafLight, P.lilac][i % 6]} />
      })}
    </g>
  )
}

export function Milpa({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const autumn = z === 'autumn'
  const winter = z === 'winter'
  switch (id) {
    case 'milpafeld': {
      const n = 2 + tier
      return (
        <Svg tier={tier}>
          <Field season={season} />
          {Array.from({ length: n }, (_, i) => (
            <CornPlant key={i} x={12 + ((i * 41) % 58)} y={56 + (i % 2) * 6} s={1.25} season={season} beans />
          ))}
          {Array.from({ length: tier }, (_, i) => (
            <Squash key={`q${i}`} x={18 + ((i * 29) % 50)} y={67 - (i % 2) * 2} s={1.2} season={season} />
          ))}
          {autumn && tier >= 3 ? <Monarch x={60} y={30} s={1.2} /> : null}
          {tier >= 5 ? <Farmer x={72} y={70} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'chiligarten': {
      const n = 2 + tier
      return (
        <Svg tier={tier}>
          <Patch fill={winter ? P.paper : P.woodLight} cy={61} />
          <path d="M10 54h56M8 59h58M10 64h54" stroke={winter ? P.woodLight : P.soil} strokeWidth="3.4" strokeLinecap="round" />
          {Array.from({ length: n }, (_, i) => (
            <Chili key={i} x={14 + ((i * 23) % 50)} y={54 + (i % 3) * 5} s={1.25} season={season} pods={3} />
          ))}
          {tier >= 3 ? (
            <g>
              <path d="M70 40V68" stroke={P.woodDark} strokeWidth="1" />
              <path d="M66 42h8" stroke={P.woodDark} strokeWidth=".8" />
              {[0, 1, 2, 3, 4, 5].map((k) => (
                <path key={k} d={`M70 ${44 + k * 3.4}l-2 2.6M70 ${44 + k * 3.4}l2 2.6`} stroke={winter || autumn ? P.berry : P.tomato} strokeWidth="1.3" strokeLinecap="round" />
              ))}
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <path d="M54 70h10l-1.4 -4h-7.2z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
              {[56, 58.4, 60.8].map((x, i) => (
                <ellipse key={x} cx={x} cy={65.6} rx="1" ry=".7" fill={[P.tomato, P.leaf, P.orange][i]} />
              ))}
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={46} y={72} c={P.blue} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'amaranth': {
      const n = 3 + tier * 2
      return (
        <Svg tier={tier}>
          <Field season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Amaranth key={i} x={12 + ((i * 23) % 56)} y={55 + (i % 3) * 5} s={1} season={season} />
          ))}
          {winter && tier >= 3 ? (
            <g>
              <path d="M60 70q-2 -6 0 -8h6q2 2 0 8z" fill={P.paper} stroke={P.outlineSoft} strokeWidth=".3" />
              <ellipse cx="63" cy="62" rx="2.6" ry=".7" fill={P.cream} />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={72} y={70} c={P.berry} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'comalkueche':
      return (
        <Svg tier={tier}>
          <Field season={season} cy={62} />
          <Patch fill={P.paper} cx={34} cy={63} rx={28} ry={6} />
          <CornPlant x={70} y={66} s={1.1} season={season} />
          <path d="M10 64V40M58 64V40" stroke={P.woodDark} strokeWidth="1.2" />
          <path d="M4 42L34 30L64 42z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M10 41L34 31.4M22 42l12 -10.6M46 42L34 31.4M58 41L34 31.4" stroke={P.woodMid} strokeWidth=".35" />
          <rect x="12" y="50" width="16" height="14" fill={P.terracottaLight} stroke={P.outlineWood} strokeWidth=".4" />
          {[30, 34, 38].map((x) => (
            <ellipse key={x} cx={x + 6} cy="62" rx="2" ry="1.4" fill={P.stone} stroke={P.outlineStone} strokeWidth=".3" />
          ))}
          {tier >= 2 ? <Fire x={40} y={63} s={0.24} /> : null}
          <ellipse cx="40" cy="58" rx="7" ry="1.8" fill={P.charcoal} />
          {tier >= 3
            ? [36.6, 41, 44.6].map((x) => <ellipse key={x} cx={x} cy={57.4} rx="2" ry=".7" fill={P.cream} stroke={P.woodLight} strokeWidth=".2" />)
            : null}
          {tier >= 4 ? (
            <g>
              <path d="M54 66l3 -4h10l2 4z" fill={P.stoneDark} />
              <path d="M58 61h8" stroke={P.stone} strokeWidth="1.6" strokeLinecap="round" />
              <Farmer x={62} y={60} c={P.pink} s={0.6} hat={P.charcoal} skirt={P.blue} />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              {[0, 1, 2].map((k) => (
                <ellipse key={k} cx="20" cy={49 - k * 0.9} rx="3" ry=".9" fill={P.cream} stroke={P.woodLight} strokeWidth=".2" />
              ))}
              <path className="smoke" d="M40 50c-2 -3 2 -5 0 -8" stroke={P.white} strokeWidth="1.2" fill="none" />
            </g>
          ) : null}
        </Svg>
      )
    case 'maisspeicher': {
      const strings = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Field season={season} cy={62} />
          <CornPlant x={14} y={60} s={1} season={season} />
          <path d="M26 64Q18 54 22 44Q24 38 30 36H38Q44 38 46 44Q50 54 42 64z" fill={P.terracottaLight} stroke={P.autumnDark} strokeWidth=".5" />
          <path d="M22 46Q34 42 46 46" stroke={P.terracotta} strokeWidth=".6" fill="none" />
          <path d="M18 38L34 22L50 38Q34 34 18 38z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M24 37L34 24M34 36V24M44 37L34 24" stroke={P.woodMid} strokeWidth=".35" />
          <rect x="31" y="50" width="6" height="5" fill={P.woodDark} />
          {Array.from({ length: strings }, (_, s) => (
            <g key={s}>
              <path d={`M${54 + s * 6} 38v2`} stroke={P.woodDark} strokeWidth=".6" />
              {[0, 1, 2].map((k) => (
                <Cob key={k} x={54 + s * 6} y={43 + k * 5} c={KERNELS[(s * 2 + k) % KERNELS.length]!} />
              ))}
            </g>
          ))}
          {tier >= 2 ? <path d="M50 38h26" stroke={P.woodDark} strokeWidth="1" /> : null}
          {tier >= 5 ? <Farmer x={62} y={70} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'agavenzaun': {
      const n = 1 + tier
      return (
        <Svg tier={tier}>
          <Field season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Agave key={i} x={14 + i * 11} y={58 + (i % 2) * 7} s={1.5} />
          ))}
          {tier >= 4 ? (
            <g>
              <path d="M47 60V18" stroke={P.woodMid} strokeWidth="1.2" />
              {[24, 30, 36].map((y, i) => (
                <g key={y}>
                  <path d={`M47 ${y}h${i % 2 ? -5 : 5}`} stroke={P.woodMid} strokeWidth=".6" />
                  <circle cx={47 + (i % 2 ? -5 : 5)} cy={y - 1} r="1.6" fill={winter ? P.woodLight : P.yellow} />
                </g>
              ))}
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.tomato} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'meliponen': {
      const logs = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Field season={season} />
          <path d="M14 66V38M66 66V38" stroke={P.woodDark} strokeWidth="1.2" />
          <path d="M8 40L40 30L72 40z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
          {Array.from({ length: logs }, (_, i) => (
            <g key={i}>
              <rect x={18 + (i % 2) * 24} y={44 + Math.floor(i / 2) * 9} width="20" height="6" rx="3" fill={P.bark} stroke={P.outlineWood} strokeWidth=".4" />
              <ellipse cx={18 + (i % 2) * 24} cy={47 + Math.floor(i / 2) * 9} rx="1.4" ry="3" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
              <circle cx={18 + (i % 2) * 24} cy={47 + Math.floor(i / 2) * 9} r=".6" fill={P.charcoal} />
            </g>
          ))}
          {Array.from({ length: logs + 1 }, (_, i) => (
            <ellipse key={`b${i}`} cx={14 + ((i * 17) % 50)} cy={52 + ((i * 7) % 10)} rx=".9" ry=".6" fill={P.amber} stroke={P.ink} strokeWidth=".2" />
          ))}
          {tier >= 3 && !winter
            ? [22, 30, 50, 58].map((x, i) => (
                <g key={x}>
                  <path d={`M${x} 68v-3`} stroke={P.leafDark} strokeWidth=".5" />
                  <circle cx={x} cy={64.6} r="1.2" fill={[P.orange, P.pink, P.yellow, P.white][i]} />
                </g>
              ))
            : null}
          {tier >= 5 ? <Farmer x={72} y={70} c={P.leafDark} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'saatgutkruege': {
      const jars = 1 + tier
      return (
        <Svg tier={tier}>
          <Field season={season} cy={62} />
          <Patch fill={P.paper} cy={64} rx={30} ry={5} />
          <rect x="8" y="50" width="64" height="2" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" />
          <path d="M10 52v12M70 52v12" stroke={P.woodDark} strokeWidth="1" />
          {Array.from({ length: jars }, (_, i) =>
            i < 5 ? <Jar key={i} x={16 + i * 12} y={50} s={1.1} seed={KERNELS[i]!} /> : <Jar key={i} x={40} y={66} s={1.2} seed={KERNELS[i % KERNELS.length]!} />,
          )}
          {tier >= 4
            ? [20, 26, 54].map((x, i) => (
                <g key={x}>
                  <Cob x={x} y={63} c={KERNELS[i + 2]!} r={70} />
                </g>
              ))
            : null}
          {tier >= 5 ? <Farmer x={72} y={70} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'markttag': {
      const stalls = Math.min(3, tier)
      return (
        <Svg tier={tier}>
          <Field season={season} cy={62} />
          <Patch fill={P.stoneLight} cy={63} rx={32} ry={7} />
          {Array.from({ length: stalls }, (_, i) => {
            const x = [14, 40, 64][i]!
            return (
              <g key={i}>
                <path d={`M${x - 9} 48h18`} stroke={[P.pink, P.blue, P.orange][i]} strokeWidth="3" />
                <path d={`M${x - 8} 49v14M${x + 8} 49v14`} stroke={P.woodDark} strokeWidth=".7" />
                <rect x={x - 8} y="58" width="16" height="2" fill={P.woodLight} />
                {[0, 1, 2].map((k) => (
                  <ellipse key={k} cx={x - 5 + k * 5} cy="57" rx="2.2" ry="1.4" fill={MARKET[z][(i + k) % 4]} stroke={P.outline} strokeWidth=".15" />
                ))}
              </g>
            )
          })}
          {tier >= 4 ? <Farmer x={30} y={70} c={P.berry} s={0.7} hat={P.charcoal} skirt={P.blue} /> : null}
          {tier >= 5 ? <Farmer x={54} y={70} c={P.white} s={0.7} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'erntefeier': {
      const guests = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Field season={season} />
          <rect x="18" y="54" width="44" height="3" fill={P.white} stroke={P.stoneLight} strokeWidth=".3" />
          <path d="M20 57v8M60 57v8" stroke={P.woodDark} strokeWidth=".8" />
          {Array.from({ length: guests }, (_, i) => (
            <Farmer key={i} x={[24, 56, 32, 48, 40][i]!} y={[53, 53, 70, 70, 53][i]!} c={[P.pink, P.white, P.blue, P.orange, P.leafDark][i]!} s={0.85} hat={i % 2 ? P.woodLight : P.charcoal} />
          ))}
          {Array.from({ length: guests + 1 }, (_, i) => (
            <Cob key={`c${i}`} x={22 + i * 7} y={53} c={P.yellow} r={90} />
          ))}
          {tier >= 3 ? <Picado x0={4} x1={76} y={24} n={9} /> : null}
          {tier >= 4
            ? [14, 68].map((x) => (
                <g key={x}>
                  <path d={`M${x - 3} 66h6l-1 -4h-4z`} fill={P.terracotta} />
                  {[-2, 0, 2].map((d) => (
                    <circle key={d} cx={x + d} cy={60.6} r="1.4" fill={P.orange} stroke={P.amber} strokeWidth=".2" />
                  ))}
                </g>
              ))
            : null}
        </Svg>
      )
    }
  }
  return null
}
