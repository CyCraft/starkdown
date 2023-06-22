import type { ParserDef } from '../types'
import { wrap } from '../utils'

export const underlineHeading: ParserDef = {
  name: 'underlineHeading',
  regex: /^(?<txt>[^\n]+)\n(?<line>-{3,}|={3,})(?:\n|$)/,
  handler: ({ txt, line }, { parseParagraph }) =>
    wrap(`h${line[0] === '=' ? '1' : '2'}`, parseParagraph(txt)[0]),
}
