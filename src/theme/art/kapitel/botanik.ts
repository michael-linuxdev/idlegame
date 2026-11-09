import { Botanik } from '../chapters/botanik'
import { WildA } from '../chapters/wildA'
import { chapterWild, handEntry } from './hand'

export default handEntry('botanik', Botanik, chapterWild('botanik', WildA))
