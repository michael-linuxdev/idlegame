import { useState } from 'react'
import { DEEP_GATE_YEAR, DEEP_SHOP, canDeepReset } from '../game/longLoop'
import { LEGACY_SHOP, generationGate } from '../game/generations'
import { HELPER_RANKS, helperInterval, helperIsPro } from '../game/state'
import { GENERATORS } from '../game/generators'
import { IconFamily, IconHelper, IconIlse } from '../theme/icons'
import { CHAPTERS, type ChapterId } from '../game/chapters'
import { ILSE_RANKS } from '../game/extrasCore'
import { chapterCopy } from './chapterCopy'
import {
  EMBER_SHOP,
  PRESTIGE_BRANCHES,
  PRESTIGE_MIN_MODULES_ONLINE,
  countAffordableEmberBuys,
  countAffordableEmberBuysAfterPrestige,
  emberPayout,
  emberRankUnlocked,
  emberRankUnlockNeed,
  emberUnlockProgress,
  modulesOnlineCount,
  modulesToNextEmberUnlock,
  nextLockedEmberUnlock,
  postPrestigeStartOwned,
  prestigeBlockReason,
} from '../game/economy'
import { formatAsh, formatDecimal, formatMult } from '../game/format'
import { t } from '../i18n'
import { WinterScene } from '../theme/WinterScene'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

interface Props {
  game: GameApi
  highlight?: boolean
  /** Jump to an open chapter */
  onOpenChapter?: (id: ChapterId) => void
}

function shopRowPriority(
  affordable: boolean,
  unlocked: boolean,
  maxed: boolean,
): number {
  if (affordable) return 0
  if (!maxed && unlocked) return 1
  if (!maxed) return 2
  return 3
}

export function PrestigePanel({ game, highlight, onOpenChapter }: Props) {
  const { state, nextPrestige, canPrestige, prestige, multiplier, prestigeMin, prestigeProgress } =
    game
  const teaser = prestigeProgress.ratio >= 0.5 && !canPrestige
  const payout = emberPayout(state.ernteSeason, state.prestiges)
  const online = modulesOnlineCount(state.owned)
  const block = prestigeBlockReason({
    prestiges: state.prestiges,
    ernteSeason: state.ernteSeason,
    owned: state.owned,
  })
  const unlockProgress = emberUnlockProgress(state.ernteSeason, state.owned)
  const readyBuys = countAffordableEmberBuys(
    state.emberUpgrades,
    state.erbstuecke,
    state.ernteSeason,
    state.owned,
    state.prestiges,
  )
  const nextUnlock = nextLockedEmberUnlock(
    state.emberUpgrades,
    state.ernteSeason,
    state.owned,
    state.prestiges,
  )
  const postBuys = countAffordableEmberBuysAfterPrestige({
    upgrades: state.emberUpgrades,
    erbstuecke: state.erbstuecke,
    ernteSeason: state.ernteSeason,
    prestiges: state.prestiges,
  })

  const deepOpen = canDeepReset(state.prestiges)
  const [deepArmed, setDeepArmed] = useState(false)
  const deepPayout = game.deepSprouts
  const [genArmed, setGenArmed] = useState(false)
  const helperRank = HELPER_RANKS[state.helperLevel]

  const postUnlockMods =
    modulesToNextEmberUnlock(
      state.emberUpgrades,
      0,
      postPrestigeStartOwned(state.emberUpgrades),
      state.prestiges + 1,
    ) ?? 0

  let claimLabel: string
  if (canPrestige) {
    claimLabel =
      postBuys > 0
        ? t.prestige.claimReset(nextPrestige)
        : t.prestige.claimResetRebuild(nextPrestige, postUnlockMods)
  } else if (block === 'modules') {
    claimLabel = t.prestige.needModules(online, PRESTIGE_MIN_MODULES_ONLINE)
  } else {
    claimLabel = t.prestige.needMore(
      formatAsh(Math.max(0, prestigeMin - state.ernteSeason)),
    )
  }

  return (
    <section
      className={`panel prestige-panel${highlight ? ' ftue-target' : ''}`}
      aria-labelledby="prestige-heading"
    >
      <header className="panel-header">
        <p className="eyebrow">{t.season.springTitle(state.prestiges + 1)}</p>
        <h2 id="prestige-heading">{t.prestige.title}</h2>
        <p className="muted">
          {t.prestige.introBefore} <strong>{t.resources.credits}</strong>{' '}
          {t.prestige.introAfter}
        </p>
      </header>

      <div className="season-hero" aria-hidden="true">
        <WinterScene />
      </div>

      <div className="prestige-block">
        <dl className="season-stats">
          <div>
            <dt>{t.prestige.credits.replace(':', '')}</dt>
            <dd>{state.erbstuecke}</dd>
          </div>
          <div>
            <dt>{t.prestige.multiplier.replace(':', '')}</dt>
            <dd>{formatMult(multiplier)}</dd>
          </div>
          <div>
            <dt>{t.prestige.runs.replace(':', '')}</dt>
            <dd>{state.prestiges}</dd>
          </div>
        </dl>
        <p className="prestige-stats">
          {t.prestige.thisRun} <strong>{formatAsh(state.ernteSeason)}</strong> /{' '}
          {formatAsh(prestigeMin)} {t.resources.compute}
        </p>
        <div className="prestige-bar" aria-hidden="true">
          <div
            className="prestige-bar-fill"
            style={{ width: `${Math.min(100, prestigeProgress.ratio * 100)}%` }}
          />
        </div>

        <p className="prestige-stats">
          {t.prestige.nextPayout} <strong>{t.prestige.creditsAmount(payout)}</strong>
          {canPrestige ? <span className="prestige-teaser"> · {t.prestige.longerHint}</span> : null}
          {teaser ? <span className="prestige-teaser"> · {t.prestige.creditsPreview(nextPrestige)}</span> : null}
        </p>

        <div className="prestige-preview" aria-label={t.prestige.title}>
          <div className="prestige-preview-card keep">
            <p className="prestige-preview-label">{t.prestige.keepTitle}</p>
            <ul className="prestige-preview-list">
              {t.prestige.keepItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="prestige-preview-card lose">
            <p className="prestige-preview-label">{t.prestige.loseTitle}</p>
            <ul className="prestige-preview-list">
              {t.prestige.loseItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {!canPrestige && prestigeProgress.ratio < 0.05 && block === 'ernte' ? (
          <p className="panel-empty">{t.prestige.emptyGate}</p>
        ) : null}
        <button
          type="button"
          className="btn prestige"
          disabled={!canPrestige}
          onClick={prestige}
        >
          {claimLabel}
        </button>
      </div>

      <section className="helper-block" aria-labelledby="helper-heading">
        <div className="helper-head">
          <span className="helper-avatar" aria-hidden="true">
            <IconHelper />
          </span>
          <div>
            <h3 id="helper-heading" className="subhead">
              {t.helper.title}
            </h3>
            <p className="helper-name">
              {t.helper.name}
              {state.helperLevel > 0 ? ` · ${t.helper.rank(state.helperLevel, HELPER_RANKS.length)}` : ''}
            </p>
          </div>
        </div>
        <p className="muted">{game.helperUnlocked ? t.helper.intro : t.helper.locked}</p>
        {state.helperLevel > 0 ? (
          <p className="helper-speed">
            {t.helper.speed(formatDecimal(helperInterval(state.helperLevel) / 1000, helperInterval(state.helperLevel) % 1000 ? 1 : 0))}
            {' · '}
            <button type="button" className="link-btn" onClick={game.switchHelper}>
              {state.helperOn ? t.helper.on : t.helper.off}
            </button>
          </p>
        ) : null}
        {helperIsPro(state.helperLevel) ? (
          <div className="helper-pro" role="note">
            <strong>{t.helper.proTitle}</strong>
            <p className="muted">{t.helper.proHint}</p>
          </div>
        ) : state.helperLevel > 0 ? (
          <details className="helper-areas">
            <summary>{t.helper.areasTitle}</summary>
            <p className="muted">{t.helper.areasHint}</p>
            <div className="helper-area-chips">
              {GENERATORS.filter((g) => (state.owned[g.id] ?? 0) > 0).map((g) => {
                const on = !state.helperBlocked.includes(g.id)
                return (
                  <button
                    key={g.id}
                    type="button"
                    className={`helper-area-chip${on ? ' on' : ''}`}
                    aria-pressed={on}
                    aria-label={t.helper.areaAria(g.name, on)}
                    onClick={() => game.switchHelperArea(g.id)}
                  >
                    <span>{g.name}</span>
                    <small>{on ? t.helper.areaOn : t.helper.areaOff}</small>
                  </button>
                )
              })}
            </div>
            {GENERATORS.every((g) => (state.owned[g.id] ?? 0) === 0 || state.helperBlocked.includes(g.id)) ? (
              <p className="muted">{t.helper.allBlocked}</p>
            ) : null}
          </details>
        ) : null}
        {game.helperUnlocked ? (
          <button
            type="button"
            className="btn buy"
            disabled={!helperRank || state.erbstuecke < helperRank.cost}
            onClick={game.hireHelper}
          >
            {!helperRank
              ? t.helper.maxed
              : state.helperLevel === 0
                ? t.helper.hire(helperRank.cost)
                : helperIsPro(state.helperLevel + 1)
                  ? t.helper.proUpgrade(helperRank.cost)
                  : t.helper.upgrade(helperRank.cost)}
          </button>
        ) : null}
        {game.helperUnlocked && helperRank && helperIsPro(state.helperLevel + 1) ? (
          <p className="muted helper-pro-note">{t.helper.proNote}</p>
        ) : null}
      </section>

      <h3 className="subhead">{t.prestige.shopTitle}</h3>
      <p className="muted">{t.prestige.shopIntro}</p>
      {state.erbstuecke <= 0 ? (
        <p className="panel-empty">{t.prestige.emptyShop}</p>
      ) : readyBuys > 0 ? (
        <p className="prestige-shop-ready">{t.prestige.shopReady(readyBuys)}</p>
      ) : nextUnlock ? (
        <div className="prestige-shop-waiting">
          <p className="prestige-shop-ready prestige-shop-ready--wait">
            {t.prestige.shopWaiting(
              nextUnlock.item.name,
              nextUnlock.rank + 1,
              Math.round(nextUnlock.ratio * 100),
            )}
          </p>
          <div
            className="ember-unlock-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(nextUnlock.ratio * 100)}
            aria-label={t.prestige.shopUnlockAria(nextUnlock.item.name)}
          >
            <div
              className="ember-unlock-bar-fill"
              style={{ width: `${Math.round(nextUnlock.ratio * 100)}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="prestige-tree">
        {PRESTIGE_BRANCHES.map((branch) => {
          const items = EMBER_SHOP.filter((item) => item.branch === branch.id)
            .map((item) => {
              const rank = state.emberUpgrades[item.id]
              const maxed = rank >= item.maxRank
              const cost = item.cost(rank)
              const unlocked = emberRankUnlocked(
                item,
                rank,
                state.ernteSeason,
                state.owned,
                state.prestiges,
              )
              const affordable = state.erbstuecke >= cost && !maxed && unlocked
              const isNext =
                !!nextUnlock &&
                nextUnlock.item.id === item.id &&
                nextUnlock.rank === rank
              return {
                item,
                rank,
                maxed,
                cost,
                unlocked,
                affordable,
                isNext,
                priority: shopRowPriority(affordable, unlocked, maxed),
              }
            })
            .sort((a, b) => {
              if (a.isNext !== b.isNext) return a.isNext ? -1 : 1
              return a.priority - b.priority || a.item.id.localeCompare(b.item.id)
            })
          return (
            <section key={branch.id} className="prestige-branch" aria-labelledby={`branch-${branch.id}`}>
              <h4 id={`branch-${branch.id}`} className="prestige-branch-title">
                {branch.title}
              </h4>
              <p className="prestige-branch-blurb">{branch.blurb}</p>
              <ul className="ember-shop">
                {items.map(({ item, rank, maxed, cost, unlocked, affordable, isNext }) => {
                  const needAsh = emberRankUnlockNeed(
                    item.id,
                    rank,
                    state.prestiges,
                  )
                  const needMods = item.unlockModulesOnline
                  let lockHint: string | null = null
                  let unlockRatio = 0
                  if (!maxed && !unlocked) {
                    if (needMods != null && online < needMods) {
                      lockHint = t.prestige.shopModulesLocked(needMods)
                    } else if (needAsh > 0) {
                      unlockRatio = Math.min(1, unlockProgress / needAsh)
                      lockHint = t.prestige.shopRankLockedProgress(
                        Math.round(unlockRatio * 100),
                        formatAsh(Math.max(0, needAsh - unlockProgress)),
                      )
                    }
                  }
                  return (
                    <li
                      key={item.id}
                      className={`ember-shop-row${affordable ? ' ember-shop-row--ready' : ''}${!unlocked && !maxed ? ' ember-shop-row--locked' : ''}${isNext ? ' ember-shop-row--next' : ''}`}
                    >
                      <div className="ember-shop-info">
                        <div className="ember-shop-name">
                          {item.name}{' '}
                          <span className="ember-shop-rank">
                            {rank}/{item.maxRank}
                          </span>
                          {isNext ? (
                            <span className="ember-shop-next-tag">
                              {t.prestige.shopNextTag}
                            </span>
                          ) : null}
                        </div>
                        <p className="ember-shop-blurb">{item.blurb}</p>
                        <p className="ember-shop-effect">{item.effectLabel(rank)}</p>
                        {lockHint ? (
                          <p className="ember-shop-lock muted">{lockHint}</p>
                        ) : null}
                        {!maxed && !unlocked && needAsh > 0 ? (
                          <div
                            className="ember-unlock-bar ember-unlock-bar--row"
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(unlockRatio * 100)}
                          >
                            <div
                              className="ember-unlock-bar-fill"
                              style={{
                                width: `${Math.round(unlockRatio * 100)}%`,
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className="btn buy"
                        disabled={!affordable}
                        onClick={() => game.buyMeta(item.id)}
                      >
                        {maxed
                          ? t.prestige.max
                          : !unlocked
                            ? t.upgrade.locked
                            : t.prestige.costCredits(cost)}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      <section className="long-loop-block deep-winter" aria-labelledby="deep-winter">
        <h3 id="deep-winter" className="subhead">
          {t.longLoop.title}
        </h3>
        <p className="muted">{t.longLoop.intro}</p>
        <dl className="season-stats">
          <div>
            <dt>{t.longLoop.sprouts}</dt>
            <dd>{state.sproesslinge}</dd>
          </div>
          <div>
            <dt>{t.longLoop.winters}</dt>
            <dd>{state.deepPrestiges}</dd>
          </div>
          <div>
            <dt>{t.longLoop.payout}</dt>
            <dd>+{deepPayout}</dd>
          </div>
        </dl>
        {CHAPTERS.filter(
          (d) => game.openChapters.includes(d.id) || d.id === CHAPTERS.find((c) => !game.openChapters.includes(c.id))?.id,
        ).map((d) => {
          const copy = chapterCopy(d.id)
          return game.openChapters.includes(d.id) ? (
            <button key={d.id} type="button" className="btn ghost orchard-entry" onClick={() => onOpenChapter?.(d.id)}>
              {copy.icon} {copy.to}
            </button>
          ) : (
            <p key={d.id} className="orchard-teaser">
              {copy.icon} {copy.teaser}
            </p>
          )
        })}
        <IlseBlock game={game} />
        <div className="prestige-preview">
          <div className="prestige-preview-card keep">
            <p className="prestige-preview-label">{t.prestige.keepTitle}</p>
            <ul className="prestige-preview-list">
              {t.longLoop.keepItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="prestige-preview-card lose">
            <p className="prestige-preview-label">{t.longLoop.loseTitle}</p>
            <ul className="prestige-preview-list">
              {t.longLoop.loseItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <button
          type="button"
          className="btn prestige deep"
          disabled={!deepOpen}
          onClick={() => {
            if (deepArmed) {
              setDeepArmed(false)
              game.deepReset()
            } else {
              setDeepArmed(true)
              window.setTimeout(() => setDeepArmed(false), 4000)
            }
          }}
        >
          {!deepOpen
            ? t.longLoop.gateClosed(DEEP_GATE_YEAR)
            : deepArmed
              ? t.longLoop.confirmCta
              : t.longLoop.cta(deepPayout)}
        </button>

        <h4 className="prestige-branch-title">{t.longLoop.shopTitle}</h4>
        <ul className="ember-shop long-loop-shop">
          {DEEP_SHOP.map((item) => {
            const rank = state.deepUpgrades[item.id]
            const copy = t.longLoop.items[item.id]
            const maxed = rank >= item.maxRank
            const cost = item.cost(rank)
            const affordable = !maxed && state.sproesslinge >= cost
            return (
              <li
                key={item.id}
                className={`ember-shop-row${affordable ? ' ember-shop-row--ready' : ''}`}
              >
                <div className="ember-shop-info">
                  <div className="ember-shop-name">
                    {copy.name}{' '}
                    <span className="ember-shop-rank">
                      {t.longLoop.rank(rank, item.maxRank)}
                    </span>
                  </div>
                  <p className="ember-shop-blurb">{copy.blurb}</p>
                  <p className="ember-shop-effect">{copy.effect(rank)}</p>
                </div>
                <button
                  type="button"
                  className="btn buy"
                  disabled={!affordable}
                  onClick={() => game.buyDeep(item.id)}
                >
                  {maxed ? t.prestige.max : t.longLoop.cost(cost)}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="long-loop-block generation-block" aria-labelledby="generation-heading">
        <h3 id="generation-heading" className="subhead">
          <IconFamily /> {t.generation.title}
        </h3>
        <p className="muted">{t.generation.intro}</p>
        <FamilyTree generation={state.generation} />
        <dl className="season-stats">
          <div>
            <dt>{t.generation.vermaechtnis}</dt>
            <dd>{state.vermaechtnis}</dd>
          </div>
          <div>
            <dt>{t.generation.generations}</dt>
            <dd>{t.generation.current(state.generation)}</dd>
          </div>
          <div>
            <dt>{t.generation.payout}</dt>
            <dd>+{game.generationPayout}</dd>
          </div>
        </dl>
        <div className="prestige-preview">
          <div className="prestige-preview-card keep">
            <p className="prestige-preview-label">{t.prestige.keepTitle}</p>
            <ul className="prestige-preview-list">
              {t.generation.keepItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="prestige-preview-card lose">
            <p className="prestige-preview-label">{t.generation.loseTitle}</p>
            <ul className="prestige-preview-list">
              {t.generation.loseItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <button
          type="button"
          className="btn prestige deep generation"
          disabled={!game.canHandDown}
          onClick={() => {
            if (genArmed) {
              setGenArmed(false)
              game.handDown()
            } else {
              setGenArmed(true)
              window.setTimeout(() => setGenArmed(false), 4000)
            }
          }}
        >
          {!game.canHandDown
            ? t.generation.gate(state.deepPrestiges, generationGate(state.generation))
            : genArmed
              ? t.generation.confirmCta
              : t.generation.cta(game.generationPayout)}
        </button>

        <h4 className="prestige-branch-title">{t.generation.shopTitle}</h4>
        <p className="muted">{t.generation.shopIntro}</p>
        <ul className="ember-shop long-loop-shop">
          {LEGACY_SHOP.map((item) => {
            const rank = state.legacy[item.id]
            const copy = t.generation.items[item.id]
            const cost = item.cost(rank)
            const affordable = state.vermaechtnis >= cost
            return (
              <li key={item.id} className={`ember-shop-row${affordable ? ' ember-shop-row--ready' : ''}`}>
                <div className="ember-shop-info">
                  <div className="ember-shop-name">
                    {copy.name} <span className="ember-shop-rank">{t.generation.rank(rank)}</span>
                  </div>
                  <p className="ember-shop-blurb">{copy.blurb}</p>
                  <p className="ember-shop-effect">{copy.effect(rank)}</p>
                </div>
                <button
                  type="button"
                  className="btn buy"
                  disabled={!affordable}
                  onClick={() => game.buyLegacyRank(item.id)}
                >
                  {t.generation.cost(cost)}
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </section>
  )
}

/** Stammbaum: one leaf-node per generation, the current one glowing. */
function FamilyTree({ generation }: { generation: number }) {
  const n = Math.min(8, generation + 1)
  const w = 280
  return (
    <svg
      className="family-tree"
      viewBox={`0 0 ${w} 70`}
      role="img"
      aria-label={t.generation.treeAria(generation + 1)}
    >
      <path d={`M20 52 H${w - 20}`} stroke="#8a6a40" strokeWidth="3" strokeLinecap="round" />
      {Array.from({ length: n }, (_, i) => {
        const x = n === 1 ? w / 2 : 24 + (i * (w - 48)) / (n - 1)
        const current = i === n - 1
        return (
          <g key={i}>
            <path d={`M${x} 52 V36`} stroke="#8a6a40" strokeWidth="2.4" />
            <circle cx={x} cy={26} r={current ? 14 : 11} fill={current ? '#7fbf5a' : '#5f9e45'} stroke="#3f7a30" strokeWidth="1.5" className={current ? 'family-now' : undefined} />
            <text x={x} y={30} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
              {generation + 1 - (n - 1 - i)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** Oma Ilse — helper for the chapter plots, paid in Obst. */
function IlseBlock({ game }: { game: GameApi }) {
  const { state } = game
  const rank = ILSE_RANKS[state.ilseLevel]
  const obst = state.chapters.obstwiese.cur
  return (
    <section className="helper-block ilse-block" aria-labelledby="ilse-heading">
      <div className="helper-head">
        <span className="helper-avatar" aria-hidden="true">
          <IconIlse />
        </span>
        <div>
          <h4 id="ilse-heading" className="subhead">
            {t.ilse.title}
          </h4>
          <p className="helper-name">
            {t.ilse.name}
            {state.ilseLevel > 0 ? ` · ${t.ilse.rank(state.ilseLevel, ILSE_RANKS.length)}` : ''}
          </p>
        </div>
      </div>
      <p className="muted">{game.ilseUnlocked ? t.ilse.intro : t.ilse.locked}</p>
      {state.ilseLevel > 0 ? (
        <p className="helper-speed">
          {t.ilse.speed(formatDecimal(ILSE_RANKS[state.ilseLevel - 1]!.intervalMs / 1000, 2))}
          {' · '}
          <button type="button" className="link-btn" onClick={game.switchIlse}>
            {state.ilseOn ? t.ilse.chipOn : t.ilse.chipOff}
          </button>
        </p>
      ) : null}
      {game.ilseUnlocked ? (
        <button type="button" className="btn buy" disabled={!rank || obst < rank.cost} onClick={game.hireIlse}>
          {!rank
            ? t.ilse.maxed
            : state.ilseLevel === 0
              ? t.ilse.hire(formatAsh(rank.cost))
              : t.ilse.upgrade(formatAsh(rank.cost))}
        </button>
      ) : null}
    </section>
  )
}
