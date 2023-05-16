import type { ParserDef } from '../types'

export const fencedDiv: ParserDef = {
  name: 'fencedDiv',
  regex: /^::: *(?<cls>[^\n]+)?\n(?<content>[\s\S]+?)\n:::(?:\n|$)/,
  handler: ({ cls, content }, { parse }) =>
    `<div class="${['fenced', cls ?? ''].join(' ').trim()}">${parse(content)}</div>`,
}
