/** Hauptgarten-Bereich: gemeinsame Teile. */
import { P } from '../palette'

export const OUT = P.outline

export const WOOD = P.wood

export const WOOD_D = P.woodDark

export const SOIL = P.soil

export const LEAF = P.leaf

export const LEAF_L = P.leafLight

export const LEAF_D = P.leafDark

export function Glass({ d }: { d: string }) {
  return <path d={d} fill="rgba(214, 240, 246, 0.55)" stroke={P.glassEdge} strokeWidth="1.6" strokeLinejoin="round" />
}
