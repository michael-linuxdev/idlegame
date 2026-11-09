import { Pistazien } from '../chapters/pistazien'
import { WildE } from '../chapters/wildE'
import { chapterWild, handEntry } from './hand'

export default handEntry('pistazien', Pistazien, chapterWild('pistazien', WildE))
