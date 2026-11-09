import { Samenbank } from '../chapters/samenbank'
import { WildH } from '../chapters/wildH'
import { chapterWild, handEntry } from './hand'

export default handEntry('samenbank', Samenbank, chapterWild('samenbank', WildH))
