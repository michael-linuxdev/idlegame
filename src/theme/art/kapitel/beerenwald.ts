import { Beerenwald } from '../chapters/beerenwald'
import { WildD } from '../chapters/wildD'
import { chapterWild, handEntry } from './hand'

export default handEntry('beerenwald', Beerenwald, chapterWild('beerenwald', WildD))
