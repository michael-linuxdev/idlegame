import { Paprikafelder } from '../chapters/paprikafelder'
import { WildE } from '../chapters/wildE'
import { chapterWild, handEntry } from './hand'

export default handEntry('paprikafelder', Paprikafelder, chapterWild('paprikafelder', WildE))
