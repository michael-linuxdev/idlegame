/** Kapitel-Grafik (Kapitel 35–39): gesperrte Ecken. */
import { Svg } from '../../HandParts'
import { P } from '../palette'

/**
 * Locked corners: a sand drift over a buried channel with dead palm fronds (Oase),
 * overgrown bush with a fallen cocoa pod (Ghana), spinifex and a red rock (Australien),
 * bracken under a fallen ponga trunk (Neuseeland), weedy stubble with a cracked jar (Korea).
 */
export function WildG({ chapter, seed = 0 }: { chapter: string; seed?: number }) {
  if (chapter === 'oase') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.woodLight} />
        <path d="M18 60q10 -6 22 -2q10 3 22 -1" stroke={P.wood} strokeWidth="1" fill="none" />
        {[22, 40, 54].map((x, i) => (
          <path key={x} d={`M${x} 62q${6 + ((i + seed) % 3)} -6 ${12} -4`} stroke={P.woodMid} strokeWidth="1.2" fill="none" strokeDasharray="1 .6" />
        ))}
        <ellipse cx="30" cy="58" rx="2.4" ry="1" fill={P.soilDark} />
      </Svg>
    )
  }
  if (chapter === 'kakaogarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.soil} opacity=".7" />
        {[24, 36, 50, 58].map((x, i) => (
          <ellipse key={x} cx={x} cy={57 - (i % 2) * 2} rx={6 + ((i + seed) % 2)} ry="4" fill={i % 2 ? P.leafDark : P.leafMoss} />
        ))}
        <ellipse cx="44" cy="62" rx="2.6" ry="1.3" fill={P.autumnDark} stroke={P.outline} strokeWidth=".3" transform="rotate(-20 44 62)" />
      </Svg>
    )
  }
  if (chapter === 'buschgarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.terracotta} opacity=".75" />
        <ellipse cx="50" cy="58" rx="6" ry="3.4" fill={P.terracottaLight} stroke={P.autumnDark} strokeWidth=".4" />
        {[20, 28, 36, 62].map((x, i) => (
          <path key={x} d={`M${x} 63l-3 -${5 + ((i + seed) % 3)}M${x} 63l0 -6M${x} 63l3 -5`} stroke={P.gold} strokeWidth=".7" />
        ))}
      </Svg>
    )
  }
  if (chapter === 'farngarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.leafMoss} opacity=".8" />
        <path d="M16 62L60 55" stroke={P.bark} strokeWidth="3.4" strokeLinecap="round" />
        {[22, 34, 46, 56].map((x, i) => (
          <path key={x} d={`M${x} 62q-4 -6 -8 -7M${x} 62q3 -7 ${7 + ((i + seed) % 3)} -8`} stroke={i % 2 ? P.leafDark : P.leaf} strokeWidth="1.2" fill="none" />
        ))}
      </Svg>
    )
  }
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.woodMid} opacity=".7" />
      <path d="M48 62q-3.4 -3.4 -1.6 -6.4h6.4q1.8 3 -1.6 6.4z" fill={P.soilDark} stroke={P.ink} strokeWidth=".3" />
      <path d="M50 56l1 3l-1 2" stroke={P.cream} strokeWidth=".4" fill="none" />
      {[18, 26, 34, 62].map((x, i) => (
        <path key={x} d={`M${x} 63V${56 - ((i + seed) % 3)}M${x} 60l-2 -2M${x} 59l2 -2`} stroke={P.woodLight} strokeWidth=".7" />
      ))}
    </Svg>
  )
}
