/** Shared drawing parts for the hand-made chapter art (HandArt*.tsx). */
import type { ReactNode } from 'react'

const V = '0 0 80 72'

export function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox={V} focusable="false">
      {children}
    </svg>
  )
}

export const Shadow = ({ rx = 30 }: { rx?: number }) => <ellipse cx="40" cy="66" rx={rx} ry="4.5" fill="rgba(40,60,20,0.22)" />

export function Meadow({ winter }: { winter?: boolean }) {
  return <ellipse cx="40" cy="56" rx="36" ry="14" fill={winter ? '#e8eef0' : '#8cc06a'} opacity="0.75" />
}

export function Fence({ y = 60, x0 = 4, x1 = 76 }: { y?: number; x0?: number; x1?: number }) {
  const posts = []
  for (let x = x0; x <= x1; x += 8) posts.push(<path key={x} d={`M${x} ${y + 4}V${y - 8}`} stroke="#8a6a40" strokeWidth="1.6" />)
  return (
    <g>
      {posts}
      <path d={`M${x0} ${y - 5}H${x1}M${x0} ${y}H${x1}`} stroke="#a5733f" strokeWidth="1.4" />
    </g>
  )
}

export function Cow({ x, y, flip = false, brown = false }: { x: number; y: number; flip?: boolean; brown?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <g className="ha-graze">
      <path d="M-6 3v4M-2 3v4M3 3v4M6 3v4" stroke="#4a3a2a" strokeWidth="1.2" />
      <ellipse cx="0" cy="0" rx="8" ry="4.8" fill="#fbf6e8" stroke="#6a5a4a" strokeWidth=".6" />
      <ellipse cx="-2" cy="-1" rx="3" ry="2.4" fill={brown ? '#a5531a' : '#3a2a1a'} />
      <ellipse cx="4" cy="1.5" rx="2" ry="1.6" fill={brown ? '#a5531a' : '#3a2a1a'} />
      <ellipse cx="8.6" cy="-2" rx="3" ry="2.6" fill="#fbf6e8" stroke="#6a5a4a" strokeWidth=".6" />
      <ellipse cx="10.4" cy="-1" rx="1.6" ry="1.2" fill="#f2b8b0" />
      <path d="M7 -4.6l-1-1.6M10 -4.6l1-1.6" stroke="#d9c79a" strokeWidth="1" />
      <path d="M-8 0q-2 2-1 5" stroke="#6a5a4a" strokeWidth=".8" fill="none" />
      </g>
    </g>
  )
}

export function Goat({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <g className="ha-graze">
      <path d="M-4 3v3.5M-1 3v3.5M2 3v3.5M4 3v3.5" stroke="#4a3a2a" strokeWidth="1" />
      <ellipse cx="0" cy="0" rx="5.6" ry="3.6" fill="#efe6d4" stroke="#8a7a6a" strokeWidth=".6" />
      <circle cx="5.6" cy="-2.8" r="2.4" fill="#efe6d4" stroke="#8a7a6a" strokeWidth=".5" />
      <path d="M4.6 -4.6q-1.4-3 .6-3.6M6.6 -4.6q.6-3 2.2-2.4" stroke="#8a7a6a" strokeWidth=".9" fill="none" />
      <path d="M6.4 -0.6l.6 2" stroke="#efe6d4" strokeWidth="1.2" />
      </g>
    </g>
  )
}

export function Pig({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`}>
      <g className="ha-graze">
      <ellipse cx="0" cy="0" rx="7" ry="4.6" fill="#f2b8b0" stroke="#c48a80" strokeWidth=".7" />
      <ellipse cx="7" cy="-0.4" rx="2.2" ry="1.8" fill="#e8a098" stroke="#c48a80" strokeWidth=".5" />
      <circle cx="6.6" cy="-0.6" r=".35" fill="#8a4a40" />
      <circle cx="7.6" cy="-0.6" r=".35" fill="#8a4a40" />
      <path d="M3.6 -4l1.4-1.6.6 2" fill="#e8a098" />
      <path d="M-7 -1q-2.4-2 0-3.2" stroke="#c48a80" strokeWidth=".8" fill="none" />
      <path d="M-4 4v2M-1 4v2M2 4v2M4 4v2" stroke="#c48a80" strokeWidth="1.1" />
      </g>
    </g>
  )
}

export function Bird({ x, y, color = '#fbf6e8', neck = '#fbf6e8', flip = false, swim = false }: { x: number; y: number; color?: string; neck?: string; flip?: boolean; swim?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <g className={swim ? 'ha-swim' : 'ha-graze'}>
      {!swim ? <path d="M-1 3v3M2 3v3" stroke="#f08a2c" strokeWidth="1" /> : null}
      <ellipse cx="0" cy="0" rx="5.4" ry="3.4" fill={color} stroke="#8a7a6a" strokeWidth=".5" />
      <path d="M3.6 -1q2-5 .8-7.6" stroke={neck} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M4.2 -8.6l3 .9-3 .9z" fill="#f08a2c" />
      <path d="M-5 -0.4l-2.4-1.6 1 2.4z" fill={color} />
      </g>
    </g>
  )
}

export function Roof({ x, w, y, color, steep = 14 }: { x: number; w: number; y: number; color: string; steep?: number }) {
  return <path d={`M${x - 3} ${y}L${x + w / 2} ${y - steep}L${x + w + 3} ${y}z`} fill={color} stroke="rgba(0,0,0,.2)" strokeWidth=".6" />
}

export function Window({ x, y, lit }: { x: number; y: number; lit?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width="6" height="5.4" fill={lit ? '#ffe9a8' : '#8fd0ec'} stroke="#6e4a2b" strokeWidth=".7" />
      <path d={`M${x + 3} ${y}v5.4M${x} ${y + 2.7}h6`} stroke="#6e4a2b" strokeWidth=".5" />
    </g>
  )
}

export function Smoke({ x, y }: { x: number; y: number }) {
  return <path className="smoke" d={`M${x} ${y}c-2-3 2-5 0-8c-2-3 2-4 0-7`} stroke="#d8d8d8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
}

export function Crate({ x, y, fruit }: { x: number; y: number; fruit: string }) {
  return (
    <g>
      <rect x={x} y={y} width="9" height="6" fill="#c9a46b" stroke="#6e4a2b" strokeWidth=".6" />
      {[1.8, 4.5, 7.2].map((dx) => (
        <circle key={dx} cx={x + dx} cy={y} r="1.6" fill={fruit} />
      ))}
    </g>
  )
}

export function Pond({ cx = 40, cy = 52, rx = 32, ry = 14, frozen }: { cx?: number; cy?: number; rx?: number; ry?: number; frozen?: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 1} rx={rx + 2} ry={ry + 2} fill="#7a8a4c" opacity=".5" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={frozen ? '#cfe2ee' : '#5f9ec4'} />
      <ellipse cx={cx - rx * 0.3} cy={cy - ry * 0.35} rx={rx * 0.35} ry={ry * 0.18} fill="#fff" opacity=".25" />
    </g>
  )
}

export function Lily({ x, y, flower }: { x: number; y: number; flower?: string }) {
  return (
    <g>
      <path d={`M${x} ${y}m-5 0a5 2.6 0 1 0 10 0a5 2.6 0 1 0 -10 0z`} fill="#5f9e45" />
      <path d={`M${x} ${y}l4 -1`} stroke="#4f8a3a" strokeWidth=".6" />
      {flower ? (
        <g>
          <ellipse cx={x} cy={y - 1.4} rx="2.6" ry="1.4" fill={flower} />
          <circle cx={x} cy={y - 1.8} r=".8" fill="#f5c542" />
        </g>
      ) : null}
    </g>
  )
}

export function Reed({ x, h }: { x: number; h: number }) {
  return (
    <g>
      <path d={`M${x} 62V${62 - h}`} stroke="#7a8a4c" strokeWidth="1.3" />
      <ellipse cx={x} cy={62 - h + 3} rx="1.1" ry="3" fill="#6e4a2b" />
      <path d={`M${x} ${62 - h * 0.4}q-4 -4 -6 -10`} stroke="#8a9a5a" strokeWidth="1" fill="none" />
    </g>
  )
}

export function Fish({ x, y, color, s = 1 }: { x: number; y: number; color: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="ha-fish">
      <ellipse cx="0" cy="0" rx="4.6" ry="1.9" fill={color} />
      <path d="M-4.4 0l-3 -2.2v4.4z" fill={color} />
      <circle cx="2.8" cy="-.4" r=".45" fill="#1f2a3a" />
      </g>
    </g>
  )
}

export function Boat({ x, y, color, flip = false }: { x: number; y: number; color: string; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <g className="ha-swim">
      <path d="M-9 0h18l-3 4h-12z" fill={color} stroke="rgba(0,0,0,.3)" strokeWidth=".6" />
      <path d="M-7 0.6h14" stroke="#fff" strokeWidth=".6" opacity=".6" />
      <path d="M-2 0l5 -5" stroke="#8a6a40" strokeWidth=".8" />
      </g>
    </g>
  )
}

export function Hive({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width="8" height="9" rx="1" fill={color} stroke="#6e4a2b" strokeWidth=".6" />
      <rect x={x - 0.8} y={y - 2} width="9.6" height="2.4" rx=".6" fill="#8a6a40" />
      <rect x={x + 2.6} y={y + 7} width="2.8" height="1.2" fill="#3a2a1a" />
    </g>
  )
}

export function Bees({ n, cx = 40, cy = 26 }: { n: number; cx?: number; cy?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <g key={i} className="bee" style={{ animationDelay: `${i * 0.35}s` }}>
          <ellipse cx={cx - 14 + ((i * 11) % 28)} cy={cy + ((i * 7) % 10) - 4} rx="1.6" ry="1.1" fill="#f5c542" stroke="#4a3208" strokeWidth=".4" />
        </g>
      ))}
    </g>
  )
}

export function BlossomTree({ x, y, s = 1, color = '#f7c6d9', winter }: { x: number; y: number; s?: number; color?: string; winter?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1.4 0L-1 -14Q0 -18 1 -14L1.4 0z" fill="#7a5532" />
      <circle cx="0" cy="-22" r="10" fill={winter ? '#c9d0c4' : color} />
      <circle cx="-7" cy="-17" r="6.4" fill={winter ? '#c9d0c4' : color} />
      <circle cx="7" cy="-17" r="6.4" fill={winter ? '#c9d0c4' : color} />
      {winter ? <ellipse cx="0" cy="-30" rx="7" ry="2" fill="#fff" /> : (
        <g fill="#fff" opacity=".7">
          <circle cx="-3" cy="-24" r="1.2" />
          <circle cx="4" cy="-20" r="1.2" />
          <circle cx="-6" cy="-16" r="1" />
        </g>
      )}
    </g>
  )
}

export function House({
  x,
  w,
  h = 18,
  wall,
  roof,
  timber,
  ground = 64,
  steep = 13,
}: {
  x: number
  w: number
  h?: number
  wall: string
  roof: string
  timber?: boolean
  ground?: number
  steep?: number
}) {
  const top = ground - h
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={wall} stroke="#6e4a2b" strokeWidth=".8" />
      {timber ? (
        <g stroke="#6e4a2b" strokeWidth="1.2">
          <path d={`M${x} ${top + h / 2}H${x + w}M${x + w / 3} ${top}V${ground}M${x + (2 * w) / 3} ${top}V${ground}`} />
          <path d={`M${x} ${top}L${x + w / 3} ${top + h / 2}M${x + w} ${top}L${x + (2 * w) / 3} ${top + h / 2}`} />
        </g>
      ) : null}
      <Roof x={x} w={w} y={top} color={roof} steep={steep} />
    </g>
  )
}
