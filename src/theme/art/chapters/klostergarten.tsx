/**
 * Kapitel 14 — Klostergarten im kräftigen Stil (2026-11-14, Weinberg-Niveau):
 * Kreuzgang, Brunnenhaus, Küche und Glockenturm aus Stein mit Kontur,
 * Bausteine aus art/parts/bold.tsx; jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Smoke, Svg } from '../../HandParts'
import { Butterfly } from './partsA'
import { Bee, Jar, Shadow } from '../parts'
import { ArchDoor, GableRoof, Pane, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { type AreaProps } from './partsB'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Person({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1 -1v3M1 -1v3" stroke={P.outline} strokeWidth="1" strokeLinecap="round" />
      <path d="M-2.2 -5.4h4.4l.7 4.6h-5.8z" fill={c} {...detail} />
      <circle cx="0" cy="-7.4" r="1.8" fill={P.skin} {...detail} />
    </g>
  )
}

/** Schwester im Habit. */
function Sister({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-2.8 0 L-2.2 -6 Q0 -7.2 2.2 -6 L2.8 0z" fill={P.charcoal} {...detail} />
      <circle cx="0" cy="-7.6" r="1.7" fill={P.skin} {...detail} />
      <path d="M-2.2 -7.8 Q0 -11 2.2 -7.8 L2.6 -5 L-2.6 -5z" fill={P.ink} {...detail} />
      <path d="M-1.4 -6.2h2.8" stroke={P.white} strokeWidth=".8" />
    </g>
  )
}

function Quince({ x, y, s = 1, season, fruits = 5 }: { x: number; y: number; s?: number; season?: string; fruits?: number }) {
  const winter = season === 'winter'
  const crown = winter ? P.frost : season === 'autumn' ? P.leafMoss : P.leaf
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1.6 0 Q-2.2 -6 0 -10 Q2.2 -6 1.6 0z" fill={P.bark} {...detail} />
      <ellipse cx="0" cy="-15" rx="9" ry="7" fill={crown} {...line} />
      <path d="M-6 -18q3-3 7-3" stroke={P.white} strokeWidth={D} fill="none" opacity=".35" strokeLinecap="round" />
      {season === 'spring'
        ? Array.from({ length: 6 }, (_, i) => <circle key={i} cx={-6 + i * 2.4} cy={-14 - (i % 2) * 3} r="1.1" fill={P.blossom} stroke={P.outline} strokeWidth={H * 0.5} />)
        : !winter
          ? Array.from({ length: fruits }, (_, i) => <ellipse key={i} cx={-5 + i * 2.6} cy={-12 - (i % 2) * 4} rx="1.5" ry="1.8" fill={season === 'autumn' ? P.gold : P.leafPale} stroke={P.outline} strokeWidth={H * 0.6} />)
          : null}
    </g>
  )
}

function BoxBall({ x, y, r = 3.4, winter }: { x: number; y: number; r?: number; winter?: boolean }) {
  return (
    <g>
      <ellipse cx={x} cy={y - r * 0.8} rx={r} ry={r * 0.8} fill={P.leafDark} {...line} />
      <ellipse cx={x - r * 0.3} cy={y - r * 1.1} rx={r * 0.45} ry={r * 0.3} fill={P.leaf} />
      {winter ? <path d={`M${x - r * 0.8} ${y - r * 1.2} Q${x} ${y - r * 1.9} ${x + r * 0.8} ${y - r * 1.2}`} stroke={P.white} strokeWidth="1.3" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

function Sign({ x, y, c = P.label }: { x: number; y: number; c?: string }) {
  return (
    <g>
      <Post x={x} y={y} h={7} w={1.4} k={K} />
      <rect x={x - 4.4} y={y - 10.4} width="8.8" height="4.8" rx=".8" fill={c} {...detail} />
      <path d={`M${x - 2.6} ${y - 8}h5.2`} stroke={P.outline} strokeWidth={H} />
    </g>
  )
}

/** Beet mit Buchseinfassung. */
function Bed({ x, y, w, h, winter }: { x: number; y: number; w: number; h: number; winter?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="1.4" fill={P.leafDark} {...line} />
      <rect x={x + 1.4} y={y + 1.4} width={w - 2.8} height={h - 2.8} rx=".8" fill={winter ? P.cream : P.soil} />
    </g>
  )
}

export function Klostergarten({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const autumn = season === 'autumn'
  const bloom = season === 'spring' || season === 'summer'
  switch (id) {
    case 'kreuzgang':
      return (
        <Svg tier={tier} bold>
          <rect x="8" y="44" width="64" height="22" rx="1" fill={P.stoneLight} {...line} />
          {[0, 1, 2, 3].slice(0, Math.min(4, tier)).map((i) => {
            const x = 12 + (i % 2) * 32
            const y = 46 + Math.floor(i / 2) * 10
            return (
              <g key={i}>
                <Bed x={x} y={y} w={24} h={8} winter={winter} />
                {bloom ? [4, 10, 16].map((dx) => <circle key={dx} cx={x + 1 + dx} cy={y + 4} r="1.5" fill={[P.lavender, P.yellow, P.pink][(i + dx) % 3]} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
              </g>
            )
          })}
          <ellipse cx="40" cy="55" rx="4.4" ry="2.2" fill={P.stone} {...detail} />
          <ellipse cx="40" cy="54.6" rx="2.8" ry="1.2" fill={winter ? P.white : P.water} />
          {tier >= 3 ? (
            <g>
              <Wall x={6} y={20} w={68} h={6} fill={P.stoneLight} k={K} />
              {[8, 18, 28, 38, 48, 58, 68].map((x) => (
                <g key={x}>
                  <path d={`M${x} 44v-14a5 5 0 0 1 10 0`} stroke={P.outline} strokeWidth="3.4" fill="none" />
                  <path d={`M${x} 44v-14a5 5 0 0 1 10 0`} stroke={P.stoneLight} strokeWidth="1.8" fill="none" />
                </g>
              ))}
              <path d="M4 20 L40 12 L76 20z" fill={P.terracotta} {...line} />
            </g>
          ) : null}
          {tier >= 4 ? <Sister x={66} y={66} /> : null}
          {tier >= 5 ? <BoxBall x={10} y={66} winter={winter} /> : null}
          {winter && tier >= 3 ? <path d="M6 19 L40 12 L74 19" stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'quittenhain': {
      const trees = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="59" rx="36" ry="10" fill={winter ? P.white : P.leafLight} {...line} />
          {Array.from({ length: trees }, (_, i) => (
            <Quince key={i} x={[40, 18, 62][i]!} y={[64, 58, 58][i]!} s={[1.5, 1.2, 1.2][i]! * (0.85 + tier * 0.08)} season={season} fruits={3 + tier} />
          )).reverse()}
          {tier >= 3 ? (
            <g>
              <path d="M70 66 L64 40 M74 66 L68 40" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
              <path d="M70 66 L64 40 M74 66 L68 40" stroke={P.woodMid} strokeWidth="1.2" strokeLinecap="round" />
              <path d="M70.8 60h4 M69.4 54h4 M68 48h4" stroke={P.woodLight} strokeWidth="1.4" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 4 && autumn ? (
            <g>
              <path d="M57 66h13l-1 -5h-11z" fill={P.woodLight} {...line} />
              {[60.6, 63.6, 66.6].map((x) => <circle key={x} cx={x} cy={60.2} r="1.7" fill={P.gold} stroke={P.outline} strokeWidth={H} />)}
            </g>
          ) : null}
          {tier >= 5 ? <Sister x={10} y={66} s={0.9} /> : null}
        </Svg>
      )
    }
    case 'heilpflanzen': {
      const rows = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <Bed x={10} y={44} w={60} h={20} winter={winter} />
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: 8 }, (_, k) => {
              const x = 15 + k * 7
              const y = 49 + r * 4.4
              const c = [P.orange, P.lavender, P.yellow, P.leafPale][r]!
              return (
                <g key={`${r}-${k}`}>
                  {!winter ? <ellipse cx={x} cy={y} rx="2.5" ry="1.5" fill={r % 2 ? P.leafMoss : P.leaf} stroke={P.outline} strokeWidth={H * 0.6} /> : k % 2 ? <ellipse cx={x} cy={y} rx="2.6" ry="1" fill={P.woodLight} /> : null}
                  {bloom ? <circle cx={x} cy={y - 1.3} r="1" fill={c} /> : null}
                </g>
              )
            }),
          )}
          {tier >= 2 ? <Sign x={6} y={66} /> : null}
          {tier >= 3 && bloom ? <Butterfly x={60} y={36} c={P.yellow} /> : null}
          {tier >= 5 ? <Sister x={74} y={66} s={0.9} /> : null}
        </Svg>
      )
    }
    case 'brunnenhaus':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={26} />
          <ellipse cx="40" cy="61" rx="15" ry="5" fill={P.stone} {...line} />
          <rect x="26" y="50" width="28" height="10" fill={P.stoneLight} {...line} />
          <path d="M33 50v10M47 50v10M26 55h28" stroke={P.outline} strokeWidth={H} opacity=".35" />
          <ellipse cx="40" cy="50" rx="14" ry="4" fill={P.stone} {...detail} />
          <ellipse cx="40" cy="50" rx="11" ry="2.8" fill={winter ? P.white : P.waterDeep} />
          {tier >= 2 ? (
            <g>
              <Post x={28} y={50} h={20} w={2.4} k={K} />
              <Post x={52} y={50} h={20} w={2.4} k={K} />
              <path d="M27 34h26" stroke={P.outline} strokeWidth="3" strokeLinecap="round" />
              <path d="M27 34h26" stroke={P.woodMid} strokeWidth="1.4" strokeLinecap="round" />
              <path d="M40 34v10" stroke={P.outline} strokeWidth=".7" />
              <rect x="37.4" y="44" width="5.2" height="4" rx=".6" fill={P.wood} {...detail} />
            </g>
          ) : null}
          {tier >= 3 ? <path d="M24 31 L40 21 L56 31z" fill={P.terracotta} {...line} /> : null}
          {tier >= 4 ? (
            <g>
              <rect x="58" y="56" width="5" height="8" rx=".6" fill={P.metal} {...detail} />
              <ellipse cx="60.5" cy="56" rx="2.5" ry=".8" fill={P.water} />
            </g>
          ) : null}
          {tier >= 5 ? <Sister x={16} y={66} /> : null}
          {winter && tier >= 3 ? <path d="M25 30.4L40 21L55 30.4" stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'bienenmauer': {
      const len = 30 + tier * 8
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={len / 2 + 2} />
          {Array.from({ length: 4 }, (_, r) =>
            Array.from({ length: Math.floor(len / 8) }, (_, k) => (
              <rect key={`${r}-${k}`} x={40 - len / 2 + k * 8 + (r % 2) * 4 - 2} y={62 - (r + 1) * 6} width="7.4" height="5.6" rx="1.4" fill={(r + k) % 3 ? P.stone : P.stoneLight} {...detail} />
            )),
          )}
          {Array.from({ length: Math.min(8, tier * 2) }, (_, i) => (
            <circle key={i} cx={40 - len / 2 + 4 + ((i * 11) % (len - 6))} cy={58 - (i % 4) * 6} r=".9" fill={P.ink} />
          ))}
          {bloom
            ? Array.from({ length: 4 + tier }, (_, i) => (
                <g key={i}>
                  <path d={`M${10 + i * 8} 66v-3`} stroke={P.leafDark} strokeWidth=".7" />
                  <circle cx={10 + i * 8} cy={62.6} r="1.4" fill={[P.lilac, P.yellow, P.cream][i % 3]} stroke={P.outline} strokeWidth={H * 0.5} />
                </g>
              ))
            : null}
          {bloom && tier >= 2 ? <Bee x={58} y={30} s={0.6} /> : null}
          {bloom && tier >= 4 ? <Bee x={24} y={28} s={0.6} /> : null}
          {winter ? <path d={`M${40 - len / 2} 38h${len}`} stroke={P.white} strokeWidth="2" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'schwesterngarten': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="57" rx="36" ry="11" fill={winter ? P.cream : P.soil} {...line} />
          {Array.from({ length: rows }, (_, r) => {
            const y = 50 + r * 3.8
            const kind = r % 3
            return (
              <g key={r}>
                {kind === 2 && !winter ? <path d={`M10 ${y - 3} Q40 ${y - 6} 72 ${y - 3}`} stroke={P.leaf} strokeWidth="1.4" fill="none" /> : null}
                {Array.from({ length: 8 }, (_, k) => {
                  const x = 12 + k * 8 + (r % 2) * 2
                  return kind === 0 ? (
                    <circle key={k} cx={x} cy={y} r="2.1" fill={winter ? P.winterLeaf : P.leafPale} stroke={P.outline} strokeWidth={H * 0.6} />
                  ) : kind === 1 ? (
                    <path key={k} d={`M${x} ${y}v-4M${x - 1} ${y}l-1-3M${x + 1} ${y}l1-3`} stroke={winter ? P.winterLeafDark : P.leafDark} strokeWidth=".9" />
                  ) : (
                    <path key={k} d={`M${x} ${y}V${y - 6}`} stroke={P.woodMid} strokeWidth=".8" />
                  )
                })}
              </g>
            )
          })}
          {tier >= 4 ? <Sister x={70} y={66} /> : null}
          {tier >= 5 ? <path d="M7 66l6-4h4l-2 4z" fill={P.metal} {...detail} /> : null}
        </Svg>
      )
    }
    case 'kraeuterboden': {
      const bunches = Math.min(8, 2 + tier)
      return (
        <Svg tier={tier} bold>
          <Wall x={10} y={30} w={60} h={34} fill={P.paper} k={K} />
          <GableRoof x={10} y={31} w={60} h={20} fill={P.terracotta} over={4} k={K} />
          <path d="M14 34h52" stroke={P.woodDark} strokeWidth="1.4" />
          {Array.from({ length: bunches }, (_, i) => {
            const x = 18 + i * (46 / Math.max(1, bunches - 1))
            return (
              <g key={i}>
                <path d={`M${x} 34v3`} stroke={P.outline} strokeWidth={H} />
                <path d={`M${x - 2} 37 L${x} 45 L${x + 2} 37z`} fill={[P.leafMoss, P.lavender, P.gold, P.leaf][i % 4]} stroke={P.outline} strokeWidth={H} />
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <rect x="16" y="54" width="20" height="10" rx=".8" fill={P.wood} {...line} />
              {[20, 26, 32].map((x) => <Jar key={x} x={x} y={54} c={P.leafPale} s={0.5} />)}
            </g>
          ) : null}
          {tier >= 4 ? <Pane x={50} y={44} w={7} h={7} k={K} /> : null}
          <ArchDoor x={40} y={64} w={8} h={11} k={K} />
          {tier >= 5 ? <Sister x={62} y={64} s={0.9} /> : null}
          {winter ? <path d="M6 31L40 11L74 31" stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'klosterkueche':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <rect x="47" y="16" width="6" height="14" fill={P.stone} {...detail} />
          {tier >= 2 ? <Smoke x={50} y={14} /> : null}
          <Wall x={10} y={34} w={50} h={30} fill={P.stoneLight} k={K} />
          <GableRoof x={10} y={35} w={50} h={14} fill={P.terracotta} over={3.5} k={K} />
          <ArchDoor x={18} y={64} w={10} h={14} k={K} />
          <Pane x={36} y={42} w={8} h={8} k={K} />
          {tier >= 3 ? (
            <g>
              <Post x={63} y={66} h={8} w={1.8} k={K} />
              <Post x={74} y={66} h={8} w={1.8} k={K} />
              <rect x="61" y="56" width="16" height="2.4" rx=".6" fill={P.woodDark} {...detail} />
              <Jar x={66} y={56} c={P.honey} s={0.5} />
              <Jar x={71} y={56} c={P.gold} s={0.5} />
            </g>
          ) : null}
          {tier >= 4 ? <rect x="33" y="54" width="12" height="5" rx=".8" fill={P.amber} className="fest-glow" {...detail} /> : null}
          {tier >= 5 ? <Sister x={6} y={66} /> : null}
          {winter ? <path d="M6.5 35L35 21L63.5 35" stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'saatgutregister': {
      const shelves = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={30} />
          <rect x="16" y="22" width="48" height="42" rx="1" fill={P.woodDark} {...line} />
          <rect x="17" y="23" width="10" height="40" fill={P.white} opacity=".08" />
          {Array.from({ length: shelves }, (_, r) => (
            <g key={r}>
              <path d={`M18 ${32 + r * 9}h44`} stroke={P.woodLight} strokeWidth="1.4" />
              {Array.from({ length: 9 }, (_, k) => (
                <rect key={k} x={20 + k * 4.6} y={24.4 + r * 9} width="3.6" height="7" rx=".4" fill={[P.paper, P.label, P.canvas][(r + k) % 3]} stroke={P.outline} strokeWidth={H * 0.5} />
              ))}
            </g>
          ))}
          {tier >= 2 ? (
            <g>
              <rect x="26" y="58" width="22" height="3" rx=".6" fill={P.wood} {...detail} />
              <path d="M30 58l7-3 7 3z" fill={P.paper} {...detail} />
              <path d="M44 57l4-5" stroke={P.ink} strokeWidth=".6" />
            </g>
          ) : null}
          {tier >= 3 ? <path d="M60 66l3-6h4l3 6z" fill={P.lamp} className="fest-glow" {...detail} /> : null}
          {tier >= 5 ? <Sister x={70} y={66} /> : null}
        </Svg>
      )
    }
    case 'glockenhof': {
      const tall = tier >= 3
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="60" rx="36" ry="8" fill={winter ? P.white : P.stoneLight} {...line} />
          <Wall x={30} y={tall ? 14 : 30} w={20} h={tall ? 50 : 34} fill={P.stoneLight} k={K} />
          {tall ? (
            <g>
              <path d="M28 14 L40 0 L52 14z" fill={P.leafMoss} {...line} />
              <path d="M40 0v-5M38 -3h4" stroke={P.brass} strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ) : (
            <GableRoof x={30} y={31} w={20} h={8} fill={P.terracotta} over={2} k={K} />
          )}
          <path d={tall ? 'M36 30v-8a4 4 0 0 1 8 0v8z' : 'M36 44v-6a4 4 0 0 1 8 0v6z'} fill={P.charcoal} {...detail} />
          <g className="ha-swim">
            <path d={tall ? 'M37.6 28 Q37.6 22 40 22 Q42.4 22 42.4 28z' : 'M37.6 42 Q37.6 37 40 37 Q42.4 37 42.4 42z'} fill={P.brass} {...detail} />
          </g>
          <ArchDoor x={36} y={64} w={8} h={11} k={K} />
          {tall ? (
            <g>
              <circle cx="40" cy="38" r="3.2" fill={P.cream} {...detail} />
              <path d="M40 38v-2M40 38h1.6" stroke={P.ink} strokeWidth=".7" />
            </g>
          ) : null}
          {tier >= 2 ? <Pane x={42.4} y={44} w={4.4} h={5} k={K} /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M56 57h14" stroke={P.outline} strokeWidth="3.4" strokeLinecap="round" />
              <path d="M56 57h14" stroke={P.woodMid} strokeWidth="1.6" strokeLinecap="round" />
              <path d="M58 58v6M68 58v6" stroke={P.outline} strokeWidth={D} />
              <Sister x={63} y={56} s={0.8} />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <Sister x={16} y={66} />
              <Person x={22} y={67} c={P.denim} s={0.8} />
            </g>
          ) : null}
          {winter ? <path d={tall ? 'M30 13L40 1L50 13' : 'M28 30.4L40 23L52 30.4'} stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
  }
  return null
}
