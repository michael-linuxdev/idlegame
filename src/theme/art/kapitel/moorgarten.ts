import { Moorgarten } from '../chapters/moorgarten'
import { WildC } from '../chapters/wildC'
import { chapterWild, handEntry } from './hand'

export default handEntry('moorgarten', Moorgarten, chapterWild('moorgarten', WildC))
