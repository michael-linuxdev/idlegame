import { Kraeuter } from '../chapters/kraeuter'
import { WildA } from '../chapters/wildA'
import { chapterWild, handEntry } from './hand'

export default handEntry('kraeuter', Kraeuter, chapterWild('kraeuter', WildA))
