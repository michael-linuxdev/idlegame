import { useState } from 'react'
import { createPortal } from 'react-dom'
import { DECOR_SLOTS, type DecorId } from '../game/decor'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import type { Season } from '../theme/ambient'
import { DecorArt } from '../theme/DecorArt'

type GameApi = ReturnType<typeof useGame>

/** Placed Deko on Omas Garten map; in edit mode the Dekoplätze become tappable. */
export function DecorLayer({ game, season, editing, onDone }: { game: GameApi; season: Season; editing: boolean; onDone: () => void }) {
  const { state } = game
  const [pickSlot, setPickSlot] = useState<number | null>(null)
  const placed = new Set(state.decorSlots.filter(Boolean))
  return (
    <>
      {DECOR_SLOTS.map((slot, i) => {
        const id = state.decorSlots[i]
        const style = { left: `${slot.left}%`, top: `${slot.top}%`, zIndex: 2 + Math.round(slot.top) }
        if (editing) {
          return (
            <button
              key={i}
              type="button"
              className={`decor-slot edit${id ? ' filled' : ''}${pickSlot === i ? ' active' : ''}`}
              style={style}
              aria-label={t.decor.slotAria(i + 1)}
              onClick={() => setPickSlot(i)}
            >
              {id ? <DecorArt id={id} season={season} /> : <span aria-hidden="true">+</span>}
            </button>
          )
        }
        return id ? (
          <div key={i} className={`decor-slot decor-${id}`} style={style} aria-hidden="true">
            <DecorArt id={id} season={season} />
          </div>
        ) : null
      })}
      {editing ? (
        <div className="decor-edit-bar" role="toolbar">
          <span>{t.decor.editHint}</span>
          <button type="button" className="btn buy" onClick={() => { setPickSlot(null); onDone() }}>
            {t.decor.done}
          </button>
        </div>
      ) : null}
      {editing && pickSlot != null ? createPortal(
        <div className="upgrade-hud-layer decor-picker-layer" onClick={() => setPickSlot(null)}>
          <div className="upgrade-hud decor-picker" role="dialog" aria-label={t.decor.pickTitle} onClick={(e) => e.stopPropagation()}>
            <header className="upgrade-hud-header">
              <h2>{t.decor.pickTitle}</h2>
              <button type="button" className="upgrade-hud-close" onClick={() => setPickSlot(null)} aria-label={t.decor.done}>
                ×
              </button>
            </header>
            {state.decorOwned.length === 0 ? <p className="muted">{t.decor.nothingOwned}</p> : null}
            <div className="decor-pick-grid">
              {state.decorOwned.map((id: DecorId) => (
                <button
                  key={id}
                  type="button"
                  className={`decor-pick${state.decorSlots[pickSlot] === id ? ' current' : ''}${placed.has(id) && state.decorSlots[pickSlot] !== id ? ' elsewhere' : ''}`}
                  onClick={() => {
                    game.setDecor(pickSlot, id)
                    setPickSlot(null)
                  }}
                >
                  <DecorArt id={id} season={season} />
                  <span>{t.decor.names[id]}</span>
                </button>
              ))}
            </div>
            {state.decorSlots[pickSlot] ? (
              <button type="button" className="btn ghost" onClick={() => { game.setDecor(pickSlot, null); setPickSlot(null) }}>
                {t.decor.remove}
              </button>
            ) : null}
          </div>
        </div>,
        document.body,
      ) : null}
    </>
  )
}
