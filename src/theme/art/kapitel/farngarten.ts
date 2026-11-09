import { Farngarten } from '../chapters/farngarten'
import { WildG } from '../chapters/wildG'
import { chapterWild, handEntry } from './hand'

export default handEntry('farngarten', Farngarten, chapterWild('farngarten', WildG))
