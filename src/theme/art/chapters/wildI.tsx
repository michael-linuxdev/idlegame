/** Kapitel-Grafik (Kapitel 45–50): gesperrte Ecken. */
import { Svg } from '../../HandParts'
import { P } from '../palette'

/**
 * Locked corners: a mown-bare verge with a thistle (Wildblumenband), a grey wall
 * foot with a crack and a dandelion (Fassade), a fallow strip with stones and
 * couch grass (Solawi), trampled grass with a lost packet (Saatguttausch), a
 * construction patch with a cone and a fence foot (Weltgartenschau), brambles
 * and nettles over good soil, as on Omas plot at the very start (Omas Schrebergarten).
 */
export function WildI({ chapter, seed = 0 }: { chapter: string; seed?: number }) {
  if (chapter === 'wildblumenband') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.woodLight} opacity=".85" />
        {[0, 1, 2, 3].map((k) => (
          <path key={k} d={`M${18 + k * 12} 61l-1 -2M${20 + k * 12} 61v-2M${22 + k * 12} 61l1 -2`} stroke={P.gold} strokeWidth=".6" />
        ))}
        <path d={`M54 62v-${8 + (seed % 2)}M54 58l-2.4 -1.4M54 57l2.4 -1.4`} stroke={P.winterLeaf} strokeWidth=".8" />
        <circle cx="54" cy={53.4 - (seed % 2)} r="1.4" fill={P.lilac} />
        <ellipse cx="30" cy="62" rx="2" ry="1.1" fill={P.stone} />
      </Svg>
    )
  }
  if (chapter === 'fassadengarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.stoneLight} stroke={P.stone} strokeWidth=".4" />
        <path d="M22 59l6 1.6l4 -1l8 2l6 -1.6" stroke={P.stoneDark} strokeWidth=".5" fill="none" />
        {[30, 50].map((x, i) => (
          <path key={x} d={`M${x} 61l-1.6 -${3 + ((i + seed) % 2)}M${x} 61v-4M${x} 61l1.6 -3`} stroke={P.leaf} strokeWidth=".7" />
        ))}
        <circle cx="50" cy="56.4" r="1.2" fill={P.yellow} />
        <rect x="58" y="58" width="4" height="3" fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".3" />
      </Svg>
    )
  }
  if (chapter === 'solawihof') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.soil} opacity=".85" />
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M16 ${58 + k * 2}h48`} stroke={P.soilDark} strokeWidth=".5" />
        ))}
        {[24, 46, 58].map((x, i) => (
          <path key={x} d={`M${x} 61q-1 -4 -3 -${5 + ((i + seed) % 3)}M${x} 61q1 -4 3 -5`} stroke={P.leafMoss} strokeWidth=".7" fill="none" />
        ))}
        <ellipse cx="36" cy="61" rx="2.4" ry="1.4" fill={P.stone} />
      </Svg>
    )
  }
  if (chapter === 'saatguttausch') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.leafMoss} opacity=".75" />
        {[20, 28, 52, 60].map((x, i) => (
          <path key={x} d={`M${x} 61l-1.4 -${3 + ((i + seed) % 2)}M${x} 61l1.4 -3`} stroke={P.woodLight} strokeWidth=".7" />
        ))}
        <path d="M38 61v-3.6l.4 -.4h2l.4 .4v3.6z" fill={P.paper} stroke={P.outlineSoft} strokeWidth=".2" transform="rotate(-20 39 59)" />
        <ellipse cx="46" cy="61.4" rx="2" ry=".8" fill={P.soilDark} opacity=".5" />
      </Svg>
    )
  }
  if (chapter === 'omasgarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.soil} opacity=".8" />
        {[22, 38, 54].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 61q3 -${8 + ((i + seed) % 3)} 9 -7q3 1 3 5`} stroke={P.plum} strokeWidth=".8" fill="none" />
            <ellipse cx={x + 5} cy={54.4 - ((i + seed) % 2)} rx="2.6" ry="1.6" fill={P.leafDark} />
            <circle cx={x + 8} cy="56" r=".8" fill={P.ink} />
          </g>
        ))}
        <path d="M30 62v-6M28.6 58.4l1.4 -1M31.4 58.4l-1.4 -1" stroke={P.leafMoss} strokeWidth=".7" />
      </Svg>
    )
  }
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.woodLight} opacity=".85" />
      <path d="M36 61l3 -8l3 8z" fill={P.orange} stroke={P.outlineWood} strokeWidth=".3" />
      <path d="M37.4 57.4h3.2" stroke={P.white} strokeWidth=".8" />
      <path d="M18 62v-6M26 62v-6M18 57h8" stroke={P.metal} strokeWidth=".6" />
      {[52, 60].map((x, i) => (
        <path key={x} d={`M${x} 61q-1 -4 -2 -${5 + ((i + seed) % 2)}M${x} 61q1 -4 2 -5`} stroke={P.leaf} strokeWidth=".7" fill="none" />
      ))}
    </Svg>
  )
}
