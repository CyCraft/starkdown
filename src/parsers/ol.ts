import type { ParserDef } from '../types.js'
import { wrap } from '../utils.js'

const trimItem = (x: string): string => x.replace(/^\d+[.)]\s+/, '').trim()

export const ol: ParserDef = {
  name: 'ol',
  regex: /^(?<all>(?:\n?\d+[.)]\s+)[.\n\r\t\S\s]+)/,
  handler: ({ all }, { parseParagraph }) => {
    const parts = all?.split(/\n(?=\d)/g)
    const spacedList = parts?.some((item) => item.endsWith('\n'))
    const [first, ...rest] = parts ?? []
    const startsWith = first?.match(/^\d+/)?.[0]
    const pWrap = spacedList
      ? (str: string): string => wrap('p', parseParagraph(str))
      : (str: string): string => parseParagraph(str)
    return wrap(
      'ol',
      [
        wrap('li', pWrap(trimItem(first ?? ''))),
        ...rest.map((x) => wrap('li', pWrap(trimItem(x)))),
      ],
      { start: startsWith == '1' ? null : startsWith },
    )
  },
}
