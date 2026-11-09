/** Kapitel-Grafik (Kapitel 18–23): gemeinsame Teile. Farben nur aus der Palette. */
import { P } from '../palette'

/** Weißes Schaf mit dunklem Gesicht (Fußpunkt Mitte unten). */
export function Sheep({ x, y, s = 1, flip = false, wool = P.feather }: { x: number; y: number; s?: number; flip?: boolean; wool?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="ha-graze">
        <path d="M-3 -1v2.6M2.4 -1v2.6" stroke={P.charcoal} strokeWidth=".8" />
        <ellipse cx="0" cy="-3.4" rx="4.8" ry="3.2" fill={wool} stroke={P.outlineFur} strokeWidth=".4" />
        <circle cx="-1.8" cy="-5" r="1.6" fill={P.white} opacity=".8" />
        <circle cx="1.2" cy="-5.4" r="1.4" fill={P.white} opacity=".8" />
        <ellipse cx="5" cy="-4.4" rx="1.7" ry="1.3" fill={P.charcoal} />
        <path d="M4.2 -5.6l-1 -.8" stroke={P.charcoal} strokeWidth=".7" />
      </g>
    </g>
  )
}

/**
 * Wasserband quer durchs Bild (Fließ, Gracht, Kanal, Priel). Breite Wasserflächen
 * (ab 10 hoch) bleiben vom Bildrand weg und haben weich gerundete Ufer statt Ecken.
 */
export function WaterBand({ y, h = 7, x0 = 2, x1 = 78, frozen }: { y: number; h?: number; x0?: number; x1?: number; frozen?: boolean }) {
  const wide = h >= 10
  if (wide) {
    x0 = Math.max(x0, 3)
    x1 = Math.min(x1, 77)
  }
  const mid = (x0 + x1) / 2
  const r = wide ? Math.min((x1 - x0) / 4, 20) : Math.min(h / 2, 6)
  return (
    <g>
      <rect x={x0} y={y - h / 2} width={x1 - x0} height={h} rx={r} ry={wide ? h / 2 : r} fill={frozen ? P.glass : P.water} stroke={P.waterDeep} strokeWidth=".4" />
      {frozen ? (
        <path d={`M${x0 + 8} ${y - 1}l6 1.4M${mid} ${y + 1}l8 -1M${x1 - 14} ${y}l5 1`} stroke={P.white} strokeWidth=".6" />
      ) : (
        <path d={`M${x0 + 6} ${y - 1}h8M${mid - 4} ${y + 1}h10M${x1 - 16} ${y - 0.6}h7`} stroke={P.waterLight} strokeWidth=".6" />
      )}
    </g>
  )
}

/** Haus mit dickem Reetdach (Fußpunkt unten links). */
export function ThatchHouse({ x, y, w, h, wall = P.cream, winter, lit }: { x: number; y: number; w: number; h: number; wall?: string; winter?: boolean; lit?: boolean }) {
  const top = y - h
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={wall} stroke={P.outlineWood} strokeWidth=".5" />
      <path d={`M${x - 3} ${top + 2}Q${x - 1} ${top - h * 0.9} ${x + w / 2} ${top - h * 1.05}Q${x + w + 1} ${top - h * 0.9} ${x + w + 3} ${top + 2}z`} fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".5" />
      {[0.25, 0.5, 0.75].map((t) => (
        <path key={t} d={`M${x - 2 + (w + 4) * t} ${top + 1}l${t < 0.5 ? 1 : -1} -${h * 0.5}`} stroke={P.woodMid} strokeWidth=".4" />
      ))}
      <rect x={x + w * 0.42} y={y - h * 0.62} width={w * 0.16} height={h * 0.62} fill={P.leafDark} stroke={P.outlineWood} strokeWidth=".3" />
      {[0.12, 0.7].map((t) => (
        <g key={t}>
          <rect x={x + w * t} y={y - h * 0.72} width={w * 0.18} height={h * 0.32} fill={lit ? P.lamp : P.waterLight} stroke={P.white} strokeWidth=".6" />
          <path d={`M${x + w * (t + 0.09)} ${y - h * 0.72}v${h * 0.32}`} stroke={P.white} strokeWidth=".4" />
        </g>
      ))}
      {winter ? <path d={`M${x - 2} ${top + 1}Q${x} ${top - h * 0.86} ${x + w / 2} ${top - h * 1}Q${x + w} ${top - h * 0.86} ${x + w + 2} ${top + 1}`} stroke={P.white} strokeWidth="1.8" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Langer flacher Kahn/Sandolo (Fußpunkt Mitte, Wasserlinie). */
export function Punt({ x, y, w = 26, c = P.woodDark, cargo }: { x: number; y: number; w?: number; c?: string; cargo?: string[] }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="ha-swim">
        <path d={`M${-w / 2} -2.6L${w / 2 + 2} -3.4L${w / 2 - 1} 0.4H${-w / 2 + 1}z`} fill={c} stroke={P.outline} strokeWidth=".4" />
        <path d={`M${-w / 2 + 2} -2.2H${w / 2}`} stroke={P.woodLight} strokeWidth=".5" />
        {cargo?.map((col, i) => (
          <ellipse key={i} cx={-w / 2 + 5 + i * 4} cy={-3.6} rx="1.8" ry="1.2" fill={col} stroke={P.outline} strokeWidth=".2" />
        ))}
      </g>
    </g>
  )
}

/** Kleine Flamme/Feuer mit Glühen (Fußpunkt Mitte unten). */
export function Fire({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="-5" rx="7" ry="6" fill={P.lamp} opacity=".25" className="fest-glow" />
      <path d="M-4 0Q-5 -6 -1 -10Q-1 -6 1 -7Q2 -11 0 -14Q5 -10 4 -4Q5 -5 5 -7Q7 -3 4 0z" fill={P.orange} />
      <path d="M-2 0Q-3 -4 0 -7Q1 -4 2 -5Q3 -2 2 0z" fill={P.yellow} />
    </g>
  )
}

/** Zwergstrauch mit Beeren (Heidelbeere, Preiselbeere, Sanddorn …). */
export function BerryShrub({ x, y, r = 5, leaf = P.leaf, berry, n = 5, bare }: { x: number; y: number; r?: number; leaf?: string; berry?: string; n?: number; bare?: boolean }) {
  return (
    <g>
      {bare ? (
        <path d={`M${x} ${y}l${-r * 0.7} ${-r * 0.9}M${x} ${y}l${r * 0.1} ${-r * 1.2}M${x} ${y}l${r * 0.7} ${-r * 0.8}`} stroke={P.bark} strokeWidth=".6" />
      ) : (
        <g>
          <ellipse cx={x} cy={y - r * 0.55} rx={r} ry={r * 0.62} fill={leaf} stroke={P.outline} strokeWidth=".3" />
          <ellipse cx={x - r * 0.35} cy={y - r * 0.8} rx={r * 0.4} ry={r * 0.24} fill={P.white} opacity=".18" />
        </g>
      )}
      {berry
        ? Array.from({ length: n }, (_, i) => (
            <circle key={i} cx={x - r * 0.75 + ((i * 7) % 10) * (r * 0.15)} cy={y - r * 0.25 - ((i * 3) % 4) * (r * 0.18)} r={Math.max(0.7, r * 0.17)} fill={berry} stroke={P.outline} strokeWidth=".15" />
          ))
        : null}
    </g>
  )
}

/** Tulpe/Blume mit Stiel (Fußpunkt unten). */
export function Tulip({ x, y, c, h = 6, head = true }: { x: number; y: number; c: string; h?: number; head?: boolean }) {
  return (
    <g>
      <path d={`M${x} ${y}V${y - h}`} stroke={P.leafDark} strokeWidth=".6" />
      <path d={`M${x} ${y}q-2 -2 -1.6 -4.6q1 2 1.6 3`} fill={P.leaf} />
      {head ? <path d={`M${x - 1.3} ${y - h}q0 -2.4 1.3 -2.6q1.3 .2 1.3 2.6q-1.3 .9 -2.6 0z`} fill={c} stroke={P.outline} strokeWidth=".15" /> : null}
    </g>
  )
}
