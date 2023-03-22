import type { ParseData, ParserDef } from './types'
import { compileTokens, isInline } from './utils'

export const createTokenizerParser = (parsers: ParserDef[]) => {
  const tokens: Map<string, Omit<ParserDef, 'name'>> = new Map(
    parsers.map(({ name, ...rest }) => [name, rest])
  )
  const tokenizer = compileTokens(tokens)
  const store = new Map<string, unknown>()

  const tokenizerResult = {
    parse,
    parseIter,
    parseNext,
    parseParagraph,
    store: {
      upsert,
      get: store.get.bind(store) as <T = unknown>(key:string) => T,
      remove: store.delete.bind(store),
      has: store.has.bind(store)
    },
  }

  return tokenizerResult

  function upsert<T = unknown>(
    key: string,
    {
      update,
      insert,
    }: {
      update?: (oldVal: T, key: string) => T
      insert?: (key: string) => T
    } = {}
  ):T {
    const exists = store.has(key)
    const oldVal = store.get(key)
    let newVal = undefined;

    if (exists && update) {
      newVal = update(oldVal as T, key)
    }
    if(!exists && insert) {
      newVal = insert(key)
    }
    store.set(key, newVal)
    return newVal as T
  }

  function* parseIter(str: string): IterableIterator<ParseData> {
    let i = 0
    while (i < str.length) {
      const val = parseNext(str, i)
      if (val[1] !== i) {
        yield [str.slice(i, val[1]), i, val[1]]
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
    const { handler } = tokens.get(name) as Omit<ParserDef, 'name'>
    const value = handler(groups, {
      index: startIndex + index,
      src,
      length,
      lastIndex,
      ...tokenizerResult,
    })

    return Array.isArray(value) ? value : [value, startIndex + index, lastIndex, groups]
  }

  /** Parse a single Markdown paragraph into an HTML String. */
  function parseParagraph(md: string): string {
    return [...parseIter(md)]
      .map(([x]) => x)
      .flat(Infinity)
      .map(x=>typeof x === 'function' ? x() : x)
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
      if (/```[A-z]*/.test(p) || /::: ?[A-z]*/.test(p)) fencedBlock = p.slice(0, 3)
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
