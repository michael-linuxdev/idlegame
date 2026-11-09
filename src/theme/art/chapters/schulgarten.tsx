/**
 * Kapitel-Grafik Kapitel 41: Schulgarten einer Grundschule.
 * Jahreszeiten: Frühling = Aussaat, Weidentipi treibt aus; Sommer =
 * Sommerferien mit Gießplan, Radieschen rot; Herbst = Laub, Erntefest;
 * Winter = Schnee auf Beeten und Insektenhotel, Weidenruten kahl.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { P } from '../palette'
import { Bunting } from './partsA'
import type { AreaProps } from './partsB'
import { Farmer, Patch } from './partsF'
import { Bee, Can, Kid, LeafLitter, Snowfall, SnowDrifts, Sun, WoodBox } from './partsH'
import { ssn } from './season'

/** Schulgarten-Boden: Frühling Erde, Sommer Rasen, Herbst Laub, Winter Schnee. */
function Floor({ season, cy = 61, rx = 36, ry = 9 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const fill = z === 'spring' ? P.soil : z === 'summer' ? P.leafMoss : z === 'autumn' ? P.woodMid : P.cream
  return (
    <g>
      <Patch fill={fill} cy={cy} rx={rx} ry={ry} edge={z === 'winter' ? P.frost : P.outlineSoft} />
      {z === 'autumn' ? <LeafLitter cy={cy + 2} w={rx * 1.6} n={9} /> : null}
      {z === 'winter' ? <SnowDrifts cy={cy + 2} w={rx * 1.4} /> : null}
    </g>
  )
}

/** Radieschen: Blätter und rote Knolle (Frühling Keimling, Winter nur Schnee). */
function Radish({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  if (z === 'winter') return <ellipse cx={x} cy={y - 0.6} rx={1.4 * s} ry={0.6 * s} fill={P.white} />
  const small = z === 'spring'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {small ? null : <circle cx="0" cy="-.6" r="1.3" fill={P.red} stroke={P.berry} strokeWidth=".2" />}
      <path d={small ? 'M0 -.4q-1 -1.4 -1.6 -1.4M0 -.4q1 -1.4 1.6 -1.4' : 'M0 -1.6q-2.4 -2 -2.4 -3.6M0 -1.6q2.4 -2 2.4 -3.6M0 -1.6v-3'} stroke={P.leaf} strokeWidth={small ? 0.7 : 1} fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Beet mit Holzkante (Fußpunkt unten links). */
function Bed({ x, y, w, h = 7, season }: { x: number; y: number; w: number; h?: number; season?: string }) {
  const winter = ssn(season) === 'winter'
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} rx="1" fill={winter ? P.cream : P.soil} stroke={P.wood} strokeWidth="1" />
      <path d={`M${x + 1} ${y - h / 2}h${w - 2}`} stroke={winter ? P.frost : P.soilDark} strokeWidth=".3" strokeDasharray="1 1" />
    </g>
  )
}

/** Klassenschild am Stab. */
function ClassSign({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <path d={`M${x} ${y}v-6`} stroke={P.woodDark} strokeWidth=".6" />
      <rect x={x - 2.4} y={y - 9} width="4.8" height="3.4" rx=".5" fill={c} stroke={P.outline} strokeWidth=".25" />
      <path d={`M${x - 1.2} ${y - 7.3}h2.4`} stroke={P.white} strokeWidth=".5" />
    </g>
  )
}

/** Gießplan: Tafel mit Kästchen und Haken (Sommerferien). */
function WaterPlan({ x, y, ticks }: { x: number; y: number; ticks: number }) {
  return (
    <g>
      <path d={`M${x + 2} ${y}v-8M${x + 12} ${y}v-8`} stroke={P.woodDark} strokeWidth=".7" />
      <rect x={x} y={y - 18} width="14" height="10" fill={P.white} stroke={P.woodDark} strokeWidth=".5" />
      {[0, 1, 2].map((r) => (
        <path key={r} d={`M${x + 1} ${y - 15 + r * 3}h12`} stroke={P.stone} strokeWidth=".25" />
      ))}
      {[0, 1, 2, 3].map((c) => (
        <path key={c} d={`M${x + 4 + c * 2.6} ${y - 17}v8`} stroke={P.stone} strokeWidth=".25" />
      ))}
      {Array.from({ length: ticks }, (_, i) => (
        <path key={i} d={`M${x + 4.4 + (i % 4) * 2.6} ${y - 14.6 + Math.floor(i / 4) * 3}l.6 .8l1.2 -1.6`} stroke={P.leafDark} strokeWidth=".45" fill="none" />
      ))}
    </g>
  )
}

const CLASS = [P.red, P.blue, P.yellow, P.leaf, P.orange]
const SHIRT = [P.berry, P.blue, P.yellow, P.leaf, P.orange, P.lilac]

export function Schulgarten({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  const spring = z === 'spring'
  const autumn = z === 'autumn'
  switch (id) {
    case 'klassenbeete': {
      const spots: [number, number][] = [[10, 58], [42, 58], [10, 68], [42, 68]]
      const beds = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {spots.slice(0, beds).map(([x, y], i) => (
            <g key={i}>
              <Bed x={x} y={y} w={26} season={season} />
              {Array.from({ length: 5 }, (_, k) => (
                <Radish key={k} x={x + 3.4 + k * 4.8} y={y - 2} s={1.1} season={season} />
              ))}
              <ClassSign x={x + 24} y={y - 4} c={CLASS[i]!} />
            </g>
          ))}
          {summer ? <WaterPlan x={62} y={50} ticks={2 + tier * 2} /> : null}
          {summer ? <Sun x={14} y={14} r={3} /> : null}
          {winter ? <Snowfall n={6} y1={40} /> : null}
          {tier >= 5 ? <Kid x={72} y={70} c={P.berry} s={1.1} hair={P.woodDark} /> : null}
          {tier >= 5 ? <Can x={62} y={70} c={P.blue} s={1.3} /> : null}
        </Svg>
      )
    }
    case 'schulkompost': {
      const bins = Math.min(3, tier)
      const heap = spring ? P.compost : summer ? P.soilDark : autumn ? P.autumnDark : P.cream
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: bins }, (_, i) => {
            const x = 8 + i * 20
            return (
              <g key={i}>
                <path d={`M${x + 1} 64q8 -${26 + i * 3} 16 0z`} fill={i === 2 ? P.soil : heap} stroke={P.outlineWood} strokeWidth=".3" />
                {[0, 1, 2, 3].map((k) => (
                  <path key={k} d={`M${x} ${64 - k * 3}h18`} stroke={P.woodLight} strokeWidth="1.6" />
                ))}
                <path d={`M${x} 64v-12M${x + 18} 64v-12`} stroke={P.woodDark} strokeWidth="1.2" />
                {summer && i === 0 ? <path d={`M${x + 6} 54q2 -3 5 -1`} stroke={P.leaf} strokeWidth="1.2" fill="none" /> : null}
              </g>
            )
          })}
          {tier >= 4 ? (
            <g>
              <path d="M66 66l4 -10h8l-4 10z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
              <path d="M68 62h8M69.4 58.6h7" stroke={P.metal} strokeWidth=".4" strokeDasharray=".6 .6" />
            </g>
          ) : null}
          {tier >= 4 && !winter ? <path d="M30 68q2 -1.4 4 0q2 1.4 4 0" stroke={P.pink} strokeWidth=".8" fill="none" /> : null}
          {tier >= 5 ? <Kid x={62} y={70} c={P.yellow} s={1.1} /> : null}
          {winter ? <Snowfall n={6} y1={40} /> : null}
        </Svg>
      )
    }
    case 'insektenhaus': {
      const cells = [2, 3, 4, 6, 6][tier - 1]!
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <path d="M34 66v-6M46 66v-6" stroke={P.woodDark} strokeWidth="1.4" />
          <rect x="24" y="24" width="32" height="36" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".6" />
          <path d="M21 25l19 -11l19 11z" fill={P.roof} stroke={P.outlineWood} strokeWidth=".4" />
          {winter ? <path d="M22 24.6l18 -10.4l18 10.4" stroke={P.white} strokeWidth="1.4" fill="none" strokeLinecap="round" /> : null}
          {Array.from({ length: cells }, (_, i) => {
            const cx = 26 + (i % 2) * 14.4
            const cy = 26 + Math.floor(i / 2) * 11.2
            const kind = i % 6
            return (
              <g key={i}>
                <rect x={cx} y={cy} width="13.6" height="10.4" fill={kind === 1 ? P.woodLight : kind === 3 ? P.terracotta : kind === 4 ? P.gold : P.wood} stroke={P.outlineWood} strokeWidth=".3" />
                {kind === 0 || kind === 3
                  ? Array.from({ length: 6 }, (_, k) => <circle key={k} cx={cx + 2.4 + (k % 3) * 4.4} cy={cy + 3 + Math.floor(k / 3) * 4.4} r=".9" fill={P.soilDark} />)
                  : null}
                {kind === 1 || kind === 5
                  ? Array.from({ length: 8 }, (_, k) => <circle key={k} cx={cx + 1.8 + (k % 4) * 3.3} cy={cy + 2.8 + Math.floor(k / 4) * 4.6} r="1.4" fill={P.woodLight} stroke={P.woodDark} strokeWidth=".4" />)
                  : null}
                {kind === 2 ? [0, 1, 2].map((k) => <ellipse key={k} cx={cx + 2.6 + k * 4.2} cy={cy + 5.2} rx="1.8" ry="3" fill={P.bark} stroke={P.woodDark} strokeWidth=".3" />) : null}
                {kind === 4 ? <path d={`M${cx + 1} ${cy + 2}h11.6M${cx + 1} ${cy + 4.4}h11.6M${cx + 1} ${cy + 6.8}h11.6M${cx + 1} ${cy + 9}h11.6`} stroke={P.woodLight} strokeWidth=".6" /> : null}
              </g>
            )
          })}
          {!winter && tier >= 3 ? [[18, 34], [62, 30], [60, 46]].slice(0, tier - 2).map(([x, y], i) => <Bee key={i} x={x!} y={y!} s={2} />) : null}
          {tier >= 5 ? <Kid x={68} y={70} c={P.leaf} s={1.1} /> : null}
          {spring ? [12, 66].map((x) => <circle key={x} cx={x} cy={58} r="1.2" fill={P.yellow} />) : null}
        </Svg>
      )
    }
    case 'weidentipi': {
      const rods = 5 + tier * 2
      const leaf = spring ? P.leafPale : summer ? P.leaf : autumn ? P.gold : null
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: rods }, (_, i) => {
            const t = i / (rods - 1)
            const bx = 18 + t * 44
            const by = 62 + Math.sin(t * Math.PI) * 3
            return (
              <g key={i}>
                <path d={`M${bx} ${by}L${40 + (t - 0.5) * 3} 14`} stroke={P.woodMid} strokeWidth=".8" />
                {leaf
                  ? [0.25, 0.45, 0.65, 0.82].map((k, j) => {
                      const lx = bx + (40 - bx) * k + (j % 2 ? 1.2 : -1.2)
                      const ly = by + (14 - by) * k
                      return <ellipse key={k} cx={lx} cy={ly} rx="1.5" ry=".7" fill={leaf} transform={`rotate(${j % 2 ? -35 : 35} ${lx} ${ly})`} />
                    })
                  : null}
              </g>
            )
          })}
          {tier >= 3 ? <path d="M34 63v-10a6 6 0 0 1 12 0v10z" fill={P.soilDark} opacity=".8" /> : null}
          {winter ? <path d="M30 30l10 -14l10 14" stroke={P.white} strokeWidth="1" fill="none" strokeDasharray="2 1.4" /> : null}
          {winter ? <Snowfall n={5} y1={40} /> : null}
          {tier >= 5 ? <Kid x={40} y={64} c={P.yellow} s={1.1} /> : null}
        </Svg>
      )
    }
    case 'barfusspfad': {
      const segs = 1 + tier
      const fills = [P.woodMid, P.stoneLight, P.paper, P.leafMoss, P.bark, P.waterLight]
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: segs }, (_, i) => {
            const x = 6 + i * 11.4
            const y = 68 - i * 2.4
            const f = fills[i % 6]!
            return (
              <g key={i}>
                <path d={`M${x} ${y}l3.6 -10h11l-3.6 10z`} fill={winter ? P.cream : f} stroke={P.wood} strokeWidth="1" />
                {!winter && i % 6 === 1 ? [0, 1, 2, 3].map((k) => <circle key={k} cx={x + 4 + k * 2} cy={y - 3 - (k % 2) * 2} r=".7" fill={P.stone} />) : null}
                {!winter && i % 6 === 4 ? [0, 1, 2].map((k) => <ellipse key={k} cx={x + 4 + k * 2.6} cy={y - 4} rx=".9" ry="1.4" fill={P.woodDark} />) : null}
                {!winter && i % 6 === 0 ? [0, 1, 2].map((k) => <path key={k} d={`M${x + 3 + k * 2.6} ${y - 2}l1.6 -3`} stroke={P.woodDark} strokeWidth=".5" />) : null}
              </g>
            )
          })}
          {!winter && tier >= 3
            ? [0, 1, 2].map((k) => <ellipse key={k} cx={22 + k * 9} cy={60 - k * 2} rx=".8" ry="1.4" fill={P.skin} opacity=".8" />)
            : null}
          {tier >= 4 ? <path d="M62 64h6M63 64v-2h4v2" stroke={P.woodDark} strokeWidth=".6" fill="none" /> : null}
          {tier >= 4 && !winter ? <path d="M63 61.4l-1 -1.2h2zM66 61.4l-1 -1.2h2z" fill={P.red} /> : null}
          {tier >= 5 ? <Kid x={52} y={58} c={P.lilac} s={1.1} skirt={P.blue} /> : null}
          {summer ? <Sun x={68} y={14} r={3} /> : null}
          {winter ? <Snowfall n={6} y1={40} /> : null}
        </Svg>
      )
    }
    case 'kraeuterschnecke': {
      const layers = 1 + Math.min(4, tier)
      const herb = winter ? P.winterLeafDark : autumn ? P.leafMoss : P.leaf
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {tier >= 3 ? (
            <g>
              <ellipse cx="64" cy="64" rx="7" ry="2.6" fill={winter ? P.glassEdge : P.water} stroke={P.stone} strokeWidth=".6" />
              {!winter ? <path d="M60 63l1 -3M62 63v-4" stroke={P.leafDark} strokeWidth=".6" /> : null}
            </g>
          ) : null}
          {Array.from({ length: layers }, (_, i) => {
            const rx = 24 - i * 4.4
            const y = 64 - i * 6
            return (
              <g key={i}>
                <path d={`M${36 - rx} ${y}a${rx} ${rx * 0.3} 0 0 0 ${rx * 2} 0v-4a${rx} ${rx * 0.3} 0 0 1 ${-rx * 2} 0z`} fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".4" />
                {Array.from({ length: 5 - Math.min(3, i) }, (_, k) => (
                  <path key={k} d={`M${36 - rx + 3 + k * ((rx * 2 - 6) / Math.max(1, 4 - Math.min(3, i)))} ${y + 0.6}v-3`} stroke={P.stone} strokeWidth=".4" />
                ))}
                {[-1, 1].map((d) => (
                  <g key={d}>
                    <ellipse cx={36 + d * (rx - 2.6)} cy={y - 5.4} rx="2.6" ry="2" fill={herb} stroke={P.leafDark} strokeWidth=".2" />
                    <ellipse cx={36 + d * (rx - 2.6) - 0.8} cy={y - 6.2} rx="1.2" ry=".8" fill={winter ? P.white : P.leafPale} opacity=".7" />
                    {(summer || spring) && (i + d) % 2 === 0 ? <circle cx={36 + d * (rx - 2.6)} cy={y - 7.4} r=".7" fill={i % 2 ? P.white : P.lilac} /> : null}
                  </g>
                ))}
                {winter ? <path d={`M${36 - rx + 1} ${y - 4.2}q${rx - 1} -2 ${rx * 2 - 2} 0`} stroke={P.white} strokeWidth=".9" fill="none" /> : null}
              </g>
            )
          })}
          {tier >= 5 ? <Kid x={70} y={72} c={P.blue} s={1.1} /> : null}
        </Svg>
      )
    }
    case 'schulkueche': {
      const seats = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <rect x="8" y="30" width="34" height="28" fill={P.cream} stroke={P.outlineWood} strokeWidth=".5" />
          <path d="M5 31l20 -9l20 9z" fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".4" />
          {winter ? <path d="M6 30.6l19 -8.4l19 8.4" stroke={P.white} strokeWidth="1.2" fill="none" /> : null}
          <rect x="12" y="36" width="16" height="10" fill={winter ? P.lamp : P.window} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M20 36v10M12 41h16" stroke={P.outlineWood} strokeWidth=".3" />
          <rect x="31" y="44" width="7" height="14" fill={P.woodDark} />
          {tier >= 2 ? <rect x="32" y="19" width="4" height="8" fill={P.stone} stroke={P.outlineStone} strokeWidth=".3" /> : null}
          {tier >= 2 ? <path className="smoke" d="M34 17c-1 -2 1 -3 0 -5c-1 -2 1 -3 0 -5" stroke={P.white} strokeWidth=".8" fill="none" /> : null}
          <rect x="44" y="56" width="30" height="2" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
          <path d="M46 58v6M72 58v6" stroke={P.woodDark} strokeWidth=".8" />
          {Array.from({ length: seats }, (_, i) => (
            <g key={i}>
              <ellipse cx={49 + i * 7} cy="55.6" rx="2.4" ry=".8" fill={P.white} stroke={P.stone} strokeWidth=".2" />
              <rect x={47.6 + i * 7} y="54.2" width="2.8" height="1" fill={P.woodLight} />
              <circle cx={49 + i * 7} cy="54.4" r=".5" fill={P.red} />
            </g>
          ))}
          {tier >= 3 ? <Kid x={52} y={68} c={SHIRT[0]!} s={1.1} /> : null}
          {tier >= 4 ? <Kid x={62} y={68} c={SHIRT[1]!} s={1.1} hair={P.woodLight} /> : null}
          {tier >= 5 ? <Farmer x={70} y={70} c={P.white} s={0.75} hat={P.white} /> : null}
          {autumn ? <LeafLitter cx={58} cy={62} w={30} n={5} /> : null}
        </Svg>
      )
    }
    case 'gartenhuette': {
      const cans = Math.min(6, tier + 1)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <rect x="10" y="32" width="30" height="30" fill={P.wood} stroke={P.outlineWood} strokeWidth=".5" />
          {[16, 22, 28, 34].map((x) => (
            <path key={x} d={`M${x} 32v30`} stroke={P.woodDark} strokeWidth=".3" />
          ))}
          <path d="M7 33l18 -9l18 9z" fill={P.leafDark} stroke={P.outline} strokeWidth=".4" />
          {winter ? <path d="M8 32.6l17 -8.4l17 8.4" stroke={P.white} strokeWidth="1.3" fill="none" /> : null}
          <rect x="18" y="42" width="14" height="20" fill={P.soilDark} />
          {tier >= 2 ? <path d="M19 45v14M23 44v16" stroke={P.metal} strokeWidth=".8" /> : null}
          {tier >= 3 ? <path d="M28 44v14" stroke={P.woodLight} strokeWidth=".8" /> : null}
          <path d="M44 56h28M44 50h28" stroke={P.woodMid} strokeWidth="1" />
          <path d="M45 62V48M71 62V48" stroke={P.woodDark} strokeWidth="1" />
          {Array.from({ length: cans }, (_, i) => (
            <Can key={i} x={46 + (i % 3) * 8.4} y={i < 3 ? 56 : 50} c={CLASS[i % 5]!} s={1.6} />
          ))}
          {tier >= 4 ? [54, 60, 66].map((x) => <path key={x} d={`M${x} 64l-1 -6M${x - 2} 64h2.6l-.4 2.6h-1.8z`} stroke={P.woodDark} strokeWidth=".6" fill={P.metal} />) : null}
          {tier >= 5 ? <Kid x={44} y={70} c={P.orange} s={1.1} /> : null}
          {autumn ? <LeafLitter cx={40} cy={66} w={50} n={6} /> : null}
        </Svg>
      )
    }
    case 'pausenbeet': {
      const berries = 3 + tier * 2
      return (
        <Svg tier={tier}>
          <Patch fill={winter ? P.cream : P.stoneLight} cy={61} rx={36} ry={9} edge={P.stone} />
          {tier >= 2 ? (
            <g>
              {[0, 1, 2].map((k) => (
                <rect key={k} x={52 + k * 6} y={62 - k * 1.2} width="5" height="3.4" fill="none" stroke={winter ? P.frost : P.white} strokeWidth=".6" />
              ))}
              <rect x="58" y="57.6" width="5" height="3.4" fill="none" stroke={winter ? P.frost : P.yellow} strokeWidth=".6" />
            </g>
          ) : null}
          <WoodBox x={16} y={60} w={30} h={8} snow={winter} />
          {Array.from({ length: Math.min(7, berries) }, (_, i) => {
            const x = 19.4 + i * 4
            return (
              <g key={i}>
                {[-1.4, 0, 1.4].map((d) => (
                  <ellipse key={d} cx={x + d} cy={51 - (d === 0 ? 1.2 : 0)} rx="1.6" ry="1.2" fill={winter ? P.white : autumn ? (i % 2 ? P.autumn : P.autumnDark) : P.leaf} stroke={winter ? P.frost : P.leafDark} strokeWidth=".2" />
                ))}
                {summer && i < tier + 2 ? <path d={`M${x + 0.6} 52.4q.6 2 .2 2.6`} stroke={P.leafDark} strokeWidth=".4" fill="none" /> : null}
                {summer && i < tier + 2 ? <path d={`M${x - 0.6} 54.8q1.2 -1 2.4 0l-1.2 3z`} fill={P.red} stroke={P.berry} strokeWidth=".2" /> : null}
                {spring && i % 2 === 0 ? <circle cx={x} cy={49} r=".8" fill={P.white} stroke={P.yellow} strokeWidth=".3" /> : null}
              </g>
            )
          })}
          {tier >= 3 ? <WoodBox x={4} y={70} w={14} h={5} snow={winter} fill={P.woodLight} /> : null}
          {tier >= 4 ? (
            <g>
              <circle cx="68" cy="68" r="2" fill={P.white} stroke={P.charcoal} strokeWidth=".4" />
              <path d="M67 67l1 .6l1 -.6M68 67.6v1.4" stroke={P.charcoal} strokeWidth=".4" fill="none" />
            </g>
          ) : null}
          {tier >= 5 ? <Kid x={62} y={70} c={SHIRT[2]!} s={1.1} /> : null}
          {tier >= 5 ? <Kid x={52} y={72} c={SHIRT[3]!} s={1.1} hair={P.charcoal} /> : null}
          {winter ? <Snowfall n={6} y1={40} /> : null}
        </Svg>
      )
    }
    case 'schulfest': {
      const kids = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {tier >= 2 ? <Bunting y={20} n={4 + tier} /> : null}
          <rect x="22" y="44" width="36" height="12" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".5" />
          <path d="M20 44h40l-3 -8h-34z" fill={P.red} stroke={P.berry} strokeWidth=".4" />
          <path d="M26 36v-4M54 36v-4" stroke={P.woodDark} strokeWidth=".6" />
          {Array.from({ length: 2 + tier }, (_, i) => (
            <g key={i}>
              {[0, 1, 2].map((k) => (
                <circle key={k} cx={25.6 + i * 4.6 + k * 1.1} cy={43} r=".9" fill={P.red} />
              ))}
              <path d={`M${26.6 + i * 4.6} 42.2l-.4 -2.8M${27.2 + i * 4.6} 42.2l.6 -2.6`} stroke={P.leaf} strokeWidth=".7" />
            </g>
          ))}
          {Array.from({ length: kids }, (_, i) => (
            <Kid key={i} x={14 + i * 18} y={68 + (i % 2) * 2} c={SHIRT[i]!} s={1.1} hair={[P.bark, P.woodLight, P.charcoal, P.autumnDark][i]!} />
          ))}
          {tier >= 3 ? [12, 68].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 60v-18`} stroke={P.charcoal} strokeWidth=".3" />
              <ellipse cx={x} cy={40} rx="2.4" ry="3" fill={[P.red, P.blue][i]} />
            </g>
          )) : null}
          {winter ? <Snowfall n={6} y1={34} /> : null}
          {autumn ? <path d="M64 14q2 -3 4 0q-2 3 -4 0z" fill={P.autumn} /> : null}
        </Svg>
      )
    }
  }
  return null
}
