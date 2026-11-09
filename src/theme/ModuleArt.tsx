/**
 * Gartenerbe module art — ten garden areas, five visible growth tiers each.
 *
 * Tier thresholds (module level): 1 · 10 · 25 · 50 · 100. Every tier keeps
 * what came before and adds to it, so the garden visibly fills up.
 * All art shares the 100×86 plot viewBox with PlotArt (shadow at y≈76).
 */
import { memo, type ReactNode } from 'react'
import type { GeneratorId } from '../game/generators'
import { moduleTier } from './tiers'

interface Props {
  id: GeneratorId
  level: number
  producing?: boolean
  selected?: boolean
}

const OUT = '#3d2f1f'
const WOOD = '#b98450'
const WOOD_D = '#8a5a32'
const SOIL = '#7a4d30'
const SOIL_D = '#5b3721'
const LEAF = '#5f9e45'
const LEAF_L = '#7fbf5a'
const LEAF_D = '#3f7a30'

/* ———————————————————————— shared bits ———————————————————————— */

function Shadow({ rx = 42, cx = 50 }: { rx?: number; cx?: number }) {
  return <ellipse cx={cx} cy="77" rx={rx} ry="8" fill="var(--g-shadow)" />
}

/** Soil bed: top face (soil) + wooden front face. */
function Bed({
  x,
  y,
  w,
  h = 14,
  front = 6,
  wood = true,
}: {
  x: number
  y: number
  w: number
  h?: number
  front?: number
  wood?: boolean
}) {
  return (
    <g>
      {wood ? (
        <rect x={x} y={y + h} width={w} height={front} rx="1.5" fill={WOOD} stroke={OUT} strokeWidth="1.4" />
      ) : null}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="3"
        fill={SOIL}
        stroke={wood ? OUT : SOIL_D}
        strokeWidth="1.4"
      />
      <path d={`M${x + 4} ${y + h * 0.4} H${x + w - 4} M${x + 4} ${y + h * 0.75} H${x + w - 4}`} stroke={SOIL_D} strokeWidth="1" strokeDasharray="3 3" />
      {wood
        ? Array.from({ length: Math.max(1, Math.floor(w / 14)) }, (_, i) => (
            <line
              key={i}
              x1={x + (i + 1) * (w / (Math.floor(w / 14) + 1))}
              y1={y + h}
              x2={x + (i + 1) * (w / (Math.floor(w / 14) + 1))}
              y2={y + h + front}
              stroke={WOOD_D}
              strokeWidth="1"
            />
          ))
        : null}
    </g>
  )
}

function Sprout({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y} V${y - 4}`} stroke={LEAF_D} strokeWidth="1.3" />
      <ellipse cx={x - 2.2} cy={y - 4.5} rx="2.6" ry="1.5" fill={LEAF_L} transform={`rotate(-25 ${x - 2.2} ${y - 4.5})`} />
      <ellipse cx={x + 2.2} cy={y - 4.5} rx="2.6" ry="1.5" fill={LEAF} transform={`rotate(25 ${x + 2.2} ${y - 4.5})`} />
    </g>
  )
}

function Lettuce({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-3" r="5" fill={LEAF} stroke={LEAF_D} strokeWidth="1" />
      <circle cx="-2" cy="-4" r="3" fill={LEAF_L} />
      <circle cx="1.6" cy="-2.4" r="2.4" fill="#9ad16f" />
    </g>
  )
}

function Carrot({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y} l-3 -7 M${x} ${y} l0 -8 M${x} ${y} l3 -7`} stroke={LEAF} strokeWidth="1.6" strokeLinecap="round" />
      <path d={`M${x - 2} ${y} h4 l-2 3 z`} fill="#f08a2c" />
    </g>
  )
}

function Radish({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y - 2} l-2.5 -5 M${x} ${y - 2} l2.5 -5`} stroke={LEAF} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx={x} cy={y} r="2.6" fill="#e0485e" stroke="#9c2a3c" strokeWidth="0.8" />
    </g>
  )
}

function Flower({ x, y, c = '#f5c542', r = 2.4 }: { x: number; y: number; c?: string; r?: number }) {
  return (
    <g>
      <path d={`M${x} ${y + r} V${y + r + 4}`} stroke={LEAF_D} strokeWidth="1" />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          cx={x + Math.cos((a * Math.PI) / 180) * r * 0.9}
          cy={y + Math.sin((a * Math.PI) / 180) * r * 0.9}
          r={r * 0.62}
          fill={c}
        />
      ))}
      <circle cx={x} cy={y} r={r * 0.45} fill="#7a4a1a" />
    </g>
  )
}

function Bush({
  x,
  y,
  r = 9,
  berry,
}: {
  x: number
  y: number
  r?: number
  berry?: string
}) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={LEAF_D} stroke={OUT} strokeWidth="1.2" />
      <circle cx={x - r * 0.35} cy={y - r * 0.3} r={r * 0.6} fill={LEAF} />
      <circle cx={x + r * 0.4} cy={y - r * 0.15} r={r * 0.45} fill={LEAF_L} />
      {berry
        ? [
            [-0.4, 0.2],
            [0.2, 0.35],
            [0.45, -0.25],
            [-0.1, -0.45],
            [-0.55, -0.15],
          ].map(([dx, dy], i) => (
            <circle key={i} cx={x + dx * r} cy={y + dy * r} r={Math.max(1.3, r * 0.14)} fill={berry} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
          ))
        : null}
    </g>
  )
}

function Tree({
  x,
  y,
  r = 14,
  fruit,
  trunk = 12,
}: {
  x: number
  y: number
  r?: number
  fruit?: string
  trunk?: number
}) {
  return (
    <g>
      <rect x={x - 2.5} y={y} width="5" height={trunk} rx="2" fill="#7a5232" stroke={OUT} strokeWidth="1" />
      <circle cx={x} cy={y - r * 0.4} r={r} fill={LEAF_D} stroke={OUT} strokeWidth="1.3" />
      <circle cx={x - r * 0.45} cy={y - r * 0.2} r={r * 0.62} fill={LEAF} />
      <circle cx={x + r * 0.3} cy={y - r * 0.75} r={r * 0.58} fill={LEAF_L} />
      {fruit
        ? [
            [-0.5, -0.1],
            [0.3, -0.3],
            [0.55, 0.15],
            [-0.15, -0.85],
            [0.05, 0.3],
            [-0.7, -0.6],
          ].map(([dx, dy], i) => (
            <circle key={i} cx={x + dx * r} cy={y - r * 0.4 + dy * r} r={Math.max(1.8, r * 0.13)} fill={fruit} stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />
          ))
        : null}
    </g>
  )
}

function Crate({ x, y, fruit }: { x: number; y: number; fruit?: string }) {
  return (
    <g>
      {fruit ? (
        <g>
          {[3, 7, 11, 15].map((dx, i) => (
            <circle key={dx} cx={x + dx} cy={y - 0.5 - (i % 2)} r="2.4" fill={fruit} stroke="rgba(0,0,0,0.25)" strokeWidth="0.5" />
          ))}
        </g>
      ) : null}
      <rect x={x} y={y} width="18" height="9" rx="1" fill={WOOD} stroke={OUT} strokeWidth="1.2" />
      <path d={`M${x} ${y + 4.5} H${x + 18}`} stroke={WOOD_D} strokeWidth="1" />
    </g>
  )
}

function Bee({ x, y }: { x: number; y: number }) {
  return (
    <g className="ma-bee">
      <ellipse cx={x - 1.4} cy={y - 2} rx="1.8" ry="1.2" fill="#ffffff" opacity="0.85" />
      <ellipse cx={x + 1.4} cy={y - 2} rx="1.8" ry="1.2" fill="#ffffff" opacity="0.85" />
      <ellipse cx={x} cy={y} rx="2.6" ry="1.8" fill="#f5c542" stroke={OUT} strokeWidth="0.6" />
      <path d={`M${x - 0.6} ${y - 1.6} V${y + 1.6} M${x + 1} ${y - 1.5} V${y + 1.5}`} stroke={OUT} strokeWidth="0.7" />
    </g>
  )
}

function Hen({ x, y, flip = false, c = '#f7f1e6' }: { x: number; y: number; flip?: boolean; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <ellipse cx="0" cy="0" rx="6" ry="4.6" fill={c} stroke={OUT} strokeWidth="1" />
      <path d="M-5 -1 L-8 -4 L-6 1 Z" fill={c} stroke={OUT} strokeWidth="0.8" />
      <circle cx="4.6" cy="-4" r="3" fill={c} stroke={OUT} strokeWidth="1" />
      <path d="M4 -7.4 q1 -1.6 2 0 q1 -1.6 1.8 0.4" fill="#e0485e" />
      <path d="M7.4 -4 l2.4 0.8 l-2.4 0.8 z" fill="#f5a623" />
      <circle cx="5.4" cy="-4.4" r="0.6" fill={OUT} />
      <path d="M-1 4.4 V7 M2 4.4 V7" stroke="#f5a623" strokeWidth="1" />
    </g>
  )
}

function Hive({
  x,
  y,
  c = '#f2d27a',
  stories = 1,
}: {
  x: number
  y: number
  c?: string
  stories?: number
}) {
  const h = 9
  const top = y - stories * h
  return (
    <g>
      <rect x={x - 1} y={y} width="3" height="7" fill={WOOD_D} />
      <rect x={x + 15} y={y} width="3" height="7" fill={WOOD_D} />
      {Array.from({ length: stories }, (_, i) => (
        <rect key={i} x={x - 2} y={y - (i + 1) * h} width="21" height={h} rx="1" fill={c} stroke={OUT} strokeWidth="1.2" />
      ))}
      <path d={`M${x - 4} ${top + 1} L${x + 8.5} ${top - 5} L${x + 21} ${top + 1} Z`} fill="#c4553f" stroke={OUT} strokeWidth="1.2" strokeLinejoin="round" />
      <rect x={x + 5} y={y - 3} width="9" height="2" rx="1" fill={OUT} />
    </g>
  )
}

function Jar({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="6" height="7" rx="1.4" fill="#f0a530" stroke={OUT} strokeWidth="0.9" />
      <rect x={x - 0.4} y={y - 2} width="6.8" height="2.4" rx="0.8" fill="#e9dcc2" stroke={OUT} strokeWidth="0.8" />
      <rect x={x + 1.2} y={y + 2} width="3.6" height="2.4" fill="#fff6dc" />
    </g>
  )
}

function Pot({ x, y, s = 1, fruit = '#f5d33d' }: { x: number; y: number; s?: number; fruit?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1.2" y="-12" width="2.4" height="9" fill="#7a5232" />
      <circle cx="0" cy="-16" r="7" fill={LEAF_D} stroke={OUT} strokeWidth="1" />
      <circle cx="-2.4" cy="-17.5" r="4" fill={LEAF} />
      <circle cx="2.6" cy="-14.5" r="1.7" fill={fruit} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
      <circle cx="-3" cy="-13.4" r="1.7" fill={fruit} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
      <circle cx="0.6" cy="-20" r="1.7" fill={fruit} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
      <path d="M-6 -4 H6 L4.6 4 H-4.6 Z" fill="#c8693e" stroke={OUT} strokeWidth="1" />
      <rect x="-6.6" y="-5.4" width="13.2" height="2.6" rx="1" fill="#d97f50" stroke={OUT} strokeWidth="0.8" />
    </g>
  )
}

function Glass({ d }: { d: string }) {
  return <path d={d} fill="rgba(214, 240, 246, 0.55)" stroke="#e8f6fa" strokeWidth="1.6" strokeLinejoin="round" />
}

function Steam({ x, y }: { x: number; y: number }) {
  return (
    <g className="ma-steam" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
      <path d={`M${x} ${y} q-3 -4 0 -8 q3 -4 0 -8`} />
      <path d={`M${x + 6} ${y + 1} q-3 -4 0 -7 q3 -4 0 -7`} />
    </g>
  )
}

/* ———————————————————————— modules ———————————————————————— */

function Gemuesebeet({ t }: { t: number }) {
  return (
    <g>
      <Shadow />
      {t >= 4 ? (
        <g>
          {/* bean teepee */}
          <path d="M28 46 L40 10 L52 46 M34 46 L40 10 L46 46" stroke={WOOD_D} strokeWidth="1.8" fill="none" />
          <path d="M31 40 Q38 30 34 22 Q42 18 40 12 M49 40 Q42 32 46 24" stroke={LEAF} strokeWidth="2.2" fill="none" />
          {[
            [33, 30],
            [46, 28],
            [38, 20],
            [44, 38],
          ].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="3" ry="1.8" fill={LEAF_L} />
          ))}
        </g>
      ) : null}
      {t >= 5 ? (
        <g>
          {/* scarecrow */}
          <path d="M80 70 V22 M70 32 H90" stroke={WOOD_D} strokeWidth="2.4" />
          <path d="M72 32 H88 L86 50 H74 Z" fill="#5a8fc2" stroke={OUT} strokeWidth="1.2" />
          <circle cx="80" cy="22" r="6" fill="#f2d9a0" stroke={OUT} strokeWidth="1.2" />
          <path d="M71 19 H89 L84 12 H76 Z" fill="#c9a24a" stroke={OUT} strokeWidth="1.2" />
          <circle cx="78" cy="22" r="0.9" fill={OUT} />
          <circle cx="82" cy="22" r="0.9" fill={OUT} />
          {/* pumpkins */}
          <ellipse cx="9" cy="64" rx="7" ry="5.4" fill="#f08a2c" stroke={OUT} strokeWidth="1.2" />
          <path d="M9 59 V56" stroke={LEAF_D} strokeWidth="1.6" />
          <ellipse cx="91" cy="70" rx="5.4" ry="4.2" fill="#f5a623" stroke={OUT} strokeWidth="1.1" />
        </g>
      ) : null}
      {t <= 1 ? (
        <g>
          <Bed x={18} y={48} w={64} h={22} wood={false} front={0} />
          {[24, 40, 56, 72].map((x, i) => (
            <Sprout key={x} x={x + (i % 2) * 2} y={56} />
          ))}
          {[30, 46, 62, 78].map((x) => (
            <Sprout key={x} x={x} y={66} />
          ))}
          {/* seed stake */}
          <rect x="80" y="38" width="2" height="14" fill={WOOD_D} />
          <rect x="76" y="36" width="10" height="7" rx="1" fill="#f4ead2" stroke={OUT} strokeWidth="0.9" />
        </g>
      ) : t === 2 ? (
        <g>
          <Bed x={12} y={46} w={76} h={20} front={5} />
          {[24, 38, 52, 66, 80].map((x) => (
            <Lettuce key={x} x={x} y={57} s={0.85} />
          ))}
          {[20, 30, 40, 50, 60, 70, 80].map((x) => (
            <Carrot key={x} x={x} y={64} />
          ))}
        </g>
      ) : (
        <g>
          <Bed x={16} y={44} w={68} h={20} front={9} />
          {[25, 37, 49, 61, 73].map((x) => (
            <Lettuce key={x} x={x} y={52} />
          ))}
          {[23, 32, 41, 50, 59, 68, 77].map((x, i) =>
            i % 2 ? <Radish key={x} x={x} y={62} /> : <Carrot key={x} x={x} y={62} />,
          )}
        </g>
      )}
      {t >= 4 ? (
        <g>
          {/* watering can */}
          <path d="M86 62 h9 v8 h-9 z" fill="#6aa6c9" stroke={OUT} strokeWidth="1.1" />
          <path d="M95 64 l4 -4" stroke="#6aa6c9" strokeWidth="1.8" />
          <path d="M87 62 q4 -5 8 0" fill="none" stroke={OUT} strokeWidth="1" />
        </g>
      ) : null}
      {t >= 5 ? (
        <g>
          <Flower x={6} y={44} c="#f28ab2" />
          <Flower x={12} y={50} c="#f5c542" />
          <Flower x={5} y={52} c="#e5484d" />
        </g>
      ) : null}
    </g>
  )
}

function KompostHeap({ x, w, base = 64, tall = 0.7 }: { x: number; w: number; base?: number; tall?: number }) {
  const peak = base - w * tall
  return (
    <g>
      <path d={`M${x} ${base} Q${x + w / 2} ${peak - w * 0.25} ${x + w} ${base} Z`} fill="#5b3a22" stroke={OUT} strokeWidth="1.2" />
      <ellipse cx={x + w * 0.35} cy={peak + w * 0.2} rx="3" ry="1.6" fill="#8fbf5a" transform={`rotate(-20 ${x + w * 0.35} ${peak + w * 0.2})`} />
      <ellipse cx={x + w * 0.66} cy={peak + w * 0.26} rx="2.4" ry="1.4" fill="#d58a3a" />
      <circle cx={x + w * 0.5} cy={peak + w * 0.08} r="1.6" fill="#c9433a" />
    </g>
  )
}

function KompostBin({ x, w = 24, full = true }: { x: number; w?: number; full?: boolean }) {
  return (
    <g>
      {full ? <KompostHeap x={x + 1} w={w - 2} base={56} tall={1.05} /> : null}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x} y={52 + i * 7} width={w} height="5" rx="1" fill={WOOD} stroke={OUT} strokeWidth="1" />
      ))}
      <rect x={x - 1} y="48" width="3" height="24" fill={WOOD_D} />
      <rect x={x + w - 2} y="48" width="3" height="24" fill={WOOD_D} />
    </g>
  )
}

function Kompost({ t, producing }: { t: number; producing: boolean }) {
  return (
    <g>
      <Shadow />
      {t === 1 ? (
        <g>
          <KompostHeap x={20} w={58} base={70} tall={0.6} />
          <path d="M78 72 L84 44 M81 44 L87 45 M82 41 L86 42" stroke="#6b6f73" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      ) : null}
      {t === 2 ? (
        <g>
          <KompostBin x={26} w={34} />
          <KompostHeap x={60} w={26} base={72} tall={0.6} />
        </g>
      ) : null}
      {t >= 3 ? (
        <g>
          {t >= 5 ? (
            <g>
              <rect x="14" y="30" width="3" height="40" fill={WOOD_D} />
              <rect x="83" y="30" width="3" height="40" fill={WOOD_D} />
              <path d="M8 34 L50 22 L92 34 L92 38 L8 38 Z" fill="#7d9f5a" stroke={OUT} strokeWidth="1.3" strokeLinejoin="round" />
            </g>
          ) : null}
          <KompostBin x={t >= 4 ? 18 : 26} w={22} />
          <KompostBin x={t >= 4 ? 40 : 50} w={22} />
          {t >= 4 ? <KompostBin x={62} w={22} full={t >= 5} /> : null}
          {t === 3 ? (
            <path d="M78 70 L86 40 M83 40 L89 41 M84 37 L88 38" stroke="#6b6f73" strokeWidth="1.8" strokeLinecap="round" />
          ) : null}
        </g>
      ) : null}
      {t >= 4 ? (
        <g>
          {/* wheelbarrow */}
          <path d="M4 66 L20 66 L24 58 L2 58 Z" fill="#c4553f" stroke={OUT} strokeWidth="1.1" />
          <ellipse cx="13" cy="57" rx="10" ry="2.4" fill="#5b3a22" />
          <circle cx="8" cy="70" r="3.4" fill="#3d3d3d" stroke={OUT} strokeWidth="1" />
          <path d="M20 64 L28 72" stroke={WOOD_D} strokeWidth="1.6" />
        </g>
      ) : null}
      {t >= 5 ? (
        <g>
          <rect x="86" y="62" width="10" height="10" rx="1.6" fill="#6b6f73" stroke={OUT} strokeWidth="1" />
          <ellipse cx="91" cy="62" rx="5" ry="1.6" fill="#2c1d12" />
        </g>
      ) : null}
      {producing && t >= 2 ? <Steam x={44} y={44} /> : null}
    </g>
  )
}

function Kraeuterspirale({ t }: { t: number }) {
  const stones = (n: number, cx: number, cy: number, r0: number, grow: number, per = 9) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / per) * Math.PI * 2
      const r = r0 + i * grow
      return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.55 }
    })
  const herbColors = [LEAF, '#8fbf5a', '#6d9b56', '#a3c47a']
  const ring = t <= 1 ? stones(12, 50, 60, 24, 0, 12) : stones(t >= 3 ? 24 : 17, 50, 60, 4, t >= 3 ? 1.35 : 1.6)
  return (
    <g>
      <Shadow />
      {t >= 4 ? (
        <g>
          <ellipse cx="78" cy="70" rx="12" ry="5.4" fill="#5aa9c6" stroke="#857d6c" strokeWidth="1.6" />
          <ellipse cx="74" cy="69" rx="3" ry="1.4" fill={LEAF} />
        </g>
      ) : null}
      {/* soil mound */}
      <ellipse cx="50" cy={t <= 1 ? 60 : 62} rx={t <= 1 ? 25 : 30} ry={t <= 1 ? 13 : 14} fill={SOIL} />
      {t >= 3 ? <ellipse cx="50" cy="54" rx="16" ry="8" fill="#8a5a3b" /> : null}
      {t >= 3 ? <ellipse cx="50" cy="47" rx="8" ry="4" fill="#966646" /> : null}
      {ring.map((p, i) => (
        <ellipse key={i} cx={p.x} cy={p.y - (t >= 3 ? (24 - i) * 0.55 : 0)} rx="3.6" ry="2.6" fill="#c9c3b6" stroke="#8f8676" strokeWidth="0.9" />
      ))}
      {/* herbs */}
      {Array.from({ length: t <= 1 ? 5 : t === 2 ? 7 : 10 }, (_, i) => {
        const a = (i / (t <= 1 ? 5 : 10)) * Math.PI * 2 + 0.4
        const r = t <= 1 ? 11 : 6 + (i % 4) * 4
        const x = 50 + Math.cos(a) * r
        const y = (t >= 3 ? 52 : 60) + Math.sin(a) * r * 0.5
        return (
          <g key={i}>
            <circle cx={x} cy={y - 3} r="3.6" fill={herbColors[i % 4]} stroke={LEAF_D} strokeWidth="0.8" />
            {t >= 3 && i % 3 === 0 ? (
              <path d={`M${x} ${y - 6} v-5`} stroke="#9a6bc9" strokeWidth="2.6" strokeLinecap="round" />
            ) : null}
          </g>
        )
      })}
      {t >= 5 ? (
        <g>
          {/* gnome */}
          <path d="M18 72 L22 56 L26 72 Z" fill="#c4553f" stroke={OUT} strokeWidth="1" />
          <circle cx="22" cy="63" r="3" fill="#f2d9a0" />
          <path d="M19 64 Q22 72 25 64" fill="#ffffff" />
          <rect x="18.5" y="68" width="7" height="5" rx="1" fill="#5a8fc2" />
          <Flower x={84} y={50} c="#f5c542" />
          <Flower x={14} y={48} c="#9a6bc9" />
          <Flower x={90} y={58} c="#ffffff" />
        </g>
      ) : null}
    </g>
  )
}

function Beerenhecke({ t }: { t: number }) {
  const berries = ['#d7263d', '#3b1d4a', '#f0e6c8']
  return (
    <g>
      <Shadow />
      {t >= 4 ? (
        <g>
          {/* raspberry canes */}
          {[22, 34, 46, 58, 70, 82].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 56 Q${x + 2} 30 ${x - 2} 16`} stroke="#7a5a3a" strokeWidth="1.6" fill="none" />
              <ellipse cx={x - 3} cy={26 + (i % 2) * 6} rx="3.6" ry="2" fill={LEAF} />
              <ellipse cx={x + 2} cy={36 - (i % 2) * 4} rx="3.6" ry="2" fill={LEAF_L} />
              <circle cx={x + 1} cy={30} r="1.8" fill="#e0485e" />
            </g>
          ))}
        </g>
      ) : null}
      {t >= 2 ? (
        <g>
          <rect x="14" y="40" width="2.6" height="34" fill={WOOD_D} />
          <rect x="84" y="40" width="2.6" height="34" fill={WOOD_D} />
          <path d="M15 46 H86 M15 56 H86" stroke="#8f8676" strokeWidth="0.9" />
        </g>
      ) : null}
      {t === 1 ? (
        <g>
          <Bush x={44} y={58} r={17} berry={berries[0]} />
          <Bush x={68} y={64} r={10} />
        </g>
      ) : null}
      {t === 2 ? (
        <g>
          <Bush x={33} y={59} r={15} berry={berries[0]} />
          <Bush x={67} y={59} r={15} berry={berries[1]} />
        </g>
      ) : null}
      {t >= 3 ? (
        <g>
          <Bush x={26} y={60} r={13} berry={berries[0]} />
          <Bush x={50} y={57} r={14} berry={berries[1]} />
          <Bush x={74} y={60} r={13} berry={berries[2]} />
        </g>
      ) : null}
      {t >= 4 ? (
        <g>
          {/* basket */}
          <path d="M84 68 h14 l-2 8 h-10 z" fill="#c9a46b" stroke={OUT} strokeWidth="1" />
          <path d="M85 68 q6 -8 12 0" fill="none" stroke={OUT} strokeWidth="1" />
          {[87, 91, 95].map((x) => (
            <circle key={x} cx={x} cy={67} r="1.8" fill="#d7263d" />
          ))}
        </g>
      ) : null}
      {t >= 5 ? (
        <g>
          {/* jam table */}
          <rect x="0" y="66" width="18" height="3" fill={WOOD} stroke={OUT} strokeWidth="0.9" />
          <path d="M2 69 V77 M16 69 V77" stroke={WOOD_D} strokeWidth="1.6" />
          <Jar x={2} y={58} />
          <Jar x={10} y={58} />
        </g>
      ) : null}
    </g>
  )
}

function Obstwiese({ t }: { t: number }) {
  return (
    <g>
      <Shadow rx={44} />
      {t === 1 ? (
        <g>
          <rect x="58" y="22" width="2.4" height="50" fill={WOOD} />
          <path d="M50 72 V40" stroke="#7a5232" strokeWidth="3.2" />
          <path d="M50 52 L59 46" stroke="#8f8676" strokeWidth="1" />
          <circle cx="50" cy="34" r="14" fill={LEAF} stroke={OUT} strokeWidth="1.2" />
          <circle cx="45" cy="31" r="7.4" fill={LEAF_L} />
          <circle cx="56" cy="38" r="5" fill={LEAF_D} opacity="0.5" />
          {/* mulch ring */}
          <ellipse cx="50" cy="72" rx="16" ry="4" fill={SOIL} />
        </g>
      ) : null}
      {t === 2 ? <Tree x={50} y={52} r={19} trunk={20} fruit="#e0485e" /> : null}
      {t === 3 ? (
        <g>
          <Tree x={36} y={54} r={17} trunk={18} fruit="#e0485e" />
          <Tree x={70} y={60} r={12} trunk={12} fruit="#d6c23a" />
        </g>
      ) : null}
      {t >= 4 ? (
        <g>
          <Tree x={28} y={52} r={17} trunk={20} fruit="#e0485e" />
          {t >= 5 ? <Tree x={50} y={44} r={15} trunk={22} fruit="#6a3d8f" /> : null}
          <Tree x={74} y={54} r={16} trunk={18} fruit="#d6c23a" />
          {/* ladder */}
          <path d="M60 74 L66 40 M66 74 L72 40" stroke={WOOD} strokeWidth="1.8" />
          {[46, 54, 62, 70].map((y) => (
            <path key={y} d={`M${60 + (74 - y) * 0.18} ${y} H${66 + (74 - y) * 0.18}`} stroke={WOOD} strokeWidth="1.4" />
          ))}
          <Crate x={8} y={68} fruit="#e0485e" />
          {t >= 5 ? (
            <g>
              <Crate x={78} y={70} fruit="#d6c23a" />
              <Crate x={9} y={59} fruit="#6a3d8f" />
            </g>
          ) : null}
        </g>
      ) : null}
    </g>
  )
}

function Bienenstock({ t, producing }: { t: number; producing: boolean }) {
  return (
    <g>
      <Shadow />
      {t >= 5 ? (
        <g>
          {/* bee house shelter */}
          <rect x="10" y="34" width="3" height="38" fill={WOOD_D} />
          <rect x="87" y="34" width="3" height="38" fill={WOOD_D} />
          <path d="M4 38 L50 22 L96 38 L96 42 L4 42 Z" fill="#c4553f" stroke={OUT} strokeWidth="1.3" strokeLinejoin="round" />
        </g>
      ) : null}
      {t >= 2 ? (
        <g>
          <ellipse cx="18" cy="70" rx="10" ry="4" fill={LEAF_D} />
          {[12, 18, 24].map((x, i) => (
            <path key={x} d={`M${x} 70 v-${6 + i * 2}`} stroke="#9a6bc9" strokeWidth="2.6" strokeLinecap="round" />
          ))}
        </g>
      ) : null}
      {t <= 2 ? (
        <g transform={`translate(50 66) scale(${t <= 1 ? 1.8 : 1.6}) translate(-50 -66)`}>
          <Hive x={40} y={66} stories={t} />
        </g>
      ) : null}
      {t === 3 ? (
        <g>
          <g transform="translate(50 66) scale(1.25) translate(-50 -66)">
            <Hive x={28} y={64} stories={2} />
            <Hive x={53} y={66} stories={2} c="#9ec9e2" />
          </g>
        </g>
      ) : null}
      {t >= 4 ? (
        <g>
          <Hive x={24} y={62} stories={2} />
          <Hive x={46} y={60} stories={3} c="#9ec9e2" />
          <Hive x={68} y={64} stories={2} c="#f4f1e6" />
        </g>
      ) : null}
      {t >= 4 ? (
        <g>
          <Jar x={84} y={66} />
          <Jar x={91} y={67} />
        </g>
      ) : null}
      {producing || t >= 3 ? (
        <g>
          <Bee x={36} y={30} />
          {t >= 3 ? <Bee x={64} y={26} /> : null}
          {t >= 4 ? <Bee x={50} y={18} /> : null}
        </g>
      ) : null}
    </g>
  )
}

function Huehnerstall({ t }: { t: number }) {
  return (
    <g>
      <Shadow rx={44} />
      {t >= 4 ? (
        <g>
          {/* run fence */}
          <path d="M6 76 L6 52 L94 52 L94 76" fill="none" stroke="#c9b48a" strokeWidth="1.4" />
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={`M${6 + i * 8} 52 V76`} stroke="#d9c79f" strokeWidth="1" />
          ))}
        </g>
      ) : null}
      {t <= 2 ? (
        <g>
          {/* A-frame coop */}
          <path d="M30 70 L50 34 L70 70 Z" fill={WOOD} stroke={OUT} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M26 72 L50 30 L74 72" fill="none" stroke="#c4553f" strokeWidth="4" strokeLinejoin="round" />
          <path d="M45 70 V58 Q50 52 55 58 V70 Z" fill={OUT} />
        </g>
      ) : (
        <g>
          {/* coop house on stilts */}
          <rect x="28" y="56" width="3" height="16" fill={WOOD_D} />
          <rect x="65" y="56" width="3" height="16" fill={WOOD_D} />
          <rect x="24" y="34" width="48" height="24" rx="1.5" fill={t >= 5 ? '#d9534f' : WOOD} stroke={OUT} strokeWidth="1.4" />
          {t >= 5 ? (
            <path d="M24 40 H72 M24 46 H72 M24 52 H72" stroke="#b8433f" strokeWidth="1" />
          ) : null}
          <path d="M18 36 L48 18 L78 36 Z" fill="#6b6f73" stroke={OUT} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M40 58 V46 Q44 42 48 46 V58 Z" fill={OUT} />
          <rect x="56" y="42" width="10" height="8" fill="#f7f1e6" stroke={OUT} strokeWidth="1" />
          {/* ramp */}
          <path d="M40 58 L30 74 L36 74 L46 58" fill={WOOD} stroke={OUT} strokeWidth="1" />
          {t >= 5 ? (
            <g>
              {/* weathervane */}
              <path d="M48 18 V8" stroke={OUT} strokeWidth="1.2" />
              <path d="M44 9 q4 -5 8 0 l-2 2 h-4 z" fill="#c9a24a" stroke={OUT} strokeWidth="0.8" />
            </g>
          ) : null}
        </g>
      )}
      {t >= 2 ? <Hen x={16} y={64} /> : null}
      {t >= 3 ? <Hen x={82} y={66} flip c="#c9763a" /> : null}
      {t >= 4 ? (
        <g>
          {/* rooster */}
          <Hen x={64} y={64} c="#8a4a2a" />
          <path d="M57 62 q-6 -6 -4 -12 q2 6 6 6" fill="#2f5e3a" />
        </g>
      ) : null}
      {t >= 5 ? (
        <g>
          <Hen x={10} y={58} c="#3a3a3a" flip />
          <path d="M84 56 h12 l-2 7 h-8 z" fill="#c9a46b" stroke={OUT} strokeWidth="1" />
          {[86.5, 90, 93.5].map((x) => (
            <ellipse key={x} cx={x} cy={55} rx="1.8" ry="2.3" fill="#f7efe0" stroke={OUT} strokeWidth="0.5" />
          ))}
        </g>
      ) : null}
      {t === 3 ? (
        <g>
          <ellipse cx="86" cy="58" rx="1.8" ry="2.3" fill="#f7efe0" stroke={OUT} strokeWidth="0.5" />
          <ellipse cx="90" cy="59" rx="1.8" ry="2.3" fill="#f7efe0" stroke={OUT} strokeWidth="0.5" />
        </g>
      ) : null}
    </g>
  )
}

function Gewaechshaus({ t }: { t: number }) {
  const tomatoes = (x0: number, x1: number, y: number) =>
    Array.from({ length: Math.floor((x1 - x0) / 8) + 1 }, (_, i) => {
      const x = x0 + i * 8
      return (
        <g key={i}>
          <path d={`M${x} ${y} V${y - 18}`} stroke={LEAF_D} strokeWidth="1.4" />
          <ellipse cx={x - 2} cy={y - 12} rx="3" ry="2" fill={LEAF} />
          <ellipse cx={x + 2} cy={y - 6} rx="3" ry="2" fill={LEAF_L} />
          <circle cx={x + 1.6} cy={y - 14} r="2" fill="#e0485e" />
          <circle cx={x - 1.6} cy={y - 4} r="1.8" fill={i % 2 ? '#f5a623' : '#e0485e'} />
        </g>
      )
    })
  if (t === 1) {
    return (
      <g>
        <Shadow />
        {/* cold frame */}
        <path d="M22 70 L22 52 L78 46 L78 70 Z" fill={WOOD} stroke={OUT} strokeWidth="1.4" />
        <Sprout x={34} y={62} />
        <Sprout x={48} y={60} />
        <Sprout x={62} y={58} />
        <Glass d="M22 52 L78 46 L74 34 L26 40 Z" />
        <path d="M50 37 L50 49" stroke="#e8f6fa" strokeWidth="1.2" />
      </g>
    )
  }
  const w = t === 2 ? 48 : t === 3 ? 58 : 70
  const x = 50 - w / 2
  const wallTop = t >= 4 ? 40 : 44
  return (
    <g>
      <Shadow rx={w / 2 + 6} />
      {/* base */}
      <rect x={x} y="66" width={w} height="6" fill="#c9c3b6" stroke={OUT} strokeWidth="1.2" />
      {/* plants inside */}
      {t >= 3 ? tomatoes(x + 6, x + w - 6, 66) : (
        <g>
          <Lettuce x={42} y={64} />
          <Lettuce x={56} y={64} />
        </g>
      )}
      {/* glass walls + roof */}
      <Glass d={`M${x} 66 V${wallTop} H${x + w} V66 Z`} />
      <Glass d={`M${x - 3} ${wallTop + 1} L50 ${wallTop - 22} L${x + w + 3} ${wallTop + 1} Z`} />
      {Array.from({ length: Math.floor(w / 10) }, (_, i) => (
        <path key={i} d={`M${x + (i + 1) * (w / (Math.floor(w / 10) + 1))} 66 V${wallTop}`} stroke="#ffffff" strokeWidth="1.2" />
      ))}
      <path d={`M${x - 3} ${wallTop + 1} L50 ${wallTop - 22} L${x + w + 3} ${wallTop + 1}`} fill="none" stroke={t >= 5 ? '#f4f1e6' : '#e8f6fa'} strokeWidth="2.2" strokeLinejoin="round" />
      {/* door */}
      <rect x="45" y={wallTop + 6} width="10" height={60 - wallTop} fill="rgba(255,255,255,0.35)" stroke="#ffffff" strokeWidth="1.2" />
      {t >= 4 ? (
        <g>
          {/* open roof vent */}
          <path d={`M54 ${wallTop - 16} L66 ${wallTop - 12} L66 ${wallTop - 6} L54 ${wallTop - 10} Z`} fill="rgba(214,240,246,0.7)" stroke="#ffffff" strokeWidth="1" />
          <Pot x={8} y={72} s={0.6} fruit="#e0485e" />
          <Pot x={92} y={72} s={0.6} fruit="#f5a623" />
        </g>
      ) : null}
      {t >= 5 ? (
        <g>
          {/* ornate ridge + finial + hanging baskets */}
          {[38, 44, 50, 56, 62].map((cx) => (
            <circle key={cx} cx={cx} cy={wallTop - 22 + Math.abs(cx - 50) * 0.45} r="1.4" fill="#f4f1e6" />
          ))}
          <circle cx="50" cy={wallTop - 25} r="2.6" fill="#c9a24a" stroke={OUT} strokeWidth="0.8" />
          <Flower x={x + 8} y={wallTop + 4} c="#e5484d" />
          <Flower x={x + w - 8} y={wallTop + 4} c="#f28ab2" />
        </g>
      ) : null}
    </g>
  )
}

function Hofladen({ t }: { t: number }) {
  const produce = ['#e0485e', '#f08a2c', '#7fbf5a', '#f5c542', '#6a3d8f']
  if (t === 1) {
    return (
      <g>
        <Shadow />
        <Crate x={18} y={58} fruit={produce[0]} />
        <Crate x={38} y={60} fruit={produce[1]} />
        <Crate x={28} y={48} fruit={produce[2]} />
        <rect x="68" y="40" width="2.4" height="32" fill={WOOD_D} />
        <rect x="62" y="40" width="22" height="12" rx="1.5" fill="#f4ead2" stroke={OUT} strokeWidth="1.2" />
        <path d="M65 46 H81" stroke="#7a4d30" strokeWidth="1.6" strokeDasharray="3 2" />
        {/* honesty box */}
        <rect x="64" y="62" width="10" height="9" rx="1" fill="#6b6f73" stroke={OUT} strokeWidth="1" />
        <rect x="66.5" y="64" width="5" height="1.2" fill={OUT} />
      </g>
    )
  }
  const stallW = t === 2 ? 56 : 72
  const x = 50 - stallW / 2
  return (
    <g>
      <Shadow rx={stallW / 2 + 8} />
      {t >= 4 ? (
        <g>
          {/* shop hut behind the stall */}
          <rect x={x + 6} y="22" width={stallW - 12} height="34" fill={t >= 5 ? '#e9dcc2' : WOOD} stroke={OUT} strokeWidth="1.4" />
          <path d={`M${x} 24 L50 6 L${x + stallW} 24 Z`} fill="#c4553f" stroke={OUT} strokeWidth="1.4" strokeLinejoin="round" />
          <rect x="44" y="34" width="12" height="22" fill="#7d9f5a" stroke={OUT} strokeWidth="1.2" />
          {t >= 5 ? (
            <g>
              <rect x="34" y="12" width="32" height="9" rx="1.5" fill="#3d5a2e" stroke={OUT} strokeWidth="1" />
              <path d="M38 16.5 H62" stroke="#f4ead2" strokeWidth="1.8" strokeDasharray="4 1.5" />
              {/* lanterns */}
              <circle cx={x + 10} cy="30" r="2.4" fill="#ffd36b" stroke={OUT} strokeWidth="0.8" className="garden-bulb" />
              <circle cx={x + stallW - 10} cy="30" r="2.4" fill="#ffd36b" stroke={OUT} strokeWidth="0.8" className="garden-bulb" />
            </g>
          ) : null}
        </g>
      ) : null}
      {/* stall posts + awning */}
      <rect x={x + 2} y="36" width="3" height="36" fill={WOOD_D} />
      <rect x={x + stallW - 5} y="36" width="3" height="36" fill={WOOD_D} />
      <path d={`M${x - 3} 40 L${x + 4} 30 L${x + stallW - 4} 30 L${x + stallW + 3} 40 Z`} fill="#ffffff" stroke={OUT} strokeWidth="1.3" strokeLinejoin="round" />
      {Array.from({ length: Math.floor(stallW / 8) }, (_, i) => (
        <path
          key={i}
          d={`M${x + 4 + i * 8} 30 L${x + 1 + i * 8.6} 40 L${x + 6 + i * 8.6} 40 L${x + 8 + i * 8} 30 Z`}
          fill="#d9534f"
        />
      ))}
      {Array.from({ length: Math.floor(stallW / 8) + 1 }, (_, i) => (
        <path key={i} d={`M${x - 3 + i * 8.4} 40 q2.1 3 4.2 0`} fill="#d9534f" stroke={OUT} strokeWidth="0.8" />
      ))}
      {/* counter with produce */}
      <rect x={x} y="56" width={stallW} height="16" rx="1.5" fill={WOOD} stroke={OUT} strokeWidth="1.3" />
      <path d={`M${x} 64 H${x + stallW}`} stroke={WOOD_D} strokeWidth="1" />
      {Array.from({ length: Math.floor(stallW / 18) }, (_, i) => (
        <Crate key={i} x={x + 3 + i * 18} y={48} fruit={produce[i % produce.length]} />
      ))}
      {t >= 3 ? (
        <g>
          {/* chalkboard */}
          <path d="M86 74 L90 52 L98 52 L102 74" fill="none" stroke={WOOD_D} strokeWidth="1.6" />
          <rect x="88" y="52" width="12" height="14" fill="#2f3b2f" stroke={WOOD_D} strokeWidth="1.2" />
          <path d="M90 56 H98 M90 60 H96" stroke="#f4f1e6" strokeWidth="1" />
        </g>
      ) : null}
      {t >= 4 ? (
        <g>
          {/* flower buckets */}
          <rect x="2" y="64" width="8" height="9" fill="#6b6f73" stroke={OUT} strokeWidth="0.9" />
          <Flower x={4} y={60} c="#f28ab2" />
          <Flower x={8.5} y={58} c="#f5c542" />
        </g>
      ) : null}
    </g>
  )
}

function Orangerie({ t }: { t: number }) {
  if (t === 1) {
    return (
      <g>
        <Shadow rx={30} />
        <Pot x={46} y={70} s={2.1} />
        <Pot x={74} y={72} s={1.1} fruit="#f5a623" />
      </g>
    )
  }
  if (t === 2) {
    return (
      <g>
        <Shadow />
        {/* iron frame */}
        <path d="M22 72 V42 Q50 16 78 42 V72" fill="rgba(214,240,246,0.35)" stroke="#4a5a52" strokeWidth="1.6" />
        <path d="M36 72 V31 M50 72 V25 M64 72 V31" stroke="#4a5a52" strokeWidth="1" />
        <Pot x={36} y={72} s={1.2} />
        <Pot x={64} y={72} s={1.2} fruit="#f5a623" />
      </g>
    )
  }
  const w = t === 3 ? 56 : t === 4 ? 66 : 80
  const x = 50 - w / 2
  const dome = t >= 4
  const trees = t === 3 ? 2 : t === 4 ? 3 : 4
  return (
    <g>
      <Shadow rx={w / 2 + 8} />
      {t >= 5 ? (
        <g>
          {/* fountain */}
          <ellipse cx="12" cy="66" rx="9" ry="2.8" fill="#5aa9c6" stroke="#857d6c" strokeWidth="1.2" />
          <path d="M12 66 V60 M9 62 q3 -5 6 0" stroke="#bfe6f2" strokeWidth="1.2" fill="none" />
        </g>
      ) : null}
      {/* plinth */}
      <rect x={x} y="64" width={w} height="7" fill="#e9e2d2" stroke={OUT} strokeWidth="1.2" />
      {/* citrus inside */}
      {Array.from({ length: trees }, (_, i) => (
        <Pot key={i} x={x + (w / (trees + 1)) * (i + 1)} y={64} s={0.9} fruit={i % 2 ? '#f5a623' : '#f5d33d'} />
      ))}
      {/* glass hall */}
      <Glass d={`M${x} 64 V36 H${x + w} V64 Z`} />
      {Array.from({ length: Math.floor(w / 9) }, (_, i) => (
        <path key={i} d={`M${x + (i + 1) * (w / (Math.floor(w / 9) + 1))} 64 V36`} stroke="#ffffff" strokeWidth="1.3" />
      ))}
      <rect x={x - 2} y="33" width={w + 4} height="4" rx="1" fill="#f4f1e6" stroke={OUT} strokeWidth="1" />
      {dome ? (
        <g>
          <Glass d={`M${50 - w * 0.28} 34 Q50 ${t >= 5 ? 0 : 8} ${50 + w * 0.28} 34 Z`} />
          <path d={`M50 ${t >= 5 ? 9 : 14} V34 M${50 - w * 0.14} 34 Q50 ${t >= 5 ? 8 : 14} ${50 + w * 0.14} 34`} stroke="#ffffff" strokeWidth="1.1" fill="none" />
          <circle cx="50" cy={t >= 5 ? 7 : 12} r="2.6" fill="#c9a24a" stroke={OUT} strokeWidth="0.8" />
        </g>
      ) : (
        <Glass d={`M${x - 2} 34 L50 18 L${x + w + 2} 34 Z`} />
      )}
      {t >= 5 ? (
        <g>
          <Pot x={92} y={72} s={0.75} fruit="#f5a623" />
        </g>
      ) : null}
    </g>
  )
}

function renderModule(id: GeneratorId, tier: number, producing: boolean): ReactNode {
  switch (id) {
    case 'gemuesebeet':
      return <Gemuesebeet t={tier} />
    case 'kompost':
      return <Kompost t={tier} producing={producing} />
    case 'kraeuterspirale':
      return <Kraeuterspirale t={tier} />
    case 'beerenhecke':
      return <Beerenhecke t={tier} />
    case 'obstwiese':
      return <Obstwiese t={tier} />
    case 'bienenstock':
      return <Bienenstock t={tier} producing={producing} />
    case 'huehnerstall':
      return <Huehnerstall t={tier} />
    case 'gewaechshaus':
      return <Gewaechshaus t={tier} />
    case 'hofladen':
      return <Hofladen t={tier} />
    case 'orangerie':
      return <Orangerie t={tier} />
  }
}

function ModuleArtImpl({ id, level, producing = false, selected = false }: Props) {
  const tier = Math.max(1, moduleTier(level))
  // Stufenwechsel animiert GardenMap über PlotFx onTier + .tier-grow
  const cls =
    `module-art module-${id}` +
    (producing ? ' producing' : '') +
    (selected ? ' selected' : '')

  return (
    <svg className={cls} viewBox="0 0 100 86" focusable="false" aria-hidden="true" data-tier={tier}>
      {renderModule(id, tier, producing)}
    </svg>
  )
}

/** Memoized on tier (not raw level) so per-level buys don't redraw the SVG. */
export const ModuleArt = memo(ModuleArtImpl, (a, b) =>
  a.id === b.id &&
  moduleTier(a.level) === moduleTier(b.level) &&
  a.producing === b.producing &&
  a.selected === b.selected,
)
