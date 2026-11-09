import { Spreewald } from '../chapters/spreewald'
import { WildD } from '../chapters/wildD'
import { chapterWild, handEntry } from './hand'

export default handEntry('spreewald', Spreewald, chapterWild('spreewald', WildD))
