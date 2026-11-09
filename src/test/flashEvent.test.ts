import { describe, expect, it } from 'vitest'
import { FLASH_COOLDOWN_MS, canSpawnFlashEvent, flashGoalForRate, rollFlashSpawn } from '../game/flashEvent'

describe('Sonnenfenster', () => {
  const now = 1_800_000_000_000
  it('Ziel wächst mit der Ernte/s, hat aber eine Untergrenze', () => {
    expect(flashGoalForRate(0)).toBe(400)
    expect(flashGoalForRate(100)).toBe(36_000)
  })
  it('nie zwei gleichzeitig, Pause nach dem letzten', () => {
    expect(canSpawnFlashEvent(0, now + 1000, now)).toBe(false)
    expect(canSpawnFlashEvent(now - 1000, 0, now)).toBe(false)
    expect(canSpawnFlashEvent(now - FLASH_COOLDOWN_MS - 1, 0, now)).toBe(true)
  })
  it('das allererste kommt sicher, danach per Zufall', () => {
    expect(rollFlashSpawn(0, 0, now, () => 0.99)).toBe(true)
    expect(rollFlashSpawn(now - FLASH_COOLDOWN_MS - 1, 0, now, () => 0.99)).toBe(false)
    expect(rollFlashSpawn(now - FLASH_COOLDOWN_MS - 1, 0, now, () => 0)).toBe(true)
  })
})
