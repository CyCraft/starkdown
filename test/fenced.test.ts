import { expect, describe, test } from 'vitest'
import { starkdown } from '../src'

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
