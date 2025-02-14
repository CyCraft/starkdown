import { createTokenizerParser } from './createTokenizerParser.js'
import { defaultParsers } from './defaultParsers.js'
import type { ParserDef } from './types.js'

export * from './createTokenizerParser.js'
export * from './defaultParsers.js'
export * from './types.js'

export type StarkdownOpts = {
  plugins?: ParserDef[]
}

/** Parse Markdown into an HTML String */
export function starkdown(
  md: string,
  { plugins = [...defaultParsers] }: StarkdownOpts = {},
): string {
  if (!md) return `<p></p>`
  const { parse } = createTokenizerParser(plugins)
  return parse(md)
}
