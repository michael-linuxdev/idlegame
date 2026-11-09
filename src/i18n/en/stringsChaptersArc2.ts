/**
 * English copy for Arc II “Grandma’s Seed Letters” (chapters 20–29): the
 * gardens of Grandma’s pen friends, who swapped seeds with her by post for
 * decades. Same shape as stringsChapters.ts; spread in stringsExpansion.ts.
 */

interface Area {
  name: string
  blurb: string
  note: string
}

function a(name: string, blurb: string, note: string): Area {
  return { name, blurb, note }
}

export const arc2ChapterStrings = {
  /* —— Arc II: Grandma’s Seed Letters (chapters 20–29) —— */
  cottagegarten: {
    title: 'The Cotswold Cottage Garden',
    currency: 'Sweet Peas',
    chip: 'England',
    to: 'To the cottage garden',
    teaser: 'Chapter 20: The cottage garden in England — from halfway through the 14th generation, once the gherkin festival is on in the Spreewald.',
    intro: {
      title: 'A letter from England',
      body: [
        'Dear family,',
        'you wrote to tell me you found Grandma’s tin, with my letters inside. For forty-two years we wrote to each other, one letter and one packet every winter. I sent sweet peas; she sent “Blauhilde” beans. Her last letter is still on my mantelpiece.',
        'My garden is in a Cotswold village, between honey-colored stone cottages and hills full of sheep. It’s small and a little wild: hollyhocks by the wall, sweet peas on the fence, vegetables on the allotment at the edge of the village.',
        'In summer there’s the village flower show. Your grandmother once stood beside me at the table when my sweet peas won first prize. She clapped louder than anyone. Do come — the kettle’s already on.',
        'Warmly, Margaret Pryce',
      ],
      cta: 'Through the garden gate',
    },
    areas: {
      stockrosen: a('Hollyhock Border', 'Flowers taller than the wall.', '“Margaret’s hollyhocks are taller than she is. And she isn’t short.”'),
      wickenzaun: a('Sweet Pea Fence', 'Sweet peas in every color.', '“The more you pick, the more they flower.”'),
      gemueseparzelle: a('Allotment', 'Beans, leeks and rhubarb at the village edge.', '“An English allotment is just like ours at home. I felt welcome straight away.”'),
      steinmauer: a('Limestone Wall', 'Golden stone, no mortar.', '“Mason bees and houseleeks live in the cracks.”'),
      apfelspalier: a('Espalier Apples', 'Apples trained flat against the warm wall.', '“An espalier needs a trim every summer. And plenty of praise.”'),
      holzgewaechshaus: a('Wooden Greenhouse', 'Tomatoes and seedlings under glass.', '“Margaret’s greenhouse is older than her house. So she says.”'),
      teeplatz: a('Tea under the Oak', 'Tea at four, whatever the weather.', '“At Margaret’s there’s tea at four. Even in the rain. Especially in the rain.”'),
      geissblattlaube: a('Honeysuckle Arbour', 'Scent at dusk, a bench in the shade.', '“Honeysuckle smells strongest once it gets dark.”'),
      gartenschuppen: a('Potting Shed', 'Pots, twine and an old radio.', '“The radio in the shed is always on the gardening program.”'),
      dorfschau: a('Village Flower Show', 'Rosettes for the longest bean.', '“There are prizes for the longest bean, the finest sweet pea and the best cake.”'),
    },
  },
  tulpenfelder: {
    title: 'The Dutch Bulb Fields',
    currency: 'Bulbs',
    chip: 'Holland',
    to: 'To the bulb fields',
    teaser: 'Chapter 21: The bulb fields in Holland — from the 15th generation, once the village flower show is on at the cottage garden.',
    intro: {
      title: 'Post from the bulb fields',
      body: [
        'Beste familie — that’s how a letter starts in Dutch: “dear family”.',
        'My father swapped bulbs with your grandma for thirty years. She sent him snowdrops from her garden; he sent her tulips you can’t buy in any shop. When he died, a letter came from her that I still keep.',
        'In April our fields bloom in stripes, red, yellow, white and purple, all the way up to the dike. But for us the important part isn’t the flower, it’s the bulb. So we top the flowers early, to send the strength down into the bulb. Visitors are shocked every time.',
        'In autumn we plant the new bulbs. Then there’s time for coffee, and for you. We have plenty of bikes.',
        'Joost de Vries',
      ],
      cta: 'Between the rows',
    },
    areas: {
      tulpenreihen: a('Tulip Rows', 'Stripes of red, yellow and purple.', '“Joost tops the flowers so the bulbs grow fat. It broke my heart.”'),
      hyazinthen: a('Hyacinth Field', 'Heavy scent over the sand.', '“You smell hyacinths before you see them.”'),
      narzissen: a('Daffodil Meadow', 'Yellow under the trees.', '“The first daffodils come in March. Like Joost’s letters.”'),
      zwiebelscheune: a('Bulb Barn', 'Bulbs drying on wooden racks.', '“The barn is cool, airy and dark. Just how bulbs like it.”'),
      windmuehle: a('Windmill', 'Pumps the water out of the polder.', '“Without the mills, half the country would be underwater.”'),
      gracht: a('Canal and Bridge', 'Narrow water, a white drawbridge.', '“You can only cross on foot or by bike.”'),
      fahrradstall: a('Bike Shed', 'Bikes for every helper.', '“In Holland everyone has two bikes. At least.”'),
      versteigerung: a('Auction Hall', 'From here, flowers go all over the world.', '“The clock runs backward: whoever presses first, buys.”'),
      hausboot: a('Houseboat Garden', 'Herbs in boxes on the water.', '“A garden that rocks. Joost’s daughter lives in it.”'),
      tulpenmarkt: a('Tulip Market', 'Bright bunches on the square.', '“Here a bunch of tulips costs as little as a loaf of bread.”'),
    },
  },
  artischocken: {
    title: 'Sant’Erasmo Artichokes',
    currency: 'Artichokes',
    chip: 'Venice',
    to: 'To the artichoke island',
    teaser: 'Chapter 22: The artichoke island near Venice — from halfway through the 15th generation, once the tulip market is on in Holland.',
    intro: {
      title: 'From the vegetable island',
      body: [
        'Bondì! That’s “good day” in Venetian — not Italian, Venetian.',
        'I’m Giulia, and I grow artichokes on Sant’Erasmo, like my mother and my nonna. Sant’Erasmo is the lagoon’s vegetable island: no cars, no bridge to Venice, just fields, canals and boats. Your grandma sent my nonna calendula seeds, and Nonna sent back seeds of monk’s beard, a salty herb from the lagoon.',
        'Our artichoke is small and purple. The very first one on each plant is called the castraura. We cut it in April so the plant makes more side buds. It’s the most tender and the most expensive, and all of Venice waits for it.',
        'In May there’s the island festival, the sagra. Take the vaporetto, the water bus — I’ll be waiting at the landing with the boat.',
        'Giulia Zanon',
      ],
      cta: 'To the shore',
    },
    areas: {
      artischockenfeld: a('Artichoke Field', 'Purple buds on silver leaves.', '“The first artichoke is the castraura. Giulia’s nonna once sent me some, in oil.”'),
      lagunenwiese: a('Lagoon Meadow', 'Sea lavender between water and land.', '“The Venetians call these marshes barene.”'),
      bootsanleger: a('Boat Landing', 'Wooden posts, wooden boats.', '“Everything comes by boat here: seeds, post, the doctor.”'),
      kanalgarten: a('Canal Garden', 'Beds between narrow canals.', '“The water comes by itself. You only have to guide it.”'),
      granatapfelhecke: a('Pomegranate Hedge', 'Red flowers, red fruit.', '“The pomegranates shield the fields from the wind off the Adriatic.”'),
      salzgarten: a('Salt Garden', 'Monk’s beard and glasswort on the shore.', '“Monk’s beard grows where the salt drives everything else away. It tastes of the sea.”'),
      bootsschuppen: a('Boathouse', 'Oars, nets, tools.', '“Giulia’s boat is a sandolo, flat enough for any canal.”'),
      gemuesekahn: a('Vegetable Boat', 'The floating market stall.', '“At five in the morning the boat leaves for the Rialto market.”'),
      glockenturm: a('Bell Tower View', 'St. Mark’s tower on the horizon.', '“On clear days you can see the mountains behind the tower.”'),
      inselfest: a('Island Festival', 'Long tables, artichokes, music.', '“The whole island eats at one table.”'),
    },
  },
  beerenwald: {
    title: 'The Swedish Berry Woods',
    currency: 'Blueberries',
    chip: 'Sweden',
    to: 'To the berry woods',
    teaser: 'Chapter 23: The berry woods in Sweden — from the 16th generation, once the island festival is on at the artichoke island.',
    intro: {
      title: 'From the woods by the lake',
      body: [
        'Hej! That just means “hi”, and in Sweden it’s how you greet everyone, even the king.',
        'I’m Ingrid, a forester in Dalarna. Your grandmother and I met through a gardening magazine: she was looking for lingonberry seeds, I was looking for a kale that would survive our winters. Her “Frostkönig” still grows behind my red cabin.',
        'Here everyone has the right to roam: anyone may walk through the forest and pick berries and mushrooms, as long as they don’t damage anything or come too close to people’s houses. A garden that belongs to everyone, and nobody has to dig it.',
        'In June we celebrate midsummer, when it hardly gets dark. In winter it hardly gets light, but on clear nights the northern lights sometimes dance. Come whenever you like. The sauna is always warm.',
        'Ingrid Lund',
      ],
      cta: 'Into the woods',
    },
    areas: {
      heidelbeerhang: a('Blueberry Slope', 'Blue berries under the pines.', '“A berry comb is quicker. Fingers taste better.”'),
      preiselbeeren: a('Lingonberry Moss', 'Red berries on green moss.', '“Lingonberries go with everything. Even pancakes.”'),
      moltebeeren: a('Cloudberry Bog', 'Golden berries in the bog.', '“Cloudberries are so rare that nobody gives away their spots.”'),
      rotehuette: a('Red Cabin', 'Falu red with white corners.', '“The red paint comes from an old copper mine.”'),
      saftkueche: a('Juice Kitchen', 'Berries turn into juice and jam.', '“A cup of blueberry soup keeps cross-country skiers warm.”'),
      pilzlichtung: a('Mushroom Clearing', 'Chanterelles in the moss.', '“Only pick what you know for sure. Ingrid knows them all.”'),
      holzstapel: a('Woodpile', 'Birch and pine for the winter.', '“Here the stove burns every day, from October to April.”'),
      seesauna: a('Lakeside Sauna', 'Sweat first, then into the water.', '“In winter Ingrid jumps through a hole in the ice. I watched.”'),
      mittsommer: a('Midsummer Green', 'The midsummer pole with flower wreaths.', '“Midsummer is the brightest night of the year. Sleep can wait.”'),
      jedermannspfad: a('Right-to-Roam Trail', 'A path through the woods for everyone.', '“The forest belongs to everyone who treats it well.”'),
    },
  },
} as const
