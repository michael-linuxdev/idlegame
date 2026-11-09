/**
 * English copy for Arc IV “Seeds for Tomorrow” (chapters 40–49): the next
 * generation takes over. Grandma’s seed tin is almost empty, and Mila (Jonas’s
 * daughter) fills it again with seeds from the gardens of the future. From here
 * on the area notes are Mila’s, written in Grandma’s notebook. Same shape as
 * stringsChapters.ts; spread in stringsExpansion.ts.
 */

interface Area {
  name: string
  blurb: string
  note: string
}

function a(name: string, blurb: string, note: string): Area {
  return { name, blurb, note }
}

export const arc4ChapterStrings = {
  /* —— Arc IV: Seeds for Tomorrow (chapters 40–49) —— */
  dachgarten: {
    title: 'The Rooftop Garden',
    currency: 'Lettuce',
    chip: 'Rooftop',
    to: 'Up to the roof',
    teaser: 'Chapter 40: The rooftop garden — from the middle of the 24th generation, once Chuseok is celebrated in Korea.',
    intro: {
      title: 'Post from the roof',
      body: [
        'Hi, everyone,',
        'I’m Mila, Jonas’s daughter. You gave me Grandma’s notebook, the one with the soil stains and the seed packets glued in. There were still empty pages at the back. From now on, I’m writing in it.',
        'Grandma’s tin is almost empty. She sent seeds out all her life, and I think it’s our turn to fill the tin again: with seeds for tomorrow, from gardens that hardly existed in Grandma’s day.',
        'I want to start at the very top, on the roof of the old parking garage next to Dad’s backyard. Dad did the math: a roof that carries cars can carry flower beds too. It’s windy and hot up there, but there’s room for lettuce, for wild bees and for a glass dome that stays green even in winter.',
        'Bring soil. The elevator works. Mostly. Mila',
      ],
      cta: 'Up the stairs',
    },
    areas: {
      dachbeete: a('Roof Beds', 'Lettuce in shallow boxes.', '“Everything dries out faster up here. I water in the morning before school, Dad in the evening after work.”'),
      bienendach: a('Wild Bee Roof', 'Flowering cushions on the gravel.', '“The roof gets stonecrop. It stores water in its fat leaves, and wild bees sit on its yellow flowers.”'),
      dachkuppel: a('Glass Dome', 'A greenhouse like a soap bubble.', '“Lamb’s lettuce grows in the dome all winter. Outside it’s freezing, inside the panes fog up.”'),
      dachtank: a('Rainwater Tank', 'Every shower fills the tank.', '“A bare roof sends the rain straight into the sewer. Ours holds on to it and gives it slowly to the beds.”'),
      solarpergola: a('Solar Pergola', 'Power above, shade below.', '“The solar panels run the pump at the tank. And underneath is the only shade on the whole roof.”'),
      kraeuterbalkon: a('Herb Balcony', 'Boxes on the railing.', '“Thyme, sage and rosemary like it hot and dry. For them the roof is like a holiday by the Mediterranean.”'),
      lastenaufzug: a('Freight Elevator', 'Soil up, harvest down.', '“Forty sacks of soil went up today. The elevator squeaked, but it held out.”'),
      dachcafe: a('Rooftop Café', 'Lettuce with a view.', '“The café serves lettuce from the bed two meters away. A path can’t get any shorter.”'),
      saatgutschrank: a('Seed Cabinet', 'A cabinet for Grandma’s tin.', '“Grandma’s tin lives here now. Whoever takes seeds writes down where they’ll grow, and brings new ones in autumn.”'),
      abendrotfest: a('Sunset Party', 'When the city glows red.', '“When the sun sets behind the cranes, the roof goes very quiet. Then someone gets out a guitar.”'),
    },
  },
  schulgarten: {
    title: 'The School Garden',
    currency: 'Radishes',
    chip: 'School',
    to: 'To the school garden',
    teaser: 'Chapter 41: The school garden — from the 25th generation, once the sunset party starts on the roof.',
    intro: {
      title: 'From the staff room',
      body: [
        'Dear family,',
        'you know us from the orders: the Yilmaz family. We used to order vegetables from your grandmother, and now we order them from you. I’m the one who always orders too many radishes.',
        'I teach science and social studies at the elementary school behind the park. Until last year our schoolyard was nothing but asphalt. Then Mila, a former student of mine, turned up at my door with an idea and a spade. Now every class has a bed, and the children argue about whose radishes turn red first.',
        'Radishes are made for children: you can pull them after a little over four weeks, and hardly any vegetable is quicker. And children who sowed something themselves suddenly try things that are green.',
        'Only summer vacation worries me. Six weeks without school, and the beds get thirsty. We need a watering schedule, and perhaps we need you.',
        'Warm regards, Derya Yilmaz',
      ],
      cta: 'Into the schoolyard',
    },
    areas: {
      klassenbeete: a('Class Beds', 'One bed for every class.', '“Class 2b gave every radish a name tag. Every single one.”'),
      schulkompost: a('School Compost', 'Lunch leftovers become soil.', '“Apple cores yes, ham sandwiches no. It’s written in big letters on the lid now.”'),
      insektenhaus: a('Bug Hotel', 'Holes in wood and stems.', '“The holes have to be drilled smooth, without splinters. Otherwise the wild bees tear their wings.”'),
      weidentipi: a('Willow Tipi', 'A tent that grows.', '“In winter you push willow rods into the ground, and in spring they sprout. Every year the tent gets thicker.”'),
      barfusspfad: a('Barefoot Trail', 'Bark, gravel, sand and moss.', '“Close your eyes and guess what you’re standing on. Pine cones are mean.”'),
      kraeuterschnecke: a('Herb Snail', 'A spiral of stones.', '“Dry at the top for thyme, damp at the bottom for mint. Like Grandma’s herb spiral, only child-sized.”'),
      schulkueche: a('School Kitchen', 'Radish sandwiches for all.', '“Today it was radish sandwiches with chives. Even the ones who don’t like radishes wanted two.”'),
      gartenhuette: a('Garden Shed', 'Small cans, small spades.', '“Every watering can has a class sign on it. Still, three go missing every Friday.”'),
      pausenbeet: a('Playground Bed', 'A raised bed between the games.', '“The raised bed stands right in the middle of the playground. Whoever plays soccer now dribbles around the strawberries.”'),
      schulfest: a('School Harvest Fair', 'The whole school celebrates.', '“The children sell radishes, ten cents a bunch. With the money they buy seeds for next year.”'),
    },
  },
  waldgarten: {
    title: 'The Forest Garden',
    currency: 'Hazelnuts',
    chip: 'Forest',
    to: 'Into the forest garden',
    teaser: 'Chapter 42: The forest garden — from the middle of the 25th generation, once the school holds its harvest fair.',
    intro: {
      title: 'A forest you can eat',
      body: [
        'Hello, you lot,',
        'remember Fritz’s Red, the apple from my grandpa’s seeds? It stands in a forest now. Behind the tree nursery I’ve turned a field into a forest garden.',
        'A forest garden is built like the edge of a wood, except that nearly everything in it is edible. Seven layers: nut and fruit trees at the top, hazel and small trees below them, then berry bushes, herbs, ground cover, tubers in the soil and climbers scrambling up everywhere.',
        'You hardly dig and you water very little, and every year there’s more. Mila was here in spring and helped me plug mushroom spawn into beech logs. She says it’s the only garden that looks after itself. That’s not quite true. But nearly.',
        'Come in autumn, when the hazelnuts fall. The jays are faster than us, sadly. Lena',
      ],
      cta: 'Under the trees',
    },
    areas: {
      kronenschicht: a('Canopy Layer', 'Walnut and sweet chestnut.', '“Walnut and sweet chestnut stand at the very top. Lena says you plant those for your grandchildren.”'),
      haselhecke: a('Hazel Hedge', 'Nuts in green husks.', '“Hazel flowers as early as February. The yellow catkins are the male flowers; the female ones are tiny and red.”'),
      beerenschicht: a('Berry Layer', 'Currants in half shade.', '“Currants and gooseberries cope well with half shade. They’re happy under the trees.”'),
      kraeuterschicht: a('Herb Layer', 'Wild garlic, mint, comfrey.', '“Comfrey has roots that reach deep down. We lay its leaves under the other plants as mulch.”'),
      bodendecker: a('Ground Cover', 'Wild strawberries, not bare soil.', '“Wild strawberries cover the ground like a carpet. Underneath it stays damp, and weeds hardly get a chance.”'),
      kletterpflanzen: a('Climbers', 'Hardy kiwis and hops climb high.', '“Hardy kiwis are as small as gooseberries and have no fuzz. You eat them skin and all.”'),
      pilzstaemme: a('Mushroom Logs', 'Beech logs full of mushrooms.', '“We drilled holes in the logs and plugged in mushroom spawn. After a little over a year the first shiitake came.”'),
      weidenteich: a('Willow Pond', 'Water for toads and dragonflies.', '“Common toads live by the pond. They eat the slugs before the slugs find the lettuce.”'),
      lehrpfad: a('Nature Trail', 'Seven signs for seven layers.', '“You can’t see the seventh layer: tubers and roots under the ground. That’s why the last sign points down.”'),
      waldgartenfest: a('Forest Garden Party', 'Nut cake under the trees.', '“At the party there was hazelnut cake, wild strawberries and mint tea. All from the forest, except the sugar.”'),
    },
  },
  samenbank: {
    title: 'The Seed Bank',
    currency: 'Seed Samples',
    chip: 'Seed Bank',
    to: 'To the seed bank',
    teaser: 'Chapter 43: The seed bank — from the 26th generation, once the forest garden throws its party.',
    intro: {
      title: 'Post from the seed bank',
      body: [
        'Dear family,',
        'my name is Amara Okafor, and I run a small seed bank on the edge of the city. Mila asked me whether we know a particular pole bean. We do. Your grandmother sent us a handful many years ago, a variety that could no longer be found anywhere else. Her name is in our archive.',
        'A seed bank isn’t a museum. We dry the seeds, put them in jars and store them at minus 18 degrees Celsius. That way many kinds keep for decades. Every few years we do a germination test: we lay a hundred seeds on damp paper and count how many sprout. If too few do, we sow the variety again and harvest fresh seed.',
        'On Svalbard there is a great vault inside a mountain where countries keep backup copies of their seeds. Ours is much smaller and sits in a basement. But it does the same thing: it keeps something safe for later.',
        'My grandmother in Nigeria hung her corn cobs over the cooking fire so the smoke would keep the beetles away. Your grandmother had a tin. I think the two of them would have got on well.',
        'Come to our open house, and bring a jacket. It’s cold in the vault. Dr. Amara Okafor',
      ],
      cta: 'Through the glass door',
    },
    areas: {
      vermehrungsbeete: a('Seed Beds', 'Where fresh seed grows back.', '“Every variety gets its own bed, far away from the others. Otherwise they cross, Amara says.”'),
      reinigungsraum: a('Cleaning Room', 'Sieve, blow, sort.', '“First the sieves, then a blower that puffs away the light chaff. At the end Amara sorts with tweezers.”'),
      keimlabor: a('Germination Lab', 'A hundred seeds on damp paper.', '“94 of Grandma’s 100 beans sprouted. Amara smiled.”'),
      kuehltresor: a('Cold Vault', 'Minus 18 degrees, jar by jar.', '“In the vault I could see my breath. Thousands of jars, and every one has a number.”'),
      sortengarten: a('Variety Garden', 'Old varieties on show.', '“Forty tomatoes side by side: striped, yellow, almost black. I didn’t know there were so many.”'),
      samenarchiv: a('Archive', 'Index cards and letters of origin.', '“Every variety has a card: who sent it, from where and when. One of them has Grandma’s name on it.”'),
      bestaeuberzelte: a('Pollination Tents', 'Nets, bumblebees, one variety per tent.', '“A small bumblebee colony hums in every tent. That way the bumblebees only pollinate the variety inside.”'),
      versandstelle: a('Mail Room', 'Packets for gardens everywhere.', '“Any garden can order samples. Today I labeled two hundred packets. Like Grandma.”'),
      besucherpfad: a('Visitor Path', 'Signs, windows and wonder.', '“Through a window you can look into the vault. The children press their noses against the glass.”'),
      offenertag: a('Open House', 'Everyone may take a packet home.', '“Today everyone could take a packet home. I slipped two into Grandma’s tin.”'),
    },
  },
  klimagarten: {
    title: 'The Climate Garden',
    currency: 'Rainwater',
    chip: 'Climate',
    to: 'Into the climate garden',
    teaser: 'Chapter 44: The climate garden — from the middle of the 26th generation, once the seed bank opens its doors.',
    intro: {
      title: 'A garden for hot summers',
      body: [
        'Hi, all of you,',
        'last summer it didn’t rain in the city for six weeks, and then so much fell in a single afternoon that the basements flooded. As a city planner I’m learning what gardeners have known for a long time: you have to hold on to water when it comes.',
        'On a patch of wasteland by the river we’re building a climate garden. The idea is called a sponge city: instead of sending the rain into pipes, we let it soak into hollows and beds and collect it in a cistern. Then in August we water with it.',
        'On top of that: mulch on every bed, trees for shade, plants that know drought, and mixed planting like Grandma did. Mila has built a weather station that reports every morning whether we need to water.',
        'Come in summer, when it’s hot. Then you’ll see how good shade feels. Jonas',
      ],
      cta: 'Into the shade',
    },
    areas: {
      trockenbeet: a('Dry Bed', 'Plants that know the heat.', '“Lavender, sage and stonecrop get through summer with hardly any watering. Dad calls them the calm ones.”'),
      schwammflaeche: a('Sponge Hollow', 'A dip that swallows rain.', '“In a downpour the water runs off the path into the hollow and slowly soaks away. By the next day it’s dry again.”'),
      mulchwege: a('Mulch Paths', 'Wood chips keep the soil moist.', '“Under the mulch the soil is dark and cool even in August. I checked with my hand.”'),
      schattenbaum: a('Shade Tree', 'A linden against the heat.', '“Under the linden it’s noticeably cooler than on the square next to it. My weather station measured it.”'),
      zisternenspiel: a('Cistern Play', 'Pump, gutters, wet feet.', '“The children pump water from the cistern into wooden gutters. In the end it lands in the bed. And sometimes in their shoes.”'),
      mischkultur: a('Mixed Planting', 'Carrots next to onions.', '“Carrots and onions side by side are meant to keep each other’s flies away. Grandma already did it that way.”'),
      windhecke: a('Windbreak Hedge', 'Shrubs slow the wind.', '“Wind dries out the soil almost as fast as the sun. Behind the hedge it stays damper.”'),
      wetterstation: a('Weather Station', 'Rain, wind and soil moisture.', '“My station measures rain, wind and how damp the soil is. Every morning a message comes: water or not.”'),
      lehrkueche: a('Teaching Kitchen', 'Cooking with what likes the heat.', '“Today it was roast vegetables with chickpeas from the dry bed. Whether they’ll ripen here every year, we don’t know yet.”'),
      klimatag: a('Climate Day', 'The whole city is watching.', '“People from the town hall came for Climate Day. Now every neighborhood is supposed to get a sponge hollow.”'),
    },
  },
} as const
