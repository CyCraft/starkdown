export type MaybeArray<T> = T | T[]

export type ParseData = [
  result: MaybeArray<string>,
  /** Start index of match */
  startIndex: number,
  /**
   * End index of match, this is useful if your end up parsing more than the tokeniser originally
   * provided
   */
  stopIndex: number,
  /** Any data you wish to forward can be included here for later parsers to use */
  data?: { [key in string | symbol]: unknown },
]

export type ParserFunction = (
  /** Capture groups are here */
  vars: { [key in string]: string },
  state: {
    /** Index of the token */
    index: number
    /** Source string */
    src: string
    /** Length of match */
    length: number
    /** Index of the last char of match, (equal to index + length) */
    lastIndex: number
    /** For recursive parsing of tokens */
    parseParagraph: (str: string) => string
    parseNext: (str: string, start: number) => ParseData
    parseIter: (str: string) => IterableIterator<ParseData>
    parse: (str: string) => string
  },
  /**
   * If a string is returned, it is transformed into parseData using the index and lastIndex in
   * state
   */
) => string | ParseData

export type ParserDef = {
  /** Must be a unique name */
  name: string
  /**
   * Regex must contain at least 1 named capture group,. these are parsed to as the vars in the
   * ParserFunction
   */
  regex: RegExp
  handler: ParserFunction
}
