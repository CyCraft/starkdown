import { describe, expect, test } from 'vitest'
import { starkdown } from '../src/index.js'

describe('links & images', () => {
  test('parses links', () => {
    expect(starkdown('[starkdown](http://github.com/developit/starkdown)')).toEqual(
      '<p><a href="http://github.com/developit/starkdown">starkdown</a></p>',
    )
  })

  test('parses links with bold text', () => {
    expect(starkdown('[**starkdown**](http://github.com/developit/**starkdown**)')).toEqual(
      '<p><a href="http://github.com/developit/**starkdown**"><strong>starkdown</strong></a></p>',
    )
    expect(starkdown('[ **starkdown** ](http://github.com/developit/**starkdown**)')).toEqual(
      '<p><a href="http://github.com/developit/**starkdown**"> <strong>starkdown</strong> </a></p>',
    )
  })

  test('parses anchor links', () => {
    expect(starkdown('[Example](#example)')).toEqual('<p><a href="#example">Example</a></p>')
  })

  test('parses anchor links inline', () => {
    expect(starkdown('Hello [Example](#example)!')).toEqual(
      '<p>Hello <a href="#example">Example</a>!</p>',
    )
  })

  test('parses anchors with dashes inside', () => {
    expect(starkdown('[test.com/---/hello](test.com/---/hello)')).toEqual(
      '<p><a href="test.com/---/hello">test.com/---/hello</a></p>',
    )
  })

  test('parses anchors with other markdown inside', () => {
    expect(starkdown('[app\\_.test.com/\\_](app_.test.com/_)')).toEqual(
      '<p><a href="app_.test.com/_">app_.test.com/_</a></p>',
    )
  })

  test('parses images', () => {
    expect(starkdown('![title](foo.png)')).toEqual('<p><img src="foo.png" alt="title" /></p>')
    expect(starkdown('![](foo.png)')).toEqual('<p><img src="foo.png" alt="" /></p>')
  })

  test('parses images within links', () => {
    expect(starkdown('[![](toc.png)](#toc)')).toEqual(
      '<p><a href="#toc"><img src="toc.png" alt="" /></a></p>',
    )
    expect(starkdown('[![a](a.png)](#a) [![b](b.png)](#b)')).toEqual(
      '<p><a href="#a"><img src="a.png" alt="a" /></a> <a href="#b"><img src="b.png" alt="b" /></a></p>',
    )
  })

  test('parses links and images inline (text + link)', () => {
    expect(
      starkdown('Go to [github](https://github.com)\n\nAnd check ![](/some-image.png)'),
    ).toEqual(
      '<p>Go to <a href="https://github.com">github</a></p><p>And check <img src="/some-image.png" alt="" /></p>',
    )
  })

  test('parses links and images inline (link + text)', () => {
    expect(starkdown('[github](https://github.com)!\n\n![](/some-image.png)!')).toEqual(
      '<p><a href="https://github.com">github</a>!</p><p><img src="/some-image.png" alt="" />!</p>',
    )
  })

  test('parses links and images inline (text + link + text)', () => {
    expect(
      starkdown('Go to [github](https://github.com)!!\n\nAnd check ![](/some-image.png)!!'),
    ).toEqual(
      '<p>Go to <a href="https://github.com">github</a>!!</p><p>And check <img src="/some-image.png" alt="" />!!</p>',
    )
  })

  test('parses links and images as standalone paragraphs', () => {
    expect(starkdown('[github](https://github.com)\n\n![](/some-image.png)')).toEqual(
      '<p><a href="https://github.com">github</a></p><p><img src="/some-image.png" alt="" /></p>',
    )
  })

  test('parses links with attribute lists', () => {
    expect(starkdown('[github](https://github.com){:target="_blank"}')).toEqual(
      '<p><a href="https://github.com" target="_blank">github</a></p>',
    )
    expect(starkdown('[github](https://github.com){:.foo .bar}')).toEqual(
      '<p><a href="https://github.com" class="foo bar">github</a></p>',
    )
    expect(starkdown('[github](https://github.com){:#foo}')).toEqual(
      '<p><a href="https://github.com" id="foo">github</a></p>',
    )
    expect(starkdown('[github](https://github.com){:target="_blank" .foo .bar}')).toEqual(
      '<p><a href="https://github.com" target="_blank" class="foo bar">github</a></p>',
    )
    expect(starkdown('[github](https://github.com){:target="_blank" #foo}')).toEqual(
      '<p><a href="https://github.com" target="_blank" id="foo">github</a></p>',
    )
    expect(starkdown('[github](https://github.com){:target="_blank" .foo .bar #foo}')).toEqual(
      '<p><a href="https://github.com" target="_blank" class="foo bar" id="foo">github</a></p>',
    )
  })
})
