import { Reisterrassen } from '../chapters/reisterrassen'
import { WildF } from '../chapters/wildF'
import { chapterWild, handEntry } from './hand'

export default handEntry('reisterrassen', Reisterrassen, chapterWild('reisterrassen', WildF))
