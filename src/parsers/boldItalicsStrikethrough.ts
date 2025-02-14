import type { ParserDef } from '../types.js'
import { wrap } from '../utils.js'

export const bis: ParserDef = {
  name: 'bis',
  regex: /(?<t>\*\*?|__?|~~)(?<content>.*?)(?<ns>[^\\\n])\k<t>/,
  handler: ({ t, content, ns }, { parseParagraph }) => {
    const el = t === '~~' ? 's' : t?.length === 1 ? 'em' : 'strong'
    return wrap(el, parseParagraph((content ?? '') + ns))
  },
}
