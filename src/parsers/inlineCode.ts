import type { ParserDef } from '../types.js'
import { encodeAttr, wrap } from '../utils.js'

export const inlineCode: ParserDef = {
  name: 'inlineCode',
  regex: /`(?<c>[^`]*)?`/,
  handler: ({ c }) => wrap('code', encodeAttr(c ?? '')),
}
