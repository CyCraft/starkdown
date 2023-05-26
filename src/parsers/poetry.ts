import type { ParserDef } from '../types'
import { encodeAttr, wrap } from '../utils'

export const poetry: ParserDef = {
  name: 'poetry',
  regex: /(?:^|\n+)(?:\t| {4})(?<content>.+)+\n*/,
  handler: ({ content }) => `<pre class="code poetry">${wrap('code', encodeAttr(content))}</pre>`,
}
