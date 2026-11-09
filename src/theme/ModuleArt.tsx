/**
 * Gartenerbe module art — ten garden areas, five visible growth tiers each.
 *
 * Tier thresholds (module level): 1 · 10 · 25 · 50 · 100. Every tier keeps
 * what came before and adds to it, so the garden visibly fills up.
 * All art shares the 100×86 plot viewBox with PlotArt (shadow at y≈77).
 * Die Bereiche selbst liegen je in einer Datei unter src/theme/art/garden/.
 */
import { memo, type ReactNode } from 'react'
import type { GeneratorId } from '../game/generators'
import { moduleTier } from './tiers'
import { ArtSvg } from './ArtSvg'
import { Beerenhecke } from './art/garden/beerenhecke'
import { Bienenstock } from './art/garden/bienenstock'
import { Gemuesebeet } from './art/garden/gemuesebeet'
import { Gewaechshaus } from './art/garden/gewaechshaus'
import { Hofladen } from './art/garden/hofladen'
import { Huehnerstall } from './art/garden/huehnerstall'
import { Kompost } from './art/garden/kompost'
import { Kraeuterspirale } from './art/garden/kraeuterspirale'
import { Obstwiese } from './art/garden/obstwiese'
import { Orangerie } from './art/garden/orangerie'
import { GardenLamp } from './art/parts'

/** Gartenlaterne hinter dem Bereich (ab Stufe 3), leuchtet abends und nachts. */
const LAMP: Record<GeneratorId, { x: number; y: number }> = {
  gemuesebeet: { x: 92, y: 46 },
  kompost: { x: 10, y: 50 },
  kraeuterspirale: { x: 88, y: 52 },
  beerenhecke: { x: 8, y: 46 },
  obstwiese: { x: 92, y: 50 },
  bienenstock: { x: 92, y: 50 },
  huehnerstall: { x: 90, y: 46 },
  gewaechshaus: { x: 10, y: 48 },
  hofladen: { x: 92, y: 44 },
  orangerie: { x: 8, y: 50 },
}

interface Props {
  id: GeneratorId
  level: number
  producing?: boolean
  selected?: boolean
}

function renderModule(id: GeneratorId, tier: number, producing: boolean): ReactNode {
  switch (id) {
    case 'gemuesebeet':
      return <Gemuesebeet t={tier} />
    case 'kompost':
      return <Kompost t={tier} producing={producing} />
    case 'kraeuterspirale':
      return <Kraeuterspirale t={tier} />
    case 'beerenhecke':
      return <Beerenhecke t={tier} />
    case 'obstwiese':
      return <Obstwiese t={tier} />
    case 'bienenstock':
      return <Bienenstock t={tier} producing={producing} />
    case 'huehnerstall':
      return <Huehnerstall t={tier} />
    case 'gewaechshaus':
      return <Gewaechshaus t={tier} />
    case 'hofladen':
      return <Hofladen t={tier} />
    case 'orangerie':
      return <Orangerie t={tier} />
  }
}

function ModuleArtImpl({ id, level, producing = false, selected = false }: Props) {
  const tier = Math.max(1, moduleTier(level))
  // Stufenwechsel animiert GardenMap über PlotFx onTier + .tier-grow
  const cls =
    `module-art module-${id}` +
    (producing ? ' producing' : '') +
    (selected ? ' selected' : '')

  return (
    <ArtSvg className={cls} viewBox="0 0 100 86" data-tier={tier}>
      {tier >= 3 ? <GardenLamp x={LAMP[id].x} y={LAMP[id].y} s={0.9} /> : null}
      {renderModule(id, tier, producing)}
    </ArtSvg>
  )
}

/** Memoized on tier (not raw level) so per-level buys don't redraw the SVG. */
export const ModuleArt = memo(ModuleArtImpl, (a, b) =>
  a.id === b.id &&
  moduleTier(a.level) === moduleTier(b.level) &&
  a.producing === b.producing &&
  a.selected === b.selected,
)
