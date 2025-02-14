import type { ParserDef } from '../types.js'
import { encodeAttr, outdent } from '../utils.js'

export const codeblock: ParserDef = {
  name: 'codeblock',
  regex: /^```\s*(?<lang>\w*)\n(?<str>[\s\S]+)\n```(?:\n|$)/,
  handler: ({ lang, str }) =>
    `<pre class="code ${lang ?? ''}"><code${
      lang ? ` class="language-${lang.toLowerCase()}"` : ''
    }>${outdent(encodeAttr(str ?? '').replace(/(?:^\n+|\n+$)/g, ''))}</code></pre>`,
}
