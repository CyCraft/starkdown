import type { ParserDef } from '../types.js'

export const escape: ParserDef = {
  name: 'escape',
  regex: /\\(?<c>.)/i,
  handler: ({ c }) => c ?? '',
}
