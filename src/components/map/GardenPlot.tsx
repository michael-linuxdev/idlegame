/** Ein Bereich (Beet) auf der Gartenkarte: Grafik, Schild, Abzeichen. Teil von GardenMap. */
import { gatePrestiges } from '../../game/state'
import {
  GENERATORS,
  generatorRate,
  milestonesReached,
  nextMilestone,
  seasonsMissing,
  shortUnlockGate,
  unlockHint,
} from '../../game/generators'
import { formatRate } from '../../game/format'
import type { BestBuyHint } from '../../game/bestBuy'
import type { useGame } from '../../game/useGame'
import { t } from '../../i18n'
import { ModuleArt } from '../../theme/ModuleArt'
import { ClearedPlot, WildPlot } from '../../theme/PlotArt'
import { TIER_LEVELS, moduleTier } from '../../theme/tiers'
import type { Season } from '../../theme/ambient'
import { IconStar, IconStars } from '../../theme/icons'
import { PlotFx } from '../PlotFx'

type GameApi = ReturnType<typeof useGame>

interface Props {
  def: (typeof GENERATORS)[number]
  game: GameApi
  selectedHere: boolean
  animated: boolean
  totalMult: number
  /** FTUE target */
  hl: boolean
  /** Next corner to clear — always gets a sign */
  nextWild: boolean
  signsAll: boolean
  bestBuy: BestBuyHint | null
  growing: boolean
  season: Season
  onSelect: () => void
  onTier: (tier: number) => void
}

export function GardenPlot({ def, game, selectedHere, animated, totalMult, hl, nextWild, signsAll, bestBuy, growing, season, onSelect, onTier }: Props) {
  const { state } = game
  const level = state.owned[def.id] ?? 0
  const unlocked = game.unlocked(def.id)
  const buildingRate =
    unlocked && level > 0 ? generatorRate(def, level) * totalMult : 0
  const producing = buildingRate > 0
  const hint = !unlocked ? unlockHint(def, gatePrestiges(state)) : ''
  const ready = unlocked && level === 0
  // Calm map: full signs only for the selected, new or next corner
  const showSign = selectedHere || ready || nextWild || (signsAll && unlocked)
  const stars = milestonesReached(level)
  const canBuy = unlocked && game.costOf(def.id) <= state.ernte
  const isBestBuy = canBuy && level > 0 && bestBuy?.id === def.id && bestBuy.affordable
  const nextStar = level > 0 ? nextMilestone(level) : null
  const toStar = nextStar && nextStar.at - level <= 10 ? nextStar.at - level : 0
  const cls =
    'garden-plot' +
    (selectedHere ? ' selected' : '') +
    (animated ? ' anim' : '') +
    (!unlocked ? ' wild' : ready ? ' ready' : ' planted') +
    (producing ? ' producing' : '') +
    (canBuy ? ' can-buy' : '') +
    (isBestBuy ? ' best-buy' : '') +
    (hl ? ' ftue-target' : '')
  return (
    <button
      type="button"
      className={cls}
      style={{
        left: def.slot.left,
        top: def.slot.top,
        zIndex: 2 + Math.round(Number.parseFloat(def.slot.top)),
      }}
      aria-describedby={`plot-desc-${def.id}`}
      aria-pressed={selectedHere}
      onClick={onSelect}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Name = sichtbarer Text (Schild/Plakette, WCAG „label in name“); Langfassung als Beschreibung */}
      <span className="sr-only" id={`plot-desc-${def.id}`}>
        {unlocked ? t.hud.buildingAriaUnlocked(def.name, level, formatRate(buildingRate)) : t.hud.buildingAriaLocked(def.name, hint)}
        {toStar > 0 && nextStar ? ` ${t.milestone.toStarAria(toStar, nextStar.at)}` : null}
      </span>
      {!showSign && (!unlocked || level === 0) ? <span className="sr-only">{def.name}</span> : null}
      <span className={`plot-visual${growing ? ' tier-grow' : ''}`}>
        {!unlocked ? (
          <WildPlot id={def.id} season={season} />
        ) : ready ? (
          <ClearedPlot season={season} />
        ) : (
          <ModuleArt
            id={def.id}
            level={level}
            producing={producing}
            selected={selectedHere}
            season={season}
          />
        )}
      </span>
      <PlotFx
        unlocked={unlocked}
        planted={level > 0}
        tier={moduleTier(level)}
        onTier={onTier}
      />
      {!showSign && unlocked && level > 0 ? (
        <span className="plot-badge">
          {canBuy ? <span className="plot-canbuy in-badge" title={t.ux.signs.canBuy} /> : null}
          <span className="plot-badge-name">{def.name}</span>
          <span className="plot-badge-level">
            {level}
            {stars > 0 ? <span className="plot-badge-stars"><IconStars n={Math.min(3, stars)} /></span> : null}
          </span>
        </span>
      ) : null}
      {canBuy && showSign ? <span className="plot-canbuy" title={t.ux.signs.canBuy} aria-hidden="true" /> : null}
      {showSign ? (
        <span className="plot-sign">
          <span className="plot-name">{def.name}</span>
          <span className="plot-meta">
            {!unlocked ? (
              seasonsMissing(def, gatePrestiges(state)) > 0 ? (
                shortUnlockGate(def, gatePrestiges(state))
              ) : (
                <>
                  {t.hud.locked} · {shortUnlockGate(def, gatePrestiges(state))}
                  {(() => {
                    const r = unlockRatio(def, state)
                    return r != null && r > 0 ? (
                      <span className="plot-wild-progress" aria-hidden="true">
                        <span style={{ width: `${Math.floor(r * 100)}%` }} />
                      </span>
                    ) : null
                  })()}
                </>
              )
            ) : ready ? (
              t.upgrade.online
            ) : (
              <>
                {t.hud.levelShort(level)}
                {milestonesReached(level) > 0 ? (
                  <span className="plot-stars" aria-hidden="true">
                    {' '}
                    <IconStars n={Math.min(3, milestonesReached(level))} />
                  </span>
                ) : null}
                {producing && selectedHere ? (
                  <> · {formatRate(buildingRate)}</>
                ) : null}
                <TierBar level={level} />
                {toStar > 0 && nextStar ? (
                  <span className="plot-to-star">
                    <span
                      className="plot-to-star-ring"
                      style={{ ['--p' as string]: `${Math.round(((level - nextStar.from) / (nextStar.at - nextStar.from)) * 100)}%` }}
                      aria-hidden="true"
                    />
                    {t.milestone.toStar(toStar)} <IconStar />
                  </span>
                ) : null}
              </>
            )}
          </span>
        </span>
      ) : null}
    </button>
  )
}

/** Thin progress bar on the plant sign toward the next growth tier. */
function TierBar({ level }: { level: number }) {
  const tier = moduleTier(level)
  if (tier >= TIER_LEVELS.length) return null
  const from = tier === 0 ? 0 : TIER_LEVELS[tier - 1]!
  const to = TIER_LEVELS[tier]!
  const pct = Math.round(((level - from) / (to - from)) * 100)
  return (
  <span className="plot-tierbar" aria-hidden="true">
    <span style={{ width: `${pct}%` }} />
  </span>
  )
}

/** How close a wild corner is to being cleared (0…1), or null for season gates. */
function unlockRatio(def: (typeof GENERATORS)[number], state: GameApi['state']): number | null {
  const u = def.unlock
  if (!u) return null
  if (u.ernteSeason != null) return Math.min(1, state.ernteSeason / u.ernteSeason)
  if (u.requires) return Math.min(1, (state.owned[u.requires.id] ?? 0) / u.requires.level)
  return null
}
