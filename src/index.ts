import { createTokenizerParser } from './createTokenizerParser'
import { defaultParsers } from './defaultParsers'
import type { ParserDef } from './types'

export * from './createTokenizerParser'
export * from './defaultParsers'
export * from './types'

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
