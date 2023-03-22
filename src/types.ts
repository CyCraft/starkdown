type MaybeProvider<T> = T | (() => T)

export type ParseData = [
  result: MaybeProvider<(string | string[])>,
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
    store: {
      upsert: <T = unknown>(key: string, opts: {update?: (oldVal: T, k: string) => T, insert?: (k:string) => T }) => T
      get: <T = unknown> (key: string) => T | null
      remove: (key: string) => boolean
      has: (key: string) => boolean
    }
  }
) => string | ParseData

export type ParserDef = {
  name: string,
  regex: RegExp,
  handler: ParserFunction,
}
