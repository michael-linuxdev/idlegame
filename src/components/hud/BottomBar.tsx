import { formatErnte, formatClock } from '../../game/format'
import type { useGame } from '../../game/useGame'
import { t } from '../../i18n'
import { IconBasket, IconNotebook, IconWateringCan } from '../../theme/icons'
import { todayReadyCount } from '../../game/today'
import type { ExtrasState } from '../../game/extras'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  highlightOffline: boolean
  onClaimOffline: () => void
  /** „Heute“-Karte öffnen (Gartenrunde, Rezept, Tagesziele, Wochenplan) */
  onOpenToday: () => void
  extras: ExtrasState
  onWater: () => void
}

/**
 * Bottom action zone: one slot (offline Ernte beats the „Heute“ entry) and
 * the big Gießen button. The Menü FAB (AppNav) sits to the right.
 */
export function BottomBar({ game, highlightOffline, onClaimOffline, onOpenToday, extras, onWater }: Props) {
  const { offlineGained, dailyReady, state, tapReady } = game
  const cooldownLeft = game.tapCooldownLeftMs
  const ratio = tapReady ? 1 : 1 - cooldownLeft / game.tapCooldownMs
  const ready = todayReadyCount({ state, dailyReady, recipeOpen: game.features.has('recipe'), extras })

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
        ) : (
          <button
            type="button"
            className={`hud-claim hud-today${ready > 0 ? ' ready' : ''}`}
            onClick={onOpenToday}
            aria-describedby="hud-today-desc"
          >
            <span className="sr-only" id="hud-today-desc">
              {t.today.open}
            </span>
            <span className="hud-claim-icon">
              <IconNotebook />
            </span>
            <span className="hud-claim-text">
              <span className="hud-claim-title">{t.today.button}</span>
              <span className="hud-claim-sub">{ready > 0 ? t.today.ready(ready) : t.today.allDone}</span>
            </span>
            {ready > 0 ? <span className="hud-dot" aria-hidden="true" /> : null}
          </button>
        )}
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
