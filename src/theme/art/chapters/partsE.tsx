/** Kapitel-Grafik (Kapitel 24–29): gemeinsame Teile. Farben nur aus der Palette. */
import { P } from '../palette'

/**
 * Weiß gekalktes Haus (Fußpunkt unten links): Flachdach oder Ziegeldach,
 * optional farbiger Sockel/Rand (Alentejo blau, Ägina) und Tür in Farbe.
 */
export function WhiteHouse({
  x,
  y,
  w,
  h,
  roof = 'tile',
  trim,
  door = P.woodDark,
  lit,
}: {
  x: number
  y: number
  w: number
  h: number
  roof?: 'tile' | 'flat'
  trim?: string
  door?: string
  lit?: boolean
}) {
  const top = y - h
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={P.white} stroke={P.stoneLight} strokeWidth=".5" />
      {trim ? <path d={`M${x} ${y - 1.2}h${w}M${x + 0.6} ${top}v${h}M${x + w - 0.6} ${top}v${h}`} stroke={trim} strokeWidth="1.2" /> : null}
      {roof === 'tile' ? (
        <g>
          <path d={`M${x - 2} ${top + 0.6}L${x + w / 2} ${top - h * 0.36}L${x + w + 2} ${top + 0.6}z`} fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".4" />
          <path d={`M${x + 1} ${top - 0.6}L${x + w / 2} ${top - h * 0.3}L${x + w - 1} ${top - 0.6}`} stroke={P.terracottaLight} strokeWidth=".5" fill="none" />
        </g>
      ) : (
        <rect x={x - 0.6} y={top - 1.4} width={w + 1.2} height="1.6" fill={P.cream} stroke={P.stoneLight} strokeWidth=".3" />
      )}
      <rect x={x + w * 0.42} y={y - h * 0.6} width={w * 0.18} height={h * 0.6} rx={w * 0.04} fill={door} stroke={P.outline} strokeWidth=".3" />
      <rect x={x + w * 0.12} y={y - h * 0.72} width={w * 0.16} height={h * 0.26} fill={lit ? P.lamp : P.charcoal} stroke={trim ?? P.stone} strokeWidth=".4" />
    </g>
  )
}

/** Weißstorch, stehend (Fußpunkt Mitte unten). */
export function Stork({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-.6 0v-5M.8 0v-5" stroke={P.tomato} strokeWidth=".5" />
      <ellipse cx="0" cy="-6.6" rx="3.2" ry="1.9" fill={P.white} stroke={P.stoneLight} strokeWidth=".2" />
      <path d="M-3.2 -6.4h3.4l-1.4 1.6z" fill={P.ink} />
      <path d="M2.2 -7.4q1 -2.6 .4 -5" stroke={P.white} strokeWidth="1" fill="none" />
      <circle cx="2.6" cy="-12.6" r=".9" fill={P.white} />
      <path d="M3.2 -12.6l2.8 1" stroke={P.tomato} strokeWidth=".6" />
    </g>
  )
}

/** Storchennest auf einem Mast oder Dach (Fußpunkt = Nestmitte unten). */
export function Nest({ x, y, w = 8 }: { x: number; y: number; w?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y - 1} rx={w / 2} ry="1.6" fill={P.woodMid} stroke={P.bark} strokeWidth=".3" />
      <path d={`M${x - w / 2} ${y - 1.4}l${w * 0.2} -.8M${x} ${y - 1.6}l${w * 0.24} .6M${x + w * 0.2} ${y - 0.6}l${w * 0.2} -1`} stroke={P.woodLight} strokeWidth=".4" />
    </g>
  )
}

/** Schwarzes Iberisches Schwein (Fußpunkt Mitte unten). */
export function BlackPig({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="ha-graze">
        <path d="M-2.6 -1v1.6M2.2 -1v1.6" stroke={P.charcoal} strokeWidth=".8" />
        <ellipse cx="0" cy="-2.8" rx="4.2" ry="2.4" fill={P.charcoal} />
        <path d="M3.4 -3.6l2.6 1.4l-.4 1.4h-2z" fill={P.charcoal} />
        <path d="M3.6 -4.6l1 -1.2l.2 1.4z" fill={P.metal} />
        <path d="M-4.2 -3.4q-1 -.6 -.6 -1.6" stroke={P.charcoal} strokeWidth=".4" fill="none" />
      </g>
    </g>
  )
}

/**
 * Trockenmauer aus Bruchstein (Fußpunkt unten links). `c` = Steinfarbe;
 * `gaps` lässt Licht durch die Fugen (Aran).
 */
export function DryWall({ x, y, w, h, c = P.stoneLight, gaps }: { x: number; y: number; w: number; h: number; c?: string; gaps?: boolean }) {
  const rows = Math.max(1, Math.round(h / 2.6))
  const rh = h / rows
  const out = []
  for (let r = 0; r < rows; r++) {
    const n = Math.max(1, Math.round(w / 4))
    for (let k = 0; k < n; k++) {
      const sw = w / n
      const sx = x + k * sw + (r % 2 ? sw * 0.3 : 0)
      if (sx + sw * 0.5 > x + w) continue
      out.push(<ellipse key={`${r}-${k}`} cx={sx + sw / 2} cy={y - rh * (r + 0.5)} rx={sw * (gaps ? 0.42 : 0.52)} ry={rh * 0.56} fill={(r + k) % 3 ? c : P.stone} stroke={P.outlineStone} strokeWidth=".25" />)
    }
  }
  return <g>{out}</g>
}

/** Bitterorangenbaum: dunkle runde Krone. Winter: reife Früchte, Frühling: weiße Blüten (Azahar). */
export function OrangeTree({ x, y, s = 1, season, fruits = 5 }: { x: number; y: number; s?: number; season?: string; fruits?: number }) {
  const fruitC = season === 'summer' ? P.leafPale : season === 'autumn' ? P.amber : P.orange
  const n = season === 'spring' ? Math.max(1, fruits - 3) : fruits
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-.9 0V-7M.9 0V-7" stroke={P.bark} strokeWidth="1" />
      <circle cx="0" cy="-13" r="8" fill={P.leafDark} stroke={P.outline} strokeWidth=".3" />
      <ellipse cx="-2.6" cy="-16" rx="3.4" ry="2.4" fill={P.leaf} opacity=".7" />
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={[-4, 3.6, -0.6, 5, -5.4, 1.4, -2.4][i % 7]!} cy={[-10, -11.6, -7.4, -15, -14.4, -17.6, -12][i % 7]!} r="1.3" fill={fruitC} stroke={P.outline} strokeWidth=".15" />
      ))}
      {season === 'spring'
        ? [
            [-5, -17],
            [2, -19],
            [5.6, -12],
            [-1, -11],
            [-6, -11],
          ].map(([dx, dy], i) => <circle key={`b${i}`} cx={dx} cy={dy} r=".9" fill={P.white} />)
        : null}
    </g>
  )
}

/** Korkeiche: knorriger Stamm, breite immergrüne Krone; `stripped` = unten frisch geschält (rot). */
export function CorkOak({ x, y, s = 1, season, stripped, digit }: { x: number; y: number; s?: number; season?: string; stripped?: boolean; digit?: boolean }) {
  const crown = season === 'winter' ? P.winterLeafDark : season === 'spring' ? P.leaf : P.leafDark
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-2.2 0Q-1.4 -6 -2.4 -10L-6 -15M-1.6 -9L1 -16M2.2 0Q1.6 -6 2.6 -9L7 -14" stroke={P.bark} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {stripped ? <path d="M-2 -.4Q-1.4 -5 -2 -8.6H2.2Q1.6 -5 2 -.4z" fill={P.terracotta} stroke={P.autumnDark} strokeWidth=".3" /> : null}
      {stripped && digit ? <path d="M-.6 -6.6h1.2l-1 3" stroke={P.white} strokeWidth=".45" fill="none" /> : null}
      <ellipse cx="0" cy="-18" rx="13" ry="6.4" fill={crown} stroke={P.outline} strokeWidth=".3" />
      <ellipse cx="-6" cy="-15" rx="6" ry="3.6" fill={crown} stroke={P.outline} strokeWidth=".3" />
      <ellipse cx="7" cy="-15.6" rx="6" ry="3.4" fill={crown} stroke={P.outline} strokeWidth=".3" />
      <ellipse cx="-3" cy="-21" rx="5" ry="2" fill={P.leafLight} opacity=".35" />
    </g>
  )
}

/** Paprikapflanze: Busch mit hängenden Schoten (grün → rot im Herbst). */
export function PepperPlant({ x, y, s = 1, season, pods = 3 }: { x: number; y: number; s?: number; season?: string; pods?: number }) {
  if (season === 'winter') {
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 0V-4M0 -2.6l-2 -1.6M0 -3l1.8 -1.6" stroke={P.woodMid} strokeWidth=".6" />
        <ellipse cx="0" cy=".2" rx="2.6" ry=".7" fill={P.white} opacity=".9" />
      </g>
    )
  }
  const podC = season === 'autumn' ? P.tomato : season === 'summer' ? P.leaf : P.leafPale
  const leaf = season === 'spring' ? P.leafPale : P.leafDark
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-5" stroke={P.leafDark} strokeWidth=".7" />
      <ellipse cx="0" cy="-6.4" rx="4.2" ry="3" fill={leaf} stroke={P.outline} strokeWidth=".25" />
      {season === 'spring' ? <circle cx="1.4" cy="-7.6" r=".8" fill={P.white} /> : null}
      {Array.from({ length: pods }, (_, i) => (
        <path key={i} d={`M${-2.4 + i * 2.2} -5.4q.9 .4 .5 3.8q-.4 .5 -.9 0q-.6 -2.6 .4 -3.8z`} fill={podC} stroke={P.outline} strokeWidth=".15" />
      ))}
    </g>
  )
}

/** Damaszener Rosenbusch. Frühling/Sommer Blüten (rosa), Herbst Hagebutten, Winter kahl. */
export function RoseBush({ x, y, s = 1, season, n = 4 }: { x: number; y: number; s?: number; season?: string; n?: number }) {
  if (season === 'winter') {
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 0l-3 -6M0 0l.4 -7M0 0l3 -5.4" stroke={P.bark} strokeWidth=".6" />
        <ellipse cx="0" cy=".2" rx="3.4" ry=".8" fill={P.white} opacity=".9" />
      </g>
    )
  }
  const leaf = season === 'autumn' ? P.autumn : season === 'spring' ? P.leaf : P.leafDark
  const dot = season === 'autumn' ? P.berry : season === 'summer' ? P.blossom : P.pink
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="-3.6" rx="4.6" ry="3.6" fill={leaf} stroke={P.outline} strokeWidth=".25" />
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={[-2.6, 2, -0.4, 3, -3.4, 0.8][i % 6]!} cy={[-5, -5.6, -2.8, -3, -2.6, -6.6][i % 6]!} r={season === 'autumn' ? 0.7 : 1.1} fill={dot} stroke={P.outline} strokeWidth=".12" />
      ))}
    </g>
  )
}

/** Pistazienbaum: grauer Stamm, lockere Krone; Spätsommer rote Büschel, Herbst rotgelbes Laub, Winter kahl. */
export function PistachioTree({ x, y, s = 1, season, clusters = 3 }: { x: number; y: number; s?: number; season?: string; clusters?: number }) {
  const crown = season === 'autumn' ? P.autumn : season === 'spring' ? P.leafPale : P.winterLeafDark
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0Q-1 -4 -.6 -8M-.6 -8l-5 -4M-.6 -8l1 -6M-.6 -8l5 -3" stroke={P.stoneDark} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {season === 'winter' ? (
        <path d="M-5.6 -12l-2 -2M.4 -14l-1 -3M4.4 -11l2 -2" stroke={P.stoneDark} strokeWidth=".6" />
      ) : (
        <g>
          <ellipse cx="-4" cy="-13" rx="5" ry="3.6" fill={crown} stroke={P.outline} strokeWidth=".25" />
          <ellipse cx="3.6" cy="-12.6" rx="5" ry="3.4" fill={crown} stroke={P.outline} strokeWidth=".25" />
          <ellipse cx="0" cy="-16" rx="5" ry="3.2" fill={crown} stroke={P.outline} strokeWidth=".25" />
        </g>
      )}
      {season === 'summer' || season === 'autumn'
        ? Array.from({ length: clusters }, (_, i) => {
            const cx = [-4.6, 3.4, -0.4, 6, -7][i % 5]!
            const cy = [-11, -10.6, -14, -13, -14.6][i % 5]!
            return (
              <g key={i}>
                {[0, 1, 2].map((k) => (
                  <circle key={k} cx={cx + (k - 1) * 0.8} cy={cy + (k % 2) * 0.9} r=".7" fill={season === 'summer' ? P.red : P.blossom} />
                ))}
              </g>
            )
          })
        : null}
    </g>
  )
}

/** Weißes Kapellchen mit runder Kuppel und Glockengiebel (Fußpunkt Mitte unten). */
export function Chapel({ x, y, s = 1, dome = P.white }: { x: number; y: number; s?: number; dome?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-6" y="-9" width="12" height="9" fill={P.white} stroke={P.stoneLight} strokeWidth=".4" />
      <path d="M-4 -9a4 4 0 0 1 8 0z" fill={dome} stroke={P.stoneLight} strokeWidth=".4" />
      <path d="M0 -13v-2M-.8 -14.2h1.6" stroke={P.charcoal} strokeWidth=".4" />
      <path d="M-1.4 0v-4a1.4 1.4 0 0 1 2.8 0v4z" fill={P.denim} />
      <path d="M4 -9v-4h2.4v4" fill={P.white} stroke={P.stoneLight} strokeWidth=".3" />
      <circle cx="5.2" cy="-11" r=".6" fill={P.brass} />
    </g>
  )
}

/** Weiß-graue Ziege (Fußpunkt Mitte unten). */
export function SmallGoat({ x, y, s = 1, flip = false, c = P.feather }: { x: number; y: number; s?: number; flip?: boolean; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="ha-graze">
        <path d="M-2.4 -1v2M2 -1v2" stroke={P.charcoal} strokeWidth=".6" />
        <ellipse cx="0" cy="-2.6" rx="3.6" ry="2" fill={c} stroke={P.outlineFur} strokeWidth=".3" />
        <path d="M3 -3.6l1.6 -2.6l1.4 .8l-.6 2.2z" fill={c} stroke={P.outlineFur} strokeWidth=".3" />
        <path d="M4.6 -6.2l-1 -1.6M5 -6l.2 -1.8" stroke={P.woodDark} strokeWidth=".4" />
        <path d="M5.4 -3.4v1.2" stroke={P.stone} strokeWidth=".4" />
      </g>
    </g>
  )
}

/** Schaf mit dunklem Gesicht, auf Wolle betont (Aran); Fußpunkt Mitte unten. */
export function WoollySheep({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="ha-graze">
        <path d="M-2.6 -1v2M2.2 -1v2" stroke={P.charcoal} strokeWidth=".7" />
        <ellipse cx="0" cy="-3" rx="4.4" ry="2.8" fill={P.cream} stroke={P.outlineFur} strokeWidth=".35" />
        {[-2.4, 0, 2.2].map((d) => (
          <circle key={d} cx={d} cy={-5} r="1.3" fill={P.white} />
        ))}
        <ellipse cx="4.6" cy="-3.6" rx="1.5" ry="1.2" fill={P.charcoal} />
      </g>
    </g>
  )
}
