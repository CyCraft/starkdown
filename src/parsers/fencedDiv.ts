import type { ParserDef } from '../types'

export const fencedDiv: ParserDef = {
  name: 'fencedDiv',
  regex: /^::: ?(?<cls>[^\n]+)?\n(?<content>[\s\S]+?)\n:::(?:\n|$)/,
  handler: ({ cls, content }, { parse, parseIter }) =>
    (console.log({
      cls,
      content,
      l: `<div class="${['fenced', cls ?? ''].join(' ').trim()}">${parse(`\n${content}\n`)}</div>`,
      e: '<div class="fenced info"><p>a</p><p>b</p><p>c</p><p>d</p></div>',
      iter: [...parseIter(content)],
    }) as unknown) ||
    `<div class="${['fenced', cls ?? ''].join(' ').trim()}">${parse(content)}</div>`,
}
