/** Kapitel-Grafik (Lavendel, Japangarten, Gartenschau): wildB. */
import { Svg } from '../../HandParts'
import { P } from '../palette'

/** Locked corners: dry scrub + stones (Lavendel), unraked gravel + fallen bamboo (Japan), building site (Gartenschau). */
export function WildB({ chapter, seed = 0 }: { chapter: string; seed?: number }) {
  if (chapter === 'lavendel') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill="#b8a46a" opacity=".6" />
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse key={i} cx={14 + i * 10} cy={60 - (i % 2) * 2} rx={4 + ((i + seed) % 3)} ry="3" fill={i % 2 ? '#8a8a5a' : '#9a9a6a'} />
        ))}
        <ellipse cx="30" cy="62" rx="3" ry="1.6" fill="#bdb3a0" />
        <ellipse cx="52" cy="63" rx="2.4" ry="1.4" fill="#bdb3a0" />
        <path d="M44 58 l6 -8 M48 58 l-2 -9" stroke="#8a7a5a" strokeWidth="1" />
      </Svg>
    )
  }
  if (chapter === 'japangarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill="#d4ccb4" opacity=".8" />
        <path d="M18 62 L60 50 M24 64 L58 56" stroke="#9a9a5a" strokeWidth="2" strokeLinecap="round" />
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M${16 + i * 9} 62q${i % 2 ? 2 : -2} -${8 + ((i + seed) % 3) * 3} ${i % 2 ? 4 : -2} -${12 + ((i + seed) % 3) * 3}`} stroke="#7a9a4a" strokeWidth="1.2" fill="none" />
        ))}
        <ellipse cx="56" cy="62" rx="5" ry="2.4" fill="#9a9a8a" />
      </Svg>
    )
  }
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="28" ry="7" fill="#a5895a" opacity=".6" />
      <path d="M14 64 L22 50 M30 64 L22 50" stroke={P.orange} strokeWidth="1.6" />
      <path d="M17 58h10" stroke={P.cream} strokeWidth="1.6" />
      <rect x="40" y="54" width="14" height="8" fill={P.woodLight} stroke={P.outlineSoft} strokeWidth=".6" />
      <path d="M40 58h14" stroke={P.outlineSoft} strokeWidth=".5" />
      <ellipse cx="62" cy="62" rx="6" ry="3" fill={P.outlineSoft} />
      {[56, 60, 66].map((x) => (
        <path key={x} d={`M${x} 62 q1 -${4 + ((x + seed) % 3)} 2 -6`} stroke="#6d9a3f" strokeWidth="1" fill="none" />
      ))}
    </Svg>
  )
}
