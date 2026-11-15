import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { COSMETICS, DEFAULT_CHAPTER_COSMETIC, cosmeticOwned } from '../game/monetization'
import { buyCosmetic, createInitialState, equipCosmetic } from '../game/state'
import { parseSave, serializeSave } from '../game/storage'
import { strings as de } from '../i18n/de/strings'
import { strings as en } from '../i18n/en/strings'

/** Gartenstile für Omas Garten und Lichtstimmungen für die Grundstücke (Samen-Senke, 2026-11-15). */
describe('Gartenstile und Lichtstimmungen', () => {
  const now = 1_800_000_000_000
  const base = { ...createInitialState(now), samen: 5000 }
  const css = ['src/theme/garden.css', 'src/theme/app/10-markt.css', 'src/theme/expansion/03-feste.css']
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n')

  it('every style has copy in both languages, a look and a swatch', () => {
    expect(new Set(COSMETICS.map((c) => c.id)).size).toBe(COSMETICS.length)
    for (const c of COSMETICS) {
      expect(de.cosmetics[c.id].name, c.id).toBeTruthy()
      expect(en.cosmetics[c.id].name, c.id).toBeTruthy()
      expect(css, `swatch ${c.id}`).toContain(`.cosmetic-swatch.${c.accentClass}`)
      // die beiden Standards sehen aus wie die Karte ohne Stil
      if (c.cost > 0) expect(css, `look ${c.id}`).toContain(`.garden-stage.${c.accentClass}`)
    }
  })

  it('there is enough to buy: more than five weeks of free Samen', () => {
    const total = COSMETICS.filter((c) => !c.fest && !c.monat).reduce((n, c) => n + c.cost, 0)
    expect(total).toBeGreaterThanOrEqual(5 * 500)
  })

  it('a light mood is bought once and worn on the plots, the garden style stays', () => {
    const bought = buyCosmetic(base, 'lichtAbend', now)
    expect(bought.samen).toBe(5000 - 300)
    const worn = equipCosmetic(bought, 'lichtAbend', now)
    expect(worn.equippedChapterCosmetic).toBe('lichtAbend')
    expect(worn.equippedCosmetic).toBe('wiese')
    // zurück zum Tageslicht geht immer, ohne Kauf
    expect(cosmeticOwned(worn.ownedCosmetics, DEFAULT_CHAPTER_COSMETIC)).toBe(true)
    expect(equipCosmetic(worn, DEFAULT_CHAPTER_COSMETIC, now).equippedChapterCosmetic).toBe('lichtTag')
    // nicht gekauft → nicht anlegbar
    expect(equipCosmetic(base, 'lichtMond', now)).toBe(base)
    // ein Gartenstil ändert die Grundstücke nicht
    const garden = equipCosmetic(buyCosmetic(worn, 'moosgarten', now), 'moosgarten', now)
    expect(garden.equippedCosmetic).toBe('moosgarten')
    expect(garden.equippedChapterCosmetic).toBe('lichtAbend')
  })

  it('survives save/load; old saves and mixed-up values fall back safely', () => {
    const worn = equipCosmetic(buyCosmetic(base, 'lichtHerbst', now), 'lichtHerbst', now)
    const raw = JSON.parse(serializeSave(worn)) as Record<string, unknown>
    expect(parseSave(raw)!.equippedChapterCosmetic).toBe('lichtHerbst')
    expect(parseSave(raw)!.ownedCosmetics).toContain('lichtHerbst')
    // alter Stand ohne das Feld
    const old = { ...raw }
    delete old.equippedChapterCosmetic
    expect(parseSave(old)!.equippedChapterCosmetic).toBe('lichtTag')
    // nicht gekaufte Lichtstimmung bzw. ein Gartenstil am falschen Platz
    expect(parseSave({ ...raw, equippedChapterCosmetic: 'lichtMond' })!.equippedChapterCosmetic).toBe('lichtTag')
    expect(parseSave({ ...raw, equippedChapterCosmetic: 'wiese' })!.equippedChapterCosmetic).toBe('lichtTag')
    expect(parseSave({ ...raw, equippedCosmetic: 'lichtHerbst' })!.equippedCosmetic).toBe('wiese')
  })
})
