import type { ParserDef } from '../types'

export const escape: ParserDef = { name: 'escape', regex: /\\(?<c>.)/i, handler: ({ c }) => c }
