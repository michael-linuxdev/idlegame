import { Schlossgarten } from '../chapters/schlossgarten'
import { WildC } from '../chapters/wildC'
import { chapterWild, handEntry } from './hand'

export default handEntry('schlossgarten', Schlossgarten, chapterWild('schlossgarten', WildC))
