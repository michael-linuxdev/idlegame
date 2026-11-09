import { Deichgarten } from '../chapters/deichgarten'
import { WildD } from '../chapters/wildD'
import { chapterWild, handEntry } from './hand'

export default handEntry('deichgarten', Deichgarten, chapterWild('deichgarten', WildD))
