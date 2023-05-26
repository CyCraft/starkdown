import type { ParseData, ParserDef } from './types'
import { compileTokens, createParseData, isInline } from './utils'

/**
 * @example
 * export function markdown(md: string): string {
 *   if (!md) return `<p></p>`
 *   const plugins = [...defaultParsers, myCustomPlugin]
 *   const { parse } = createTokenizerParser(plugins)
 *   return parse(md)
 * }
 */
export function createTokenizerParser(parsers: ParserDef[]) {
  const tokens: Map<string, ParserDef> = new Map(parsers.map((x) => [x.name, x]))
  const tokenizer = compileTokens(tokens)

  const tokenizerResult = {
    parse,
    parseIter,
    parseNext,
    parseParagraph,
  }

  return tokenizerResult

  function* parseIter(str: string): IterableIterator<ParseData> {
    let i = 0
    while (i < str.length) {
      const val = parseNext(str, i)
      if (val[1] !== i) {
        yield createParseData(str.slice(i, val[1]), i, val[1])
      }
      i = val[2]
      yield val
    }
  }

  function parseNext(src: string, startIndex: number): ParseData {
    tokenizer.lastIndex = -1
    const match = tokenizer.exec(src.slice(startIndex))

    if (!match) {
      return [src.slice(startIndex), startIndex, src.length]
    }

    const {
      groups: groupsRaw,
      index,
      0: { length },
    } = match

    const nonEmptyGroups = Object.entries(groupsRaw ?? {}).filter((i) => i[1])
    const groups = Object.fromEntries(nonEmptyGroups.map(([k, v]) => [k.split('__')[1], v]))

    const lastIndex = startIndex + index + length
    const [name] = nonEmptyGroups[0][0].split('__')
    const { handler } = tokens.get(name) as ParserDef
    const value = handler(groups, {
      index: startIndex + index,
      src,
      length,
      lastIndex,
      ...tokenizerResult,
    })

    return Array.isArray(value)
      ? value
      : createParseData(value, startIndex + index, lastIndex, groups)
  }

  /** Parse a single Markdown paragraph into an HTML String. */
  function parseParagraph(md: string): string {
    return [...parseIter(md)]
      .map(([x]) => x)
      .flat(Infinity)
      .join('')
  }

  /** Parse Markdown into an HTML String. */
  function parse(md: string): string {
    /** Built out the result in a single string */
    let result = ''

    const badParagraphSpacingAroundFences = /(?:\r?\n)+(```|:::|-{3,}|\* \* \*(?: \*)*)(?:\r?\n)+/gm
    const badParagraphSpacingRegexBeforeBlocks = /(\r?\n[^\r\n >].*)(?:\r?\n)(>)/gm
    const badParagraphSpacingRegexAfterBlocks = /(\r?\n[>] .*)(?:\r?\n)([^\r\n >])/gm
    const goodParagraphSpacing = `\n${md}\n`
      .replace(badParagraphSpacingAroundFences, '\n\n$1\n\n')
      .replace(badParagraphSpacingRegexBeforeBlocks, '$1\n\n$2')
      .replace(badParagraphSpacingRegexAfterBlocks, '$1\n\n$2')

    const paragraphSplitRegex = / *(?:\r?\n){2,}/gm
    const paragraphs = goodParagraphSpacing.split(paragraphSplitRegex)

    let fencedBlock: false | string = false
    const restitchedFencedBlocks = paragraphs.reduce<string[]>((result, p) => {
      if (fencedBlock) {
        result[result.length - 1] += fencedBlock === ':::' ? `\n\n${p}` : `\n${p}`
        if (p === fencedBlock) fencedBlock = false
        return result
      }
      if (/```[^\n]*/.test(p) || /::: ?[^\n]*/.test(p)) fencedBlock = p.slice(0, 3)
      if (p) result.push(p.replace(/(?:^\n+|\n+$)/g, ''))
      return result
    }, [])

    let i = restitchedFencedBlocks.length
    while (i--) {
      const part = restitchedFencedBlocks[i]
      const p = parseParagraph(part)
      result = (p && (!p.startsWith('<') || isInline(p)) ? `<p>${p.trim()}</p>` : p) + result
    }
    return result
  }
}
