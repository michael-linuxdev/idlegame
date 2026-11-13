/** Hauptgarten-Bereich: huehnerstall (kräftiger Stil, parts/bold.tsx). */
import { HEN_SCALE, Hen, Shadow, SnowCap, useSeason } from '../parts'
import { ArchDoor, GableRoof, Pane, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P, tone } from '../palette'
import { OUT, WOOD } from './shared'

const HEN = HEN_SCALE * 1.3
const line = boldLine()
const detail = boldDetail()

/** Ei mit Kontur. */
function Egg({ x, y }: { x: number; y: number }) {
  return <ellipse cx={x} cy={y} rx="2.2" ry="2.8" fill={tone('#f7efe0')} stroke={OUT} strokeWidth={BOLD.hair} />
}

export function Huehnerstall({ t }: { t: number }) {
  const winter = useSeason() === 'winter'
  return (
    <g>
      <Shadow rx={45} />
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 1 }}>
          {/* Auslauf: Pfosten und Draht hinter dem Stall */}
          <path d="M5 60 H95 M5 67 H95" stroke={tone('#d9c79f')} strokeWidth={BOLD.hair} />
          <path d={Array.from({ length: 10 }, (_, i) => `M${5 + i * 10} 54 V76`).join(' ')} stroke={tone('#c9b48a')} strokeWidth={BOLD.detail} strokeLinecap="round" />
          <path d="M4 54 H96" stroke={OUT} strokeWidth={BOLD.contour + 1.4} strokeLinecap="round" />
          <path d="M4 54 H96" stroke={P.woodLight} strokeWidth={BOLD.contour - 0.4} strokeLinecap="round" />
        </g>
      ) : null}
      {t <= 2 ? (
        <g>
          {/* Nurdach-Stall: Giebelwand, darüber zwei kräftige Dachbretter */}
          <path d="M29 75 L50 36 L71 75 Z" fill={WOOD} {...line} />
          <path d="M50 39 L69 74 H50 Z" fill={OUT} opacity="0.15" />
          <path d="M36 66 H64 M41 57 H59 M45 49 H55" stroke={OUT} strokeWidth={BOLD.hair} opacity="0.35" />
          <path d="M24 77 L50 29 L76 77" fill="none" stroke={OUT} strokeWidth="8.4" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M24 77 L50 29 L76 77" fill="none" stroke={P.roof} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M28 68 L46 35" fill="none" stroke={P.white} strokeWidth={BOLD.detail} strokeLinecap="round" opacity="0.4" />
          {winter ? <SnowCap d="M38 51 L50 29.5 L62 51" w={4} /> : null}
          <ArchDoor x={43.5} y={75} w={13} h={18} fill={OUT} />
          {t >= 2 ? <path d="M40 76.5 H60" stroke={P.woodLight} strokeWidth="2.4" strokeLinecap="round" /> : null}
        </g>
      ) : (
        <g>
          {/* Stall auf Stelzen */}
          <Post x={28} y={77} h={19} />
          <Post x={72} y={77} h={19} />
          <path d="M28 66 L44 60 M72 66 L56 60" stroke={OUT} strokeWidth={BOLD.detail} strokeLinecap="round" />
          <Wall x={21} y={33} w={58} h={27} fill={t >= 5 ? P.barn : WOOD} planks={3} />
          {t >= 5 ? (
            <g>
              {/* weiße Zierleisten der Scheune */}
              <path d="M21.8 34 H78.2 M21.8 59 H78.2" stroke={P.cream} strokeWidth="1.6" />
              <path d="M22.5 34.5 V59 M77.5 34.5 V59" stroke={P.cream} strokeWidth="1.6" />
            </g>
          ) : null}
          <GableRoof x={21} y={34} w={58} h={19} fill={P.metal} over={6} />
          {winter ? <SnowCap d="M19 32.5 L50 14.5 L81 32.5" w={4} /> : null}
          <ArchDoor x={36} y={60} w={12} h={16} fill={OUT} />
          <Pane x={57} y={41} w={12} h={10} />
          {/* Hühnerleiter */}
          <path d="M37 60 L25 78 H33.5 L46.5 60 Z" fill={P.woodLight} {...detail} />
          <path d="M33.6 65 L40 65 M30.2 70 L36.6 70 M27 75 L33.2 75" stroke={OUT} strokeWidth={BOLD.hair} />
          {t >= 5 ? (
            <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 2 }}>
              {/* Wetterhahn */}
              <path d="M50 15 V5" stroke={OUT} strokeWidth={BOLD.detail} strokeLinecap="round" />
              <path d="M44.5 6.5 q5.5 -6.5 11 0 l-2.6 2.6 h-5.8 z" fill={P.brass} {...detail} />
            </g>
          ) : null}
        </g>
      )}
      {t >= 2 ? <g className={t === 2 ? 't-new' : undefined} style={{ ["--i" as string]: 0 }}><Hen x={15} y={74} s={HEN} /></g> : null}
      {t >= 3 ? <g className={t === 3 ? 't-new' : undefined} style={{ ["--i" as string]: 1 }}><Hen x={86} y={76} flip c={tone('#c9763a')} s={HEN} /></g> : null}
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 3 }}>
          {/* Hahn mit Schwanzfedern */}
          <path d="M57 65 q-8 -6 -6 -15 q3 7 8 8 z" fill={tone('#2f5e3a')} {...detail} />
          <Hen x={66} y={75} c={tone('#8a4a2a')} s={HEN} />
        </g>
      ) : null}
      {t >= 5 ? (
        <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 4 }}>
          <Hen x={9} y={66} c={P.charcoal} flip s={HEN} />
          {/* Legenest mit Eiern */}
          <path d="M82 57 h15 l-2.4 8.5 h-10.2 z" fill={P.woodLight} {...detail} />
          <Egg x={86} y={55.5} />
          <Egg x={90} y={54.8} />
          <Egg x={94} y={55.5} />
        </g>
      ) : null}
      {t === 3 ? (
        <g className="t-new" style={{ ["--i" as string]: 5 }}>
          <Egg x={88} y={58} />
          <Egg x={93} y={59.5} />
        </g>
      ) : null}
    </g>
  )
}
