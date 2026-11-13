/** Hauptgarten-Bereich: hofladen (kräftiger Stil, parts/bold.tsx). */
import { Crate, Flower, Shadow, SnowCap, useSeason } from '../parts'
import { ArchDoor, GableRoof, Pane, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P, tone } from '../palette'
import { OUT, Pumpkin, Rod, WOOD } from './shared'

const line = boldLine()
const detail = boldDetail()

export function Hofladen({ t }: { t: number }) {
  const season = useSeason()
  const winter = season === 'winter'
  const produce = [P.red, P.orange, P.leafLight, P.yellow, P.plum]
  if (t === 1) {
    return (
      <g>
        <Shadow rx={38} />
        {/* Schild „Zu verkaufen“ */}
        <Post x={70} y={76} h={38} w={3.4} />
        <rect x="57" y="35" width="26" height="14" rx="1.5" fill={P.canvas} {...line} />
        <path d="M61 42 H79" stroke={P.soil} strokeWidth="1.8" strokeDasharray="3.4 2" />
        <Crate x={40} y={63} fruit={produce[2]} s={1.3} />
        <Crate x={28} y={75} fruit={produce[0]} s={1.3} />
        <Crate x={52} y={76} fruit={produce[1]} s={1.3} />
        {/* Kasse des Vertrauens */}
        <rect x="74" y="65" width="12" height="11" rx="1.4" fill={P.metal} {...detail} />
        <rect x="77" y="68" width="6" height="1.5" rx="0.7" fill={OUT} />
      </g>
    )
  }
  const w = t === 2 ? 50 : t === 3 ? 64 : 74
  const x = 50 - w / 2
  const stripes = Math.round(w / 9)
  const sw = (w - 6) / stripes
  const crates = Math.floor(w / 20)
  return (
    <g>
      <Shadow rx={w / 2 + 8} />
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 1 }}>
          {/* Ladenhäuschen hinter dem Stand */}
          <Wall x={x + 7} y={20} w={w - 14} h={40} fill={t >= 5 ? P.paper : WOOD} planks={t >= 5 ? 0 : 3} />
          <GableRoof x={x + 7} y={21} w={w - 14} h={t >= 5 ? 18 : 15} over={7} />
          {winter ? <SnowCap d={`M${x + 3} ${19.5} L50 ${t >= 5 ? 2.5 : 5.5} L${x + w - 3} 19.5`} w={3.8} /> : null}
          <ArchDoor x={44} y={58} w={12} h={22} fill={tone('#7d9f5a')} />
          {/* Fenster im Laden (leuchten abends) */}
          <Pane x={x + 12} y={24} w={10} h={8} />
          <Pane x={x + w - 22} y={24} w={10} h={8} />
          {t >= 5 ? (
            <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 2 }}>
              {/* Ladenschild im Giebel */}
              <rect x="33" y="8.5" width="34" height="10" rx="1.6" fill={tone('#3d5a2e')} {...line} />
              <path d="M37.5 13.5 H62.5" stroke={P.canvas} strokeWidth="2" strokeDasharray="4 1.6" />
            </g>
          ) : null}
        </g>
      ) : null}
      {/* Stand: Pfosten und Markise */}
      <Post x={x + 3} y={75} h={38} />
      <Post x={x + w - 3} y={75} h={38} />
      <path d={`M${x - 4} 46 L${x + 3} 35 H${x + w - 3} L${x + w + 4} 46 Z`} fill={P.white} {...line} />
      {Array.from({ length: Math.ceil(stripes / 2) }, (_, i) => {
        const a = x + 3 + i * 2 * sw
        const k = (w + 8) / (w - 6)
        const b = x - 4 + i * 2 * sw * k
        return <path key={i} d={`M${a} 35.8 H${a + sw} L${b + sw * k} 45.2 H${b} Z`} fill={P.barn} />
      })}
      <path d={`M${x + w * 0.7} 35.8 H${x + w - 3.4} L${x + w + 2.6} 45.2 H${x + w * 0.72} Z`} fill={OUT} opacity="0.14" />
      <path d={`M${x - 4} 46 L${x + 3} 35 H${x + w - 3} L${x + w + 4} 46 Z`} fill="none" {...line} />
      {winter ? <SnowCap d={`M${x + 4} 34 H${x + w - 4}`} w={3.2} /> : null}
      <g className="ma-flutter">
        <path
          d={`M${x - 4} 46 ${Array.from({ length: stripes + 1 }, () => `q${((w + 8) / (stripes + 1) / 2).toFixed(2)} 4.6 ${((w + 8) / (stripes + 1)).toFixed(2)} 0`).join(' ')} Z`}
          fill={P.barn}
          {...detail}
        />
      </g>
      {/* Theke mit Ware */}
      <Wall x={x} y={58} w={w} h={17} planks={1} />
      {Array.from({ length: crates }, (_, i) => (
        <Crate key={i} x={50 + (i - (crates - 1) / 2) * 21} y={59} fruit={produce[i % produce.length]} s={1.12} />
      ))}
      <rect x={x - 1.5} y={56.6} width={w + 3} height="3.6" rx="1.2" fill={P.woodLight} {...detail} />
      {season === 'autumn' ? (
        <g>
          {/* Kürbisse vor dem Stand */}
          <Pumpkin x={x - 3} y={72} r={5} />
          <Pumpkin x={x + 7} y={73.4} r={4} c={P.amber} />
        </g>
      ) : null}
      {t >= 3 ? (
        <g className={t === 3 ? 't-new' : undefined} style={{ ["--i" as string]: 3 }}>
          {/* Kreidetafel */}
          <g transform="translate(0 -4.5)">
          <Rod d="M85.5 81 L89 62 M98.5 81 L95 62" c={P.woodLight} w={1.5} />
          <rect x="85" y="58" width="14" height="16" rx="1.2" fill={tone('#2f3b2f')} stroke={OUT} strokeWidth={BOLD.contour} />
          <rect x="85" y="58" width="14" height="16" rx="1.2" fill="none" stroke={P.woodLight} strokeWidth="0.9" />
          <path d="M88 63 H96 M88 67 H93.5 M88 70.5 H95" stroke={P.cream} strokeWidth="1.1" strokeLinecap="round" />
          </g>
        </g>
      ) : null}
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 4 }}>
          {/* Blumeneimer */}
          <g transform="translate(0 -5.5)">
          <Flower x={3.6} y={72} c={P.pink} />
          <Flower x={9.4} y={70} c={P.yellow} />
          <path d="M0.6 71 H12.4 L11 82 H2 Z" fill={P.metal} {...detail} />
          <rect x="2.6" y="72.4" width="2" height="8.2" fill={P.white} opacity="0.3" />
          </g>
        </g>
      ) : null}
      {t >= 5 ? (
        <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 5 }}>
          {/* Laternen unter der Markise */}
          <path d={`M${x + 10} 47 v4 M${x + w - 10} 47 v4`} stroke={OUT} strokeWidth={BOLD.hair} />
          <circle cx={x + 10} cy="53" r="2.8" fill={P.lamp} {...detail} className="garden-bulb" />
          <circle cx={x + w - 10} cy="53" r="2.8" fill={P.lamp} {...detail} className="garden-bulb" />
        </g>
      ) : null}
    </g>
  )
}
