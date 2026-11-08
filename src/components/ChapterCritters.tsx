import { memo } from 'react'
import type { ChapterId } from '../game/chapters'
import type { Daypart } from '../theme/ambient'

/**
 * Chapter life (pure CSS animation, see expansion.css):
 * Bauernhof — chickens + a wandering cat; Imkerei — bee swarms;
 * Teich — ducks crossing the lake, jumping fish, dragonflies.
 */
export const ChapterCritters = memo(function ChapterCritters({ chapter, daypart }: { chapter: ChapterId; daypart: Daypart }) {
  const night = daypart === 'night'
  if (chapter === 'bauernhof') {
    return (
      <div className="critters" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`critter chicken c${i} farm`}>
            <svg viewBox="0 0 20 18" focusable="false">
              <ellipse cx="9" cy="11" rx="6.5" ry="5" fill={i === 1 ? '#a5733f' : '#fbf6e8'} stroke="#8a6a40" strokeWidth=".7" />
              <g className="chicken-head">
                <circle cx="15" cy="7" r="3" fill={i === 1 ? '#a5733f' : '#fbf6e8'} stroke="#8a6a40" strokeWidth=".7" />
                <path d="M17.6 7l2 .8-2 .6z" fill="#e8b422" />
                <path d="M14.4 3.8q1-1.6 2 0" fill="#e0485e" />
              </g>
              <path d="M7 16v2M10 16v2" stroke="#e8b422" strokeWidth=".9" />
            </svg>
          </div>
        ))}
        {!night ? (
          <div className="critter farm-cat">
            <svg viewBox="0 0 24 14" focusable="false">
              <ellipse cx="11" cy="9" rx="7" ry="3.4" fill="#e08a3a" />
              <circle cx="18.5" cy="6.5" r="3" fill="#e08a3a" />
              <path d="M16.6 4l.6-2.6 1.6 2M19.4 4l1-2.4 1 2.4" fill="#e08a3a" />
              <path d="M4 8q-4-1-3-6" stroke="#e08a3a" strokeWidth="1.6" fill="none" />
              <path d="M7 12v2M14 12v2" stroke="#c4651f" strokeWidth="1.2" />
            </svg>
          </div>
        ) : null}
      </div>
    )
  }
  if (chapter === 'imkerei') {
    return (
      <div className="critters" aria-hidden="true">
        {night
          ? null
          : Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`critter bee-trail swarm b${i % 4}`} style={{ top: `${30 + (i % 4) * 14}%`, left: `${20 + (i * 9) % 60}%` }}>
                <svg viewBox="0 0 8 6" focusable="false">
                  <ellipse cx="4" cy="3.4" rx="2.6" ry="1.9" fill="#f5c542" stroke="#4a3208" strokeWidth=".5" />
                  <path d="M3.4 1.6v3.6M4.8 1.6v3.6" stroke="#4a3208" strokeWidth=".5" />
                  <ellipse cx="3.4" cy="1.2" rx="1.4" ry=".9" fill="#fff" opacity=".8" />
                </svg>
              </div>
            ))}
        {night ? Array.from({ length: 8 }, (_, i) => <span key={i} className="firefly" style={{ left: `${10 + i * 11}%`, top: `${40 + ((i * 17) % 40)}%` }} />) : null}
      </div>
    )
  }
  if (chapter === 'teich') {
    return (
      <div className="critters" aria-hidden="true">
        <div className="critter duck-cross">
          <svg viewBox="0 0 30 12" focusable="false">
            {[0, 10, 18].map((x, i) => (
              <g key={x} transform={`translate(${x} ${i === 0 ? 0 : 3}) scale(${i === 0 ? 1 : 0.6})`}>
                <ellipse cx="6" cy="8" rx="5.4" ry="3" fill="#8a6a40" />
                <circle cx="10" cy="4.6" r="2.2" fill={i === 0 ? '#3f7a30' : '#a5733f'} />
                <path d="M12 4.6l2 .6-2 .6z" fill="#f08a2c" />
              </g>
            ))}
          </svg>
        </div>
        {!night ? (
          <>
            <div className="critter fish-jump">
              <svg viewBox="0 0 12 8" focusable="false">
                <ellipse cx="6" cy="4" rx="4.6" ry="2" fill="#c49a8a" />
                <path d="M1.4 4l-1.4 -2v4z" fill="#c49a8a" />
              </svg>
            </div>
            <div className="critter dragonfly">
              <svg viewBox="0 0 14 8" focusable="false">
                <path d="M1 4h12" stroke="#3d8db8" strokeWidth="1.2" />
                <ellipse cx="6" cy="2" rx="3" ry="1.2" fill="#cfe8f4" opacity=".8" />
                <ellipse cx="6" cy="6" rx="3" ry="1.2" fill="#cfe8f4" opacity=".8" />
              </svg>
            </div>
          </>
        ) : (
          Array.from({ length: 6 }, (_, i) => <span key={i} className="firefly" style={{ left: `${12 + i * 14}%`, top: `${36 + ((i * 13) % 30)}%` }} />)
        )}
      </div>
    )
  }
  return null
})
