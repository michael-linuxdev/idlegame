/** Hauptgarten-Bereich: kraeuterspirale. */
import { Flower, Shadow, useSeason } from '../parts'
import { P, tone } from '../palette'
import { LEAF, LEAF_D, OUT, SOIL } from './shared'

export function Kraeuterspirale({ t }: { t: number }) {
  const season = useSeason()
  const stones = (n: number, cx: number, cy: number, r0: number, grow: number, per = 9) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / per) * Math.PI * 2
      const r = r0 + i * grow
      return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.55 }
    })
  const herbColors = [LEAF, tone('#8fbf5a'), tone('#6d9b56'), tone('#a3c47a')]
  const ring = t <= 1 ? stones(12, 50, 60, 24, 0, 12) : stones(t >= 3 ? 24 : 17, 50, 60, 4, t >= 3 ? 1.35 : 1.6)
  return (
    <g>
      <Shadow rx={42} />
      {t >= 4 ? (
        <g>
          <ellipse cx="78" cy="70" rx="12" ry="5.4" fill={P.pond} stroke={P.stoneDark} strokeWidth="1.6" />
          <ellipse cx="74" cy="69" rx="3" ry="1.4" fill={LEAF} />
        </g>
      ) : null}
      {/* soil mound */}
      <ellipse cx="50" cy={t <= 1 ? 60 : 62} rx={t <= 1 ? 25 : 30} ry={t <= 1 ? 13 : 14} fill={SOIL} />
      {t >= 3 ? <ellipse cx="50" cy="54" rx="16" ry="8" fill={tone('#8a5a3b')} /> : null}
      {t >= 3 ? <ellipse cx="50" cy="47" rx="8" ry="4" fill={tone('#966646')} /> : null}
      {ring.map((p, i) => (
        <ellipse key={i} cx={p.x} cy={p.y - (t >= 3 ? (24 - i) * 0.55 : 0)} rx="3.6" ry="2.6" fill={P.stoneLight} stroke={P.stoneDark} strokeWidth="0.9" />
      ))}
      {/* herbs */}
      <g className="ma-sway">
      {Array.from({ length: t <= 1 ? 5 : t === 2 ? 7 : 10 }, (_, i) => {
        const a = (i / (t <= 1 ? 5 : 10)) * Math.PI * 2 + 0.4
        const r = t <= 1 ? 11 : 6 + (i % 4) * 4
        const x = 50 + Math.cos(a) * r
        const y = (t >= 3 ? 52 : 60) + Math.sin(a) * r * 0.5
        return (
          <g key={i}>
            <circle cx={x} cy={y - 3} r="3.6" fill={herbColors[i % 4]} stroke={LEAF_D} strokeWidth="0.8" />
            {t >= 3 && i % 3 === 0 ? (
              <path d={`M${x} ${y - 6} v-5`} stroke={P.lavender} strokeWidth="2.6" strokeLinecap="round" />
            ) : null}
          </g>
        )
      })}
      </g>
      {season === 'winter' ? (
        <g className="art-snow" fill={P.white}>
          {/* Schnee auf der Spirale */}
          <ellipse cx="50" cy={t >= 3 ? 46 : 54} rx={t >= 3 ? 12 : 16} ry={t >= 3 ? 3.4 : 4.4} opacity="0.92" />
          <ellipse cx="36" cy={t >= 3 ? 56 : 60} rx="7" ry="2" opacity="0.85" />
          <ellipse cx="64" cy={t >= 3 ? 58 : 62} rx="6" ry="1.8" opacity="0.85" />
        </g>
      ) : null}
      {season === 'spring' ? (
        <g>
          {/* Frühblüher zwischen den Steinen */}
          {[
            [30, 64, P.yellow],
            [70, 63, P.white],
            [44, 70, P.lilac],
          ].map(([x, y, c], i) => (
            <circle key={i} cx={x as number} cy={y as number} r="1.8" fill={c as string} stroke={P.leafDark} strokeWidth="0.4" />
          ))}
        </g>
      ) : null}
      {t >= 5 ? (
        <g>
          {/* gnome */}
          <path d="M18 72 L22 56 L26 72 Z" fill={P.roof} stroke={OUT} strokeWidth="1" />
          <circle cx="22" cy="63" r="3" fill={P.skinLight} />
          <path d="M19 64 Q22 72 25 64" fill={P.white} />
          <rect x="18.5" y="68" width="7" height="5" rx="1" fill={P.denim} />
          <Flower x={84} y={56.4} c={P.yellow} />
          <Flower x={14} y={54.4} c={P.lavender} />
          <Flower x={90} y={64.4} c={P.white} />
        </g>
      ) : null}
    </g>
  )
}
