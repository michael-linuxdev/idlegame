import { memo } from 'react'
import type { ChapterId } from '../game/chapters'
import type { Daypart } from '../theme/ambient'
import { ArtSvg } from '../theme/ArtSvg'

/**
 * Chapter life (pure CSS animation, see expansion.css):
 * Bauernhof — chickens + a wandering cat; Imkerei — bee swarms;
 * Teich — ducks crossing the lake, jumping fish, dragonflies;
 * Kräuter — butterflies + a hopping blackbird; Botanik — strolling peacock +
 * blue butterflies; Alm — marmot on the lookout + circling eagle;
 * Lavendel — bees + butterflies; Japan — koi in the pond, heron, cherry
 * petals in spring; Gartenschau — strolling visitors + balloons.
 */
const BEE = (
  <ArtSvg viewBox="0 0 8 6">
    <ellipse cx="4" cy="3.4" rx="2.6" ry="1.9" fill="#f5c542" stroke="#4a3208" strokeWidth=".5" />
    <path d="M3.4 1.6v3.6M4.8 1.6v3.6" stroke="#4a3208" strokeWidth=".5" />
    <ellipse cx="3.4" cy="1.2" rx="1.4" ry=".9" fill="#fff" opacity=".8" />
  </ArtSvg>
)

export const ChapterCritters = memo(function ChapterCritters({ chapter, daypart, season }: { chapter: ChapterId; daypart: Daypart; season?: string }) {
  const night = daypart === 'night'
  if (chapter === 'bauernhof') {
    return (
      <div className="critters" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`critter chicken c${i} farm`}>
            <ArtSvg viewBox="0 0 20 18">
              <ellipse cx="9" cy="11" rx="6.5" ry="5" fill={i === 1 ? '#a5733f' : '#fbf6e8'} stroke="#8a6a40" strokeWidth=".7" />
              <g className="chicken-head">
                <circle cx="15" cy="7" r="3" fill={i === 1 ? '#a5733f' : '#fbf6e8'} stroke="#8a6a40" strokeWidth=".7" />
                <path d="M17.6 7l2 .8-2 .6z" fill="#e8b422" />
                <path d="M14.4 3.8q1-1.6 2 0" fill="#e0485e" />
              </g>
              <path d="M7 16v2M10 16v2" stroke="#e8b422" strokeWidth=".9" />
            </ArtSvg>
          </div>
        ))}
        {!night ? (
          <div className="critter farm-cat">
            <ArtSvg viewBox="0 0 24 14">
              <ellipse cx="11" cy="9" rx="7" ry="3.4" fill="#e08a3a" />
              <circle cx="18.5" cy="6.5" r="3" fill="#e08a3a" />
              <path d="M16.6 4l.6-2.6 1.6 2M19.4 4l1-2.4 1 2.4" fill="#e08a3a" />
              <path d="M4 8q-4-1-3-6" stroke="#e08a3a" strokeWidth="1.6" fill="none" />
              <path d="M7 12v2M14 12v2" stroke="#c4651f" strokeWidth="1.2" />
            </ArtSvg>
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
                <ArtSvg viewBox="0 0 8 6">
                  <ellipse cx="4" cy="3.4" rx="2.6" ry="1.9" fill="#f5c542" stroke="#4a3208" strokeWidth=".5" />
                  <path d="M3.4 1.6v3.6M4.8 1.6v3.6" stroke="#4a3208" strokeWidth=".5" />
                  <ellipse cx="3.4" cy="1.2" rx="1.4" ry=".9" fill="#fff" opacity=".8" />
                </ArtSvg>
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
          <ArtSvg viewBox="0 0 30 12">
            {[0, 10, 18].map((x, i) => (
              <g key={x} transform={`translate(${x} ${i === 0 ? 0 : 3}) scale(${i === 0 ? 1 : 0.6})`}>
                <ellipse cx="6" cy="8" rx="5.4" ry="3" fill="#8a6a40" />
                <circle cx="10" cy="4.6" r="2.2" fill={i === 0 ? '#3f7a30' : '#a5733f'} />
                <path d="M12 4.6l2 .6-2 .6z" fill="#f08a2c" />
              </g>
            ))}
          </ArtSvg>
        </div>
        {!night ? (
          <>
            <div className="critter fish-jump">
              <ArtSvg viewBox="0 0 12 8">
                <ellipse cx="6" cy="4" rx="4.6" ry="2" fill="#c49a8a" />
                <path d="M1.4 4l-1.4 -2v4z" fill="#c49a8a" />
              </ArtSvg>
            </div>
            <div className="critter dragonfly">
              <ArtSvg viewBox="0 0 14 8">
                <path d="M1 4h12" stroke="#3d8db8" strokeWidth="1.2" />
                <ellipse cx="6" cy="2" rx="3" ry="1.2" fill="#cfe8f4" opacity=".8" />
                <ellipse cx="6" cy="6" rx="3" ry="1.2" fill="#cfe8f4" opacity=".8" />
              </ArtSvg>
            </div>
          </>
        ) : (
          Array.from({ length: 6 }, (_, i) => <span key={i} className="firefly" style={{ left: `${12 + i * 14}%`, top: `${36 + ((i * 13) % 30)}%` }} />)
        )}
      </div>
    )
  }
  if (chapter === 'kraeuter' || chapter === 'botanik') {
    const blue = chapter === 'botanik'
    return (
      <div className="critters" aria-hidden="true">
        {!night
          ? [0, 1, 2].map((i) => (
              <div key={i} className={`critter butterfly-flit f${i}`}>
                <ArtSvg viewBox="0 0 12 8">
                  <path className="wing" d="M6 4c-3-4-6-3-5 0 1 2 4 1 5 0zM6 4c3-4 6-3 5 0-1 2-4 1-5 0z" fill={blue ? ['#3d6fd1', '#5fb0e0', '#f5e08a'][i] : ['#fbf6e8', '#f5e08a', '#f08a2c'][i]} stroke="#4a3a2a" strokeWidth=".3" />
                </ArtSvg>
              </div>
            ))
          : Array.from({ length: 6 }, (_, i) => <span key={i} className="firefly" style={{ left: `${12 + i * 14}%`, top: `${40 + ((i * 13) % 34)}%` }} />)}
        {!night && !blue ? (
          <div className="critter blackbird">
            <ArtSvg viewBox="0 0 16 10">
              <ellipse cx="7" cy="6" rx="5" ry="3" fill="#2a2a2a" />
              <circle cx="12" cy="4" r="2.2" fill="#2a2a2a" />
              <path d="M14 4l2 .6-2 .6z" fill="#f0a020" />
              <path d="M2 5l-2 -2v3z" fill="#2a2a2a" />
              <path d="M6 9v1M8 9v1" stroke="#f0a020" strokeWidth=".6" />
            </ArtSvg>
          </div>
        ) : null}
        {!night && blue ? (
          <div className="critter peacock">
            <ArtSvg viewBox="0 0 30 20">
              <path d="M2 16 Q0 4 12 6 L16 14z" fill="#2f7a5a" />
              {[4, 7, 10].map((x) => (
                <circle key={x} cx={x} cy={10 + (x % 2)} r="1.2" fill="#3d6fd1" stroke="#f5c542" strokeWidth=".4" />
              ))}
              <ellipse cx="17" cy="14" rx="5" ry="3.4" fill="#2e5fc4" />
              <path d="M20 12 Q22 6 21 3" stroke="#2e5fc4" strokeWidth="2" fill="none" />
              <path d="M21 3l2.2 .8-2.2.6z" fill="#e8b422" />
              <path d="M20.6 2.6l-.6-2M21.4 2.6l.6-2" stroke="#2e5fc4" strokeWidth=".4" />
              <path d="M16 17v3M19 17v3" stroke="#8a6a40" strokeWidth=".8" />
            </ArtSvg>
          </div>
        ) : null}
      </div>
    )
  }
  if (chapter === 'alm') {
    return (
      <div className="critters" aria-hidden="true">
        {!night ? (
          <>
            <div className="critter marmot">
              <ArtSvg viewBox="0 0 12 16">
                <ellipse cx="6" cy="15" rx="5" ry="1.6" fill="#7a5a34" />
                <ellipse cx="6" cy="10" rx="3.6" ry="5" fill="#a5733f" />
                <circle cx="6" cy="4.4" r="2.8" fill="#a5733f" />
                <ellipse cx="6" cy="10.6" rx="2" ry="3" fill="#d9b48a" />
                <circle cx="5" cy="4" r=".5" fill="#2a1a0a" />
                <circle cx="7" cy="4" r=".5" fill="#2a1a0a" />
                <path d="M4.6 8.4l-1 1.4M7.4 8.4l1 1.4" stroke="#8a5a32" strokeWidth=".8" />
              </ArtSvg>
            </div>
            <div className="critter eagle">
              <ArtSvg viewBox="0 0 24 8">
                <path d="M12 4 Q6 0 0 2 Q6 3 10 5z M12 4 Q18 0 24 2 Q18 3 14 5z" fill="#4a3a2a" />
                <ellipse cx="12" cy="4.6" rx="2" ry="1.4" fill="#5a4a3a" />
                <circle cx="12" cy="3.2" r=".9" fill="#efe6d4" />
              </ArtSvg>
            </div>
          </>
        ) : (
          Array.from({ length: 10 }, (_, i) => <span key={i} className="star-twinkle" style={{ left: `${6 + i * 9.4}%`, top: `${2 + ((i * 7) % 9)}%` }} />)
        )}
      </div>
    )
  }
  if (chapter === 'lavendel') {
    return (
      <div className="critters" aria-hidden="true">
        {!night
          ? Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`critter bee-trail swarm b${i % 4}`} style={{ top: `${34 + (i % 4) * 14}%`, left: `${18 + ((i * 11) % 62)}%` }}>
                {BEE}
              </div>
            ))
          : Array.from({ length: 6 }, (_, i) => <span key={i} className="firefly" style={{ left: `${12 + i * 14}%`, top: `${40 + ((i * 13) % 34)}%` }} />)}
        {!night
          ? [0, 1].map((i) => (
              <div key={`f${i}`} className={`critter butterfly-flit f${i}`}>
                <ArtSvg viewBox="0 0 12 8">
                  <path className="wing" d="M6 4c-3-4-6-3-5 0 1 2 4 1 5 0zM6 4c3-4 6-3 5 0-1 2-4 1-5 0z" fill={['#f5e08a', '#fbf6e8'][i]} stroke="#4a3a2a" strokeWidth=".3" />
                </ArtSvg>
              </div>
            ))
          : null}
      </div>
    )
  }
  if (chapter === 'japangarten') {
    return (
      <div className="critters" aria-hidden="true">
        {season !== 'winter'
          ? [0, 1].map((i) => (
              <div key={i} className={`critter koi-swim k${i}`}>
                <ArtSvg viewBox="0 0 12 5">
                  <ellipse cx="6" cy="2.5" rx="4" ry="1.6" fill={i ? '#fbf6e8' : '#f08a2c'} />
                  <ellipse cx="5" cy="2.2" rx="1.4" ry=".8" fill={i ? '#e2453c' : '#fbf6e8'} />
                  <path d="M2.2 2.5l-2 -1.8v3.6z" fill={i ? '#fbf6e8' : '#f08a2c'} />
                </ArtSvg>
              </div>
            ))
          : null}
        {!night ? (
          <div className="critter heron">
            <ArtSvg viewBox="0 0 14 20">
              <path d="M6 14v6M8 14v6" stroke="#6a6a6a" strokeWidth=".7" />
              <ellipse cx="7" cy="11" rx="4" ry="3.4" fill="#d8dce0" />
              <path d="M9 9 Q11 5 9 2" stroke="#d8dce0" strokeWidth="1.6" fill="none" />
              <circle cx="9" cy="2" r="1.4" fill="#eef0f2" />
              <path d="M10 2l3.6 .6-3.6.6z" fill="#e8b422" />
              <path d="M8.4 1.2l-2.4 -.6" stroke="#3a3a3a" strokeWidth=".5" />
            </ArtSvg>
          </div>
        ) : (
          Array.from({ length: 6 }, (_, i) => <span key={i} className="firefly" style={{ left: `${12 + i * 14}%`, top: `${40 + ((i * 13) % 34)}%` }} />)
        )}
        {season === 'spring'
          ? Array.from({ length: 8 }, (_, i) => <span key={`p${i}`} className="petal-fall" style={{ left: `${6 + i * 12}%`, animationDelay: `${-i * 1.3}s` }} />)
          : null}
      </div>
    )
  }
  if (chapter === 'gartenschau') {
    return (
      <div className="critters" aria-hidden="true">
        {!night
          ? [0, 1, 2].map((i) => (
              <div key={i} className={`critter visitor v${i}`}>
                <ArtSvg viewBox="0 0 8 14">
                  <circle cx="4" cy="2.6" r="2" fill="#f2c9a0" />
                  <path d="M1.6 5h4.8l.8 5h-6.4z" fill={['#3d6fd1', '#e0485e', '#5f9e45'][i]} />
                  <path d="M3 10v4M5 10v4" stroke="#4a3a2a" strokeWidth=".9" />
                </ArtSvg>
              </div>
            ))
          : Array.from({ length: 6 }, (_, i) => <span key={i} className="firefly" style={{ left: `${12 + i * 14}%`, top: `${40 + ((i * 13) % 34)}%` }} />)}
        {!night
          ? [0, 1].map((i) => (
              <div key={`b${i}`} className={`critter balloon l${i}`}>
                <ArtSvg viewBox="0 0 8 16">
                  <ellipse cx="4" cy="4" rx="3.4" ry="4" fill={i ? '#f5c542' : '#e0485e'} />
                  <path d="M4 8 q-1 4 0 8" stroke="#6a6a6a" strokeWidth=".4" fill="none" />
                </ArtSvg>
              </div>
            ))
          : null}
      </div>
    )
  }
  return null
})
