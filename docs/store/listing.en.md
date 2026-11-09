# Heirloom Garden — Store listing (English draft)

> Before submitting: **trademark search for “Heirloom Garden”** (stores, USPTO/EUIPO class 9 + 41, web — see `docs/i18n/glossar.md`), privacy-policy URL, age rating, **`DISTRIBUTION = 'store'` and `TEST_PHASE = false` in `src/game/distribution.ts`**. Terms follow `docs/i18n/glossar.md`; the German listing is `listing.md`.

## Name
**Heirloom Garden**

## Subtitle (App Store, max. 30 characters)
From overgrown plot to park  *(27)*

## Short description (Google Play, max. 80 characters)
Inherit Grandma’s overgrown garden and grow it into a park. Grows offline too.  *(78)*

## Description
Grandma has left you her allotment garden. It’s rather overgrown – but under the brambles there’s good soil.

Clear, plant, upgrade: step by step, a single vegetable patch becomes a blooming garden park with a herb spiral, fruit trees, a beehive, a chicken coop, a greenhouse, a farm shop and Grandma’s dream – an orangery of your own.

**A garden that grows with you**
• Ten garden areas, each with five visible upgrade stages
• Wilderness that disappears corner by corner
• Times of day and seasons: autumn leaves, frost, blossom and fireflies

**Grandma’s notebook**
• Letters from Grandma guide you through every garden year
• A handwritten note for every bed
• A real ending – and a new beginning

**Relaxed play**
• Your garden keeps growing while you’re away
• Water, harvest, upgrade – a few minutes a day is enough
• Season’s End and winter rest: heirlooms make every garden year richer
• Deep Winter for everyone who wants to garden for the long haul

**A little German garden culture**
• Allotment clubs, the Lantern Festival, Advent and Erntedank – the German harvest thanksgiving – each with its own decorations

**Fair**
• No energy limits, no time pressure
• Ads only if you choose them, for a reward
• No account, no tracking – your garden stays on your device

## Keywords (App Store, max. 100 characters)
garden,idle,allotment,vegetable,tycoon,builder,relaxing,cozy,grandma,harvest,offline,farm  *(89)*

## Category
Games › Simulation (secondary: Casual)

## Age rating
PEGI 3 / ESRB Everyone / App Store 4+ — no violence, no chat, optional purchases.

## What’s new in this version
First release: Grandma’s garden, ten garden areas, Grandma’s notebook, Season’s End and Deep Winter — now in English, too.

## Graphics
| File | Use |
|---|---|
| `screenshots-en/01-grandmas-letter.png` … `06-winter-rest.png` | App Store 6.7″ (1290×2796), also for Google Play |
| `feature-graphic-en-1024x500.png` | Google Play feature graphic (`node scripts/store/feature-graphic.mjs en <screenshot> <out>`) |
| `app-icon-1024.png` | App Store icon 1024×1024, no transparency |

Regenerate the screenshots: `npm run build`, `npx vite preview --port 4175`, then `node scripts/store/screenshots.cjs docs/store/screenshots-en en`.

## Note on the app name
The web manifest (PWA) carries one name only: **Gartenerbe**. Store builds get the name per language from this file.
