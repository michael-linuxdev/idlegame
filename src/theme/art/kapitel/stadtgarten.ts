import { Stadtgarten } from '../chapters/stadtgarten'
import { WildC } from '../chapters/wildC'
import { chapterWild, handEntry } from './hand'

export default handEntry('stadtgarten', Stadtgarten, chapterWild('stadtgarten', WildC))
