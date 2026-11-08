import { DECOR } from '../game/decor'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import { DecorArt } from '../theme/DecorArt'

type GameApi = ReturnType<typeof useGame>

/** Deko-Fenster: buy pieces (Samen), see what you own, jump into placing. */
export function DecorSheet({ game, onClose, onPlace }: { game: GameApi; onClose: () => void; onPlace: () => void }) {
  const { state } = game
  const placed = new Set(state.decorSlots.filter(Boolean))
  const visible = DECOR.filter((d) => !d.exclusive || state.decorOwned.includes(d.id))
  return (
    <div className="upgrade-hud-layer" onClick={onClose}>
      <div className="upgrade-hud decor-sheet" role="dialog" aria-labelledby="decor-title" onClick={(e) => e.stopPropagation()}>
        <header className="upgrade-hud-header">
          <h2 id="decor-title">{t.decor.title}</h2>
          <button type="button" className="upgrade-hud-close" onClick={onClose} aria-label={t.decor.done}>
            ×
          </button>
        </header>
        <p className="muted">{t.decor.intro}</p>
        <div className="decor-shop-grid">
          {visible.map((d) => {
            const owned = state.decorOwned.includes(d.id)
            return (
              <div key={d.id} className={`decor-card${owned ? ' owned' : ''}`}>
                <DecorArt id={d.id} />
                <strong>{t.decor.names[d.id]}</strong>
                {owned ? (
                  <small>{placed.has(d.id) ? t.decor.placed : t.decor.owned}</small>
                ) : (
                  <button type="button" className="btn buy" disabled={state.samen < d.cost} onClick={() => game.purchaseDecor(d.id)}>
                    {t.decor.buy(d.cost)}
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <button type="button" className="btn buy decor-place-btn" disabled={state.decorOwned.length === 0} onClick={onPlace}>
          {t.decor.place}
        </button>
      </div>
    </div>
  )
}
