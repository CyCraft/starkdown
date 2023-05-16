import { ParserDef } from '../types'
import { attrs, createParseData, parseAttrList, until } from '../utils'
const LINK_END = Symbol('isLinkEnd')

export const anchor: ParserDef = {
  name: 'anchor',
  regex:
    /(?<start>\[)|(?<end>\])(?:\((?<href>[^")]+?)(?: "(?<title>[^"]+)")?\))?(?:\{:(?<ial>.+?)\})?/,
  handler: ({ start, href, title, ial }, { index, src, lastIndex, parseNext, parseIter }) => {
    if (!start) return ['', index, lastIndex, { href, title, ial, [LINK_END]: true }]

    const contentRaw = [...until(parseIter(src.slice(index + 1)), (x) => x[3]?.[LINK_END])]
    const content = contentRaw.map(([x]) => x).join('')
    const endIndex = contentRaw.at(-1)?.[2] ?? 0
    const end = parseNext(src, index + endIndex + 1)
    const { ial: al, ...attr } = (end[3] as Record<string, string>) ?? {}
    return createParseData(
      `<a${attrs(attr ?? {})}${parseAttrList(al)}>${content}</a>`,
      index,
      end[2],
      { content, ...end[3], [LINK_END]: false }
    )
  },
}
