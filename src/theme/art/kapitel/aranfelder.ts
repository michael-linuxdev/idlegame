import { Aranfelder } from '../chapters/aranfelder'
import { WildE } from '../chapters/wildE'
import { chapterWild, handEntry } from './hand'

export default handEntry('aranfelder', Aranfelder, chapterWild('aranfelder', WildE))
