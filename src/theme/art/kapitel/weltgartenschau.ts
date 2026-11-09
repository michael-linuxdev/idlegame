import { Weltgartenschau } from '../chapters/weltgartenschau'
import { WildI } from '../chapters/wildI'
import { chapterWild, handEntry } from './hand'

export default handEntry('weltgartenschau', Weltgartenschau, chapterWild('weltgartenschau', WildI))
