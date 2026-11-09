/**
 * Selten genutzte Fenster und Panels als eigene Bündel (kleinerer Start).
 * Jedes hat seine eigene Suspense-Grenze, damit nie die ganze App kurz leer
 * wird; preloadLazy() lädt alle im Leerlauf nach dem Start vor. Offline sind
 * alle Bündel im Precache des Service Workers.
 */
import { lazy, Suspense, type ComponentType } from 'react'

const loaders: (() => Promise<unknown>)[] = []

function lazyNamed<P extends object>(load: () => Promise<ComponentType<P>>) {
  loaders.push(load)
  const Lazy = lazy(() => load().then((Component) => ({ default: Component })))
  return function LazyWindow(props: P) {
    return (
      <Suspense fallback={null}>
        <Lazy {...props} />
      </Suspense>
    )
  }
}

export const PrestigePanel = lazyNamed(() => import('./PrestigePanel').then((m) => m.PrestigePanel))
export const ShopPanel = lazyNamed(() => import('./ShopPanel').then((m) => m.ShopPanel))
export const ClanPanel = lazyNamed(() => import('./ClanPanel').then((m) => m.ClanPanel))
export const ChapterMap = lazyNamed(() => import('./ChapterMap').then((m) => m.ChapterMap))
export const NotebookSheet = lazyNamed(() => import('./story/NotebookSheet').then((m) => m.NotebookSheet))
export const SeasonCeremony = lazyNamed(() => import('./story/SeasonCeremony').then((m) => m.SeasonCeremony))
export const ProjectSheet = lazyNamed(() => import('./ProjectSheet').then((m) => m.ProjectSheet))
export const AlbumSheet = lazyNamed(() => import('./AlbumSheet').then((m) => m.AlbumSheet))
export const CollectionSheet = lazyNamed(() => import('./CollectionSheet').then((m) => m.CollectionSheet))
export const LegalSheet = lazyNamed(() => import('./LegalSheet').then((m) => m.LegalSheet))
export const SaveSheet = lazyNamed(() => import('./SaveSheet').then((m) => m.SaveSheet))
export const FestSheet = lazyNamed(() => import('./FestSheet').then((m) => m.FestSheet))
export const CrossSheet = lazyNamed(() => import('./CrossSheet').then((m) => m.CrossSheet))
export const DecorSheet = lazyNamed(() => import('./DecorSheet').then((m) => m.DecorSheet))
export const ProgressSheet = lazyNamed(() => import('./ProgressSheet').then((m) => m.ProgressSheet))

/** Alle Bündel im Leerlauf vorladen, damit das erste Öffnen nicht wartet. */
export function preloadLazy(): void {
  const run = () => {
    for (const load of loaders) void load().catch(() => {})
  }
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
  if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 4000 })
  else window.setTimeout(run, 2000)
}
