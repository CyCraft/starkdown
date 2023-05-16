type MaybeArray<T> = T | T[]

export type ParseData = [
  result: MaybeArray<string>,
  /** Start index of match */
  startIndex: number,
  /** end index of match, this is useful if your end up parsing more than the tokeniser originally provided */
  stopIndex: number,
  /** any data you wish to forward can be included here for later parsers to use */
  data?: Record<string | symbol, unknown>
]

export type ParserFunction = (
  /** Capture groups are here */
  vars: Record<string, string>,
  state: {
    /** index of the token */
    index: number
    /** source string */
    src: string
    /** length of match */
    length: number
    /** index of the last char of match, (equal to index + length) */
    lastIndex: number
    /** for recursive parsing of tokens */
    parseParagraph: (str: string) => string
    parseNext: (str: string, start: number) => ParseData
    parseIter: (str: string) => IterableIterator<ParseData>
    parse: (str: string) => string
  }
  /** if a string is returned, it is transformed into parseData using the index and lastIndex in state */
) => string | ParseData

export type ParserDef = {
  /** must be a unique name */
  name: string
  /** regex must contain at least 1 named capture group,. these are parsed to as the vars in the ParserFunction */
  regex: RegExp
  handler: ParserFunction
}
