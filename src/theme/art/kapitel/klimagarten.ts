import { Klimagarten } from '../chapters/klimagarten'
import { WildH } from '../chapters/wildH'
import { chapterWild, handEntry } from './hand'

export default handEntry('klimagarten', Klimagarten, chapterWild('klimagarten', WildH))
