import { Schulgarten } from '../chapters/schulgarten'
import { WildH } from '../chapters/wildH'
import { chapterWild, handEntry } from './hand'

export default handEntry('schulgarten', Schulgarten, chapterWild('schulgarten', WildH))
