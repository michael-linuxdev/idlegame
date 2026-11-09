/** Hauptgarten-Bereich: kompost. */
import { Shadow } from '../parts'
import { P, tone } from '../palette'
import { OUT, WOOD, WOOD_D } from './shared'

function Steam({ x, y }: { x: number; y: number }) {
  return (
    <g className="ma-steam" fill="none" stroke={P.white} strokeWidth="1.6" strokeLinecap="round" opacity="0.7">
      <path d={`M${x} ${y} q-3 -4 0 -8 q3 -4 0 -8`} />
      <path d={`M${x + 6} ${y + 1} q-3 -4 0 -7 q3 -4 0 -7`} />
    </g>
  )
}

function KompostHeap({ x, w, base = 64, tall = 0.7 }: { x: number; w: number; base?: number; tall?: number }) {
  const peak = base - w * tall
  return (
    <g>
      <path d={`M${x} ${base} Q${x + w / 2} ${peak - w * 0.25} ${x + w} ${base} Z`} fill={P.compost} stroke={OUT} strokeWidth="1.2" />
      <ellipse cx={x + w * 0.35} cy={peak + w * 0.2} rx="3" ry="1.6" fill={tone('#8fbf5a')} transform={`rotate(-20 ${x + w * 0.35} ${peak + w * 0.2})`} />
      <ellipse cx={x + w * 0.66} cy={peak + w * 0.26} rx="2.4" ry="1.4" fill={tone('#d58a3a')} />
      <circle cx={x + w * 0.5} cy={peak + w * 0.08} r="1.6" fill={tone('#c9433a')} />
    </g>
  )
}

function KompostBin({ x, w = 24, full = true }: { x: number; w?: number; full?: boolean }) {
  return (
    <g>
      {full ? <KompostHeap x={x + 1} w={w - 2} base={56} tall={1.05} /> : null}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x} y={52 + i * 7} width={w} height="5" rx="1" fill={WOOD} stroke={OUT} strokeWidth="1" />
      ))}
      <rect x={x - 1} y="48" width="3" height="24" fill={WOOD_D} />
      <rect x={x + w - 2} y="48" width="3" height="24" fill={WOOD_D} />
    </g>
  )
}

export function Kompost({ t, producing }: { t: number; producing: boolean }) {
  return (
    <g>
      <Shadow rx={42} />
      {t === 1 ? (
        <g>
          <KompostHeap x={20} w={58} base={70} tall={0.6} />
          <path d="M78 72 L84 44 M81 44 L87 45 M82 41 L86 42" stroke={P.metal} strokeWidth="1.8" strokeLinecap="round" />
        </g>
      ) : null}
      {t === 2 ? (
        <g>
          <KompostBin x={26} w={34} />
          <KompostHeap x={60} w={26} base={72} tall={0.6} />
        </g>
      ) : null}
      {t >= 3 ? (
        <g>
          {t >= 5 ? (
            <g>
              <rect x="14" y="30" width="3" height="40" fill={WOOD_D} />
              <rect x="83" y="30" width="3" height="40" fill={WOOD_D} />
              <path d="M8 34 L50 22 L92 34 L92 38 L8 38 Z" fill={tone('#7d9f5a')} stroke={OUT} strokeWidth="1.3" strokeLinejoin="round" />
            </g>
          ) : null}
          <KompostBin x={t >= 4 ? 18 : 26} w={22} />
          <KompostBin x={t >= 4 ? 40 : 50} w={22} />
          {t >= 4 ? <KompostBin x={62} w={22} full={t >= 5} /> : null}
          {t === 3 ? (
            <path d="M78 70 L86 40 M83 40 L89 41 M84 37 L88 38" stroke={P.metal} strokeWidth="1.8" strokeLinecap="round" />
          ) : null}
        </g>
      ) : null}
      {t >= 4 ? (
        <g>
          {/* wheelbarrow */}
          <path d="M4 66 L20 66 L24 58 L2 58 Z" fill={P.roof} stroke={OUT} strokeWidth="1.1" />
          <ellipse cx="13" cy="57" rx="10" ry="2.4" fill={P.compost} />
          <circle cx="8" cy="70" r="3.4" fill={tone('#3d3d3d')} stroke={OUT} strokeWidth="1" />
          <path d="M20 64 L28 72" stroke={WOOD_D} strokeWidth="1.6" />
        </g>
      ) : null}
      {t >= 5 ? (
        <g>
          <rect x="86" y="62" width="10" height="10" rx="1.6" fill={P.metal} stroke={OUT} strokeWidth="1" />
          <ellipse cx="91" cy="62" rx="5" ry="1.6" fill={P.compost} />
        </g>
      ) : null}
      {producing && t >= 2 ? <Steam x={44} y={44} /> : null}
    </g>
  )
}
