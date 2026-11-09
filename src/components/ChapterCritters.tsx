import { memo } from 'react'
import type { ChapterId } from '../game/chapters'
import type { Daypart } from '../theme/ambient'
import { ArtSvg } from '../theme/ArtSvg'
import { P } from '../theme/art/palette'

/**
 * Chapter life (pure CSS animation, see expansion.css):
 * Bauernhof — chickens + a wandering cat; Imkerei — bee swarms;
 * Teich — ducks crossing the lake, jumping fish, dragonflies;
 * Kräuter — butterflies + a hopping blackbird; Botanik — strolling peacock +
 * blue butterflies; Alm — marmot on the lookout + circling eagle;
 * Lavendel — bees + butterflies; Japan — koi in the pond, heron, cherry
 * petals in spring; Gartenschau — strolling visitors + balloons;
 * Stadtgarten — sparrows, swifts, a fox at night; Kloster — pigeons at the tower;
 * Schloss — swans + a squirrel; Baumschule — hare + hovering kestrel;
 * Moor — passing cranes (spring/autumn) + dragonflies;
 * Deich — sheep grazing, oystercatcher, gulls, a turning windmill;
 * Spreewald — a punt gliding down the channel, kingfisher, stork on the roof;
 * Cottage — hopping robin + a steam train far off; Tulpen — windmill sails,
 * ducks in the canal, gulls; Artischocken — a sandolo on the canal, egret, gulls;
 * Beerenwald — a moose at the forest edge, squirrel, northern lights on winter nights;
 * Patio — swallows, the fountain jet, a cat asleep in the shade; Korkeichen — storks
 * gliding and stalking, a jay, grazing sheep; Paprika — stork, horse by the well, a lark;
 * Aran — sheep, puffins, surf on the cliffs; Rosental — bees, swallows, a donkey with
 * baskets; Ägina — cicada heat shimmer, goats;
 * Anden — alpacas, a condor circling high, a hummingbird; Milpa — a turkey, hummingbird,
 * monarch butterflies in autumn; Kaffeewald — turaco and bees (the roasting smoke rises in the roasting-pan art);
 * Bali — ducks in single file, a heron, water running down the subak channel;
 * Kerala — a hornbill, butterflies, the monsoon rain curtain in summer;
 * Oase — a camel walking at the edge, a hoopoe, water running in the khettara channel;
 * Ghana — a hornbill, butterflies, hens; Australien — kangaroos grazing calmly,
 * cockatoos flying over, a lizard basking on a stone; Neuseeland — a tūī singing,
 * a fantail flitting, glowworms at night; Korea — magpies, a persimmon branch
 * swaying, ondol smoke rising in winter.
 * CSS: theme/expansion/12-kapitel-tierleben-2.css
 */
const BEE = (
  <ArtSvg viewBox="0 0 8 6">
    <ellipse cx="4" cy="3.4" rx="2.6" ry="1.9" fill={P.yellow} stroke="#4a3208" strokeWidth=".5" />
    <path d="M3.4 1.6v3.6M4.8 1.6v3.6" stroke="#4a3208" strokeWidth=".5" />
    <ellipse cx="3.4" cy="1.2" rx="1.4" ry=".9" fill={P.white} opacity=".8" />
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
              <ellipse cx="9" cy="11" rx="6.5" ry="5" fill={i === 1 ? P.woodMid : P.cream} stroke={P.outlineSoft} strokeWidth=".7" />
              <g className="chicken-head">
                <circle cx="15" cy="7" r="3" fill={i === 1 ? P.woodMid : P.cream} stroke={P.outlineSoft} strokeWidth=".7" />
                <path d="M17.6 7l2 .8-2 .6z" fill={P.gold} />
                <path d="M14.4 3.8q1-1.6 2 0" fill={P.red} />
              </g>
              <path d="M7 16v2M10 16v2" stroke={P.gold} strokeWidth=".9" />
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
                  <ellipse cx="4" cy="3.4" rx="2.6" ry="1.9" fill={P.yellow} stroke="#4a3208" strokeWidth=".5" />
                  <path d="M3.4 1.6v3.6M4.8 1.6v3.6" stroke="#4a3208" strokeWidth=".5" />
                  <ellipse cx="3.4" cy="1.2" rx="1.4" ry=".9" fill={P.white} opacity=".8" />
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
                <ellipse cx="6" cy="8" rx="5.4" ry="3" fill={P.outlineSoft} />
                <circle cx="10" cy="4.6" r="2.2" fill={i === 0 ? P.leafDark : P.woodMid} />
                <path d="M12 4.6l2 .6-2 .6z" fill={P.orange} />
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
                <path d="M1 4h12" stroke={P.waterDeep} strokeWidth="1.2" />
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
                  <path className="wing" d="M6 4c-3-4-6-3-5 0 1 2 4 1 5 0zM6 4c3-4 6-3 5 0-1 2-4 1-5 0z" fill={blue ? [P.blue, '#5fb0e0', '#f5e08a'][i] : [P.cream, '#f5e08a', P.orange][i]} stroke="#4a3a2a" strokeWidth=".3" />
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
                <circle key={x} cx={x} cy={10 + (x % 2)} r="1.2" fill={P.blue} stroke={P.yellow} strokeWidth=".4" />
              ))}
              <ellipse cx="17" cy="14" rx="5" ry="3.4" fill="#2e5fc4" />
              <path d="M20 12 Q22 6 21 3" stroke="#2e5fc4" strokeWidth="2" fill="none" />
              <path d="M21 3l2.2 .8-2.2.6z" fill={P.gold} />
              <path d="M20.6 2.6l-.6-2M21.4 2.6l.6-2" stroke="#2e5fc4" strokeWidth=".4" />
              <path d="M16 17v3M19 17v3" stroke={P.outlineSoft} strokeWidth=".8" />
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
                <ellipse cx="6" cy="10" rx="3.6" ry="5" fill={P.woodMid} />
                <circle cx="6" cy="4.4" r="2.8" fill={P.woodMid} />
                <ellipse cx="6" cy="10.6" rx="2" ry="3" fill="#d9b48a" />
                <circle cx="5" cy="4" r=".5" fill="#2a1a0a" />
                <circle cx="7" cy="4" r=".5" fill="#2a1a0a" />
                <path d="M4.6 8.4l-1 1.4M7.4 8.4l1 1.4" stroke={P.woodDark} strokeWidth=".8" />
              </ArtSvg>
            </div>
            <div className="critter eagle">
              <ArtSvg viewBox="0 0 24 8">
                <path d="M12 4 Q6 0 0 2 Q6 3 10 5z M12 4 Q18 0 24 2 Q18 3 14 5z" fill="#4a3a2a" />
                <ellipse cx="12" cy="4.6" rx="2" ry="1.4" fill="#5a4a3a" />
                <circle cx="12" cy="3.2" r=".9" fill={P.paper} />
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
                  <path className="wing" d="M6 4c-3-4-6-3-5 0 1 2 4 1 5 0zM6 4c3-4 6-3 5 0-1 2-4 1-5 0z" fill={['#f5e08a', P.cream][i]} stroke="#4a3a2a" strokeWidth=".3" />
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
                  <ellipse cx="6" cy="2.5" rx="4" ry="1.6" fill={i ? P.cream : P.orange} />
                  <ellipse cx="5" cy="2.2" rx="1.4" ry=".8" fill={i ? P.tomato : P.cream} />
                  <path d="M2.2 2.5l-2 -1.8v3.6z" fill={i ? P.cream : P.orange} />
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
              <path d="M10 2l3.6 .6-3.6.6z" fill={P.gold} />
              <path d="M8.4 1.2l-2.4 -.6" stroke={P.charcoal} strokeWidth=".5" />
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
                  <circle cx="4" cy="2.6" r="2" fill={P.skin} />
                  <path d="M1.6 5h4.8l.8 5h-6.4z" fill={[P.blue, P.red, P.leaf][i]} />
                  <path d="M3 10v4M5 10v4" stroke="#4a3a2a" strokeWidth=".9" />
                </ArtSvg>
              </div>
            ))
          : Array.from({ length: 6 }, (_, i) => <span key={i} className="firefly" style={{ left: `${12 + i * 14}%`, top: `${40 + ((i * 13) % 34)}%` }} />)}
        {!night
          ? [0, 1].map((i) => (
              <div key={`b${i}`} className={`critter balloon l${i}`}>
                <ArtSvg viewBox="0 0 8 16">
                  <ellipse cx="4" cy="4" rx="3.4" ry="4" fill={i ? P.yellow : P.red} />
                  <path d="M4 8 q-1 4 0 8" stroke="#6a6a6a" strokeWidth=".4" fill="none" />
                </ArtSvg>
              </div>
            ))
          : null}
      </div>
    )
  }
  if (chapter === 'stadtgarten') {
    return (
      <div className="critters" aria-hidden="true">
        {!night
          ? [0, 1].map((i) => (
              <div key={i} className={`critter sparrow s${i}`}>
                <ArtSvg viewBox="0 0 10 8">
                  <ellipse cx="4.6" cy="4.6" rx="3.4" ry="2.4" fill={P.woodMid} />
                  <circle cx="7.6" cy="3" r="1.7" fill={P.bark} />
                  <path d="M9 3l1 .5-1 .4z" fill={P.charcoal} />
                  <path d="M3 4.4q1.6 -1 3 0" stroke={P.woodLight} strokeWidth=".6" fill="none" />
                  <path d="M4 7v1M5.6 7v1" stroke={P.charcoal} strokeWidth=".4" />
                </ArtSvg>
              </div>
            ))
          : null}
        {!night && season !== 'winter'
          ? [0, 1].map((i) => (
              <div key={`w${i}`} className={`critter swift w${i}`}>
                <ArtSvg viewBox="0 0 16 6">
                  <path d="M0 4 Q4 0 8 3 Q12 0 16 4 Q12 2 8 4.4 Q4 2 0 4z" fill={P.charcoal} />
                </ArtSvg>
              </div>
            ))
          : null}
        {night ? (
          <div className="critter city-fox">
            <ArtSvg viewBox="0 0 26 14">
              <ellipse cx="11" cy="8" rx="7" ry="3.4" fill={P.orange} />
              <path d="M17 6l4-2 3 2-3 2z" fill={P.orange} />
              <path d="M19 4.4l.6-2.4 1.4 2" fill={P.orange} />
              <path d="M24 6.4l1 .4-1 .4z" fill={P.charcoal} />
              <path d="M4 8q-4 0-4 -4q2 3 5 2" fill={P.orange} />
              <path d="M0.4 4.4l1.6 1" stroke={P.cream} strokeWidth="1" />
              <path d="M8 11v3M15 11v3" stroke={P.charcoal} strokeWidth="1" />
            </ArtSvg>
          </div>
        ) : null}
        {night ? Array.from({ length: 5 }, (_, i) => <span key={i} className="firefly" style={{ left: `${14 + i * 16}%`, top: `${36 + ((i * 11) % 30)}%` }} />) : null}
      </div>
    )
  }
  if (chapter === 'klostergarten') {
    return (
      <div className="critters" aria-hidden="true">
        {!night
          ? [0, 1].map((i) => (
              <div key={i} className={`critter pigeon p${i}`}>
                <ArtSvg viewBox="0 0 12 8">
                  <ellipse cx="5.4" cy="4.6" rx="4" ry="2.6" fill={P.stoneLight} stroke={P.stoneDark} strokeWidth=".4" />
                  <circle cx="9" cy="3" r="1.6" fill={P.stone} />
                  <path d="M10.4 3l1.2.4-1.2.4z" fill={P.charcoal} />
                  <path d="M3 4.4q2 -1.4 4 0" stroke={P.stoneDark} strokeWidth=".5" fill="none" />
                </ArtSvg>
              </div>
            ))
          : null}
        {!night ? (
          <div className="critter blackbird">
            <ArtSvg viewBox="0 0 10 8">
              <ellipse cx="4.6" cy="4.6" rx="3.4" ry="2.2" fill={P.charcoal} />
              <circle cx="7.6" cy="3.2" r="1.6" fill={P.charcoal} />
              <path d="M1.4 4.4l-1.4 2.4 2 -1z" fill={P.orange} />
              <path d="M9 3l1 .5-1 .4z" fill={P.ink} />
            </ArtSvg>
          </div>
        ) : (
          Array.from({ length: 5 }, (_, i) => <span key={i} className="star-twinkle" style={{ left: `${10 + i * 18}%`, top: `${8 + ((i * 7) % 14)}%`, animationDelay: `${-i * 0.8}s` }} />)
        )}
      </div>
    )
  }
  if (chapter === 'schlossgarten') {
    return (
      <div className="critters" aria-hidden="true">
        {season !== 'winter' ? (
          <div className="critter swan-pair">
            <ArtSvg viewBox="0 0 30 12">
              {[0, 14].map((x, i) => (
                <g key={x} transform={`translate(${x} ${i ? 2 : 0}) scale(${i ? 0.8 : 1})`}>
                  <ellipse cx="7" cy="8" rx="6" ry="2.6" fill={P.white} stroke={P.stoneLight} strokeWidth=".4" />
                  <path d="M11 7q3 -2 1 -6" stroke={P.white} strokeWidth="1.6" fill="none" />
                  <path d="M12 1l2 .8-2 .6z" fill={P.orange} />
                </g>
              ))}
            </ArtSvg>
          </div>
        ) : null}
        {!night ? (
          <div className="critter squirrel">
            <ArtSvg viewBox="0 0 10 12">
              <path d="M2 11q-3 -6 1 -10q3 2 0 6" fill={P.autumn} />
              <ellipse cx="6" cy="8" rx="2.6" ry="3" fill={P.autumn} />
              <circle cx="6.6" cy="4.4" r="1.8" fill={P.autumn} />
              <path d="M6 2.6l.4 -1.4.8 1.4" fill={P.autumn} />
              <circle cx="7.4" cy="4.2" r=".4" fill={P.ink} />
            </ArtSvg>
          </div>
        ) : (
          Array.from({ length: 6 }, (_, i) => <span key={i} className="firefly" style={{ left: `${12 + i * 14}%`, top: `${40 + ((i * 13) % 34)}%` }} />)
        )}
      </div>
    )
  }
  if (chapter === 'baumschule') {
    return (
      <div className="critters" aria-hidden="true">
        <div className="critter hare">
          <ArtSvg viewBox="0 0 16 12">
            <ellipse cx="7" cy="8" rx="5" ry="3" fill={P.woodMid} />
            <circle cx="12" cy="6" r="2.2" fill={P.woodMid} />
            <path d="M11.4 4.4l-1 -4.4 1.8 4M12.6 4.2l.4 -4.2 1 4.2" fill={P.woodMid} stroke={P.woodDark} strokeWidth=".3" />
            <circle cx="2" cy="7.6" r="1.4" fill={P.cream} />
            <circle cx="12.8" cy="5.6" r=".4" fill={P.ink} />
          </ArtSvg>
        </div>
        {!night ? (
          <div className="critter kestrel">
            <ArtSvg viewBox="0 0 20 8">
              <path d="M0 3 Q5 0 10 3 Q15 0 20 3 Q15 2 10 5 Q5 2 0 3z" fill={P.woodMid} />
              <ellipse cx="10" cy="4.6" rx="1.6" ry="2.6" fill={P.autumn} />
              <path d="M9 7h2l-1 1z" fill={P.stoneDark} />
            </ArtSvg>
          </div>
        ) : null}
      </div>
    )
  }
  if (chapter === 'moorgarten') {
    const cranes = !night && (season === 'autumn' || season === 'spring')
    return (
      <div className="critters" aria-hidden="true">
        {cranes ? (
          <div className="critter crane-fly">
            <ArtSvg viewBox="0 0 60 16">
              {[0, 1, 2, 3, 4].map((i) => {
                const x = 6 + i * 11
                const y = 4 + Math.abs(i - 2) * 3
                return <path key={i} d={`M${x - 5} ${y + 1} Q${x - 2} ${y - 2} ${x} ${y + 1} Q${x + 2} ${y - 2} ${x + 5} ${y + 1}`} stroke={P.charcoal} strokeWidth="1" fill="none" />
              })}
            </ArtSvg>
          </div>
        ) : null}
        {!night && season !== 'winter'
          ? [0, 1].map((i) => (
              <div key={i} className="critter dragonfly" style={{ top: `${46 + i * 14}%`, left: `${26 + i * 30}%`, animationDelay: `${-i * 4}s` }}>
                <ArtSvg viewBox="0 0 12 8">
                  <path d="M1 4h9" stroke={P.denim} strokeWidth="1.2" strokeLinecap="round" />
                  <ellipse cx="6" cy="2" rx="3" ry="1.2" fill={P.glass} opacity=".8" />
                  <ellipse cx="6" cy="6" rx="3" ry="1.2" fill={P.glass} opacity=".8" />
                </ArtSvg>
              </div>
            ))
          : null}
        {night ? Array.from({ length: 6 }, (_, i) => <span key={i} className="firefly" style={{ left: `${12 + i * 14}%`, top: `${44 + ((i * 13) % 30)}%` }} />) : null}
      </div>
    )
  }
  if (chapter === 'deichgarten') {
    return (
      <div className="critters" aria-hidden="true">
        {[0, 1].map((i) => (
          <div key={i} className={`critter k2-sheep k${i}`}>
            <ArtSvg viewBox="0 0 16 11">
              <path d="M4 8v3M11 8v3" stroke={P.charcoal} strokeWidth="1" />
              <ellipse cx="7.4" cy="5.6" rx="6" ry="3.6" fill={P.feather} stroke={P.outlineFur} strokeWidth=".5" />
              <circle cx="5" cy="3.6" r="2" fill={P.white} />
              <ellipse cx="13.6" cy="5" rx="2" ry="1.6" fill={P.charcoal} />
            </ArtSvg>
          </div>
        ))}
        {!night ? (
          <div className="critter k2-oyster">
            <ArtSvg viewBox="0 0 10 8">
              <path d="M4 6v2M6 6v2" stroke={P.pink} strokeWidth=".6" />
              <ellipse cx="4.6" cy="4.6" rx="3.4" ry="2" fill={P.white} />
              <path d="M1.2 4.4Q4.6 1 8 3.4L7.4 5z" fill={P.ink} />
              <circle cx="7.6" cy="2.6" r="1.3" fill={P.ink} />
              <path d="M8.6 2.6l1.4 .4" stroke={P.orange} strokeWidth=".7" />
            </ArtSvg>
          </div>
        ) : null}
        {!night
          ? [0, 1].map((i) => (
              <div key={`g${i}`} className={`critter k2-gull g${i}`}>
                <ArtSvg viewBox="0 0 16 6">
                  <path d="M0 4 Q4 0 8 3 Q12 0 16 4" stroke={P.charcoal} strokeWidth="1" fill="none" />
                  <ellipse cx="8" cy="3.6" rx="1.6" ry=".8" fill={P.white} />
                </ArtSvg>
              </div>
            ))
          : null}
        <div className="critter k2-mill">
          <ArtSvg viewBox="0 0 20 30">
            <path d="M8 30L9 12h2l1 18z" fill={P.white} stroke={P.stoneDark} strokeWidth=".4" />
            <g className="ha-wheel">
              {[0, 120, 240].map((a) => (
                <path key={a} d="M10 10V1" stroke={P.white} strokeWidth="1.4" strokeLinecap="round" transform={`rotate(${a} 10 10)`} />
              ))}
              <path d="M10 10V19" stroke="none" />
            </g>
            <circle cx="10" cy="10" r="1" fill={P.stoneDark} />
          </ArtSvg>
        </div>
      </div>
    )
  }
  if (chapter === 'spreewald') {
    return (
      <div className="critters" aria-hidden="true">
        {season !== 'winter' ? (
          <div className="critter k2-punt">
            <ArtSvg viewBox="0 0 30 16">
              <path d="M1 12L29 11L27 14H3z" fill={P.woodDark} stroke={P.outline} strokeWidth=".4" />
              <circle cx="22" cy="4" r="1.6" fill={P.skin} />
              <path d="M20 6h4l.6 5h-5.2z" fill={P.denim} />
              <path d="M26 0L18 15" stroke={P.woodLight} strokeWidth=".7" />
              {[6, 10, 14].map((x) => (
                <ellipse key={x} cx={x} cy={10.6} rx="1.8" ry=".9" fill={P.leafDark} />
              ))}
            </ArtSvg>
          </div>
        ) : null}
        {!night && season !== 'winter' ? (
          <div className="critter k2-kingfisher">
            <ArtSvg viewBox="0 0 12 6">
              <ellipse cx="5" cy="3.4" rx="3.6" ry="1.6" fill={P.orange} />
              <ellipse cx="5" cy="2.4" rx="3.6" ry="1.4" fill={P.blue} />
              <circle cx="8.6" cy="2.6" r="1.2" fill={P.blue} />
              <path d="M9.6 2.6l2.4 .3" stroke={P.ink} strokeWidth=".6" />
            </ArtSvg>
          </div>
        ) : null}
        {season !== 'winter' ? (
          <div className="critter k2-stork">
            <ArtSvg viewBox="0 0 12 14">
              <path d="M5 10v4M7 10v4" stroke={P.tomato} strokeWidth=".7" />
              <ellipse cx="6" cy="8" rx="4" ry="2.6" fill={P.white} stroke={P.stoneLight} strokeWidth=".3" />
              <path d="M2 8h4l-1.6 2z" fill={P.ink} />
              <path d="M8.6 7q1.4 -3 .6 -5.6" stroke={P.white} strokeWidth="1.4" fill="none" />
              <path d="M9.4 1.6l2.6 1.2" stroke={P.tomato} strokeWidth=".8" />
            </ArtSvg>
          </div>
        ) : null}
        {night ? Array.from({ length: 5 }, (_, i) => <span key={i} className="firefly" style={{ left: `${14 + i * 16}%`, top: `${40 + ((i * 11) % 30)}%` }} />) : null}
      </div>
    )
  }
  if (chapter === 'cottagegarten') {
    return (
      <div className="critters" aria-hidden="true">
        {!night ? (
          <div className="critter k2-robin">
            <ArtSvg viewBox="0 0 10 8">
              <ellipse cx="4.6" cy="4.6" rx="3.4" ry="2.4" fill={P.woodMid} />
              <ellipse cx="6" cy="5" rx="1.8" ry="1.6" fill={P.orange} />
              <circle cx="7.4" cy="3" r="1.6" fill={P.woodMid} />
              <circle cx="7.8" cy="3.4" r=".9" fill={P.orange} />
              <path d="M8.8 2.8l1 .4-1 .4z" fill={P.charcoal} />
              <path d="M4 7v1M5.6 7v1" stroke={P.charcoal} strokeWidth=".4" />
            </ArtSvg>
          </div>
        ) : null}
        <div className="critter k2-train">
          <ArtSvg viewBox="0 0 40 12">
            <path className="smoke" d="M5 3c-2 -2 2 -3 0 -5" stroke={P.white} strokeWidth="1.4" fill="none" />
            <rect x="2" y="4" width="10" height="5" fill={P.leafDark} />
            <rect x="9" y="2" width="4" height="7" fill={P.leafDark} />
            <rect x="4" y="2" width="2" height="2" fill={P.charcoal} />
            {[14, 26].map((x) => (
              <rect key={x} x={x} y="4" width="11" height="5" fill={P.barn} />
            ))}
            {[4, 9, 17, 22, 29, 34].map((x) => (
              <circle key={x} cx={x} cy="10" r="1.2" fill={P.charcoal} />
            ))}
          </ArtSvg>
        </div>
        {night ? Array.from({ length: 5 }, (_, i) => <span key={i} className="firefly" style={{ left: `${14 + i * 16}%`, top: `${40 + ((i * 11) % 30)}%` }} />) : null}
      </div>
    )
  }
  if (chapter === 'tulpenfelder') {
    return (
      <div className="critters" aria-hidden="true">
        <div className="critter k2-sails">
          <ArtSvg viewBox="0 0 30 44">
            <path d="M10 44L12.4 16H17.6L20 44z" fill={P.charcoal} />
            <path d="M11.6 18Q15 12 18.4 18z" fill={P.woodLight} />
            <g className="ha-wheel">
              {[0, 90, 180, 270].map((a) => (
                <g key={a} transform={`rotate(${a} 15 15)`}>
                  <path d="M15 15V1" stroke={P.woodDark} strokeWidth=".8" />
                  <rect x="15.4" y="2" width="3.6" height="10" fill={P.white} stroke={P.woodDark} strokeWidth=".3" />
                </g>
              ))}
            </g>
            <circle cx="15" cy="15" r="1.4" fill={P.woodDark} />
          </ArtSvg>
        </div>
        {season !== 'winter'
          ? [0, 1, 2].map((i) => (
              <div key={i} className={`critter k2-duck d${i}`}>
                <ArtSvg viewBox="0 0 10 7">
                  <ellipse cx="4.4" cy="4.6" rx="3.8" ry="2" fill={i ? P.woodMid : P.stoneLight} />
                  <circle cx="7.6" cy="2.6" r="1.4" fill={i ? P.woodDark : P.leafDark} />
                  <path d="M8.8 2.6l1.2 .4-1.2 .4z" fill={P.amber} />
                </ArtSvg>
              </div>
            ))
          : null}
        {!night
          ? [0, 1].map((i) => (
              <div key={`g${i}`} className={`critter k2-gull g${i}`}>
                <ArtSvg viewBox="0 0 16 6">
                  <path d="M0 4 Q4 0 8 3 Q12 0 16 4" stroke={P.charcoal} strokeWidth="1" fill="none" />
                  <ellipse cx="8" cy="3.6" rx="1.6" ry=".8" fill={P.white} />
                </ArtSvg>
              </div>
            ))
          : null}
      </div>
    )
  }
  if (chapter === 'artischocken') {
    return (
      <div className="critters" aria-hidden="true">
        <div className="critter k2-sandolo">
          <ArtSvg viewBox="0 0 30 16">
            <path d="M1 11Q15 14 29 9L27 13Q15 15 3 13z" fill={P.charcoal} stroke={P.outline} strokeWidth=".4" />
            <circle cx="20" cy="3.6" r="1.6" fill={P.skin} />
            <path d="M18 5.6h4l.6 5h-5.2z" fill={P.white} />
            <path d="M18 6.4h4M18.2 8h4" stroke={P.blue} strokeWidth=".6" />
            <path d="M23 6L27 15" stroke={P.woodLight} strokeWidth=".7" />
            {[6, 10].map((x) => (
              <ellipse key={x} cx={x} cy={10.4} rx="1.6" ry="1.2" fill={P.plum} />
            ))}
          </ArtSvg>
        </div>
        {!night ? (
          <div className="critter k2-egret">
            <ArtSvg viewBox="0 0 10 14">
              <path d="M4 9v5M6 9v5" stroke={P.charcoal} strokeWidth=".5" />
              <ellipse cx="5" cy="8" rx="3.4" ry="2" fill={P.white} stroke={P.stoneLight} strokeWidth=".3" />
              <path d="M7.6 7.4q2 -2.6.4 -5.4q.6 -1 1.8 -.6" stroke={P.white} strokeWidth="1" fill="none" />
              <path d="M9.6 1.4l.4 .2" stroke={P.ink} strokeWidth=".8" />
            </ArtSvg>
          </div>
        ) : null}
        {!night
          ? [0, 1].map((i) => (
              <div key={`g${i}`} className={`critter k2-gull g${i}`}>
                <ArtSvg viewBox="0 0 16 6">
                  <path d="M0 4 Q4 0 8 3 Q12 0 16 4" stroke={P.charcoal} strokeWidth="1" fill="none" />
                  <ellipse cx="8" cy="3.6" rx="1.6" ry=".8" fill={P.white} />
                </ArtSvg>
              </div>
            ))
          : Array.from({ length: 5 }, (_, i) => <span key={i} className="star-twinkle" style={{ left: `${10 + i * 18}%`, top: `${8 + ((i * 7) % 14)}%`, animationDelay: `${-i * 0.8}s` }} />)}
      </div>
    )
  }
  if (chapter === 'beerenwald') {
    return (
      <div className="critters" aria-hidden="true">
        {night && season === 'winter' ? <div className="critter k2-aurora" /> : null}
        <div className="critter k2-moose">
          <ArtSvg viewBox="0 0 24 20">
            <path d="M5 12v8M8 12v8M15 12v8M18 12v8" stroke={P.soilDark} strokeWidth="1.4" />
            <ellipse cx="11" cy="10" rx="9" ry="4.6" fill={P.soilDark} />
            <path d="M3 8l2 -2h2z" fill={P.soilDark} />
            <path d="M18 8l3 -2l3 2l-1 3h-3z" fill={P.soilDark} />
            <path d="M20 6l-2 -4l1 2l-2 -1M21 6l1 -4l-1 2l2 -1" stroke={P.woodLight} strokeWidth=".8" fill="none" />
            <path d="M21 11v2" stroke={P.soilDark} strokeWidth="1" />
          </ArtSvg>
        </div>
        {!night ? (
          <div className="critter k2-squirrel">
            <ArtSvg viewBox="0 0 10 12">
              <path d="M2 11q-3 -6 1 -10q3 2 0 6" fill={P.autumn} />
              <ellipse cx="6" cy="8" rx="2.6" ry="3" fill={P.autumn} />
              <circle cx="6.6" cy="4.4" r="1.8" fill={P.autumn} />
              <path d="M6 2.6l.4 -1.4.8 1.4" fill={P.autumn} />
              <circle cx="7.4" cy="4.2" r=".4" fill={P.ink} />
            </ArtSvg>
          </div>
        ) : (
          Array.from({ length: 6 }, (_, i) => <span key={i} className="star-twinkle" style={{ left: `${8 + i * 16}%`, top: `${6 + ((i * 7) % 12)}%`, animationDelay: `${-i * 0.7}s` }} />)
        )}
      </div>
    )
  }
  if (chapter === 'patio') {
    return (
      <div className="critters" aria-hidden="true">
        <div className="critter k3-jet">
          <ArtSvg viewBox="0 0 10 14">
            <path d="M5 14V3M5 3q-3 1 -4 6M5 3q3 1 4 6" stroke={P.waterLight} strokeWidth="1" fill="none" />
            <circle cx="5" cy="2.4" r="1" fill={P.glassEdge} />
          </ArtSvg>
        </div>
        {!night && season !== 'winter'
          ? [0, 1].map((i) => (
              <div key={i} className={`critter k3-swallow s${i}`}>
                <ArtSvg viewBox="0 0 16 8">
                  <path d="M0 2 Q5 3 8 5 Q11 3 16 2 Q11 5 8 7 Q5 5 0 2z" fill={P.ink} />
                  <path d="M7 5l1 3l1 -3" fill={P.ink} />
                  <ellipse cx="8" cy="5.2" rx="1" ry=".7" fill={P.white} />
                </ArtSvg>
              </div>
            ))
          : null}
        <div className="critter k3-cat">
          <ArtSvg viewBox="0 0 20 10">
            <ellipse cx="9" cy="7" rx="7" ry="3" fill={P.charcoal} />
            <circle cx="15.4" cy="6" r="2.6" fill={P.charcoal} />
            <path d="M14 3.8l.6 -2.2 1.4 1.6M16.4 3.6l1 -2 .8 2.2" fill={P.charcoal} />
            <path className="k3-tail" d="M2.4 8q-3 0 -2 -3" stroke={P.charcoal} strokeWidth="1.2" fill="none" />
            <path d="M15 6h1.4M16.6 6h1" stroke={P.white} strokeWidth=".3" />
          </ArtSvg>
        </div>
        {night ? Array.from({ length: 5 }, (_, i) => <span key={i} className="star-twinkle" style={{ left: `${10 + i * 18}%`, top: `${8 + ((i * 7) % 14)}%`, animationDelay: `${-i * 0.8}s` }} />) : null}
      </div>
    )
  }
  if (chapter === 'korkeichen') {
    return (
      <div className="critters" aria-hidden="true">
        {!night
          ? [0, 1].map((i) => (
              <div key={i} className={`critter k3-stork-fly f${i}`}>
                <ArtSvg viewBox="0 0 24 10">
                <path d="M0 5 Q6 1 11 5 Q16 1 24 5" stroke={P.ink} strokeWidth="1.6" fill="none" />
                <path d="M2 5 Q6 3 11 5 Q16 3 22 5" stroke={P.white} strokeWidth="1.4" fill="none" />
                <ellipse cx="12" cy="5.6" rx="3.4" ry="1.2" fill={P.white} />
                <path d="M15 5.4h5" stroke={P.white} strokeWidth=".8" />
                <path d="M20 5.4l3 .4" stroke={P.tomato} strokeWidth=".7" />
                <path d="M9 6l-4 1.4" stroke={P.tomato} strokeWidth=".5" />
              </ArtSvg>
              </div>
            ))
          : null}
        {season !== 'winter' || !night ? (
          <div className="critter k3-stork-walk">
            <ArtSvg viewBox="0 0 12 14">
              <path d="M5 10v4M7 10v4" stroke={P.tomato} strokeWidth=".7" />
              <ellipse cx="6" cy="8" rx="4" ry="2.6" fill={P.white} stroke={P.stoneLight} strokeWidth=".3" />
              <path d="M2 8h4l-1.6 2z" fill={P.ink} />
              <path d="M8.6 7q1.4 -3 .6 -5.6" stroke={P.white} strokeWidth="1.4" fill="none" />
              <path d="M9.4 1.6l2.6 1.2" stroke={P.tomato} strokeWidth=".8" />
            </ArtSvg>
          </div>
        ) : null}
        {!night ? (
          <div className="critter k3-jay">
            <ArtSvg viewBox="0 0 12 8">
              <ellipse cx="5.4" cy="4.6" rx="3.8" ry="2.2" fill={P.terracottaLight} />
              <path d="M3 4.4h4" stroke={P.blue} strokeWidth="1" />
              <circle cx="9" cy="3" r="1.6" fill={P.terracottaLight} />
              <path d="M10.4 3l1.4 .4-1.4 .4z" fill={P.charcoal} />
              <path d="M1.6 4.4l-1.6 1" stroke={P.ink} strokeWidth="1" />
              <path d="M4.6 7v1M6 7v1" stroke={P.charcoal} strokeWidth=".4" />
            </ArtSvg>
          </div>
        ) : null}
        {[0, 1].map((i) => (
          <div key={`sh${i}`} className={`critter k3-sheep k${i}`}>
            <ArtSvg viewBox="0 0 16 11">
                <path d="M4 8v3M11 8v3" stroke={P.charcoal} strokeWidth="1" />
                <ellipse cx="7.4" cy="5.6" rx="6" ry="3.6" fill={P.cream} stroke={P.outlineFur} strokeWidth=".5" />
                <circle cx="5" cy="3.6" r="2" fill={P.white} />
                <ellipse cx="13.6" cy="5" rx="2" ry="1.6" fill={P.charcoal} />
              </ArtSvg>
          </div>
        ))}
      </div>
    )
  }
  if (chapter === 'paprikafelder') {
    return (
      <div className="critters" aria-hidden="true">
        {!night && season !== 'winter' ? (
          <div className="critter k3-stork-fly f0">
            <ArtSvg viewBox="0 0 24 10">
                <path d="M0 5 Q6 1 11 5 Q16 1 24 5" stroke={P.ink} strokeWidth="1.6" fill="none" />
                <path d="M2 5 Q6 3 11 5 Q16 3 22 5" stroke={P.white} strokeWidth="1.4" fill="none" />
                <ellipse cx="12" cy="5.6" rx="3.4" ry="1.2" fill={P.white} />
                <path d="M15 5.4h5" stroke={P.white} strokeWidth=".8" />
                <path d="M20 5.4l3 .4" stroke={P.tomato} strokeWidth=".7" />
                <path d="M9 6l-4 1.4" stroke={P.tomato} strokeWidth=".5" />
              </ArtSvg>
          </div>
        ) : null}
        <div className="critter k3-horse">
          <ArtSvg viewBox="0 0 24 20">
            <path d="M5 12v8M8 12v8M15 12v8M18 12v8" stroke={P.woodDark} strokeWidth="1.3" />
            <ellipse cx="11.4" cy="10" rx="8.4" ry="4" fill={P.woodMid} />
            <path d="M18 9l3 -6l2.6 1l-1 4z" fill={P.woodMid} />
            <path d="M18.6 3.6q-1 3 -2.6 4" stroke={P.soilDark} strokeWidth="1.2" fill="none" />
            <path d="M3.4 9q-3 2 -2 7" stroke={P.soilDark} strokeWidth="1.4" fill="none" />
          </ArtSvg>
        </div>
        {!night ? (
          <div className="critter k3-lark">
            <ArtSvg viewBox="0 0 10 6">
              <path d="M0 2 Q3 0 5 3 Q7 0 10 2" stroke={P.woodDark} strokeWidth="1" fill="none" />
              <ellipse cx="5" cy="3.4" rx="1.6" ry="1" fill={P.woodLight} />
            </ArtSvg>
          </div>
        ) : (
          Array.from({ length: 5 }, (_, i) => <span key={i} className="firefly" style={{ left: `${14 + i * 16}%`, top: `${40 + ((i * 11) % 30)}%` }} />)
        )}
      </div>
    )
  }
  if (chapter === 'aranfelder') {
    return (
      <div className="critters" aria-hidden="true">
        <div className="critter k3-surf">
          <ArtSvg viewBox="0 0 40 8">
            <path d="M0 6 Q5 0 10 5 Q15 0 20 5 Q25 0 30 5 Q35 0 40 6" stroke={P.white} strokeWidth="1.6" fill="none" />
          </ArtSvg>
        </div>
        {!night && season !== 'winter'
          ? [0, 1].map((i) => (
              <div key={i} className={`critter k3-puffin p${i}`}>
                <ArtSvg viewBox="0 0 12 8">
                  <path d="M1 3 Q4 1 6 4 Q8 1 11 3" stroke={P.ink} strokeWidth="1.2" fill="none" />
                  <ellipse cx="6" cy="4.6" rx="2" ry="1.6" fill={P.ink} />
                  <ellipse cx="6" cy="5.2" rx="1.2" ry="1" fill={P.white} />
                  <path d="M7.8 4l1.6 .6-1.6 .6z" fill={P.orange} />
                </ArtSvg>
              </div>
            ))
          : null}
        {[0, 1].map((i) => (
          <div key={`sh${i}`} className={`critter k3-sheep a${i}`}>
            <ArtSvg viewBox="0 0 16 11">
                <path d="M4 8v3M11 8v3" stroke={P.charcoal} strokeWidth="1" />
                <ellipse cx="7.4" cy="5.6" rx="6" ry="3.6" fill={P.cream} stroke={P.outlineFur} strokeWidth=".5" />
                <circle cx="5" cy="3.6" r="2" fill={P.white} />
                <ellipse cx="13.6" cy="5" rx="2" ry="1.6" fill={P.charcoal} />
              </ArtSvg>
          </div>
        ))}
      </div>
    )
  }
  if (chapter === 'rosental') {
    return (
      <div className="critters" aria-hidden="true">
        {!night && (season === 'spring' || season === 'summer')
          ? [0, 1, 2].map((i) => (
              <div key={i} className={`critter k3-bee b${i}`}>
                {BEE}
              </div>
            ))
          : null}
        {!night && season !== 'winter'
          ? [0, 1].map((i) => (
              <div key={`s${i}`} className={`critter k3-swallow s${i}`}>
                <ArtSvg viewBox="0 0 16 8">
                  <path d="M0 2 Q5 3 8 5 Q11 3 16 2 Q11 5 8 7 Q5 5 0 2z" fill={P.ink} />
                  <path d="M7 5l1 3l1 -3" fill={P.ink} />
                  <ellipse cx="8" cy="5.2" rx="1" ry=".7" fill={P.white} />
                </ArtSvg>
              </div>
            ))
          : null}
        <div className="critter k3-donkey">
          <ArtSvg viewBox="0 0 22 18">
            <path d="M5 11v7M8 11v7M14 11v7M17 11v7" stroke={P.stoneDark} strokeWidth="1.2" />
            <ellipse cx="11" cy="9.4" rx="7.4" ry="3.6" fill={P.stone} />
            <path d="M17 8l3 -4l2 1l-1 4z" fill={P.stone} />
            <path d="M19 4.4l-1 -4M20.4 4.6l.6 -4" stroke={P.stone} strokeWidth="1" />
            <path d="M6 8h5v5h-5zM11.6 8h5v5h-5z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
            <ellipse cx="8.5" cy="8" rx="2.4" ry="1" fill={season === 'spring' || season === 'summer' ? P.pink : P.woodMid} />
            <ellipse cx="14" cy="8" rx="2.4" ry="1" fill={season === 'spring' || season === 'summer' ? P.blossom : P.woodMid} />
          </ArtSvg>
        </div>
        {night ? Array.from({ length: 5 }, (_, i) => <span key={i} className="firefly" style={{ left: `${14 + i * 16}%`, top: `${40 + ((i * 11) % 30)}%` }} />) : null}
      </div>
    )
  }
  if (chapter === 'pistazien') {
    return (
      <div className="critters" aria-hidden="true">
        {!night && season === 'summer' ? <div className="critter k3-haze" /> : null}
        {!night && (season === 'summer' || season === 'autumn')
          ? [0, 1].map((i) => (
              <div key={i} className={`critter k3-cicada c${i}`}>
                <ArtSvg viewBox="0 0 6 8">
                  <ellipse cx="3" cy="4" rx="1.4" ry="2.6" fill={P.woodDark} />
                  <path d="M3 2Q0 4 1 7M3 2Q6 4 5 7" stroke={P.glassEdge} strokeWidth=".8" fill="none" opacity=".9" />
                </ArtSvg>
              </div>
            ))
          : null}
        {[0, 1].map((i) => (
          <div key={`g${i}`} className={`critter k3-goat g${i}`}>
            <ArtSvg viewBox="0 0 16 12">
              <path d="M4 8v4M11 8v4" stroke={P.charcoal} strokeWidth=".9" />
              <ellipse cx="7.4" cy="6" rx="5.4" ry="3" fill={i ? P.woodMid : P.feather} stroke={P.outlineFur} strokeWidth=".4" />
              <path d="M11.6 5l2 -3l2 1l-.8 3z" fill={i ? P.woodMid : P.feather} />
              <path d="M13.4 2l-1 -2M14.4 2.2l.4 -2" stroke={P.woodDark} strokeWidth=".6" />
            </ArtSvg>
          </div>
        ))}
        {night ? Array.from({ length: 6 }, (_, i) => <span key={i} className="star-twinkle" style={{ left: `${8 + i * 16}%`, top: `${6 + ((i * 7) % 12)}%`, animationDelay: `${-i * 0.7}s` }} />) : null}
      </div>
    )
  }
  if (chapter === 'andenkartoffeln') {
    return (
      <div className="critters" aria-hidden="true">
        {!night ? (
          <div className="critter k4-condor">
            <ArtSvg viewBox="0 0 30 8">
              <path d="M0 5 Q6 1 13 4 L15 3 L17 4 Q24 1 30 5 Q24 3 17 5.4 L15 6 L13 5.4 Q6 3 0 5z" fill={P.ink} />
              <path d="M10 4.4h-3M20 4.4h3" stroke={P.white} strokeWidth=".8" />
              <circle cx="15" cy="2.6" r="1" fill={P.skin} />
            </ArtSvg>
          </div>
        ) : null}
        {[0, 1].map((i) => (
          <div key={i} className={`critter k4-alpaca a${i}`}>
            <ArtSvg viewBox="0 0 12 16">
              <path d="M3 16v-4M5 16v-4M8 16v-4M9.6 16v-4" stroke={P.outlineFur} strokeWidth=".9" />
              <ellipse cx="6" cy="10.4" rx="4.6" ry="2.8" fill={i ? P.woodMid : P.cream} stroke={P.outlineFur} strokeWidth=".4" />
              <path d="M9.4 9.4V3" stroke={i ? P.woodMid : P.cream} strokeWidth="2.2" strokeLinecap="round" />
              <ellipse cx="10.4" cy="2.6" rx="1.6" ry="1.1" fill={i ? P.woodMid : P.cream} />
              <path d="M9 1.6l-.2 -1.4M10 1.5v-1.4" stroke={P.outlineFur} strokeWidth=".5" />
            </ArtSvg>
          </div>
        ))}
        {!night && season !== 'winter' ? (
          <div className="critter k4-hummer">
            <ArtSvg viewBox="0 0 10 6">
              <ellipse cx="4.6" cy="3.4" rx="2.4" ry="1.2" fill={P.leafDark} />
              <circle cx="7" cy="2.8" r="1" fill={P.berry} />
              <path d="M7.8 2.8h2.2" stroke={P.ink} strokeWidth=".4" />
              <path d="M4 3Q2 0 5 .4M4.6 3Q7 0 5.4 .2" stroke={P.glassEdge} strokeWidth=".7" fill="none" />
            </ArtSvg>
          </div>
        ) : null}
        {night ? Array.from({ length: 6 }, (_, i) => <span key={i} className="star-twinkle" style={{ left: `${8 + i * 16}%`, top: `${6 + ((i * 7) % 12)}%`, animationDelay: `${-i * 0.7}s` }} />) : null}
      </div>
    )
  }
  if (chapter === 'milpa') {
    return (
      <div className="critters" aria-hidden="true">
        <div className="critter k4-turkey">
          <ArtSvg viewBox="0 0 16 14">
            <path d="M6 12v2M9 12v2" stroke={P.woodDark} strokeWidth=".8" />
            <path d="M1 8Q0 2 5 2Q6 6 5 9z" fill={P.soilDark} />
            <ellipse cx="7" cy="8.6" rx="4.6" ry="3.4" fill={P.soilDark} />
            <path d="M3 7.4h6M3.4 9.4h6" stroke={P.woodLight} strokeWidth=".4" />
            <path d="M10.4 7.6Q12 6 11.6 3" stroke={P.soilDark} strokeWidth="1.2" fill="none" />
            <circle cx="11.8" cy="2.6" r="1.1" fill={P.stoneLight} />
            <path d="M12.4 3.4q.6 1.4 -.2 2" stroke={P.red} strokeWidth=".6" fill="none" />
          </ArtSvg>
        </div>
        {!night && season !== 'winter' ? (
          <div className="critter k4-hummer m">
            <ArtSvg viewBox="0 0 10 6">
              <ellipse cx="4.6" cy="3.4" rx="2.4" ry="1.2" fill={P.leaf} />
              <circle cx="7" cy="2.8" r="1" fill={P.leafDark} />
              <path d="M7.8 2.8h2.2" stroke={P.ink} strokeWidth=".4" />
              <path d="M4 3Q2 0 5 .4M4.6 3Q7 0 5.4 .2" stroke={P.glassEdge} strokeWidth=".7" fill="none" />
            </ArtSvg>
          </div>
        ) : null}
        {!night && season === 'autumn'
          ? [0, 1, 2, 3].map((i) => (
              <div key={i} className={`critter k4-monarch m${i}`}>
                <ArtSvg viewBox="0 0 10 8">
                  <path d="M5 4L1 1Q0 4 2 5.4zM5 4L9 1Q10 4 8 5.4zM5 4.4L2.4 7.4Q4 7.6 5 5zM5 4.4L7.6 7.4Q6 7.6 5 5z" fill={P.orange} stroke={P.ink} strokeWidth=".5" />
                  <path d="M5 2.6v3.6" stroke={P.ink} strokeWidth=".6" />
                </ArtSvg>
              </div>
            ))
          : null}
        {night ? Array.from({ length: 5 }, (_, i) => <span key={i} className="firefly" style={{ left: `${14 + i * 16}%`, top: `${40 + ((i * 11) % 30)}%` }} />) : null}
      </div>
    )
  }
  if (chapter === 'kaffeewald') {
    return (
      <div className="critters" aria-hidden="true">
        {!night ? (
          <div className="critter k4-turaco">
            <ArtSvg viewBox="0 0 22 10">
              <path d="M0 5 Q5 0 10 4 Q15 0 22 4 Q15 3 11 6 Q6 3 0 5z" fill={P.berry} />
              <ellipse cx="10" cy="5.4" rx="4" ry="1.6" fill={P.leafDark} />
              <circle cx="15" cy="4.4" r="1.4" fill={P.leafDark} />
              <path d="M16.2 4.4l1.6 .4-1.6 .4z" fill={P.tomato} />
              <path d="M15 3l.6 -1.6" stroke={P.leafDark} strokeWidth=".8" />
              <path d="M6 5.4l-4 1" stroke={P.leafMoss} strokeWidth="1.2" />
            </ArtSvg>
          </div>
        ) : null}
        {!night && season !== 'summer'
          ? [0, 1, 2].map((i) => (
              <div key={i} className={`critter k3-bee b${i}`}>
                {BEE}
              </div>
            ))
          : null}
        {night ? Array.from({ length: 5 }, (_, i) => <span key={i} className="firefly" style={{ left: `${14 + i * 16}%`, top: `${40 + ((i * 11) % 30)}%` }} />) : null}
      </div>
    )
  }
  if (chapter === 'reisterrassen') {
    return (
      <div className="critters" aria-hidden="true">
        <div className="critter k4-flow">
          <ArtSvg viewBox="0 0 4 40">
            <path d="M2 0v6M2 14v6M2 28v6" stroke={P.glassEdge} strokeWidth="1.2" strokeLinecap="round" />
          </ArtSvg>
        </div>
        {!night ? (
          <div className="critter k4-ducks">
            <ArtSvg viewBox="0 0 30 10">
              {[0, 1, 2, 3, 4].map((i) => (
                <g key={i} transform={`translate(${3 + i * 6} 10)`}>
                  <path d="M-1.4 -1Q-2 -4.6 -.2 -6.4Q.6 -7.4 1 -6.4Q1.4 -4 1.2 -1z" fill={i === 2 ? P.woodLight : P.white} stroke={P.outlineFur} strokeWidth=".3" />
                  <circle cx=".6" cy="-7" r=".9" fill={i === 2 ? P.woodLight : P.white} stroke={P.outlineFur} strokeWidth=".25" />
                  <path d="M1.4 -7l1.2 .3-1.2 .4z" fill={P.amber} />
                  <path d="M-.4 -1v1M.6 -1v1" stroke={P.orange} strokeWidth=".4" />
                </g>
              ))}
            </ArtSvg>
          </div>
        ) : null}
        {!night ? (
          <div className="critter k4-heron">
            <ArtSvg viewBox="0 0 10 16">
              <path d="M4.4 16v-5M5.6 16v-5" stroke={P.amber} strokeWidth=".5" />
              <ellipse cx="5" cy="9" rx="3" ry="2.2" fill={P.white} stroke={P.stoneLight} strokeWidth=".3" />
              <path d="M7 8Q8.4 5 7 3" stroke={P.white} strokeWidth="1.2" fill="none" />
              <circle cx="7.2" cy="2.6" r="1" fill={P.white} />
              <path d="M8 2.6l2 .4" stroke={P.ink} strokeWidth=".5" />
            </ArtSvg>
          </div>
        ) : null}
        {night ? Array.from({ length: 6 }, (_, i) => <span key={i} className="firefly" style={{ left: `${10 + i * 15}%`, top: `${36 + ((i * 11) % 34)}%` }} />) : null}
      </div>
    )
  }
  if (chapter === 'gewuerzgarten') {
    return (
      <div className="critters" aria-hidden="true">
        {season === 'summer' ? <div className="critter k4-rain" /> : null}
        {!night ? (
          <div className="critter k4-hornbill">
            <ArtSvg viewBox="0 0 26 10">
              <path d="M0 5 Q6 0 12 4 Q17 0 24 4 Q17 3 13 6 Q6 3 0 5z" fill={P.ink} />
              <path d="M2 4.6h5M17 4h5" stroke={P.white} strokeWidth=".7" />
              <ellipse cx="12" cy="5.4" rx="4" ry="1.6" fill={P.ink} />
              <circle cx="17" cy="4.6" r="1.4" fill={P.ink} />
              <path d="M18 4Q22 3.6 25 5.6Q21 5 18 5.4z" fill={P.yellow} />
              <path d="M18.4 3.4Q21 2.6 22.4 3.8L18.6 4z" fill={P.amber} />
            </ArtSvg>
          </div>
        ) : null}
        {!night && season !== 'summer'
          ? [0, 1, 2].map((i) => (
              <div key={i} className={`critter k4-butterfly f${i}`}>
                <ArtSvg viewBox="0 0 10 8">
                  <path d="M5 4L1 1Q0 4 2 5.4zM5 4L9 1Q10 4 8 5.4z" fill={[P.blue, P.yellow, P.ink][i]} stroke={P.ink} strokeWidth=".4" />
                  <path d="M5 4.4L3 7.4M5 4.4L7 7.4" stroke={[P.blue, P.yellow, P.ink][i]} strokeWidth="1.2" />
                  <path d="M5 2.6v3.6" stroke={P.ink} strokeWidth=".6" />
                </ArtSvg>
              </div>
            ))
          : null}
        {night ? Array.from({ length: 6 }, (_, i) => <span key={i} className="firefly" style={{ left: `${10 + i * 15}%`, top: `${36 + ((i * 11) % 34)}%` }} />) : null}
      </div>
    )
  }
  if (chapter === 'oase') {
    return (
      <div className="critters" aria-hidden="true">
        <div className="critter k5-flow">
          <ArtSvg viewBox="0 0 4 40">
            <path d="M2 0v6M2 14v6M2 28v6" stroke={P.glassEdge} strokeWidth="1.2" strokeLinecap="round" />
          </ArtSvg>
        </div>
        <div className="critter k5-camel">
          <ArtSvg viewBox="0 0 20 18">
            <path d="M5 18v-6M7 18v-6M12 18v-6M14 18v-6" stroke={P.woodMid} strokeWidth="1" />
            <path d="M3 12Q3 8 6 8Q8 4 10 7Q12 4 14 8Q16 9 16 12z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
            <path d="M15.4 10Q18 8 17.6 4" stroke={P.woodLight} strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <ellipse cx="18.4" cy="3.8" rx="1.6" ry="1" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
            <path d="M3.2 10.6l-1.4 3" stroke={P.woodMid} strokeWidth=".6" />
          </ArtSvg>
        </div>
        {!night ? (
          <div className="critter k5-hoopoe">
            <ArtSvg viewBox="0 0 12 10">
              <path d="M5 10V8M6.4 10V8" stroke={P.charcoal} strokeWidth=".5" />
              <ellipse cx="5.4" cy="6.4" rx="3" ry="1.8" fill={P.amber} />
              <path d="M3 6l-2.6 1.4M3.4 6.8l-2 1" stroke={P.ink} strokeWidth=".8" />
              <path d="M3.6 5.6h3" stroke={P.white} strokeWidth=".4" strokeDasharray=".6 .5" />
              <circle cx="8.4" cy="4.6" r="1.2" fill={P.amber} />
              <path d="M9.4 4.8l2.4 .8" stroke={P.ink} strokeWidth=".4" />
              <path d="M7.6 3.6l-1 -2.6l1.8 1.4l.4 -2.2l.8 2.4" fill={P.amber} stroke={P.ink} strokeWidth=".25" />
            </ArtSvg>
          </div>
        ) : null}
        {night ? Array.from({ length: 7 }, (_, i) => <span key={i} className="star-twinkle" style={{ left: `${8 + i * 13}%`, top: `${20 + ((i * 7) % 14)}%`, animationDelay: `${-i * 0.7}s` }} />) : null}
      </div>
    )
  }
  if (chapter === 'kakaogarten') {
    return (
      <div className="critters" aria-hidden="true">
        {!night ? (
          <div className="critter k5-hornbill">
            <ArtSvg viewBox="0 0 26 10">
              <path d="M0 5 Q6 0 12 4 Q17 0 24 4 Q17 3 13 6 Q6 3 0 5z" fill={P.charcoal} />
              <ellipse cx="12" cy="5.4" rx="4" ry="1.6" fill={P.charcoal} />
              <circle cx="17" cy="4.6" r="1.4" fill={P.charcoal} />
              <path d="M18 4Q22 3.6 25 5.6Q21 5 18 5.4z" fill={P.cream} />
              <path d="M2 5.2h4" stroke={P.white} strokeWidth=".6" />
            </ArtSvg>
          </div>
        ) : null}
        {[0, 1, 2].map((i) => (
          <div key={i} className={`critter chicken k5-hen h${i}`}>
            <ArtSvg viewBox="0 0 20 18">
              <ellipse cx="9" cy="11" rx="6.5" ry="5" fill={i === 1 ? P.woodDark : i ? P.woodMid : P.cream} stroke={P.outlineSoft} strokeWidth=".7" />
              <circle cx="15" cy="7" r="3" fill={i === 1 ? P.woodDark : i ? P.woodMid : P.cream} stroke={P.outlineSoft} strokeWidth=".7" />
              <path d="M14 3.6l1 -1.6l1 1.6z" fill={P.red} />
              <path d="M17.6 7l2 .6l-2 .6z" fill={P.amber} />
              <path d="M7 16v2M11 16v2" stroke={P.amber} strokeWidth="1" />
            </ArtSvg>
          </div>
        ))}
        {!night && season !== 'summer'
          ? [0, 1].map((i) => (
              <div key={i} className={`critter k5-butterfly f${i}`}>
                <ArtSvg viewBox="0 0 10 8">
                  <path d="M5 4L1 1Q0 4 2 5.4zM5 4L9 1Q10 4 8 5.4z" fill={[P.orange, P.blue][i]} stroke={P.ink} strokeWidth=".4" />
                  <path d="M5 2.6v3.6" stroke={P.ink} strokeWidth=".6" />
                </ArtSvg>
              </div>
            ))
          : null}
        {season === 'summer' ? <div className="critter k4-rain" /> : null}
        {night ? Array.from({ length: 6 }, (_, i) => <span key={i} className="firefly" style={{ left: `${10 + i * 15}%`, top: `${36 + ((i * 11) % 34)}%` }} />) : null}
      </div>
    )
  }
  if (chapter === 'buschgarten') {
    return (
      <div className="critters" aria-hidden="true">
        {[0, 1].map((i) => (
          <div key={i} className={`critter k5-roo r${i}`}>
            <ArtSvg viewBox="0 0 20 14">
              <path d="M8 12Q3 12 0 13.4" stroke={P.wood} strokeWidth="1.3" fill="none" strokeLinecap="round" />
              <path d="M6.6 13Q6 7.6 10 7.2Q13.6 7.4 14 11L12.6 12Q10.6 12.6 8.6 13z" fill={i ? P.woodMid : P.wood} stroke={P.outlineWood} strokeWidth=".3" />
              <path d="M13.6 10.4Q14.6 11 14.8 12.6" stroke={i ? P.woodMid : P.wood} strokeWidth="1.2" fill="none" />
              <path d="M14.2 12.2l2.6 .6l-.2 .8l-2.6 -.2z" fill={i ? P.woodMid : P.wood} stroke={P.outlineWood} strokeWidth=".2" />
              <path d="M14.4 11.8l-.6 -1.6M15 12l-.2 -1.6" stroke={P.woodDark} strokeWidth=".55" strokeLinecap="round" />
              <path d="M8 13.6h4" stroke={P.woodDark} strokeWidth=".8" strokeLinecap="round" />
            </ArtSvg>
          </div>
        ))}
        {!night
          ? [0, 1].map((i) => (
              <div key={i} className={`critter k5-cockatoo c${i}`}>
                <ArtSvg viewBox="0 0 22 10">
                  <path d="M0 5 Q5 0 10 4 Q15 0 22 4 Q15 3 11 6 Q6 3 0 5z" fill={P.white} stroke={P.stoneLight} strokeWidth=".3" />
                  <ellipse cx="10" cy="5.4" rx="4" ry="1.6" fill={P.white} />
                  <circle cx="15" cy="4.4" r="1.4" fill={P.white} />
                  <path d="M15 3l-.6 -2.4l1.6 1.8" fill={P.yellow} />
                  <path d="M16.2 4.4l1.2 .5l-1.2 .4z" fill={P.charcoal} />
                </ArtSvg>
              </div>
            ))
          : null}
        {!night ? (
          <div className="critter k5-lizard">
            <ArtSvg viewBox="0 0 16 8">
              <ellipse cx="8" cy="6" rx="7" ry="2" fill={P.terracottaLight} />
              <path d="M2 4.6Q5 3.6 9 4.2Q12 4.6 13.6 3.8" stroke={P.stoneDark} strokeWidth="1.4" fill="none" strokeLinecap="round" />
              <path d="M5 4l-.6 1.4M9 4.4l.4 1.2" stroke={P.stoneDark} strokeWidth=".5" />
              <circle cx="13.4" cy="3.6" r=".25" fill={P.ink} />
            </ArtSvg>
          </div>
        ) : null}
        {night ? Array.from({ length: 8 }, (_, i) => <span key={i} className="star-twinkle" style={{ left: `${6 + i * 12}%`, top: `${20 + ((i * 7) % 16)}%`, animationDelay: `${-i * 0.6}s` }} />) : null}
      </div>
    )
  }
  if (chapter === 'farngarten') {
    return (
      <div className="critters" aria-hidden="true">
        {!night ? (
          <div className="critter k5-tui">
            <ArtSvg viewBox="0 0 12 10">
              <path d="M2 8h9" stroke={P.bark} strokeWidth="1" />
              <path d="M4 6.4l-3 1.4" stroke={P.charcoal} strokeWidth="1" strokeLinecap="round" />
              <ellipse cx="6" cy="6" rx="2.4" ry="1.7" fill={P.charcoal} />
              <circle cx="8" cy="4.2" r="1.2" fill={P.charcoal} />
              <circle cx="8" cy="5.8" r=".5" fill={P.white} />
              <path d="M9 4.1l1.2 .3" stroke={P.ink} strokeWidth=".4" />
            </ArtSvg>
          </div>
        ) : null}
        {!night ? (
          <div className="critter k5-fantail">
            <ArtSvg viewBox="0 0 12 8">
              <path d="M5 5L.4 2.4Q0 5 .6 7.4z" fill={P.woodMid} stroke={P.cream} strokeWidth=".4" />
              <ellipse cx="6.6" cy="4.6" rx="2.2" ry="1.4" fill={P.woodMid} />
              <ellipse cx="7" cy="5.2" rx="1.2" ry=".7" fill={P.amber} />
              <circle cx="8.8" cy="3.6" r="1" fill={P.charcoal} />
              <path d="M8.4 4.2h1" stroke={P.white} strokeWidth=".3" />
            </ArtSvg>
          </div>
        ) : null}
        {night ? Array.from({ length: 10 }, (_, i) => <span key={i} className="critter k5-glow" style={{ left: `${8 + ((i * 37) % 84)}%`, top: `${30 + ((i * 13) % 50)}%`, animationDelay: `${-i * 0.5}s` }} />) : null}
        {night && season === 'winter' ? Array.from({ length: 7 }, (_, i) => <span key={`m${i}`} className="star-twinkle" style={{ left: `${56 + (i % 4) * 3}%`, top: `${19 + Math.floor(i / 2) * 2}%`, animationDelay: `${-i * 0.4}s` }} />) : null}
      </div>
    )
  }
  if (chapter === 'kimchigarten') {
    return (
      <div className="critters" aria-hidden="true">
        {[0, 1].map((i) => (
          <div key={i} className={`critter k5-magpie m${i}`}>
            <ArtSvg viewBox="0 0 12 8">
              <path d="M5.4 8v-1M6.8 8v-1" stroke={P.ink} strokeWidth=".4" />
              <path d="M4.4 4.8l-4.4 1.6l.4 .8l4.4 -1.2z" fill={P.ink} />
              <ellipse cx="6.4" cy="5" rx="2.2" ry="1.5" fill={P.ink} />
              <ellipse cx="6" cy="5.2" rx="1.2" ry=".9" fill={P.white} />
              <circle cx="8.4" cy="3.6" r="1.1" fill={P.ink} />
              <path d="M9.4 3.5l1.2 .3l-1.2 .3z" fill={P.ink} />
            </ArtSvg>
          </div>
        ))}
        <div className="critter k5-kaki">
          <ArtSvg viewBox="0 0 20 14">
            <path d="M0 2Q8 3 18 1" stroke={P.bark} strokeWidth="1.2" fill="none" />
            {[4, 9, 14].map((x, i) => (
              <g key={x}>
                <path d={`M${x} 2.4v2`} stroke={P.bark} strokeWidth=".5" />
                <circle cx={x} cy={6.4} r="2" fill={P.orange} stroke={P.autumnDark} strokeWidth=".3" />
                <path d={`M${x - 1} 4.6h2`} stroke={P.leafDark} strokeWidth=".6" />
                {season !== 'winter' && i !== 1 ? <ellipse cx={x + 2.4} cy={3} rx="2" ry=".9" fill={season === 'autumn' ? P.gold : P.leafDark} /> : null}
              </g>
            ))}
          </ArtSvg>
        </div>
        {season === 'winter' ? <div className="critter k5-ondol" /> : null}
        {night ? Array.from({ length: 6 }, (_, i) => <span key={i} className="star-twinkle" style={{ left: `${10 + i * 15}%`, top: `${20 + ((i * 7) % 12)}%`, animationDelay: `${-i * 0.7}s` }} />) : null}
      </div>
    )
  }
  return null
})
