/** Freie und gesperrte Plätze der Kapitel-Karten (80×72). */
import { ArtSvg } from '../../ArtSvg'
import { P } from '../palette'

/** Unplanted spot: tilled earth with a little sign. */
export function ChapterReady() {
  return (
    <ArtSvg viewBox="0 0 80 72">
      <ellipse cx="40" cy="60" rx="26" ry="7" fill={P.outlineSoft} opacity="0.55" />
      <path d="M22 58h36M26 62h28" stroke={P.outlineWood} strokeWidth=".8" opacity=".6" />
      <path d="M40 60V44" stroke={P.outlineSoft} strokeWidth="1.6" />
      <rect x="33" y="38" width="14" height="8" rx="1.4" fill={P.paper} stroke={P.outlineSoft} strokeWidth=".8" />
    </ArtSvg>
  )
}

/** Overgrown spot (locked). */
export function ChapterWild({ seed = 0 }: { seed?: number }) {
  return (
    <ArtSvg viewBox="0 0 80 72">
      <ellipse cx="40" cy="60" rx="28" ry="8" fill={P.leaf} opacity="0.5" />
      <ellipse cx="26" cy="52" rx="12" ry="9" fill="#6d9a3f" />
      <ellipse cx="54" cy="54" rx="13" ry="8" fill={P.leaf} />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M${18 + i * 8} 62q${i % 2 ? 2 : -2} -${10 + ((i + seed) % 3) * 4} ${i % 2 ? 4 : -2} -${14 + ((i + seed) % 4) * 3}`} stroke="#a3b85a" strokeWidth="1.4" fill="none" />
      ))}
    </ArtSvg>
  )
}
