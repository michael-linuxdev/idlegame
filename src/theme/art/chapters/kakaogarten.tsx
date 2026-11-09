/**
 * Kapitel-Grafik Kapitel 36: Kakaogarten in Ghana (Ashanti-Region).
 * Jahreszeiten nach dem Kakao-Jahr: Frühling = erster Regen, Blüten am
 * Stamm; Sommer = große Regenzeit (Regen, grüne Schoten, Pfützen); Herbst =
 * Hauptsaison (Schoten gelb, orange, rot; Ernte); Winter = Harmattan
 * (trockener Staubwind, Laub matt, Bohnen trocknen).
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { P } from '../palette'
import type { AreaProps } from './partsB'
import { Farmer, Patch, Rain, ShadeTree } from './partsF'
import { BananaPlant, CacaoTree } from './partsG'
import { ssn } from './season'

/** Boden: Frühling rotbraun, Sommer nass und grün, Herbst Laub, Winter staubig hell. */
function Floor({ season, cy = 60, rx = 36, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const fill = z === 'spring' ? P.soil : z === 'summer' ? P.leafMoss : z === 'autumn' ? P.woodMid : P.woodLight
  return (
    <g>
      <Patch fill={fill} cy={cy} rx={rx} ry={ry} />
      {z === 'summer' ? <ellipse cx={40 + rx * 0.4} cy={cy + 2} rx="5" ry="1.4" fill={P.water} opacity=".8" /> : null}
      {z === 'autumn' ? [-0.5, -0.1, 0.3].map((d) => <ellipse key={d} cx={40 + rx * d} cy={cy + 3} rx="1.2" ry=".5" fill={P.autumn} />) : null}
      {z === 'winter' ? <ellipse cx={40} cy={cy - 2} rx={rx * 0.9} ry={ry * 0.6} fill={P.cream} opacity=".35" /> : null}
    </g>
  )
}

/** Bohnenfarbe: frisch weiß (mit Fruchtfleisch), fermentiert braun. */
function bean(z: string) {
  return z === 'winter' ? P.woodDark : z === 'autumn' ? P.cream : P.wood
}

/** Jutesack (Fußpunkt Mitte unten). */
function Sack({ x, y, top }: { x: number; y: number; top?: string }) {
  return (
    <g>
      <path d={`M${x - 3} ${y}q-1.4 -5 0 -7h6q1.4 2 0 7z`} fill={P.paper} stroke={P.outlineSoft} strokeWidth=".3" />
      <path d={`M${x - 1.6} ${y - 4}h3.2`} stroke={P.leafDark} strokeWidth=".5" />
      {top ? <ellipse cx={x} cy={y - 7} rx="2.6" ry=".8" fill={top} /> : null}
    </g>
  )
}

/** Gärhaufen auf Bananenblättern (Mitte unten). */
function Heap({ x, y, s = 1, z }: { x: number; y: number; s?: number; z: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="9" ry="2.4" fill={P.leaf} stroke={P.leafDark} strokeWidth=".3" />
      <path d="M-7 0Q-7 -7 0 -7Q7 -7 7 0z" fill={bean(z)} stroke={P.outlineSoft} strokeWidth=".25" />
      {[-4, -1.6, 1, 3.4].map((dx) => <circle key={dx} cx={dx} cy={-1.2} r=".7" fill={P.cream} stroke={P.outlineSoft} strokeWidth=".1" />)}
      <path d="M-7.6 -1Q-8 -8 1 -7.6Q-1 -4 -4.6 -2.4z" fill={P.leafLight} stroke={P.leafDark} strokeWidth=".25" />
      <path d="M7.6 -1Q8 -8 -1 -7.6Q1 -4 4.6 -2.4z" fill={P.leaf} stroke={P.leafDark} strokeWidth=".25" />
      <path d="M-7 -2Q-4 -7 0 -7.4M7 -2Q4 -7 0 -7.4" stroke={P.leafDark} strokeWidth=".3" fill="none" />
    </g>
  )
}

/** Kente-Wimpel: schmale bunte Streifen. */
function KenteFlag({ x, y, i }: { x: number; y: number; i: number }) {
  const c = [P.gold, P.leafDark, P.berry, P.charcoal]
  return (
    <g>
      <path d={`M${x - 2} ${y}h4l-2 4z`} fill={c[i % 4]} />
      <path d={`M${x - 1} ${y + 0.8}h2`} stroke={c[(i + 1) % 4]} strokeWidth=".5" />
    </g>
  )
}

export function Kakaogarten({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const summer = z === 'summer'
  const winter = z === 'winter'
  switch (id) {
    case 'kakaobaeume': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <CacaoTree key={i} x={[40, 20, 60, 30, 52][i]!} y={[56, 62, 62, 69, 69][i]!} s={[1.9, 1.5, 1.5, 1.25, 1.25][i]!} season={season} pods={5} />
          ))}
          {summer ? <Rain n={6} y0={2} /> : null}
          {tier >= 5 ? <Farmer x={72} y={70} c={P.gold} s={0.6} hat={P.charcoal} skirt={P.leafDark} /> : null}
        </Svg>
      )
    }
    case 'bananenschatten': {
      const n = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <BananaPlant key={i} x={[18, 62, 40, 28][i]!} y={[60, 60, 56, 68][i]!} s={[1.5, 1.5, 1.6, 1.2][i]!} season={season} fruit={i % 2 === 0} />
          ))}
          {Array.from({ length: tier + 1 }, (_, i) => (
            <CacaoTree key={`c${i}`} x={[34, 48, 24, 56, 44, 66][i]!} y={[70, 70, 72, 72, 66, 70][i]!} s={0.55} season={season} pods={0} />
          ))}
          {summer ? <Rain n={5} y0={2} /> : null}
        </Svg>
      )
    }
    case 'fermentation': {
      const heaps = Math.min(3, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: heaps }, (_, i) => (
            <Heap key={i} x={[24, 54, 38][i]!} y={[60, 58, 69][i]!} s={1.8} z={z} />
          ))}
          {tier >= 4
            ? [60, 70].map((x) => (
                <g key={x}>
                  <rect x={x - 4} y="64" width="8" height="6" fill={P.wood} stroke={P.outlineWood} strokeWidth=".3" />
                  <path d={`M${x - 4} 66h8M${x - 4} 68h8`} stroke={P.woodDark} strokeWidth=".3" />
                  <ellipse cx={x} cy="64" rx="3.6" ry=".7" fill={bean(z)} />
                </g>
              ))
            : null}
          {tier >= 5 ? <Farmer x={14} y={70} c={P.berry} s={0.6} hat={P.gold} skirt={P.leafDark} /> : null}
          {summer ? <Rain n={5} y0={2} /> : null}
        </Svg>
      )
    }
    case 'trockengestelle': {
      const racks = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: racks }, (_, i) => {
            const x = 8 + (i % 2) * 34
            const y = 50 + Math.floor(i / 2) * 12
            return (
              <g key={i}>
                <path d={`M${x + 2} ${y}v8M${x + 28} ${y}v8M${x + 15} ${y}v8`} stroke={P.woodDark} strokeWidth=".8" />
                <rect x={x} y={y - 2} width="30" height="2.4" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
                <path d={`M${x + 2} ${y - 0.8}h26`} stroke={P.wood} strokeWidth=".3" strokeDasharray="1 .6" />
                {summer ? (
                  <path d={`M${x} ${y - 2}Q${x + 15} ${y - 7} ${x + 30} ${y - 2}`} fill={P.glass} stroke={P.stoneLight} strokeWidth=".3" opacity=".9" />
                ) : (
                  Array.from({ length: 10 }, (_, k) => <ellipse key={k} cx={x + 2 + k * 2.9} cy={y - 2.4} rx="1" ry=".6" fill={z === 'spring' ? P.woodMid : P.woodDark} />)
                )}
              </g>
            )
          })}
          {summer ? <Rain n={7} y0={4} /> : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.leafDark} s={0.6} hat={P.charcoal} skirt={P.gold} /> : null}
        </Svg>
      )
    }
    case 'kochbananen': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <BananaPlant key={i} x={[40, 20, 60, 30, 52][i]!} y={[58, 63, 63, 70, 70][i]!} s={[1.6, 1.3, 1.3, 1.1, 1.1][i]!} season={season} plantain />
          ))}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.berry} s={0.6} hat={P.gold} skirt={P.blue} /> : null}
          {summer ? <Rain n={5} y0={2} /> : null}
        </Svg>
      )
    }
    case 'yamsfeld': {
      const mounds = tier + 1
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: mounds }, (_, i) => {
            const x = 16 + (i % 3) * 22
            const y = 56 + Math.floor(i / 3) * 12
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx="7" ry="3.2" fill={P.soil} stroke={P.soilDark} strokeWidth=".3" />
                <path d={`M${x} ${y - 2}V${y - 16}`} stroke={P.woodMid} strokeWidth=".8" />
                {winter ? null : (
                  <path d={`M${x} ${y - 2}q-2 -3 0 -5q2 -3 0 -5`} stroke={z === 'autumn' ? P.gold : P.leafDark} strokeWidth=".7" fill="none" />
                )}
                {z === 'summer' || z === 'spring'
                  ? [-4, -8, -11].map((dy) => <path key={dy} d={`M${x} ${y + dy}q1.6 -1 2.4 .4q-1.2 1 -2.4 -.4z`} fill={P.leaf} />)
                  : null}
                {z === 'autumn' ? <ellipse cx={x + 6} cy={y + 1.6} rx="3" ry="1.2" fill={P.woodDark} stroke={P.outlineWood} strokeWidth=".2" /> : null}
              </g>
            )
          })}
          {summer ? <Rain n={5} y0={2} /> : null}
        </Svg>
      )
    }
    case 'dorfplatz':
      return (
        <Svg tier={tier}>
          <Patch fill={winter ? P.woodLight : P.terracottaLight} cy={60} rx={36} ry={10} />
          <ShadeTree x={40} y={58} s={2.2} season={season} />
          {tier >= 2 ? <path d="M18 64h14M20 64v3M30 64v3" stroke={P.woodDark} strokeWidth="1.2" /> : null}
          {tier >= 3 ? <path d="M48 66h14M50 66v3M60 66v3" stroke={P.woodDark} strokeWidth="1.2" /> : null}
          {tier >= 3 ? <Farmer x={24} y={64} c={P.gold} s={0.6} hat={P.charcoal} /> : null}
          {tier >= 4 ? <Farmer x={56} y={66} c={P.berry} s={0.6} hat={P.charcoal} skirt={P.leafDark} /> : null}
          {tier >= 5 ? <Farmer x={40} y={70} c={P.blue} s={0.6} hat={P.charcoal} /> : null}
          {Array.from({ length: tier }, (_, i) => (
            <ellipse key={i} cx={12 + i * 14} cy={70} rx="1.4" ry=".6" fill={P.leafDark} />
          ))}
          {summer ? <Rain n={4} y0={2} /> : null}
        </Svg>
      )
    case 'genossenschaft': {
      const sacks = 1 + tier
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <rect x="12" y="38" width="36" height="20" fill={P.cream} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M9 39L30 30L51 39z" fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".4" />
          <path d="M14 36l4 -1.6M22 33l4 -1.6M34 32l4 1.6M42 35l4 1.6" stroke={P.stone} strokeWidth=".4" />
          <rect x="26" y="46" width="8" height="12" fill={P.leafDark} />
          <rect x="15" y="44" width="7" height="5" fill={P.window} stroke={P.woodDark} strokeWidth=".3" />
          {tier >= 2 ? (
            <g>
              <path d="M60 64V46M54 48h12" stroke={P.metal} strokeWidth=".8" />
              <path d="M54 48l-2 5h4zM66 48l-2 5h4z" fill={P.brass} stroke={P.outlineSoft} strokeWidth=".2" />
            </g>
          ) : null}
          {Array.from({ length: sacks }, (_, i) => (
            <Sack key={i} x={i < 3 ? 16 + i * 7 : 46 + (i - 3) * 7} y={i < 3 ? 70 : 72} top={P.woodDark} />
          ))}
          {tier >= 4 ? <Farmer x={70} y={70} c={P.gold} s={0.6} hat={P.charcoal} skirt={P.berry} /> : null}
          {tier >= 5 ? <path d="M40 40h8v4h-8z" fill={P.paper} stroke={P.outlineSoft} strokeWidth=".3" /> : null}
          {summer ? <Rain n={5} y0={2} /> : null}
        </Svg>
      )
    }
    case 'schokowerkstatt': {
      const bars = 2 + tier
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <rect x="10" y="40" width="30" height="20" fill={P.paper} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M7 41L25 32L43 41z" fill={P.roof} stroke={P.outlineWood} strokeWidth=".4" />
          <rect x="21" y="48" width="8" height="12" fill={P.woodDark} />
          <rect x="44" y="58" width="28" height="3" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" />
          <path d="M46 61v8M70 61v8" stroke={P.woodDark} strokeWidth=".8" />
          {Array.from({ length: bars }, (_, i) => (
            <g key={i}>
              <rect x={45 + (i % 6) * 4.4} y={55.6 - Math.floor(i / 6) * 2.4} width="3.6" height="2.2" fill={P.soilDark} stroke={P.compost} strokeWidth=".2" />
              <path d={`M${46.8 + (i % 6) * 4.4} ${55.6 - Math.floor(i / 6) * 2.4}v2.2`} stroke={P.woodDark} strokeWidth=".2" />
            </g>
          ))}
          {tier >= 3 ? (
            <g>
              <path d="M12 70q0 -4 4 -4h6q4 0 4 4z" fill={P.metal} stroke={P.charcoal} strokeWidth=".3" />
              <ellipse cx="19" cy="66" rx="6" ry="1" fill={P.soilDark} />
            </g>
          ) : null}
          {tier >= 4 ? <path className="smoke" d="M19 63c-1 -2 1 -3 0 -5" stroke={P.white} strokeWidth=".7" fill="none" /> : null}
          {tier >= 5 ? <Farmer x={34} y={70} c={P.white} s={0.6} hat={P.white} skirt={P.berry} /> : null}
          {summer ? <Rain n={4} y0={2} /> : null}
        </Svg>
      )
    }
    case 'kakaofest': {
      const flags = 3 + tier * 2
      return (
        <Svg tier={tier}>
          <Patch fill={winter ? P.woodLight : P.terracottaLight} cy={60} rx={36} ry={10} />
          <path d="M6 30Q40 40 74 30" stroke={P.woodDark} strokeWidth=".4" fill="none" />
          {Array.from({ length: flags }, (_, i) => {
            const t = (i + 0.5) / flags
            return <KenteFlag key={i} x={6 + t * 68} y={30 + Math.sin(t * Math.PI) * 6.6} i={i} />
          })}
          <g>
            <path d="M20 66v-8h6v8z" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" />
            <ellipse cx="23" cy="58" rx="3" ry="1" fill={P.paper} stroke={P.outlineSoft} strokeWidth=".3" />
            <path d="M20 62h6" stroke={P.berry} strokeWidth=".6" />
          </g>
          {tier >= 2 ? <Farmer x={36} y={64} c={P.gold} s={0.8} hat={P.charcoal} skirt={P.leafDark} /> : null}
          {tier >= 3 ? <Farmer x={46} y={66} c={P.leafDark} s={0.8} hat={P.charcoal} skirt={P.berry} /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M58 68q0 -4 4 -4h4q4 0 4 4z" fill={P.charcoal} />
              {[61, 64, 67].map((x) => (
                <circle key={x} cx={x} cy={63.6} r="1.4" fill={P.cream} />
              ))}
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={14} y={72} c={P.berry} s={0.8} hat={P.charcoal} /> : null}
        </Svg>
      )
    }
  }
  return null
}
