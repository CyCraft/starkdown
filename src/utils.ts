import { ParseData, ParserDef } from './types'

export const createParseData = <T>(
  value: string | string[],
  index: number,
  lastIndex: number,
  data?: T
): ParseData => (data ? [value, index, lastIndex, data] : [value, index, lastIndex]) as ParseData

/** Outdent a string based on the first indented line's leading whitespace
 *	@private
 */
export function outdent(str: string, indentValue?: number | string): string {
  let indentStr = ''
  if (typeof indentValue === 'number') indentStr = ' '.repeat(indentValue)
  if (typeof indentValue === 'string') indentStr = indentValue
  else indentStr = str.match(/^([\t ])+/)?.[0] ?? ''

  const matcher = new RegExp(`^${indentStr}`, 'gm')

  return str.replace(matcher, '')
}
/** Encode special attribute characters to HTML entities in a String.
 *	@private
 */
export function encodeAttr(str: string): string {
  return (str + '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export const wrap = (
  el: string,
  inner: string | string[],
  attributes?: Record<string, unknown>
) => {
  const attrString = attributes ? attrs(attributes) : ''
  return `<${el}${attrString}>${Array.isArray(inner) ? inner.join('') : inner}</${el}>`
}

export const parseAttrList = (str = '') => {
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

export function isInline(tag: string): boolean {
  const tagName = tag.replace(/^<\/?([A-z]+)[> /][.\n\r\t\S\s]*/m, '$1')
  return /^(?:a|abbr|acronym|audio|b|bdi|bdo|big|br|button|canvas|cite|code|data|datalist|del|dfn|em|embed|i|iframe|img|input|ins|kbd|label|map|mark|meter|noscript|object|output|picture|progress|q|ruby|s|samp|script|select|slot|small|span|strong|sub|sup|svg|template|textarea|time|u|tt|var|video|wbr)$/.test(
    tagName
  )
}

export function* until<T>(
  iter: Iterable<T>,
  fn: (x: T, i: number) => unknown
): IterableIterator<T> {
  let i = 0
  for (const item of iter) {
    if (fn(item, i++)) break
    else yield item
  }
}

export function attrs(attrs: Record<string, unknown>) {
  const result = Object.entries(attrs)
    .filter(([k, v]) => v != null && typeof k != 'symbol')
    .map(([k, v]) => (typeof v === 'boolean' ? k : `${k}="${v}"`))
    .join(' ')
    .trim()
  return result ? ` ${result}` : result
}

export const compileTokens = (tokens: Map<string, Omit<ParserDef, 'name'>>) => {
  const regexParts: string[] = []
  for (const [name, { regex }] of tokens) {
    regexParts.push(
      `(?:${regex.source.replace(/\\k<([^>]+?)>/giu, `\\k<${name}__$1>`)})`.replace(
        /\(\?<((?:[^=!])[^>]*?)>/giu,
        `(?<${name}__$1>`
      )
    )
  }

  return new RegExp(regexParts.join('|'), 'guid')
}
