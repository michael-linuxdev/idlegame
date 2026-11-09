/**
 * Kapitel-Wege: every chapter gets its own path shape instead of the one
 * shared S-curve. Drawn in the stretched 100×100 ground SVG — strokes use
 * non-scaling widths (px), round things use ry ≈ rx · 0.45 to stay round.
 */
import type { ReactNode } from 'react'
import { P } from './art/palette'

export type PathStyle = 'track' | 'loop' | 'shore' | 'cross' | 'rondel' | 'switchback' | 'lane' | 'stones' | 'promenade' | 'yard' | 'cloister' | 'axis' | 'nurseryRows' | 'boardwalk' | 'dikeTrack' | 'fliess' | 'flagstones' | 'bulbLanes' | 'canals' | 'forestTrail' | 'patioTiles' | 'montadoTrack' | 'pepperLanes' | 'limestone' | 'roseLanes' | 'terraceSteps' | 'andenSteps' | 'milpaRing' | 'forestZigzag' | 'subakSteps' | 'spiceTrail' | 'oasisRing' | 'cocoaTrail' | 'bushSpiral' | 'fernBoardwalk' | 'kimchiRows' | 'roofRing' | 'schoolZigzag' | 'chipSpiral' | 'seedRing' | 'mulchZigzag' | 'meadowSpiral' | 'courtSteps' | 'farmRows' | 'swapRing' | 'expoRing'

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
    /* Gemeinschaftsgarten: gepflasterter Hof, Pflasterfugen, Gully in der Mitte */
    case 'yard':
      return (
        <g>
          <Way d="M50 100 L50 22" color={color} w={16} edge={P.stoneDark} edgeW={2} />
          <ellipse cx="50" cy="58" rx="24" ry="11" fill={color} />
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M${30 + i * 5} ${50 + (i % 2)} v16`} stroke={P.stoneDark} strokeWidth="1" {...NS} opacity=".35" />
          ))}
          <path d="M28 54 H72 M28 62 H72" stroke={P.stoneDark} strokeWidth="1" {...NS} opacity=".35" />
          <ellipse cx="50" cy="58" rx="2.4" ry="1.1" fill={P.metal} />
        </g>
      )
    /* Klostergarten: Treppenweg die Terrassen hinauf, Querwege an jeder Stufe */
    case 'cloister': {
      const pts: [number, number][] = [[50, 100], [50, 86], [42, 80], [42, 66], [58, 60], [58, 46], [46, 40], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          <Way d={d} color={color} w={10} edge={P.stoneDark} edgeW={2} />
          {[84, 72, 58, 44].map((y) => (
            <path key={y} d={`M38 ${y} H62`} stroke={P.stoneDark} strokeWidth="2" {...NS} opacity=".4" />
          ))}
        </g>
      )
    }
    /* Schlossgarten: breite Kiesachse mit rundem Becken, Buchskanten links und rechts */
    case 'axis':
      return (
        <g>
          <Way d="M50 100 V22" color={color} w={18} edge={P.leafDark} edgeW={3} />
          <Way d="M30 70 H70" color={color} w={9} edge={P.leafDark} edgeW={3} />
          <ellipse cx="50" cy="56" rx="10" ry="4.6" fill={P.stone} />
          <ellipse cx="50" cy="56" rx="8.6" ry="3.8" fill={P.water} />
          <ellipse cx="50" cy="55.2" rx="1" ry="1.6" fill={P.glassEdge} />
        </g>
      )
    /* Baumschule: gerade Fahrgassen zwischen den Reihen */
    case 'nurseryRows':
      return (
        <g>
          <Way d="M50 100 V22" color={color} w={12} edge="#b8a070" edgeW={2} />
          {[30, 70].map((x) => (
            <path key={x} d={`M${x} 96 V30`} stroke={color} strokeWidth="5" {...NS} opacity=".8" />
          ))}
          <path d="M30 80 H70 M30 50 H70" stroke={color} strokeWidth="6" {...NS} opacity=".85" />
          <Dots pts={[[40, 96], [40, 30]]} n={10} rx={1.3} color={[P.leafDark, P.leaf]} />
          <Dots pts={[[60, 96], [60, 30]]} n={10} rx={1.3} color={[P.leaf, P.leafDark]} />
        </g>
      )
    /* Deichgarten: Betonspurweg (zwei Plattenstreifen mit Grasnarbe) im Zickzack, Viehgitter */
    case 'dikeTrack': {
      const pts: [number, number][] = [[50, 100], [47, 90], [54, 78], [45, 64], [55, 50], [46, 37], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          <path d={d} stroke="#9cc06a" strokeWidth="14" {...NS} />
          <path d={d} stroke={color} strokeWidth="4" {...NS} transform="translate(-2.4 0)" />
          <path d={d} stroke={color} strokeWidth="4" {...NS} transform="translate(2.4 0)" />
          <path d="M45 85 H55 M45 86.4 H55 M45 87.8 H55" stroke={P.metal} strokeWidth="1.2" {...NS} />
        </g>
      )
    }
    /* Spreewald: ein Fließ schlängelt sich durchs Bild, Holzbrücken darüber */
    case 'fliess': {
      const d = 'M50 100 C40 92 58 86 50 78 C42 70 60 64 50 56 C40 48 58 42 50 34 C44 28 52 24 50 22'
      return (
        <g>
          <path d={d} stroke="#6a9a48" strokeWidth="15" {...NS} />
          <path d={d} stroke={color} strokeWidth="11" {...NS} />
          {[78, 46].map((y) => (
            <g key={y}>
              <path d={`M43 ${y} H57`} stroke={P.woodDark} strokeWidth="7" {...NS} strokeLinecap="butt" />
              <path d={`M43 ${y} H57`} stroke={P.wood} strokeWidth="5" strokeDasharray="1 .4" {...NS} strokeLinecap="butt" />
            </g>
          ))}
        </g>
      )
    }
    /* Cottage-Garten: Trittplatten aus Kalkstein im Zickzack, Lavendel am Rand */
    case 'flagstones': {
      const pts: [number, number][] = [[50, 100], [48, 88], [54, 78], [46, 66], [54, 54], [46, 42], [50, 30], [50, 22]]
      return (
        <g>
          <Dots pts={pts} n={18} rx={3.2} color={[color, '#d4c49a', color]} />
          <Dots pts={pts.map(([x, y]) => [x - 5, y] as [number, number])} n={14} rx={0.9} color={[P.lavender, P.lilac]} />
          <Dots pts={pts.map(([x, y]) => [x + 5, y] as [number, number])} n={14} rx={0.9} color={[P.lilac, P.lavender]} />
        </g>
      )
    }
    /* Tulpenfelder: gerade Wege zwischen den Feldern, Graben quer davor */
    case 'bulbLanes':
      return (
        <g>
          <Way d="M50 100 V22" color={color} w={10} edge="#b8a070" edgeW={2} />
          <path d="M18 79 H82 M18 64 H82 M22 47 H78" stroke={color} strokeWidth="6" {...NS} opacity=".9" />
          <path d="M0 31 H100" stroke={P.water} strokeWidth="6" {...NS} />
          <path d="M44 31 H56" stroke={P.white} strokeWidth="8" {...NS} strokeLinecap="butt" />
        </g>
      )
    /* Artischockeninsel: Kanal im Zickzack mit Ziegelrand und Bogenbrücke */
    case 'canals': {
      const pts: [number, number][] = [[50, 100], [50, 90], [56, 80], [44, 64], [56, 50], [46, 36], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          <path d={d} stroke={P.terracottaLight} strokeWidth="14" {...NS} strokeLinejoin="miter" />
          <path d={d} stroke={color} strokeWidth="11" {...NS} strokeLinejoin="miter" />
          <path d="M43 57 H57" stroke={P.terracotta} strokeWidth="6" {...NS} strokeLinecap="butt" />
          <path d="M43 57 H57" stroke={P.stoneLight} strokeWidth="1.4" {...NS} transform="translate(0 -1.4)" />
          <Dots pts={[[47, 86], [53, 72]]} n={3} rx={0.6} color={P.waterLight} />
        </g>
      )
    }
    /* Beerenwald: Waldpfad in der Spirale, Wurzeln und orange Wegzeichen */
    case 'forestTrail': {
      const d = 'M50 100 L50 86 C80 82 82 62 70 50 C58 38 30 40 24 56 C20 68 40 76 54 66 C62 60 56 52 50 52'
      return (
        <g>
          <path d={d} stroke="#7a6a48" strokeWidth="9" {...NS} />
          <path d={d} stroke={color} strokeWidth="7" {...NS} />
          <path d="M52 90 l4 -1 M71 60 l3 2 M36 45 l-2 3 M30 66 l3 1" stroke={P.bark} strokeWidth="1.4" {...NS} />
          <Dots pts={[[62, 84], [76, 66], [44, 41], [24, 62], [46, 70]]} n={5} rx={0.8} color={P.orange} />
          <path d="M50 52 L50 22" stroke={color} strokeWidth="5" {...NS} opacity=".8" />
        </g>
      )
    }
    /* Patio: Ziegelweg rund um den Brunnen, Wasserrinnen (Acequias) in vier Richtungen */
    case 'patioTiles':
      return (
        <g>
          <Way d="M50 100 V72" color={color} w={12} edge={P.terracottaLight} edgeW={2} />
          <ellipse cx="50" cy="58" rx="17" ry="13" stroke={P.terracottaLight} strokeWidth="13" {...NS} />
          <ellipse cx="50" cy="58" rx="17" ry="13" stroke={color} strokeWidth="11" strokeDasharray="2 .5" {...NS} />
          <path d="M50 45 V22" stroke={color} strokeWidth="9" {...NS} />
          <path d="M33 58 H44 M56 58 H67 M50 45 V52 M50 64 V71" stroke={P.water} strokeWidth="2.4" {...NS} />
          <ellipse cx="50" cy="58" rx="6" ry="4" fill={P.white} />
          <ellipse cx="50" cy="58" rx="5" ry="3.2" fill={P.blue} />
          <ellipse cx="50" cy="58" rx="3.8" ry="2.4" fill={P.water} />
          <ellipse cx="50" cy="57.2" rx=".7" ry="1.4" fill={P.glassEdge} />
        </g>
      )
    /* Korkeichenhain: roter Erdweg im Zickzack, Fahrspuren, Eicheln am Rand */
    case 'montadoTrack': {
      const pts: [number, number][] = [[50, 100], [47, 90], [54, 78], [45, 64], [55, 50], [46, 37], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          <Way d={d} color={color} w={13} edge="#a86a3a" edgeW={2} />
          <path d={d} stroke="#b07a4a" strokeWidth="1.2" {...NS} transform="translate(-2 0)" />
          <path d={d} stroke="#b07a4a" strokeWidth="1.2" {...NS} transform="translate(2 0)" />
          <Dots pts={pts.map(([x, y]) => [x + 6, y] as [number, number])} n={9} rx={0.6} color={P.woodDark} />
        </g>
      )
    }
    /* Paprikafelder: gerader Feldweg, Querwege, rote und grüne Reihen am Rand */
    case 'pepperLanes':
      return (
        <g>
          <Way d="M50 100 V22" color={color} w={11} edge="#b8a070" edgeW={2} />
          <path d="M16 79 H84 M16 64 H84 M22 47 H78" stroke={color} strokeWidth="6" {...NS} opacity=".9" />
          <Dots pts={[[44, 98], [44, 26]]} n={14} rx={0.6} color={[P.tomato, P.leafDark]} />
          <Dots pts={[[56, 98], [56, 26]]} n={14} rx={0.6} color={[P.leafDark, P.tomato]} />
        </g>
      )
    /* Aran: Weg aus Kalkstein im Zickzack zwischen Trockenmauern */
    case 'limestone': {
      const pts: [number, number][] = [[50, 100], [48, 88], [56, 76], [44, 62], [56, 48], [46, 36], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          <Way d={d} color={color} w={10} edge={P.stoneDark} edgeW={2} />
          <path d={d} stroke={P.stoneDark} strokeWidth="1" strokeDasharray="3 2" {...NS} opacity=".6" />
          <path d="M0 80 H38 M62 70 H100 M0 54 H36 M64 42 H100" stroke={P.stone} strokeWidth="3" strokeDasharray="1.2 .6" {...NS} />
        </g>
      )
    }
    /* Rosental: gerader Weg zwischen rosa Rosenreihen */
    case 'roseLanes':
      return (
        <g>
          <Way d="M50 100 V22" color={color} w={11} edge="#b8a070" edgeW={2} />
          <path d="M14 79 H86 M14 64 H86 M22 47 H78" stroke={color} strokeWidth="5" {...NS} opacity=".85" />
          <Dots pts={[[43.6, 98], [43.6, 26]]} n={16} rx={1} color={[P.pink, P.leafDark, P.blossom]} />
          <Dots pts={[[56.4, 98], [56.4, 26]]} n={16} rx={1} color={[P.leafDark, P.pink, P.blossom]} />
        </g>
      )
    /* Ägina: Treppenweg die Terrassen hinauf, Mauern quer am Hang */
    case 'terraceSteps': {
      const pts: [number, number][] = [[50, 100], [50, 88], [44, 80], [56, 66], [44, 52], [56, 40], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          {[92, 76, 60, 44, 30].map((y) => (
            <path key={y} d={`M4 ${y} H96`} stroke="#d4c49a" strokeWidth="2.4" strokeDasharray="1.6 .5" {...NS} />
          ))}
          <Way d={d} color={color} w={9} edge={P.stone} edgeW={2} />
          <path d={d} stroke={P.stoneLight} strokeWidth="9" strokeDasharray=".6 1.6" {...NS} strokeLinecap="butt" />
        </g>
      )
    }
    /* Anden: Steintreppe im Zickzack, Terrassenmauern quer am Hang */
    case 'andenSteps': {
      const pts: [number, number][] = [[50, 100], [50, 90], [42, 80], [58, 66], [42, 52], [56, 38], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          {[94, 80, 66, 52, 38, 26].map((y) => (
            <path key={y} d={`M2 ${y} Q50 ${y - 3} 98 ${y}`} stroke={P.stoneDark} strokeWidth="3" strokeDasharray="2 .6" {...NS} />
          ))}
          <Way d={d} color={color} w={9} edge={P.stoneDark} edgeW={2} />
          <path d={d} stroke={P.stone} strokeWidth="9" strokeDasharray=".6 1.8" {...NS} strokeLinecap="butt" />
        </g>
      )
    }
    /* Milpa: Feldweg im Ring um das Maisfeld, Maisreihen in der Mitte */
    case 'milpaRing':
      return (
        <g>
          <Way d="M50 100 V72" color={color} w={12} edge="#b8a070" edgeW={2} />
          <ellipse cx="50" cy="58" rx="18" ry="14" stroke="#b8a070" strokeWidth="13" {...NS} />
          <ellipse cx="50" cy="58" rx="18" ry="14" stroke={color} strokeWidth="11" {...NS} />
          <path d="M50 44 V22" stroke={color} strokeWidth="9" {...NS} />
          <Dots pts={[[42, 52], [58, 52]]} n={6} rx={0.9} color={P.leafDark} />
          <Dots pts={[[40, 58], [60, 58]]} n={7} rx={0.9} color={[P.leafDark, P.yellow]} />
          <Dots pts={[[42, 64], [58, 64]]} n={6} rx={0.9} color={P.leafDark} />
        </g>
      )
    /* Kaffeewald: roter Erdpfad im Zickzack, Laub und Wurzeln am Rand */
    case 'forestZigzag': {
      const pts: [number, number][] = [[50, 100], [46, 88], [56, 76], [44, 62], [56, 48], [46, 34], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          <Way d={d} color={color} w={11} edge="#8a5a32" edgeW={2} />
          <Dots pts={pts.map(([x, y]) => [x - 7, y] as [number, number])} n={10} rx={0.8} color={[P.leafDark, P.berry, P.leafMoss]} />
          <Dots pts={pts.map(([x, y]) => [x + 7, y] as [number, number])} n={10} rx={0.8} color={[P.leafMoss, P.leafDark, P.berry]} />
        </g>
      )
    }
    /* Bali: Pfad über die Reisterrassen, daneben läuft der Subak-Kanal hinab */
    case 'subakSteps': {
      const pts: [number, number][] = [[50, 100], [50, 88], [44, 78], [56, 64], [44, 50], [56, 38], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          {[92, 78, 64, 50, 36].map((y, i) => (
            <path key={y} d={`M2 ${y} Q50 ${y + (i % 2 ? 3 : -3)} 98 ${y}`} stroke={P.leafMoss} strokeWidth="2" {...NS} opacity=".8" />
          ))}
          <path d={pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x + 6} ${y}`).join(' ')} stroke={P.water} strokeWidth="3" {...NS} />
          <Way d={d} color={color} w={8} edge={P.leafMoss} edgeW={2} />
        </g>
      )
    }
    /* Kerala: Lateritpfad im Zickzack zwischen Gewürzen */
    case 'spiceTrail': {
      const pts: [number, number][] = [[50, 100], [47, 88], [55, 76], [45, 62], [55, 48], [46, 35], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          <Way d={d} color={color} w={11} edge={P.autumnDark} edgeW={2} />
          <path d={d} stroke={P.terracottaLight} strokeWidth="1" strokeDasharray="1 2.4" {...NS} />
          <Dots pts={pts.map(([x, y]) => [x - 7, y] as [number, number])} n={9} rx={0.8} color={[P.orange, P.yellow, P.berry]} />
          <Dots pts={pts.map(([x, y]) => [x + 7, y] as [number, number])} n={9} rx={0.8} color={[P.yellow, P.berry, P.orange]} />
        </g>
      )
    }
    /* Oase: Sandweg im Ring um das Wasserbecken, die Khettara läuft von oben hinein */
    case 'oasisRing':
      return (
        <g>
          <Way d="M50 100 V72" color={color} w={12} edge="#c9a46b" edgeW={2} />
          <ellipse cx="50" cy="58" rx="18" ry="14" stroke="#c9a46b" strokeWidth="13" {...NS} />
          <ellipse cx="50" cy="58" rx="18" ry="14" stroke={color} strokeWidth="11" {...NS} />
          <path d="M50 44 V22" stroke={color} strokeWidth="9" {...NS} />
          <path d="M44 22 Q42 34 46 46" stroke={P.water} strokeWidth="2.4" {...NS} />
          <ellipse cx="50" cy="58" rx="6" ry="3.6" fill={P.terracottaLight} />
          <ellipse cx="50" cy="58" rx="4.8" ry="2.7" fill={P.water} />
          <Dots pts={[[30, 60], [32, 70], [42, 75]]} n={5} rx={0.9} color={[P.leafDark, P.leaf]} />
          <Dots pts={[[70, 60], [68, 70], [58, 75]]} n={5} rx={0.9} color={[P.leaf, P.leafDark]} />
        </g>
      )
    /* Ghana: roter Lateritpfad im Zickzack, Kakaoschoten am Rand */
    case 'cocoaTrail': {
      const pts: [number, number][] = [[50, 100], [46, 88], [56, 76], [44, 62], [56, 48], [46, 34], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          <Way d={d} color={color} w={11} edge="#8a5a32" edgeW={2} />
          <Dots pts={pts.map(([x, y]) => [x - 7, y] as [number, number])} n={10} rx={0.9} color={[P.gold, P.leafDark, P.orange]} />
          <Dots pts={pts.map(([x, y]) => [x + 7, y] as [number, number])} n={10} rx={0.9} color={[P.leafDark, P.berry, P.gold]} />
        </g>
      )
    }
    /* Australien: roter Sandweg als Spirale, Grasbüschel am Rand */
    case 'bushSpiral': {
      const d = 'M50 100 L50 86 C80 82 82 62 70 50 C58 38 30 40 24 56 C20 68 40 76 54 66 C62 60 56 52 50 52'
      return (
        <g>
          <path d={d} stroke="#a5531a" strokeWidth="10" {...NS} />
          <path d={d} stroke={color} strokeWidth="8" {...NS} />
          <Dots pts={[[62, 84], [78, 66], [60, 40], [30, 44], [22, 64], [40, 74]]} n={8} rx={1} color={[P.gold, P.winterLeaf]} />
          <path d="M50 52 L50 22" stroke={color} strokeWidth="6" {...NS} opacity=".85" />
        </g>
      )
    }
    /* Neuseeland: Holzsteg als Spirale durch den Farnwald */
    case 'fernBoardwalk': {
      const d = 'M50 100 L50 86 C80 82 82 62 70 50 C58 38 30 40 24 56 C20 68 40 76 54 66 C62 60 56 52 50 52'
      return (
        <g>
          <path d={d} stroke={P.woodDark} strokeWidth="9" {...NS} />
          <path d={d} stroke={color} strokeWidth="7" strokeDasharray="1.4 .5" {...NS} strokeLinecap="butt" />
          <Dots pts={[[64, 86], [80, 64], [58, 38], [26, 44], [18, 66], [42, 78]]} n={9} rx={1.1} color={[P.leafDark, P.leafMoss]} />
          <path d="M50 52 L50 22" stroke={color} strokeWidth="6" {...NS} opacity=".8" />
        </g>
      )
    }
    /* Korea: gerader Feldweg, Querwege, Kohl- und Chilireihen am Rand */
    case 'kimchiRows':
      return (
        <g>
          <Way d="M50 100 V22" color={color} w={11} edge="#b8a070" edgeW={2} />
          <path d="M14 79 H86 M14 64 H86 M22 47 H78" stroke={color} strokeWidth="5" {...NS} opacity=".9" />
          <Dots pts={[[43.6, 98], [43.6, 26]]} n={16} rx={1} color={[P.leafPale, P.leaf]} />
          <Dots pts={[[56.4, 98], [56.4, 26]]} n={16} rx={1} color={[P.berry, P.leafPale]} />
        </g>
      )
    /* Dachgarten: Plattenweg im Ring um ein Oberlicht, Kies dazwischen */
    case 'roofRing':
      return (
        <g>
          <Way d="M50 100 V72" color={color} w={12} edge="#a69a8a" edgeW={2} />
          <ellipse cx="50" cy="58" rx="18" ry="14" stroke="#a69a8a" strokeWidth="13" {...NS} />
          <ellipse cx="50" cy="58" rx="18" ry="14" stroke={color} strokeWidth="11" strokeDasharray="5 1" {...NS} strokeLinecap="butt" />
          <path d="M50 44 V22" stroke={color} strokeWidth="9" {...NS} />
          <rect x="47" y="56.4" width="6" height="3.2" fill={P.glass} stroke={P.metal} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          <path d="M50 56.4v3.2" stroke={P.metal} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <Dots pts={[[30, 60], [32, 70], [42, 75]]} n={5} rx={0.9} color={[P.yellow, P.leafLight]} />
          <Dots pts={[[70, 60], [68, 70], [58, 75]]} n={5} rx={0.9} color={[P.leafLight, P.berry]} />
        </g>
      )
    /* Schulgarten: Asphaltweg im Zickzack, Hüpfkästchen und Kreide am Rand */
    case 'schoolZigzag': {
      const pts: [number, number][] = [[50, 100], [46, 88], [56, 76], [44, 62], [56, 48], [46, 34], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          <Way d={d} color={color} w={12} edge="#8f8676" edgeW={2} />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={47.4 + (k % 2) * 0.3} y={93 - k * 2} width="3.2" height="1.6" fill={P.white} fillOpacity=".15" stroke={P.white} strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          <ellipse cx="50" cy="56" rx="2" ry=".9" fill="none" stroke={P.yellow} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <Dots pts={pts.map(([x, y]) => [x - 7, y] as [number, number])} n={10} rx={0.9} color={[P.red, P.leafDark, P.yellow]} />
          <Dots pts={pts.map(([x, y]) => [x + 7, y] as [number, number])} n={10} rx={0.9} color={[P.leaf, P.blue, P.red]} />
        </g>
      )
    }
    /* Waldgarten: Holzhäckselweg als Spirale unter den Bäumen */
    case 'chipSpiral': {
      const d = 'M50 100 L50 86 C80 82 82 62 70 50 C58 38 30 40 24 56 C20 68 40 76 54 66 C62 60 56 52 50 52'
      return (
        <g>
          <path d={d} stroke="#8a5a32" strokeWidth="10" {...NS} />
          <path d={d} stroke={color} strokeWidth="8" {...NS} />
          <path d={d} stroke="#c9a46b" strokeWidth="2" strokeDasharray="1 3" {...NS} />
          <Dots pts={[[62, 84], [78, 66], [60, 40], [30, 44], [22, 64], [40, 74]]} n={9} rx={1} color={[P.leafDark, P.autumn, P.leaf]} />
          <path d="M50 52 L50 22" stroke={color} strokeWidth="6" {...NS} opacity=".85" />
        </g>
      )
    }
    /* Samenbank: Kiesweg im Ring um ein rundes Sortenbeet mit Etiketten */
    case 'seedRing':
      return (
        <g>
          <Way d="M50 100 V72" color={color} w={12} edge="#a69a8a" edgeW={2} />
          <ellipse cx="50" cy="58" rx="18" ry="14" stroke="#a69a8a" strokeWidth="13" {...NS} />
          <ellipse cx="50" cy="58" rx="18" ry="14" stroke={color} strokeWidth="11" {...NS} />
          <path d="M50 44 V22" stroke={color} strokeWidth="9" {...NS} />
          <ellipse cx="50" cy="58" rx="5" ry="2.8" fill={P.soil} />
          {[P.leafLight, P.yellow, P.leaf, P.berry].map((c, i) => (
            <ellipse key={i} cx={48 + (i % 2) * 4} cy={57 + Math.floor(i / 2) * 2} rx="1.2" ry=".6" fill={c} />
          ))}
          <Dots pts={[[30, 60], [32, 70], [42, 75]]} n={5} rx={0.7} color={P.white} />
          <Dots pts={[[70, 60], [68, 70], [58, 75]]} n={5} rx={0.7} color={P.white} />
        </g>
      )
    /* Klimagarten: Mulchweg im Zickzack, eine Versickerungsrinne quert ihn */
    case 'mulchZigzag': {
      const pts: [number, number][] = [[50, 100], [46, 88], [56, 76], [44, 62], [56, 48], [46, 34], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          <Way d={d} color={color} w={11} edge="#7a5532" edgeW={2} />
          <path d={d} stroke="#c9a46b" strokeWidth="2" strokeDasharray="1 4" {...NS} />
          <path d="M14 70 Q30 66 44 70 T86 66" stroke={P.water} strokeWidth="3" {...NS} opacity=".75" />
          <Dots pts={pts.map(([x, y]) => [x - 7, y] as [number, number])} n={10} rx={0.9} color={[P.lavender, P.winterLeaf]} />
          <Dots pts={pts.map(([x, y]) => [x + 7, y] as [number, number])} n={10} rx={0.9} color={[P.winterLeafLight, P.pink]} />
        </g>
      )
    }
    /* Wildblumenband: gemähter Graspfad als Spirale, Blumen säumen den Rand */
    case 'meadowSpiral': {
      const d = 'M50 100 L50 86 C80 82 82 62 70 50 C58 38 30 40 24 56 C20 68 40 76 54 66 C62 60 56 52 50 52'
      return (
        <g>
          <path d={d} stroke="#8a9a50" strokeWidth="11" {...NS} />
          <path d={d} stroke={color} strokeWidth="8" {...NS} />
          <path d={d} stroke="#c9a46b" strokeWidth="1.6" strokeDasharray="1 3" {...NS} />
          <Dots pts={[[62, 88], [80, 68], [62, 38], [30, 42], [20, 64], [40, 78]]} n={14} rx={1.1} color={[P.red, P.blue, P.white]} />
          <Dots pts={[[40, 92], [86, 70], [70, 30], [20, 44], [12, 70]]} n={10} rx={1} color={[P.yellow, P.red, P.lilac]} />
          <path d="M50 52 L50 22" stroke={color} strokeWidth="6" {...NS} opacity=".85" />
        </g>
      )
    }
    /* Fassadengarten: Treppe im Zickzack an den Etagen, Pflanzkübel auf den Absätzen */
    case 'courtSteps': {
      const pts: [number, number][] = [[50, 100], [50, 88], [42, 80], [58, 66], [42, 52], [56, 38], [50, 22]]
      const d = 'M' + pts.map((p) => p.join(' ')).join(' L')
      return (
        <g>
          {[92, 76, 60, 44, 30].map((y) => (
            <path key={y} d={`M4 ${y} H96`} stroke="#a69a8a" strokeWidth="2.4" {...NS} />
          ))}
          <Way d={d} color={color} w={10} edge="#8f8676" edgeW={2} />
          <path d={d} stroke="#a69a8a" strokeWidth="10" strokeDasharray=".5 1.8" {...NS} strokeLinecap="butt" />
          <Dots pts={pts.map(([x, y]) => [x - 8, y] as [number, number])} n={8} rx={1.2} color={[P.leafDark, P.red]} />
          <Dots pts={pts.map(([x, y]) => [x + 8, y] as [number, number])} n={8} rx={1.2} color={[P.leaf, P.terracotta]} />
        </g>
      )
    }
    /* Solawi-Hof: Feldweg in der Mitte, Beete in Querstreifen */
    case 'farmRows':
      return (
        <g>
          <Way d="M50 100 V22" color={color} w={12} edge="#a5733f" edgeW={2} />
          <path d="M48.6 100 V22 M51.4 100 V22" stroke="#a5733f" strokeWidth="1.6" {...NS} opacity=".7" />
          <path d="M8 82 H38 M62 82 H92 M8 66 H38 M62 66 H92 M14 50 H38 M62 50 H86" stroke={P.soil} strokeWidth="4" {...NS} opacity=".55" />
          <Dots pts={[[40, 98], [40, 26]]} n={14} rx={1} color={[P.leafPale, P.orange]} />
          <Dots pts={[[60, 98], [60, 26]]} n={14} rx={1} color={[P.leaf, P.red]} />
        </g>
      )
    /* Saatguttausch: Festwiese mit Ring aus Wiesenweg, Wimpel-Pflöcke */
    case 'swapRing':
      return (
        <g>
          <Way d="M50 100 V72" color={color} w={12} edge="#b8a070" edgeW={2} />
          <ellipse cx="50" cy="58" rx="18" ry="14" stroke="#b8a070" strokeWidth="13" {...NS} />
          <ellipse cx="50" cy="58" rx="18" ry="14" stroke={color} strokeWidth="11" {...NS} />
          <path d="M50 44 V22" stroke={color} strokeWidth="9" {...NS} />
          <ellipse cx="50" cy="58" rx="4" ry="2.4" fill={P.woodLight} />
          <path d="M50 58v-4" stroke={P.woodDark} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <Dots pts={[[30, 60], [32, 70], [42, 75]]} n={5} rx={0.9} color={[P.tomato, P.yellow, P.blue]} />
          <Dots pts={[[70, 60], [68, 70], [58, 75]]} n={5} rx={0.9} color={[P.blue, P.cream, P.tomato]} />
        </g>
      )
    /* Weltgartenschau: breite Promenade im Ring um ein Blumenrondell */
    case 'expoRing':
      return (
        <g>
          <Way d="M50 100 V72" color={color} w={13} edge="#a69a8a" edgeW={2} />
          <ellipse cx="50" cy="58" rx="18" ry="14" stroke="#a69a8a" strokeWidth="14" {...NS} />
          <ellipse cx="50" cy="58" rx="18" ry="14" stroke={color} strokeWidth="12" strokeDasharray="6 1" {...NS} strokeLinecap="butt" />
          <path d="M50 44 V22" stroke={color} strokeWidth="10" {...NS} />
          <ellipse cx="50" cy="58" rx="5" ry="3" fill={P.leaf} />
          {[P.red, P.yellow, P.blue, P.pink].map((c, i) => (
            <ellipse key={i} cx={47.6 + (i % 2) * 4.8} cy={57 + Math.floor(i / 2) * 2} rx="1.2" ry=".6" fill={c} />
          ))}
          <Dots pts={[[30, 60], [32, 70], [42, 75]]} n={5} rx={0.9} color={[P.red, P.yellow]} />
          <Dots pts={[[70, 60], [68, 70], [58, 75]]} n={5} rx={0.9} color={[P.blue, P.pink]} />
        </g>
      )
    /* Moorgarten: Bohlenweg in einer Schleife übers dunkle Wasser */
    case 'boardwalk': {
      const d = 'M50 100 L50 86 C80 82 82 62 70 50 C58 38 30 40 24 56 C20 68 40 76 54 66 C62 60 56 52 50 52'
      return (
        <g>
          <path d={d} stroke={P.woodDark} strokeWidth="9" {...NS} />
          <path d={d} stroke={color} strokeWidth="7" strokeDasharray="1.4 .5" {...NS} strokeLinecap="butt" />
          <path d="M50 52 L50 22" stroke={color} strokeWidth="6" {...NS} opacity=".8" />
        </g>
      )
    }
  }
}
