/** Hauptgarten-Bereich: beerenhecke (kräftiger Stil, parts/bold.tsx). */
import { Bush, Fruit, Jar, Shadow, SnowCap, foliage, useSeason } from '../parts'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P, tone } from '../palette'
import { OUT, Rod } from './shared'

const line = boldLine()
const detail = boldDetail()

export function Beerenhecke({ t }: { t: number }) {
  const season = useSeason()
  const winter = season === 'winter'
  const f = season === 'autumn' ? { crown: P.leafDark, mid: P.autumn, light: P.gold } : foliage(season)
  const berries = [P.berry, tone('#3b1d4a'), tone('#f0e6c8')]
  return (
    <g>
      <Shadow rx={t === 1 ? 32 : t === 2 ? 40 : 45} />
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 1 }}>
          {/* Himbeerspalier hinter den Büschen */}
          {winter ? (
            <g>
              <Rod d="M24 56 Q26 36 22 22 M38 56 Q36 34 40 18 M52 56 Q54 34 50 16 M66 56 Q64 36 68 20 M79 56 Q81 38 77 24" c={tone('#7a5a3a')} w={1.3} />
              <SnowCap d="M14 20 H86" w={2.6} />
            </g>
          ) : (
            <g>
              <path d="M14 58 V30 Q18 19 26 23 Q31 11 41 17 Q50 7 59 16 Q69 10 74 22 Q83 19 86 30 V58 Z" fill={f.crown} {...line} />
              <path d="M19 44 V32 Q22 24 28 27 Q33 17 41 22 Q48 15 53 20 V44 Z" fill={f.mid} opacity="0.75" />
              {[
                [24, 38],
                [36, 28],
                [47, 36],
                [58, 25],
                [68, 35],
                [78, 31],
                [62, 44],
              ].map(([x, y], i) => (
                season === 'spring' ? <circle key={i} cx={x} cy={y} r="1.8" fill={P.white} stroke={OUT} strokeWidth={BOLD.hair} /> : <Fruit key={i} cx={x!} cy={y!} r={2.2} c={P.red} />
              ))}
            </g>
          )}
        </g>
      ) : null}
      {t >= 2 ? (
        <g className={t === 2 ? 't-new' : undefined} style={{ ["--i" as string]: 2 }}>
          {/* Spalier: Pfosten und Drähte */}
          <path d={t >= 4 ? 'M12 24 H88 M12 38 H88 M12 52 H88' : 'M12 44 H88 M12 56 H88'} stroke={OUT} strokeWidth={BOLD.detail} opacity="0.7" />
          <Post x={12} y={76} h={t >= 4 ? 58 : 40} w={4} fill={P.woodLight} />
          <Post x={88} y={76} h={t >= 4 ? 58 : 40} w={4} />
        </g>
      ) : null}
      {t === 1 ? (
        <g className="t-new" style={{ ["--i" as string]: 3 }}>
          <Bush x={44} y={76} r={14} berry={berries[0]} />
          <Bush x={66} y={76} r={8} />
        </g>
      ) : null}
      {t === 2 ? (
        <g className="t-new" style={{ ["--i" as string]: 4 }}>
          <Bush x={34} y={76} r={15} berry={berries[0]} />
          <Bush x={66} y={76} r={15} berry={berries[1]} />
        </g>
      ) : null}
      {t >= 3 ? (
        <g className={t === 3 ? 't-new' : undefined} style={{ ["--i" as string]: 5 }}>
          <Bush x={25} y={75} r={t >= 4 ? 14.5 : 13.5} berry={berries[0]} />
          <Bush x={75} y={75} r={t >= 4 ? 14.5 : 13.5} berry={berries[2]} />
          <Bush x={50} y={76} r={t >= 4 ? 17 : 15.5} berry={berries[1]} />
        </g>
      ) : null}
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 0 }}>
          {/* Pflückkorb */}
          <g transform="translate(0 -4.5)">
          <path d="M83.5 71 q7.5 -12 15 0" fill="none" stroke={OUT} strokeWidth={BOLD.contour} strokeLinecap="round" />
          {[86.5, 91, 95.5].map((x, i) => (
            <circle key={x} cx={x} cy={70.4 - (i % 2)} r="2.4" fill={P.berry} stroke={OUT} strokeWidth={BOLD.hair} />
          ))}
          <path d="M82 71 h18 l-2.6 10 h-12.8 z" fill={P.woodLight} {...detail} />
          <path d="M83.4 75 h15.4" stroke={OUT} strokeWidth={BOLD.hair} opacity="0.45" />
          </g>
        </g>
      ) : null}
      {t >= 5 ? (
        <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 1 }}>
          {/* Marmeladentisch */}
          <Post x={3} y={76.5} h={10} w={2.6} />
          <Post x={17} y={76.5} h={10} w={2.6} />
          <rect x="-1" y="63" width="22" height="4" rx="1" fill={P.wood} {...detail} />
          <Jar x={5} y={63} c={P.berry} s={1.15} />
          <Jar x={14} y={63} c={tone('#3b1d4a')} s={1.15} />
        </g>
      ) : null}
    </g>
  )
}
