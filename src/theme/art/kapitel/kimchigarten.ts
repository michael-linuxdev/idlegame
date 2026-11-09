import { Kimchigarten } from '../chapters/kimchigarten'
import { WildG } from '../chapters/wildG'
import { chapterWild, handEntry } from './hand'

export default handEntry('kimchigarten', Kimchigarten, chapterWild('kimchigarten', WildG))
