import { Waldgarten } from '../chapters/waldgarten'
import { WildH } from '../chapters/wildH'
import { chapterWild, handEntry } from './hand'

export default handEntry('waldgarten', Waldgarten, chapterWild('waldgarten', WildH))
