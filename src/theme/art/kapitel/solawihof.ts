import { Solawihof } from '../chapters/solawihof'
import { WildI } from '../chapters/wildI'
import { chapterWild, handEntry } from './hand'

export default handEntry('solawihof', Solawihof, chapterWild('solawihof', WildI))
