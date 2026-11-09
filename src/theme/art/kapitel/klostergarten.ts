import { Klostergarten } from '../chapters/klostergarten'
import { WildC } from '../chapters/wildC'
import { chapterWild, handEntry } from './hand'

export default handEntry('klostergarten', Klostergarten, chapterWild('klostergarten', WildC))
