import { Tulpenfelder } from '../chapters/tulpenfelder'
import { WildD } from '../chapters/wildD'
import { chapterWild, handEntry } from './hand'

export default handEntry('tulpenfelder', Tulpenfelder, chapterWild('tulpenfelder', WildD))
