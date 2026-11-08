import { useEffect, useState } from 'react'
import { playSfx } from '../../game/sound'
import {
  NOTEBOOK_ENTRIES,
  type NotebookEntryId,
  type NotebookState,
} from '../../game/notebook'
import { t } from '../../i18n'
import { GENERATORS } from '../../game/generators'
import { RARITY_BONUS, SET_BONUS, VARIETIES, collectionMult, completedSets } from '../../game/gardenLife'
import { formatDecimal } from '../../game/format'
import { RESIDENTS, residentsMult, type ResidentId } from '../../game/residents'
import { ResidentArt } from '../../theme/ResidentArt'

interface Props {
  notebook: NotebookState
  /** Open straight on this letter (e.g. a new one) */
  initialEntry?: NotebookEntryId | null
  onRead: (id: NotebookEntryId) => void
  onClose: () => void
  /** Pflanzenbuch — variety ids found */
  collection: readonly string[]
  /** Gartenbewohner — species → visits */
  residentsSeen?: Partial<Record<ResidentId, number>>
}

function hintFor(def: (typeof NOTEBOOK_ENTRIES)[number]): string {
  if (def.helper != null) return t.notebook.lockedHintHelper(def.helper)
  if (def.ilse != null) return t.notebook.lockedHintIlse(def.ilse)
  if (def.generation != null) return t.notebook.lockedHintGeneration
  if (def.deep != null) return t.notebook.lockedHintDeep
  if (def.year != null) return t.notebook.lockedHintYear(def.year)
  if (def.stage != null) return t.notebook.lockedHintStage(t.gardenStage.names[def.stage])
  return t.notebook.lockedEntry
}

function signatureFor(id: NotebookEntryId | null): string {
  const from = NOTEBOOK_ENTRIES.find((e) => e.id === id)?.from
  return from === 'jonas' ? t.notebook.signatureJonas : from === 'ilse' ? t.notebook.signatureIlse : t.notebook.signature
}

/** Omas Notizbuch — a paper notebook with all letters found so far. */
export function NotebookSheet({ notebook, initialEntry, onRead, onClose, collection, residentsSeen = {} }: Props) {
  const [open, setOpen] = useState<NotebookEntryId | null>(initialEntry ?? null)
  const [tab, setTab] = useState<'letters' | 'plants' | 'residents'>('letters')

  useEffect(() => {
    if (!open) return
    onRead(open)
    playSfx('letter')
  }, [open, onRead])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      if (open) setOpen(null)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const entry = open ? t.notebook.entries[open] : null

  return (
    <div className="notebook-layer" role="presentation" onClick={onClose}>
      <div
        className="notebook"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notebook-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="notebook-head">
          {open ? (
            <button type="button" className="notebook-back" onClick={() => setOpen(null)}>
              ‹ {t.notebook.title}
            </button>
          ) : (
            <h2 id="notebook-title" className="notebook-title">
              {t.notebook.title}
            </h2>
          )}
          <button type="button" className="notebook-close" onClick={onClose} aria-label={t.notebook.close}>
            ×
          </button>
        </header>

        {!entry ? (
          <div className="notebook-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'letters'} className={`notebook-tab${tab === 'letters' ? ' active' : ''}`} onClick={() => setTab('letters')}>
              {t.plantbook.lettersTab}
            </button>
            <button type="button" role="tab" aria-selected={tab === 'plants'} className={`notebook-tab${tab === 'plants' ? ' active' : ''}`} onClick={() => setTab('plants')}>
              {t.plantbook.tab} · {collection.length}/{VARIETIES.length}
            </button>
            <button type="button" role="tab" aria-selected={tab === 'residents'} className={`notebook-tab${tab === 'residents' ? ' active' : ''}`} onClick={() => setTab('residents')}>
              {t.residents.tab} · {RESIDENTS.filter((r) => (residentsSeen[r.id] ?? 0) > 0).length}/{RESIDENTS.length}
            </button>
          </div>
        ) : null}

        {!entry && tab === 'residents' ? (
          <ResidentAlbum seen={residentsSeen} />
        ) : !entry && tab === 'plants' ? (
          <PlantBook collection={collection} />
        ) : entry ? (
          <article className="notebook-letter" aria-live="polite">
            <h3 id={open ? 'notebook-title' : undefined}>{entry.title}</h3>
            <p>{entry.body}</p>
            <p className="notebook-signature">{signatureFor(open)}</p>
          </article>
        ) : (
          <>
            <p className="notebook-intro">{t.notebook.intro}</p>
            <ol className="notebook-pages">
              {NOTEBOOK_ENTRIES.map((def) => {
                const unlocked = notebook.unlocked.includes(def.id)
                const unread = unlocked && !notebook.read.includes(def.id) && def.id !== 'welcome'
                const copy = t.notebook.entries[def.id]
                return (
                  <li key={def.id}>
                    {unlocked ? (
                      <button
                        type="button"
                        className={`notebook-page${unread ? ' unread' : ''}`}
                        onClick={() => setOpen(def.id)}
                      >
                        {def.from && def.from !== 'oma' ? (
                          <span className="notebook-page-from">{def.from === 'jonas' ? t.notebook.fromJonas : t.notebook.fromIlse}</span>
                        ) : null}
                        <span className="notebook-page-title">{copy.title}</span>
                        <span className="notebook-page-snippet">{copy.body.slice(0, 64)}…</span>
                      </button>
                    ) : (
                      <div className="notebook-page locked" aria-label={t.notebook.lockedEntry}>
                        <span className="notebook-page-title">{t.notebook.lockedEntry}</span>
                        <span className="notebook-page-snippet">{hintFor(def)}</span>
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>
          </>
        )}
      </div>
    </div>
  )
}

function ResidentAlbum({ seen }: { seen: Partial<Record<ResidentId, number>> }) {
  const found = RESIDENTS.filter((r) => (seen[r.id] ?? 0) > 0).length
  return (
    <div className="plantbook resident-album">
      <p className="notebook-intro">{t.residents.intro}</p>
      <p className="plantbook-total">{t.residents.total(formatDecimal((residentsMult(seen) - 1) * 100, 0), found, RESIDENTS.length)}</p>
      <ul className="resident-grid">
        {RESIDENTS.map((r) => {
          const n = seen[r.id] ?? 0
          const hint = [
            r.decor ? t.residents.needDecor(t.decor.names[r.decor]!) : null,
            r.area ? t.residents.needArea(t.modules[r.area.id].name, r.area.level) : null,
            r.seasons ? r.seasons.map((x) => t.residents.seasons[x]).join(', ') : null,
            r.dayparts ? r.dayparts.map((x) => t.residents.dayparts[x]).join(', ') : null,
          ].filter(Boolean).join(' · ')
          return (
            <li key={r.id} className={`resident-card${n > 0 ? ' found' : ''}`}>
              <ResidentArt id={r.id} silhouette={n === 0} />
              <strong>{n > 0 ? t.residents.names[r.id] : t.residents.unknown}</strong>
              <small>{n > 0 ? t.residents.visits(n) : hint}</small>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function PlantBook({ collection }: { collection: readonly string[] }) {
  const total = (collectionMult(collection) - 1) * 100
  const sets = completedSets(collection)
  return (
    <div className="plantbook">
      <p className="notebook-intro">{t.plantbook.intro}</p>
      <p className="plantbook-total">
        {t.plantbook.total(formatDecimal(total, 1))} · {t.plantbook.found(collection.length, VARIETIES.length)}
      </p>
      {[...GENERATORS.map((g) => ({ key: g.id as string, name: g.name })), { key: 'fest', name: t.plantbook.festGroup }].map((g) => {
        const list = VARIETIES.filter((v) => (g.key === 'fest' ? Boolean(v.fest) : !v.fest && v.module === g.key))
        if (list.length === 0) return null
        return (
          <section key={g.key} className={`plantbook-group${g.key === 'fest' ? ' fest' : ''}`}>
            <h4>
              {g.name}
              {g.key !== 'fest' ? (
                <span className={`plantbook-set${sets.includes(g.key as never) ? ' done' : ''}`}>
                  {sets.includes(g.key as never)
                    ? t.sets.complete(formatDecimal(SET_BONUS * 100, 0))
                    : t.sets.progress(list.filter((v) => collection.includes(v.id)).length, list.length)}
                </span>
              ) : null}
            </h4>
            <ul>
              {list.map((v) => {
                const have = collection.includes(v.id)
                return (
                  <li key={v.id} className={`plantbook-item rarity-${v.rarity}${have ? ' found' : ''}`}>
                    <span className="plantbook-name">{have ? t.plantbook.names[v.id] : t.plantbook.unknown}</span>
                    <span className="plantbook-meta">
                      {v.fest ? `${t.fest.names[v.fest]} · ` : ''}
                      {t.plantbook.rarity[v.rarity]} · {t.plantbook.bonus(formatDecimal(RARITY_BONUS[v.rarity] * 100, 1))}
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
