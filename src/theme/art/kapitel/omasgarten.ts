import { Omasgarten } from '../chapters/omasgarten'
import { WildI } from '../chapters/wildI'
import { chapterWild, handEntry } from './hand'

export default handEntry('omasgarten', Omasgarten, chapterWild('omasgarten', WildI))
