/** Hauptgarten-Bereich: beerenhecke. */
import { Bush, Jar, Shadow } from '../parts'
import { P, tone } from '../palette'
import { LEAF, LEAF_L, OUT, WOOD, WOOD_D } from './shared'

export function Beerenhecke({ t }: { t: number }) {
  const berries = [P.berry, tone('#3b1d4a'), tone('#f0e6c8')]
  return (
    <g>
      <Shadow rx={42} />
      {t >= 4 ? (
        <g>
          {/* raspberry canes */}
          {[22, 34, 46, 58, 70, 82].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 56 Q${x + 2} 30 ${x - 2} 16`} stroke={tone('#7a5a3a')} strokeWidth="1.6" fill="none" />
              <ellipse cx={x - 3} cy={26 + (i % 2) * 6} rx="3.6" ry="2" fill={LEAF} />
              <ellipse cx={x + 2} cy={36 - (i % 2) * 4} rx="3.6" ry="2" fill={LEAF_L} />
              <circle cx={x + 1} cy={30} r="1.8" fill={P.red} />
            </g>
          ))}
        </g>
      ) : null}
      {t >= 2 ? (
        <g>
          <rect x="14" y="40" width="2.6" height="34" fill={WOOD_D} />
          <rect x="84" y="40" width="2.6" height="34" fill={WOOD_D} />
          <path d="M15 46 H86 M15 56 H86" stroke={P.stoneDark} strokeWidth="0.9" />
        </g>
      ) : null}
      {t === 1 ? (
        <g>
          <Bush x={44} y={75} r={17} berry={berries[0]} />
          <Bush x={68} y={74} r={10} />
        </g>
      ) : null}
      {t === 2 ? (
        <g>
          <Bush x={33} y={74} r={15} berry={berries[0]} />
          <Bush x={67} y={74} r={15} berry={berries[1]} />
        </g>
      ) : null}
      {t >= 3 ? (
        <g>
          <Bush x={26} y={73} r={13} berry={berries[0]} />
          <Bush x={50} y={71} r={14} berry={berries[1]} />
          <Bush x={74} y={73} r={13} berry={berries[2]} />
        </g>
      ) : null}
      {t >= 4 ? (
        <g>
          {/* basket */}
          <path d="M84 68 h14 l-2 8 h-10 z" fill={P.woodLight} stroke={OUT} strokeWidth="1" />
          <path d="M85 68 q6 -8 12 0" fill="none" stroke={OUT} strokeWidth="1" />
          {[87, 91, 95].map((x) => (
            <circle key={x} cx={x} cy={67} r="1.8" fill={P.berry} />
          ))}
        </g>
      ) : null}
      {t >= 5 ? (
        <g>
          {/* jam table */}
          <rect x="0" y="66" width="18" height="3" fill={WOOD} stroke={OUT} strokeWidth="0.9" />
          <path d="M2 69 V77 M16 69 V77" stroke={WOOD_D} strokeWidth="1.6" />
          <Jar x={5} y={65} />
          <Jar x={13} y={65} />
        </g>
      ) : null}
    </g>
  )
}
