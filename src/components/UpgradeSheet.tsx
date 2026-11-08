import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { ModuleArt } from '../theme/ModuleArt'
import { useHints, type HintId } from '../game/hints'
import { ClearedPlot, WildPlot } from '../theme/PlotArt'
import { IconBasket, IconFertilizer, IconSprout } from '../theme/icons'
import {
  GENERATORS,
  generatorRate,
  milestonesReached,
  nextMilestone,
  unlockHint,
  type GeneratorId,
} from '../game/generators'
import { efficiencyMult, type BranchKind } from '../game/branches'
import { formatAsh, formatDecimal, formatRate } from '../game/format'
import { playSfx } from '../game/sound'
import { gatePrestiges } from '../game/state'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  selectedId: GeneratorId
  onClose: () => void
  onUpgraded?: (cost: number) => void
}

const HOLD_START_MS = 380
const HOLD_REPEAT_MS = 110

type BulkMode = 1 | 5 | 'max'
const BULK_KEY = 'gartenerbe-bulk-mode'

function loadBulk(): BulkMode {
  try {
    const v = localStorage.getItem(BULK_KEY)
    return v === '5' ? 5 : v === 'max' ? 'max' : 1
  } catch {
    return 1
  }
}

function saveBulk(mode: BulkMode) {
  try {
    localStorage.setItem(BULK_KEY, String(mode))
  } catch {
    /* private mode */
  }
}

export function UpgradeSheet({ game, selectedId, onClose, onUpgraded }: Props) {
  const def = GENERATORS.find((g) => g.id === selectedId)
  const [flash, setFlash] = useState(false)
  const holdTimer = useRef<number | null>(null)
  const holdRepeat = useRef<number | null>(null)
  const holding = useRef(false)
  const [bulkPref, setBulk] = useState<BulkMode>(loadBulk)
  const unlocks = game.bulkUnlocks
  const modes: BulkMode[] = [1, ...(unlocks.five ? [5 as const] : []), ...(unlocks.max ? ['max' as const] : [])]
  const bulk: BulkMode = modes.includes(bulkPref) ? bulkPref : 1
  const { seen: seenHints, markSeen } = useHints()
  const newHint: HintId | null = !unlocks.max
    ? null
    : !seenHints.includes('bulkMax')
      ? 'bulkMax'
      : unlocks.five && !seenHints.includes('bulk5')
        ? 'bulk5'
        : unlocks.all && !seenHints.includes('buyAll')
          ? 'buyAll'
          : null
  const [allNote, setAllNote] = useState<string | null>(null)

  function clearHold() {
    holding.current = false
    if (holdTimer.current != null) {
      window.clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
    if (holdRepeat.current != null) {
      window.clearInterval(holdRepeat.current)
      holdRepeat.current = null
    }
  }

  useEffect(() => {
    return () => {
      holding.current = false
      if (holdTimer.current != null) window.clearTimeout(holdTimer.current)
      if (holdRepeat.current != null) window.clearInterval(holdRepeat.current)
    }
  }, [selectedId])

  if (!def) return null

  const owned = game.state.owned[def.id] ?? 0
  const unlocked = game.unlocked(def.id)
  const maxInfo = game.affordableLevels(def.id)
  const bulkCount = bulk === 'max' ? Math.max(1, maxInfo.count) : bulk
  const cost =
    bulk === 1
      ? game.costOf(def.id)
      : bulk === 'max'
        ? maxInfo.count > 0
          ? maxInfo.cost
          : game.costOf(def.id)
        : game.costForLevels(def.id, bulk)
  const affordable =
    unlocked &&
    Number.isFinite(cost) &&
    cost > 0 &&
    Number.isFinite(game.state.ernte) &&
    game.state.ernte >= cost
  const milestone = nextMilestone(owned)
  const stars = milestonesReached(owned)
  const branch = game.state.branches[def.id] ?? { efficiency: 0, capacity: 0 }
  const lineMult =
    game.multiplier *
    game.levelMult *
    game.clanMult *
    game.eventMult *
    game.expansionMult *
    game.turboMult
  const eff = efficiencyMult(branch.efficiency)
  const lineRate = generatorRate(def, owned) * lineMult * eff
  const nextRate = generatorRate(def, owned + bulkCount) * lineMult * eff
  const safeCost = Number.isFinite(cost) && cost > 0 ? cost : 0
  const safeAsh = Number.isFinite(game.state.ernte) ? Math.max(0, game.state.ernte) : 0
  const affordRatio =
    safeCost > 0 ? Math.min(1, safeAsh / safeCost) : unlocked ? 1 : 0
  const actionLabel = owned === 0 ? t.upgrade.online : t.upgrade.upgrade
  const needMore = Math.max(0, safeCost - safeAsh)

  function buyBranch(kind: BranchKind) {
    game.buyModuleBranch(selectedId, kind)
    playSfx('upgrade')
  }

  function buyUpgradeOnce() {
    // buyGenerator no-ops when unaffordable — safe under hold spam.
    const paid = game.costOf(def!.id)
    game.buy(def!.id)
    setFlash(true)
    window.setTimeout(() => setFlash(false), 220)
    onUpgraded?.(paid)
  }

  function buyBulk() {
    const paid = cost
    const n = game.buyMany(def!.id, bulk === 'max' ? Infinity : bulk)
    if (n <= 0) return
    setFlash(true)
    window.setTimeout(() => setFlash(false), 220)
    onUpgraded?.(paid)
  }

  function buyAll() {
    const n = game.buyAll()
    setAllNote(n > 0 ? t.bulk.allDone(n) : t.bulk.allNone)
    if (n > 0) {
      playSfx('upgrade')
      setFlash(true)
      window.setTimeout(() => setFlash(false), 220)
    }
    window.setTimeout(() => setAllNote(null), 1600)
  }

  function pickBulk(mode: BulkMode) {
    setBulk(mode)
    saveBulk(mode)
  }

  function onBuyPointerDown(e: ReactPointerEvent) {
    if (e.button !== 0) return
    e.preventDefault()
    if (!affordable) return
    if (bulk !== 1) {
      buyBulk()
      return
    }
    buyUpgradeOnce()
    holding.current = true
    holdTimer.current = window.setTimeout(() => {
      if (!holding.current) return
      holdRepeat.current = window.setInterval(() => {
        if (!holding.current) {
          clearHold()
          return
        }
        buyUpgradeOnce()
      }, HOLD_REPEAT_MS)
    }, HOLD_START_MS)
  }

  function onBuyPointerUp() {
    clearHold()
  }

  return (
    <div className="upgrade-hud-layer" role="presentation" onClick={onClose}>
      <div
        className={`upgrade-hud gc-card${flash ? ' upgrade-flash' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="gc-top">
          <div className={`gc-portrait${!unlocked ? ' locked' : ''}`} aria-hidden="true">
            <span className="gc-portrait-art">
              {!unlocked ? <WildPlot variant={0} /> : owned === 0 ? <ClearedPlot /> : <ModuleArt id={def.id} level={owned} producing selected={false} />}
            </span>
            {unlocked && owned > 0 ? <span className="gc-level">{owned}</span> : null}
          </div>
          <div className="gc-info">
            <h2 id="upgrade-title" className="gc-name">
              {def.name}
            </h2>
            {unlocked ? (
              <>
                <div className="gc-stars" aria-label={t.milestones.starsAria(stars)}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < stars ? 'on' : undefined}>
                      ★
                    </span>
                  ))}
                  {stars > 5 ? <em>+{stars - 5}</em> : null}
                </div>
                <p className="gc-rate">
                  <IconBasket /> {formatRate(lineRate)}
                  <span className="upgrade-gain"> +{formatRate(Math.max(0, nextRate - lineRate))}</span>
                </p>
              </>
            ) : (
              <p className="gc-locked-hint">{unlockHint(def, gatePrestiges(game.state))}</p>
            )}
          </div>
          <button type="button" className="upgrade-hud-close" onClick={onClose} aria-label={t.upgrade.close}>
            ×
          </button>
        </div>

        {owned === 0 && unlocked ? (
          <figure className="oma-note">
            <figcaption className="oma-note-label">{t.upgrade.noteLabel}</figcaption>
            <blockquote className="oma-note-text">{def.note}</blockquote>
          </figure>
        ) : null}

        {unlocked ? (
          <>
            {milestone ? (
              <div className="gc-milestone" title={t.milestones.next(milestone.at)}>
                <span
                  className="gc-milestone-fill"
                  style={{ width: `${Math.round(((owned - milestone.from) / (milestone.at - milestone.from)) * 100)}%` }}
                />
                <span className="gc-milestone-label">{t.milestones.short(milestone.at)}</span>
                <span className="gc-milestone-star" aria-hidden="true">
                  ★
                </span>
              </div>
            ) : null}

            {modes.length > 1 || unlocks.all ? (
            <div className="gc-controls">
              <div className="gc-segment" role="radiogroup" aria-label={t.bulk.groupAria}>
                {modes.map((mode) => (
                  <button
                    key={String(mode)}
                    type="button"
                    role="radio"
                    aria-checked={bulk === mode}
                    className={bulk === mode ? 'on' : undefined}
                    onClick={() => pickBulk(mode)}
                  >
                    {mode === 1 ? t.bulk.one : mode === 5 ? t.bulk.five : t.bulk.max}
                  </button>
                ))}
              </div>
              {unlocks.all ? (
                <button type="button" className="gc-all" onClick={buyAll} aria-label={t.bulk.allAria}>
                  {allNote ?? t.bulk.allButton}
                </button>
              ) : null}
            </div>
            ) : null}
            {newHint && owned >= 1 ? (
              <aside className="gc-tip" role="status">
                <p>
                  <strong>{t.hints.label}:</strong> {t.hints[newHint]}
                </p>
                <button type="button" className="gc-tip-ok" onClick={() => markSeen(newHint)}>
                  {t.hints.ok}
                </button>
              </aside>
            ) : null}

            <button
              type="button"
              className={`btn buy upgrade-hud-buy gc-buy${affordable ? ' pulse-ready' : ''}${flash ? ' just-bought' : ''}`}
              disabled={!affordable}
              onPointerDown={onBuyPointerDown}
              onPointerUp={onBuyPointerUp}
              onPointerLeave={onBuyPointerUp}
              onPointerCancel={onBuyPointerUp}
              onContextMenu={(e) => e.preventDefault()}
              aria-label={
                bulk === 1
                  ? t.upgrade.costLine(actionLabel, formatAsh(safeCost || cost))
                  : t.bulk.buyN(actionLabel, bulkCount, formatAsh(safeCost || cost))
              }
            >
              <span className="gc-buy-fill" style={{ width: `${Math.round(affordRatio * 100)}%` }} aria-hidden="true" />
              <span className="gc-buy-label">
                {actionLabel}
                {bulk !== 1 ? ` ×${bulkCount}` : ''}
              </span>
              <span className="gc-buy-cost">
                <IconBasket /> {formatAsh(safeCost || cost)}
              </span>
            </button>
            <p className="upgrade-hold-hint">
              {affordable ? (bulk === 1 ? t.upgrade.holdHint : '') : needMore > 0 ? t.upgrade.needMore(formatAsh(needMore)) : ''}
            </p>

            {owned >= 1 ? (
              <div className="gc-care" aria-label={t.branches.title}>
                <CareTile
                  kind="efficiency"
                  rank={branch.efficiency}
                  max={game.branchMaxRank}
                  cost={game.branchCostOf(def.id, 'efficiency')}
                  ernte={game.state.ernte}
                  onBuy={() => buyBranch('efficiency')}
                />
                <CareTile
                  kind="capacity"
                  rank={branch.capacity}
                  max={game.branchMaxRank}
                  cost={game.branchCostOf(def.id, 'capacity')}
                  ernte={game.state.ernte}
                  onBuy={() => buyBranch('capacity')}
                />
              </div>
            ) : null}
          </>
        ) : (
          <button type="button" className="btn buy upgrade-hud-buy gc-buy" disabled>
            <span className="gc-buy-label">{t.upgrade.locked}</span>
          </button>
        )}
      </div>
    </div>
  )
}

/** Pflege-Kachel: icon, rank pips, effect, cost. Always visible. */
function CareTile({
  kind,
  rank,
  max,
  cost,
  ernte,
  onBuy,
}: {
  kind: BranchKind
  rank: number
  max: number
  cost: number
  ernte: number
  onBuy: () => void
}) {
  const maxed = rank >= max
  const name = kind === 'efficiency' ? t.branches.efficiency : t.branches.capacity
  const perRank = kind === 'efficiency' ? t.branches.efficiencyPerRank : t.branches.capacityPerRank
  const total =
    kind === 'efficiency'
      ? t.branches.efficiencyEffect(rank * 4)
      : t.branches.capacityEffect(formatDecimal(Math.pow(0.97, rank), 3))
  return (
    <div className={`gc-care-tile ${kind}`} title={total}>
      <div className="gc-care-head">
        <span className="gc-care-icon" aria-hidden="true">
          {kind === 'efficiency' ? <IconFertilizer /> : <IconSprout />}
        </span>
        <span className="gc-care-name">{name}</span>
      </div>
      <div className="gc-pips" aria-label={`${rank}/${max}`}>
        {Array.from({ length: max }, (_, i) => (
          <span key={i} className={i < rank ? 'on' : undefined} />
        ))}
      </div>
      <p className="gc-care-effect">{perRank}</p>
      {maxed ? (
        <span className="gc-care-max">{t.branches.maxed}</span>
      ) : (
        <button
          type="button"
          className="gc-care-buy"
          disabled={ernte < cost}
          onClick={onBuy}
          aria-label={t.upgrade.costLine(name, formatAsh(cost))}
        >
          <IconBasket /> {formatAsh(cost)}
        </button>
      )}
    </div>
  )
}
