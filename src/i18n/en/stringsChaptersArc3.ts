/**
 * English copy for Arc III “Where the Seeds Come From” (chapters 30–39): the
 * family follows the packets in Grandma’s seed tin back to where the plants
 * in her garden first came from. Same shape as stringsChapters.ts; spread in
 * stringsExpansion.ts.
 */

interface Area {
  name: string
  blurb: string
  note: string
}

function a(name: string, blurb: string, note: string): Area {
  return { name, blurb, note }
}

export const arc3ChapterStrings = {
  /* —— Arc III: Where the Seeds Come From (chapters 30–39) —— */
  andenkartoffeln: {
    title: 'The Andean Potato Terraces',
    currency: 'Potatoes',
    chip: 'Peru',
    to: 'To the terraces',
    teaser: 'Chapter 30: The potato terraces of the Andes — from halfway through the 19th generation, once the Pistachio Festival is on in Aegina.',
    intro: {
      title: 'A letter from the Andes',
      body: [
        'Allillanchu? That’s how we greet each other in Quechua: “Are you well?” And the answer is “Allillanmi”, “I am well”.',
        'I’m Rosa Quispe, an agronomist, and I live in a Quechua community above Pisac, not far from Cusco in Peru. In your grandma’s tin there’s a packet of tiny seeds with my mother’s address on it. They aren’t tubers, they’re seeds from the potato’s little green berries. Every seed grows into a new variety, and none is like its mother plant. My mother wrote with them: “So you can see how many potatoes there are in one potato.”',
        'The potato comes from here. The people of the Andes bred it from wild tubers about eight thousand years ago, in the mountains around Lake Titicaca. Our ancestors made thousands of varieties out of it, one for every slope and every kind of weather. It only reached Europe a little over four hundred and fifty years ago, on Spanish ships.',
        'We farm on andenes, stone terraces our ancestors set into the slopes. In June it’s the dry season here, and the nights are clear and icy. That’s when we make chuño, the way our grandparents showed us: the potatoes freeze at night, thaw in the sun by day, and we tread the water out with our feet. Dried like that, they keep for years.',
        'Come in June, and bring warm socks. Rosa Quispe',
      ],
      cta: 'Up the andenes',
    },
    areas: {
      andenes: a('Andenes', 'Stone terraces on the steep slope.', '“The walls store the warmth of the day, so less freezes at night. That’s what Rosa’s mother writes.”'),
      sortenbeet: a('Variety Bed', 'Red, blue, yellow and speckled tubers.', '“Rosa’s mother sent me a photo: one single bed, and every tuber looks different.”'),
      quinoafeld: a('Quinoa Field', 'Red and golden seed heads.', '“Quinoa isn’t a grain at all. It’s related to goosefoot and spinach.”'),
      chunoplatz: a('Chuño Yard', 'Potatoes freeze and dry.', '“Frost at night, sun by day, then tread them with your feet. That way a potato keeps for years.”'),
      lehmspeicher: a('Adobe Store', 'Cool, dark and airy.', '“They put muña, an Andean mint, between the tubers. It keeps the moths away.”'),
      alpakaweide: a('Alpaca Pasture', 'Soft wool, calm animals.', '“Alpaca dung feeds the terraces, and the wool gets spun. Nothing goes to waste.”'),
      bergkanal: a('Water Channel', 'Meltwater from the peaks.', '“The water comes down from the mountains. The community decides together who may water when.”'),
      webstube: a('Weaving Room', 'Looms and natural dyes.', '“They dye red with cochineal, a tiny insect that lives on cactus. Really.”'),
      kartoffelpark: a('Potato Park', 'Varieties that belong to everyone.', '“Several Quechua communities look after their varieties here together. Seed belongs to those who tend it, Rosa says.”'),
      kartoffelfest: a('Potato Festival', 'Harvest, music and an earth oven.', '“At harvest they build an oven out of clods of earth and bake the potatoes inside. It’s called huatia.”'),
    },
  },
  milpa: {
    title: 'The Milpa Fields of Mexico',
    currency: 'Corn',
    chip: 'Mexico',
    to: 'To the milpa',
    teaser: 'Chapter 31: The milpa fields of Mexico — from the 20th generation, once the Potato Festival is on in the Andes.',
    intro: {
      title: 'A letter from Michoacán',
      body: [
        '¡Buenos días, familia! That’s Spanish for “Good morning, family”.',
        'I’m Teodoro Hernández, a farmer in Michoacán, and I keep the corn varieties of my village: blue, red, yellow, white and speckled. In your grandma’s tin there’s a packet of squash seeds from my father. She sent him lamb’s lettuce in return. Nobody here knew it, and now we eat it all winter.',
        'Corn, beans and squash all come from Mexico. People here bred corn from a wild grass, teosinte, about nine thousand years ago, in the valley of the Balsas River, not far from us. A teosinte ear is hardly as long as a finger. Squash and beans became garden plants here too. Every bit of them in your garden started out here.',
        'We plant the three together, the way our grandparents did, and their grandparents before them. The beans climb up the corn stalks, the beans give strength to the soil, and the squash covers the ground with its big leaves. A field like that is called a milpa. The word comes from Nahuatl, a language more than a million people in Mexico still speak today, and means something like “in the field”.',
        'Come in the autumn, when the monarch butterflies arrive in our mountains from the north. Hasta pronto — “see you soon”! Teodoro Hernández',
      ],
      cta: 'Into the cornfield',
    },
    areas: {
      milpafeld: a('Milpa Field', 'Corn, beans and squash together.', '“The corn is the pole, the bean feeds the soil, the squash keeps the ground moist. The three help each other.”'),
      chiligarten: a('Chili Garden', 'Green, red, hot and hotter.', '“Chilli is a Nahuatl word. So is tomato: tomatl.”'),
      amaranth: a('Amaranth', 'Red plumes, tiny seeds.', '“They make sweets from puffed amaranth and honey. They’re called alegría, which means joy.”'),
      comalkueche: a('Comal Kitchen', 'Tortillas on the hot griddle.', '“The corn is cooked with lime and then ground. Only then is it truly nourishing.”'),
      maisspeicher: a('Corn Crib', 'Cobs in every color.', '“Blue, red, yellow, white, speckled: every family saves its own varieties.”'),
      agavenzaun: a('Agave Hedge', 'A fence that prickles and blooms.', '“An agave flowers only once in its life. Then it sends up a stalk as tall as a house.”'),
      meliponen: a('Stingless Bees', 'Small bees in hollow logs.', '“Melipona bees don’t sting. Their honey is so precious that people take it as medicine.”'),
      saatgutkruege: a('Seed Jars', 'Clay jars full of seed.', '“The finest cobs don’t go in the pot, they go in the jar. For next year.”'),
      markttag: a('Market Day', 'Beans, squash flowers, chilies.', '“The market is called a tianguis. That word comes from Nahuatl too.”'),
      erntefeier: a('Harvest Feast', 'Elotes, music and marigolds.', '“At harvest there are elotes: boiled corn cobs with chili and lime. I would have loved to be there.”'),
    },
  },
  kaffeewald: {
    title: 'The Ethiopian Coffee Forest',
    currency: 'Coffee',
    chip: 'Ethiopia',
    to: 'Into the coffee forest',
    teaser: 'Chapter 32: The coffee forest in Ethiopia — from halfway through the 20th generation, once the harvest feast begins in the milpa.',
    intro: {
      title: 'Post from the coffee forest',
      body: [
        'Selam! That’s Amharic, one of the languages of Ethiopia, and it means “peace”. It’s how we greet each other.',
        'I’m Almaz Tesfaye, and I grow coffee in the highlands of Kaffa in southwestern Ethiopia. My mother once sent your grandma unroasted coffee beans to sow. They grew into a little tree on her kitchen windowsill, she wrote to us proudly. Did it ever flower? Here, coffee flowers after the first rain, pure white, and smells like jasmine.',
        'The Arabica coffee people drink almost everywhere in the world comes from the mountain forests here. It still grows wild here today, in the shade of tall trees. We look after the forest instead of clearing it: under the canopy the soil stays moist, and the bees pollinate the flowers.',
        'When guests come, we make coffee together. The green beans are roasted in a pan, crushed in a mortar and brewed in a jebena, a clay pot. There are three rounds. The third is called baraka, which means blessing.',
        'Come after the first rain, when the forest flowers white. The pot is already on the fire. Almaz Tesfaye',
      ],
      cta: 'Under the canopy',
    },
    areas: {
      waldkaffee: a('Forest Coffee', 'Coffee shrubs under tall trees.', '“Coffee doesn’t like blazing sun. In the forest it stands as if under an umbrella.”'),
      pflueckplatz: a('Picking Spot', 'Only the red cherries.', '“They pick several times, only ever the ripe cherries. The green ones can wait.”'),
      trockenbetten: a('Drying Beds', 'Cherries drying in the sun.', '“The beds stand on stilts so air can get underneath. They’re turned every day.”'),
      ensetegarten: a('Ensete Garden', 'The false banana.', '“Ensete looks like a banana, but you eat the stem. They make kocho from it, a bread that keeps for a long time.”'),
      honigbaeume: a('Honey Trees', 'Hives high up in the branches.', '“The bark hives hang high up in the trees. The honey tastes of the forest.”'),
      waschplatz: a('Washing Spot', 'Clear water for sorting.', '“Good cherries sink, bad ones float. That’s how simply the stream sorts them.”'),
      tukul: a('Tukul', 'A round house with a thatched roof.', '“A tukul is round, made of wood and clay, with a pointed straw roof.”'),
      roestpfanne: a('Roasting Pan', 'Green beans turning brown.', '“After roasting, the pan is passed round so everyone can smell it. That’s part of it.”'),
      kaffeezeremonie: a('Coffee Ceremony', 'Three rounds, incense and grass.', '“Fresh grass on the floor, incense, popcorn on the side. And nobody is in a hurry.”'),
      kaffeemarkt: a('Coffee Market', 'Sacks, honey and spices.', '“The market smells of coffee, honey and korarima, a spice from the forest.”'),
    },
  },
  reisterrassen: {
    title: 'The Balinese Rice Terraces',
    currency: 'Rice',
    chip: 'Bali',
    to: 'To the rice terraces',
    teaser: 'Chapter 33: The rice terraces of Bali — from the 21st generation, once the coffee market opens in the coffee forest.',
    intro: {
      title: 'A letter from Bali',
      body: [
        'Om Swastiastu! That’s how people greet each other on Bali. It means roughly: “May all be well with you.”',
        'I’m Made Wirawan, and I share out the water for our subak in Jatiluwih, at the foot of Mount Batukaru. In your grandma’s tin there’s a packet of red rice from my father. Your grandma grew it every summer in a zinc tub on her patio, she wrote, and never harvested more than a handful. She was delighted every time.',
        'Rice doesn’t come from Bali. Wild rice grew in the marshes along the Yangtze in China, and people there began to farm it about nine thousand years ago. With farmers who sailed across the sea, it traveled from island to island until it reached us. What comes from here is a way of sharing water.',
        'Subak is the name for the community of rice farmers, and it has existed for more than a thousand years. The water comes from the mountains, flows through channels and tunnels and is split at stone dividers so that every field gets enough, even the lowest one. When to plant, we decide together at the water temple.',
        'Come when the fields are flooded and mirror the sky. Om Shanti Shanti Shanti Om — “peace, peace, peace”. Made Wirawan',
      ],
      cta: 'Along the water',
    },
    areas: {
      sawah: a('Rice Fields', 'Green, then gold, then a mirror of water.', '“Sawah means a wet rice field. Made writes that you can watch the clouds drift by in it.”'),
      wasserteiler: a('Water Divider', 'Every field gets its share.', '“A stone with two openings, one wide, one narrow. Whoever has more fields gets more water.”'),
      wassertempel: a('Water Temple', 'A shrine at the spring.', '“At the temple they decide when to plant. Then the fields above and below keep the same rhythm.”'),
      kokospalmen: a('Coconut Palms', 'Nuts, fronds and shade.', '“Every part of the palm gets used: nut, sap, fronds and wood.”'),
      entenweide: a('Duck Field', 'Ducks in single file.', '“My runner ducks that eat the slugs at home have ancestors on these islands. I never knew.”'),
      lumbung: a('Lumbung', 'A rice barn on stilts.', '“Under the tall roof the rice stays dry. Round discs on the posts keep the rats out.”'),
      hanggarten: a('Hillside Vegetables', 'Chilies, beans and herbs.', '“Between the terraces grow chilies, long beans and lemongrass.”'),
      bambusbruecke: a('Bamboo Bridge', 'Light and strong over the channel.', '“Three thick poles, tied with fiber. They carry the rice sheaves home across it.”'),
      flechtwerkstatt: a('Weaving Shed', 'Baskets and trays of palm leaf.', '“Every morning they weave little trays of palm leaf, with flowers and rice inside. They’re called canang.”'),
      tempelfest: a('Temple Harvest', 'Offerings and gamelan music.', '“At harvest they give thanks to Dewi Sri, the goddess of rice. The offerings are as tall as a person.”'),
    },
  },
  gewuerzgarten: {
    title: 'The Kerala Spice Garden',
    currency: 'Pepper',
    chip: 'Kerala',
    to: 'To the spice garden',
    teaser: 'Chapter 34: The spice garden in Kerala — from halfway through the 21st generation, once the temple harvest is celebrated on Bali.',
    intro: {
      title: 'A letter from Kerala',
      body: [
        'Namaskaram! That’s how we greet each other in Malayalam, the language of Kerala, with our palms pressed together.',
        'I’m Anjali Menon, and I grow spices in the hills above the backwaters in the south of India. In your grandma’s tin there’s a packet of black peppercorns with my grandmother’s address on it. They never sprouted: pepper is grown from cuttings, as my grandmother wrote back straight away. Your grandma kept the peppercorns anyway and sent us cornflowers for our flower carpet. Blue was the color we were missing.',
        'Black pepper comes from the forests of our mountains, the Western Ghats. It’s a climber and winds its way up trees, here up jackfruit and coral trees. More than two thousand years ago, ships from Rome were already sailing to our coast for pepper. Every pepper pot in Europe started out here.',
        'In June the monsoon comes. Then it rains for weeks, and flower spikes appear on the vines. We harvest in winter, when the first berries turn red. On mats in the sun, the green peppercorns turn black and wrinkly. Cardamom grows here in the shade, and ginger and turmeric in the soil in between.',
        'Come for Onam, our harvest festival in late summer. Then every family lays a carpet of flowers in front of the house. Yours, Anjali Menon',
      ],
      cta: 'Between the vines',
    },
    areas: {
      pfefferranken: a('Pepper Vines', 'Up the tree, spikes full of peppercorns.', '“Pepper climbs like ivy. Picked green and dried, it turns black.”'),
      kardamom: a('Cardamom', 'In the shade, pods near the ground.', '“The pods grow right at the bottom, almost on the soil. You have to bend down to pick them.”'),
      zimtbaeume: a('Cinnamon Trees', 'Bark that curls up.', '“Cinnamon is the bark of young shoots. As it dries, it rolls up all by itself.”'),
      ingwerbeet: a('Ginger Bed', 'Hot knobs under green stalks.', '“Ginger isn’t a root, it’s an underground stem. It’s still hot, though.”'),
      kurkuma: a('Turmeric', 'Yellow to the fingertips.', '“Whoever harvests turmeric has yellow fingers for days.”'),
      muskatbaum: a('Nutmeg Tree', 'A nut in a red net.', '“The nut sits in a red net called mace. One tree, two spices.”'),
      trockenmatten: a('Drying Mats', 'Green peppercorns turning black.', '“A few days of sun, and green peppercorns become black pepper.”'),
      bootssteg: a('Houseboat Jetty', 'On the still water of the backwaters.', '“These boats used to carry rice and pepper to the port of Kochi. Now guests sleep in them.”'),
      gewuerzlager: a('Spice Store', 'Sacks, crates and a big smell.', '“The store smells of pepper, cinnamon and cardamom all at once. You sneeze and smile.”'),
      pookalam: a('Onam Flower Carpet', 'A circle of flowers by the house.', '“For ten days the flower carpet grows by one ring each day. It’s called a pookalam.”'),
    },
  },
} as const
