import { SAFE_COST } from '../game/weatherEvents'
import { playSfx } from '../game/sound'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import { ArtSvg } from '../theme/ArtSvg'

type GameApi = ReturnType<typeof useGame>

const ICON = {
  sturm: (
    <ArtSvg viewBox="0 0 24 24">
      <path d="M3 8h11a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 18h7" fill="none" stroke="#3d6fa4" strokeWidth="2.2" strokeLinecap="round" />
    </ArtSvg>
  ),
  hitze: (
    <ArtSvg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" fill="#f5b52a" />
      <path d="M12 1v4M12 19v4M1 12h4M19 12h4M4 4l3 3M17 17l3 3M20 4l-3 3M7 17l-3 3" stroke="#e8901a" strokeWidth="2" strokeLinecap="round" />
    </ArtSvg>
  ),
  frost: (
    <ArtSvg viewBox="0 0 24 24">
      <path d="M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17M9 4l3 2 3-2M9 20l3-2 3 2" fill="none" stroke="#5aa6d6" strokeWidth="2" strokeLinecap="round" />
    </ArtSvg>
  ),
} as const

/** Small card on the map when today's weather asks for a choice. */
export function WeatherDecision({ game, onToast }: { game: GameApi; onToast: (text: string) => void }) {
  const kind = game.weatherEvent
  if (!kind) return null
  const copy = t.weatherEvent[kind]
  const cost = SAFE_COST[kind]
  const decide = (choice: 'safe' | 'risk') => {
    const good = game.chooseWeather(choice)
    playSfx(good ? 'claim' : 'tap')
    onToast(choice === 'safe' ? copy.safeDone : good ? copy.riskGood : copy.riskBad)
  }
  return (
    <div className={`weather-card weather-${kind}`} role="group" aria-label={t.weatherEvent.aria}>
      <strong>
        <span className="weather-icon">{ICON[kind]}</span> {copy.title}
      </strong>
      <div className="weather-actions">
        <button type="button" className="btn buy" disabled={!!cost.samen && game.state.samen < cost.samen} onClick={() => decide('safe')}>
          {copy.safe}
        </button>
        <button type="button" className="btn ghost" onClick={() => decide('risk')}>
          {copy.risk}
        </button>
      </div>
    </div>
  )
}
