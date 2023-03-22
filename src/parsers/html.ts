import type { ParserDef } from '../types'
export const html: ParserDef = {
  name: 'html',
  regex: /<(?<tagContent>[^>]+)>/,
  handler: ({ tagContent }) => `<${tagContent}>`,
}
