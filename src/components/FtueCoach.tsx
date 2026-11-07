import { useEffect, useState } from 'react'
import {
  ftueCopy,
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
}

function advanceFtue(s: FtueState, from: FtueBeatId): FtueState {
  if (s.dismissed || s.beat !== from) return s
  const completed = s.completed.includes(from) ? s.completed : [...s.completed, from]
  return { ...s, beat: nextBeat(from), completed }
}

export function FtueCoach({ game, onTabChange, onHighlightChange }: Props) {
  const [ftue, setFtue] = useState<FtueState>(() => loadFtue())

  useEffect(() => {
    saveFtue(ftue)
  }, [ftue])

  // Sync map/tab highlight with current beat (advances only via CTAs — never blocks idle)
  useEffect(() => {
    if (ftue.dismissed || ftue.beat === 'done') {
      onHighlightChange(null)
      return
    }
    const copy = ftueCopy(ftue.beat)
    onHighlightChange(copy?.highlight ?? null)
  }, [ftue.beat, ftue.dismissed, onHighlightChange])

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

  if (ftue.dismissed || ftue.beat === 'done') return null

  const copy = ftueCopy(ftue.beat)
  if (!copy) return null

  return (
    <aside className="ftue-coach" role="dialog" aria-labelledby="ftue-title">
      <div className="ftue-coach-inner">
        <div className="ftue-coach-text">
          <p className="ftue-eyebrow">Guide</p>
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
          ) : null}
          <button type="button" className="btn ghost ftue-dismiss" onClick={dismissAll}>
            Skip guide
          </button>
        </div>
      </div>
    </aside>
  )
}
