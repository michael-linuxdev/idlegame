import { Fassadengarten } from '../chapters/fassadengarten'
import { WildI } from '../chapters/wildI'
import { chapterWild, handEntry } from './hand'

export default handEntry('fassadengarten', Fassadengarten, chapterWild('fassadengarten', WildI))
