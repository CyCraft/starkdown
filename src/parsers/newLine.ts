import type { ParserDef } from '../types.js'

export const newLine: ParserDef = {
  name: 'newLine',
  regex: /(?<lb> {2}\n)/,
  handler: () => `<br />`,
}
