/**
 * Kapitel 5 — Imkerei im kräftigen Stil (2026-11-14, Weinberg-Niveau):
 * Bausteine aus art/parts/bold.tsx, eigene Beuten mit Kontur, jede Stufe bringt
 * Neues. Wachstum je Stufe übernimmt `Svg`.
 */
import type { ReactNode } from 'react'
import type { Season } from '../../ambient'
import { Svg, Bees, Smoke } from '../../HandParts'
import { Barrel, BlossomTree, Jar, Lantern, Pennant, Shadow } from '../parts'
import { ArchDoor, GableRoof, Pane, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Butterfly } from './partsA'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Beute (Bienenkasten) mit Deckel und Flugloch; Fußpunkt = Mitte unten. */
function Hive({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-4.6" y="-11" width="9.2" height="11" rx="1" fill={c} {...line} />
      <rect x="-4" y="-10.4" width="2.6" height="9.8" fill={P.white} opacity=".2" />
      <rect x="-5.6" y="-13.2" width="11.2" height="2.6" rx=".8" fill={P.woodDark} {...detail} />
      <rect x="-1.6" y="-2.6" width="3.2" height="1.2" rx=".4" fill={P.outline} />
    </g>
  )
}

/** Bienenkorb aus Stroh. */
function Skep({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-6 0q0-11 6-11t6 11z" fill={P.woodLight} {...line} />
      <path d="M-5.4 -3h10.8M-4.6 -6h9.2M-3.2 -9h6.4" stroke={P.woodDark} strokeWidth={H} />
      <path d="M-1.4 0a1.4 1.4 0 0 1 2.8 0z" fill={P.outline} />
    </g>
  )
}

/** Laubbaum mit Stamm und runder Krone (Linde). */
function Linde({ x, y, s = 1, crown, blossom }: { x: number; y: number; s?: number; crown: string; blossom: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-2 0l.8-17h2.4l.8 17z" fill={P.bark} {...detail} />
      <path d="M0 -42c10 0 15 6 14 13s-7 11-14 11s-15-4-14-11s4-13 14-13z" fill={crown} {...line} />
      <path d="M-8 -34q3-5 9-5" stroke={P.white} strokeWidth={D} fill="none" opacity=".35" strokeLinecap="round" />
      <path d="M6 -24q5-2 6-7" stroke={P.outline} strokeWidth={D} fill="none" opacity=".2" strokeLinecap="round" />
      {blossom ? [[-6, -34], [0, -37], [6, -33], [-3, -27], [5, -26], [-9, -28]].map(([bx, by], i) => <circle key={i} cx={bx} cy={by} r="1.3" fill={P.lamp} />) : null}
    </g>
  )
}

/** Boden-Wiese mit Kontur. */
function Meadow({ c, rx = 35 }: { c: string; rx?: number }) {
  return (
    <g>
      <ellipse cx="40" cy="58" rx={rx} ry="10" fill={c} {...line} />
      <path d={`M${40 - rx * 0.6} 55q${rx * 0.4}-3 ${rx * 0.8}-1`} stroke={P.white} strokeWidth={D} fill="none" opacity=".3" strokeLinecap="round" />
    </g>
  )
}

const HIVE_COLORS = [P.yellow, P.denim, P.red, P.leafLight, P.orange, P.lilac]

export function Imkerei({ id, tier, season }: { id: string; tier: number; season?: Season }) {
  const winter = season === 'winter'
  const flowering = season === 'spring' || season === 'summer'
  const leafy = winter ? P.winterLeafLight : season === 'autumn' ? P.honey : P.leafLight
  switch (id) {
    case 'bienenhaus':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <Wall x={8} y={38} w={64} h={28} fill={P.woodMid} planks={2} k={K} />
          <GableRoof x={8} y={39} w={64} h={15} fill={P.bark} over={4} k={K} />
          {/* Fluglöcher: eine Beute je Fach, mehr mit jeder Stufe */}
          {Array.from({ length: Math.min(6, 1 + tier) }, (_, i) => (
            <g key={i}>
              <rect x={11 + i * 10} y="46" width="8" height="12" rx="1" fill={HIVE_COLORS[i]} {...detail} />
              <rect x={13.6 + i * 10} y="55" width="2.8" height="1.2" fill={P.outline} />
            </g>
          ))}
          {tier >= 3 ? <Pane x={36} y={27} w={8} h={6} k={K} /> : null}
          {tier >= 4 ? <Lantern x={74} y={48} s={0.6} /> : null}
          {tier >= 5 ? <Pennant x={40} y={24} s={0.8} /> : null}
          {!winter ? <Bees n={Math.min(8, tier * 2)} cy={32} /> : null}
        </Svg>
      )
    case 'lindenallee': {
      const n = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          {Array.from({ length: n }, (_, i) => (
            <Linde key={i} x={n === 1 ? 40 : 16 + i * (48 / (n - 1))} y={64} s={0.85 + (i === 1 ? 0.1 : 0)} crown={leafy} blossom={flowering && tier >= 2} />
          ))}
          {tier >= 4 ? (
            <g>
              <path d="M30 63h20" stroke={P.outline} strokeWidth="4" strokeLinecap="round" />
              <path d="M30 63h20" stroke={P.woodLight} strokeWidth="2" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? <Hive x={66} y={67} c={P.yellow} s={0.8} /> : null}
          {flowering ? <Bees n={tier} cy={24} /> : null}
        </Svg>
      )
    }
    case 'heide':
      return (
        <Svg tier={tier} bold>
          <Meadow c={winter ? P.frost : P.leafMoss} />
          {Array.from({ length: 4 + tier * 2 }, (_, i) => (
            <ellipse key={i} cx={10 + ((i * 13) % 60)} cy={52 + ((i * 7) % 12)} rx="6" ry="3.4" fill={winter ? P.stoneLight : flowering || season === 'autumn' ? (i % 2 ? P.plum : P.lilac) : P.leafDark} stroke={P.outline} strokeWidth={H} />
          ))}
          {tier >= 3 ? <path d="M64 62 L60 38 L68 38z" fill={P.leafDark} {...line} /> : null}
          {tier >= 4 ? <path d="M16 62 L13 44 L19 44z" fill={P.leafDark} {...line} /> : null}
          {tier >= 2 ? <Skep x={42} y={50} s={tier >= 5 ? 1 : 0.85} /> : null}
          {tier >= 5 ? <Skep x={52} y={52} s={0.8} /> : null}
        </Svg>
      )
    case 'rapsfeld':
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="56" rx="36" ry="13" fill={winter ? P.winterLeafLight : flowering ? P.yellow : P.leafMoss} {...line} />
          {Array.from({ length: 2 + tier }, (_, r) => (
            <path key={r} d={`M8 ${48 + r * 3.6} Q40 ${45 + r * 3.6} 72 ${48 + r * 3.6}`} stroke={flowering ? P.gold : P.leafDark} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          ))}
          {tier >= 3 ? <Hive x={10} y={50} c={P.denim} s={0.8} /> : null}
          {tier >= 4 ? <Hive x={18} y={48} c={P.red} s={0.8} /> : null}
          {tier >= 5 ? <Pennant x={72} y={50} s={0.8} /> : null}
          {flowering ? <Bees n={tier + 1} cy={40} /> : null}
        </Svg>
      )
    case 'kirschhain':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <Old>
            <BlossomTree x={40} y={64} s={0.9 + tier * 0.04} winter={winter} color={season === 'spring' ? P.blossom : season === 'summer' ? P.leaf : P.autumn} />
            {tier >= 3 ? <BlossomTree x={17} y={64} s={0.7} winter={winter} color={season === 'spring' ? P.blossom : P.leaf} /> : null}
            {tier >= 4 ? <BlossomTree x={63} y={64} s={0.7} winter={winter} color={season === 'spring' ? P.blossom : P.leaf} /> : null}
          </Old>
          {tier >= 2 ? <Hive x={66} y={68} c={P.yellow} s={0.85} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M24 66l6-24M30 66l6-24" stroke={P.outline} strokeWidth={D} strokeLinecap="round" />
              <path d="M25.6 60h6M27 54h6M28.4 48h6" stroke={P.woodLight} strokeWidth="1.4" strokeLinecap="round" />
            </g>
          ) : null}
          {season === 'spring' ? [[20, 62], [50, 64], [60, 60], [30, 65]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1" fill={P.blossom} />) : null}
        </Svg>
      )
    case 'wildblumen':
      return (
        <Svg tier={tier} bold>
          <Meadow c={winter ? P.frost : P.leafLight} />
          {!winter
            ? Array.from({ length: 8 + tier * 5 }, (_, i) => {
                const x = 8 + ((i * 17) % 64)
                const y = 50 + ((i * 11) % 14)
                const c = [P.red, P.blue, P.cream, P.yellow, P.lilac][i % 5]
                return (
                  <g key={i}>
                    <path d={`M${x} ${y + 4}v-4`} stroke={P.leafDark} strokeWidth=".8" />
                    <circle cx={x} cy={y} r="1.7" fill={c} stroke={P.outline} strokeWidth={H * 0.6} />
                  </g>
                )
              })
            : null}
          {/* Stufe 3: Insektenhotel */}
          {tier >= 3 ? (
            <g>
              <Post x={66} y={64} h={10} w={2} k={K} />
              <Wall x={59} y={38} w={14} h={16} fill={P.woodLight} k={K} />
              <path d="M57 39 L66 32 L75 39z" fill={P.roof} {...line} />
              {[[62, 42], [66, 42], [70, 42], [62, 47], [66, 47], [70, 47]].map(([hx, hy], i) => (
                <circle key={i} cx={hx} cy={hy} r="1.4" fill={P.outline} opacity=".7" />
              ))}
            </g>
          ) : null}
          {tier >= 4 && !winter ? <Butterfly x={24} y={42} c={P.orange} /> : null}
          {tier >= 5 ? <Pennant x={10} y={58} s={0.8} /> : null}
          {!winter ? <Bees n={tier} cy={40} /> : null}
        </Svg>
      )
    case 'schleuder':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          {tier >= 5 ? (
            <g>
              <rect x="44" y="26" width="4.4" height="10" fill={P.stone} {...detail} />
              <Smoke x={46} y={24} />
            </g>
          ) : null}
          <Wall x={12} y={42} w={42} h={24} fill={P.paper} k={K} />
          <GableRoof x={12} y={43} w={42} h={16} fill={P.autumnDark} over={3.5} k={K} />
          {/* offenes Tor mit der Honigschleuder */}
          <rect x="24" y="48" width="18" height="18" fill={P.soilDark} {...line} />
          <path d="M27.4 66v-14a5.6 3 0 0 1 11.2 0V66z" fill={P.stoneLight} {...detail} />
          <path d="M28.6 54v10" stroke={P.white} strokeWidth={D} opacity=".5" strokeLinecap="round" />
          <path d="M33 49v4" stroke={P.metal} strokeWidth="1.4" strokeLinecap="round" />
          {tier >= 3 ? <path d="M38.6 60q3 2 2 6" stroke={P.gold} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
          {tier >= 4 ? <Pane x={45} y={49} w={6} h={6} k={K} /> : null}
          {Array.from({ length: Math.min(5, tier + 1) }, (_, i) => (
            <Jar key={i} x={60 + (i % 3) * 6} y={66 - Math.floor(i / 3) * 9.4} s={0.8} />
          ))}
        </Svg>
      )
    case 'wachszieherei':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          {tier >= 5 ? (
            <g>
              <rect x="31" y="28" width="4.4" height="10" fill={P.stone} {...detail} />
              <Smoke x={33} y={26} />
            </g>
          ) : null}
          <Wall x={8} y={44} w={32} h={22} fill={P.canvas} k={K} />
          <GableRoof x={8} y={45} w={32} h={14} fill={P.honey} over={3} k={K} />
          <Pane x={11} y={50} w={6.5} h={6.5} k={K} />
          {tier >= 3 ? (
            <g>
              <ArchDoor x={26} y={66} w={8} h={12} k={K} />
              <path d="M23 47h9" stroke={P.outline} strokeWidth={D} strokeLinecap="round" />
              <rect x="25.4" y="48" width="4.4" height="4.4" rx=".6" fill={P.lamp} {...detail} />
              <path d="M27.6 48v-1.4" stroke={P.orange} strokeWidth="1" />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <path d="M40 66l1.2-7h9.6l1.2 7z" fill={P.stoneDark} {...line} />
              <ellipse cx="46" cy="59" rx="4.8" ry="1.3" fill={P.lamp} {...detail} />
            </g>
          ) : null}
          {/* Trockengestell mit Kerzen */}
          <Post x={52} y={66} h={26} w={2.2} k={K} />
          <Post x={74} y={66} h={26} w={2.2} k={K} />
          <path d="M50 41h26" stroke={P.outline} strokeWidth="3.2" strokeLinecap="round" />
          <path d="M50 41h26" stroke={P.woodLight} strokeWidth="1.4" strokeLinecap="round" />
          {Array.from({ length: Math.min(7, 2 + tier) }, (_, i) => (
            <g key={i}>
              <path d={`M${55 + i * 2.8} 41v2`} stroke={P.outline} strokeWidth={H} />
              <rect x={54.2 + i * 2.8} y="43" width="1.8" height={8 + (i % 3) * 2} rx=".6" fill={i % 3 === 0 ? P.red : P.lamp} stroke={P.outline} strokeWidth={H * 0.7} />
            </g>
          ))}
        </Svg>
      )
    case 'metkeller':
      return (
        <Svg tier={tier} bold>
          <path d="M2 66 Q40 16 78 66z" fill={winter ? P.frost : P.leafLight} {...line} />
          <path d="M14 56q10-18 24-22" stroke={P.white} strokeWidth={D} fill="none" opacity=".3" strokeLinecap="round" />
          {/* Bruchstein-Portal */}
          <path d="M26 66V51a14 14 0 0 1 28 0v15z" fill={P.stone} {...line} />
          <path d="M28 51h24M27 58h26" stroke={P.outline} strokeWidth={H} opacity=".35" />
          <ArchDoor x={33} y={66} w={14} h={18} k={K} />
          {tier >= 3 ? <path d="M38 38c0-3 4-3 4 0l-2 3z" fill={P.gold} {...detail} /> : null}
          {tier >= 5 ? <Lantern x={56} y={50} s={0.6} /> : null}
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <Barrel key={i} x={i < 2 ? 12 + i * 8 : 62 + (i - 2) * 8} y={67} s={0.7} />
          ))}
        </Svg>
      )
    case 'honigladen':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          <Wall x={12} y={42} w={48} h={24} fill={P.cream} k={K} />
          <GableRoof x={12} y={43} w={48} h={15} fill={P.gold} over={3.5} k={K} />
          {/* Schaufenster mit Gläsern */}
          <rect x="17" y="48" width="20" height="12" rx="1" fill={P.window} {...line} />
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
            <Jar key={i} x={21 + (i % 3) * 6} y={i < 3 ? 59.4 : 53.4} s={0.55} />
          ))}
          <ArchDoor x={44} y={66} w={9} h={14} k={K} />
          {tier >= 3 ? (
            <g>
              <path d="M15 47h24l-2 -3.4h-20z" fill={P.honey} {...line} />
              <path d="M19 46.6l-.6-2.6M25 46.6v-2.6M31 46.6v-2.6M37 46.6l.6-2.6" stroke={P.white} strokeWidth="1.2" opacity=".8" />
            </g>
          ) : null}
          <g transform="translate(36 29)">
            <rect x="-8" y="-4" width="16" height="7" rx="1.4" fill={P.cream} {...detail} />
            <ellipse cx="0" cy="-.5" rx="2.4" ry="1.6" fill={P.yellow} {...detail} />
          </g>
          {tier >= 4 ? <Bees n={4} cx={64} cy={40} /> : null}
          {tier >= 5 ? <Pennant x={66} y={66} s={0.8} /> : null}
        </Svg>
      )
  }
  return null
}

/* ————————————— Teich & Fischerhütte ————————————— */

/** Gesperrte Ecke der Imkerei: Totholz und Gestrüpp. */
export function ImkereiWild() {
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.leaf} opacity=".5" />
      <path d="M20 60 L60 54" stroke={P.outlineWood} strokeWidth="4" strokeLinecap="round" />
      <path d="M44 56 l6 -10 M30 58 l-4 -8" stroke={P.outlineWood} strokeWidth="2" strokeLinecap="round" />
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse key={i} cx={14 + i * 12} cy={62 - (i % 2) * 3} rx="6" ry="4" fill={i % 2 ? '#5f7a3a' : P.leaf} />
      ))}
    </Svg>
  )
}
