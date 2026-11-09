/** Kapitel-Grafik Kapitel 23: Beerenwald in Schweden (Dalarna). */
import type { ReactNode } from 'react'
import { Smoke, Svg } from '../../HandParts'
import { Conifer, Snowcap } from './partsA'
import { Jar, Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Person } from './partsB'
import { Birch } from './partsC'
import { BerryShrub, Fire, WaterBand } from './partsD'

/** Waldboden mit Moos. */
function Forest({ winter, cy = 60, rx = 36, ry = 10 }: { winter?: boolean; cy?: number; rx?: number; ry?: number }) {
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={winter ? P.frost : P.leafMoss} />
      <ellipse cx="32" cy={cy - 2} rx={rx * 0.5} ry={ry * 0.3} fill={winter ? P.white : P.leaf} opacity=".6" />
    </g>
  )
}

/** Pfifferling. */
function Chanterelle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path d={`M${x - 0.6 * s} ${y}l-.4 -${2 * s}q-1.4 -1.6 -.4 -${2 * s}h${3.6 * s}q1 .4 -.4 ${2 * s}l-.4 ${2 * s}z`} fill={P.amber} stroke={P.autumnDark} strokeWidth=".2" />
}

/** Falunrote Hütte mit weißen Ecken (Fußpunkt unten links). */
function RedCabin({ x, y, w, h, winter, lit }: { x: number; y: number; w: number; h: number; winter?: boolean; lit?: boolean }) {
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={P.barn} stroke={P.outline} strokeWidth=".5" />
      {Array.from({ length: Math.round(h / 2.6) }, (_, i) => (
        <path key={i} d={`M${x} ${y - h + 1.4 + i * 2.6}h${w}`} stroke={P.roof} strokeWidth=".4" />
      ))}
      <path d={`M${x} ${y}V${y - h}M${x + w} ${y}V${y - h}`} stroke={P.white} strokeWidth="1.4" />
      <path d={`M${x - 3} ${y - h}L${x + w / 2} ${y - h - w * 0.4}L${x + w + 3} ${y - h}z`} fill={P.charcoal} stroke={P.outline} strokeWidth=".4" />
      <path d={`M${x - 3} ${y - h}L${x + w / 2} ${y - h - w * 0.4}L${x + w + 3} ${y - h}`} stroke={P.white} strokeWidth=".8" fill="none" />
      <rect x={x + w * 0.15} y={y - h * 0.7} width={w * 0.22} height={h * 0.35} fill={lit ? P.lamp : P.waterLight} stroke={P.white} strokeWidth=".8" />
      <rect x={x + w * 0.6} y={y - h * 0.68} width={w * 0.2} height={h * 0.68} fill={P.leafDark} stroke={P.white} strokeWidth=".6" />
      {winter ? <Snowcap d={`M${x - 2} ${y - h}L${x + w / 2} ${y - h - w * 0.38}L${x + w + 2} ${y - h}`} /> : null}
    </g>
  )
}

/** Holzscheit-Stirnseite. */
function Log({ x, y, birch }: { x: number; y: number; birch?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="2.4" fill={birch ? P.cream : P.woodLight} stroke={birch ? P.charcoal : P.outlineWood} strokeWidth=".4" />
      <circle cx={x} cy={y} r=".9" fill="none" stroke={P.woodMid} strokeWidth=".3" />
    </g>
  )
}

export function Beerenwald({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  switch (id) {
    case 'heidelbeerhang': {
      const bushes = Math.min(9, 2 + tier + Math.floor(tier / 2))
      const pines = Math.min(3, Math.ceil(tier / 2))
      return (
        <Svg tier={tier}>
          <path d="M4 66Q12 50 40 44Q66 38 76 50Q79 60 76 66z" fill={winter ? P.frost : P.leafMoss} />
          {Array.from({ length: pines }, (_, i) => (
            <Conifer key={i} x={[62, 46, 72][i]!} y={[44, 48, 46][i]!} s={0.7} snow={winter} />
          ))}
          {Array.from({ length: bushes }, (_, i) => {
            const x = 10 + ((i * 17) % 62)
            const y = 64 - ((i * 7) % 12) - (x / 80) * 8
            return <BerryShrub key={i} x={x} y={y} r={4.6} leaf={autumn ? P.autumn : spring ? P.leafPale : P.leaf} berry={summer ? P.blue : undefined} n={7} bare={winter} />
          })}
          {winter ? Array.from({ length: bushes }, (_, i) => <ellipse key={`s${i}`} cx={10 + ((i * 17) % 62)} cy={64 - ((i * 7) % 12) - (((i * 17) % 62) / 80) * 8 - 1.4} rx="3" ry="1" fill={P.white} />) : null}
          {spring ? [14, 30, 44].map((x) => <circle key={x} cx={x} cy={58} r=".6" fill={P.pink} />) : null}
          {tier >= 3 ? <path d="M18 66h8l-1 -4h-6z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 3 && summer ? [20, 22.4, 24].map((x) => <circle key={x} cx={x} cy={61.6} r=".9" fill={P.plum} />) : null}
          {tier >= 4 ? <path d="M28 64l3 -2h3l-1 3h-4z" fill={P.metal} /> : null}
          {tier >= 5 ? <Person x={36} y={66} c={P.yellow} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'preiselbeeren': {
      const n = Math.min(14, 2 + tier * 3)
      return (
        <Svg tier={tier}>
          <Forest winter={winter} />
          {Array.from({ length: n }, (_, i) => {
            const x = 10 + ((i * 19) % 60)
            const y = 54 + ((i * 7) % 12)
            if (winter) return <ellipse key={i} cx={x} cy={y} rx="2.6" ry="1.2" fill={P.white} stroke={P.winterLeafDark} strokeWidth=".2" />
            return (
              <g key={i}>
                {[-1.4, 0, 1.4].map((d) => (
                  <ellipse key={d} cx={x + d} cy={y - 1 - Math.abs(d) * 0.3} rx=".9" ry=".6" fill={P.leafDark} />
                ))}
                {autumn || summer ? [-1, 1].map((d) => <circle key={d} cx={x + d} cy={y + 0.4} r=".8" fill={autumn ? P.berry : P.blossom} />) : null}
                {spring ? <circle cx={x} cy={y + 0.4} r=".6" fill={P.pink} /> : null}
              </g>
            )
          })}
          {tier >= 2 ? <Birch x={66} y={54} s={0.8} season={season} /> : null}
          {tier >= 3 ? <path d="M14 66h8l-1 -4h-6z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 4 ? <Conifer x={16} y={50} s={0.6} snow={winter} /> : null}
          {tier >= 5 ? <Person x={52} y={68} c={P.denim} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'moltebeeren': {
      const n = Math.min(12, 2 + tier * 2)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="36" ry="10" fill={winter ? P.frost : P.winterLeafLight} />
          {[
            [26, 58, 6],
            [56, 62, 5],
          ].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx={r} ry={r! * 0.35} fill={winter ? P.glass : P.waterDeep} />
          ))}
          {Array.from({ length: n }, (_, i) => {
            const x = 12 + ((i * 23) % 58)
            const y = 54 + ((i * 11) % 12)
            if (winter) return <path key={i} d={`M${x} ${y}v-2`} stroke={P.woodMid} strokeWidth=".5" />
            return (
              <g key={i}>
                <path d={`M${x} ${y}v-4`} stroke={P.leafDark} strokeWidth=".5" />
                <path d={`M${x} ${y - 1}l-2.4 -.8l.6 -1.4l1.8 1.2zM${x} ${y - 1}l2.4 -.8l-.6 -1.4l-1.8 1.2z`} fill={autumn ? P.autumn : P.leaf} />
                {spring ? <circle cx={x} cy={y - 4.6} r="1.2" fill={P.white} stroke={P.stoneLight} strokeWidth=".2" /> : null}
                {summer || autumn ? <circle cx={x} cy={y - 4.6} r="1.2" fill={summer ? P.amber : P.honey} stroke={P.autumnDark} strokeWidth=".2" /> : null}
              </g>
            )
          })}
          {tier >= 2 ? <path d="M4 64h20M8 64v2M16 64v2" stroke={P.woodMid} strokeWidth="1.2" /> : null}
          {tier >= 3 ? <Birch x={70} y={52} s={0.6} season={season} /> : null}
          {tier >= 4 ? <path d="M60 68h8l-1 -3h-6z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 5 ? <Person x={40} y={68} c={P.orange} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'rotehuette':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          <RedCabin x={20} y={64} w={34} h={18} winter={winter} lit={winter || tier >= 4} />
          {tier >= 2 ? <rect x="44" y="32" width="3" height="8" fill={P.stoneDark} /> : null}
          {tier >= 2 ? <Smoke x={45.4} y={30} /> : null}
          {tier >= 3 ? <path d="M8 64V36" stroke={P.white} strokeWidth=".7" /> : null}
          {tier >= 3 ? <path d="M8 36h7v4.6H8z" fill={P.blue} /> : null}
          {tier >= 3 ? <path d="M10.4 36v4.6M8 38.3h7" stroke={P.yellow} strokeWidth="1" /> : null}
          {tier >= 4 ? <Birch x={66} y={62} s={0.9} season={season} /> : null}
          {tier >= 5 ? <path d="M56 64h10M58 64v-3h6v3" stroke={P.white} strokeWidth=".8" fill="none" /> : null}
          {!winter ? [24, 28, 50].map((x) => <circle key={x} cx={x} cy={64} r="1.2" fill={autumn ? P.autumn : spring ? P.white : P.lilac} />) : null}
        </Svg>
      )
    case 'saftkueche': {
      const jars = Math.min(6, 1 + tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <path d="M10 64V40L30 30L50 40V64" fill={P.woodMid} stroke={P.outline} strokeWidth=".5" />
          <path d="M6 41L30 28L54 41" stroke={P.charcoal} strokeWidth="2" fill="none" />
          <rect x="16" y="44" width="28" height="20" fill={P.soilDark} />
          <path d="M20 64v-6h20v6" fill={P.stone} stroke={P.outlineStone} strokeWidth=".4" />
          <Fire x={30} y={60} s={0.4} />
          <path d="M23 56h14l-1.6 -7h-10.8z" fill={P.metal} stroke={P.outline} strokeWidth=".4" />
          <ellipse cx="30" cy="49" rx="5.4" ry="1.2" fill={P.plum} />
          {tier >= 2 ? <path className="smoke" d="M30 47c-2 -3 2 -5 0 -8" stroke={P.white} strokeWidth="1.2" fill="none" opacity=".7" /> : null}
          <rect x="54" y="52" width="22" height="2" fill={P.woodDark} />
          <path d="M56 54v10M74 54v10" stroke={P.woodDark} strokeWidth=".8" />
          {Array.from({ length: jars }, (_, i) => (
            <Jar key={i} x={57 + i * 3.4} y={52} c={i % 3 === 1 ? P.berry : i % 3 === 2 ? P.amber : P.plum} s={0.4} />
          ))}
          {tier >= 3 ? [58, 63, 68].map((x) => <rect key={x} x={x} y="58" width="2.4" height="6" rx=".6" fill={P.berry} stroke={P.outline} strokeWidth=".2" />) : null}
          {tier >= 5 ? <Person x={8} y={68} c={P.cream} s={0.7} /> : null}
          {winter ? <Snowcap d="M7 41L30 29L53 41" /> : null}
        </Svg>
      )
    }
    case 'pilzlichtung': {
      const n = Math.min(14, 2 + tier * 3)
      return (
        <Svg tier={tier}>
          <Forest winter={winter} />
          {[12, 68].map((x, i) => (
            <Conifer key={x} x={x} y={56 - i * 2} s={0.75} snow={winter} />
          ))}
          {!winter
            ? Array.from({ length: n }, (_, i) => <Chanterelle key={i} x={20 + ((i * 13) % 42)} y={56 + ((i * 7) % 10)} s={autumn || summer ? 1.2 : 0.7} />)
            : Array.from({ length: n }, (_, i) => <ellipse key={i} cx={20 + ((i * 13) % 42)} cy={56 + ((i * 7) % 10)} rx="2" ry=".8" fill={P.white} />)}
          {tier >= 2 ? <path d="M48 66h10l-1 -4h-8z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 3 ? <path d="M49 62q4 -6 8 0" stroke={P.woodDark} strokeWidth=".6" fill="none" /> : null}
          {tier >= 4 ? <Birch x={40} y={52} s={0.6} season={season} /> : null}
          {tier >= 5 ? <Person x={30} y={68} c={P.leafDark} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'holzstapel': {
      const rows = Math.min(5, tier + 1)
      return (
        <Svg tier={tier}>
          <Forest winter={winter} cy={62} ry={7} />
          <path d="M14 64h44" stroke={P.woodDark} strokeWidth="1.4" />
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: 9 - (r > 3 ? 1 : 0) }, (_, k) => <Log key={`${r}-${k}`} x={17 + k * 4.8 + (r % 2) * 2.4} y={61 - r * 4.2} birch={(k + r) % 4 === 0} />),
          )}
          {winter ? <Snowcap d={`M16 ${58 - (rows - 1) * 4.2}h40`} /> : null}
          {tier >= 2 ? <rect x="62" y="60" width="8" height="4" fill={P.bark} stroke={P.outline} strokeWidth=".3" /> : null}
          {tier >= 3 ? <path d="M66 60l3 -6M68.6 54.6l2.4 -1l.4 1.6z" stroke={P.woodDark} strokeWidth=".6" fill={P.metal} /> : null}
          {tier >= 4 ? <Birch x={72} y={58} s={0.7} season={season} /> : null}
          {tier >= 5 ? <Person x={64} y={70} c={P.red} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'seesauna':
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="44" rx="38" ry="8" fill={winter ? P.frost : P.leafMoss} />
          <WaterBand y={60} h={18} frozen={winter} />
          {winter ? <ellipse cx="56" cy="62" rx="4" ry="1.6" fill={P.waterDeep} /> : null}
          <rect x="12" y="34" width="22" height="14" fill={P.bark} stroke={P.outline} strokeWidth=".5" />
          <path d="M9 35L23 26L37 35z" fill={P.charcoal} stroke={P.outline} strokeWidth=".4" />
          <rect x="26" y="38" width="5" height="10" fill={P.woodDark} />
          <rect x="15" y="38" width="5" height="4" fill={P.lamp} stroke={P.woodLight} strokeWidth=".4" />
          <rect x="16" y="26" width="2.6" height="5" fill={P.metal} />
          <Smoke x={17.4} y={24} />
          <path d="M34 48h24v2H34z" fill={P.wood} stroke={P.outlineWood} strokeWidth=".3" />
          {[38, 46, 54].map((x) => (
            <path key={x} d={`M${x} 50v8`} stroke={P.woodDark} strokeWidth=".9" />
          ))}
          {tier >= 3 ? <path d="M56 48v-6M58 48v-6M56 44h2" stroke={P.metal} strokeWidth=".5" /> : null}
          {tier >= 3 ? <Birch x={66} y={44} s={0.7} season={season} /> : null}
          {tier >= 4 ? <Conifer x={6} y={46} s={0.7} snow={winter} /> : null}
          {tier >= 5 ? <Person x={48} y={48} c={P.white} s={0.7} /> : null}
          {tier >= 2 ? <path d="M12 48h22" stroke={P.woodLight} strokeWidth="1" /> : null}
          {winter ? <Snowcap d="M10 35L23 27L36 35" /> : null}
        </Svg>
      )
    case 'mittsommer': {
      const dancers = Math.min(6, tier + 1)
      const wreath = winter ? P.winterLeafDark : P.leaf
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="36" ry="10" fill={winter ? P.frost : P.leafLight} />
          <path d="M40 64V14" stroke={P.woodMid} strokeWidth="1.8" />
          <path d="M28 26H52" stroke={P.woodMid} strokeWidth="1.4" />
          {!winter ? <path d="M40 60V14M28 26H52" stroke={wreath} strokeWidth="3" strokeDasharray="1.6 .8" opacity=".9" /> : null}
          {[30, 50].map((x) => (
            <g key={x}>
              <circle cx={x} cy={32} r="4" fill="none" stroke={wreath} strokeWidth={winter ? 1 : 2} />
              {summer || spring ? [0, 1, 2, 3].map((k) => <circle key={k} cx={x + Math.cos(k * 1.6) * 4} cy={32 + Math.sin(k * 1.6) * 4} r=".9" fill={[P.yellow, P.white, P.pink, P.blue][k]} />) : null}
            </g>
          ))}
          {tier >= 2 ? <path d="M40 14l-1 -2h2z" fill={P.yellow} /> : null}
          {Array.from({ length: dancers }, (_, i) => {
            const a = (i / dancers) * Math.PI * 2
            return <Person key={i} x={40 + Math.cos(a) * 16} y={63 + Math.sin(a) * 4} c={[P.blue, P.yellow, P.white, P.berry, P.leafDark, P.lilac][i]!} s={0.7} />
          })}
          {tier >= 3 && !winter ? Array.from({ length: dancers }, (_, i) => <circle key={`k${i}`} cx={40 + Math.cos((i / dancers) * Math.PI * 2) * 16} cy={63 + Math.sin((i / dancers) * Math.PI * 2) * 4 - 9.4} r="1.2" fill="none" stroke={P.leafPale} strokeWidth=".6" />) : null}
          {tier >= 4 ? <path d="M60 58h14v2H60zM62 60v4M72 60v4" fill={P.white} stroke={P.woodDark} strokeWidth=".4" /> : null}
          {tier >= 5 ? <Birch x={10} y={54} s={0.7} season={season} /> : null}
          {winter ? <Snowcap d="M28 25.6H52" /> : null}
        </Svg>
      )
    }
    case 'jedermannspfad': {
      const trees = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <Forest winter={winter} />
          <path d="M10 68Q30 58 40 60T72 50" stroke={winter ? P.white : P.woodLight} strokeWidth="3.4" fill="none" strokeLinecap="round" />
          {Array.from({ length: trees }, (_, i) => {
            const x = [22, 54, 12, 66, 36][i]!
            const y = [56, 48, 60, 58, 50][i]!
            return (
              <g key={i}>
                {i % 2 ? <Conifer x={x} y={y} s={0.75} snow={winter} /> : <Birch x={x} y={y} s={0.8} season={season} />}
                <rect x={x - 0.8} y={y - 7} width="1.6" height="1.6" fill={P.orange} />
              </g>
            )
          })}
          {tier >= 3 ? <WaterBand y={63} h={4} x0={44} x1={66} frozen={winter} /> : null}
          {tier >= 3 ? <path d="M50 60h10v2H50z" fill={P.wood} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 4 ? <Person x={44} y={62} c={P.red} s={0.7} /> : null}
          {tier >= 5 ? <Person x={30} y={66} c={P.blue} s={0.7} /> : null}
        </Svg>
      )
    }
  }
  return null
}
