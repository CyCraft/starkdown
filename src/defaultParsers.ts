import {
  anchor,
  bis,
  codeblock,
  escape,
  fencedDiv,
  hashHeading,
  hr,
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
} from './parsers/index.js'

export const defaultParsers = [
  escape, // must always come first
  hr, // must always come second
  // the remaining order doesn't matter
  anchor,
  bis,
  codeblock,
  fencedDiv,
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
