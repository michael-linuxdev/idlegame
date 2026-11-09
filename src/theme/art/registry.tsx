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
}
