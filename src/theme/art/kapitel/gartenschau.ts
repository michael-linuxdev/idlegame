import { Gartenschau } from '../chapters/gartenschau'
import { WildB } from '../chapters/wildB'
import { chapterWild, handEntry } from './hand'

export default handEntry('gartenschau', Gartenschau, chapterWild('gartenschau', WildB))
