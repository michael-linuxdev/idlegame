import { memo } from 'react'
import type { Weather } from '../game/gardenLife'
import type { Season } from '../theme/ambient'
import { ArtSvg } from '../theme/ArtSvg'
import { P } from '../theme/art/palette'

/**
 * Wetter auf der Karte (nur Darstellung): Pfützen mit Regenringen bei Regen
 * (`ground`: in der Bodenebene der Kulisse), umgewehte Halme und wirbelnde
 * Blätter bei Wind (über der Karte). Folgt dem Tageswetter
 * (weatherAt) wie die Wetter-Pille. `?wetter=regen|wind` erzwingt es für Tests
 * (weatherOverride in theme/ambient.ts).
 */
/**
 * Pfützen liegen auf freien Stellen: ausgemessen gegen Bereiche mit Schild,
 * Blumeninseln, Wildbüsche, Dekoplätze, Teich, Bank und die Deko aller neun
 * Feste. Sie gehören zum Boden (MapBackdrop zeichnet sie unter aller Deko).
 */
const PUDDLES = [
  { left: 80, top: 37, w: 10 },
  { left: 54, top: 53, w: 11 },
  { left: 40, top: 67, w: 11 },
  { left: 56, top: 87.5, w: 12 },
  { left: 31.5, top: 90.5, w: 12 },
]
const TUFTS = [
  { left: 12, top: 52 },
  { left: 86, top: 66 },
  { left: 24, top: 88 },
  { left: 78, top: 37 },
  { left: 63, top: 91 },
  { left: 36, top: 44 },
]

export const WeatherLayer = memo(function WeatherLayer({ weather, season, ground = false }: { weather: Weather; season: Season; ground?: boolean }) {
  if (weather === 'regen') {
    // Pfützen zeichnet nur die Bodenebene, sonst lägen sie über Laternen und Beeten
    if (!ground) return null
    const frozen = season === 'winter'
    return (
      <div className="weather-layer weather-regen weather-ground" aria-hidden="true">
        {PUDDLES.map((p, i) => (
          <div key={i} className="weather-puddle" style={{ left: `${p.left}%`, top: `${p.top}%`, width: `calc(var(--u) * ${p.w})` }}>
            <ArtSvg viewBox="0 0 40 14">
              <ellipse cx="20" cy="7" rx="19" ry="6" fill={frozen ? P.frost : P.water} fillOpacity={frozen ? 0.9 : 0.72} stroke={P.outline} strokeOpacity="0.7" strokeWidth="1.1" />
              <ellipse cx="14" cy="5.4" rx="7" ry="1.6" fill={P.white} fillOpacity="0.35" />
              {!frozen ? <ellipse className="weather-ring" cx={12 + i * 4} cy="7.6" rx="3" ry="1.1" fill="none" stroke={P.white} strokeWidth="0.6" /> : null}
            </ArtSvg>
          </div>
        ))}
      </div>
    )
  }
  if (weather === 'wind' && !ground) {
    return (
      <div className="weather-layer weather-wind" aria-hidden="true">
        {TUFTS.map((p, i) => (
          <div key={i} className="weather-tuft" style={{ left: `${p.left}%`, top: `${p.top}%` }}>
            <ArtSvg viewBox="0 0 20 16">
              {/* Halme vom Wind umgebogen */}
              <path d="M2 16 Q4 8 13 4 M6 16 Q8 9 17 6 M9 16 Q11 11 19 9 M13 16 Q15 13 20 12" fill="none" stroke={P.outline} strokeWidth="2.7" strokeLinecap="round" />
              <path d="M2 16 Q4 8 13 4 M6 16 Q8 9 17 6 M9 16 Q11 11 19 9 M13 16 Q15 13 20 12" fill="none" stroke={P.leafLight} strokeWidth="1.3" strokeLinecap="round" />
            </ArtSvg>
          </div>
        ))}
        {[0, 1, 2].map((i) => (
          <span key={i} className={`weather-leaf l${i}`}>
            <ArtSvg viewBox="0 0 8 5">
              <ellipse cx="4" cy="2.5" rx="3.2" ry="1.8" fill={season === 'autumn' ? P.autumn : P.leaf} stroke={P.outline} strokeWidth="0.7" />
            </ArtSvg>
          </span>
        ))}
      </div>
    )
  }
  return null
})
