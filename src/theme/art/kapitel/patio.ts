import { Patio } from '../chapters/patio'
import { WildE } from '../chapters/wildE'
import { chapterWild, handEntry } from './hand'

export default handEntry('patio', Patio, chapterWild('patio', WildE))
