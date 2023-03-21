type ParseData = [
  result: string,
  startIndex: number,
  stopIndex: number,
  data?: Record<string | symbol, unknown>
]
const LINK_END = Symbol('isLinkEnd')
const TABLE = Symbol('table')

const wrap = (el: string, inner: string | string[]) =>
  `<${el}>${Array.isArray(inner) ? inner.join('') : inner}</${el}>`

const parseAttrList = (str = '') => {
  const rules: string[] = []
  const classes: string[] = []
  let id = ''
  for (const { groups } of str.matchAll(
    /(?<attr_name>\w+)="(?<attr_val>[^"]+)"|(?:\.(?<cls>[\w-]+))|(?:#(?<id>[\w-]+))/g
  )) {
    if (groups?.id) id = groups.id
    else if (groups?.cls) classes.push(groups.cls)
    else rules.push(`${groups?.attr_name}="${groups?.attr_val}"`)
  }

  const x = [
    rules.join(' '),
    classes.length ? `class="${classes.join(' ')}"` : '',
    id ? `id="${id}"` : '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim()

  return x ? ` ${x}` : ''
}

function isInline(tag: string): boolean {
  const tagName = tag.replace(/^<\/?([A-z]+)[> /][.\n\r\t\S\s]*/m, '$1')
  return /^(?:a|abbr|acronym|audio|b|bdi|bdo|big|br|button|canvas|cite|code|data|datalist|del|dfn|em|embed|i|iframe|img|input|ins|kbd|label|map|mark|meter|noscript|object|output|picture|progress|q|ruby|s|samp|script|select|slot|small|span|strong|sub|sup|svg|template|textarea|time|u|tt|var|video|wbr)$/.test(
    tagName
  )
}

function* until<T>(iter: Iterable<T>, fn: (x: T, i: number) => unknown): IterableIterator<T> {
  let i = 0
  for (const item of iter) {
    if (fn(item, i++)) break
    else yield item
  }
}

function attrs(attrs: Record<string, string>) {
  const result = Object.entries(attrs)
    .filter(([k, v]) => v != null && typeof k != 'symbol')
    .map(([k, v]) => (typeof v === 'boolean' ? k : `${k}="${v}"`))
    .join(' ')
    .trim()
  return result ? ` ${result}` : result
}

/** Outdent a string based on the first indented line's leading whitespace
 *	@private
 */
function outdent(str: string): string {
  return str.replace(RegExp('^' + (str.match(/^([\t ])+/) || '')[0], 'gm'), '')
}

/** Encode special attribute characters to HTML entities in a String.
 *	@private
 */
function encodeAttr(str: string): string {
  return (str + '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

type ParserFunction = (
  vars: Record<string, string>,
  state: {
    index: number
    src: string
    length: number
    lastIndex: number
  }
) => string | ParseData

const tokens = new Map<string, [RegExp, ParserFunction]>([
  ['escape', [/\\(?<c>.)/i, ({ c }) => c]],
  ['hr', [/(?<p>^|n\*)(?<l>-{3,}|\*(?: \*){2,})(?:$|\n+)/i, () => '<hr />']],
  [
    'codeblock',
    [
      /^```\s*(?<lang>\w*)\n(?<str>[\s\S]+)\n```(?:\n|$)/,
      ({ lang, str }) =>
        `<pre class="code ${lang ?? ''}"><code${
          lang ? ` class="language-${lang.toLowerCase()}"` : ''
        }>${outdent(encodeAttr(str).replace(/^\n+|\n+$/g, ''))}</code></pre>`,
    ],
  ],
  [
    'poetry',
    [
      /(?:^|\n+)(?:\t|  {2,})(?<content>.+)+\n*/,
      ({ content }) => `<pre class="code poetry">${wrap('code', encodeAttr(content))}</pre>`,
    ],
  ],
  [
    'ul',
    [
      /^(?<all>(?:[*+-]\s+[^$\n]+(?:\n|$))+)/,
      ({ all }) =>
        wrap(
          'ul',
          all.split('\n').map((x) => wrap('li', parseParagraph(x.slice(1).trim())))
        ),
    ],
  ],
  [
    'ol',
    [
      /^(?<all>(?:\d.\s+[^$\n]+(?:\n|$))+)/,
      ({ all }) =>
        wrap(
          'ol',
          all.split('\n').map((x) => wrap('li', parseParagraph(x.replace(/^\d+\.\s+/, '').trim())))
        ),
    ],
  ],
  [
    'quote',
    [
      /^(?<all>(?:>\s+[^$\n]+(?:\n|$))+)/,
      ({ all }) =>
        wrap(
          'blockquote',
          parseParagraph(
            all
              .split('\n')
              .map((x) => x.slice(1).trim())
              .join('\n')
          )
        ),
    ],
  ],
  [
    'image',
    [
      /!\[(?<alt>[^\\)]*)\]\((?<src>[^" ]+?)(?: "(?<title>[^"]+)")?\)/,
      ({ alt = '', src, title }) => `<img${attrs({ src, alt, title })} />`,
    ],
  ],
  [
    'link',
    [
      /(?<start>\[)|\]\((?<href>[^")]+?)(?: "(?<title>[^"]+)")?\)(?:\{:(?<ial>.+?)\})?/,
      ({ start, href, title, ial }, { index, src, lastIndex }) => {
        if (!start) return ['', index, lastIndex, { href, title, ial, [LINK_END]: true }]

        const contentRaw = [...until(parseIter(src.slice(index + 1)), (x) => x[3]?.[LINK_END])]
        const content = contentRaw.map(([x]) => x).join('')
        const endIndex = contentRaw.at(-1)?.[2] ?? 0
        const end = parseNext(src, index + endIndex)
        const { ial: al, ...attr } = (end[3] as Record<string, string>) ?? {}
        return [
          `<a${attrs(attr ?? {})}${parseAttrList(al)}>${content}</a>`,
          index,
          end[2],
          { content, ...end[3], [LINK_END]: false },
        ]
      },
    ],
  ],
  [
    'underlineHeading',
    [
      /^(?<txt>[^\n]+)\n(?<line>-{3,}|={3,})(?:\n|$)/,
      ({ txt, line }) => wrap(`h${line[0] === '=' ? '1' : '2'}`, parseParagraph(txt)),
    ],
  ],
  [
    'hashHeading',
    [
      /^(?<level>#{1,6})\s*(?<txt>.+)(?:\n|$)/,
      ({ level, txt }) => wrap(`h${level.length}`, parseParagraph(txt)),
    ],
  ],
  ['inlineCode', [/`(?<c>[^`]*)?`/, ({ c }) => wrap('code', encodeAttr(c))]],
  ['newLine', [/(?<lb> {2}\n)/, () => `<br />`]],
  [
    'boldItalicsStrikethrough',
    [
      /(?<t>\*\*?|__?|~~)(?<content>.+?)(?<!\\)\k<t>/,
      ({ t, content }) =>
        wrap(t === '~~' ? 's' : t.length === 1 ? 'em' : 'strong', parseParagraph(content)),
    ],
  ],
  [
    'table',
    [
      /^(?:(?<loose>^\| *[^$|\n]+(?:\|? *[^$|\n]+)+\|?)|(?<defined>(?:\| *[^$|\n]+)+ *\|))(?<heading>(?:\n)\|? *-{3,} *?(?:\| *-{3,} *)*\|?)?(?:\n|$)/,
      ({ loose, defined, heading }, { index, lastIndex, src }) => {
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
            row.map((x) => wrap(i === 0 && hasHeading ? 'th' : 'td', parseParagraph(x)))
          )
        )
        return [
          wrap('table', html),
          index,
          lastIndex + (tableParse.at(-1)?.[2] ?? 0),
          { cells, hasHeading, [TABLE]: true },
        ]
      },
    ],
  ],
  [
    'fencedDiv',
    [
      /^::: *(?<cls>[^\n]+)?\n(?<content>[\s\S]+?)\n:::(?:\n|$)/,
      ({ cls, content }) =>
        `<div class="${['fenced', cls ?? ''].join(' ').trim()}">${parse(content)}</div>`,
    ],
  ],
  ['html', [/<(?<tagContent>[^>]+)>/, ({ tagContent }) => `<${tagContent}>`]],
])

const compileTokens = (tokens: Map<string, [RegExp, ParserFunction]>) => {
  const regexParts: string[] = []
  for (const [name, [regex]] of tokens) {
    regexParts.push(
      `(?:${regex.source.replace(/\\k<([^>]+?)>/giu, `\\k<${name}__$1>`)})`.replace(
        /\(\?<((?:[^=!])[^>]*?)>/giu,
        `(?<${name}__$1>`
      )
    )
  }

  return new RegExp(regexParts.join('|'), 'gumid')
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
  const match = compileTokens(tokens).exec(src.slice(startIndex))
  if (!match) {
    return [src.slice(startIndex), startIndex, src.length]
  }

  const {
    groups: groupsRaw,
    index,
    0: { length },
  } = match

  const nonEmptyGroups = Object.entries(groupsRaw ?? {}).filter(([k, v]) => v)
  const groups = Object.fromEntries(nonEmptyGroups.map(([k, v]) => [k.split('__')[1], v]))

  const lastIndex = startIndex + index + length
  const [name] = nonEmptyGroups[0][0].split('__')
  const [, handler] = tokens.get(name) as [RegExp, ParserFunction]
  const value = handler(groups, {
    index: startIndex + index,
    src,
    length,
    lastIndex,
  })

  return Array.isArray(value) ? value : [value, startIndex + index, lastIndex, groups]
}

/** Parse a single Markdown paragraph into an HTML String. */
function parseParagraph(md: string): string {
  return [...parseIter(md)].map(([x]) => x).join('')
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
    if (p) result.push(p.replace(/^\n+|\n+$/g, ''))
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

/**
 * Parse Markdown into an HTML String
 */
export function starkdown(md: string): string {
  if (!md) return `<p></p>`
  return parse(md)
}
