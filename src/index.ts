import type { ParserDef } from './types'
import { defaultParsers } from './defaultParsers'
import { createTokenizerParser } from './tokenizer'

export type StarkdownOpts = {
  plugins?: ParserDef[]
}

/**
 * Parse Markdown into an HTML String
 */
export function starkdown(
  md: string,
  { plugins = [...defaultParsers] }: StarkdownOpts = {}
): string {
  if (!md) return `<p></p>`
  const { parse } = createTokenizerParser(plugins)
  return parse(md)
}
