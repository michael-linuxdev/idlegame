/**
 * Achievements / Meilensteine — one-time goals with soft rewards.
 * Theme-agnostic IDs; German copy via i18n.
 */

import { t } from '../i18n'
import type { CosmeticId } from './monetization'
import type { GeneratorId } from './generators'

export type AchievementId =
  | 'firstUpgrade'
  | 'bedTen'
  | 'compostOnline'
  | 'earn10k'
  | 'dailyOnce'
  | 'offlineOnce'
  | 'fiveOnline'
  | 'levelFive'
  | 'prestigeOnce'
  | 'upgradesFifty'

export type AchievementRewardKind = 'ash' | 'embers' | 'obsidian' | 'cosmetic'

export interface AchievementDef {
  id: AchievementId
  name: () => string
  blurb: () => string
  rewardKind: AchievementRewardKind
  rewardAmount?: number
  cosmeticId?: CosmeticId
  rewardLabel: () => string
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'firstUpgrade',
    name: () => t.achievements.firstUpgrade.name,
    blurb: () => t.achievements.firstUpgrade.blurb,
    rewardKind: 'ash',
    rewardAmount: 30,
    rewardLabel: () => t.achievements.rewardAsh(30),
  },
  {
    id: 'bedTen',
    name: () => t.achievements.bedTen.name,
    blurb: () => t.achievements.bedTen.blurb,
    rewardKind: 'ash',
    rewardAmount: 120,
    rewardLabel: () => t.achievements.rewardAsh(120),
  },
  {
    id: 'compostOnline',
    name: () => t.achievements.compostOnline.name,
    blurb: () => t.achievements.compostOnline.blurb,
    rewardKind: 'obsidian',
    rewardAmount: 8,
    rewardLabel: () => t.achievements.rewardObsidian(8),
  },
  {
    id: 'earn10k',
    name: () => t.achievements.earn10k.name,
    blurb: () => t.achievements.earn10k.blurb,
    rewardKind: 'embers',
    rewardAmount: 1,
    rewardLabel: () => t.achievements.rewardEmbers(1),
  },
  {
    id: 'dailyOnce',
    name: () => t.achievements.dailyOnce.name,
    blurb: () => t.achievements.dailyOnce.blurb,
    rewardKind: 'ash',
    rewardAmount: 60,
    rewardLabel: () => t.achievements.rewardAsh(60),
  },
  {
    id: 'offlineOnce',
    name: () => t.achievements.offlineOnce.name,
    blurb: () => t.achievements.offlineOnce.blurb,
    rewardKind: 'obsidian',
    rewardAmount: 5,
    rewardLabel: () => t.achievements.rewardObsidian(5),
  },
  {
    id: 'fiveOnline',
    name: () => t.achievements.fiveOnline.name,
    blurb: () => t.achievements.fiveOnline.blurb,
    rewardKind: 'ash',
    rewardAmount: 400,
    rewardLabel: () => t.achievements.rewardAsh(400),
  },
  {
    id: 'levelFive',
    name: () => t.achievements.levelFive.name,
    blurb: () => t.achievements.levelFive.blurb,
    rewardKind: 'obsidian',
    rewardAmount: 15,
    rewardLabel: () => t.achievements.rewardObsidian(15),
  },
  {
    id: 'prestigeOnce',
    name: () => t.achievements.prestigeOnce.name,
    blurb: () => t.achievements.prestigeOnce.blurb,
    rewardKind: 'cosmetic',
    cosmeticId: 'goldherbst',
    rewardLabel: () =>
      t.achievements.rewardCosmetic(t.cosmetics.goldherbst.name),
  },
  {
    id: 'upgradesFifty',
    name: () => t.achievements.upgradesFifty.name,
    blurb: () => t.achievements.upgradesFifty.blurb,
    rewardKind: 'embers',
    rewardAmount: 2,
    rewardLabel: () => t.achievements.rewardEmbers(2),
  },
]

export const ACHIEVEMENT_IDS = ACHIEVEMENTS.map((a) => a.id)

export interface AchievementStats {
  totalUpgrades: number
  lifetimeAshEarned: number
  claimedDailyOnce: boolean
  claimedOfflineOnce: boolean
  playerLevel: number
  prestiges: number
  owned: Record<GeneratorId, number>
}

export function isAchievementComplete(
  id: AchievementId,
  stats: AchievementStats,
): boolean {
  switch (id) {
    case 'firstUpgrade':
      return stats.totalUpgrades >= 1
    case 'bedTen':
      return (stats.owned.gemuesebeet ?? 0) >= 10
    case 'compostOnline':
      return (stats.owned.kompost ?? 0) >= 1
    case 'earn10k':
      return stats.lifetimeAshEarned >= 10_000
    case 'dailyOnce':
      return stats.claimedDailyOnce
    case 'offlineOnce':
      return stats.claimedOfflineOnce
    case 'fiveOnline': {
      let n = 0
      for (const lv of Object.values(stats.owned)) {
        if (lv >= 1) n += 1
      }
      return n >= 5
    }
    case 'levelFive':
      return stats.playerLevel >= 5
    case 'prestigeOnce':
      return stats.prestiges >= 1
    case 'upgradesFifty':
      return stats.totalUpgrades >= 50
    default:
      return false
  }
}
