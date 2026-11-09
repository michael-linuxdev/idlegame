/**
 * Kapitel 13–50 als Daten (Plan: docs/kapitel/plan.md).
 *
 * Ein Kapitel kommt ins Spiel, sobald es Texte (de + en) und Grafik hat:
 * dann steht seine ID in `ChapterId` und es wird in `chapters.ts` aus
 * dieser Liste übernommen (`RELEASED_UP_TO`). Spätere Kapitel liegen hier
 * schon mit Nummer, Skalierung und Weg — der Balance-Simulator schaltet mit
 * `SIM_ALL_CHAPTERS` alle 50 ein, um die Taktung über fünf Jahre zu messen.
 *
 * Bereichs-IDs gehören zum Speicherformat, sobald ein Kapitel veröffentlicht
 * ist. Für noch nicht gebaute Kapitel sind es Platzhalter (`<id>_1` …), die
 * mit der Welle ersetzt werden.
 */

export type SlotLayout = 'ZIGZAG' | 'RING' | 'TERRACES' | 'ROWS' | 'SPIRAL'

export interface PlannedChapter {
  id: string
  number: number
  layout: SlotLayout
  /** Bereichs-IDs in Leiter-Reihenfolge (10) */
  areas: readonly string[]
}

/** Bis zu diesem Kapitel ist alles gebaut (Texte, Grafik) und im Spiel. */
export const RELEASED_UP_TO = 39

const placeholder = (id: string) => Array.from({ length: 10 }, (_, i) => `${id}_${i + 1}`)

export const PLANNED_CHAPTERS: readonly PlannedChapter[] = [
  // Bogen I — Nach der Schau
  { id: 'stadtgarten', number: 13, layout: 'RING', areas: ['hochbeete', 'palettenbeete', 'regenspeicher', 'wurmkiste', 'kraeuterleiter', 'saatgutbibliothek', 'lastenrad', 'lehmofen', 'werkstatt', 'hoffest'] },
  { id: 'klostergarten', number: 14, layout: 'TERRACES', areas: ['kreuzgang', 'quittenhain', 'heilpflanzen', 'brunnenhaus', 'bienenmauer', 'schwesterngarten', 'kraeuterboden', 'klosterkueche', 'saatgutregister', 'glockenhof'] },
  { id: 'schlossgarten', number: 15, layout: 'RING', areas: ['parterre', 'spargelbeete', 'kanalallee', 'heckentheater', 'mauergarten', 'kuebelhalle', 'wasserachse', 'bosquet', 'schlossgaertnerei', 'sommerkonzert'] },
  { id: 'baumschule', number: 16, layout: 'ROWS', areas: ['saatbeete', 'veredelung', 'obstgehoelze', 'alleebaeume', 'heckenpflanzen', 'containerplatz', 'giessanlage', 'packschuppen', 'hofverkauf', 'pflanztag'] },
  { id: 'moorgarten', number: 17, layout: 'SPIRAL', areas: ['torfmoos', 'moosbeeren', 'wollgras', 'sonnentau', 'birkenhain', 'bohlenweg', 'beobachtungsturm', 'moorhuette', 'schnuckenstall', 'moorfest'] },
  { id: 'deichgarten', number: 18, layout: 'ZIGZAG', areas: ['sanddorn', 'salzwiese', 'koogacker', 'windschutz', 'strandrosen', 'kuttersteg', 'reetkate', 'friesenstube', 'leuchtturm', 'biike'] },
  { id: 'spreewald', number: 19, layout: 'ZIGZAG', areas: ['gurkenfeld', 'meerrettich', 'leinoelmuehle', 'kahnanleger', 'fliessgarten', 'einlegekueche', 'holzschuppen', 'trachtenhaus', 'erlenwald', 'gurkenfest'] },
  // Bogen II — Omas Saatgutbriefe
  { id: 'cottagegarten', number: 20, layout: 'ZIGZAG', areas: ['stockrosen', 'wickenzaun', 'gemueseparzelle', 'steinmauer', 'apfelspalier', 'holzgewaechshaus', 'teeplatz', 'geissblattlaube', 'gartenschuppen', 'dorfschau'] },
  { id: 'tulpenfelder', number: 21, layout: 'ROWS', areas: ['tulpenreihen', 'hyazinthen', 'narzissen', 'zwiebelscheune', 'windmuehle', 'gracht', 'fahrradstall', 'versteigerung', 'hausboot', 'tulpenmarkt'] },
  { id: 'artischocken', number: 22, layout: 'ZIGZAG', areas: ['artischockenfeld', 'lagunenwiese', 'bootsanleger', 'kanalgarten', 'granatapfelhecke', 'salzgarten', 'bootsschuppen', 'gemuesekahn', 'glockenturm', 'inselfest'] },
  { id: 'beerenwald', number: 23, layout: 'SPIRAL', areas: ['heidelbeerhang', 'preiselbeeren', 'moltebeeren', 'rotehuette', 'saftkueche', 'pilzlichtung', 'holzstapel', 'seesauna', 'mittsommer', 'jedermannspfad'] },
  { id: 'patio', number: 24, layout: 'RING', areas: ['orangenhof', 'azulejobrunnen', 'geranienwand', 'acequia', 'jasminbogen', 'granatapfelbaum', 'galerie', 'marmeladenkueche', 'gitterfenster', 'patiofest'] },
  { id: 'korkeichen', number: 25, layout: 'ZIGZAG', areas: ['korkhain', 'schaelplatz', 'eichelweide', 'storchenmast', 'schoepfrad', 'korkstapel', 'lehmhaus', 'honighaus', 'korkwerkstatt', 'korkfest'] },
  { id: 'paprikafelder', number: 26, layout: 'ROWS', areas: ['paprikareihen', 'paprikaschnuere', 'paprikamuehle', 'kalocsastube', 'schwengelbrunnen', 'tomatenfeld', 'akazienhain', 'schilfscheune', 'paprikamarkt', 'paprikafest'] },
  { id: 'aranfelder', number: 27, layout: 'TERRACES', areas: ['feldmauern', 'tangbeete', 'kartoffelfurchen', 'burrenblumen', 'aranweide', 'strickstube', 'strohcottage', 'klippenpfad', 'hafenmauer', 'ceili'] },
  { id: 'rosental', number: 28, layout: 'ROWS', areas: ['rosenreihen', 'pflueckkoerbe', 'destillierkessel', 'walnussallee', 'imkerwagen', 'rosenwasser', 'bergquelle', 'veranda', 'rosenboden', 'rosenfest'] },
  { id: 'pistazien', number: 29, layout: 'TERRACES', areas: ['pistazienhain', 'steinterrassen', 'kapellchen', 'mandelbaeume', 'kapernhang', 'roestplatz', 'inselhaus', 'zisterne', 'hafenmarkt', 'pistazienfest'] },
  // Bogen III — Wo die Samen herkommen
  { id: 'andenkartoffeln', number: 30, layout: 'TERRACES', areas: ['andenes', 'sortenbeet', 'quinoafeld', 'chunoplatz', 'lehmspeicher', 'alpakaweide', 'bergkanal', 'webstube', 'kartoffelpark', 'kartoffelfest'] },
  { id: 'milpa', number: 31, layout: 'RING', areas: ['milpafeld', 'chiligarten', 'amaranth', 'comalkueche', 'maisspeicher', 'agavenzaun', 'meliponen', 'saatgutkruege', 'markttag', 'erntefeier'] },
  { id: 'kaffeewald', number: 32, layout: 'ZIGZAG', areas: ['waldkaffee', 'pflueckplatz', 'trockenbetten', 'ensetegarten', 'honigbaeume', 'waschplatz', 'tukul', 'roestpfanne', 'kaffeezeremonie', 'kaffeemarkt'] },
  { id: 'reisterrassen', number: 33, layout: 'TERRACES', areas: ['sawah', 'wasserteiler', 'wassertempel', 'kokospalmen', 'entenweide', 'lumbung', 'hanggarten', 'bambusbruecke', 'flechtwerkstatt', 'tempelfest'] },
  { id: 'gewuerzgarten', number: 34, layout: 'ZIGZAG', areas: ['pfefferranken', 'kardamom', 'zimtbaeume', 'ingwerbeet', 'kurkuma', 'muskatbaum', 'trockenmatten', 'bootssteg', 'gewuerzlager', 'pookalam'] },
  { id: 'oase', number: 35, layout: 'RING', areas: ['dattelpalmen', 'stockwerkgarten', 'khettara', 'ksar', 'granataepfel', 'minzbeet', 'brunnenhof', 'teppichstube', 'dattelernte', 'sternenabend'] },
  { id: 'kakaogarten', number: 36, layout: 'ZIGZAG', areas: ['kakaobaeume', 'bananenschatten', 'fermentation', 'trockengestelle', 'kochbananen', 'yamsfeld', 'dorfplatz', 'genossenschaft', 'schokowerkstatt', 'kakaofest'] },
  { id: 'buschgarten', number: 37, layout: 'SPIRAL', areas: ['wattlehain', 'fingerlimetten', 'zitronenmyrte', 'saltbush', 'wasserloch', 'eukalyptus', 'mahlstein', 'saatguthuette', 'regentank', 'feuerabend'] },
  { id: 'farngarten', number: 38, layout: 'SPIRAL', areas: ['baumfarne', 'kauripfad', 'harakeke', 'haengebruecke', 'gluehwurmgrotte', 'kumaragarten', 'wasserfall', 'pflanzschule', 'hanghuette', 'matariki'] },
  { id: 'kimchigarten', number: 39, layout: 'ROWS', areas: ['kohlreihen', 'rettichbeet', 'chilimatten', 'onggi', 'sesamfeld', 'perillabeet', 'hanokhof', 'kimjang', 'kakibaum', 'chuseok'] },
  // Bogen IV — Saatgut für morgen
  { id: 'dachgarten', number: 40, layout: 'RING', areas: placeholder('dachgarten') },
  { id: 'schulgarten', number: 41, layout: 'ZIGZAG', areas: placeholder('schulgarten') },
  { id: 'waldgarten', number: 42, layout: 'SPIRAL', areas: placeholder('waldgarten') },
  { id: 'samenbank', number: 43, layout: 'RING', areas: placeholder('samenbank') },
  { id: 'klimagarten', number: 44, layout: 'ZIGZAG', areas: placeholder('klimagarten') },
  { id: 'wildblumenband', number: 45, layout: 'SPIRAL', areas: placeholder('wildblumenband') },
  { id: 'fassadengarten', number: 46, layout: 'TERRACES', areas: placeholder('fassadengarten') },
  { id: 'solawihof', number: 47, layout: 'ROWS', areas: placeholder('solawihof') },
  { id: 'saatguttausch', number: 48, layout: 'RING', areas: placeholder('saatguttausch') },
  { id: 'weltgartenschau', number: 49, layout: 'RING', areas: placeholder('weltgartenschau') },
  // Finale
  { id: 'omasgarten', number: 50, layout: 'ZIGZAG', areas: placeholder('omasgarten') },
]

/** Bogen (Abschnitt) eines Kapitels — für Gruppierung in Grundstücke/Sammlung. */
export function chapterArc(number: number): 0 | 1 | 2 | 3 | 4 | 5 {
  if (number <= 12) return 0
  if (number <= 19) return 1
  if (number <= 29) return 2
  if (number <= 39) return 3
  if (number <= 49) return 4
  return 5
}
