import { useEffect, useRef, useState } from 'react'
import { HELPER_RANKS, helperInterval, helperIsPro } from '../game/state'
import { GENERATORS } from '../game/generators'
import { IconHelper } from '../theme/icons'
import { type ChapterId } from '../game/chapters'
import { PRESTIGE_MIN_MODULES_ONLINE, erbstueckePayout, modulesOnlineCount, prestigeBlockReason, isProbeYear } from '../game/economy'
import { TRUHE_ITEMS, PRESTIGE_BRANCHES, countAffordableTruheBuys, countAffordableTruheBuysAfterPrestige, truheRankUnlocked, truheRankUnlockNeed, truheUnlockProgress, modulesToNextTruheUnlock, nextLockedTruheUnlock, postPrestigeStartOwned } from '../game/truhe'
import { formatEta, formatErnte, formatDecimal, formatMult } from '../game/format'
import { t } from '../i18n'
import { CHALLENGE_IDS } from '../game/challenges'
import { WinterScene } from '../theme/WinterScene'
import type { useGame } from '../game/useGame'
import { DeepWinterBlock } from './prestige/DeepWinterBlock'
import { GenerationBlock } from './prestige/GenerationBlock'

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

const JUMPS = ['season', 'helper', 'truhe', 'deep', 'generation']

export function PrestigePanel({ game, highlight, onOpenChapter }: Props) {
  const { state, nextPrestige, canPrestige, prestige, multiplier, prestigeMin, prestigeProgress } =
    game
  // Jump chips only for sections that are on screen for this player
  const [jumps, setJumps] = useState<string[]>([])
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setJumps(JUMPS.filter((k) => document.getElementById(`jump-${k}`) != null)),
    )
    return () => cancelAnimationFrame(id)
  }, [state.saisonenden, state.tiefeWinter, state.generation, state.helperLevel])
  // Untere Leiste nur, wenn der Winterruhe-Knopf oben nicht zu sehen ist (sonst doppelt)
  const mainCta = useRef<HTMLButtonElement>(null)
  const [mainCtaVisible, setMainCtaVisible] = useState(true)
  useEffect(() => {
    const el = mainCta.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setMainCtaVisible(e?.isIntersecting ?? false))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const teaser = prestigeProgress.ratio >= 0.5 && !canPrestige
  const probe = isProbeYear(state)
  const payout = erbstueckePayout(state.ernteSeason, state.saisonenden, probe)
  const online = modulesOnlineCount(state.owned)
  const block = prestigeBlockReason({
    saisonenden: state.saisonenden,
    ernteSeason: state.ernteSeason,
    owned: state.owned,
    probe,
  })
  const unlockProgress = truheUnlockProgress(state.ernteSeason, state.owned)
  const readyBuys = countAffordableTruheBuys(
    state.truhe,
    state.erbstuecke,
    state.ernteSeason,
    state.owned,
    state.saisonenden,
  )
  const nextUnlock = nextLockedTruheUnlock(
    state.truhe,
    state.ernteSeason,
    state.owned,
    state.saisonenden,
  )
  const postBuys = countAffordableTruheBuysAfterPrestige({
    upgrades: state.truhe,
    erbstuecke: state.erbstuecke,
    ernteSeason: state.ernteSeason,
    saisonenden: state.saisonenden,
    probe,
  })

  const helperRank = HELPER_RANKS[state.helperLevel]

  const postUnlockMods =
    modulesToNextTruheUnlock(
      state.truhe,
      0,
      postPrestigeStartOwned(state.truhe),
      state.saisonenden + 1,
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
      formatErnte(Math.max(0, prestigeMin - state.ernteSeason)),
    )
  }

  return (
    <section
      className={`panel prestige-panel${highlight ? ' ftue-target' : ''}`}
      aria-labelledby="prestige-heading"
    >
      <header className="panel-header">
        <p className="eyebrow">{t.season.springTitle(state.saisonenden + 1)}</p>
        <h2 id="prestige-heading">{t.prestige.title}</h2>
        <p className="muted">
          {t.prestige.introBefore} <strong>{t.resources.erbstuecke}</strong>{' '}
          {t.prestige.introAfter}
        </p>
      </header>

      {jumps.length > 2 ? (
      <nav className="season-jumps" aria-label={t.ux.season.jump}>
        {jumps.map((k) => (
          <button
            key={k}
            type="button"
            className="season-jump"
            onClick={() => document.getElementById(`jump-${k}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            {t.ux.season.jumps[k]}
          </button>
        ))}
      </nav>
      ) : null}

      <div className="season-hero" aria-hidden="true">
        <WinterScene />
      </div>

      <div className="prestige-block" id="jump-season">
        <dl className="season-stats">
          <div>
            <dt>{t.prestige.erbstuecke.replace(':', '')}</dt>
            <dd>{formatErnte(state.erbstuecke)}</dd>
          </div>
          <div>
            <dt>{t.prestige.multiplier.replace(':', '')}</dt>
            <dd>
              {formatMult(multiplier)}
              {multiplier <= 1 ? <small className="season-stat-hint">{t.ux.season.bonusHint}</small> : null}
            </dd>
          </div>
          <div>
            <dt>{t.prestige.runs.replace(':', '')}</dt>
            <dd>{state.saisonenden}</dd>
          </div>
        </dl>
        <p className="prestige-stats">
          {t.prestige.thisRun} <strong>{formatErnte(state.ernteSeason)}</strong> /{' '}
          {formatErnte(prestigeMin)} {t.resources.ernte}
        </p>
        <div className="prestige-bar" aria-hidden="true">
          <div
            className="prestige-bar-fill"
            style={{ width: `${Math.min(100, prestigeProgress.ratio * 100)}%` }}
          />
        </div>
        {prestigeProgress.ratio < 1 ? (
          <p className="prestige-eta">
            {(() => {
              const eta = formatEta(prestigeMin - state.ernteSeason, game.rate)
              return eta ? t.ux.season.eta(eta) : t.ux.season.etaLong
            })()}
          </p>
        ) : null}

        <p className="prestige-stats">
          {t.prestige.nextPayout} <strong>{t.prestige.erbstueckeAmount(payout)}</strong>
          {canPrestige ? (
            (() => {
              // Vorschau: was 10 Minuten weiter gärtnern bringen würde
              const later = erbstueckePayout(state.ernteSeason + game.rate * 600, state.saisonenden, probe)
              return later > payout ? (
                <span className="prestige-teaser"> · {t.prestige.laterPayout(later)}</span>
              ) : (
                <span className="prestige-teaser"> · {t.prestige.longerHint}</span>
              )
            })()
          ) : null}
          {teaser ? <span className="prestige-teaser"> · {t.prestige.erbstueckePreview(nextPrestige)}</span> : null}
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
          ref={mainCta}
          type="button"
          className="btn prestige"
          disabled={!canPrestige}
          onClick={prestige}
        >
          {claimLabel}
        </button>
      </div>

      <section className="helper-block" id="jump-helper" aria-labelledby="helper-heading">
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
            disabled={!helperRank || state[helperRank.currency] < helperRank.cost}
            onClick={game.hireHelper}
          >
            {!helperRank
              ? t.helper.maxed
              : state.helperLevel === 0
                ? t.helper.hire(t.helper.price(helperRank.cost, helperRank.currency))
                : helperIsPro(state.helperLevel + 1)
                  ? t.helper.proUpgrade(t.helper.price(helperRank.cost, helperRank.currency))
                  : t.helper.upgrade(t.helper.price(helperRank.cost, helperRank.currency))}
          </button>
        ) : null}
        {game.helperUnlocked && helperRank && helperRank.currency !== 'erbstuecke' && state[helperRank.currency] < helperRank.cost ? (
          <p className="muted helper-pro-note">{t.helper.needLayer(helperRank.currency)}</p>
        ) : null}
        {game.helperUnlocked && helperRank && helperIsPro(state.helperLevel + 1) ? (
          <p className="muted helper-pro-note">{t.helper.proNote}</p>
        ) : null}
      </section>

      <h3 className="subhead" id="jump-truhe">{t.prestige.shopTitle}</h3>
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
            className="truhe-unlock-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(nextUnlock.ratio * 100)}
            aria-label={t.prestige.shopUnlockAria(nextUnlock.item.name)}
          >
            <div
              className="truhe-unlock-bar-fill"
              style={{ width: `${Math.round(nextUnlock.ratio * 100)}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="prestige-tree">
        {PRESTIGE_BRANCHES.map((branch) => {
          const items = TRUHE_ITEMS.filter((item) => item.branch === branch.id)
            .map((item) => {
              const rank = state.truhe[item.id]
              const maxed = rank >= item.maxRank
              const cost = item.cost(rank)
              const unlocked = truheRankUnlocked(
                item,
                rank,
                state.ernteSeason,
                state.owned,
                state.saisonenden,
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
              <ul className="laden">
                {items.map(({ item, rank, maxed, cost, unlocked, affordable, isNext }) => {
                  const needErnte = truheRankUnlockNeed(
                    item.id,
                    rank,
                    state.saisonenden,
                  )
                  const needMods = item.unlockModulesOnline
                  let lockHint: string | null = null
                  let unlockRatio = 0
                  if (!maxed && !unlocked) {
                    if (needMods != null && online < needMods) {
                      lockHint = t.prestige.shopModulesLocked(needMods)
                    } else if (needErnte > 0) {
                      unlockRatio = Math.min(1, unlockProgress / needErnte)
                      lockHint = t.prestige.shopRankLockedProgress(
                        Math.round(unlockRatio * 100),
                        formatErnte(Math.max(0, needErnte - unlockProgress)),
                      )
                    }
                  }
                  return (
                    <li
                      key={item.id}
                      className={`laden-row${affordable ? ' laden-row--ready' : ''}${!unlocked && !maxed ? ' laden-row--locked' : ''}${isNext ? ' laden-row--next' : ''}`}
                    >
                      <div className="laden-info">
                        <div className="laden-name">
                          {item.name}{' '}
                          <span className="laden-rank">
                            {rank}/{item.maxRank}
                          </span>
                          {isNext ? (
                            <span className="laden-next-tag">
                              {t.prestige.shopNextTag}
                            </span>
                          ) : null}
                        </div>
                        <p className="laden-blurb">{item.blurb}</p>
                        <p className={`laden-effect${rank > 0 ? '' : ' laden-effect--none'}`}>
                          {rank > 0 ? t.prestige.effectNow(item.effectLabel(rank)) : t.prestige.effectNone}
                        </p>
                        {lockHint ? (
                          <p className="laden-lock muted">{lockHint}</p>
                        ) : null}
                        {!maxed && !unlocked && needErnte > 0 ? (
                          <div
                            className="truhe-unlock-bar truhe-unlock-bar--row"
                            role="progressbar"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(unlockRatio * 100)}
                          >
                            <div
                              className="truhe-unlock-bar-fill"
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
                            : t.prestige.costErbstuecke(cost)}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      {game.challengesOpen ? (
        <section className="long-loop-block challenge-block" aria-labelledby="challenge-heading">
          <h3 id="challenge-heading" className="subhead">
            {t.challenges.title}
          </h3>
          <p className="muted">{t.challenges.intro}</p>
          {state.challenge ? (
            <div className="challenge-active">
              <p>
                <strong>{t.challenges.active(t.challenges.names[state.challenge])}</strong> · {t.challenges.rules[state.challenge]}
              </p>
              <button type="button" className="btn ghost" onClick={game.stopChallenge}>
                {t.challenges.abort}
              </button>
            </div>
          ) : null}
          <ul className="challenge-list">
            {CHALLENGE_IDS.map((id) => {
              const done = state.challengesDone.includes(id)
              const next = state.challengeNext === id
              return (
                <li key={id} className={`challenge-row${done ? ' done' : ''}`}>
                  <span className="challenge-text">
                    <strong>
                      {t.challenges.names[id]}
                      {done ? ` · ${t.challenges.done}` : ''}
                    </strong>
                    <small>{t.challenges.rules[id]}</small>
                  </span>
                  <button
                    type="button"
                    className={`btn ${next ? 'buy' : 'ghost'}`}
                    aria-pressed={next}
                    onClick={() => game.chooseChallenge(next ? null : id)}
                  >
                    {next ? t.challenges.chosen : t.challenges.choose}
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="challenge-next" role="status">
            {state.challengeNext ? t.challenges.next(t.challenges.names[state.challengeNext]) : t.challenges.none}
          </p>
          <p className="muted">{t.challenges.reward}</p>
        </section>
      ) : null}

      <DeepWinterBlock game={game} onOpenChapter={onOpenChapter} />

      <GenerationBlock game={game} />

      {canPrestige && !mainCtaVisible ? (
        <div className="prestige-sticky">
          <button type="button" className="btn prestige" onClick={prestige}>
            {claimLabel}
          </button>
        </div>
      ) : null}
    </section>
  )
}
