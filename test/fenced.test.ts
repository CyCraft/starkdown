import { describe, expect, test } from 'vitest'
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
  test('fenced div with quadruple new lines', () => {
    expect(starkdown(':::\na\n\nb\n\nc\n\nd\n:::')).toEqual(
      '<div class="fenced"><p>a</p><p>b</p><p>c</p><p>d</p></div>'
    )
  })
  test('fenced div with quadruple new lines and double inner padding', () => {
    expect(starkdown(':::\n\na\n\nb\n\nc\n\nd\n\n:::')).toEqual(
      '<div class="fenced"><p>a</p><p>b</p><p>c</p><p>d</p></div>'
    )
  })
  test('fenced div with quadruple new lines & custom class', () => {
    expect(starkdown(':::info\na\n\nb\n\nc\n\nd\n:::')).toEqual(
      '<div class="fenced info"><p>a</p><p>b</p><p>c</p><p>d</p></div>'
    )
  })
  test('multiple fenced divs', () => {
    expect(starkdown(':::\n**info**\n:::\n:::info\na\n\nb\n\nc\n\nd\n:::')).toEqual(
      '<div class="fenced"><p><strong>info</strong></p></div><div class="fenced info"><p>a</p><p>b</p><p>c</p><p>d</p></div>'
    )
  })
  test('multiple fenced divs complex case', () => {
    expect(starkdown('# hi\n\np\n:::\n**info**\n\n:::\n\n::: info\na\n\nb\n\nc\n\nd\n:::')).toEqual(
      '<h1>hi</h1><p>p</p><div class="fenced"><p><strong>info</strong></p></div><div class="fenced info"><p>a</p><p>b</p><p>c</p><p>d</p></div>'
    )
  })
})
