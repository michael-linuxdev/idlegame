/**
 * Kapitel-Grafik (Kapitel 30–34, Bogen III): gemeinsame Teile. Farben nur
 * aus der Palette.
 *
 * Jahreszeiten an tropischen Orten deuten das Spieljahr als Regen-/Trockenzeit
 * bzw. Erntezyklus (siehe jeweilige Kapitel-Datei), sichtbar unterschiedlich.
 */
import { P } from '../palette'
import { ssn } from './season'


/** Flacher Boden unter einem Motiv. */
export function Patch({ fill, cx = 40, cy = 60, rx = 36, ry = 10, edge }: { fill: string; cx?: number; cy?: number; rx?: number; ry?: number; edge?: string }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} stroke={edge} strokeWidth={edge ? 0.5 : undefined} />
}

/** Reif/Frost: weiße Punkte auf dem Boden. */
export function Frost({ cx = 40, cy = 60, n = 9, w = 60 }: { cx?: number; cy?: number; n?: number; w?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <ellipse key={i} cx={cx - w / 2 + ((i * 37) % w)} cy={cy - 3 + ((i * 13) % 7)} rx="1.4" ry=".5" fill={P.white} opacity=".9" />
      ))}
    </g>
  )
}

/** Regenschnüre (Regenzeit, Monsun). */
export function Rain({ n = 8, x0 = 6, x1 = 74, y0 = 6, h = 9 }: { n?: number; x0?: number; x1?: number; y0?: number; h?: number }) {
  return (
    <g className="art-sky">
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + ((x1 - x0) / Math.max(1, n - 1)) * i
        const y = y0 + ((i * 11) % 14)
        return <path key={i} d={`M${x} ${y}l-2 ${h}`} stroke={P.waterLight} strokeWidth=".7" strokeLinecap="round" opacity=".9" />
      })}
    </g>
  )
}

/** Alpaka (Fußpunkt Mitte unten). */
export function Alpaca({ x, y, s = 1, flip = false, c = P.cream }: { x: number; y: number; s?: number; flip?: boolean; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g className="ha-graze">
        <path d="M-3 0v-5M-1.2 0v-5M2.6 0v-5M4.2 0v-5" stroke={P.outlineFur} strokeWidth=".9" />
        <ellipse cx=".6" cy="-6.6" rx="5.2" ry="3" fill={c} stroke={P.outlineFur} strokeWidth=".35" />
        <path d="M4.2 -7.4Q5 -11 5.2 -14" stroke={P.outlineFur} strokeWidth="2.9" strokeLinecap="round" />
        <path d="M4.2 -7.4Q5 -11 5.2 -14" stroke={c} strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="6.2" cy="-14.4" rx="1.9" ry="1.2" fill={c} stroke={P.outlineFur} strokeWidth=".3" />
        <path d="M4.8 -15.3l-.3 -1.7M5.7 -15.4l.1 -1.7" stroke={P.outlineFur} strokeWidth=".55" strokeLinecap="round" />
        <circle cx="6.8" cy="-14.7" r=".3" fill={P.ink} />
        <circle cx="-4.4" cy="-7.4" r="1" fill={c} stroke={P.outlineFur} strokeWidth=".25" />
      </g>
    </g>
  )
}

/** Kartoffelpflanze: Frühling klein, Sommer Blüte, Herbst gelb, Winter abgeerntet (Erdhügel). */
export function PotatoPlant({ x, y, s = 1, season, flower = P.lilac }: { x: number; y: number; s?: number; season?: string; flower?: string }) {
  const z = ssn(season)
  if (z === 'winter') return <ellipse cx={x} cy={y} rx={3 * s} ry={1.1 * s} fill={P.soilDark} />
  const k = z === 'spring' ? 0.7 : 1
  const leaf = z === 'autumn' ? P.gold : z === 'spring' ? P.leafPale : P.leafDark
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <ellipse cx="-2" cy="-2.6" rx="2.6" ry="2" fill={leaf} stroke={P.outline} strokeWidth=".2" />
      <ellipse cx="2" cy="-2.8" rx="2.6" ry="2" fill={leaf} stroke={P.outline} strokeWidth=".2" />
      <ellipse cx="0" cy="-4.4" rx="2.4" ry="2" fill={z === 'autumn' ? P.woodLight : P.leaf} stroke={P.outline} strokeWidth=".2" />
      {z === 'summer' ? (
        <g>
          <circle cx="-1" cy="-6.6" r=".8" fill={flower} />
          <circle cx="1.2" cy="-6.2" r=".8" fill={P.white} />
          <circle cx="-1" cy="-6.6" r=".3" fill={P.yellow} />
        </g>
      ) : null}
    </g>
  )
}

/** Maispflanze: Frühling Keimling, Sommer grün mit Fahne, Herbst gold mit Kolben, Winter geknickt und trocken. */
export function CornPlant({ x, y, s = 1, season, beans = false }: { x: number; y: number; s?: number; season?: string; beans?: boolean }) {
  const z = ssn(season)
  if (z === 'spring') {
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 0v-5M0 -2q-3 -1 -4 -3M0 -3q3 -1 3.6 -3" stroke={P.leaf} strokeWidth=".9" fill="none" strokeLinecap="round" />
      </g>
    )
  }
  if (z === 'winter') {
    return (
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 0V-14l3 4" stroke={P.woodLight} strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M0 -5q-4 0 -5 2M0 -9q4 -1 5 1" stroke={P.woodMid} strokeWidth=".6" fill="none" />
        <ellipse cx="2.4" cy="-10.6" rx=".9" ry="1.8" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".2" transform="rotate(40 2.4 -10.6)" />
      </g>
    )
  }
  const leaf = z === 'autumn' ? P.gold : P.leaf
  const stalk = z === 'autumn' ? P.woodLight : P.leafDark
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-18" stroke={stalk} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M0 -4q-5 -1 -6 -5M0 -8q5 -1 6 -5M0 -12q-4 -1 -5 -4M0 -15q3 -1 4 -3" stroke={leaf} strokeWidth=".9" fill="none" strokeLinecap="round" />
      <path d="M0 -18l-1.4 -2.4M0 -18l1.4 -2.4M0 -18v-3" stroke={z === 'autumn' ? P.woodMid : P.yellow} strokeWidth=".5" />
      <ellipse cx="1.2" cy="-9" rx="1" ry="2.4" fill={z === 'autumn' ? P.yellow : P.leafPale} stroke={P.outlineSoft} strokeWidth=".2" transform="rotate(14 1.2 -9)" />
      {beans ? (
        <g>
          <path d="M0 -1q-1.6 -2 0 -4q1.6 -2 0 -4q-1.6 -2 0 -4" stroke={P.leafDark} strokeWidth=".5" fill="none" />
          {[-3, -7, -11].map((dy) => (
            <ellipse key={dy} cx={dy % 2 ? -1.3 : 1.3} cy={dy} rx=".9" ry=".6" fill={P.leafMoss} />
          ))}
          {z === 'summer' ? <circle cx="-1.2" cy="-5" r=".5" fill={P.tomato} /> : <path d="M1 -6v2.4" stroke={P.plum} strokeWidth=".7" strokeLinecap="round" />}
        </g>
      ) : null}
    </g>
  )
}

/** Kürbis am Boden: Blätter, Sommer gelbe Blüte, Herbst orange Frucht, Winter nur trockene Ranke. */
export function Squash({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  if (z === 'winter') return <path d={`M${x - 4 * s} ${y}q${3 * s} ${-1.4 * s} ${7 * s} 0`} stroke={P.woodMid} strokeWidth=".5" fill="none" />
  const k = z === 'spring' ? 0.6 : 1
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <path d="M-5 0q4 -2 9 0" stroke={P.leafDark} strokeWidth=".5" fill="none" />
      <path d="M-3 -.6a2.4 2 0 1 1 3 -1.6a2.2 1.8 0 1 1 -3 1.6z" fill={P.leaf} stroke={P.leafDark} strokeWidth=".25" />
      <path d="M1 -.4a2.6 2.2 0 1 1 3 -1.4" fill={P.leafDark} />
      {z === 'summer' ? <path d="M3.6 -3l.8 -1.4l.8 1.4z" fill={P.yellow} stroke={P.gold} strokeWidth=".2" /> : null}
      {z === 'autumn' ? <ellipse cx="3.6" cy="-1.2" rx="2.2" ry="1.6" fill={P.orange} stroke={P.autumnDark} strokeWidth=".3" /> : null}
    </g>
  )
}

/** Kaffeestrauch: Frühling weiße Blüte, Sommer grüne Kirschen, Herbst rote Kirschen, Winter (Trockenzeit) matt, ein paar späte Kirschen. */
export function CoffeeShrub({ x, y, s = 1, season, cherries = 4 }: { x: number; y: number; s?: number; season?: string; cherries?: number }) {
  const z = ssn(season)
  const leaf = z === 'winter' ? P.winterLeafDark : P.leafDark
  const leaf2 = z === 'winter' ? P.winterLeaf : P.leaf
  const dots = z === 'spring' ? P.white : z === 'summer' ? P.leafPale : z === 'autumn' ? P.berry : P.autumnDark
  const n = z === 'winter' ? Math.max(1, Math.round(cherries / 2)) : cherries
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-12M0 -4l-4 -3M0 -7l4 -3" stroke={P.bark} strokeWidth=".8" strokeLinecap="round" />
      <ellipse cx="-3" cy="-7" rx="3.6" ry="2.4" fill={leaf} />
      <ellipse cx="3" cy="-9" rx="3.6" ry="2.4" fill={leaf} />
      <ellipse cx="0" cy="-12" rx="3" ry="2.4" fill={leaf2} />
      <ellipse cx="-1" cy="-4" rx="3" ry="1.8" fill={leaf2} />
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={[-3, 2.6, -0.6, 3.6, -4, 0.8][i % 6]} cy={[-6.4, -8.4, -11, -10.4, -8, -4.6][i % 6]} r={z === 'spring' ? 0.85 : 0.75} fill={dots} stroke={z === 'spring' ? undefined : P.outline} strokeWidth=".12" />
      ))}
    </g>
  )
}

/** Schattenbaum (Akazie/Cordia): hoher Stamm, flache breite Krone. */
export function ShadeTree({ x, y, s = 1, season, crown = P.leafDark }: { x: number; y: number; s?: number; season?: string; crown?: string }) {
  const z = ssn(season)
  const c = z === 'winter' ? P.winterLeafDark : z === 'spring' ? P.leaf : crown
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-16M0 -12l-5 -5M0 -14l4 -4" stroke={P.bark} strokeWidth="1.3" strokeLinecap="round" />
      <ellipse cx="-4" cy="-18" rx="7" ry="3" fill={c} stroke={P.outline} strokeWidth=".2" />
      <ellipse cx="4" cy="-19.4" rx="7" ry="3" fill={c} stroke={P.outline} strokeWidth=".2" />
      <ellipse cx="0" cy="-21" rx="5" ry="2.4" fill={z === 'winter' ? P.winterLeaf : P.leaf} />
    </g>
  )
}

/** Ensete („falsche Banane“): dicker Scheinstamm, aufrechte Blätter mit roter Mittelrippe. */
export function Ensete({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  const leaf = z === 'winter' ? P.winterLeafDark : z === 'spring' ? P.leafLight : P.leaf
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-2 0q-.6 -5 .4 -9h3.2q1 4 .4 9z" fill={P.leafMoss} stroke={P.outline} strokeWidth=".25" />
      {[
        [-1, -9, -12, -17],
        [1, -9, 11, -18],
        [0, -9, -4, -24],
        [0, -9, 5, -23],
      ].map(([x0, y0, x1, y1], i) => (
        <g key={i}>
          <path d={`M${x0} ${y0}Q${(x0! + x1!) / 2 - 5.5} ${(y0! + y1!) / 2 - 1} ${x1} ${y1}Q${(x0! + x1!) / 2 + 5.5} ${(y0! + y1!) / 2 + 1} ${x0} ${y0}z`} fill={leaf} stroke={P.leafDark} strokeWidth=".25" />
          <path d={`M${x0} ${y0}L${x1} ${y1}`} stroke={P.berry} strokeWidth=".4" />
        </g>
      ))}
      {z === 'winter' ? <path d="M-2 -6l-4 2" stroke={P.woodLight} strokeWidth="1" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Tukul: Rundhaus mit spitzem Strohdach (Fußpunkt Mitte unten). */
export function Tukul({ x, y, s = 1, lit, door = P.woodDark, wall = P.woodLight, roof = P.woodMid }: { x: number; y: number; s?: number; lit?: boolean; door?: string; wall?: string; roof?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-8 0V-8Q0 -9.4 8 -8V0Q0 1.2 -8 0z" fill={wall} stroke={P.outlineWood} strokeWidth=".4" />
      <path d="M-8 -4Q0 -5 8 -4" stroke={P.woodMid} strokeWidth=".3" fill="none" />
      <path d="M-10 -7.6L0 -20L10 -7.6Q0 -6 -10 -7.6z" fill={roof} stroke={P.outlineWood} strokeWidth=".4" />
      <path d="M-6 -9L0 -18M-2 -8L0 -18M2 -8L0 -18M6 -9L0 -18" stroke={P.woodLight} strokeWidth=".35" />
      <path d="M0 -20v-2" stroke={P.bark} strokeWidth=".8" />
      <path d="M-1.8 0V-5a1.8 1.8 0 0 1 3.6 0V0z" fill={lit ? P.lamp : door} />
    </g>
  )
}

/** Adobe-Haus der Anden: Lehmwand, Ziegel- oder Strohdach (Fußpunkt unten links). */
export function AdobeHouse({ x, y, w, h, thatch = false, lit }: { x: number; y: number; w: number; h: number; thatch?: boolean; lit?: boolean }) {
  const top = y - h
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={P.terracottaLight} stroke={P.outlineWood} strokeWidth=".4" />
      <path d={`M${x + 1} ${top + h * 0.4}h${w - 2}M${x + 1} ${top + h * 0.7}h${w - 2}`} stroke={P.terracotta} strokeWidth=".3" />
      <path d={`M${x - 2} ${top + 0.4}L${x + w / 2} ${top - h * 0.5}L${x + w + 2} ${top + 0.4}z`} fill={thatch ? P.woodLight : P.terracotta} stroke={P.outlineWood} strokeWidth=".4" />
      {thatch ? <path d={`M${x + 2} ${top - 1}l${w / 2 - 2} ${-h * 0.4}M${x + w - 2} ${top - 1}l${-w / 2 + 2} ${-h * 0.4}`} stroke={P.woodMid} strokeWidth=".3" /> : null}
      <rect x={x + w * 0.4} y={y - h * 0.62} width={w * 0.2} height={h * 0.62} fill={P.blue} stroke={P.outline} strokeWidth=".3" />
      <rect x={x + w * 0.12} y={y - h * 0.7} width={w * 0.16} height={h * 0.26} fill={lit ? P.lamp : P.charcoal} />
    </g>
  )
}

/** Kokospalme (Fußpunkt unten), krummer Stamm, Wedel und Nüsse. */
export function CoconutPalm({ x, y, s = 1, lean = 1, nuts = 3, season }: { x: number; y: number; s?: number; lean?: number; nuts?: number; season?: string }) {
  const z = ssn(season)
  const frond = z === 'winter' ? P.leafMoss : P.leafDark
  return (
    <g transform={`translate(${x} ${y}) scale(${lean * s} ${s})`}>
      <path d="M0 0Q-1 -12 4 -24" stroke={P.bark} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M-.6 -6h1.6M-.4 -12h1.8M1 -18h1.8" stroke={P.woodDark} strokeWidth=".4" />
      {[
        'M4 -24Q-4 -27 -9 -21',
        'M4 -24Q-2 -31 -7 -30',
        'M4 -24Q8 -32 14 -29',
        'M4 -24Q12 -26 15 -19',
        'M4 -24Q5 -30 3 -33',
      ].map((d, i) => (
        <path key={i} d={d} stroke={i % 2 ? frond : P.leaf} strokeWidth="2" fill="none" strokeLinecap="round" />
      ))}
      {Array.from({ length: nuts }, (_, i) => (
        <circle key={i} cx={2.6 + i * 1.5} cy={-22.6 + (i % 2) * 0.8} r="1.1" fill={i % 2 ? P.woodDark : P.leafMoss} />
      ))}
    </g>
  )
}

/** Laufente, aufrecht (Fußpunkt Mitte unten). */
export function RunnerDuck({ x, y, s = 1, flip = false, c = P.white }: { x: number; y: number; s?: number; flip?: boolean; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-.6 0v-1.4M.8 0v-1.4" stroke={P.orange} strokeWidth=".5" />
      <path d="M-1.6 -1.4Q-2.4 -5 -.4 -7.4Q.4 -8.6 1 -7.6Q1.6 -5 1.4 -1.4z" fill={c} stroke={P.outlineFur} strokeWidth=".3" />
      <circle cx=".6" cy="-8.2" r="1" fill={c} stroke={P.outlineFur} strokeWidth=".25" />
      <path d="M1.4 -8.2l1.4 .3l-1.4 .4z" fill={P.amber} />
      <circle cx=".8" cy="-8.4" r=".2" fill={P.ink} />
    </g>
  )
}

/** Lumbung: Reisspeicher auf Pfosten mit Rattenscheiben und hohem, gewölbtem Dach (Fußpunkt Mitte unten). */
export function Lumbung({ x, y, s = 1, full = false }: { x: number; y: number; s?: number; full?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-5 0V-9M5 0V-9" stroke={P.woodDark} strokeWidth="1" />
      <ellipse cx="-5" cy="-6" rx="1.6" ry=".5" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".2" />
      <ellipse cx="5" cy="-6" rx="1.6" ry=".5" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".2" />
      <rect x="-6.4" y="-10" width="12.8" height="1.4" fill={P.wood} stroke={P.outlineWood} strokeWidth=".25" />
      <path d="M-6 -10Q-8 -18 0 -24Q8 -18 6 -10z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
      <path d="M-4.6 -12Q-6 -18 0 -22M4.6 -12Q6 -18 0 -22" stroke={P.woodMid} strokeWidth=".3" fill="none" />
      <rect x="-1.6" y="-16" width="3.2" height="3.4" fill={full ? P.gold : P.woodDark} stroke={P.outlineWood} strokeWidth=".25" />
    </g>
  )
}

/** Pfefferranke an einem Stützbaum: herzförmige Blätter, Ähren grün (Sommer/Frühling) oder rot (Winter = Ernte). */
export function PepperVine({ x, y, s = 1, season, spikes = 3 }: { x: number; y: number; s?: number; season?: string; spikes?: number }) {
  const z = ssn(season)
  const spike = z === 'winter' ? P.berry : z === 'autumn' ? P.leafMoss : P.leafPale
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-24" stroke={P.bark} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="-3" cy="-25" rx="6" ry="3.6" fill={z === 'spring' ? P.leaf : P.leafDark} stroke={P.outline} strokeWidth=".2" />
      <ellipse cx="3.4" cy="-26.4" rx="6" ry="3.8" fill={z === 'spring' ? P.leafLight : P.leaf} stroke={P.outline} strokeWidth=".2" />
      <path d="M0 -2Q-3 -6 0 -10Q3 -14 0 -18Q-3 -21 0 -23" stroke={P.leafMoss} strokeWidth=".6" fill="none" />
      {[-3, -7, -11, -15, -19].map((dy, i) => (
        <path key={dy} d={`M${i % 2 ? 1 : -1} ${dy}q${i % 2 ? 3.6 : -3.6} -1.6 ${i % 2 ? 3 : -3} ${2.6}z`} fill={P.leaf} stroke={P.leafDark} strokeWidth=".2" />
      ))}
      {Array.from({ length: spikes }, (_, i) => (
        <path key={i} d={`M${i % 2 ? 2.4 : -2.4} ${-5 - i * 4.4}v3`} stroke={spike} strokeWidth="1.1" strokeLinecap="round" strokeDasharray=".5 .3" />
      ))}
    </g>
  )
}

/** Monarchfalter (klein). */
export function Monarch({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0l-2.6 -1.8q-.8 1.4 .2 2.2zM0 0l2.6 -1.8q.8 1.4 -.2 2.2z" fill={P.orange} stroke={P.ink} strokeWidth=".3" />
      <path d="M0 -.6v1.4" stroke={P.ink} strokeWidth=".4" />
    </g>
  )
}

/** Person mit Hut (Fußpunkt Mitte unten), sonst wie Person aus partsB. */
export function Farmer({ x, y, c, s = 1, hat = P.woodDark, skirt }: { x: number; y: number; c: string; s?: number; hat?: string; skirt?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-7" r="1.6" fill={P.skin} />
      <path d="M-2.6 -8.1h5.2" stroke={hat} strokeWidth=".7" strokeLinecap="round" />
      <path d="M-1.3 -8.2v-1.5h2.6v1.5z" fill={hat} />
      <path d="M-2 -5h4l.6 4h-5.2z" fill={c} />
      {skirt ? <path d="M-2.8 -2.2h5.6l.6 2.4h-6.8z" fill={skirt} /> : <path d="M-1 -1v3M1 -1v3" stroke={P.charcoal} strokeWidth=".8" />}
    </g>
  )
}
