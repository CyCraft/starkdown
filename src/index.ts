const TAGS = {
  '': ['<em>', '</em>'],
  '_': ['<strong>', '</strong>'],
  '*': ['<strong>', '</strong>'],
  '~': ['<s>', '</s>'],
  '\n': ['<br />'],
  ' ': ['<br />'],
  '-': ['<hr />'],
}

/** Outdent a string based on the first indented line's leading whitespace
 *	@private
 */
function outdent(str: string) {
  return str.replace(RegExp('^' + (str.match(/^(\t| )+/) || '')[0], 'gm'), '')
}

/** Encode special attribute characters to HTML entities in a String.
 *	@private
 */
function encodeAttr(str: string) {
  return (str + '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Parse Markdown into an HTML String. */
export function starkdown(md: string, prevLinks?: Record<string, string>) {
  const tokenizer =
    /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|( {2}\n\n*|\n{2,}|__|\*\*|[_*]|~~)/gm
  const context: any[] = []
  const links = prevLinks || {}
  let out = ''
  let last = 0
  let chunk, prev, token, inner

  function tag(token: string) {
    const desc = TAGS[(token[1] || '') as keyof typeof TAGS]
    const end = context[context.length - 1] == token
    if (!desc) return token
    if (!desc[1]) return desc[0]
    if (end) context.pop()
    else context.push(token)
    // @ts-ignore
    return desc[end | 0]
  }

  function flush() {
    let str = ''
    while (context.length) str += tag(context[context.length - 1])
    return str
  }

  md = md
    .replace(/^\[(.+?)\]:\s*(.+)$/gm, (s, name, url) => {
      links[name.toLowerCase()] = url
      return ''
    })
    .replace(/^\n+|\n+$/g, '')

  while ((token = tokenizer.exec(md))) {
    prev = md.substring(last, token.index)
    last = tokenizer.lastIndex
    chunk = token[0]
    if (prev.match(/[^\\](\\\\)*\\$/)) {
      // escaped
    }
    // Code/Indent blocks:
    else if (token[3] || token[4]) {
      const t = token[3] || token[4]
      chunk =
        '<pre class="code ' +
        (token[4] ? 'poetry' : token[2].toLowerCase()) +
        '"><code' +
        (token[2] ? ` class="language-${token[2].toLowerCase()}"` : '') +
        '>' +
        outdent(encodeAttr(t).replace(/^\n+|\n+$/g, '')) +
        '</code></pre>'
    }
    // > Quotes, -* lists:
    else if (token[6]) {
      let t = token[6]
      if (t.match(/\./)) {
        token[5] = token[5].replace(/^\d+/gm, '')
      }
      inner = starkdown(outdent(token[5].replace(/^\s*[>*+.-]/gm, '')))
      if (t == '>') t = 'blockquote'
      else {
        t = t.match(/\./) ? 'ol' : 'ul'
        inner = inner.replace(/^(.*)(\n|$)/gm, '<li>$1</li>')
      }
      chunk = '<' + t + '>' + inner + '</' + t + '>'
    }
    // Images:
    else if (token[8]) {
      chunk = `<img src="${encodeAttr(token[8])}" alt="${encodeAttr(token[7])}">`
    }
    // Links:
    else if (token[10]) {
      out = out.replace('<a>', `<a href="${encodeAttr(token[11] || links[prev.toLowerCase()])}">`)
      chunk = flush() + '</a>'
    } else if (token[9]) {
      chunk = '<a>'
    }
    // Headings:
    else if (token[12] || token[14]) {
      const t = 'h' + (token[14] ? token[14].length : token[13] > '=' ? 1 : 2)
      chunk = '<' + t + '>' + starkdown(token[12] || token[15], links) + '</' + t + '>'
    }
    // `code`:
    else if (token[16]) {
      chunk = '<code>' + encodeAttr(token[16]) + '</code>'
    }
    // Inline formatting: *em*, **strong** & friends
    else if (token[17] || token[1]) {
      chunk = tag(token[17] || '--')
    }
    out += prev
    out += chunk
  }

  return (out + md.substring(last) + flush()).replace(/^\n+|\n+$/g, '')
}
