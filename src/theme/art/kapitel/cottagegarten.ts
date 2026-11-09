import { Cottagegarten } from '../chapters/cottagegarten'
import { WildD } from '../chapters/wildD'
import { chapterWild, handEntry } from './hand'

export default handEntry('cottagegarten', Cottagegarten, chapterWild('cottagegarten', WildD))
