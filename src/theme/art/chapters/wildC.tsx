/** Kapitel-Grafik (Kapitel 13–17): gesperrte Ecken. */
import { Svg } from '../../HandParts'
import { P } from '../palette'

/**
 * Locked corners: rubble + a shopping trolley (Stadtgarten), nettles at the old wall (Kloster),
 * overgrown box (Schloss), stacked empty pots (Baumschule), drained ditch with scrub (Moor).
 */
export function WildC({ chapter, seed = 0 }: { chapter: string; seed?: number }) {
  if (chapter === 'stadtgarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.stone} opacity=".6" />
        {Array.from({ length: 5 }, (_, i) => (
          <rect key={i} x={16 + i * 8} y={56 - (i % 2) * 2} width={5 + ((i + seed) % 3)} height="3.4" fill={i % 2 ? P.terracotta : P.stoneDark} transform={`rotate(${(i * 23) % 40 - 20} ${18 + i * 8} 58)`} />
        ))}
        <path d="M50 50h14l-2 8h-10zM52 58v3M60 58v3" stroke={P.metal} strokeWidth=".8" fill="none" />
        {[22, 34, 46].map((x) => (
          <path key={x} d={`M${x} 64 q1 -${5 + ((x + seed) % 3)} 2 -7`} stroke={P.leafMoss} strokeWidth="1" fill="none" />
        ))}
      </Svg>
    )
  }
  if (chapter === 'klostergarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.leafMoss} opacity=".55" />
        {Array.from({ length: 3 }, (_, i) => (
          <rect key={i} x={18 + i * 10} y={52 - (i % 2) * 2} width="9" height="6" rx="1.4" fill={P.stone} stroke={P.outlineStone} strokeWidth=".4" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M${14 + i * 8} 64v-${8 + ((i + seed) % 3) * 3}M${14 + i * 8} 58l-2 -2M${14 + i * 8} 56l2 -2`} stroke={P.leafDark} strokeWidth=".8" />
        ))}
      </Svg>
    )
  }
  if (chapter === 'schlossgarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.leafLight} opacity=".6" />
        {[24, 40, 56].map((x, i) => (
          <g key={x}>
            <ellipse cx={x} cy={56 - (i % 2) * 2} rx={7 + ((i + seed) % 2)} ry="5.6" fill={P.leafDark} stroke={P.outline} strokeWidth=".4" />
            <path d={`M${x - 3} ${51 - (i % 2) * 2}l-2 -4M${x + 2} ${51 - (i % 2) * 2}l1 -5`} stroke={P.leafMoss} strokeWidth=".8" />
          </g>
        ))}
        <path d="M14 64h52" stroke={P.stoneLight} strokeWidth="1.4" />
      </Svg>
    )
  }
  if (chapter === 'baumschule') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.soil} opacity=".5" />
        {Array.from({ length: 4 }, (_, i) => (
          <path key={i} d={`M${26 + (i % 2) * 2} ${60 - i * 3}h10l-1 3h-8z`} fill={P.charcoal} stroke={P.ink} strokeWidth=".3" />
        ))}
        {[50, 56, 62].map((x) => (
          <path key={x} d={`M${x} 64 q-1 -${6 + ((x + seed) % 3)} 1 -9`} stroke={P.leafMoss} strokeWidth="1" fill="none" />
        ))}
        <ellipse cx="18" cy="62" rx="4" ry="2" fill={P.woodLight} />
      </Svg>
    )
  }
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.soilDark} opacity=".55" />
      <path d="M14 60 Q40 56 66 60" stroke={P.soil} strokeWidth="3" fill="none" />
      {Array.from({ length: 5 }, (_, i) => (
        <path key={i} d={`M${18 + i * 10} 62l-2 -${7 + ((i + seed) % 3) * 2}M${18 + i * 10} 62l3 -${6 + ((i + seed) % 2) * 3}`} stroke={P.bark} strokeWidth=".7" />
      ))}
      <ellipse cx="60" cy="63" rx="4" ry="1.6" fill={P.leafMoss} />
    </Svg>
  )
}
