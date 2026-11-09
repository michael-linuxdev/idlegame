/** Hauptgarten-Bereich: gemuesebeet. */
import { Bed, Flower, Lettuce, Shadow, Sprout } from '../parts'
import { P } from '../palette'
import { LEAF, LEAF_D, LEAF_L, OUT, WOOD_D } from './shared'

function Carrot({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y} l-3 -7 M${x} ${y} l0 -8 M${x} ${y} l3 -7`} stroke={LEAF} strokeWidth="1.6" strokeLinecap="round" />
      <path d={`M${x - 2} ${y} h4 l-2 3 z`} fill={P.orange} />
    </g>
  )
}

function Radish({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y - 2} l-2.5 -5 M${x} ${y - 2} l2.5 -5`} stroke={LEAF} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx={x} cy={y} r="2.6" fill={P.red} stroke="#9c2a3c" strokeWidth="0.8" />
    </g>
  )
}

export function Gemuesebeet({ t }: { t: number }) {
  return (
    <g>
      <Shadow rx={42} />
      {t >= 4 ? (
        <g>
          {/* bean teepee */}
          <path d="M28 46 L40 10 L52 46 M34 46 L40 10 L46 46" stroke={WOOD_D} strokeWidth="1.8" fill="none" />
          <path d="M31 40 Q38 30 34 22 Q42 18 40 12 M49 40 Q42 32 46 24" stroke={LEAF} strokeWidth="2.2" fill="none" />
          {[
            [33, 30],
            [46, 28],
            [38, 20],
            [44, 38],
          ].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="3" ry="1.8" fill={LEAF_L} />
          ))}
        </g>
      ) : null}
      {t >= 5 ? (
        <g>
          {/* scarecrow (SIZE.vogelscheuche = 30) */}
          <path d="M82 70 V44 M74 49 H90" stroke={WOOD_D} strokeWidth="2" />
          <path d="M75.5 49 H88.5 L87 60 H77 Z" fill={P.denim} stroke={OUT} strokeWidth="1.3" />
          <circle cx="82" cy="44" r="4.2" fill={P.skinLight} stroke={OUT} strokeWidth="1.3" />
          <path d="M75.5 42 H88.5 L85 37 H79 Z" fill={P.brass} stroke={OUT} strokeWidth="1.3" />
          <circle cx="80.6" cy="44.4" r="0.7" fill={OUT} />
          <circle cx="83.4" cy="44.4" r="0.7" fill={OUT} />
          {/* pumpkins */}
          <ellipse cx="9" cy="64" rx="7" ry="5.4" fill={P.orange} stroke={OUT} strokeWidth="1.2" />
          <path d="M9 59 V56" stroke={LEAF_D} strokeWidth="1.6" />
          <ellipse cx="91" cy="70" rx="5.4" ry="4.2" fill={P.amber} stroke={OUT} strokeWidth="1.1" />
        </g>
      ) : null}
      {t <= 1 ? (
        <g>
          <Bed x={50} y={70} w={64} h={22} front={0} />
          {[24, 40, 56, 72].map((x, i) => (
            <Sprout key={x} x={x + (i % 2) * 2} y={56} />
          ))}
          {[30, 46, 62, 78].map((x) => (
            <Sprout key={x} x={x} y={66} />
          ))}
          {/* seed stake */}
          <rect x="80" y="38" width="2" height="14" fill={WOOD_D} />
          <rect x="76" y="36" width="10" height="7" rx="1" fill={P.canvas} stroke={OUT} strokeWidth="0.9" />
        </g>
      ) : t === 2 ? (
        <g>
          <Bed x={50} y={71} w={76} h={20} front={5} />
          {[24, 38, 52, 66, 80].map((x) => (
            <Lettuce key={x} x={x} y={57} s={0.85} />
          ))}
          {[20, 30, 40, 50, 60, 70, 80].map((x) => (
            <Carrot key={x} x={x} y={64} />
          ))}
        </g>
      ) : (
        <g>
          <Bed x={50} y={73} w={68} h={20} front={9} />
          {[25, 37, 49, 61, 73].map((x) => (
            <Lettuce key={x} x={x} y={52} />
          ))}
          {[23, 32, 41, 50, 59, 68, 77].map((x, i) =>
            i % 2 ? <Radish key={x} x={x} y={62} /> : <Carrot key={x} x={x} y={62} />,
          )}
        </g>
      )}
      {t >= 4 ? (
        <g>
          {/* watering can */}
          <path d="M86 62 h9 v8 h-9 z" fill={P.water} stroke={OUT} strokeWidth="1.1" />
          <path d="M95 64 l4 -4" stroke={P.water} strokeWidth="1.8" />
          <path d="M87 62 q4 -5 8 0" fill="none" stroke={OUT} strokeWidth="1" />
        </g>
      ) : null}
      {t >= 5 ? (
        <g>
          <Flower x={6} y={50.4} c={P.pink} />
          <Flower x={12} y={56.4} c={P.yellow} />
          <Flower x={5} y={58.4} c={P.red} />
        </g>
      ) : null}
    </g>
  )
}
