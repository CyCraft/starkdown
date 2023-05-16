import { describe, expect, test } from 'vitest'
import { starkdown } from '../src'

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
