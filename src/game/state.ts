/**
 * Spielkern (Zustand + reine Spielfunktionen). Aufgeteilt in src/game/state/*;
 * diese Datei bündelt die öffentlichen Exporte, damit Importe stabil bleiben.
 */
export { HELPER_RANKS, TURBO_MS, TURBO_MULT, emptyExpansion, pickExpansion, STORAGE_KEY } from './state/types'
export type { GameState, HelperCurrency, ExpansionSlice } from './state/types'
export { emptyOwned, createInitialState, createPostPrestigeState } from './state/create'
export {
  playerLevelOf,
  applyLevelRewards,
  syncEventWindow,
  effectiveClanMult,
  syncClanBoost,
  syncYieldBoost,
  syncGartenwoche,
  syncMonetization,
  effectiveYieldBoostMult,
  eventProductionMult,
  flashProductionMult,
  NEIGHBOUR_FROM,
  NEIGHBOUR_STEP,
  neighbourMult,
  turboMult,
  expansionGardenMult,
  productionPerSecond,
  rainbowMult,
} from './state/core'
export {
  chapterOpen,
  openChapters,
  abschlussDue,
  syncChaptersOpen,
  chapterRateMult,
  chapterPerSecond,
  chapterAreaRates,
  chooseArcRule,
  chapterCareCostOf,
  chapterCostOf,
  buyChapterCare,
  buyChapterArea,
  buyChapterMany,
  bestChapterBuy,
  ilseUnlocked,
  buyIlse,
  toggleIlse,
  runIlse,
  weinleseReady,
  finishWeinlese,
  clearLastChest,
} from './state/chapters'
export {
  syncRecipe,
  recipeReady,
  claimRecipe,
  syncSky,
  catchRainbow,
  makeWish,
  syncContest,
  growPumpkin,
  claimContest,
  grantReward,
} from './state/extras'
export type { Wish } from './state/extras'
export { generationPayout, canHandDownNow, doGeneration, buyLegacy } from './state/generation'
export { syncFest, earnFest, buyFestItem, festPlusActive } from './state/fest'
export {
  helperUnlocked,
  helperInterval,
  buyHelper,
  pendingWeatherEvent,
  decideWeather,
  albumStats,
  syncAlbum,
  albumCount,
  claimAlbumStamp,
  projectOpen,
  buildProjectStage,
  startCrossing,
  skipCrossing,
  harvestCrossing,
  spawnResident,
  residentGone,
  greetResident,
  buyDecor,
  grantDecor,
  placeDecor,
  toggleHelperArea,
  toggleHelper,
} from './state/life'
export {
  bestGardenBuy,
  planGardenBuy,
  helperIsPro,
  buyGeneratorMany,
  affordableLevels,
  costForLevels,
  buyAllBest,
  runHelper,
} from './state/garden'
export {
  clearLastSurprise,
  maybeStartFlashEvent,
  dismissFlashEvent,
  claimFlashEventGoal,
} from './state/events'
export { canPrestigeNow, prestigeProgress, applyTick } from './state/tick'
export {
  skipHoursRemaining,
  buyTimeSkip,
  shieldReady,
  claimDailyOps,
  dismissErntefest,
  claimErntefestGoal,
  buyCosmetic,
  equipCosmetic,
  buyClanBoost,
  buyYieldBoost,
  mockBuyOffer,
  mockBuyPack,
  mockBuyOfferById,
  claimRewardedAd,
  marketGiftReady,
  claimMarketGift,
  challengesOpen,
  chooseNextChallenge,
  abortChallenge,
  pickSeasonCard,
  switchSeasonCard,
  canSwitchSeasonCard,
  SESSION_GAP_MS,
  countSession,
  waterRefillsLeft,
  refillWateringCan,
  claimGartenwocheDailyXp,
  claimGartenwocheTier,
} from './state/market'
export type { RewardedAdResult } from './state/market'
export type { WeatherPreview } from './state/rewards'
export { applyOfflineCatchup, creditOfflinePending, claimOfflineReward } from './state/offline'
export {
  lineCostMult,
  buyGenerator,
  buyBranch,
  claimQuestReward,
  claimAchievement,
  collectReadyAchievements,
  bulkUnlocks,
  gatePrestiges,
} from './state/buy'
export type { BuyMode } from './state/buy'
export { buyTruheItem, doPrestige, deepSproutPayout, buyDeepUpgrade, doDeepReset } from './state/prestige'
export {
  waterMult,
  applyWheel,
  clearLastVariety,
  grantTapErnte,
  multBreakdown,
  totalGardenMult,
  weatherPreview,
  bestWeatherChoice,
  SAMEN_AS_SECONDS,
} from './state/rewards'
export type { Reward, MultKey } from './state/rewards'
export { CONTEST_KG } from './extrasCore'
export { prestigeMinErnte } from './economy'
export { prestigeMultiplier } from './truhe'
export { GENERATOR_IDS } from './generators'
export { levelProgress, levelProductionMult } from './progression'
export { BRANCH_MAX_RANK, branchCost, efficiencyMult, capacityCostMult } from './branches'
export type { BranchKind } from './branches'
export type { AchievementId } from './achievements'
export type { QuestProgress } from './quests'
