import { Kakaogarten } from '../chapters/kakaogarten'
import { WildG } from '../chapters/wildG'
import { chapterWild, handEntry } from './hand'

export default handEntry('kakaogarten', Kakaogarten, chapterWild('kakaogarten', WildG))
