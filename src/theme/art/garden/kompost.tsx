/** Hauptgarten-Bereich: kompost (kräftiger Stil, parts/bold.tsx). */
import { Shadow, SnowCap, useSeason } from '../parts'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P, tone } from '../palette'
import { Grow, OUT, Rod, WOOD } from './shared'

const line = boldLine()
const detail = boldDetail()

function Steam({ x, y }: { x: number; y: number }) {
  return (
    <g className="ma-steam" fill="none" stroke={P.white} strokeWidth="1.8" strokeLinecap="round" opacity="0.75">
      <path d={`M${x} ${y} q-3 -4 0 -8 q3 -4 0 -8`} />
      <path d={`M${x + 7} ${y + 1} q-3 -4 0 -7 q3 -4 0 -7`} />
    </g>
  )
}

/** Komposthaufen: dunkler Hügel mit Lichtseite und Küchenresten. */
function Heap({ x, w, base, tall = 0.7 }: { x: number; w: number; base: number; tall?: number }) {
  const peak = base - w * tall
  const season = useSeason()
  return (
    <g>
      <path d={`M${x} ${base} Q${x + w / 2} ${peak - w * 0.25} ${x + w} ${base} Z`} fill={P.compost} {...line} />
      <path d={`M${x + w * 0.16} ${base - w * 0.12} Q${x + w * 0.3} ${peak + w * 0.12} ${x + w * 0.46} ${peak + w * 0.1}`} fill="none" stroke={P.white} strokeWidth={BOLD.detail} strokeLinecap="round" opacity="0.22" />
      {season === 'winter' ? <SnowCap d={`M${x + w * 0.22} ${peak + w * 0.14} Q${x + w / 2} ${peak - w * 0.16} ${x + w * 0.78} ${peak + w * 0.14}`} w={Math.max(2.6, w * 0.1)} /> : null}
      {season === 'autumn' ? <ellipse cx={x + w * 0.24} cy={base - 3.4} rx="3" ry="1.6" fill={P.autumn} stroke={OUT} strokeWidth={BOLD.hair} transform={`rotate(25 ${x + w * 0.24} ${base - 3.4})`} /> : null}
      <ellipse cx={x + w * 0.36} cy={peak + w * 0.24} rx="3.2" ry="1.8" fill={tone('#8fbf5a')} stroke={OUT} strokeWidth={BOLD.hair} transform={`rotate(-20 ${x + w * 0.36} ${peak + w * 0.24})`} />
      <ellipse cx={x + w * 0.66} cy={peak + w * 0.3} rx="2.6" ry="1.6" fill={tone('#d58a3a')} stroke={OUT} strokeWidth={BOLD.hair} />
      <circle cx={x + w * 0.52} cy={peak + w * 0.12} r="1.8" fill={tone('#c9433a')} stroke={OUT} strokeWidth={BOLD.hair} />
    </g>
  )
}

/** Lattenkiste: drei Bretter zwischen zwei Pfosten, dahinter der Haufen. */
function Bin({ x, w, top = 48, full = true }: { x: number; w: number; top?: number; full?: boolean }) {
  const h = (73 - top) / 3
  return (
    <g>
      {full ? <Heap x={x + 1.5} w={w - 3} base={top + 8} tall={0.62} /> : null}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x} y={top + 1 + i * h} width={w} height={h - 2} rx="1" fill={WOOD} {...detail} />
      ))}
      <rect x={x + 1.5} y={top + 1} width={w * 0.24} height={3 * h - 2} fill={P.white} opacity="0.14" />
      <rect x={x + w * 0.7} y={top + 1} width={w * 0.3 - 1.5} height={3 * h - 2} fill={OUT} opacity="0.13" />
      <Post x={x} y={75} h={78 - top} w={3.6} fill={P.woodLight} />
      <Post x={x + w} y={75} h={78 - top} w={3.6} />
    </g>
  )
}

/** Mistgabel, steckt im Boden. */
function Fork({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <Rod d={`M${x} ${y} L${x + 7} ${y - 28}`} c={P.woodLight} w={1.6} />
      <Rod d={`M${x + 3.2} ${y - 28.6} L${x + 10.8} ${y - 26.8} M${x + 4} ${y - 28.4} l1.4 -5.2 M${x + 7.2} ${y - 27.6} l1.4 -5.4 M${x + 10.2} ${y - 27} l1.4 -5.2`} c={P.metal} w={1.1} />
    </g>
  )
}

export function Kompost({ t, producing }: { t: number; producing: boolean }) {
  const season = useSeason()
  return (
    <g>
      <Shadow rx={t === 1 ? 34 : t === 2 ? 38 : 45} />
      {t === 1 ? (
        <g className="t-new" style={{ ["--i" as string]: 1 }}>
          <Heap x={22} w={50} base={74} tall={0.48} />
          <Fork x={74} y={75} />
        </g>
      ) : null}
      {t === 2 ? (
        <g className="t-new" style={{ ["--i" as string]: 2 }}>
          <Bin x={20} w={40} top={48} />
          <Heap x={64} w={24} base={75} tall={0.55} />
        </g>
      ) : null}
      {t >= 3 ? (
        <g className={t === 3 ? 't-new' : undefined} style={{ ["--i" as string]: 3 }}>
          {t >= 5 ? (
            <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 4 }}>
              {/* Schutzdach über den Kisten */}
              <Post x={8} y={76} h={44} w={4} />
              <Post x={92} y={76} h={44} w={4} />
              <path d="M1 33 L50 15 L99 33 V38 H1 Z" fill={tone('#7d9f5a')} {...line} />
              <path d="M50 17.2 L97 34.2 V37 H50 Z" fill={OUT} opacity="0.18" />
              <path d="M12 31.5 L40 21" fill="none" stroke={P.white} strokeWidth={BOLD.detail} strokeLinecap="round" opacity="0.4" />
              {season === 'winter' ? <SnowCap d="M5 30.6 L50 14 L95 30.6" w={3.6} /> : null}
            </g>
          ) : null}
          <Grow s={t === 3 ? 0.94 : 1}>
            {t >= 4 ? (
              <g>
                <Bin x={13} w={25} top={47} />
                <Bin x={38} w={25} top={47} />
                <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 1 }}><Bin x={63} w={25} top={47} full={t >= 5} /></g>
              </g>
            ) : (
              <g>
                <Bin x={12} w={34} top={47} />
                <Bin x={46} w={34} top={47} />
              </g>
            )}
          </Grow>
          {t === 3 ? <Fork x={86} y={75} /> : null}
        </g>
      ) : null}
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 5 }}>
          {/* Schubkarre mit fertiger Erde (steht über der Schild-Zone) */}
          <g transform="translate(0 -6.5)">
          <Rod d="M19 75 L31 82 M22 70 L33 72" c={P.woodLight} w={1.5} />
          <ellipse cx="14" cy="67.5" rx="10" ry="3" fill={P.compost} {...detail} />
          <path d="M2 67 H26 L21 77 H7 Z" fill={P.roof} {...line} />
          <path d="M17 68 H24.5 L20.4 76 H17 Z" fill={OUT} opacity="0.16" />
          <circle cx="9" cy="80" r="4" fill={P.charcoal} {...detail} />
          <circle cx="9" cy="80" r="1.3" fill={P.stoneLight} />
          </g>
        </g>
      ) : null}
      {t >= 5 ? (
        <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 0 }}>
          {/* Eimer mit Komposterde */}
          <ellipse cx="93" cy="65.5" rx="5.6" ry="2" fill={P.compost} {...detail} />
          <path d="M87 65 H99 L97.6 76 H88.4 Z" fill={P.metal} {...detail} />
          <rect x="88.6" y="66.4" width="2" height="8.4" fill={P.white} opacity="0.3" />
        </g>
      ) : null}
      {producing && t >= 2 ? <Steam x={t === 2 ? 38 : 46} y={t >= 5 ? 44 : 38} /> : null}
    </g>
  )
}
