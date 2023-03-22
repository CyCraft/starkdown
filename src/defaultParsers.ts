import { escape } from './parsers/escape'
import { boldItalicsStrikethrough } from './parsers/boldItalicsStrikethrough'
import { codeblock } from './parsers/codeblock'
import { fencedDiv } from './parsers/fencedDiv'
import { hashHeading } from './parsers/hashHeading'
import { hr } from './parsers/hr'
import { html } from './parsers/html'
import { image } from './parsers/image'
import { inlineCode } from './parsers/inlineCode'
import { link } from './parsers/link'
import { newLine } from './parsers/newLine'
import { ol } from './parsers/ol'
import { quote } from './parsers/quote'
import { table } from './parsers/table'
import { ul } from './parsers/ul'
import { underlineHeading } from './parsers/underlineHeading'
import { poetry } from './parsers/poetry'
import { referenceLinks } from './parsers/referenceLinks'

export const defaultParsers = [
  escape,
  hr,
  codeblock,
  ul,
  ol,
  quote,
  image,
  referenceLinks,
  link,
  poetry,
  underlineHeading,
  hashHeading,
  inlineCode,
  newLine,
  boldItalicsStrikethrough,
  table,
  fencedDiv,
  html,
]
