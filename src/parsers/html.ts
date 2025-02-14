import type { ParserDef } from '../types.js'
export const html: ParserDef = {
  name: 'html',
  regex: /<(?<tagContent>[^>]+)>/,
  handler: ({ tagContent }) => `<${tagContent}>`,
}
