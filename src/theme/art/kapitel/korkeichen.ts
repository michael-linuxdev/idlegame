import { Korkeichen } from '../chapters/korkeichen'
import { WildE } from '../chapters/wildE'
import { chapterWild, handEntry } from './hand'

export default handEntry('korkeichen', Korkeichen, chapterWild('korkeichen', WildE))
