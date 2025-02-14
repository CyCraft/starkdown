import type { ParserDef } from '../types.js'
import { wrap } from '../utils.js'

export const ul: ParserDef = {
  name: 'ul',
  regex: /^(?<all>(?:\n?[*+-]\s+[.\n\r\t\S\s]+)+)/,
  handler: ({ all }, { parseParagraph }) =>
    wrap(
      'ul',
      all
        ?.slice(1)
        .split(/\n[*+-]/g)
        .map((x) => wrap('li', parseParagraph(x.trim()))) ?? '',
    ),
}
