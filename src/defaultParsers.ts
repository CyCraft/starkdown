import { escape } from './parsers/escape'
import { bis } from './parsers/boldItalicsStrikethrough'
import { codeblock } from './parsers/codeblock'
import { hashHeading } from './parsers/hashHeading'
import { hr } from './parsers/hr'
import { html } from './parsers/html'
import { image } from './parsers/image'
import { inlineCode } from './parsers/inlineCode'
import { anchor } from './parsers/anchor'
import { newLine } from './parsers/newLine'
import { ol } from './parsers/ol'
import { quote } from './parsers/quote'
import { table } from './parsers/table'
import { ul } from './parsers/ul'
import { underlineHeading } from './parsers/underlineHeading'
import { poetry } from './parsers/poetry'

export const defaultParsers = [
  escape,
  hr,
  codeblock,
  ul,
  ol,
  quote,
  image,
  anchor,
  poetry,
  underlineHeading,
  hashHeading,
  inlineCode,
  newLine,
  bis,
  table,
  html,
]
