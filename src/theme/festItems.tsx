/**
 * Fest-Deko als Daten: welches Stück an welchem Platz steht (Position in
 * Prozent der Karte, Breite in u). FestDecor.tsx zeichnet sie, MapBackdrop
 * hält damit Blumeninseln und Wildbüsche von belegten Plätzen fern.
 */
import type { ReactNode } from 'react'
import type { FestId } from '../game/fests'
import { Laterne, Ei, Tulpen, Wimpelkette, Sonnenschirm, Sonnenblume, Kuerbis, Garbe, Tanne, Kranz, Schneegloeckchen, Pfingstrose, Stern, Erntekrone } from './festArt'
import { P } from './art/palette'

/** Wimpelkette quer über den Garten (Sommerfest). */
export function festBunting(): ReactNode {
  return <Wimpelkette />
}

/** Ein Deko-Stück auf der Karte: Position in Prozent, Breite in u. */
export interface Spot {
  left: number
  top: number
  w: number
}
export type Item = Spot & { key: string; art: ReactNode }

const at = (left: number, top: number, w: number, art: ReactNode): Item => ({ left, top, w, art, key: `${left}/${top}` })

/**
 * Überdecken sich zwei Stücke auf der Karte? 1 u ≈ 1 % der Kartenbreite und
 * ≈ 0,5 % der Höhe; große Stücke (Bäume, Tanne) reichen entsprechend weiter.
 */
export function spotsCollide(a: Spot, b: Spot): boolean {
  return Math.abs(a.left - b.left) < (a.w + b.w) / 2 && Math.abs(a.top - b.top) < Math.max(5.5, (a.w + b.w) * 0.36)
}

/**
 * Deko je Fest. Die Plätze sind gegen Bereiche, Schilder und Weg ausgemessen;
 * Blumeninseln und Wildbüsche an derselben Stelle blendet MapBackdrop aus
 * (Rangfolge: Gartenstil > Fest > Blumen > Wildnis).
 */
export function festItems(fest: FestId): Item[] {
  switch (fest) {
    case 'laternenfest':
      return [
        at(43, 50, 7, <Laterne />),
        at(46.5, 61, 7, <Laterne hue={P.red} />),
        at(42, 76, 7, <Laterne hue={P.waterLight} />),
        at(44.5, 37, 7, <Laterne hue={P.yellow} />),
        at(8, 56, 7, <Laterne />),
        at(92, 50, 7, <Laterne hue={P.lilac} />),
      ]
    case 'advent':
      return [at(8, 49, 13, <Tanne />), at(40, 28.5, 9, <Kranz />)]
    case 'raunaechte':
      return [
        ...[[12, 20], [30, 16], [70, 18], [88, 22], [52, 14]].map(([x, y]) => at(x!, y!, 3.4, <Stern />)),
        at(91, 48, 11, <Tanne lights={false} />),
      ]
    case 'lichtmess':
      return [at(8, 52, 9, <Schneegloeckchen />), at(90, 44, 9, <Schneegloeckchen />), at(46, 64, 7, <Schneegloeckchen />)]
    case 'fruehlingsfest':
      return [
        at(9, 54, 4.2, <Ei />),
        at(44, 70, 3.8, <Ei c={P.yellow} s={P.red} />),
        at(56, 47, 3.8, <Ei c={P.leafLight} />),
        at(91, 44, 4.2, <Ei c={P.waterLight} s={P.pink} />),
        at(56, 80, 3.6, <Ei c={P.lilac} />),
        at(8, 63, 12, <Tulpen />),
      ]
    case 'bluetenfest':
      return [at(8, 53, 11, <Pfingstrose />), at(90, 43, 10, <Pfingstrose />)]
    case 'sommerfest':
      return [at(90, 50, 10, <Sonnenschirm />)]
    case 'sonnenblumen':
      return [6, 12, 88, 94].map((x, i) => at(x, 88 - (i % 2) * 3, 5, <Sonnenblume />))
    case 'erntedank':
      return [
        at(39, 31, 7, <Kuerbis />),
        at(61, 31.5, 5.5, <Kuerbis c={P.gold} />),
        at(9, 53, 8, <Garbe />),
        at(56, 73, 6, <Kuerbis c="#d2752c" />),
        at(91, 52, 7, <Kuerbis />),
        at(44, 57, 5, <Kuerbis c={P.gold} />),
      ]
  }
}

/** Dauerhafte Deko der Fest-Gartenstile (ohne Doppelung mit dem laufenden Fest). */
export function festSkinItems(skin: string | undefined, fest: FestId | undefined): Item[] {
  if (skin === 'skin-festFruehling' && fest !== 'fruehlingsfest') return [at(8, 63, 12, <Tulpen />), at(9, 54, 4, <Ei c={P.waterLight} />)]
  if (skin === 'skin-festErntedank') return [at(50, 20, 6, <Erntekrone />), ...(fest !== 'erntedank' ? [at(39, 31, 7, <Kuerbis />)] : [])]
  if (skin === 'skin-festAdvent' && fest !== 'advent') return [at(8, 49, 13, <Tanne />)]
  return []
}

/** Plätze, die Fest und Fest-Gartenstil gerade belegen; `blocked` = Plätze mit Vorrang (Gartenstil-Deko). */
export function festSpots(fest: FestId | undefined, skin: string | undefined, blocked: readonly Spot[] = []): Spot[] {
  const own = festSkinItems(skin, fest)
  const items = fest ? festItems(fest).filter((i) => ![...blocked, ...own].some((b) => spotsCollide(i, b))) : []
  return [...own, ...items]
}

