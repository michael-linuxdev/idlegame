/**
 * Muss als erstes Modul in sim.ts geladen werden: SIM_ALL_CHAPTERS schaltet
 * alle 50 Kapitel aus src/game/chapterPlan.ts ein (auch noch nicht gebaute),
 * bevor chapters.ts seine Liste bildet.
 */
if (process.env.SIM_ALL_CHAPTERS) (globalThis as { __GE_SIM_ALL_CHAPTERS?: boolean }).__GE_SIM_ALL_CHAPTERS = true
export {}
