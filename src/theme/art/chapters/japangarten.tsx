/**
 * Kapitel 11 — Japangarten im kräftigen Stil (2026-11-14, Weinberg-Niveau):
 * Steinlaternen, Teehaus, rote Brücke und Torii mit Kontur, Kies und Teiche mit
 * Rand; jede Stufe bringt Neues. Wachstum je Stufe übernimmt `Svg`.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { BlossomTree, Shadow } from '../parts'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { type AreaProps } from './partsB'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

function Person({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1 -1v3M1 -1v3" stroke={P.outline} strokeWidth="1" strokeLinecap="round" />
      <path d="M-2.2 -5.4h4.4l.7 4.6h-5.8z" fill={c} {...detail} />
      <circle cx="0" cy="-7.4" r="1.8" fill={P.skin} {...detail} />
    </g>
  )
}

function StoneLantern({ x, y, s = 1, lit, snow }: { x: number; y: number; s?: number; lit?: boolean; snow?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1.6" y="-8" width="3.2" height="8" fill={P.stone} {...detail} />
      <rect x="-3.6" y="-9.4" width="7.2" height="1.8" rx=".4" fill={P.stoneDark} {...detail} />
      <rect x="-2.6" y="-13.4" width="5.2" height="4" fill={lit ? P.lamp : P.stoneLight} className={lit ? 'fest-glow' : undefined} {...detail} />
      <path d="M-4.8 -13.4 L0 -16.6 L4.8 -13.4z" fill={P.stoneDark} {...detail} />
      <circle cx="0" cy="-17.2" r="1" fill={P.stoneDark} {...detail} />
      {snow ? <path d="M-4.2 -13.8 L0 -16.6 L4.2 -13.8" stroke={P.white} strokeWidth="1.3" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

function Koi({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="ha-fish">
        <ellipse cx="0" cy="0" rx="3.6" ry="1.5" fill={c} stroke={P.outline} strokeWidth={H} />
        <ellipse cx="-.6" cy="-.2" rx="1.2" ry=".7" fill={P.cream} />
        <path d="M-3.4 0l-2 -1.6v3.2z" fill={c} />
      </g>
    </g>
  )
}

/** Teich mit Steinrand und Lichtreflex. */
function Pond({ cx = 40, cy = 54, rx = 32, ry = 11, frozen }: { cx?: number; cy?: number; rx?: number; ry?: number; frozen?: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 1.4} rx={rx + 3} ry={ry + 2.6} fill={P.stoneLight} {...line} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={frozen ? P.glass : P.waterDeep} {...detail} />
      <path d={`M${cx - rx * 0.6} ${cy - ry * 0.35}q${rx * 0.35}-${ry * 0.3} ${rx * 0.7}-${ry * 0.15}`} stroke={P.white} strokeWidth={D} fill="none" opacity=".5" strokeLinecap="round" />
    </g>
  )
}

function Rock({ x, y, w = 12, h = 7, snow }: { x: number; y: number; w?: number; h?: number; snow?: boolean }) {
  return (
    <g>
      <path d={`M${x} ${y} L${x + w * 0.2} ${y - h} L${x + w * 0.62} ${y - h * 1.1} L${x + w} ${y}z`} fill={P.stoneDark} {...line} />
      <path d={`M${x + w * 0.16} ${y - h * 0.4} L${x + w * 0.26} ${y - h * 0.86}`} stroke={P.white} strokeWidth={D} opacity=".35" strokeLinecap="round" />
      {snow ? <path d={`M${x + w * 0.16} ${y - h * 0.8} L${x + w * 0.2} ${y - h} L${x + w * 0.62} ${y - h * 1.1} L${x + w * 0.8} ${y - h * 0.6}`} stroke={P.white} strokeWidth="1.8" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Fächerahorn. */
function Maple({ x, y, s = 1, c }: { x: number; y: number; s?: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 Q-2 -12 6 -20" stroke={P.outline} strokeWidth="3.6" fill="none" strokeLinecap="round" />
      <path d="M0 0 Q-2 -12 6 -20" stroke={P.bark} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="6" cy="-22" r="6.4" fill={c} {...line} />
      <circle cx="-1" cy="-17" r="4.4" fill={c} {...line} />
      <path d="M3 -26q3-2 6 0" stroke={P.white} strokeWidth={D} fill="none" opacity=".35" strokeLinecap="round" />
    </g>
  )
}

/** Torii in Rot. */
function Torii({ x, y, w = 16, h = 20 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <Post x={x + 2} y={y} h={h} w={2.4} fill={P.berry} k={K} />
      <Post x={x + w - 2} y={y} h={h} w={2.4} fill={P.berry} k={K} />
      <path d={`M${x - 2} ${y - h} q${w / 2 + 2} -2.4 ${w + 4} 0`} stroke={P.outline} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d={`M${x - 2} ${y - h} q${w / 2 + 2} -2.4 ${w + 4} 0`} stroke={P.berry} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d={`M${x} ${y - h + 4}h${w}`} stroke={P.outline} strokeWidth="3" strokeLinecap="round" />
      <path d={`M${x} ${y - h + 4}h${w}`} stroke={P.berry} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  )
}

export function Japan({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const gravel = winter ? P.white : P.paper
  const maple = winter ? P.frost : autumn ? P.autumn : spring ? P.blossom : P.berry
  switch (id) {
    case 'teestrauch': {
      const rows = Math.min(4, 1 + Math.floor((tier + 1) / 2))
      return (
        <Svg tier={tier} bold>
          <path d="M2 66 Q30 34 78 40 V66z" fill={winter ? P.white : P.leafPale} {...line} />
          {Array.from({ length: rows }, (_, r) => (
            <g key={r}>
              <path d={`M${6 + r * 2} ${64 - r * 6} Q40 ${56 - r * 6} ${76 - r} ${60 - r * 6}`} stroke={P.outline} strokeWidth="7" fill="none" strokeLinecap="round" />
              <path d={`M${6 + r * 2} ${63.4 - r * 6} Q40 ${55.4 - r * 6} ${76 - r} ${59.4 - r * 6}`} stroke={winter ? P.winterLeafLight : spring ? P.leafPale : P.leaf} strokeWidth="4.6" fill="none" strokeLinecap="round" />
            </g>
          ))}
          {tier >= 3 ? (
            <g>
              <Person x={60} y={58 - rows * 4} c={P.denim} s={0.9} />
              <path d={`M55.6 ${51 - rows * 4}h8.8l-4.4 -3.4z`} fill={P.gold} {...detail} />
            </g>
          ) : null}
          {tier >= 2 ? <circle cx="72" cy="62" r="3" fill={P.stone} {...detail} /> : null}
          {tier >= 4 ? <path d="M63 66 h11 l-1.6 -4.4 h-7.8 z" fill={P.woodLight} {...line} /> : null}
          {tier >= 5 ? <StoneLantern x={12} y={60} s={0.7} snow={winter} /> : null}
        </Svg>
      )
    }
    case 'moosgarten': {
      const n = Math.min(7, 2 + tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="58" rx="36" ry="11" fill={winter ? P.white : P.leaf} {...line} />
          {Array.from({ length: n }, (_, i) => (
            <ellipse key={i} cx={10 + ((i * 17) % 60)} cy={53 + ((i * 7) % 11)} rx={5 + (i % 3)} ry={2.6 + (i % 2)} fill={winter ? P.frost : i % 2 ? P.leafLight : P.leafMoss} stroke={P.outline} strokeWidth={H} />
          ))}
          <ellipse cx="34" cy="57" rx="7" ry="4" fill={P.stoneDark} {...line} />
          {!winter ? <ellipse cx="33" cy="55.6" rx="4" ry="2" fill={P.leafLight} /> : null}
          {tier >= 3 ? <StoneLantern x={58} y={60} s={0.8} snow={winter} /> : null}
          {tier >= 4 ? <Maple x={16} y={64} s={0.9} c={maple} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M44 66 q8 -4 16 0" stroke={P.outline} strokeWidth="3.4" fill="none" strokeLinecap="round" />
              <path d="M44 66 q8 -4 16 0" stroke={P.waterLight} strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'bambushain': {
      const n = Math.min(10, 3 + tier * 2)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          {Array.from({ length: n }, (_, i) => {
            const x = 8 + ((i * 13) % 64)
            const h = 30 + ((i * 7) % 12) + tier * 2
            return (
              <g key={i}>
                <path d={`M${x} 64V${64 - h}`} stroke={P.outline} strokeWidth="3.6" strokeLinecap="round" />
                <path d={`M${x} 64V${64 - h}`} stroke={i % 2 ? P.leafPale : P.leafLight} strokeWidth="2.2" strokeLinecap="round" />
                {Array.from({ length: 4 }, (_, k) => (
                  <path key={k} d={`M${x - 1.6} ${60 - k * (h / 4)}h3.2`} stroke={P.outline} strokeWidth=".8" />
                ))}
                <path d={`M${x} ${64 - h + 4}q5 -2 8 1M${x} ${64 - h + 8}q-5 -2 -8 1`} stroke={P.outline} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d={`M${x} ${64 - h + 4}q5 -2 8 1M${x} ${64 - h + 8}q-5 -2 -8 1`} stroke={winter ? P.winterLeafLight : P.leaf} strokeWidth="1.6" fill="none" strokeLinecap="round" />
                {winter ? <path d={`M${x + 1} ${64 - h + 4}q4 -1 6 0`} stroke={P.white} strokeWidth="1" fill="none" /> : null}
              </g>
            )
          })}
          {tier >= 4 ? (
            <g>
              <path d="M4 66 Q40 60 76 66" stroke={P.outline} strokeWidth="3.4" fill="none" strokeLinecap="round" />
              <path d="M4 66 Q40 60 76 66" stroke={P.woodLight} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? <StoneLantern x={72} y={64} s={0.6} lit snow={winter} /> : null}
        </Svg>
      )
    }
    case 'kirschallee': {
      const color = spring ? P.blossom : season === 'summer' ? P.leaf : P.autumn
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <path d="M29 67 L37 57 H43 L51 67z" fill={gravel} {...detail} />
          <Old>
            <BlossomTree x={18} y={64} s={0.8 + tier * 0.05} winter={winter} color={color} />
            {tier >= 2 ? <BlossomTree x={62} y={64} s={0.8 + tier * 0.04} winter={winter} color={color} /> : null}
            {tier >= 4 ? <BlossomTree x={30} y={50} s={0.55} winter={winter} color={color} /> : null}
            {tier >= 4 ? <BlossomTree x={50} y={50} s={0.55} winter={winter} color={color} /> : null}
          </Old>
          {spring ? Array.from({ length: 4 + tier * 2 }, (_, i) => <ellipse key={i} cx={8 + ((i * 13) % 64)} cy={59 + ((i * 5) % 8)} rx="1.1" ry=".7" fill={P.blossom} />) : null}
          {tier >= 3 ? <StoneLantern x={6} y={66} s={0.6} snow={winter} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M57 64h14" stroke={P.outline} strokeWidth="3.6" strokeLinecap="round" />
              <path d="M57 64h14" stroke={P.berry} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M59 65v3M69 65v3" stroke={P.outline} strokeWidth={D} />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'koiteich': {
      const koi = Math.min(6, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Pond frozen={winter} />
          {Array.from({ length: 5 }, (_, i) => (
            <ellipse key={i} cx={10 + i * 15} cy={67 - (i % 2) * 2} rx="4" ry="2.4" fill={P.stone} {...detail} />
          ))}
          {!winter ? Array.from({ length: koi }, (_, i) => <Koi key={i} x={22 + ((i * 13) % 36)} y={49 + ((i * 5) % 9)} c={[P.orange, P.tomato, P.cream, P.yellow][i % 4]!} s={1.1} />) : null}
          {tier >= 3 && !winter ? <ellipse cx="60" cy="49" rx="4.4" ry="1.9" fill={P.leaf} stroke={P.outline} strokeWidth={H} /> : null}
          {tier >= 4 ? <StoneLantern x={72} y={48} s={0.7} snow={winter} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M8 38 h9 v9" stroke={P.outline} strokeWidth="3" fill="none" strokeLinejoin="round" />
              <path d="M8 38 h9 v9" stroke={P.leafPale} strokeWidth="1.6" fill="none" strokeLinejoin="round" />
              <path d="M17 48 q2 4 0 8" stroke={P.waterLight} strokeWidth="1.8" fill="none" className="orchard-stream" strokeDasharray="2 2" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'zengarten': {
      const lines = 2 + tier
      return (
        <Svg tier={tier} bold>
          <rect x="6" y="46" width="68" height="20" rx="2" fill={gravel} {...line} />
          {Array.from({ length: lines }, (_, i) => (
            <path key={i} d={`M8 ${48 + i * (17 / lines)} H72`} stroke={P.stoneDark} strokeWidth=".7" opacity=".55" />
          ))}
          <ellipse cx="28" cy="56" rx="10" ry="5" fill={gravel} stroke={P.stoneDark} strokeWidth=".7" />
          <ellipse cx="28" cy="56" rx="7" ry="3.4" fill="none" stroke={P.stoneDark} strokeWidth=".7" />
          <Rock x={23} y={57} w={10} h={6} snow={winter} />
          {tier >= 2 ? (
            <g>
              <ellipse cx="56" cy="54" rx="9" ry="4.4" fill="none" stroke={P.stoneDark} strokeWidth=".7" />
              <Rock x={50} y={56} w={12} h={8} snow={winter} />
            </g>
          ) : null}
          {tier >= 3 ? (
            <g>
              <Post x={8} y={46} h={8} w={1.8} k={K} />
              <Post x={72} y={46} h={8} w={1.8} k={K} />
              <path d="M8 40h64" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
              <path d="M8 40h64" stroke={P.woodLight} strokeWidth="1" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 4 ? <Rock x={62} y={63} w={7} h={4} snow={winter} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M44 46 V36 M38 40 l6 -4" stroke={P.outline} strokeWidth="1.4" strokeLinecap="round" />
              <path d="M36 42 l2 -2 6 4" stroke={P.outline} strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'teehaus':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          {/* Veranda auf Pfosten */}
          <Post x={18} y={66} h={8} w={2} k={K} />
          <Post x={60} y={66} h={8} w={2} k={K} />
          <rect x="13" y="55" width="52" height="4" rx="1" fill={P.woodDark} {...line} />
          <rect x="20" y="40" width="38" height="15" fill={P.canvas} {...line} />
          {[26, 32, 38, 44, 50].map((x) => (
            <path key={x} d={`M${x} 40.6v14`} stroke={P.woodDark} strokeWidth=".8" />
          ))}
          <path d="M20.6 47.6h36.8" stroke={P.woodDark} strokeWidth=".6" />
          {tier >= 2 ? <rect x="34" y="44" width="10" height="11" fill={tier >= 3 ? P.lamp : P.paper} className={tier >= 3 ? 'art-window' : undefined} {...detail} /> : null}
          {/* geschwungenes Dach */}
          <path d="M8 41 Q16 38 22 32 H56 Q62 38 70 41z" fill={P.charcoal} {...line} />
          <path d="M24 34.6h30" stroke={P.white} strokeWidth={D} opacity=".2" strokeLinecap="round" />
          {tier >= 3 ? <path d="M24 32 Q28 28 30 24 H48 Q50 28 54 32z" fill={P.charcoal} {...line} /> : null}
          {tier >= 4 ? <StoneLantern x={72} y={66} s={0.8} lit snow={winter} /> : null}
          {tier >= 5 ? <Maple x={6} y={66} s={0.8} c={maple} /> : null}
          {winter ? <path d="M11 39 Q18 36 23 31 H55 Q60 36 67 39" stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'bonsai': {
      const n = Math.min(4, 1 + Math.floor(tier / 2))
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          <Post x={10} y={66} h={8} w={2} k={K} />
          <Post x={70} y={66} h={8} w={2} k={K} />
          <rect x="6" y="56" width="68" height="3" rx="1" fill={P.woodDark} {...line} />
          {Array.from({ length: n }, (_, i) => {
            const x = 16 + i * 16
            const big = i === 0 ? 1 + tier * 0.06 : 0.8
            const leaf = winter ? P.winterLeaf : [P.leafDark, P.leafMoss, P.leaf][i % 3]!
            return (
              <g key={i} transform={`translate(${x} 56) scale(${big})`}>
                <rect x="-6" y="-3" width="12" height="3" rx=".6" fill={[P.denim, P.berry, P.charcoal, P.woodDark][i]} {...detail} />
                <path d="M0 -3 Q-2 -7 1 -9 Q3 -11 0 -14" stroke={P.outline} strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M0 -3 Q-2 -7 1 -9 Q3 -11 0 -14" stroke={P.bark} strokeWidth="1.6" fill="none" strokeLinecap="round" />
                <ellipse cx="-3" cy="-10" rx="4" ry="2" fill={leaf} stroke={P.outline} strokeWidth={H} />
                <ellipse cx="3" cy="-13" rx="3.6" ry="1.8" fill={leaf} stroke={P.outline} strokeWidth={H} />
                <ellipse cx="0" cy="-16" rx="2.6" ry="1.4" fill={leaf} stroke={P.outline} strokeWidth={H} />
                {winter ? <path d="M-6 -11h6M1 -14.4h5" stroke={P.white} strokeWidth=".9" /> : null}
              </g>
            )
          })}
          {tier >= 3 ? <circle cx="8" cy="63" r="2.6" fill={P.stone} {...detail} /> : null}
          {tier >= 5 ? (
            <g>
              <rect x="59" y="38" width="14" height="6" rx="1" fill={P.cream} {...line} />
              <path d="M62 41h8" stroke={P.berry} strokeWidth="1.2" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'rotebruecke':
      return (
        <Svg tier={tier} bold>
          <Pond cy={58} ry={9.4} frozen={winter} />
          {Array.from({ length: 7 }, (_, i) => {
            const x = 12 + i * 9.4
            const t = (x - 8) / 64
            const k = 52 * t * (1 - t)
            return (
              <g key={i}>
                <path d={`M${x} ${52 - k}V${58 - k}`} stroke={P.outline} strokeWidth="2.6" />
                <path d={`M${x} ${52 - k}V${58 - k}`} stroke={P.berry} strokeWidth="1.2" />
              </g>
            )
          })}
          <path d="M8 58 Q40 32 72 58" stroke={P.outline} strokeWidth="5.6" fill="none" strokeLinecap="round" />
          <path d="M8 58 Q40 32 72 58" stroke={P.berry} strokeWidth="3.8" fill="none" strokeLinecap="round" />
          <path d="M8 52 Q40 26 72 52" stroke={P.outline} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M8 52 Q40 26 72 52" stroke={P.berry} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {tier >= 3 && !winter ? <Koi x={24} y={62} c={P.orange} /> : null}
          {tier >= 3 && !winter ? <Koi x={54} y={63} c={P.cream} /> : null}
          {tier >= 4 ? <StoneLantern x={6} y={68} s={0.6} snow={winter} /> : null}
          {tier >= 5 ? <Person x={40} y={42} c={P.pink} s={0.8} /> : null}
          {tier >= 2 && !winter ? <ellipse cx="62" cy="63" rx="3.2" ry="1.3" fill={P.leaf} stroke={P.outline} strokeWidth={H} /> : null}
        </Svg>
      )
    case 'laternenweg': {
      const n = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <path d="M6 66 Q30 54 40 50 Q56 44 74 42" stroke={P.outline} strokeWidth="11" fill="none" strokeLinecap="round" />
          <path d="M6 66 Q30 54 40 50 Q56 44 74 42" stroke={gravel} strokeWidth="8.4" fill="none" strokeLinecap="round" />
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse key={i} cx={12 + i * 12} cy={63 - i * 4} rx="3" ry="1.4" fill={P.stone} {...detail} />
          ))}
          {Array.from({ length: n }, (_, i) => (
            <StoneLantern key={i} x={10 + i * 15} y={58 - i * 4 + (i % 2) * 10} s={0.8} lit={tier >= 3} snow={winter} />
          ))}
          {tier >= 5 ? <Torii x={62} y={44} w={14} h={18} /> : null}
        </Svg>
      )
    }
  }
  return null
}

/* ————————————— Kapitel 12: Gartenschau ————————————— */
