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
function outdent(str: string): string {
  return str.replace(RegExp('^' + (str.match(/^(\t| )+/) || '')[0], 'gm'), '')
}

/** Encode special attribute characters to HTML entities in a String.
 *	@private
 */
function encodeAttr(str: string): string {
  return (str + '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Parse a single Markdown paragraph into an HTML String. */
function parseParagraph(
  md: string,
  /** Shared cache on anchor links to support reference/footer links */
  links: Record<string, string>
): string {
  const tokenizer =
    /((?:^|\n*)(?:\n?---+|\* \*(?: \*)+)\n*)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|( {2}\n\n*|\n{2,}|__|\*\*|[_*]|~~)|((?:(?:^|\n+)(?:\|.*))+)|(?:^::: *(\w*)\n([\s\S]*?)\n:::$)|<[^>]+>/gm

  const context: any[] = []

  let out = ''
  let last = 0
  let prevChunk, nextChunk, token, inner

  function tag(_token: string) {
    const desc = TAGS[(_token[1] || '') as keyof typeof TAGS]
    const end = context[context.length - 1] == _token
    if (!desc) return _token
    if (!desc[1]) return desc[0]
    if (end) context.pop()
    else context.push(_token)
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
      inner = parseParagraph(outdent(token[5].replace(/^\s*[>*+.-]/gm, '')), links)
      if (t == '>') t = 'blockquote'
      else {
        t = t.match(/\./) ? 'ol' : 'ul'
        inner = inner.replace(/^(.*)(\n|$)/gm, '<li>$1</li>')
      }
      nextChunk = '<' + t + '>' + inner + '</' + t + '>'
    }
    // Images:
    else if (token[8]) {
      nextChunk = `<img src="${encodeAttr(token[8])}" alt="${encodeAttr(token[7])}" />`
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
      nextChunk = '<' + t + '>' + parseParagraph(token[12] || token[15], links) + '</' + t + '>'
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
          tr = (c[j] ? `<${r + parseParagraph(c[j].trim(), links)}</${r}` : '') + tr
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

    out += prevChunk
    out += nextChunk
  }

  const tail = md.substring(last)
  const result = (out + tail + flush()).replace(/^\n+|\n+$/g, '')

  return result
}

/** Parse Markdown into an HTML String. */
function parse(md: string): string {
  /** Shared cache on anchor links to support reference/footer links */
  const links: Record<string, string> = {}
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
  const restitchedFencedBlocks = paragraphs.reduce<string[]>((result, p, i) => {
    if (fencedBlock) {
      result[result.length - 1] += `\n${p}`
      if (p === fencedBlock) fencedBlock = false
      return result
    }
    if (/```[A-z]*/.test(p) || /::: ?[A-z]*/.test(p)) fencedBlock = p.slice(0, 3)
    result.push(p)
    return result
  }, [])

  let i = restitchedFencedBlocks.length
  while (i--) {
    const part = restitchedFencedBlocks[i]
    const p = parseParagraph(part, links)
    result = (p && (!p.startsWith('<') || isInline(p)) ? `<p>${p.trim()}</p>` : p) + result
  }

  return result
}

/**
 * Parse Markdown into an HTML String
 */
export function starkdown(md: string): string {
  if (!md) return ''
  if (md.length < 3) return md
  return parse(md)
}
