import { Alm } from '../chapters/alm'
import { WildA } from '../chapters/wildA'
import { chapterWild, handEntry } from './hand'

export default handEntry('alm', Alm, chapterWild('alm', WildA))
