import type { ParserDef } from '../types'
import { REPLACE_NEXT_PARAGRAPH } from '../types'
import { createParseData, wrap } from '../utils'

export const ul: ParserDef = {
  name: 'ul',
  regex: /^(?<all>(?:\n?[*+-]\s+[.\n\r\t\S\s]+)+)/,
  handler: ({ all }, { parseParagraph, nextParagraph }) => {
    const listNodes = all
      .slice(1)
      .split(/\n[*+-]/g)
      .map((x) => wrap('li', parseParagraph(x.trim())[0]))
    const shouldPrepend =
      nextParagraph?.startsWith('<ul><li>') && nextParagraph?.endsWith('</li></ul>')
    const content = shouldPrepend ? listNodes.join('') + nextParagraph!.slice(4, -5) : listNodes
    return shouldPrepend
      ? createParseData(wrap('ul', content), NaN, NaN, {
          [REPLACE_NEXT_PARAGRAPH]: true,
        })
      : wrap('ul', content)
  },
}
