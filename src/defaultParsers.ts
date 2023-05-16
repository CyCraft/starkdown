import { anchor } from './parsers/anchor'
import { bis } from './parsers/boldItalicsStrikethrough'
import { codeblock } from './parsers/codeblock'
import { escape } from './parsers/escape'
import { hashHeading } from './parsers/hashHeading'
import { hr } from './parsers/hr'
import { html } from './parsers/html'
import { image } from './parsers/image'
import { inlineCode } from './parsers/inlineCode'
import { newLine } from './parsers/newLine'
import { ol } from './parsers/ol'
import { poetry } from './parsers/poetry'
import { quote } from './parsers/quote'
import { table } from './parsers/table'
import { ul } from './parsers/ul'
import { underlineHeading } from './parsers/underlineHeading'

export const defaultParsers = [
  escape, // must always come first
  hr, // must always come second
  // the remaining order doesn't matter
  anchor,
  bis,
  codeblock,
  hashHeading,
  html,
  image,
  inlineCode,
  newLine,
  ol,
  poetry,
  quote,
  table,
  ul,
  underlineHeading,
]
