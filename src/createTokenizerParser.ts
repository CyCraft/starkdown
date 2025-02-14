import { REPLACE_NEXT_PARAGRAPH, type ParseData, type ParserDef } from './types'
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

  function* parseIter(str: string, nextParagraph?: string): IterableIterator<ParseData> {
    let i = 0
    while (i < str.length) {
      const parsedData = parseNext(str, i, nextParagraph)
      if (parsedData[1] !== i) {
        yield createParseData(str.slice(i, parsedData[1]), i, parsedData[1])
      }
      i = parsedData[2]
      yield parsedData
    }
  }

  function parseNext(src: string, startIndex: number, nextParagraph?: string): ParseData {
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
      nextParagraph,
      ...tokenizerResult,
    })

    return Array.isArray(value)
      ? value
      : createParseData(value, startIndex + index, lastIndex, groups)
  }

  /** Parse a single Markdown paragraph into an HTML String. */
  function parseParagraph(
    md: string,
    nextParagraph?: string
  ): [Result: string, REPLACE_NEXT_PARAGRAPH?: symbol] {
    const results = [...parseIter(md, nextParagraph)]
    const paragraphContent = results.map(([x]) => x).join('')
    const lastResult = results[results.length - 1]
    return lastResult[3]?.[REPLACE_NEXT_PARAGRAPH]
      ? [paragraphContent, REPLACE_NEXT_PARAGRAPH]
      : [paragraphContent]
  }

  /** Parse Markdown into an HTML String. */
  function parse(md: string): string {
    /** Built out the result in a single string */
    let result = ''

    const badParagraphSpacingAroundFences =
      /(?:\r?\n)+(```[^\n]*|::: ?[^\n]*|-{3,}|\* \* \*(?: \*)*)(?:\r?\n)+/gm
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
      if (/```[^\n]*/.test(p) || /::: ?[^\n]*/.test(p)) fencedBlock = p.trim().slice(0, 3)
      if (p) result.push(p.replace(/(?:^\n+|\n+$)/g, ''))
      return result
    }, [])

    let i = restitchedFencedBlocks.length
    /** The previous paragraph content BEFORE wrapping in `<p></p>` */
    let nextParagraph: string | undefined = undefined
    while (i--) {
      const part = restitchedFencedBlocks[i]
      const [p, replaceSymbol] = parseParagraph(part, nextParagraph)
      if (
        replaceSymbol === REPLACE_NEXT_PARAGRAPH &&
        nextParagraph &&
        result.endsWith(nextParagraph)
      ) {
        result = result.slice(0, -nextParagraph.length)
      }
      nextParagraph = p
      result = (p && (!p.startsWith('<') || isInline(p)) ? `<p>${p.trim()}</p>` : p) + result
    }
    return result.trim()
  }

  const tokenizerResult = {
    parse,
    parseIter,
    parseNext,
    parseParagraph,
  }

  return tokenizerResult
}
