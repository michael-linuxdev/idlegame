import { useState } from 'react'
import { toPng } from 'html-to-image'
import { GENERATORS } from '../game/generators'
import { RECIPE_NEED } from '../game/extrasCore'
import { logPlaytest } from '../game/playtestLog'
import { playSfx } from '../game/sound'
import type { Wish } from '../game/state'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'

type GameApi = ReturnType<typeof useGame>

/** Omas Tagesrezept — three ingredients, cook once a day. */
export function RecipeSheet({ game, onClose, onCooked }: { game: GameApi; onClose: () => void; onCooked: (msg: string) => void }) {
  const r = game.state.recipe
  const dish = t.recipe.dishes[r.dish % t.recipe.dishes.length]!
  return (
    <div className="upgrade-hud-layer" role="presentation" onClick={onClose}>
      <div className="upgrade-hud recipe-sheet" role="dialog" aria-modal="true" aria-labelledby="recipe-title" onClick={(e) => e.stopPropagation()}>
        <header className="upgrade-hud-header">
          <div className="upgrade-hud-heading">
            <p className="upgrade-hud-eyebrow">{t.recipe.title}</p>
            <h2 id="recipe-title">{t.recipe.line(dish)}</h2>
          </div>
          <button type="button" className="upgrade-hud-close" onClick={onClose} aria-label={t.upgrade.close}>
            ×
          </button>
        </header>
        {r.claimed ? (
          <p className="muted">{t.recipe.done}</p>
        ) : (
          <>
            <p className="upgrade-hud-stats">{t.recipe.need(RECIPE_NEED)}</p>
            <ul className="recipe-list">
              {r.areas.map((id, i) => {
                const name = GENERATORS.find((g) => g.id === id)?.name ?? id
                const have = r.have[i] ?? 0
                return (
                  <li key={id} className={have >= RECIPE_NEED ? 'done' : undefined}>
                    <span>{t.recipe.ingredient(name, have, RECIPE_NEED)}</span>
                    <span className="milestone-track" aria-hidden="true">
                      <span style={{ width: `${Math.min(100, (have / RECIPE_NEED) * 100)}%` }} />
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className="fest-expire">{t.recipe.reward}</p>
            <button
              type="button"
              className="btn buy"
              disabled={!game.recipeReady}
              onClick={() => {
                game.cookRecipe()
                playSfx('streak')
                onCooked(t.recipe.cooked(dish))
                onClose()
              }}
            >
              {t.recipe.cook}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/** Regenbogen / Sternschnuppe floating over the garden. */
export function SkyEventButton({ game, onWish }: { game: GameApi; onWish: () => void }) {
  const ev = game.state.skyEvent
  if (!ev || ev.until <= game.nowTick) return null
  if (ev.kind === 'rainbow') {
    return (
      <button
        type="button"
        className="sky-event rainbow"
        aria-label={t.sky.rainbowAria}
        onClick={() => {
          playSfx('level')
          game.tapRainbow()
        }}
      >
        <svg viewBox="0 0 100 52" aria-hidden="true">
          {['#e0485e', '#f08a2c', '#f5c542', '#7fbf5a', '#3d8db8', '#7a5ab8'].map((c, i) => (
            <path key={c} d={`M${6 + i * 4} 50 A${44 - i * 4} ${44 - i * 4} 0 0 1 ${94 - i * 4} 50`} stroke={c} strokeWidth="4" fill="none" />
          ))}
        </svg>
        <span>{t.sky.rainbow}</span>
      </button>
    )
  }
  return (
    <button type="button" className="sky-event star" aria-label={t.sky.starAria} onClick={onWish}>
      <svg viewBox="0 0 60 30" aria-hidden="true">
        <path d="M2 28 L44 8" stroke="#fff3b0" strokeWidth="2" strokeLinecap="round" opacity=".7" />
        <path d="M48 2l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L48 14.4 43 17.2l1.2-5.6L40 7.8l5.6-.6z" fill="#f5d76e" />
      </svg>
      <span>{t.sky.star}</span>
    </button>
  )
}

export function WishSheet({ game, onClose }: { game: GameApi; onClose: () => void }) {
  function pick(w: Wish) {
    game.wish(w)
    playSfx('claim')
    onClose()
  }
  return (
    <div className="upgrade-hud-layer" role="presentation" onClick={onClose}>
      <div className="upgrade-hud wish-sheet" role="dialog" aria-modal="true" aria-labelledby="wish-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="wish-title">{t.sky.wishTitle}</h2>
        <div className="wish-row">
          {(['samen', 'ernte', 'fest'] as Wish[]).map((w) => (
            <button key={w} type="button" className="btn buy" onClick={() => pick(w)}>
              {t.sky.wishes[w]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Foto-Modus overlay: HUD hidden, save the garden as a postcard. */
export function PhotoOverlay({ caption, onClose }: { caption: string; onClose: () => void }) {
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string | null>(null)

  async function save() {
    const node = document.querySelector<HTMLElement>('.garden-stage')
    if (!node) return
    setBusy(true)
    try {
      const url = await toPng(node, { pixelRatio: 2, cacheBust: true })
      const blob = await (await fetch(url)).blob()
      const file = new File([blob], 'gartenerbe-postkarte.png', { type: 'image/png' })
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
      if (nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], text: caption })
      } else {
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        a.click()
      }
      logPlaytest('photo', { action: 'save' })
      setNote(t.photo.saved)
    } catch {
      setNote(t.photo.failed)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="photo-overlay">
      <p className="photo-caption">{caption}</p>
      {note ? <p className="photo-note" role="status">{note}</p> : null}
      <div className="photo-actions">
        <button type="button" className="btn buy" onClick={save} disabled={busy}>
          {t.photo.save}
        </button>
        <button type="button" className="btn ghost" onClick={onClose}>
          {t.photo.close}
        </button>
      </div>
    </div>
  )
}
