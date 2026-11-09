/**
 * Kapitel-Grafik Kapitel 35: Dattel-Oase in Marokko (Tafilalet).
 * Jahreszeiten nach dem Jahr der Oase: Frühling = Palmenblüte (Bestäubung von
 * Hand), Gerste grün; Sommer = Hitze, gelbe Datteln, Rispen in Tüten, Boden
 * staubig; Herbst = Dattelernte (braune Datteln, Körbe); Winter = kühle
 * Zeit, keine Früchte, Gerste und Bohnen grün unter den Palmen.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { P } from '../palette'
import { Farmer } from './figures'
import type { AreaProps } from './partsB'
import { Fire } from './partsD'
import { Patch } from './partsF'
import { DatePalm, MudTower, PomegranateTree, Stars } from './partsG'
import { ssn } from './season'

/** Oasenboden: Sand außen, Gartenerde innen (Farbe je Jahreszeit). */
function Floor({ season, cy = 60, rx = 36, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const inner = z === 'spring' ? P.leaf : z === 'summer' ? P.wood : z === 'autumn' ? P.soil : P.leafMoss
  return (
    <g>
      <Patch fill={P.woodLight} cy={cy} rx={rx} ry={ry} />
      <Patch fill={inner} cy={cy + 1} rx={rx * 0.78} ry={ry * 0.7} />
      {z === 'summer' ? [-0.4, 0.1, 0.5].map((d) => <path key={d} d={`M${40 + rx * d} ${cy}l1 -1l1 1`} stroke={P.woodDark} strokeWidth=".4" fill="none" />) : null}
    </g>
  )
}

/** Datteln im Korb je Jahreszeit (Herbst voll, sonst wenige). */
function dateColor(z: string) {
  return z === 'autumn' ? P.autumnDark : z === 'summer' ? P.yellow : z === 'spring' ? P.woodMid : P.soilDark
}

/** Flacher Palmblattkorb (Fußpunkt Mitte unten). */
function Basket({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g>
      <path d={`M${x - 3.4} ${y - 2.6}h6.8l-1 2.6h-4.8z`} fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
      <path d={`M${x - 2.6} ${y - 1.4}h5.2`} stroke={P.woodMid} strokeWidth=".3" />
      {[-1.8, -0.6, 0.6, 1.8].map((d) => (
        <circle key={d} cx={x + d} cy={y - 3} r=".75" fill={fill} />
      ))}
    </g>
  )
}

/** Teekanne aus Messing (Fußpunkt Mitte unten). */
function Teapot({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-2 0q-.8 -2.4 0 -3.4h4q.8 1 0 3.4z" fill={P.brass} stroke={P.outlineSoft} strokeWidth=".25" />
      <path d="M-1 -3.4l1 -1.6l1 1.6z" fill={P.brass} stroke={P.outlineSoft} strokeWidth=".2" />
      <path d="M2.2 -1.6l2 -2" stroke={P.brass} strokeWidth=".6" strokeLinecap="round" />
    </g>
  )
}

/** Teppich mit Rautenmuster (links oben x/y). */
function Rug({ x, y, w, h, c = P.berry }: { x: number; y: number; w: number; h: number; c?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={c} stroke={P.autumnDark} strokeWidth=".3" />
      <rect x={x + 1} y={y + 1} width={w - 2} height={h - 2} fill="none" stroke={P.cream} strokeWidth=".35" />
      <path d={`M${x + w / 2} ${y + 1.6}l${w / 4} ${h / 2 - 1.6}l${-w / 4} ${h / 2 - 1.6}l${-w / 4} ${-h / 2 + 1.6}z`} fill={P.cream} opacity=".85" />
      <path d={`M${x + w / 2} ${y + h / 2 - 1}v2`} stroke={P.ink} strokeWidth=".5" />
    </g>
  )
}

export function Oase({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const autumn = z === 'autumn'
  switch (id) {
    case 'dattelpalmen': {
      const n = Math.min(5, tier)
      const xs = [40, 20, 60, 30, 52]
      const ys = [58, 62, 62, 68, 68]
      const ss = [1.5, 1.2, 1.2, 1.05, 1.05]
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <DatePalm key={i} x={xs[i]!} y={ys[i]!} s={ss[i]!} season={season} bunches={i === 0 ? 3 : 2} lean={[0, -0.5, 0.5, -0.3, 0.3][i]} />
          ))}
          {tier >= 5 ? <Farmer x={72} y={70} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'stockwerkgarten': {
      const beds = tier + 1
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <DatePalm x={24} y={56} s={1.4} season={season} />
          {tier >= 3 ? <DatePalm x={58} y={54} s={1.25} season={season} lean={0.4} /> : null}
          <PomegranateTree x={42} y={60} s={1} season={season} n={3} />
          {tier >= 2 ? <PomegranateTree x={64} y={64} s={0.8} season={season} n={2} /> : null}
          {Array.from({ length: beds }, (_, i) => {
            const x = 14 + i * 10
            return (
              <g key={i}>
                <path d={`M${x} 69h8`} stroke={P.soilDark} strokeWidth="1.6" strokeLinecap="round" />
                {[1.4, 4, 6.6].map((d) => (
                  <path key={d} d={`M${x + d} 68.4v-2.2`} stroke={winter ? P.leafDark : z === 'summer' ? P.gold : z === 'autumn' ? P.woodLight : P.leafLight} strokeWidth=".8" strokeLinecap="round" />
                ))}
              </g>
            )
          })}
          {tier >= 5 ? <Farmer x={70} y={72} c={P.blue} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'khettara': {
      const shafts = tier + 1
      return (
        <Svg tier={tier}>
          <Patch fill={P.woodLight} cy={58} rx={37} ry={12} />
          <path d="M6 48Q30 52 46 60T76 70" stroke={P.wood} strokeWidth=".6" strokeDasharray="1.6 1.2" fill="none" />
          {Array.from({ length: shafts }, (_, i) => {
            const t = i / Math.max(1, 5)
            const x = 8 + t * 52
            const y = 48 + t * 14
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx="5.4" ry="2.6" fill={P.wood} stroke={P.outlineWood} strokeWidth=".3" />
                <ellipse cx={x} cy={y - 0.8} rx="3.4" ry="1.4" fill={P.woodMid} />
                <ellipse cx={x} cy={y - 0.8} rx="1.8" ry=".8" fill={P.soilDark} />
              </g>
            )
          })}
          <path d="M62 66Q68 70 76 69" stroke={P.water} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M64 67Q69 70 74 69.4" stroke={P.waterLight} strokeWidth=".6" fill="none" />
          {tier >= 3 ? <DatePalm x={70} y={66} s={0.9} season={season} /> : null}
          {tier >= 4 ? <path d="M22 48l2 -8M28 48l-2 -8M21 41h8M25 41v4" stroke={P.woodDark} strokeWidth=".7" /> : null}
          {tier >= 4 ? <path d="M25 45v3" stroke={P.woodLight} strokeWidth=".4" /> : null}
          {tier >= 5 ? <Farmer x={38} y={58} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'ksar':
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <rect x="14" y="48" width="52" height="16" fill={P.terracottaLight} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M14 48h52" stroke={P.terracotta} strokeWidth="1" strokeDasharray="2 1.4" />
          <path d="M36 64v-7a4 4 0 0 1 8 0v7z" fill={P.woodDark} stroke={P.outlineWood} strokeWidth=".3" />
          {tier >= 2 ? <MudTower x={16} y={64} w={10} h={26} lit={winter} /> : null}
          {tier >= 3 ? <MudTower x={64} y={64} w={10} h={26} lit={winter} /> : null}
          {tier >= 4 ? <MudTower x={40} y={50} w={9} h={14} lit={winter} /> : null}
          {tier >= 4 ? <path d="M22 54h6M52 54h6" stroke={P.soilDark} strokeWidth="1.4" /> : null}
          {tier >= 5 ? <DatePalm x={72} y={70} s={0.9} season={season} /> : null}
          {tier >= 5 ? <Farmer x={30} y={70} c={P.white} s={0.6} hat={P.white} /> : null}
        </Svg>
      )
    case 'granataepfel': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <PomegranateTree key={i} x={[40, 20, 60, 30, 52][i]!} y={[58, 63, 63, 70, 70][i]!} s={[1.7, 1.4, 1.4, 1.2, 1.2][i]!} season={season} n={4 + (i % 2)} />
          ))}
          {tier >= 5 ? <Farmer x={70} y={72} c={P.leafDark} s={0.6} hat={P.woodLight} skirt={P.berry} /> : null}
        </Svg>
      )
    }
    case 'minzbeet': {
      const tufts = 4 + tier * 2
      const mint = winter ? P.leafMoss : z === 'summer' ? P.leafDark : P.leaf
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <rect x="12" y="54" width="44" height="14" rx="2" fill={P.soil} stroke={P.terracotta} strokeWidth=".8" />
          {Array.from({ length: tufts }, (_, i) => {
            const x = 15 + (i % 7) * 6 + (Math.floor(i / 7) % 2) * 3
            const y = 58 + Math.floor(i / 7) * 5
            return (
              <g key={i}>
                <ellipse cx={x - 1} cy={y} rx="1.6" ry="1.1" fill={mint} />
                <ellipse cx={x + 1} cy={y - 0.6} rx="1.6" ry="1.1" fill={P.leafLight} />
                {z === 'summer' && i % 3 === 0 ? <path d={`M${x} ${y - 1}v-2.4`} stroke={P.lilac} strokeWidth=".8" strokeLinecap="round" /> : null}
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <ellipse cx="66" cy="66" rx="7" ry="2" fill={P.brass} stroke={P.outlineSoft} strokeWidth=".3" />
              <Teapot x={64} y={65} s={1.1} />
              {[68, 70.4].map((x) => (
                <path key={x} d={`M${x} 65h1.4l-.2 -1.8h-1z`} fill={P.glass} stroke={P.leafDark} strokeWidth=".2" />
              ))}
            </g>
          ) : null}
          {tier >= 4 ? <path className="smoke" d="M64 58c-1 -2 1 -3 0 -5" stroke={P.white} strokeWidth=".7" fill="none" /> : null}
          {tier >= 5 ? <Farmer x={22} y={74} c={P.white} s={0.6} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'brunnenhof':
      return (
        <Svg tier={tier}>
          <Patch fill={P.cream} cy={60} rx={36} ry={11} edge={P.terracottaLight} />
          {Array.from({ length: 4 + tier * 2 }, (_, i) => (
            <path key={i} d={`M${12 + (i % 7) * 9} ${54 + Math.floor(i / 7) * 10}l2 1.2l-2 1.2l-2 -1.2z`} fill={i % 2 ? P.blue : P.leafDark} />
          ))}
          <ellipse cx="40" cy="60" rx="11" ry="4.4" fill={P.leafDark} stroke={P.white} strokeWidth=".8" />
          <ellipse cx="40" cy="59.6" rx="9" ry="3.4" fill={P.water} />
          <path d="M40 59V52" stroke={P.stoneLight} strokeWidth="1.2" />
          <ellipse cx="40" cy="52" rx="3" ry="1" fill={P.stoneLight} />
          {tier >= 2 ? <path d="M40 51.4c-1 -3 -3 -3 -4 0M40 51.4c1 -3 3 -3 4 0" stroke={P.waterLight} strokeWidth=".6" fill="none" /> : null}
          {tier >= 3 ? <DatePalm x={14} y={60} s={1} season={season} /> : null}
          {tier >= 4 ? (
            <g>
              <rect x="56" y="62" width="14" height="4" rx="1.6" fill={P.berry} stroke={P.autumnDark} strokeWidth=".3" />
              <rect x="57" y="59" width="12" height="3.4" rx="1.4" fill={P.orange} />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={60} y={60} c={P.white} s={0.6} hat={P.white} /> : null}
          {tier >= 5 ? <Teapot x={30} y={70} s={1} /> : null}
        </Svg>
      )
    case 'teppichstube': {
      const rugs = Math.min(3, tier - 1)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <path d="M14 66V36M38 66V36M12 37h28M12 62h28" stroke={P.woodDark} strokeWidth="1.2" strokeLinecap="round" />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${16 + i * 2.6} 37V62`} stroke={P.cream} strokeWidth=".3" />
          ))}
          <rect x="15.6" y={62 - tier * 4} width="21" height={tier * 4} fill={P.berry} />
          {Array.from({ length: tier }, (_, i) => (
            <path key={i} d={`M17 ${60 - i * 4}l3 -2l3 2l3 -2l3 2l3 -2l3 2`} stroke={i % 2 ? P.cream : P.amber} strokeWidth=".7" fill="none" />
          ))}
          {rugs > 0 ? <path d="M44 40h32" stroke={P.woodDark} strokeWidth=".6" /> : null}
          {Array.from({ length: Math.max(0, rugs) }, (_, i) => (
            <Rug key={i} x={45 + i * 10.4} y={40} w={9} h={16} c={[P.berry, P.orange, P.blue][i]} />
          ))}
          {tier >= 4 ? [48, 54, 60].map((x, i) => <ellipse key={x} cx={x} cy={66} rx="2.4" ry="1.6" fill={[P.amber, P.berry, P.cream][i]} stroke={P.outlineSoft} strokeWidth=".2" />) : null}
          {tier >= 5 ? <Farmer x={70} y={70} c={P.lilac} s={0.6} hat={P.white} skirt={P.berry} /> : null}
        </Svg>
      )
    }
    case 'dattelernte': {
      const baskets = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <DatePalm x={22} y={60} s={1.6} season={season} bunches={4} />
          {tier >= 2 ? <DatePalm x={58} y={58} s={1.4} season={season} bunches={3} lean={0.4} /> : null}
          {tier >= 3 ? <path d="M24 20Q30 40 34 64" stroke={P.woodLight} strokeWidth=".5" fill="none" /> : null}
          {tier >= 3 ? <Farmer x={22} y={34} c={P.white} s={0.55} hat={P.woodLight} /> : null}
          {Array.from({ length: baskets }, (_, i) => (
            <Basket key={i} x={34 + i * 8} y={66} fill={autumn ? dateColor(z) : i % 2 ? dateColor(z) : P.woodMid} />
          ))}
          {tier >= 5 ? <Farmer x={70} y={72} c={P.blue} s={0.6} hat={P.white} /> : null}
        </Svg>
      )
    }
    case 'sternenabend':
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <path d="M14 58L22 42H58L66 58z" fill={P.soilDark} stroke={P.ink} strokeWidth=".3" />
          <path d="M22 42L40 38L58 42" stroke={P.compost} strokeWidth="1" fill="none" />
          <Rug x={22} y={58} w={36} h={8} c={P.berry} />
          <Stars n={3 + tier * 2} y0={4} y1={30} />
          {tier >= 2 ? <Fire x={70} y={64} s={0.5} /> : null}
          {tier >= 3 ? <Farmer x={28} y={62} c={P.white} s={0.6} hat={P.white} /> : null}
          {tier >= 3 ? <ellipse cx="32" cy="60" rx="2" ry="2" fill={P.woodLight} stroke={P.woodDark} strokeWidth=".4" /> : null}
          {tier >= 4 ? <Farmer x={50} y={62} c={P.blue} s={0.6} hat={P.white} /> : null}
          {tier >= 4 ? <Teapot x={40} y={63} s={1} /> : null}
          {tier >= 5 ? [26, 54].map((x) => <circle key={x} cx={x} cy={46} r="1.4" fill={P.lamp} stroke={P.brass} strokeWidth=".3" />) : null}
        </Svg>
      )
  }
  return null
}
