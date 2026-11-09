import { useState, type ReactNode } from 'react'
import { FLASH_GOAL_REWARD_SAMEN } from '../../game/flashEvent'
import { formatErnte, formatClock, formatMult } from '../../game/format'
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
  IconNotebook,
} from '../../theme/icons'
import { RECIPE_NEED } from '../../game/extrasCore'
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
  season?: { label: string; short?: string; onOpen: () => void } | null
  /** Hofladen-Bestellung */
  order?: { label: string; detail: string; ratio: number; claim: boolean; onClaim: () => void } | null
  /** Open the Festladen */
  onOpenFest?: () => void
  /** Open Omas Tagesrezept */
  onOpenRecipe?: () => void
}

const WEATHER_ICON = {
  sonne: <IconSun />,
  regen: <IconRain />,
  wind: <IconWind />,
  mild: <IconCloud />,
} as const

const MAX_VISIBLE = 3
/** What stays visible when the bar is crowded (claimable pills always lead). */
const PRIORITY = ['season', 'order', 'fest', 'turbo', 'rainbow', 'erntefest', 'flash', 'recipe', 'boost', 'clan', 'wheel', 'weather']
const PILLS_SEEN_KEY = 'gartenerbe-pills-seen-v1'

function loadSeen(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(PILLS_SEEN_KEY) ?? '[]') as unknown
    return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

/** Compact event bar — every timed bonus is one small pill, never a card. */
export function EventPills({ game, season, order, onOpenFest, onOpenRecipe }: Props) {
  const [open, setOpen] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [seen, setSeen] = useState<string[]>(loadSeen)
  const markSeen = (key: string) => {
    if (seen.includes(key)) return
    const next = [...seen, key]
    setSeen(next)
    try {
      localStorage.setItem(PILLS_SEEN_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }
  const { erntefest, erntefestVisible, erntefestGoalDone, erntefestGoalClaimed, state, eventMult, flash } = game
  const pills: Pill[] = []

  if (order) {
    pills.push({
      key: 'order',
      icon: <IconCrate />,
      label: order.claim ? t.event.claimGoal : `${Math.round(order.ratio * 100)} %`,
      aria: order.label,
      claim: order.claim,
      onClick: order.claim ? order.onClaim : undefined,
      detail: { line: order.detail, ratio: order.ratio, aria: order.label },
    })
  }

  if (game.turboMsLeft > 0) {
    pills.push({
      key: 'turbo',
      icon: <IconSprout />,
      label: `×3 · ${formatClock(game.turboMsLeft)}`,
      aria: t.turbo.pill(formatClock(game.turboMsLeft)),
      detail: { line: t.turbo.detail, ratio: 0, aria: t.turbo.detail },
    })
  }

  if (game.rainbowMsLeft > 0) {
    pills.push({
      key: 'rainbow',
      icon: <IconSun />,
      label: `×5 · ${formatClock(game.rainbowMsLeft)}`,
      aria: t.sky.rainbowActive(formatClock(game.rainbowMsLeft)),
    })
  }

  const { features } = game
  if (onOpenRecipe && features.has('recipe') && state.recipe.areas.length > 0 && !state.recipe.claimed) {
    const done = state.recipe.areas.filter((_, i) => (state.recipe.have[i] ?? 0) >= RECIPE_NEED).length
    pills.push({
      key: 'recipe',
      icon: <IconNotebook />,
      label: game.recipeReady ? t.recipe.cook : `${done}/3`,
      aria: game.recipeReady ? t.recipe.pillReady : t.recipe.pill(done),
      claim: game.recipeReady,
      onClick: onOpenRecipe,
    })
  }

  if (onOpenFest && features.has('fest')) {
    const fest = festAt(game.nowTick)
    const n = Math.floor(state.festTokens)
    pills.push({
      key: 'fest',
      icon: <IconFestToken fest={fest.id} />,
      label: String(n),
      aria: t.fest.pillAria(t.fest.names[fest.id]!, n, t.fest.tokens[fest.id]!),
      color: fest.color,
      onClick: onOpenFest,
    })
  }

  if (features.has('weather')) {
    const now = game.nowTick
    const today = weatherAt(now)
    const tomorrow = weatherTomorrow(now)
    pills.push({
      key: 'weather',
      icon: WEATHER_ICON[today],
      label: '',
      aria: t.weather.pill(t.weather[today].name, t.weather[today].effect),
      detail: {
        line: `${t.weather.pill(t.weather[today].name, t.weather[today].effect)} · ${t.weather.tomorrow(t.weather[tomorrow].name, t.weather[tomorrow].effect)}`,
        ratio: 0,
        aria: t.weather[today].name,
      },
    })
  }

  {
    const buff = state.wheelBuff
    if (buff && buff.prestige === state.saisonenden && (buff.kind === 'yield' || buff.kind === 'water')) {
      pills.push({
        key: 'wheel',
        icon: <IconWheel />,
        label: '',
        aria: t.wheel.activePill[buff.kind],
        detail: { line: t.wheel.activePill[buff.kind], ratio: 0, aria: t.wheel.activePill[buff.kind] },
      })
    }
  }

  if (erntefestVisible) {
    const claim = erntefestGoalDone && !erntefestGoalClaimed
    const prog = `${formatErnte(Math.min(state.erntefestErnte, erntefest.goal))} / ${formatErnte(erntefest.goal)}`
    pills.push({
      key: 'erntefest',
      icon: <IconFestival />,
      label: claim ? t.event.claimGoal : formatMult(eventMult),
      aria: `${erntefest.name} ${formatMult(eventMult)}`,
      claim,
      onClick: claim ? game.claimEventGoal : undefined,
      detail: erntefestGoalClaimed
        ? { line: `${erntefest.endsLabel} · ${t.event.claimed}`, ratio: 1, aria: t.event.goalAria }
        : {
            line: `${erntefest.endsLabel} · ${t.event.goalLine(prog, erntefest.goalReward)}`,
            ratio: Math.min(1, state.erntefestErnte / erntefest.goal),
            aria: t.event.goalAria,
          },
    })
  }

  if (flash.visible) {
    const prog = `${formatErnte(Math.min(flash.progress, flash.goal))} / ${formatErnte(flash.goal)}`
    pills.push({
      key: 'flash',
      icon: <IconSun />,
      label: flash.claimable ? t.flash.claimGoal : `${formatMult(flash.mult)} · ${formatClock(flash.msLeft)}`,
      aria: flash.name,
      claim: flash.claimable,
      onClick: flash.claimable ? game.claimFlashGoal : undefined,
      detail: {
        line: `${flash.name} · ${t.flash.goalLine(prog, FLASH_GOAL_REWARD_SAMEN)}`,
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
      label: `${formatMult(game.vereinMult)} · ${formatClock(game.clanBoostMsLeft)}`,
      detail: { line: t.clanBoost.name, ratio: 0, aria: t.clanBoost.name },
    })
  }

  if (state.challenge) {
    const name = t.challenges.names[state.challenge]
    pills.push({
      key: 'challenge',
      icon: <IconSprout />,
      label: name,
      aria: `${t.challenges.active(name)}: ${t.challenges.rules[state.challenge]}`,
      detail: { line: `${t.challenges.active(name)} · ${t.challenges.rules[state.challenge]}`, ratio: 0, aria: t.challenges.rules[state.challenge] },
    })
  }

  if (state.seasonCard) {
    const card = t.seasonCards.cards[state.seasonCard]
    pills.push({
      key: 'card',
      icon: <IconSprout />,
      label: card.name,
      aria: `${card.name}: ${card.effect}`,
      detail: { line: `${card.name} · ${card.effect}`, ratio: 0, aria: card.effect },
    })
  }

  if (season) {
    pills.push({
      key: 'season',
      icon: <IconSnow />,
      label: season.short ?? season.label,
      aria: season.label,
      onClick: season.onOpen,
    })
  }

  if (pills.length === 0) return null
  const expanded = pills.find((p) => p.key === open && p.detail)
  // Claimable first; at most MAX_VISIBLE, the rest behind „+N“
  const rank = (p: Pill) => (p.claim ? -1 : PRIORITY.indexOf(p.key))
  const ordered = [...pills].sort((a, b) => rank(a) - rank(b))
  const hidden = showAll ? 0 : Math.max(0, ordered.length - MAX_VISIBLE)
  const visible = hidden > 0 ? ordered.slice(0, MAX_VISIBLE - 1) : ordered
  const hiddenCount = ordered.length - visible.length

  return (
    <div className="hud-pills-wrap">
      <ul className="hud-pills">
        {visible.map((p) => {
          const name = t.ux.pills.names[p.key]
          const showName = Boolean(name) && !seen.includes(p.key)
          return (
          <li key={p.key} className="hud-pill-item">
          <button
            type="button"
            className={`hud-pill pill-${p.key}${p.claim ? ' claim' : ''}${open === p.key ? ' open' : ''}`}
            onClick={() => {
              markSeen(p.key)
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
            {showName ? <span className="hud-pill-name">{name}</span> : null}
            {p.label ? <span className="hud-pill-label">{p.label}</span> : null}
          </button>
          </li>
          )
        })}
        {hiddenCount > 0 || showAll ? (
          <li className="hud-pill-item">
            <button
              type="button"
              className="hud-pill pill-more"
              aria-expanded={showAll}
              aria-label={showAll ? t.ux.pills.less : t.ux.pills.moreAria(hiddenCount)}
              onClick={() => setShowAll((v) => !v)}
            >
              <span className="hud-pill-label">{showAll ? '−' : t.ux.pills.more(hiddenCount)}</span>
            </button>
          </li>
        ) : null}
      </ul>
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
