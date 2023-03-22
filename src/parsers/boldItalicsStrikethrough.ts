import type { ParserDef } from '../types'
import { wrap } from '../utils'

export const boldItalicsStrikethrough: ParserDef = {
  name: 'boldItalicsStrikethrough',
  regex: /(?<t>\*\*?|__?|~~)(?<content>.+?)(?<!\\)\k<t>/,
  handler: ({ t, content }, { parseParagraph }) => {
    const el = t === '~~' ? 's' : t.length === 1 ? 'em' : 'strong'
    return wrap(el, parseParagraph(content))
  },
}
