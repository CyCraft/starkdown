type MaybeArray<T> = T | T[]

export type ParseData = [
  result: MaybeArray<string>,
  startIndex: number,
  stopIndex: number,
  data?: Record<string | symbol, unknown>
]

export type ParserFunction = (
  vars: Record<string, string>,
  state: {
    index: number
    src: string
    length: number
    lastIndex: number
    parseParagraph: (str:string) => string
    parseNext: (str:string, start:number) => ParseData
    parseIter: (str:string) => IterableIterator<ParseData>,
    parse: (str:string) => string,
  }
) => string | ParseData

export type ParserDef = {
  name: string,
  regex: RegExp,
  handler: ParserFunction,
}
