import { describe, expect, it } from 'vitest'
import { ALBUM_GOALS, ALBUM_REWARD_AT, ALBUM_STAMP_SAMEN, albumProgress, seasonKey } from '../game/album'
import { albumCount, albumStats, claimAlbumStamp, createInitialState, doPrestige, syncAlbum } from '../game/state'
import { parseSave } from '../game/storage'

const oct = new Date(2026, 9, 10, 12).getTime()
const dec = new Date(2026, 11, 20, 12).getTime()

describe('Jahreszeiten-Album', () => {
  it('season keys by calendar; December belongs to next winter', () => {
    expect(seasonKey(oct)).toBe('2026-autumn')
    expect(seasonKey(dec)).toBe('2027-winter')
    expect(seasonKey(new Date(2027, 1, 2).getTime())).toBe('2027-winter')
  })
  it('measures lifetime stats from the season start, counts bumped stats', () => {
    let s = syncAlbum({ ...createInitialState(0), totalUpgrades: 1000 }, oct)
    expect(albumProgress(s.album, albumStats(s), 'upgrades')).toBe(0)
    s = { ...s, totalUpgrades: 1400 }
    expect(albumProgress(s.album, albumStats(s), 'upgrades')).toBe(400)
    s = albumCount(s, 'water', 3, oct)
    expect(albumProgress(s.album, albumStats(s), 'water')).toBe(3)
  })
  it('stamps pay Samen; enough stamps bring the season Deko once', () => {
    let s = syncAlbum({ ...createInitialState(0), samen: 0 }, oct)
    expect(claimAlbumStamp(s, 'upgrades', oct)).toBe(s)
    s = { ...s, totalUpgrades: 1e6 }
    s = claimAlbumStamp(s, 'upgrades', oct)
    expect(s.samen).toBe(ALBUM_STAMP_SAMEN)
    expect(claimAlbumStamp(s, 'upgrades', oct)).toBe(s)
    // fill all counted/lifetime goals
    for (const g of ALBUM_GOALS) s = albumCount(s, g.id, 999, oct)
    s = { ...s, collection: Array.from({ length: 5 }, (_, i) => `x${i}`), hybrids: ['jostabeere', 'honigbirne'], decorOwned: ['zwerg', 'bank'] }
    const claimable = ['water', 'seasons', 'daily', 'offline', 'varieties', 'hybrids', 'decor', 'upgrades'] as const
    for (const id of claimable) s = claimAlbumStamp(s, id, oct)
    expect(s.album.claimed.length).toBe(8)
    s = { ...s, residentsSeen: { amsel: 9 } }
    s = claimAlbumStamp(s, 'visits', oct)
    s = claimAlbumStamp(s, 'species', oct)
    expect(s.album.claimed.length).toBe(ALBUM_REWARD_AT)
    expect(s.album.rewarded).toBe(true)
    expect(s.decorOwned).toContain('kuerbislaterne')
  })
  it('new season → fresh album; survives Saisonende; old saves load empty', () => {
    let s = syncAlbum(createInitialState(0), oct)
    s = albumCount(s, 'water', 5, oct)
    expect(syncAlbum(s, dec).album.counts.water).toBeUndefined()
    const p = doPrestige({ ...s, ernteSeason: 1e40 })
    expect(p.album.key).toBe('2026-autumn')
    const raw = JSON.parse(JSON.stringify(s)) as Record<string, unknown>
    delete raw.album
    expect(parseSave(raw)?.album.key).toBe('')
  })
})
