import { Baumschule } from '../chapters/baumschule'
import { WildC } from '../chapters/wildC'
import { chapterWild, handEntry } from './hand'

export default handEntry('baumschule', Baumschule, chapterWild('baumschule', WildC))
