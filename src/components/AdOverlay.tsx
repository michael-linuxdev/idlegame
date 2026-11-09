/**
 * Testphase: Bonus-Werbung, die das Spiel wirklich sperrt (30 oder 60 s,
 * game/testWallet.ts). Abbrechen geht jederzeit — dann ohne Belohnung.
 * Ob jemand durchhält oder abbricht, steht im Playtest-Log („test_ad“).
 */
import { useEffect, useRef } from 'react'
import { t } from '../i18n'

export function AdOverlay({ ad, onCancel }: { ad: { totalS: number; leftMs: number } | null; onCancel: () => void }) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const open = ad != null
  useEffect(() => {
    if (open) cancelRef.current?.focus()
  }, [open])
  if (!ad) return null
  const left = Math.ceil(ad.leftMs / 1000)
  const done = 1 - ad.leftMs / (ad.totalS * 1000)
  const c = t.testAd
  return (
    <div className="test-phase-layer ad-layer" role="presentation">
      <div
        className="test-phase ad-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ad-title"
        aria-describedby="ad-body"
        onKeyDown={(e) => {
          // Fokus bleibt in der Werbung (das Spiel dahinter ist gesperrt)
          if (e.key === 'Tab') {
            e.preventDefault()
            cancelRef.current?.focus()
          }
        }}
      >
        <span className="ad-badge">{c.badge}</span>
        <h2 id="ad-title">{c.title}</h2>
        <p id="ad-body">{c.body}</p>
        <div className="ad-progress" role="progressbar" aria-valuemin={0} aria-valuemax={ad.totalS} aria-valuenow={ad.totalS - left} aria-valuetext={c.left(left)}>
          <span style={{ width: `${Math.round(done * 100)}%` }} />
        </div>
        <p className="ad-left">{c.left(left)}</p>
        <p className="test-phase-later">{c.paused}</p>
        <button ref={cancelRef} type="button" className="btn ghost" onClick={onCancel}>
          {c.cancel}
        </button>
      </div>
    </div>
  )
}
