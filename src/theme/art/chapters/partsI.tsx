/**
 * Kapitel-Grafik (Kapitel 45–49, Bogen IV „Saatgut für morgen“): gemeinsame
 * Teile der zweiten Hälfte. Farben nur aus der Palette. Jahreszeiten wie in
 * Mitteleuropa: Frühling Blüte, Sommer satt, Herbst Laub, Winter kahl und Schnee.
 */
import { P } from '../palette'
import { LeafLitter, SnowDrifts } from './partsH'
import { Patch } from './partsF'
import { ssn } from './season'

/** Boden je Jahreszeit (nie in Hintergrundfarbe): Erde, Wiese, Laub, Schnee. */
export function Floor({ season, cy = 61, rx = 36, ry = 9, base = P.leaf, cx = 40 }: { season?: string; cy?: number; rx?: number; ry?: number; base?: string; cx?: number }) {
  const z = ssn(season)
  const fill = z === 'winter' ? P.cream : z === 'autumn' ? P.leafMoss : z === 'spring' ? P.leaf : base
  return (
    <g>
      <Patch fill={fill} cx={cx} cy={cy} rx={rx} ry={ry} edge={z === 'winter' ? P.frost : P.outlineSoft} />
      {z === 'autumn' ? <LeafLitter cx={cx} cy={cy + 2} w={rx * 1.5} n={8} /> : null}
      {z === 'winter' ? <SnowDrifts cx={cx} cy={cy + 2} w={rx * 1.4} /> : null}
    </g>
  )
}

/** Gepflasterter Hof/Platz (Stadt, Festwiese): hell mit Fugen. */
export function Paving({ season, cy = 62, rx = 36, ry = 8, fill = P.stoneLight }: { season?: string; cy?: number; rx?: number; ry?: number; fill?: string }) {
  const z = ssn(season)
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={fill} stroke={P.stone} strokeWidth=".5" />
      {[-0.5, 0, 0.5].map((k) => (
        <path key={k} d={`M${40 - rx * 0.8} ${cy + k * ry}h${rx * 1.6}`} stroke={P.stone} strokeWidth=".3" opacity=".7" />
      ))}
      {z === 'winter' ? <SnowDrifts cy={cy + 1} w={rx * 1.5} n={5} /> : null}
      {z === 'autumn' ? <LeafLitter cy={cy + 1} w={rx * 1.5} n={6} /> : null}
    </g>
  )
}

/**
 * Wildblume: 0 Mohn, 1 Kornblume, 2 Margerite, 3 Flockenblume. Frühling Knospe,
 * Sommer Blüte, Herbst Samenstand, Winter trockener Stängel mit Schnee.
 */
export function WildFlower({ x, y, kind, season, h = 8 }: { x: number; y: number; kind: number; season?: string; h?: number }) {
  const z = ssn(season)
  const k = kind % 4
  const stem = z === 'winter' ? P.woodLight : z === 'autumn' ? P.woodMid : P.leafDark
  const top = y - (z === 'spring' ? h * 0.6 : h)
  const petal = [P.red, P.blue, P.white, P.lilac][k]!
  return (
    <g>
      <path d={`M${x} ${y}V${top}M${x} ${y - h * 0.3}l-1.6 -1.4`} stroke={stem} strokeWidth=".6" />
      {z === 'summer' ? (
        k === 2 ? (
          <g>
            <circle cx={x} cy={top} r="2" fill={petal} stroke={P.outlineSoft} strokeWidth=".2" />
            <circle cx={x} cy={top} r=".8" fill={P.yellow} />
          </g>
        ) : (
          <g>
            <circle cx={x} cy={top} r={k === 0 ? 2.1 : 1.7} fill={petal} stroke={P.outline} strokeWidth=".12" />
            <circle cx={x} cy={top} r=".6" fill={k === 0 ? P.ink : P.plum} />
          </g>
        )
      ) : z === 'spring' ? (
        <ellipse cx={x} cy={top} rx=".8" ry="1.2" fill={k === 2 ? P.leafPale : k === 0 ? P.red : P.leaf} stroke={P.leafDark} strokeWidth=".15" />
      ) : z === 'autumn' ? (
        <ellipse cx={x} cy={top} rx=".9" ry="1.2" fill={k === 0 ? P.winterLeaf : P.woodMid} stroke={P.outlineWood} strokeWidth=".2" />
      ) : (
        <path d={`M${x - 1} ${top}h2`} stroke={P.white} strokeWidth="1.1" strokeLinecap="round" />
      )}
    </g>
  )
}

/** Grasbüschel; Herbst gelblich, Winter mit Schneehaube. */
export function Tuft({ x, y, season, h = 4 }: { x: number; y: number; season?: string; h?: number }) {
  const z = ssn(season)
  const c = z === 'winter' ? P.woodLight : z === 'autumn' ? P.gold : z === 'spring' ? P.leafLight : P.leaf
  return (
    <g>
      <path d={`M${x} ${y}l-1.4 -${h}M${x} ${y}v-${h + 0.6}M${x} ${y}l1.4 -${h}`} stroke={c} strokeWidth=".6" />
      {z === 'winter' ? <ellipse cx={x} cy={y - 0.4} rx="1.8" ry=".6" fill={P.white} /> : null}
    </g>
  )
}

/**
 * Heckenstrauch (Schlehe/Weißdorn/Hundsrose): Frühling weiße Blüte, Sommer grün,
 * Herbst rote/blaue Früchte, Winter kahl mit Schnee.
 */
export function Shrub({ x, y, s = 1, season, n = 4, fruit = P.berry }: { x: number; y: number; s?: number; season?: string; n?: number; fruit?: string }) {
  const z = ssn(season)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0l-4 -6M0 0v-8M0 0l4 -6M-4 -6l-1.6 -2M4 -6l1.6 -2" stroke={P.bark} strokeWidth=".7" />
      {z === 'winter' ? (
        <path d="M-5.6 -8l2 .6M4 -8.4l2 -.4M-.8 -8h1.6" stroke={P.white} strokeWidth=".9" strokeLinecap="round" />
      ) : (
        <g>
          <ellipse cx="0" cy="-4.6" rx="6.4" ry="4.6" fill={z === 'autumn' ? P.autumnDark : P.leafDark} stroke={P.outline} strokeWidth=".3" />
          <ellipse cx="-1.8" cy="-6" rx="3.4" ry="2.2" fill={z === 'autumn' ? P.autumn : z === 'spring' ? P.leafLight : P.leaf} />
        </g>
      )}
      {z === 'winter'
        ? null
        : Array.from({ length: n }, (_, i) => (
            <circle key={i} cx={-4.6 + ((i * 3.3) % 9)} cy={-7.4 + ((i * 2.6) % 5)} r=".8" fill={z === 'spring' ? P.white : z === 'autumn' ? (i % 2 ? fruit : P.plum) : P.leafPale} />
          ))}
    </g>
  )
}

/** Rebhuhn (Fußpunkt Mitte unten): grau-braun, rostrotes Gesicht. */
export function Partridge({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="0" cy="-1.8" rx="2.6" ry="1.7" fill={P.stone} stroke={P.outlineStone} strokeWidth=".2" />
      <path d="M-2.4 -2.2q1.2 -.8 2.4 0" stroke={P.woodMid} strokeWidth=".5" fill="none" />
      <circle cx="2.2" cy="-3" r="1" fill={P.orange} />
      <path d="M3.1 -3l.6 .2l-.6 .3z" fill={P.charcoal} />
      <path d="M-.6 -.2v.8M.6 -.2v.8" stroke={P.charcoal} strokeWidth=".3" />
    </g>
  )
}

/** Haussperling (klein, Fußpunkt unten). */
export function Sparrow({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="0" cy="-1.2" rx="1.6" ry="1.1" fill={P.woodMid} />
      <circle cx="1.3" cy="-2.1" r=".8" fill={P.woodDark} />
      <ellipse cx="1.4" cy="-1.6" rx=".5" ry=".3" fill={P.cream} />
      <path d="M2 -2.1l.6 .2l-.6 .2z" fill={P.charcoal} />
      <path d="M-1.4 -1.2l-1.2 .5" stroke={P.woodDark} strokeWidth=".5" />
    </g>
  )
}

/** Huhn (Fußpunkt unten). */
export function Hen({ x, y, s = 1, flip = false, c = P.woodMid }: { x: number; y: number; s?: number; flip?: boolean; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-2.6 -2.4q0 -2 2 -2.2l1.8 1q1 1.6 0 2.6h-2.6q-1.2 0 -1.2 -1.4z" fill={c} stroke={P.outlineWood} strokeWidth=".2" />
      <path d="M-2.6 -2.4l-.9 -1.4l.4 1.8z" fill={c} />
      <circle cx="1.4" cy="-4" r=".9" fill={c} />
      <path d="M1.2 -4.9l.5 -.5l.5 .5z" fill={P.red} />
      <path d="M2.2 -4l.7 .2l-.7 .3z" fill={P.amber} />
      <path d="M-.4 -1v1M.6 -1v1" stroke={P.amber} strokeWidth=".3" />
    </g>
  )
}

/** Gans (weiß, Fußpunkt unten). */
export function Goose({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx="-.6" cy="-2" rx="2.8" ry="1.6" fill={P.white} stroke={P.stone} strokeWidth=".2" />
      <path d="M1.6 -2.6q.6 -2 .4 -4" stroke={P.white} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <circle cx="2" cy="-6.6" r=".8" fill={P.white} stroke={P.stone} strokeWidth=".15" />
      <path d="M2.6 -6.7l1.2 .3l-1.2 .4z" fill={P.orange} />
      <path d="M-1 -.5v.7M0 -.5v.7" stroke={P.orange} strokeWidth=".4" />
    </g>
  )
}

/** Hauswand mit Fenstern (Fußpunkt unten links). */
export function Wall({ x, y, w, h, c = P.terracottaLight, rows = 2, cols = 2, lit, snow }: { x: number; y: number; w: number; h: number; c?: string; rows?: number; cols?: number; lit?: boolean; snow?: boolean }) {
  const ww = (w / cols) * 0.4
  const wh = (h / rows) * 0.42
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={c} stroke={P.outlineStone} strokeWidth=".35" />
      {Array.from({ length: rows * cols }, (_, i) => {
        const cx = x + (w / cols) * ((i % cols) + 0.5)
        const cy = y - h + (h / rows) * (Math.floor(i / cols) + 0.5)
        return <rect key={i} x={cx - ww / 2} y={cy - wh / 2} width={ww} height={wh} fill={lit ? P.lamp : P.window} stroke={P.white} strokeWidth=".4" />
      })}
      {snow ? <path d={`M${x} ${y - h}h${w}`} stroke={P.white} strokeWidth="1.2" /> : null}
    </g>
  )
}

/**
 * Kletterpflanze an der Wand (Wilder Wein): Blattbüschel entlang einer Ranke.
 * Frühling hellgrün, Sommer grün, Herbst rot, Winter kahle Triebe.
 */
export function Creeper({ x, y, h, season, n = 4, sway = 3 }: { x: number; y: number; h: number; season?: string; n?: number; sway?: number }) {
  const z = ssn(season)
  const d = `M${x} ${y} C${x + sway} ${y - h * 0.3} ${x - sway} ${y - h * 0.6} ${x} ${y - h}`
  return (
    <g>
      <path d={d} stroke={P.bark} strokeWidth=".6" fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n
        const lx = x + Math.sin(t * Math.PI * 2) * sway * 0.6 + (i % 2 ? 1.6 : -1.6)
        const ly = y - h * t
        if (z === 'winter') return <path key={i} d={`M${lx.toFixed(2)} ${ly.toFixed(2)}l${i % 2 ? 1.4 : -1.4} -1`} stroke={P.bark} strokeWidth=".4" />
        const c = z === 'autumn' ? [P.red, P.berry, P.autumn][i % 3]! : z === 'spring' ? P.leafLight : [P.leaf, P.leafDark][i % 2]!
        return <ellipse key={i} cx={lx.toFixed(2)} cy={ly.toFixed(2)} rx="2" ry="1.5" fill={c} stroke={P.outline} strokeWidth=".15" />
      })}
    </g>
  )
}

/** Holzkiste mit Gemüse (Fußpunkt unten links). */
export function Crate({ x, y, w = 7, fill = P.orange, wood = P.woodLight }: { x: number; y: number; w?: number; fill?: string; wood?: string }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + 1.5 + i * ((w - 3) / 2)} cy={y - 3.4} r="1.3" fill={fill} stroke={P.outlineSoft} strokeWidth=".15" />
      ))}
      <rect x={x} y={y - 3} width={w} height="3" fill={wood} stroke={P.outlineWood} strokeWidth=".3" />
      <path d={`M${x} ${y - 1.5}h${w}`} stroke={P.woodMid} strokeWidth=".3" />
    </g>
  )
}

/** Tisch mit Decke (Fußpunkt unten links). */
export function Table({ x, y, w, c = P.cream, h = 4 }: { x: number; y: number; w: number; c?: string; h?: number }) {
  return (
    <g>
      <path d={`M${x + 1} ${y}v-${h}M${x + w - 1} ${y}v-${h}`} stroke={P.woodDark} strokeWidth=".6" />
      <rect x={x} y={y - h - 0.6} width={w} height="2.2" fill={c} stroke={P.outlineSoft} strokeWidth=".25" />
    </g>
  )
}

/** Zelt mit Spitzdach (Fußpunkt unten Mitte), vorn offen. */
export function Tent({ x, y, w = 20, h = 12, c = P.cream, stripe = P.tomato, inside = P.woodLight }: { x: number; y: number; w?: number; h?: number; c?: string; stripe?: string; inside?: string }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h * 0.6} width={w} height={h * 0.6} fill={c} stroke={P.outlineSoft} strokeWidth=".3" />
      <rect x={x - w / 4} y={y - h * 0.5} width={w / 2} height={h * 0.5} fill={inside} />
      <path d={`M${x - w / 2 - 1} ${y - h * 0.6}L${x} ${y - h}L${x + w / 2 + 1} ${y - h * 0.6}z`} fill={stripe} stroke={P.outlineSoft} strokeWidth=".3" />
      <path d={`M${x} ${y - h}v-2.4`} stroke={P.woodDark} strokeWidth=".4" />
      <path d={`M${x} ${y - h - 2.4}l2 .8l-2 .8z`} fill={P.yellow} />
    </g>
  )
}

/** Lampion (für Feste). */
export function Lantern({ x, y, c = P.orange, lit = true }: { x: number; y: number; c?: string; lit?: boolean }) {
  return (
    <g>
      <path d={`M${x} ${y - 1.4}v-1`} stroke={P.charcoal} strokeWidth=".2" />
      <ellipse cx={x} cy={y} rx="1.2" ry="1.4" fill={lit ? c : P.paper} stroke={P.outlineWood} strokeWidth=".15" />
      {lit ? <ellipse cx={x} cy={y} rx=".5" ry=".7" fill={P.lamp} /> : null}
    </g>
  )
}

/** Briefumschlag. */
export function Letter({ x, y, s = 1, c = P.paper }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1.8" y="-2.4" width="3.6" height="2.4" fill={c} stroke={P.outlineSoft} strokeWidth=".15" />
      <path d="M-1.8 -2.4l1.8 1.3l1.8 -1.3" stroke={P.outlineSoft} strokeWidth=".15" fill="none" />
      <rect x=".7" y="-2.1" width=".7" height=".7" fill={P.red} />
    </g>
  )
}
