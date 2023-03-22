import type { ParserDef } from '../types'
import { wrap } from '../utils'

export const ol: ParserDef = {
  name: 'ol',
  regex: /^(?<all>(?:\d.\s+[^$\n]+(?:\n|$))+)/,
  handler: ({ all }, { parseParagraph }) =>
    wrap(
      'ol',
      all.split('\n').map((x) => wrap('li', parseParagraph(x.replace(/^\d+\.\s+/, '').trim())))
    ),
}
