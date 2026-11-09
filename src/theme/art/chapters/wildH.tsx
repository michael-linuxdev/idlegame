/** Kapitel-Grafik (Kapitel 40–44): gesperrte Ecken. */
import { Svg } from '../../HandParts'
import { P } from '../palette'

/**
 * Locked corners: bare roof gravel with a puddle and a broken pallet (Dach),
 * cracked asphalt with weeds and a lost ball (Schule), a bare field with thistles
 * and stones (Waldgarten), nettles round a cracked flowerpot (Samenbank),
 * wasteland rubble with tall ruderal grass (Klimagarten).
 */
export function WildH({ chapter, seed = 0 }: { chapter: string; seed?: number }) {
  if (chapter === 'dachgarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.stoneLight} stroke={P.stone} strokeWidth=".4" />
        <ellipse cx="32" cy="61" rx="6" ry="1.6" fill={P.waterLight} opacity=".8" />
        <path d="M46 62l12 -3M47 59.6l12 -3M48 57.2l10 -2.4" stroke={P.woodMid} strokeWidth="1.2" />
        {[20, 62].map((x, i) => (
          <path key={x} d={`M${x} 62l-2 -${3 + ((i + seed) % 2)}M${x} 62v-4M${x} 62l2 -3`} stroke={P.leaf} strokeWidth=".7" />
        ))}
        <circle cx="62" cy="57.6" r=".9" fill={P.yellow} />
      </Svg>
    )
  }
  if (chapter === 'schulgarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.stone} />
        <path d="M18 58l8 2l6 -1l10 3l8 -2" stroke={P.charcoal} strokeWidth=".5" fill="none" />
        {[24, 34, 48].map((x, i) => (
          <path key={x} d={`M${x} 61l-2 -${4 + ((i + seed) % 3)}M${x} 61v-5M${x} 61l2 -4`} stroke={P.leafDark} strokeWidth=".7" />
        ))}
        <circle cx="58" cy="60" r="2.4" fill={P.blue} stroke={P.denim} strokeWidth=".3" />
        <path d="M55.8 60h4.4M58 57.8v4.4" stroke={P.yellow} strokeWidth=".5" />
      </Svg>
    )
  }
  if (chapter === 'waldgarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.soil} opacity=".85" />
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M16 ${58 + k * 2}h48`} stroke={P.soilDark} strokeWidth=".5" />
        ))}
        {[26, 50].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 62v-${8 + ((i + seed) % 2)}M${x} 58l-2 -1.4M${x} 57l2 -1.4`} stroke={P.leafMoss} strokeWidth=".7" />
            <circle cx={x} cy={53.4 - ((i + seed) % 2)} r="1.2" fill={P.lilac} />
          </g>
        ))}
        <ellipse cx="38" cy="61" rx="2.4" ry="1.4" fill={P.stone} />
        <ellipse cx="60" cy="60" rx="1.6" ry="1" fill={P.stoneDark} />
      </Svg>
    )
  }
  if (chapter === 'samenbank') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.leafMoss} opacity=".75" />
        {[20, 26, 32, 52, 58].map((x, i) => (
          <path key={x} d={`M${x} 62v-${7 + ((i + seed) % 3)}M${x} 58l-2.4 -1M${x} 58l2.4 -1M${x} 60l-2 -.8M${x} 60l2 -.8`} stroke={P.leafDark} strokeWidth=".7" />
        ))}
        <path d="M38 62l-1.4 -5h8l-1.4 5z" fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".3" />
        <path d="M40 57l1 2.4l-1 2" stroke={P.soilDark} strokeWidth=".4" fill="none" />
      </Svg>
    )
  }
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.woodLight} opacity=".85" />
      {[[30, 60], [36, 61.4], [48, 59.6]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="4" height="2.4" fill={i % 2 ? P.terracotta : P.stoneLight} stroke={P.stoneDark} strokeWidth=".3" transform={`rotate(${i * 20 - 10} ${x} ${y})`} />
      ))}
      {[18, 24, 56, 62].map((x, i) => (
        <path key={x} d={`M${x} 62q-1 -5 -3 -${8 + ((i + seed) % 3)}M${x} 62q1 -5 3 -8`} stroke={i % 2 ? P.gold : P.winterLeaf} strokeWidth=".7" fill="none" />
      ))}
    </Svg>
  )
}
