import { ParseData, ParserDef } from '../types'
import { createParseData, until, wrap } from '../utils'
const TABLE = Symbol('table')

export const table: ParserDef = {
  name: 'table',
  regex:
    /^(?:(?<loose>^\| *[^$|\n]+(?:\|? *[^$|\n]+)+\|?)|(?<defined>(?:\| *[^$|\n]+)+ *\|))(?<heading>(?:\n)\|? *-{3,} *?(?:\| *-{3,} *)*\|?)?(?:\n|$)/,
  handler: ({ loose, defined, heading }, { index, lastIndex, src, parseIter, parseParagraph }) => {
    const hasHeading = !!heading
    const row = (loose ?? defined).match(/\s*([^|]+)\s*(?=\||$)/gmu) as string[]

    const tableParse: ParseData[] = [
      ...until(parseIter(src.slice(lastIndex)), ([, , , x]) => !x?.[TABLE]),
    ]
    const cells = [
      row.map((x) => x.trim()),
      ...tableParse.flatMap(([, , , x]) => x?.cells as string[][]),
    ]
    const html = cells.map((row, i) =>
      wrap(
        'tr',
        row.map((x) => wrap(i === 0 && hasHeading ? 'th' : 'td', parseParagraph(x)[0]))
      )
    )
    return createParseData(wrap('table', html), index, lastIndex + (tableParse.at(-1)?.[2] ?? 0), {
      cells,
      hasHeading,
      [TABLE]: true,
    })
  },
}
