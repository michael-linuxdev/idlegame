/** Hauptgarten-Bereich: hofladen. */
import { Crate, Flower, Shadow } from '../parts'
import { P } from '../palette'
import { OUT, WOOD, WOOD_D } from './shared'

export function Hofladen({ t }: { t: number }) {
  const produce = [P.red, P.orange, P.leafLight, P.yellow, P.plum]
  if (t === 1) {
    return (
      <g>
        <Shadow rx={42} />
        <Crate x={27} y={67} fruit={produce[0]} />
        <Crate x={47} y={69} fruit={produce[1]} />
        <Crate x={37} y={57} fruit={produce[2]} />
        <rect x="68" y="40" width="2.4" height="32" fill={WOOD_D} />
        <rect x="62" y="40" width="22" height="12" rx="1.5" fill={P.canvas} stroke={OUT} strokeWidth="1.2" />
        <path d="M65 46 H81" stroke={P.soil} strokeWidth="1.6" strokeDasharray="3 2" />
        {/* honesty box */}
        <rect x="64" y="62" width="10" height="9" rx="1" fill={P.metal} stroke={OUT} strokeWidth="1" />
        <rect x="66.5" y="64" width="5" height="1.2" fill={OUT} />
      </g>
    )
  }
  const stallW = t === 2 ? 56 : 72
  const x = 50 - stallW / 2
  return (
    <g>
      <Shadow rx={stallW / 2 + 8} />
      {t >= 4 ? (
        <g>
          {/* shop hut behind the stall */}
          <rect x={x + 6} y="22" width={stallW - 12} height="34" fill={t >= 5 ? P.paper : WOOD} stroke={OUT} strokeWidth="1.4" />
          <path d={`M${x} 24 L50 6 L${x + stallW} 24 Z`} fill={P.roof} stroke={OUT} strokeWidth="1.4" strokeLinejoin="round" />
          <rect x="44" y="34" width="12" height="22" fill="#7d9f5a" stroke={OUT} strokeWidth="1.2" />
          {t >= 5 ? (
            <g>
              <rect x="34" y="12" width="32" height="9" rx="1.5" fill="#3d5a2e" stroke={OUT} strokeWidth="1" />
              <path d="M38 16.5 H62" stroke={P.canvas} strokeWidth="1.8" strokeDasharray="4 1.5" />
              {/* lanterns */}
              <circle cx={x + 10} cy="30" r="2.4" fill={P.lamp} stroke={OUT} strokeWidth="0.8" className="garden-bulb" />
              <circle cx={x + stallW - 10} cy="30" r="2.4" fill={P.lamp} stroke={OUT} strokeWidth="0.8" className="garden-bulb" />
            </g>
          ) : null}
        </g>
      ) : null}
      {/* stall posts + awning */}
      <rect x={x + 2} y="36" width="3" height="36" fill={WOOD_D} />
      <rect x={x + stallW - 5} y="36" width="3" height="36" fill={WOOD_D} />
      <path d={`M${x - 3} 40 L${x + 4} 30 L${x + stallW - 4} 30 L${x + stallW + 3} 40 Z`} fill={P.white} stroke={OUT} strokeWidth="1.3" strokeLinejoin="round" />
      {Array.from({ length: Math.floor(stallW / 8) }, (_, i) => (
        <path
          key={i}
          d={`M${x + 4 + i * 8} 30 L${x + 1 + i * 8.6} 40 L${x + 6 + i * 8.6} 40 L${x + 8 + i * 8} 30 Z`}
          fill={P.barn}
        />
      ))}
      {Array.from({ length: Math.floor(stallW / 8) + 1 }, (_, i) => (
        <path key={i} d={`M${x - 3 + i * 8.4} 40 q2.1 3 4.2 0`} fill={P.barn} stroke={OUT} strokeWidth="0.8" />
      ))}
      {/* counter with produce */}
      <rect x={x} y="56" width={stallW} height="16" rx="1.5" fill={WOOD} stroke={OUT} strokeWidth="1.3" />
      <path d={`M${x} 64 H${x + stallW}`} stroke={WOOD_D} strokeWidth="1" />
      {Array.from({ length: Math.floor(stallW / 18) }, (_, i) => (
        <Crate key={i} x={x + 3 + i * 18 + 9} y={57} fruit={produce[i % produce.length]} />
      ))}
      {t >= 3 ? (
        <g>
          {/* chalkboard */}
          <path d="M86 74 L90 52 L98 52 L102 74" fill="none" stroke={WOOD_D} strokeWidth="1.6" />
          <rect x="88" y="52" width="12" height="14" fill="#2f3b2f" stroke={WOOD_D} strokeWidth="1.2" />
          <path d="M90 56 H98 M90 60 H96" stroke={P.cream} strokeWidth="1" />
        </g>
      ) : null}
      {t >= 4 ? (
        <g>
          {/* flower buckets */}
          <rect x="2" y="64" width="8" height="9" fill={P.metal} stroke={OUT} strokeWidth="0.9" />
          <Flower x={4} y={66.4} c={P.pink} />
          <Flower x={8.5} y={64.4} c={P.yellow} />
        </g>
      ) : null}
    </g>
  )
}
