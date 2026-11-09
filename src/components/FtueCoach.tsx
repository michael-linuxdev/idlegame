import { useEffect, useRef, useState } from 'react'
import {
  ftueBlocksInstall,
  ftueCopy,
  ftueStepIndex,
  loadFtue,
  nextBeat,
  saveFtue,
  type FtueBeatId,
  type FtueState,
} from '../game/ftue'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>
type Tab = 'garten' | 'prestige' | 'clan' | 'shop'

interface Props {
  game: GameApi
  onTabChange: (tab: Tab) => void
  onHighlightChange: (id: string | null) => void
  onFtueActiveChange?: (active: boolean) => void
  /** True while any FTUE beat is on screen */
  onCoachVisible?: (visible: boolean) => void
}

function advanceFtue(s: FtueState, from: FtueBeatId): FtueState {
  if (s.dismissed || s.beat !== from) return s
  const completed = s.completed.includes(from) ? s.completed : [...s.completed, from]
  return { ...s, beat: nextBeat(from), completed }
}

export function FtueCoach({
  game,
  onTabChange,
  onHighlightChange,
  onFtueActiveChange,
  onCoachVisible,
}: Props) {
  const [ftue, setFtue] = useState<FtueState>(() => loadFtue())
  const coachRef = useRef<HTMLElement>(null)
  /** px from the top when the coach must dodge its own target; null = bottom */
  const [topPx, setTopPx] = useState<number | null>(null)

  useEffect(() => {
    saveFtue(ftue)
  }, [ftue])

  const active = !ftue.dismissed && ftue.beat !== 'done'

  useEffect(() => {
    onFtueActiveChange?.(active && ftueBlocksInstall(ftue.beat, ftue.dismissed))
  }, [active, ftue.beat, ftue.dismissed, onFtueActiveChange])

  useEffect(() => {
    onCoachVisible?.(active)
  }, [active, onCoachVisible])

  // Sync map/tab highlight with current beat (advances only via CTAs / auto — never blocks idle)
  useEffect(() => {
    if (!active) {
      onHighlightChange(null)
      return
    }
    const copy = ftueCopy(ftue.beat)
    onHighlightChange(copy?.highlight ?? null)
  }, [ftue.beat, active, onHighlightChange])

  // Auto-advance when the player actually does the beat (less CTA clutter)
  const pitLevel = game.state.owned.gemuesebeet ?? 0
  const coolingOpen = game.unlocked('kompost')
  // Adjusted during render (guarded): advancing changes `ftue.beat`, so this
  // runs once per beat without an extra effect pass.
  if (active && ftue.beat === 'tendBed' && pitLevel > 1) {
    setFtue((s) => advanceFtue(s, 'tendBed'))
  } else if (active && ftue.beat === 'unlockCompost' && coolingOpen) {
    setFtue((s) => advanceFtue(s, 'unlockCompost'))
  } else if (active && ftue.beat === 'visitClan' && !game.features.has('clan')) {
    // Der Verein kommt erst später (featureUnlocks) — Schritt überspringen
    setFtue((s) => advanceFtue(s, 'visitClan'))
  }

  function onPrimary() {
    if (ftue.beat === 'welcome') {
      setFtue((s) => advanceFtue(s, 'welcome'))
      return
    }
    if (ftue.beat === 'tendBed') {
      setFtue((s) => advanceFtue(s, 'tendBed'))
      return
    }
    if (ftue.beat === 'claimOffline') {
      if (game.offlineGained != null) game.dismissOffline()
      setFtue((s) => advanceFtue(s, 'claimOffline'))
      return
    }
    if (ftue.beat === 'unlockCompost') {
      setFtue((s) => advanceFtue(s, 'unlockCompost'))
      return
    }
    if (ftue.beat === 'visitClan') {
      onTabChange('clan')
      setFtue((s) => advanceFtue(s, 'visitClan'))
      return
    }
    if (ftue.beat === 'prestigeTeaser') {
      setFtue((s) => advanceFtue(s, 'prestigeTeaser'))
      onHighlightChange(null)
    }
  }

  function dismissAll() {
    setFtue((s) => ({ ...s, dismissed: true, beat: 'done' }))
    onHighlightChange(null)
  }

  // Never cover the thing the coach asks you to tap: if the highlighted
  // target sits under the card, move the card up below the HUD.
  const highlightKey = active ? (ftueCopy(ftue.beat)?.highlight ?? null) : null
  useEffect(() => {
    if (!highlightKey) return
    const place = () => {
      const target = document.querySelector('.ftue-target')
      const coach = coachRef.current
      if (!target || !coach) return setTopPx(null)
      const tr = target.getBoundingClientRect()
      const h = coach.getBoundingClientRect().height
      const bottomTop = window.innerHeight - h - 64
      if (tr.bottom < bottomTop - 8) return setTopPx(null)
      const hud = document.querySelector('.hud')?.getBoundingClientRect().bottom ?? 0
      const above = tr.top - h - 44 // room for the pointer arrow
      setTopPx(Math.max(hud + 8, above))
    }
    const first = requestAnimationFrame(place)
    const id = window.setInterval(place, 800)
    window.addEventListener('resize', place)
    return () => {
      cancelAnimationFrame(first)
      window.clearInterval(id)
      window.removeEventListener('resize', place)
    }
  }, [highlightKey])

  if (!active) return null
  const coachTop = highlightKey ? topPx : null

  const copy = ftueCopy(ftue.beat)
  if (!copy) return null

  const { step, total } = ftueStepIndex(ftue.beat)

  return (
    <aside
      ref={coachRef}
      className={`ftue-coach${coachTop != null ? ' at-top' : ''}`}
      style={coachTop != null ? { top: `${Math.round(coachTop)}px` } : undefined}
      role="dialog"
      aria-labelledby="ftue-title"
    >
      <div className="ftue-coach-inner">
        <div className="ftue-coach-text">
          <p className="ftue-eyebrow">{t.ftue.guide(step, total)}</p>
          <h2 id="ftue-title" className="ftue-title">
            {copy.title}
          </h2>
          <p className="ftue-body">{copy.body}</p>
        </div>
        <div className="ftue-actions">
          <button type="button" className="btn buy ftue-cta" onClick={onPrimary}>
            {copy.cta}
          </button>
          {copy.skipLabel ? (
            <button
              type="button"
              className="btn ghost ftue-secondary"
              onClick={() => setFtue((s) => advanceFtue(s, ftue.beat))}
            >
              {copy.skipLabel}
            </button>
          ) : (
            <button
              type="button"
              className="btn ghost ftue-secondary"
              onClick={dismissAll}
            >
              {t.ftue.skip}
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
