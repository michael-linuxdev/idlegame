import { useState } from 'react'
import { useDismiss } from '../game/overlays'
import { logPlaytest } from '../game/playtestLog'
import { saveFile } from '../game/saveFile'
import { playSfx } from '../game/sound'
import type { Wish } from '../game/state'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import { ArtSvg } from '../theme/ArtSvg'

type GameApi = ReturnType<typeof useGame>

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
        <ArtSvg viewBox="0 0 100 52">
          {['#e0485e', '#f08a2c', '#f5c542', '#7fbf5a', '#3d8db8', '#7a5ab8'].map((c, i) => (
            <path key={c} d={`M${6 + i * 4} 50 A${44 - i * 4} ${44 - i * 4} 0 0 1 ${94 - i * 4} 50`} stroke={c} strokeWidth="4" fill="none" />
          ))}
        </ArtSvg>
      </button>
    )
  }
  return (
    <button type="button" className="sky-event star" aria-label={t.sky.starAria} onClick={onWish}>
      <ArtSvg viewBox="0 0 60 30">
        <path d="M2 28 L44 8" stroke="#fff3b0" strokeWidth="2" strokeLinecap="round" opacity=".7" />
        <path d="M48 2l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L48 14.4 43 17.2l1.2-5.6L40 7.8l5.6-.6z" fill="#f5d76e" />
      </ArtSvg>
    </button>
  )
}

export function WishSheet({ game, onClose }: { game: GameApi; onClose: () => void }) {
  useDismiss(onClose)
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
      // erst beim Foto nachladen (eigenes Bündel, offline im Precache)
      const { toPng } = await import('html-to-image')
      const url = await toPng(node, { pixelRatio: 2, cacheBust: true })
      const blob = await (await fetch(url)).blob()
      const file = new File([blob], 'gartenerbe-postkarte.png', { type: 'image/png' })
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
      if (nav.share && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], text: caption })
      } else {
        await saveFile(file.name, blob, 'image/png')
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
