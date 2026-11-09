import { Andenkartoffeln } from '../chapters/andenkartoffeln'
import { WildF } from '../chapters/wildF'
import { chapterWild, handEntry } from './hand'

export default handEntry('andenkartoffeln', Andenkartoffeln, chapterWild('andenkartoffeln', WildF))
