import { useState, type ReactNode } from 'react'
import { FLASH_GOAL_REWARD_OBSIDIAN } from '../../game/flashEvent'
import { formatAsh, formatClock, formatMult } from '../../game/format'
import type { useGame } from '../../game/useGame'
import { t } from '../../i18n'
import { weatherAt, weatherTomorrow } from '../../game/gardenLife'
import {
  IconCloud,
  IconCrate,
  IconRain,
  IconWheel,
  IconWind,
  IconFertilizer,
  IconFestival,
  IconFlag,
  IconSnow,
  IconSun,
  IconFestToken,
  IconSprout,
} from '../../theme/icons'
import { festAt } from '../../game/fests'

type GameApi = ReturnType<typeof useGame>

interface Pill {
  key: string
  icon: ReactNode
  label: string
  aria?: string
  color?: string
  claim?: boolean
  detail?: { line: string; ratio: number; aria: string }
  onClick?: () => void
}

interface Props {
  game: GameApi
  /** Saisonende-Hinweis (not yet the main goal) */
  season?: { label: string; onOpen: () => void } | null
  /** Hofladen-Bestellung */
  order?: { label: string; detail: string; ratio: number; claim: boolean; onClaim: () => void } | null
  /** Open the Festladen */
  onOpenFest?: () => void
}

const WEATHER_ICON = {
  sonne: <IconSun />,
  regen: <IconRain />,
  wind: <IconWind />,
  mild: <IconCloud />,
} as const

/** Compact event bar — every timed bonus is one small pill, never a card. */
export function EventPills({ game, season, order, onOpenFest }: Props) {
  const [open, setOpen] = useState<string | null>(null)
  const { surge, surgeVisible, surgeGoalDone, surgeGoalClaimed, state, eventMult, flash } = game
  const pills: Pill[] = []

  if (order) {
    pills.push({
      key: 'order',
      icon: <IconCrate />,
      label: order.label,
      claim: order.claim,
      onClick: order.claim ? order.onClaim : undefined,
      detail: { line: order.detail, ratio: order.ratio, aria: order.label },
    })
  }

  if (game.turboMsLeft > 0) {
    pills.push({
      key: 'turbo',
      icon: <IconSprout />,
      label: t.turbo.pill(formatClock(game.turboMsLeft)),
      detail: { line: t.turbo.detail, ratio: 0, aria: t.turbo.detail },
    })
  }

  if (onOpenFest) {
    const fest = festAt(game.nowTick)
    const n = Math.floor(state.festTokens)
    pills.push({
      key: 'fest',
      icon: <IconFestToken fest={fest.id} />,
      label: t.fest.pill(t.fest.names[fest.id]!, n),
      aria: t.fest.pillAria(t.fest.names[fest.id]!, n, t.fest.tokens[fest.id]!),
      color: fest.color,
      onClick: onOpenFest,
    })
  }

  {
    const now = game.nowTick
    const today = weatherAt(now)
    const tomorrow = weatherTomorrow(now)
    pills.push({
      key: 'weather',
      icon: WEATHER_ICON[today],
      label: t.weather.pill(t.weather[today].name, t.weather[today].effect),
      detail: {
        line: t.weather.tomorrow(t.weather[tomorrow].name, t.weather[tomorrow].effect),
        ratio: 0,
        aria: t.weather[today].name,
      },
    })
  }

  {
    const buff = state.wheelBuff
    if (buff && buff.prestige === state.prestiges && (buff.kind === 'yield' || buff.kind === 'water')) {
      pills.push({
        key: 'wheel',
        icon: <IconWheel />,
        label: t.wheel.activePill[buff.kind],
      })
    }
  }

  if (surgeVisible) {
    const claim = surgeGoalDone && !surgeGoalClaimed
    const prog = `${formatAsh(Math.min(state.eventAshProgress, surge.goal))} / ${formatAsh(surge.goal)}`
    pills.push({
      key: 'surge',
      icon: <IconFestival />,
      label: claim
        ? `${surge.name} · ${t.event.claimGoal}`
        : `${surge.name} ${formatMult(eventMult)}`,
      claim,
      onClick: claim ? game.claimEventGoal : undefined,
      detail: surgeGoalClaimed
        ? { line: `${surge.endsLabel} · ${t.event.claimed}`, ratio: 1, aria: t.event.goalAria }
        : {
            line: `${surge.endsLabel} · ${t.event.goalLine(prog, surge.goalReward)}`,
            ratio: Math.min(1, state.eventAshProgress / surge.goal),
            aria: t.event.goalAria,
          },
    })
  }

  if (flash.visible) {
    const prog = `${formatAsh(Math.min(flash.progress, flash.goal))} / ${formatAsh(flash.goal)}`
    pills.push({
      key: 'flash',
      icon: <IconSun />,
      label: flash.claimable
        ? `${flash.name} · ${t.flash.claimGoal}`
        : `${formatMult(flash.mult)} · ${formatClock(flash.msLeft)}`,
      claim: flash.claimable,
      onClick: flash.claimable ? game.claimFlashGoal : undefined,
      detail: {
        line: `${flash.name} · ${t.flash.goalLine(prog, FLASH_GOAL_REWARD_OBSIDIAN)}`,
        ratio: flash.ratio,
        aria: t.flash.goalAria,
      },
    })
  }

  if (game.yieldBoostActive) {
    pills.push({
      key: 'boost',
      icon: <IconFertilizer />,
      label: `${formatMult(game.yieldBoostMult)} · ${formatClock(game.yieldBoostMsLeft)}`,
      detail: { line: t.shop.yieldBoostTitle, ratio: 0, aria: t.shop.yieldBoostTitle },
    })
  }

  if (game.clanBoostActive) {
    pills.push({
      key: 'clan',
      icon: <IconFlag />,
      label: `${formatMult(game.clanMult)} · ${formatClock(game.clanBoostMsLeft)}`,
      detail: { line: t.clanBoost.name, ratio: 0, aria: t.clanBoost.name },
    })
  }

  if (season) {
    pills.push({ key: 'season', icon: <IconSnow />, label: season.label, onClick: season.onOpen })
  }

  if (pills.length === 0) return null
  const expanded = pills.find((p) => p.key === open && p.detail)

  return (
    <div className="hud-pills-wrap">
      <div className="hud-pills" role="list">
        {pills.map((p) => (
          <button
            key={p.key}
            type="button"
            role="listitem"
            className={`hud-pill pill-${p.key}${p.claim ? ' claim' : ''}${open === p.key ? ' open' : ''}`}
            onClick={() => {
              if (p.onClick) {
                p.onClick()
                return
              }
              setOpen((o) => (o === p.key ? null : p.key))
            }}
            aria-expanded={p.detail && !p.onClick ? open === p.key : undefined}
            aria-label={p.aria}
            style={p.color ? { ['--pill-accent' as string]: p.color } : undefined}
          >
            <span className="hud-pill-icon">{p.icon}</span>
            <span className="hud-pill-label">{p.label}</span>
          </button>
        ))}
      </div>
      {expanded?.detail ? (
        <div className="hud-pill-detail" role="status">
          <p>{expanded.detail.line}</p>
          {expanded.detail.ratio > 0 ? (
            <div
              className="hud-pill-track"
              role="progressbar"
              aria-label={expanded.detail.aria}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(expanded.detail.ratio * 100)}
            >
              <span style={{ width: `${Math.round(expanded.detail.ratio * 100)}%` }} />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
