/** Kapitel-Grafik (Kräuter, Botanik, Alm): wildA. */
import { Svg } from '../../HandParts'
import { P } from '../palette'

/** Locked corners: weeds + broken pots (Kräuter), toppled glass frames (Botanik), scree + dwarf pine (Alm). */
export function WildA({ chapter, seed = 0 }: { chapter: string; seed?: number }) {
  if (chapter === 'kraeuter') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.leaf} opacity=".55" />
        <path d="M24 60l3-6h7l-1 6z" fill="#c4683a" transform="rotate(-24 28 58)" />
        <path d="M46 62l4-3 2 3z" fill="#c4683a" />
        {Array.from({ length: 7 }, (_, i) => (
          <g key={i}>
            <path d={`M${14 + i * 8} 62q${i % 2 ? 2 : -2} -${8 + ((i + seed) % 3) * 4} ${i % 2 ? 4 : -2} -${12 + ((i + seed) % 4) * 3}`} stroke="#6f8a3a" strokeWidth="1.3" fill="none" />
            {i % 3 === 0 ? <circle cx={14 + i * 8 + (i % 2 ? 4 : -2)} cy={50 - ((i + seed) % 4) * 3} r="1.4" fill="#e8e0a0" /> : null}
          </g>
        ))}
        <ellipse cx="58" cy="58" rx="8" ry="5" fill="#5f7a3a" />
      </Svg>
    )
  }
  if (chapter === 'botanik') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.leaf} opacity=".5" />
        <path d="M18 62 L28 46 L44 50 L36 64z" fill="#cfe8f4" opacity=".55" stroke="#9ab0bc" strokeWidth=".8" />
        <path d="M28 46 L36 64 M23 54 L40 57" stroke="#9ab0bc" strokeWidth=".6" />
        {Array.from({ length: 5 }, (_, i) => (
          <path key={i} d={`M${46 + i * 5} 62q-2 -${10 + ((i + seed) % 3) * 3} 4 -${14 + ((i + seed) % 3) * 3}`} stroke="#4f8a3a" strokeWidth="1.6" fill="none" />
        ))}
        <ellipse cx="22" cy="62" rx="7" ry="3.6" fill="#6d9a3f" />
      </Svg>
    )
  }
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="30" ry="7" fill="#9a9a8a" opacity=".55" />
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx={14 + ((i * 11 + seed * 3) % 52)} cy={58 + (i % 3) * 2} rx={2.6 + (i % 3)} ry={1.8 + (i % 2)} fill={i % 2 ? P.stone : '#8a7e6e'} />
      ))}
      <ellipse cx="54" cy="54" rx="10" ry="5" fill="#3f6a3a" />
      <ellipse cx="50" cy="51" rx="5" ry="3" fill="#4f7a3a" />
      <path d="M20 58 L30 50" stroke="#8a7a6a" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}
