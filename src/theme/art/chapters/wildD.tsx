/** Kapitel-Grafik (Kapitel 18–23): gesperrte Ecken. */
import { Svg } from '../../HandParts'
import { P } from '../palette'

/**
 * Locked corners: driftwood and flotsam on the sand (Deich), a fallen alder in the reeds (Spreewald),
 * brambles over tumbled wall stones (Cottage), thistles and an old crate (Tulpen),
 * a rotten mooring post in the mud (Artischocken), a windthrown spruce (Beerenwald).
 */
export function WildD({ chapter, seed = 0 }: { chapter: string; seed?: number }) {
  if (chapter === 'deichgarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.paper} opacity=".8" />
        <path d={`M20 60l${22 + (seed % 3) * 2} -4`} stroke={P.stoneDark} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M30 58l-3 -4M38 57l2 -4" stroke={P.stoneDark} strokeWidth="1" />
        <ellipse cx="54" cy="62" rx="5" ry="1.6" fill={P.leafMoss} />
        <path d="M50 62q2 -2 4 0t4 0" stroke={P.winterLeafDark} strokeWidth=".8" fill="none" />
        {[16, 60].map((x) => (
          <path key={x} d={`M${x} 64q-1 -5 -3 -7M${x} 64q1 -5 3 -8`} stroke={P.winterLeaf} strokeWidth=".7" fill="none" />
        ))}
      </Svg>
    )
  }
  if (chapter === 'spreewald') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.soilDark} opacity=".55" />
        <ellipse cx="44" cy="62" rx="10" ry="2.4" fill={P.waterDeep} opacity=".6" />
        <path d="M14 58L58 52" stroke={P.charcoal} strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="14" cy="58" r="2" fill={P.woodLight} stroke={P.charcoal} strokeWidth=".5" />
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M${20 + i * 8} 64v-${8 + ((i + seed) % 3) * 3}`} stroke={P.leafMoss} strokeWidth=".9" />
        ))}
      </Svg>
    )
  }
  if (chapter === 'cottagegarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.leafMoss} opacity=".55" />
        {Array.from({ length: 4 }, (_, i) => (
          <rect key={i} x={20 + i * 9} y={56 - (i % 2) * 2} width="8" height="4" rx="1" fill={P.paper} stroke={P.outlineStone} strokeWidth=".4" transform={`rotate(${(i * 17) % 30 - 15} ${24 + i * 9} 58)`} />
        ))}
        <path d={`M16 62q8 -14 18 -6q8 -10 16 0q6 -8 ${12 + (seed % 3)} 4`} stroke={P.leafDark} strokeWidth="1.2" fill="none" />
        {[28, 44, 56].map((x) => (
          <circle key={x} cx={x} cy={52} r=".9" fill={P.plum} />
        ))}
      </Svg>
    )
  }
  if (chapter === 'tulpenfelder') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.paper} opacity=".7" />
        <path d="M44 62h12l-1 -6h-10z" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".4" transform="rotate(-12 50 60)" />
        {Array.from({ length: 5 }, (_, i) => (
          <g key={i}>
            <path d={`M${18 + i * 6} 64v-${6 + ((i + seed) % 3) * 2}`} stroke={P.leafMoss} strokeWidth=".8" />
            <circle cx={18 + i * 6} cy={57 - ((i + seed) % 3) * 2} r="1.2" fill={P.lavender} />
          </g>
        ))}
      </Svg>
    )
  }
  if (chapter === 'artischocken') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.soil} opacity=".5" />
        <ellipse cx="50" cy="62" rx="9" ry="2" fill={P.water} opacity=".6" />
        <path d="M30 64l4 -18" stroke={P.woodDark} strokeWidth="2" />
        <path d="M33 50l-2 -1" stroke={P.metal} strokeWidth=".8" />
        {[18, 44, 58].map((x, i) => (
          <path key={x} d={`M${x} 64l-3 -${5 + ((i + seed) % 2) * 2}M${x} 64l0 -${7 + ((i + seed) % 3)}M${x} 64l3 -5`} stroke={P.winterLeaf} strokeWidth=".8" />
        ))}
      </Svg>
    )
  }
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.leafMoss} opacity=".6" />
      <path d="M24 60L62 50" stroke={P.bark} strokeWidth="2.6" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${34 + i * 7} ${57 - i * 2}l-2 -4M${34 + i * 7} ${57 - i * 2}l2 3`} stroke={P.leafDark} strokeWidth=".8" />
      ))}
      <ellipse cx="22" cy="58" rx="4" ry={5 + (seed % 2)} fill={P.soilDark} />
      <ellipse cx="58" cy="63" rx="5" ry="2.4" fill={P.stone} stroke={P.outlineStone} strokeWidth=".4" />
      <ellipse cx="57" cy="61.6" rx="3" ry="1" fill={P.leafMoss} />
    </Svg>
  )
}
