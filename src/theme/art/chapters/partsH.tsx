/**
 * Kapitel-Grafik (Kapitel 40–44, Bogen IV „Saatgut für morgen“): gemeinsame
 * Teile. Farben nur aus der Palette. Jahreszeiten wie in Mitteleuropa:
 * Frühling Blüte, Sommer satt, Herbst Laub, Winter kahl und Schnee.
 */
import { P } from '../palette'
import { ssn } from './season'

/** Kind (Fußpunkt Mitte unten), kleiner als Farmer. */
export function Kid({ x, y, c, s = 1, hair = P.bark, skirt }: { x: number; y: number; c: string; s?: number; hair?: string; skirt?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-5.6" r="1.5" fill={P.skin} />
      <path d="M-1.5 -6.2a1.5 1.5 0 0 1 3 0z" fill={hair} />
      <path d="M-1.6 -4h3.2l.5 3h-4.2z" fill={c} />
      {skirt ? <path d="M-2 -1.6h4l.5 1.6h-5z" fill={skirt} /> : <path d="M-.8 -1v1.6M.8 -1v1.6" stroke={P.charcoal} strokeWidth=".7" />}
    </g>
  )
}

/** Salatkopf von oben/schräg: Frühling klein, Sommer groß, Herbst rot (Eichblatt), Winter unter Vlies. */
export function Lettuce({ x, y, s = 1, season, red = false }: { x: number; y: number; s?: number; season?: string; red?: boolean }) {
  const z = ssn(season)
  const k = z === 'spring' ? 0.6 : 1
  const outer = z === 'autumn' || red ? P.berry : P.leaf
  const inner = z === 'autumn' || red ? P.leafPale : P.leafPale
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <ellipse cx="0" cy="-1.2" rx="2.6" ry="1.5" fill={outer} stroke={P.leafDark} strokeWidth=".25" />
      <ellipse cx="0" cy="-1.8" rx="1.6" ry="1.1" fill={inner} />
      <path d="M-1.6 -1.4q1.6 -1 3.2 0" stroke={P.leafDark} strokeWidth=".2" fill="none" />
    </g>
  )
}

/** Holzkasten / Hochbeet (Fußpunkt unten links). */
export function WoodBox({ x, y, w, h = 4, snow, fill = P.wood }: { x: number; y: number; w: number; h?: number; snow?: boolean; fill?: string }) {
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={fill} stroke={P.outlineWood} strokeWidth=".35" />
      <path d={`M${x} ${y - h / 2}h${w}`} stroke={P.woodDark} strokeWidth=".3" />
      <rect x={x + 0.6} y={y - h - 0.8} width={w - 1.2} height="1" fill={snow ? P.white : P.soil} />
    </g>
  )
}

/** Wildbiene / Hummel (klein). */
export function Bee({ x, y, s = 1, bumble = false }: { x: number; y: number; s?: number; bumble?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="-.3" cy="-1" rx=".8" ry=".5" fill={P.white} opacity=".8" />
      <ellipse cx=".5" cy="-1.1" rx=".7" ry=".45" fill={P.white} opacity=".8" />
      <ellipse cx="0" cy="0" rx={bumble ? 1.3 : 1} ry={bumble ? 0.9 : 0.6} fill={bumble ? P.charcoal : P.amber} />
      <path d={bumble ? 'M-.4 -.8v1.6' : 'M-.2 -.6v1.2M.3 -.6v1.2'} stroke={bumble ? P.yellow : P.ink} strokeWidth=".35" />
    </g>
  )
}

/** Sonne (Kreis mit Strahlen). */
export function Sun({ x, y, r = 4, rays = true }: { x: number; y: number; r?: number; rays?: boolean }) {
  return (
    <g>
      {rays
        ? Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4
            return <path key={i} d={`M${(x + Math.cos(a) * (r + 1)).toFixed(2)} ${(y + Math.sin(a) * (r + 1)).toFixed(2)}L${(x + Math.cos(a) * (r + 2.6)).toFixed(2)} ${(y + Math.sin(a) * (r + 2.6)).toFixed(2)}`} stroke={P.yellow} strokeWidth=".8" strokeLinecap="round" />
          })
        : null}
      <circle cx={x} cy={y} r={r} fill={P.yellow} stroke={P.gold} strokeWidth=".4" />
    </g>
  )
}

/** Wolke. */
export function Cloud({ x, y, s = 1, c = P.white }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="5" ry="2.2" fill={c} />
      <ellipse cx="-2" cy="-1.4" rx="2.4" ry="1.8" fill={c} />
      <ellipse cx="1.6" cy="-1.8" rx="2.6" ry="2.2" fill={c} />
    </g>
  )
}

/** Schneeflocken / Schneefall. */
export function Snowfall({ n = 8, y0 = 6, y1 = 40 }: { n?: number; y0?: number; y1?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={6 + ((i * 29) % 68)} cy={y0 + ((i * 17) % (y1 - y0))} r=".7" fill={P.white} />
      ))}
    </g>
  )
}

/** Gießkanne (Fußpunkt unten links). */
export function Can({ x, y, c = P.blue, s = 1 }: { x: number; y: number; c?: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="0" y="-3" width="3" height="3" rx=".4" fill={c} stroke={P.outline} strokeWidth=".2" />
      <path d="M3 -2.4l2.2 -1.8" stroke={c} strokeWidth=".6" />
      <path d="M.4 -3q1.1 -1.6 2.2 0" stroke={c} strokeWidth=".4" fill="none" />
    </g>
  )
}

/**
 * Laubbaum mit Jahreszeiten: Frühling hell mit Blüte, Sommer satt, Herbst
 * orange/gelb, Winter kahl mit Schnee auf den Ästen. `fruit` = Früchte im
 * Spätsommer/Herbst (Nüsse, Äpfel).
 */
export function LeafTree({ x, y, s = 1, season, crown = P.leaf, fruit, blossom, n = 4 }: { x: number; y: number; s?: number; season?: string; crown?: string; fruit?: string; blossom?: string; n?: number }) {
  const z = ssn(season)
  const h = 14 * s
  return (
    <g>
      <path d={`M${x} ${y}V${y - h}`} stroke={P.bark} strokeWidth={1.8 * s} />
      <path d={`M${x} ${y - h * 0.6}l${-4 * s} ${-5 * s}M${x} ${y - h * 0.75}l${4.4 * s} ${-5 * s}`} stroke={P.bark} strokeWidth={0.8 * s} />
      {z === 'winter' ? (
        <g>
          <path d={`M${x} ${y - h}l${-2 * s} ${-5 * s}M${x} ${y - h}l${2.6 * s} ${-4 * s}M${x - 4 * s} ${y - h * 0.6 - 5 * s}l${-2 * s} ${-2 * s}M${x + 4.4 * s} ${y - h * 0.75 - 5 * s}l${2 * s} ${-2 * s}`} stroke={P.bark} strokeWidth={0.5 * s} />
          <path d={`M${x - 5 * s} ${y - h * 0.6 - 4 * s}l${2 * s} ${1 * s}M${x + 3 * s} ${y - h * 0.75 - 4.6 * s}l${2 * s} ${-1 * s}`} stroke={P.white} strokeWidth={0.9 * s} strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx={x} cy={y - h - 3 * s} rx={8 * s} ry={6.4 * s} fill={z === 'autumn' ? P.autumn : z === 'spring' ? P.leafPale : crown} stroke={P.outline} strokeWidth=".35" />
          <ellipse cx={x - 4 * s} cy={y - h + 0.4 * s} rx={4.6 * s} ry={3.6 * s} fill={z === 'autumn' ? P.gold : z === 'spring' ? P.leafLight : P.leafDark} />
          <ellipse cx={x + 4.6 * s} cy={y - h + 0.2 * s} rx={4.4 * s} ry={3.4 * s} fill={z === 'autumn' ? P.autumnDark : z === 'spring' ? P.leafLight : P.leafDark} />
          <ellipse cx={x - 2 * s} cy={y - h - 6 * s} rx={2.6 * s} ry={1.6 * s} fill={P.white} opacity=".15" />
          {z === 'spring' && blossom
            ? Array.from({ length: n + 2 }, (_, i) => <circle key={i} cx={x - 6 * s + ((i * 5) % 12) * s} cy={y - h - 6 * s + ((i * 3) % 7) * s} r={0.8 * s} fill={blossom} />)
            : null}
          {(z === 'summer' || z === 'autumn') && fruit
            ? Array.from({ length: n }, (_, i) => <circle key={i} cx={x - 5 * s + ((i * 7) % 11) * s} cy={y - h - 3 * s + ((i * 5) % 7) * s} r={0.9 * s} fill={fruit} stroke={P.outline} strokeWidth=".15" />)
            : null}
        </g>
      )}
    </g>
  )
}

/** Laub auf dem Boden (Herbst). */
export function LeafLitter({ cx = 40, cy = 62, w = 50, n = 8 }: { cx?: number; cy?: number; w?: number; n?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <ellipse key={i} cx={cx - w / 2 + ((i * 23) % w)} cy={cy - 2 + ((i * 7) % 5)} rx=".9" ry=".5" fill={[P.autumn, P.gold, P.autumnDark][i % 3]} />
      ))}
    </g>
  )
}

/** Kleine Schneehaufen auf dem Boden (Winter). */
export function SnowDrifts({ cx = 40, cy = 62, w = 56, n = 4 }: { cx?: number; cy?: number; w?: number; n?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <ellipse key={i} cx={cx - w / 2 + (w / Math.max(1, n - 1)) * i} cy={cy + ((i * 3) % 4) - 1} rx="3" ry=".8" fill={P.white} />
      ))}
    </g>
  )
}

/** Pilz (Hut + Stiel). */
export function Mushroom({ x, y, s = 1, c = P.woodMid }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-.4 0v-1.4h.8v1.4z" fill={P.cream} />
      <path d="M-1.6 -1.2a1.6 1.2 0 0 1 3.2 0z" fill={c} stroke={P.outlineWood} strokeWidth=".2" />
      <circle cx="-.5" cy="-1.8" r=".25" fill={P.cream} />
    </g>
  )
}

/** Glas mit Samen (Fußpunkt unten Mitte). */
export function SeedJar({ x, y, s = 1, seed = P.seed, lid = P.metal }: { x: number; y: number; s?: number; seed?: string; lid?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1.4" y="-3.6" width="2.8" height="3.6" rx=".5" fill={P.glass} stroke={P.stone} strokeWidth=".2" />
      <rect x="-1.2" y="-2" width="2.4" height="1.8" rx=".3" fill={seed} />
      <rect x="-1.5" y="-4.2" width="3" height=".8" fill={lid} />
    </g>
  )
}

/** Samentütchen. */
export function Packet({ x, y, c = P.paper, s = 1 }: { x: number; y: number; c?: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1.4 0v-3.6l.4 -.4h2l.4 .4v3.6z" fill={c} stroke={P.outlineSoft} strokeWidth=".2" />
      <circle cx="0" cy="-1.8" r=".6" fill={P.leaf} />
    </g>
  )
}

/** Omas Blechdose (klein). */
export function OmaTin({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="-3.4" width="6" height="3.4" rx=".4" fill={P.leafDark} stroke={P.outline} strokeWidth=".25" />
      <rect x="-3.2" y="-4" width="6.4" height="1" rx=".3" fill={P.brass} stroke={P.outline} strokeWidth=".2" />
      <circle cx="0" cy="-1.7" r=".9" fill={P.red} />
    </g>
  )
}

/** Wegweiser mit Pfeil (zeigt nach rechts, links oder unten). */
export function Signpost({ x, y, dir = 'right', c = P.woodLight }: { x: number; y: number; dir?: 'right' | 'left' | 'down'; c?: string }) {
  return (
    <g>
      <path d={`M${x} ${y}v-8`} stroke={P.woodDark} strokeWidth=".8" />
      {dir === 'down' ? (
        <path d={`M${x - 2.4} ${y - 9}h4.8v2.4l-2.4 2l-2.4 -2z`} fill={c} stroke={P.outlineWood} strokeWidth=".3" />
      ) : (
        <path d={dir === 'right' ? `M${x - 2} ${y - 9}h4l1.6 1.4l-1.6 1.4h-4z` : `M${x + 2} ${y - 9}h-4l-1.6 1.4l1.6 1.4h4z`} fill={c} stroke={P.outlineWood} strokeWidth=".3" />
      )}
    </g>
  )
}

/** Sonnenschirm (offen im Sommer, sonst zu). */
export function Parasol({ x, y, c = P.tomato, open = true }: { x: number; y: number; c?: string; open?: boolean }) {
  return (
    <g>
      <path d={`M${x} ${y}v-11`} stroke={P.woodDark} strokeWidth=".6" />
      {open ? (
        <path d={`M${x - 6} ${y - 9}q6 -5 12 0z`} fill={c} stroke={P.outline} strokeWidth=".25" />
      ) : (
        <path d={`M${x - 0.8} ${y - 5}l.8 -6.4l.8 6.4z`} fill={c} stroke={P.outline} strokeWidth=".2" />
      )}
    </g>
  )
}

/** Tischchen mit zwei Hockern. */
export function CafeTable({ x, y, c = P.woodLight }: { x: number; y: number; c?: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y - 3.4} rx="3" ry=".9" fill={c} stroke={P.outlineWood} strokeWidth=".25" />
      <path d={`M${x} ${y - 3}v3`} stroke={P.woodDark} strokeWidth=".5" />
      <path d={`M${x - 4.6} ${y}v-1.8M${x + 4.6} ${y}v-1.8`} stroke={P.metal} strokeWidth=".5" />
      <ellipse cx={x - 4.6} cy={y - 2} rx="1.1" ry=".4" fill={P.metal} />
      <ellipse cx={x + 4.6} cy={y - 2} rx="1.1" ry=".4" fill={P.metal} />
    </g>
  )
}
