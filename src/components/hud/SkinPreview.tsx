import type { CosmeticDef } from '../../game/monetization'
import { cosmeticOwned } from '../../game/monetization'
import type { useGame } from '../../game/useGame'
import { t } from '../../i18n'

/** Vorschau eines Gartenstils live auf der Karte (Omas Garten oder ein Grundstück): kaufen oder zurück. */
export function SkinPreview({ game, skin, onEnd }: { game: ReturnType<typeof useGame>; skin: CosmeticDef; onEnd?: () => void }) {
  return (
    <div className="preview-banner" role="status">
      <span>{t.preview.banner(skin.name)}</span>
      <button
        type="button"
        className="btn buy"
        disabled={game.state.samen < skin.cost || cosmeticOwned(game.state.ownedCosmetics, skin.id)}
        onClick={() => {
          game.purchaseCosmetic(skin.id)
          game.setEquippedCosmetic(skin.id)
          onEnd?.()
        }}
      >
        {t.preview.buy(skin.cost)}
      </button>
      <button type="button" className="btn ghost" onClick={onEnd}>
        {t.preview.back}
      </button>
    </div>
  )
}
