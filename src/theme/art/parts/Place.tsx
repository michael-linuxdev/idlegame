import type { ReactNode } from 'react'

/** Setzt einen Baustein mit Fußpunkt (0,0) an (x,y), skaliert und optional gespiegelt. */
export function Place({ x, y, s = 1, flip = false, children, className }: { x: number; y: number; s?: number; flip?: boolean; children: ReactNode; className?: string }) {
  const sx = flip ? -s : s
  const t = s === 1 && !flip ? `translate(${x} ${y})` : `translate(${x} ${y}) scale(${sx} ${s})`
  return (
    <g transform={t} className={className}>
      {children}
    </g>
  )
}
