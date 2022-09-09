import { expect, describe, it } from 'vitest'
import { starkdown } from '../src'

describe('paragraphs', () => {
  it('creates single paragraphs', () => {
    expect(starkdown('Here is a single Paragraph')).toEqual('<p>Here is a single Paragraph</p>')

    expect(starkdown('Here is a\n single Paragraph')).toEqual('<p>Here is a single Paragraph</p>')
  })

  it('parses two new lines as separate paragraphs', () => {
    expect(starkdown('Something with\n\na line break')).toEqual(
      '<p>Something with</p><p>a line break</p>'
    )

    expect(starkdown('Here...\n\n\n are...\n\nthree \n\nno, 4 Paragraphs!')).toEqual(
      '<p>Here...</p><p>are...</p><p>three</p><p>no, 4 Paragraphs!</p>'
    )

    expect(
      starkdown(
        '\nHere...\n\n\n \nare...\n\nthree\n \n\nno,\n 4 Paragraphs!\nshould delete single linebreaks'
      )
    ).toEqual(
      '<p>Here...</p><p>are...</p><p>three</p><p>no, 4 Paragraphs! should delete single linebreaks</p>'
    )
  })

  it('parses two spaces plus line break as <br />', () => {
    expect(starkdown('Something with  \na line break')).toEqual(
      '<p>Something with<br />a line break</p>'
    )
    expect(starkdown('Something with \na line break')).toEqual('<p>Something with a line break</p>')
  })

  it('parses <br /> as <br />', () => {
    expect(starkdown('Something with<br />a line break')).toEqual(
      '<p>Something with<br />a line break</p>'
    )
    expect(starkdown('Something with<br/>a line break')).toEqual(
      '<p>Something with<br/>a line break</p>'
    )
    expect(starkdown('Something with<br>a line break')).toEqual(
      '<p>Something with<br>a line break</p>'
    )
  })
})

describe('text formatting', () => {
  it('parses bold with **', () => {
    expect(starkdown('I **like** tiny libraries')).toEqual(
      '<p>I <strong>like</strong> tiny libraries</p>'
    )
  })

  it('parses bold with __', () => {
    expect(starkdown('I __like__ tiny libraries')).toEqual(
      '<p>I <strong>like</strong> tiny libraries</p>'
    )
  })

  it('parses italics with *', () => {
    expect(starkdown('I *like* tiny libraries')).toEqual('<p>I <em>like</em> tiny libraries</p>')
  })

  it('parses italics with _', () => {
    expect(starkdown('I _like_ tiny libraries')).toEqual('<p>I <em>like</em> tiny libraries</p>')
  })

  it('parses strikethrough with ~~', () => {
    expect(starkdown('I ~~like~~ tiny libraries')).toEqual('<p>I <s>like</s> tiny libraries</p>')
  })
})

describe('titles', () => {
  it('parses H1 titles', () => {
    expect(starkdown('# I like tiny libraries')).toEqual('<h1>I like tiny libraries</h1>')
  })

  it('parses underlined H1 titles', () => {
    expect(starkdown('I like tiny libraries\n===')).toEqual('<h1>I like tiny libraries</h1>')
  })

  it('parses H2 titles', () => {
    expect(starkdown('## I like tiny libraries')).toEqual('<h2>I like tiny libraries</h2>')
  })

  it('parses H3 titles', () => {
    expect(starkdown('### I like tiny libraries')).toEqual('<h3>I like tiny libraries</h3>')
  })

  it('parses H4 titles', () => {
    expect(starkdown('#### I like tiny libraries')).toEqual('<h4>I like tiny libraries</h4>')
  })

  it('parses H5 titles', () => {
    expect(starkdown('##### I like tiny libraries')).toEqual('<h5>I like tiny libraries</h5>')
  })

  it('parses H6 titles', () => {
    expect(starkdown('###### I like tiny libraries')).toEqual('<h6>I like tiny libraries</h6>')
  })

  it('parses titles with reference links', () => {
    expect(
      starkdown(
        '# I like [tiny libraries]\n\n[tiny libraries]: https://github.com/developit/starkdown'
      )
    ).toEqual('<h1>I like <a href="https://github.com/developit/starkdown">tiny libraries</a></h1>')
  })
})

describe('links & images', () => {
  it('parses links', () => {
    expect(starkdown('[starkdown](http://github.com/developit/starkdown)')).toEqual(
      '<a href="http://github.com/developit/starkdown">starkdown</a>'
    )
  })

  it('parses anchor links', () => {
    expect(starkdown('[Example](#example)')).toEqual('<a href="#example">Example</a>')
  })

  it('parses images', () => {
    expect(starkdown('![title](foo.png)')).toEqual('<img src="foo.png" alt="title">')
    expect(starkdown('![](foo.png)')).toEqual('<img src="foo.png" alt="">')
  })

  it('parses images within links', () => {
    expect(starkdown('[![](toc.png)](#toc)')).toEqual(
      '<a href="#toc"><img src="toc.png" alt=""></a>'
    )
    expect(starkdown('[![a](a.png)](#a) [![b](b.png)](#b)')).toEqual(
      '<a href="#a"><img src="a.png" alt="a"></a> <a href="#b"><img src="b.png" alt="b"></a>'
    )
  })

  it('parses reference links', () => {
    expect(starkdown('\nhello [World]!\n[world]: http://world.com')).toEqual(
      '<p>hello <a href="http://world.com">World</a>!</p>'
    )
  })

  it('parses reference links without creating excessive linebreaks', () => {
    expect(starkdown('\nhello [World]!\n\n[world]: http://world.com')).toEqual(
      '<p>hello <a href="http://world.com">World</a>!</p>'
    )
  })
})

describe('lists', () => {
  it('parses an unordered list with *', () => {
    expect(starkdown('* One\n* Two')).toEqual('<ul><li>One</li><li>Two</li></ul>')
  })

  it('parses an unordered list with -', () => {
    expect(starkdown('- One\n- Two')).toEqual('<ul><li>One</li><li>Two</li></ul>')
  })

  it('parses an unordered list with +', () => {
    expect(starkdown('+ One\n+ Two')).toEqual('<ul><li>One</li><li>Two</li></ul>')
  })

  it('parses an unordered list with mixed bullet point styles', () => {
    expect(starkdown('+ One\n* Two\n- Three')).toEqual(
      '<ul><li>One</li><li>Two</li><li>Three</li></ul>'
    )
  })

  it('parses an ordered list', () => {
    expect(starkdown('1. Ordered\n2. Lists\n4. Numbers are ignored')).toEqual(
      '<ol><li>Ordered</li><li>Lists</li><li>Numbers are ignored</li></ol>'
    )
  })
})

describe('code & quotes', () => {
  it('parses inline code', () => {
    expect(starkdown('Here is some code `var a = 1`.')).toEqual(
      '<p>Here is some code <code>var a = 1</code>.</p>'
    )
  })

  it('escapes inline code', () => {
    expect(starkdown('a `<">` b')).toEqual('<p>a <code>&lt;&quot;&gt;</code> b</p>')
  })

  it('parses three backtricks (```) as a code block', () => {
    expect(starkdown('```\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).toEqual(
      '<pre class="code "><code>function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre>'
    )

    expect(
      starkdown('```js\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')
    ).toEqual(
      '<pre class="code js"><code class="language-js">function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre>'
    )
  })

  it('parses tabs as a code poetry block', () => {
    expect(starkdown('\tvar a = 1')).toEqual(
      '<pre class="code poetry"><code>var a = 1</code></pre>'
    )
  })

  it('escapes code/quote blocks', () => {
    expect(starkdown('```\n<foo>\n```')).toEqual(
      '<pre class="code "><code>&lt;foo&gt;</code></pre>'
    )
    expect(starkdown('\t<foo>')).toEqual('<pre class="code poetry"><code>&lt;foo&gt;</code></pre>')
  })

  it('parses a block quote', () => {
    expect(starkdown('> To be or not to be')).toEqual('<blockquote>To be or not to be</blockquote>')
  })

  it('parses lists within block quotes', () => {
    expect(starkdown('> - one\n> - two\n> - **three**\nhello')).toEqual(
      '<blockquote><ul><li>one</li><li>two</li><li><strong>three</strong></li></ul></blockquote><p>hello</p>'
    )
  })

  it("won't make paragraphs in code blocks", () => {
    expect(
      starkdown(
        'Hi\n```\n\n\nfunction codeBlocks() {\n\n\treturn "Can be inserted";\n\n}\n\n```\nhello\n\nStark'
      )
    ).toEqual(
      '<p>Hi</p><pre class="code "><code>function codeBlocks() {\n\n\treturn &quot;Can be inserted&quot;;\n\n}</code></pre><p>hello</p><p>Stark</p>'
    )
  })
})

describe('horizontal rules', () => {
  it('should parse ---', () => {
    expect(starkdown('---')).toEqual('<hr />')
    expect(starkdown('foo\n\n---\n\nbar')).toEqual('<p>foo</p><hr /><p>bar</p>')
    expect(starkdown('foo\n\n---\nbar')).toEqual('<p>foo</p><hr /><p>bar</p>')
    expect(starkdown('foo\n\n----\nbar'), '----').toEqual('<p>foo</p><hr /><p>bar</p>')
    expect(starkdown('> foo\n\n---\nbar')).toEqual('<blockquote>foo</blockquote><hr /><p>bar</p>')
  })

  it('should parse * * *', () => {
    expect(starkdown('foo\n* * *\nbar')).toEqual('<p>foo</p><hr /><p>bar</p>')
    expect(starkdown('foo\n* * * *\nbar'), '* * * *').toEqual('<p>foo</p><hr /><p>bar</p>')
    expect(starkdown('> foo\n\n* * *\nbar')).toEqual('<blockquote>foo</blockquote><hr /><p>bar</p>')
  })
})

describe('edge cases', () => {
  it('should close unclosed tags', () => {
    expect(starkdown('*foo')).toEqual('<em><p>foo</p></em>')
    expect(starkdown('foo**')).toEqual('<p>foo<strong></strong></p>')
    expect(starkdown('[some **bold text](#winning)')).toEqual(
      '<a href="#winning">some <strong>bold text</strong></a>'
    )
    expect(starkdown('`foo')).toEqual('<p>`foo</p>')
  })

  it('should not choke on single characters', () => {
    expect(starkdown()).toEqual('')
    expect(starkdown('')).toEqual('')
    expect(starkdown('*')).toEqual('*')
    expect(starkdown('_')).toEqual('_')
    expect(starkdown('**')).toEqual('**')
    expect(starkdown('>')).toEqual('>')
    expect(starkdown('`')).toEqual('`')
    expect(starkdown('--')).toEqual('--')
  })
})

describe('tables', () => {
  it('should parse content', () => {
    expect(starkdown('| a | hallo welt | c |')).toEqual(
      '<table><tr><td>a</td><td>hallo welt</td><td>c</td></tr></table>'
    )
    expect(starkdown('| a |   b   |')).toEqual('<table><tr><td>a</td><td>b</td></tr></table>')
    expect(starkdown('| a | b \n| c | d')).toEqual(
      '<table><tr><td>a</td><td>b</td></tr><tr><td>c</td><td>d</td></tr></table>'
    )
    expect(starkdown('| a |   b    \n| c | d \n| e | f')).toEqual(
      '<table><tr><td>a</td><td>b</td></tr><tr><td>c</td><td>d</td></tr><tr><td>e</td><td>f</td></tr></table>'
    )
    expect(starkdown('| a')).toEqual('<table><tr><td>a</td></tr></table>')
  })

  it('should parse header', () => {
    expect(starkdown('| a | hallo welt | c |\n| ---')).toEqual(
      '<table><tr><th>a</th><th>hallo welt</th><th>c</th></tr></table>'
    )
    expect(starkdown('| a | b \n| --- | --- \n| e | f')).toEqual(
      '<table><tr><th>a</th><th>b</th></tr><tr><td>e</td><td>f</td></tr></table>'
    )
  })

  it('should allow inline styles', () => {
    expect(starkdown('| [Example](#example) | **strong** |')).toEqual(
      '<table><tr><td><a href="#example">Example</a></td><td><strong>strong</strong></td></tr></table>'
    )
    expect(starkdown('| a | # hallo welt | c |\n| ---')).toEqual(
      '<table><tr><th>a</th><th><h1>hallo welt</h1></th><th>c</th></tr></table>'
    )
    expect(
      starkdown('|   [some **bold text](#winning)  | b \n| --- | --- \n| > To be or not to be | f')
    ).toEqual(
      '<table><tr><th><a href="#winning">some <strong>bold text</strong></a></th><th>b</th></tr><tr><td><blockquote>To be or not to be</blockquote></td><td>f</td></tr></table>'
    )
  })
})

describe('fenced divs (notes)', () => {
  it('parses three colons (:::) as fenced divs', () => {
    expect(starkdown(':::\ninfo\n:::')).toEqual('<div class="fenced ">info</div>')
  })
  it('fenced div with custom class', () => {
    expect(starkdown('::: info\ninfo\n:::')).toEqual('<div class="fenced info">info</div>')
  })
})

describe('html', () => {
  it('should not parse inside tags', () => {
    expect(starkdown('<div title="I **don\'t** parse"></div>')).to.equal(
      '<div title="I **don\'t** parse"></div>'
    )
    expect(starkdown('<a class="_b" target="_blank">a</a>')).to.equal(
      '<a class="_b" target="_blank">a</a>'
    )
  })

  it('should parse outside HTML tags', () => {
    expect(starkdown('<a>**a**</a>')).to.equal('<a><strong>a</strong></a>')
  })
})
