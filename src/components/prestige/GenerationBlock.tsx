/** Generationen: Stammbaum, Vermächtnis, Familienschatz. Teil von PrestigePanel. */
import { useState } from 'react'
import { LEGACY_SHOP, generationGate } from '../../game/generations'
import { IconFamily } from '../../theme/icons'
import type { useGame } from '../../game/useGame'
import { formatErnte } from '../../game/format'
import { t } from '../../i18n'

type GameApi = ReturnType<typeof useGame>

export function GenerationBlock({ game }: { game: GameApi }) {
  const { state } = game
  const [genArmed, setGenArmed] = useState(false)
  return (
    <section className="long-loop-block generation-block" id="jump-generation" aria-labelledby="generation-heading">
      <h3 id="generation-heading" className="subhead">
        <IconFamily /> {t.generation.title}
      </h3>
      <p className="muted">{t.generation.intro}</p>
      <FamilyTree generation={state.generation} />
      <dl className="season-stats">
        <div>
          <dt>{t.generation.vermaechtnis}</dt>
          <dd>{formatErnte(state.vermaechtnis)}</dd>
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
          ? t.generation.gate(state.tiefeWinter, generationGate(state.generation))
          : genArmed
            ? t.generation.confirmCta
            : t.generation.cta(game.generationPayout)}
      </button>

      <h4 className="prestige-branch-title">{t.generation.shopTitle}</h4>
      <p className="muted">{t.generation.shopIntro}</p>
      <ul className="laden long-loop-shop">
        {LEGACY_SHOP.map((item) => {
          const rank = state.legacy[item.id]
          const copy = t.generation.items[item.id]
          const cost = item.cost(rank)
          const affordable = state.vermaechtnis >= cost
          return (
            <li key={item.id} className={`laden-row${affordable ? ' laden-row--ready' : ''}`}>
              <div className="laden-info">
                <div className="laden-name">
                  {copy.name} <span className="laden-rank">{t.generation.rank(rank)}</span>
                </div>
                <p className="laden-blurb">{copy.blurb}</p>
                <p className="laden-effect">{copy.effect(rank)}</p>
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
