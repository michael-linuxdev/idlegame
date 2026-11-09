/**
 * Kapitel-Grafik Kapitel 48: Großer Saatguttausch auf der Wiese, auf der einmal
 * die Gartenschau stand. Briefpartner aus aller Welt kommen mit Tütchen.
 * Jahreszeiten: Frühling = Tauschtag, Obstblüte; Sommer = Sonne, Schirme;
 * Herbst = Laub, Laternen früh an; Winter = Schnee, Winterzelt, heiße Töpfe.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Bunting } from './partsA'
import type { AreaProps } from './partsB'
import { Fire } from './partsD'
import { LeafTree, Packet, SeedJar, Snowfall, Sun, Cloud } from './partsH'
import { Floor, Lantern, Letter, Table, Tent } from './partsI'
import { P } from '../palette'
import { Farmer, Kid } from './figures'
import { ssn } from './season'

function Sky({ season }: { season?: string }) {
  const z = ssn(season)
  if (z === 'summer') return <g className="art-sky"><Sun x={71} y={9} r={3} /></g>
  if (z === 'spring') return <g className="art-sky"><Cloud x={14} y={9} s={1.1} /></g>
  if (z === 'autumn') return <g className="art-sky"><Cloud x={64} y={9} s={1.2} c={P.stoneLight} /></g>
  return <g className="art-sky"><Snowfall n={7} y1={30} /></g>
}

const COATS = [P.berry, P.blue, P.yellow, P.leaf, P.orange, P.plum, P.denim, P.tomato]
const HATS = [P.woodLight, P.charcoal, P.woodDark, P.plum, P.cream]

/** Gast: Sommer ohne Mütze-Farbe, Winter dicke Mütze (weiß). */
function Guest({ x, y, i, season, s = 1.15 }: { x: number; y: number; i: number; season?: string; s?: number }) {
  const z = ssn(season)
  return <Farmer x={x} y={y} c={COATS[i % COATS.length]!} s={s} hat={z === 'winter' ? P.white : HATS[i % HATS.length]!} />
}

/** Bohne (liegend). */
function Bean({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx="1.6" ry="1" fill={c} stroke={P.outlineWood} strokeWidth=".2" />
      <circle cx={x - 0.4} cy={y - 0.3} r=".3" fill={P.white} opacity=".5" />
    </g>
  )
}

/** Topf auf dem Feuer. */
function Pot({ x, y, c = P.metal, steam = true }: { x: number; y: number; c?: string; steam?: boolean }) {
  return (
    <g>
      <path d={`M${x - 3} ${y - 4}h6v3a3 1.4 0 0 1 -6 0z`} fill={c} stroke={P.charcoal} strokeWidth=".3" />
      <rect x={x - 3.4} y={y - 4.6} width="6.8" height=".8" fill={P.charcoal} />
      {steam ? <path className="smoke" d={`M${x} ${y - 5.4}c-1 -2 1 -3 0 -5`} stroke={P.white} strokeWidth=".7" fill="none" opacity=".85" /> : null}
    </g>
  )
}

export function Saatguttausch({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  const spring = z === 'spring'
  const autumn = z === 'autumn'
  switch (id) {
    case 'tauschtische': {
      const packets = 3 + tier * 2
      const guests = Math.min(3, Math.max(0, tier - 1))
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <Table x={8} y={62} w={30} c={P.paper} h={7} />
          <Table x={42} y={62} w={30} c={P.blossom} h={7} />
          {Array.from({ length: packets }, (_, i) => (
            <Packet key={i} x={i < 7 ? 11.6 + i * 4 : 45.6 + (i - 7) * 4} y={54.2} c={[P.paper, P.yellow, P.glass, P.cream][i % 4]} s={1.25} />
          ))}
          {Array.from({ length: guests }, (_, i) => (
            <Guest key={i} x={20 + i * 20} y={70} i={i} season={season} />
          ))}
          {tier >= 4 ? <Bunting y={24} n={tier + 2} /> : null}
          {tier >= 5 ? <Kid x={70} y={70} c={P.orange} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'sortenschau': {
      const jars = 2 + tier
      const beanColors = [P.berry, P.white, P.ink, P.woodMid, P.plum, P.cream, P.tomato]
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <path d="M14 60V30M66 60V30" stroke={P.woodDark} strokeWidth=".8" />
          <rect x="14" y="30" width="52" height="10" fill={P.cream} stroke={P.outlineSoft} strokeWidth=".3" />
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => <g key={i}><Bean x={20 + i * 8} y={34} c={beanColors[i % beanColors.length]!} /><path d={`M${18 + i * 8} 37.4h4`} stroke={P.stone} strokeWidth=".4" /></g>)}
          <Table x={12} y={62} w={56} c={P.paper} />
          {Array.from({ length: jars }, (_, i) => (
            <SeedJar key={i} x={17 + i * (46 / Math.max(1, jars - 1))} y={57} s={1.4} seed={beanColors[i % beanColors.length]!} />
          ))}
          {tier >= 3 ? Array.from({ length: 8 }, (_, i) => <Bean key={i} x={18 + i * 2.4} y={57.6 + (i % 2) * 0.4} c={beanColors[i % beanColors.length]!} />) : null}
          {tier >= 4 ? <Guest x={70} y={70} i={2} season={season} /> : null}
          {tier >= 5 ? <Kid x={8} y={70} c={P.leaf} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'erzaehlzelt': {
      const listeners = Math.min(5, tier + 1)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <Tent x={40} y={60} w={50} h={40} c={winter ? P.paper : P.cream} stripe={P.terracotta} inside={P.woodDark} />
          <ellipse cx="40" cy="60" rx="12" ry="1.6" fill={P.woodLight} />
          <Guest x={40} y={58} i={5} season={season} s={1.1} />
          {Array.from({ length: listeners }, (_, i) => {
            const x = 14 + i * (52 / Math.max(1, listeners - 1))
            return i === Math.floor(listeners / 2) && listeners % 2 === 1 ? <Kid key={i} x={x} y={70} c={COATS[i]!} s={1.5} /> : <Kid key={i} x={x} y={70} c={COATS[(i + 3) % COATS.length]!} s={1.5} hair={i % 2 ? P.woodDark : P.ink} />
          })}
          {tier >= 3 ? [24, 56].map((x) => <Lantern key={x} x={x} y={28} c={autumn || winter ? P.orange : P.yellow} />) : null}
          {tier >= 4 ? <Lantern x={40} y={24} c={P.red} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'briefstation': {
      const letters = 2 + tier * 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <path d="M10 62V28M70 62V28" stroke={P.woodDark} strokeWidth="1" />
          <path d="M10 30Q40 38 70 30" stroke={P.charcoal} strokeWidth=".4" fill="none" />
          {tier >= 3 ? <path d="M10 42Q40 50 70 42" stroke={P.charcoal} strokeWidth=".4" fill="none" /> : null}
          {Array.from({ length: letters }, (_, i) => {
            const row = i < 7 ? 0 : 1
            const k = row ? i - 7 : i
            const t = (k + 0.5) / 7
            const x = 10 + 60 * t
            const y = (row ? 42 : 30) + 8 * 2 * t * (1 - t) + 3
            return <Letter key={i} x={x} y={y} s={1.3} c={[P.paper, P.cream, P.blossom, P.glass][i % 4]} />
          })}
          <rect x="62" y="52" width="7" height="10" rx="1.4" fill={P.yellow} stroke={P.outlineWood} strokeWidth=".3" />
          <rect x="63.4" y="54" width="4.2" height=".8" fill={P.charcoal} />
          {tier >= 2 ? <Guest x={30} y={70} i={1} season={season} /> : null}
          {tier >= 4 ? <Guest x={44} y={70} i={4} season={season} /> : null}
          {tier >= 5 ? <Kid x={54} y={70} c={P.berry} s={1.5} hair={P.woodDark} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'samenwerkstatt': {
      const kids = Math.min(4, tier + 1)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <Table x={14} y={62} w={52} c={P.woodLight} h={3} />
          {Array.from({ length: 2 + tier * 2 }, (_, i) => (
            <Packet key={i} x={17 + ((i * 4.7) % 46)} y={58.8} c={i % 3 === 0 ? P.paper : i % 3 === 1 ? P.canvas : P.label} s={0.8} />
          ))}
          {tier >= 2 ? (
            <g>
              <rect x="44" y="56" width="3" height="2.4" fill={P.woodDark} />
              <rect x="43.4" y="58.2" width="4.2" height=".7" fill={P.red} />
            </g>
          ) : null}
          {Array.from({ length: kids }, (_, i) => (
            <Kid key={i} x={18 + i * (44 / Math.max(1, kids - 1))} y={70} c={COATS[(i + 2) % COATS.length]!} s={1.5} hair={i % 2 ? P.woodDark : P.bark} />
          ))}
          {tier >= 5 ? <Farmer x={72} y={68} c={P.leaf} s={1.15} hat={P.charcoal} skirt={P.denim} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'pflanzenboerse': {
      const pots = 3 + tier * 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <path d="M12 62V40h56v22M12 51h56" stroke={P.woodMid} strokeWidth="1" fill="none" />
          {Array.from({ length: pots }, (_, i) => {
            const row = i < 7 ? 0 : 1
            const k = row ? i - 7 : i
            const x = 16 + k * 8
            const y = row ? 51 : 62
            const milk = i % 4 === 3
            return (
              <g key={i}>
                {milk ? <rect x={x - 1.4} y={y - 4} width="2.8" height="4" fill={P.white} stroke={P.blue} strokeWidth=".3" /> : <path d={`M${x - 1.4} ${y}l-.4 -3.2h3.6l-.4 3.2z`} fill={P.white} stroke={P.stone} strokeWidth=".2" />}
                {winter ? <path d={`M${x} ${y - 3.4}v-1.4`} stroke={P.leafDark} strokeWidth=".6" /> : <path d={`M${x} ${y - 3.4}v-3M${x} ${y - 5}l-1.6 -1M${x} ${y - 5.6}l1.6 -1`} stroke={autumn ? P.leafMoss : P.leaf} strokeWidth=".7" />}
                {summer && i % 3 === 0 ? <circle cx={x} cy={y - 6.8} r=".8" fill={P.tomato} /> : null}
              </g>
            )
          })}
          {tier >= 3 ? <Guest x={70} y={70} i={6} season={season} /> : null}
          {tier >= 5 ? <Kid x={8} y={70} c={P.yellow} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'weltkueche': {
      const pots = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <path d="M8 30h64l-4 -6h-56z" fill={P.leafDark} stroke={P.outline} strokeWidth=".4" />
          <Bunting y={30} n={4 + tier} x0={8} x1={72} />
          <path d="M12 30v32M68 30v32" stroke={P.woodDark} strokeWidth="1.1" />
          <rect x="14" y="52" width="52" height="10" fill={P.wood} stroke={P.outlineWood} strokeWidth=".3" />
          <rect x="14" y="50.6" width="52" height="1.6" fill={P.woodLight} />
          {Array.from({ length: pots }, (_, i) => (
            <Pot key={i} x={20 + i * 13} y={50.6} c={[P.metal, P.terracotta, P.charcoal, P.blue][i]!} steam={tier >= 2} />
          ))}
          {tier >= 3 ? <Fire x={62} y={62} s={0.8} /> : null}
          {tier >= 3 ? Array.from({ length: 4 }, (_, i) => <circle key={i} cx={22 + i * 4} cy={56} r="1" fill={[P.orange, P.leafLight, P.berry, P.yellow][i]} />) : null}
          {tier >= 4 ? <Guest x={28} y={70} i={2} season={season} /> : null}
          {tier >= 5 ? <Guest x={50} y={70} i={6} season={season} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'musikbuehne': {
      const band = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <rect x="10" y="50" width="60" height="8" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M10 50h60" stroke={P.woodLight} strokeWidth="1" />
          <path d="M12 50V26M68 50V26M10 26h60" stroke={P.woodDark} strokeWidth="1" />
          <Bunting y={26} n={4 + tier} x0={10} x1={70} />
          {Array.from({ length: band }, (_, i) => {
            const x = 20 + i * 13
            return (
              <g key={i}>
                <Guest x={x} y={48} i={i + 1} season={season} />
                {i === 0 ? <path d={`M${x + 1.4} 41l3 -2M${x + 0.6} 40.6l2.2 1.6`} stroke={P.woodDark} strokeWidth=".7" /> : null}
                {i === 1 ? <rect x={x - 2.4} y={40} width="4.8" height="3" fill={P.berry} stroke={P.charcoal} strokeWidth=".2" /> : null}
                {i === 2 ? <ellipse cx={x + 2.6} cy={46} rx="2" ry="1.4" fill={P.woodLight} stroke={P.woodDark} strokeWidth=".3" /> : null}
                {i === 3 ? <path d={`M${x + 1.4} 42l2.6 -3`} stroke={P.woodMid} strokeWidth="1" /> : null}
              </g>
            )
          })}
          {tier >= 2 ? <Kid x={16} y={70} c={P.yellow} s={1.5} /> : null}
          {tier >= 3 ? <Kid x={64} y={70} c={P.leaf} s={1.5} hair={P.woodDark} skirt={P.berry} /> : null}
          {tier >= 5 ? <Guest x={40} y={70} i={4} season={season} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'archivwagen': {
      const jars = 3 + tier * 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <rect x="12" y="28" width="48" height="26" rx="2" fill={P.leafDark} stroke={P.outline} strokeWidth=".4" />
          <path d="M10 28q26 -8 52 0z" fill={P.leafMoss} stroke={P.outline} strokeWidth=".3" />
          {winter ? <path d="M12 26.6q24 -6 48 0" stroke={P.white} strokeWidth="1.2" fill="none" /> : null}
          <rect x="16" y="32" width="40" height="18" fill={P.paper} />
          {[38, 44, 50].map((y) => <path key={y} d={`M16 ${y}h40`} stroke={P.woodMid} strokeWidth=".6" />)}
          {Array.from({ length: jars }, (_, i) => {
            const row = Math.floor(i / 7)
            return <SeedJar key={i} x={19 + (i % 7) * 5.6} y={38 + row * 6} s={1} seed={[P.seed, P.berry, P.yellow, P.leafMoss, P.cream][i % 5]} />
          })}
          <circle cx="20" cy="56" r="3" fill={P.charcoal} stroke={P.metal} strokeWidth=".6" />
          <circle cx="52" cy="56" r="3" fill={P.charcoal} stroke={P.metal} strokeWidth=".6" />
          <path d="M60 50l8 4" stroke={P.woodDark} strokeWidth="1" />
          {tier >= 4 ? <Farmer x={68} y={70} c={P.white} s={1.15} hat={P.ink} /> : null}
          {tier >= 5 ? <Kid x={10} y={70} c={P.blue} s={1.5} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'abschlussrunde': {
      const n = 3 + tier * 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {spring || summer ? <LeafTree x={40} y={40} s={1} season={season} blossom={P.blossom} n={4} /> : null}
          {autumn || winter ? <LeafTree x={40} y={40} s={1} season={season} n={4} /> : null}
          <ellipse cx="40" cy="60" rx="24" ry="6" fill="none" stroke={P.woodLight} strokeWidth=".6" strokeDasharray="1.4 1" />
          {Array.from({ length: n }, (_, i) => {
            const a = (i / n) * Math.PI * 2 + 0.3
            const x = 40 + Math.cos(a) * 24
            const y = 62 + Math.sin(a) * 6
            return (
              <g key={i}>
                {i % 4 === 3 ? <Kid x={x} y={y + 2} c={COATS[i % COATS.length]!} s={1.4} /> : <Guest x={x} y={y} i={i} season={season} s={1.05} />}
                <Packet x={x + 2} y={y - 3.4} c={[P.paper, P.yellow, P.blossom][i % 3]} s={0.6} />
              </g>
            )
          })}
          {tier >= 4 ? <Lantern x={20} y={24} c={P.orange} /> : null}
          {tier >= 4 ? <Lantern x={60} y={24} c={P.red} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
  }
  return null
}
