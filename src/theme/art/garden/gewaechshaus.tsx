/** Hauptgarten-Bereich: gewaechshaus. */
import { CitrusPot, Flower, Lettuce, Pinwheel, Shadow, SnowCap, Sprout, useSeason } from '../parts'
import { P } from '../palette'
import { Glass, LEAF, LEAF_D, LEAF_L, OUT, WOOD } from './shared'

export function Gewaechshaus({ t }: { t: number }) {
  const winter = useSeason() === 'winter'
  const tomatoes = (x0: number, x1: number, y: number) =>
    Array.from({ length: Math.floor((x1 - x0) / 8) + 1 }, (_, i) => {
      const x = x0 + i * 8
      return (
        <g key={i}>
          <path d={`M${x} ${y} V${y - 18}`} stroke={LEAF_D} strokeWidth="1.4" />
          <ellipse cx={x - 2} cy={y - 12} rx="3" ry="2" fill={LEAF} />
          <ellipse cx={x + 2} cy={y - 6} rx="3" ry="2" fill={LEAF_L} />
          <circle cx={x + 1.6} cy={y - 14} r="2" fill={P.red} />
          <circle cx={x - 1.6} cy={y - 4} r="1.8" fill={i % 2 ? P.amber : P.red} />
        </g>
      )
    })
  if (t === 1) {
    return (
      <g>
        <Shadow rx={42} />
        {/* cold frame */}
        <path d="M22 70 L22 52 L78 46 L78 70 Z" fill={WOOD} stroke={OUT} strokeWidth="1.4" />
        <Sprout x={34} y={62} />
        <Sprout x={48} y={60} />
        <Sprout x={62} y={58} />
        <Glass d="M22 52 L78 46 L74 34 L26 40 Z" />
        <path d="M50 37 L50 49" stroke={P.glassEdge} strokeWidth="1.2" />
      </g>
    )
  }
  const w = t === 2 ? 48 : t === 3 ? 58 : 70
  const x = 50 - w / 2
  const wallTop = t >= 4 ? 40 : 44
  return (
    <g>
      <Shadow rx={w / 2 + 6} />
      {/* base */}
      <rect x={x} y="66" width={w} height="6" fill={P.stoneLight} stroke={OUT} strokeWidth="1.2" />
      {/* plants inside */}
      {t >= 3 ? tomatoes(x + 6, x + w - 6, 66) : (
        <g>
          <Lettuce x={42} y={64} />
          <Lettuce x={56} y={64} />
        </g>
      )}
      {/* glass walls + roof */}
      <Glass d={`M${x} 66 V${wallTop} H${x + w} V66 Z`} />
      <Glass d={`M${x - 3} ${wallTop + 1} L50 ${wallTop - 22} L${x + w + 3} ${wallTop + 1} Z`} />
      {Array.from({ length: Math.floor(w / 10) }, (_, i) => (
        <path key={i} d={`M${x + (i + 1) * (w / (Math.floor(w / 10) + 1))} 66 V${wallTop}`} stroke={P.white} strokeWidth="1.2" />
      ))}
      <path d={`M${x - 3} ${wallTop + 1} L50 ${wallTop - 22} L${x + w + 3} ${wallTop + 1}`} fill="none" stroke={t >= 5 ? P.cream : P.glassEdge} strokeWidth="2.2" strokeLinejoin="round" />
      {winter ? <SnowCap d={`M${x} ${wallTop - 1} L50 ${wallTop - 22.5} L${x + w} ${wallTop - 1}`} w={3} /> : null}
      {/* Windrad auf dem Dach dreht sich beim Arbeiten */}
      <Pinwheel x={x + w - 4} y={wallTop + 2} s={0.8} />
      {/* door */}
      <rect x="45" y={wallTop + 6} width="10" height={60 - wallTop} fill={P.white} fillOpacity="0.35" stroke={P.white} strokeWidth="1.2" />
      {t >= 4 ? (
        <g>
          {/* open roof vent */}
          <path d={`M54 ${wallTop - 16} L66 ${wallTop - 12} L66 ${wallTop - 6} L54 ${wallTop - 10} Z`} fill={P.glass} fillOpacity="0.7" stroke={P.white} strokeWidth="1" />
          <CitrusPot x={8} y={74.4} s={0.6} fruit={P.red} />
          <CitrusPot x={92} y={74.4} s={0.6} fruit={P.amber} />
        </g>
      ) : null}
      {t >= 5 ? (
        <g>
          {/* ornate ridge + finial + hanging baskets */}
          {[38, 44, 50, 56, 62].map((cx) => (
            <circle key={cx} cx={cx} cy={wallTop - 22 + Math.abs(cx - 50) * 0.45} r="1.4" fill={P.cream} />
          ))}
          <circle cx="50" cy={wallTop - 25} r="2.6" fill={P.brass} stroke={OUT} strokeWidth="0.8" />
          <Flower x={x + 8} y={wallTop + 4 + 6.4} c={P.red} />
          <Flower x={x + w - 8} y={wallTop + 4 + 6.4} c={P.pink} />
        </g>
      ) : null}
    </g>
  )
}
