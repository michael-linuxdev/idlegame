/**
 * Zentrale Grafik-Liste je Kapitel: welche Komponente zeichnet Bereiche,
 * gesperrte Ecken, freie Plätze und die Kulisse. Jedes Kapitel liegt in
 * src/theme/art/kapitel/<id>.tsx. Diese Liste bindet alle direkt ein (für
 * Tests und ?artsheet); das Spiel lädt sie je Kapitel nach (chapterArt.ts).
 * Ein Test stellt sicher, dass jedes Kapitel aus chapters.ts vollständig ist.
 */
import type { ChapterId } from '../../game/chapters'
import alm from './kapitel/alm'
import bauernhof from './kapitel/bauernhof'
import botanik from './kapitel/botanik'
import gartenschau from './kapitel/gartenschau'
import imkerei from './kapitel/imkerei'
import japangarten from './kapitel/japangarten'
import kraeuter from './kapitel/kraeuter'
import lavendel from './kapitel/lavendel'
import obstwiese from './kapitel/obstwiese'
import teich from './kapitel/teich'
import weinberg from './kapitel/weinberg'
import stadtgarten from './kapitel/stadtgarten'
import klostergarten from './kapitel/klostergarten'
import schlossgarten from './kapitel/schlossgarten'
import baumschule from './kapitel/baumschule'
import moorgarten from './kapitel/moorgarten'
import deichgarten from './kapitel/deichgarten'
import spreewald from './kapitel/spreewald'
import cottagegarten from './kapitel/cottagegarten'
import tulpenfelder from './kapitel/tulpenfelder'
import artischocken from './kapitel/artischocken'
import beerenwald from './kapitel/beerenwald'
import patio from './kapitel/patio'
import korkeichen from './kapitel/korkeichen'
import paprikafelder from './kapitel/paprikafelder'
import aranfelder from './kapitel/aranfelder'
import rosental from './kapitel/rosental'
import pistazien from './kapitel/pistazien'
import andenkartoffeln from './kapitel/andenkartoffeln'
import milpa from './kapitel/milpa'
import kaffeewald from './kapitel/kaffeewald'
import reisterrassen from './kapitel/reisterrassen'
import gewuerzgarten from './kapitel/gewuerzgarten'
import type { ChapterArtEntry } from './kapitel/types'

export type { AreaArtProps, ChapterArtEntry } from './kapitel/types'

export const ART_REGISTRY: Record<ChapterId, ChapterArtEntry> = {
  obstwiese,
  weinberg,
  bauernhof,
  imkerei,
  teich,
  kraeuter,
  botanik,
  alm,
  lavendel,
  japangarten,
  gartenschau,
  stadtgarten,
  klostergarten,
  schlossgarten,
  baumschule,
  moorgarten,
  deichgarten,
  spreewald,
  cottagegarten,
  tulpenfelder,
  artischocken,
  beerenwald,
  patio,
  korkeichen,
  paprikafelder,
  aranfelder,
  rosental,
  pistazien,
  andenkartoffeln,
  milpa,
  kaffeewald,
  reisterrassen,
  gewuerzgarten,
}
