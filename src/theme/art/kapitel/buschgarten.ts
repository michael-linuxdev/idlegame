import { Buschgarten } from '../chapters/buschgarten'
import { WildG } from '../chapters/wildG'
import { chapterWild, handEntry } from './hand'

export default handEntry('buschgarten', Buschgarten, chapterWild('buschgarten', WildG))
