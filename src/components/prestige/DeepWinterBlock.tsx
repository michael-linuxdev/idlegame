/** Tiefer Winter (Sprösslinge, Sprösslings-Laden) und Oma Ilse. Teil von PrestigePanel. */
import { useState } from 'react'
import { DEEP_GATE_YEAR, DEEP_SHOP, canDeepReset } from '../../game/longLoop'
import { CHAPTERS, type ChapterId } from '../../game/chapters'
import { ILSE_RANKS } from '../../game/extrasCore'
import { formatDecimal, formatErnte } from '../../game/format'
import { IconIlse } from '../../theme/icons'
import { chapterCopy } from '../chapterCopy'
import type { useGame } from '../../game/useGame'
import { t } from '../../i18n'

type GameApi = ReturnType<typeof useGame>

export function DeepWinterBlock({ game, onOpenChapter }: { game: GameApi; onOpenChapter?: (id: ChapterId) => void }) {
  const { state } = game
  const deepOpen = canDeepReset(state.saisonenden)
  const [deepArmed, setDeepArmed] = useState(false)
  const deepPayout = game.deepSprouts
  return (
    <section className="long-loop-block deep-winter" id="jump-deep" aria-labelledby="deep-winter">
      <h3 id="deep-winter" className="subhead">
        {t.longLoop.title}
      </h3>
      <p className="muted">{t.longLoop.intro}</p>
      <dl className="season-stats">
        <div>
          <dt>{t.longLoop.sprouts}</dt>
          <dd>{formatErnte(state.sproesslinge)}</dd>
        </div>
        <div>
          <dt>{t.longLoop.winters}</dt>
          <dd>{state.tiefeWinter}</dd>
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
      <ul className="laden long-loop-shop">
        {DEEP_SHOP.map((item) => {
          const rank = state.sproesslingLaden[item.id]
          const copy = t.longLoop.items[item.id]
          const maxed = rank >= item.maxRank
          const cost = item.cost(rank)
          const affordable = !maxed && state.sproesslinge >= cost
          return (
            <li
              key={item.id}
              className={`laden-row${affordable ? ' laden-row--ready' : ''}`}
            >
              <div className="laden-info">
                <div className="laden-name">
                  {copy.name}{' '}
                  <span className="laden-rank">
                    {t.longLoop.rank(rank, item.maxRank)}
                  </span>
                </div>
                <p className="laden-blurb">{copy.blurb}</p>
                <p className="laden-effect">{copy.effect(rank)}</p>
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
              ? t.ilse.hire(formatErnte(rank.cost))
              : t.ilse.upgrade(formatErnte(rank.cost))}
        </button>
      ) : null}
    </section>
  )
}
