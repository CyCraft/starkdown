import type { ParserDef } from '../types.js'
import { wrap } from '../utils.js'

export const quote: ParserDef = {
  name: 'quote',
  regex: /^(?<all>(?:>\s+[^$\n]+(?:\n|$))+)/,
  handler: ({ all }, { parseParagraph }) =>
    wrap(
      'blockquote',
      parseParagraph(
        all
          ?.split('\n')
          .map((x) => x.slice(1).trim())
          .join('\n') ?? '',
      ),
    ),
}
