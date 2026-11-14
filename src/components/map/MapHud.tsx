/**
 * Kopfzeile der Gartenkarte: Gärtnerstufe, Korb mit Ernte, Ziel-Zeile, Ereignis-Pillen. Teil von GardenMap.
 * Samen und Erbstücke stehen an den Tabs Markt und Saison (AppNav), nicht hier.
 */
import type { ComponentProps, Ref } from 'react'
import { formatErnte, formatMult, formatRate } from '../../game/format'
import type { useGame } from '../../game/useGame'
import { t } from '../../i18n'
import { IconBasket } from '../../theme/icons'
import { EventPills } from '../hud/EventPills'
import { GoalStrip, type HudGoal } from '../hud/GoalStrip'

type GameApi = ReturnType<typeof useGame>
type PillsProps = ComponentProps<typeof EventPills>

interface Props {
  game: GameApi
  hudRef: Ref<HTMLElement>
  stageName: string
  levelPulse: boolean
  tickFlash: boolean
  totalMult: number
  earlyGame: boolean
  hudGoal: HudGoal
  seasonPill: PillsProps['season']
  orderPill: PillsProps['order']
  onOpenProgress: () => void
  onOpenMult: () => void
  onOpenFest: () => void
  onOpenLetter?: (() => void) | null
  onOpenDeep?: (() => void) | null
}

export function MapHud({
  game,
  hudRef,
  stageName,
  levelPulse,
  tickFlash,
  totalMult,
  earlyGame,
  hudGoal,
  seasonPill,
  orderPill,
  onOpenProgress,
  onOpenMult,
  onOpenFest,
  onOpenLetter,
  onOpenDeep,
}: Props) {
  const { state, rate, playerLevel } = game
  return (
    <header className="hud hud-slim" ref={hudRef}>
      <div className="hud-row">
        <button
          type="button"
          className={`hud-card hud-garden${levelPulse ? ' level-up' : ''}`}
          onClick={onOpenProgress}
          aria-describedby="hud-garden-desc"
        >
          <span className="sr-only" id="hud-garden-desc">
            {t.hud.progressOpen}
          </span>
          <span className="hud-stage">{stageName}</span>
          <span className="hud-level">
            <span className="hud-level-label">
              <span className="sr-only">{t.level.short} </span>
              {playerLevel.level}
            </span>
            <span className="hud-xp" aria-hidden="true">
              <span style={{ width: `${Math.round(playerLevel.ratio * 100)}%` }} />
            </span>
          </span>
        </button>

        <button
          type="button"
          className="hud-card hud-wallet"
          onClick={onOpenMult}
          aria-describedby="hud-wallet-desc"
        >
          <span className="sr-only" id="hud-wallet-desc">
            {t.ux.mults.walletHint}
          </span>
          <span className={`hud-amount${tickFlash ? ' tick' : ''}`}>
            <span className="hud-amount-icon">
              <IconBasket />
            </span>
            {formatErnte(state.ernte)}
            <span className="sr-only"> {t.resources.ernte}</span>
          </span>
          <span className="hud-rate">
            {formatRate(rate)}
            {totalMult > 1 ? <span className="hud-mult"> {formatMult(totalMult)}</span> : null}
          </span>
        </button>
      </div>

      <GoalStrip goal={hudGoal} />
      {earlyGame ? null : (
      <EventPills
        game={game}
        season={seasonPill}
        order={orderPill}
        onOpenFest={onOpenFest}
        onOpenLetter={onOpenLetter}
        onOpenDeep={onOpenDeep}
      />
      )}
    </header>
  )
}
