import type { ParserDef } from '../types'
import { encodeAttr, wrap } from '../utils'

export const inlineCode: ParserDef = {
  name: 'inlineCode',
  regex: /`(?<c>[^`]*)?`/,
  handler: ({ c }) => wrap('code', encodeAttr(c)),
}
