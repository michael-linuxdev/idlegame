/** Kapitel-Grafik (Kapitel 30–34): gesperrte Ecken. */
import { Svg } from '../../HandParts'
import { P } from '../palette'

/**
 * Locked corners: a tumbled terrace wall in ichu grass (Anden), dry stalks and a stone (Milpa),
 * tangled undergrowth under a fallen branch (Kaffeewald), a silted, weedy paddy corner (Bali),
 * a strangling creeper over laterite stones (Kerala).
 */
export function WildF({ chapter, seed = 0 }: { chapter: string; seed?: number }) {
  if (chapter === 'andenkartoffeln') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.woodLight} opacity=".8" />
        {Array.from({ length: 5 }, (_, i) => (
          <ellipse key={i} cx={24 + i * 7} cy={60 - (i % 2) * 2} rx="3.2" ry="2.2" fill={i % 2 ? P.stone : P.stoneDark} stroke={P.outlineStone} strokeWidth=".3" />
        ))}
        {[16, 58, 64].map((x, i) => (
          <path key={x} d={`M${x} 64l-2 -${6 + ((i + seed) % 3)}M${x} 64l0 -7M${x} 64l2 -6`} stroke={P.gold} strokeWidth=".7" />
        ))}
      </Svg>
    )
  }
  if (chapter === 'milpa') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.woodLight} opacity=".75" />
        <ellipse cx="54" cy="60" rx="5" ry="2.6" fill={P.stone} stroke={P.outlineStone} strokeWidth=".4" />
        {Array.from({ length: 5 }, (_, i) => (
          <path key={i} d={`M${20 + i * 6} 63V${52 - ((i + seed) % 3) * 2}l3 3`} stroke={P.woodMid} strokeWidth=".8" fill="none" />
        ))}
      </Svg>
    )
  }
  if (chapter === 'kaffeewald') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.soil} opacity=".6" />
        <path d="M18 62L58 54" stroke={P.bark} strokeWidth="3" strokeLinecap="round" />
        {[26, 40, 54].map((x, i) => (
          <ellipse key={x} cx={x} cy={58 - (i % 2) * 2} rx={6 + ((i + seed) % 2)} ry="3.6" fill={i % 2 ? P.leafMoss : P.leafDark} />
        ))}
      </Svg>
    )
  }
  if (chapter === 'reisterrassen') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.woodMid} opacity=".75" />
        <ellipse cx="34" cy="60" rx="10" ry="3" fill={P.water} opacity=".6" />
        {[20, 30, 44, 52, 58].map((x, i) => (
          <path key={x} d={`M${x} 63q-1 -5 -3 -7M${x} 63q1 -5 3 -${7 + ((i + seed) % 3)}`} stroke={P.leafMoss} strokeWidth=".8" fill="none" />
        ))}
      </Svg>
    )
  }
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.terracotta} opacity=".6" />
      {[26, 36, 48].map((x, i) => (
        <rect key={x} x={x - 4} y={56 + (i % 2)} width="8" height="5" rx="1" fill={P.terracottaLight} stroke={P.autumnDark} strokeWidth=".3" />
      ))}
      <path d={`M16 62q8 -14 16 -4q8 -10 14 -2q6 -8 ${12 + (seed % 3)} 2`} stroke={P.leafDark} strokeWidth="1.2" fill="none" />
      {[22, 34, 46, 56].map((x) => (
        <ellipse key={x} cx={x} cy={54} rx="1.6" ry="1" fill={P.leaf} />
      ))}
    </Svg>
  )
}
