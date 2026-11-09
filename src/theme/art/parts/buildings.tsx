import { P } from '../palette'
import { Place } from './Place'
import { STROKE } from './style'

/** Obstkiste (18×9), optional gefüllt; Fußpunkt = Mitte der Unterkante. */
export function Crate({ x, y, fruit, s = 1 }: { x: number; y: number; fruit?: string; s?: number }) {
  return (
    <Place x={x} y={y} s={s}>
      {fruit
        ? [-6, -2, 2, 6].map((dx, i) => <circle key={dx} cx={dx} cy={-9.5 - (i % 2)} r="2.4" fill={fruit} stroke="rgba(0,0,0,0.25)" strokeWidth={STROKE.hair} />)
        : null}
      <rect x="-9" y="-9" width="18" height="9" rx="1" fill={P.wood} stroke={P.outline} strokeWidth={STROKE.contour} />
      <path d="M-9 -4.5 H9" stroke={P.woodDark} strokeWidth={STROKE.detail} />
    </Place>
  )
}

/** Einmachglas (Honig, Marmelade, Kräuter); Fußpunkt = Bodenmitte. */
export function Jar({ x, y, c = P.honey, lid = P.paper, s = 1 }: { x: number; y: number; c?: string; lid?: string; s?: number }) {
  return (
    <Place x={x} y={y} s={s}>
      <rect x="-3" y="-7" width="6" height="7" rx="1.4" fill={c} stroke={P.outline} strokeWidth={STROKE.detail} />
      <rect x="-3.4" y="-9" width="6.8" height="2.4" rx="0.8" fill={lid} stroke={P.outline} strokeWidth={STROKE.hair * 1.6} />
      <rect x="-1.8" y="-5" width="3.6" height="2.4" fill={P.label} />
    </Place>
  )
}

/** Wimpel an einer Stange — Markenzeichen der höchsten Stufe; Fußpunkt = Stangenfuß. */
export function Pennant({ x, y, h = 12, c = P.roof, s = 1 }: { x: number; y: number; h?: number; c?: string; s?: number }) {
  return (
    <Place x={x} y={y} s={s}>
      <path d={`M0 0 V${-h}`} stroke={P.outlineWood} strokeWidth={STROKE.detail} />
      <path d={`M0 ${-h} l7 2.2 l-7 2.2 z`} fill={c} />
      <circle cx="0" cy={-h - 0.8} r="0.9" fill={P.brass} />
    </Place>
  )
}

/** Holzfass (Wein, Most, Regen); Fußpunkt = Bodenmitte. */
export function Barrel({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <Place x={x} y={y} s={s}>
      <rect x="-4" y="-10" width="8" height="10" rx="2.6" fill={P.woodMid} stroke={P.outlineWood} strokeWidth={STROKE.detail} />
      <path d="M-4 -7 H4 M-4 -3 H4" stroke={P.outlineWood} strokeWidth={STROKE.hair} />
    </Place>
  )
}

/** Laterne an einem Haken; Fußpunkt = Aufhängung oben. */
export function Lantern({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <Place x={x} y={y} s={s} className="art-lantern">
      <path d="M0 0 V2" stroke={P.outline} strokeWidth={STROKE.hair} />
      <rect x="-1.6" y="2" width="3.2" height="4" rx="0.8" fill={P.lamp} stroke={P.outline} strokeWidth={STROKE.hair} />
    </Place>
  )
}

/**
 * Omas Schild — Markenzeichen jedes Kapitel-Bereichs auf Stufe 5:
 * kleines Holzschild mit Herz am linken Rand. Fußpunkt = Pfostenfuß.
 */
export function OmaSign({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <Place x={x} y={y} s={s} className="art-oma-sign">
      <path d="M0 0 V-9" stroke={P.outlineWood} strokeWidth="1.2" />
      <rect x="-4.6" y="-13" width="9.2" height="5.6" rx="1" fill={P.canvas} stroke={P.outlineWood} strokeWidth={STROKE.hair * 1.4} />
      <path d="M0 -8.6 c-2.6 -1.6 -2.2 -3.4 -0.9 -3.4 c0.5 0 0.8 0.3 0.9 0.6 c0.1 -0.3 0.4 -0.6 0.9 -0.6 c1.3 0 1.7 1.8 -0.9 3.4z" fill={P.red} />
    </Place>
  )
}

/**
 * Gartenlaterne auf einem Pfahl; der Lichtschein ist tagsüber unsichtbar und
 * leuchtet abends/nachts (--art-glow aus tokens.css). Fußpunkt = Pfahlfuß.
 */
export function GardenLamp({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <Place x={x} y={y} s={s} className="art-lamp">
      <circle cx="0" cy="-15" r="7" fill={P.lamp} className="art-glow" />
      <path d="M0 0 V-13" stroke={P.outlineWood} strokeWidth="1.3" />
      <path d="M-2.4 -12 H2.4 L1.8 -17.5 H-1.8 Z" fill={P.lamp} stroke={P.outline} strokeWidth={STROKE.detail} />
      <path d="M-2.6 -17.5 H2.6 L0 -20 Z" fill={P.outline} />
    </Place>
  )
}
