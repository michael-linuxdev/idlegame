import { useState } from 'react'
import { isSfxMuted, setSfxMuted } from '../game/sound'
import { t } from '../i18n'

export function MuteToggle() {
  const [muted, setMuted] = useState(() => isSfxMuted())

  function toggle() {
    const next = !muted
    setSfxMuted(next)
    setMuted(next)
  }

  return (
    <button
      type="button"
      className={`mute-toggle${muted ? ' muted' : ''}`}
      onClick={toggle}
      aria-pressed={muted}
      aria-label={muted ? t.sound.unmuteAria : t.sound.muteAria}
      title={muted ? t.sound.unmute : t.sound.mute}
    >
      <svg
        className="mute-icon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
      >
        {muted ? (
          <>
            <path
              d="M4 9v6h3l5 4V5L7 9H4z"
              fill="currentColor"
            />
            <path
              d="M16 9l5 5M21 9l-5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            <path
              d="M4 9v6h3l5 4V5L7 9H4z"
              fill="currentColor"
            />
            <path
              d="M16 8.5a4.5 4.5 0 010 7M18.5 6a8 8 0 010 12"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}
      </svg>
    </button>
  )
}
