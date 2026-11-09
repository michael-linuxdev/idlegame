/**
 * German copy for Bogen IV „Saatgut für morgen“ (Kapitel 40–49): Die nächste
 * Generation übernimmt. Omas Dose ist fast leer, und Mila (Jonas’ Tochter)
 * füllt sie wieder — mit Samen aus Gärten der Zukunft. Ab hier stammen die
 * Bereichs-Notizen von Mila, die in Omas Notizbuch weiterschreibt.
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

export const arc4ChapterStrings = {
  /* —— Bogen IV: Saatgut für morgen (Kapitel 40–49) —— */
  dachgarten: {
    title: 'Dachgarten',
    currency: 'Salat',
    chip: 'Dach',
    to: 'Aufs Dach',
    teaser: 'Kapitel 40: Der Dachgarten — ab der Mitte der 24. Generation, wenn in Korea Chuseok gefeiert wird.',
    intro: {
      title: 'Post vom Dach',
      body: [
        'Hallo ihr alle,',
        'ich bin Mila, Jonas’ Tochter. Ihr habt mir Omas Notizbuch geschenkt, das mit den Erdflecken und den eingeklebten Tütchen. Hinten waren noch Seiten frei. Ab jetzt schreibe ich hinein.',
        'Omas Dose ist fast leer. Sie hat ihr Leben lang Samen verschickt, und ich finde, jetzt sind wir dran, die Dose wieder zu füllen: mit Saatgut für morgen, aus Gärten, die es zu Omas Zeit kaum gab.',
        'Anfangen will ich ganz oben, auf dem Dach des alten Parkhauses neben Papas Hinterhof. Papa hat nachgerechnet: Ein Dach, das Autos trägt, trägt auch Beete. Oben ist es windig und heiß, aber es gibt Platz für Salat, für Wildbienen und für eine Glaskuppel, in der es auch im Winter grün bleibt.',
        'Bringt Erde mit. Der Aufzug geht. Meistens. Mila',
      ],
      cta: 'Die Treppe hinauf',
    },
    areas: {
      dachbeete: a('Dachbeete', 'Salat in flachen Kästen.', '„Hier oben trocknet alles schneller. Ich gieße morgens vor der Schule, Papa abends nach der Arbeit.“'),
      bienendach: a('Wildbienen-Dach', 'Blühende Polster auf dem Kies.', '„Aufs Dach kommt Mauerpfeffer. Er speichert Wasser in dicken Blättern, und auf seinen gelben Blüten sitzen die Wildbienen.“'),
      dachkuppel: a('Glaskuppel', 'Ein Gewächshaus wie eine Seifenblase.', '„In der Kuppel wächst Feldsalat den ganzen Winter. Draußen friert es, drinnen beschlagen die Scheiben.“'),
      dachtank: a('Regenwassertank', 'Jeder Schauer füllt den Tank.', '„Ein kahles Dach schickt den Regen sofort in den Kanal. Unseres hält ihn fest und gibt ihn langsam an die Beete ab.“'),
      solarpergola: a('Solarpergola', 'Strom von oben, Schatten unten.', '„Die Solarplatten treiben die Pumpe am Tank. Und darunter ist der einzige Schatten auf dem ganzen Dach.“'),
      kraeuterbalkon: a('Kräuterbalkon', 'Kästen am Geländer.', '„Thymian, Salbei und Rosmarin mögen es heiß und trocken. Für sie ist das Dach wie Urlaub am Mittelmeer.“'),
      lastenaufzug: a('Lastenaufzug', 'Erde rauf, Ernte runter.', '„Heute sind vierzig Säcke Erde hochgefahren. Der Aufzug hat gequietscht, aber durchgehalten.“'),
      dachcafe: a('Dachcafé', 'Salat mit Aussicht.', '„Im Café gibt es Salat vom Beet zwei Meter weiter. Kürzer kann ein Weg nicht sein.“'),
      saatgutschrank: a('Saatgutschrank', 'Ein Schrank für Omas Dose.', '„Hier steht Omas Dose jetzt. Wer Samen nimmt, schreibt auf, wo sie wachsen sollen, und bringt im Herbst neue mit.“'),
      abendrotfest: a('Abendrot-Fest', 'Wenn die Stadt rot leuchtet.', '„Wenn die Sonne hinter den Kränen untergeht, wird es auf dem Dach ganz still. Dann holt jemand die Gitarre raus.“'),
    },
  },
  schulgarten: {
    title: 'Schulgarten',
    currency: 'Radieschen',
    chip: 'Schule',
    to: 'Zum Schulgarten',
    teaser: 'Kapitel 41: Der Schulgarten — ab der 25. Generation, wenn auf dem Dach das Abendrot-Fest beginnt.',
    intro: {
      title: 'Aus dem Lehrerzimmer',
      body: [
        'Liebe Familie,',
        'Sie kennen uns von den Bestellungen: Familie Yilmaz. Wir haben schon bei Ihrer Großmutter Gemüse bestellt, und heute bei Ihnen. Ich bin die, die immer zu viele Radieschen bestellt.',
        'Ich unterrichte Sachunterricht an der Grundschule hinter dem Park. Unser Schulhof war bis letztes Jahr nur Asphalt. Dann stand Mila vor meiner Tür, meine ehemalige Schülerin, mit einer Idee und einem Spaten. Jetzt hat jede Klasse ein Beet, und die Kinder streiten darüber, wessen Radieschen zuerst rot sind.',
        'Radieschen sind wie gemacht für Kinder: Nach gut vier Wochen kann man sie ernten, schneller ist kaum ein Gemüse. Und wer selbst gesät hat, probiert plötzlich auch, was grün ist.',
        'Nur die Sommerferien machen mir Sorgen. Sechs Wochen ohne Schule, und die Beete haben Durst. Wir brauchen einen Gießplan, und vielleicht brauchen wir Sie.',
        'Herzliche Grüße, Derya Yilmaz',
      ],
      cta: 'Auf den Schulhof',
    },
    areas: {
      klassenbeete: a('Klassenbeete', 'Jede Klasse ein Beet.', '„Die 2b hat jedem Radieschen ein Namensschild gegeben. Jedem einzelnen.“'),
      schulkompost: a('Schulkompost', 'Aus Pausenresten wird Erde.', '„Apfelreste ja, Wurstbrot nein. Das steht jetzt in großen Buchstaben auf dem Deckel.“'),
      insektenhaus: a('Insektenhotel', 'Löcher in Holz und Halmen.', '„Die Löcher müssen glatt gebohrt sein, ohne Splitter. Sonst reißen sich die Wildbienen die Flügel auf.“'),
      weidentipi: a('Weidentipi', 'Ein Zelt, das wächst.', '„Im Winter steckt man Weidenruten in die Erde, im Frühling treiben sie aus. Jedes Jahr wird das Zelt dichter.“'),
      barfusspfad: a('Barfußpfad', 'Rinde, Kies, Sand und Moos.', '„Mit geschlossenen Augen raten, worauf man steht. Tannenzapfen sind gemein.“'),
      kraeuterschnecke: a('Kräuterschnecke', 'Eine Spirale aus Steinen.', '„Oben trocken für Thymian, unten feucht für Minze. Wie Omas Kräuterspirale, nur in Kindergröße.“'),
      schulkueche: a('Schulküche', 'Radieschenbrot für alle.', '„Heute gab es Radieschenbrot mit Schnittlauch. Sogar die, die keine Radieschen mögen, wollten zwei.“'),
      gartenhuette: a('Gartenhütte', 'Kleine Kannen, kleine Spaten.', '„Jede Gießkanne trägt ein Klassenzeichen. Trotzdem fehlen jeden Freitag drei.“'),
      pausenbeet: a('Pausenhof-Beet', 'Ein Hochbeet zwischen den Spielen.', '„Das Hochbeet steht mitten auf dem Pausenhof. Wer Fußball spielt, dribbelt jetzt um die Erdbeeren herum.“'),
      schulfest: a('Schul-Erntefest', 'Die ganze Schule feiert.', '„Die Kinder verkaufen Radieschen, zehn Cent das Bund. Vom Geld kaufen sie Samen fürs nächste Jahr.“'),
    },
  },
  waldgarten: {
    title: 'Waldgarten',
    currency: 'Haselnüsse',
    chip: 'Wald',
    to: 'In den Waldgarten',
    teaser: 'Kapitel 42: Der Waldgarten — ab der Mitte der 25. Generation, wenn die Schule ihr Erntefest feiert.',
    intro: {
      title: 'Ein Wald zum Essen',
      body: [
        'Hallo, ihr Lieben,',
        'erinnert ihr euch an Fritzens Roter, den Apfel aus den Kernen meines Opas? Er steht inzwischen in einem Wald. Hinter der Baumschule habe ich einen Acker in einen Waldgarten verwandelt.',
        'Ein Waldgarten ist gebaut wie ein Waldrand, nur dass fast alles darin essbar ist. Sieben Schichten: oben Nuss- und Obstbäume, darunter Hasel und kleine Bäume, dann Beerensträucher, Kräuter, Bodendecker, Knollen in der Erde und Ranken, die überall hochklettern.',
        'Man gräbt kaum um und gießt wenig, und jedes Jahr wird es mehr. Mila war im Frühjahr hier und hat mit mir Pilze in Buchenstämme geimpft. Sie meint, das sei der einzige Garten, der sich selbst pflegt. Ganz stimmt das nicht. Aber fast.',
        'Kommt im Herbst, dann fallen die Haselnüsse. Die Eichelhäher sind leider schneller als wir. Lena',
      ],
      cta: 'Unter die Bäume',
    },
    areas: {
      kronenschicht: a('Kronenschicht', 'Walnuss und Esskastanie.', '„Ganz oben stehen Walnuss und Esskastanie. Lena sagt, die pflanzt man für die Enkel.“'),
      haselhecke: a('Haselhecke', 'Nüsse in grünen Hüllen.', '„Die Hasel blüht schon im Februar. Die gelben Kätzchen sind die männlichen Blüten, die weiblichen sind winzig und rot.“'),
      beerenschicht: a('Beerenschicht', 'Johannisbeeren im Halbschatten.', '„Johannis- und Stachelbeeren kommen mit Halbschatten gut zurecht. Unter den Bäumen fühlen sie sich wohl.“'),
      kraeuterschicht: a('Kräuterschicht', 'Bärlauch, Minze, Beinwell.', '„Beinwell hat Wurzeln, die tief nach unten gehen. Seine Blätter legen wir als Mulch unter die anderen Pflanzen.“'),
      bodendecker: a('Bodendecker', 'Walderdbeeren statt nackter Erde.', '„Walderdbeeren decken den Boden wie ein Teppich. Darunter bleibt es feucht, und Unkraut hat kaum Platz.“'),
      kletterpflanzen: a('Kletterpflanzen', 'Kiwibeeren und Hopfen ranken hoch.', '„Kiwibeeren sind so klein wie Stachelbeeren und haben keine Haare. Man isst sie mit Schale.“'),
      pilzstaemme: a('Pilzstämme', 'Buchenstämme voller Pilze.', '„Wir haben Löcher in die Stämme gebohrt und Pilzbrut hineingesteckt. Nach gut einem Jahr kamen die ersten Shiitake.“'),
      weidenteich: a('Weidenteich', 'Wasser für Kröten und Libellen.', '„Am Teich wohnen Erdkröten. Sie fressen die Schnecken, bevor die den Salat finden.“'),
      lehrpfad: a('Lehrpfad', 'Sieben Schilder für sieben Schichten.', '„Die siebte Schicht sieht man nicht: Knollen und Wurzeln unter der Erde. Darum zeigt das letzte Schild nach unten.“'),
      waldgartenfest: a('Waldgartenfest', 'Nusskuchen unter Bäumen.', '„Zum Fest gab es Haselnusskuchen, Walderdbeeren und Minztee. Alles aus dem Wald, nur der Zucker nicht.“'),
    },
  },
  samenbank: {
    title: 'Samenbank',
    currency: 'Saatgutproben',
    chip: 'Samenbank',
    to: 'Zur Samenbank',
    teaser: 'Kapitel 43: Die Samenbank — ab der 26. Generation, wenn im Waldgarten gefeiert wird.',
    intro: {
      title: 'Post aus der Samenbank',
      body: [
        'Liebe Familie,',
        'mein Name ist Amara Okafor, ich leite eine kleine Samenbank am Stadtrand. Mila hat mich gefragt, ob wir eine bestimmte Stangenbohne kennen. Wir kennen sie. Ihre Großmutter hat uns vor vielen Jahren eine Handvoll davon geschickt, eine Sorte, die es sonst nirgends mehr gab. In unserem Archiv steht ihr Name.',
        'Eine Samenbank ist kein Museum. Wir trocknen die Samen, füllen sie in Gläser und lagern sie bei minus 18 Grad. So halten viele Arten Jahrzehnte. Alle paar Jahre machen wir einen Keimtest: Wir legen hundert Samen auf feuchtes Papier und zählen, wie viele keimen. Werden es zu wenige, säen wir die Sorte wieder aus und ernten frische Samen.',
        'Auf Spitzbergen gibt es einen großen Tresor im Berg, in dem Länder Sicherheitskopien ihrer Samen lagern. Unserer ist viel kleiner und steht im Keller. Aber er tut dasselbe: Er hebt etwas für später auf.',
        'Meine Großmutter in Nigeria hängte ihre Maiskolben über die Kochstelle, damit der Rauch die Käfer fernhält. Ihre Großmutter hatte eine Blechdose. Ich glaube, die beiden hätten sich gut verstanden.',
        'Kommen Sie zum Tag der offenen Tür, und nehmen Sie eine Jacke mit. Im Tresor ist es kalt. Dr. Amara Okafor',
      ],
      cta: 'Durch die Glastür',
    },
    areas: {
      vermehrungsbeete: a('Vermehrungsbeete', 'Hier wachsen frische Samen nach.', '„Jede Sorte bekommt ihr eigenes Beet, mit viel Abstand zu den anderen. Sonst kreuzen sie sich, sagt Amara.“'),
      reinigungsraum: a('Reinigungsraum', 'Sieben, pusten, sortieren.', '„Erst kommen die Siebe, dann ein Gebläse, das die leichte Spreu wegpustet. Zum Schluss sortiert Amara mit der Pinzette.“'),
      keimlabor: a('Keimtest-Labor', 'Hundert Samen auf feuchtem Papier.', '„Von Omas Bohnen sind 94 von 100 gekeimt. Amara hat gelächelt.“'),
      kuehltresor: a('Kühltresor', 'Minus 18 Grad, Glas an Glas.', '„Im Tresor war mein Atem zu sehen. Tausende Gläser, und jedes hat eine Nummer.“'),
      sortengarten: a('Sortengarten', 'Alte Sorten zum Anschauen.', '„Vierzig Tomaten nebeneinander: gestreift, gelb, fast schwarz. Ich wusste nicht, dass es so viele gibt.“'),
      samenarchiv: a('Archiv', 'Karteikarten und Herkunftsbriefe.', '„Zu jeder Sorte gibt es eine Karte: wer sie geschickt hat, woher und wann. Auf einer steht Omas Name.“'),
      bestaeuberzelte: a('Bestäubungszelte', 'Netze, Hummeln, eine Sorte pro Zelt.', '„In jedem Zelt summt ein kleines Hummelvolk. So bestäuben die Hummeln nur die Sorte, die drinsteht.“'),
      versandstelle: a('Versandstelle', 'Tütchen für Gärten überall.', '„Jeder Garten darf Proben bestellen. Ich habe heute zweihundert Tütchen beschriftet. Wie Oma.“'),
      besucherpfad: a('Besucherpfad', 'Schilder, Fenster und Staunen.', '„Durch ein Fenster sieht man in den Tresor. Die Kinder drücken ihre Nasen an die Scheibe.“'),
      offenertag: a('Tag der offenen Tür', 'Jeder darf ein Tütchen mitnehmen.', '„Heute durfte jeder ein Tütchen mitnehmen. Ich habe zwei für Omas Dose eingesteckt.“'),
    },
  },
  klimagarten: {
    title: 'Klimagarten',
    currency: 'Regenwasser',
    chip: 'Klima',
    to: 'In den Klimagarten',
    teaser: 'Kapitel 44: Der Klimagarten — ab der Mitte der 26. Generation, wenn die Samenbank ihre Türen öffnet.',
    intro: {
      title: 'Ein Garten für heiße Sommer',
      body: [
        'Hallo ihr,',
        'letzten Sommer hat es in der Stadt sechs Wochen nicht geregnet, und dann an einem einzigen Nachmittag so viel, dass die Keller vollliefen. Als Stadtplaner lerne ich gerade, was Gärtnerinnen schon lange wissen: Wasser muss man festhalten, wenn es kommt.',
        'Auf einer Brache am Fluss bauen wir einen Klimagarten. Die Idee heißt Schwammstadt: Statt den Regen in Rohre zu leiten, lassen wir ihn in Mulden und Beeten versickern und sammeln ihn in einer Zisterne. Im August gießen wir dann damit.',
        'Dazu Mulch auf jedem Beet, Bäume für Schatten, Pflanzen, die Trockenheit kennen, und Mischkultur wie bei Oma. Mila hat eine Wetterstation gebaut, die jeden Morgen meldet, ob wir gießen müssen.',
        'Kommt im Sommer, wenn es heiß ist. Dann seht ihr, wie gut Schatten tut. Jonas',
      ],
      cta: 'In den Schatten',
    },
    areas: {
      trockenbeet: a('Trockenbeet', 'Pflanzen, die Hitze kennen.', '„Lavendel, Salbei und Fetthenne kommen fast ohne Gießen durch den Sommer. Papa nennt sie die Gelassenen.“'),
      schwammflaeche: a('Schwammfläche', 'Eine Mulde, die Regen schluckt.', '„Bei Starkregen läuft das Wasser vom Weg in die Mulde und versickert langsam. Am nächsten Tag ist sie wieder trocken.“'),
      mulchwege: a('Mulchwege', 'Holzhäcksel halten den Boden feucht.', '„Unter dem Mulch ist die Erde selbst im August dunkel und kühl. Ich habe es mit der Hand geprüft.“'),
      schattenbaum: a('Schattenbaum', 'Eine Linde gegen die Hitze.', '„Unter der Linde ist es spürbar kühler als auf dem Platz daneben. Meine Wetterstation hat es gemessen.“'),
      zisternenspiel: a('Zisternenspiel', 'Pumpe, Rinnen, nasse Füße.', '„Die Kinder pumpen Wasser aus der Zisterne in Holzrinnen. Am Ende landet es im Beet. Und manchmal in den Schuhen.“'),
      mischkultur: a('Mischkultur', 'Möhren neben Zwiebeln.', '„Möhren und Zwiebeln nebeneinander sollen sich gegenseitig die Fliegen vom Hals halten. Oma hat es schon so gemacht.“'),
      windhecke: a('Windhecke', 'Sträucher bremsen den Wind.', '„Wind trocknet den Boden fast so schnell aus wie die Sonne. Hinter der Hecke bleibt es feuchter.“'),
      wetterstation: a('Wetterstation', 'Regen, Wind und Bodenfeuchte.', '„Meine Station misst Regen, Wind und wie feucht die Erde ist. Jeden Morgen kommt eine Nachricht: gießen oder nicht.“'),
      lehrkueche: a('Lehrküche', 'Kochen mit dem, was Hitze mag.', '„Heute gab es Ofengemüse mit Kichererbsen aus dem Trockenbeet. Ob sie bei uns jedes Jahr reif werden, wissen wir noch nicht.“'),
      klimatag: a('Klimatag', 'Die ganze Stadt schaut zu.', '„Zum Klimatag kamen Leute aus dem Rathaus. Jetzt soll jedes Viertel eine Schwammfläche bekommen.“'),
    },
  },
} as const
