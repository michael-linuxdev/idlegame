/** Hauptgarten-Bereich: orangerie. */
import { CitrusPot, Shadow, SnowCap, useSeason } from '../parts'
import { P, tone } from '../palette'
import { Glass, OUT } from './shared'

export function Orangerie({ t }: { t: number }) {
  const winter = useSeason() === 'winter'
  if (t === 1) {
    return (
      <g>
        <Shadow rx={30} />
        <CitrusPot x={46} y={78.4} s={2.1} />
        <CitrusPot x={74} y={76.4} s={1.1} fruit={P.amber} />
      </g>
    )
  }
  if (t === 2) {
    return (
      <g>
        <Shadow rx={42} />
        {/* iron frame */}
        <path d="M22 72 V42 Q50 16 78 42 V72" fill={P.glassWarm} fillOpacity="0.35" stroke={tone('#4a5a52')} strokeWidth="1.6" />
        <path d="M36 72 V31 M50 72 V25 M64 72 V31" stroke={tone('#4a5a52')} strokeWidth="1" />
        <CitrusPot x={36} y={76.8} s={1.2} />
        <CitrusPot x={64} y={76.8} s={1.2} fruit={P.amber} />
      </g>
    )
  }
  const w = t === 3 ? 56 : t === 4 ? 66 : 80
  const x = 50 - w / 2
  const dome = t >= 4
  const trees = t === 3 ? 2 : t === 4 ? 3 : 4
  return (
    <g>
      <Shadow rx={w / 2 + 8} />
      {t >= 5 ? (
        <g>
          {/* fountain */}
          <ellipse cx="12" cy="66" rx="9" ry="2.8" fill={P.pond} stroke={P.stoneDark} strokeWidth="1.2" />
          <path d="M12 66 V60 M9 62 q3 -5 6 0" stroke={tone('#bfe6f2')} strokeWidth="1.2" fill="none" />
        </g>
      ) : null}
      {/* plinth */}
      <rect x={x} y="64" width={w} height="7" fill={tone('#e9e2d2')} stroke={OUT} strokeWidth="1.2" />
      {/* citrus inside */}
      {Array.from({ length: trees }, (_, i) => (
        <CitrusPot key={i} x={x + (w / (trees + 1)) * (i + 1)} y={67.6} s={0.9} fruit={i % 2 ? P.amber : tone('#f5d33d')} />
      ))}
      {/* glass hall */}
      <Glass warm d={`M${x} 64 V36 H${x + w} V64 Z`} />
      {Array.from({ length: Math.floor(w / 9) }, (_, i) => (
        <path key={i} d={`M${x + (i + 1) * (w / (Math.floor(w / 9) + 1))} 64 V36`} stroke={P.white} strokeWidth="1.3" />
      ))}
      {/* Lichtreflex wandert über das Glas */}
      <path d={`M${x + 5} 40 l5 9 M${x + 9} 40 l3 5`} stroke={P.white} strokeWidth="1.6" strokeLinecap="round" className="ma-glint" />
      <rect x={x - 2} y="33" width={w + 4} height="4" rx="1" fill={P.cream} stroke={OUT} strokeWidth="1" />
      {winter ? <SnowCap d={`M${x - 1} 32.6 H${x + w + 1}`} w={2.4} /> : null}
      {dome ? (
        <g>
          <Glass warm d={`M${50 - w * 0.28} 34 Q50 ${t >= 5 ? 0 : 8} ${50 + w * 0.28} 34 Z`} />
          <path d={`M50 ${t >= 5 ? 9 : 14} V34 M${50 - w * 0.14} 34 Q50 ${t >= 5 ? 8 : 14} ${50 + w * 0.14} 34`} stroke={P.white} strokeWidth="1.1" fill="none" />
          <circle cx="50" cy={t >= 5 ? 7 : 12} r="2.6" fill={P.brass} stroke={OUT} strokeWidth="0.8" />
          {winter ? <SnowCap d={`M${50 - w * 0.18} ${t >= 5 ? 22 : 25} Q50 ${t >= 5 ? 10 : 15} ${50 + w * 0.18} ${t >= 5 ? 22 : 25}`} w={2.6} /> : null}
        </g>
      ) : (
        <Glass warm d={`M${x - 2} 34 L50 18 L${x + w + 2} 34 Z`} />
      )}
      {t >= 5 ? (
        <g>
          <CitrusPot x={92} y={75} s={0.75} fruit={P.amber} />
        </g>
      ) : null}
    </g>
  )
}
