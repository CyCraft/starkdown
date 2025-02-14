import type { ParserDef } from '../types.js'
import { wrap } from '../utils.js'

export const underlineHeading: ParserDef = {
  name: 'underlineHeading',
  regex: /^(?<txt>[^\n]+)\n(?<line>-{3,}|={3,})(?:\n|$)/,
  handler: ({ txt, line }, { parseParagraph }) =>
    wrap(`h${line?.[0] === '=' ? '1' : '2'}`, parseParagraph(txt ?? '')),
}
