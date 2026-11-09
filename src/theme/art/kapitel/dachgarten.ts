import { Dachgarten } from '../chapters/dachgarten'
import { WildH } from '../chapters/wildH'
import { chapterWild, handEntry } from './hand'

export default handEntry('dachgarten', Dachgarten, chapterWild('dachgarten', WildH))
