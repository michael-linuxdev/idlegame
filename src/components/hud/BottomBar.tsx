import { formatErnte, formatClock } from '../../game/format'
import type { useGame } from '../../game/useGame'
import { t } from '../../i18n'
import { IconBasket, IconNotebook, IconWateringCan } from '../../theme/icons'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  highlightOffline: boolean
  onClaimOffline: () => void
  onClaimDaily: () => void
  onWater: () => void
}

/**
 * Bottom action zone: one claim slot (offline Ernte beats Gartenrunde) and
 * the big Gießen button. The Menü FAB (AppNav) sits to the right.
 */
export function BottomBar({ game, highlightOffline, onClaimOffline, onClaimDaily, onWater }: Props) {
  const { offlineGained, dailyReady, dailyPreview, state, tapReady } = game
  const cooldownLeft = game.tapCooldownLeftMs
  const ratio = tapReady ? 1 : 1 - cooldownLeft / game.tapCooldownMs
  const streak = state.dailyStreak
  const day = Math.max(1, Math.min(7, (streak || 0) + 1))

  return (
    <div className="hud-bottom">
      <div className="hud-claim-slot">
        {offlineGained != null ? (
          <button
            type="button"
            className={`hud-claim offline${highlightOffline ? ' ftue-target' : ''}`}
            onClick={onClaimOffline}
          >
            <span className="hud-claim-icon">
              <IconBasket />
            </span>
            <span className="hud-claim-text">
              <span className="hud-claim-title">{t.hud.claim}</span>
              <span className="hud-claim-sub">
                +{formatErnte(offlineGained)}
                <span className="sr-only"> {t.resources.ernte}</span>
              </span>
            </span>
          </button>
        ) : dailyReady ? (
          <button
            type="button"
            className={`hud-claim daily${dailyPreview.comeback ? ' comeback' : ''}`}
            onClick={onClaimDaily}
            aria-describedby="hud-daily-desc"
          >
            <span className="sr-only" id="hud-daily-desc">
              {`${t.daily.kicker}: ${dailyPreview.label}`}
            </span>
            <span className="hud-claim-icon">
              <IconNotebook />
            </span>
            <span className="hud-claim-text">
              <span className="hud-claim-title">{t.daily.short}</span>
              <span className="hud-claim-sub">
                {dailyPreview.comeback ? t.daily.comebackLabel : t.daily.dayOf(day)}
              </span>
            </span>
          </button>
        ) : null}
      </div>

      <button
        type="button"
        className={`hud-water${tapReady ? ' ready' : ' cooling'}`}
        onClick={onWater}
        disabled={!tapReady}
        style={{ ['--p' as string]: ratio.toFixed(3) }}
        title={tapReady ? t.hud.burstReadyTitle : t.hud.burstCoolingTitle}
      >
        <span className="hud-water-ring" aria-hidden="true" />
        <span className="hud-water-icon" aria-hidden="true">
          <IconWateringCan />
        </span>
        <span className="hud-water-label">
          {tapReady ? null : <span className="sr-only">{t.hud.burstCooling} </span>}
          {tapReady ? t.hud.burstReady : formatClock(cooldownLeft)}
        </span>
      </button>
    </div>
  )
}
