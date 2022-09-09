import { expect, describe, it } from 'vitest'
import { starkdown } from '../src'

describe('starkdown()', () => {
  describe('text formatting', () => {
    it('parses bold with **', () => {
      expect(starkdown('I **like** tiny libraries')).toEqual(
        'I <strong>like</strong> tiny libraries'
      )
    })

    it('parses bold with __', () => {
      expect(starkdown('I __like__ tiny libraries')).toEqual(
        'I <strong>like</strong> tiny libraries'
      )
    })

    it('parses italics with *', () => {
      expect(starkdown('I *like* tiny libraries')).toEqual('I <em>like</em> tiny libraries')
    })

    it('parses italics with _', () => {
      expect(starkdown('I _like_ tiny libraries')).toEqual('I <em>like</em> tiny libraries')
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

    it('parses titles with reference links', () => {
      expect(
        starkdown(
          '# I like [tiny libraries]\n\n[tiny libraries]: https://github.com/developit/starkdown'
        )
      ).toEqual(
        '<h1>I like <a href="https://github.com/developit/starkdown">tiny libraries</a></h1>'
      )
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
        'hello <a href="http://world.com">World</a>!'
      )
    })

    it('parses reference links without creating excessive linebreaks', () => {
      expect(starkdown('\nhello [World]!\n\n[world]: http://world.com')).toEqual(
        'hello <a href="http://world.com">World</a>!'
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

  describe('line breaks', () => {
    it('parses two new lines as line breaks', () => {
      expect(starkdown('Something with\n\na line break')).toEqual(
        'Something with<br />a line break'
      )
    })

    it('parses two spaces as a line break', () => {
      expect(starkdown('Something with  \na line break')).toEqual(
        'Something with<br />a line break'
      )
    })
  })

  describe('code & quotes', () => {
    it('parses inline code', () => {
      expect(starkdown('Here is some code `var a = 1`.')).toEqual(
        'Here is some code <code>var a = 1</code>.'
      )
    })

    it('escapes inline code', () => {
      expect(starkdown('a `<">` b')).toEqual('a <code>&lt;&quot;&gt;</code> b')
    })

    it('parses three backtricks (```) as a code block', () => {
      expect(
        starkdown('```\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')
      ).toEqual(
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
      expect(starkdown('\t<foo>')).toEqual(
        '<pre class="code poetry"><code>&lt;foo&gt;</code></pre>'
      )
    })

    it('parses a block quote', () => {
      expect(starkdown('> To be or not to be')).toEqual(
        '<blockquote>To be or not to be</blockquote>'
      )
    })

    it('parses lists within block quotes', () => {
      expect(starkdown('> - one\n> - two\n> - **three**\nhello')).toEqual(
        '<blockquote><ul><li>one</li><li>two</li><li><strong>three</strong></li></ul></blockquote>\nhello'
      )
    })
  })

  describe('horizontal rules', () => {
    it('should parse ---', () => {
      expect(starkdown('foo\n\n---\nbar')).toEqual('foo<hr />bar')
      expect(starkdown('foo\n\n----\nbar'), '----').toEqual('foo<hr />bar')
      expect(starkdown('> foo\n\n---\nbar')).toEqual('<blockquote>foo</blockquote><hr />bar')
    })

    it('should parse * * *', () => {
      expect(starkdown('foo\n* * *\nbar')).toEqual('foo<hr />bar')
      expect(starkdown('foo\n* * * *\nbar'), '* * * *').toEqual('foo<hr />bar')
      expect(starkdown('> foo\n\n* * *\nbar')).toEqual('<blockquote>foo</blockquote><hr />bar')
    })
  })

  describe('edge cases', () => {
    it('should close unclosed tags', () => {
      expect(starkdown('*foo')).toEqual('<em>foo</em>')
      expect(starkdown('foo**')).toEqual('foo<strong></strong>')
      expect(starkdown('[some **bold text](#winning)')).toEqual(
        '<a href="#winning">some <strong>bold text</strong></a>'
      )
      expect(starkdown('`foo')).toEqual('`foo')
    })

    it('should not choke on single characters', () => {
      expect(starkdown('*')).toEqual('<em></em>')
      expect(starkdown('_')).toEqual('<em></em>')
      expect(starkdown('**')).toEqual('<strong></strong>')
      expect(starkdown('>')).toEqual('>')
      expect(starkdown('`')).toEqual('`')
    })
  })
})
