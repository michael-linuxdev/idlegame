import { Kaffeewald } from '../chapters/kaffeewald'
import { WildF } from '../chapters/wildF'
import { chapterWild, handEntry } from './hand'

export default handEntry('kaffeewald', Kaffeewald, chapterWild('kaffeewald', WildF))
