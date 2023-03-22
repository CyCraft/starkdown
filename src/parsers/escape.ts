import type { ParserDef } from 'src/types'

export const escape: ParserDef = { name: 'escape', regex: /\\(?<c>.)/i, handler: ({ c }) => c }
