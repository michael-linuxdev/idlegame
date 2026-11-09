import { P } from '../palette'
import { Place } from './Place'
import { foliage, useSeason } from './season'
import { STROKE } from './style'

/** Blume mit fünf Blütenblättern; Fußpunkt = Stängelende. Kopf auf Höhe r+4. */
export function Flower({ x, y, c = P.yellow, r = 2.4, center = P.seed, s = 1 }: { x: number; y: number; c?: string; r?: number; center?: string; s?: number }) {
  const hy = -(r + 4)
  return (
    <Place x={x} y={y} s={s}>
      <path d={`M0 0 V${hy + r}`} stroke={P.leafDark} strokeWidth={STROKE.detail} />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={Math.cos((a * Math.PI) / 180) * r * 0.9} cy={hy + Math.sin((a * Math.PI) / 180) * r * 0.9} r={r * 0.62} fill={c} />
      ))}
      <circle cx="0" cy={hy} r={r * 0.45} fill={center} />
    </Place>
  )
}

export function Sprout({ x, y }: { x: number; y: number }) {
  return (
    <Place x={x} y={y}>
      <path d="M0 0 V-4" stroke={P.leafDark} strokeWidth={STROKE.contour} />
      <ellipse cx="-2.2" cy="-4.5" rx="2.6" ry="1.5" fill={P.leafLight} transform="rotate(-25 -2.2 -4.5)" />
      <ellipse cx="2.2" cy="-4.5" rx="2.6" ry="1.5" fill={P.leaf} transform="rotate(25 2.2 -4.5)" />
    </Place>
  )
}

/** Salatkopf; Fußpunkt = Bodenmitte. */
export function Lettuce({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <Place x={x} y={y} s={s}>
      <circle cx="0" cy="-3" r="5" fill={P.leaf} stroke={P.leafDark} strokeWidth={STROKE.detail} />
      <circle cx="-2" cy="-4" r="3" fill={P.leafLight} />
      <circle cx="1.6" cy="-2.4" r="2.4" fill={P.leafPale} />
    </Place>
  )
}

/** Busch, optional mit Beeren; Fußpunkt = Bodenmitte, Radius r. */
export function Bush({ x, y, r = 9, berry: ripe }: { x: number; y: number; r?: number; berry?: string }) {
  const season = useSeason()
  // Beerenbüsche bleiben im Herbst grün mit buntem Laub, damit die Beeren sichtbar bleiben
  const f = season === 'autumn' ? { crown: P.leafDark, mid: P.autumn, light: P.gold } : foliage(season)
  // Frühling: weiße Blüten statt Beeren · Winter: kahl mit Schnee
  const berry = season === 'spring' ? (ripe ? P.white : undefined) : season === 'winter' ? undefined : ripe
  return (
    <Place x={x} y={y}>
      <circle cx="0" cy={-r} r={r} fill={f.crown} stroke={P.outline} strokeWidth={STROKE.contour} />
      <circle cx={r * 0.3} cy={-r * 1.1} r={r * 0.6} fill={f.mid} />
      <circle cx={-r * 0.38} cy={-r * 1.35} r={r * 0.45} fill={f.light} />
      {season === 'winter' ? <path d={`M${-r * 0.75} ${-r * 1.55} Q0 ${-r * 2.2} ${r * 0.75} ${-r * 1.55}`} fill="none" stroke={P.white} strokeWidth={r * 0.28} strokeLinecap="round" className="art-snow" /> : null}
      {berry
        ? [
            [-0.4, 0.2],
            [0.2, 0.35],
            [0.45, -0.25],
            [-0.1, -0.45],
            [-0.55, -0.15],
          ].map(([dx, dy], i) => (
            <circle key={i} cx={dx! * r} cy={-r + dy! * r} r={Math.max(1.3, r * 0.14)} fill={berry} stroke="rgba(0,0,0,0.25)" strokeWidth={STROKE.hair} />
          ))
        : null}
    </Place>
  )
}

/** Laubbaum mit runder Krone, optional mit Früchten; Fußpunkt = Stammfuß. */
export function Tree({ x, y, r = 14, fruit, trunk = 12, ...colors }: { x: number; y: number; r?: number; fruit?: string; trunk?: number; crown?: string; light?: string; mid?: string }) {
  const season = useSeason()
  const f = foliage(season)
  const crown = colors.crown ?? f.crown
  const mid = colors.mid ?? f.mid
  const light = colors.light ?? f.light
  // Frühling: Blüten statt Früchten · Winter: keine Früchte, Schnee auf der Krone
  const dots = season === 'spring' ? (fruit ? P.blossom : undefined) : season === 'winter' ? undefined : fruit
  const top = -trunk
  return (
    <Place x={x} y={y}>
      <rect x="-2.5" y={top} width="5" height={trunk} rx="2" fill={P.bark} stroke={P.outline} strokeWidth={STROKE.detail} />
      <circle cx="0" cy={top - r * 0.4} r={r} fill={crown} stroke={P.outline} strokeWidth={STROKE.contour} />
      <circle cx={r * 0.4} cy={top - r * 0.2} r={r * 0.62} fill={mid} />
      <circle cx={-r * 0.3} cy={top - r * 0.75} r={r * 0.58} fill={light} />
      {dots
        ? [
            [-0.5, -0.1],
            [0.3, -0.3],
            [0.55, 0.15],
            [-0.15, -0.85],
            [0.05, 0.3],
            [-0.7, -0.6],
          ].map(([dx, dy], i) => (
            <circle key={i} cx={dx! * r} cy={top - r * 0.4 + dy! * r} r={Math.max(1.8, r * 0.13)} fill={dots} stroke={season === 'spring' ? P.pink : 'rgba(0,0,0,0.3)'} strokeWidth={STROKE.hair} />
          ))
        : null}
      {season === 'winter' ? <path d={`M${-r * 0.8} ${top - r * 0.95} Q0 ${top - r * 1.75} ${r * 0.8} ${top - r * 0.95}`} fill="none" stroke={P.white} strokeWidth={r * 0.22} strokeLinecap="round" className="art-snow" /> : null}
    </Place>
  )
}

/** Blühender Baum mit Wolkenkrone (Kirsche, Apfel im Frühling); Fußpunkt = Stammfuß. */
export function BlossomTree({ x, y, s = 1, color = P.blossom, winter }: { x: number; y: number; s?: number; color?: string; winter?: boolean }) {
  const c = winter ? P.frost : color
  return (
    <Place x={x} y={y} s={s}>
      <path d="M-1.4 0L-1 -14Q0 -18 1 -14L1.4 0z" fill={P.bark} />
      <circle cx="0" cy="-22" r="10" fill={c} />
      <circle cx="-7" cy="-17" r="6.4" fill={c} />
      <circle cx="7" cy="-17" r="6.4" fill={c} />
      {winter ? (
        <ellipse cx="0" cy="-30" rx="7" ry="2" fill={P.white} />
      ) : (
        <g fill={P.white} opacity=".7">
          <circle cx="-3" cy="-24" r="1.2" />
          <circle cx="4" cy="-20" r="1.2" />
          <circle cx="-6" cy="-16" r="1" />
        </g>
      )}
    </Place>
  )
}

/** Terrakotta-Topf; Fußpunkt = Topfboden-Mitte. */
export function Pot({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <Place x={x} y={y} s={s}>
      <path d="M-6 -8 H6 L4.6 0 H-4.6 Z" fill={P.terracotta} stroke={P.outline} strokeWidth={STROKE.detail} />
      <rect x="-6.6" y="-9.4" width="13.2" height="2.6" rx="1" fill={P.terracottaLight} stroke={P.outline} strokeWidth={STROKE.hair * 1.6} />
    </Place>
  )
}

/** Zitrusbäumchen im Topf (Orangerie); Fußpunkt = Topfboden-Mitte. */
export function CitrusPot({ x, y, s = 1, fruit = P.yellow }: { x: number; y: number; s?: number; fruit?: string }) {
  return (
    <Place x={x} y={y} s={s}>
      <rect x="-1.2" y="-16" width="2.4" height="9" fill={P.bark} />
      <circle cx="0" cy="-20" r="7" fill={P.leafDark} stroke={P.outline} strokeWidth={STROKE.detail} />
      <circle cx="-2.4" cy="-21.5" r="4" fill={P.leaf} />
      {[
        [2.6, -18.5],
        [-3, -17.4],
        [0.6, -24],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.7" fill={fruit} stroke="rgba(0,0,0,0.3)" strokeWidth={STROKE.hair} />
      ))}
      <Pot x={0} y={0} />
    </Place>
  )
}
