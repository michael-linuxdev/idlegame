/**
 * Grafik-Übersicht für Entwickler: `index.html?artsheet` (auch im
 * Produktions-Build, lädt als eigenes Bündel). Zeigt alle Bereiche
 * × Wild/Geräumt/Stufe 1–5 × 4 Jahreszeiten × Tag/Nacht und alle Kapitel.
 * Optional `?artsheet=garden` oder `?artsheet=kapitel` für nur einen Teil.
 * Grundlage für den Screenshot-Vergleich in scripts/e2e/art.mjs.
 */
import { CHAPTERS } from '../game/chapters'
import { DECOR } from '../game/decor'
import { GENERATORS } from '../game/generators'
import { RESIDENTS } from '../game/residents'
import type { Daypart, Season } from '../theme/ambient'
import { ART_REGISTRY } from '../theme/art/registry'
import { ArtDefs } from '../theme/art/parts'
import { DecorArt } from '../theme/DecorArt'
import { Laube } from '../theme/MapBackdrop'
import { ModuleArt } from '../theme/ModuleArt'
import { ClearedPlot, WildPlot } from '../theme/PlotArt'
import { ResidentArt } from '../theme/ResidentArt'
import { TIER_LEVELS } from '../theme/tiers'
import '../theme/tokens.css'
import '../theme/polish.css'
import './artsheet.css'

const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter']
const DAYPARTS: Daypart[] = ['day', 'night']

function GardenBlock({ season, daypart }: { season: Season; daypart: Daypart }) {
  return (
    <section className="as-block garden-stage-mood" data-season={season} data-daypart={daypart} data-art-block={`garden-${season}-${daypart}`}>
      <h2>
        Hauptgarten · {season} · {daypart}
      </h2>
      <div className="as-grid as-grid-7">
        <span />
        <b>Wild</b>
        <b>Geräumt</b>
        {TIER_LEVELS.map((lv, i) => (
          <b key={lv}>Stufe {i + 1}</b>
        ))}
        {GENERATORS.map((g) => (
          <div className="as-row" key={g.id}>
            <span className="as-label">{g.name}</span>
            <div className="as-cell plot-visual">
              <WildPlot id={g.id} season={season} />
            </div>
            <div className="as-cell plot-visual">
              <ClearedPlot season={season} />
            </div>
            {TIER_LEVELS.map((lv) => (
              <div className="as-cell plot-visual" key={lv}>
                <ModuleArt id={g.id} level={lv} producing season={season} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function ChapterBlock({ chapter }: { chapter: (typeof CHAPTERS)[number] }) {
  const art = ART_REGISTRY[chapter.id]
  return (
    <section className="as-block" data-art-block={`kapitel-${chapter.id}`}>
      <h2>
        Kapitel {chapter.number} · {chapter.id}
      </h2>
      <div className="as-grid as-grid-7">
        {chapter.areas.map((a, i) => (
          <div className="as-row" key={a.id}>
            <span className="as-label">{a.id}</span>
            <div className="as-cell">
              <art.wild seed={i} />
            </div>
            <div className="as-cell">
              <art.ready />
            </div>
            {TIER_LEVELS.map((lv) => (
              <div className="as-cell" key={lv}>
                <art.area id={a.id} level={lv} season="summer" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ArtSheet() {
  const part = new URLSearchParams(location.search).get('artsheet') || 'all'
  const garden = part === 'all' || part === 'garden'
  const chapters = part === 'all' || part === 'kapitel'
  return (
    <main className="artsheet">
      <ArtDefs />
      <h1>Grafik-Übersicht</h1>
      {garden
        ? SEASONS.flatMap((season) => DAYPARTS.map((d) => <GardenBlock key={`${season}-${d}`} season={season} daypart={d} />))
        : null}
      {chapters ? CHAPTERS.map((c) => <ChapterBlock key={c.id} chapter={c} />) : null}
      {garden ? (
        <section className="as-block" data-art-block="laube">
          <h2>Omas Laube · verfallen / hergerichtet / mit Blumen · Tag und Nacht</h2>
          <div className="as-flow">
            {DAYPARTS.map((d) =>
              [0, 4, 8].map((stage) => (
                <div className="as-cell as-laube" data-daypart={d} key={`${d}-${stage}`}>
                  <Laube stage={stage} />
                </div>
              )),
            )}
          </div>
        </section>
      ) : null}
      {part === 'all' ? (
        <section className="as-block" data-art-block="deko">
          <h2>Deko & Bewohner</h2>
          <div className="as-flow">
            {DECOR.map((d) => (
              <div className="as-cell as-small" key={d.id} title={d.id}>
                <DecorArt id={d.id} />
              </div>
            ))}
            {DECOR.map((d) => (
              <div className="as-cell as-small as-night" data-daypart="night" key={`n-${d.id}`} title={`${d.id} (Nacht)`}>
                <DecorArt id={d.id} />
              </div>
            ))}
            {RESIDENTS.map((r) => (
              <div className="as-cell as-small" key={r.id} title={r.id}>
                <ResidentArt id={r.id} />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}
