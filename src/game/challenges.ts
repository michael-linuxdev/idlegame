/**
 * Omas Herausforderungen: freiwillige Saisons mit einer Einschränkung.
 *
 * - Ab Gartenjahr 8 wählbar, gilt für die NÄCHSTE Saison (ab dem Saisonende).
 * - Abbrechen geht jederzeit, ohne Verlust: die Saison läuft normal weiter.
 * - Wer die Saison mit der Einschränkung bis zum Saisonende spielt, bekommt
 *   einen kleinen dauerhaften Bonus (+3 % Garten-Ernte je Herausforderung)
 *   und einen Eintrag in „Sammlung & Ziele“.
 */
import type { GeneratorId } from './generators'

export type ChallengeId = 'ohneKompost' | 'fuenfBeete' | 'ohneGiessen'

export const CHALLENGE_IDS: ChallengeId[] = ['ohneKompost', 'fuenfBeete', 'ohneGiessen']

/** Ab diesem Gartenjahr (prestiges) wählbar */
export const CHALLENGES_FROM_PRESTIGES = 7

export const CHALLENGE_BONUS = 0.03

export const FIVE_BEDS = 5

export function isChallengeId(v: unknown): v is ChallengeId {
  return typeof v === 'string' && (CHALLENGE_IDS as string[]).includes(v)
}

/** Darf in dieser Herausforderung dieser Bereich ausgebaut werden? */
export function challengeAllowsBuy(
  challenge: ChallengeId | null,
  id: GeneratorId,
  owned: Partial<Record<GeneratorId, number>>,
): boolean {
  if (challenge === 'ohneKompost' && id === 'kompost') return false
  if (challenge === 'fuenfBeete' && (owned[id] ?? 0) === 0) {
    const planted = Object.values(owned).filter((n) => (n ?? 0) > 0).length
    if (planted >= FIVE_BEDS) return false
  }
  return true
}

export function challengeAllowsWater(challenge: ChallengeId | null): boolean {
  return challenge !== 'ohneGiessen'
}

/** Dauerhafter Bonus aus geschafften Herausforderungen. */
export function challengesMult(done: readonly string[]): number {
  return 1 + CHALLENGE_BONUS * CHALLENGE_IDS.filter((id) => done.includes(id)).length
}
