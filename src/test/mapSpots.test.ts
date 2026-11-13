import { describe, expect, it } from 'vitest'
import { FESTS } from '../game/fests'
import { festItems, festSkinItems, festSpots, spotsCollide } from '../theme/festItems'

const SKINS = [undefined, 'skin-festFruehling', 'skin-festSommer', 'skin-festErntedank', 'skin-festAdvent']

describe('Karten-Deko: ein Platz, ein Stück', () => {
  it('die Stücke eines Festes überdecken sich nicht gegenseitig', () => {
    for (const f of FESTS) {
      const items = festItems(f.id)
      for (let i = 0; i < items.length; i++)
        for (let j = i + 1; j < items.length; j++) expect(spotsCollide(items[i]!, items[j]!), `${f.id}: ${items[i]!.key} × ${items[j]!.key}`).toBe(false)
    }
  })

  it('Fest-Deko weicht der Deko des Gartenstils', () => {
    for (const f of FESTS)
      for (const skin of SKINS) {
        const own = festSkinItems(skin, f.id)
        const all = festSpots(f.id, skin)
        for (const o of own) for (const s of all.slice(own.length)) expect(spotsCollide(o, s), `${f.id}/${skin}`).toBe(false)
      }
  })

  it('belegte Plätze haben Vorrang (blocked)', () => {
    const lantern = festItems('laternenfest')[0]!
    expect(festSpots('laternenfest', undefined, [lantern]).some((s) => s.left === lantern.left && s.top === lantern.top)).toBe(false)
  })
})
