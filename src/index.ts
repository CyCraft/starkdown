const TAGS = {
  '': ['<em>', '</em>'],
  '_': ['<strong>', '</strong>'],
  '*': ['<strong>', '</strong>'],
  '~': ['<s>', '</s>'],
  ' ': ['<br />'],
  '-': ['<hr />'],
}

function isInline(tag: string): boolean {
  const tagName = tag.replace(/^<\/?([a-z]+)[> /].*/, '$1')
  return /^(?:a|abbr|acronym|audio|b|bdi|bdo|big|br|button|canvas|cite|code|data|datalist|del|dfn|em|embed|i|iframe|img|input|ins|kbd|label|map|mark|meter|noscript|object|output|picture|progress|q|ruby|s|samp|script|select|slot|small|span|strong|sub|sup|svg|template|textarea|time|u|tt|var|video|wbr)$/.test(
    tagName
  )
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
function parse(md: string, options?: { links?: Record<string, string>; paragraphise?: boolean }) {
  const { links = {}, paragraphise = true } = options || {}

  const tokenizer =
    /((?:^|\n*)(?:\n?---+|\* \*(?: \*)+)\n*)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|( {2}\n\n*|\n{2,}|__|\*\*|[_*]|~~)|((?:(?:^|\n+)(?:\|.*))+)|(?:^::: *(\w*)\n([\s\S]*?)\n:::$)|<[^>]+>/gm

  const context: any[] = []

  let out = ''
  let last = 0
  let prevChunk, nextChunk, token, inner

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
    prevChunk = md.substring(last, token.index)
    last = tokenizer.lastIndex
    nextChunk = token[0]

    if (prevChunk.match(/[^\\](\\\\)*\\$/)) {
      // escaped
    }
    // Code/Indent blocks:
    else if (token[3] || token[4]) {
      const t = token[3] || token[4]
      nextChunk =
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
      inner = parse(outdent(token[5].replace(/^\s*[>*+.-]/gm, '')), { paragraphise: false })
      if (t == '>') t = 'blockquote'
      else {
        t = t.match(/\./) ? 'ol' : 'ul'
        inner = inner.replace(/^(.*)(\n|$)/gm, '<li>$1</li>')
      }
      nextChunk = '<' + t + '>' + inner + '</' + t + '>'
    }
    // Images:
    else if (token[8]) {
      nextChunk = `<img src="${encodeAttr(token[8])}" alt="${encodeAttr(token[7])}">`
    }
    // Links:
    else if (token[10]) {
      out = out.replace(
        '<a>',
        `<a href="${encodeAttr(token[11] || links[prevChunk.toLowerCase()])}">`
      )
      nextChunk = flush() + '</a>'
    } else if (token[9]) {
      nextChunk = '<a>'
    }
    // Headings:
    else if (token[12] || token[14]) {
      const t = 'h' + (token[14] ? token[14].length : token[13] > '=' ? 1 : 2)
      nextChunk =
        '<' +
        t +
        '>' +
        parse(token[12] || token[15], { links, paragraphise: false }) +
        '</' +
        t +
        '>'
    }
    // `code`:
    else if (token[16]) {
      nextChunk = '<code>' + encodeAttr(token[16]) + '</code>'
    }
    // Inline formatting: *em*, **strong** & friends
    else if (token[17] || token[1]) {
      nextChunk = tag(token[17] || '--')
    }
    // Table parser
    else if (token[18]) {
      const l = token[18].split('\n')
      let i = l.length,
        table = '',
        r = 'td>'
      while (i--) {
        if (l[i].match(/^\|\s+---+.*$/)) {
          r = 'th>'
          continue
        }
        const c = l[i].split(/\|\s*/)
        let j = c.length,
          tr = ''
        while (j--) {
          tr = (c[j] ? `<${r + parse(c[j].trim(), { paragraphise: false })}</${r}` : '') + tr
        }
        table = `<tr>${tr}</tr>` + table
        r = 'td>'
      }
      nextChunk = `<table>${table}</table>`
    }
    // Fenced divs:
    else if (token[20]) {
      nextChunk = `<div class="fenced ${token[19] || ''}">` + encodeAttr(token[20]) + '</div>'
    }

    if (paragraphise && prevChunk && !prevChunk.startsWith('<') && !isInline(nextChunk)) {
      out += `<p>${prevChunk
        .trim()
        .replace(/([^\n])( ?\n ?)([^\n])/gm, '$1 $3')}</p>${nextChunk.trim()}`
    } else {
      out += prevChunk
      out += nextChunk
    }
  }

  let tail = md.substring(last)

  const oneLiner =
    (!out.startsWith('<') || isInline(out)) && !out.match(/\n\n/) && !tail.match(/\n\n/)

  if (paragraphise && !oneLiner && tail.trim()) {
    tail = `<p>${tail.trim().replace(/([^\n])( ?\n ?)([^\n])/gm, '$1 $3')}</p>`
  }

  const result = (out + tail + flush()).replace(/^\n+|\n+$/g, '')

  return oneLiner && paragraphise
    ? `<p>${result.trim().replace(/([^\n])( ?\n ?)([^\n])/gm, '$1 $3')}</p>`
    : result
}

/**
 * Parse Markdown into an HTML String
 */
export function starkdown(md: string): string {
  if (!md) return ''
  if (md.length < 3) return md
  return parse(md)
}
