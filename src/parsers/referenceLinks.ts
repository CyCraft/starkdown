import { ParserDef } from '../types'

const createDelayedLink = (key: string, getter: (str: string) => Map<string, string> | null) => {
  return () =>
      `<a href="${getter('reference_links')?.get(key.toLowerCase())??'#missing_link'}">${key}</a>`
}

export const referenceLinks: ParserDef = {
  name: 'referenceLink',
  regex: /(?:^|\n+)\[(?<label>[^\]]+)\]: (?<link>\S+)(?:$|\n+)?|(?:\[(?<ref>[\w ]+)\](?!\())/,
  handler: ({ label, link, ref }, { index, lastIndex, store: { upsert, get } }) => {
    if (ref) {
      return [createDelayedLink(ref, get<Map<string,string>>), index, lastIndex, { ref }]
    }
    upsert('reference_links', {
      insert: () => new Map([[label.toLowerCase(), link]]),
      update: (oldVal) => {
        oldVal.set(label.toLowerCase(), link)
        return oldVal
      },
    })
    return ''
  },
}
