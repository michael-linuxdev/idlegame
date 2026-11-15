/**
 * Gemeinsame Kulissen-Teile der Kapitel-Karten im kräftigen Stil (zuerst für
 * die Streuobstwiese gezeichnet, 2026-11-15): Himmel, Bodenwellen, Wasser mit
 * Ufer und nicht verzerrte Kleinteile (Grasbüschel, Blumeninsel, Steine).
 */
import type { ReactNode } from 'react'
import { ArtSvg } from './ArtSvg'
import { P } from './art/palette'

const OUT = P.outline
const NS = { fill: 'none', vectorEffect: 'non-scaling-stroke' as const, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

/** Kleinteil auf der Karte: Mittelpunkt in Prozent, Breite in --u (nicht verzerrt). */
export function Deco({ left, top, w, children }: { left: number; top: number; w: number; children: ReactNode }) {
  return (
    <div className="garden-decor orchard-deco" style={{ left: `${left}%`, top: `${top}%`, width: `calc(var(--u) * ${w})` }}>
      {children}
    </div>
  )
}

/** Himmel über dem Horizont mit zwei Wolken — für das gestreckte 100×100-Bodenbild. */
export function Sky({ id, top = '#bfe0f2', bottom = '#eaf5e6' }: { id: string; top?: string; bottom?: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width="100" height="23" fill={`url(#${id})`} stroke="none" />
      <g fill={P.white} opacity=".85" stroke="none">
        <path d="M10 15.6 q1 -2.2 5 -2 q2 -2.6 7 -1.4 q5 -0.6 6 2.2 q3 0.2 3 1.6 h-21 z" stroke="none" />
        <path d="M66 12.6 q1 -1.8 4 -1.6 q2 -2 6 -1 q4 -0.4 5 1.6 q2.4 0.2 2.4 1.4 h-17.4 z" stroke="none" />
      </g>
    </g>
  )
}

/** Weiche Wellen im Boden: helle und dunkle Bahnen geben der Fläche Tiefe. */
export function Relief() {
  return (
    <g stroke="none">
      <path d="M0 34 Q28 28 55 33 T100 31 V46 Q70 40 40 46 T0 44 Z" fill={P.white} opacity=".07" stroke="none" />
      <path d="M0 58 Q35 51 68 57 T100 55 V70 Q65 63 35 69 T0 67 Z" fill={OUT} opacity=".05" stroke="none" />
      <path d="M0 80 Q30 74 60 80 T100 78 V100 H0 Z" fill={OUT} opacity=".06" stroke="none" />
    </g>
  )
}

/** Bach oder Fluss entlang `d`: Böschung, Kiesrand, Wasser mit heller Mitte und wandernden Glanzlichtern. */
export function Stream({ d, w = 13, bank = '#5f9445' }: { d: string; w?: number; bank?: string }) {
  return (
    <g>
      <path d={d} stroke={bank} strokeWidth={w + 21} {...NS} opacity=".5" />
      <path d={d} stroke={OUT} strokeWidth={w + 12} {...NS} opacity=".5" />
      <path d={d} stroke="#d6c79a" strokeWidth={w + 9} {...NS} />
      <path d={d} stroke={P.waterDeep} strokeWidth={w + 4} {...NS} />
      <path d={d} stroke={P.water} strokeWidth={w} {...NS} />
      <path d={d} stroke={P.waterLight} strokeWidth={w * 0.4} {...NS} opacity=".75" />
      <path d={d} stroke={P.white} strokeWidth="1.8" {...NS} strokeDasharray="7 21" className="orchard-stream" opacity=".8" />
    </g>
  )
}

/** Teich: Uferrand, Wasser, helle Fläche oben links, zwei Wellenstriche. */
export function Pond({ cx, cy, rx, ry }: { cx: number; cy: number; rx: number; ry: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx + 1.6} ry={ry + 0.9} fill="#d6c79a" stroke={OUT} strokeWidth="1.6" strokeOpacity=".55" vectorEffect="non-scaling-stroke" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={P.water} stroke={P.waterDeep} strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
      <ellipse cx={cx - rx * 0.28} cy={cy - ry * 0.3} rx={rx * 0.42} ry={ry * 0.28} fill={P.waterLight} opacity=".6" stroke="none" />
      <path d={`M${cx - rx * 0.1} ${cy + ry * 0.35} h${rx * 0.5} M${cx - rx * 0.5} ${cy + ry * 0.1} h${rx * 0.3}`} stroke={P.white} strokeWidth="1.6" {...NS} opacity=".6" />
    </g>
  )
}

export function Tuft({ fill = '#a9dc7e', edge = '#3f7a30' }: { fill?: string; edge?: string }) {
  return (
    <ArtSvg viewBox="0 0 40 24">
      <path d="M4 22 l3 -10 l3 7 l2.5 -14 l3.5 13 l3 -9 l3 9 l3 -12 l3 12 l2.5 -6 l2.5 10 z" fill={fill} stroke={edge} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12.5 5 l1.6 12 M27 7 l1 11" stroke={edge} strokeWidth=".9" opacity=".4" fill="none" />
    </ArtSvg>
  )
}

const BLOOM = [P.white, P.yellow, P.pink, P.lilac, P.red]

/** Blumeninsel: niedriges Polster mit einzelnen Blüten (Kontur, gelbe Mitte). */
export function FlowerPatch({ seed, fill = '#74b052', light = '#9fd07d' }: { seed: number; fill?: string; light?: string }) {
  const spots: [number, number][] = [
    [12, 15],
    [22, 9],
    [31, 16],
    [40, 10],
    [48, 17],
    [26, 19],
  ]
  return (
    <ArtSvg viewBox="0 0 60 28">
      <path d="M3 24 Q6 12 18 12 Q24 4 33 9 Q44 5 49 13 Q58 15 57 24 Z" fill={fill} stroke={OUT} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 22 Q11 15 19 15 Q25 9 32 12" fill="none" stroke={light} strokeWidth="2.2" strokeLinecap="round" opacity=".8" />
      {spots.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3.4" fill={BLOOM[(i + seed) % BLOOM.length]} stroke={OUT} strokeWidth="1.2" />
          <circle cx={x} cy={y} r="1.1" fill={(i + seed) % BLOOM.length === 1 ? P.orange : P.yellow} />
        </g>
      ))}
    </ArtSvg>
  )
}

export function Stones() {
  return (
    <ArtSvg viewBox="0 0 40 20">
      <ellipse cx="13" cy="12" rx="10" ry="6.4" fill={P.stone} stroke={OUT} strokeWidth="1.6" />
      <ellipse cx="29" cy="13.5" rx="7" ry="4.6" fill={P.stoneLight} stroke={OUT} strokeWidth="1.6" />
      <path d="M6 10 q4 -4 9 -3" fill="none" stroke={P.white} strokeWidth="1.6" strokeLinecap="round" opacity=".45" />
      <path d="M8 16 q6 3 12 0" fill="none" stroke={OUT} strokeWidth="1" opacity=".3" />
    </ArtSvg>
  )
}
