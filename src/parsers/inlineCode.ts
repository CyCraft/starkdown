import type { ParserDef } from '../types'
import { wrap, encodeAttr } from '../utils'

export const inlineCode: ParserDef = {
  name: 'inlineCode',
  regex: /`(?<c>[^`]*)?`/,
  handler: ({ c }) => wrap('code', encodeAttr(c)),
}
