/** Hauptgarten-Bereich: huehnerstall. */
import { Hen, Shadow, SnowCap, useSeason } from '../parts'
import { P, tone } from '../palette'
import { OUT, WOOD, WOOD_D } from './shared'

export function Huehnerstall({ t }: { t: number }) {
  const winter = useSeason() === 'winter'
  return (
    <g>
      <Shadow rx={44} />
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 1 }}>
          {/* run fence */}
          <path d="M6 76 L6 52 L94 52 L94 76" fill="none" stroke={tone('#c9b48a')} strokeWidth="1.4" />
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={`M${6 + i * 8} 52 V76`} stroke={tone('#d9c79f')} strokeWidth="1" />
          ))}
        </g>
      ) : null}
      {t <= 2 ? (
        <g>
          {/* A-frame coop */}
          <path d="M30 70 L50 34 L70 70 Z" fill={WOOD} stroke={OUT} strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M26 72 L50 30 L74 72" fill="none" stroke={P.roof} strokeWidth="4" strokeLinejoin="round" />
          {winter ? <SnowCap d="M36 50 L50 31 L64 50" w={3.2} /> : null}
          <path d="M45 70 V58 Q50 52 55 58 V70 Z" fill={OUT} />
        </g>
      ) : (
        <g>
          {/* coop house on stilts */}
          <rect x="28" y="56" width="3" height="16" fill={WOOD_D} />
          <rect x="65" y="56" width="3" height="16" fill={WOOD_D} />
          <rect x="24" y="34" width="48" height="24" rx="1.5" fill={t >= 5 ? P.barn : WOOD} stroke={OUT} strokeWidth="1.4" />
          {t >= 5 ? (
            <path d="M24 40 H72 M24 46 H72 M24 52 H72" stroke={tone('#b8433f')} strokeWidth="1" />
          ) : null}
          <path d="M18 36 L48 18 L78 36 Z" fill={P.metal} stroke={OUT} strokeWidth="1.4" strokeLinejoin="round" />
          {winter ? <SnowCap d="M20 34 L48 17 L76 34" w={3.4} /> : null}
          {winter ? <SnowCap d="M20 34 L48 17 L76 34" w={3.4} /> : null}
          <path d="M40 58 V46 Q44 42 48 46 V58 Z" fill={OUT} />
          <rect x="56" y="42" width="10" height="8" fill={P.window} stroke={OUT} strokeWidth="1" className="art-window" />
          {/* ramp */}
          <path d="M40 58 L30 74 L36 74 L46 58" fill={WOOD} stroke={OUT} strokeWidth="1" />
          {t >= 5 ? (
            <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 2 }}>
              {/* weathervane */}
              <path d="M48 18 V8" stroke={OUT} strokeWidth="1.2" />
              <path d="M44 9 q4 -5 8 0 l-2 2 h-4 z" fill={P.brass} stroke={OUT} strokeWidth="0.8" />
            </g>
          ) : null}
        </g>
      )}
      {t >= 2 ? <g className={t === 2 ? 't-new' : undefined} style={{ ["--i" as string]: 0 }}><Hen x={16} y={71} /></g> : null}
      {t >= 3 ? <g className={t === 3 ? 't-new' : undefined} style={{ ["--i" as string]: 1 }}><Hen x={82} y={73} flip c={tone('#c9763a')} /></g> : null}
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 3 }}>
          {/* rooster */}
          <Hen x={64} y={71} c={tone('#8a4a2a')} />
          <path d="M57 62 q-6 -6 -4 -12 q2 6 6 6" fill={tone('#2f5e3a')} />
        </g>
      ) : null}
      {t >= 5 ? (
        <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 4 }}>
          <Hen x={10} y={65} c={P.charcoal} flip />
          <path d="M84 56 h12 l-2 7 h-8 z" fill={P.woodLight} stroke={OUT} strokeWidth="1" />
          {[86.5, 90, 93.5].map((x) => (
            <ellipse key={x} cx={x} cy={55} rx="1.8" ry="2.3" fill={tone('#f7efe0')} stroke={OUT} strokeWidth="0.5" />
          ))}
        </g>
      ) : null}
      {t === 3 ? (
        <g className="t-new" style={{ ["--i" as string]: 5 }}>
          <ellipse cx="86" cy="58" rx="1.8" ry="2.3" fill={tone('#f7efe0')} stroke={OUT} strokeWidth="0.5" />
          <ellipse cx="90" cy="59" rx="1.8" ry="2.3" fill={tone('#f7efe0')} stroke={OUT} strokeWidth="0.5" />
        </g>
      ) : null}
    </g>
  )
}
