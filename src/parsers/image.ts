import type { ParserDef } from '../types'
import { attrs } from '../utils'

export const image: ParserDef = {
  name: 'image',
  regex: /!\[(?<alt>[^\\)]*)\]\((?<src>[^" ]+?)(?: "(?<title>[^"]+)")?\)/,
  handler: ({ alt = '', src, title }) => `<img${attrs({ src, alt, title })} />`,
}
