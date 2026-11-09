import { Lavendel } from '../chapters/lavendel'
import { WildB } from '../chapters/wildB'
import { chapterWild, handEntry } from './hand'

export default handEntry('lavendel', Lavendel, chapterWild('lavendel', WildB))
