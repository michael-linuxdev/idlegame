import { formatErnte } from '../game/format'
import type { SurpriseJump } from '../game/surpriseJumps'
import { t } from '../i18n'
import { chapterCopy } from './chapterCopy'

/** Text der Überraschungs-Blase; Kapitel-Überraschungen nennen ihre Währung. */
export function surpriseText(s: SurpriseJump): string {
  const amount = s.chapter ? `${formatErnte(s.amount)} ${chapterCopy(s.chapter).currency}` : formatErnte(s.amount)
  switch (s.kind) {
    case 'milestone':
      return t.surprise.milestone(amount)
    case 'jackpot':
      return t.surprise.jackpot(amount)
    case 'prestigeNear':
      return t.surprise.prestigeNear(amount)
    case 'offlineJackpot':
      return t.surprise.offlineJackpot(amount)
  }
}
