/** Kapitel-Grafik (Kapitel 24–29): gesperrte Ecken. */
import { Svg } from '../../HandParts'
import { P } from '../palette'

/**
 * Locked corners: cracked tiles and a dry pot (Patio), rockrose scrub over a fallen cork log (Korkeichen),
 * thistles and a broken cart wheel (Paprika), tumbled stones in bracken (Aran),
 * a wild briar over rocks (Rosental), a slumped terrace wall in thyme scrub (Pistazien).
 */
export function WildE({ chapter, seed = 0 }: { chapter: string; seed?: number }) {
  if (chapter === 'patio') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.stoneLight} opacity=".8" />
        <path d={`M24 58l8 3l6 -2l${6 + (seed % 3)} 4M44 56l4 6`} stroke={P.stoneDark} strokeWidth=".6" fill="none" />
        <path d="M50 62l3 -7h7l2 7z" fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".4" transform="rotate(-24 56 60)" />
        <path d="M54 55l2 -3M57 55l-1 -3" stroke={P.woodMid} strokeWidth=".6" />
        {[18, 30, 40].map((x, i) => (
          <path key={x} d={`M${x} 63l-2 -${4 + ((i + seed) % 3)}M${x} 63l1 -5M${x} 63l3 -3`} stroke={P.leafMoss} strokeWidth=".7" />
        ))}
      </Svg>
    )
  }
  if (chapter === 'korkeichen') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.paper} opacity=".8" />
        <path d="M18 60L54 56" stroke={P.bark} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M24 58.6l8 -.8M38 57.6l8 -.8" stroke={P.woodMid} strokeWidth=".8" />
        {[30, 46, 58].map((x, i) => (
          <g key={x}>
            <ellipse cx={x} cy={58 - (i % 2) * 2} rx={5 + ((i + seed) % 2)} ry="3.4" fill={P.leafMoss} />
            <circle cx={x - 1} cy={56 - (i % 2) * 2} r="1" fill={P.white} />
          </g>
        ))}
      </Svg>
    )
  }
  if (chapter === 'paprikafelder') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.soil} opacity=".5" />
        <circle cx="52" cy="58" r="6" fill="none" stroke={P.woodDark} strokeWidth="1" transform="rotate(-10 52 58)" />
        <path d="M52 52v12M46 58h12M48 54l8 8" stroke={P.woodMid} strokeWidth=".6" />
        {Array.from({ length: 5 }, (_, i) => (
          <g key={i}>
            <path d={`M${18 + i * 6} 64v-${7 + ((i + seed) % 3) * 2}`} stroke={P.winterLeafDark} strokeWidth=".8" />
            <circle cx={18 + i * 6} cy={56 - ((i + seed) % 3) * 2} r="1.3" fill={P.lilac} />
          </g>
        ))}
      </Svg>
    )
  }
  if (chapter === 'aranfelder') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.stoneLight} opacity=".8" />
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse key={i} cx={24 + i * 6} cy={60 - (i % 2) * 2} rx="3" ry="2" fill={i % 2 ? P.stone : P.stoneLight} stroke={P.outlineStone} strokeWidth=".3" />
        ))}
        {[18, 56, 62].map((x, i) => (
          <path key={x} d={`M${x} 64q-2 -6 -5 -7M${x} 64q1 -6 4 -${8 + ((i + seed) % 2) * 2}`} stroke={P.autumn} strokeWidth=".8" fill="none" />
        ))}
      </Svg>
    )
  }
  if (chapter === 'rosental') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.leafMoss} opacity=".55" />
        <ellipse cx="54" cy="61" rx="6" ry="3" fill={P.stone} stroke={P.outlineStone} strokeWidth=".4" />
        <path d={`M18 62q6 -14 14 -4q6 -10 12 -2q6 -8 ${10 + (seed % 3)} 2`} stroke={P.leafDark} strokeWidth="1.2" fill="none" />
        {[24, 36, 48].map((x) => (
          <circle key={x} cx={x} cy={54} r="1.1" fill={P.blossom} />
        ))}
      </Svg>
    )
  }
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.paper} opacity=".8" />
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse key={i} cx={22 + i * 7} cy={58 + (i % 2) * 3} rx="3.2" ry="2.2" fill={P.paper} stroke={P.outlineStone} strokeWidth=".35" transform={`rotate(${(i * 23) % 40 - 20} ${22 + i * 7} 58)`} />
      ))}
      {[16, 58, 64].map((x, i) => (
        <g key={x}>
          <ellipse cx={x} cy={62} rx="3" ry="2" fill={P.winterLeafDark} />
          <circle cx={x} cy={60.6} r=".6" fill={(i + seed) % 2 ? P.lilac : P.lavender} />
        </g>
      ))}
    </Svg>
  )
}
