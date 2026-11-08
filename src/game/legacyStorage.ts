/**
 * One-shot cleanup of localStorage keys left behind by earlier prototypes
 * (TurmFarm / Orbit Rack / Ash Dominion). Gartenerbe starts fresh — old saves
 * are intentionally not migrated.
 */
const LEGACY_KEYS = [
  'orbit-rack-save-v2',
  'orbital-claim-save-v2',
  'ash-dominion-save-v2',
  'ash-dominion-save-v1',
  'orbit-rack-ftue-v1',
  'orbital-claim-ftue-v1',
  'ash-dominion-ftue-v1',
  'turmfarm-install-v1',
  'orbit-rack-install-v1',
  'orbital-claim-install-v1',
  'ash-dominion-install-v1',
  'turmfarm-sfx-muted',
  'turmfarm-playtest-log-on',
  'turmfarm-playtest-log-v1',
] as const

export function purgeLegacyStorage(): void {
  try {
    for (const key of LEGACY_KEYS) localStorage.removeItem(key)
  } catch {
    // Private mode / storage blocked — nothing to clean.
  }
}
