/**
 * Kapitel-Grafik Kapitel 32: Kaffeewald in Äthiopien (Kaffa).
 * Jahreszeiten: Frühling = erster Regen, Kaffeeblüte weiß; Sommer = große
 * Regenzeit (sattgrün, grüne Kirschen, Pfützen); Herbst = Ernte (rote
 * Kirschen); Winter = Trockenzeit (Trockenbetten voll, Laub matter).
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { P } from '../palette'
import type { AreaProps } from './partsB'
import { Fire, WaterBand } from './partsD'
import { CoffeeShrub, Ensete, Farmer, Patch, Rain, ShadeTree, Tukul } from './partsF'
import { ssn } from './season'

/** Waldboden: Frühling rotbraun, Sommer nass und moosig, Herbst Laub, Winter trocken. */
function Floor({ season, cy = 60, rx = 36, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const fill = z === 'spring' ? P.soil : z === 'summer' ? P.leafMoss : z === 'autumn' ? P.woodMid : P.woodLight
  return (
    <g>
      <Patch fill={fill} cy={cy} rx={rx} ry={ry} />
      {z === 'summer' ? <ellipse cx={40 + rx * 0.4} cy={cy + 2} rx="5" ry="1.4" fill={P.water} opacity=".8" /> : null}
      {z === 'autumn' ? [-0.5, -0.1, 0.3].map((d) => <ellipse key={d} cx={40 + rx * d} cy={cy + 3} rx="1.2" ry=".5" fill={P.autumn} />) : null}
    </g>
  )
}

/** Kirschfarbe je Jahreszeit (Ernte rot, sonst grün; Trockenzeit dunkel getrocknet). */
function cherry(z: string) {
  return z === 'autumn' ? P.berry : z === 'winter' ? P.soilDark : z === 'summer' ? P.leaf : P.leafPale
}

/** Jebena: Kaffeekanne aus schwarzem Ton (Fußpunkt Mitte unten). */
function Jebena({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-3" r="3" fill={P.charcoal} stroke={P.ink} strokeWidth=".3" />
      <path d="M-.8 -5.6V-9.6h1.6V-5.6z" fill={P.charcoal} />
      <path d="M2.4 -4.4l2.4 -2" stroke={P.charcoal} strokeWidth=".9" strokeLinecap="round" />
      <path d="M-.8 -8.4q-3.4 0 -3 3.6" stroke={P.charcoal} strokeWidth=".7" fill="none" />
      <path d="M-1 -2.6q1 -1.4 2 0" stroke={P.stone} strokeWidth=".3" fill="none" />
    </g>
  )
}

/** Bienenkorb aus Rinde, waagerecht (Mitte). */
function BarkHive({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-5" y="-1.6" width="10" height="3.2" rx="1.6" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" />
      <path d="M-3 -1.6v3.2M0 -1.6v3.2M3 -1.6v3.2" stroke={P.bark} strokeWidth=".3" />
      <ellipse cx="-5" cy="0" rx=".6" ry="1.6" fill={P.woodLight} />
    </g>
  )
}

/** Sack (Fußpunkt Mitte unten). */
function Sack({ x, y, c = P.paper, top }: { x: number; y: number; c?: string; top?: string }) {
  return (
    <g>
      <path d={`M${x - 3} ${y}q-1.4 -5 0 -7h6q1.4 2 0 7z`} fill={c} stroke={P.outlineSoft} strokeWidth=".3" />
      {top ? <ellipse cx={x} cy={y - 7} rx="2.6" ry=".8" fill={top} /> : null}
    </g>
  )
}

export function Kaffeewald({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  switch (id) {
    case 'waldkaffee': {
      const shrubs = 1 + tier
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <ShadeTree x={22} y={56} s={1.4} season={season} />
          {tier >= 3 ? <ShadeTree x={60} y={54} s={1.3} season={season} crown={P.leafMoss} /> : null}
          {Array.from({ length: shrubs }, (_, i) => (
            <CoffeeShrub key={i} x={[40, 18, 60, 29, 51, 70][i]!} y={[60, 64, 64, 70, 70, 70][i]!} s={1.5} season={season} cherries={5} />
          ))}
          {summer ? <Rain n={6} y0={4} /> : null}
          {tier >= 5 ? <Farmer x={72} y={58} c={P.white} s={0.6} hat={P.white} skirt={P.leafDark} /> : null}
        </Svg>
      )
    }
    case 'pflueckplatz': {
      const baskets = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <CoffeeShrub x={20} y={62} s={2} season={season} cherries={6} />
          <CoffeeShrub x={60} y={60} s={1.8} season={season} cherries={6} />
          {Array.from({ length: baskets }, (_, i) => (
            <g key={i}>
              <path d={`M${30 + i * 7} 70h6l-1 -4h-4z`} fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
              {[1.6, 3, 4.4].map((d) => (
                <circle key={d} cx={30 + i * 7 + d} cy={65.6} r=".8" fill={cherry(z)} />
              ))}
            </g>
          ))}
          {tier >= 3 ? <Farmer x={36} y={60} c={P.tomato} s={0.65} hat={P.white} skirt={P.blue} /> : null}
          {tier >= 5 ? <Farmer x={72} y={66} c={P.white} s={0.65} hat={P.woodLight} /> : null}
        </Svg>
      )
    }
    case 'trockenbetten': {
      const beds = Math.min(4, tier)
      const load = winter ? P.soilDark : z === 'autumn' ? P.berry : summer ? P.white : P.autumnDark
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: beds }, (_, i) => {
            const x = 8 + (i % 2) * 34
            const y = 50 + Math.floor(i / 2) * 12
            return (
              <g key={i}>
                <path d={`M${x + 2} ${y}v8M${x + 28} ${y}v8M${x + 15} ${y}v8`} stroke={P.woodDark} strokeWidth=".8" />
                <rect x={x} y={y - 2} width="30" height="2.6" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
                {summer ? (
                  <path d={`M${x} ${y - 2}Q${x + 15} ${y - 7} ${x + 30} ${y - 2}`} fill={P.glass} stroke={P.stoneLight} strokeWidth=".3" opacity=".9" />
                ) : (
                  Array.from({ length: 9 }, (_, k) => <circle key={k} cx={x + 2.4 + k * 3.2} cy={y - 2.4} r="1" fill={load} />)
                )}
              </g>
            )
          })}
          {summer ? <Rain n={7} y0={6} /> : null}
          {tier >= 5 ? <Farmer x={72} y={70} c={P.berry} s={0.6} hat={P.white} skirt={P.charcoal} /> : null}
        </Svg>
      )
    }
    case 'ensetegarten': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Ensete key={i} x={[40, 20, 60, 30, 52][i]!} y={[58, 64, 64, 70, 70][i]!} s={[1.4, 1.1, 1.1, 0.95, 0.95][i]!} season={season} />
          ))}
          {tier >= 5 ? <Farmer x={70} y={72} c={P.blue} s={0.6} hat={P.white} skirt={P.berry} /> : null}
        </Svg>
      )
    }
    case 'honigbaeume': {
      const hives = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <path d="M40 64V16M40 40L22 26M40 32L58 20M40 50L60 38" stroke={P.bark} strokeWidth="2.2" strokeLinecap="round" />
          <ellipse cx="24" cy="20" rx="12" ry="6" fill={winter ? P.winterLeafDark : P.leafDark} />
          <ellipse cx="54" cy="16" rx="13" ry="6" fill={winter ? P.winterLeaf : P.leaf} />
          <ellipse cx="40" cy="12" rx="9" ry="5" fill={winter ? P.winterLeafDark : P.leafMoss} />
          {z === 'spring' ? [18, 28, 50, 58, 42].map((x, i) => <circle key={x} cx={x} cy={16 + (i % 2) * 6} r="1" fill={P.white} />) : null}
          {Array.from({ length: hives }, (_, i) => (
            <g key={i}>
              <path d={`M${[28, 52, 54, 32, 46][i]} ${[29, 23, 41, 34, 46][i]}v2`} stroke={P.woodDark} strokeWidth=".4" />
              <BarkHive x={[28, 52, 54, 32, 46][i]!} y={[32.4, 26.4, 44.4, 37.4, 49.4][i]!} s={1} />
            </g>
          ))}
          {Array.from({ length: hives + 1 }, (_, i) => (
            <ellipse key={`b${i}`} cx={20 + ((i * 13) % 44)} cy={44 + ((i * 7) % 12)} rx=".8" ry=".55" fill={P.yellow} stroke={P.ink} strokeWidth=".2" />
          ))}
          {tier >= 5 ? <Farmer x={70} y={70} c={P.white} s={0.6} hat={P.white} /> : null}
        </Svg>
      )
    }
    case 'waschplatz': {
      const sacks = Math.min(3, tier - 1)
      return (
        <Svg tier={tier}>
          <Floor season={season} cy={58} ry={15} />
          <WaterBand y={46} h={winter ? 6 : 10} x0={0} x1={80} />
          <rect x="20" y="52" width="26" height="8" rx="1" fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".4" />
          <rect x="22" y="53.4" width="22" height="5" fill={P.water} />
          {Array.from({ length: tier + 2 }, (_, i) => (
            <circle key={i} cx={24 + ((i * 7) % 18)} cy={55 + (i % 2) * 2} r=".9" fill={i % 3 ? cherry(z) : P.woodLight} />
          ))}
          {Array.from({ length: Math.max(0, sacks) }, (_, i) => (
            <Sack key={i} x={56 + i * 7} y={68} top={cherry(z)} />
          ))}
          {tier >= 4 ? <Farmer x={50} y={62} c={P.leafDark} s={0.6} hat={P.white} skirt={P.blue} /> : null}
          {tier >= 5 ? <path d="M12 52q4 -6 8 0" stroke={P.woodDark} strokeWidth="1" fill="none" /> : null}
          {summer ? <Rain n={6} y0={4} /> : null}
        </Svg>
      )
    }
    case 'tukul':
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <Tukul x={36} y={62} s={1.4} lit={winter} />
          {tier >= 2 ? <Ensete x={64} y={64} s={0.9} season={season} /> : null}
          {tier >= 3 ? <path d="M48 71h14M50 71v-5M54 71v-5M58 71v-5M48 68h14" stroke={P.woodDark} strokeWidth=".6" /> : null}
          {tier >= 4 ? <Tukul x={16} y={50} s={0.6} /> : null}
          {tier >= 5 ? <Farmer x={26} y={72} c={P.white} s={0.6} hat={P.white} skirt={P.leafDark} /> : null}
          {summer ? <Rain n={5} y0={4} /> : null}
        </Svg>
      )
    case 'roestpfanne':
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <g transform="translate(40 60) scale(1.5) translate(-40 -60)">
          <path d="M30 64l4 -5h12l4 5z" fill={P.stoneDark} />
          {tier >= 2 ? <Fire x={40} y={60} s={0.24} /> : null}
          <ellipse cx="40" cy="56" rx="10" ry="2.2" fill={P.charcoal} stroke={P.ink} strokeWidth=".3" />
          <path d="M50 56h8" stroke={P.charcoal} strokeWidth="1" strokeLinecap="round" />
          {Array.from({ length: 4 + tier }, (_, i) => (
            <ellipse key={i} cx={33 + ((i * 5) % 14)} cy={55.6 - (i % 2) * 0.4} rx=".9" ry=".55" fill={tier >= 3 ? P.woodDark : P.leafPale} />
          ))}
          </g>
          {tier >= 3 ? <path className="smoke" d="M40 50c-2 -3 2 -5 0 -8c-2 -3 2 -5 0 -8" stroke={P.white} strokeWidth="1.2" fill="none" /> : null}
          {tier >= 4 ? <Jebena x={66} y={70} s={1.5} /> : null}
          {tier >= 5 ? <Farmer x={20} y={66} c={P.white} s={0.7} hat={P.white} skirt={P.berry} /> : null}
          {summer ? <Rain n={4} x0={60} x1={76} y0={4} /> : null}
        </Svg>
      )
    case 'kaffeezeremonie': {
      const cups = 2 + tier
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <Patch fill={P.leafLight} cy={62} rx={32} ry={8} />
          <g transform="translate(40 62) scale(1.45) translate(-40 -62)">
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={`M${18 + i * 4} 63l1 -2`} stroke={P.leafDark} strokeWidth=".5" />
          ))}
          <rect x="30" y="56" width="20" height="3" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" />
          <path d="M32 59v4M48 59v4" stroke={P.woodDark} strokeWidth=".8" />
          {Array.from({ length: cups }, (_, i) => (
            <path key={i} d={`M${31 + (i % 6) * 3.2} ${55.6 - Math.floor(i / 6) * 1.6}h2l-.3 -1.6h-1.4z`} fill={P.white} stroke={P.stone} strokeWidth=".2" />
          ))}
          <Jebena x={56} y={64} s={1.2} />
          {tier >= 2 ? <path className="smoke" d="M24 58c-1.4 -2 1.4 -3.4 0 -6" stroke={P.stoneLight} strokeWidth=".8" fill="none" /> : null}
          {tier >= 2 ? <path d="M22 60h4l-.6 -2h-2.8z" fill={P.terracotta} /> : null}
          </g>
          {tier >= 3 ? <Farmer x={70} y={64} c={P.white} s={0.8} hat={P.white} skirt={P.leafDark} /> : null}
          {tier >= 4 ? (
            <g>
              <ellipse cx="40" cy="70" rx="5" ry="1.6" fill={P.woodLight} />
              {[37, 39.2, 41.4, 43, 38.4, 40.8].map((x, i) => (
                <circle key={i} cx={x} cy={i < 4 ? 69.2 : 68.2} r=".9" fill={P.cream} />
              ))}
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={18} y={72} c={P.blue} s={0.8} hat={P.charcoal} /> : null}
        </Svg>
      )
    }
    case 'kaffeemarkt': {
      const sacks = 1 + tier
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <path d="M12 44h56l-4 -6h-48z" fill={P.terracottaLight} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M14 44v20M66 44v20" stroke={P.woodDark} strokeWidth=".8" />
          {Array.from({ length: sacks }, (_, i) => (
            <Sack key={i} x={i < 4 ? 19 + i * 8 : 23 + (i - 4) * 8} y={i < 4 ? 62 : 70} top={[P.leafPale, P.soilDark, P.berry, P.woodDark][i % 4]} />
          ))}
          {tier >= 3 ? <path d="M48 55h16M49 55v7M63 55v7" stroke={P.woodDark} strokeWidth="1" /> : null}
          {tier >= 3
            ? [52, 56, 60].map((x) => (
                <g key={x}>
                  <rect x={x - 1.4} y="51" width="2.8" height="4" fill={P.honey} stroke={P.outlineWood} strokeWidth=".2" />
                  <rect x={x - 1.4} y="50.2" width="2.8" height=".8" fill={P.woodDark} />
                </g>
              ))
            : null}
          {tier >= 4 ? <Farmer x={70} y={70} c={P.berry} s={0.65} hat={P.white} skirt={P.charcoal} /> : null}
          {tier >= 5 ? <Farmer x={30} y={72} c={P.white} s={0.65} hat={P.woodLight} /> : null}
          {summer ? <Rain n={5} y0={4} /> : null}
        </Svg>
      )
    }
  }
  return null
}
