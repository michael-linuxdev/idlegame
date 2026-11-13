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
  IconLetter,
  IconFlag,
  IconSnow,
  IconSun,
  IconFestToken,
  IconSprout,
} from '../../theme/icons'
import { festAt } from '../../game/fests'
import { selectPills } from '../../game/hudPills'
import { cardEffectText } from '../cardEffect'

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
  /** Restzeit (ms): was abläuft, hat Vorrang (game/hudPills.ts) */
  msLeft?: number
}

interface Props {
  game: GameApi
  /** Saisonende-Hinweis (not yet the main goal) */
  season?: { label: string; short?: string; onOpen: () => void } | null
  /** Hofladen-Bestellung */
  order?: { label: string; detail: string; ratio: number; claim: boolean; onClaim: () => void; msLeft?: number } | null
  /** Open the Festladen */
  onOpenFest?: () => void
  /** Ungelesener Brief von Oma: öffnet das Notizbuch (der Umschlag an der Laube liegt oft unter dem HUD) */
  onOpenLetter?: (() => void) | null
  /** Tiefer Winter ist möglich: springt im Saison-Tab dorthin (sonst steht es nur ganz unten im Tab) */
  onOpenDeep?: (() => void) | null
}

const WEATHER_ICON = {
  sonne: <IconSun />,
  regen: <IconRain />,
  wind: <IconWind />,
  mild: <IconCloud />,
} as const

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
export function EventPills({ game, season, order, onOpenFest, onOpenLetter, onOpenDeep }: Props) {
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

  if (onOpenLetter) {
    pills.push({
      key: 'letter',
      icon: <IconLetter />,
      label: t.notebook.newLetter,
      aria: t.notebook.newLetterAria,
      claim: true,
      onClick: onOpenLetter,
    })
  }

  if (onOpenDeep) {
    pills.push({
      key: 'deep',
      icon: <IconSnow />,
      label: t.longLoop.pillReady,
      aria: t.longLoop.pillReadyAria,
      // wie etwas Abholbares einsortieren, sonst rutscht es an vollen Tagen hinter „+N“
      claim: true,
      onClick: onOpenDeep,
    })
  }

  if (order) {
    pills.push({
      key: 'order',
      icon: <IconCrate />,
      label: order.claim ? t.event.claimGoal : `${Math.round(order.ratio * 100)} %`,
      aria: order.label,
      claim: order.claim,
      onClick: order.claim ? order.onClaim : undefined,
      detail: { line: order.detail, ratio: order.ratio, aria: order.label },
      msLeft: order.msLeft,
    })
  }

  if (game.turboMsLeft > 0) {
    pills.push({
      key: 'turbo',
      icon: <IconSprout />,
      label: `×3 · ${formatClock(game.turboMsLeft)}`,
      aria: t.turbo.pill(formatClock(game.turboMsLeft)),
      detail: { line: t.turbo.detail, ratio: 0, aria: t.turbo.detail },
      msLeft: game.turboMsLeft,
    })
  }

  if (game.rainbowMsLeft > 0) {
    pills.push({
      key: 'rainbow',
      icon: <IconSun />,
      label: `×5 · ${formatClock(game.rainbowMsLeft)}`,
      aria: t.sky.rainbowActive(formatClock(game.rainbowMsLeft)),
      msLeft: game.rainbowMsLeft,
    })
  }

  // Omas Tagesrezept steht jetzt auf der „Heute“-Karte (TodaySheet), nicht mehr als Pille
  const { features } = game
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
      msLeft: flash.msLeft,
    })
  }

  if (game.yieldBoostActive) {
    pills.push({
      key: 'boost',
      icon: <IconFertilizer />,
      label: `${formatMult(game.yieldBoostMult)} · ${formatClock(game.yieldBoostMsLeft)}`,
      detail: { line: t.shop.yieldBoostTitle, ratio: 0, aria: t.shop.yieldBoostTitle },
      msLeft: game.yieldBoostMsLeft,
    })
  }

  if (game.clanBoostActive) {
    pills.push({
      key: 'clan',
      icon: <IconFlag />,
      label: `${formatMult(game.vereinMult)} · ${formatClock(game.clanBoostMsLeft)}`,
      detail: { line: t.clanBoost.name, ratio: 0, aria: t.clanBoost.name },
      msLeft: game.clanBoostMsLeft,
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
    const effect = cardEffectText(state.seasonCard, state.seasonCardAusbau)
    pills.push({
      key: 'card',
      icon: <IconSprout />,
      label: card.name,
      aria: `${card.name}: ${effect}`,
      detail: { line: `${card.name} · ${effect}`, ratio: 0, aria: effect },
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
  // Höchstens drei: was abläuft zuerst, der Rest hinter „+N“ nur als Liste
  const { visible, hidden } = selectPills(pills)
  const hiddenCount = hidden.length

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
            aria-describedby={`pill-desc-${p.key}`}
            style={p.color ? { ['--pill-accent' as string]: p.color } : undefined}
          >
            <span className="hud-pill-icon">{p.icon}</span>
            {/* Name = sichtbarer Text (WCAG „label in name“), Langfassung als Beschreibung */}
            {showName ? <span className="hud-pill-name">{name}</span> : <span className="sr-only">{name} </span>}
            {p.label ? <span className="hud-pill-label">{p.label}</span> : null}
            <span className="sr-only" id={`pill-desc-${p.key}`}>
              {p.aria}
            </span>
          </button>
          </li>
          )
        })}
        {hiddenCount > 0 ? (
          <li className="hud-pill-item">
            <button
              type="button"
              className="hud-pill pill-more"
              aria-expanded={showAll}
              onClick={() => setShowAll((v) => !v)}
            >
              <span className="hud-pill-label" aria-hidden="true">
                {t.ux.pills.more(hiddenCount)}
              </span>
              <span className="sr-only">{showAll ? t.ux.pills.less : t.ux.pills.moreAria(hiddenCount)}</span>
            </button>
          </li>
        ) : null}
      </ul>
      {showAll && hiddenCount > 0 ? (
        <div className="hud-pill-detail hud-pill-rest" role="status">
          <ul>
            {hidden.map((p) => (
              <li key={p.key}>
                {p.onClick ? (
                  // Was sich öffnen lässt (Festladen …), bleibt auch hinter „+N“ erreichbar
                  <button
                    type="button"
                    className={`hud-rest-open pill-${p.key}`}
                    onClick={() => {
                      markSeen(p.key)
                      setShowAll(false)
                      p.onClick?.()
                    }}
                  >
                    <span className="hud-pill-icon" aria-hidden="true">{p.icon}</span>
                    <span>{p.aria ?? t.ux.pills.names[p.key] ?? p.label}</span>
                  </button>
                ) : (
                  <>
                    <span className="hud-pill-icon" aria-hidden="true">{p.icon}</span>
                    <span>{p.detail?.line ?? p.aria ?? t.ux.pills.names[p.key] ?? p.label}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : expanded?.detail ? (
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
