import { expect, describe, test } from 'vitest'
import { starkdown } from '../src'

describe('paragraphs', () => {
  test('creates single paragraphs', () => {
    expect(starkdown('Here is a single Paragraph')).toEqual('<p>Here is a single Paragraph</p>')

    expect(starkdown('Here is a\n single Paragraph')).toEqual('<p>Here is a\n single Paragraph</p>')
  })

  test('parses two new lines as separate paragraphs', () => {
    expect(starkdown('Something with\n\na line break')).toEqual(
      '<p>Something with</p><p>a line break</p>'
    )

    expect(starkdown('Here...\n\n\n are...\n\nthree \n\nno, 4 Paragraphs!')).toEqual(
      '<p>Here...</p><p>are...</p><p>three</p><p>no, 4 Paragraphs!</p>'
    )

    expect(
      starkdown(
        '\nHere...\n\n\n \nare...\n\nthree\n \n\nno,\n 4 Paragraphs!\nshould not delete single linebreaks'
      )
    ).toEqual(
      '<p>Here...</p><p>are...</p><p>three</p><p>no,\n 4 Paragraphs!\nshould not delete single linebreaks</p>'
    )
  })

  test('parses two spaces plus line break as <br />', () => {
    expect(starkdown('Something with  \na line break')).toEqual(
      '<p>Something with<br />a line break</p>'
    )
    expect(starkdown('Something with \na line break')).toEqual(
      '<p>Something with \na line break</p>'
    )
  })

  test('parses <br /> as <br />', () => {
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

describe('ignore special formating as part of words', () => {
  test(`_`, () => {
    expect(starkdown(`I like tiny\\_libraries _for real_`)).toEqual(
      `<p>I like tiny_libraries <em>for real</em></p>`
    )
  })
  test('__', () => {
    expect(starkdown(`I like tiny\\_\\_libraries __for real__`)).toEqual(
      `<p>I like tiny__libraries <strong>for real</strong></p>`
    )
  })
  test(`~~`, () => {
    expect(starkdown(`I like tiny\\~\\~libraries ~~for real~~`)).toEqual(
      `<p>I like tiny~~libraries <s>for real</s></p>`
    )
  })
  test(`-`, () => {
    expect(starkdown(`I like tiny - libraries -for real-`)).toEqual(
      `<p>I like tiny - libraries -for real-</p>`
    )
  })
  test(`*`, () => {
    expect(starkdown(`I like tiny\\*libraries *for real*`)).toEqual(
      `<p>I like tiny*libraries <em>for real</em></p>`
    )
  })
  test(`**`, () => {
    expect(starkdown(`I like tiny\\*\\*libraries **for real**`)).toEqual(
      `<p>I like tiny**libraries <strong>for real</strong></p>`
    )
  })
})

describe('nested formatting', () => {
  test(`**_`, () => {
    expect(starkdown(`I like code **_for real_**`)).toEqual(
      `<p>I like code <strong><em>for real</em></strong></p>`
    )
  })
  test('__*', () => {
    expect(starkdown(`I like code __*for real*__`)).toEqual(
      `<p>I like code <strong><em>for real</em></strong></p>`
    )
  })
  test(`_**`, () => {
    expect(starkdown(`I like code _**for real**_`)).toEqual(
      `<p>I like code <em><strong>for real</strong></em></p>`
    )
  })
  test('*__', () => {
    expect(starkdown(`I like code *__for real__*`)).toEqual(
      `<p>I like code <em><strong>for real</strong></em></p>`
    )
  })
  test(`**~~`, () => {
    expect(starkdown(`I like code **~~for real~~**`)).toEqual(
      `<p>I like code <strong><s>for real</s></strong></p>`
    )
  })
  test(`~~**`, () => {
    expect(starkdown(`I like code ~~**for real**~~`)).toEqual(
      `<p>I like code <s><strong>for real</strong></s></p>`
    )
  })
})

describe('text formatting', () => {
  test('parses bold with **', () => {
    expect(starkdown('I **like** tiny libraries')).toEqual(
      '<p>I <strong>like</strong> tiny libraries</p>'
    )
  })

  test('parses bold with __', () => {
    expect(starkdown('I __like__ tiny libraries')).toEqual(
      '<p>I <strong>like</strong> tiny libraries</p>'
    )
  })

  test('parses italics with *', () => {
    expect(starkdown('I *like* tiny libraries')).toEqual('<p>I <em>like</em> tiny libraries</p>')
  })

  test('parses italics with _', () => {
    expect(starkdown('I _like_ tiny libraries')).toEqual('<p>I <em>like</em> tiny libraries</p>')
  })

  test('parses strikethrough with ~~', () => {
    expect(starkdown('I ~~like~~ tiny libraries')).toEqual('<p>I <s>like</s> tiny libraries</p>')
  })

  test('parses mixes', () => {
    expect(starkdown('_This_ is **easy** to `use`.')).toEqual(
      '<p><em>This</em> is <strong>easy</strong> to <code>use</code>.</p>'
    )
  })
})

describe('titles', () => {
  test('parses H1 titles', () => {
    expect(starkdown('# I like tiny libraries')).toEqual('<h1>I like tiny libraries</h1>')
  })

  test('parses underlined H1 titles', () => {
    expect(starkdown('I like tiny libraries\n===')).toEqual('<h1>I like tiny libraries</h1>')
  })

  test('parses H2 titles', () => {
    expect(starkdown('## I like tiny libraries')).toEqual('<h2>I like tiny libraries</h2>')
  })

  test('parses H3 titles', () => {
    expect(starkdown('### I like tiny libraries')).toEqual('<h3>I like tiny libraries</h3>')
  })

  test('parses H4 titles', () => {
    expect(starkdown('#### I like tiny libraries')).toEqual('<h4>I like tiny libraries</h4>')
  })

  test('parses H5 titles', () => {
    expect(starkdown('##### I like tiny libraries')).toEqual('<h5>I like tiny libraries</h5>')
  })

  test('parses H6 titles', () => {
    expect(starkdown('###### I like tiny libraries')).toEqual('<h6>I like tiny libraries</h6>')
  })

  test('parses titles with reference links', () => {
    expect(
      starkdown(
        '# I like [tiny libraries]\n\n[tiny libraries]: https://github.com/developit/starkdown'
      )
    ).toEqual('<h1>I like <a href="https://github.com/developit/starkdown">tiny libraries</a></h1>')
  })
})

describe('links & images', () => {
  test('parses links', () => {
    expect(starkdown('[starkdown](http://github.com/developit/starkdown)')).toEqual(
      '<p><a href="http://github.com/developit/starkdown">starkdown</a></p>'
    )
  })

  test('parses links with bold text', () => {
    expect(starkdown('[**starkdown**](http://github.com/developit/starkdown)')).toEqual(
      '<p><a href="http://github.com/developit/starkdown"><strong>starkdown</strong></a></p>'
    )
    expect(starkdown('[ **starkdown** ](http://github.com/developit/starkdown)')).toEqual(
      '<p><a href="http://github.com/developit/starkdown"> <strong>starkdown</strong> </a></p>'
    )
  })

  test('parses anchor links', () => {
    expect(starkdown('[Example](#example)')).toEqual('<p><a href="#example">Example</a></p>')
  })

  test('parses images', () => {
    expect(starkdown('![title](foo.png)')).toEqual('<p><img src="foo.png" alt="title" /></p>')
    expect(starkdown('![](foo.png)')).toEqual('<p><img src="foo.png" alt="" /></p>')
  })

  test('parses images within links', () => {
    expect(starkdown('[![](toc.png)](#toc)')).toEqual(
      '<p><a href="#toc"><img src="toc.png" alt="" /></a></p>'
    )
    expect(starkdown('[![a](a.png)](#a) [![b](b.png)](#b)')).toEqual(
      '<p><a href="#a"><img src="a.png" alt="a" /></a> <a href="#b"><img src="b.png" alt="b" /></a></p>'
    )
  })

  test('parses reference links', () => {
    expect(starkdown('\nhello [World]!\n[world]: http://world.com')).toEqual(
      '<p>hello <a href="http://world.com">World</a>!</p>'
    )
  })

  test('parses reference links without creating excessive linebreaks', () => {
    expect(starkdown('\nhello [World]!\n\n[world]: http://world.com')).toEqual(
      '<p>hello <a href="http://world.com">World</a>!</p>'
    )
  })

  test('parses links and images inline (text + link)', () => {
    expect(
      starkdown('Go to [github](https://github.com)\n\nAnd check ![](/some-image.png)')
    ).toEqual(
      '<p>Go to <a href="https://github.com">github</a></p><p>And check <img src="/some-image.png" alt="" /></p>'
    )
  })

  test('parses links and images inline (link + text)', () => {
    expect(starkdown('[github](https://github.com)!\n\n![](/some-image.png)!')).toEqual(
      '<p><a href="https://github.com">github</a>!</p><p><img src="/some-image.png" alt="" />!</p>'
    )
  })

  test('parses links and images inline (text + link + text)', () => {
    expect(
      starkdown('Go to [github](https://github.com)!!\n\nAnd check ![](/some-image.png)!!')
    ).toEqual(
      '<p>Go to <a href="https://github.com">github</a>!!</p><p>And check <img src="/some-image.png" alt="" />!!</p>'
    )
  })

  test('parses links and images as standalone paragraphs', () => {
    expect(starkdown('[github](https://github.com)\n\n![](/some-image.png)')).toEqual(
      '<p><a href="https://github.com">github</a></p><p><img src="/some-image.png" alt="" /></p>'
    )
  })
})

describe('lists', () => {
  test('parses an unordered list with *', () => {
    expect(starkdown('* One\n* Two')).toEqual('<ul><li>One</li><li>Two</li></ul>')
  })

  test('parses an unordered list with -', () => {
    expect(starkdown('- One\n- Two')).toEqual('<ul><li>One</li><li>Two</li></ul>')
  })

  test('parses an unordered list with +', () => {
    expect(starkdown('+ One\n+ Two')).toEqual('<ul><li>One</li><li>Two</li></ul>')
  })

  test('parses an unordered list with mixed bullet point styles', () => {
    expect(starkdown('+ One\n* Two\n- Three')).toEqual(
      '<ul><li>One</li><li>Two</li><li>Three</li></ul>'
    )
  })

  test('parses an ordered list', () => {
    expect(starkdown('1. Ordered\n2. Lists\n4. Numbers are ignored')).toEqual(
      '<ol><li>Ordered</li><li>Lists</li><li>Numbers are ignored</li></ol>'
    )
  })
})

describe('code & quotes', () => {
  test('parses inline code', () => {
    expect(starkdown('Here is some code `var a = 1`.')).toEqual(
      '<p>Here is some code <code>var a = 1</code>.</p>'
    )
  })

  test('escapes inline code', () => {
    expect(starkdown('a `<">` b')).toEqual('<p>a <code>&lt;&quot;&gt;</code> b</p>')
  })

  test('parses three backtricks (```) as a code block', () => {
    expect(starkdown('```\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).toEqual(
      '<pre class="code "><code>function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre>'
    )

    expect(
      starkdown('```js\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')
    ).toEqual(
      '<pre class="code js"><code class="language-js">function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre>'
    )
  })

  test('parses tabs as a code poetry block', () => {
    expect(starkdown('\tvar a = 1')).toEqual(
      '<pre class="code poetry"><code>var a = 1</code></pre>'
    )
  })

  test('escapes code/quote blocks', () => {
    expect(starkdown('```\n<foo>\n```')).toEqual(
      '<pre class="code "><code>&lt;foo&gt;</code></pre>'
    )
    expect(starkdown('\t<foo>')).toEqual('<pre class="code poetry"><code>&lt;foo&gt;</code></pre>')
  })

  test('parses a block quote', () => {
    expect(starkdown('> To be or not to be')).toEqual('<blockquote>To be or not to be</blockquote>')
  })

  test('parses lists within block quotes', () => {
    expect(starkdown('> - one\n> - two\n> - **three**')).toEqual(
      '<blockquote><ul><li>one</li><li>two</li><li><strong>three</strong></li></ul></blockquote>'
    )
  })

  test("won't make paragraphs in code blocks", () => {
    expect(
      starkdown('```\n\n\nfunction codeBlocks() {\n\n\treturn "Can be inserted";\n\n}\n\n```')
    ).toEqual(
      '<pre class="code "><code>function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre>'
    )
  })
})

describe('<hr />', () => {
  test('should parse ---', () => {
    expect(starkdown('\n\n---\n\n')).toEqual('<hr />')
    expect(starkdown('foo\n\n------\n\nbar')).toEqual('<p>foo</p><hr /><p>bar</p>')
  })

  test('should parse --- in a >', () => {
    expect(starkdown('> foo\n\n---\n\nbar')).toEqual('<blockquote>foo</blockquote><hr /><p>bar</p>')
  })

  test('should parse * * *', () => {
    expect(starkdown('foo\n\n* * *\n\nbar')).toEqual('<p>foo</p><hr /><p>bar</p>')
    expect(starkdown('foo\n\n* * * *\n\nbar'), '* * * *').toEqual('<p>foo</p><hr /><p>bar</p>')
  })

  test('should parse * * * in a >', () => {
    expect(starkdown('> foo\n\n* * *\n\nbar')).toEqual(
      '<blockquote>foo</blockquote><hr /><p>bar</p>'
    )
  })
})

describe('edge cases', () => {
  // these mistakes are on the user...
  test('should not parse unclosed tags', () => {
    expect(starkdown('*foo')).toEqual('<p>*foo</p>')
    expect(starkdown('foo**')).toEqual('<p>foo**</p>')
    expect(starkdown('[some **bold text](#winning)')).toEqual(
      '<p><a href="#winning">some **bold text</a></p>'
    )
    expect(starkdown('`foo')).toEqual('<p>`foo</p>')
  })

  test('should not choke on single characters', () => {
    // @ts-ignore
    expect(starkdown()).toEqual('<p></p>')
    expect(starkdown('')).toEqual('<p></p>')
    expect(starkdown('*')).toEqual('<p>*</p>')
    expect(starkdown('_')).toEqual('<p>_</p>')
    expect(starkdown('**')).toEqual('<p>**</p>')
    expect(starkdown('__')).toEqual('<p>__</p>')
    expect(starkdown('>')).toEqual('<p>></p>')
    expect(starkdown('`')).toEqual('<p>`</p>')
    expect(starkdown('--')).toEqual('<p>--</p>')
    expect(starkdown('1')).toEqual('<p>1</p>')
    expect(starkdown('*1*')).toEqual('<p><em>1</em></p>')
    expect(starkdown('_1_')).toEqual('<p><em>1</em></p>')
    expect(starkdown('**1**')).toEqual('<p><strong>1</strong></p>')
    expect(starkdown('__1__')).toEqual('<p><strong>1</strong></p>')
    expect(starkdown('<>1</>')).toEqual('<>1</>')
    expect(starkdown('`1`')).toEqual('<p><code>1</code></p>')
    expect(starkdown('--1--')).toEqual('<p>--1--</p>')
  })
})

describe('tables', () => {
  test('should parse content', () => {
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

  test('should parse header', () => {
    expect(starkdown('| a | hallo welt | c |\n| ---')).toEqual(
      '<table><tr><th>a</th><th>hallo welt</th><th>c</th></tr></table>'
    )
    expect(starkdown('| a | b \n| --- | --- \n| e | f')).toEqual(
      '<table><tr><th>a</th><th>b</th></tr><tr><td>e</td><td>f</td></tr></table>'
    )
  })

  test('should allow inline styles', () => {
    expect(starkdown('| [Example](#example) | **strong** |')).toEqual(
      '<table><tr><td><a href="#example">Example</a></td><td><strong>strong</strong></td></tr></table>'
    )
    expect(starkdown('| a | # hallo welt | c |\n| ---')).toEqual(
      '<table><tr><th>a</th><th><h1>hallo welt</h1></th><th>c</th></tr></table>'
    )
    expect(
      starkdown('|  **[some bold text](#winning)** | b \n| --- | --- \n| > To be or not to be | f')
    ).toEqual(
      '<table><tr><th><strong><a href="#winning">some bold text</a></strong></th><th>b</th></tr><tr><td><blockquote>To be or not to be</blockquote></td><td>f</td></tr></table>'
    )
  })
})

describe('fenced divs (notes)', () => {
  test('parses three colons (:::) as fenced divs', () => {
    expect(starkdown(':::\ninfo\n:::')).toEqual('<div class="fenced"><p>info</p></div>')
  })
  test('fenced div with custom class', () => {
    expect(starkdown('::: info\ninfo\n:::')).toEqual('<div class="fenced info"><p>info</p></div>')
  })
  test('fenced div with custom classes', () => {
    expect(starkdown('::: info-card mt-md c-font-def\ninfo\n:::')).toEqual(
      '<div class="fenced info-card mt-md c-font-def"><p>info</p></div>'
    )
  })
  test('fenced div without initial space', () => {
    expect(starkdown(':::info-card mt-md\ninfo\n:::')).toEqual(
      '<div class="fenced info-card mt-md"><p>info</p></div>'
    )
  })
  test('fenced div with Markdown', () => {
    expect(starkdown(':::\n**info**\n:::')).toEqual(
      '<div class="fenced"><p><strong>info</strong></p></div>'
    )
  })
  test('fenced div with single new lines', () => {
    expect(starkdown(':::\n**info**\n[docs](https://github.com)\n:::')).toEqual(
      `<div class="fenced"><p><strong>info</strong>\n<a href="https://github.com">docs</a></p></div>`
    )
  })
  test('fenced div with double new lines', () => {
    expect(starkdown(':::\n**info**\n\n[docs](https://github.com)\n:::')).toEqual(
      '<div class="fenced"><p><strong>info</strong></p><p><a href="https://github.com">docs</a></p></div>'
    )
  })
})

describe('html', () => {
  test('should not parse a block tag', () => {
    expect(starkdown(`<div title="I **don't** parse"></div>`)).toEqual(
      `<div title="I **don't** parse"></div>`
    )
  })
  test('should add a <p> around an anchor tag', () => {
    expect(starkdown('<a class="_b" target="_blank">a</a>')).toEqual(
      '<p><a class="_b" target="_blank">a</a></p>'
    )
  })

  test('should parse outside HTML tags', () => {
    expect(starkdown('<a>**a**</a>')).toEqual('<p><a><strong>a</strong></a></p>')
    expect(starkdown('<a> **a** </a>')).toEqual('<p><a> <strong>a</strong> </a></p>')
  })
})

describe('too few linebreaks around blocks', () => {
  test('1 linebreak around >', () => {
    expect(starkdown('hi\n> - one\n> - two\n> - **three**\nhello')).toEqual(
      '<p>hi</p><blockquote><ul><li>one</li><li>two</li><li><strong>three</strong></li></ul></blockquote><p>hello</p>'
    )
  })

  test('1 linebreak around :::', () => {
    expect(starkdown('hi\n:::\ninfo\n:::\nhi')).toEqual(
      '<p>hi</p><div class="fenced"><p>info</p></div><p>hi</p>'
    )
  })

  test('1 linebreak around ```', () => {
    expect(
      starkdown(
        'Hi\n```\n\n\nfunction codeBlocks() {\n\n\treturn "Can be inserted";\n\n}\n\n```\nhello\n\nStark'
      )
    ).toEqual(
      '<p>Hi</p><pre class="code "><code>function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</code></pre><p>hello</p><p>Stark</p>'
    )
  })
  test('1 linebreak around <div>', () => {
    expect(starkdown(`hello\n<div title="I **don't** parse"></div>\nhello\n`)).toEqual(
      `<p>hello\n<div title="I **don't** parse"></div>\nhello</p>`
    )
  })
  test('1 linebreak around ---', () => {
    expect(starkdown('\n---\n')).toEqual('<hr />')
    expect(starkdown('foo\n\n---\nbar')).toEqual('<p>foo</p><hr /><p>bar</p>')
    expect(starkdown('foo\n\n----\nbar')).toEqual('<p>foo</p><hr /><p>bar</p>')
    expect(starkdown('> foo\n\n---\nbar')).toEqual('<blockquote>foo</blockquote><hr /><p>bar</p>')
  })

  test('1 linebreak around * * *', () => {
    expect(starkdown('foo\n* * *\nbar')).toEqual('<p>foo</p><hr /><p>bar</p>')
    expect(starkdown('foo\n* * * *\nbar'), '* * * *').toEqual('<p>foo</p><hr /><p>bar</p>')
    expect(starkdown('> foo\n\n* * *\nbar')).toEqual('<blockquote>foo</blockquote><hr /><p>bar</p>')
  })
})

describe('from the readme', () => {
  test('paragraphs example 1', () => {
    expect(starkdown(`Check [github](https://github.com)\n\nImg: ![](/some-image.png)`)).toEqual(
      '<p>Check <a href="https://github.com">github</a></p><p>Img: <img src="/some-image.png" alt="" /></p>'
    )
  })
  test('paragraphs example 2', () => {
    expect(starkdown(`[github](https://github.com)\n\n![](/some-image.png)`)).toEqual(
      '<p><a href="https://github.com">github</a></p><p><img src="/some-image.png" alt="" /></p>'
    )
  })
  test('paragraphs example 3', () => {
    expect(starkdown(`### Usage\n\`\`\`js\nconst a = 1\n\`\`\``)).toEqual(
      '<h3>Usage</h3><pre class="code js"><code class="language-js">const a = 1</code></pre>'
    )
  })
  test('tables example 1', () => {
    expect(starkdown(`| My | Table |`)).toEqual('<table><tr><td>My</td><td>Table</td></tr></table>')
  })
  test('fenced divs example 1', () => {
    expect(starkdown(`:::\nthis is some info\n:::`)).toEqual(
      '<div class="fenced"><p>this is some info</p></div>'
    )
  })
  test('fenced divs example 2', () => {
    expect(starkdown(`::: info\nthis is some info\n:::`)).toEqual(
      '<div class="fenced info"><p>this is some info</p></div>'
    )
  })
  test('formatting example 1', () => {
    expect(starkdown(`snake_case is _so-so_`)).toEqual('<p>snake<em>case is </em>so-so_</p>')
    expect(starkdown(`snake\\_case is _so-so_`)).toEqual('<p>snake_case is <em>so-so</em></p>')
  })
})

// test.only('complex edge case', () => {
//   const content = ``

//   expect(starkdown(content)).toEqual('')
// })
