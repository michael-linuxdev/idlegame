/**
 * Gartenerbe — garden ground + decor behind the ten plots.
 *
 * Layers:
 *  1. Ground SVG in percent space (viewBox 0–100, preserveAspectRatio none)
 *     so the gravel path always meets the plot centres from generators.ts.
 *     Strokes use `non-scaling-stroke` → constant width on any aspect ratio.
 *  2. Decor objects (Laube, Regentonne, Teich, Bäume, Zaun …) positioned in
 *     percent with their own aspect ratio, sized in `--u` (see garden.css).
 *  3. Stage-driven life: wild clumps vanish and flowers, butterflies and
 *     lanterns appear as more plots are angelegt (stage 0–10).
 */
import { memo, type CSSProperties, type ReactNode } from 'react'
import { GENERATORS } from '../game/generators'
import type { Ambient } from './ambient'
import type { FestId } from '../game/fests'
import type { Weather } from '../game/gardenLife'
import { WeatherLayer } from '../components/WeatherLayer'
import { FestDecor, FestSkinDecor } from './FestDecor'
import { festSpots, spotsCollide, type Spot } from './festItems'
import { useSvgId } from './svgId'
import { ArtSvg } from './ArtSvg'
import { P, tone } from './art/palette'
import { BOLD } from './art/parts/style'

interface Props {
  /** Number of garden areas angelegt (0–10) */
  stage: number
  /** Local time of day + season (cosmetic) */
  ambient: Ambient
  /** Gartenstil accent class (skin-wiese, skin-bauerngarten, …) */
  skin?: string
  /** Running saisonales Fest → map decoration */
  fest?: FestId
  /** Tageswetter: Pfützen liegen in der Bodenebene, unter aller Deko */
  weather?: Weather
}

/**
 * Kräftiger Stil für die Kulisse: dieselbe sichtbare Strichstärke wie in den
 * Bereichen (Kontur 2 · Detail 1,2 · Haarlinie 0,7 im plot-Raster, ein Plot =
 * 24 u breit). `perU` = Einheiten des eigenen viewBox je u (viewBox-Breite /
 * Breite in u), damit Laube, Teich und Bäume gleich kräftig wirken.
 */
function ink(perU: number, weight: 'contour' | 'detail' | 'hair' = 'contour') {
  return { stroke: P.outline, strokeWidth: +(BOLD[weight] * 0.24 * perU).toFixed(2), strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
}

/** Stange, Halm oder Ranke mit dunkler Kontur. */
function Rod({ d, c, w, perU }: { d: string; c: string; w: number; perU: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={P.outline} strokeWidth={w + BOLD.detail * 0.24 * perU * 1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

function Sonnenblume() {
  const u = 20 / 5
  return (
    <ArtSvg viewBox="0 0 20 44">
      <Rod d="M10 44 V14" c={P.leafMoss} w={2} perU={u} />
      <ellipse cx="6" cy="28" rx="4.5" ry="2" fill={P.leaf} transform="rotate(-30 6 28)" {...ink(u, 'hair')} />
      <ellipse cx="14" cy="34" rx="4.5" ry="2" fill={P.leaf} transform="rotate(30 14 34)" {...ink(u, 'hair')} />
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx="10" cy="5" rx="2" ry="4.4" fill={P.yellow} transform={`rotate(${i * 30} 10 10)`} {...ink(u, 'hair')} />
      ))}
      <circle cx="10" cy="10" r="4" fill="#6b4423" {...ink(u, 'detail')} />
    </ArtSvg>
  )
}

function Kirschbaum() {
  const u = 100 / 20
  const blobs = [
    [50, 40, 26, '#f2a7c3'],
    [68, 46, 17, '#eb93b5'],
    [32, 48, 16, '#f7c4d8'],
    [44, 30, 14, '#fbd9e6'],
  ] as const
  return (
    <ArtSvg viewBox="0 0 100 100">
      <ellipse cx="50" cy="90" rx="30" ry="7" fill="var(--g-shadow)" />
      <Rod d="M48 90 V58 M48 66 L36 54 M50 62 L62 50" c="#6b4423" w={5.4} perU={u} />
      {blobs.map(([x, y, r], i) => (
        <circle key={`o${i}`} cx={x} cy={y} r={r} fill={P.outline} {...ink(u)} strokeWidth={ink(u).strokeWidth * 2} />
      ))}
      {blobs.map(([x, y, r, c], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={c} />
      ))}
      {[[40, 40], [58, 34], [30, 52], [66, 52], [50, 56]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill={P.white} />
      ))}
    </ArtSvg>
  )
}

function Lavendel() {
  const u = 60 / 16
  return (
    <ArtSvg viewBox="0 0 60 24">
      <ellipse cx="30" cy="20" rx="28" ry="4" fill="var(--g-shadow)" />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <path d={`M${6 + i * 6} 20 V${8 + (i % 3) * 2}`} stroke="#6f8f5a" strokeWidth="1.4" />
          <ellipse cx={6 + i * 6} cy={7 + (i % 3) * 2} rx="2.2" ry="5" fill={P.lavender} {...ink(u, 'detail')} />
        </g>
      ))}
    </ArtSvg>
  )
}

function Kuerbisse() {
  const u = 40 / 11
  return (
    <ArtSvg viewBox="0 0 40 24">
      <ellipse cx="20" cy="21" rx="18" ry="3" fill="var(--g-shadow)" />
      <Rod d="M12 8 V5 M28 11.5 V9" c={P.leafMoss} w={1.6} perU={u} />
      <ellipse cx="12" cy="15" rx="9" ry="7" fill={P.orange} {...ink(u)} />
      <path d="M9 9 q-3 6 0 12 M15 9 q3 6 0 12" fill="none" stroke={P.outline} strokeWidth="0.6" opacity="0.4" />
      <ellipse cx="8" cy="12.5" rx="1.8" ry="2.4" fill={P.white} opacity="0.3" />
      <ellipse cx="28" cy="17" rx="7" ry="5.5" fill={P.amber} {...ink(u)} />
    </ArtSvg>
  )
}

/** Plätze der Gartenstil-Deko (haben Vorrang vor Fest-Deko und Blumeninseln). */
const SKIN_SPOTS: Record<string, readonly (Spot & { kind: 'sonnenblume' | 'kirschbaum' | 'lavendel' | 'kuerbisse' })[]> = {
  'skin-bauerngarten': [4, 9, 14, 86, 91, 96].map((x, i) => ({ left: x, top: 92 - (i % 2) * 1.5, w: 5, kind: 'sonnenblume' as const })),
  'skin-bluetenmeer': [
    { left: 94, top: 40, w: 20, kind: 'kirschbaum' },
    { left: 6, top: 62, w: 18, kind: 'kirschbaum' },
    { left: 72, top: 92, w: 16, kind: 'lavendel' },
  ],
  'skin-goldherbst': [
    { left: 72, top: 92, w: 11, kind: 'kuerbisse' },
    { left: 9, top: 62, w: 11, kind: 'kuerbisse' },
    { left: 92, top: 46, w: 10, kind: 'kuerbisse' },
  ],
}

/** Extra decor per Gartenstil — purely cosmetic. */
function SkinDecor({ skin }: { skin?: string }) {
  const spots = (skin && SKIN_SPOTS[skin]) || []
  if (!spots.length) return null
  return (
    <>
      {spots.map((sp) => (
        <Decor key={`${sp.left}/${sp.top}`} className="decor-skin" left={`${sp.left}%`} top={`${sp.top}%`} w={sp.w}>
          {sp.kind === 'sonnenblume' ? <Sonnenblume /> : sp.kind === 'kirschbaum' ? <Kirschbaum /> : sp.kind === 'lavendel' ? <Lavendel /> : <Kuerbisse />}
        </Decor>
      ))}
      {skin === 'skin-bluetenmeer' ? (
        <div className="ambient-particles p-petal skin-petals">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} style={{ left: `${(i * 17 + 9) % 100}%`, animationDelay: `${-i * 3}s` }} />
          ))}
        </div>
      ) : null}
    </>
  )
}

const pct = (v: string) => Number.parseFloat(v)

/** Spine of the garden: gate (bottom) → Omas Laube (top). */
const MAIN_PATH =
  'M50 104 C50 97 52 91 50 85 S44 75 47 67 S54 57 49 51 S45 42 49 37 L50 31'

function stubPath(x: number, y: number): string {
  const yy = y + 2.5
  const toX = x < 50 ? 47 : 51
  const mid = (x + toX) / 2
  return `M${x} ${yy} Q${mid} ${yy + 1.2} ${toX} ${yy + 0.4}`
}

function Decor({
  className,
  left,
  top,
  w,
  children,
  style,
}: {
  className: string
  left: string
  top: string
  /** width in --u units */
  w: number
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <div
      className={`garden-decor ${className}`}
      style={{ left, top, width: `calc(var(--u) * ${w})`, ...style }}
    >
      {children}
    </div>
  )
}

/** Omas Laube — wooden garden house with red roof, the story anchor. */
/** Fortschritt der Laube aus der Zahl der angelegten Bereiche (MapBackdrop stage). */
function laubePhase(stage: number): 'verfallen' | 'hergerichtet' | 'blumen' {
  return stage <= 2 ? 'verfallen' : stage <= 6 ? 'hergerichtet' : 'blumen'
}

/**
 * Omas Laube am Ende des Wegs, je Fortschritt: verfallen (Moos, Bretter
 * vorm Fenster, fehlende Ziegel, Unkraut) → hergerichtet → mit Blumen
 * (Rosenranke, Blumenkasten, Töpfe, Laterne). Folgt der Abend-/Nachtstimmung
 * (.plot-art); das Fenster leuchtet abends.
 */
export function Laube({ stage }: { stage: number }) {
  const phase = laubePhase(stage)
  const old = phase === 'verfallen'
  const bloom = phase === 'blumen'
  const u = 120 / 22
  const line = ink(u)
  const detail = ink(u, 'detail')
  const hair = ink(u, 'hair')
  const win = (x: number) => (
    <g>
      <rect x={x - 2} y="52" width="21" height="19" rx="1.5" fill={P.white} {...detail} />
      <rect x={x} y="54" width="17" height="15" fill={P.window} className="art-window" />
      <path d={`M${x + 8.5} 54 V69 M${x} 61.2 H${x + 17}`} stroke={P.outline} strokeWidth={hair.strokeWidth} opacity="0.7" />
    </g>
  )
  return (
    <ArtSvg viewBox="0 0 120 100" className="plot-art laube-art" data-phase={phase}>
      <ellipse cx="60" cy="92" rx="54" ry="7" fill="var(--g-shadow)" />
      {/* Schornstein */}
      <rect x="80" y="16" width="9" height="18" rx="1" fill={tone('#9b6a44')} {...detail} />
      <rect x="78.6" y="14" width="11.8" height="4" rx="1" fill={tone('#5a3a22')} {...hair} />
      {/* Wände: Licht links, Schatten rechts und am Sockel */}
      <rect x="18" y="42" width="84" height="48" rx="2" fill={old ? tone('#b9946a') : tone('#d9a56c')} {...line} />
      <path d={[30, 42, 54, 66, 78, 90].map((x) => `M${x} 45 V88`).join(' ')} stroke={P.outline} strokeWidth={hair.strokeWidth} opacity="0.3" />
      <rect x="19.5" y="43.5" width="20" height="45" fill={P.white} opacity="0.16" />
      <rect x="78" y="43.5" width="22.5" height="45" fill={P.outline} opacity="0.14" />
      <rect x="19.5" y="84" width="81" height="4.5" fill={P.outline} opacity="0.18" />
      {old ? <path d="M70 84 l8 -3 M22 78 l6 2" stroke={P.outline} strokeWidth={hair.strokeWidth} /> : null}
      {/* Dach */}
      <path d="M8 46 L60 12 L112 46 Z" fill={old ? tone('#9a5a48') : P.roof} {...line} />
      <path d="M60 15.6 L107 45 H60 Z" fill={P.outline} opacity="0.18" />
      <path d="M22 41 L60 17.4 L98 41 M33 35 L60 22.4 L87 35" fill="none" stroke={P.outline} strokeWidth={hair.strokeWidth} opacity="0.35" />
      <path d="M21 40.5 L44 25.5" fill="none" stroke={P.white} strokeWidth={detail.strokeWidth} strokeLinecap="round" opacity="0.4" />
      {old ? (
        <g>
          {/* Moos und fehlende Ziegel */}
          <path d="M14 44 q8 -6 16 -4 q6 -6 12 -3" fill="none" stroke={P.leafMoss} strokeWidth="4" strokeLinecap="round" />
          <path d="M72 30 l6 4 l-5 3 z M44 28 l5 3 l-4 2 z" fill={tone('#5a3a22')} {...hair} />
        </g>
      ) : null}
      {/* Tür */}
      <rect x="48" y="58" width="22" height="32" rx="2.5" fill={old ? tone('#8a8a6a') : tone('#7d9f5a')} {...line} />
      <path d="M59 60.5 V88" stroke={P.outline} strokeWidth={hair.strokeWidth} opacity="0.5" />
      <rect x="49.6" y="59.6" width="5" height="29" fill={P.white} opacity="0.16" />
      <circle cx="65.5" cy="75" r="1.8" fill={tone('#f2d27a')} {...hair} />
      {/* Fenster (leuchten abends) */}
      {win(25)}
      {win(78)}
      {old ? (
        <g>
          {/* Bretter vor dem Fenster */}
          <Rod d="M22 57 L45 66 M22 65 L45 58" c={tone('#8a6a40')} w={3} perU={u} />
          {/* Unkraut an der Wand */}
          {[20, 28, 92, 100].map((x, i) => (
            <path key={x} d={`M${x} 90 q${i % 2 ? 2 : -2} -8 ${i % 2 ? 1 : -1} -${12 + (i % 2) * 4}`} stroke={P.leafMoss} strokeWidth="2" strokeLinecap="round" fill="none" />
          ))}
        </g>
      ) : (
        <g>
          <path d="M25 54 Q30 61 27 69 M42 54 Q37 61 40 69" stroke={tone('#e98f8f')} strokeWidth="2" fill="none" />
          <rect x="21.5" y="70" width="24" height="5.6" rx="1.2" fill={tone('#8a5a3b')} {...detail} />
          {bloom ? (
            <g>
              <circle cx="27" cy="68.6" r="2.7" fill={P.red} {...hair} />
              <circle cx="33.5" cy="68" r="2.7" fill={P.yellow} {...hair} />
              <circle cx="40" cy="68.6" r="2.7" fill={P.red} {...hair} />
            </g>
          ) : (
            <g>
              <circle cx="29" cy="68.8" r="2.2" fill={P.leaf} {...hair} />
              <circle cx="38" cy="68.8" r="2.2" fill={P.leaf} {...hair} />
            </g>
          )}
        </g>
      )}
      {bloom ? (
        <g>
          {/* Rosenranke über der Tür, Töpfe und Laterne */}
          <Rod d="M45.5 90 V60 Q59 46 72.5 60 V90" c={P.leaf} w={2.2} perU={u} />
          {[[45.5, 76], [46.5, 63], [53, 54.6], [65, 54.6], [71.5, 63], [72.5, 77]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.9" fill={i % 2 ? P.pink : P.red} {...hair} />
          ))}
          <circle cx="38" cy="81.5" r="3.6" fill={P.lilac} {...hair} />
          <circle cx="82" cy="81.5" r="3.6" fill={P.yellow} {...hair} />
          <path d="M33.5 84 H42.5 L41.2 92 H34.8 Z M77.5 84 H86.5 L85.2 92 H78.8 Z" fill={P.terracotta} {...detail} />
          <path d="M106 46 V53" stroke={P.outline} strokeWidth={detail.strokeWidth} />
          <rect x="103.2" y="53" width="5.6" height="7" rx="1.2" fill={P.lamp} {...detail} />
        </g>
      ) : null}
      {/* Türstufe */}
      <rect x="43" y="88.6" width="32" height="4.6" rx="1.5" fill={tone('#c9c1b0')} {...detail} />
    </ArtSvg>
  )
}

function Regentonne() {
  const u = 40 / 7
  return (
    <ArtSvg viewBox="0 0 40 50">
      <ellipse cx="20" cy="46" rx="16" ry="3.5" fill="var(--g-shadow)" />
      <path d="M6 10 Q4 28 7 44 L33 44 Q36 28 34 10 Z" fill="#9a6b43" {...ink(u)} />
      <path d="M8.5 13 Q7 28 9.5 42 H14 Q12 28 13.5 13 Z" fill={P.white} opacity="0.18" />
      <path d="M27 13 Q28.5 28 26.5 42 H31 Q33.5 28 32 13 Z" fill={P.outline} opacity="0.16" />
      <Rod d="M5.6 19 Q20 21.5 34.4 19 M5.3 34 Q20 36.5 34.7 34" c={P.metal} w={2.2} perU={u * 0.7} />
      <ellipse cx="20" cy="10" rx="14" ry="4.5" fill="#6fb4d0" {...ink(u)} />
      <ellipse cx="16" cy="9" rx="5" ry="1.4" fill="#bfe6f2" opacity="0.8" />
    </ArtSvg>
  )
}

function Teich() {
  const u = 120 / 24
  return (
    <ArtSvg viewBox="0 0 120 80">
      <path
        d="M14 40 C10 22 34 10 58 12 C86 10 112 20 108 42 C106 62 80 72 56 70 C30 70 16 58 14 40 Z"
        fill="#bdb6a6"
        {...ink(u)}
      />
      <path d="M17 33 l5 2 M28 19 l3 4.4 M46 13 l1 5 M70 12.4 l-1 5 M90 17.6 l-3 4 M104 30 l-5 2 M105.6 50 l-5.4 -1.6 M92 63.4 l-2.6 -4.4 M70 69.4 l-.6 -5.4 M44 69 l1 -5.4 M24 59 l3.6 -3.6" stroke={P.outline} strokeWidth={ink(u, 'hair').strokeWidth} strokeLinecap="round" opacity="0.5" />
      <path
        d="M22 40 C20 26 40 18 58 19 C82 18 101 26 99 42 C97 57 78 63 57 62 C36 62 24 53 22 40 Z"
        fill={P.pond}
        {...ink(u, 'detail')}
      />
      <path d="M34 34 C44 28 62 26 74 30" stroke="#9fd6e8" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="44" cy="46" rx="8" ry="5" fill="#5f9a48" {...ink(u, 'hair')} />
      <path d="M44 46 L52 44" stroke={P.pond} strokeWidth="1.8" />
      <ellipse cx="76" cy="50" rx="7" ry="4.4" fill="#6fae52" {...ink(u, 'hair')} />
      <circle cx="78" cy="48" r="2.8" fill="#f4a6c0" {...ink(u, 'hair')} />
      {/* Schilf */}
      <Rod d="M98 30 Q100 14 96 6 M103 32 Q106 18 104 10 M93 32 Q94 20 90 14" c="#5f7f36" w={1.8} perU={u * 0.8} />
      <rect x="94.6" y="4" width="3.8" height="9.6" rx="1.9" fill="#7a4e2d" transform="rotate(-8 96 9)" {...ink(u, 'hair')} />
    </ArtSvg>
  )
}

function Baum({ tone = 0, season }: { tone?: number; season?: Ambient['season'] }) {
  const a = ['#6fae52', '#5f9a48', '#7dba5c'][tone % 3]
  const b = ['#4f8a3a', '#447a34', '#5c9945'][tone % 3]
  const u = 100 / 29
  const line = ink(u)
  return (
    <ArtSvg viewBox="0 0 100 100">
      <ellipse cx="50" cy="90" rx="34" ry="8" fill="var(--g-shadow)" />
      <rect x="44" y="60" width="12" height="30" rx="4" fill={P.bark} {...line} />
      <rect x="51.5" y="62" width="3.4" height="27" fill={P.outline} opacity="0.2" />
      {[[50, 42, 32], [32, 50, 20], [68, 50, 20]].map(([x, y, r], i) => (
        <circle key={`o${i}`} cx={x} cy={y} r={r} fill={b} {...line} strokeWidth={line.strokeWidth * 2} />
      ))}
      <circle cx="50" cy="42" r="32" fill={b} />
      <circle cx="32" cy="50" r="20" fill={b} />
      <circle cx="68" cy="50" r="20" fill={b} />
      <circle cx="44" cy="34" r="22" fill={a} />
      <circle cx="62" cy="38" r="18" fill={a} />
      <circle cx="40" cy="28" r="8" fill="#9fd07d" opacity="0.7" />
      {season === 'spring'
        ? [[30, 40], [44, 22], [58, 30], [70, 46], [36, 56], [52, 48], [64, 58], [26, 52], [48, 36]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3.2" fill={i % 3 ? '#fde3ee' : '#f7b6cf'} />
          ))
        : null}
      {season === 'autumn'
        ? [[30, 44], [56, 26], [68, 52], [40, 58]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill="#d2752c" />
          ))
        : null}
      {season === 'winter' ? (
        <g fill="#fbfdff">
          <ellipse cx="46" cy="14" rx="20" ry="5" />
          <ellipse cx="26" cy="34" rx="10" ry="3.4" />
          <ellipse cx="72" cy="36" rx="10" ry="3.4" />
        </g>
      ) : null}
    </ArtSvg>
  )
}

function Hecke() {
  return (
    <ArtSvg viewBox="0 0 200 30" preserveAspectRatio="none">
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={`o${i}`} cx={i * 15 + 6} cy={12 + (i % 2) * 2} r="10" fill="#3f7a34" stroke={P.outline} strokeWidth="4" vectorEffect="non-scaling-stroke" />
      ))}
      <rect x="0" y="10" width="200" height="20" fill="#3f7a34" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={i * 15 + 6} cy={12 + (i % 2) * 2} r="10" fill={i % 2 ? '#4f8a3a' : '#5a9a44'} />
      ))}
    </ArtSvg>
  )
}

/** Jägerzaun with a garden gate in the middle. */
function Zaun() {
  const pickets = useSvgId('gz-pickets')
  return (
    <ArtSvg viewBox="0 0 400 40" preserveAspectRatio="none">
      <defs>
        <pattern id={pickets} width="14" height="40" patternUnits="userSpaceOnUse">
          <path d="M2 40 L2 12 L5 7 L8 12 L8 40 Z" fill={P.paper} stroke={P.outline} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M6.2 13 V40" stroke={P.outline} strokeWidth="1.2" opacity="0.16" />
        </pattern>
      </defs>
      <rect x="-2" y="15.4" width="404" height="5" fill="#cdb98f" stroke={P.outline} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <rect x="-2" y="27.4" width="404" height="5" fill="#cdb98f" stroke={P.outline} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <rect x="0" y="0" width="168" height="40" fill={`url(#${pickets})`} />
      <rect x="232" y="0" width="168" height="40" fill={`url(#${pickets})`} />
      {/* open gate */}
      <rect x="165" y="5" width="7" height="36" rx="1.5" fill="#a77d4c" stroke={P.outline} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <rect x="228" y="5" width="7" height="36" rx="1.5" fill="#a77d4c" stroke={P.outline} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </ArtSvg>
  )
}

function Bank() {
  const u = 60 / 11
  const line = ink(u)
  return (
    <ArtSvg viewBox="0 0 60 36">
      <ellipse cx="30" cy="32" rx="26" ry="4" fill="var(--g-shadow)" />
      <rect x="9" y="21" width="4.4" height="11" rx="1" fill={P.woodDark} {...ink(u, 'detail')} />
      <rect x="46.6" y="21" width="4.4" height="11" rx="1" fill={P.woodDark} {...ink(u, 'detail')} />
      <rect x="6" y="5" width="48" height="7" rx="2" fill="#b07a4a" {...line} />
      <rect x="4" y="15.5" width="52" height="8" rx="2" fill="#c48a55" {...line} />
      <rect x="6" y="17" width="14" height="5" fill={P.white} opacity="0.18" />
      <rect x="40" y="17" width="14" height="5" fill={P.outline} opacity="0.14" />
    </ArtSvg>
  )
}

const FLOWER_COLORS = [P.red, P.yellow, P.white, '#c76bd9', P.pink, '#ff9b3d']

function Blumen({ seed }: { seed: number }) {
  const u = 40 / 9
  const dots = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 + seed
    const r = 6 + ((i * 7 + seed * 3) % 5)
    return { x: 20 + Math.cos(a) * r, y: 14 + Math.sin(a) * r * 0.6, c: FLOWER_COLORS[(i + seed) % 6] }
  })
  return (
    <ArtSvg viewBox="0 0 40 28">
      <ellipse cx="20" cy="15" rx="17" ry="10" fill="#5f9a48" {...ink(u, 'detail')} />
      <ellipse cx="17" cy="12" rx="10" ry="6" fill="#74b257" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="2.8" fill={d.c} {...ink(u, 'hair')} />
      ))}
    </ArtSvg>
  )
}

/** Brambles / nettles left over from the overgrown years. */
function WildBusch({ seed }: { seed: number }) {
  const u = 50 / 11
  return (
    <ArtSvg viewBox="0 0 50 34">
      <ellipse cx="25" cy="30" rx="22" ry="4" fill="var(--g-shadow)" />
      <path
        d="M4 28 C2 16 12 8 20 12 C24 2 38 4 40 14 C48 14 50 26 44 30 Z"
        fill="#4d6b33"
        {...ink(u, 'detail')}
      />
      <path
        d={`M8 24 Q16 ${14 + (seed % 3)} 22 22 M26 22 Q34 10 42 24 M14 18 L12 14 M34 16 L37 12`}
        stroke="#7a5a3a"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={18 + (seed % 4)} cy="18" r="1.8" fill="#4a2350" />
      <circle cx="31" cy="20" r="1.8" fill="#4a2350" />
      <circle cx="36" cy="24" r="1.6" fill="#7a2f3a" />
    </ArtSvg>
  )
}

function Lichterkette() {
  return (
    <ArtSvg viewBox="0 0 100 20" preserveAspectRatio="none">
      <path d="M0 4 Q25 16 50 6 Q75 -2 100 8" stroke={P.outline} strokeWidth="1.3" fill="none" vectorEffect="non-scaling-stroke" />
      {[8, 20, 32, 44, 56, 68, 80, 92].map((x, i) => (
        <circle key={x} className="garden-bulb" cx={x} cy={i % 2 ? 9 : 11} r="1.7" fill={P.lamp} stroke={P.outline} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      ))}
    </ArtSvg>
  )
}

function Schmetterling({ hue }: { hue: string }) {
  const u = 20 / 4
  return (
    <ArtSvg viewBox="0 0 20 16">
      <ellipse cx="6" cy="6" rx="5" ry="4.5" fill={hue} {...ink(u, 'hair')} />
      <ellipse cx="14" cy="6" rx="5" ry="4.5" fill={hue} {...ink(u, 'hair')} />
      <ellipse cx="7" cy="12" rx="3.4" ry="3" fill={hue} {...ink(u, 'hair')} />
      <ellipse cx="13" cy="12" rx="3.4" ry="3" fill={hue} {...ink(u, 'hair')} />
      <rect x="9.3" y="3" width="1.4" height="11" rx="0.7" fill="#3a2a1a" />
    </ArtSvg>
  )
}

/** Wild clumps vanish one by one as the garden is angelegt. */
const WILD_CLUMPS = [
  { left: 47, top: 77, until: 1 },
  { left: 7, top: 63, until: 2 },
  { left: 92, top: 47, until: 3 },
  { left: 56, top: 57, until: 4 },
  { left: 6, top: 37, until: 5 },
  { left: 93, top: 37, until: 6 },
  { left: 8, top: 51, until: 7 },
]

/** Flower clusters bloom in as the garden grows. */
const FLOWERS = [
  { left: 72, top: 91, from: 1 },
  { left: 51, top: 75, from: 2 },
  { left: 7, top: 63, from: 3 },
  { left: 56, top: 57, from: 4 },
  { left: 92, top: 59, from: 4 },
  { left: 92, top: 47, from: 5 },
  { left: 56, top: 50, from: 6 },
  { left: 8, top: 51, from: 7 },
  { left: 6, top: 37, from: 8 },
  { left: 93, top: 37, from: 9 },
  { left: 10, top: 82, from: 10 },
]

/** Seasonal particles — a handful of transform-only elements. */
function Particles({ ambient }: { ambient: Ambient }) {
  const kind =
    ambient.season === 'winter'
      ? 'snow'
      : ambient.season === 'autumn'
        ? 'leaf'
        : ambient.season === 'spring'
          ? 'petal'
          : ambient.daypart === 'night' || ambient.daypart === 'evening'
            ? 'firefly'
            : null
  if (!kind) return null
  return (
    <div className={`ambient-particles p-${kind}`}>
      {Array.from({ length: 8 }, (_, i) => (
        <span key={i} style={{ left: `${(i * 13 + 7) % 100}%`, animationDelay: `${-i * 2.1}s` }} />
      ))}
    </div>
  )
}

/** Memoized: re-renders only when the stage or ambient mood changes. */
export const MapBackdrop = memo(function MapBackdrop({ stage, ambient, skin, fest, weather }: Props) {
  const grass = useSvgId('gg-grass')
  const light = useSvgId('gg-light')
  // Ein Platz, ein Stück: Gartenstil-Deko vor Fest-Deko vor Blumeninseln und Wildbüschen
  const skinSpots = (skin && SKIN_SPOTS[skin]) || []
  const taken = [...skinSpots, ...festSpots(fest, skin, skinSpots)]
  const free = (left: number, top: number, w: number) => !taken.some((sp) => spotsCollide(sp, { left, top, w }))
  return (
    <div className="garden-ground" aria-hidden="true" data-stage={stage}>
      <ArtSvg
        className="garden-ground-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={grass} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: 'var(--g-grass-far)' }} />
            <stop offset="55%" style={{ stopColor: 'var(--g-grass)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--g-grass-near)' }} />
          </linearGradient>
          <radialGradient id={light} cx="62%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#fffbe0" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#fffbe0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${grass})`} />
        {/* mowing stripes */}
        {Array.from({ length: 9 }, (_, i) => (
          <rect
            key={i}
            x={i * 12 - 4}
            y="0"
            width="6"
            height="100"
            fill={P.white}
            opacity="0.045"
          />
        ))}
        <rect width="100" height="100" fill={`url(#${light})`} />

        {/* path edge, then gravel */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {GENERATORS.map((g) => (
            <path
              key={`e-${g.id}`}
              d={stubPath(pct(g.slot.left), pct(g.slot.top))}
              stroke="var(--g-path-edge)"
              strokeWidth="18"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={MAIN_PATH} stroke="var(--g-path-edge)" strokeWidth="30" vectorEffect="non-scaling-stroke" />
          {GENERATORS.map((g) => (
            <path
              key={`p-${g.id}`}
              d={stubPath(pct(g.slot.left), pct(g.slot.top))}
              stroke="var(--g-path)"
              strokeWidth="13"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={MAIN_PATH} stroke="var(--g-path)" strokeWidth="24" vectorEffect="non-scaling-stroke" />
          <path
            d={MAIN_PATH}
            stroke="var(--g-path-speck)"
            strokeWidth="24"
            strokeDasharray="1 5"
            vectorEffect="non-scaling-stroke"
            opacity="0.7"
          />
        </g>
      </ArtSvg>

      {weather ? <WeatherLayer weather={weather} season={ambient.season} ground /> : null}

      {/* far edge: hedge behind the HUD, Laube at the end of the path */}
      <div className="garden-hedge">
        <Hecke />
      </div>
      <Decor className="decor-tree" left="-3%" top="17%" w={30}>
        <Baum tone={1} season={ambient.season} />
      </Decor>
      <Decor className="decor-tree" left="103%" top="14%" w={32}>
        <Baum tone={0} season={ambient.season} />
      </Decor>
      <Decor className="decor-laube" left="50%" top="26.5%" w={22}>
        <Laube stage={stage} />
        <span className="laube-glow" />
      </Decor>
      <Decor className="decor-tonne" left="5%" top="29%" w={7}>
        <Regentonne />
      </Decor>

      <Decor className="decor-tree" left="-5%" top="76%" w={28}>
        <Baum tone={2} season={ambient.season} />
      </Decor>
      <Decor className="decor-tree" left="104%" top="64%" w={26}>
        <Baum tone={1} season={ambient.season} />
      </Decor>
      <Decor className="decor-teich" left="92%" top="66%" w={24}>
        <Teich />
      </Decor>
      {stage >= 6 ? (
        <Decor className="decor-bank" left="93%" top="75%" w={11}>
          <Bank />
        </Decor>
      ) : null}

      {WILD_CLUMPS.filter((c) => stage < c.until && free(c.left, c.top, 11)).map((c, i) => (
        <Decor key={`w${i}`} className="decor-wild" left={`${c.left}%`} top={`${c.top}%`} w={11}>
          <WildBusch seed={i} />
        </Decor>
      ))}
      {FLOWERS.filter((f) => stage >= f.from && free(f.left, f.top, 9)).map((f, i) => (
        <Decor key={`f${i}`} className="decor-flowers" left={`${f.left}%`} top={`${f.top}%`} w={9}>
          <Blumen seed={i} />
        </Decor>
      ))}

      {stage >= 9 ? (
        <div className="garden-lights">
          <Lichterkette />
        </div>
      ) : null}
      {stage >= 4 ? (
        <>
          <Decor className="decor-butterfly b1" left="44%" top="63%" w={4}>
            <Schmetterling hue={P.yellow} />
          </Decor>
          <Decor className="decor-butterfly b2" left="56%" top="48%" w={3.6}>
            <Schmetterling hue={P.white} />
          </Decor>
        </>
      ) : null}
      {stage >= 7 ? (
        <Decor className="decor-butterfly b3" left="40%" top="38%" w={3.6}>
          <Schmetterling hue={P.pink} />
        </Decor>
      ) : null}

      <SkinDecor skin={skin} />
      {fest ? <FestDecor fest={fest} skin={skin} blocked={skinSpots} /> : null}
      {fest ? <FestSkinDecor skin={skin} fest={fest} /> : null}

      <div className="garden-fence">
        <Zaun />
      </div>

      <div className="ambient-tint" />
      <Particles ambient={ambient} />
    </div>
  )
})
