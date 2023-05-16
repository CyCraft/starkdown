import { describe, expect, test } from 'vitest'
import { starkdown } from '../src'

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
