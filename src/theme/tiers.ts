/** Module level thresholds for the five visible growth tiers. */
export const TIER_LEVELS = [1, 10, 25, 50, 100] as const

/** 0 = not planted, 1–5 = growth tier */
export function moduleTier(level: number): number {
  let tier = 0
  for (const need of TIER_LEVELS) if (level >= need) tier += 1
  return tier
}
