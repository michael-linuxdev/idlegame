import { Wildblumenband } from '../chapters/wildblumenband'
import { WildI } from '../chapters/wildI'
import { chapterWild, handEntry } from './hand'

export default handEntry('wildblumenband', Wildblumenband, chapterWild('wildblumenband', WildI))
