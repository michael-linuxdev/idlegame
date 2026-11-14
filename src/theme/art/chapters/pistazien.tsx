/**
 * Kapitel 29 — Pistazienhain auf Ägina im kräftigen Stil (2026-11-14,
 * Weinberg-Niveau): Mandelbäume, Kapernsträucher, Kaikis, Terrassen, Röstofen,
 * Zisterne, Marktstand und Festtafel mit Kontur; Pistazienbäume, Kapelle, Häuser
 * und Ziegen behalten ihre Zeichnung. Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Person } from './figures'
import { type AreaProps } from './partsB'
import { StringLights } from './partsC'
import { Fire } from './partsD'
import { Chapel, DryWall, PistachioTree, SmallGoat, WhiteHouse } from './partsE'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Trockener Inselboden: Winter grün (Regenzeit), Frühling Mohn, Sommer staubig, Herbst Ocker. */
function IslandGround({ season, cy = 60, rx = 37, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const fill = season === 'winter' ? P.winterLeafLight : season === 'spring' ? P.leafPale : season === 'summer' ? P.paper : P.woodLight
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={fill} {...line} />
      {season === 'spring' ? [14, 30, 48, 62, 24].map((x, i) => <circle key={x} cx={x} cy={cy - 2 + (i % 3) * 3} r="1" fill={P.tomato} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
    </g>
  )
}

/** Mandelbaum: Frühling weiß-rosa Blüte, Sommer grün mit Mandeln, Herbst gelb, Winter kahl. */
function Almond({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const crown = season === 'spring' ? P.blossom : season === 'autumn' ? P.yellow : P.leaf
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0Q-1 -6 0 -10M0 -8l-5 -5M0 -9l5 -6" stroke={P.outline} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M0 0Q-1 -6 0 -10M0 -8l-5 -5M0 -9l5 -6" stroke={P.bark} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      {season === 'winter' ? (
        <g>
          <path d="M-5 -13l-2 -2M5 -15l1 -3M0 -10l-1 -4" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M-5 -13l-2 -2M5 -15l1 -3M0 -10l-1 -4" stroke={P.bark} strokeWidth=".8" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx="-3" cy="-15" rx="5.4" ry="4.4" fill={crown} {...line} />
          <ellipse cx="3.6" cy="-16" rx="5.4" ry="4.4" fill={crown} {...line} />
          <path d="M-3 -12.4q3.4 1.6 7 -.4" stroke={P.outline} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".15" />
          <path d="M-6 -16.4q1.4 -2.2 3.6 -2.4" stroke={P.white} strokeWidth=".8" fill="none" strokeLinecap="round" opacity=".45" />
          {season === 'spring'
            ? [
                [-4, -16],
                [2, -18],
                [5, -14],
              ].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r=".9" fill={P.white} stroke={P.outline} strokeWidth={H * 0.5} />)
            : null}
          {season === 'summer' ? [-3, 2].map((dx) => <ellipse key={dx} cx={dx} cy={-13} rx=".9" ry="1.2" fill={P.leafPale} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
        </g>
      )}
    </g>
  )
}

/** Kapernstrauch aus einer Mauerfuge. */
function Caper({ x, y, season }: { x: number; y: number; season?: string }) {
  if (season === 'winter')
    return (
      <g>
        <path d={`M${x} ${y}q-3 -1 -5 1M${x} ${y}q3 -1 5 1`} stroke={P.outline} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d={`M${x} ${y}q-3 -1 -5 1M${x} ${y}q3 -1 5 1`} stroke={P.winterLeafDark} strokeWidth=".8" fill="none" strokeLinecap="round" />
      </g>
    )
  return (
    <g>
      <path d={`M${x} ${y}q-4 -3 -7 0M${x} ${y}q4 -3 7 0M${x} ${y}q0 -4 -1 -6`} stroke={P.outline} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d={`M${x} ${y}q-4 -3 -7 0M${x} ${y}q4 -3 7 0M${x} ${y}q0 -4 -1 -6`} stroke={P.leafDark} strokeWidth=".8" fill="none" strokeLinecap="round" />
      {[-5, -2.6, 2.6, 5].map((d) => (
        <circle key={d} cx={x + d} cy={y - 1.6 - Math.abs(d) * 0.1} r="1" fill={P.leaf} stroke={P.outline} strokeWidth={H * 0.6} />
      ))}
      {season === 'summer' ? <circle cx={x - 1} cy={y - 6} r="1.5" fill={P.white} stroke={P.outline} strokeWidth={H * 0.7} /> : null}
      {season === 'spring' ? <circle cx={x - 1} cy={y - 6} r=".8" fill={P.leafPale} stroke={P.outline} strokeWidth={H * 0.5} /> : null}
    </g>
  )
}

/** Griechisches Fischerboot (Kaiki). */
function Caique({ x, y, s = 1, c = P.blue }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="ha-swim">
        <path d="M-4 -4V-11" stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
        <path d="M-4 -4V-11" stroke={P.woodDark} strokeWidth="1" strokeLinecap="round" />
        <rect x="-2" y="-7" width="5" height="3.4" rx=".4" fill={P.white} {...detail} />
        <rect x="-.8" y="-6.2" width="1.4" height="1.2" fill={P.window} />
        <path d="M-9 -3Q0 0 9 -3L10 -5L8 0H-8L-10 -5z" fill={P.white} {...line} />
        <path d="M-8.4 -1.4H8.4" stroke={c} strokeWidth="1.2" />
        <path d="M-7.6 -.6H7.6" stroke={P.outline} strokeWidth=".8" opacity=".15" />
      </g>
    </g>
  )
}

export function Pistazien({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  switch (id) {
    case 'pistazienhain': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <IslandGround season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Old key={i}><PistachioTree x={[40, 22, 58, 30, 50][i]!} y={[58, 62, 62, 70, 70][i]!} s={[1.4, 1.1, 1.1, 0.9, 0.9][i]!} season={season} clusters={2 + tier} /></Old>
          ))}
          {tier >= 5 ? <Person x={70} y={70} c={P.blue} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'steinterrassen': {
      const rows = 1 + tier
      const soil = winter ? P.leafPale : autumn ? P.woodLight : summer ? P.paper : P.leafPale
      return (
        <Svg tier={tier} bold>
          <IslandGround season={season} cy={60} ry={12} />
          {Array.from({ length: rows }, (_, k) => {
            const i = rows - 1 - k
            const y = 72 - i * 7
            const w = 66 - i * 7
            return (
              <g key={i}>
                <rect x={40 - w / 2} y={y - 9} width={w} height="6" rx="2" fill={soil} {...detail} />
                {Array.from({ length: Math.max(1, Math.round(w / 16)) }, (_, j) => (
                  <ellipse key={j} cx={40 - w / 2 + 7 + j * 14} cy={y - 6} rx="2.6" ry="1.8" fill={winter ? P.leaf : autumn ? P.autumn : P.winterLeafDark} stroke={P.outline} strokeWidth={D} />
                ))}
                <rect x={40 - w / 2} y={y - 3.6} width={w} height="3.6" fill={P.stoneLight} stroke={P.outline} strokeWidth={D} />
                <Old><DryWall x={40 - w / 2} y={y} w={w} h={3.6} c={P.paper} /></Old>
              </g>
            )
          })}
          {tier >= 5 ? <Person x={72} y={64} c={P.cream} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'kapellchen':
      return (
        <Svg tier={tier} bold>
          <IslandGround season={season} />
          <Old>
            <Chapel x={40} y={60} s={1.6 + tier * 0.06} dome={tier >= 3 ? P.denim : P.white} />
          </Old>
          {tier >= 2 ? (
            <g>
              <path d="M14 64h16M50 64h16" stroke={P.outline} strokeWidth="3.2" strokeLinecap="round" />
              <path d="M14 64h16M50 64h16" stroke={P.stoneLight} strokeWidth="2" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 3 ? (
            <g>
              <path d="M66 62V40" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
              <path d="M66 62V40" stroke={P.bark} strokeWidth="1.3" strokeLinecap="round" />
              <ellipse cx="66" cy="38" rx="6" ry="3.6" fill={P.leafDark} {...line} />
              <path d="M62 37q2 -2 5 -2.2" stroke={P.leafLight} strokeWidth=".8" fill="none" strokeLinecap="round" opacity=".5" />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <path d="M18 62h8M19 62v2M25 62v2" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
              <path d="M18 62h8M19 62v2M25 62v2" stroke={P.woodMid} strokeWidth="1.1" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? <Person x={24} y={68} c={P.charcoal} s={0.6} /> : null}
        </Svg>
      )
    case 'mandelbaeume': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <IslandGround season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Almond key={i} x={[40, 20, 60, 30, 50][i]!} y={[58, 62, 62, 70, 70][i]!} s={[1.3, 1.05, 1.05, 0.9, 0.9][i]!} season={season} />
          ))}
          {tier >= 5 ? <Old><SmallGoat x={70} y={70} s={0.8} flip /></Old> : null}
        </Svg>
      )
    }
    case 'kapernhang': {
      const capers = 1 + tier
      return (
        <Svg tier={tier} bold>
          <IslandGround season={season} cy={64} ry={7} />
          <rect x="6" y="40" width="68" height="24" fill={P.stoneLight} {...line} />
          <Old><DryWall x={6} y={64} w={68} h={24} c={P.stoneLight} /></Old>
          {Array.from({ length: capers }, (_, i) => (
            <g key={i} transform={`translate(${[20, 46, 62, 30, 54, 14][i]!} ${[50, 46, 56, 58, 54, 44][i]!}) scale(1.5)`}>
              <Caper x={0} y={0} season={season} />
            </g>
          ))}
          {tier >= 4 ? <path d="M66 70h8l-1 -3h-6z" fill={P.woodLight} {...detail} strokeLinejoin="round" /> : null}
          {tier >= 5 ? <Person x={74} y={66} c={P.yellow} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'roestplatz': {
      const trays = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <IslandGround season={season} />
          <rect x="52" y="38" width="3" height="5" fill={P.terracotta} {...detail} />
          <rect x="42" y="54" width="24" height="5" rx=".6" fill={P.stone} {...line} />
          <path d="M44 54V48a10 8 0 0 1 20 0V54z" fill={P.terracottaLight} {...line} />
          <path d="M47 47a7 5.6 0 0 1 6 -5" stroke={P.white} strokeWidth=".9" fill="none" strokeLinecap="round" opacity=".45" />
          <path d="M50 54v-3a4 3 0 0 1 8 0v3z" fill={P.charcoal} stroke={P.outline} strokeWidth={D} />
          {tier >= 2 ? <Old><Fire x={54} y={54} s={0.28} /></Old> : null}
          {Array.from({ length: trays }, (_, i) => (
            <g key={i}>
              <rect x={8 + (i % 3) * 12} y={56 + Math.floor(i / 3) * 7} width="10" height="4" rx=".4" fill={P.woodLight} {...detail} />
              {[2, 4.6, 7.2].map((dx) => (
                <ellipse key={dx} cx={8 + (i % 3) * 12 + dx} cy={56.6 + Math.floor(i / 3) * 7} rx="1.1" ry=".8" fill={summer ? P.blossom : P.paper} stroke={P.outline} strokeWidth={H * 0.6} />
              ))}
            </g>
          ))}
          {tier >= 3 ? [68, 71].map((x) => <circle key={x} cx={x} cy={66} r="1.5" fill={P.yellow} stroke={P.outline} strokeWidth={H * 0.8} />) : null}
          {tier >= 4 ? <path className="smoke" d="M53.5 37c-2 -3 2 -5 0 -8" stroke={P.white} strokeWidth="1.2" fill="none" /> : null}
          {tier >= 5 ? <Person x={68} y={60} c={P.denim} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'inselhaus':
      return (
        <Svg tier={tier} bold>
          <IslandGround season={season} />
          <Old><WhiteHouse x={18} y={62} w={34} h={20} roof="flat" door={P.blue} lit={winter} /></Old>
          <rect x="22" y="47" width="5" height="5" fill={P.blue} {...detail} />
          {tier >= 2 ? <rect x="40" y="47" width="5" height="5" fill={P.blue} {...detail} /> : null}
          {tier >= 3 ? (
            <g>
              <path d="M62 64V48" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
              <path d="M62 64V48" stroke={P.bark} strokeWidth="1.3" strokeLinecap="round" />
              {winter ? (
                <g>
                  <path d="M62 50l-4 -4M62 52l4 -4" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M62 50l-4 -4M62 52l4 -4" stroke={P.bark} strokeWidth=".8" strokeLinecap="round" />
                </g>
              ) : (
                <g>
                  <ellipse cx="62" cy="44" rx="8" ry="6" fill={autumn ? P.gold : P.leaf} {...line} />
                  <path d="M57 46.6q5 2.6 10 0" stroke={P.outline} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".15" />
                  <path d="M57 42q2 -3 5.4 -3.4" stroke={P.white} strokeWidth=".9" fill="none" strokeLinecap="round" opacity=".45" />
                </g>
              )}
            </g>
          ) : null}
          {tier >= 4 ? <path d="M12 66h3l-.4 -3h-2.2zM54 66h3l-.4 -3h-2.2z" fill={P.terracotta} {...detail} strokeLinejoin="round" /> : null}
          {tier >= 4 && !winter ? (
            <g>
              <path d="M13.5 63v-2M55.5 63v-2" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
              <path d="M13.5 63v-2M55.5 63v-2" stroke={P.tomato} strokeWidth="1.5" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? <Old><SmallGoat x={70} y={70} s={0.8} /></Old> : null}
        </Svg>
      )
    case 'zisterne':
      return (
        <Svg tier={tier} bold>
          <IslandGround season={season} />
          <ellipse cx="40" cy="62" rx="12" ry="4" fill={P.stoneLight} {...line} />
          <rect x="28" y="54" width="24" height="8" fill={P.white} {...line} />
          <rect x="44" y="55" width="7" height="6.4" fill={P.outline} opacity=".14" />
          <ellipse cx="40" cy="54" rx="12" ry="4" fill={P.white} {...line} />
          <ellipse cx="40" cy="54" rx="5" ry="1.6" fill={P.woodMid} stroke={P.outline} strokeWidth={D} />
          {tier >= 2 ? <Old><WhiteHouse x={58} y={62} w={16} h={14} roof="flat" door={P.blue} /></Old> : null}
          {tier >= 3 ? (
            <g>
              <path d="M58 47h-6l-4 7" stroke={P.outline} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M58 47h-6l-4 7" stroke={P.metal} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : null}
          {tier >= 3 && winter ? <path d="M48 54v3" stroke={P.waterLight} strokeWidth="1" strokeLinecap="round" /> : null}
          {tier >= 4 ? <path d="M18 66h5l-.6 -4h-3.8zM20.5 62v-3" fill={P.metal} {...detail} strokeLinejoin="round" /> : null}
          {tier >= 5 ? <Person x={26} y={66} c={P.lilac} s={0.6} /> : null}
        </Svg>
      )
    case 'hafenmarkt': {
      const boats = Math.min(3, tier)
      const sacks = tier
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="42" rx="34" ry="11" fill={P.water} {...line} />
          <path d="M16 38h8M44 46h10" stroke={P.white} strokeWidth=".9" strokeLinecap="round" opacity=".5" />
          <ellipse cx="40" cy="60" rx="37" ry="11" fill={P.stoneLight} {...line} />
          {Array.from({ length: boats }, (_, i) => (
            <Caique key={i} x={[20, 44, 62][i]!} y={[42, 38, 44][i]!} s={0.8} c={[P.blue, P.tomato, P.leafDark][i]} />
          ))}
          <path d="M20 66V54M60 66V54" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M20 66V54M60 66V54" stroke={P.woodDark} strokeWidth="1.1" strokeLinecap="round" />
          <path d="M16 54h48l-3 -4h-42z" fill={P.white} {...line} strokeLinejoin="round" />
          <path d="M18 55h44" stroke={P.outline} strokeWidth="1.2" opacity=".15" />
          {Array.from({ length: sacks }, (_, i) => (
            <g key={i}>
              <path d={`M${24 + i * 7} 66q-2 -4 0 -6h4q2 2 0 6z`} fill={P.paper} {...detail} />
              <ellipse cx={26 + i * 7} cy={60.4} rx="1.8" ry=".7" fill={P.leafPale} stroke={P.outline} strokeWidth={H * 0.6} />
            </g>
          ))}
          {tier >= 4 ? <Person x={70} y={66} c={P.denim} s={0.6} /> : null}
          {tier >= 5 ? <Person x={12} y={66} c={P.yellow} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'pistazienfest': {
      const guests = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="38" rx="32" ry="8" fill={P.water} {...line} />
          <path d="M20 37h8M48 40h9" stroke={P.white} strokeWidth=".9" strokeLinecap="round" opacity=".5" />
          <ellipse cx="40" cy="58" rx="37" ry="13" fill={winter ? P.stoneLight : P.canvas} {...line} />
          <path d="M18 55v8M62 55v8" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M18 55v8M62 55v8" stroke={P.woodDark} strokeWidth="1.1" strokeLinecap="round" />
          <rect x="16" y="52" width="48" height="3" rx=".6" fill={P.white} {...detail} />
          <rect x="17" y="55" width="46" height="1.2" fill={P.outline} opacity=".15" />
          {Array.from({ length: guests }, (_, i) => (
            <Person key={i} x={[22, 58, 30, 50, 40][i]!} y={[51, 51, 66, 66, 51][i]!} c={[P.blue, P.white, P.tomato, P.yellow, P.leafDark][i]!} s={0.9} />
          ))}
          {Array.from({ length: guests + 1 }, (_, i) => (
            <ellipse key={`p${i}`} cx={22 + i * 7} cy={51.6} rx="1.4" ry=".8" fill={P.leafPale} stroke={P.outline} strokeWidth={H * 0.6} />
          ))}
          {tier >= 3 ? (
            <Old>
              <StringLights x0={4} x1={76} y={24} lit={winter || autumn || tier >= 4} />
            </Old>
          ) : null}
          {tier >= 4 ? <Old><Chapel x={70} y={44} s={0.6} /></Old> : null}
        </Svg>
      )
    }
  }
  return null
}
