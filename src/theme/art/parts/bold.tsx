/**
 * Kräftiger Stil (Probestück 2026-11): Bausteine mit dicker, dunkler Kontur
 * und einer Licht- und einer Schattenseite je Fläche — Licht von oben links.
 *
 * Koordinaten wie überall im Raster des Bildes (plot 100×86, chapter 80×72).
 * Die Strichstärken gelten im plot-Raster; im Kapitel-Raster `k = 0.85`.
 */
import { P } from '../palette'
import { BOLD, boldDetail, boldLine } from './style'

/**
 * Wand: Fläche mit Kontur, heller Streifen links, Schatten rechts und am
 * Sockel. `planks` zeichnet waagerechte Bretterfugen.
 */
export function Wall({ x, y, w, h, fill = P.wood, planks = 0, k = 1 }: { x: number; y: number; w: number; h: number; fill?: string; planks?: number; k?: number }) {
  const lines = Array.from({ length: planks }, (_, i) => y + ((i + 1) * h) / (planks + 1))
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={1} fill={fill} {...boldLine(k)} />
      {lines.length ? <path d={lines.map((ly) => `M${x + 1.5} ${ly} H${x + w - 1.5}`).join(' ')} stroke={P.outline} strokeWidth={BOLD.hair * k} opacity={0.35} /> : null}
      <rect x={x + 1} y={y + 1} width={w * 0.26} height={h - 2} fill={P.white} opacity={0.16} />
      <rect x={x + w * 0.7} y={y + 1} width={w * 0.3 - 1} height={h - 2} fill={P.outline} opacity={0.15} />
      <rect x={x + 1} y={y + h - 3.2} width={w - 2} height={2.2} fill={P.outline} opacity={0.2} />
    </g>
  )
}

/** Satteldach: Traufe bei y, First bei y − h, `over` = Dachüberstand. Rechte Hälfte im Schatten. */
export function GableRoof({ x, y, w, h, fill = P.roof, over = 4, k = 1 }: { x: number; y: number; w: number; h: number; fill?: string; over?: number; k?: number }) {
  const mx = x + w / 2
  return (
    <g>
      <polygon points={`${x - over},${y} ${mx},${y - h} ${x + w + over},${y}`} fill={fill} {...boldLine(k)} />
      <polygon points={`${mx},${y - h + 2} ${x + w + over - 2.5},${y - 1} ${mx},${y - 1}`} fill={P.outline} opacity={0.18} />
      <path d={`M${x + w * 0.14} ${y - h * 0.3} L${x + w * 0.3} ${y - h * 0.62}`} fill="none" stroke={P.white} strokeWidth={BOLD.detail * k} strokeLinecap="round" opacity={0.4} />
    </g>
  )
}

/** Fenster mit Kreuz und Fensterbank; leuchtet abends über `--art-window`. */
export function Pane({ x, y, w = 9, h = 9, k = 1 }: { x: number; y: number; w?: number; h?: number; k?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={1} fill={P.window} className="art-window" {...boldDetail(k)} />
      <path d={`M${x + w / 2} ${y + 0.8} V${y + h - 0.8} M${x + 0.8} ${y + h * 0.48} H${x + w - 0.8}`} stroke={P.outline} strokeWidth={BOLD.hair * k} opacity={0.75} />
      <rect x={x - 1.2} y={y + h} width={w + 2.4} height={1.8 * k} rx={0.6} fill={P.woodDark} stroke={P.outline} strokeWidth={BOLD.hair * k} />
    </g>
  )
}

/** Bogentür; Fußpunkt = linke untere Ecke. */
export function ArchDoor({ x, y, w = 10, h = 15, fill = P.woodDark, k = 1 }: { x: number; y: number; w?: number; h?: number; fill?: string; k?: number }) {
  return (
    <g>
      <path d={`M${x} ${y} V${y - h + w / 2} a${w / 2} ${w / 2} 0 0 1 ${w} 0 V${y} Z`} fill={fill} {...boldLine(k)} />
      <path d={`M${x + w / 2} ${y - 1.5} V${y - h + 2}`} stroke={P.outline} strokeWidth={BOLD.hair * k} opacity={0.6} />
      <circle cx={x + w - 2.4} cy={y - h * 0.42} r={0.9 * k} fill={P.brass} />
    </g>
  )
}

/** Pfosten/Balken mit Kontur (senkrecht). */
export function Post({ x, y, h, w = 3.4, fill = P.woodDark, k = 1 }: { x: number; y: number; h: number; w?: number; fill?: string; k?: number }) {
  return <rect x={x - w / 2} y={y - h} width={w} height={h} rx={0.8} fill={fill} {...boldDetail(k)} />
}
