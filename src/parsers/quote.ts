import type { ParserDef } from '../types'
import { wrap } from '../utils'

export const quote: ParserDef = {
  name: 'quote',
  regex: /^(?<all>(?:>\s+[^$\n]+(?:\n|$))+)/,
  handler: ({ all }, { parseParagraph }) =>
    wrap(
      'blockquote',
      parseParagraph(
        all
          .split('\n')
          .map((x) => x.slice(1).trim())
          .join('\n')
      )[0]
    ),
}
