import { describe, expect, it } from 'vitest'
import { chapterDef } from '../game/chapters'
import { festAt, festKeyAt, festLimit, festShop } from '../game/fests'
import { shopOfferById } from '../game/monetization'
import { buyFestItem, chapterPerSecond, createInitialState, festPlusActive, mockBuyOffer, syncFest } from '../game/state'
import { parseSave } from '../game/storage'
import type { GameState } from '../game/state'

const now = new Date(2026, 10, 10, 12).getTime() // Laternenfest
const area = chapterDef('obstwiese').areas[0].id

function rich(): GameState {
  const base = syncFest(createInitialState(now), now)
  return {
    ...base,
    owned: { ...base.owned, gemuesebeet: 30 },
    festTokens: 5000,
    samen: 1000,
    chapters: { ...base.chapters, obstwiese: { ...base.chapters.obstwiese, openedAt: 1, cur: 0, owned: { [area]: 3 } } },
  }
}

function buyAll(s: GameState, id: string): { s: GameState; n: number } {
  let n = 0
  for (;;) {
    const next = buyFestItem(s, id, now)
    if (next === s) return { s, n }
    s = next
    n += 1
  }
}

describe('Festladen für Dauerspieler', () => {
  it('neue Waren: Kapitel-Korb und Festnacht', () => {
    const s = rich()
    const rate = chapterPerSecond(s, 'obstwiese')
    const korb = buyFestItem(s, 'chapterCrop', now)
    expect(korb.chapters.obstwiese.cur).toBeCloseTo(rate * 30 * 60)
    const nacht = buyFestItem(s, 'festNight', now)
    expect(nacht.ernte).toBeGreaterThan(s.ernte)
    expect(nacht.chapters.obstwiese.cur).toBeCloseTo(rate * 3600)
    // Ohne offenes Kapitel gibt es keinen Kapitel-Korb
    const plain = { ...s, chapters: createInitialState(now).chapters }
    expect(buyFestItem(plain, 'chapterCrop', now)).toBe(plain)
  })

  it('Festladen Plus verdoppelt den Vorrat nur im laufenden Fest', () => {
    const s = rich()
    const boost = festShop(festAt(now)).find((i) => i.id === 'boost')!
    expect(buyAll(s, 'boost').n).toBe(boost.limit)
    const plus = mockBuyOffer(s, shopOfferById('festPlus')!, now)
    expect(festPlusActive(plus)).toBe(true)
    expect(plus.festPlusKey).toBe(festKeyAt(now))
    expect(buyAll(plus, 'boost').n).toBe(boost.limit * 10)
    expect(festLimit(festShop(festAt(now)).find((i) => i.kind === 'variety')!, true)).toBe(1)
    // Zweimal kaufen geht nicht; im nächsten Fest ist Plus weg
    expect(mockBuyOffer(plus, shopOfferById('festPlus')!, now)).toBe(plus)
    const advent = new Date(2026, 11, 5, 12).getTime()
    expect(festPlusActive(syncFest(plus, advent))).toBe(false)
  })

  it('festPlusKey wird gespeichert; alte Stände laden ohne Plus', () => {
    const plus = mockBuyOffer(rich(), shopOfferById('festPlus')!, now)
    const back = parseSave(JSON.parse(JSON.stringify(plus)))
    expect(back?.festPlusKey).toBe(plus.festPlusKey)
    const { festPlusKey: _drop, ...old } = plus
    expect(parseSave(JSON.parse(JSON.stringify(old)))?.festPlusKey).toBe('')
  })
})
