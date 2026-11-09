import { Artischocken } from '../chapters/artischocken'
import { WildD } from '../chapters/wildD'
import { chapterWild, handEntry } from './hand'

export default handEntry('artischocken', Artischocken, chapterWild('artischocken', WildD))
