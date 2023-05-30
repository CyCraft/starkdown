import type { ParserDef } from '../types'
import { encodeAttr, outdent, wrap } from '../utils'

export const poetry: ParserDef = {
  name: 'poetry',
  regex: /(?:^|\n+)(?<tab>\t| {4})(?<content>[\s\S]+)(?:$|\n{2,})*/,
  handler: ({ content, tab }) =>
    `<pre class="code poetry">${outdent(wrap('code', encodeAttr(content)), tab)}</pre>`,
}
