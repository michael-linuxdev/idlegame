/**
 * Kapitel-Grafik (Kapitel 35–39, Bogen III zweite Hälfte): gemeinsame Teile.
 * Farben nur aus der Palette.
 *
 * Jahreszeiten: Oase und Ghana deuten das Spieljahr nach dem Erntezyklus,
 * Australien und Neuseeland nach den Jahreszeiten der Südhalbkugel (der
 * Frühling des Spiels ist dort der September). Siehe Kopf der Kapitel-Dateien.
 */
import { P } from '../palette'
import { ssn } from './season'

/** Dattelpalme (Fußpunkt unten): geschuppter Stamm, Wedel, Rispen je Jahreszeit. */
export function DatePalm({ x, y, s = 1, season, bunches = 2, lean = 0 }: { x: number; y: number; s?: number; season?: string; bunches?: number; lean?: number }) {
  const z = ssn(season)
  const tx = lean * 4
  const frond = z === 'winter' ? P.winterLeafDark : P.leafDark
  const frond2 = z === 'winter' ? P.winterLeaf : P.leafMoss
  const fruit = z === 'spring' ? P.cream : z === 'summer' ? P.yellow : z === 'autumn' ? P.autumnDark : null
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M-1.6 0Q${tx - 1.4} -14 ${tx - 1} -26h2Q${tx + 1.4} -14 1.6 0z`} fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" />
      {[-4, -9, -14, -19, -23].map((dy) => (
        <path key={dy} d={`M${tx * (-dy / 26) - 1.4} ${dy}l1.4 -1.2l1.4 1.2`} stroke={P.woodDark} strokeWidth=".35" fill="none" />
      ))}
      {[
        `M${tx} -26Q${tx - 8} -30 ${tx - 13} -22`,
        `M${tx} -26Q${tx - 6} -33 ${tx - 12} -31`,
        `M${tx} -26Q${tx + 6} -33 ${tx + 12} -31`,
        `M${tx} -26Q${tx + 8} -30 ${tx + 13} -22`,
        `M${tx} -26Q${tx + 1} -32 ${tx - 1} -36`,
        `M${tx} -26Q${tx - 4} -28 ${tx - 8} -18`,
        `M${tx} -26Q${tx + 4} -28 ${tx + 8} -18`,
      ].map((d, i) => (
        <g key={i}>
          <path d={d} stroke={i % 2 ? frond2 : frond} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d={d} stroke={i % 2 ? frond : frond2} strokeWidth=".5" fill="none" strokeDasharray=".6 .5" transform="translate(0 .7)" />
        </g>
      ))}
      {fruit
        ? Array.from({ length: bunches }, (_, i) => {
            const bx = tx + (i % 2 ? 2.4 : -2.4) + (i > 1 ? (i % 2 ? 1.4 : -1.4) : 0)
            return (
              <g key={i}>
                <path d={`M${tx} -25Q${bx} -24 ${bx} -21`} stroke={P.gold} strokeWidth=".4" fill="none" />
                {z === 'summer' && i % 2 ? (
                  <path d={`M${bx - 1.6} -21.4h3.2l-.4 4h-2.4z`} fill={P.paper} stroke={P.outlineSoft} strokeWidth=".2" />
                ) : (
                  [0, 1, 2, 3, 4].map((k) => <circle key={k} cx={bx - 1 + (k % 3)} cy={-20.6 + Math.floor(k / 2) * 1.2} r=".75" fill={fruit} stroke={P.outlineSoft} strokeWidth=".12" />)
                )}
              </g>
            )
          })
        : null}
    </g>
  )
}

/** Granatapfelbaum (Fußpunkt unten): Frühling/Sommer rote Blüten, Herbst Früchte, Winter kahl. */
export function PomegranateTree({ x, y, s = 1, season, n = 4 }: { x: number; y: number; s?: number; season?: string; n?: number }) {
  const z = ssn(season)
  const pts: [number, number][] = [[-4, -9], [3, -11], [-1, -13], [5, -7], [-6, -6], [1, -8]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-6M0 -5l-4 -4M0 -6l4 -4M0 -6v-5" stroke={P.bark} strokeWidth="1" strokeLinecap="round" />
      {z === 'winter' ? (
        <path d="M-4 -9l-2 -2M4 -10l2 -2M0 -11l1 -3M-4 -9l1 -3" stroke={P.bark} strokeWidth=".5" />
      ) : (
        <g>
          <ellipse cx="-3" cy="-9" rx="5" ry="3.6" fill={z === 'autumn' ? P.gold : P.leaf} />
          <ellipse cx="3" cy="-10" rx="5" ry="3.6" fill={z === 'autumn' ? P.autumn : P.leafDark} />
          <ellipse cx="0" cy="-12.6" rx="4" ry="2.8" fill={z === 'autumn' ? P.gold : P.leafLight} />
        </g>
      )}
      {z !== 'winter'
        ? pts.slice(0, n).map(([px, py], i) =>
            z === 'autumn' ? (
              <g key={i}>
                <circle cx={px} cy={py} r="1.3" fill={P.berry} stroke={P.outline} strokeWidth=".2" />
                <path d={`M${px - 0.4} ${py - 1.2}l.4 -.6l.4 .6`} stroke={P.autumnDark} strokeWidth=".3" fill="none" />
              </g>
            ) : (
              <path key={i} d={`M${px - 0.7} ${py}l.7 -1.4l.7 1.4z`} fill={z === 'spring' ? P.tomato : P.orange} />
            ),
          )
        : [[-3, -2], [3, -1]].slice(0, Math.min(2, n)).map(([px, py], i) => <circle key={i} cx={px} cy={py} r=".9" fill={P.autumnDark} />)}
    </g>
  )
}

/** Lehmturm eines Ksar mit Zinnen und Ziermuster (Fußpunkt Mitte unten). */
export function MudTower({ x, y, w = 10, h = 22, lit }: { x: number; y: number; w?: number; h?: number; lit?: boolean }) {
  const t = y - h
  return (
    <g>
      <path d={`M${x - w / 2} ${y}L${x - w / 2 + 1} ${t}H${x + w / 2 - 1}L${x + w / 2} ${y}z`} fill={P.terracottaLight} stroke={P.outlineWood} strokeWidth=".4" />
      {[-w / 2 + 1, -w / 6, w / 6, w / 2 - 2].map((d) => (
        <rect key={d} x={x + d} y={t - 2} width="1.4" height="2" fill={P.terracottaLight} stroke={P.outlineWood} strokeWidth=".25" />
      ))}
      <path d={`M${x - w / 2 + 1.6} ${t + 3}h${w - 3.2}`} stroke={P.terracotta} strokeWidth=".6" strokeDasharray="1 .8" />
      <path d={`M${x - 1.2} ${t + 5}l1.2 -1.4l1.2 1.4l-1.2 1.4z`} fill={P.terracotta} />
      <rect x={x - 0.8} y={t + h * 0.45} width="1.6" height="2.4" fill={lit ? P.lamp : P.soilDark} />
    </g>
  )
}

/** Kakaobaum (Fußpunkt unten): Schoten direkt am Stamm, Farbe je Jahreszeit. */
export function CacaoTree({ x, y, s = 1, season, pods = 4 }: { x: number; y: number; s?: number; season?: string; pods?: number }) {
  const z = ssn(season)
  const leaf = z === 'winter' ? P.winterLeafDark : P.leafDark
  const leaf2 = z === 'winter' ? P.woodLight : z === 'spring' ? P.autumn : P.leaf
  const podPts: [number, number][] = [[-1.6, -6], [1.8, -8], [-1.8, -10.4], [1.6, -4], [3.4, -12], [-3.6, -13]]
  const pod = (i: number) => (z === 'autumn' ? [P.gold, P.berry, P.orange][i % 3]! : z === 'summer' ? P.leafPale : z === 'winter' ? P.autumnDark : P.leafLight)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-14M0 -11l-5 -4M0 -12l5 -5" stroke={P.bark} strokeWidth="1.3" strokeLinecap="round" />
      <ellipse cx="-5" cy="-16.6" rx="6" ry="3.4" fill={leaf} stroke={P.outline} strokeWidth=".2" />
      <ellipse cx="5" cy="-18" rx="6" ry="3.4" fill={leaf} stroke={P.outline} strokeWidth=".2" />
      <ellipse cx="0" cy="-19.6" rx="5" ry="3" fill={leaf2} />
      {z === 'spring'
        ? [[-0.8, -7], [0.9, -9], [-0.8, -12], [0.8, -5]].map(([px, py], i) => <circle key={i} cx={px} cy={py} r=".55" fill={P.blossom} />)
        : null}
      {Array.from({ length: Math.min(pods, podPts.length) }, (_, i) => {
        const [px, py] = podPts[i]!
        return (
          <g key={i}>
            <ellipse cx={px} cy={py} rx=".95" ry="1.9" fill={pod(i)} stroke={P.outline} strokeWidth=".2" transform={`rotate(${px < 0 ? 12 : -12} ${px} ${py})`} />
            <path d={`M${px} ${py - 1.4}v2.8`} stroke={P.outlineSoft} strokeWidth=".15" />
          </g>
        )
      })}
    </g>
  )
}

/** Bananen-/Kochbananenstaude (Fußpunkt unten): breite Blätter, Fruchtbüschel mit Blüte. */
export function BananaPlant({ x, y, s = 1, season, fruit = true, plantain = false }: { x: number; y: number; s?: number; season?: string; fruit?: boolean; plantain?: boolean }) {
  const z = ssn(season)
  const leaf = z === 'winter' ? P.winterLeaf : z === 'spring' ? P.leafPale : P.leafLight
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1.4 0q-.4 -6 .3 -12h2.2q.7 6 .3 12z" fill={P.leafMoss} stroke={P.outline} strokeWidth=".25" />
      {[
        [-1, -12, -13, -16],
        [1, -12, 12, -19],
        [0, -12, -5, -24],
        [0, -12, 6, -24],
      ].map(([x0, y0, x1, y1], i) => (
        <g key={i}>
          <path d={`M${x0} ${y0}Q${(x0! + x1!) / 2 - 5} ${(y0! + y1!) / 2 - 2} ${x1} ${y1}Q${(x0! + x1!) / 2 + 5} ${(y0! + y1!) / 2 + 2} ${x0} ${y0}z`} fill={i % 2 ? leaf : P.leaf} stroke={P.leafDark} strokeWidth=".25" />
          <path d={`M${x0} ${y0}L${x1} ${y1}`} stroke={P.leafDark} strokeWidth=".3" />
        </g>
      ))}
      {z === 'winter' ? <path d="M-1 -9l-6 3" stroke={P.woodLight} strokeWidth="1.2" strokeLinecap="round" /> : null}
      {fruit ? (
        <g>
          <path d="M1 -12q3 1 3 5" stroke={P.leafMoss} strokeWidth=".5" fill="none" />
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M${2.2 + k * 0.6} ${-11 + k * 1.3}q1.6 -.2 2.4 -1.4`} stroke={plantain ? P.leafDark : z === 'autumn' ? P.yellow : P.leafPale} strokeWidth="1" strokeLinecap="round" fill="none" />
          ))}
          <path d="M4 -7.4q.6 1.6 0 2.4q-.8 -.8 0 -2.4z" fill={P.plum} />
        </g>
      ) : null}
    </g>
  )
}

/** Akazie / Wattle (Fußpunkt unten): fein gefiedert, gelbe Blütenkugeln im Frühling, braune Hülsen im Sommer. */
export function Wattle({ x, y, s = 1, season, n = 6 }: { x: number; y: number; s?: number; season?: string; n?: number }) {
  const z = ssn(season)
  const crown = z === 'spring' ? P.leafMoss : z === 'winter' ? P.winterLeafDark : P.winterLeaf
  const pts: [number, number][] = [[-6, -14], [-2, -17], [3, -16], [6, -13], [0, -13], [-4, -11], [4, -11], [-1, -19]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-8M0 -6l-5 -6M0 -8l4 -5M0 -8v-6" stroke={P.bark} strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="-4" cy="-13" rx="6" ry="4" fill={crown} />
      <ellipse cx="4" cy="-13.6" rx="5.6" ry="3.8" fill={crown} />
      <ellipse cx="0" cy="-16.6" rx="5" ry="3.4" fill={z === 'spring' ? P.leaf : P.winterLeafDark} />
      {pts.slice(0, n).map(([px, py], i) =>
        z === 'spring' ? (
          <g key={i}>
            <circle cx={px} cy={py} r="1.5" fill={P.yellow} />
            <circle cx={px + 0.9} cy={py + 0.9} r="1" fill={P.gold} />
          </g>
        ) : z === 'summer' ? (
          <path key={i} d={`M${px - 1} ${py}q1 1.6 2.4 .8`} stroke={P.woodDark} strokeWidth=".7" fill="none" strokeLinecap="round" />
        ) : z === 'autumn' ? (
          <circle key={i} cx={px} cy={py} r=".45" fill={P.gold} />
        ) : (
          <circle key={i} cx={px} cy={py} r=".4" fill={P.winterLeafLight} />
        ),
      )}
    </g>
  )
}

/** Eukalyptus (Fußpunkt unten): heller Stamm mit Rindenstreifen, lockere silbergrüne Krone. */
export function Eucalyptus({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1.2 0Q-1.6 -12 -.4 -22h1.2Q1.6 -12 1.2 0z" fill={P.cream} stroke={P.stone} strokeWidth=".3" />
      <path d="M-.6 -20l-5 -6M.4 -18l5 -7" stroke={P.stoneLight} strokeWidth=".8" strokeLinecap="round" />
      {z === 'summer' || z === 'autumn' ? <path d="M1.2 -4q2 2 1 5M-1.2 -9q-2 2 -1 4" stroke={P.woodMid} strokeWidth=".5" fill="none" /> : null}
      <ellipse cx="-6" cy="-26" rx="5" ry="3" fill={P.winterLeaf} />
      <ellipse cx="5" cy="-25.6" rx="5" ry="3" fill={P.winterLeafDark} />
      <ellipse cx="0" cy="-29" rx="4.6" ry="2.8" fill={P.winterLeafLight} />
      {z === 'summer' ? [-7, -3, 4, 7].map((px) => <circle key={px} cx={px} cy={-25.4} r=".5" fill={P.cream} />) : null}
      {z === 'spring' ? <ellipse cx="2" cy="-27" rx="2.6" ry="1.2" fill={P.autumn} opacity=".8" /> : null}
    </g>
  )
}

/** Baumfarn / Ponga (Fußpunkt unten): faseriger Stamm, Wedelkrone, im Frühling Koru. */
export function TreeFern({ x, y, s = 1, season, h = 16 }: { x: number; y: number; s?: number; season?: string; h?: number }) {
  const z = ssn(season)
  const f = z === 'winter' ? P.winterLeafDark : P.leafDark
  const f2 = z === 'winter' ? P.leafMoss : z === 'spring' ? P.leafLight : P.leaf
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M-1.3 0V${-h}h2.6V0z`} fill={P.bark} stroke={P.outlineWood} strokeWidth=".3" />
      <path d={`M-1.3 ${-h * 0.3}h2.6M-1.3 ${-h * 0.55}h2.6M-1.3 ${-h * 0.8}h2.6`} stroke={P.soilDark} strokeWidth=".4" />
      {[
        [-13, 4],
        [13, 4],
        [-10, -3],
        [10, -3],
        [-4, -7],
        [5, -7],
      ].map(([dx, dy], i) => (
        <g key={i}>
          <path d={`M0 ${-h}Q${dx! / 2} ${-h + dy! - 3} ${dx} ${-h + dy!}`} stroke={i % 2 ? f : f2} strokeWidth="3.2" fill="none" strokeDasharray=".45 .35" />
          <path d={`M0 ${-h}Q${dx! / 2} ${-h + dy! - 3} ${dx} ${-h + dy!}`} stroke={i % 2 ? f2 : f} strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d={`M0 ${-h}Q${dx! / 2} ${-h + dy! - 3} ${dx} ${-h + dy!}`} stroke={P.white} strokeWidth=".25" fill="none" opacity=".6" />
        </g>
      ))}
      {z === 'spring' ? (
        <g>
          <path d={`M0 ${-h}q0 -3 2 -3.4q1.2 0 .8 1.2q-.6 .6 -1 0`} stroke={P.leafPale} strokeWidth=".7" fill="none" />
          <path d={`M0 ${-h}q-.4 -2.6 -2.2 -2.8q-1 0 -.6 1q.6 .4 .9 -.2`} stroke={P.leafPale} strokeWidth=".7" fill="none" />
        </g>
      ) : null}
    </g>
  )
}

/** Kauri (Fußpunkt unten): glatter grauer Säulenstamm, Krone ganz oben. */
export function Kauri({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-2.4 0Q-2 -14 -1.6 -26h3.2Q2 -14 2.4 0z" fill={P.stone} stroke={P.outlineStone} strokeWidth=".35" />
      <path d="M-1 -4q.6 -2 0 -4M1 -12q-.6 -2 0 -4" stroke={P.stoneLight} strokeWidth=".4" fill="none" />
      <path d="M0 -26l-6 -4M0 -26l6 -5M0 -26v-5" stroke={P.stoneDark} strokeWidth=".9" />
      <ellipse cx="-6" cy="-31" rx="5" ry="2.6" fill={z === 'winter' ? P.winterLeafDark : P.leafDark} />
      <ellipse cx="6" cy="-32" rx="5" ry="2.6" fill={z === 'winter' ? P.winterLeafDark : P.leafMoss} />
      <ellipse cx="0" cy="-33" rx="4" ry="2.4" fill={z === 'winter' ? P.winterLeaf : P.leaf} />
    </g>
  )
}

/** Harakeke (Neuseeländer Flachs): Fächer aus Schwertblättern, im Sommer Blütenstängel mit roten Blüten. */
export function Harakeke({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  const c = z === 'winter' ? P.winterLeafDark : P.leafMoss
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-9, -5, -2, 2, 5, 9].map((dx, i) => (
        <path key={dx} d={`M${dx * 0.12} 0Q${dx * 0.5} -6 ${dx} ${-10 - (i % 2) * 2}`} stroke={i % 2 ? c : P.leafDark} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      ))}
      {z === 'summer' || z === 'spring' ? (
        <g>
          <path d="M1 0V-17" stroke={P.woodDark} strokeWidth=".6" />
          {(z === 'summer' ? [-16, -14, -12] : [-16]).map((dy) => (
            <path key={dy} d={`M1 ${dy}l1.8 -.6`} stroke={z === 'summer' ? P.berry : P.leafPale} strokeWidth=".9" strokeLinecap="round" />
          ))}
        </g>
      ) : z === 'autumn' ? (
        <g>
          <path d="M1 0V-17" stroke={P.woodDark} strokeWidth=".6" />
          {[-16, -13].map((dy) => (
            <path key={dy} d={`M1 ${dy}l1.6 -1.2`} stroke={P.charcoal} strokeWidth=".8" strokeLinecap="round" />
          ))}
        </g>
      ) : null}
    </g>
  )
}

/** Chinakohl (Fußpunkt unten): Frühling/Sommer klein und offen, Herbst fester Kopf, Winter mit Stroh gebunden. */
export function NapaCabbage({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const z = ssn(season)
  const k = z === 'spring' ? 0.55 : z === 'summer' ? 0.8 : 1
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <ellipse cx="-2.4" cy="-1.4" rx="2.4" ry="1.4" fill={P.leaf} stroke={P.leafDark} strokeWidth=".2" />
      <ellipse cx="2.4" cy="-1.4" rx="2.4" ry="1.4" fill={P.leaf} stroke={P.leafDark} strokeWidth=".2" />
      <path d="M-2 -1Q-2.4 -6 0 -7.6Q2.4 -6 2 -1z" fill={z === 'spring' ? P.leafLight : P.leafPale} stroke={P.leafDark} strokeWidth=".25" />
      <path d="M0 -1.2V-7" stroke={P.cream} strokeWidth=".5" />
      {z === 'winter' ? <path d="M-2.2 -4.6h4.4" stroke={P.woodLight} strokeWidth=".8" /> : null}
    </g>
  )
}

/** Onggi-Krug (Fußpunkt Mitte unten): dunkelbraun glasiert, mit Deckel; Schneehaube im Winter. */
export function Onggi({ x, y, s = 1, snow }: { x: number; y: number; s?: number; snow?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-2.6 0Q-4.4 -3.4 -2.8 -6.2h5.6Q4.4 -3.4 2.6 0z" fill={P.soilDark} stroke={P.ink} strokeWidth=".25" />
      <path d="M-3.4 -3.6q3.4 1 6.8 0" stroke={P.woodMid} strokeWidth=".3" fill="none" />
      <ellipse cx="0" cy="-6.4" rx="3.2" ry=".8" fill={P.compost} stroke={P.ink} strokeWidth=".2" />
      <ellipse cx="0" cy="-7" rx=".7" ry=".4" fill={P.compost} />
      {snow ? <ellipse cx="0" cy="-6.9" rx="3" ry=".9" fill={P.white} /> : null}
    </g>
  )
}

/** Hanok: Holzständer, helle Wände, geschwungenes graues Ziegeldach (Fußpunkt Mitte unten). */
export function Hanok({ x, y, w = 30, h = 10, lit, snow }: { x: number; y: number; w?: number; h?: number; lit?: boolean; snow?: boolean }) {
  const l = x - w / 2
  return (
    <g>
      <rect x={l} y={y - 1.4} width={w} height="1.4" fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".25" />
      <rect x={l + 1} y={y - h} width={w - 2} height={h - 1.4} fill={P.cream} stroke={P.outlineWood} strokeWidth=".3" />
      {Array.from({ length: Math.round(w / 6) + 1 }, (_, i) => (
        <path key={i} d={`M${l + 1 + ((w - 2) / Math.round(w / 6)) * i} ${y - 1.4}V${y - h}`} stroke={P.woodDark} strokeWidth=".6" />
      ))}
      <rect x={x - 3} y={y - h + 2} width="6" height={h - 4} fill={lit ? P.lamp : P.paper} stroke={P.woodDark} strokeWidth=".3" />
      <path d={`M${x} ${y - h + 2}v${h - 4}M${x - 3} ${y - h / 2}h6`} stroke={P.woodDark} strokeWidth=".2" />
      <path d={`M${l - 4} ${y - h - 0.4}Q${l} ${y - h + 0.6} ${l + 4} ${y - h - 2}L${x} ${y - h - 6}L${l + w - 4} ${y - h - 2}Q${l + w} ${y - h + 0.6} ${l + w + 4} ${y - h - 0.4}Q${x} ${y - h - 3} ${l - 4} ${y - h - 0.4}z`} fill={P.charcoal} stroke={P.ink} strokeWidth=".3" />
      <path d={`M${l + 2} ${y - h - 1.6}Q${x} ${y - h - 4.6} ${l + w - 2} ${y - h - 1.6}`} stroke={P.metal} strokeWidth=".4" fill="none" />
      {snow ? <path d={`M${l + 2} ${y - h - 2.2}Q${x} ${y - h - 5.6} ${l + w - 2} ${y - h - 2.2}`} stroke={P.white} strokeWidth="1.2" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Kakibaum (Fußpunkt unten): Herbst orange Früchte im gelben Laub, Winter kahl mit wenigen Früchten, Sommer grün. */
export function Persimmon({ x, y, s = 1, season, n = 5 }: { x: number; y: number; s?: number; season?: string; n?: number }) {
  const z = ssn(season)
  const pts: [number, number][] = [[-6, -14], [-2, -18], [3, -16], [7, -13], [0, -12], [-4, -10], [5, -9], [-8, -11]]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0V-9M0 -7l-6 -6M0 -8l6 -5M0 -9l-1 -8M-6 -13l-3 1M6 -13l2 -3" stroke={P.bark} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      {z !== 'winter' ? (
        <g>
          <ellipse cx="-4" cy="-13" rx="7" ry="4.6" fill={z === 'autumn' ? P.gold : z === 'spring' ? P.leafLight : P.leafDark} opacity=".95" />
          <ellipse cx="4" cy="-13.6" rx="6.4" ry="4.2" fill={z === 'autumn' ? P.autumn : P.leaf} opacity=".95" />
          <ellipse cx="0" cy="-17" rx="5" ry="3.2" fill={z === 'autumn' ? P.yellow : z === 'spring' ? P.leafPale : P.leaf} opacity=".95" />
        </g>
      ) : null}
      {z === 'autumn' || z === 'winter'
        ? pts.slice(0, z === 'winter' ? Math.max(2, Math.ceil(n / 2)) : n).map(([px, py], i) => (
            <g key={i}>
              <circle cx={px} cy={py} r="1.2" fill={P.orange} stroke={P.autumnDark} strokeWidth=".2" />
              <path d={`M${px - 0.6} ${py - 1.1}h1.2`} stroke={P.leafDark} strokeWidth=".4" />
            </g>
          ))
        : z === 'summer'
          ? pts.slice(0, n).map(([px, py], i) => <circle key={i} cx={px} cy={py} r=".8" fill={P.leafPale} />)
          : pts.slice(0, n).map(([px, py], i) => <circle key={i} cx={px} cy={py} r=".5" fill={P.cream} />)}
      {z === 'winter' ? <path d="M-6 -13.6h3M2 -17.2h3" stroke={P.white} strokeWidth=".7" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Elster (Fußpunkt unten): schwarz-weiß mit langem Schwanz. */
export function Magpie({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-1 0v-1M.4 0v-1" stroke={P.ink} strokeWidth=".3" />
      <path d="M-1.8 -2.8l-4.6 1.4l.4 .8l4.6 -1z" fill={P.ink} />
      <ellipse cx="0" cy="-2.6" rx="2" ry="1.4" fill={P.ink} />
      <ellipse cx="-.4" cy="-2.4" rx="1.1" ry=".8" fill={P.white} />
      <circle cx="1.8" cy="-3.8" r="1" fill={P.ink} />
      <path d="M2.7 -3.9l1 .2l-1 .3z" fill={P.ink} />
    </g>
  )
}

/** Känguru, ruhig (Fußpunkt unten), stehend oder grasend. */
export function Kangaroo({ x, y, s = 1, flip = false, graze = false }: { x: number; y: number; s?: number; flip?: boolean; graze?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-1.6 -1.4Q-6 -1.2 -9.4 .2" stroke={P.wood} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M-1.6 -1.4Q-6 -1.2 -9.4 .2" stroke={P.woodMid} strokeWidth=".3" fill="none" transform="translate(0 .5)" />
      {graze ? (
        <g>
          <path d="M-3 -.6Q-3.6 -5.4 0 -5.8Q3.4 -5.6 3.8 -2.2L2.6 -1.4Q.6 -1 -1 -.6z" fill={P.wood} stroke={P.outlineWood} strokeWidth=".25" />
          <path d="M3.4 -3Q4.4 -2.4 4.6 -1" stroke={P.wood} strokeWidth="1.2" fill="none" />
          <path d="M4 -1.4l2.4 .6l-.2 .7l-2.6 -.2z" fill={P.wood} stroke={P.outlineWood} strokeWidth=".2" />
          <path d="M4.2 -1.8l-.6 -1.4M4.8 -1.6l-.2 -1.5" stroke={P.woodMid} strokeWidth=".55" strokeLinecap="round" />
          <path d="M2.6 -1.4v1.2M1.8 -1.2v1.2" stroke={P.woodMid} strokeWidth=".4" />
        </g>
      ) : (
        <g>
          <path d="M-2.6 -.6Q-3.6 -6 -.4 -8.8Q1.6 -9.6 2 -7.6Q2.2 -4 .8 -.8z" fill={P.wood} stroke={P.outlineWood} strokeWidth=".25" />
          <path d="M-.6 -2.6Q1 -4.4 .4 -7" stroke={P.woodLight} strokeWidth=".6" fill="none" />
          <path d="M1.4 -6.6l1.2 1.6" stroke={P.woodMid} strokeWidth=".45" strokeLinecap="round" />
          <path d="M.6 -8.6l2.6 -1.6l2 .6l-.2 .6l-2.4 .6z" fill={P.wood} stroke={P.outlineWood} strokeWidth=".2" />
          <path d="M1.4 -9.4l-.7 -1.8M2.2 -9.8l-.2 -1.8" stroke={P.woodMid} strokeWidth=".55" strokeLinecap="round" />
          <circle cx="3" cy="-9.6" r=".2" fill={P.ink} />
        </g>
      )}
      <path d="M-1.6 0h4" stroke={P.woodDark} strokeWidth=".8" strokeLinecap="round" />
    </g>
  )
}

/** Sterne am Nachthimmel (kleine helle Punkte). */
export function Stars({ n = 6, y0 = 4, y1 = 22 }: { n?: number; y0?: number; y1?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={6 + ((i * 29) % 68)} cy={y0 + ((i * 13) % Math.max(1, y1 - y0))} r={i % 3 ? 0.5 : 0.8} fill={i % 2 ? P.lamp : P.white} />
      ))}
    </g>
  )
}
