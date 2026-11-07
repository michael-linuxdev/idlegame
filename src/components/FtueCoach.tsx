import { useEffect, useState } from 'react'
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
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>
type Tab = 'fortress' | 'prestige' | 'clan'

interface Props {
  game: GameApi
  onTabChange: (tab: Tab) => void
  onHighlightChange: (id: string | null) => void
  onFtueActiveChange?: (active: boolean) => void
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
}: Props) {
  const [ftue, setFtue] = useState<FtueState>(() => loadFtue())

  useEffect(() => {
    saveFtue(ftue)
  }, [ftue])

  const active = !ftue.dismissed && ftue.beat !== 'done'

  useEffect(() => {
    onFtueActiveChange?.(active && ftueBlocksInstall(ftue.beat, ftue.dismissed))
  }, [active, ftue.beat, ftue.dismissed, onFtueActiveChange])

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
  const pitLevel = game.state.owned.emberPit ?? 0
  const coolingOpen = game.unlocked('ashForge')
  useEffect(() => {
    if (!active) return
    if (ftue.beat === 'upgradePit' && pitLevel > 1) {
      setFtue((s) => advanceFtue(s, 'upgradePit'))
    }
    if (ftue.beat === 'unlockForge' && coolingOpen) {
      setFtue((s) => advanceFtue(s, 'unlockForge'))
    }
  }, [active, ftue.beat, pitLevel, coolingOpen])

  function onPrimary() {
    if (ftue.beat === 'welcome') {
      setFtue((s) => advanceFtue(s, 'welcome'))
      return
    }
    if (ftue.beat === 'upgradePit') {
      setFtue((s) => advanceFtue(s, 'upgradePit'))
      return
    }
    if (ftue.beat === 'claimOffline') {
      if (game.offlineGained != null) game.dismissOffline()
      setFtue((s) => advanceFtue(s, 'claimOffline'))
      return
    }
    if (ftue.beat === 'unlockForge') {
      setFtue((s) => advanceFtue(s, 'unlockForge'))
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

  if (!active) return null

  const copy = ftueCopy(ftue.beat)
  if (!copy) return null

  const { step, total } = ftueStepIndex(ftue.beat)

  return (
    <aside className="ftue-coach" role="dialog" aria-labelledby="ftue-title">
      <div className="ftue-coach-inner">
        <div className="ftue-coach-text">
          <p className="ftue-eyebrow">
            Ops guide · {step}/{total}
          </p>
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
              className="btn ghost"
              onClick={() => setFtue((s) => advanceFtue(s, ftue.beat))}
            >
              {copy.skipLabel}
            </button>
          ) : (
            <button type="button" className="btn ghost ftue-dismiss" onClick={dismissAll}>
              Skip
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
