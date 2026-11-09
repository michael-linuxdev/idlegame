import { Gewuerzgarten } from '../chapters/gewuerzgarten'
import { WildF } from '../chapters/wildF'
import { chapterWild, handEntry } from './hand'

export default handEntry('gewuerzgarten', Gewuerzgarten, chapterWild('gewuerzgarten', WildF))
