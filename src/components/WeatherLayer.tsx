import { memo } from 'react'
import type { Weather } from '../game/gardenLife'
import type { Season } from '../theme/ambient'
import { ArtSvg } from '../theme/ArtSvg'
import { P } from '../theme/art/palette'

/**
 * Wetter auf der Karte (nur Darstellung): Pfützen mit Regenringen bei Regen,
 * umgewehte Halme und wirbelnde Blätter bei Wind. Folgt dem Tageswetter
 * (weatherAt) wie die Wetter-Pille. `?wetter=regen|wind` erzwingt es für Tests
 * (weatherOverride in theme/ambient.ts).
 */
const PUDDLES = [
  { left: 50, top: 50, w: 13 },
  { left: 41, top: 66, w: 15 },
  { left: 57, top: 79, w: 12 },
  { left: 25, top: 56, w: 10 },
  { left: 80, top: 49, w: 10 },
]
const TUFTS = [
  { left: 12, top: 52 },
  { left: 86, top: 66 },
  { left: 24, top: 88 },
  { left: 78, top: 37 },
  { left: 63, top: 91 },
  { left: 36, top: 44 },
]

export const WeatherLayer = memo(function WeatherLayer({ weather, season }: { weather: Weather; season: Season }) {
  if (weather === 'regen') {
    const frozen = season === 'winter'
    return (
      <div className="weather-layer weather-regen" aria-hidden="true">
        {PUDDLES.map((p, i) => (
          <div key={i} className="weather-puddle" style={{ left: `${p.left}%`, top: `${p.top}%`, width: `calc(var(--u) * ${p.w})` }}>
            <ArtSvg viewBox="0 0 40 14">
              <ellipse cx="20" cy="7" rx="19" ry="6" fill={frozen ? P.frost : P.water} fillOpacity={frozen ? 0.9 : 0.72} stroke={P.waterDeep} strokeOpacity="0.35" strokeWidth="0.8" />
              <ellipse cx="14" cy="5.4" rx="7" ry="1.6" fill={P.white} fillOpacity="0.35" />
              {!frozen ? <ellipse className="weather-ring" cx={12 + i * 4} cy="7.6" rx="3" ry="1.1" fill="none" stroke={P.white} strokeWidth="0.6" /> : null}
            </ArtSvg>
          </div>
        ))}
      </div>
    )
  }
  if (weather === 'wind') {
    return (
      <div className="weather-layer weather-wind" aria-hidden="true">
        {TUFTS.map((p, i) => (
          <div key={i} className="weather-tuft" style={{ left: `${p.left}%`, top: `${p.top}%` }}>
            <ArtSvg viewBox="0 0 20 16">
              {/* Halme vom Wind umgebogen */}
              <path d="M2 16 Q4 8 13 4 M6 16 Q8 9 17 6 M9 16 Q11 11 19 9 M13 16 Q15 13 20 12" fill="none" stroke={P.leafMoss} strokeWidth="1.5" strokeLinecap="round" />
            </ArtSvg>
          </div>
        ))}
        {[0, 1, 2].map((i) => (
          <span key={i} className={`weather-leaf l${i}`}>
            <ArtSvg viewBox="0 0 8 5">
              <ellipse cx="4" cy="2.5" rx="3.6" ry="2" fill={season === 'autumn' ? P.autumn : P.leaf} />
            </ArtSvg>
          </span>
        ))}
      </div>
    )
  }
  return null
})
