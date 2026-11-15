/**
 * Streuobstwiese — Kulisse im kräftigen Stil (wie Hauptgarten und Weinberg):
 * Himmel und Hügel mit Scheune am Horizont, Feldweg mit Grasnarbe, Bach mit
 * Ufer, Schilf und Steinen, Blumeninseln und Grasbüschel, Koppelzaun.
 *
 * Bis 2026-11-15: Farbverlauf, zwei Linien als Bach und 40 Punkte als Blumen.
 */
import { memo } from 'react'
import { useSvgId } from './svgId'
import { ArtSvg } from './ArtSvg'
import { P } from './art/palette'
import { Deco, FlowerPatch, Stones, Tuft } from './MeadowDeco'

const OUT = P.outline
const PATH = 'M50 100 C46 90 40 86 44 78 C48 70 58 68 54 58 C50 50 40 48 46 40 C50 34 52 30 50 23'
const STREAM = 'M101 57 C93 60 91 66 92 72 C93 80 86 84 85 91 C84.4 95 84 98 83 101'

function Reeds() {
  return (
    <ArtSvg viewBox="0 0 30 44">
      <path d="M6 43 Q5 26 9 12 M14 43 Q14 22 13 6 M22 43 Q24 28 20 15" fill="none" stroke={OUT} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M6 43 Q5 26 9 12 M14 43 Q14 22 13 6 M22 43 Q24 28 20 15" fill="none" stroke="#6a9a48" strokeWidth="1.8" strokeLinecap="round" />
      {(
        [
          [9, 12],
          [13, 6],
          [20, 15],
        ] as const
      ).map(([x, y]) => (
        <rect key={x} x={x - 1.9} y={y - 1} width="3.8" height="9" rx="1.9" fill={P.bark} stroke={OUT} strokeWidth="1.2" />
      ))}
      <path d="M2 43 q3 -9 5 0 M24 43 q2 -8 4 0" fill="#84bd5c" stroke={OUT} strokeWidth="1.2" strokeLinejoin="round" />
    </ArtSvg>
  )
}

/** Maulwurfshügel — gehört auf jede Wiese. */
function Molehill() {
  return (
    <ArtSvg viewBox="0 0 30 16">
      <path d="M2 14 Q6 3 15 3 Q24 3 28 14 Z" fill={P.soil} stroke={OUT} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 11 Q10 6 15 6" fill="none" stroke={P.white} strokeWidth="1.6" strokeLinecap="round" opacity=".25" />
      <circle cx="19" cy="9" r="1.1" fill={OUT} opacity=".35" />
    </ArtSvg>
  )
}

/** Feste Plätze abseits der zehn Bereiche und ihrer Schilder (Prozent der Karte). */
const TUFTS: readonly [number, number, number][] = [
  [8, 33, 0],
  [47, 30, 1],
  [92, 36, 0],
  [42, 47, 1],
  [6, 52, 0],
  [57, 50, 0],
  [10, 63, 1],
  [48, 64, 0],
  [60, 76, 1],
  [8, 79, 0],
  [52, 88, 1],
  [16, 92, 0],
]
/** Blumeninseln: je mehr Bereiche angelegt sind, desto mehr blühen (stage 0…10). */
const PATCHES: readonly [number, number, number][] = [
  [90, 44, 0],
  [8, 40, 2],
  [50, 36, 3],
  [38, 66, 4],
  [93, 30, 5],
  [9, 87, 6],
  [56, 93, 8],
  [37, 51, 9],
]

export const OrchardBackdrop = memo(function OrchardBackdrop({ stage }: { stage: number }) {
  const grass = useSvgId('og-grass')
  const sky = useSvgId('og-sky')
  const nsStroke = { fill: 'none', vectorEffect: 'non-scaling-stroke' as const, strokeLinecap: 'round' as const }
  return (
    <div className="garden-ground orchard-ground" aria-hidden="true" data-stage={stage}>
      <ArtSvg className="garden-ground-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={grass} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b2d684" />
            <stop offset="45%" stopColor="#97c66a" />
            <stop offset="100%" stopColor="#7fb058" />
          </linearGradient>
          <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfe0f2" />
            <stop offset="100%" stopColor="#eaf5e6" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${grass})`} />
        {/* Himmel über den Hügeln, zwei Wolken */}
        <rect width="100" height="23" fill={`url(#${sky})`} />
        <g fill={P.white} opacity=".85">
          <path d="M10 15.6 q1 -2.2 5 -2 q2 -2.6 7 -1.4 q5 -0.6 6 2.2 q3 0.2 3 1.6 h-21 z" />
          <path d="M66 12.6 q1 -1.8 4 -1.6 q2 -2 6 -1 q4 -0.4 5 1.6 q2.4 0.2 2.4 1.4 h-17.4 z" />
        </g>
        {/* Wiese: weiche Wellen und gemähte Bahnen geben Tiefe */}
        <path d="M0 34 Q28 28 55 33 T100 31 V46 Q70 40 40 46 T0 44 Z" fill={P.white} opacity=".07" />
        <path d="M0 58 Q35 51 68 57 T100 55 V70 Q65 63 35 69 T0 67 Z" fill="#4f8a3a" opacity=".1" />
        <path d="M0 80 Q30 74 60 80 T100 78 V100 H0 Z" fill="#4f8a3a" opacity=".1" />
        <ellipse cx="24" cy="50" rx="20" ry="5" fill={P.white} opacity=".06" />
        <ellipse cx="70" cy="88" rx="22" ry="5" fill={P.white} opacity=".06" />

        {/* Bach: Uferböschung, Kiesrand, Wasser mit heller Mitte und wandernden Glanzlichtern */}
        <path d={STREAM} stroke="#5f9445" strokeWidth="34" {...nsStroke} opacity=".55" />
        <path d={STREAM} stroke={OUT} strokeWidth="25" {...nsStroke} opacity=".5" />
        <path d={STREAM} stroke="#d6c79a" strokeWidth="22" {...nsStroke} />
        <path d={STREAM} stroke={P.waterDeep} strokeWidth="17" {...nsStroke} />
        <path d={STREAM} stroke={P.water} strokeWidth="13" {...nsStroke} />
        <path d={STREAM} stroke={P.waterLight} strokeWidth="5" {...nsStroke} opacity=".75" />
        <path d={STREAM} stroke={P.white} strokeWidth="1.8" {...nsStroke} strokeDasharray="7 21" className="orchard-stream" opacity=".8" />

        {/* Feldweg: ausgefahrene Spuren, in der Mitte wächst Gras */}
        <path d={PATH} stroke={OUT} strokeWidth="23" {...nsStroke} opacity=".28" />
        <path d={PATH} stroke="#b89c66" strokeWidth="20" {...nsStroke} />
        <path d={PATH} stroke="#e3d2a6" strokeWidth="16" {...nsStroke} />
        <path d={PATH} stroke="#f0e4c2" strokeWidth="6" {...nsStroke} opacity=".55" />
        <path d={PATH} stroke="#9cc56e" strokeWidth="3.4" {...nsStroke} strokeDasharray="10 7" opacity=".9" />
      </ArtSvg>

      {/* Hügel am Horizont: drei Staffeln, Baumreihen, Opas Scheune */}
      <div className="garden-hedge orchard-hills">
        <ArtSvg viewBox="0 0 400 60" preserveAspectRatio="none">
          <path d="M0 60 V26 Q60 8 130 22 T260 14 T400 22 V60z" fill="#a9cf96" stroke={OUT} strokeWidth="1.6" strokeOpacity=".35" vectorEffect="non-scaling-stroke" />
          <path d="M0 60 V34 Q50 14 120 30 T250 26 T360 30 T400 24 V60z" fill="#86b866" stroke={OUT} strokeWidth="1.8" strokeOpacity=".55" vectorEffect="non-scaling-stroke" />
          {/* Baumreihe auf dem mittleren Hügel */}
          {[18, 34, 52, 92, 108, 310, 328, 346, 366].map((x, i) => (
            <g key={x}>
              <rect x={x - 1} y={26 + (i % 3)} width="2" height="7" fill={P.bark} />
              <circle cx={x} cy={23 + (i % 3)} r={6 + (i % 2)} fill={i % 2 ? '#5d9645' : '#6aa64f'} stroke={OUT} strokeWidth="1.4" />
              <circle cx={x - 1.8} cy={21 + (i % 3)} r="2.6" fill="#9fd07d" opacity=".7" />
            </g>
          ))}
          {/* Scheune: Bretterwand, rotes Dach mit Schattenseite, Tor */}
          <g>
            <path d="M176 44 V27 L199 12 L222 27 V44 Z" fill={P.wood} stroke={OUT} strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M199 12 L222 27 V44 H199 Z" fill={OUT} opacity=".14" />
            <path d="M184 29 V44 M192 26 V44 M206 26 V44 M214 29 V44" stroke={OUT} strokeWidth=".9" opacity=".35" />
            <path d="M192 44 V32 Q199 27 206 32 V44 Z" fill={P.woodDark} stroke={OUT} strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M199 30 V44" stroke={OUT} strokeWidth="1" opacity=".5" />
            <path d="M171 29 L199 9 L227 29 L222 31 L199 15 L176 31 Z" fill={P.roof} stroke={OUT} strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M199 9 L227 29 L222 31 L199 15 Z" fill={OUT} opacity=".18" />
            <circle cx="199" cy="21.5" r="2.4" fill={P.woodDark} stroke={OUT} strokeWidth="1" />
          </g>
          <path d="M0 60 V44 Q70 28 150 42 T300 38 T400 36 V60z" fill="#6da24c" stroke={OUT} strokeWidth="2" strokeOpacity=".6" vectorEffect="non-scaling-stroke" />
          {/* Obstbaumreihen auf dem vorderen Hang */}
          {[30, 62, 250, 282, 314, 380].map((x, i) => (
            <g key={x}>
              <rect x={x - 0.8} y={44 + (i % 2) * 2} width="1.6" height="5" fill={P.bark} />
              <circle cx={x} cy={42 + (i % 2) * 2} r="4.4" fill="#4f8a3a" stroke={OUT} strokeWidth="1.2" />
              <circle cx={x + 1.6} cy={42.6 + (i % 2) * 2} r="1" fill={P.red} />
            </g>
          ))}
          <path d="M0 52 Q90 40 180 50 T400 46" fill="none" stroke={P.white} strokeWidth="2" opacity=".14" />
        </ArtSvg>
      </div>

      {TUFTS.map(([x, y, tone]) => (
        <Deco key={`t${x}-${y}`} left={x} top={y} w={7}>
          <Tuft fill={tone ? '#8cc763' : '#a9dc7e'} />
        </Deco>
      ))}
      {PATCHES.map(([x, y, from], i) =>
        stage >= from ? (
          <Deco key={`p${x}-${y}`} left={x} top={y} w={9}>
            <FlowerPatch seed={i} />
          </Deco>
        ) : null,
      )}
      <Deco left={96} top={61} w={7}>
        <Reeds />
      </Deco>
      <Deco left={80} top={95} w={7}>
        <Reeds />
      </Deco>
      <Deco left={91} top={75.5} w={6.4}>
        <Stones />
      </Deco>
      <Deco left={87} top={89} w={4.6}>
        <Stones />
      </Deco>
      <Deco left={12} top={58} w={5}>
        <Molehill />
      </Deco>
      <Deco left={58} top={84} w={4.4}>
        <Molehill />
      </Deco>

      {/* Koppelzaun: Pfosten mit Lichtseite, zwei Riegel */}
      <div className="garden-fence">
        <ArtSvg viewBox="0 0 400 30" preserveAspectRatio="none">
          <rect x="-2" y="9.5" width="404" height="4.4" fill={P.woodLight} stroke={OUT} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <rect x="-2" y="19" width="404" height="4.4" fill={P.wood} stroke={OUT} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          {Array.from({ length: 11 }, (_, i) => (
            <g key={i}>
              <path d={`M${i * 40 - 4} 31 V6 Q${i * 40} 2.4 ${i * 40 + 4} 6 V31 Z`} fill={P.woodMid} stroke={OUT} strokeWidth="1.6" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <path d={`M${i * 40 - 2.4} 7 V30`} stroke={P.white} strokeWidth="1.4" opacity=".28" />
              <path d={`M${i * 40 + 2} 7 V30`} stroke={OUT} strokeWidth="1.6" opacity=".2" />
            </g>
          ))}
        </ArtSvg>
      </div>
      <div className="ambient-tint" />
    </div>
  )
})
