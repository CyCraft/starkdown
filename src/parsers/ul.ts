import type { ParserDef } from '../types'
import { wrap } from '../utils'

export const ul: ParserDef = {
  name: 'ul',
  regex: /^(?<all>(?:[*+-]\s+[^$\n]+(?:\n|$))+)/,
  handler: ({ all }, { parseParagraph }) =>
    wrap(
      'ul',
      all.split('\n').map((x) => wrap('li', parseParagraph(x.slice(1).trim())))
    ),
}
