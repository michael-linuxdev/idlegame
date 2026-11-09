/** Kapitel-Grafik (Kräuter, Botanik, Alm): gemeinsame Teile. */
import type { Season } from '../../ambient'
import { P } from '../palette'

export type AreaProps = { id: string; tier: number; season?: Season }

/* ————————————— small parts ————————————— */

export function Soil({ cx = 40, cy = 58, rx = 32, ry = 10, winter }: { cx?: number; cy?: number; rx?: number; ry?: number; winter?: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 1.4} rx={rx + 1.5} ry={ry + 1.5} fill="#7a5a34" opacity=".55" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={winter ? '#eef2f2' : P.outlineSoft} />
    </g>
  )
}

export function Butterfly({ x, y, c = P.cream }: { x: number; y: number; c?: string }) {
  return (
    <g className="bee">
      <path d={`M${x} ${y}c-2.4-2.6-4-1-3 1 1 1.4 3 0 3-1zM${x} ${y}c2.4-2.6 4-1 3 1-1 1.4-3 0-3-1z`} fill={c} stroke={P.outlineWood} strokeWidth=".3" />
    </g>
  )
}

export function Glasshouse({ x, w, h, roofH = 10, tint = '#cfe8f4', ground = 64, curved = false, alpha = 0.72 }: { x: number; w: number; h: number; roofH?: number; tint?: string; ground?: number; curved?: boolean; alpha?: number }) {
  const top = ground - h
  const panes = Math.max(2, Math.round(w / 6))
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={tint} opacity={alpha} stroke="#f5f7f8" strokeWidth="1" />
      {curved ? (
        <path d={`M${x} ${top} Q${x + w / 2} ${top - roofH * 1.6} ${x + w} ${top}z`} fill={tint} opacity={alpha + 0.08} stroke="#f5f7f8" strokeWidth="1" />
      ) : (
        <path d={`M${x - 1} ${top} L${x + w / 2} ${top - roofH} L${x + w + 1} ${top}z`} fill={tint} opacity={alpha + 0.13} stroke="#f5f7f8" strokeWidth="1" />
      )}
      {Array.from({ length: panes - 1 }, (_, i) => (
        <path key={i} d={`M${x + ((i + 1) * w) / panes} ${top}V${ground}`} stroke="#f5f7f8" strokeWidth=".7" />
      ))}
      <path d={`M${x} ${top + h / 2}h${w}`} stroke="#f5f7f8" strokeWidth=".7" />
      <path d={`M${x + 2} ${top + 2}l4 6`} stroke={P.white} strokeWidth="1" opacity=".7" />
    </g>
  )
}

export function Rock({ x, y, w = 12, h = 7, snow }: { x: number; y: number; w?: number; h?: number; snow?: boolean }) {
  return (
    <g>
      <path d={`M${x} ${y} L${x + w * 0.2} ${y - h} L${x + w * 0.62} ${y - h * 1.1} L${x + w} ${y}z`} fill={P.stone} stroke="#7a6e5e" strokeWidth=".6" />
      <path d={`M${x + w * 0.62} ${y - h * 1.1} L${x + w * 0.55} ${y}`} stroke="#8a7e6e" strokeWidth=".5" />
      {snow ? <path d={`M${x + w * 0.16} ${y - h * 0.8} L${x + w * 0.2} ${y - h} L${x + w * 0.62} ${y - h * 1.1} L${x + w * 0.8} ${y - h * 0.6}`} stroke={P.white} strokeWidth="1.8" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

export function Conifer({ x, y, s = 1, snow }: { x: number; y: number; s?: number; snow?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1" y="-3" width="2" height="3" fill={P.outlineWood} />
      <path d="M0 -26 L-7 -12 L-4 -12 L-9 -3 L9 -3 L4 -12 L7 -12z" fill="#2f6a3a" />
      {snow ? <path d="M-4 -12h8M-7 -3.6h14M0 -26l-3 6h6z" stroke={P.white} strokeWidth="1.4" fill="none" /> : null}
    </g>
  )
}

export function Bunting({ y = 26, n = 7, x0 = 4, x1 = 76 }: { y?: number; n?: number; x0?: number; x1?: number }) {
  const step = (x1 - x0) / n
  return (
    <g>
      <path d={`M${x0} ${y} Q40 ${y + 8} ${x1} ${y}`} stroke={P.outlineWood} strokeWidth=".5" fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + step * (i + 0.5)
        const t = (x - x0) / (x1 - x0)
        const yy = y + 8 * 2 * t * (1 - t)
        return <path key={i} d={`M${x - 2} ${yy}h4l-2 3.6z`} fill={[P.tomato, P.cream, P.blue, P.yellow][i % 4]} />
      })}
    </g>
  )
}

export function Snowcap({ d }: { d: string }) {
  return <path d={d} stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" />
}

/* ————————————— Kapitel 7: Kräuterapotheke ————————————— */
