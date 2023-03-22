import type { ParserDef } from '../types'

export const hr: ParserDef = {
  name: 'hr',
  regex: /(?<p>^|n\*)(?<l>-{3,}|\*(?: \*){2,})(?:$|\n+)/i,
  handler: () => '<hr />',
}
