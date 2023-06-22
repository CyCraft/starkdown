import type { ParserDef } from '../types'
import { REPLACE_NEXT_PARAGRAPH } from '../types'
import { createParseData, wrap } from '../utils'

const trimItem = (x: string) => x.replace(/^\d+[.)]\s+/, '').trim()

function grabContentFromNextOl(nextOl: string): string {
  const match = nextOl.match(/<ol(?:\sstart="\d+")?>([.\n\r\t\S\s]+)<\/ol>/)
  return match ? match[1] : ''
}

export const ol: ParserDef = {
  name: 'ol',
  regex: /^(?<all>(?:\n?\d+[.)]\s+)[.\n\r\t\S\s]+)/,
  handler: ({ all }, { parseParagraph, nextParagraph }) => {
    // prep nodes
    const parts = all.split(/\n(?=\d)/g)
    const [first, ...rest] = parts
    const listNodes = [
      wrap('li', parseParagraph(trimItem(first))[0]),
      ...rest.map((x) => wrap('li', parseParagraph(trimItem(x))[0])),
    ]
    // calculate content
    const shouldPrepend = nextParagraph?.endsWith('</li></ol>')
    if (shouldPrepend) listNodes.push(grabContentFromNextOl(nextParagraph!))
    // calculate attrs
    const startsWith = first.match(/^\d+/)?.[0]
    const attrs = startsWith && startsWith !== '1' ? { start: startsWith } : undefined

    return shouldPrepend
      ? createParseData(wrap('ol', listNodes, attrs), NaN, NaN, {
          [REPLACE_NEXT_PARAGRAPH]: true,
        })
      : wrap('ol', listNodes, attrs)
  },
}
