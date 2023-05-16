import { defaultParsers } from './defaultParsers'
import { createTokenizerParser } from './tokenizer'
import type { ParserDef } from './types'

export type StarkdownOpts = {
  plugins?: ParserDef[]
}

/**
 * Parse Markdown into an HTML String
 */
function starkdown(md: string, { plugins = [...defaultParsers] }: StarkdownOpts = {}): string {
  if (!md) return `<p></p>`
  const { parse } = createTokenizerParser(plugins)
  return parse(md)
}

export { createTokenizerParser, starkdown }
