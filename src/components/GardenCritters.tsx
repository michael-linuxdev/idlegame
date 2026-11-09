import { memo } from 'react'
import type { Daypart } from '../theme/ambient'
import { ArtSvg } from '../theme/ArtSvg'
import { P } from '../theme/art/palette'

interface Props {
  /** Hühnerstall planted → chickens peck around it */
  chickens: boolean
  /** Bienenstock planted → bees fly to the hive */
  bees: boolean
  daypart: Daypart
}

/**
 * Small animated life on the garden map (pure CSS, see expansion.css):
 * pecking chickens near the Hühnerstall, a bee trail to the Bienenstock,
 * fireflies and a hedgehog at night, morning mist.
 */
export const GardenCritters = memo(function GardenCritters({ chickens, bees, daypart }: Props) {
  return (
    <div className="critters" aria-hidden="true">
      {chickens
        ? [0, 1, 2].map((i) => (
            <div key={i} className={`critter chicken c${i}`}>
              <ArtSvg viewBox="0 0 20 18">
                <ellipse cx="9" cy="11" rx="6.5" ry="5" fill={i === 1 ? P.woodMid : P.cream} stroke={P.outlineSoft} strokeWidth=".7" />
                <g className="chicken-head">
                  <circle cx="15" cy="7" r="3" fill={i === 1 ? P.woodMid : P.cream} stroke={P.outlineSoft} strokeWidth=".7" />
                  <path d="M17.6 7l2 .8-2 .6z" fill={P.gold} />
                  <path d="M14.4 3.8q1-1.6 2 0" fill={P.red} />
                  <circle cx="15.6" cy="6.6" r=".5" fill="#1f1a14" />
                </g>
                <path d="M7 16v2M10 16v2" stroke={P.gold} strokeWidth=".9" />
              </ArtSvg>
            </div>
          ))
        : null}
      {bees
        ? [0, 1, 2, 3].map((i) => (
            <div key={i} className={`critter bee-trail b${i}`}>
              <ArtSvg viewBox="0 0 8 6">
                <ellipse cx="4" cy="3.4" rx="2.6" ry="1.9" fill={P.yellow} stroke="#4a3208" strokeWidth=".5" />
                <path d="M3.4 1.6v3.6M4.8 1.6v3.6" stroke="#4a3208" strokeWidth=".5" />
                <ellipse cx="3.4" cy="1.2" rx="1.4" ry=".9" fill={P.white} opacity=".8" />
              </ArtSvg>
            </div>
          ))
        : null}
      {daypart === 'night' || daypart === 'evening'
        ? Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className="firefly"
              style={{ left: `${(i * 23 + 7) % 92 + 4}%`, top: `${36 + ((i * 37) % 52)}%`, animationDelay: `${-i * 0.9}s` }}
            />
          ))
        : null}
      {daypart === 'night' ? (
        <div className="critter hedgehog">
          <ArtSvg viewBox="0 0 24 14">
            <path d="M3 12q1-9 10-9t9 8z" fill="#6e5a44" />
            {Array.from({ length: 7 }, (_, i) => (
              <path key={i} d={`M${6 + i * 2} ${5 + (i % 2)}l1-3`} stroke="#4a3a2a" strokeWidth=".8" />
            ))}
            <path d="M18 9q4 0 5 2l-4 1z" fill={P.woodLight} />
            <circle cx="22.6" cy="11" r=".7" fill="#1f1a14" />
          </ArtSvg>
        </div>
      ) : null}
      {daypart === 'morning' ? <div className="morning-mist" /> : null}
    </div>
  )
})
