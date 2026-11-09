/** Kapitel-Grafik (Kapitel 13–17): gemeinsame Teile. Farben nur aus der Palette. */
import { P } from '../palette'

/** Kleine Lichterkette zwischen zwei Punkten (leuchtet, wenn `lit`). */
export function StringLights({ x0, x1, y, sag = 5, n = 7, lit = true }: { x0: number; x1: number; y: number; sag?: number; n?: number; lit?: boolean }) {
  return (
    <g>
      <path d={`M${x0} ${y} Q${(x0 + x1) / 2} ${y + sag * 2} ${x1} ${y}`} stroke={P.outlineWood} strokeWidth=".4" fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n
        const x = x0 + (x1 - x0) * t
        const yy = y + sag * 2 * 2 * t * (1 - t)
        return <circle key={i} cx={x} cy={yy + 0.8} r=".9" fill={lit ? P.lamp : P.stoneLight} className={lit ? 'fest-glow' : undefined} />
      })}
    </g>
  )
}

/** Ziegelmauer-Stück (Fußpunkt unten links). */
export function BrickWall({ x, y, w, h, color = P.terracotta }: { x: number; y: number; w: number; h: number; color?: string }) {
  const rows = Math.max(1, Math.round(h / 3))
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={color} stroke={P.outlineWood} strokeWidth=".5" />
      {Array.from({ length: rows }, (_, r) => (
        <path key={r} d={`M${x} ${y - h + r * (h / rows)}h${w}`} stroke={P.terracottaLight} strokeWidth=".4" />
      ))}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: Math.floor(w / 5) }, (_, k) => (
          <path key={`${r}-${k}`} d={`M${x + k * 5 + (r % 2) * 2.5 + 2} ${y - h + r * (h / rows)}v${h / rows}`} stroke={P.terracottaLight} strokeWidth=".4" />
        )),
      )}
    </g>
  )
}

/** Tomatenpflanze am Stab; `ripe` = Früchte rot, sonst grün. */
export function TomatoPlant({ x, y, h = 14, ripe = true, fruits = 3 }: { x: number; y: number; h?: number; ripe?: boolean; fruits?: number }) {
  return (
    <g>
      <path d={`M${x + 1.6} ${y}V${y - h - 2}`} stroke={P.woodMid} strokeWidth=".8" />
      <path d={`M${x} ${y} Q${x - 1} ${y - h / 2} ${x} ${y - h}`} stroke={P.leafDark} strokeWidth="1" fill="none" />
      {[0.3, 0.55, 0.8].map((t, i) => (
        <ellipse key={i} cx={x + (i % 2 ? 2.4 : -2.4)} cy={y - h * t} rx="2.6" ry="1.4" fill={i % 2 ? P.leaf : P.leafDark} />
      ))}
      {Array.from({ length: fruits }, (_, i) => (
        <circle key={i} cx={x + (i % 2 ? 1.8 : -1.6)} cy={y - h * (0.35 + i * 0.18)} r="1.5" fill={ripe ? P.tomato : P.leafPale} stroke={P.outlineWood} strokeWidth=".2" />
      ))}
    </g>
  )
}

/** Buchskugel/Buchskante; im Winter mit Schneehaube. */
export function BoxBall({ x, y, r = 3.4, winter }: { x: number; y: number; r?: number; winter?: boolean }) {
  return (
    <g>
      <ellipse cx={x} cy={y - r * 0.8} rx={r} ry={r * 0.8} fill={P.leafDark} stroke={P.outline} strokeWidth=".4" />
      <ellipse cx={x - r * 0.3} cy={y - r * 1.1} rx={r * 0.45} ry={r * 0.3} fill={P.leaf} />
      {winter ? <path d={`M${x - r * 0.8} ${y - r * 1.2} Q${x} ${y - r * 1.9} ${x + r * 0.8} ${y - r * 1.2}`} stroke={P.white} strokeWidth="1.2" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Junger Baum (Setzling bis Heister): `s` = Größe 0,4 … 1,4. */
export function Sapling({ x, y, s = 1, season, crown, stake = false }: { x: number; y: number; s?: number; season?: string; crown?: string; stake?: boolean }) {
  const c = season === 'winter' ? undefined : season === 'autumn' ? P.autumn : (crown ?? P.leaf)
  const h = 12 * s
  return (
    <g>
      {stake ? <path d={`M${x + 1.6} ${y}V${y - h * 0.8}`} stroke={P.woodLight} strokeWidth=".7" /> : null}
      <path d={`M${x} ${y}V${y - h}`} stroke={P.bark} strokeWidth={Math.max(0.6, s * 0.9)} />
      {c ? (
        <g>
          <ellipse cx={x} cy={y - h - 1.4 * s} rx={4 * s} ry={4.6 * s} fill={c} stroke={P.outline} strokeWidth=".35" />
          <ellipse cx={x - 1.2 * s} cy={y - h - 2.6 * s} rx={1.6 * s} ry={1.4 * s} fill={season === 'autumn' ? P.gold : P.leafPale} opacity=".8" />
        </g>
      ) : (
        <path d={`M${x} ${y - h * 0.6}l-${2.4 * s} -${3 * s}M${x} ${y - h * 0.8}l${2.4 * s} -${3 * s}M${x} ${y - h}l-${1.4 * s} -${2.4 * s}`} stroke={P.bark} strokeWidth=".5" />
      )}
    </g>
  )
}

/** Birke mit weißem Stamm. */
export function Birch({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const crown = season === 'winter' ? null : season === 'autumn' ? P.gold : season === 'spring' ? P.leafPale : P.leaf
  const h = 22 * s
  return (
    <g>
      <path d={`M${x} ${y}V${y - h}`} stroke={P.cream} strokeWidth={2 * s} />
      {[0.2, 0.42, 0.66].map((t, i) => (
        <path key={i} d={`M${x - s} ${y - h * t}h${1.2 * s}`} stroke={P.charcoal} strokeWidth=".5" />
      ))}
      {crown ? (
        <g>
          <ellipse cx={x} cy={y - h - 2 * s} rx={5 * s} ry={7 * s} fill={crown} opacity=".95" />
          <ellipse cx={x + 2 * s} cy={y - h + 2 * s} rx={3 * s} ry={4 * s} fill={crown} opacity=".85" />
        </g>
      ) : (
        <path d={`M${x} ${y - h * 0.7}l-${3 * s} -${5 * s}M${x} ${y - h * 0.8}l${3 * s} -${6 * s}`} stroke={P.stone} strokeWidth=".5" />
      )}
    </g>
  )
}

/** Holzschild mit Strich (Beschriftung angedeutet). */
export function Sign({ x, y, c = P.woodLight }: { x: number; y: number; c?: string }) {
  return (
    <g>
      <path d={`M${x} ${y}v-6`} stroke={P.woodDark} strokeWidth=".8" />
      <rect x={x - 4} y={y - 9} width="8" height="4" rx=".6" fill={c} stroke={P.outlineWood} strokeWidth=".4" />
      <path d={`M${x - 2.6} ${y - 7}h5.2`} stroke={P.outlineWood} strokeWidth=".4" />
    </g>
  )
}
