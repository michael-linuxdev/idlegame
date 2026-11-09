/** Kapitel-Grafik (Lavendel, Japangarten, Gartenschau): gemeinsame Teile. */
import type { Season } from '../../ambient'
import { P } from '../palette'

export type AreaProps = { id: string; tier: number; season?: Season }

/* ————————————— small parts ————————————— */

export function Ground({ color, winter }: { color: string; winter?: boolean }) {
  return <ellipse cx="40" cy="57" rx="36" ry="13" fill={winter ? '#e8eef0' : color} opacity=".85" />
}

export function Person({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-7" r="1.6" fill={P.skin} />
      <path d="M-2 -5h4l.6 4h-5.2z" fill={c} />
      <path d="M-1 -1v3M1 -1v3" stroke="#4a3a2a" strokeWidth=".8" />
    </g>
  )
}
