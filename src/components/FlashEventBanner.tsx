import { formatAsh } from '../game/format'
import { FLASH_GOAL_REWARD_OBSIDIAN } from '../game/flashEvent'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
}

/** Short timed flash event — fair deadline, visible progress, no FOMO wipe. */
export function FlashEventBanner({ game }: Props) {
  const { flash, dismissFlash, claimFlashGoal } = game
  if (!flash.visible) return null

  const progressLabel = `${formatAsh(Math.min(flash.progress, flash.goal))} / ${formatAsh(flash.goal)}`

  return (
    <div className="banner event-surge flash-event map-banner compact" role="status">
      <div className="banner-copy">
        <p className="banner-kicker">
          {flash.name}
          {flash.mult > 1 ? (
            <span className="banner-mult"> · ×{flash.mult.toFixed(2)}</span>
          ) : null}
        </p>
        <p className="banner-oneline">
          <span className="banner-meta">{flash.endsLabel}</span>
          <span className="banner-reward">
            {' '}
            · {t.flash.goalLine(progressLabel, FLASH_GOAL_REWARD_OBSIDIAN)}
          </span>
        </p>
        <div
          className="event-goal"
          role="progressbar"
          aria-valuenow={Math.round(flash.ratio * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t.flash.goalAria}
        >
          <div
            className="event-goal-bar"
            style={{ width: `${flash.ratio * 100}%` }}
          />
        </div>
      </div>
      <div className="banner-actions">
        {flash.claimable ? (
          <button type="button" className="btn buy pulse-ready" onClick={claimFlashGoal}>
            {t.flash.claimGoal}
          </button>
        ) : null}
        {flash.claimed ? (
          <p className="banner-meta claimed">{t.flash.claimed}</p>
        ) : null}
        <button
          type="button"
          className="btn ghost event-dismiss"
          onClick={dismissFlash}
          aria-label={t.flash.dismiss}
        >
          ×
        </button>
      </div>
    </div>
  )
}
