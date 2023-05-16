import { expect, describe, test } from 'vitest'
import { starkdown } from '../src'

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
