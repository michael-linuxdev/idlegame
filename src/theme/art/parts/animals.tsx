import { P } from '../palette'
import { Place } from './Place'
import { SIZE, STROKE } from './style'

/** Gezeichnete Höhe bei s=1 (für die Maßtabelle). */
const HEN_H = 14.4
const BEE_H = 5
export const HEN_SCALE = SIZE.huhn / HEN_H
export const BEE_SCALE = SIZE.biene / BEE_H

/** Huhn (Seitenansicht, schaut nach rechts); Fußpunkt = zwischen den Füßen. */
export function Hen({ x, y, flip = false, c = P.feather, s = HEN_SCALE }: { x: number; y: number; flip?: boolean; c?: string; s?: number }) {
  return (
    <Place x={x} y={y} s={s} flip={flip}>
      <g transform="translate(0 -7)">
        <ellipse cx="0" cy="0" rx="6" ry="4.6" fill={c} stroke={P.outline} strokeWidth={STROKE.detail} />
        <path d="M-5 -1 L-8 -4 L-6 1 Z" fill={c} stroke={P.outline} strokeWidth={STROKE.hair * 1.6} />
        <circle cx="4.6" cy="-4" r="3" fill={c} stroke={P.outline} strokeWidth={STROKE.detail} />
        <path d="M4 -7.4 q1 -1.6 2 0 q1 -1.6 1.8 0.4" fill={P.red} />
        <path d="M7.4 -4 l2.4 0.8 l-2.4 0.8 z" fill={P.amber} />
        <circle cx="5.4" cy="-4.4" r="0.6" fill={P.outline} />
        <path d="M-1 4.4 V7 M2 4.4 V7" stroke={P.amber} strokeWidth={STROKE.detail} />
      </g>
    </Place>
  )
}

/** Gans/Ente (Seitenansicht); Fußpunkt = unter dem Körper. `swim` ohne Beine. */
export function Bird({ x, y, color = P.cream, neck = P.cream, flip = false, swim = false }: { x: number; y: number; color?: string; neck?: string; flip?: boolean; swim?: boolean }) {
  return (
    <Place x={x} y={y} flip={flip}>
      <g className={swim ? 'ha-swim' : 'ha-graze'}>
        {!swim ? <path d="M-1 3v3M2 3v3" stroke={P.orange} strokeWidth="1" /> : null}
        <ellipse cx="0" cy="0" rx="5.4" ry="3.4" fill={color} stroke={P.outlineFur} strokeWidth=".5" />
        <path d="M3.6 -1q2-5 .8-7.6" stroke={neck} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M4.2 -8.6l3 .9-3 .9z" fill={P.orange} />
        <path d="M-5 -0.4l-2.4-1.6 1 2.4z" fill={color} />
      </g>
    </Place>
  )
}

/** Biene; Mittelpunkt (fliegt, hat keinen Fußpunkt). */
export function Bee({ x, y, s = BEE_SCALE }: { x: number; y: number; s?: number }) {
  return (
    <Place x={x} y={y} s={s} className="ma-bee">
      <ellipse cx="-1.4" cy="-2" rx="1.8" ry="1.2" fill={P.white} opacity="0.85" />
      <ellipse cx="1.4" cy="-2" rx="1.8" ry="1.2" fill={P.white} opacity="0.85" />
      <ellipse cx="0" cy="0" rx="2.6" ry="1.8" fill={P.yellow} stroke={P.outline} strokeWidth={STROKE.hair * 1.2} />
      <path d="M-0.6 -1.6 V1.6 M1 -1.5 V1.5" stroke={P.outline} strokeWidth={STROKE.hair * 1.4} />
    </Place>
  )
}
