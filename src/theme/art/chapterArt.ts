/**
 * Kapitel-Grafik bei Bedarf nachladen: jedes Kapitel ist ein eigenes Bündel
 * (dynamisches import()), damit der Hauptgarten nicht die Grafik aller elf
 * Kapitel mitlädt. Inhalt wie ART_REGISTRY (registry.tsx).
 */
import { createElement, useEffect, useState } from 'react'
import type { ChapterId } from '../../game/chapters'
import { ArtSvg } from '../ArtSvg'
import type { ChapterArtEntry } from './kapitel/types'

type Loader = () => Promise<{ default: ChapterArtEntry }>

const LOADERS: Record<ChapterId, Loader> = {
  obstwiese: () => import('./kapitel/obstwiese'),
  weinberg: () => import('./kapitel/weinberg'),
  bauernhof: () => import('./kapitel/bauernhof'),
  imkerei: () => import('./kapitel/imkerei'),
  teich: () => import('./kapitel/teich'),
  kraeuter: () => import('./kapitel/kraeuter'),
  botanik: () => import('./kapitel/botanik'),
  alm: () => import('./kapitel/alm'),
  lavendel: () => import('./kapitel/lavendel'),
  japangarten: () => import('./kapitel/japangarten'),
  gartenschau: () => import('./kapitel/gartenschau'),
  stadtgarten: () => import('./kapitel/stadtgarten'),
  klostergarten: () => import('./kapitel/klostergarten'),
  schlossgarten: () => import('./kapitel/schlossgarten'),
  baumschule: () => import('./kapitel/baumschule'),
  moorgarten: () => import('./kapitel/moorgarten'),
  deichgarten: () => import('./kapitel/deichgarten'),
  spreewald: () => import('./kapitel/spreewald'),
  cottagegarten: () => import('./kapitel/cottagegarten'),
  tulpenfelder: () => import('./kapitel/tulpenfelder'),
  artischocken: () => import('./kapitel/artischocken'),
  beerenwald: () => import('./kapitel/beerenwald'),
  patio: () => import('./kapitel/patio'),
  korkeichen: () => import('./kapitel/korkeichen'),
  paprikafelder: () => import('./kapitel/paprikafelder'),
  aranfelder: () => import('./kapitel/aranfelder'),
  rosental: () => import('./kapitel/rosental'),
  pistazien: () => import('./kapitel/pistazien'),
  andenkartoffeln: () => import('./kapitel/andenkartoffeln'),
  milpa: () => import('./kapitel/milpa'),
  kaffeewald: () => import('./kapitel/kaffeewald'),
  reisterrassen: () => import('./kapitel/reisterrassen'),
  gewuerzgarten: () => import('./kapitel/gewuerzgarten'),
  oase: () => import('./kapitel/oase'),
  kakaogarten: () => import('./kapitel/kakaogarten'),
  buschgarten: () => import('./kapitel/buschgarten'),
  farngarten: () => import('./kapitel/farngarten'),
  kimchigarten: () => import('./kapitel/kimchigarten'),
}

const loaded = new Map<ChapterId, ChapterArtEntry>()
const pending = new Map<ChapterId, Promise<ChapterArtEntry>>()

export function loadChapterArt(id: ChapterId): Promise<ChapterArtEntry> {
  const done = loaded.get(id)
  if (done) return Promise.resolve(done)
  let p = pending.get(id)
  if (!p) {
    p = LOADERS[id]().then((m) => {
      loaded.set(id, m.default)
      return m.default
    })
    pending.set(id, p)
    p.catch(() => pending.delete(id))
  }
  return p
}

/** Offene Kapitel im Leerlauf vorladen, damit beim Wechsel nichts aufblitzt. */
export function prefetchChapterArt(ids: readonly ChapterId[]): void {
  const run = () => ids.forEach((id) => void loadChapterArt(id).catch(() => {}))
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 })
  else setTimeout(run, 1500)
}

const Blank = () => createElement(ArtSvg, { viewBox: '0 0 80 72' })
/** Platzhalter, solange die Kapitel-Grafik lädt (gleiche Größe, leer). */
export const BLANK_ART: ChapterArtEntry = { area: Blank, wild: Blank, ready: Blank, backdrop: () => null }

export function useChapterArt(id: ChapterId): ChapterArtEntry {
  const [state, setState] = useState<{ id: ChapterId; art: ChapterArtEntry } | null>(null)
  useEffect(() => {
    if (loaded.has(id)) return
    let live = true
    loadChapterArt(id)
      .then((art) => live && setState({ id, art }))
      .catch(() => {})
    return () => {
      live = false
    }
  }, [id])
  return loaded.get(id) ?? (state?.id === id ? state.art : BLANK_ART)
}
