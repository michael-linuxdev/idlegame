/**
 * Kapitel-Grafik Kapitel 34: Gewürzgarten in Kerala.
 * Jahreszeiten: Frühling = heiße Trockenzeit vor dem Monsun (rote Lateriterde,
 * helleres Laub), Sommer = Monsun (Regenvorhang, nasse Erde, Pfützen),
 * Herbst = Onam nach dem Regen (sattgrün, Blüten), Winter = Pfefferernte
 * (rote Ähren, volle Trockenmatten).
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { P } from '../palette'
import type { AreaProps } from './partsB'
import { Fire, WaterBand } from './partsD'
import { CoconutPalm, Farmer, Patch, PepperVine, Rain, ShadeTree } from './partsF'
import { ssn } from './season'

const FLOWERS = [P.orange, P.yellow, P.berry, P.white, P.lilac, P.amber]

/** Lateriterde: Frühling hellrot und trocken, Sommer nass mit Pfütze, Herbst grün, Winter rotbraun. */
function Laterite({ season, cy = 60, rx = 36, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const fill = z === 'spring' ? P.terracottaLight : z === 'summer' ? P.soil : z === 'autumn' ? P.woodMid : P.terracotta
  return (
    <g>
      <Patch fill={fill} cy={cy} rx={rx} ry={ry} />
      {z === 'summer' ? <ellipse cx={40 - rx * 0.4} cy={cy + 2} rx="6" ry="1.4" fill={P.water} opacity=".85" /> : null}
      {z === 'autumn' ? [-0.6, -0.2, 0.3, 0.6].map((d, i) => <circle key={d} cx={40 + rx * d} cy={cy + 3 - (i % 2) * 2} r=".9" fill={FLOWERS[i]} />) : null}
    </g>
  )
}

/** Kardamom: Büschel langer Blätter, Kapseln und Blüten am Boden. */
function Cardamom({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  const leaf = z === 'spring' ? P.leaf : P.leafDark
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-5, -2.5, 0, 2.5, 5].map((dx, i) => (
        <g key={dx}>
          <path d={`M${dx * 0.4} 0Q${dx} -8 ${dx * 1.4} -${14 - (i % 2) * 3}`} stroke={P.leafMoss} strokeWidth=".6" fill="none" />
          <ellipse cx={dx * 1.2} cy={-9 + (i % 2) * 2} rx="1" ry="3" fill={leaf} transform={`rotate(${dx * 4} ${dx * 1.2} ${-9 + (i % 2) * 2})`} />
        </g>
      ))}
      {z === 'summer' ? [-3, 3].map((dx) => <circle key={dx} cx={dx} cy="-.8" r=".8" fill={P.white} stroke={P.lilac} strokeWidth=".3" />) : null}
      {z !== 'summer' ? [-3.4, -1.4, 1.6, 3.4].map((dx) => <ellipse key={dx} cx={dx} cy="-.6" rx=".7" ry=".5" fill={z === 'winter' ? P.leafPale : P.leaf} stroke={P.leafMoss} strokeWidth=".15" />) : null}
    </g>
  )
}

/** Zimtstrauch (auf Stock gesetzt): viele dünne Triebe, junges Laub rötlich. */
function Cinnamon({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0L-4 -12M0 0V-14M0 0L4 -12" stroke={P.bark} strokeWidth=".9" />
      <ellipse cx="-4" cy="-13" rx="4" ry="3" fill={P.leafDark} />
      <ellipse cx="4" cy="-13" rx="4" ry="3" fill={P.leafDark} />
      <ellipse cx="0" cy="-16" rx="4" ry="3" fill={z === 'spring' || z === 'summer' ? P.terracottaLight : P.leaf} />
    </g>
  )
}

/** Ingwer bzw. Kurkuma: Stängel mit schmalen (Ingwer) oder breiten (Kurkuma) Blättern; Ernte zeigt die Knolle. */
function Rhizome({ x, y, s = 1, season, broad, c }: { x: number; y: number; s?: number; season?: string; broad?: boolean; c: string }) {
  const z = ssn(season)
  if (z === 'winter') {
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M-2.4 0q-1 -1.6 .6 -1.8q1 -1.4 2.4 -.2q1.6 -.6 1.8 1.2q.4 1.4 -1 1.2h-3z" fill={c} stroke={P.outlineWood} strokeWidth=".2" />
        <path d="M0 -1.6l-.6 -2.4M.8 -1.6l1 -2" stroke={P.woodLight} strokeWidth=".4" />
      </g>
    )
  }
  const leaf = z === 'spring' ? P.leafPale : z === 'autumn' ? P.leaf : P.leafDark
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-1.6, 0, 1.6].map((dx, i) => (
        <g key={dx}>
          <path d={`M${dx * 0.5} 0L${dx * 1.6} -${9 + (i % 2) * 2}`} stroke={P.leafMoss} strokeWidth=".5" />
          {broad ? (
            <ellipse cx={dx * 1.6} cy={-8 - (i % 2) * 2} rx="1.8" ry="3.6" fill={leaf} transform={`rotate(${dx * 10} ${dx * 1.6} ${-8 - (i % 2) * 2})`} />
          ) : (
            [3, 5.6, 8].map((dy) => <path key={dy} d={`M${dx * 0.5 + dx * 0.12 * dy} -${dy}l${dx >= 0 ? 2.4 : -2.4} -1`} stroke={leaf} strokeWidth=".7" />)
          )}
        </g>
      ))}
      {broad && z === 'autumn' ? <path d="M0 -12l-.8 -2.4h1.6z" fill={P.pink} /> : null}
    </g>
  )
}

/** Muskatbaum: kegelförmig, Früchte gelb, aufgeplatzt mit rotem Netz (Macis). */
function Nutmeg({ x, y, s = 1, season, fruits = 3 }: { x: number; y: number; s?: number; season?: string; fruits?: number }) {
  const z = ssn(season)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-6" stroke={P.bark} strokeWidth="1.2" />
      <path d="M0 -26Q-6 -24 -8 -16Q-11 -8 -6 -5Q0 -3 6 -5Q11 -8 8 -16Q6 -24 0 -26z" fill={z === 'spring' ? P.leaf : P.leafDark} stroke={P.outline} strokeWidth=".25" />
      <path d="M-3 -18q3 1 6 0M-5 -12q5 1 10 0" stroke={P.leafMoss} strokeWidth=".4" fill="none" />
      {Array.from({ length: fruits }, (_, i) => {
        const fx = [-4, 3, -1, 5, -5][i % 5]!
        const fy = [-9, -11, -16, -7, -14][i % 5]!
        return (
          <g key={i}>
            <circle cx={fx} cy={fy} r="1.3" fill={P.yellow} stroke={P.gold} strokeWidth=".2" />
            {z === 'winter' || z === 'autumn' ? <path d={`M${fx - 0.6} ${fy}h1.2`} stroke={P.berry} strokeWidth=".7" /> : null}
          </g>
        )
      })}
    </g>
  )
}

/** Kettuvallam: Hausboot mit gewölbtem Flechtdach (Fußpunkt Mitte, Wasserlinie). */
function Kettuvallam({ x, y, s = 1, lit }: { x: number; y: number; s?: number; lit?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="ha-swim">
      <path d="M-16 -4Q-18 -6 -17 -8Q-8 -1 0 -1Q8 -1 17 -8Q18 -6 16 -4Q8 1 0 1Q-8 1 -16 -4z" fill={P.woodDark} stroke={P.outlineWood} strokeWidth=".3" />
      <path d="M-10 -3Q-10 -11 0 -11Q10 -11 10 -3z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
      <path d="M-6 -3v-6.6M-2 -3v-7.6M2 -3v-7.6M6 -3v-6.6" stroke={P.woodMid} strokeWidth=".3" />
      <rect x="-4" y="-7" width="3" height="2.4" fill={lit ? P.lamp : P.charcoal} />
      <rect x="1.4" y="-7" width="3" height="2.4" fill={lit ? P.lamp : P.charcoal} />
    </g>
  )
}

export function Gewuerzgarten({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  switch (id) {
    case 'pfefferranken': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Laterite season={season} />
          {Array.from({ length: n }, (_, i) => (
            <PepperVine key={i} x={[40, 22, 58, 31, 49][i]!} y={[58, 62, 62, 70, 70][i]!} s={[1.55, 1.15, 1.15, 0.95, 0.95][i]!} season={season} spikes={3 + (i % 2)} />
          ))}
          {summer ? <Rain n={8} y0={2} /> : null}
          {tier >= 5 ? <Farmer x={70} y={70} c={P.cream} s={0.6} hat={P.cream} skirt={P.leafDark} /> : null}
        </Svg>
      )
    }
    case 'kardamom': {
      const n = 1 + tier
      return (
        <Svg tier={tier}>
          <Laterite season={season} />
          <ShadeTree x={20} y={52} s={1.3} season={season === 'winter' ? 'summer' : season} />
          {tier >= 3 ? <ShadeTree x={62} y={50} s={1.2} season={season === 'winter' ? 'summer' : season} crown={P.leafMoss} /> : null}
          {Array.from({ length: n }, (_, i) => (
            <Cardamom key={i} x={[40, 20, 60, 30, 50, 68][i]!} y={[62, 64, 64, 70, 70, 70][i]!} s={1.1} season={season} />
          ))}
          {summer ? <Rain n={7} y0={2} /> : null}
          {tier >= 5 ? <Farmer x={74} y={58} c={P.berry} s={0.6} hat={P.cream} skirt={P.yellow} /> : null}
        </Svg>
      )
    }
    case 'zimtbaeume': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Laterite season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Cinnamon key={i} x={[40, 20, 60, 30, 50][i]!} y={[58, 62, 62, 70, 70][i]!} s={[1.3, 1.1, 1.1, 0.95, 0.95][i]!} season={season} />
          ))}
          {tier >= 3 && !summer ? (
            <g>
              <path d="M64 70h12" stroke={P.woodDark} strokeWidth=".8" />
              {[65, 67.4, 69.8, 72.2, 74.6].map((x) => (
                <rect key={x} x={x} y="62" width="1.6" height="8" rx=".8" fill={P.terracotta} stroke={P.autumnDark} strokeWidth=".2" />
              ))}
            </g>
          ) : null}
          {summer ? <Rain n={7} y0={2} /> : null}
          {tier >= 5 ? <Farmer x={58} y={72} c={P.cream} s={0.6} hat={P.cream} /> : null}
        </Svg>
      )
    }
    case 'ingwerbeet': {
      const n = 3 + tier
      return (
        <Svg tier={tier}>
          <Laterite season={season} />
          <rect x="10" y="50" width="60" height="7" rx="3" fill={P.soil} />
          <rect x="12" y="60" width="56" height="7" rx="3" fill={P.soil} />
          {winter ? <path d="M14 52h52M14 62h52" stroke={P.woodLight} strokeWidth=".5" strokeDasharray="1 1" /> : <path d="M14 51h52M14 61h52" stroke={P.woodMid} strokeWidth=".8" strokeDasharray="2 1" />}
          {Array.from({ length: n }, (_, i) => (
            <Rhizome key={i} x={16 + (i % 4) * 15 + (i >= 4 ? 7 : 0)} y={i < 4 ? 55 : 65} s={1.1} season={season} c={P.paper} />
          ))}
          {summer ? <Rain n={7} y0={2} /> : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.blue} s={0.6} hat={P.cream} /> : null}
        </Svg>
      )
    }
    case 'kurkuma': {
      const n = 2 + tier
      return (
        <Svg tier={tier}>
          <Laterite season={season} />
          <rect x="8" y="54" width="52" height="10" rx="4" fill={P.soil} />
          {Array.from({ length: n }, (_, i) => (
            <Rhizome key={i} x={14 + (i % 4) * 12 + (i >= 4 ? 6 : 0)} y={i < 4 ? 60 : 64} s={1.3} season={season} broad c={P.orange} />
          ))}
          {tier >= 4 ? (
            <g>
              {tier >= 5 ? <Fire x={68} y={68} s={0.22} /> : null}
              <path d="M62 66h12l-1 -6h-10z" fill={P.metal} stroke={P.charcoal} strokeWidth=".3" />
              <ellipse cx="68" cy="60" rx="6" ry="1.2" fill={P.yellow} />
              <path className="smoke" d="M68 56c-1.4 -2 1.4 -3.4 0 -6" stroke={P.white} strokeWidth=".8" fill="none" />
            </g>
          ) : null}
          {summer ? <Rain n={6} y0={2} /> : null}
        </Svg>
      )
    }
    case 'muskatbaum': {
      const n = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Laterite season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Nutmeg key={i} x={[40, 20, 60, 30][i]!} y={[60, 64, 64, 70][i]!} s={[1.35, 1.05, 1.05, 0.9][i]!} season={season} fruits={2 + (i === 0 ? tier : 1)} />
          ))}
          {summer ? <Rain n={7} y0={2} /> : null}
          {tier >= 5 ? <Farmer x={60} y={72} c={P.berry} s={0.6} hat={P.cream} skirt={P.yellow} /> : null}
        </Svg>
      )
    }
    case 'trockenmatten': {
      const mats = Math.min(4, tier)
      const corn = winter ? [P.charcoal, P.leafDark] : z === 'spring' ? [P.ink, P.soilDark] : [P.leaf, P.charcoal]
      return (
        <Svg tier={tier}>
          <Laterite season={season} />
          {Array.from({ length: mats }, (_, i) => {
            const x = 8 + (i % 2) * 34
            const y = 50 + Math.floor(i / 2) * 11
            return (
              <g key={i}>
                <rect x={x} y={y} width="30" height="8" rx="1" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
                <path d={`M${x + 3} ${y}v8M${x + 9} ${y}v8M${x + 15} ${y}v8M${x + 21} ${y}v8M${x + 27} ${y}v8`} stroke={P.wood} strokeWidth=".3" />
                {summer ? (
                  <rect x={x + 22} y={y - 2} width="6" height="10" rx="3" fill={P.wood} stroke={P.outlineWood} strokeWidth=".3" />
                ) : (
                  Array.from({ length: 14 }, (_, k) => <circle key={k} cx={x + 2.4 + (k % 7) * 4} cy={y + 2.4 + Math.floor(k / 7) * 3} r=".9" fill={corn[k % 2]} />)
                )}
              </g>
            )
          })}
          {summer ? <Rain n={8} y0={2} /> : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.cream} s={0.6} hat={P.cream} skirt={P.berry} /> : null}
        </Svg>
      )
    }
    case 'bootssteg':
      return (
        <Svg tier={tier}>
          <WaterBand y={54} h={30} x0={0} x1={80} />
          <rect x="0" y="66" width="80" height="6" fill={summer ? P.soil : P.terracottaLight} />
          <Kettuvallam x={34} y={56} s={1.3 + tier * 0.05} lit={winter} />
          {tier >= 2 ? <path d="M54 66V58M62 66V58M70 66V58M52 59h20" stroke={P.woodDark} strokeWidth="1" /> : null}
          {tier >= 3 ? <CoconutPalm x={74} y={68} s={0.8} lean={-1} season={season} /> : null}
          {tier >= 4 ? <CoconutPalm x={12} y={68} s={0.7} season={season} /> : null}
          {tier >= 5 ? <Farmer x={62} y={58} c={P.cream} s={0.65} hat={P.cream} /> : null}
          {summer ? <Rain n={8} y0={2} /> : null}
          {z === 'autumn' ? <path d="M18 60h4M44 62h5" stroke={P.leafLight} strokeWidth="1.2" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'gewuerzlager': {
      const sacks = 1 + tier
      return (
        <Svg tier={tier}>
          <Laterite season={season} />
          <rect x="14" y="40" width="44" height="22" fill={P.cream} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M8 42L20 30H52L64 42z" fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M14 36h44" stroke={P.terracottaLight} strokeWidth=".6" />
          <rect x="30" y="48" width="12" height="14" fill={P.woodDark} />
          {Array.from({ length: sacks }, (_, i) => {
            const x = 14 + i * 9
            const y = 70
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(1.4) translate(${-x} ${-y})`}>
                <path d={`M${x - 2.4} ${y}q-1 -4 0 -5.6h4.8q1 1.6 0 5.6z`} fill={P.paper} stroke={P.outlineSoft} strokeWidth=".25" />
                <ellipse cx={x} cy={y - 5.6} rx="2.2" ry=".7" fill={[P.charcoal, P.leaf, P.terracotta, P.yellow, P.woodDark, P.berry][i % 6]} />
              </g>
            )
          })}
          {summer ? <Rain n={6} y0={2} /> : null}
          {tier >= 5 ? <Farmer x={66} y={60} c={P.cream} s={0.6} hat={P.cream} /> : null}
        </Svg>
      )
    }
    case 'pookalam': {
      const rings = 1 + tier
      return (
        <Svg tier={tier}>
          <Laterite season={season} />
          {Array.from({ length: rings }, (_, k) => {
            const i = rings - 1 - k
            return <ellipse key={i} cx="40" cy="60" rx={4 + i * 4.6} ry={1.6 + i * 1.8} fill={FLOWERS[(i + (winter ? 2 : 0)) % FLOWERS.length]} stroke={P.leafDark} strokeWidth=".2" />
          })}
          {tier >= 3 ? <path d="M40 58l-1 -2h2zM36 60h-2l1 -1zM44 60h2l-1 -1z" fill={P.leafDark} /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M66 62v-6M70 62v-6M64 56h8" stroke={P.brass} strokeWidth=".8" />
              <path d="M68 56v-4" stroke={P.brass} strokeWidth="1" />
              <circle cx="68" cy="51" r=".8" fill={P.lamp} />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={20} y={72} c={P.cream} s={0.65} hat={P.cream} skirt={P.gold} /> : null}
          {summer ? <Rain n={7} y0={2} /> : null}
        </Svg>
      )
    }
  }
  return null
}
