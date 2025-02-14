import type { ParserDef } from '../types.js'
import { attrs } from '../utils.js'

export const image: ParserDef = {
  name: 'image',
  regex: /!\[(?<alt>[^\\)]*)\]\((?<src>[^" ]+?)(?: "(?<title>[^"]+)")?\)/,
  handler: ({ alt = '', src, title }) => `<img${attrs({ src, alt, title })} />`,
}
