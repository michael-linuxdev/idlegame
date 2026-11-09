import { Rosental } from '../chapters/rosental'
import { WildE } from '../chapters/wildE'
import { chapterWild, handEntry } from './hand'

export default handEntry('rosental', Rosental, chapterWild('rosental', WildE))
