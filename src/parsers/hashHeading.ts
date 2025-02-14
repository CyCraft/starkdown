import type { ParserDef } from '../types.js'
import { wrap } from '../utils.js'

export const hashHeading: ParserDef = {
  name: 'hashHeading',
  regex: /^(?<level>#{1,6})\s*(?<txt>.+)(?:\n|$)/,
  handler: ({ level, txt }, { parseParagraph }) =>
    wrap(`h${level?.length}`, parseParagraph(txt ?? '')),
}
