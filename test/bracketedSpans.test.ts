import { describe, expect, test } from 'vitest'
import { starkdown } from '../src'

describe('bracketedSpans', () => {
  test('html spans', () => {
    expect(starkdown(`I'm <span class="c-red">red</span>`)).toEqual(
      `<p>I'm <span class="c-red">red</span></p>`
    )
  })
  test('class', () => {
    expect(starkdown(`I'm [red]{.c-red}`)).toEqual(`<p>I'm <span class="c-red">red</span></p>`)
  })
  test('class with _', () => {
    expect(starkdown(`I'm [red]{._c_red}`)).toEqual(`<p>I'm <span class="_c_red">red</span></p>`)
  })
  test('classes without spaces', () => {
    expect(starkdown(`I'm [red]{.c-red.text-bold.t-h1}`)).toEqual(
      `<p>I'm <span class="c-red text-bold t-h1">red</span></p>`
    )
  })
  test('classes with spaces', () => {
    expect(starkdown(`I'm [red]{ .c-red .text-bold .t-h1 }`)).toEqual(
      `<p>I'm <span class="c-red text-bold t-h1">red</span></p>`
    )
  })
  test('attrs without :', () => {
    expect(starkdown(`I'm [red]{id="aka".c-red}`)).toEqual(
      `<p>I'm <span id="aka" class="c-red">red</span></p>`
    )
  })
  test('attrs behind class without :', () => {
    expect(starkdown(`I'm [red]{.c-red id="aka"}`)).toEqual(
      `<p>I'm <span class="c-red" id="aka">red</span></p>`
    )
  })
  test('attrs with :', () => {
    expect(starkdown(`I'm [red]{:id="aka".c-red}`)).toEqual(
      `<p>I'm <span id="aka" class="c-red">red</span></p>`
    )
  })
  test('attrs behind class with :', () => {
    expect(starkdown(`I'm [red]{.c-red:id="aka"}`)).toEqual(
      `<p>I'm <span class="c-red" id="aka">red</span></p>`
    )
  })
  test('attrs behind class with space and :', () => {
    expect(starkdown(`I'm [red]{.c-red :id="aka"}`)).toEqual(
      `<p>I'm <span class="c-red" id="aka">red</span></p>`
    )
  })

  test('parses links with attribute lists with :', () => {
    expect(starkdown('[github](https://github.com){:target="_blank"}')).toEqual(
      '<p><a href="https://github.com" target="_blank">github</a></p>'
    )
    expect(starkdown('[github](https://github.com){:.foo .bar}')).toEqual(
      '<p><a href="https://github.com" class="foo bar">github</a></p>'
    )
    expect(starkdown('[github](https://github.com){:#foo}')).toEqual(
      '<p><a href="https://github.com" id="foo">github</a></p>'
    )
    expect(starkdown('[github](https://github.com){:target="_blank" .foo .bar}')).toEqual(
      '<p><a href="https://github.com" target="_blank" class="foo bar">github</a></p>'
    )
    expect(starkdown('[github](https://github.com){:target="_blank" #foo}')).toEqual(
      '<p><a href="https://github.com" target="_blank" id="foo">github</a></p>'
    )
    expect(starkdown('[github](https://github.com){:target="_blank" .foo .bar #foo}')).toEqual(
      '<p><a href="https://github.com" target="_blank" class="foo bar" id="foo">github</a></p>'
    )
  })

  test('parses links with attribute lists without :', () => {
    expect(starkdown('[github](https://github.com){target="_blank"}')).toEqual(
      '<p><a href="https://github.com" target="_blank">github</a></p>'
    )
    expect(starkdown('[github](https://github.com){.foo .bar}')).toEqual(
      '<p><a href="https://github.com" class="foo bar">github</a></p>'
    )
    expect(starkdown('[github](https://github.com){#foo}')).toEqual(
      '<p><a href="https://github.com" id="foo">github</a></p>'
    )
    expect(starkdown('[github](https://github.com){target="_blank" .foo .bar}')).toEqual(
      '<p><a href="https://github.com" target="_blank" class="foo bar">github</a></p>'
    )
    expect(starkdown('[github](https://github.com){target="_blank" #foo}')).toEqual(
      '<p><a href="https://github.com" target="_blank" id="foo">github</a></p>'
    )
    expect(starkdown('[github](https://github.com){target="_blank" .foo .bar #foo}')).toEqual(
      '<p><a href="https://github.com" target="_blank" class="foo bar" id="foo">github</a></p>'
    )
  })
})
