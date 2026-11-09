/**
 * German copy for Bogen III „Wo die Samen herkommen“ (Kapitel 30–39): Die
 * Familie folgt den Tütchen aus Omas Dose zu den Ursprüngen dessen, was in
 * Omas Garten wächst. Jedes Kapitel erzählt, woher eine Pflanze stammt.
 * Aufbau wie stringsChapters.ts; wird in stringsExpansion.ts eingespreizt.
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
  /* —— Bogen III: Wo die Samen herkommen (Kapitel 30–39) —— */
  andenkartoffeln: {
    title: 'Kartoffeln der Anden',
    currency: 'Kartoffeln',
    chip: 'Peru',
    to: 'Zu den Terrassen',
    teaser: 'Kapitel 30: Die Kartoffelterrassen in den Anden — ab der Mitte der 19. Generation, wenn auf Ägina das Pistazienfest gefeiert wird.',
    intro: {
      title: 'Ein Brief aus den Anden',
      body: [
        'Allillanchu? So fragen wir auf Quechua zur Begrüßung: „Geht es euch gut?“ Und man antwortet: „Allillanmi“, „Es geht gut“.',
        'Ich bin Rosa Quispe, Agronomin, und lebe in einer Quechua-Gemeinde oberhalb von Pisac, nicht weit von Cusco in Peru. In der Dose eurer Großmutter liegt ein Tütchen mit winzigen Samen und der Adresse meiner Mutter. Das sind keine Knollen, sondern Samen aus den kleinen grünen Beeren der Kartoffel. Aus jedem Samen wächst eine neue Sorte, keine gleicht der Mutterpflanze. Meine Mutter schrieb dazu: „Damit ihr seht, wie viele Kartoffeln in einer Kartoffel stecken.“',
        'Die Kartoffel stammt von hier. Die Menschen der Anden haben sie vor rund achttausend Jahren aus wilden Knollen gezogen, in den Bergen um den Titicacasee. Unsere Vorfahren haben daraus Tausende Sorten gemacht, für jeden Hang und jedes Wetter eine. Nach Europa kam die Kartoffel erst vor gut vierhundertfünfzig Jahren, mit den Schiffen der Spanier.',
        'Wir bauen auf Andenes, Terrassen aus Stein, die unsere Vorfahren an die Hänge gesetzt haben. Im Juni ist bei uns Trockenzeit, die Nächte sind klar und eisig. Dann machen wir Chuño, so wie es uns unsere Großeltern gezeigt haben: Die Kartoffeln frieren nachts, tauen am Tag in der Sonne, und wir treten das Wasser mit den Füßen heraus. So getrocknet halten sie viele Jahre.',
        'Kommt im Juni und bringt warme Socken mit. Rosa Quispe',
      ],
      cta: 'Auf die Andenes',
    },
    areas: {
      andenes: a('Andenes', 'Steinterrassen am steilen Hang.', '„Die Mauern speichern die Wärme des Tages. So erfriert in der Nacht weniger, schreibt Rosas Mutter.“'),
      sortenbeet: a('Sortenbeet', 'Rote, blaue, gelbe, gefleckte Knollen.', '„Rosas Mutter hat mir ein Foto geschickt: ein einziges Beet, und jede Knolle sieht anders aus.“'),
      quinoafeld: a('Quinoafeld', 'Rote und goldene Rispen.', '„Quinoa ist gar kein Getreide. Sie ist mit dem Gänsefuß und dem Spinat verwandt.“'),
      chunoplatz: a('Chuño-Platz', 'Kartoffeln frieren und trocknen.', '„Nachts Frost, am Tag Sonne, dann mit den Füßen treten. So hält eine Kartoffel jahrelang.“'),
      lehmspeicher: a('Lehmspeicher', 'Kühl, dunkel und luftig.', '„Zwischen die Knollen legen sie Muña, eine Minze der Anden. Die hält die Motten fern.“'),
      alpakaweide: a('Alpakaweide', 'Weiche Wolle, ruhige Tiere.', '„Der Mist der Alpakas düngt die Terrassen, die Wolle wird gesponnen. Nichts geht verloren.“'),
      bergkanal: a('Wasserkanal', 'Schmelzwasser von den Gipfeln.', '„Das Wasser kommt aus den Bergen. Die Gemeinde legt gemeinsam fest, wer wann bewässern darf.“'),
      webstube: a('Webstube', 'Webrahmen und Naturfarben.', '„Rot färben sie mit Cochenille, einer Laus, die auf Kakteen lebt. Wirklich.“'),
      kartoffelpark: a('Kartoffelpark', 'Sorten, die allen gehören.', '„Mehrere Quechua-Gemeinden hüten hier ihre Sorten gemeinsam. Saatgut gehört denen, die es pflegen, sagt Rosa.“'),
      kartoffelfest: a('Kartoffelfest', 'Ernte, Musik und Erdofen.', '„Zur Ernte bauen sie aus Erdklumpen einen Ofen und garen die Kartoffeln darin. Huatia heißt das.“'),
    },
  },
  milpa: {
    title: 'Milpa in Mexiko',
    currency: 'Mais',
    chip: 'Mexiko',
    to: 'Zur Milpa',
    teaser: 'Kapitel 31: Die Milpa in Mexiko — ab der 20. Generation, wenn in den Anden das Kartoffelfest gefeiert wird.',
    intro: {
      title: 'Ein Brief aus Michoacán',
      body: [
        '¡Buenos días, familia! Das ist Spanisch und heißt „Guten Tag, Familie“.',
        'Ich bin Teodoro Hernández, Bauer in Michoacán, und ich hebe die Maissorten meines Dorfes auf: blaue, rote, gelbe, weiße und gefleckte. In der Dose eurer Großmutter liegt ein Tütchen Kürbiskerne von meinem Vater. Sie schickte ihm dafür Feldsalat. Den kannte hier niemand, heute essen wir ihn im Winter.',
        'Mais, Bohnen und Kürbis stammen aus Mexiko. Den Mais haben die Menschen hier vor etwa neuntausend Jahren aus einem wilden Gras gezogen, der Teosinte, im Tal des Balsas-Flusses, nicht weit von uns. Ein Teosinte-Kolben ist kaum so lang wie ein Finger. Auch Kürbis und Bohne wurden hier zu Gartenpflanzen. Alles, was bei euch davon im Beet steht, hat hier angefangen.',
        'Wir pflanzen die drei zusammen, wie es unsere Großeltern getan haben und deren Großeltern. An den Maisstängeln klettern die Bohnen hinauf, die Bohnen geben dem Boden Kraft, und der Kürbis deckt mit seinen großen Blättern die Erde zu. So ein Feld heißt Milpa. Das Wort kommt aus dem Nahuatl, einer Sprache, die in Mexiko bis heute mehr als eine Million Menschen sprechen, und heißt ungefähr „auf dem Feld“.',
        'Kommt im Herbst, wenn die Monarchfalter aus dem Norden in unsere Berge ziehen. Hasta pronto — „bis bald“! Teodoro Hernández',
      ],
      cta: 'Ins Maisfeld',
    },
    areas: {
      milpafeld: a('Milpa-Feld', 'Mais, Bohne und Kürbis zusammen.', '„Der Mais ist die Stange, die Bohne düngt, der Kürbis hält die Erde feucht. Die drei helfen einander.“'),
      chiligarten: a('Chili-Garten', 'Grün, rot, scharf und schärfer.', '„Chilli ist ein Wort aus dem Nahuatl. Tomate auch: tomatl.“'),
      amaranth: a('Amaranth', 'Rote Rispen, winzige Samen.', '„Aus gepufftem Amaranth und Honig machen sie Süßigkeiten. Alegría heißen sie, Freude.“'),
      comalkueche: a('Comal-Küche', 'Tortillas auf der heißen Platte.', '„Der Mais wird mit Kalk gekocht und dann gemahlen. Erst so wird er richtig nahrhaft.“'),
      maisspeicher: a('Maisspeicher', 'Kolben in allen Farben.', '„Blau, rot, gelb, weiß, gefleckt: Jede Familie hebt ihre eigenen Sorten auf.“'),
      agavenzaun: a('Agavenzaun', 'Ein Zaun, der sticht und blüht.', '„Eine Agave blüht nur einmal im Leben. Dann treibt sie einen Stängel, so hoch wie ein Haus.“'),
      meliponen: a('Bienen ohne Stachel', 'Kleine Bienen in hohlen Stämmen.', '„Die Melipona-Bienen stechen nicht. Ihr Honig ist so kostbar, dass man ihn als Medizin nimmt.“'),
      saatgutkruege: a('Saatgut-Krüge', 'Tonkrüge voller Samen.', '„Die schönsten Kolben kommen nicht in den Topf, sondern in den Krug. Für das nächste Jahr.“'),
      markttag: a('Markttag', 'Bohnen, Kürbisblüten, Chilis.', '„Tianguis heißt der Markt. Auch dieses Wort kommt aus dem Nahuatl.“'),
      erntefeier: a('Erntefeier', 'Elotes, Musik und Studentenblumen.', '„Zur Ernte gibt es Elotes: gekochte Maiskolben mit Chili und Limette. Da wäre ich gern dabei gewesen.“'),
    },
  },
  kaffeewald: {
    title: 'Kaffeewald in Äthiopien',
    currency: 'Kaffee',
    chip: 'Äthiopien',
    to: 'In den Kaffeewald',
    teaser: 'Kapitel 32: Der Kaffeewald in Äthiopien — ab der Mitte der 20. Generation, wenn in der Milpa die Erntefeier beginnt.',
    intro: {
      title: 'Post aus dem Kaffeewald',
      body: [
        'Selam! Das ist Amharisch, eine der Sprachen Äthiopiens, und heißt „Frieden“. So grüßen wir einander.',
        'Ich bin Almaz Tesfaye und baue Kaffee an, im Hochland von Kaffa im Südwesten Äthiopiens. Meine Mutter hat eurer Großmutter einmal ungeröstete Kaffeebohnen zum Säen geschickt. Daraus wurde ein Bäumchen auf ihrer Küchenfensterbank, das hat sie uns stolz geschrieben. Ob es je geblüht hat? Bei uns blüht der Kaffee nach dem ersten Regen, ganz weiß, und duftet wie Jasmin.',
        'Der Arabica-Kaffee, den man fast überall auf der Welt trinkt, stammt aus den Bergwäldern hier. Bei uns wächst er bis heute wild, im Schatten großer Bäume. Wir pflegen den Wald, statt ihn zu roden: Unter dem Blätterdach bleibt der Boden feucht, und die Bienen bestäuben die Blüten.',
        'Wenn Gäste kommen, machen wir Kaffee zusammen. Die grünen Bohnen werden in der Pfanne geröstet, im Mörser zerstoßen und in der Jebena gekocht, einer Kanne aus Ton. Es gibt drei Runden. Die dritte heißt Baraka, das bedeutet Segen.',
        'Kommt nach dem ersten Regen, wenn der Wald weiß blüht. Die Kanne steht schon im Feuer. Almaz Tesfaye',
      ],
      cta: 'Unter das Blätterdach',
    },
    areas: {
      waldkaffee: a('Waldkaffee', 'Kaffeesträucher unter hohen Bäumen.', '„Der Kaffee mag keine pralle Sonne. Im Wald steht er wie unter einem Schirm.“'),
      pflueckplatz: a('Pflückplatz', 'Nur die roten Kirschen.', '„Gepflückt wird mehrmals, immer nur die reifen Kirschen. Die grünen dürfen noch warten.“'),
      trockenbetten: a('Trockenbetten', 'Kirschen trocknen in der Sonne.', '„Die Betten stehen auf Stelzen, damit Luft darunter kommt. Jeden Tag wird gewendet.“'),
      ensetegarten: a('Ensete-Garten', 'Die falsche Banane.', '„Ensete sieht aus wie eine Banane, aber man isst den Stamm. Daraus machen sie Kocho, ein Brot, das lange hält.“'),
      honigbaeume: a('Honigbäume', 'Bienenkörbe hoch in den Ästen.', '„Die Körbe aus Rinde hängen hoch oben in den Bäumen. Der Honig schmeckt nach Wald.“'),
      waschplatz: a('Waschplatz am Bach', 'Klares Wasser zum Sortieren.', '„Gute Kirschen sinken, schlechte schwimmen oben. So einfach sortiert der Bach.“'),
      tukul: a('Tukul', 'Rundhaus mit Strohdach.', '„Ein Tukul ist rund, aus Holz und Lehm, mit einem spitzen Dach aus Stroh.“'),
      roestpfanne: a('Röstpfanne', 'Grüne Bohnen werden braun.', '„Nach dem Rösten wird die Pfanne herumgereicht, damit alle den Duft riechen. Das gehört dazu.“'),
      kaffeezeremonie: a('Kaffeezeremonie', 'Drei Runden, Weihrauch und Gras.', '„Frisches Gras auf dem Boden, Weihrauch, Popcorn dazu. Und keiner hat es eilig.“'),
      kaffeemarkt: a('Kaffeemarkt', 'Säcke, Honig und Gewürze.', '„Auf dem Markt riecht es nach Kaffee, Honig und Korarima, einem Gewürz aus dem Wald.“'),
    },
  },
  reisterrassen: {
    title: 'Reisterrassen auf Bali',
    currency: 'Reis',
    chip: 'Bali',
    to: 'Zu den Reisterrassen',
    teaser: 'Kapitel 33: Die Reisterrassen auf Bali — ab der 21. Generation, wenn im Kaffeewald der Kaffeemarkt öffnet.',
    intro: {
      title: 'Ein Brief von Bali',
      body: [
        'Om Swastiastu! So grüßt man auf Bali. Es heißt ungefähr: „Möge es euch gut gehen.“',
        'Ich bin Made Wirawan und verteile das Wasser für unseren Subak in Jatiluwih, am Fuß des Batukaru. In der Dose eurer Großmutter liegt ein Tütchen roter Reis von meinem Vater. Eure Großmutter hat ihn jeden Sommer in einer Zinkwanne auf der Terrasse gezogen, schrieb sie, und nie mehr als eine Handvoll geerntet. Gefreut hat sie sich jedes Mal.',
        'Der Reis stammt nicht von Bali. Wilder Reis wuchs in den Sümpfen am Jangtse in China, und dort haben Menschen ihn vor rund neuntausend Jahren angebaut. Mit Bauern, die übers Meer fuhren, kam er von Insel zu Insel bis zu uns. Was von hier kommt, ist eine Art, das Wasser zu teilen.',
        'Subak heißt die Gemeinschaft der Reisbauern, und es gibt sie seit über tausend Jahren. Das Wasser kommt aus den Bergen, fließt durch Kanäle und Tunnel und wird an steinernen Teilern so verteilt, dass jedes Feld genug bekommt, auch das unterste. Wann gepflanzt wird, beschließen wir gemeinsam im Wassertempel.',
        'Kommt, wenn die Felder unter Wasser stehen und den Himmel spiegeln. Om Shanti Shanti Shanti Om — „Frieden, Frieden, Frieden“. Made Wirawan',
      ],
      cta: 'Am Wasser entlang',
    },
    areas: {
      sawah: a('Reisfelder', 'Grün, dann Gold, dann Wasserspiegel.', '„Sawah heißt ein nasses Reisfeld. Made schreibt, man sieht darin die Wolken ziehen.“'),
      wasserteiler: a('Wasserteiler', 'Jedes Feld bekommt seinen Teil.', '„Ein Stein mit zwei Öffnungen, eine breit, eine schmal. Wer mehr Felder hat, bekommt mehr Wasser.“'),
      wassertempel: a('Wassertempel', 'Ein Schrein an der Quelle.', '„Im Tempel wird beschlossen, wann gepflanzt wird. Dann sind die Felder oben und unten im selben Takt.“'),
      kokospalmen: a('Kokospalmen', 'Nüsse, Blätter und Schatten.', '„Von der Palme wird alles gebraucht: Nuss, Saft, Blätter und Holz.“'),
      entenweide: a('Entenweide', 'Enten im Gänsemarsch.', '„Meine Laufenten gegen die Schnecken haben Vorfahren auf diesen Inseln. Das wusste ich nicht.“'),
      lumbung: a('Lumbung', 'Reisspeicher auf Stelzen.', '„Unter dem hohen Dach liegt der Reis trocken. Runde Scheiben an den Pfosten halten die Ratten fern.“'),
      hanggarten: a('Gemüse am Hang', 'Chili, Bohnen und Kräuter.', '„Zwischen den Terrassen wachsen Chilis, lange Bohnen und Zitronengras.“'),
      bambusbruecke: a('Bambusbrücke', 'Leicht und fest über den Kanal.', '„Drei dicke Rohre, mit Bast gebunden. Darüber tragen sie die Reisgarben nach Hause.“'),
      flechtwerkstatt: a('Flechtwerkstatt', 'Körbe und Schälchen aus Palmblatt.', '„Jeden Morgen flechten sie kleine Schälchen aus Palmblatt, mit Blüten und Reis darin. Canang heißen sie.“'),
      tempelfest: a('Erntedank im Tempel', 'Opfergaben und Gamelan-Musik.', '„Zur Ernte danken sie Dewi Sri, der Göttin des Reises. Die Opfergaben sind so hoch wie ein Mensch.“'),
    },
  },
  gewuerzgarten: {
    title: 'Gewürzgarten in Kerala',
    currency: 'Pfeffer',
    chip: 'Kerala',
    to: 'In den Gewürzgarten',
    teaser: 'Kapitel 34: Der Gewürzgarten in Kerala — ab der Mitte der 21. Generation, wenn auf Bali Erntedank im Tempel gefeiert wird.',
    intro: {
      title: 'Ein Brief aus Kerala',
      body: [
        'Namaskaram! So grüßt man auf Malayalam, der Sprache Keralas, mit aneinandergelegten Händen.',
        'Ich bin Anjali Menon und baue Gewürze an, in den Hügeln über den Backwaters im Süden Indiens. In der Dose eurer Großmutter liegt ein Tütchen schwarzer Pfefferkörner mit der Adresse meiner Großmutter. Gekeimt haben sie nie: Pfeffer zieht man aus Stecklingen, das hat meine Großmutter gleich zurückgeschrieben. Eure Großmutter hat die Körner trotzdem aufgehoben und uns Kornblumen geschickt, für unseren Blumenteppich. Blau hatte uns gefehlt.',
        'Der schwarze Pfeffer stammt aus den Wäldern unserer Berge, den Westghats. Er ist eine Kletterpflanze und rankt an Bäumen hinauf, bei uns an Jackfrucht- und Korallenbäumen. Schon vor über zweitausend Jahren kamen Schiffe aus Rom an unsere Küste, um Pfeffer zu holen. Jeder Pfefferstreuer in Europa hat hier angefangen.',
        'Im Juni kommt der Monsun. Dann regnet es wochenlang, und an den Ranken erscheinen die Blütenähren. Geerntet wird im Winter, wenn die ersten Beeren rot werden. Auf Matten in der Sonne werden die grünen Körner schwarz und runzlig. Kardamom wächst bei uns im Schatten, Ingwer und Kurkuma in der Erde dazwischen.',
        'Kommt zu Onam, unserem Erntefest im Spätsommer. Dann legt jede Familie vor dem Haus einen Teppich aus Blüten. Eure Anjali Menon',
      ],
      cta: 'Zwischen die Ranken',
    },
    areas: {
      pfefferranken: a('Pfefferranken', 'Am Baum hinauf, Ähren voller Körner.', '„Pfeffer klettert wie Efeu. Grün gepflückt und getrocknet, wird er schwarz.“'),
      kardamom: a('Kardamom', 'Im Schatten, Kapseln am Boden.', '„Die Kapseln wachsen ganz unten, fast auf der Erde. Zum Ernten muss man sich bücken.“'),
      zimtbaeume: a('Zimtbäume', 'Rinde, die sich einrollt.', '„Zimt ist die Rinde junger Triebe. Beim Trocknen rollt sie sich von selbst ein.“'),
      ingwerbeet: a('Ingwerbeet', 'Scharfe Knollen unter grünen Halmen.', '„Ingwer ist keine Wurzel, sondern ein Erdspross. Scharf ist er trotzdem.“'),
      kurkuma: a('Kurkuma', 'Gelb bis in die Fingerspitzen.', '„Wer Kurkuma erntet, hat danach tagelang gelbe Finger.“'),
      muskatbaum: a('Muskatbaum', 'Die Nuss im roten Netz.', '„Die Nuss steckt in einem roten Netz, der Macis. Ein Baum, zwei Gewürze.“'),
      trockenmatten: a('Trockenmatten', 'Grüne Körner werden schwarz.', '„Ein paar Tage Sonne, und aus grünen Körnern wird schwarzer Pfeffer.“'),
      bootssteg: a('Hausboot-Steg', 'Am stillen Wasser der Backwaters.', '„Früher trugen solche Boote Reis und Pfeffer zum Hafen nach Kochi. Heute schlafen Gäste darin.“'),
      gewuerzlager: a('Gewürzlager', 'Säcke, Kisten und ein großer Duft.', '„Im Lager riecht es nach Pfeffer, Zimt und Kardamom zugleich. Man niest und lächelt.“'),
      pookalam: a('Onam-Blumenteppich', 'Ein Kreis aus Blüten vor dem Haus.', '„Zehn Tage lang wächst der Blumenteppich jeden Tag um einen Ring. Pookalam heißt er.“'),
    },
  },
} as const
