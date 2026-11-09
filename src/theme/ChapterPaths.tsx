/**
 * Kapitel-Wege: every chapter gets its own path shape instead of the one
 * shared S-curve. Drawn in the stretched 100×100 ground SVG — strokes use
 * non-scaling widths (px), round things use ry ≈ rx · 0.45 to stay round.
 */
import type { ReactNode } from 'react'
import { P } from './art/palette'

export type PathStyle = 'track' | 'loop' | 'shore' | 'cross' | 'rondel' | 'switchback' | 'lane' | 'stones' | 'promenade'

const NS = { vectorEffect: 'non-scaling-stroke' as const, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

/** Path with a darker edge underneath */
function Way({ d, color, w, edge, edgeW = 3 }: { d: string; color: string; w: number; edge?: string; edgeW?: number }) {
  return (
    <g>
      {edge ? <path d={d} stroke={edge} strokeWidth={w + edgeW} {...NS} /> : null}
      <path d={d} stroke={color} strokeWidth={w} {...NS} />
    </g>
  )
}

/** Dots spread evenly along a polyline */
function Dots({ pts, n, rx, color, opacity = 1 }: { pts: [number, number][]; n: number; rx: number; color: string | string[]; opacity?: number }) {
  const segs = pts.slice(1).map((p, i) => [pts[i]!, p] as const)
  const len = segs.map(([a, b]) => Math.hypot(b[0] - a[0], (b[1] - a[1]) * 0.46))
  const total = len.reduce((x, y) => x + y, 0)
  const out: ReactNode[] = []
  for (let k = 0; k < n; k++) {
    let t = ((k + 0.5) / n) * total
    let i = 0
    while (i < len.length - 1 && t > len[i]!) t -= len[i++]!
    const [a, b] = segs[i]!
    const f = t / len[i]!
    const c = Array.isArray(color) ? color[k % color.length]! : color
    out.push(<ellipse key={k} cx={a[0] + (b[0] - a[0]) * f} cy={a[1] + (b[1] - a[1]) * f} rx={rx} ry={rx * 0.42} fill={c} opacity={opacity} />)
  }
  return <g>{out}</g>
}

export function ChapterPath({ style, color }: { style: PathStyle; color: string }) {
  switch (style) {
    /* Bauernhof: Feldweg — two wheel ruts with a grass strip, bend to the barn */
    case 'track': {
      const d = 'M50 100 L50 90 Q50 84 46 78 L44 72 Q43 66 50 62 L55 56 Q57 50 52 46 L48 38 Q46 30 50 22'
      return (
        <g>
          <Way d={d} color={color} w={16} edge="#b8a070" edgeW={2} />
          <path d={d} stroke="#9cc06a" strokeWidth="4" {...NS} />
          <path d="M55 56 Q70 48 92 30" stroke={color} strokeWidth="9" {...NS} opacity=".85" />
        </g>
      )
    }
    /* Imkerei: Rundweg um die Bienenweide in der Mitte */
    case 'loop':
      return (
        <g>
          <Way d="M50 100 L50 68" color={color} w={12} edge="#b8a070" edgeW={2} />
          <Way d="M50 48 L50 22" color={color} w={10} edge="#b8a070" edgeW={2} />
          <ellipse cx="50" cy="58" rx="13" ry="10" stroke="#b8a070" strokeWidth="14" {...NS} />
          <ellipse cx="50" cy="58" rx="13" ry="10" stroke={color} strokeWidth="12" {...NS} />
          <ellipse cx="50" cy="58" rx="8.4" ry="6" fill={P.leafLight} />
          <Dots pts={[[44, 56], [56, 56], [50, 61], [44, 59], [56, 60]]} n={9} rx={0.9} color={[P.lilac, P.yellow, P.cream]} />
          <ellipse cx="50" cy="55.4" rx="2.4" ry="1.4" fill={P.gold} stroke={P.outlineSoft} strokeWidth=".3" />
        </g>
      )
    /* Teich: Uferweg rund um den See + Holzsteg vom Eingang */
    case 'shore':
      return (
        <g>
          <ellipse cx="50" cy="60" rx="37" ry="19" stroke={color} strokeWidth="8" {...NS} opacity=".95" />
          <path d="M50 100 L50 79" stroke={P.woodDark} strokeWidth="13" {...NS} strokeLinecap="butt" />
          <path d="M50 100 L50 79" stroke="#c49a6a" strokeWidth="11" strokeDasharray="1.2 .5" {...NS} strokeLinecap="butt" />
          <path d="M50 79 L50 72" stroke="#c49a6a" strokeWidth="11" {...NS} strokeLinecap="butt" opacity=".9" />
          <path d="M50 41 L50 22" stroke={color} strokeWidth="9" {...NS} />
        </g>
      )
    /* Kräuterapotheke: Klostergarten-Kreuz — gerade Achse, Querwege, Sonnenuhr-Platz */
    case 'cross':
      return (
        <g>
          <Way d="M50 100 V22" color={color} w={11} edge={P.leaf} edgeW={4} />
          <Way d="M40 72 H60 M40 40 H60" color={color} w={8} edge={P.leaf} edgeW={4} />
          <ellipse cx="50" cy="56" rx="8" ry="3.8" fill={P.leaf} />
          <ellipse cx="50" cy="56" rx="7" ry="3.2" fill={color} />
          <ellipse cx="50" cy="55.6" rx="1.6" ry="1" fill={P.stone} />
          <path d="M50 55.6 L52 54.6" stroke="#4a3a2a" strokeWidth="1.4" {...NS} />
        </g>
      )
    /* Botanischer Garten: Hauptachse, Brunnen-Rondell, Rundweg zu den Gewächshäusern */
    case 'rondel':
      return (
        <g>
          <Way d="M50 100 L50 62" color={color} w={12} edge="#c9bfa8" edgeW={2} />
          <Way d="M50 54 C30 48 32 34 50 26 C68 34 70 48 50 54" color={color} w={9} edge="#c9bfa8" edgeW={2} />
          <ellipse cx="50" cy="58" rx="11" ry="3.6" fill="#c9bfa8" />
          <ellipse cx="50" cy="58" rx="10.4" ry="3.2" fill={color} />
          <ellipse cx="50" cy="58" rx="6" ry="1.9" fill="#bdb3a0" />
          <ellipse cx="50" cy="57.8" rx="5" ry="1.5" fill={P.water} />
          <ellipse cx="50" cy="57.2" rx=".8" ry="1" fill="#d6eef8" />
          <Dots pts={[[50, 98], [50, 64]]} n={6} rx={1.2} color="#4f8f3c" />
        </g>
      )
    /* Alpen-Alm: Serpentinen-Wanderweg mit Kehren und Wegweiser */
    case 'switchback': {
      const pts: [number, number][] = [[50, 100], [55, 92], [45, 85], [55, 77], [45, 69], [55, 61], [45, 53], [55, 45], [45, 37], [52, 28], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          <path d={d} stroke="#a89060" strokeWidth="11" {...NS} />
          <path d={d} stroke={color} strokeWidth="8" {...NS} />
          <Dots pts={pts} n={18} rx={0.7} color={P.stone} />
          <path d="M57 77 V71 M55 71.6 H60 L61 72.4 L60 73.2 H55" stroke={P.woodDark} strokeWidth="1.6" {...NS} />
        </g>
      )
    }
    /* Lavendelfeld: gerade Schotterstraße mit Platanen-Schatten */
    case 'lane':
      return (
        <g>
          <path d="M47 100 L53 22" stroke={color} strokeWidth="15" {...NS} />
          <path d="M45.6 100 L51.6 22 M48.4 100 L54.4 22" stroke="#d4c49a" strokeWidth="2" strokeDasharray="6 5" {...NS} />
          {[90, 74, 58, 42, 28].map((y, i) => (
            <ellipse key={y} cx={i % 2 ? 54 : 46} cy={y} rx="6" ry="2" fill="#8a8a4a" opacity=".22" />
          ))}
        </g>
      )
    /* Japanischer Garten: Trittsteine im geharkten Kies um den Teich */
    case 'stones': {
      const pts: [number, number][] = [[50, 100], [49, 90], [42, 82], [36, 72], [36, 60], [40, 50], [47, 42], [52, 34], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          <path d={d} stroke="#e8e2d0" strokeWidth="20" {...NS} opacity=".75" />
          <path d={d} stroke="#d4ccb4" strokeWidth="1" strokeDasharray="0" {...NS} transform="translate(-1.6 0)" opacity=".7" />
          <path d={d} stroke="#d4ccb4" strokeWidth="1" {...NS} transform="translate(1.6 0)" opacity=".7" />
          <Dots pts={pts} n={20} rx={2.4} color={[P.stone, '#9a8e7e', '#b0a494']} />
        </g>
      )
    }
    /* Gartenschau: breite Promenade mit Blumenrabatten, Ring um den See */
    case 'promenade':
      return (
        <g>
          <Way d="M50 100 L50 70" color={color} w={20} edge="#c9bfa8" edgeW={3} />
          <ellipse cx="50" cy="62" rx="21" ry="10.5" stroke="#c9bfa8" strokeWidth="13" {...NS} />
          <ellipse cx="50" cy="62" rx="21" ry="10.5" stroke={color} strokeWidth="10" {...NS} />
          <Way d="M50 52 L50 22" color={color} w={14} edge="#c9bfa8" edgeW={3} />
          <Dots pts={[[46.4, 99], [46.4, 72]]} n={8} rx={0.9} color={[P.red, P.yellow, P.lilac]} />
          <Dots pts={[[53.6, 99], [53.6, 72]]} n={8} rx={0.9} color={[P.yellow, P.lilac, P.red]} />
          <Dots pts={[[47.4, 50], [47.4, 24]]} n={7} rx={0.8} color={[P.pink, P.cream]} />
          <Dots pts={[[52.6, 50], [52.6, 24]]} n={7} rx={0.8} color={[P.cream, P.pink]} />
        </g>
      )
  }
}
