/**
 * Kapitel 8 — Botanischer Garten im kräftigen Stil (2026-11-14, Weinberg-Niveau):
 * Glashäuser mit dunklem Rahmen und Sprossen, Pflanzen mit Kontur, Bauten aus
 * art/parts/bold.tsx; jede Stufe bringt Neues. Wachstum je Stufe übernimmt `Svg`.
 */
import type { ReactNode } from 'react'
import { Smoke, Svg } from '../../HandParts'
import { Pennant, Pot, Shadow } from '../parts'
import { ArchDoor, GableRoof, Pane, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { type AreaProps, Butterfly } from './partsA'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

/** Glashaus: Glas halbdurchsichtig, Rahmen und Sprossen dunkel, Lichtreflex links. */
function Glass({ x, w, h, roofH = 10, tint = P.glass, ground = 64, curved = false }: { x: number; w: number; h: number; roofH?: number; tint?: string; ground?: number; curved?: boolean }) {
  const top = ground - h
  const panes = Math.max(2, Math.round(w / 7))
  const roof = curved ? `M${x} ${top} Q${x + w / 2} ${top - roofH * 1.6} ${x + w} ${top}z` : `M${x - 1.5} ${top} L${x + w / 2} ${top - roofH} L${x + w + 1.5} ${top}z`
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={tint} opacity=".55" />
      <path d={roof} fill={tint} opacity=".65" />
      {Array.from({ length: panes - 1 }, (_, i) => (
        <path key={i} d={`M${x + ((i + 1) * w) / panes} ${top}V${ground}`} stroke={P.outline} strokeWidth={H} opacity=".7" />
      ))}
      <path d={`M${x} ${top + h / 2}h${w}`} stroke={P.outline} strokeWidth={H} opacity=".7" />
      <rect x={x} y={top} width={w} height={h} fill="none" stroke={P.outline} strokeWidth={BOLD.contour * K} strokeLinejoin="round" />
      <path d={roof} fill="none" stroke={P.outline} strokeWidth={BOLD.contour * K} strokeLinejoin="round" />
      <path d={`M${x + 2.4} ${top + 2.4}l4 7M${x + 6} ${top + 2.4}l2 3.4`} stroke={P.white} strokeWidth={D} opacity=".75" strokeLinecap="round" />
      <rect x={x - 0.6} y={ground - 2.4} width={w + 1.2} height="2.4" fill={P.stone} {...detail} />
    </g>
  )
}

function Palm({ x, y, s = 1, c = P.leaf }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1.2 0 Q-2.2 -10 0 -20 L1.6 -20 Q0 -10 1.2 0z" fill={P.bark} {...detail} />
      {[-60, -25, 10, 45, 80, 140, 200].map((a) => (
        <path key={a} d="M0 -20 q7 -4 13 1 q-6 -1 -13 1z" fill={c} stroke={P.outline} strokeWidth={H} transform={`rotate(${a} 0 -20)`} />
      ))}
    </g>
  )
}

function Cactus({ x, y, h = 10, flower }: { x: number; y: number; h?: number; flower?: string }) {
  return (
    <g>
      <path d={`M${x - 2} ${y - h * 0.5}h-2.4v-${h * 0.3}`} stroke={P.outline} strokeWidth="3.6" strokeLinecap="round" fill="none" />
      <path d={`M${x + 2} ${y - h * 0.4}h2.4v-${h * 0.35}`} stroke={P.outline} strokeWidth="3.6" strokeLinecap="round" fill="none" />
      <path d={`M${x - 2} ${y - h * 0.5}h-2.4v-${h * 0.3}`} stroke={P.leaf} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d={`M${x + 2} ${y - h * 0.4}h2.4v-${h * 0.35}`} stroke={P.leaf} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <rect x={x - 2.2} y={y - h} width="4.4" height={h} rx="2.2" fill={P.leaf} {...detail} />
      <path d={`M${x - 0.8} ${y - h + 2}v${h - 3}`} stroke={P.white} strokeWidth={H} opacity=".4" />
      {flower ? <circle cx={x} cy={y - h - 0.4} r="1.4" fill={flower} stroke={P.outline} strokeWidth={H} /> : null}
    </g>
  )
}

function Conifer({ x, y, s = 1, snow }: { x: number; y: number; s?: number; snow?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1.2" y="-3.4" width="2.4" height="3.4" fill={P.bark} {...detail} />
      <path d="M0 -26 L-7 -12 L-4 -12 L-9 -3 L9 -3 L4 -12 L7 -12z" fill={P.leafDark} {...line} />
      <path d="M0 -24 L-4 -14M-3 -10l-4 6" stroke={P.white} strokeWidth={D} opacity=".25" strokeLinecap="round" />
      {snow ? <path d="M-4 -12h8M-7 -3.6h14M0 -26l-3 6h6z" stroke={P.white} strokeWidth="1.6" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

function Rock({ x, y, w = 12, h = 7, snow }: { x: number; y: number; w?: number; h?: number; snow?: boolean }) {
  return (
    <g>
      <path d={`M${x} ${y} L${x + w * 0.2} ${y - h} L${x + w * 0.62} ${y - h * 1.1} L${x + w} ${y}z`} fill={P.stone} {...line} />
      <path d={`M${x + w * 0.62} ${y - h * 1.1} L${x + w * 0.55} ${y}`} stroke={P.outline} strokeWidth={H} opacity=".4" />
      <path d={`M${x + w * 0.16} ${y - h * 0.4} L${x + w * 0.26} ${y - h * 0.86}`} stroke={P.white} strokeWidth={D} opacity=".35" strokeLinecap="round" />
      {snow ? <path d={`M${x + w * 0.16} ${y - h * 0.8} L${x + w * 0.2} ${y - h} L${x + w * 0.62} ${y - h * 1.1} L${x + w * 0.8} ${y - h * 0.6}`} stroke={P.white} strokeWidth="1.8" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Laubbaum mit runder Krone. */
function Tree({ x, y, r, c }: { x: number; y: number; r: number; c: string }) {
  return (
    <g>
      <path d={`M${x - 1.6} ${y}l.6-16h2l.6 16z`} fill={P.bark} {...detail} />
      <circle cx={x} cy={y - 16 - r * 0.7} r={r} fill={c} {...line} />
      <circle cx={x - r * 0.6} cy={y - 14 - r * 0.2} r={r * 0.55} fill={c} {...line} />
      <path d={`M${x - r * 0.5} ${y - 16 - r * 1.1}q${r * 0.4}-${r * 0.4} ${r}-${r * 0.3}`} stroke={P.white} strokeWidth={D} fill="none" opacity=".35" strokeLinecap="round" />
    </g>
  )
}

/** Namensschild auf einem Pflock. */
function Label({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Post x={x} y={y} h={6} w={1.4} k={K} />
      <rect x={x - 4} y={y - 9.4} width="8" height="4.4" rx=".8" fill={P.paper} {...detail} />
    </g>
  )
}

function Fish({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="ha-fish">
        <ellipse cx="0" cy="0" rx="3.4" ry="1.5" fill={P.orange} stroke={P.outline} strokeWidth={H} />
        <path d="M-3.2 0l-2 -1.6v3.2z" fill={P.orange} />
      </g>
    </g>
  )
}

export function Botanik({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  switch (id) {
    case 'palmenhaus': {
      const palms = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          {Array.from({ length: palms }, (_, i) => {
            const x = [40, 30, 50, 15, 65][i]!
            const wing = i >= 3
            return <Palm key={i} x={x} y={62} s={wing ? 0.5 : 0.72 + tier * 0.05 - (i ? 0.12 : 0)} c={i % 2 ? P.leafLight : P.leaf} />
          })}
          {tier >= 2 ? <Glass x={5} w={19} h={15} roofH={6} /> : null}
          {tier >= 4 ? <Glass x={56} w={19} h={15} roofH={6} /> : null}
          <Glass x={22} w={36} h={18 + tier} roofH={10} curved />
          {tier >= 3 ? <rect x="36" y="53" width="8" height="11" fill={P.glassEdge} {...detail} /> : null}
          {tier >= 5 ? <Pennant x={40} y={30 - tier} s={0.8} /> : null}
          {winter ? <path d={`M25 ${44 - tier} Q40 ${30 - tier} 55 ${44 - tier}`} stroke={P.white} strokeWidth="1.8" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'kakteenhaus': {
      const n = Math.min(6, 1 + tier)
      const bloom = summer || spring
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <ellipse cx="62" cy="63" rx="15" ry="4.4" fill={P.paper} {...line} />
          <Glass x={6} w={42} h={18} roofH={10} tint={P.canvas} />
          <rect x="24" y="52" width="7" height="12" fill={P.glassEdge} {...detail} />
          {Array.from({ length: n }, (_, i) => {
            const inside = i >= 3
            const x = inside ? 12 + (i - 3) * 14 : 54 + i * 7
            return <Cactus key={i} x={x} y={inside ? 61.4 : 63} h={8 + ((i * 5) % 7)} flower={bloom && i % 2 === 0 ? (i % 4 ? P.pink : P.yellow) : undefined} />
          })}
          {tier >= 4 ? (
            <g>
              <ellipse cx="72" cy="52" rx="3.6" ry="4.6" fill={P.leaf} {...detail} />
              <ellipse cx="69" cy="46" rx="2.6" ry="3.2" fill={P.leaf} {...detail} transform="rotate(-30 69 46)" />
              {bloom ? <circle cx="68" cy="43" r="1.3" fill={P.red} stroke={P.outline} strokeWidth={H} /> : null}
            </g>
          ) : null}
          {tier >= 5 ? <Label x={60} y={66} /> : null}
          {winter ? <path d="M5 46 L27 36 L49 46" stroke={P.white} strokeWidth="1.8" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'orchideenhaus': {
      const n = Math.min(8, 2 + tier)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <Glass x={7} w={66} h={22} roofH={11} tint={P.lilac} />
          <rect x="9" y="44" width="62" height="2" rx=".6" fill={P.woodMid} {...detail} />
          {Array.from({ length: n }, (_, i) => {
            const x = 12 + i * 7.6
            const c = [P.lilac, P.cream, P.pink, P.yellow][i % 4]
            return (
              <g key={i}>
                <path d={`M${x - 2} 44h4l-.6 -3h-2.8z`} fill={P.terracotta} {...detail} />
                <path d={`M${x} 41q2-4 4-3`} stroke={P.leafDark} strokeWidth=".8" fill="none" />
                <circle cx={x + 3.6} cy={38} r="1.7" fill={c} stroke={P.outline} strokeWidth={H} />
                <circle cx={x + 3.6} cy={38} r=".6" fill={P.plum} />
              </g>
            )
          })}
          <rect x="34" y="52" width="11" height="12" fill={P.glassEdge} {...detail} />
          {tier >= 4 ? <path d="M6 64q4-8 8-4M66 64q4-8 8-4" stroke={P.leafDark} strokeWidth="1.6" fill="none" strokeLinecap="round" /> : null}
          {tier >= 5 ? <Butterfly x={64} y={26} c={P.blue} /> : null}
          {winter ? <path d="M6 42 L40 31 L74 42" stroke={P.white} strokeWidth="1.8" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'victoriahaus': {
      const pads = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          {tier >= 4 ? (
            <g>
              <path d="M6 64V40 Q40 6 74 40 V64" fill={P.glass} opacity=".4" />
              <path d="M23 64V24M40 64V16M57 64V24" stroke={P.outline} strokeWidth={H} opacity=".6" />
              <path d="M6 64V40 Q40 6 74 40 V64" fill="none" stroke={P.outline} strokeWidth={BOLD.contour * K} />
            </g>
          ) : null}
          <ellipse cx="40" cy="57" rx="34" ry="11" fill={P.stoneLight} {...line} />
          <ellipse cx="40" cy="56" rx="31" ry="9" fill={P.waterDeep} {...detail} />
          {Array.from({ length: pads }, (_, i) => {
            const x = 18 + ((i * 19) % 46)
            const y = 53 + ((i * 7) % 7)
            const r = 6 + (i % 2) * 2
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx={r} ry={r * 0.4} fill={P.leaf} stroke={P.outline} strokeWidth={D} />
                <ellipse cx={x} cy={y} rx={r - 0.8} ry={r * 0.4 - 0.6} fill="none" stroke={P.berry} strokeWidth=".8" />
                <path d={`M${x - r * 0.7} ${y}h${r * 1.4}M${x} ${y - r * 0.3}v${r * 0.6}`} stroke={P.leafDark} strokeWidth=".5" />
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <ellipse cx="50" cy="51" rx="4.2" ry="2.3" fill={tier >= 5 ? P.pink : P.cream} {...detail} />
              <ellipse cx="50" cy="50" rx="2.4" ry="1.6" fill={P.white} />
            </g>
          ) : null}
          {winter ? <Smoke x={20} y={44} /> : null}
          {tier >= 5 ? <Fish x={30} y={60} /> : null}
        </Svg>
      )
    }
    case 'rosarium': {
      const arches = Math.min(3, 1 + Math.floor(tier / 2))
      const rose = summer ? P.red : spring ? P.leaf : autumn ? P.roof : undefined
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="59" rx="36" ry="11" fill={winter ? P.frost : P.leafLight} {...line} />
          <path d="M6 63 Q40 55 74 63" stroke={P.outline} strokeWidth="5.6" fill="none" strokeLinecap="round" />
          <path d="M6 63 Q40 55 74 63" stroke={P.paper} strokeWidth="4" fill="none" strokeLinecap="round" />
          {Array.from({ length: arches }, (_, i) => {
            const x = 14 + i * 22
            return (
              <g key={i}>
                <path d={`M${x} 62V40 Q${x + 9} 28 ${x + 18} 40 V62`} stroke={P.outline} strokeWidth="3.2" fill="none" />
                <path d={`M${x} 62V40 Q${x + 9} 28 ${x + 18} 40 V62`} stroke={P.woodLight} strokeWidth="1.4" fill="none" />
                {rose
                  ? Array.from({ length: 9 }, (_, k) => {
                      const t = k / 8
                      const ang = Math.PI * (1 - t)
                      const cx = x + 9 + Math.cos(ang) * 9
                      const cy = 40 - Math.sin(ang) * 10 + (k === 0 || k === 8 ? 10 : 0)
                      return <circle key={k} cx={cx} cy={cy} r="2.1" fill={k % 2 ? P.leaf : summer ? [P.red, P.pink, P.cream][i % 3] : rose} stroke={P.outline} strokeWidth={H} />
                    })
                  : null}
              </g>
            )
          })}
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
            <g key={i}>
              <ellipse cx={10 + i * 12} cy={67} rx="3.8" ry="2.5" fill={winter ? P.winterLeafLight : P.leafDark} {...detail} />
              {summer ? <circle cx={10 + i * 12} cy={65.4} r="1.4" fill={[P.red, P.pink, P.yellow][i % 3]} stroke={P.outline} strokeWidth={H} /> : null}
            </g>
          ))}
          {tier >= 4 ? (
            <g>
              <path d="M64 54h12" stroke={P.outline} strokeWidth="3.6" strokeLinecap="round" />
              <path d="M64 54h12" stroke={P.woodLight} strokeWidth="1.8" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 && summer ? <Butterfly x={60} y={26} c={P.lamp} /> : null}
        </Svg>
      )
    }
    case 'steingarten': {
      const rocks = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="59" rx="34" ry="10" fill={P.stoneLight} {...line} />
          {Array.from({ length: rocks }, (_, i) => (
            <Rock key={i} x={8 + ((i * 23) % 52)} y={65 - (i % 3) * 4} w={12 + (i % 2) * 6} h={7 + (i % 3) * 3} snow={winter} />
          ))}
          {!winter
            ? Array.from({ length: 3 + tier * 2 }, (_, i) => (
                <ellipse key={i} cx={10 + ((i * 13) % 60)} cy={61 + ((i * 5) % 6)} rx="2.6" ry="1.4" fill={spring || summer ? [P.pink, P.cream, P.lilac, P.yellow][i % 4] : P.leafMoss} stroke={P.outline} strokeWidth={H * 0.7} />
              ))
            : null}
          {tier >= 4 ? <Conifer x={66} y={60} s={0.52} snow={winter} /> : null}
          {tier >= 5 ? <Label x={38} y={52} /> : null}
        </Svg>
      )
    }
    case 'arboretum': {
      const crown = winter ? P.frost : autumn ? P.honey : P.leaf
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <ellipse cx="40" cy="62" rx="34" ry="6" fill={winter ? P.white : P.leafLight} {...line} />
          <Conifer x={17} y={64} s={0.8 + tier * 0.06} snow={winter} />
          {tier >= 2 ? <Tree x={42} y={64} r={7 + tier} c={crown} /> : null}
          {tier >= 3 ? (
            <g transform="translate(65 64)">
              <path d="M-1.2 0V-14h2.4V0z" fill={P.bark} {...detail} />
              {[-1, 0, 1].map((k) => (
                <path key={k} d={`M0 ${-14 - k * 6} q-7 -2 -8 -6 q6 0 8 4 q2 -4 8 -4 q-1 4 -8 6z`} fill={winter ? P.frost : autumn ? P.yellow : P.leafLight} stroke={P.outline} strokeWidth={H} />
              ))}
            </g>
          ) : null}
          {tier >= 4 ? <Label x={30} y={66} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M2 63h18" stroke={P.outline} strokeWidth="3.6" strokeLinecap="round" />
              <path d="M2 63h18" stroke={P.woodLight} strokeWidth="1.8" strokeLinecap="round" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'farnschlucht': {
      const ferns = Math.min(7, 2 + tier)
      const frond = winter ? P.winterLeaf : autumn ? P.honey : P.leaf
      return (
        <Svg tier={tier} bold>
          <path d="M2 66 L10 36 L22 40 L30 66z" fill={P.stoneDark} {...line} />
          <path d="M78 66 L70 34 L58 40 L50 66z" fill={P.stone} {...line} />
          <path d="M11 40l4 12M70 38l-3 12" stroke={P.white} strokeWidth={D} opacity=".3" strokeLinecap="round" />
          <ellipse cx="40" cy="64" rx="17" ry="4.4" fill={winter ? P.glass : P.water} {...line} />
          {tier >= 3 ? (
            <g>
              <path d="M36 40 Q38 52 38 62" stroke={P.outline} strokeWidth="4.6" fill="none" strokeLinecap="round" />
              <path d="M36 40 Q38 52 38 62" stroke={winter ? P.glass : P.waterLight} strokeWidth="3" fill="none" strokeDasharray="3 2" className="orchard-stream" strokeLinecap="round" />
            </g>
          ) : null}
          {Array.from({ length: ferns }, (_, i) => {
            const x = 8 + ((i * 17) % 64)
            const y = 62 - ((i * 5) % 10)
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${(i % 3) * 12 - 12})`}>
                {[-30, 0, 30].map((a) => (
                  <g key={a} transform={`rotate(${a})`}>
                    <path d="M0 0 q-2 -8 0 -14" stroke={P.outline} strokeWidth="3.6" fill="none" strokeLinecap="round" />
                    <path d="M0 0 q-2 -8 0 -14" stroke={frond} strokeWidth="2.4" strokeDasharray="1.4 .6" fill="none" />
                  </g>
                ))}
              </g>
            )
          })}
          {tier >= 5 ? (
            <g>
              <path d="M28 36h24" stroke={P.outline} strokeWidth="4.2" strokeLinecap="round" />
              <path d="M28 36h24" stroke={P.woodMid} strokeWidth="2.4" strokeLinecap="round" />
              <path d="M30 36v-5M50 36v-5M30 31h20" stroke={P.outline} strokeWidth={D} strokeLinecap="round" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'herbarium': {
      const frames = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <Wall x={9} y={40} w={52} h={26} fill={P.paper} k={K} />
          <GableRoof x={9} y={41} w={52} h={13} fill={P.woodDark} over={4} k={K} />
          {/* Säulen */}
          {[15, 25, 45, 55].map((x) => (
            <g key={x}>
              <rect x={x - 1.8} y="42" width="3.6" height="24" fill={P.cream} {...detail} />
              <rect x={x - 2.6} y="41" width="5.2" height="1.8" fill={P.stoneLight} {...detail} />
            </g>
          ))}
          <ArchDoor x={30} y={66} w={10} h={15} k={K} />
          {tier >= 3 ? <Pane x={18} y={48} w={4.4} h={6} k={K} /> : null}
          {tier >= 3 ? <Pane x={48} y={48} w={4.4} h={6} k={K} /> : null}
          {Array.from({ length: frames }, (_, i) => (
            <g key={i}>
              <rect x={63} y={44 + i * 5.4} width="13" height="4.6" rx=".6" fill={P.cream} {...detail} />
              <path d={`M65 ${46.4 + i * 5.4}q4.4 -2 8.8 0`} stroke={P.leafDark} strokeWidth=".8" fill="none" />
            </g>
          ))}
          {tier >= 5 ? <Pennant x={35} y={28} s={0.8} /> : null}
          {winter ? <path d="M5 41 L35 28 L65 41" stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'glaskuppel': {
      const r = 18 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <Palm x={40} y={64} s={(r - 5) / 31} />
          {tier >= 3 ? <Palm x={28} y={64} s={0.7} c={P.leafLight} /> : null}
          {tier >= 3 ? <Palm x={52} y={64} s={0.6} c={P.leafLight} /> : null}
          <path d={`M${40 - r} 64 A${r} ${r} 0 0 1 ${40 + r} 64z`} fill={P.glass} opacity=".4" />
          {[-0.6, -0.2, 0.2, 0.6].map((k) => (
            <path key={k} d={`M40 ${64 - r} Q${40 + k * r * 1.5} ${64 - r * 0.5} ${40 + k * r * 1.5} 64`} stroke={P.outline} strokeWidth={H} fill="none" opacity=".7" />
          ))}
          <path d={`M${40 - r * 0.86} ${64 - r * 0.5}h${r * 1.72}`} stroke={P.outline} strokeWidth={H} opacity=".7" />
          <path d={`M${40 - r} 64 A${r} ${r} 0 0 1 ${40 + r} 64`} fill="none" stroke={P.outline} strokeWidth={BOLD.contour * K} />
          <path d={`M${40 - r * 0.6} ${64 - r * 0.62}q4 -6 10 -8`} stroke={P.white} strokeWidth="1.4" fill="none" opacity=".75" strokeLinecap="round" />
          <rect x={40 - r - 1} y="61.6" width={r * 2 + 2} height="2.4" fill={P.stone} {...detail} />
          {tier >= 4 ? <circle cx="40" cy={64 - r - 1.6} r="2" fill={P.gold} {...detail} /> : null}
          {tier >= 5 ? <Pennant x={40} y={64 - r - 3} s={0.8} /> : null}
          {winter ? <path d={`M${40 - r * 0.7} ${64 - r * 0.72} Q40 ${64 - r * 1.2} ${40 + r * 0.7} ${64 - r * 0.72}`} stroke={P.white} strokeWidth="1.8" fill="none" strokeLinecap="round" /> : null}
          {tier >= 2 ? <Pot x={72} y={66} s={0.5} /> : null}
        </Svg>
      )
    }
  }
  return null
}

/* ————————————— Kapitel 9: Alpen-Alm ————————————— */
