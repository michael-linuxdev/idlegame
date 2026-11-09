import { Milpa } from '../chapters/milpa'
import { WildF } from '../chapters/wildF'
import { chapterWild, handEntry } from './hand'

export default handEntry('milpa', Milpa, chapterWild('milpa', WildF))
