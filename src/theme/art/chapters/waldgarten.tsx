/**
 * Kapitel-Grafik Kapitel 42: Waldgarten hinter der Baumschule (sieben
 * Schichten). Jahreszeiten: Frühling = Haselkätzchen, Bärlauch blüht weiß,
 * Erdbeerblüten; Sommer = Beeren rot, dichtes Laub; Herbst = Nüsse, buntes
 * Laub, Pilze; Winter = kahle Zweige, Schnee, Eis auf dem Teich.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { P } from '../palette'
import type { AreaProps } from './partsB'
import { Farmer, Patch } from './partsF'
import { Kid, LeafLitter, LeafTree, Mushroom, Signpost, Snowfall, SnowDrifts } from './partsH'
import { ssn } from './season'

/** Waldboden: Frühling Moos, Sommer Laubstreu, Herbst buntes Laub, Winter Schnee. */
function Floor({ season, cy = 61, rx = 36, ry = 9 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const fill = z === 'spring' ? P.leafMoss : z === 'summer' ? P.soil : z === 'autumn' ? P.woodMid : P.cream
  return (
    <g>
      <Patch fill={fill} cy={cy} rx={rx} ry={ry} edge={z === 'winter' ? P.frost : P.soilDark} />
      {z === 'autumn' ? <LeafLitter cy={cy + 2} w={rx * 1.6} n={10} /> : null}
      {z === 'summer' ? [-0.6, -0.1, 0.4, 0.75].map((d) => <ellipse key={d} cx={40 + rx * d} cy={cy + 2} rx="1.6" ry=".6" fill={P.woodMid} />) : null}
      {z === 'winter' ? <SnowDrifts cy={cy + 2} w={rx * 1.4} /> : null}
    </g>
  )
}

/** Haselstrauch: mehrere Triebe; Winter/Frühling Kätzchen, Sommer grüne Nüsse, Herbst gelb mit braunen Nüssen. */
function Hazel({ x, y, s = 1, season, nuts = 3 }: { x: number; y: number; s?: number; season?: string; nuts?: number }) {
  const z = ssn(season)
  const bare = z === 'winter'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0l-4 -12M0 0l-1 -14M0 0l3 -13M0 0l5 -10" stroke={P.bark} strokeWidth=".8" />
      {bare ? null : (
        <g>
          <ellipse cx="-3" cy="-11" rx="5" ry="4" fill={z === 'autumn' ? P.gold : z === 'spring' ? P.leafPale : P.leaf} stroke={P.outline} strokeWidth=".3" />
          <ellipse cx="3" cy="-12" rx="5" ry="4.2" fill={z === 'autumn' ? P.yellow : z === 'spring' ? P.leafLight : P.leafDark} stroke={P.outline} strokeWidth=".3" />
          <ellipse cx="0" cy="-8" rx="5.6" ry="3.4" fill={z === 'autumn' ? P.autumn : P.leaf} stroke={P.outline} strokeWidth=".3" />
        </g>
      )}
      {bare || z === 'spring'
        ? [[-3.4, -11], [-1, -13], [2.6, -12], [4.4, -9]].map(([cx, cy], i) => (
            <path key={i} d={`M${cx} ${cy}q.4 2 0 3.6`} stroke={P.yellow} strokeWidth="1" strokeLinecap="round" fill="none" />
          ))
        : null}
      {z === 'summer' || z === 'autumn'
        ? Array.from({ length: nuts }, (_, i) => (
            <g key={i}>
              <circle cx={-3 + i * 2.4} cy={-7 - (i % 2) * 3} r="1" fill={z === 'autumn' ? P.woodMid : P.leafPale} stroke={P.outlineWood} strokeWidth=".2" />
              <path d={`M${-3.8 + i * 2.4} ${-7.8 - (i % 2) * 3}l.8 -.8l.8 .8`} stroke={P.leafDark} strokeWidth=".4" fill="none" />
            </g>
          ))
        : null}
      {bare ? <path d="M-4 -12l1.2 .6M3 -13l-1 .6" stroke={P.white} strokeWidth=".8" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Johannisbeerstrauch: Frühling grüne Blütentrauben, Sommer rote Rispen, Herbst gelb, Winter kahl. */
function Currant({ x, y, s = 1, season, n = 3 }: { x: number; y: number; s?: number; season?: string; n?: number }) {
  const z = ssn(season)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0l-3 -7M0 0v-8M0 0l3 -7" stroke={P.bark} strokeWidth=".6" />
      {z === 'winter' ? (
        <path d="M-3 -7l1 .4M3 -7l-1 .4" stroke={P.white} strokeWidth=".7" />
      ) : (
        <ellipse cx="0" cy="-6" rx="4.6" ry="3.4" fill={z === 'autumn' ? P.gold : P.leaf} stroke={P.outline} strokeWidth=".3" />
      )}
      {z === 'summer'
        ? Array.from({ length: n }, (_, i) => (
            <g key={i}>
              {[0, 1, 2].map((k) => (
                <circle key={k} cx={-2.6 + i * 2.2 + k * 0.2} cy={-4.4 + k * 1} r=".55" fill={i % 3 === 2 ? P.leafPale : P.red} />
              ))}
            </g>
          ))
        : null}
      {z === 'spring' ? [-2, 0, 2].map((d) => <path key={d} d={`M${d} -5v1.6`} stroke={P.leafPale} strokeWidth=".7" />) : null}
    </g>
  )
}

/** Bodenpflanze: Bärlauch (weiße Sterndolden im Frühling), Beinwell (lila Glocken im Sommer), Minze. */
function Herb({ x, y, kind, season }: { x: number; y: number; kind: number; season?: string }) {
  const z = ssn(season)
  if (z === 'winter') return <ellipse cx={x} cy={y - 0.6} rx="2.4" ry=".8" fill={P.white} />
  const leaf = z === 'autumn' ? P.leafMoss : kind === 1 ? P.leafDark : P.leaf
  return (
    <g>
      {kind === 0 ? (
        <path d={`M${x} ${y}q-3 -2 -3.4 -5M${x} ${y}q3 -2 3.4 -5M${x} ${y}v-5`} stroke={leaf} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx={x} cy={y - 2.4} rx={kind === 1 ? 3 : 2.4} ry={kind === 1 ? 3 : 2} fill={leaf} stroke={P.leafDark} strokeWidth=".2" />
      )}
      {kind === 0 && z === 'spring' ? <circle cx={x} cy={y - 6.4} r="1.2" fill={P.white} stroke={P.cream} strokeWidth=".3" /> : null}
      {kind === 1 && (z === 'summer' || z === 'spring') ? [-1, 1].map((d) => <ellipse key={d} cx={x + d * 1.4} cy={y - 5.4} rx=".6" ry=".9" fill={P.lavender} />) : null}
      {kind === 2 && z === 'summer' ? <path d={`M${x} ${y - 4}v-2`} stroke={P.lilac} strokeWidth="1" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Walderdbeere: dreiteiliges Blatt, Frühling weiße Blüte, Sommer rote Beere, Herbst rotes Laub. */
function Strawberry({ x, y, season, berry = true }: { x: number; y: number; season?: string; berry?: boolean }) {
  const z = ssn(season)
  if (z === 'winter') return <ellipse cx={x} cy={y - 0.6} rx="1.8" ry=".6" fill={P.white} />
  const leaf = z === 'autumn' ? P.autumnDark : P.leaf
  return (
    <g>
      {[-1.2, 0, 1.2].map((d) => (
        <ellipse key={d} cx={x + d} cy={y - 1.2 - (d === 0 ? 0.8 : 0)} rx="1.2" ry=".9" fill={leaf} stroke={P.leafDark} strokeWidth=".15" />
      ))}
      {z === 'spring' && berry ? <circle cx={x + 1.4} cy={y - 3} r=".7" fill={P.white} stroke={P.yellow} strokeWidth=".25" /> : null}
      {z === 'summer' && berry ? <path d={`M${x + 0.6} ${y - 1.6}q.7 -.6 1.4 0l-.7 1.8z`} fill={P.red} /> : null}
    </g>
  )
}

/** Stamm mit Pilzen (liegend, Fußpunkt links unten). */
function Log({ x, y, w = 22, n = 3, season }: { x: number; y: number; w?: number; n?: number; season?: string }) {
  const z = ssn(season)
  return (
    <g>
      <rect x={x} y={y - 4.4} width={w} height="4.4" rx="2" fill={P.stoneLight} stroke={P.stoneDark} strokeWidth=".4" />
      <ellipse cx={x + w} cy={y - 2.2} rx="1.6" ry="2.2" fill={P.woodLight} stroke={P.woodDark} strokeWidth=".3" />
      {[0.25, 0.5, 0.75].map((t) => (
        <circle key={t} cx={x + w * t} cy={y - 2.4} r=".35" fill={P.stoneDark} />
      ))}
      {Array.from({ length: z === 'winter' ? 0 : n + (z === 'autumn' ? 1 : 0) }, (_, i) => (
        <Mushroom key={i} x={x + 3 + ((i * 6.4) % (w - 4))} y={y - 3.6} s={1.9} c={P.bark} />
      ))}
      {z === 'winter' ? <path d={`M${x + 1} ${y - 4.4}h${w - 2}`} stroke={P.white} strokeWidth="1.2" strokeLinecap="round" /> : null}
    </g>
  )
}

export function Waldgarten({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  const spring = z === 'spring'
  const autumn = z === 'autumn'
  switch (id) {
    case 'kronenschicht': {
      const trees: [number, number, number, string][] = [[40, 62, 1.9, P.leafDark], [16, 66, 1.25, P.leaf], [64, 66, 1.25, P.leafDark]]
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {trees.slice(0, tier >= 4 ? 3 : tier >= 2 ? 2 : 1).map(([x, y, s, c], i) => (
            <LeafTree key={i} x={x} y={y} s={s} season={season} crown={c} fruit={i === 1 ? P.woodMid : P.leafPale} n={tier + 1} blossom={P.cream} />
          ))}
          {tier >= 3 && autumn ? [30, 48, 54].map((x) => <circle key={x} cx={x} cy={64} r=".9" fill={P.woodDark} />) : null}
          {tier >= 3 && !autumn ? <path d="M30 64l2 -1M50 65l-2 -1" stroke={P.leafDark} strokeWidth=".6" /> : null}
          {tier >= 5 ? <Farmer x={70} y={72} c={P.leafDark} s={0.75} hat={P.woodLight} /> : null}
          {winter ? <Snowfall n={7} y1={40} /> : null}
        </Svg>
      )
    }
    case 'haselhecke': {
      const n = 1 + tier
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Hazel key={i} x={12 + ((i * 11) % 58)} y={60 + (i % 2) * 5} s={1.3 + (i % 2) * 0.15} season={season} nuts={2 + Math.min(3, tier)} />
          ))}
          {tier >= 4 && autumn ? <path d="M60 66l4 -2l2 2" stroke={P.blue} strokeWidth="1" fill="none" /> : null}
          {tier >= 5 ? <Kid x={72} y={72} c={P.orange} s={1.1} /> : null}
          {winter ? <Snowfall n={6} y1={34} /> : null}
        </Svg>
      )
    }
    case 'beerenschicht': {
      const n = 2 + tier
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <LeafTree x={62} y={50} s={1} season={season} crown={P.leafDark} />
          {Array.from({ length: n }, (_, i) => (
            <Currant key={i} x={12 + ((i * 9) % 48)} y={58 + (i % 3) * 4} s={1.4} season={season} n={2 + Math.min(3, tier)} />
          ))}
          {tier >= 4 && summer ? <path d="M64 66h6l-1 3h-4z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 4 && summer ? [65.4, 67, 68.6].map((x) => <circle key={x} cx={x} cy={65.4} r=".6" fill={P.red} />) : null}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.berry} s={0.75} hat={P.woodLight} /> : null}
          {winter ? <Snowfall n={6} y1={34} /> : null}
        </Svg>
      )
    }
    case 'kraeuterschicht': {
      const n = 3 + tier * 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <g key={i} transform={`translate(${10 + ((i * 13) % 60)} ${56 + ((i * 5) % 12)}) scale(1.5)`}>
              <Herb x={0} y={0} kind={i % 3} season={season} />
            </g>
          ))}
          {tier >= 3 ? <path d="M60 50v14" stroke={P.woodLight} strokeWidth=".7" /> : null}
          {tier >= 3 ? <rect x="56" y="48" width="8" height="3.4" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 5 ? <Kid x={70} y={72} c={P.leaf} s={1.1} /> : null}
          {winter ? <Snowfall n={6} y1={34} /> : null}
        </Svg>
      )
    }
    case 'bodendecker': {
      const n = 4 + tier * 3
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <g key={i} transform={`translate(${10 + ((i * 7.3) % 60)} ${55 + ((i * 3) % 12)}) scale(1.4)`}>
              <Strawberry x={0} y={0} season={season} berry={i % 2 === 0} />
            </g>
          ))}
          {tier >= 3 ? <LeafTree x={14} y={52} s={0.7} season={season} crown={P.leaf} fruit={P.red} blossom={P.white} /> : null}
          {tier >= 5 ? <Kid x={66} y={70} c={P.red} s={1.1} skirt={P.blue} /> : null}
          {winter ? <Snowfall n={6} y1={34} /> : null}
        </Svg>
      )
    }
    case 'kletterpflanzen': {
      const poles = Math.min(4, tier)
      const leaf = spring ? P.leafPale : summer ? P.leaf : autumn ? P.gold : null
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: poles }, (_, i) => {
            const x = 16 + i * 16
            const h = 32 + (i % 2) * 6
            return (
              <g key={i}>
                <path d={`M${x} 64V${64 - h}`} stroke={P.woodMid} strokeWidth="1.2" />
                <path d={`M${x} 64q-4 -${h * 0.25} 0 -${h * 0.5}q4 -${h * 0.25} 0 -${h * 0.5}`} stroke={winter ? P.woodDark : P.leafDark} strokeWidth=".6" fill="none" />
                {leaf
                  ? [0.12, 0.26, 0.4, 0.54, 0.68, 0.82, 0.94].map((k, j) => (
                      <ellipse key={k} cx={x + (j % 2 ? 2.2 : -2.2)} cy={64 - h * k} rx="2.2" ry="1.4" fill={leaf} stroke={P.leafDark} strokeWidth=".2" />
                    ))
                  : null}
                {(summer || autumn) && i % 2 === 0 ? [0.3, 0.65].map((k) => <ellipse key={k} cx={x + 1} cy={64 - h * k + 2} rx="1" ry="1.3" fill={P.leafPale} stroke={P.leafDark} strokeWidth=".2" />) : null}
                {(summer || autumn) && i % 2 === 1 ? [0.35, 0.7].map((k) => <path key={k} d={`M${x - 1} ${64 - h * k + 1}l1 2.4l1 -2.4l-1 -1z`} fill={P.leafPale} stroke={P.leaf} strokeWidth=".2" />) : null}
              </g>
            )
          })}
          {tier >= 3 ? <path d={`M16 ${64 - 30}H${16 + (poles - 1) * 16}`} stroke={P.woodMid} strokeWidth=".6" /> : null}
          {tier >= 5 ? <Kid x={72} y={72} c={P.blue} s={1.1} /> : null}
          {winter ? <Snowfall n={6} y1={34} /> : null}
        </Svg>
      )
    }
    case 'pilzstaemme': {
      const logs = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <LeafTree x={64} y={46} s={0.9} season={season} crown={P.leafDark} />
          {Array.from({ length: logs }, (_, i) => (
            <Log key={i} x={10 + (i % 2) * 6} y={66 - i * 5} w={26} n={1 + Math.min(3, tier)} season={season} />
          ))}
          {tier >= 3 ? (
            <g>
              <path d="M48 64l6 -16M58 64l-6 -16" stroke={P.woodDark} strokeWidth="1" />
              <rect x="50" y="52" width="6" height="2.4" rx="1" fill={P.stoneLight} stroke={P.stoneDark} strokeWidth=".3" />
              {!winter ? <Mushroom x={53} y={52} s={1.2} c={P.woodMid} /> : null}
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={70} y={72} c={P.leafMoss} s={0.75} hat={P.woodDark} /> : null}
          {winter ? <Snowfall n={6} y1={34} /> : null}
        </Svg>
      )
    }
    case 'weidenteich': {
      const reeds = 2 + tier * 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <ellipse cx="38" cy="62" rx="22" ry="6" fill={winter ? P.glassEdge : P.water} stroke={P.soilDark} strokeWidth=".6" />
          {!winter ? <path d="M24 61h8M42 63h10" stroke={P.waterLight} strokeWidth=".6" /> : <path d="M24 61l6 2M44 62l6 -1" stroke={P.white} strokeWidth=".5" />}
          <g>
            <path d="M64 64V40" stroke={P.bark} strokeWidth="2" />
            {Array.from({ length: 5 + tier }, (_, i) => (
              <path key={i} d={`M64 40q${-12 + i * 3} 2 ${-14 + i * 3.6} ${14 + (i % 3) * 2}`} stroke={winter ? P.woodMid : autumn ? P.gold : spring ? P.leafPale : P.leafLight} strokeWidth="1" fill="none" />
            ))}
          </g>
          {Array.from({ length: reeds }, (_, i) => (
            <path key={i} d={`M${14 + i * 2.6} 60v-${6 + (i % 3) * 2}`} stroke={winter ? P.woodLight : P.leafDark} strokeWidth=".7" />
          ))}
          {tier >= 3 && !winter ? <ellipse cx="44" cy="61" rx="2.4" ry="1.4" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 3 && !winter ? <circle cx="45.4" cy="60.4" r=".4" fill={P.lamp} /> : null}
          {tier >= 4 && summer ? <path d="M30 50h6M33 49v2" stroke={P.blue} strokeWidth=".8" /> : null}
          {tier >= 4 && spring ? [28, 32].map((x) => <circle key={x} cx={x} cy={62} r=".8" fill={P.charcoal} />) : null}
          {tier >= 5 ? <Kid x={14} y={72} c={P.yellow} s={1.1} /> : null}
          {winter ? <Snowfall n={6} y1={34} /> : null}
        </Svg>
      )
    }
    case 'lehrpfad': {
      const signs = Math.min(7, 2 + tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <path d="M8 66Q40 56 72 60" stroke={winter ? P.white : P.woodLight} strokeWidth="4" fill="none" strokeLinecap="round" />
          {!winter ? [16, 28, 40, 52, 64].map((x, i) => <ellipse key={x} cx={x} cy={63.4 - Math.sin(((x - 8) / 64) * Math.PI) * 4 + (i % 2) * 0.6} rx=".8" ry=".4" fill={P.woodMid} />) : null}
          {Array.from({ length: signs }, (_, i) => {
            const x = 9 + i * 10
            const y = 60 - Math.sin((i / 6) * Math.PI) * 6
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(1.3)`}>
                <Signpost x={0} y={0} dir={i === 6 ? 'down' : 'right'} c={[P.leafPale, P.leaf, P.yellow, P.gold, P.red, P.woodLight, P.soil][i]!} />
              </g>
            )
          })}
          <LeafTree x={70} y={42} s={0.7} season={season} crown={P.leafDark} />
          {tier >= 4 ? <Kid x={30} y={70} c={P.berry} s={1.1} /> : null}
          {tier >= 5 ? <Farmer x={40} y={70} c={P.leafDark} s={0.75} hat={P.woodLight} /> : null}
          {winter ? <Snowfall n={6} y1={30} /> : null}
        </Svg>
      )
    }
    case 'waldgartenfest': {
      const guests = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <LeafTree x={14} y={50} s={1} season={season} crown={P.leafDark} />
          <LeafTree x={66} y={50} s={1} season={season} crown={P.leaf} />
          <path d="M14 32Q40 40 66 32" stroke={P.outlineWood} strokeWidth=".4" fill="none" />
          {Array.from({ length: 2 + tier }, (_, i) => {
            const t = (i + 0.5) / (2 + tier)
            const lx = 14 + 52 * t
            const ly = 32 + 16 * t * (1 - t)
            return <circle key={i} cx={lx} cy={ly + 1.4} r="1.2" fill={[P.lamp, P.orange, P.yellow][i % 3]} stroke={P.outlineWood} strokeWidth=".2" />
          })}
          <rect x="26" y="54" width="28" height="2" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
          <path d="M28 56v6M52 56v6" stroke={P.woodDark} strokeWidth=".8" />
          <path d="M34 54a4 2 0 0 1 8 0z" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" />
          {tier >= 2 ? [46, 49].map((x) => <circle key={x} cx={x} cy={53} r=".9" fill={P.red} />) : null}
          {tier >= 3 ? <rect x="29" y="51.4" width="2.4" height="2.6" fill={P.glass} stroke={P.stone} strokeWidth=".2" /> : null}
          {Array.from({ length: guests }, (_, i) => (
            <Farmer key={i} x={22 + i * 12} y={68 + (i % 2) * 2} c={[P.leaf, P.berry, P.yellow, P.blue][i]!} s={0.75} hat={[P.woodLight, P.charcoal, P.plum, P.woodDark][i]!} />
          ))}
          {winter ? <Snowfall n={6} y1={30} /> : null}
        </Svg>
      )
    }
  }
  return null
}
