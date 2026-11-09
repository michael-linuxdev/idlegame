import { Oase } from '../chapters/oase'
import { WildG } from '../chapters/wildG'
import { chapterWild, handEntry } from './hand'

export default handEntry('oase', Oase, chapterWild('oase', WildG))
