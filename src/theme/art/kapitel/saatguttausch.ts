import { Saatguttausch } from '../chapters/saatguttausch'
import { WildI } from '../chapters/wildI'
import { chapterWild, handEntry } from './hand'

export default handEntry('saatguttausch', Saatguttausch, chapterWild('saatguttausch', WildI))
