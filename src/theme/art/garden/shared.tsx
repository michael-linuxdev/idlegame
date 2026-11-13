/** Hauptgarten-Bereich: gemeinsame Teile. */
import type { ReactNode } from 'react'
import { P } from '../palette'
import { BOLD } from '../parts/style'

export const OUT = P.outline

export const WOOD = P.wood

export const WOOD_D = P.woodDark

export const SOIL = P.soil

export const LEAF = P.leaf

export const LEAF_L = P.leafLight

export const LEAF_D = P.leafDark

/** Glasfläche; `warm` leuchtet abends und nachts (Orangerie). */
export function Glass({ d, warm = false }: { d: string; warm?: boolean }) {
  return <path d={d} fill={warm ? P.glassWarm : P.glass} fillOpacity="0.55" stroke={P.glassEdge} strokeWidth="1.6" strokeLinejoin="round" />
}

/** Lässt ein Bauwerk je Stufe wachsen: skaliert um den Fußpunkt (Standard: Mitte der Bodenlinie). */
export function Grow({ s, cx = 50, cy = 77, children }: { s: number; cx?: number; cy?: number; children: ReactNode }) {
  return <g transform={s === 1 ? undefined : `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}>{children}</g>
}

/** Stange, Draht oder Sprosse mit dunkler Kontur: ein dunkler Strich unter einem farbigen. */
export function Rod({ d, c = P.woodLight, w = 1.8 }: { d: string; c?: string; w?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={OUT} strokeWidth={w + 1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

/** Kürbis mit Rippen und Stiel; Mittelpunkt (x, y). */
export function Pumpkin({ x, y, r = 6, c = P.orange }: { x: number; y: number; r?: number; c?: string }) {
  return (
    <g>
      <path d={`M${x} ${y - r * 0.7} v${-r * 0.5}`} stroke={OUT} strokeWidth={BOLD.contour + 0.6} strokeLinecap="round" />
      <path d={`M${x} ${y - r * 0.7} v${-r * 0.5}`} stroke={LEAF_D} strokeWidth={BOLD.detail} strokeLinecap="round" />
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.78} fill={c} stroke={OUT} strokeWidth={BOLD.detail} />
      <path d={`M${x - r * 0.35} ${y - r * 0.68} q${-r * 0.4} ${r * 0.7} 0 ${r * 1.36} M${x + r * 0.35} ${y - r * 0.68} q${r * 0.4} ${r * 0.7} 0 ${r * 1.36}`} fill="none" stroke={OUT} strokeWidth={BOLD.hair} opacity="0.4" />
      <ellipse cx={x - r * 0.45} cy={y - r * 0.3} rx={r * 0.22} ry={r * 0.3} fill={P.white} opacity="0.3" />
    </g>
  )
}
