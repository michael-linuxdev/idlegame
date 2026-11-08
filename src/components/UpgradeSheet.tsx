import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
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

type BulkMode = 1 | 10 | 'max'
const BULK_KEY = 'gartenerbe-bulk-mode'

function loadBulk(): BulkMode {
  try {
    const v = localStorage.getItem(BULK_KEY)
    return v === '10' ? 10 : v === 'max' ? 'max' : 1
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
  const [bulk, setBulk] = useState<BulkMode>(loadBulk)
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
  const flavor =
    def.blurb.length > 96 ? `${def.blurb.slice(0, 93).trimEnd()}…` : def.blurb

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
        className={`upgrade-hud${flash ? ' upgrade-flash' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="upgrade-hud-header">
          <div className="upgrade-hud-heading">
            <p className="upgrade-hud-eyebrow">{t.upgrade.moduleEyebrow}</p>
            <h2 id="upgrade-title">{def.name}</h2>
            <p className="upgrade-hud-blurb" title={def.blurb}>
              {flavor}
            </p>
          </div>
          <button
            type="button"
            className="upgrade-hud-close"
            onClick={onClose}
            aria-label={t.upgrade.close}
          >
            ×
          </button>
        </header>

        <figure className="oma-note">
          <figcaption className="oma-note-label">{t.upgrade.noteLabel}</figcaption>
          <blockquote className="oma-note-text">{def.note}</blockquote>
        </figure>

        {unlocked ? (
          <>
            <p className="upgrade-hud-stats">
              {t.upgrade.level} {owned}
              {stars > 0 ? (
                <span className="milestone-stars" aria-label={t.milestones.starsAria(stars)}>
                  {' '}
                  {'★'.repeat(Math.min(stars, 5))}
                  {stars > 5 ? `+${stars - 5}` : ''}
                </span>
              ) : null}
              {' · '}
              {formatRate(lineRate)}
              {' → '}
              {formatRate(nextRate)}
            </p>
            <div className="milestone-line">
              <span>{milestone ? t.milestones.next(milestone.at) : t.milestones.all}</span>
              {milestone ? (
                <span className="milestone-track" aria-hidden="true">
                  <span
                    style={{
                      width: `${Math.round(((owned - milestone.from) / (milestone.at - milestone.from)) * 100)}%`,
                    }}
                  />
                </span>
              ) : null}
            </div>
            <div className="bulk-toggle" role="radiogroup" aria-label={t.bulk.groupAria}>
              {([1, 10, 'max'] as BulkMode[]).map((mode) => (
                <button
                  key={String(mode)}
                  type="button"
                  role="radio"
                  aria-checked={bulk === mode}
                  className={`bulk-chip${bulk === mode ? ' on' : ''}`}
                  onClick={() => pickBulk(mode)}
                >
                  {mode === 1 ? t.bulk.one : mode === 10 ? t.bulk.ten : t.bulk.max}
                </button>
              ))}
              <button
                type="button"
                className="bulk-chip bulk-all"
                onClick={buyAll}
                aria-label={t.bulk.allAria}
              >
                {allNote ?? t.bulk.allButton}
              </button>
            </div>
            <div className="upgrade-afford-track upgrade-hud-track" aria-hidden="true">
              <span
                className={`upgrade-afford-fill${affordable ? ' ready' : ''}`}
                style={{ width: `${Math.round(affordRatio * 100)}%` }}
              />
            </div>
            <div className="upgrade-hud-cta">
              <button
                type="button"
                className={`btn buy upgrade-hud-buy${affordable ? ' pulse-ready' : ''}${flash ? ' just-bought' : ''}`}
                disabled={!affordable}
                onPointerDown={onBuyPointerDown}
                onPointerUp={onBuyPointerUp}
                onPointerLeave={onBuyPointerUp}
                onPointerCancel={onBuyPointerUp}
                onContextMenu={(e) => e.preventDefault()}
              >
                {bulk === 1
                  ? t.upgrade.costLine(actionLabel, formatAsh(safeCost || cost))
                  : t.bulk.buyN(actionLabel, bulkCount, formatAsh(safeCost || cost))}
              </button>
              <p className="upgrade-hold-hint">
                {affordable
                  ? bulk === 1
                    ? t.upgrade.holdHint
                    : ''
                  : needMore > 0
                    ? t.upgrade.needMore(formatAsh(needMore))
                    : t.upgrade.holdHint}
              </p>
            </div>

            {owned >= 1 ? (
              <div className="upgrade-hud-modules">
                <h3 className="upgrade-hud-modules-title">{t.branches.title}</h3>
                <BranchRow
                  kind="efficiency"
                  rank={branch.efficiency}
                  max={game.branchMaxRank}
                  cost={game.branchCostOf(def.id, 'efficiency')}
                  ernte={game.state.ernte}
                  onBuy={() => buyBranch('efficiency')}
                />
                <BranchRow
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
          <div className="upgrade-hud-locked">
            <p className="upgrade-hud-stats sheet-locked-hint">{unlockHint(def, gatePrestiges(game.state))}</p>
            <div className="upgrade-hud-cta">
              <button type="button" className="btn buy upgrade-hud-buy" disabled>
                {t.upgrade.locked}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BranchRow({
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
  const perRank =
    kind === 'efficiency'
      ? t.branches.efficiencyPerRank
      : t.branches.capacityPerRank
  const total =
    kind === 'efficiency'
      ? t.branches.efficiencyEffect(rank * 4)
      : t.branches.capacityEffect(formatDecimal(Math.pow(0.97, rank), 3))

  return (
    <div className="upgrade-hud-row">
      <p className="upgrade-hud-row-meta">
        <strong className="branch-name">{name}</strong>
        <span className="branch-rank">
          {rank}/{max}
        </span>
        <span className="branch-sep" aria-hidden="true">
          ·
        </span>
        <span className="branch-per">{perRank}</span>
        <span className="branch-sep" aria-hidden="true">
          ·
        </span>
        <span className="branch-effect">{total}</span>
      </p>
      {maxed ? (
        <span className="quest-badge">{t.branches.maxed}</span>
      ) : (
        <button
          type="button"
          className="btn ghost upgrade-hud-row-buy"
          disabled={ernte < cost}
          onClick={onBuy}
          title={t.upgrade.costLine(name, formatAsh(cost))}
        >
          {t.upgrade.costLine(name, formatAsh(cost))}
        </button>
      )}
    </div>
  )
}
