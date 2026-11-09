/**
 * German copy for Bogen II „Omas Saatgutbriefe“ (Kapitel 20–29): Gärten der
 * Briefpartner, mit denen Oma jahrzehntelang per Post Samen getauscht hat.
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

export const arc2ChapterStrings = {
  /* —— Bogen II: Omas Saatgutbriefe (Kapitel 20–29) —— */
  cottagegarten: {
    title: 'Cottage-Garten',
    currency: 'Duftwicken',
    chip: 'England',
    to: 'Zum Cottage-Garten',
    teaser: 'Kapitel 20: Der Cottage-Garten in England — ab der Mitte der 14. Generation, wenn im Spreewald das Gurkenfest gefeiert wird.',
    intro: {
      title: 'Ein Brief aus England',
      body: [
        'Liebe Familie,',
        'ihr habt mir geschrieben, dass ihr Omas Dose gefunden habt, und darin meine Briefe. Zweiundvierzig Jahre lang haben wir uns geschrieben, jeden Winter ein Brief und ein Tütchen. Ich schickte Duftwicken, sie schickte Bohnen „Blauhilde“. Ihr letzter Brief steht noch auf meinem Kaminsims.',
        'Mein Garten liegt in einem Dorf in den Cotswolds, zwischen honigfarbenen Steinhäusern und Hügeln voller Schafe. Er ist klein und ein bisschen wild: Stockrosen an der Mauer, Wicken am Zaun, Gemüse auf der Parzelle am Dorfrand.',
        'Im Sommer ist Dorfgartenschau. Eure Großmutter stand einmal mit mir am Tisch, als meine Wicken den ersten Preis bekamen. Sie hat lauter geklatscht als alle anderen. Kommt doch, der Wasserkessel steht schon auf dem Herd.',
        'Herzlich, Margaret Pryce',
      ],
      cta: 'Durchs Gartentor',
    },
    areas: {
      stockrosen: a('Stockrosenbeet', 'Blüten bis über die Mauer.', '„Margarets Stockrosen sind größer als sie selbst. Und sie ist nicht klein.“'),
      wickenzaun: a('Wickenzaun', 'Duftwicken in allen Farben.', '„Je mehr man pflückt, desto mehr blühen sie.“'),
      gemueseparzelle: a('Gemüse-Parzelle', 'Bohnen, Lauch und Rhabarber am Dorfrand.', '„Eine Parzelle in England ist wie ein Schrebergarten bei uns. Ich habe mich gleich zu Hause gefühlt.“'),
      steinmauer: a('Kalksteinmauer', 'Goldener Stein ohne Mörtel.', '„In den Fugen wohnen Mauerbienen und Hauswurz.“'),
      apfelspalier: a('Apfelspalier', 'Äpfel flach an der warmen Wand.', '„Ein Spalierbaum braucht jeden Sommer einen Schnitt. Und viel Lob.“'),
      holzgewaechshaus: a('Holz-Gewächshaus', 'Tomaten und Setzlinge unter Glas.', '„Margarets Gewächshaus ist älter als ihr Haus. Behauptet sie.“'),
      teeplatz: a('Teeplatz unter der Eiche', 'Tee um vier, bei jedem Wetter.', '„Bei Margaret gibt es Tee um vier. Auch bei Regen. Gerade bei Regen.“'),
      geissblattlaube: a('Geißblattlaube', 'Duft am Abend, Bank im Schatten.', '„Geißblatt duftet am stärksten, wenn es dunkel wird.“'),
      gartenschuppen: a('Gartenschuppen', 'Töpfe, Schnur und ein altes Radio.', '„Im Schuppen läuft immer die Gartensendung im Radio.“'),
      dorfschau: a('Dorfgartenschau', 'Rosetten für die längste Bohne.', '„Preise gibt es für die längste Bohne, die schönste Wicke und den besten Kuchen.“'),
    },
  },
  tulpenfelder: {
    title: 'Tulpenfelder',
    currency: 'Blumenzwiebeln',
    chip: 'Holland',
    to: 'Zu den Tulpenfeldern',
    teaser: 'Kapitel 21: Die Tulpenfelder in Holland — ab der 15. Generation, wenn im Cottage-Garten die Dorfgartenschau ist.',
    intro: {
      title: 'Post aus den Zwiebelfeldern',
      body: [
        'Beste familie — so fängt bei uns ein Brief an, „Liebe Familie“.',
        'Mein Vater hat mit eurer Oma dreißig Jahre lang Zwiebeln getauscht. Sie schickte ihm Schneeglöckchen aus ihrem Garten, er schickte ihr Tulpen, die es in keinem Laden gibt. Als er gestorben ist, kam von ihr ein Brief, den ich bis heute aufhebe.',
        'Im April blühen unsere Felder in Streifen, rot, gelb, weiß und lila, bis hinauf zum Deich. Das Wichtigste ist für uns aber nicht die Blüte, sondern die Zwiebel. Darum köpfen wir die Blüten früh, damit die Kraft nach unten geht. Die Besucher erschrecken jedes Mal.',
        'Im Herbst stecken wir die neuen Zwiebeln. Dann ist Zeit für Kaffee, und für euch. Fahrräder haben wir genug.',
        'Joost de Vries',
      ],
      cta: 'Zwischen die Reihen',
    },
    areas: {
      tulpenreihen: a('Tulpenreihen', 'Streifen in Rot, Gelb und Lila.', '„Joost köpft die Blüten, damit die Zwiebeln dick werden. Mir hat das Herz geblutet.“'),
      hyazinthen: a('Hyazinthenfeld', 'Schwerer Duft über dem Sand.', '„Hyazinthen riecht man, bevor man sie sieht.“'),
      narzissen: a('Narzissenwiese', 'Gelb unter den Bäumen.', '„Die ersten Narzissen kommen im März. Wie Joosts Briefe.“'),
      zwiebelscheune: a('Zwiebelscheune', 'Zwiebeln trocknen auf Holzhorden.', '„In der Scheune ist es kühl, luftig und dunkel. So mögen es die Zwiebeln.“'),
      windmuehle: a('Windmühle', 'Pumpt das Wasser aus dem Polder.', '„Ohne die Mühlen stünde das halbe Land unter Wasser.“'),
      gracht: a('Gracht mit Brücke', 'Schmales Wasser, weiße Zugbrücke.', '„Über die Brücke kommt man nur zu Fuß oder mit dem Rad.“'),
      fahrradstall: a('Fahrradstall', 'Räder für alle Helfer.', '„In Holland hat jeder zwei Fahrräder. Mindestens.“'),
      versteigerung: a('Versteigerungshalle', 'Von hier gehen die Blumen in alle Welt.', '„Die Uhr läuft rückwärts: Wer zuerst drückt, kauft.“'),
      hausboot: a('Hausboot-Garten', 'Kräuter in Kisten auf dem Wasser.', '„Ein Garten, der schaukelt. Joosts Tochter wohnt darin.“'),
      tulpenmarkt: a('Tulpenmarkt', 'Bunte Bündel auf dem Platz.', '„Ein Bund Tulpen kostet hier so wenig wie ein Brot.“'),
    },
  },
  artischocken: {
    title: 'Artischockeninsel',
    currency: 'Artischocken',
    chip: 'Venedig',
    to: 'Zur Artischockeninsel',
    teaser: 'Kapitel 22: Die Artischockeninsel bei Venedig — ab der Mitte der 15. Generation, wenn in Holland Tulpenmarkt ist.',
    intro: {
      title: 'Von der Gemüseinsel',
      body: [
        'Bondì! So sagt man in Venedig „Guten Tag“, auf Venezianisch, nicht auf Italienisch.',
        'Ich bin Giulia und baue auf Sant’Erasmo Artischocken an, wie meine Mutter und meine Nonna. Sant’Erasmo ist die Gemüseinsel der Lagune: keine Autos, keine Brücke nach Venedig, nur Felder, Kanäle und Boote. Eure Oma hat meiner Nonna Ringelblumensamen geschickt, und die Nonna schickte Samen vom Mönchsbart zurück, einem salzigen Kraut aus der Lagune.',
        'Unsere Artischocke ist klein und violett. Die allererste an jeder Pflanze heißt Castraura. Sie wird im April geschnitten, damit die Pflanze mehr Seitenknospen bildet. Sie ist die zarteste und die teuerste, ganz Venedig wartet auf sie.',
        'Im Mai ist Inselfest, die Sagra. Kommt mit dem Vaporetto, dem Wasserbus, ich warte mit dem Boot am Anleger.',
        'Giulia Zanon',
      ],
      cta: 'Ans Ufer',
    },
    areas: {
      artischockenfeld: a('Artischockenfeld', 'Violette Knospen auf silbernen Blättern.', '„Die erste Artischocke heißt Castraura. Giulias Nonna hat mir einmal welche geschickt, in Öl.“'),
      lagunenwiese: a('Lagunenwiese', 'Strandflieder zwischen Wasser und Land.', '„Die Venezianer nennen diese Wiesen Barene.“'),
      bootsanleger: a('Bootsanleger', 'Pfähle aus Holz, Boote aus Holz.', '„Hier kommt alles mit dem Boot: Saatgut, Post, der Doktor.“'),
      kanalgarten: a('Kanalgarten', 'Beete zwischen schmalen Kanälen.', '„Das Wasser kommt von allein. Man muss es nur lenken.“'),
      granatapfelhecke: a('Granatapfelhecke', 'Rote Blüten, rote Früchte.', '„Die Granatäpfel schützen die Felder vor dem Wind von der Adria.“'),
      salzgarten: a('Salzgarten', 'Mönchsbart und Queller am Ufer.', '„Mönchsbart wächst, wo das Salz alles andere vertreibt. Er schmeckt nach Meer.“'),
      bootsschuppen: a('Bootsschuppen', 'Ruder, Netze, Werkzeug.', '„Giulias Boot ist ein Sandolo, flach genug für jeden Kanal.“'),
      gemuesekahn: a('Gemüsekahn', 'Der schwimmende Marktstand.', '„Um fünf Uhr früh fährt das Boot zum Markt am Rialto.“'),
      glockenturm: a('Glockenturm-Blick', 'Der Turm von San Marco am Horizont.', '„An klaren Tagen sieht man hinter dem Turm die Berge.“'),
      inselfest: a('Inselfest', 'Lange Tische, Artischocken, Musik.', '„Die ganze Insel isst an einem Tisch.“'),
    },
  },
  beerenwald: {
    title: 'Beerenwald',
    currency: 'Blaubeeren',
    chip: 'Schweden',
    to: 'Zum Beerenwald',
    teaser: 'Kapitel 23: Der Beerenwald in Schweden — ab der 16. Generation, wenn auf der Artischockeninsel das Inselfest gefeiert wird.',
    intro: {
      title: 'Aus dem Wald am See',
      body: [
        'Hej! Das heißt einfach „Hallo“, und so grüßt man in Schweden jeden, sogar den König.',
        'Ich bin Ingrid, Försterin in Dalarna. Eure Großmutter und ich haben uns über eine Gartenzeitschrift kennengelernt: Sie suchte Preiselbeersamen, ich suchte einen Grünkohl, der unseren Winter übersteht. Ihr „Frostkönig“ wächst bis heute hinter meiner roten Hütte.',
        'Bei uns gilt das Jedermannsrecht, Allemansrätten: Jeder darf durch den Wald gehen und Beeren und Pilze sammeln, solange er nichts kaputt macht und den Häusern nicht zu nahe kommt. Ein Garten, der allen gehört, und keiner muss ihn umgraben.',
        'Im Juni feiern wir Mittsommer, dann wird es kaum dunkel. Im Winter wird es kaum hell, dafür tanzt in klaren Nächten manchmal das Nordlicht. Kommt, wann ihr wollt. Die Sauna ist immer warm.',
        'Ingrid Lund',
      ],
      cta: 'In den Wald',
    },
    areas: {
      heidelbeerhang: a('Heidelbeerhang', 'Blaue Beeren unter Kiefern.', '„Mit dem Beerenkamm geht es schneller. Mit den Fingern schmeckt es besser.“'),
      preiselbeeren: a('Preiselbeermoos', 'Rote Beeren auf grünem Moos.', '„Preiselbeeren passen zu allem. Sogar zu Pfannkuchen.“'),
      moltebeeren: a('Moltebeerenmoor', 'Goldene Beeren im Moor.', '„Moltebeeren sind so selten, dass niemand seine Stellen verrät.“'),
      rotehuette: a('Rote Hütte', 'Falunrot mit weißen Ecken.', '„Die rote Farbe stammt aus einer alten Kupfermine.“'),
      saftkueche: a('Saftküche', 'Beeren werden zu Saft und Marmelade.', '„Ein Becher Blaubeersuppe wärmt beim Skilanglauf.“'),
      pilzlichtung: a('Pilzlichtung', 'Pfifferlinge im Moos.', '„Nur sammeln, was man sicher kennt. Ingrid kennt alle.“'),
      holzstapel: a('Holzstapel', 'Birke und Kiefer für den Winter.', '„Hier brennt der Ofen jeden Tag, von Oktober bis April.“'),
      seesauna: a('Sauna am See', 'Erst schwitzen, dann ins Wasser.', '„Im Winter springt Ingrid durch ein Loch im Eis. Ich habe zugeschaut.“'),
      mittsommer: a('Mittsommerplatz', 'Die Mittsommerstange mit Blumenkränzen.', '„Mittsommer ist die hellste Nacht des Jahres. Geschlafen wird später.“'),
      jedermannspfad: a('Jedermannsrecht-Pfad', 'Ein Weg durch den Wald für alle.', '„Der Wald gehört allen, die gut mit ihm umgehen.“'),
    },
  },
} as const
