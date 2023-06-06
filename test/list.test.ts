import { describe, expect, test } from 'vitest'
import { starkdown } from '../src'

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

  test('parses an ordered list using brackets instead of periods ', () => {
    expect(starkdown('1) Ordered\n2) Lists\n4) Numbers are ignored')).toEqual(
      '<ol><li>Ordered</li><li>Lists</li><li>Numbers are ignored</li></ol>'
    )
  })

  test('parses an ordered list and starts at a different number if the first number is different ', () => {
    expect(starkdown('5) Ordered\n2) Lists\n4) Numbers are ignored')).toEqual(
      '<ol start="5"><li>Ordered</li><li>Lists</li><li>Numbers are ignored</li></ol>'
    )
  })

  // Due to the way that we're dealing with newlines and paragraphs, this doesn't work at the moment but
  // keeping this here to make sure that we can just uncomment it in the future
  // test.only('parses an ordered list and adds paragraphs inbetween them if double spaced', () => {
  //   expect(starkdown('1) Ordered\n2) Lists\n\n4) Numbers are ignored')).toEqual(
  //     '<ol><li><p>Ordered<p></li><li><p>Lists<p></li><li><p>Numbers are ignored<p></li></ol>'
  //   )
  // })
})
