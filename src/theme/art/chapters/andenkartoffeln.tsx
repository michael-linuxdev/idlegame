/**
 * Kapitel 30 — Andenkartoffeln im kräftigen Stil (2026-11-14, Weinberg-Niveau):
 * Terrassen, Beete, Quinoa, Chuño-Matten, Speicher, Kanal und Webstuhl mit
 * Kontur; Lehmhäuser, Alpakas, Pflanzen und Tukul behalten ihre Zeichnung
 * (Kontur über hand-art). Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Farmer } from './figures'
import type { AreaProps } from './partsB'
import { StringLights } from './partsC'
import { Fire } from './partsD'
import { AdobeHouse, Alpaca, Frost, PotatoPlant, Tukul } from './partsF'
import { ssn } from './season'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

const TUBERS = [P.plum, P.berry, P.yellow, P.terracottaLight, P.lilac, P.cream, P.woodMid]

/** Hochlandboden: Frühling hellgrün, Sommer grün, Herbst braun, Winter grau mit Reif. */
function Puna({ season, cy = 60, rx = 36, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const fill = z === 'winter' ? P.stoneLight : z === 'autumn' ? P.woodLight : z === 'spring' ? P.leaf : P.leafDark
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={fill} {...line} />
      <path d={`M${40 - rx * 0.6} ${cy - ry * 0.45}q${rx * 0.5} ${-ry * 0.35} ${rx * 1.1} 0`} stroke={P.white} strokeWidth=".9" fill="none" strokeLinecap="round" opacity=".25" />
      {z === 'winter' ? <Old><Frost cy={cy} w={rx * 1.6} /></Old> : null}
    </g>
  )
}

/** Gefleckte Knolle. */
function Tuber({ x, y, c, r = 1.4 }: { x: number; y: number; c: string; r?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.75} fill={c} stroke={P.outline} strokeWidth={D * 0.8} />
      <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.18} fill={P.paper} opacity=".7" />
    </g>
  )
}

/** Quinoa: Stängel mit großer Rispe (Frühling grün und klein, Sommer grün-rosa, Herbst rot/gold, Winter Stoppel). */
function Quinoa({ x, y, s = 1, season, c }: { x: number; y: number; s?: number; season?: string; c: string }) {
  const z = ssn(season)
  if (z === 'winter')
    return (
      <g>
        <path d={`M${x} ${y}v-3.4M${x + 1.2} ${y}v-2.6M${x - 1.2} ${y}v-2`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
        <path d={`M${x} ${y}v-3.4M${x + 1.2} ${y}v-2.6M${x - 1.2} ${y}v-2`} stroke={P.woodMid} strokeWidth=".9" strokeLinecap="round" />
      </g>
    )
  const k = z === 'spring' ? 0.55 : 1
  const head = z === 'autumn' ? c : z === 'summer' ? P.pink : P.leafPale
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <path d="M0 0V-12M0 -5l-3 -1.6M0 -8l3 -1.4" stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
      <path d="M0 0V-12M0 -5l-3 -1.6M0 -8l3 -1.4" stroke={P.leafDark} strokeWidth=".9" strokeLinecap="round" />
      <ellipse cx="-2.6" cy="-6.4" rx="1.5" ry=".9" fill={P.leaf} stroke={P.outline} strokeWidth={H * 0.8} />
      <ellipse cx="2.6" cy="-9.2" rx="1.5" ry=".9" fill={P.leaf} stroke={P.outline} strokeWidth={H * 0.8} />
      <path d="M0 -10Q-2.6 -14 0 -19Q2.6 -14 0 -10z" fill={head} {...detail} />
      <path d="M0 -12l-1.4 -1M0 -14l1.4 -1M0 -16l-1 -.8" stroke={P.paper} strokeWidth=".3" opacity=".6" />
    </g>
  )
}

export function Andenkartoffeln({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  switch (id) {
    case 'andenes': {
      const rows = 1 + tier
      const soil = winter ? P.woodLight : z === 'autumn' ? P.woodMid : P.soil
      return (
        <Svg tier={tier} bold>
          <Puna season={season} cy={62} ry={11} />
          {Array.from({ length: rows }, (_, k) => {
            const i = rows - 1 - k
            const y = 70 - i * 7
            const w = 68 - i * 6
            return (
              <g key={i}>
                <path d={`M${40 - w / 2} ${y - 4}Q40 ${y - 9} ${40 + w / 2} ${y - 4}V${y - 1}Q40 ${y - 6} ${40 - w / 2} ${y - 1}z`} fill={soil} stroke={P.outline} strokeWidth={D} strokeLinejoin="round" />
                {Array.from({ length: Math.max(2, Math.round(w / 13)) }, (_, j) => (
                  <PotatoPlant key={j} x={40 - w / 2 + 7 + j * 12} y={y - 4.4 - (j > 0 && j < Math.round(w / 13) - 1 ? 1.6 : 0)} s={0.8} season={season} />
                ))}
                <path d={`M${40 - w / 2} ${y - 1}Q40 ${y - 6} ${40 + w / 2} ${y - 1}`} stroke={P.outline} strokeWidth="4.4" fill="none" strokeLinecap="round" />
                <path d={`M${40 - w / 2} ${y - 1}Q40 ${y - 6} ${40 + w / 2} ${y - 1}`} stroke={P.stone} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d={`M${40 - w / 2} ${y - 1}Q40 ${y - 6} ${40 + w / 2} ${y - 1}`} stroke={P.stoneDark} strokeWidth="2.6" strokeDasharray="2 .6" fill="none" />
              </g>
            )
          })}
          {tier >= 5 ? <Farmer x={72} y={66} c={P.berry} skirt={P.charcoal} s={0.65} /> : null}
        </Svg>
      )
    }
    case 'sortenbeet': {
      const rows = Math.min(4, tier)
      const harvest = z === 'autumn' || winter
      return (
        <Svg tier={tier} bold>
          <Puna season={season} />
          <rect x="10" y="40" width="58" height="28" rx="3" fill={P.soil} {...line} />
          <path d="M12 42.4h54" stroke={P.outline} strokeWidth="1.2" strokeLinecap="round" opacity=".15" />
          {Array.from({ length: rows }, (_, r) => (
            <g key={r}>
              <path d={`M13 ${47 + r * 6.4}h52`} stroke={P.soilDark} strokeWidth=".9" strokeLinecap="round" />
              {Array.from({ length: 5 }, (_, j) =>
                harvest ? (
                  <Tuber key={j} x={17 + j * 11} y={46 + r * 6.4} c={TUBERS[(r * 3 + j) % TUBERS.length]!} r={2} />
                ) : (
                  <Old key={j}><PotatoPlant x={17 + j * 11} y={47 + r * 6.4} s={0.85} season={season} flower={TUBERS[(r + j) % 5]} /></Old>
                ),
              )}
            </g>
          ))}
          {tier >= 3 ? (
            <g>
              <path d="M66 70h10l-1.4 -5h-7.2z" fill={P.woodLight} {...detail} />
              {[68, 70.4, 72.8, 69.4, 71.8].map((x, i) => (
                <Tuber key={i} x={x} y={i < 3 ? 64.6 : 63.4} c={TUBERS[i + 1]!} r={1.1} />
              ))}
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <Post x={5} y={47} h={9} w={1.4} k={K} />
              <Post x={10} y={47} h={9} w={1.4} k={K} />
              <rect x="3.4" y="37.6" width="8.2" height="5" rx=".6" fill={P.paper} {...detail} />
              <path d="M5 39.4h5M5 41.4h4" stroke={P.woodDark} strokeWidth=".6" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={73} y={58} c={P.blue} s={0.6} skirt={P.berry} /> : null}
        </Svg>
      )
    }
    case 'quinoafeld': {
      const n = 3 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Puna season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Quinoa key={i} x={14 + ((i * 23) % 54)} y={55 + (i % 3) * 5} s={1.1} season={season} c={[P.berry, P.gold, P.orange, P.plum][i % 4]!} />
          ))}
          {winter && tier >= 3 ? (
            <g>
              <path d="M57 67H73" stroke={P.outline} strokeWidth="1.4" strokeLinecap="round" opacity=".18" />
              <path d="M58 66l3 -9l3 9z" fill={P.gold} {...detail} />
              <path d="M66 66l3 -9l3 9z" fill={P.berry} {...detail} />
              <path d="M59.6 62h2.8M67.6 62h2.8" stroke={P.woodDark} strokeWidth=".8" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={70} y={70} c={P.orange} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'chunoplatz': {
      const rows = Math.min(4, tier)
      const ground = winter ? P.stoneLight : z === 'autumn' ? P.woodLight : P.leafPale
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="60" rx="36" ry="10" fill={ground} {...line} />
          {winter ? <Old><Frost n={14} /></Old> : null}
          {Array.from({ length: rows }, (_, r) => (
            <g key={r}>
              <rect x="12" y={49 + r * 5} width="50" height="4" rx="1" fill={winter ? P.woodLight : P.paper} stroke={P.outline} strokeWidth={D} />
              {Array.from({ length: 7 }, (_, j) => (
                <ellipse key={j} cx={16 + j * 7 + (r % 2) * 2} cy={51 + r * 5} rx="2.2" ry="1.4" fill={winter ? (j % 3 ? P.charcoal : P.white) : z === 'autumn' ? P.terracottaLight : P.woodMid} stroke={P.outline} strokeWidth={D * 0.8} />
              ))}
            </g>
          ))}
          {winter ? (
            <g>
              <path d="M12 46l4 -6l4 6M60 46l5 -8l5 8" stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 46l4 -6l4 6M60 46l5 -8l5 8" stroke={P.white} strokeWidth=".9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : null}
          {tier >= 3 ? <Farmer x={50} y={70} c={P.tomato} s={0.6} skirt={P.charcoal} /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M62 70q-2 -6 0 -8h5q2 2 0 8z" fill={P.paper} {...detail} />
              <path d="M69 70q-2 -5 0 -7h4q2 2 0 7z" fill={P.paper} {...detail} />
              <path d="M62.4 64h4.2M69.4 64.8h3.2" stroke={P.woodMid} strokeWidth=".7" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={26} y={70} c={P.blue} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'lehmspeicher': {
      const n = Math.min(3, tier)
      return (
        <Svg tier={tier} bold>
          <Puna season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Old key={i}><Tukul x={[40, 22, 58][i]!} y={[62, 64, 64][i]!} s={[1.1, 0.85, 0.85][i]!} wall={P.stoneLight} roof={P.woodLight} door={P.charcoal} /></Old>
          ))}
          {tier >= 4
            ? [14, 66].map((x) => (
                <g key={x}>
                  <path d={`M${x - 1} 63l1 -2.4l1 2.4`} stroke={P.outline} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={`M${x - 1} 63l1 -2.4l1 2.4`} stroke={P.leaf} strokeWidth=".8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={`M${x - 3} 70q-1.4 -5 0 -7h6q1.4 2 0 7z`} fill={P.paper} {...detail} />
                </g>
              ))
            : null}
          {tier >= 5 ? <Farmer x={70} y={58} c={P.berry} s={0.6} skirt={P.blue} /> : null}
        </Svg>
      )
    }
    case 'alpakaweide': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <Puna season={season} />
          <path d="M6 56Q40 44 74 56" stroke={P.outline} strokeWidth="3.6" fill="none" strokeLinecap="round" />
          <path d="M6 56Q40 44 74 56" stroke={P.stone} strokeWidth="2.4" strokeDasharray="2 .8" fill="none" />
          {Array.from({ length: n }, (_, i) => (
            <Old key={i}><Alpaca x={[32, 50, 20, 62, 42][i]!} y={[60, 62, 68, 68, 70][i]!} s={[1, 1, 0.9, 0.9, 0.85][i]!} flip={i % 2 === 1} c={[P.cream, P.woodMid, P.white, P.charcoal, P.terracottaLight][i]} /></Old>
          ))}
          {tier >= 5 ? <Farmer x={72} y={58} c={P.tomato} s={0.6} skirt={P.charcoal} /> : null}
        </Svg>
      )
    }
    case 'bergkanal': {
      const water = winter ? 1.2 : z === 'spring' ? 2 : 2.8
      const segs = ['M10 40Q30 46 26 54', 'M26 54Q22 62 44 62', 'M44 62Q64 62 62 70', 'M44 62Q50 56 70 54']
      return (
        <Svg tier={tier} bold>
          <Puna season={season} cy={58} ry={13} />
          <path d="M2 40L14 24L24 36L34 28L44 40z" fill={P.stone} {...line} />
          <path d="M14 24L24 36L19 40H14z" fill={P.outline} opacity=".14" />
          <path d="M10 29l4 -5l3 4M30 31l4 -3l3 3" stroke={P.white} strokeWidth="1.4" fill="none" />
          {segs.slice(0, Math.min(4, tier)).map((d, i) => (
            <g key={i}>
              <path d={d} stroke={P.outline} strokeWidth="6.4" fill="none" strokeLinecap="round" />
              <path d={d} stroke={P.stoneDark} strokeWidth="4.8" fill="none" strokeLinecap="round" />
              <path d={d} stroke={winter ? P.glass : P.water} strokeWidth={water} fill="none" strokeLinecap="round" />
            </g>
          ))}
          {tier >= 3 ? (
            <g>
              <rect x="42" y="58" width="4" height="5" rx=".5" fill={P.woodDark} {...detail} />
              <path d="M42.8 59.6h2.4" stroke={P.woodLight} strokeWidth=".6" strokeLinecap="round" opacity=".6" />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={70} y={66} c={P.leafDark} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'webstube': {
      const skeins = tier + 1
      return (
        <Svg tier={tier} bold>
          <Puna season={season} />
          <Old><AdobeHouse x={8} y={60} w={26} h={16} thatch lit={winter} /></Old>
          <path d="M44 66V44M68 66V44M42 44h28" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M44 66V44M68 66V44M42 44h28" stroke={P.woodMid} strokeWidth="1.3" strokeLinecap="round" />
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <rect key={i} x="46" y={46 + i * 4.4} width="20" height="4" fill={[P.berry, P.orange, P.blue, P.yellow][i]} stroke={P.outline} strokeWidth={D} />
          ))}
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <path key={`z${i}`} d={`M47 ${48 + i * 4.4}l3 -1.4l3 1.4l3 -1.4l3 1.4l3 -1.4l3 1.4`} stroke={P.white} strokeWidth=".4" fill="none" />
          ))}
          {Array.from({ length: skeins }, (_, i) => (
            <ellipse key={`s${i}`} cx={16 + i * 4.4} cy="67" rx="1.8" ry="1.3" fill={[P.tomato, P.yellow, P.blue, P.leafDark, P.plum, P.orange][i % 6]} stroke={P.outline} strokeWidth={H * 0.8} />
          ))}
          {tier >= 5 ? <Farmer x={72} y={70} c={P.plum} s={0.6} skirt={P.tomato} /> : null}
        </Svg>
      )
    }
    case 'kartoffelpark': {
      const plots = Math.min(6, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Puna season={season} cy={58} ry={15} />
          {Array.from({ length: plots }, (_, i) => {
            const x = 8 + (i % 3) * 18
            const y = 44 + Math.floor(i / 3) * 12
            return (
              <g key={i}>
                <path d={`M${x} ${y + 9}l2 -9h14l2 9z`} fill={P.soil} {...line} />
                <Old><PotatoPlant x={x + 6} y={y + 6} s={0.7} season={season} flower={TUBERS[i % 5]} /></Old>
                <Old><PotatoPlant x={x + 12} y={y + 6} s={0.7} season={season} flower={TUBERS[(i + 2) % 5]} /></Old>
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <Post x={70} y={52} h={11} w={1.6} k={K} />
              <rect x="64" y="36" width="12" height="6" rx="1" fill={P.paper} {...detail} />
              {[66, 69, 72].map((x, i) => (
                <circle key={x} cx={x} cy="39" r=".9" fill={TUBERS[i]} stroke={P.outline} strokeWidth={H * 0.6} />
              ))}
            </g>
          ) : null}
          {tier >= 4 ? <Old><AdobeHouse x={62} y={70} w={13} h={9} thatch /></Old> : null}
          {tier >= 5 ? <Farmer x={40} y={72} c={P.berry} s={0.6} skirt={P.charcoal} /> : null}
        </Svg>
      )
    }
    case 'kartoffelfest': {
      const guests = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <Puna season={season} />
          <path d="M28 62q2 -12 12 -12q10 0 12 12z" fill={P.soil} {...line} />
          <path d="M32 55q2.4 -4 7 -4.4" stroke={P.white} strokeWidth=".8" fill="none" strokeLinecap="round" opacity=".3" />
          {[31, 36, 41, 46, 33, 39, 44].map((x, i) => (
            <circle key={i} cx={x} cy={i < 4 ? 59 : 54.6} r="2.2" fill={i % 2 ? P.soilDark : P.woodMid} stroke={P.outline} strokeWidth={H * 0.8} />
          ))}
          {tier >= 2 ? <Old><Fire x={40} y={63} s={0.25} /></Old> : null}
          {tier >= 3 ? <path className="smoke" d="M40 48c-2 -3 2 -5 0 -8" stroke={P.white} strokeWidth="1.2" fill="none" /> : null}
          {Array.from({ length: guests }, (_, i) => (
            <Farmer key={i} x={[16, 64, 22, 58, 70][i]!} y={[64, 64, 72, 72, 70][i]!} c={[P.berry, P.blue, P.orange, P.leafDark, P.plum][i]!} s={0.75} skirt={i % 2 ? undefined : P.charcoal} />
          ))}
          {Array.from({ length: guests + 1 }, (_, i) => (
            <Tuber key={`t${i}`} x={32 + i * 3.4} y={68} c={TUBERS[i % TUBERS.length]!} r={1.2} />
          ))}
          {tier >= 4 ? <Old><StringLights x0={6} x1={74} y={30} lit={winter || tier >= 5} /></Old> : null}
        </Svg>
      )
    }
  }
  return null
}
